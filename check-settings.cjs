// A disposable root-level document tests durable saves without altering examples.
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {resolveDefaults}=require('./renderer.cjs');
module.exports=async function checkSettings(browser,origin){
 const name='save-test-'+crypto.randomUUID()+'.html',file=path.join(__dirname,name);
 let source=(await fs.readFile(path.join(__dirname,'starter.html'),'utf8')).replace('data-document="starter"','data-document="'+name.slice(0,-5)+'"').replace('"distribution": "Internal"','"distribution": "Internal", "firstPageFooter": "WindBorne Systems. Custom first-page notice for reviewers."');
 const configPattern=/(<script\b[^>]*\bid="document-config"[^>]*>)([\s\S]*?)(<\/script>)/;
 const config=text=>JSON.parse(text.match(configPattern)[2]);
 source=source.replace(configPattern,(_,open,body,close)=>{const c=JSON.parse(body);c.footer={title:'Saved running title'};c.defaults.firstPageFooter='WindBorne Systems. Custom first-page notice for reviewers.';return open+JSON.stringify(c)+close});
 const panel='<svg width="120" height="60" viewBox="0 0 120 60" aria-label="Test panel"><rect x="5" y="5" width="110" height="50" fill="none" stroke="black"/></svg>';
 const figures=[['single','',1],['group','',2],['manual','on',1],['excluded','off',2]].map(([id,border,count])=>'<figure id="frame-'+id+'"'+(border?' data-figure-border="'+border+'"':'')+'><button class="figure-art">'+panel.repeat(count)+'</button><figcaption>Frame test.</figcaption></figure>').join('');
 source=source.replace('</article>',figures+'</article>');
 const baseline=resolveDefaults(config(source).defaults);
 await fs.writeFile(file,source,{flag:'wx'});const page=await browser.newPage(),stale=await browser.newPage();
 const post=data=>fetch(origin+'/api/settings',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
 try{
  // Query choices are unsaved, and must not survive as overrides after saving.
  await page.goto(origin+'/'+name+'?mode=edit&distribution=Public');await stale.goto(origin+'/'+name);
  await page.locator('.options > summary').click();
  assert.equal(await page.locator('.save-settings').isEnabled(),true);
  // A shared frame is automatic for groups, with explicit source overrides.
  for(const media of ['screen','print']){
   await page.emulateMedia({media});
   for(const [id,framed] of [['single',false],['group',true],['manual',true],['excluded',false]]){
    assert.equal(await page.locator('#frame-'+id+' .figure-frame').isVisible(),framed,media+': '+id);
    assert.equal(await page.locator('#frame-'+id+' .figure-frame').count(),1);
   }
  }
  await page.emulateMedia({media:'screen'});
  await page.locator('#frame-group .figure-art').click();assert.equal(await page.locator('dialog .frame-enabled > .figure-frame').isVisible(),true);await page.keyboard.press('Escape');
  await page.locator('.options').evaluate(el=>el.open=true);
  const gap=await page.evaluate(()=>{const cover=document.querySelector('.cover-setting');return cover.getBoundingClientRect().top-cover.previousElementSibling.getBoundingClientRect().bottom});
  assert.ok(gap>=18&&gap<=24,'Distribution/cover gap: '+gap);

  await page.locator('#category').selectOption('__custom__');await page.locator('#custom-category').fill('Field </script> report');await page.locator('.add-label').click();
  await page.locator('#author-details').selectOption('full');await page.locator('#print-contents-option').selectOption('one');await page.locator('#abstract-style').check();await page.getByRole('switch',{name:'PDF cover page',exact:true}).check();assert.equal(await page.getByRole('switch',{name:'Figure borders',exact:true}).count(),0);
  assert.equal(await page.locator('#first-page-footer').count(),0);
  const selected=await page.evaluate(()=>exportSettings());assert.equal(selected.figureBorders,'off');
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
  assert.equal(await page.locator('.settings-save .help-trigger').count(),0);
  await page.locator('#prepared-for').fill('Unsaved event');await page.locator('#abstract-style').uncheck();
  await page.getByRole('button',{name:'Reset view',exact:true}).click();assert.deepEqual(await page.evaluate(()=>exportSettings()),selected);assert.equal(await page.locator('.save-settings').isEnabled(),false);
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
  // Hosted Save is browser-local; Reset restores that saved preference set.
  const hosted=after.replace(configPattern,(_,a,b,c)=>a+JSON.stringify({...JSON.parse(b),hostedReview:true}).replaceAll('<','\\u003c')+c);
  await fs.writeFile(file,hosted);await page.reload();await page.locator('.options > summary').click();
  let writes=0;page.on('request',r=>{if(r.url().endsWith('/api/settings')&&r.method()==='POST')writes++});
  await page.locator('#prepared-for').fill('Browser-only event');await page.locator('.save-settings').click();
  assert.equal(await page.locator('.save-status').textContent(),'Saved in this browser');assert.equal(writes,0);assert.equal(await fs.readFile(file,'utf8'),hosted);
  await page.reload();await page.locator('.options > summary').click();assert.equal(await page.locator('#prepared-for').inputValue(),'Browser-only event');
  await page.locator('#prepared-for').fill('Discard this');await page.locator('.reset-settings').click();assert.equal(await page.locator('#prepared-for').inputValue(),'Browser-only event');
  // Saving cannot pretend to succeed when browser storage is unavailable.
  await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('Browser storage unavailable')}});await page.locator('#prepared-for').fill('Not saved');await page.locator('.save-settings').click();assert.match(await page.locator('.save-status').textContent(),/unavailable/);assert.equal(await page.locator('.save-settings').isEnabled(),true);
  console.log('Save/reset passed: local file persistence, browser-only hosted persistence, reload/reset, storage failure, source preservation, stale conflicts and validation');

 }finally{await page.close();await stale.close();await fs.rm(file,{force:true})}
};
