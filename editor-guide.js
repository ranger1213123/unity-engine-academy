'use strict';
window.editorGuideHTML = () => `
<article class="editor-guide">
  <p class="eyebrow">YOUR FIRST STEPS IN THE EDITOR</p>
  <h1 class="page-title">先找到地方，再开始动手。</h1>
  <p class="page-lede">第一次打开 Unity，先认识下面六个窗口。窗口可以拖动，与你屏幕上的排列不同也没关系：按页签名称找，找不到就从顶部菜单重新打开。本页以 Unity 6.3 LTS 的英文菜单为准，括号内是中文含义。</p>
  <section class="editor-photo-start"><h2>先看一张真实的编辑器截图</h2><p>图中加了三个蓝色数字，按顺序找Hierarchy、Project、Inspector。先认出它们，再看下面各窗口的近照。图片可以点击放大。</p>${window.officialFigureHTML('editor-overview')}</section>
  <details class="editor-layout-sketch"><summary>再用简图回顾窗口之间的关系</summary>
  <figure class="editor-map">
    <figcaption>窗口关系示意 · 不是固定布局，也不是编辑器截图</figcaption>
    <div class="editor-map-menu">顶部菜单：File · Edit · Assets · GameObject · Component · Window</div>
    <div class="editor-map-play">顶部播放工具栏：▷ Play（运行） · Ⅱ Pause（暂停）</div>
    <div class="editor-map-grid">
      <div><b>Hierarchy · 层级</b><span>场景中有哪些对象？</span><small>点击一个对象 →</small></div>
      <div><b>Scene / Game · 场景 / 游戏</b><span>摆放对象 / 查看相机画面</span></div>
      <div><b>Inspector · 检视</b><span>所选对象有什么组件？</span><small>在这里找 Add Component</small></div>
      <div><b>Project · 项目</b><span>Assets 中的文件与文件夹</span></div>
      <div><b>Console · 控制台</b><span>日志、警告和错误</span></div>
    </div>
  </figure></details>
  <h2>六个窗口分别在哪里？</h2>
  <p>以下路径都从编辑器顶部菜单开始。例如 <code>Window &gt; General &gt; Console</code>，就是先点 Window，再指向 General，最后点 Console。</p>
  <div class="editor-window-list">
    ${[
      ['Hierarchy','层级','列出当前场景里的对象，例如 Main Camera。要查看一个对象的组件，先在这里单击它。','Hierarchy'],
      ['Project','项目','显示项目的资源文件。打开 Assets 后，可以在其中创建 Scripts、Scenes 等文件夹；这里的脚本文件还不是场景里的组件。','Project'],
      ['Inspector','检视','显示当前选中的对象或资源。选中场景对象时，这里能找到 Transform 和 Add Component（添加组件）。先确认顶部显示的是你想编辑的对象名。','Inspector'],
      ['Scene','场景','编辑场景时摆放和观察对象的工作区。它的观察视角与游戏相机分开，不一定与 Game 画面一致。','Scene'],
      ['Game','游戏','显示游戏相机的画面。第1课只创建空对象，因此不会自动出现角色；运行日志要去 Console 看。','Game'],
      ['Console','控制台','查看 Debug.Log 输出、警告和红色错误。Clear 清除旧显示记录，Collapse 把相同消息折叠起来；第一次做日志实验先关闭 Collapse。','Console']
    ].map(([name,translation,description,menu])=>`<section class="editor-window"><h3>${name}<span>${translation}</span></h3><p>${description}</p><p class="editor-path"><strong>打开：</strong><code>Window &gt; General &gt; ${menu}</code></p></section>`).join('')}
  </div>
  <h2>对着近照，检查你自己的窗口</h2>
  ${window.officialFigureHTML('hierarchy-window')}
  ${window.officialFigureHTML('empty-inspector')}
  ${window.officialFigureHTML('console-window')}
  ${window.officialFigureHTML('play-controls')}
  <h2>第一个脚本，从文件到运行</h2>
  <ol class="editor-steps">
    <li><strong>准备一个练习场景。</strong>先停止 Play。用 <code>File &gt; New Scene</code> 新建基础或空场景，在 Project 的 Assets 下新建 Scenes 文件夹，再用 <code>File &gt; Save As</code> 保存到其中。不要直接覆盖正在做的游戏场景。</li>
    <li><strong>建文件夹和脚本。</strong>在 Project 打开 Assets，在内容区域空白处右键 <code>Create &gt; Folder</code>，命名 Scripts。打开 Scripts，用顶部 <code>Assets &gt; Create &gt; Scripting &gt; MonoBehaviour Script</code> 建脚本，命名 EnvironmentProbe。完整文件名应是 <code>EnvironmentProbe.cs</code>。</li>
    <li><strong>复制代码并保存。</strong>到<a href="#lesson/l001">第1课</a>找到“环境探针”完整代码。双击脚本，用代码编辑器替换全部模板内容并保存。文件名 EnvironmentProbe.cs 与代码里的类名 EnvironmentProbe 必须对应。未设置代码编辑器时，可右键脚本选 <code>Show in Explorer</code>，再用文本编辑器打开；保存后检查没有多出 <code>.txt</code> 后缀。</li>
    <li><strong>等待编译。</strong>回 Unity，等编译结束并检查 Console。项目里任何脚本的红色编译错误都会阻止正常进入 Play；新建场景不能避开旧脚本错误。修好后再继续。也可在 Unity Hub 的 <code>Projects &gt; New project</code> 中选 Unity 6.3 和已安装的基础模板，在新文件夹建立独立学习项目。</li>
    <li><strong>建对象并添加组件。</strong>用 <code>GameObject &gt; Create Empty</code> 建空对象，在 Hierarchy 中命名 Probe。Probe 是这次练习给对象起的名字。选中它，在 Inspector 点击 <code>Add Component</code>，搜索 EnvironmentProbe 并添加，确认组件出现在列表里。</li>
    <li><strong>运行并看结果。</strong>在 Console 点 Clear 并关闭 Collapse；点击顶部三角形 Play，读取两条探针日志。再次点击同一 Play 按钮停止。空对象没有图像，不会生成小人或动画。</li>
  </ol>
  <h2>教程常提到的设置入口</h2>
  <div class="editor-shortcuts">
    <section><h3>时间设置</h3><p><code>Edit &gt; Project Settings &gt; Time</code>：先打开 Project Settings，再选 Time。第1课用到 Fixed Timestep 和 Time Scale，修改前抄下原值，实验后恢复。</p></section>
    <section><h3>包管理器</h3><p><code>Window &gt; Package Management &gt; Package Manager</code>：查看已安装的包及版本。课程写“需要 Input System”等前提时，先在这里核对。</p></section>
    <section><h3>组件与它的字段</h3><p>先在 Hierarchy 选中目标对象，再到 Inspector 找对应组件。点击组件标题可展开字段。“把对象拖到字段”是把 Hierarchy 的对象拖到 Inspector 中指定的引用框，不能只放到空白处。</p></section>
  </div>
  <aside class="learning-note"><span class="note-symbol" aria-hidden="true">查</span><div><h3>点了 Play，却没有日志？</h3><p>先看 Console 是否有红色编译错误；再检查 Probe 是否在当前场景、对象名称旁的启用复选框和 EnvironmentProbe 组件的启用框是否勾选。确认 Console 的普通日志按钮开启、搜索框为空。这个探针只在启动时输出一次，清掉运行中的日志后，需要停止再 Play 才会重新打印。</p></div></aside>
  <p class="editor-sources">官方界面说明：<a href="https://docs.unity.com/en-us/engine/6000.3/manual/unity-editor" target="_blank" rel="noopener noreferrer">Unity 编辑器</a> · <a href="https://docs.unity3d.com/6000.3/Documentation/Manual/Console.html" target="_blank" rel="noopener noreferrer">Console 窗口</a>。本页菜单另经 Unity 6.3.28f1 本机界面核对。</p>
  <a class="button" href="#lesson/l001">准备好了，进入第1课 →</a>
</article>`;
