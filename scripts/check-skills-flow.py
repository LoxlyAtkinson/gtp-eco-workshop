"""Browser proof for the skills download flow: skills/get/, skills/guide/, the pack zip and the scene 15 QR.

Run: python scripts/check-skills-flow.py   (deck served at GTP_BASE_URL, default http://127.0.0.1:8765/)
Writes screenshots and results.json to experience/evidence/stage-live/skills/ (git-ignored).
Configured-mode checks use TEST FIXTURES: config.js and the Edge Function reply are intercepted in the browser.
No real Supabase or Resend call is made.
"""
import asyncio, hashlib, json, os, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path

import cv2
import numpy as np
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get('GTP_BASE_URL', 'http://127.0.0.1:8765/')
OUT = ROOT / 'experience' / 'evidence' / 'stage-live' / 'skills'
OUT.mkdir(parents=True, exist_ok=True)
CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
QR_URL = 'https://loxlyatkinson.github.io/gtp-eco-workshop/skills/get/'
ZIP_SHA = next(l.split()[0] for l in (ROOT / 'skills/downloads/SHA256SUMS.txt').read_text().splitlines() if l.endswith('anthropic-marketing-skills.zip'))
ZIP_BYTES = (ROOT / 'skills/downloads/anthropic-marketing-skills.zip').stat().st_size
FIXTURE_API = 'https://fixture.invalid/functions/v1/skills-request'  # test fixture, never a real endpoint

results = []
def record(item, ok, actual, shot=None, viewport=None):
    results.append({'item': item, 'result': 'PASS' if ok else 'FAIL', 'actual': actual, 'screenshot': shot, 'viewport': viewport,
                    'timestamp': datetime.now(timezone.utc).isoformat()})
    print(('PASS ' if ok else 'FAIL ') + item + ' :: ' + json.dumps(actual, ensure_ascii=True)[:300])

def decode(png_bytes, scale=3):
    img = cv2.imdecode(np.frombuffer(png_bytes, np.uint8), cv2.IMREAD_COLOR)
    det = cv2.QRCodeDetector()
    for s in (1, scale):
        im = img if s == 1 else cv2.resize(img, None, fx=s, fy=s, interpolation=cv2.INTER_NEAREST)
        text, _, _ = det.detectAndDecode(im)
        if text:
            return text
    return ''

async def overflow(page):
    return await page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')

async def form_unconfigured(browser):
    vp = {'width': 390, 'height': 844}
    ctx = await browser.new_context(viewport=vp, accept_downloads=True, has_touch=True, is_mobile=True, device_scale_factor=2)
    page = await ctx.new_page()
    errors, posts = [], []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
    page.on('request', lambda r: r.method == 'POST' and posts.append(r.url))
    await page.goto(BASE + 'skills/get/', wait_until='networkidle')
    await page.evaluate('document.fonts.ready')
    shot = 'get-phone-1-initial.png'
    await page.screenshot(path=str(OUT / shot))
    texts = await page.evaluate("""()=>({h1:document.querySelector('h1').innerText,labels:[...document.querySelectorAll('#get-form label')].map(l=>l.innerText.trim()).filter(Boolean),button:document.getElementById('submit').innerText,mode:document.getElementById('mode').innerText,delivery:document.documentElement.dataset.delivery,metrics:{width:innerWidth,height:innerHeight}})""")
    record('A1 form fields and consent text visible', texts['h1'].replace('\n', ' ') == 'Get the eight marketing skills.' and 'Email me the skills pack link. Nothing else.' in texts['labels'] and texts['button'] == 'Get the skills pack' and texts['metrics'] == vp, texts, shot, vp)
    record('A2 direct mode note with skip link', texts['delivery'] == 'direct' and 'Email delivery opens soon' in texts['mode'] and 'Skip the form and download now' in texts['mode'], texts['mode'], shot, vp)
    await page.click('#submit')
    errs = await page.evaluate("""()=>({first:document.getElementById('firstName-err').innerText,email:document.getElementById('email-err').innerText,consent:document.getElementById('consent-err').innerText,focus:document.activeElement.id,inv:document.getElementById('firstName').getAttribute('aria-invalid')})""")
    shot = 'get-phone-2-errors.png'
    await page.screenshot(path=str(OUT / shot))
    record('A3 empty submit shows three inline errors, focus on first name', all(errs[k] for k in ('first', 'email', 'consent')) and errs['focus'] == 'firstName' and errs['inv'] == 'true', errs, shot, vp)
    # A8 keyboard only, from a fresh load
    await page.reload(wait_until='networkidle')
    order = []
    for _ in range(6):
        await page.keyboard.press('Tab')
        order.append(await page.evaluate("document.activeElement.id || document.activeElement.className || document.activeElement.tagName"))
    await page.focus('#firstName')
    await page.keyboard.type('Thandi')
    await page.keyboard.press('Tab')
    await page.keyboard.type('  Thandi@Example.co.za ')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Space')
    await page.keyboard.press('Tab')
    on_button = await page.evaluate('document.activeElement.id')
    await page.keyboard.press('Enter')
    await page.wait_for_selector('#result:not([hidden])')
    record('A8 keyboard: tab order and Enter submit', order[2:6] == ['firstName', 'email', 'consent', 'submit'] and on_button == 'submit', {'tabOrder': order, 'enterFrom': on_button}, None, vp)
    res = await page.evaluate("""()=>({state:document.getElementById('result').dataset.state,title:document.getElementById('result-title').innerText,text:document.getElementById('result-text').innerText,links:[...document.querySelectorAll('#result a')].map(a=>[a.innerText,a.getAttribute('href')]),body:document.body.innerText,focus:document.activeElement.id,formHidden:getComputedStyle(document.getElementById('get-form')).display==='none'})""")
    shot = 'get-phone-3-ready.png'
    await page.screenshot(path=str(OUT / shot))
    record('A4 submit shows the download and the guide, claims no email', res['formHidden'] and res['state'] == 'ready' and res['title'] == 'Your skills pack is ready.' and ['Download the pack', '../downloads/anthropic-marketing-skills.zip'] in res['links'] and ['Read the 7-day guide', '../guide/'] in res['links'] and "didn't send an email" in res['text'] and 'Check your inbox' not in res['body'] and res['focus'] == 'result', {k: res[k] for k in ('state', 'title', 'text', 'links', 'focus')}, shot, vp)
    record('A5 no POST leaves the page', posts == [], posts, shot, vp)
    ov = await overflow(page)
    record('A6 no horizontal overflow, no console errors', ov <= 0 and not errors, {'overflowPx': ov, 'errors': errors}, shot, vp)
    async with page.expect_download() as dl_info:
        await page.click('#download')
    dl = await dl_info.value
    target = OUT / 'downloaded-anthropic-marketing-skills.zip'
    await dl.save_as(str(target))
    data = target.read_bytes()
    sha = hashlib.sha256(data).hexdigest()
    record('A7 download is the right zip', dl.suggested_filename == 'anthropic-marketing-skills.zip' and len(data) == ZIP_BYTES == 125080 and sha == ZIP_SHA, {'filename': dl.suggested_filename, 'bytes': len(data), 'sha256': sha}, shot, vp)
    target.unlink()
    await ctx.close()

async def form_configured(browser):
    vp = {'width': 390, 'height': 844}
    ctx = await browser.new_context(viewport=vp, has_touch=True, is_mobile=True, device_scale_factor=2)
    scenario = {'mode': 'ok'}
    bodies = []
    async def config_route(route):  # TEST FIXTURE: pretend the owner set apiUrl
        await route.fulfill(status=200, content_type='application/javascript', body=f"window.GTP_SKILLS_CONFIG = {{ apiUrl: '{FIXTURE_API}' }};")
    async def api_route(route):  # TEST FIXTURE: stands in for the Edge Function
        req = route.request
        cors = {'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'POST, OPTIONS'}
        if req.method == 'OPTIONS':
            return await route.fulfill(status=204, headers=cors)
        bodies.append(json.loads(req.post_data or '{}'))
        m = scenario['mode']
        if m == 'abort':
            return await route.abort('failed')
        reply = {'ok': {'status': 200, 'body': {'ok': True, 'sent': True}},
                 '502': {'status': 502, 'body': {'ok': False, 'code': 'SEND_FAILED', 'error': 'We could not send the email. Download the pack on this page instead.'}},
                 '400': {'status': 400, 'body': {'ok': False, 'code': 'INVALID', 'field': 'email', 'error': 'That email address does not look right.'}}}[m]
        await route.fulfill(status=reply['status'], headers=cors, content_type='application/json', body=json.dumps(reply['body']))
    await ctx.route('**/skills/get/config.js', config_route)
    await ctx.route('https://fixture.invalid/**', api_route)
    page = await ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))

    async def fill_and_send():
        await page.goto(BASE + 'skills/get/', wait_until='networkidle')
        await page.fill('#firstName', 'Thandi')
        await page.fill('#email', '  Thandi@Example.co.za ')
        await page.check('#consent')
        await page.click('#submit')

    await fill_and_send()
    await page.wait_for_selector('#result:not([hidden])')
    r = await page.evaluate("()=>({delivery:document.documentElement.dataset.delivery,state:result.dataset.state,title:document.getElementById('result-title').innerText,text:document.getElementById('result-text').innerText})")
    shot = 'get-phone-4-configured-sent.png'
    await page.screenshot(path=str(OUT / shot))
    record('B1 configured 200 shows Check your inbox with the address', r['delivery'] == 'email' and r['state'] == 'sent' and r['title'] == 'Check your inbox.' and 'thandi@example.co.za' in r['text'], r, shot, vp)
    record('B2 request body shape', bodies[-1] == {'firstName': 'Thandi', 'email': 'thandi@example.co.za', 'consent': True, 'company': ''}, bodies[-1], shot, vp)

    scenario['mode'] = '502'
    await fill_and_send()
    await page.wait_for_selector('#result:not([hidden])')
    r = await page.evaluate("()=>({state:result.dataset.state,title:document.getElementById('result-title').innerText,text:document.getElementById('result-text').innerText,again:!document.getElementById('again-row').hidden,download:document.getElementById('download').getAttribute('href')})")
    shot = 'get-phone-5-configured-failed.png'
    await page.screenshot(path=str(OUT / shot))
    await page.click('#again')
    kept = await page.evaluate("()=>({formShown:!document.getElementById('get-form').hidden,name:firstName.value,email:email.value,focus:document.activeElement.id})")
    record('B3 502 shows honest failure, download fallback, retry keeps values', r['state'] == 'failed' and r['title'] == "We couldn't send the email." and 'problem on our side' in r['text'] and r['again'] and r['download'].endswith('anthropic-marketing-skills.zip') and kept['formShown'] and kept['name'] == 'Thandi', {'result': r, 'afterRetry': kept}, shot, vp)

    scenario['mode'] = 'abort'
    await fill_and_send()
    await page.wait_for_selector('#result:not([hidden])')
    t = await page.evaluate("document.getElementById('result-text').innerText")
    shot = 'get-phone-6-configured-offline.png'
    await page.screenshot(path=str(OUT / shot))
    record('B4 network failure shows connection message', 'connection dropped' in t, t, shot, vp)

    scenario['mode'] = '400'
    await fill_and_send()
    await page.wait_for_function("document.getElementById('email-err').innerText.length > 0")
    r = await page.evaluate("()=>({err:document.getElementById('email-err').innerText,formShown:!document.getElementById('get-form').hidden,resultHidden:document.getElementById('result').hidden,button:submit.innerText,disabled:submit.disabled})")
    shot = 'get-phone-7-configured-field-error.png'
    await page.screenshot(path=str(OUT / shot))
    record('B5 400 field error lands under Email and form stays', r['err'] == 'That email address does not look right.' and r['formShown'] and r['resultHidden'] and r['button'] == 'Get the skills pack' and not r['disabled'], r, shot, vp)
    record('B6 no page errors in configured runs', not errors, errors, None, vp)
    await ctx.close()

def zip_http():
    with urllib.request.urlopen(BASE + 'skills/downloads/anthropic-marketing-skills.zip', timeout=20) as res:
        data = res.read()
        status, length, ctype = res.status, res.headers.get('content-length'), res.headers.get('content-type')
    sha = hashlib.sha256(data).hexdigest()
    record('C zip over HTTP: 200, 125080 bytes, sha256 matches', status == 200 and int(length) == len(data) == 125080 and sha == ZIP_SHA, {'status': status, 'contentLength': length, 'contentType': ctype, 'sha256': sha})

async def guide(browser):
    for vp, label in (({'width': 390, 'height': 844}, 'phone'), ({'width': 1366, 'height': 768}, 'projector')):
        ctx = await browser.new_context(viewport=vp, permissions=['clipboard-read', 'clipboard-write'])
        page = await ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
        await page.goto(BASE + 'skills/guide/', wait_until='networkidle')
        await page.evaluate('document.fonts.ready')
        await page.evaluate("localStorage.removeItem('gtp-skills-week')")
        await page.reload(wait_until='networkidle')
        info = await page.evaluate("""()=>({h1:document.querySelector('h1').innerText.replace(/\\s+/g,' '),h2:[...document.querySelectorAll('h2,h3')].map(h=>h.innerText.replace(/\\s+/g,' ')),days:document.querySelectorAll('#days .day').length,prompts:document.querySelectorAll('.prompt').length,pre:document.querySelector('pre').innerText,metrics:{width:innerWidth,height:innerHeight}})""")
        top = f'guide-{label}-top.png'
        full = f'guide-{label}-full.png'
        await page.screenshot(path=str(OUT / top))
        await page.screenshot(path=str(OUT / full), full_page=True)
        need = ['Where skills work', 'If Claude.ai refuses the upload']
        ok = (info['h1'] == 'Your first week with the marketing skills.' and all(n in info['h2'] for n in need)
              and any(h.startswith('Install on Claude.ai') for h in info['h2']) and any(h.startswith('Install in Claude Code') for h in info['h2'])
              and 'claude plugin marketplace add anthropics/knowledge-work-plugins' in info['pre'] and 'claude plugin install marketing@knowledge-work-plugins' in info['pre']
              and info['days'] == 7 and info['prompts'] == 8 and info['metrics'] == vp)
        record(f'D1 guide sections render ({label})', ok, info, full, vp)
        ov = await overflow(page)
        record(f'D2 guide no overflow, no console errors ({label})', ov <= 0 and not errors, {'overflowPx': ov, 'errors': errors}, top, vp)
        if label == 'phone':
            await page.click('#days .day >> nth=0')
            await page.reload(wait_until='networkidle')
            kept = await page.evaluate("()=>({day1:document.querySelector('#days input[data-day=\"1\"]').checked,progress:document.getElementById('progress').innerText})")
            await page.locator('#days').scroll_into_view_if_needed()
            shot = 'guide-phone-day1-ticked.png'
            await page.screenshot(path=str(OUT / shot))
            btn = page.locator('.prompt button >> nth=1')
            await btn.click()
            label_after = await btn.inner_text()
            clip = await page.evaluate('navigator.clipboard.readText()')
            record('D3 day tick survives reload; copy prompt works', kept['day1'] and kept['progress'] == '1 of 7 days done.' and label_after == 'Copied' and clip.startswith('Use the campaign-plan skill'), {'afterReload': kept, 'button': label_after, 'clipboard': clip[:60]}, shot, vp)
        await ctx.close()

async def qr(browser):
    ctx = await browser.new_context(viewport={'width': 600, 'height': 600})
    page = await ctx.new_page()
    await page.set_content(f'<body style="margin:0;background:#fff"><img src="{BASE}skills/get-qr.svg" style="width:330px;margin:40px"></body>')
    await page.wait_for_function("document.images[0].complete && document.images[0].naturalWidth > 0")
    shot = 'qr-svg-rendered.png'
    png = await page.screenshot(path=str(OUT / shot))
    text = decode(png)
    record('E1 skills/get-qr.svg decodes to the form URL', text == QR_URL, text, shot, {'width': 600, 'height': 600})
    await ctx.close()
    for vp, label in (({'width': 1366, 'height': 768}, 'projector'), ({'width': 1920, 'height': 1080}, 'desktop'), ({'width': 390, 'height': 844}, 'phone')):
        # Phones render at device pixel ratio 3 (a 390x844 iPhone); screens at 1.
        ctx = await browser.new_context(viewport=vp, device_scale_factor=3 if label == 'phone' else 1)
        page = await ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        await page.goto(BASE + '#15-06', wait_until='networkidle')
        await page.wait_for_timeout(1200)
        if await page.locator('#motionButton').is_visible():
            await page.click('#motionButton')  # pause auto-scroll on beat 15-1
        await page.wait_for_timeout(1500)
        shot = f'deck-s15-qr-{label}.png'
        png = await page.screenshot(path=str(OUT / shot))
        whole = decode(png)
        crop = decode(await page.locator('.c15-getqr img').screenshot(), scale=4)
        geo = await page.evaluate("""()=>{const q=document.querySelector('.c15-getqr').getBoundingClientRect();const head=document.querySelector('.site-bar').getBoundingClientRect().bottom;const foot=document.querySelector('.deck-controls').getBoundingClientRect().top;const overlaps=[...document.querySelectorAll('.c15-skills li')].filter(li=>{const r=li.getBoundingClientRect();return !(r.right<=q.left||r.left>=q.right||r.bottom<=q.top||r.top>=q.bottom)}).length;const beat=document.querySelector('.c15-getqr').closest('.c15-beat');const st=document.querySelector('.c15-s15 .scene__stage');const sr=st.getBoundingClientRect();const pb=getComputedStyle(st,'::before');const lineTop=sr.bottom-parseFloat(pb.bottom)-parseFloat(pb.height);const lineLeft=sr.left+parseFloat(pb.left);const lineHit=pb.content!=='none'&&!(q.bottom<=lineTop||q.right<=lineLeft||q.left>=lineLeft+parseFloat(pb.width));return {lineHit,lineTop:Math.round(lineTop),hash:location.hash,qr:[q.left,q.top,q.right,q.bottom].map(Math.round),stage:[Math.round(head),Math.round(foot)],overlaps,beatVisible:getComputedStyle(beat).visibility,img:Math.round(document.querySelector('.c15-getqr img').getBoundingClientRect().width),text:document.querySelector('.c15-getqr').innerText.replace(/\\s+/g,' ')}}""")
        record(f'E2 deck QR decodes ({label})', crop == QR_URL, {'elementCrop': crop, 'fullScreenshot': whole, 'imgPx': geo['img']}, shot, vp)
        inside = geo['qr'][1] >= geo['stage'][0] and geo['qr'][3] <= geo['stage'][1] and geo['qr'][0] >= 0 and geo['qr'][2] <= vp['width']
        record(f'E3 QR card inside the stage, no overlap ({label})', inside and not geo['lineHit'] and geo['overlaps'] == 0 and geo['beatVisible'] == 'visible' and not errors, {**geo, 'errors': errors}, shot, vp)
        await ctx.close()

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROME, headless=True)
        await form_unconfigured(browser)
        await form_configured(browser)
        zip_http()
        await guide(browser)
        await qr(browser)
        await browser.close()
    rev = os.popen(f'git -C "{ROOT}" rev-parse --short HEAD').read().strip()
    hashes = {f: hashlib.sha256((ROOT / f).read_bytes()).hexdigest() for f in ['skills/get/index.html', 'skills/get/get.js', 'skills/get/config.js', 'skills/guide/index.html', 'skills/guide/guide.js', 'skills/kit.css', 'skills/get-qr.svg', 'index.html', 'chapters/ch-1115.css']}
    (OUT / 'results.json').write_text(json.dumps({'base': BASE, 'head': rev, 'sourceSha256': hashes, 'results': results}, indent=2))
    failed = [r['item'] for r in results if r['result'] != 'PASS']
    print(f"\n{len(results) - len(failed)}/{len(results)} PASS" + (f"; FAIL: {failed}" if failed else ''))
    sys.exit(1 if failed else 0)

asyncio.run(main())
