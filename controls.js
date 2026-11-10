const config=JSON.parse(document.getElementById('document-config').textContent);
let saveButton,saveStatus,savedDefaults,saving=false,saveFeedback='';
const params=new URLSearchParams(config.published?'':location.search);const kind=document.body.dataset.document;
const localDocument=location.protocol==='file:'||['127.0.0.1','localhost','::1'].includes(location.hostname);
const editing=!config.published&&(params.get('mode')==='edit'||(params.get('mode')!=='public'&&localDocument));
document.body.classList.toggle('editing-mode',editing);
const documentName=location.pathname.split('/').pop()||kind+'.html';
const requestedArticle=params.get('article');
const articleName=documentName==='specimen.html'?(requestedArticle&&/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.html$/.test(requestedArticle)&&requestedArticle!=='specimen.html'?requestedArticle:'article.html'):documentName;
const tabBar=document.querySelector('.document-tabs');
const reviewTabs=Array.isArray(config.reviewTabs)?config.reviewTabs.filter(t=>t&&typeof t.label==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.html$/.test(t.document)):[];
if(editing&&reviewTabs.length){
 tabBar.replaceChildren(...reviewTabs.map(t=>{const a=document.createElement('a');a.href=t.document+'?mode=edit';a.textContent=t.label;if(t.title)a.title=t.title;return a}));
 document.body.classList.add('review-mode');
}else{
 const tabs=[...tabBar.querySelectorAll('a')];
 tabs[0].href='specimen.html?'+new URLSearchParams({mode:'edit',article:articleName});tabs[1].href=articleName+'?mode=edit';
}
document.querySelectorAll('.document-tabs a').forEach(a=>{if(new URL(a.href).pathname.split('/').pop()===documentName)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
const abstract=document.getElementById('abstract-style'),printContents=document.getElementById('print-contents-option'),category=document.getElementById('category'),authors=document.getElementById('authors-demo'),authorDetails=document.getElementById('author-details');
const meta=document.querySelector('.metadata'),cat=document.querySelector('.category-field');
const distribution=document.getElementById('distribution'),distributionField=document.querySelector('.distribution-field'),customEditor=document.querySelector('.custom-label-editor'),customInput=document.getElementById('custom-category');
const labelType=document.getElementById('label-type'),preparedFor=document.getElementById('prepared-for');
// Optional complete replacement for the first PDF page and the web article footer.
const footerField=document.createElement('div');footerField.className='setting-field has-help footer-setting';footerField.dataset.help='';
footerField.innerHTML='<div class="setting-label-row"><label for="first-page-footer">First-page footer (optional)</label></div><textarea id="first-page-footer" rows="3" maxlength="400" aria-describedby="help-first-page-footer"></textarea>';
const footerHelp=document.querySelector('#distribution').closest('[data-help]').querySelector('.help-trigger').cloneNode(true);
footerHelp.setAttribute('aria-label','About First-page footer');footerHelp.setAttribute('aria-describedby','help-first-page-footer');footerHelp.setAttribute('aria-controls','help-first-page-footer');
footerField.querySelector('.setting-label-row').append(footerHelp);
const footerTip=document.createElement('span');footerTip.className='help-tooltip';footerTip.id='help-first-page-footer';footerTip.setAttribute('role','tooltip');footerTip.hidden=true;
footerTip.textContent='Leave blank for the recommended notice. Custom text replaces the entire first-page footer, including the organization name, and appears at the end of the web article. Later PDF pages keep the standard footer. Maximum 400 characters.';
footerField.append(footerTip);labelType.closest('.setting-field').before(footerField);
const firstPageFooter=document.getElementById('first-page-footer');
firstPageFooter.value=params.has('firstPageFooter')?params.get('firstPageFooter'):(config.defaults?.firstPageFooter||'');
function customFooterText(){return firstPageFooter.value.replace(/\s+/g,' ').trim()}
let selectedCategory='',selectedPreparedFor='';
const footerStyle=document.createElement('style');document.head.append(footerStyle);
const baseAuthors=config.authors;
const exampleAuthors=[{name:'Author One',title:'Research scientist',organization:'WindBorne'},{name:'Author Two',title:'Machine learning engineer',organization:'WindBorne'},{name:'Author Three',title:'Research engineer',organization:'WindBorne'}];
let currentAuthors=baseAuthors;
function updateReaderLink(){const q=new URLSearchParams({mode:'public',...exportSettings()});document.querySelector('.reader-link').href=location.pathname+'?'+q.toString();refreshSaveState(true)}
function updatePDFLink(){document.querySelector('[data-pdf-link]').href=config.pdf||kind+'.pdf';updateReaderLink()}
function captionPrefix(caption,kind){
 const match=caption.textContent.match(/^\s*(Figure|Fig\.?|Table)\s+((?:[A-Za-z]+[-.]?)?\d+(?:[.-]\d+)*[A-Za-z]?)\s*[.:]?\s*/i);
 return match&&(kind==='Table'?/^Table$/i.test(match[1]):/^Fig/i.test(match[1]))?match:null;
}
function prepareCaptions(){
 const appendices=[...document.querySelectorAll('.prose .appendix')];
 const scopeFor=parent=>{
  const appendix=parent.closest('[data-appendix],.appendix');if(!appendix)return '';
  const letter=appendix.dataset.appendix||String.fromCharCode(65+appendices.indexOf(appendix));
  return /^[A-Z]+$/.test(letter)?letter+'-':'';
 };
 for(const [selector,kind,tag] of [['.prose figure','Figure','figcaption'],['.prose table','Table','caption']]){
  const items=[...document.querySelectorAll(selector)].map(parent=>{let caption=parent.querySelector(':scope > '+tag);if(!caption){caption=document.createElement(tag);parent.prepend(caption)}return {parent,caption,scope:scopeFor(parent)}});
  const reserved=new Set(items.map(({caption})=>captionPrefix(caption,kind)?.[2]).filter(Boolean));const counters=new Map();
  for(const {parent,caption,scope} of items){
   let next=counters.get(scope)||1;
   const match=captionPrefix(caption,kind);let number=match?.[2];
   if(number){
    const local=number.startsWith(scope)?number.slice(scope.length):'';
    if(/^\d+$/.test(local))next=Math.max(next,Number(local)+1);
    // Remove only the existing label, retaining the caption's inline markup.
    const walker=document.createTreeWalker(caption,NodeFilter.SHOW_TEXT);let node,remaining=match[0].length;
    while(node=walker.nextNode()){if(remaining<=node.textContent.length){const range=document.createRange();range.setStart(caption,0);range.setEnd(node,remaining);range.deleteContents();break}remaining-=node.textContent.length}
   }else{while(reserved.has(scope+next))next++;number=scope+next++;reserved.add(number)}
   counters.set(scope,next);
   const walker=document.createTreeWalker(caption,NodeFilter.SHOW_TEXT);const textNodes=[];let node;
   while(node=walker.nextNode())if(node.textContent.trim())textNodes.push(node);
   if(textNodes.length&&textNodes.every(n=>getComputedStyle(n.parentElement).fontStyle==='italic')){
    caption.style.fontStyle='normal';
    caption.querySelectorAll('i,em').forEach(el=>el.replaceWith(...el.childNodes));
    caption.querySelectorAll('[style]').forEach(el=>{if(el.style.fontStyle==='italic')el.style.fontStyle='normal'});
   }
   const label=document.createElement('b');label.className='caption-label';label.textContent=kind+' '+number+'.';caption.prepend(label,document.createTextNode(' '));
   if(kind==='Figure')parent.querySelector('.figure-art')?.setAttribute('aria-label','Open Figure '+number+' in lightbox');
  }
 }
}
function populateNavigation(){
 prepareCaptions();
 const source=[...document.querySelectorAll('.prose h2,.prose h3')];
 const ids=new Set([...document.querySelectorAll('[id]')].map(e=>e.id));let section=0,sub=0;
 const rows=[],top=[];
 for(const h of source){
  if(!h.id){const stem=h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section';let id=stem,n=2;while(ids.has(id))id=stem+'-'+n++;h.id=id;ids.add(id)}
  const isSub=h.tagName==='H3';if(isSub){if(!section)continue;sub++}else{section++;sub=0;top.push(h)}
  const li=document.createElement('li');if(isSub)li.className='subsection';
  const a=document.createElement('a');a.href='#'+h.id;
  const title=document.createElement('span');title.className='toc-entry-title';
  const number=document.createElement('span');number.className='toc-section-number';number.textContent=isSub?section+'.'+sub:section+'.';
  title.append(number,document.createTextNode(h.textContent));
  const page=document.createElement('span');page.className='toc-page';page.dataset.pageFor=h.id;a.append(title,page);li.append(a);rows.push(li);
 }
 document.querySelector('.print-contents > ol').replaceChildren(...rows);
 for(const selector of ['.toc ol','.mobile-toc ol']){
  const list=document.querySelector(selector);list.replaceChildren();top.forEach((h,i)=>{const li=document.createElement('li'),a=document.createElement('a');a.href='#'+h.id;if(selector==='.toc ol'){const n=document.createElement('span');n.className='toc-number';n.textContent=String(i+1).padStart(2,'0');a.append(n)}const label=document.createElement('span');label.textContent=h.textContent;a.append(label);li.append(a);list.append(li)})
 }
 // Captions have one source; side captions are a screen-only presentation copy.
 document.querySelectorAll('.table-block').forEach(block=>{const caption=block.querySelector('caption');if(!caption)return;let side=block.querySelector('.table-side-caption');if(!side){side=document.createElement('div');side.className='table-side-caption';side.setAttribute('aria-hidden','true');block.append(side)}side.innerHTML=caption.innerHTML});
}
populateNavigation();
// One column is a detailed index; two columns are a top-level overview.
const contentsList=document.querySelector('.print-contents > ol');
const contentsRows=[...contentsList.children];
function arrangeContents(mode){
 const nav=document.querySelector('.print-contents');nav.querySelectorAll('ol,.toc-columns').forEach(el=>el.remove());
 if(mode!=='two'){const list=document.createElement('ol');contentsRows.forEach(row=>list.append(row));nav.append(list);return}
 const sections=contentsRows.filter(row=>!row.classList.contains('subsection'));
 const split=Math.ceil(sections.length/2);
 const columns=document.createElement('div');columns.className='toc-columns';for(const part of [sections.slice(0,split),sections.slice(split)]){const list=document.createElement('ol');part.forEach(row=>list.append(row));columns.append(list)}nav.append(columns);
}
function setPrintContents(value){const wasOn=document.body.classList.contains('with-print-contents');const mode=value==='on'?'one':['one','two'].includes(value)?value:'none';printContents.value=mode;document.body.dataset.contentsLayout=mode;document.body.classList.toggle('with-print-contents',mode!=='none');arrangeContents(mode);if(mode!=='none'&&!wasOn)setAbstract('plain');updatePDFLink()}
function setAbstract(value){abstract.checked=value!=='plain';document.body.classList.toggle('abstract-plain',!abstract.checked);updatePDFLink()}
function renderLabel(){
 const mode=labelType.value,value=mode==='category'?selectedCategory:mode==='prepared-for'?selectedPreparedFor:'';
 document.querySelector('.category-setting').hidden=mode!=='category';
 document.querySelector('.prepared-for-setting').hidden=mode!=='prepared-for';
 if(mode!=='category')customEditor.hidden=true;
 cat.hidden=!value;meta.classList.toggle('has-category',!!value);
 cat.querySelector('dt').textContent=mode==='prepared-for'?'Prepared for':'Category';cat.querySelector('dd').textContent=value;
 updateFooter();updateReaderLink();
}
function setLabel(value){
 labelType.value=['category','prepared-for'].includes(value)?value:'none';
 if(labelType.value==='category'&&!selectedCategory){selectedCategory='Research Paper';category.value=selectedCategory}
 renderLabel();
}
function setCategory(value){value=String(value||'').trim().slice(0,80);if(value==='__custom__')return;selectedCategory=value;
 if(value&&![...category.options].some(o=>o.value===value)){const option=new Option(value,value);category.add(option,category.querySelector('[value="__custom__"]'))}
 category.value=value||'Research Paper';customEditor.hidden=true;setLabel(value?'category':'none');
}
function setPreparedFor(value){selectedPreparedFor=String(value||'').trim().slice(0,160);renderLabel()}
function setDistribution(value){const allowed=['Public','Internal','Proprietary','Confidential'];distribution.value=allowed.includes(value)?value:'';const enabled=!!distribution.value;distributionField.hidden=!enabled;meta.classList.toggle('has-distribution',enabled);distributionField.querySelector('dd').textContent=distribution.value;
 updateFooter();updateReaderLink()}
function updateFooter(){
 const wording={Internal:'Internal use only',Proprietary:'Proprietary information',Confidential:'Confidential'};
 const categoryText=labelType.value==='category'?selectedCategory.replace(/[.\s]+$/,''):'';
 const footer=[config.organization||'WindBorne Systems',categoryText,wording[distribution.value]].filter(Boolean).join('. ')+'.';
 const confidential=distribution.value==='Confidential';
 const recommended=confidential?footer+' For authorized recipients only. Do not copy or distribute without '+(config.organization||'WindBorne Systems')+'’ permission.':footer;
 const custom=customFooterText(),firstFooter=custom||recommended;firstPageFooter.placeholder=recommended;
 document.querySelector('.doc-end').textContent=firstFooter;
 footerStyle.textContent='@page{@bottom-left{content:'+JSON.stringify(footer)+'}}@page:first{@bottom-left{content:'+JSON.stringify(firstFooter)+';'+((confidential||custom)?'width:100%;white-space:normal;overflow-wrap:anywhere;line-height:1.35;text-align:left;':'')+'}}';
}
function renderAuthors(){const dd=document.querySelector('.author-value'),mode=authorDetails.value;dd.replaceChildren();document.querySelector('.author-label').textContent=currentAuthors.length===1?'Author':'Authors';
 if(mode==='none'){dd.textContent=currentAuthors.map(a=>a.name).join(', ')}else{currentAuthors.forEach(a=>{const row=document.createElement('span');row.className='author-row';row.textContent=[a.name,...(['full','title'].includes(mode)?[a.title]:[]),...(mode==='title'?[]:[a.organization])].filter(Boolean).join(', ');dd.append(row)})}
 meta.classList.toggle('authors-long',currentAuthors.length>1||currentAuthors.map(a=>a.name).join(', ').length>50);updateReaderLink()}
abstract.onchange=()=>setAbstract(abstract.checked?'shaded':'plain');printContents.onchange=()=>setPrintContents(printContents.value);category.onchange=()=>{if(category.value==='__custom__'){customEditor.hidden=false;customInput.value='';customInput.focus()}else setCategory(category.value)};authorDetails.onchange=renderAuthors;
document.querySelector('.add-label').onclick=()=>{if(customInput.value.trim())setCategory(customInput.value);else customInput.focus()};customInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();document.querySelector('.add-label').click()}});
labelType.onchange=()=>setLabel(labelType.value);preparedFor.oninput=()=>setPreparedFor(preparedFor.value);
distribution.onchange=()=>setDistribution(distribution.value);
firstPageFooter.oninput=()=>{updateFooter();updateReaderLink()};
if(authors){authors.value=(params.get('authors')||config.defaults?.authors)==='many'?'many':'single';currentAuthors=authors.value==='many'?exampleAuthors:baseAuthors;authors.onchange=()=>{currentAuthors=authors.value==='many'?exampleAuthors:baseAuthors;renderAuthors()}}
if(['none','title','organization','full'].includes(params.get('details')))authorDetails.value=params.get('details');
const defaults={abstract:'plain',contents:'two',details:'title',category:'',preparedFor:'',distribution:'Confidential',firstPageFooter:'',...config.defaults};
defaults.label=config.defaults?.label??(defaults.preparedFor?'prepared-for':defaults.category?'category':'none');
if(!params.has('details'))authorDetails.value=defaults.details;
setPrintContents(params.has('contents')?params.get('contents'):defaults.contents);setAbstract(params.get('abstract')||defaults.abstract);setCategory(params.has('category')?params.get('category'):defaults.category);preparedFor.value=params.has('preparedFor')?params.get('preparedFor'):defaults.preparedFor;setPreparedFor(preparedFor.value);setLabel(params.has('label')?params.get('label'):params.has('preparedFor')?'prepared-for':params.has('category')?(params.get('category')?'category':'none'):defaults.label);renderAuthors();setDistribution(params.has('distribution')?params.get('distribution'):defaults.distribution);
addEventListener('beforeprint',()=>{if(!document.body.dataset.pdfBuild)document.body.classList.add('native-print')});addEventListener('afterprint',()=>document.body.classList.remove('native-print'));
async function printCurrent(){await document.fonts.ready;window.print()}
document.querySelector('.print-trigger').onclick=printCurrent;
function exportSettings(){return {abstract:abstract.checked?'shaded':'plain',contents:printContents.value,label:labelType.value,category:labelType.value==='category'?selectedCategory:'',preparedFor:labelType.value==='prepared-for'?selectedPreparedFor:'',distribution:distribution.value,details:authorDetails.value,authors:authors?.value||'single',firstPageFooter:customFooterText()}}
// Save only document settings; the article's content stays in the HTML source.
function refreshSaveState(clearFeedback=false){
 if(!saveButton)return;
 if(clearFeedback&&!saving)saveFeedback='';
 const current=exportSettings();const dirty=Object.keys(current).some(key=>current[key]!==savedDefaults[key]);
 saveButton.disabled=saving||!dirty;saveButton.setAttribute('aria-busy',String(saving));
 saveButton.querySelector('span').textContent=saving?'Saving…':'Save settings';
 saveStatus.textContent=saving?'':saveFeedback||(dirty?'Unsaved changes':'');
}
savedDefaults={authors:'single',...defaults};
saveButton=document.querySelector('.save-settings');saveStatus=document.querySelector('.save-status');
saveButton.addEventListener('click',async()=>{
 if(saving||saveButton.disabled)return;
 const snapshot=exportSettings();saving=true;saveFeedback='';refreshSaveState();
 try{
  const response=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({document:documentName,settings:snapshot,expected:savedDefaults})});
  if(!response.ok){const message=await response.text();throw Error(response.status===409?message:response.status===400?message:'Could not save. Open this document through the local editor and try again.')}
  const result=await response.json();savedDefaults=result.settings;config.defaults={...result.settings};
  const url=new URL(location.href);Object.keys(snapshot).forEach(key=>url.searchParams.delete(key));history.replaceState(null,'',url);
  saveFeedback=Object.keys(snapshot).some(key=>exportSettings()[key]!==snapshot[key])?'Saved; newer changes unsaved':'Saved';
 }catch(error){saveFeedback=error instanceof TypeError?'Could not save. Open this document through the local editor and try again.':error.message}
 finally{saving=false;refreshSaveState()}
});
refreshSaveState();
const status=document.createElement('p');status.className='export-status';status.setAttribute('role','status');status.hidden=true;document.querySelector('.options-panel').append(status);
let exporting=false;
document.querySelector('[data-pdf-link]').addEventListener('click',async e=>{
 if(config.published)return;
 e.preventDefault();if(exporting)return;
 const link=e.currentTarget,original=link.querySelector('span').textContent;
 // Open synchronously so browser popup protection doesn't swallow an async export.
 const viewer=window.open('about:blank','_blank');if(viewer)viewer.document.body.textContent='Preparing PDF…';
 exporting=true;link.setAttribute('aria-busy','true');link.querySelector('span').textContent='Preparing PDF…';
 try{
  const response=await fetch('/api/export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({document:documentName,settings:exportSettings()})});
  if(!response.ok)throw Error('Export unavailable');const result=await response.json();
  if(viewer)viewer.location.replace(result.url);else location.assign(result.url);
  status.hidden=true;
 }catch(error){
  if(viewer)viewer.close();
  // A published static document carries an exact baked PDF, never a mismatched preset.
  const exact=config.publishedSettings&&Object.entries(exportSettings()).every(([key,value])=>config.publishedSettings[key]===value);
  if(exact){location.assign(config.pdf||kind+'.pdf');return}
  status.textContent='PDF generation needs the local document server. Run npm start, open this document there, then choose View PDF. You can also use Print current version.';status.hidden=false;
  if(!editing)alert(status.textContent);else document.querySelector('.options').open=true;
 }finally{exporting=false;link.removeAttribute('aria-busy');link.querySelector('span').textContent=original}
});

// Help works on hover, keyboard focus and tap; Escape dismisses help first.
const helpControllers=[];
function closeOpenHelp(){const open=helpControllers.filter(c=>c.isOpen());open.forEach(c=>c.close());return open.length>0}
document.querySelectorAll('[data-help]').forEach(group=>{
 const button=group.querySelector('.help-trigger'),tooltip=group.querySelector('.help-tooltip');let pinned=false,timer;
 const close=()=>{clearTimeout(timer);pinned=false;tooltip.hidden=true;button.setAttribute('aria-expanded','false')};
 const show=()=>{clearTimeout(timer);helpControllers.forEach(c=>{if(c.button!==button)c.close()});tooltip.hidden=false;button.setAttribute('aria-expanded','true')};
 const leave=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!pinned&&document.activeElement!==button)close()},120)};
 helpControllers.push({button,close,isOpen:()=>!tooltip.hidden});
 button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show()});button.addEventListener('pointerleave',leave);
 tooltip.addEventListener('pointerenter',()=>clearTimeout(timer));tooltip.addEventListener('pointerleave',leave);
 button.addEventListener('focus',show);button.addEventListener('blur',()=>{if(!pinned)close()});
 button.addEventListener('click',()=>{if(pinned)close();else{show();pinned=true}});
 document.addEventListener('click',e=>{if(!group.contains(e.target))close()});
});
const settings=document.querySelector('.options');document.addEventListener('click',e=>{if(!settings.contains(e.target))settings.open=false});settings.addEventListener('keydown',e=>{if(e.key==='Escape'){if(closeOpenHelp()){e.preventDefault();e.stopPropagation();return}settings.open=false;settings.querySelector('summary').focus()}});
settings.addEventListener('toggle',()=>{if(!settings.open)closeOpenHelp()});
const toc=[...document.querySelectorAll('.toc a')];const headings=toc.map(a=>document.getElementById(a.hash.slice(1))).filter(Boolean);let scheduled=false;
function update(){const threshold=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)+4;let current=headings[0];for(const h of headings){if(h.getBoundingClientRect().top<=threshold)current=h}if(innerHeight+scrollY>=document.documentElement.scrollHeight-3)current=headings.at(-1);toc.forEach(a=>{if(a.hash==='#'+current?.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});scheduled=false}
function scheduleUpdate(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}addEventListener('scroll',scheduleUpdate,{passive:true});addEventListener('resize',scheduleUpdate);addEventListener('hashchange',scheduleUpdate);document.fonts.ready.then(scheduleUpdate);if(headings.length)update();
const dialog=document.querySelector('dialog');document.querySelectorAll('.figure-art').forEach(b=>b.onclick=()=>{const f=b.closest('figure');dialog.classList.toggle('photo-lightbox',f.classList.contains('figure-photo')&&f.classList.contains('figure-portrait'));const art=dialog.querySelector('.enlarged-art');art.innerHTML=b.innerHTML;art.querySelectorAll('[id]').forEach(el=>{const old=el.id;const next='lightbox-'+old;el.id=next;art.querySelectorAll('*').forEach(node=>{for(const attr of [...node.attributes]){if(attr.value.includes('url(#'+old+')'))node.setAttribute(attr.name,attr.value.replaceAll('url(#'+old+')','url(#'+next+')'))}})});dialog.querySelector('.enlarged-caption').innerHTML=f.querySelector('figcaption').innerHTML;dialog.showModal()});dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog)dialog.close()};
