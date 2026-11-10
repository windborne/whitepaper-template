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
  const sizes=await page.evaluate(()=>{const image=document.querySelector('.figure-photo img').getBoundingClientRect(),caption=document.querySelector('.figure-photo figcaption').getBoundingClientRect(),chart=document.querySelector('#chart img').getBoundingClientRect(),table=document.querySelector('table').getBoundingClientRect();return {photo:image.height,captionRight:caption.left>image.right,captionTop:Math.abs(caption.top-image.top),chart:chart.height,table:table.height}});
  assert.ok(sizes.photo<=288&&sizes.photo>250);assert.ok(sizes.captionRight&&sizes.captionTop<1);assert.ok(sizes.chart>384,'Chart inherited the photo ceiling');assert.ok(sizes.table>924,'Fixture must span pages');
  assert.deepEqual(await imageRecommendations(page),[]);
  await page.locator('.figure-photo').evaluate(e=>e.classList.remove('figure-portrait'));
  assert.equal((await imageRecommendations(page)).length,1,'Untreated portrait should receive an advisory');
  await page.locator('.figure-photo img').evaluate(e=>{e.src='data:image/svg+xml;base64,'+btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"></svg>')});
  await page.locator('.figure-photo img').evaluate(e=>e.decode());
  assert.equal((await imageRecommendations(page)).length,1,'Square images should receive an advisory');
  await page.locator('.figure-photo').evaluate(e=>e.classList.add('figure-portrait'));
  assert.deepEqual(await imageRecommendations(page),[]);
  await render(file,pdf,{contents:'none'});
  execFileSync(process.env.PYTHON||'python3',['-c',`from pypdf import PdfReader\nr=PdfReader(${JSON.stringify(pdf)})\nt='\\n'.join(p.extract_text() for p in r.pages)\nassert len(r.pages)>2\nassert all(t.count('ROW-%03d'%n)==1 for n in range(1,71))\nassert t.count('Record')>=2`]);
  console.log('Print sizing passed: bounded portrait, uncapped tall chart, 70-row table with repeated headers');
 }finally{await page.close();await fs.rm(file,{force:true});await fs.rm(pdf,{force:true})}
};
