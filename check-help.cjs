const assert=require('node:assert/strict');
module.exports=async function checkHelp(browser,origin){
 const page=await browser.newPage();
 try{
  await page.goto(origin+'/article.html?mode=edit');
  await page.locator('.options > summary').click();
  const button=page.getByRole('button',{name:'About PDF table of contents',exact:true});
  const help=page.locator('#help-contents');
  await button.hover();assert.equal(await help.isVisible(),true);
  await help.hover();assert.equal(await help.isVisible(),true);
  await page.locator('.paper-header h1').hover();await help.waitFor({state:'hidden'});
  await button.focus();assert.equal(await help.isVisible(),true);
  await page.keyboard.press('Escape');assert.equal(await help.isVisible(),false);assert.equal(await page.locator('.options').getAttribute('open'),'');
  await page.keyboard.press('Escape');assert.equal(await page.locator('.options').getAttribute('open'),null);
 }finally{await page.close()}
 const touch=await browser.newContext({hasTouch:true,viewport:{width:390,height:844}});
 try{
  const page=await touch.newPage();await page.goto(origin+'/article.html?mode=edit');await page.locator('.options > summary').tap();
  for(const id of ['contents','distribution','save','distribution-public','distribution-internal','distribution-restricted','distribution-proprietary']){
   const button=page.locator('[aria-controls="help-'+id+'"]'),help=page.locator('#help-'+id);
   await button.tap();assert.equal(await help.isVisible(),true);assert.equal(await button.getAttribute('aria-expanded'),'true');
   const box=await help.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=390,'Help fits narrow viewport');
   await button.tap();assert.equal(await help.isVisible(),false);
  }
 }finally{await touch.close()}
 console.log('Settings help: hover, focus, Escape and touch passed');
};
