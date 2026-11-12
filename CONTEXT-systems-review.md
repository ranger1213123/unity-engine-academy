# 第 7—13 章：语境、操作前提与实验用途复修

日期：2026-11-12。负责范围为 `content/chapter-07.js` 至 `chapter-13.js`，共 35 课。此次逐课复读开篇、预测、自测和两组实验，实际改写已写入课程文件。

## 这轮解决的问题

本轮针对“题目背景不明、对象 A/B 未定义、重复次数无目的、编辑器入口不清楚、读者不知道学完能做什么”复修。35 课均新增 `teaching.scenario`、`teaching.purpose` 和预测背景；105 道自测均有独立 `scenario`；70 组实验均有 `setup` 数组和 `purpose`。实验准备明确场景、菜单、对象、组件、字段、引用和运行方式，并区分现成代码与需要自行实现的扩展。

情景提供作答需要的对象和初始条件，避免把正确选项直接写进背景。最终复查另收敛了 l046、l048、l052、l054、l055、l063、l064 中可能提前给出结论的措辞。

## 逐课落地

| 课程 | 本轮主要修订 |
| --- | --- |
| l031 | 给出三个箱子的独立起点；只读探针仅挂有刚体组，避免 RequireComponent 破坏“只有显示”的对照。 |
| l032 | 明确现成脚本的持续加速度 1、冲量 3 与理论输入 10 不同，实际预期按真实输入计算。 |
| l033 | 说明区域、身体与多形状的层级、Trigger、脚本挂载；计形状与计角色分开。 |
| l034 | 主实验收敛为现成单射线能完成的门缝、Layer、显式 Trigger 策略、起点与形状对照；高速和多结果查询保留为进一步学习，消除未提供驱动却要求直接运行的断点。 |
| l035 | 写全 Floor/Ground 层、胶囊、GroundPoint、两个完整脚本、Input System 和 Game 焦点；不把实验适配器当正式角色系统。 |
| l036 | 三种身体与地板位置明确；显示、速度写入和 Simulated 分轮测试。必做不依赖未来第 38 课，并说明停用写速度脚本不会自动清除已有速度。 |
| l037 | 六类配置、二维消息、Layer 矩阵入口与恢复基线明确。 |
| l038 | RayProbe2D 的挂载、方向、墙与 Gizmos 说明清楚；单射线没有角色宽度。 |
| l039 | 说明现成例子读取键盘，四向量算法副本与位置动画冲突测试分别进行。 |
| l040 | 每个速度的十次用于小样本稳定性检查，另平移起点检查采样相位；不给“十次通过就绝无穿墙”的保证。 |
| l041 | 指明 PNG 导入、切片矩形、PPU、相机与 Game 尺寸的操作位置及比较用途。 |
| l042 | 写清 Sprite Editor 的入口和包前提；引用追踪主线改为 SpriteRenderer→实际 PNG 子帧，本课即可完成。Controller/Clip 追踪在第 46 课后补做。 |
| l043 | KnightA、KnightB、来源 Prefab 和覆盖值均有定义；Apply/Revert 各轮重新建立差异。 |
| l044 | 从实际 Renderer 追材质、Shader 与纹理槽；故障实验只改专用副本。 |
| l045 | 说明菜单工具只检查当前选中纹理，不自动扫描或修复目录；报告范围与例外具体化。 |
| l046 | Animation 窗口、选对象、保存 Clip、拖 Sprite 子帧和检查轨道的顺序明确。 |
| l047 | Animator Controller 创建、Motion、Moving 参数与双向过渡接线明确；手动参数实验先停用会覆写参数的探针。 |
| l048 | 指出现成适配器读真实身体速度，不自动创建 Facing；手动改参数前暂停适配器。 |
| l049 | 动作改名 AttackOne/AttackTwo 并定义开始、中断和旧回报；脚步声素材、监听器与事件接收器接线明确。 |
| l050 | 从实际角色和 Motion 查引用，区分资源预览、时间轴采样与顶部 Play。 |
| l051 | 给出相机、目标平面和坐标条件；屏幕点转换不再脱离所用相机。 |
| l052 | URP/2D Renderer 前提、并排 Lit/Unlit 样本和灯的 Target Sorting Layers 明确；修正 Global Light 2D 菜单入口。 |
| l053 | 实验与导读统一 ColorOne/ColorTwo，定义同一材质、专用副本与属性条件；十对象只是观察样本。 |
| l054 | Profiler、Frame Debugger 与固定比较条件说明用途，区分时间证据与绘制数量。 |
| l055 | 拆成资产式 RenderTexture 的三端接线与 OwnedCameraTarget 的运行时生命周期测试；给出 Cube、相机位置、正交范围和专用 Preview Layer，明确后者不自动接 UI。十次开关只用于发现增长。 |
| l056 | Canvas、Scaler、CanvasGroup、目标相机与 RectTransform 的前提明确。 |
| l057 | 父布局与内层动画分开，给出会驱动宽度的具体布局选项和观察方式。 |
| l058 | ListenerHost 与按钮分离，停用宿主后仍可点按钮验证退订；十次开关用来发现残留监听，新闭包反例明确捕获不同轮次。 |
| l059 | UXML、name、UIDocument、PanelSettings、UI Builder 和 Debugger 接线明确，控件名与源码一致。 |
| l060 | 标明 CounterView 使用旧版 UnityEngine.UI.Text，不是 TMP；通过按钮动态整型入口调用 Present，而非挂上就会自动刷新。 |
| l061 | Mixer、暴露的 MusicVolume、Slider 动态 float 接线写全；手动密集十次触发只比较叠加听感，不冒充精确间隔实验。 |
| l062 | Listener、Source、2D/3D 空间模式与 DSP 调度各有明确对象和初始位置。 |
| l063 | 提醒 Start 会重设 World；Local 对照应在 Start 后修改或先停脚本。提供按钮 Stop() 与 Stop()+Clear() 的可触发比较。 |
| l064 | 新增完整实验驱动，让池实际收到请求；日志含活动子对象数与实例 ID。顺序复用、超额并发、关闭池和关闭驱动分别比较。 |
| l065 | 新增完整固定序列驱动，先记录确认结果再请求表现；发送日志与接受计数分开，理论时点与实际帧时点分开。 |

## 两份新增代码

主编明确授权为 l064/l065 补齐缺失的调用方。原 `OneShotParticlePool.cs` 和 `ImpactFeedback.cs` 的源文原样保留在各自 `code.files[0]`，新增文件分别放在 `code.files[1]`，页面可独立复制。

- `ParticlePoolLabDriver.cs`：与 `OneShotParticlePool` 挂在 PoolHost，把 PoolHost 上的池组件拖到驱动 Pool。非循环 Spark Prefab 拖到池的 Prefab，Max Active=12。驱动启用后先等一帧，再发出 6 次、间隔 1 秒的请求；用实例 ID 看是否复用。并发对照为 14 次、间隔 0，14 只是故意跨过 12 的边界样本。PoolHost 下不手工放其他子对象，活动子对象数才适合此实验。驱动停用仅取消自身后续请求，池停用负责归还活跃实例；重新启用池后需再开关驱动才能重发。
- `ImpactFeedbackLabDriver.cs`：与 `ImpactFeedback` 挂到 FeedbackHost，把反馈组件拖到驱动 Feedback。反馈组件接非循环粒子、AudioSource、Clip，场景保留一个有效 AudioListener。驱动每轮启用把实验生命重设 100，按 0、0.02、0.05、0.06 秒偏移提交，先减 10 并记录，再在反馈有效启用时调用 Present。停用驱动取消剩余请求。它记录实际发送时刻，不保证恰好落在理论毫秒点，也不读取私有接受计数。若要数 Accepted，说明了在学习项目副本的接受分支临时加日志的方法。

这两份是教学驱动，不是正式战斗、存档或性能测量系统。原有池的重置、上限、退出清理和反馈入口的限频边界均保留。

## 菜单和 API 核查范围

- 实际读取 Unity 6000.3 官方文档的 Markdown 内容，确认 `Window > Package Management > Package Manager`、`Create > Animator Controller`、`Window > Animation > Animator`、`Create > UI Toolkit > UI Document`。
- 本机 Unity 6.3 附带 URP 的 `Editor/2D/Renderer2DMenus.cs` 第 170 行使用 `MenuItem("GameObject/Light/Global Light 2D", ...)`。课程据此移除了错误的 `Light > 2D` 额外层级。
- 本机程序集只读反射确认 ParticleSystem 有无参 `Play()`、`Stop()`、`Clear()` 及带参数重载。这不等于已经在 Unity Inspector 逐项点击并运行场景。
- RenderTexture 创建页实际取得了 6000.3 官方 Markdown，页面最后一步写为 `Assets > Create > Rendering > Editor`，末项疑似文档生成问题。课程使用 Unity 6 的 `Assets > Create > Rendering > Render Texture` 标签；此标签仍应纳入编辑器界面抽查，未冒称该官网页面已完整证实末项。
- Frame Debugger 页面有一次 SSL 请求失败，不计作本轮已核验的官网页面。

## 保护字段、校验与剩余验证

最终脚本逐项对照当前 HEAD：课程 ID、先修、课时、时间预算、官方 URL、评分结构、自测答案索引及已有 C# 文件源文均无变化。唯一新增文件为上面两份已授权驱动。

字段检查覆盖 35 课、35 个预测、105 题和 70 实验，缺失数为 0。`npm run check` 通过，20 章、100 课、500 小时、200 实验、300 自测，零错误、零警告。负责的七个章节 `git diff --check` 通过。

本轮没有在 Unity 中逐场景运行，也没有把计算预测写成运行记录。新增 C# 文件由主编合并后统一编译；全站显示与浏览器交互由主编验证。已请求初学者盲读代理只读抽查 l034/l036/l042/l055/l064/l065，后续反馈应继续补入本报告。

## 第二轮盲读后的 l028 补修

主编另行授权我修复基础章 l028。核查确认原 `InputModeProbe.cs` 只有两个切 Map 的入口，没有动作响应输出，也没有保存和清理方向的消费者。因此盲读提出的 P1 不是由片段缺少先修知识造成，原必做实验确实缺少调用与观察通路。

本轮只改 `chapter-06.js` 的 l028。原 `InputModeProbe.cs` 源文保留，新增完整 `InputModeLabConsumer.cs`，两份均挂到 PlayerHost。新组件下一帧从该 PlayerInput 管理的动作中获取 `Gameplay/Move`、`Gameplay/Fire`、`UI/Navigate`、`UI/Submit`，不另外 Enable 动作。Console 输出 performed/canceled，Inspector 显示 Cached Move、Pending Fire Requests、Last Navigate、Submit Count；Fire 只增加本实验待处理计数，不执行射击或移动角色。

为让残留对照可重复，消费者有意在 Move 的 canceled 通知中不归零缓存，也不自动消费 Fire 计数；说明与代码注释均把它标为教学用受控错误。原组件的 Enter menu 只切 Map，消费者的 Enter menu and clear cache 先清自身数据再进入 UI。另有 Report input state、Clear cached input 菜单，不要求读者补接线或自行编写消费者。停用时退订并清理。Clear On Focus Loss 默认 false，避免点击 Inspector 时可能发生的焦点变化提前清掉反例；独立失焦测试才勾选，明确 Alt+Tab、在外部松键、返回后不按新键，再核对归零。

十次改为十轮明确的“玩法→准备方向和请求→清理入口进入UI→松键→回玩法→报告”，每轮记录同一组可见状态。十轮只是小样本稳定性检查，不是保证门槛。第一实验补齐 Input System 包安装与 Player 设置、`.inputactions` 创建、四个动作类型与键盘绑定、PlayerInput Actions/Default Map/Behavior，以及观察前清空 Console 搜索框。设备方案的键盘与手柄绑定分别指明；无手柄时运行验证记未测。真实 uGUI 留为明确的额外实验。

盲读报告中的“具体包引用检查没有指定对象”实际属于 l078，不是 l028。l028 未建立 asmdef；本轮给出实际必需的 Input System 包和 Active Input Handling 检查，没有凭空增加程序集依赖实验。该 l078 项由主编安排对应作者处理。

本机 Input System 包源码 `InputActionImporter.cs` 确认 `Assets/Create/Input Actions`；同包 `Documentation~/composite-bindings.md` 确认 `Add Up/Down/Left/Right Composite`；`control-schemes.md` 确认 Control Scheme 下拉、设备需求与绑定分组。

保留检查：l028 的 ID、先修、课时、时间预算、全部自测内容/答案、官方引用及练习评分不变；本轮其他四课无语义改动。新增文件只有 `InputModeLabConsumer.cs`。修改后内容校验与差异检查通过；两份 l028 文件已用本机 Unity 6.3 附带 Roslyn、UnityEngine 与当前项目 Input System 程序集独立编译，零错误、零警告。未在 Unity 编辑器实际运行此实验。引擎学者已对完整代码与 setup/steps 作只读交叉复核，确认等待、动作归属、受控错误、菜单清理、独立失焦与退订流程相符，未发现可证明缺陷；该结论仍不等于实机输入验证。
