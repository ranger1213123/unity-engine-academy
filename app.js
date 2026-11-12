'use strict';
(() => {
  const modules = (window.COURSE_MODULES || []).sort((a, b) => a.number - b.number);
  const lessons = modules.flatMap(module => module.lessons.map(lesson => ({...lesson, module})));
  const byId = new Map(lessons.map(lesson => [lesson.id, lesson]));
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rich = value => escapeHTML(value).replace(/`([^`]+)`/g, '<code>$1</code>');
  const number = value => String(value).padStart(2, '0');
  const lessonNumber = lesson => Number(lesson.id.slice(1));
  const codeFiles = lesson => lesson.code?.files || (lesson.code?.source ? [lesson.code] : []);
  const validURL = url => {try {const parsed = new URL(url); return parsed.protocol === 'https:' && /(^|\.)(unity3d\.com|unity\.com|unity\.cn)$/.test(parsed.hostname);} catch {return false;}};
  const link = ref => validURL(ref.url) ? `<a href="${escapeHTML(ref.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(ref.label)} <span aria-hidden="true">↗</span></a>` : escapeHTML(ref.label);
  const defaults = () => ({schema:1, completed:[], bookmarks:[], notes:{}, answers:{}, checks:{}, seconds:{}, lastLesson:null, theme:'light', updatedAt:null});
  let storageAvailable = true;
  let state;
  function normalizeState(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.schema !== 1) throw new Error('不是本教材的进度文件，或文件版本不受支持。');
    const clean = defaults();
    for (const field of ['completed', 'bookmarks']) clean[field] = [...new Set((Array.isArray(value[field]) ? value[field] : []).filter(id => byId.has(id)))];
    for (const lesson of lessons) {
      const id = lesson.id;
      if (typeof value.notes?.[id] === 'string') clean.notes[id] = value.notes[id].slice(0, 100000);
      if (Array.isArray(value.answers?.[id])) clean.answers[id] = lesson.quiz.map((quiz, i) => Number.isInteger(value.answers[id][i]) && value.answers[id][i] >= 0 && value.answers[id][i] < quiz.options.length ? value.answers[id][i] : null);
      if (Array.isArray(value.checks?.[id])) clean.checks[id] = [0,1,2].map(i => value.checks[id][i] === true);
      if (Number.isFinite(value.seconds?.[id]) && value.seconds[id] >= 0) clean.seconds[id] = Math.min(value.seconds[id], 36000000);
    }
    clean.lastLesson = byId.has(value.lastLesson) ? value.lastLesson : null;
    clean.theme = value.theme === 'dark' ? 'dark' : 'light';
    clean.updatedAt = typeof value.updatedAt === 'string' ? value.updatedAt : null;
    return clean;
  }
  const learners = window.createLearnerStore({defaults, normalizeState});
  state = learners.load();
  storageAvailable = learners.available;
  let currentLesson = null;
  let timerRunning = false;
  let lastTick = Date.now();
  let toastTimeout;
  let noteTimeout;
  let activePhase = 0;
  const phases = [
    {label:'建立引擎模型',range:[1,5],hours:125,description:'先理解对象、生命周期、空间和时间，再决定代码应该放在哪里。'},
    {label:'驾驭常用系统',range:[6,10],hours:125,description:'输入、物理、素材与动画：用实验理解系统边界，而不是记忆按钮。'},
    {label:'组织运行世界',range:[11,15],hours:125,description:'理解画面、界面、反馈、场景与数据之间的所有权和生命周期。'},
    {label:'走向工程与交付',range:[16,20],hours:125,description:'以测试和测量建立判断，学习扩展、并行计算和可验证的构建流程。'}
  ];
  const components=[
    ['Transform','通用','记录物体的位置、旋转和缩放。物体有父对象时，还能用相对于父对象的坐标描述它。','刚体或动画也可能修改位置。写移动脚本前，先决定由哪个系统负责最终位置。',['l016','l020']],
    ['MonoBehaviour','通用','让脚本接收 Awake、Update 等 Unity 回调。你写好函数，Unity 在相应阶段调用它。','Hierarchy 中排在上方的对象，其 Awake 不一定先执行。跨对象的初始化要另行安排。',['l011','l012','l015']],
    ['Rigidbody','3D','让三维物体按速度、质量和受力参与物理模拟，例如下落、弹起和被推开。','linearVelocity 的单位已经是每秒位移；设置速度时不再乘 deltaTime。施力和指定位置是不同操作。',['l031','l032']],
    ['Collider','3D','用盒子、球或网格等形状描述物体，供物理系统检测接触或射线命中。','两个形状重叠后是否收到碰撞回调，还取决于刚体类型、触发器和层碰撞设置。',['l031','l033','l034']],
    ['CharacterController','3D','让你用脚本指定角色怎样移动，并在移动时处理与环境的碰撞。','它不会自动执行动态刚体那套受力和重力模拟；需要的运动规则由脚本补上。',['l035']],
    ['Rigidbody2D','2D','让二维物体参与独立的 2D 物理模拟，可设置速度、刚体类型和插值。','它只与 2D 碰撞体配合。俯视游戏通常还要调整重力，并锁定不需要的旋转。',['l036','l039','l040']],
    ['Collider2D','2D','为二维物体提供接触形状。勾选 Is Trigger 后，可用来检测进入范围等事件。','触发器负责报告进入和离开，本身不把物体挡住；层设置仍可能过滤这些事件。',['l037','l038']],
    ['SpriteRenderer','2D','把 Sprite 显示在场景里，并控制它使用的材质、颜色和前后顺序。','纹理是图片资源，Sprite 可以是图片中的一个切片；动画片段再按时间切换这些切片。',['l041','l042','l052']],
    ['SortingGroup','2D','把一个角色的身体、武器等多张精灵组成一组，整体参与前后排序。','Sorting Layer 决定谁画在前面；物理 Layer 决定过滤和碰撞，两者用途不同。',['l052']],
    ['Animator','通用','根据控制器中的状态和参数选择动画，并把动画结果写到对象的相应属性。','角色不动时，沿着 Controller、默认状态、Motion 和属性路径逐项检查。只添加组件还不够。',['l046','l047','l050']],
    ['Camera','通用','决定从哪里、以什么投影方式观察场景，以及把结果画到哪里。','屏幕上的一个点对应空间中的一条方向线。转换为世界坐标时，还要给出深度或目标平面。',['l019','l051','l055']],
    ['MeshFilter + MeshRenderer','3D','MeshFilter 指定物体的网格形状；MeshRenderer 使用材质等设置，把它画出来。','读取 material 可能创建一份专用材质。共享素材和自己创建的副本，需要分别管理。',['l044','l053','l054']],
    ['Light / URP Light2D','可选包','为场景提供光照。三维 Light 与 URP 的 Light2D 用于不同的渲染配置。','Light2D 要配合 URP 2D Renderer 和能够受光的材质。配置不匹配时，加灯也不会照亮精灵。',['l052']],
    ['Canvas','UI','组织 uGUI 界面，例如血条、按钮和菜单；可显示在屏幕上，也可放进三维场景。','先确定 Render Mode，再检查相机、排序和缩放。界面上的一个像素不一定等于一个世界单位。',['l056','l060']],
    ['RectTransform','UI','描述界面矩形的位置和尺寸。锚点决定怎样跟随父矩形，轴心决定缩放和旋转的参考点。','Layout Group 等布局组件可能重新计算位置和尺寸。此时脚本手改数值，下一次布局就可能被覆盖。',['l057']],
    ['CanvasScaler','UI','规定屏幕尺寸变化时，整套界面按什么规则缩放。','设置参考分辨率后，还要测试宽屏、窄屏和安全区；一个分辨率下好看，并不能保证其他屏幕也合适。',['l056','l057']],
    ['EventSystem','UI','管理当前选中的界面元素，并协调鼠标、键盘和手柄等界面输入。','界面没反应或响应两次时，检查是否存在重复 EventSystem，以及输入模块是否匹配。',['l058']],
    ['InputSystemUIInputModule','可选包','把新版 Input System 收到的点击、移动和提交动作，交给 uGUI 的事件系统。','先安装 Input System 包，再检查 UI Actions 的绑定。只替换组件名，不会自动修好所有输入配置。',['l028','l058']],
    ['GraphicRaycaster + Button','UI','GraphicRaycaster 查找指针碰到了哪个界面图形；Button 再响应相应的点击操作。','完全透明的图形也可能拦截点击。按钮点击执行多次时，还要检查是否重复注册了监听函数。',['l058','l060']],
    ['UIDocument','UI','把 UI Toolkit 的界面结构挂到场景对象上，并指定它使用的面板设置。','UI Toolkit 的元素与 uGUI 组件使用不同接口，不能直接把两套按钮回调写法互换。',['l059','l060']],
    ['AudioSource','反馈','播放 AudioClip，并控制音量、空间位置以及声音送往哪个混音通道。','AudioClip 是声音素材，AudioSource 是播放器。多个音效同时播放时，还要限制数量、安排复用。',['l061','l062']],
    ['AudioListener','反馈','表示游戏中的听者。空间音频根据声音与听者的相对位置产生效果。','叠加加载两个都带监听器的场景，可能同时启用两个听者；需要确定保留哪一个。',['l061','l066']],
    ['ParticleSystem','反馈','按模块设置持续生成粒子，控制粒子的移动、颜色和消失过程。','停止发射后，已经生成的粒子可能仍在显示。回收前要检查 IsAlive，并考虑子粒子系统。',['l063','l064']],
    ['NavMeshAgent','可选包','利用导航网格寻找路线，再引导角色沿可通行区域移动。','导航、刚体和动画都可能改变角色位置。先决定谁负责移动，再让其他系统配合；导航网格构建组件由 AI Navigation 包提供。',['l091','l095']]
  ];
  function toast(message) {
    const element=$('#toast');element.textContent=message;element.hidden=false;
    clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>{element.hidden=true;},4200);
  }
  function save(options) {
    state.updatedAt = new Date().toISOString();
    state = learners.save(state, options);
    if(storageAvailable && !learners.available) toast('浏览器未能保存记录，请使用“导出进度”备份。');
    storageAvailable = learners.available;
    updateLearnerLabel();
  }
  function updateLearnerLabel() {
    $('#learner-name').textContent = learners.name;
    $('#storage-status').hidden = storageAvailable && !learners.message;
    $('#storage-status').textContent = learners.message || '当前浏览器无法持久保存记录。离开前请导出备份。';
  }
  function switchLearner(id) {
    tick();timerRunning=false;clearTimeout(noteTimeout);save();currentLesson=null;
    state=learners.select(id);storageAvailable=learners.available;lastTick=Date.now();
    applyTheme();route();
    toast('已切换到“'+learners.name+'”。');
  }
  function totalSeconds() {return Object.values(state.seconds).reduce((sum,value)=>sum+value,0);}
  function formatTime(seconds) {return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}
  function refreshTimerUI(){
    if(!currentLesson)return;
    ['#focus-timer','#focus-timer-inline'].forEach(selector=>{const element=$(selector);if(element)element.textContent=formatTime(state.seconds[currentLesson.id]||0);});
    ['#timer-toggle','#timer-toggle-inline'].forEach(selector=>{const button=$(selector);if(button)button.textContent=timerRunning?'暂停专注计时':'开始专注计时';});
  }
  function currentScore(lesson) {
    const answers=state.answers[lesson.id] || [];
    return {answered:lesson.quiz.filter((_,i)=>Number.isInteger(answers[i])).length, correct:lesson.quiz.filter((quiz,i)=>answers[i]===quiz.answer).length,total:lesson.quiz.length};
  }
  function prerequisitesHTML(lesson) {
    const prerequisites=(lesson.prerequisites || []).filter(id=>byId.has(id));
    return prerequisites.length ? `<div class="prereq">建议先修：${prerequisites.map(id=>`<a href="#lesson/${id}">${escapeHTML(byId.get(id).title)}</a>`).join('')}</div>` : '<div class="prereq">起点课程 · 准备一个 Unity 6.3 LTS 空白学习项目。</div>';
  }
  function updateSidebar() {
    $('#chapter-nav').innerHTML=modules.map(module=>`<details class="chapter-item ${currentLesson?.module.id===module.id?'current':''}" ${currentLesson?.module.id===module.id?'open':''}><summary><span class="chapter-number">${number(module.number)}</span><span>${escapeHTML(module.title)}</span></summary><div class="chapter-lessons">${module.lessons.map(lesson=>`<a href="#lesson/${lesson.id}" class="${currentLesson?.id===lesson.id?'current':''}" ${currentLesson?.id===lesson.id?'aria-current="page"':''}>${escapeHTML(lesson.title)}${state.completed.includes(lesson.id)?'<span class="done-label" aria-label="已完成">✓</span>':''}</a>`).join('')}</div></details>`).join('');
    $('#side-progress-text').textContent=`学习旅程 · ${state.completed.length} / ${lessons.length} 课`;
    const percent=lessons.length?Math.round(state.completed.length/lessons.length*100):0;
    $('#side-progress-percent').textContent=`${percent}%`;
    $('#side-progress').value=percent;
    const route=(location.hash.slice(1).split('/')[0] || 'home');
    $$('.primary-nav a').forEach(anchor=>anchor.classList.toggle('active',anchor.dataset.route===route));
  }
  function moduleRow(module) {
    const complete=module.lessons.filter(lesson=>state.completed.includes(lesson.id)).length;
    return `<article class="module-row"><span class="index">${number(module.number)}</span><div><h3><a href="#lesson/${module.lessons[0].id}">${escapeHTML(module.title)}</a></h3><p>${escapeHTML(module.subtitle || module.description)}</p><span class="module-meta">5 LESSONS · 25 HOURS <span aria-label="已完成"> · ${complete}/5</span></span><div class="mini-line" aria-hidden="true"><span style="width:${complete*20}%"></span></div></div><a href="#lesson/${module.lessons[0].id}" aria-label="学习${escapeHTML(module.title)}">↗</a></article>`;
  }
  function home() {
    const next=byId.get(state.lastLesson) || lessons.find(lesson=>!state.completed.includes(lesson.id)) || lessons[0];
    const studied=(totalSeconds()/3600).toFixed(1);
    return `<section class="hero"><div><p class="eyebrow">A FIELD GUIDE TO THE UNITY ENGINE</p><h1>从实现一个功能，<br>到理解<em>整个引擎。</em></h1><p class="hero-copy">把零散的 API，连成清晰的引擎模型。从 MonoBehaviour 的第一次唤醒，到最终构建里的每一帧，用官方文档、可复现实验与独立练习，建立自己的判断。</p><div class="hero-buttons"><a class="button" href="#lesson/${next.id}">${state.lastLesson?'继续我的学习':'开始第一课'} <span aria-hidden="true">↗</span></a><a class="quiet-link" href="#roadmap">探索完整路线 <span aria-hidden="true">→</span></a></div></div><div class="hero-art" aria-hidden="true"><svg viewBox="0 0 340 330" fill="none"><circle cx="170" cy="156" r="126" stroke="currentColor" opacity=".16"/><circle cx="170" cy="156" r="95" stroke="currentColor" opacity=".18" stroke-dasharray="2 6"/><ellipse cx="170" cy="156" rx="143" ry="59" transform="rotate(-35 170 156)" stroke="currentColor" opacity=".3"/><path d="M95 141 170 98l75 43-75 44-75-44Z" fill="currentColor" opacity=".17"/><path d="m95 141 75 44v85l-75-44v-85Z" fill="currentColor" opacity=".08"/><path d="m170 185 75-44v85l-75 44v-85Z" fill="currentColor" opacity=".22"/><path d="m95 141 75-43 75 43v85l-75 44-75-44v-85Zm0 0 75 44 75-44m-75 44v85m-47-145 75 43v85m-56-139 75 43v85" stroke="currentColor" opacity=".65"/><circle cx="59" cy="91" r="5" fill="currentColor"/><circle cx="289" cy="112" r="3" fill="currentColor"/><circle cx="245" cy="265" r="4" fill="currentColor"/><path d="M59 91H18m271 21h31M245 265l26 29h47" stroke="currentColor" opacity=".4"/><text x="18" y="78" fill="currentColor" font-size="8" font-family="monospace" letter-spacing="1.4">LIFECYCLE</text><text x="265" y="101" fill="currentColor" font-size="8" font-family="monospace">SYSTEMS</text><text x="273" y="310" fill="currentColor" font-size="8" font-family="monospace">RUNTIME</text></svg><span class="art-label">UNDERSTAND WHAT HAPPENS WITHIN.</span></div></section>
    <section class="metrics" aria-label="课程概况"><div class="metric"><strong>500<span>小时</span></strong><small>阅读 · 实验 · 练习 · 复盘</small></div><div class="metric"><strong>20<span>章节</span></strong><small>由基础到工程的完整路径</small></div><div class="metric"><strong>100<span>课程</span></strong><small>每课有实验与自测</small></div><div class="metric"><strong>${studied}<span>小时</span></strong><small>你已记录的专注时间</small></div></section>
    <div class="section-heading"><h2>你的下一次探索</h2><p>小步实验，反复建立直觉</p></div><article class="continue-card"><div class="continue-index">${number(lessonNumber(next))}</div><div><span class="small-label">CHAPTER ${number(next.module.number)} · ${escapeHTML(next.module.title)}</span><h3>${escapeHTML(next.title)}</h3><p>5 小时学习单元 · ${next.goals?.[0]?escapeHTML(next.goals[0]):'建立可验证的引擎模型'}</p></div><a href="#lesson/${next.id}" class="button secondary">进入课程 <span aria-hidden="true">→</span></a></article>
    <div class="section-heading"><h2>一张通往引擎深处的地图</h2><p>四个阶段 · 循序深入</p></div><div class="phase-tabs" role="tablist" aria-label="学习阶段">${phases.map((phase,i)=>`<button type="button" role="tab" id="phase-tab-${i}" aria-controls="module-grid" aria-selected="${activePhase===i}" class="${activePhase===i?'active':''}" data-phase="${i}"><span>0${i+1}</span>${phase.label}</button>`).join('')}</div><div class="module-grid" id="module-grid" role="tabpanel" aria-labelledby="phase-tab-${activePhase}">${modules.filter(module=>module.number>=phases[activePhase].range[0]&&module.number<=phases[activePhase].range[1]).map(moduleRow).join('')}</div>
    <aside class="learning-note"><span class="note-symbol" aria-hidden="true">知</span><div><h3>学习引擎，不止记住函数名。</h3><p>每次先写下预测，再打开 Unity 验证。记录“我以为会发生什么”与“实际发生了什么”，差异就是最有价值的一页笔记。课时是实作预算，不是阅读进度；完整练习的证据比连续打卡更重要。</p></div></aside>`;
  }
  function roadmap() {
    return `<p class="eyebrow">THE 500-HOUR LEARNING PATH</p><h1 class="page-title">以原理为经，以实验为纬。</h1><p class="page-lede">100 课，每课 300 分钟。建议每周安排 10 小时，约 50 周完成；也可按自己的节奏推进。前置知识不足时返回先修课，已经熟悉的章节用实验与自测验收，而不是仅凭“看过”跳过。</p><div class="time-budget"><span>每课参考预算</span><span>阅读与预测<strong>50 min</strong></span><span>引擎实验<strong>120 min</strong></span><span>独立练习<strong>75 min</strong></span><span>自测回忆<strong>35 min</strong></span><span>复盘归档<strong>20 min</strong></span></div>${phases.map((phase,i)=>`<section class="roadmap-phase"><p class="eyebrow">PHASE 0${i+1} · ${phase.hours} HOURS</p><h2>${phase.label}</h2><p>${phase.description}</p>${modules.filter(module=>module.number>=phase.range[0]&&module.number<=phase.range[1]).map(module=>`<details class="roadmap-module" ${i===0?'open':''}><summary><span class="index">${number(module.number)}</span><h3>${escapeHTML(module.title)}</h3><small>5 课 · 25 小时</small></summary><div class="roadmap-lessons"><p class="chapter-description">${escapeHTML(module.description)}</p>${module.lessons.map(lesson=>`<a href="#lesson/${lesson.id}" class="lesson-row ${state.completed.includes(lesson.id)?'completed':''}"><span class="num">${number(lessonNumber(lesson))}</span><span class="title">${escapeHTML(lesson.title)}</span><span class="status">${state.completed.includes(lesson.id)?'✓ 已完成':'5 小时 →'}</span></a>`).join('')}</div></details>`).join('')}</section>`).join('')}`;
  }
  function codeHTML(lesson) {
    const files=codeFiles(lesson);if(!files.length)return '';
    return `<h3>${escapeHTML(lesson.code.title)}</h3>${files.map((file,index)=>`<div class="code-block"><div class="code-toolbar"><span>${escapeHTML(file.filename || lesson.code.language || '实验示例')}</span><button type="button" data-copy-code="${index}">复制代码</button></div><pre><code>${escapeHTML(file.source)}</code></pre></div>`).join('')}<div class="code-explanation">${(lesson.code.explanation || []).map(paragraph=>`<p>${rich(paragraph)}</p>`).join('')}</div>`;
  }
  function teachingHTML(lesson) {
    const guide=lesson.teaching;if(!guide)return '';
    const table=guide.comparison;
    const comparison=table?`<div class="comparison-scroll" tabindex="0" role="region" aria-label="本课条件对照表"><table class="teaching-comparison"><caption>${rich(table.caption)}</caption><thead><tr>${table.headers.map(header=>`<th scope="col">${rich(header)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row=>`<tr>${row.map((cell,index)=>index?`<td>${rich(cell)}</td>`:`<th scope="row">${rich(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
    return `<section id="start" class="lesson-guide"><h2>从一个具体问题开始</h2><p class="opening-question">${rich(guide.question)}</p><div class="key-idea"><strong>这一课的关键</strong><p>${rich(guide.keyIdea)}</p></div><h3>跟着例子走一遍</h3><ol class="walkthrough">${guide.walkthrough.map(step=>`<li><h4>${rich(step.title)}</h4><p>${rich(step.text)}</p></li>`).join('')}</ol>${comparison}<div class="prediction"><h3>换个条件，你能预测结果吗？</h3><p>${rich(guide.prediction.question)}</p><details class="prediction-answer"><summary>想好后，展开解释</summary><div class="prediction-explanation"><p>${rich(guide.prediction.answer)}</p></div></details></div></section>`;
  }
  function quizHTML(lesson) {
    return lesson.quiz.map((quiz,index)=>`<fieldset class="quiz-item" style="border-left:0;border-right:0;border-bottom:0;padding-left:0;padding-right:0"><legend class="sr-only">问题 ${index+1}</legend><h3>${index+1}. ${rich(quiz.question)}</h3>${quiz.options.map((option,optionIndex)=>`<label class="quiz-option"><input type="radio" name="quiz-${lesson.id}-${index}" value="${optionIndex}" data-quiz="${index}" ${state.answers[lesson.id]?.[index]===optionIndex?'checked':''}><span>${String.fromCharCode(65+optionIndex)}. ${rich(option)}</span></label>`).join('')}<div id="quiz-feedback-${index}" class="quiz-feedback" hidden></div></fieldset>`).join('');
  }
  function lessonPage(lesson) {
    const index=lessons.findIndex(item=>item.id===lesson.id), prev=lessons[index-1], next=lessons[index+1];
    const sections=[['goals','学习目标'],...(lesson.teaching?[['start','先看一个例子']]:[]),['theory','理解原理'],['experiment','动手实验'],['pitfalls','故障与误区'],['exercise','独立练习'],['quiz','自测与解析'],['references','官方依据'],['notes','笔记与验收']];
    return `<button class="focus-exit" id="exit-focus">退出沉浸阅读 · Esc</button><div class="reader-layout"><article class="reader-content"><header class="lesson-header"><p class="eyebrow">CHAPTER ${number(lesson.module.number)} · LESSON ${String(lessonNumber(lesson)).padStart(3,'0')}</p><h1>${escapeHTML(lesson.title)}</h1><div class="lesson-meta"><span>第 ${lesson.module.number} 章 · ${escapeHTML(lesson.module.title)}</span><span>5 小时完整学习</span><span>${state.completed.includes(lesson.id)?'✓ 已通过学习验收':'理解 → 预测 → 实验 → 迁移'}</span></div>${prerequisitesHTML(lesson)}<div class="lesson-tools"><button class="button secondary small" id="focus-mode">进入沉浸阅读 ↗</button><button class="text-button bookmark ${state.bookmarks.includes(lesson.id)?'active':''}" id="bookmark" aria-pressed="${state.bookmarks.includes(lesson.id)}">${state.bookmarks.includes(lesson.id)?'★ 已收藏':'☆ 收藏本课'}</button><button class="text-button" id="print-lesson">打印 / 保存 PDF</button></div></header>
    <section id="goals"><h2>这一课，你将能够</h2><ul class="goal-list">${lesson.goals.map(goal=>`<li>${rich(goal)}</li>`).join('')}</ul><div class="time-budget">${lesson.timePlan.map(item=>`<span>${escapeHTML(item.label)}<strong>${item.minutes} min</strong></span>`).join('')}</div></section>
    ${teachingHTML(lesson)}<section id="theory"><h2>一步步理解原理</h2>${lesson.theory.map((section,index)=>`<section class="concept-section"><h3>${index+1}. ${escapeHTML(section.title)}</h3>${section.paragraphs.map(paragraph=>`<p>${rich(paragraph)}</p>`).join('')}</section>`).join('')}${codeHTML(lesson)}</section>
    <section id="experiment"><h2>打开 Unity，验证你的预测</h2><p class="code-explanation">先记录预期，再执行步骤，最后对比观察结果。时间预算包含搭建、重复实验、排错和整理证据。</p>${lesson.lab.map((lab,index)=>`<section class="lab-step"><h3><span>LAB 0${index+1} · ${lab.minutes} MIN</span>${escapeHTML(lab.title)}</h3><ol>${lab.steps.map(step=>`<li>${rich(step)}</li>`).join('')}</ol><div class="expected"><strong>应观察到：</strong>${rich(lab.result)}</div></section>`).join('')}</section>
    <section id="pitfalls"><h2>当结果与你想的不一样</h2>${lesson.pitfalls.map(item=>`<article class="pitfall"><h3>${rich(item.symptom)}</h3><p><strong>为什么：</strong>${rich(item.cause)}</p><p><strong>怎么验证和修复：</strong>${rich(item.fix)}</p></article>`).join('')}</section>
    <section id="exercise"><h2>合上讲义，独立完成一次</h2><p>${rich(lesson.exercise.brief)}</p><h3>需要留下的证据</h3><ul>${lesson.exercise.deliverables.map(item=>`<li>${rich(item)}</li>`).join('')}</ul><table class="rubric"><thead><tr><th scope="col">验收标准</th><th scope="col">分值</th></tr></thead><tbody>${lesson.exercise.rubric.map(item=>`<tr><td>${rich(item.item)}</td><td>${item.points}</td></tr>`).join('')}<tr><th scope="row">总分 · 自评 80 分及以上通过</th><td>100</td></tr></tbody></table></section>
    <section id="quiz"><h2>检验你的引擎直觉</h2><p class="code-explanation">每题先做出预测，再提交查看解析。答案可反复修改，目标是能解释原因。</p>${quizHTML(lesson)}<div id="quiz-summary" class="quiz-summary" aria-live="polite"></div><button class="button secondary small" id="grade-quiz">提交自测并查看解析</button></section>
    <section id="references"><h2>回到官方文档</h2><p class="code-explanation">讲义是原创解释；API 行为以相应版本官方文档为准。包文档可能独立于编辑器更新，安装前核对兼容版本。</p><ul class="reference-list">${lesson.references.map(ref=>`<li>${link(ref)}</li>`).join('')}</ul><h3>离开前，用自己的话回答</h3><ul class="goal-list">${lesson.summary.map(item=>`<li>${rich(item)}</li>`).join('')}</ul></section>
    <section id="notes"><h2>把“我以为”写成“我验证过”</h2><label class="sr-only" for="lesson-notes">本课笔记</label><textarea id="lesson-notes" class="lesson-notes" placeholder="我的预测：\n实际观察：\n差异与原因：\n下一次要验证的问题：">${escapeHTML(state.notes[lesson.id] || '')}</textarea><small id="note-saved" class="saved-label">${storageAvailable?'笔记仅保存在当前浏览器，请定期导出备份。':'浏览器存储不可用，请导出进度保留笔记。'}</small><div class="completion-panel"><h3>本课验收</h3>${['完成两组实验，并保存对照记录或截图','独立完成迁移练习，按评分标准自评达到 80 分','能够脱离讲义，解释本课关键原理及适用边界'].map((text,i)=>`<label class="check-row"><input type="checkbox" data-check="${i}" ${state.checks[lesson.id]?.[i]?'checked':''}><span>${text}</span></label>`).join('')}<p id="completion-hint">自测达到 80%，并完成以上三项后，标记本课完成。</p><button class="button" id="complete-lesson">${state.completed.includes(lesson.id)?'✓ 已完成 · 撤销标记':'完成本课学习 →'}</button></div></section>
    <nav class="lesson-pagination" aria-label="前后课程">${prev?`<a href="#lesson/${prev.id}"><small>← 上一课</small>${escapeHTML(prev.title)}</a>`:'<a href="#roadmap"><small>← 学习路线</small>查看全书目录</a>'}${next?`<a href="#lesson/${next.id}"><small>下一课 →</small>${escapeHTML(next.title)}</a>`:'<a href="#roadmap"><small>回顾全书 →</small>让证据成为你的毕业作品</a>'}</nav></article>
    <aside class="reader-toc"><h3>这一课的路径</h3>${sections.map(([id,label],i)=>`<a href="#${id}" data-section="${id}">${number(i+1)} &nbsp;${label}</a>`).join('')}<div class="focus-box"><label>本课专注 · 实际记录</label><div class="timer-value" id="focus-timer">${formatTime(state.seconds[lesson.id] || 0)}</div><button class="button secondary" id="timer-toggle">开始专注计时</button><small>只在页面可见时计时。切换课程、隐藏页面会暂停；离线实验时间可写入笔记。</small></div></aside></div>`;
  }
  function grade(lesson, silent=false) {
    const score=currentScore(lesson),answers=state.answers[lesson.id]||[];
    lesson.quiz.forEach((quiz,index)=>{
      const feedback=$(`#quiz-feedback-${index}`);if(!feedback)return;
      const answered=Number.isInteger(answers[index]);feedback.hidden=!answered;
      feedback.classList.toggle('incorrect',answers[index]!==quiz.answer);
      feedback.innerHTML=`<strong>${answers[index]===quiz.answer?'判断正确':'再想一想'} · 正确答案 ${String.fromCharCode(65+quiz.answer)}</strong><br>${rich(quiz.explanation)}`;
    });
    $('#quiz-summary').textContent=`已回答 ${score.answered}/${score.total} 题 · 正确 ${score.correct} 题${score.answered===score.total?` · ${Math.round(score.correct/score.total*100)}%`:''}`;
    if(!silent&&score.answered<score.total)toast('还有未回答的问题。已回答题目的解析已展开。');
    updateCompletion(lesson);
  }
  function updateCompletion(lesson) {
    const done=state.completed.includes(lesson.id), score=currentScore(lesson);
    const canComplete=score.answered===score.total&&score.correct/score.total>=.8&&[0,1,2].every(i=>state.checks[lesson.id]?.[i]);
    $('#complete-lesson').disabled=!done&&!canComplete;
    $('#complete-lesson').textContent=done?'✓ 已完成 · 撤销标记':'完成本课学习 →';
    $('#completion-hint').textContent=done?'已记录学习验收；需要重新练习时，可撤销完成标记。':canComplete?'验收条件已齐，确认后计入已完成课程。':'自测达到 80%，并完成以上三项后，标记本课完成。';
  }
  function attachLesson(lesson) {
    $$('[data-copy-code]').forEach(button=>button.addEventListener('click',async()=>{
      const source=codeFiles(lesson)[Number(button.dataset.copyCode)].source;
      try {await navigator.clipboard.writeText(source);toast('代码已复制。请按课内前提在 Unity 中验证。');} catch {
        const textarea=document.createElement('textarea');textarea.value=source;textarea.style.position='fixed';textarea.style.opacity='0';document.body.append(textarea);textarea.select();
        const copied=document.execCommand('copy');textarea.remove();toast(copied?'代码已复制。':'浏览器禁止复制，请在代码框中手动选择并复制。');
      }
    }));
    $('#bookmark').addEventListener('click',()=>{const index=state.bookmarks.indexOf(lesson.id);if(index>=0)state.bookmarks.splice(index,1);else state.bookmarks.push(lesson.id);save();const button=$('#bookmark');button.classList.toggle('active',index<0);button.setAttribute('aria-pressed',String(index<0));button.textContent=index<0?'★ 已收藏':'☆ 收藏本课';toast(index<0?'已加入“我的学习笔记”的收藏。':'已取消收藏。');});
    $('#focus-mode').addEventListener('click',()=>{document.body.classList.add('reading-focus');window.scrollTo(0,0);});
    $('#exit-focus').addEventListener('click',()=>document.body.classList.remove('reading-focus'));
    $('#print-lesson').addEventListener('click',()=>window.print());
    $$('[data-section]').forEach(anchor=>anchor.addEventListener('click',event=>{event.preventDefault();document.getElementById(anchor.dataset.section)?.scrollIntoView({behavior:'smooth'});}));
    $$('[data-quiz]').forEach(input=>input.addEventListener('change',()=>{state.answers[lesson.id]||=[];state.answers[lesson.id][Number(input.dataset.quiz)]=Number(input.value);save();const feedback=$(`#quiz-feedback-${input.dataset.quiz}`);feedback.hidden=true;$('#quiz-summary').textContent='答案已保存。提交自测后查看本次解析。';updateCompletion(lesson);}));
    $('#grade-quiz').addEventListener('click',()=>grade(lesson));
    $$('[data-check]').forEach(input=>input.addEventListener('change',()=>{state.checks[lesson.id]||=[];state.checks[lesson.id][Number(input.dataset.check)]=input.checked;save();updateCompletion(lesson);}));
    $('#lesson-notes').addEventListener('input',event=>{state.notes[lesson.id]=event.target.value;$('#note-saved').textContent='正在保存…';clearTimeout(noteTimeout);noteTimeout=setTimeout(()=>{save();const label=$('#note-saved');if(label)label.textContent=storageAvailable?'已自动保存 · '+new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}):'浏览器存储不可用，请导出进度。';},500);});
    $('#complete-lesson').addEventListener('click',()=>{if(state.completed.includes(lesson.id)){state.completed=state.completed.filter(id=>id!==lesson.id);toast('已撤销完成标记，笔记和自测保留。');}else{state.completed.push(lesson.id);toast('本课已完成。带着你的证据进入下一课。');}save();updateSidebar();updateCompletion(lesson);});
    const tools=$('.lesson-tools');
    const timerButton=document.createElement('button');timerButton.type='button';timerButton.className='text-button';timerButton.id='timer-toggle-inline';timerButton.textContent='开始专注计时';tools.append(timerButton);
    const timerDisplay=document.createElement('span');timerDisplay.className='timer-inline';timerDisplay.id='focus-timer-inline';timerDisplay.setAttribute('aria-label','本课专注时间');tools.append(timerDisplay);
    ['#timer-toggle','#timer-toggle-inline'].forEach(selector=>$(selector)?.addEventListener('click',()=>{tick();timerRunning=!timerRunning;lastTick=Date.now();refreshTimerUI();}));
    refreshTimerUI();
    updateCompletion(lesson);
  }
  function collectSources() {
    const map=new Map();for(const lesson of lessons)for(const ref of lesson.references){if(!map.has(ref.url))map.set(ref.url,{...ref,lessons:[]});map.get(ref.url).lessons.push(lesson.id);}return [...map.values()];
  }
  function referencesPage() {
    return `<p class="eyebrow">READ THE SOURCE</p><h1 class="page-title">让每个判断，都能回到依据。</h1><p class="page-lede">全书引用来自 Unity 官方手册、脚本 API 与官方包文档。编辑器基线为 6000.3；示例包以当前学习项目的 Input System 1.20、URP 17.3 为主。阅读包文档时同时核对版本与安装条件。</p><div class="reference-filter"><label class="sr-only" for="reference-search">筛选官方文档</label><input id="reference-search" class="filter-input" type="search" placeholder="筛选 API、主题或文档地址…"><span class="code-explanation" id="source-count"></span></div><div id="source-list"></div><aside class="learning-note"><span class="note-symbol" aria-hidden="true">源</span><div><h3>版本和上下文，是文档的一部分。</h3><p>旧版教程中的 Rigidbody.velocity、内置 Input、渲染管线或编辑器界面可能与本书不同。先检查编辑器、包版本和对象状态，再判断代码是否适用。链接检查记录和教材审校边界见目录中的 sources-audit.json 与 REVIEW.md。</p></div></aside>`;
  }
  function renderSources(query='') {
    const filtered=collectSources().filter(ref=>(ref.label+' '+ref.url).toLowerCase().includes(query.toLowerCase()));
    $('#source-count').textContent=`${filtered.length} 份官方文档`;
    $('#source-list').innerHTML=filtered.map(ref=>`<article class="source-row"><div>${link(ref)}<small>${escapeHTML(ref.url)}</small></div><div class="used-in">用于 ${ref.lessons.length} 课<br><a href="#lesson/${ref.lessons[0]}">从相关课程开始 →</a></div></article>`).join('')||'<p class="empty-state">没有匹配文档。试试英文 API 名称。</p>';
  }
  function notesPage() {
    const noted=lessons.filter(lesson=>state.notes[lesson.id]?.trim());
    const bookmarks=lessons.filter(lesson=>state.bookmarks.includes(lesson.id));
    return `<p class="eyebrow">YOUR FIELD NOTES</p><h1 class="page-title">经验，要留下可回看的证据。</h1><p class="page-lede">当前档案：<strong>${escapeHTML(learners.name)}</strong>。笔记、收藏和学习进度仅保存在这个浏览器的这份档案中。<a href="#learners">切换或新建学习档案 →</a> 建议每周导出备份，换设备时导入恢复。专注时间只统计主动开启的可见阅读时间，不代表全部实作时长。</p><div class="metrics"><div class="metric"><strong>${state.completed.length}<span>课</span></strong><small>通过自测与实作验收</small></div><div class="metric"><strong>${noted.length}<span>篇</span></strong><small>已留下的学习记录</small></div><div class="metric"><strong>${(totalSeconds()/3600).toFixed(1)}<span>小时</span></strong><small>实际记录的网页专注时间</small></div></div><div class="hero-buttons"><button class="button secondary small" id="notes-export">导出当前档案 ↗</button><button class="button secondary small" id="notes-import">导入学习记录</button></div><section class="notes-section"><h2>收藏的课程</h2>${bookmarks.length?bookmarks.map(lesson=>`<a href="#lesson/${lesson.id}" class="lesson-row"><span class="num">${number(lessonNumber(lesson))}</span><span class="title">${escapeHTML(lesson.title)}</span><span class="status">继续阅读 →</span></a>`).join(''):'<p class="empty-state">在课程页点击“收藏本课”，把需要反复阅读的原理留在这里。</p>'}</section><section class="notes-section"><h2>实验与思考</h2>${noted.map(lesson=>`<article class="note-entry"><h3><a href="#lesson/${lesson.id}">${number(lessonNumber(lesson))} · ${escapeHTML(lesson.title)} ↗</a></h3><p>${escapeHTML(state.notes[lesson.id])}</p></article>`).join('')||'<p class="empty-state">每课底部都有笔记区。先记录一个与你预期不一致的结果，学习就从这里开始。</p>'}</section>`;
  }
  function learnersPage() {
    return `<p class="eyebrow">YOUR LEARNING SPACE</p><h1 class="page-title">每个人，留下一份自己的学习记录。</h1><p class="page-lede">每个浏览器分别保存自己的记录。多人共用同一个浏览器时，请各建一份学习档案，并在学习前切换到自己的档案，分别记录进度、笔记、收藏、自测和专注时间。</p><section class="learner-panel"><h2>当前浏览器中的学习档案</h2><p class="learner-hint">当前：<strong>${escapeHTML(learners.name)}</strong>。切换档案会保存当前记录，并暂停专注计时。</p><div class="learner-list">${learners.list().map(profile=>`<article class="learner-card"><div><h3>${escapeHTML(profile.name)}</h3><p>${profile.id===learners.activeId?'正在使用这份学习档案':'独立保存的学习记录'}</p></div>${profile.id===learners.activeId?'<span class="learner-current">当前档案</span>':`<button class="button secondary small" data-learner="${escapeHTML(profile.id)}">切换到此档案</button>`}</article>`).join('')}</div><form id="create-learner" class="learner-form"><label for="new-learner-name">创建一份空白档案</label><div><input id="new-learner-name" name="name" maxlength="40" required placeholder="例如：小林的引擎笔记" autocomplete="off"><button class="button small" type="submit">创建并切换</button></div><small>只需一个便于区分的名称，无需填写真实姓名。</small></form><form id="rename-learner" class="learner-form"><label for="rename-learner-name">修改当前档案名称</label><div><input id="rename-learner-name" name="name" maxlength="40" required value="${escapeHTML(learners.name)}" autocomplete="off"><button class="button secondary small" type="submit">保存名称</button></div></form></section><aside class="learning-note"><span class="note-symbol" aria-hidden="true">存</span><div><h2>记录保存在这里，也由你带走。</h2><p>学习档案是本机记录，不是登录账号。同一浏览器的使用者可以切换这些档案；请使用各自的浏览器用户配置来隔开私人内容。</p><p>网站不会把笔记与进度上传到 GitHub。清除网站数据、使用无痕窗口、换浏览器或换设备后，需通过备份恢复。<strong>目前不提供账号登录或跨设备自动同步。</strong>学习记录也不会自动从本地文件迁移到在线地址。</p><div class="hero-buttons"><button class="button secondary small" id="learner-export">导出当前档案</button><button class="button secondary small" id="learner-import">从备份恢复到当前档案</button></div></div></aside>`;
  }
  function attachLearners() {
    $$('[data-learner]').forEach(button=>button.addEventListener('click',()=>switchLearner(button.dataset.learner)));
    $('#create-learner').addEventListener('submit',event=>{event.preventDefault();try{const id=learners.create($('#new-learner-name').value);switchLearner(id);}catch(error){toast(error.message);}});
    $('#rename-learner').addEventListener('submit',event=>{event.preventDefault();try{learners.rename($('#rename-learner-name').value);route();toast('已更新档案名称。');}catch(error){toast(error.message);}});
    $('#learner-export').addEventListener('click',exportProgress);$('#learner-import').addEventListener('click',importProgress);
  }
  function componentsPage(){
    return `<p class="eyebrow">THE COMPONENT FIELD GUIDE</p><h1 class="page-title">每个组件，具体负责什么？</h1><p class="page-lede">一个角色可以同时有负责显示的 SpriteRenderer、负责运动的 Rigidbody2D 和负责动画的 Animator。这里先用几句话说明每个组件的工作，再指出常见问题；点击相关课程，可以继续看完整例子和实验。</p><div class="reference-filter"><label class="sr-only" for="component-search">搜索组件</label><input type="search" id="component-search" class="filter-input" placeholder="输入组件名、职责或问题…"><label for="component-domain" class="sr-only">组件领域</label><select id="component-domain" class="filter-input"><option value="全部">全部领域</option>${['通用','2D','3D','UI','反馈','可选包'].map(domain=>`<option>${domain}</option>`).join('')}</select></div><div class="component-grid" id="component-list"></div><aside class="learning-note"><span class="note-symbol" aria-hidden="true">辨</span><div><h3>分清场景中的播放器和它使用的素材。</h3><p>例如 AudioSource 是对象上的播放组件，AudioClip 是它播放的声音资源。同样，SpriteRenderer 使用 Sprite，Animator 使用控制器和动画片段。GameObject 则把这些组件组织在一起。拖拽资源时，要先找到接收这类资源的字段。</p></div></aside>`;
  }
  function renderComponents(){
    const query=$('#component-search').value.toLowerCase().trim(),domain=$('#component-domain').value;
    $('#component-list').innerHTML=components.filter(entry=>(domain==='全部'||entry[1]===domain)&&entry.slice(0,4).join(' ').toLowerCase().includes(query)).map(([name,type,purpose,trap,ids])=>`<article class="component-entry"><span class="small-label">${escapeHTML(type)}</span><h2>${escapeHTML(name)}</h2><p>${escapeHTML(purpose)}</p><p class="component-trap">${escapeHTML(trap)}</p><div class="component-links">${ids.filter(id=>byId.has(id)).map(id=>`<a href="#lesson/${id}">${number(Number(id.slice(1)))} · ${escapeHTML(byId.get(id).title)} →</a>`).join('')}</div></article>`).join('')||'<p class="empty-state">没有匹配组件。试试英文名称或切换到全部领域。</p>';
  }
  function labsPage(kind) {
    const physics=kind==='physics';
    return `<p class="eyebrow">THE ENGINE LABORATORY</p><h1 class="page-title">先让抽象的过程，变得可见。</h1><p class="page-lede">用两个教学模型探索事件顺序与固定步进。这里展示的是简化规则，实际执行请回到 Unity 的日志、Profiler 和官方文档验证；不会替代引擎运行，也不保证不同对象之间的回调顺序。</p><nav class="lab-tabs" aria-label="交互实验"><a href="#lab/lifecycle" class="${physics?'':'active'}">01 · MonoBehaviour 生命周期</a><a href="#lab/physics" class="${physics?'active':''}">02 · 渲染帧与物理步进</a></nav>${physics?physicsHTML():lifecycleHTML()}<div class="read-related">继续用 Unity 验证：${lessons.filter(lesson=>physics?lesson.module.number===5:lesson.module.number===3).slice(0,3).map(lesson=>`<a href="#lesson/${lesson.id}">${escapeHTML(lesson.title)}</a>`).join('')}</div>`;
  }
  function lifecycleHTML() {
    return `<section class="simulator"><h2>重新启用组件，哪些函数会再运行？</h2><p class="sim-intro">先创建一个对象，再推进一帧。你会看到 Awake、OnEnable、Start 和逐帧更新。接着禁用、重新启用同一个组件，观察哪些名字再次出现在日志里。</p><div class="sim-example"><p>Awake 负责这个实例的初次初始化；OnEnable 对应每一次启用。Start 要等组件启用后、第一次 Update 之前才运行，而且同一个实例只运行一次。</p><p>这里只模拟一个活动对象上的普通组件。真实 Unity 中的未激活对象、协程和延迟销毁，还要回到对应课程分别验证。</p></div><div class="sim-controls"><button class="button small" id="life-create">创建活动对象</button><button class="button secondary small" id="life-frame">推进一帧</button><button class="button secondary small" id="life-toggle">禁用组件</button><button class="button secondary small" id="life-destroy">销毁对象</button><button class="text-button" id="life-reset">重置实验</button></div><div class="lifecycle-object" id="life-status" aria-live="polite"></div><div class="lifecycle-stage" id="life-stage" aria-label="生命周期回调"></div><div class="sim-output" id="life-log" role="log" aria-label="生命周期日志"></div><p class="sim-caption" id="life-caption" aria-live="polite"></p></section>`;
  }
  function attachLifecycle() {
    const model={created:false,enabled:false,started:false,destroyed:false,frame:0,logs:[],event:null,reached:new Set()};
    const events=['Awake','OnEnable','Start','Update','LateUpdate','OnDisable','OnDestroy'];
    function emit(event){model.logs.push(`[帧 ${String(model.frame).padStart(2,'0')}] ${event}`);model.event=event;model.reached.add(event);}
    function display(caption){$('#life-status').innerHTML=`<span><i class="status-dot"></i>${model.destroyed?'对象已销毁':model.created?'活动对象已创建':'尚未创建对象'}</span><span>组件 ${model.enabled?'enabled':'disabled'}</span><span>Start ${model.started?'已执行':'未执行'}</span>`;$('#life-stage').innerHTML=events.map((event,i)=>`${i?'<span class="lifecycle-arrow" aria-hidden="true">→</span>':''}<span class="lifecycle-node ${model.reached.has(event)?'reached':''} ${model.event===event?'current':''}">${event}</span>`).join('');$('#life-log').textContent=model.logs.join('\n')||'点击“创建活动对象”，观察第一次唤醒。';$('#life-log').scrollTop=$('#life-log').scrollHeight;$('#life-caption').textContent=caption;$('#life-create').disabled=model.created;$('#life-frame').disabled=!model.created||model.destroyed;$('#life-toggle').disabled=!model.created||model.destroyed;$('#life-destroy').disabled=!model.created||model.destroyed;$('#life-toggle').textContent=model.enabled?'禁用组件':'启用组件';}
    $('#life-create').addEventListener('click',()=>{model.created=true;model.enabled=true;emit('Awake');emit('OnEnable');display('活动对象实例化时发生 Awake 和 OnEnable。Start 尚未发生，等待第一次启用状态下的 Update。');});
    $('#life-frame').addEventListener('click',()=>{model.frame++;if(model.enabled){if(!model.started){emit('Start');model.started=true;}emit('Update');emit('LateUpdate');display('本帧 Update 后执行 LateUpdate。为突出对象生命周期，此处未画物理步进；它可能在一帧内发生零次或多次。');}else{model.logs.push(`[帧 ${String(model.frame).padStart(2,'0')}] （组件禁用，跳过 Update / LateUpdate）`);display('enabled=false 不等于销毁。普通 Update 停止，但组件仍然存在。协程的停止规则与此不同，请阅读时间章节。');}});
    $('#life-toggle').addEventListener('click',()=>{model.enabled=!model.enabled;emit(model.enabled?'OnEnable':'OnDisable');display(model.enabled?model.started?'重新启用再次触发 OnEnable。Start 已经执行过，不会再执行。':'重新启用触发 OnEnable；下一帧第一次 Update 前才执行 Start。':'禁用组件触发 OnDisable。Awake 不会因为重新启用而重跑。');});
    $('#life-destroy').addEventListener('click',()=>{if(model.enabled){emit('OnDisable');model.enabled=false;}emit('OnDestroy');model.destroyed=true;display('模型在按钮动作内完成销毁；真实 Destroy 通常延迟处理。OnDestroy 不适合作为必达的存档钩子，且并非所有从未激活对象都会收到它。');});
    $('#life-reset').addEventListener('click',()=>attachLifecycleReset());
    function attachLifecycleReset(){Object.assign(model,{created:false,enabled:false,started:false,destroyed:false,frame:0,logs:[],event:null,reached:new Set()});display('试试在第一帧前禁用，再启用；对比 Start 与 OnEnable 的次数。');}
    display('试着预测：创建后立即禁用，再启用，哪些函数会重复？');
  }
  function physicsHTML() {
    return `<section class="simulator"><h2>画面更新一次，物理会计算几次？</h2><p class="sim-intro">假设画面每秒更新 60 次，每帧约经过 16.7 毫秒；物理固定步长为 20 毫秒。两种节奏并不相同。先预测前两帧的物理次数，再点击按钮验证。</p><div class="sim-example"><p>第一帧只累积约 16.7 毫秒，还不够 20 毫秒，所以没有物理步。第二帧累积到约 33.3 毫秒，可以执行一步，剩余约 13.3 毫秒留到后面。</p><p>timeScale 决定游戏时间相对真实时间推进多快。这个模型按累积的游戏时间安排固定步；真实 Unity 还会限制卡顿后的补步量，因此极端卡顿要在引擎中另行测量。</p></div><div class="sim-controls"><label>渲染帧率<select id="physics-fps"><option value="30">30 FPS</option><option value="60" selected>60 FPS</option><option value="120">120 FPS</option><option value="15">15 FPS</option></select></label><label>固定步长<select id="physics-step"><option value="0.02" selected>0.02 s · 50 Hz</option><option value="0.01">0.01 s · 100 Hz</option><option value="0.033333333333">1/30 s · 30 Hz</option></select></label><label>timeScale<select id="physics-scale"><option value="0">0 · 暂停</option><option value="0.5">0.5</option><option value="1" selected>1</option><option value="2">2</option></select></label><button class="button small" id="physics-next">推进一帧 →</button><button class="button secondary small" id="physics-ten">推进十帧</button><button class="text-button" id="physics-reset">重置</button></div><div class="physics-bars" id="physics-bars" aria-label="最近十帧的固定步进"></div><div class="sim-stats" id="physics-stats" aria-live="polite"></div><p class="sim-caption" id="physics-caption" aria-live="polite"></p></section>`;
  }
  function attachPhysics() {
    let frame=0,ticks=0,accumulator=0,realTime=0,gameTime=0,history=[];
    function display(){const step=Number($('#physics-step').value);$('#physics-bars').innerHTML=history.length?history.slice(-10).map(item=>`<div class="physics-frame"><span>帧 ${number(item.frame)}</span><div class="physics-track">${item.ticks?Array.from({length:item.ticks},()=>'<span class="physics-tick">Fixed</span>').join(''):'<span class="physics-empty">无物理步</span>'}<span class="physics-render">Update</span></div></div>`).join(''):'<p class="code-explanation">先推进一帧，观察 60 FPS / 50 Hz 时第一帧是否发生 FixedUpdate。</p>';$('#physics-stats').innerHTML=`<span><strong>${frame}</strong>渲染帧</span><span><strong>${ticks}</strong>物理步</span><span><strong>${gameTime.toFixed(3)}</strong>模拟秒</span><span><strong>${realTime.toFixed(3)}</strong>真实秒</span>`;$('#physics-caption').textContent=`累计不足一个固定步的模拟时间：${(accumulator*1000).toFixed(2)} ms / ${(step*1000).toFixed(2)} ms。Update 即使在 timeScale=0 时仍可执行，普通固定步进不再推进。`;}
    function advance(count){const fps=Number($('#physics-fps').value),step=Number($('#physics-step').value),scale=Number($('#physics-scale').value);for(let i=0;i<count;i++){frame++;realTime+=1/fps;gameTime+=scale/fps;accumulator+=scale/fps;let thisFrame=0;while(accumulator+1e-10>=step&&scale>0){accumulator=Math.max(0,accumulator-step);ticks++;thisFrame++;}history.push({frame,ticks:thisFrame});}history=history.slice(-10);display();}
    function reset(){frame=0;ticks=0;accumulator=0;realTime=0;gameTime=0;history=[];display();}
    $('#physics-next').addEventListener('click',()=>advance(1));$('#physics-ten').addEventListener('click',()=>advance(10));$('#physics-reset').addEventListener('click',reset);['#physics-fps','#physics-step','#physics-scale'].forEach(selector=>$(selector).addEventListener('change',reset));display();
  }
  function search(query) {
    const normalized=query.trim().toLowerCase();
    const result=$('#search-results');
    if(!normalized){result.innerHTML='<p class="search-empty">试试：Awake、协程、Rigidbody2D、Animator、序列化、Profiler。</p>';return;}
    const tokens=normalized.split(/\s+/).filter(Boolean);
    const matches=lessons.map(lesson=>{
      const title=(lesson.title+' '+lesson.module.title).toLowerCase();
      const guide=lesson.teaching;
      const introduction=guide?[guide.question,guide.keyIdea,...guide.walkthrough.map(step=>step.title+' '+step.text),...(guide.comparison?[guide.comparison.caption,...guide.comparison.headers,...guide.comparison.rows.flat()]:[]),guide.prediction.question,guide.prediction.answer].join(' '):'';
      const content=introduction+' '+lesson.theory.map(section=>section.title+' '+section.paragraphs.join(' ')).join(' ');
      const text=(title+' '+content+' '+codeFiles(lesson).map(file=>file.source).join(' ')).toLowerCase();
      return {lesson,content,score:tokens.every(token=>text.includes(token))?tokens.reduce((score,token)=>score+(title.includes(token)?10:1),0):0};
    }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score).slice(0,30);
    result.innerHTML=matches.map(({lesson,content})=>{
      const found=content.toLowerCase().indexOf(tokens[0]);const start=Math.max(0,found-28);const excerpt=content.slice(start,start+105);
      return `<a class="search-result" href="#lesson/${lesson.id}"><span class="search-result-title">${number(lessonNumber(lesson))} · ${escapeHTML(lesson.title)}</span><small>第 ${lesson.module.number} 章 · ${escapeHTML(lesson.module.title)} · 5 小时</small><p>${start?'…':''}${escapeHTML(excerpt)}…</p></a>`;
    }).join('')||'<p class="search-empty">没有匹配结果。可使用英文 API 名称，或缩短关键词。</p>';
    $$('.search-result',result).forEach(anchor=>anchor.addEventListener('click',()=>{const target=anchor.getAttribute('href');$('#search-dialog').close();if(location.hash===target){document.getElementById('main').focus();window.scrollTo(0,0);}}));
  }
  function openSearch(){if(!$('#search-dialog').open)$('#search-dialog').showModal();$('#search-input').focus();search($('#search-input').value);}
  function exportProgress(){tick();save();const blob=new Blob([JSON.stringify({...state,learnerName:learners.name,exportedAt:new Date().toISOString(),book:'引擎之内 · Unity 500 小时'},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=`unity-engine-progress-${learners.activeId.slice(0,8)}-${new Date().toISOString().slice(0,10)}.json`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已导出“'+learners.name+'”的进度、笔记、自测与专注时间。');}
  function importProgress(){ $('#import-file').click(); }
  async function receiveImport(event){const file=event.target.files?.[0];if(!file)return;event.target.value='';const targetId=learners.activeId;try{if(file.size>8*1024*1024)throw new Error('进度文件过大，请选择本教材导出的 JSON。');const imported=normalizeState(JSON.parse(await file.text()));if(targetId!==learners.activeId)throw new Error('读取文件期间已切换档案，请在目标档案中重新导入。');if(!confirm('导入将替换“'+learners.name+'”的学习记录，其他档案不受影响。建议先导出当前档案备份。继续导入？'))return;tick();timerRunning=false;clearTimeout(noteTimeout);currentLesson=null;state=imported;save({replace:true});applyTheme();route();toast(storageAvailable?'已恢复学习记录。':'已在本次页面恢复记录，浏览器无法持久保存，请导出备份。');}catch(error){toast('导入失败：'+error.message);}}
  function applyTheme(){document.documentElement.classList.toggle('dark',state.theme==='dark');$('#theme-toggle').setAttribute('aria-label',state.theme==='dark'?'切换浅色阅读':'切换深色阅读');}
  function tick(){const now=Date.now(),elapsed=Math.min(5,Math.max(0,(now-lastTick)/1000));lastTick=now;if(timerRunning&&currentLesson&&!document.hidden){state.seconds[currentLesson.id]=(state.seconds[currentLesson.id]||0)+elapsed;refreshTimerUI();}}
  function closeMobile(){document.body.classList.remove('menu-open');$('#menu-toggle').setAttribute('aria-expanded','false');$('#mobile-scrim').hidden=true;}
  function route(){
    tick();timerRunning=false;clearTimeout(noteTimeout);currentLesson=null;document.body.classList.remove('reading-focus');closeMobile();
    if($('#search-dialog').open)$('#search-dialog').close();
    const [name='home',id]=location.hash.slice(1).split('/');const main=$('#main');
    if(!lessons.length){main.innerHTML='<section class="error-page"><h1>课程内容尚未加载</h1><p>请确认 content 目录与 index.html 位于同一文件夹，且章节文件完整。</p></section>';return;}
    if(name==='lesson'&&byId.has(id)){currentLesson=byId.get(id);state.lastLesson=id;main.innerHTML=lessonPage(currentLesson);$('#breadcrumb').innerHTML=`第 ${number(currentLesson.module.number)} 章 <span>/</span> ${escapeHTML(currentLesson.module.title)}`;attachLesson(currentLesson);document.title=currentLesson.title+' · 引擎之内';}
    else if(name==='roadmap'){main.innerHTML=roadmap();$('#breadcrumb').innerHTML='学习空间 <span>/</span> 500 小时学习路线';document.title='完整学习路线 · 引擎之内';}
    else if(name==='references'){main.innerHTML=referencesPage();renderSources();$('#reference-search').addEventListener('input',event=>renderSources(event.target.value));$('#breadcrumb').innerHTML='学习空间 <span>/</span> 官方文档索引';document.title='官方文档索引 · 引擎之内';}
    else if(name==='notes'){main.innerHTML=notesPage();$('#notes-export').addEventListener('click',exportProgress);$('#notes-import').addEventListener('click',importProgress);$('#breadcrumb').innerHTML='学习空间 <span>/</span> 我的学习笔记';document.title='我的学习笔记 · 引擎之内';}
    else if(name==='learners'){main.innerHTML=learnersPage();attachLearners();$('#breadcrumb').innerHTML='学习空间 <span>/</span> 我的学习档案';document.title='我的学习档案 · 引擎之内';}
    else if(name==='components'){main.innerHTML=componentsPage();renderComponents();$('#component-search').addEventListener('input',renderComponents);$('#component-domain').addEventListener('change',renderComponents);$('#breadcrumb').innerHTML='学习空间 <span>/</span> 常用组件速查';document.title='常用组件速查 · 引擎之内';}
    else if(name==='lab'){main.innerHTML=labsPage(id);if(id==='physics')attachPhysics();else attachLifecycle();$('#breadcrumb').innerHTML='学习空间 <span>/</span> 引擎交互实验室';document.title='引擎交互实验室 · 引擎之内';}
    else if(name==='home'||name===''){main.innerHTML=home();$('#breadcrumb').innerHTML='学习空间 <span>/</span> 总览';document.title='引擎之内 · Unity 引擎原理与实践';$$('[data-phase]').forEach(button=>button.addEventListener('click',()=>{activePhase=Number(button.dataset.phase);const phase=phases[activePhase];$('#module-grid').innerHTML=modules.filter(module=>module.number>=phase.range[0]&&module.number<=phase.range[1]).map(moduleRow).join('');$('#module-grid').setAttribute('aria-labelledby','phase-tab-'+activePhase);$$('[data-phase]').forEach(tab=>{tab.classList.toggle('active',tab===button);tab.setAttribute('aria-selected',String(tab===button));});}));}
    else{main.innerHTML='<section class="error-page"><p class="eyebrow">LOST IN THE ENGINE?</p><h1>这条课程路径不存在。</h1><p>可以回到学习路线，或搜索一个你感兴趣的 API。</p><a href="#roadmap" class="button">回到完整目录 →</a></section>';$('#breadcrumb').textContent='课程未找到';}
    updateSidebar();save();window.scrollTo(0,0);
  }
  $('#menu-toggle').addEventListener('click',()=>{const open=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',open);$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#mobile-scrim').hidden=!open;});
  $('#mobile-scrim').addEventListener('click',closeMobile);
  $('#open-search').addEventListener('click',openSearch);
  $('#search-input').addEventListener('input',event=>search(event.target.value));
  $('#theme-toggle').addEventListener('click',()=>{state.theme=state.theme==='light'?'dark':'light';applyTheme();save();});
  $('#export-progress').addEventListener('click',exportProgress);$('#import-progress').addEventListener('click',importProgress);$('#import-file').addEventListener('change',receiveImport);
  window.addEventListener('hashchange',route);
  document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}if(event.key==='Escape'){if($('#search-dialog').open)$('#search-dialog').close();document.body.classList.remove('reading-focus');closeMobile();}});
  document.addEventListener('visibilitychange',()=>{tick();if(document.hidden&&timerRunning){timerRunning=false;save();refreshTimerUI();}});
  window.addEventListener('pagehide',()=>{tick();save();});
  setInterval(()=>{tick();if(timerRunning)save();},1000);
  applyTheme();route();
  // 供本地验收检查读取的公开只读摘要，不暴露或上传个人笔记。
  window.ENGINE_ATLAS=Object.freeze({version:'1.2.0',modules:modules.length,lessons:lessons.length,hours:lessons.reduce((sum,lesson)=>sum+lesson.hours,0)});
})();
