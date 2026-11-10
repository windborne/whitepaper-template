const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
module.exports=async function checkLabels(browser,origin){
 const name='label-test-'+crypto.randomUUID()+'.html',file=path.join(__dirname,name),pdf=path.join(__dirname,'.cache',name+'.pdf');
 await fs.copyFile(path.join(__dirname,'starter.html'),file);const page=await browser.newPage();
 try{
  await page.goto(origin+'/'+name+'?mode=edit');await page.locator('.options > summary').click();
  assert.deepEqual(await page.locator('#label-type option').allTextContents(),['None','Category','Prepared for']);
  assert.equal(await page.locator('#category').isVisible(),false);assert.equal(await page.locator('#prepared-for').isVisible(),false);
  assert.equal(await page.locator('#category option[value=""]').count(),0);
  await page.locator('#label-type').selectOption('category');assert.equal(await page.locator('#category').isVisible(),true);
  await page.locator('#category').selectOption('Technical Report');assert.match(await page.locator('.doc-end').textContent(),/Technical Report/);
  await page.locator('#label-type').selectOption('prepared-for');assert.equal(await page.locator('#category').isVisible(),false);
  assert.equal(await page.locator('#prepared-for').inputValue(),'');assert.equal(await page.locator('#prepared-for').getAttribute('placeholder'),'Conference/event name');
  assert.equal(await page.locator('.category-field').isVisible(),false,'Placeholder must not become metadata');
  const event='AMS Annual Meeting & <Workshop>';
  await page.locator('#prepared-for').fill(event);
  assert.equal(await page.locator('.category-field dt').textContent(),'Prepared for');assert.equal(await page.locator('.category-field dd').textContent(),event);
  assert.equal(await page.locator('.category-field dd *').count(),0,'Free text must not become HTML');
  assert.equal((await page.evaluate(()=>exportSettings())).category,'');
  assert.equal(await page.locator('.doc-end').textContent(),'WindBorne Systems. Confidential. For authorized recipients only. Do not copy or distribute without WindBorne Systems’ permission.');
  const expected=await page.evaluate(()=>exportSettings());const popup=page.waitForEvent('popup');await page.locator('.reader-link').click();const reader=await popup;await reader.waitForLoadState();assert.deepEqual(await reader.evaluate(()=>exportSettings()),expected);await reader.close();
  const saved=page.waitForResponse(r=>r.url().endsWith('/api/settings'));await page.locator('.save-settings').click();assert.equal((await saved).status(),200);await page.reload();
  assert.deepEqual(await page.evaluate(()=>exportSettings()),expected);assert.equal(await page.locator('.category-field dd').textContent(),event);
  const exported=await page.request.post(origin+'/api/export',{headers:{Origin:origin},data:{document:name,settings:expected}});assert.equal(exported.status(),200);const result=await exported.json();await fs.writeFile(pdf,await (await page.request.get(origin+result.url)).body());
  execFileSync(process.env.PYTHON||'python3',['-c',`from pypdf import PdfReader\nimport unicodedata\nt='\\n'.join(p.extract_text() for p in PdfReader(${JSON.stringify(pdf)}).pages)\nt=unicodedata.normalize('NFKC',t)\nassert ${JSON.stringify(event)} in t\nassert 'Technical Report' not in t\nassert 'WindBorne Systems. Confidential.' in t`]);
  await page.locator('.options > summary').click();await page.locator('#label-type').selectOption('none');assert.equal(await page.locator('.category-field').isVisible(),false);assert.equal(await page.locator('#prepared-for').isVisible(),false);
  await page.locator('#label-type').selectOption('prepared-for');await page.locator('#prepared-for').fill('A'.repeat(160));
  for(const width of [1500,390]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)}
  await page.goto(origin+'/'+name+'?category=Case%20Study');assert.equal(await page.locator('#label-type').inputValue(),'category');assert.equal(await page.locator('.category-field dd').textContent(),'Case Study');
  for(const settings of [{label:'bad'},{preparedFor:'X'.repeat(161)},{preparedFor:'bad\nvalue'}])assert.equal((await page.request.post(origin+'/api/export',{headers:{Origin:origin},data:{document:name,settings}})).status(),400);
  console.log('Labels passed: conditional fields, exclusive header/footer, saved Prepared for, reader/PDF, legacy category links and long text');
 }finally{await page.close();await fs.rm(file,{force:true});await fs.rm(pdf,{force:true})}
};
