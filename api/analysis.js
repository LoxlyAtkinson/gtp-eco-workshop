export function cleanText(value,max=240){return String(value||'').replace(/<[^>]*>/g,' ').replace(/&(?:amp|nbsp|quot|#39|lt|gt);/gi,' ').replace(/\s+/g,' ').trim().slice(0,max)}

export function publicUrl(value){
  let u;try{u=new URL(value)}catch{return null}
  if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.port&&!['80','443'].includes(u.port))return null;
  const host=u.hostname.toLowerCase().replace(/\.$/,'');
  if(!host.includes('.')||host.endsWith('.local')||host.endsWith('.internal')||host.endsWith('.localhost')||host==='localhost'||host==='0.0.0.0'||host.startsWith('127.')||host.startsWith('10.')||host.startsWith('192.168.')||host.startsWith('169.254.')||host.startsWith('172.')||host.startsWith('100.64.')||host==='metadata.google.internal'||host==='169.254.169.254'||host.includes(':'))return null;
  if(/^\d+(?:\.\d+){3}$/.test(host))return null;
  return u;
}

function match(html,pattern){return cleanText((html.match(pattern)||[])[1]||'')}
function meta(html,name){const tags=html.match(/<meta\b[^>]*>/gi)||[];const tag=tags.find(t=>new RegExp(`(?:name|property)=["']${name}["']`,'i').test(t));return tag?match(tag,/content=["']([^"']*)["']/i):''}
export function extractPage(html,url){
  const limited=String(html||'').slice(0,350000);
  const title=match(limited,/<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1=match(limited,/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const description=meta(limited,'description');
  const text=cleanText(limited.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' '),30000);
  const hrefs=[...limited.matchAll(/href\s*=\s*["']([^"']+)["']/gi)].map(x=>x[1]).slice(0,100);
  const contact=hrefs.some(x=>/^(mailto:|tel:|https?:\/\/(?:api\.whatsapp\.com|wa\.me)\/)/i.test(x)||/(contact|quote|book|enquir|inquir)/i.test(x));
  const structured=/<script\b[^>]*type=["']application\/ld\+json["']/i.test(limited);
  const internalLinks=hrefs.filter(x=>{try{return new URL(x,url).hostname===new URL(url).hostname}catch{return false}}).length;
  return {url,title,h1,description,text,contact,structured,internalLinks,checkedAt:new Date().toISOString(),source:'public-html'};
}

export function buildAssessment(input,page,extra={}){
  const checkedAt=page.checkedAt||new Date().toISOString();
  const facts=[];
  const finding=(area,title,observation,nextStep,confidence='high',sourceUrl=page.url)=>facts.push({area,title,observation,nextStep,confidence,sourceUrl,checkedAt});
  if(page.title)finding('Engage','The page has a search title',`The homepage title reads “${cleanText(page.title,110)}”.`,'Check whether it names the offer and the customer’s location or need.');
  else finding('Engage','The homepage needs a clear title','No readable HTML title was found in the fetched page.','Add a concise title that describes the offer and location.','medium');
  if(page.description)finding('Engage','The page has a search description',`The homepage description says “${cleanText(page.description,140)}”.`,'Check whether it answers a real customer question and promises only what you deliver.');
  else finding('Engage','Search description was not visible','No description meta tag was found in the fetched HTML.','Write a useful page description, then verify the live result.','medium');
  if(page.h1)finding('Engage','The main heading is visible',`The first HTML H1 reads “${cleanText(page.h1,110)}”.`,'Make the offer and audience clear above the fold.');
  else finding('Engage','Main heading was not found','No HTML H1 was found in the fetched page.','Check rendered headings and give the main offer one clear H1.','medium');
  if(page.contact)finding('Convert','A contact route is visible','The homepage HTML contains a contact, quote, booking, email, phone or WhatsApp link.','Test the route on a phone and measure the time to a helpful reply.');
  else finding('Convert','A contact route was not found','No obvious contact or quote link was found in the fetched HTML. JavaScript-rendered controls may not be visible to this check.','Add or clarify one next action, then test it in a browser.','medium');
  if(page.structured)finding('Engage','Structured data is present','A JSON-LD script was found in the fetched page.','Validate that its business details match the visible page.');
  if(input.location&&page.text&&!page.text.toLowerCase().includes(input.location.toLowerCase()))finding('Engage','Location is not visible in fetched copy',`“${cleanText(input.location,70)}” was not found in the extracted homepage text. This does not prove it is absent from all pages.`, 'If location matters to buyers, add a truthful service-area statement and relevant local page.','medium');
  if(extra.socialStatus)finding('Engage','Social source availability',extra.socialStatus,'Review any supplied public profile manually before prioritizing a platform.','low',extra.socialSource||page.url);
  for(const sample of (extra.socialSamples||[]).slice(0,3)){if(sample.caption)finding('Engage',`Public ${sample.platform} post sample`,`A sampled post says “${cleanText(sample.caption,150)}”. This does not establish why it performed or whether it generated sales.`,'Compare this theme with actual customer questions and inquiries before using it in the content plan.','low',sample.url)}
  if(extra.competitors?.length){for(const candidate of extra.competitors.slice(0,2)){finding('Engage','Possible comparable business found',`A search result named “${cleanText(candidate.title,100)}” describes: “${cleanText(candidate.description,170)}”. Its relevance and performance are unverified.`, 'Confirm whether this is a real competitor, then compare its offer, content topics and inquiry route with yours.','low',candidate.url)}}
  const keywordIdeas=[`${input.businessType} ${input.location}`,`${input.businessType} near me`,`${input.businessType} pricing`].map(x=>cleanText(x,100));
  const plan={
    days30:[
      'Review the last 10 inquiries and sales. Record customer need, source and outcome before choosing a primary segment.',
      page.contact?'Test the existing contact path on a phone and set a response-time target.':'Place one clear inquiry action on the homepage and test it on a phone.',
      'Use Search Console or actual search data if you have access; treat the keyword ideas below as hypotheses until checked.'
    ],
    days60:[
      `Improve one page for the specific offer and location: ${cleanText(input.businessType,80)} in ${cleanText(input.location,80)}.`,
      'Publish two useful answers to recurring customer questions, with truthful examples and a clear next step.',
      'Build a small repeatable content schedule for the one discovery channel your customers use most.'
    ],
    days90:[
      'Compare qualified inquiries, quotes and sales by source. Keep the format or page that creates useful conversations.',
      'Refresh weak pages with new evidence, customer questions and an improved call to action.',
      'Ask customers for honest reviews after delivery and review the next 90-day priorities.'
    ]
  };
  return {version:'0.1',business:{name:input.businessName,website:input.website,location:input.location,type:input.businessType,goal:input.mainGoal},summary:`A first public-page check for ${input.businessName}. It can identify visible website signals, but it cannot see private sales, search rankings, backlinks or all AI answers.`,findings:facts,candidateCompetitors:extra.competitors||[],socialSamples:extra.socialSamples||[],keywordIdeas:keywordIdeas.map(query=>({query,status:'research hypothesis',source:'owner-supplied offer and location; no search-volume data'})),plan,unknowns:['Actual ideal customer and sales conversion require the owner’s order/inquiry data.','Keyword demand and rankings require an authorized search data source.','Backlink quality requires a dedicated backlink index.','AI-answer citations vary by query, engine, place and time; no comprehensive check was run.','Public social engagement is not proof of sales.','Suggested competitors are search candidates, not verified direct competition or performance evidence.'],sources:[{url:page.url,checkedAt,method:page.source}],createdAt:new Date().toISOString()};
}
