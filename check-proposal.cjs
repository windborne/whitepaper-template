const assert=require('node:assert/strict');
module.exports=async function(browser,origin){
 const page=await browser.newPage();
 try{
  await page.goto(origin+'/starter.html?mode=edit');
  await page.evaluate(()=>{config.proposal={contact:{name:'Example Contact',email:'contact@example.com'},validity:'Valid for 180 Days'};setCategory('Proposal')});
  assert.equal(await page.locator('#pdf-cover-option').isChecked(),true);
  assert.equal(await page.locator('.author-label').textContent(),'Point of Contact');
  assert.equal(await page.locator('.author-value a').getAttribute('href'),'mailto:contact@example.com');
  assert.equal(await page.locator('.metadata .date').textContent(),'Nov. 9, 2026Valid for 180 Days');
  assert.equal(await page.locator('.category-field').isVisible(),false);
  assert.equal(await page.locator('.metadata .proposal-validity').evaluate(el=>getComputedStyle(el).display),'block');
  assert.equal(await page.locator('#author-details').isVisible(),false);
  assert.ok(!(await page.locator('.doc-end').textContent()).includes('Proposal.'));
  assert.ok((await page.evaluate(()=>footerStyle.textContent)).includes('November\u00a02026.'));
  await page.evaluate(()=>setCover('off'));
  await page.evaluate(()=>setPreparedFor('Example recipient'));
  assert.equal(await page.locator('#pdf-cover-option').isChecked(),false);
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.category-field').isVisible(),false);
  await page.evaluate(()=>setCover('on'));assert.equal(await page.locator('.cover-logo').isVisible(),true);
  assert.ok((await page.locator('.cover-metadata').textContent()).includes('Point of Contact'));
  assert.ok(!(await page.locator('.cover-metadata').textContent()).includes('Proposal'));
  await page.emulateMedia({media:'screen'});
  for(const width of [390,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)}
  await page.evaluate(()=>setCategory('Technical Report'));
  assert.equal(await page.locator('.author-label').textContent(),'Author');
  assert.equal(await page.locator('.metadata .date').textContent(),'Nov. 9, 2026');
  assert.equal(await page.locator('.category-field').isVisible(),true);
  await page.goto(origin+'/starter.html?mode=edit&category=Proposal&cover=off');assert.equal(await page.locator('#pdf-cover-option').isChecked(),false);
  await page.goto(origin+'/starter.html?mode=edit&category=Proposal');assert.equal(await page.locator('#pdf-cover-option').isChecked(),true);
  console.log('Proposal passed: contact, delivery/validity, hidden category, automatic cover with manual override, logo, responsive layout and normal-paper restoration');
 }finally{await page.close()}
};
