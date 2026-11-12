const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url'),{execFileSync}=require('node:child_process');
const {render,imageRecommendations}=require('./renderer.cjs');
module.exports=async function checkPrintFigures(browser){
 const name='print-fit-'+crypto.randomUUID(),file=path.join(__dirname,name+'.html'),pdf=path.join(__dirname,'.cache',name+'.pdf');
 const svg=(width,height)=>'data:image/svg+xml;base64,'+Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#ddd"/><path d="M0 0 L${width} ${height}" stroke="#222"/></svg>`).toString('base64');
 const body=`<h2 id="test">Synthetic print-layout fixture</h2><figure class="figure-photo figure-portrait"><button class="figure-art"><img src="${svg(240,640)}" alt="Synthetic portrait sizing fixture"></button><figcaption>Portrait photo layout test.</figcaption></figure><figure id="chart" data-figure-kind="chart"><button class="figure-art"><img src="${svg(980,1200)}" alt="Synthetic tall chart sizing fixture"></button><figcaption>Chart must remain taller than the photograph limit.</figcaption></figure><div class="table-block"><div class="table-wrap"><table><thead><tr><th>Record</th><th>Description</th></tr></thead><tbody>${Array.from({length:70},(_,i)=>`<tr><td>ROW-${String(i+1).padStart(3,'0')}</td><td>Synthetic continuation test</td></tr>`).join('')}</tbody></table></div></div>`;
 const source=(await fs.readFile(path.join(__dirname,'starter.html'),'utf8')).replace(/<article class="prose">[\s\S]*?<\/article>/,'<article class="prose">'+body+'</article>');
 await fs.writeFile(file,source,{flag:'wx'});const page=await browser.newPage();
 try{
  await page.goto(pathToFileURL(file).href);await page.evaluate(()=>document.fonts.ready);await page.emulateMedia({media:'print'});await page.setViewportSize({width:662,height:924});
  const sizes=await page.evaluate(()=>{const image=document.querySelector('.figure-photo img').getBoundingClientRect(),caption=document.querySelector('.figure-photo figcaption').getBoundingClientRect(),chart=document.querySelector('#chart img').getBoundingClientRect(),table=document.querySelector('table').getBoundingClientRect();return {photo:image.height,captionRight:caption.left>image.right,captionBottom:Math.abs(caption.bottom-image.bottom),imageCenter:Math.abs((image.left+image.width/2)-(document.querySelector('.figure-photo .figure-art').getBoundingClientRect().left+document.querySelector('.figure-photo .figure-art').getBoundingClientRect().width/2)),chart:chart.height,table:table.height}});
  assert.ok(sizes.photo<=288&&sizes.photo>250);assert.ok(sizes.captionRight&&sizes.captionBottom<1&&sizes.imageCenter<1);assert.ok(sizes.chart>384,'Chart inherited the photo ceiling');assert.ok(sizes.table>924,'Fixture must span pages');
  assert.deepEqual(await imageRecommendations(page),[]);
  await page.locator('.figure-photo').evaluate(e=>e.classList.remove('figure-portrait'));
  assert.equal((await imageRecommendations(page)).length,1,'Untreated portrait should receive an advisory');
  await page.locator('.figure-photo img').evaluate(e=>{e.src='data:image/svg+xml;base64,'+btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"></svg>')});
  await page.locator('.figure-photo img').evaluate(e=>e.decode());
  assert.equal((await imageRecommendations(page)).length,1,'Square images should receive an advisory');
  await page.locator('.figure-photo').evaluate(e=>e.classList.add('figure-portrait'));
  assert.deepEqual(await imageRecommendations(page),[]);
  await page.locator('.figure-photo img').evaluate((e,src)=>{e.src=src},svg(240,640));
  await page.locator('.figure-photo img').evaluate(e=>e.decode());
  await page.emulateMedia({media:'screen'});
  for(const [width,height] of [[1500,900],[390,844],[320,568],[844,390]]){
   await page.setViewportSize({width,height});
   const inline=await page.locator('.figure-photo').evaluate(f=>{const i=f.querySelector('img').getBoundingClientRect(),c=f.querySelector('figcaption').getBoundingClientRect(),r=f.querySelector('.figure-art').getBoundingClientRect();return {height:i.height,center:Math.abs(i.left+i.width/2-r.left-r.width/2),captionPlaced:innerWidth>1100?c.left>=r.right:c.top>=i.bottom}});
   assert.ok(inline.height<=Math.min(360,height/2)+1&&inline.center<1&&inline.captionPlaced,'Compact photo must be centered and bounded with the standard responsive caption');
   await page.locator('.figure-photo .figure-art').click();
   const expanded=await page.locator('dialog').evaluate(d=>{const i=d.querySelector('img').getBoundingClientRect(),c=d.querySelector('.dialog-close').getBoundingClientRect();return {height:i.height,inside:i.top>=0&&i.bottom<=innerHeight&&i.left>=0&&i.right<=innerWidth,close:c.top>=0&&c.bottom<=innerHeight,ratio:i.width/i.height}});
   assert.ok(expanded.inside&&expanded.close&&Math.abs(expanded.ratio-240/640)<.01,'Lightbox photo must fit viewport and preserve aspect ratio');
   if(height>=800)assert.ok(expanded.height>inline.height,'Lightbox should enlarge the compact photo');
   await page.getByRole('button',{name:'Close',exact:true}).click();
  }
  await render(file,pdf,{contents:'none'});
  execFileSync(require('./runtime.cjs').python(),['-c',`from pypdf import PdfReader\nr=PdfReader(${JSON.stringify(pdf)})\nt='\\n'.join(p.extract_text() for p in r.pages)\nassert len(r.pages)>2\nassert all(t.count('ROW-%03d'%n)==1 for n in range(1,71))\nassert t.count('Record')>=2`]);
  console.log('Photo layout passed: centered print photo and bottom-aligned caption, compact web image, mobile lightbox; chart and 70-row table remain uncapped');
 }finally{await page.close();await fs.rm(file,{force:true});await fs.rm(pdf,{force:true})}
};
