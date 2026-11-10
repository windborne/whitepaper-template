const assert=require('node:assert/strict');
module.exports=async function checkLightbox(browser,origin){
 const page=await browser.newPage({viewport:{width:1500,height:900}});
 try{
  await page.goto(origin+'/specimen.html');
  for(const name of ['Open Figure 4 in lightbox','Open Figure 2 in lightbox']){
   await page.setViewportSize({width:1500,height:900});
   await page.getByRole('button',{name,exact:true}).click();
   // Shrink and expand the viewport with the same lightbox still open.
   for(const width of [1500,890,560,390,320,1100]){
    await page.setViewportSize({width,height:900});
    const state=await page.locator('dialog').evaluate(d=>{
     const art=d.querySelector('.enlarged-art'),graphic=art.querySelector('img,svg'),caption=d.querySelector('.enlarged-caption'),close=d.querySelector('.dialog-close');
     const dr=d.getBoundingClientRect(),gr=graphic.getBoundingClientRect(),cr=caption.getBoundingClientRect(),br=close.getBoundingClientRect();
     return {overflow:d.scrollWidth>d.clientWidth,artOverflow:art.scrollWidth>art.clientWidth,inside:gr.left>=dr.left&&gr.right<=dr.right&&cr.left>=dr.left&&cr.right<=dr.right&&br.left>=dr.left&&br.right<=dr.right,ratio:gr.width/gr.height,nativeRatio:graphic.tagName==='IMG'?graphic.naturalWidth/graphic.naturalHeight:graphic.viewBox.baseVal.width/graphic.viewBox.baseVal.height};
    });
    assert.equal(state.overflow,false,`${name}: dialog overflow at ${width}`);
    assert.equal(state.artOverflow,false,`${name}: art overflow at ${width}`);
    assert.equal(state.inside,true,`${name}: content outside dialog at ${width}`);
    assert.ok(Math.abs(state.ratio-state.nativeRatio)<.01,`${name}: distorted aspect ratio at ${width}`);
   }
   await page.getByRole('button',{name:'Close',exact:true}).click();
  }
  console.log('Lightbox raster/SVG resizing passed: 320–1500px, no overflow or distortion');
 }finally{await page.close()}
};
