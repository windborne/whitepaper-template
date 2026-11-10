const assert=require('node:assert/strict'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {validateSettings,render}=require('./renderer.cjs');
module.exports=async function checkFooter(browser,origin){
 const page=await browser.newPage();
 try{
  await page.goto(origin+'/article.html?mode=edit');await page.locator('.options > summary').click();
  assert.equal(await page.locator('#first-page-footer').count(),0);
  assert.equal(await page.locator('#distribution').inputValue(),'Internal');
  assert.equal(await page.locator('.metadata .distribution-field').count(),0);
  assert.equal(await page.getByRole('radiogroup',{name:'Distribution'}).getAttribute('aria-required'),'true');
  for(const [value,suffix] of [['Public',''],['Internal',' Internal use only.'],['Restricted',' RESTRICTED.'],['Proprietary',' PROPRIETARY.']]){
   await page.getByRole('radio',{name:value,exact:true}).check();
   assert.ok((await page.locator('.doc-end').textContent()).startsWith('WindBorne Systems.'+suffix));
   await page.getByRole('radio',{name:value,exact:true}).locator('..').hover();
   assert.equal(await page.locator('#help-distribution-'+value.toLowerCase()).isVisible(),true);
   await page.keyboard.press('Escape');assert.equal(await page.locator('.options').getAttribute('open'),'');
  }
  // Later-page dates normalize both supported header formats and omit categories.
  for(const date of ['Nov. 9, 2026','November 2026']){
   for(const level of ['Public','Internal','Restricted','Proprietary']){
    await page.evaluate(({date,level})=>{document.querySelector('.metadata .date').textContent=date;setCategory('Technical Report');setDistribution(level)},{date,level});
    const css=await page.evaluate(()=>footerStyle.textContent.split('@page:first')[0]);
    assert.ok(css.includes(JSON.stringify('WindBorne Systems. November 2026. '+level.toUpperCase()+'.')));
    assert.ok(!css.includes('Technical Report'));
   }
  }
  await page.evaluate(()=>setCategory(''));
  // Native radio keyboard interaction, independent of hidden select.
  await page.getByRole('radio',{name:'Restricted',exact:true}).focus();await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('#distribution').inputValue(),'Proprietary');
  const custom='WindBorne Systems. Review "only" <not a tag>. Keep this supplied notice.';
  await page.goto(origin+'/article.html?mode=edit&firstPageFooter='+encodeURIComponent(custom));
  for(const [value,suffix] of [['Public',''],['Internal',' Internal use only.'],['Restricted',' RESTRICTED.'],['Proprietary',' PROPRIETARY.']]){
   await page.evaluate(v=>setDistribution(v),value);
   assert.equal(await page.evaluate(()=>customFooterText()),custom);
   const expected='WindBorne Systems.'+suffix+' '+custom.slice('WindBorne Systems. '.length);
   assert.equal(await page.locator('.doc-end').textContent(),expected);
   const css=await page.evaluate(()=>footerStyle.textContent);assert.ok(css.includes(JSON.stringify(expected)));
  }
  const reader=await browser.newPage();await reader.goto(origin+await page.locator('.reader-link').getAttribute('href'));assert.equal(await reader.locator('.doc-end').textContent(),'WindBorne Systems. PROPRIETARY. '+custom.slice('WindBorne Systems. '.length));await reader.close();
  await page.goto(origin+'/article.html?mode=edit&distribution=Proprietary');assert.match(await page.locator('.doc-end').textContent(),/^WindBorne Systems\. PROPRIETARY\. External release requires an NDA/);
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const firstPageFooter of [1,'x'.repeat(401),'bad\u0000text'])assert.throws(()=>validateSettings({firstPageFooter}));
  for(const distribution of ['',null,'Confidential','Unknown'])assert.throws(()=>validateSettings({distribution}));
  assert.deepEqual(validateSettings({firstPageFooter:''}),{firstPageFooter:''});
  // Real multipage PDF: custom notice follows classification; later pages retain the short footer.
  for(const distribution of ['Restricted','Proprietary']){
   const pdf=path.join(__dirname,'.cache','footer-'+distribution.toLowerCase()+'.pdf');
   await render(path.join(__dirname,'stress-report.html'),pdf,{distribution,firstPageFooter:custom});
   execFileSync(process.env.PYTHON||'python3',['-c',`from pypdf import PdfReader\nr=PdfReader(${JSON.stringify(pdf)})\nassert len(r.pages)>1\nfor i,p in enumerate(r.pages):\n t=p.extract_text()\n assert ${JSON.stringify(distribution.toUpperCase()+'.')} in t\n assert ('Keep this supplied notice.' in t)==(i==0)\n if i>0: assert ${JSON.stringify('WindBorne Systems. November 2026. '+distribution.toUpperCase()+'.')} in t\n else: assert ${JSON.stringify('WindBorne Systems. '+distribution.toUpperCase()+'. Technical Report.')} in t`]);
  }
  for(const [distribution,notice] of Object.entries({Public:'For public distribution.',Internal:'Not approved for public release.',Restricted:'External sharing requires Data Owner approval',Proprietary:'External release requires an NDA'})){
   const pdf=path.join(__dirname,'.cache','notice-'+distribution.toLowerCase()+'.pdf');
   await render(path.join(__dirname,'stress-report.html'),pdf,{distribution});
   execFileSync(process.env.PYTHON||'python3',['-c',`from pypdf import PdfReader\nr=PdfReader(${JSON.stringify(pdf)})\nfor i,p in enumerate(r.pages):\n t=' '.join(p.extract_text().split())\n assert (${JSON.stringify(notice)} in t)==(i==0)`]);
  }
  execFileSync(process.env.PYTHON||'python3',['-c',`import pdfplumber\nfrom pathlib import Path\nfor f in Path(${JSON.stringify(path.join(__dirname,'.cache'))}).glob('notice-*.pdf'):\n with pdfplumber.open(f) as pdf:\n  words=[w for w in pdf.pages[0].extract_words() if w['top']>740]\n  assert len({round(w['top'],1) for w in words})==1, str(f)\n  assert max(w['x1'] for w in words)<555, str(f)`]);
  console.log('Distribution passed: required default, footer-only, per-choice help/keyboard, prefixed custom notices and later-page markings, reader, validation and multipage PDFs');
 }finally{await page.close()}
};
