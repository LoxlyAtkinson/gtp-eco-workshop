import {publicUrl,cleanText} from './analysis.js';

const ACTORS={instagram:'apify~instagram-scraper',facebook:'apify~facebook-posts-scraper',tiktok:'clockworks~tiktok-scraper'};
function profileInput(profile){const u=publicUrl(profile.url);if(!u)return null;const host=u.hostname.replace(/^www\./,'');if(profile.platform==='instagram'&&host==='instagram.com')return {directUrls:[u.href],resultsType:'posts',resultsLimit:3};if(profile.platform==='facebook'&&['facebook.com','web.facebook.com'].includes(host))return {startUrls:[{url:u.href}],resultsLimit:3};if(profile.platform==='tiktok'&&host==='tiktok.com'){const username=u.pathname.split('/').find(x=>x.startsWith('@'));return username?{profiles:[username.slice(1)],resultsPerPage:3,shouldDownloadVideos:false}:null}return null}

export async function samplePublicSocial(profiles,env){
  if(env.APIFY_ENABLED!=='true'||!env.APIFY_API_TOKEN)return {samples:[],status:'Apify public-post sampling is not enabled.'};
  const charge=Number(env.APIFY_MAX_CHARGE_USD);
  if(!Number.isFinite(charge)||charge<=0||charge>1)return {samples:[],status:'Apify cost ceiling is not configured.'};
  const selected=(profiles||[]).find(p=>profileInput(p));
  if(!selected)return {samples:[],status:'No supported public social profile URL was supplied.'};
  const input=profileInput(selected),actor=ACTORS[selected.platform];
  const endpoint=`https://api.apify.com/v2/actors/${actor}/run-sync-get-dataset-items?timeout=10&maxItems=3&maxTotalChargeUsd=${charge}&limit=3`;
  try{
    const res=await fetch(endpoint,{method:'POST',headers:{authorization:`Bearer ${env.APIFY_API_TOKEN}`,'content-type':'application/json'},body:JSON.stringify(input),signal:AbortSignal.timeout(13000)});
    if(!res.ok)return {samples:[],status:`Apify ${selected.platform} sample returned HTTP ${res.status}; no social-performance claim was made.`};
    const rows=await res.json();
    if(!Array.isArray(rows))return {samples:[],status:'Apify returned no usable post list.'};
    const samples=rows.slice(0,3).map(row=>({platform:selected.platform,url:publicUrl(row.url||row.postUrl||row.webVideoUrl||'')?.href||selected.url,caption:cleanText(row.caption||row.text||row.description||'',170),publishedAt:row.timestamp||row.time||row.createTimeISO||null,likes:Number.isFinite(Number(row.likesCount??row.likes))?Number(row.likesCount??row.likes):null}));
    return {samples,status:samples.length?`A sample of ${samples.length} public ${selected.platform} posts was retrieved. This is not evidence of sales or overall channel performance.`:'No public posts were returned by Apify.'};
  }catch{return {samples:[],status:'The public social sample was unavailable or timed out; no performance conclusion was made.'}}
}
