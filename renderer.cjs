const {chromium}=require('playwright');
const {execFileSync}=require('node:child_process');
const fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
const defaults={abstract:'plain',contents:'two',details:'title',category:'',label:'none',preparedFor:'',distribution:'Confidential',authors:'single',firstPageFooter:''};
function validateSettings(input={}){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Settings must be an object');
 const enums={label:['none','category','prepared-for'],abstract:['plain','shaded'],contents:['none','one','two'],details:['none','title','organization','full'],distribution:['','Public','Internal','Proprietary','Confidential'],authors:['single','many']};
 for(const key of Object.keys(input))if(!Object.hasOwn(defaults,key))throw Error('Unknown setting: '+key);
 for(const [key,values] of Object.entries(enums))if(input[key]!==undefined&&!values.includes(input[key]))throw Error('Invalid '+key);
 if(input.category!==undefined&&(typeof input.category!=='string'||input.category.length>80||/[\x00-\x1f\x7f]/.test(input.category)||input.category==='__custom__'))throw Error('Invalid category');
 if(input.preparedFor!==undefined&&(typeof input.preparedFor!=='string'||input.preparedFor.length>160||/[\x00-\x1f\x7f]/.test(input.preparedFor)))throw Error('Invalid preparedFor');
 if(input.firstPageFooter!==undefined&&(typeof input.firstPageFooter!=='string'||input.firstPageFooter.length>400||/[\x00-\x1f\x7f]/.test(input.firstPageFooter)))throw Error('Invalid firstPageFooter');
 return {...input};
}
function resolveDefaults(input={}){return {...defaults,...input,label:input.label??(input.preparedFor?'prepared-for':input.category?'category':'none')}}
async function imageRecommendations(page){
 return page.evaluate(()=>[...document.querySelectorAll('.prose figure')].flatMap((figure,index)=>{
  const image=figure.querySelector('img');
  if(!image||!image.naturalWidth||image.naturalHeight<image.naturalWidth)return [];
  if(['chart','heatmap','diagram','map'].includes(figure.dataset.figureKind))return [];
  const box=image.getBoundingClientRect(),caption=figure.querySelector('figcaption')?.getBoundingClientRect();
  const treated=figure.classList.contains('figure-photo')&&figure.classList.contains('figure-portrait')&&box.height<=3*96+1&&caption&&caption.left>=box.right;
  if(treated)return [];
  return [(figure.id||'Figure '+(index+1))+': square/portrait image — recommend a maximum print height of 3in with caption on the right (figure-photo figure-portrait). If this is a chart, heatmap, diagram or map, mark data-figure-kind and preserve its required readable size.'];
 }));
}
async function render(input,output,settings={}){
 settings=validateSettings(settings);
 const browser=await chromium.launch({headless:true,...(process.env.CHROME?{executablePath:process.env.CHROME}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1500,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Rendering is offline: documents must bundle their assets.
  await page.route('**/*',route=>/^(file:|data:)/.test(route.request().url())?route.continue():route.abort());
  const url=pathToFileURL(path.resolve(input));for(const [k,v] of Object.entries(settings))url.searchParams.set(k,v);
  await page.goto(url.href);await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>{document.body.dataset.pdfBuild='true'});await page.emulateMedia({media:'print'});
  // Match the US Letter content width in style.css before checking page-fit.
  // Measuring responsive figures at the desktop viewport falsely rejects valid artwork.
  await page.setViewportSize({width:Math.floor((8.5-0.8-0.8)*96),height:Math.floor(9.62*96)});
  if(errors.length)throw Error(errors.join('\n'));
  for(const note of await imageRecommendations(page))console.warn('Layout recommendation: '+note);
  const effective=await page.evaluate(()=>exportSettings());
  const oversized=await page.evaluate(()=>{const max=9.62*96;return [...document.querySelectorAll('figure,tr,.eq')].filter(e=>e.getBoundingClientRect().height>max).map(e=>e.id||e.tagName)});
  if(oversized.length)throw Error('Oversized print unit; split or redesign it before exporting: '+oversized.join(', '));
  await fs.mkdir(path.dirname(path.resolve(output)),{recursive:true});
  let previous='',stable=effective.contents==='none';
  for(let pass=0;pass<(effective.contents==='none'?1:6);pass++){
   await page.pdf({path:output,preferCSSPageSize:true,printBackground:true,tagged:true});
   if(effective.contents==='none')break;
   const map=JSON.parse(execFileSync(process.env.PYTHON||'python3',[path.join(__dirname,'pdf_destination_pages.py'),output],{encoding:'utf8'}));
   const rows=await page.evaluate(map=>[...document.querySelectorAll('[data-page-for]')].map(e=>{const key=e.dataset.pageFor;if(!map[key])throw Error('Missing PDF destination: '+key);e.textContent=map[key];return [key,map[key]]}),map);
   const signature=JSON.stringify(rows);if(signature===previous){stable=true;break}previous=signature;
  }
  if(!stable)throw Error('Contents pagination did not stabilize');
  return effective;
 }finally{await browser.close()}
}
module.exports={render,validateSettings,defaults,resolveDefaults,imageRecommendations};
