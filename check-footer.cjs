const assert=require('node:assert/strict');
const {validateSettings}=require('./renderer.cjs');
module.exports=async function checkFooter(browser,origin){
 const page=await browser.newPage();
 try{
  await page.goto(origin+'/article.html?mode=edit');await page.locator('.options summary').click();
  const field=page.locator('#first-page-footer');
  assert.equal(await field.inputValue(),'');
  assert.match(await field.getAttribute('placeholder'),/For authorized recipients only/);
  const custom='WindBorne Systems. Review "only" <not a tag>. Keep this supplied notice.';
  await field.fill(custom);assert.equal(await page.locator('.doc-end').textContent(),custom);
  await page.locator('#distribution').selectOption('Internal');assert.equal(await page.locator('.doc-end').textContent(),custom);
  const css=await page.evaluate(()=>footerStyle.textContent);assert.match(css,/@page\{@bottom-left\{content:"WindBorne Systems\. Internal use only\."/);assert.ok(css.includes(JSON.stringify(custom)));
  const reader=await browser.newPage();await reader.goto(origin+await page.locator('.reader-link').getAttribute('href'));assert.equal(await reader.locator('.doc-end').textContent(),custom);await reader.close();
  await field.fill('');assert.equal(await page.locator('.doc-end').textContent(),'WindBorne Systems. Internal use only.');
  await page.locator('#distribution').selectOption('Confidential');assert.match(await page.locator('.doc-end').textContent(),/For authorized recipients only/);
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const firstPageFooter of [1,'x'.repeat(401),'bad\u0000text'])assert.throws(()=>validateSettings({firstPageFooter}));
  assert.deepEqual(validateSettings({firstPageFooter:''}),{firstPageFooter:''});
  console.log('Custom footer passed: defaults, override, distribution independence, reader, clearing, mobile and validation');
 }finally{await page.close()}
};
