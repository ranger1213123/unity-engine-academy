# 进阶35课：情景、操作入口与实验目的复核

本轮负责第14—20章（l066—l100），以已公开提交 `3aaa15f` 为保护基线。目标是让读者在不知道作者脑中情景的情况下，也能理解对象是谁、为什么比较、如何开始运行、到哪里观察。此次没有把“更通顺”当作删短句子的比赛；优先修复缺背景、缺调用方和缺观察入口的断点。

已为35课补齐 `teaching.scenario`、`teaching.purpose`、`teaching.prediction.scenario`；为105道题补齐独立背景；为70组实验补齐 `setup` 数组和 `purpose`。对象名、数值与流程明确作为教学配置，不冒充设备实测。A/B、甲乙等称呼均有具体对应对象；题目不需要读者返回上一段猜主语。

## 逐课处理

| 课 | 本轮具体处理 |
|---|---|
| l066 | 定义Bootstrap入口、Content临时关卡和运行时marker；补ReferenceHolder与手动空值报告，交代暂停时赋引用、卸载后观察。 |
| l067 | 交代Ready、0.9、isDone和手动激活门所处状态；明确组件菜单位置与禁用组件的对照范围。 |
| l068 | 将关卡明确为LevelA/LevelB，服务实例与临时观察者分别追踪；补场景切换、成对订阅探针。十次用于观察累积。 |
| l069 | 把两条路径说明为示例held与SecondHolder.texture；补可清引用的TextureHolder，明确Resources路径和编辑器额外引用限制。 |
| l070 | 明确借出的实例、目标甲乙、容量4与跨容量借十个的关系；标清组件菜单与借出/归还观察量。 |
| l071 | 区分代码默认值、场景/实例已有序列化值及Play临时修改；交代Inspector选择对象与重新加载的对照。 |
| l072 | 定义共享CharacterDefinition与两个角色实例状态；写明创建资源菜单、资源赋值及单次伤害入口。 |
| l073 | 用42→9→42与两次Play检查文件恢复；独立练习另规定关闭重开Unity进程。补只读SavePathProbe，定位后清Console搜索，避免隐藏缺失/错误日志。 |
| l074 | 明确v1 coins、v2 currency、未来99各自输入；补完整迁移调用器，重复迁移输出并标明该调用器不写文件。文件事务仍是另一步。 |
| l075 | 明确条目列表与字典角色；补StatTable读取驱动，报告成功标志和值；多态/身份比较作为明确标记的独立扩展。 |
| l076 | 用同一Player刚体的向右意图与向左抢写说明最终控制权；补菜单意图驱动及故意冲突组件，明确普通SetIntent需要调用方。 |
| l077 | 将“血条”先缩为输出HP的观察组件，补伤害菜单；区分快照日志、伤害通知和驱动日志，避免数回调时把它们混算。 |
| l078 | 提供完整Rules、Adapters、EditorTools路径和配置；纯规则、Start调用、Editor菜单各自说明。JSON与C#逐文件标语言；点名运行程序集并保存BoundaryLab场景，无额外包检查记不适用。 |
| l079 | 补Package Manager、Test Runner、测试程序集与Rules引用准备；解释五类边界样本各自目的，不要求把测试挂对象。 |
| l080 | 明确测试自建对象、Unity空值与托管引用；解释十次检查跨次污染，并区分渲染帧等待与物理推进。 |
| l081 | 给出Profiler与Timeline入口、自定义标记名、Iterations与采样条件；十秒只是连续样本，编辑器和Player分别记录。 |
| l082 | 补同工作量的新数组/复用数组驱动；纠正把每秒一条采样日志当整秒分配总和的风险，保留查询容量扩展。 |
| l083 | 明确URP Shader属性前提、独立材质实例、Frame Debugger入口；帧调试后再计真实时间，分辨率与对象数分别改变。 |
| l084 | 补批量借还与可重复场景夹具，在同次Play进入/自动归还/退出/卸载清理，完成日志后计轮；另有静态纹理持有/报告/释放菜单，副本明确为另存场景。 |
| l085 | 给出Sensor与近远目标坐标，补查询菜单；说明样例是完整遍历参考，不是已测更快，三个采样区间用于看稳定性。 |
| l086 | 明确甲3乙5、Runtime/Editor路径、多选和序列化编辑；四组编辑情况分别验证，扫描不靠重绘次数驱动。 |
| l087 | 给出菜单、根对象位置、Undo/Redo操作；Prefab使用Marker子对象并分别计算局部与世界值，不用根变换冒充普通覆盖。 |
| l088 | 补三维Physics.OverlapSphere查询驱动、内外测试Cube坐标；移除尺子Collider，避免它混入命中，保留句柄撤销测试。 |
| l089 | 三张PixelArt目标与一张UI例外有明确路径；三次Reimport用于幂等对照，切片、PPU和发布格式明确不由最小脚本包办。 |
| l090 | 明确最小扫描只查选中对象自身Missing Script；提供专用缺失脚本样本做法，Idle诊断标为尚需实现的扩展。 |
| l091 | 写明NavMeshSurface添加与Bake，补路径状态菜单；请求接受、路径状态与到达分别观察，场景包含连通与孤立目标。 |
| l092 | 定义四项翻倍输入与结果、分配到释放顺序；A/B明确为翻倍与求和任务，区分依赖安排与立即Complete。 |
| l093 | 补完整主线程平方驱动，明确作业不是组件；给Burst Inspector入口，0/-3/2与0/9/4先手算，再讨论完整成本。 |
| l094 | 给SubScene新建、自动加载和Entities Hierarchy入口；另补真实生成但无LabLifetime的对照实体，排除“未生成”假象。 |
| l095 | A/B/C/D逐一对应传统组件、集中循环、Jobs+Burst、可选ECS；三规模用于固定开销比较，未验证方案不填猜测数据。 |
| l096 | 明确Windows模块、Editor脚本菜单、输出位置和独立启动；说明EditorBuildSettings与Profile覆盖不是任意自动合并。 |
| l097 | 定义编辑器/Windows Player、切窗口/最小化/恢复操作矩阵；探针只观察，存档需另有组件，系统挂起不保证持续更新。 |
| l098 | 提供实际命令行参数形态、Unity路径确认、项目锁前提；把本次报告、返回状态与旧exe区别开来，失败阶段明确停止。 |
| l099 | 明确文件42、候选42、角色100、界面0等分叉如何定位；只组合已验证样本，写出反例、Player与交接记录。 |
| l100 | 指明陌生条件组合、先预测后观察的顺序；五张修订卡要求来自真实误判，不为凑次数造错。 |

## 新增调用方与配置

本轮最终新增22份C#文件与2份JSON配置。原有40份示例文本逐字保留，其中是36份C#、1份JSON、3份text。原先把这40份统称“40个C#文件”的统计口径不准确，本报告予以更正。

| 课 | 新增文件 | 谁触发、做什么 |
|---|---|---|
| l066 | ReferenceHolder.cs | Inspector菜单主动报告两种null；不读取失效对象属性。 |
| l068 | SceneSwitchProbe.cs | Inspector菜单请求Single加载LevelA或LevelB。 |
| l068 | SceneVisitObserver.cs | 引擎启停回调建立/解除订阅，sceneLoaded事件触发报告。 |
| l069 | TextureHolder.cs | Inspector提供第二条引用，菜单只清该字段。 |
| l073 | SavePathProbe.cs | 引擎调用Start，只输出完整专用存档路径，不读写文件。 |
| l074 | SaveMigrationProbe.cs | 菜单主动调用纯迁移函数，报告三种版本及重复执行。 |
| l075 | StatTableReadProbe.cs | Start首次查询，之后菜单手动查询指定键。 |
| l076 | MotorIntentProbe.cs | 菜单主动调用SetIntent，避免以为public方法自动执行。 |
| l076 | ConflictingVelocityProbe.cs | 故障副本中由FixedUpdate故意抢写同一速度。 |
| l077 | HealthDamageProbe.cs | 菜单主动调用Damage，观察者再同步接收事件。 |
| l078 | Assets/EngineLab/Rules/DamageRule.cs | 纯数值函数，由运行适配器调用。 |
| l078 | Assets/EngineLab/Adapters/EngineLab.Adapters.asmdef | JSON配置，引用Rules；不是可编译C#。 |
| l078 | Assets/EngineLab/Adapters/RuleBoundaryProbe.cs | 挂对象后由Start调用DamageRule。 |
| l078 | Assets/EngineLab/EditorTools/EngineLab.EditorTools.asmdef | JSON配置，平台只限Editor并引用Adapters。 |
| l078 | Assets/EngineLab/EditorTools/RuleBoundaryMenu.cs | 顶部菜单主动报告运行类型，验证引用方向。 |
| l082 | AllocationWorkProbe.cs | Update执行等量64项计算，切换分配与复用。 |
| l084 | PoolCycleProbe.cs | 菜单租借/归还本驱动批次；新增显式ReturnBeforeSceneExit供场景夹具调用，退出时清理自己仍持有的借出实例。 |
| l084 | RepeatedMemorySceneProbe.cs | 菜单反复加载MemoryContent，返回前归还批次，等待销毁阶段、卸载、一次资源清理，再打印完成轮数；预热后可归零。 |
| l084 | StaticTextureRetentionProbe.cs | 菜单把自制Resources纹理保留在静态字段，另有报告及解除本引用后清理的入口。 |
| l085 | NearestQueryProbe.cs | 菜单主动查询并报告目标，计时前停用日志。 |
| l088 | Runtime/WorldRadiusQueryProbe.cs | 播放中菜单执行3D球查询，报告命中。 |
| l091 | NavigationStatusProbe.cs | 播放中菜单读取路径状态，不宣称自动判定到达。 |
| l093 | BurstSquareProbe.cs | 播放中菜单分配、调度、Complete、逐项比较、释放。 |
| l094 | ComparisonEntityAuthoring.cs | Baking生成带LabComparisonTag的实体，不被Lifetime查询匹配。 |

l078的三个JSON文件均显式标为 `language: json`，同一代码块的三个C#文件显式标为 `language: csharp`。其余新C#文件沿用所在代码块的csharp语言。单文件示例转换为 `code.files` 时，原文件名和source保持不变。

l078须区分两层检查：主编的独立C#编译只确认样例语法与引用API能够解析，不会自动按Unity项目目录建立三个asmdef，也不能证明 `noEngineReferences` 或 `includePlatforms` 在真实项目里生效。边界实验必须按完整路径放入Unity，让Rules成功编译纯函数，再临时加入UnityEngine类型确认被拒绝；Editor隔离还须独立Player构建验证。故意越界的行只在故障副本中添加，不属于正常示例源码。JSON配置不得作为C#提交给编译器。

## 重复与对照为什么这样安排

- l066/l068/l069：十轮切换或加载退出观察逐轮遗留、事件累积和资源趋势，不能作为所有运行条件正确的证明。
- l070：借十个是为了超过示例闲置容量4，观察活跃数量与闲置上限的区别，不是对象池的固定使用次数。
- l073：同轮42→9→42检查读取，第二次Play先把当前值再设9后加载，排除数值碰巧未变；独立练习另做关闭重开Unity进程。缺失、语法坏、数值非法是三种不同失败。
- l074：迁移有效输出再迁移一次，专门检查重复执行是否重复发货币；文件事务中断点覆盖不同提交状态。
- l076：固定向量与一个故意抢写者隔离输入设备问题；正常与冲突是受控的两个版本。
- l077/l080：十次用于放大订阅累积或跨次测试污染，仍需覆盖其他进入/退出条件。l077特别区分快照与事件日志。
- l081：十秒是一段连续样本，不是性能标准；循环量和限帧分两次改变。
- l084：预热一轮后在菜单状态归零，再在同一次Play记录第1/5/10轮；每轮以cleanup complete信号结束。借20是超过闲置容量16，不是内存泄漏判定阈值。静态引用实验是可控制的一条持有路径，不声称同一资源每次Load都会新建副本。
- l085：三个相同采样区间用于看波动，不挑最快区间。
- l086：单选、多选、Undo、Prefab四组各覆盖不同编辑机制。
- l089：三张目标加一张范围外图检查作用范围，三次Reimport检查幂等，不是要导三遍才生效。
- l093/l095：三规模研究固定成本占比；平方输入0、负数、普通值先验证结果，不代替所有数值边界验证。
- l100：五张修订卡用于展示不同模型怎样修正，不能为完成清单伪造错误；不足时继续研究未掌握边界。

## 实际核对的官方操作依据

本轮读取下列页面正文核对入口。旧docs.unity3d.com手册路径常重定向到docs.unity.com，未把404的猜测路径当证据。

| 操作 | 核对依据与正文信息 |
|---|---|
| Console | [Unity 6.3 Console](https://docs.unity3d.com/6000.3/Documentation/Manual/Console.html)：Window > General > Console。 |
| Package Manager | [Unity 6.3 Package Manager](https://docs.unity3d.com/6000.3/Documentation/Manual/upm-ui.html)：入口在Window > Package Management。 |
| Build Profiles | [Unity 6.3 Build Profiles](https://docs.unity3d.com/6000.3/Documentation/Manual/build-profiles.html)：File > Build Profiles。 |
| Profiler | [Navigating the Profiler](https://docs.unity.com/en-us/engine/6000.3/manual/analysis/profiler/window-navigating)：Window > Analysis > Profiler，另有Ctrl+7。 |
| Frame Debugger | [Debug a frame](https://docs.unity.com/en-us/engine/6000.3/manual/analysis/graphics-performance-profiling/profile-rendering/frame-debugger/debug)：Window > Analysis > Frame Debugger；调试会暂停运行。 |
| Test Runner | [Create a test assembly](https://docs.unity.com/en-us/engine/6000.3/manual/programming-environment/test-framework-introduction/getting-started/workflow-create-test-assembly)：Window > General > Test Runner；可创建Test Assembly Folder并核对引用。 |
| Burst Inspector | [Burst 1.8 Inspector](https://docs.unity3d.com/Packages/com.unity.burst@1.8/manual/editor-burst-inspector.html)：Jobs > Burst > Open Inspector。 |
| NavMesh Surface | [AI Navigation 2.0 Create NavMesh](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/CreateNavMesh.html)：Inspector > Add Component > Navigation > NavMesh Surface，然后Bake。 |
| SubScene | [Entities 1.4 SubScenes](https://docs.unity3d.com/Packages/com.unity.entities@1.4/manual/conversion-subscenes.html)：Hierarchy右键New Sub Scene > Empty Scene；Inspector可设Auto Load Scene。 |
| Entities Hierarchy | [Entities 1.4 Hierarchy](https://docs.unity3d.com/Packages/com.unity.entities@1.4/manual/editor-hierarchy-window.html)：Window > Entities > Hierarchy；区分Authoring与Runtime数据。 |

文件夹内的示例菜单由CreateAssetMenu或MenuItem声明，Inspector的组件菜单由ContextMenu声明；报告和教材都区分了这些自定义入口与引擎内置菜单。未假定窗口固定在屏幕左侧或右侧。

## 保护检查、独立阅读与限制

以 `3aaa15f` 比较七章：35课ID、标题、先修、课时、timePlan未改；300道全书测验中本分工105题的题干、选项、答案索引和原解析未改，只新增独立背景；原官方URL全部保留。40份既有source逐字相同。新增22份C#和2份JSON均有明确文件名、目录及触发说明。

已实际运行七章 `node --check`，通过；`git diff --check` 通过。最终新增程序集/实体对照后再次运行 `npm run check`，通过：20章、100课、500小时、200组实验、300道题，零错误与警告。本分工不将其他学者的改动记作自己的成果。

作者自查按“只读一题或一组实验能否回答对象是谁、初值是什么、谁调用、何处观察”逐项复读，修复了l085题背景与题干不对应、l086的3/5与3/7不一致、l088尺子Collider干扰等问题。本报告不把作者自查称为独立读者验收。

主编随后安排的新读者盲读见 `CONTEXT-reader-review.md`。其中本分工的P1-02/P2-02/P3-01（l073搜索筛选、两次Play与进程重启、角色指代）、P2-03/P2-04（l078额外包、运行程序集与场景）均按具体对象和动作修复。P1-03/P2-05指出l084无法在同次运行重复进退、静态持有无触发入口；引擎学者也独立确认原l066脚本只能自动执行一轮。由此补了上述两个夹具，并修改本轮新增PoolCycleProbe暴露退出前归还方法。原l066和BoundedPoolProbe核心源码没有改。修复是根据独立反馈完成，仍需读者复读确认，不能把它表述为已经在Unity跑通十轮。

引擎学者随后只读复核l084新夹具与操作链，确认原重复进退P1在静态层面关闭：busy防并发，卸载前显式归还，等待销毁帧、卸载和清理后计轮；Retention场景与静态Hold/Report/Release入口也有闭合步骤。该复核没有发现已声明实验路径中的新增释放断点，仍未替代实际Unity场景运行。

本轮没有在Unity内逐场景运行35课，也没有把数值例子写成性能实测。新辅助C#编译、网页渲染、全书保护hash与发布由主编统一核验。对于明确标记的独立设计练习（例如事务保存、复杂查询缓存、集成移动测试、Idle规则扩展），教材给出输入和验收要求，仍要求学习者实现；它们与最小示例缺必需调用方的断点已经区分。
