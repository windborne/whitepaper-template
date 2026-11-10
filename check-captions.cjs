const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
module.exports=async function checkCaptions(browser,origin){
 const name='caption-test-'+crypto.randomUUID()+'.html',file=path.join(__dirname,name);
 let source=await fs.readFile(path.join(__dirname,'starter.html'),'utf8');
 const svg='<button class="figure-art"><svg viewBox="0 0 100 20"><path d="M0 10h100"/></svg></button>';
 const figures=[`<em>Entire original caption.</em>`,`<b>Figure 2.</b> Partial <em>species name</em>.`,null,`<i>Figure A-1. Appendix caption.</i>`].map(c=>'<figure>'+svg+(c===null?'':'<figcaption>'+c+'</figcaption>')+'</figure>').join('');
 const tables=[null,'<em>Table 2. Entire table caption.</em>','Another table.','Table A-1. Appendix values.'].map(c=>'<div class="table-block"><div class="table-wrap"><table>'+(c===null?'':'<caption>'+c+'</caption>')+'<thead><tr><th>Value</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table></div></div>').join('');
 source=source.replace(/<article class="prose">[\s\S]*?<\/article>/,'<article class="prose"><h2 id="test">Caption fixture</h2>'+figures+tables+'</article>');
 source=source.replace(/(<script type="application\/json" id="document-config">)(.*?)(<\/script>)/,(_,a,b,c)=>a+JSON.stringify({...JSON.parse(b),reviewTabs:[{label:'Template',document:'specimen.html'},{label:'Sample 1',document:name},{label:'Sample 2',document:'conop.html'},{label:'Sample 3',document:'stress-report.html'}]})+c);
 await fs.writeFile(file,source,{flag:'wx'});const page=await browser.newPage();
 try{
  await page.goto(origin+'/'+name+'?mode=edit');
  assert.deepEqual(await page.locator('figure .caption-label').allTextContents(),['Figure 1.','Figure 2.','Figure 3.','Figure A-1.']);
  assert.deepEqual(await page.locator('table .caption-label').allTextContents(),['Table 1.','Table 2.','Table 3.','Table A-1.']);
  assert.equal(await page.locator('figure').nth(0).locator('em,i').count(),0);assert.equal(await page.locator('figure').nth(3).locator('em,i').count(),0);
  assert.equal(await page.locator('figure').nth(1).locator('em').textContent(),'species name');assert.equal(await page.locator('table').nth(1).locator('em,i').count(),0);
  assert.deepEqual(await page.locator('.table-side-caption .caption-label').allTextContents(),['Table 1.','Table 2.','Table 3.','Table A-1.']);
  const before=await page.locator('.prose').textContent();await page.evaluate(()=>prepareCaptions());assert.equal(await page.locator('.prose').textContent(),before,'Repeated normalization changed caption text');
  assert.deepEqual(await page.locator('.document-tabs a').allTextContents(),['Template','Sample 1','Sample 2','Sample 3']);assert.equal(await page.locator('.document-tabs [aria-current="page"]').textContent(),'Sample 1');
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.getByRole('button',{name:'Open Figure 1 in lightbox',exact:true}).click();assert.match(await page.locator('.enlarged-caption').textContent(),/^Figure 1\./);await page.getByRole('button',{name:'Close',exact:true}).click();
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.preview-bar').isVisible(),false);
  const figure='<figure>'+svg+'<figcaption>Caption text.</figcaption></figure>';
  const table='<table><caption>Table caption.</caption><tr><td>1</td></tr></table>';
  const appendixFixture='<article class="prose"><h2 id="main">Main</h2>'+figure+table+'<h2 id="references">References</h2><section class="appendix" data-appendix="A"><h2 id="app-a">Appendix A: Supporting values</h2><h3 id="app-a-detail">Details</h3>'+figure+table.replace('Table caption.','Table A-1. Existing label.')+table+'</section><section class="appendix" data-appendix="B"><h2 id="app-b">Appendix B</h2>'+figure+table+'</section><h2 id="after">After appendices</h2>'+figure+table+'</article>';
  await fs.writeFile(file,source.replace(/<article class="prose">[\s\S]*?<\/article>/,appendixFixture));
  await page.emulateMedia({media:'screen'});await page.reload();
  assert.deepEqual(await page.locator('figure .caption-label').allTextContents(),['Figure 1.','Figure A-1.','Figure B-1.','Figure 2.']);
  assert.deepEqual(await page.locator('table .caption-label').allTextContents(),['Table 1.','Table A-1.','Table A-2.','Table B-1.','Table 2.']);
  await page.evaluate(()=>setPrintContents('one'));
  assert.deepEqual(await page.locator('.print-contents .toc-section-number').allTextContents(),['1.','2.','3.','3.1','4.','5.']);
  assert.equal(await page.locator('.print-contents a[href="#app-a"] .toc-entry-title').textContent(),'3.Appendix A: Supporting values');
  assert.equal(await page.locator('#app-a').textContent(),'Appendix A: Supporting values');
  await page.evaluate(()=>setPrintContents('two'));
  assert.equal(await page.locator('.print-contents a[href="#app-a-detail"]').count(),0);
  const appendixText=await page.locator('.prose').textContent();await page.evaluate(()=>prepareCaptions());assert.equal(await page.locator('.prose').textContent(),appendixText);
  console.log('Captions passed: missing labels, existing/appendix labels, upright body, selective italics, lightbox and four review tabs');
 }finally{await page.close();await fs.rm(file,{force:true})}
};
