const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs/promises'),{execFileSync}=require('node:child_process');
const {render,validateSettings}=require('./renderer.cjs');
module.exports=async function checkCover(browser,origin){
 const page=await browser.newPage();
 try{
  await page.goto(origin+'/starter.html?mode=edit');
  const initial=await page.locator('.paper-header').boundingBox();
  assert.equal(await page.locator('#pdf-cover-option').isChecked(),false);
  await page.locator('.options > summary').click();await page.getByRole('switch',{name:'PDF cover page',exact:true}).check();
  assert.equal(await page.locator('.pdf-cover').isVisible(),false,'Cover must not appear on web');
  assert.deepEqual(await page.locator('.paper-header').boundingBox(),initial,'Cover changed web header');
  assert.equal((await page.evaluate(()=>exportSettings())).cover,'on');
  await page.emulateMedia({media:'print'});
  assert.equal(await page.locator('.pdf-cover').isVisible(),true);
  assert.equal(await page.locator('.paper-header').isVisible(),false);
  await page.evaluate(()=>setCover('off'));
  assert.equal(await page.locator('.pdf-cover').isVisible(),false);
  assert.equal(await page.locator('.paper-header').isVisible(),true);
  assert.throws(()=>validateSettings({cover:'yes'}));
  const dir=path.join(__dirname,'.cache');await fs.mkdir(dir,{recursive:true});
  for(const cover of ['off','on'])await render(path.join(__dirname,'starter.html'),path.join(dir,'cover-'+cover+'.pdf'),{cover});
  execFileSync(process.env.PYTHON||'python3',['-c',`from pypdf import PdfReader\na=PdfReader(${JSON.stringify(path.join(dir,'cover-off.pdf'))})\nb=PdfReader(${JSON.stringify(path.join(dir,'cover-on.pdf'))})\nassert len(b.pages)==len(a.pages)+1\nassert 'Document title' in b.pages[0].extract_text()\nassert 'CONTENTS' not in b.pages[0].extract_text()\nassert 'CONTENTS' in b.pages[1].extract_text()\nassert 'Describe the method or proposal.' in b.pages[1].extract_text()\nfor d in b.named_destinations.values(): assert b.get_destination_page_number(d)>=1`]);
  console.log('Cover passed: off by default, web unchanged, print-only page, body/contents retained, accurate destinations');
 }finally{await page.close()}
};
