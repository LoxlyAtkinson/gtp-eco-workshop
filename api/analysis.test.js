import test from 'node:test';
import assert from 'node:assert/strict';
import {publicUrl,extractPage,buildAssessment} from './analysis.js';

test('scan URLs reject local targets and credentials',()=>{
  for(const value of ['http://localhost/','http://127.0.0.1/','http://192.168.1.10/','http://169.254.169.254/','http://user:pass@example.com/','file:///etc/passwd','https://intranet.local/'])assert.equal(publicUrl(value),null,value);
  assert.equal(publicUrl('https://example.co.za/menu')?.hostname,'example.co.za');
});

test('public-page findings cite observed HTML and label unknown evidence',()=>{
  const page=extractPage('<html><head><title>Amina Kitchen | Meeting lunches</title><meta name="description" content="Meeting lunches in Johannesburg"></head><body><h1>Lunch for your team</h1><a href="https://wa.me/27123456789">Ask for a quote</a></body></html>','https://example.co.za/');
  const result=buildAssessment({businessName:'Amina Kitchen',website:page.url,location:'Johannesburg',businessType:'meeting lunches',mainGoal:'more-inquiries'},page);
  assert.ok(result.findings.some(f=>f.title==='A contact route is visible'&&f.sourceUrl===page.url));
  assert.ok(result.findings.every(f=>f.sourceUrl&&f.checkedAt&&f.nextStep));
  assert.ok(result.keywordIdeas.every(x=>x.status==='research hypothesis'));
  assert.ok(result.unknowns.some(x=>x.includes('Backlink')));
  assert.equal(result.plan.days30.length,3);
});

test('missing HTML evidence does not become a false positive',()=>{
  const page=extractPage('<html><body><p>Welcome</p></body></html>','https://example.co.za/');
  const result=buildAssessment({businessName:'Example',website:page.url,location:'Cape Town',businessType:'bakery',mainGoal:'more-sales'},page);
  assert.ok(result.findings.some(f=>f.title==='A contact route was not found'&&f.confidence==='medium'));
  assert.ok(result.findings.some(f=>f.title==='The homepage needs a clear title'));
});
