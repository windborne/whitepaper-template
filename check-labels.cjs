const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
module.exports=async function checkLabels(browser,origin){
 const name='label-test-'+crypto.randomUUID()+'.html',file=path.join(__dirname,name),pdf=path.join(__dirname,'.cache',name+'.pdf');
 await fs.copyFile(path.join(__dirname,'starter.html'),file);const page=await browser.newPage();
 try{
  await page.goto(origin+'/'+name+'?mode=edit');await page.locator('.options > summary').click();
  assert.equal(await page.locator('#label-type').count(),0);
  assert.equal(await page.locator('#category').isVisible(),true);assert.equal(await page.locator('#prepared-for').isVisible(),true);
  assert.equal(await page.locator('#category').inputValue(),'');assert.equal(await page.locator('#category option[value=""]').textContent(),'None');
  assert.equal(await page.locator('#prepared-for').inputValue(),'');assert.equal(await page.locator('#prepared-for').getAttribute('placeholder'),'Conference/event name');
  assert.equal(await page.locator('.prepared-for-field').isVisible(),false,'Placeholder must not become metadata');
  await page.locator('#category').selectOption('Technical Report');
  const event='AMS Annual Meeting & <Workshop>';await page.locator('#prepared-for').fill(event);
  assert.equal(await page.locator('.category-field dd').textContent(),'Technical Report');
  assert.equal(await page.locator('.prepared-for-field dd').textContent(),event);
  assert.equal(await page.locator('.prepared-for-field dd *').count(),0);
  const layout=()=>page.evaluate(()=>{const fields=[...document.querySelectorAll('.metadata>div')].map(e=>({cls:e.className,...Object.fromEntries(['x','y','width','height'].map(k=>[k,e.getBoundingClientRect()[k]]))}));return fields});
  for(const width of [1500,731,390]){
   await page.setViewportSize({width,height:950});const f=await layout();
   assert.equal(f.length,4);assert.ok(Math.abs(f[2].x-f[0].x)<1&&f[2].y>f[0].y,'Prepared for below Author');
   assert.ok(Math.abs(f[3].x-f[1].x)<1&&f[3].y>f[1].y,'Category below Date');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  await page.emulateMedia({media:'print'});const f=await layout();assert.ok(Math.abs(f[2].x-f[0].x)<1&&Math.abs(f[3].x-f[1].x)<1);await page.emulateMedia({media:'screen'});
  // Both date formats fit two, three and four fields, on screen and in print.
  for(const media of ['screen','print'])for(const width of [1500,731,390]){
   await page.emulateMedia({media});await page.setViewportSize({width,height:950});
   for(const date of ['Nov. 9, 2026','September 2026'])for(const pair of [['',''],['Technical Report',''],['','AMS Annual Meeting'],['Technical Report','AMS Annual Meeting']]){
    await page.evaluate(({date,pair})=>{document.querySelector('.date').textContent=date;setCategory(pair[0]);preparedFor.value=pair[1];setPreparedFor(pair[1])},{date,pair});
    assert.ok(await page.locator('.date').evaluate(e=>e.scrollWidth<=e.clientWidth+1),`Date overflows: ${date}, ${media}, ${width}, ${pair}`);
   }
  }
  await page.emulateMedia({media:'screen'});await page.evaluate(event=>{setCategory('Technical Report');preparedFor.value=event;setPreparedFor(event)},event);
  const expected=await page.evaluate(()=>exportSettings());assert.equal(expected.category,'Technical Report');assert.equal(expected.preparedFor,event);assert.equal('label' in expected,false);
  const popup=page.waitForEvent('popup');await page.locator('.reader-link').click();const reader=await popup;await reader.waitForLoadState();assert.deepEqual(await reader.evaluate(()=>exportSettings()),expected);await reader.close();
  const saved=page.waitForResponse(r=>r.url().endsWith('/api/settings'));await page.locator('.save-settings').click();assert.equal((await saved).status(),200);await page.reload();assert.deepEqual(await page.evaluate(()=>exportSettings()),expected);
  const exported=await page.request.post(origin+'/api/export',{headers:{Origin:origin},data:{document:name,settings:expected}});assert.equal(exported.status(),200);const result=await exported.json();await fs.writeFile(pdf,await (await page.request.get(origin+result.url)).body());
  execFileSync(process.env.PYTHON||'python3',['-c',`from pypdf import PdfReader\nimport unicodedata\nt=' '.join(unicodedata.normalize('NFKC',PdfReader(${JSON.stringify(pdf)}).pages[0].extract_text()).split())\nassert ${JSON.stringify(event)} in t\nassert 'Technical Report' in t\nassert 'WindBorne Systems. Internal use only. Technical Report.' in t`]);
  await page.locator('.options > summary').click();await page.locator('#category').selectOption('');assert.equal(await page.locator('.category-field').isVisible(),false);assert.equal(await page.locator('.prepared-for-field dd').textContent(),event);
  await page.locator('#prepared-for').fill('');assert.equal(await page.locator('.prepared-for-field').isVisible(),false);
  await page.locator('#prepared-for').fill('A'.repeat(160));await page.locator('#category').selectOption('Technical Report');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.goto(origin+'/'+name+'?category=Case%20Study&label=prepared-for');assert.equal(await page.locator('.category-field dd').textContent(),'Case Study');assert.equal(await page.locator('.prepared-for-field dd').textContent(),event);
  for(const settings of [{label:'bad'},{preparedFor:'X'.repeat(161)},{preparedFor:'bad\nvalue'}])assert.equal((await page.request.post(origin+'/api/export',{headers:{Origin:origin},data:{document:name,settings}})).status(),400);
  console.log('Metadata passed: independent fields, four-cell layout web/print/mobile, save/reload, reader/PDF, clearing, legacy mode and wrapping');
 }finally{await page.close();await fs.rm(file,{force:true});await fs.rm(pdf,{force:true})}
};
