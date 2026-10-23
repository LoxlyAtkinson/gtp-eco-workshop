import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.js';

function database(){
  const scans=new Map(),contacts=new Map(),rates=new Map();
  const db={scans,contacts,prepare(sql){let args=[];const q={bind(...values){args=values;return q},async first(){if(sql.startsWith('SELECT count'))return rates.get(args[0]+args[1])||null;if(sql.startsWith('SELECT report_json'))return scans.get(args[0])||null;if(sql.startsWith('SELECT c.id')){for(const c of contacts.values())if(c.report_hash===args[0])return {...c,report_json:scans.get(c.scan_id)?.report_json};return null}throw Error('Unexpected first: '+sql)},async run(){if(sql.startsWith('INSERT INTO rate_events')){const key=args[0]+args[1],old=rates.get(key);rates.set(key,{count:(old?.count||0)+1});return}if(sql.startsWith('INSERT INTO scans')){scans.set(args[0],{id:args[0],input_json:args[1],report_json:args[2],created_at:args[3],expires_at:args[4]});return}if(sql.startsWith('INSERT INTO contacts')){contacts.set(args[0],{id:args[0],scan_id:args[1],name:args[2],email:args[3],marketing_consent:args[4],notice_version:args[5],created_at:args[6],expires_at:args[7],report_hash:args[8],delivery_status:args[9]});return}if(sql.startsWith('UPDATE contacts SET delivery_status')){const c=contacts.get(args[2]);c.delivery_status=args[0];c.provider_message_id=args[1];return}if(sql.startsWith('UPDATE contacts SET marketing_consent')){contacts.get(args[0]).marketing_consent=0;return}if(sql.startsWith('DELETE FROM contacts')){contacts.delete(args[0]);return}if(sql.startsWith('DELETE FROM scans')){scans.delete(args[0]);return}throw Error('Unexpected run: '+sql)},async all(){if(sql.startsWith('SELECT id,scan_id'))return {results:[...contacts.values()]};throw Error('Unexpected all: '+sql)}};return q},async batch(statements){for(const statement of statements)await statement.run()}};return db;
}
const base='https://api.example',origin='https://loxlyatkinson.github.io';
function req(path,method='GET',body,headers={}){return new Request(base+path,{method,headers:{origin,...(body?{'content-type':'application/json'}:{}),...headers},body:body?JSON.stringify(body):undefined})}

test('disabled release switch refuses public submissions',async()=>{const response=await worker.fetch(req('/v1/scans','POST',{website:'https://example.com'}),{DATA_COLLECTION_ENABLED:'false',FRONTEND_ORIGIN:origin});assert.equal(response.status,503)});
test('exact CORS origin rejects a different public site',async()=>{const response=await worker.fetch(req('/health','GET',undefined,{origin:'https://unrelated.example'}),{FRONTEND_ORIGIN:origin});assert.equal(response.status,403)});

test('scan, requested email, private report and admin choice remain distinct',async()=>{
  const oldFetch=globalThis.fetch;const db=database();let sent=null;
  globalThis.fetch=async(url,options)=>{if(String(url)==='https://api.firecrawl.dev/v2/scrape')return Response.json({success:true,data:{rawHtml:'<html><head><title>Example Meeting Lunches</title><meta name="description" content="Johannesburg team lunches"></head><body><h1>Meeting lunches</h1><a href="mailto:hello@example.com">Ask for a quote</a></body></html>',metadata:{sourceURL:'https://example.com/'}}});if(String(url)==='https://api.firecrawl.dev/v2/search')return Response.json({success:true,data:{web:[]}});if(String(url)==='https://api.resend.com/emails'){sent=JSON.parse(options.body);return Response.json({id:'email-1'})}throw Error('Unexpected network URL '+url)};
  const env={DB:db,FRONTEND_ORIGIN:origin,FRONTEND_REPORT_URL:'https://loxlyatkinson.github.io/gtp-eco-workshop/tool/report/',DATA_COLLECTION_ENABLED:'true',RATE_LIMIT_SALT:'unit-test',RETENTION_DAYS:'30',FIRECRAWL_API_KEY:'test',RESEND_API_KEY:'test',MAIL_FROM:'GTP <reports@example.com>',NOTICE_VERSION:'v1',ADMIN_TOKEN:'private-admin-token'};
  try{
    const scan=await worker.fetch(req('/v1/scans','POST',{businessName:'Example Lunches',website:'https://example.com/',location:'Johannesburg',businessType:'meeting lunches',mainGoal:'more-inquiries',socialProfiles:[]}),env);assert.equal(scan.status,200);const preview=await scan.json();assert.ok(preview.scanId);assert.ok(preview.findings.some(f=>f.sourceUrl==='https://example.com/'));
    const denied=await worker.fetch(req('/v1/admin/contacts','GET'),env);assert.equal(denied.status,401);
    const delivery=await worker.fetch(req('/v1/reports/request','POST',{scanId:preview.scanId,name:'Test Owner',email:'owner@example.com',marketingConsent:false,noticeVersion:'v1'}),env);assert.equal(delivery.status,200);assert.equal(db.contacts.size,1);assert.equal([...db.contacts.values()][0].marketing_consent,0);assert.equal(sent.to[0],'owner@example.com');
    const token=sent.text.match(/#([0-9a-f]{64})/)?.[1];assert.ok(token);
    const report=await worker.fetch(req('/v1/reports/'+token),env);assert.equal(report.status,200);assert.equal((await report.json()).report.business.name,'Example Lunches');
    const admin=await worker.fetch(req('/v1/admin/contacts','GET',undefined,{authorization:'Bearer private-admin-token'}),env);assert.equal(admin.status,200);assert.equal((await admin.json()).contacts[0].marketingConsent,false);
    const deletion=await worker.fetch(req('/v1/reports/'+token,'DELETE'),env);assert.equal(deletion.status,200);assert.equal(db.contacts.size,0);assert.equal(db.scans.size,0);
  }finally{globalThis.fetch=oldFetch}
});
