const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{randomUUID}=require('node:crypto');
const {validateSettings}=require('./renderer.cjs');
module.exports=async function checkDistributionMigration(browser,origin){
 const page=await browser.newPage();const name='distribution-migration-'+randomUUID()+'.html',file=path.join(__dirname,name);
 const source=await fs.readFile(path.join(__dirname,'starter.html'),'utf8');
 const pattern=/(<script[^>]*id="document-config"[^>]*>)([\s\S]*?)(<\/script>)/;
 const notice='CONFIDENTIALITY NOTICE: Preserve this supplied wording.';
 try{
  for(const legacy of ['Restricted','Confidential']){
   const settings={distribution:legacy};assert.deepEqual(validateSettings(settings),{distribution:'Proprietary'});assert.equal(settings.distribution,legacy);
   await page.goto(origin+'/starter.html?mode=edit&distribution='+legacy);
   assert.equal(await page.locator('#distribution').inputValue(),'Proprietary');
   assert.deepEqual(await page.locator('#distribution option').evaluateAll(options=>options.map(o=>o.value)),['Public','Internal','Proprietary']);
   assert.equal(await page.locator('input[name="distribution-choice"]').count(),3);
   assert.equal(await page.evaluate(()=>exportSettings().distribution),'Proprietary');
   assert.match(await page.locator('.reader-link').getAttribute('href'),/distribution=Proprietary/);
   const html=source.replace(pattern,(_,open,json,close)=>{const config=JSON.parse(json);config.defaults.distribution=legacy;config.defaults.firstPageFooter=notice;return open+JSON.stringify(config)+close});
   await fs.writeFile(file,html);
   await page.goto(origin+'/'+name+'?mode=edit');
   assert.equal(await page.locator('#distribution').inputValue(),'Proprietary');
   assert.equal(await page.locator('.doc-end').textContent(),notice);
   await page.locator('.options > summary').click();
   assert.equal(await page.locator('.save-settings').isEnabled(),true);
   const response=page.waitForResponse(r=>r.url()===origin+'/api/settings'&&r.request().method()==='POST');
   await page.locator('.save-settings').click();assert.equal((await response).status(),200);
   await page.waitForFunction(()=>document.querySelector('.save-status').textContent==='Saved');
   const saved=JSON.parse((await fs.readFile(file,'utf8')).match(pattern)[2]);
   assert.equal(saved.defaults.distribution,'Proprietary');assert.equal(saved.defaults.firstPageFooter,notice);
   await page.reload();assert.equal(await page.locator('#distribution').inputValue(),'Proprietary');assert.equal(await page.locator('.doc-end').textContent(),notice);
  }
  console.log('Migration passed: Restricted/Confidential URLs, saved defaults, save/reload and custom notices; exactly three choices');
 }finally{await page.close();await fs.rm(file,{force:true})}
};
