const assert=require('node:assert/strict'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {validateSettings,render}=require('./renderer.cjs');
module.exports=async function checkFooter(browser,origin){
 const page=await browser.newPage();
 const notices={Public:'WindBorne Systems. For public distribution.',Internal:'Internal WindBorne Systems document. Not approved for public release.',Restricted:'Restricted WindBorne Systems document. External sharing requires Data Owner approval and a contract/NDA.',Proprietary:'Proprietary WindBorne Systems document. External release requires an NDA and written approval from the COO or delegate.'};
 try{
  await page.goto(origin+'/article.html?mode=edit');await page.locator('.options > summary').click();
  assert.equal(await page.locator('#first-page-footer').count(),0);
  assert.equal(await page.locator('#distribution').inputValue(),'Internal');
  assert.equal(await page.locator('.metadata .distribution-field').count(),0);
  assert.equal(await page.getByRole('radiogroup',{name:'Distribution'}).getAttribute('aria-required'),'true');
  for(const [value,suffix] of [['Public',''],['Internal',' Internal use only.'],['Restricted',' RESTRICTED.'],['Proprietary',' PROPRIETARY.']]){
   await page.getByRole('radio',{name:value,exact:true}).check();
   assert.equal(await page.locator('.doc-end').textContent(),notices[value]);
   await page.getByRole('radio',{name:value,exact:true}).locator('..').hover();
   assert.equal(await page.locator('#help-distribution-'+value.toLowerCase()).isVisible(),true);
   await page.keyboard.press('Escape');assert.equal(await page.locator('.options').getAttribute('open'),'');
  }
  // Later-page dates normalize both supported header formats and omit categories.
  for(const date of ['Nov. 9, 2026','November 2026']){
   for(const level of ['Public','Internal','Restricted','Proprietary']){
    await page.evaluate(({date,level})=>{document.querySelector('.metadata .date').textContent=date;setCategory('Technical Report');setDistribution(level)},{date,level});
    const css=await page.evaluate(()=>footerStyle.textContent.split('@page:first')[0]);
    assert.ok(css.includes(JSON.stringify('WindBorne Systems. Document title. November\u00a02026.')));
    assert.ok(css.includes('@bottom-right{content:'+JSON.stringify(level.toUpperCase()+'\u2003\u2003')+' counter(page)'));
    assert.ok(!css.includes('Technical Report'));
   }
  }
  // A supplied short title is source-authored; blanks retain the full visible title.
  for(const title of ['Short \"quoted\" title.', '', '   ', null]){
   await page.evaluate(title=>{config.footer={title};updateFooter()},title);
   const css=await page.evaluate(()=>footerStyle.textContent);
   const expected=title?.trim()?title.trim().replace(/\.+$/,''):'Document title';
   assert.ok(css.includes(JSON.stringify('WindBorne Systems. '+expected+'. November\u00a02026.')));
  }
  await page.evaluate(()=>{delete config.footer;updateFooter()});
  assert.ok((await page.evaluate(()=>footerStyle.textContent)).includes('WindBorne Systems. Document title. November\u00a02026.'));
  await page.evaluate(()=>setCategory(''));
  // Native radio keyboard interaction, independent of hidden select.
  await page.getByRole('radio',{name:'Restricted',exact:true}).focus();await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('#distribution').inputValue(),'Proprietary');
  const custom='WindBorne Systems. Review "only" <not a tag>. Keep this supplied notice.';
  await page.goto(origin+'/article.html?mode=edit&firstPageFooter='+encodeURIComponent(custom));
  for(const [value,suffix] of [['Public',''],['Internal',' Internal use only.'],['Restricted',' RESTRICTED.'],['Proprietary',' PROPRIETARY.']]){
   await page.evaluate(v=>setDistribution(v),value);
   assert.equal(await page.evaluate(()=>customFooterText()),custom);
   const expected=custom.slice('WindBorne Systems. '.length);
   assert.equal(await page.locator('.doc-end').textContent(),expected);
   const css=await page.evaluate(()=>footerStyle.textContent);assert.ok(css.includes(JSON.stringify(expected)));
  }
  const reader=await browser.newPage();await reader.goto(origin+await page.locator('.reader-link').getAttribute('href'));assert.equal(await reader.locator('.doc-end').textContent(),custom.slice('WindBorne Systems. '.length));await reader.close();
  await page.goto(origin+'/article.html?mode=edit&distribution=Proprietary');assert.match(await page.locator('.doc-end').textContent(),/^Proprietary WindBorne Systems document\. External release requires an NDA/);
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const firstPageFooter of [1,'x'.repeat(1001),'bad\u0000text'])assert.throws(()=>validateSettings({firstPageFooter}));
  for(const distribution of ['',null,'Confidential','Unknown'])assert.throws(()=>validateSettings({distribution}));
  assert.deepEqual(validateSettings({firstPageFooter:''}),{firstPageFooter:''});
  // Page one is notice-only; later pages retain the organization, date and classification.
  for(const distribution of ['Restricted','Proprietary']){
   const pdf=path.join(__dirname,'.cache','footer-'+distribution.toLowerCase()+'.pdf');
   await render(path.join(__dirname,'stress-report.html'),pdf,{distribution,firstPageFooter:custom});
   execFileSync(require('./runtime.cjs').python(),['-c',`from pypdf import PdfReader\nimport unicodedata\nr=PdfReader(${JSON.stringify(pdf)})\nassert len(r.pages)>1\nfor i,p in enumerate(r.pages):\n t=' '.join(unicodedata.normalize('NFKC',p.extract_text()).split())\n if i>0: assert ${JSON.stringify(distribution.toUpperCase())} in t\n assert ('Keep this supplied notice.' in t)==(i==0)\n if i>0: assert ${JSON.stringify('WindBorne Systems. Instrument network verification. November 2026.')} in t\n else: assert ${JSON.stringify('WindBorne Systems. '+distribution.toUpperCase())} not in t`]);
  }
  for(const [distribution,notice] of Object.entries(notices)){
   const pdf=path.join(__dirname,'.cache','notice-'+distribution.toLowerCase()+'.pdf');
   await render(path.join(__dirname,'stress-report.html'),pdf,{distribution});
   execFileSync(require('./runtime.cjs').python(),['-c',`from pypdf import PdfReader\nimport unicodedata\nr=PdfReader(${JSON.stringify(pdf)})\nfor i,p in enumerate(r.pages):\n t=' '.join(p.extract_text().split())\n assert (${JSON.stringify(notice)} in t)==(i==0)`]);
  }
  execFileSync(require('./runtime.cjs').python(),['-c',`import pdfplumber\nfrom pathlib import Path\nfor f in Path(${JSON.stringify(path.join(__dirname,'.cache'))}).glob('notice-*.pdf'):\n with pdfplumber.open(f) as pdf:\n  words=[w for w in pdf.pages[0].extract_words() if w['top']>740]\n  assert len({round(w['top'],1) for w in words})==1, str(f)\n  assert max(w['x1'] for w in words)<555, str(f)`]);
  console.log('Distribution passed: required default, footer-only, per-choice help/keyboard, notice-only first pages and later-page markings, reader, validation and multipage PDFs');
 }finally{await page.close()}
};
