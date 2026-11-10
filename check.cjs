const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs/promises');
const {chromium}=require('playwright');const {execFileSync,spawn}=require('node:child_process');const {once}=require('node:events');
(async()=>{
 execFileSync(process.env.PYTHON||'python3',['check.py'],{cwd:__dirname,stdio:'inherit'});
 const port=18743,origin='http://127.0.0.1:'+port,server=spawn(process.execPath,['server.cjs'],{cwd:__dirname,env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','inherit']});
 await Promise.race([once(server.stdout,'data'),once(server,'exit').then(()=>{throw Error('Test server failed to start')})]);
 const browser=await chromium.launch({headless:true,...(process.env.CHROME?{executablePath:process.env.CHROME}:{})});
 try{
  for(const name of ['starter','article','specimen','stress-report']){
   const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(origin+'/'+name+'.html');await page.evaluate(()=>document.fonts.ready);
   for(const width of [1500,1264,1101,1100,768,390]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${name}: overflow at ${width}`)}
   await page.setViewportSize({width:1500,height:1000});
   assert.equal(await page.locator('.print-contents').isVisible(),false);
   const initial=await page.evaluate(()=>({abstract:config.defaults?.abstract||'plain',contents:config.defaults?.contents||'two'}));assert.equal(await page.locator('#abstract-style').isChecked(),initial.abstract==='shaded');assert.equal(await page.locator('#print-contents-option').inputValue(),initial.contents);
   assert.equal(await page.locator('.toc a').count(),await page.locator('.prose h2').count());
   await page.evaluate(()=>setPrintContents('one'));assert.equal(await page.locator('.print-contents li').count(),await page.locator('.prose h2,.prose h3').count());
   await page.evaluate(()=>setPrintContents('two'));assert.equal(await page.locator('.print-contents li').count(),await page.locator('.prose h2').count());assert.equal(await page.locator('.print-contents .subsection').count(),0);
   await page.evaluate(()=>{setPrintContents('none');setAbstract('shaded');setPrintContents('one')});assert.equal(await page.locator('#abstract-style').isChecked(),false);
   await page.evaluate(()=>{setAbstract('shaded');setPrintContents('two')});assert.equal(await page.locator('#abstract-style').isChecked(),true);
   if(await page.locator('.figure-art').count()){
    await page.locator('.figure-art').first().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('dialog').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').isVisible(),false);assert.equal(await page.locator('.figure-art').first().evaluate(e=>e===document.activeElement),true);
    await page.locator('.figure-art').first().click();await page.getByRole('button',{name:'Close',exact:true}).click();assert.equal(await page.locator('dialog').isVisible(),false);assert.equal(await page.locator('.figure-art').first().evaluate(e=>e===document.activeElement),true);
   }
   const broken=await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash));assert.deepEqual(broken,[]);
   await page.evaluate(()=>{setCategory('Field Brief');setDistribution('Internal')});assert.equal(await page.locator('.doc-end').textContent(),'WindBorne Systems. Field Brief. Internal use only.');
   for(const [value,ending] of [['',''],['Public',''],['Proprietary',' Proprietary information.'],['Confidential',' Confidential. For authorized recipients only. Do not copy or distribute without WindBorne Systems’ permission.']]){await page.evaluate(v=>setDistribution(v),value);assert.equal(await page.locator('.doc-end').textContent(),'WindBorne Systems. Field Brief.'+ending)}
   if(name==='stress-report'){
    assert.equal(await page.locator('.author-label').textContent(),'Authors');assert.equal(await page.locator('.author-row').count(),6);
    await page.evaluate(()=>{document.getElementById('author-details').value='none';renderAuthors()});assert.equal(await page.locator('.author-row').count(),0);assert.equal((await page.locator('.author-value').textContent()).split(', ').length,6);
   }
   await page.emulateMedia({media:'print'});assert.equal(await page.locator('.preview-bar').isVisible(),false);assert.equal(await page.locator('.doc-end').isVisible(),false);assert.equal(await page.locator('.print-contents').isVisible(),true);
   const textAlignment=await page.evaluate(()=>{const body=document.querySelector('.prose>p');if(!body)return [];const b=body.getBoundingClientRect();return [...document.querySelectorAll('.prose .appendix>h2,.prose .appendix>h3,.prose .appendix>p,.prose .notes')].map(el=>{const r=el.getBoundingClientRect();return {left:Math.abs(r.left-b.left),width:Math.abs(r.width-b.width)}})});assert.ok(textAlignment.every(r=>r.left<1&&r.width<1),`${name}: appendix/references do not align with body`);
   if(await page.locator('.notes h2').count())assert.deepEqual(await page.evaluate(()=>['fontFamily','fontSize','fontWeight','letterSpacing','color'].map(k=>getComputedStyle(document.querySelector('.notes h2'))[k])),await page.evaluate(()=>['fontFamily','fontSize','fontWeight','letterSpacing','color'].map(k=>getComputedStyle(document.querySelector('.print-contents h2'))[k])));
   assert.deepEqual(errors,[]);await page.close();console.log('Layout and behavior passed: '+name);
  }
  await require('./check-print-figures.cjs')(browser);
  await require('./check-lightbox.cjs')(browser,origin);
  await require('./check-help.cjs')(browser,origin);
  await require('./check-settings.cjs')(browser,origin);
  await require('./check-labels.cjs')(browser,origin);
  await require('./check-captions.cjs')(browser,origin);
  await require('./check-footer.cjs')(browser,origin);
  const entry=await browser.newPage();await entry.goto(origin+'/');assert.equal(await entry.locator('body').getAttribute('data-document'),'article');assert.match(await entry.locator('.document-tabs a').nth(1).getAttribute('href'),/^article.html/);assert.equal(await entry.getByRole('link',{name:'View PDF',exact:true}).count(),1);assert.equal(await entry.locator('[data-lucide="file-text"]').count(),1);assert.equal(await entry.locator('[data-lucide="pencil-line"]').count(),1);assert.equal(await entry.locator('[data-lucide="save"]').count(),1);await entry.close();
  const page=await browser.newPage();await page.goto(origin+'/stress-report.html?abstract=shaded&contents=one&category=Custom%20Field%20Brief&distribution=Internal&details=full');
  const popup=page.waitForEvent('popup');await page.locator('[data-pdf-link]').click();const viewer=await popup;await viewer.waitForURL('**/generated/**',{timeout:120000});
  const pdf=await page.request.get(viewer.url());assert.equal(pdf.headers()['content-type'],'application/pdf');const bytes=await pdf.body();assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
  await fs.mkdir(path.join(__dirname,'.cache'),{recursive:true});await fs.writeFile(path.join(__dirname,'.cache/custom-export.pdf'),bytes);
  execFileSync(process.env.PYTHON||'python3',['-c',`from pypdf import PdfReader; r=PdfReader('.cache/custom-export.pdf'); t='\\n'.join(p.extract_text() for p in r.pages); assert 'Custom Field Brief' in t and 'Internal use only.' in t and 'Morgan Example' in t; assert 'For authorized recipients only' not in t; assert len(r.named_destinations)>0`],{cwd:__dirname});
  console.log('Custom settings open a generated PDF in the viewer');
  for(const [request,status]of [[{document:'../stress-report.html',settings:{}},400],[{document:'stress-report.html',settings:{contents:'bad'}},400]]){const r=await fetch(origin+'/api/export',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(request)});assert.equal(r.status,status)}
  assert.equal((await fetch(origin+'/api/export',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json'},body:'{}'})).status,403);
  assert.equal((await fetch(origin+'/.git/config')).status,404);
  console.log('Export request validation passed');
 }finally{await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
