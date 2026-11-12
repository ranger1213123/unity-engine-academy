# Unity 引擎原理与实践：编写约定

本教材面向能写少量 C#、尚未形成引擎模型的中文学习者。基线为 Unity 6.3 LTS（6000.3）；当前学习项目使用 Input System 1.20.1、URP 17.3.0。教材是独立学习网站，不修改 tinysword 项目。

第二版的语言与教学要求见 `EDITORIAL.md`。每课必须提供 `teaching` 导读、分步例题和可展开的预测解析，正文按具体问题逐步展开。术语要解释，推导不能省略；达到字数下限不能代替讲清楚。

## 课程结构

共 20 章，每章 5 课，每课 5 小时，合计 100 课 / 500 小时。小时包括阅读、预测、实验、独立练习、复盘，不能宣称只读讲义就等于完成 500 小时。每课必须有独立、具体、可复现的内容。

01 引擎对象与学习方法；02 Unity 中的 C#；03 MonoBehaviour 生命周期；04 Transform 与空间数学；05 时间、协程与异步；06 Input System；07 三维物理；08 二维物理；09 素材与导入管线；10 动画系统；11 摄像机、光照与渲染；12 UI 与交互；13 音频、粒子与反馈；14 场景与资源生命周期；15 数据与序列化；16 架构与测试；17 Profiler 与优化；18 编辑器扩展；19 导航、Jobs、Burst 与 ECS；20 构建、交付与综合考核。

## 文件与数据约定

章节文件为 `content/chapter-01.js` 至 `chapter-20.js`，直接通过 script 加载，支持不启动服务器、双击 index.html 阅读。每文件只添加一个对象：

```js
window.COURSE_MODULES.push({
  id: 'm01', number: 1, title: '引擎对象与学习方法', subtitle: '一句话学习价值',
  description: '章的具体边界与产出', accent: '#527c63',
  lessons: [{
    id: 'l001', title: '具体标题', hours: 5, prerequisites: [],
    goals: ['可观察、可验收的目标，至少 3 条'],
    theory: [{title: '解释一个原理', paragraphs: ['完整讲解，禁止只有术语清单。']}],
    code: {title: '可复制的最小实验', language: 'csharp', filename: 'Example.cs', source: '完整代码', explanation: ['解释关键行为及限制']},
    lab: [{title: '实验步骤组', minutes: 60, steps: ['操作、输入、观察和记录'], result: '明确预期结果'}],
    timePlan: [{label:'阅读与预测',minutes:50},{label:'引擎实验',minutes:120},{label:'独立练习',minutes:75},{label:'自测与回忆',minutes:35},{label:'复盘与归档',minutes:20}],
    pitfalls: [{symptom:'具体现象',cause:'原理原因',fix:'可执行修复'}],
    exercise: {brief:'有约束的独立迁移题',deliverables:['证据产物'],rubric:[{item:'验收项',points:25},{item:'验收项',points:25},{item:'验收项',points:25},{item:'验收项',points:25}]},
    quiz: [{question:'考察预测和推理的题',options:['A','B','C','D'],answer:0,explanation:'解释正确答案和错误假设'}],
    references: [{label:'Unity 官方文档的真实标题',url:'https://docs.unity3d.com/6000.3/Documentation/Manual/...html'}],
    summary: ['可用自己的话复述的结论']
  }]
});
```

每课至少 3 个 theory 小节、900 汉字的独立讲解（不含题目、代码与实验），2 个实验步骤组合计 120 分钟，2 个具体故障，3 道有解析的选择题，2 条官方引用。每课总预算 300 分钟，评分总和 100。不是每课都必须写代码；素材、构建等课程用明确的配置对照代替无意义脚本。代码存在时必须完整，注明挂载对象和前提，避免跨课未声明依赖。每章至少 3 课包含可直接复制的完整代码。引用不等于逐字复述：教材用原创中文解释，并明确实验推论与官方保证的区别。

多文件示例使用 `code.files: [{filename, source}]`，代码标题、语言和 explanation 仍留在 code 上。不要把含 using 的多个文件拼在一个无法编译的复制块中。每块展示完整文件与实际放置目录。

## 技术准确性

不要保证不同对象的 Awake/Start/Update 顺序，不把 FixedUpdate 当真实独立线程；Start 必须在第一次 Update 前且组件启用，Awake/OnEnable 的触发需区分 inactive 对象、组件 enabled 与实例化。OnDestroy 不是可靠持久化钩子。Unity 对象的 `== null` 与 C# 引用为空不等价。协程不是线程；WaitForSeconds 受 timeScale 影响且从当前帧结束开始等待，恢复依赖后续帧。动态刚体与 Transform 写入需要解释物理所有权。2D、3D 物理分离。Unity 6 使用 Rigidbody.linearVelocity / Rigidbody2D.linearVelocity；不再把旧 velocity 推荐为首选。不要将 Addressables、Cinemachine、AI Navigation、Burst、Entities 等包假定已安装；写清可选、安装版本需与编辑器兼容。内置 Input 旧 API 与新版 Input System 必须明确分开。URP 不等于内置渲染管线；运行时与编辑器命名空间分离；Editor 脚本必须在 Editor 文件夹或 Editor-only 程序集。示意模拟器不是实际 Unity Runtime。

## 打磨与交付

第一轮写课程；第二轮由不同审阅者检查生命周期、物理、序列化、包版本与教程前置条件；第三轮校验总课时、章节完整性、引用、练习与自测，以及网页进度保存、搜索、导航、移动布局和导出导入。未在 Unity 真机执行的示例不能标为已通过运行测试。审校记录保留在 REVIEW.md。
