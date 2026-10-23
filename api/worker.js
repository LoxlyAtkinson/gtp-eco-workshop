import {buildAssessment,extractPage,publicUrl,cleanText} from './analysis.js';
import {samplePublicSocial} from './social.js';

const JSON_HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
function reply(body,status=200,headers={}){return new Response(JSON.stringify(body),{status,headers:{...JSON_HEADERS,...headers}})}
function cors(request,env){const origin=request.headers.get('Origin');return origin&&origin===env.FRONTEND_ORIGIN?{'access-control-allow-origin':origin,'access-control-allow-methods':'GET, POST, DELETE, OPTIONS','access-control-allow-headers':'content-type, authorization','vary':'Origin'}:{}}
function error(message,status=400,headers={}){return reply({error:message},status,headers)}
function now(){return new Date().toISOString()}
function plusDays(n){return new Date(Date.now()+n*86400000).toISOString()}
async function digest(value){const bytes=new TextEncoder().encode(value);const hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function token(){const bytes=crypto.getRandomValues(new Uint8Array(32));return Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('')}
function required(env,keys){return keys.every(k=>Boolean(env[k]))}
function safeInput(body){
  if(typeof body!=='object'||!body)return null;
  const fields=['businessName','website','location','businessType','mainGoal'];
  if(fields.some(k=>typeof body[k]!=='string'||!body[k].trim()))return null;
  const name=cleanText(body.businessName,100),location=cleanText(body.location,100),type=cleanText(body.businessType,180);
  const website=publicUrl(body.website);
  if(!website||!name||!location||!type||!['more-inquiries','more-sales','better-visibility','consistent-content'].includes(body.mainGoal))return null;
  const social=(Array.isArray(body.socialProfiles)?body.socialProfiles:[]).slice(0,3).filter(x=>x&&['instagram','facebook','tiktok'].includes(x.platform)&&publicUrl(x.url)).map(x=>({platform:x.platform,url:publicUrl(x.url).href}));
  return {businessName:name,website:website.href,location,businessType:type,mainGoal:body.mainGoal,socialProfiles:social};
}
async function boundedBody(request){const length=Number(request.headers.get('content-length')||0);if(length>12000)throw new Error('Request is too large.');const text=await request.text();if(text.length>12000)throw new Error('Request is too large.');try{return JSON.parse(text)}catch{throw new Error('Please send valid JSON.')}}

async function rateLimit(request,env,kind,limit){
  const rawIp=request.headers.get('CF-Connecting-IP')||'unknown';
  const key=await digest(`${env.RATE_LIMIT_SALT||'local'}:${rawIp}:${kind}`);
  const bucket=new Date().toISOString().slice(0,13);
  const row=await env.DB.prepare('SELECT count FROM rate_events WHERE key = ? AND bucket = ?').bind(key,bucket).first();
  if(row&&row.count>=limit)return false;
  await env.DB.prepare('INSERT INTO rate_events(key,bucket,count) VALUES(?,?,1) ON CONFLICT(key,bucket) DO UPDATE SET count=count+1').bind(key,bucket).run();
  return true;
}

async function fetchFirecrawl(url,env){
  if(!env.FIRECRAWL_API_KEY)return null;
  const res=await fetch('https://api.firecrawl.dev/v2/scrape',{method:'POST',headers:{authorization:`Bearer ${env.FIRECRAWL_API_KEY}`,'content-type':'application/json'},body:JSON.stringify({url,formats:['rawHtml','markdown'],timeout:20000})});
  if(!res.ok)throw new Error(`Firecrawl returned HTTP ${res.status}.`);
  const result=await res.json();if(!result.success||!result.data)throw new Error('Firecrawl could not read the page.');
  const d=result.data,source=publicUrl(d.metadata?.sourceURL||url);
  if(!source)throw new Error('Firecrawl returned an invalid source URL.');
  const page=extractPage(d.rawHtml||d.html||'',source.href);
  page.title=page.title||cleanText(d.metadata?.title,240);
  page.description=page.description||cleanText(d.metadata?.description,240);
  page.text=page.text||cleanText(d.markdown,30000);
  page.source='firecrawl-v2';
  return page;
}

async function competitorCandidates(input,env){
  if(!env.FIRECRAWL_API_KEY)return [];
  const ownHost=new URL(input.website).hostname;
  const res=await fetch('https://api.firecrawl.dev/v2/search',{method:'POST',headers:{authorization:`Bearer ${env.FIRECRAWL_API_KEY}`,'content-type':'application/json'},body:JSON.stringify({query:`${input.businessType} ${input.location}`,limit:5,sources:[{type:'web'}],excludeDomains:[ownHost],safe:true,timeout:12000})});
  if(!res.ok)return [];
  const data=await res.json();
  return (data.data?.web||[]).filter(x=>publicUrl(x.url)&&new URL(x.url).hostname!==ownHost).slice(0,2).map(x=>({title:cleanText(x.title,100),description:cleanText(x.description,180),url:publicUrl(x.url).href,checkedAt:now(),status:'candidate-needs-owner-confirmation'}));
}

async function scan(request,env,headers){
  if(env.DATA_COLLECTION_ENABLED!=='true')return error('The live scan is not accepting submissions yet.',503,headers);
  if(!required(env,['DB','RATE_LIMIT_SALT','RETENTION_DAYS','FRONTEND_ORIGIN','FIRECRAWL_API_KEY']))return error('The scan service is not fully configured.',503,headers);
  if(!await rateLimit(request,env,'scan',5))return error('Scan limit reached for this hour. Please try later.',429,headers);
  let body;try{body=await boundedBody(request)}catch(e){return error(e.message,400,headers)}
  const input=safeInput(body);if(!input)return error('Check the business name, public website, location, offer and goal.',400,headers);
  let page;
  try{page=await fetchFirecrawl(input.website,env)}catch(e){return error(`The website could not be read: ${e.message}`,422,headers)}
  let competitors=[];try{competitors=await competitorCandidates(input,env)}catch{}
  const social=await samplePublicSocial(input.socialProfiles,env);
  const report=buildAssessment(input,page,{competitors,socialStatus:social.status,socialSamples:social.samples});
  const id=crypto.randomUUID();const days=Math.max(1,Math.min(90,Number(env.RETENTION_DAYS)||30));
  await env.DB.prepare('INSERT INTO scans(id,input_json,report_json,created_at,expires_at) VALUES(?,?,?,?,?)').bind(id,JSON.stringify(input),JSON.stringify(report),now(),plusDays(days)).run();
  return reply({scanId:id,summary:report.summary,findings:report.findings.slice(0,4),unknowns:report.unknowns,checkedAt:report.createdAt},200,headers);
}

async function requestReport(request,env,headers){
  if(env.DATA_COLLECTION_ENABLED!=='true'||!required(env,['DB','RESEND_API_KEY','MAIL_FROM','NOTICE_VERSION','FRONTEND_REPORT_URL','RETENTION_DAYS']))return error('Report delivery is not yet available.',503,headers);
  if(!await rateLimit(request,env,'report',8))return error('Report request limit reached for this hour. Please try later.',429,headers);
  let body;try{body=await boundedBody(request)}catch(e){return error(e.message,400,headers)}
  const name=cleanText(body?.name,100),email=String(body?.email||'').trim().toLowerCase();
  if(!name||!/^\S+@\S+\.\S+$/.test(email)||email.length>254||typeof body?.marketingConsent!=='boolean'||body?.noticeVersion!==env.NOTICE_VERSION||typeof body?.scanId!=='string')return error('Check your name, email and notice version.',400,headers);
  const scanRow=await env.DB.prepare('SELECT report_json,expires_at FROM scans WHERE id=?').bind(body.scanId).first();
  if(!scanRow||scanRow.expires_at<now())return error('This scan has expired. Please run it again.',410,headers);
  const id=crypto.randomUUID(),secret=token(),hash=await digest(secret),days=Math.max(1,Math.min(90,Number(env.RETENTION_DAYS)||30));
  const link=`${env.FRONTEND_REPORT_URL.replace(/#.*$/,'')}#${secret}`;
  await env.DB.prepare('INSERT INTO contacts(id,scan_id,name,email,marketing_consent,notice_version,created_at,expires_at,report_hash,delivery_status) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(id,body.scanId,name,email,body.marketingConsent?1:0,env.NOTICE_VERSION,now(),plusDays(days),hash,'pending').run();
  try{
    const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{authorization:`Bearer ${env.RESEND_API_KEY}`,'content-type':'application/json'},body:JSON.stringify({from:env.MAIL_FROM,to:[email],subject:'Your GTP ECO business report',text:`Hello ${name},\n\nYour ECO report is ready. Open this private link within ${days} days:\n${link}\n\nYou requested this report after scanning your business. This email does not subscribe you to marketing.\n\nIf you did not request it, please ignore this message.`})});
    if(!res.ok)throw new Error(`Email provider returned HTTP ${res.status}.`);
    const result=await res.json();await env.DB.prepare('UPDATE contacts SET delivery_status=?,provider_message_id=? WHERE id=?').bind('sent',String(result.id||''),id).run();
  }catch(e){await env.DB.prepare('DELETE FROM contacts WHERE id=?').bind(id).run();return error('The report email could not be sent. Please try again later.',502,headers)}
  return reply({message:'We sent a private report link to the address you entered. Please check your inbox.'},200,headers);
}

async function contactByToken(secret,env){if(!/^[0-9a-f]{64}$/.test(secret))return null;return env.DB.prepare('SELECT c.id,c.scan_id,c.name,c.email,c.marketing_consent,c.created_at,c.expires_at,c.delivery_status,s.report_json FROM contacts c JOIN scans s ON s.id=c.scan_id WHERE c.report_hash=?').bind(await digest(secret)).first()}
async function getReport(secret,env,headers){const row=await contactByToken(secret,env);if(!row||row.expires_at<now()||row.delivery_status!=='sent')return error('The private report link is invalid or expired.',404,headers);return reply({report:JSON.parse(row.report_json),contact:{name:row.name,marketingConsent:Boolean(row.marketing_consent)},expiresAt:row.expires_at},200,headers)}
async function optOut(request,env,headers){let body;try{body=await boundedBody(request)}catch(e){return error(e.message,400,headers)}const row=await contactByToken(String(body?.token||''),env);if(!row)return error('The link is invalid or expired.',404,headers);await env.DB.prepare('UPDATE contacts SET marketing_consent=0 WHERE id=?').bind(row.id).run();return reply({message:'Marketing preference turned off.'},200,headers)}
async function deleteReport(secret,env,headers){const row=await contactByToken(secret,env);if(!row)return error('The link is invalid or expired.',404,headers);await env.DB.batch([env.DB.prepare('DELETE FROM contacts WHERE id=?').bind(row.id),env.DB.prepare('DELETE FROM scans WHERE id=?').bind(row.scan_id)]);return reply({message:'Your report and contact record were deleted.'},200,headers)}
async function admin(request,env,headers){if(!env.ADMIN_TOKEN)return error('Admin access is not configured.',503,headers);const bearer=request.headers.get('authorization')||'';const actual=bearer.startsWith('Bearer ')?bearer.slice(7):'';if(!actual||await digest(actual)!==await digest(env.ADMIN_TOKEN))return error('Unauthorized.',401,headers);const rows=await env.DB.prepare('SELECT id,scan_id,name,email,marketing_consent,notice_version,created_at,expires_at,delivery_status FROM contacts ORDER BY created_at DESC LIMIT 200').all();return reply({contacts:(rows.results||[]).map(r=>({...r,marketingConsent:Boolean(r.marketing_consent)}))},200,headers)}

export default {
  async fetch(request,env){
    const headers=cors(request,env),path=new URL(request.url).pathname;
    if(request.headers.get('Origin')&&request.headers.get('Origin')!==env.FRONTEND_ORIGIN)return error('Origin not allowed.',403,headers);
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
    if(path==='/health'&&request.method==='GET')return reply({status:'ok',version:'0.1'},200,headers);
    try{
      if(path==='/v1/scans'&&request.method==='POST')return await scan(request,env,headers);
      if(path==='/v1/reports/request'&&request.method==='POST')return await requestReport(request,env,headers);
      if(path==='/v1/reports/opt-out'&&request.method==='POST')return await optOut(request,env,headers);
      if(path==='/v1/admin/contacts'&&request.method==='GET')return await admin(request,env,headers);
      const reportMatch=path.match(/^\/v1\/reports\/([0-9a-f]{64})$/);
      if(reportMatch&&request.method==='GET')return await getReport(reportMatch[1],env,headers);
      if(reportMatch&&request.method==='DELETE')return await deleteReport(reportMatch[1],env,headers);
      return error('Route not found.',404,headers);
    }catch(e){console.error('Request failed',e?.name||'Error');return error('The service could not complete this request. Please try again.',500,headers)}
  },
  async scheduled(_event,env){const stamp=now();await env.DB.batch([env.DB.prepare('DELETE FROM contacts WHERE expires_at < ?').bind(stamp),env.DB.prepare('DELETE FROM scans WHERE expires_at < ?').bind(stamp),env.DB.prepare('DELETE FROM rate_events WHERE bucket < ?').bind(new Date(Date.now()-2*86400000).toISOString().slice(0,13))])}
};
