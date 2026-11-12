'use strict';
(() => {
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const valid=url=>{try{const u=new URL(url);return u.protocol==='https:'&&/(^|\.)unity(?:3d)?\.com$/.test(u.hostname);}catch{return false;}};
  const byId=new Map((window.UNITY_OFFICIAL_VISUALS||[]).map(item=>[item.id,item]));
  window.officialFigureHTML = id => {
    const v=byId.get(id);if(!v||!valid(v.image)||!valid(v.source))return '';
    return `<figure class="official-figure ${v.compact?'compact-figure':''}" data-visual="${esc(id)}"><figcaption><span class="figure-kicker">对着图找 · ${esc(v.version)}</span><h4>${esc(v.title)}</h4></figcaption><div class="official-image-wrap"><button class="official-image-button" type="button" data-open-visual="${esc(id)}" aria-label="放大查看：${esc(v.title)}"><span class="official-image-canvas"><img class="official-image" src="${esc(v.image)}" alt="${esc(v.alt)}" width="${v.width}" height="${v.height}" loading="lazy" decoding="async">${(v.markers||[]).map(m=>`<span class="figure-marker" aria-hidden="true" style="left:${m.x}%;top:${m.y}%">${esc(m.label)}</span>`).join('')}</span></button><p class="image-fallback" role="status" hidden>官方图片暂未显示。可按下面的读图说明操作，或打开官方原页查看。</p></div><div class="figure-reading"><strong>这张图怎么看</strong><ol>${v.read.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="figure-action"><strong>现在做一步：</strong>${esc(v.action)}</p><p class="figure-note">${esc(v.note)}</p></div><div class="figure-source"><button type="button" class="text-button" data-open-visual="${esc(id)}">放大读图 ↗</button><a href="${esc(v.source)}" target="_blank" rel="noopener noreferrer">Unity 官方原页 · ${esc(v.sourceTitle)} ↗</a><span>图片 © Unity · 中文注解由本教材编写 · 图片需联网</span></div></figure>`;
  };
  window.lessonFiguresHTML=(id,section)=>(window.UNITY_LESSON_VISUALS?.[id]||[]).filter(v=>v.section===section).map(v=>window.officialFigureHTML(v.visual)).join('');
  let opener;
  const viewer=()=>document.getElementById('visual-dialog');
  function open(id,button){
    const v=byId.get(id),dialog=viewer();if(!v||!dialog)return;
    opener=button;dialog.querySelector('#visual-title').textContent=v.title;
    dialog.style.setProperty('--visual-native-width',v.width+'px');
    const img=dialog.querySelector('img');img.src=v.image;img.alt=v.alt;
    dialog.querySelectorAll('.figure-marker').forEach(marker=>marker.remove());
    img.parentElement.insertAdjacentHTML('beforeend',(v.markers||[]).map(m=>`<span class="figure-marker" aria-hidden="true" style="left:${m.x}%;top:${m.y}%">${esc(m.label)}</span>`).join(''));
    dialog.querySelector('.visual-dialog-scroll').classList.remove('visual-enlarged');
    dialog.querySelector('[data-visual-zoom]').setAttribute('aria-pressed','false');
    dialog.querySelector('[data-visual-zoom]').textContent='放大读细节';
    dialog.querySelector('.visual-dialog-caption').textContent=v.note;
    const link=dialog.querySelector('.visual-original');link.href=v.source;
    if(!dialog.open)dialog.showModal();
    const scroll=dialog.querySelector('.visual-dialog-scroll');scroll.scrollTo(0,0);
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-open-visual]');if(button){open(button.dataset.openVisual,button);return;}
    if(event.target.closest('[data-visual-close]'))viewer()?.close();
    const zoom=event.target.closest('[data-visual-zoom]');if(zoom){const active=viewer().querySelector('.visual-dialog-scroll').classList.toggle('visual-enlarged');zoom.setAttribute('aria-pressed',String(active));zoom.textContent=active?'缩回适应宽度':'放大读细节';}
  });
  document.addEventListener('error',event=>{
    const img=event.target;if(!(img instanceof HTMLImageElement)||!img.classList.contains('official-image'))return;
    const figure=img.closest('.official-figure');figure.classList.add('image-unavailable');figure.querySelector('.image-fallback').hidden=false;
  },true);
  document.addEventListener('load',event=>{
    const img=event.target;if(!(img instanceof HTMLImageElement)||!img.classList.contains('official-image'))return;
    const figure=img.closest('.official-figure');figure.classList.remove('image-unavailable');figure.querySelector('.image-fallback').hidden=true;
  },true);
  window.addEventListener('hashchange',()=>viewer()?.close());
  window.lessonFigureSearchText=id=>(window.UNITY_LESSON_VISUALS?.[id]||[]).map(item=>byId.get(item.visual)).filter(Boolean).map(v=>[v.title,v.alt,...v.read,v.action,v.note].join(' ')).join(' ');
  document.addEventListener('DOMContentLoaded',()=>viewer()?.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true});}));
})();
