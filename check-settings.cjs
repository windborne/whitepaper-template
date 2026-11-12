// A disposable root-level document tests durable saves without altering examples.
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {resolveDefaults}=require('./renderer.cjs');
module.exports=async function checkSettings(browser,origin){
 const name='save-test-'+crypto.randomUUID()+'.html',file=path.join(__dirname,name);
 let source=(await fs.readFile(path.join(__dirname,'starter.html'),'utf8')).replace('data-document="starter"','data-document="'+name.slice(0,-5)+'"').replace('"distribution": "Internal"','"distribution": "Internal", "firstPageFooter": "WindBorne Systems. Custom first-page notice for reviewers."');
 const configPattern=/(<script\b[^>]*\bid="document-config"[^>]*>)([\s\S]*?)(<\/script>)/;
 const config=text=>JSON.parse(text.match(configPattern)[2]);
 source=source.replace(configPattern,(_,open,body,close)=>{const c=JSON.parse(body);c.footer={title:'Saved running title'};c.defaults.firstPageFooter='WindBorne Systems. Custom first-page notice for reviewers.';return open+JSON.stringify(c)+close});
 const baseline=resolveDefaults(config(source).defaults);
 await fs.writeFile(file,source,{flag:'wx'});const page=await browser.newPage(),stale=await browser.newPage();
 const post=data=>fetch(origin+'/api/settings',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
 try{
  // Query choices are unsaved, and must not survive as overrides after saving.
  await page.goto(origin+'/'+name+'?mode=edit&distribution=Public');await stale.goto(origin+'/'+name);
  await page.locator('.options > summary').click();
  assert.equal(await page.locator('.save-settings').isEnabled(),true);
  await page.locator('#category').selectOption('__custom__');await page.locator('#custom-category').fill('Field </script> report');await page.locator('.add-label').click();
  await page.locator('#author-details').selectOption('full');await page.locator('#print-contents-option').selectOption('one');await page.locator('#abstract-style').check();await page.getByRole('switch',{name:'PDF cover page',exact:true}).check();await page.getByRole('switch',{name:'Figure borders',exact:true}).check();
  assert.equal(await page.locator('#first-page-footer').count(),0);
  const selected=await page.evaluate(()=>exportSettings());assert.equal(selected.figureBorders,'on');
  assert.equal(await page.locator('.doc-end').textContent(),'Custom first-page notice for reviewers.');
  // Reader preview is a separate tab and preserves unsaved editor choices.
  const editorUrl=page.url(),readerOpened=page.waitForEvent('popup');
  await page.getByRole('link',{name:'View web reader layout',exact:true}).click();
  const reader=await readerOpened;await reader.waitForLoadState('load');
  assert.equal(new URL(reader.url()).searchParams.get('mode'),'public');
  assert.deepEqual(await reader.evaluate(()=>exportSettings()),selected);
  assert.equal(await reader.locator('.options').isVisible(),false);
  assert.equal(page.url(),editorUrl);assert.deepEqual(await page.evaluate(()=>exportSettings()),selected);
  assert.equal(await page.locator('.save-settings').isEnabled(),true);
  assert.equal(await reader.evaluate(()=>window.opener===null),true);await reader.close();
  const saved=page.waitForResponse(r=>r.url().endsWith('/api/settings')&&r.request().method()==='POST');await page.locator('.save-settings').click();assert.equal((await saved).status(),200);await page.waitForFunction(()=>document.querySelector('.save-status').textContent==='Saved');
  assert.equal(await page.locator('.save-settings').isEnabled(),false);assert.equal(new URL(page.url()).searchParams.has('distribution'),false);
  const after=await fs.readFile(file,'utf8');assert.deepEqual(config(after).defaults,selected);
  assert.equal(after.replace(configPattern,'CONFIG'),source.replace(configPattern,'CONFIG'),'Save changed article content');
  assert.deepEqual(config(after).authors,config(source).authors);assert.deepEqual(config(after).footer,{title:'Saved running title'});assert.equal(after.includes('Field </script> report'),false,'Configuration was not safely escaped');
  await page.reload();assert.deepEqual(await page.evaluate(()=>exportSettings()),selected);
  await page.locator('.options > summary').click();assert.equal(await page.locator('.save-settings').isEnabled(),false);
  await page.getByRole('link',{name:'Template',exact:true}).click();await page.waitForURL('**/specimen.html?**');
  assert.equal(await page.getByRole('link',{name:'Article',exact:true}).getAttribute('href'),name+'?mode=edit');
  await page.getByRole('link',{name:'Article',exact:true}).click();await page.waitForURL('**/'+name+'?mode=edit');
  assert.deepEqual(await page.evaluate(()=>exportSettings()),selected);await page.locator('.options > summary').click();
  await page.locator('#distribution').selectOption('Public',{force:true});await page.reload();assert.deepEqual(await page.evaluate(()=>exportSettings()),selected,'Unsaved settings leaked into file');
  const conflict=await post({document:name,settings:{...selected,distribution:'Proprietary'},expected:baseline});assert.equal(conflict.status,409);assert.equal(await fs.readFile(file,'utf8'),after);
  // Actual stale-tab feedback is visible and retains the user's unsaved choice.
  await stale.locator('.options > summary').click();await stale.locator('#distribution').selectOption('Public',{force:true});const conflictResponse=stale.waitForResponse(r=>r.url().endsWith('/api/settings'));await stale.locator('.save-settings').click();assert.equal((await conflictResponse).status(),409);await stale.waitForFunction(()=>document.querySelector('.save-status').textContent.includes('another editor'));assert.equal(await stale.locator('#distribution').inputValue(),'Public');
  for(const bad of [{document:'../starter.html',settings:selected,expected:selected},{document:name,settings:{...selected,contents:'invalid'},expected:selected},{document:name,settings:{distribution:'Public'},expected:selected}])assert.equal((await post(bad)).status,400);
  assert.equal((await fetch(origin+'/api/settings',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json'},body:JSON.stringify({document:name,settings:selected,expected:selected})})).status,403);
  assert.equal(await fs.readFile(file,'utf8'),after);
  // Public output is not writable, even if someone attempts the local API directly.
  await fs.writeFile(file,after.replace(configPattern,(_,a,b,c)=>a+JSON.stringify({...JSON.parse(b),published:true}).replaceAll('<','\\u003c')+c));
  assert.equal((await post({document:name,settings:selected,expected:selected})).status,400);
  console.log('Save passed: durable reload, exact source preservation, unsaved edits, stale-tab conflict, validation and read-only publication');
 }finally{await page.close();await stale.close();await fs.rm(file,{force:true})}
};
