# 引擎机制学者审订记录

审订日期：2026-11-12。基线为 Unity 6.3 LTS（6000.3）与 Input System 1.20。角色侧重引擎机制、可检验的技术前提，以及初学者容易遗漏的中间步骤。

本轮负责第01—06章，共30课。逐课阅读正文、导读和示例，并核对实验与自测的技术含义；30课实际修改，其中第001课调整导读使其与探针实验对应，其余29课修正或补充正文。未把这次分工表述为独立逐句审完全部100课。

## 实质纠误

**第020课的辅助线不能被解释为三种转换各画一条不同轨迹。** 示例红线从对象世界位置连到 `TransformPoint(local)`，绿色射线从同一起点沿 `TransformVector(local)` 绘制。世界点减起点恰好是对应世界向量，因此红绿线应重合；后绘制的绿色还可能盖住红色。原导读暗示三条线应不同，容易让学生把正确结果当成故障。现已同步修正正文、开篇问题、三步数字例题、预测题、实验步骤和代码说明，新增数值对照表与组件菜单报告。取世界位置5、缩放2、局部输入1，分别推导 Point=7、Vector=2、Direction=1，再推导各线终点，明确返回量与画线方式的区别。

**第011课必须先说明 Start 是否执行过。** “第一次 Update 之前禁用”并不能证明 Start 尚未执行。写作学者交叉复读指出此歧义后，预测题已改成“在 Start 尚未执行时禁用”，答案解释这一前提的重要性。

**第030课不能把跨阶段时间读数说成同一瞬间。** `Time.timeAsDouble` 在 Update 表示帧游戏时间，在 FixedUpdate 中则返回固定步时间。新增两阶段偏移与离散检查的解释，明确这是教学缓冲，不是精确输入回放。原实验要求手工在0.15秒窗口内切 Inspector 条件，不利于可靠复现；改为先用2秒窗口理解规则，再由脚本安排0.15秒边界测试并记录两个阶段的时间。

## 逐课覆盖

| 课程 | 本轮处理的问题与结果 |
| --- | --- |
| l001 | 原开篇移动故障与实际固定步设置例题不对应；改成探针是否能证明帧率变化，明确设置、执行与显示证据的区别。 |
| l002 | 区分 Sprite 资源与任意图片，补足 Transform、Component、Behaviour、MonoBehaviour 的关系，说明组件开关并非一套通用规则。 |
| l003 | 用文件 GUID 与内部子资源标识解释改名、meta 丢失和重新切片为何产生不同引用结果。 |
| l004 | 补上 OnValidate 可能来自非主线程、不能随意创建场景对象、也不自动持久化计算值的前提。 |
| l005 | 区分空引用与已销毁 Unity 对象的可能诊断，不再把所有 target 访问失败都概括为一种异常。 |
| l006 | 将 `is null` 纳入托管引用与原生对象比较，明确三种对象状态和三种比较方式的表格。 |
| l007 | 说明 Inspector 直接写序列化字段，不会经过属性 setter 或 TrySetSpeed，分开检查编辑路径与运行调用。 |
| l008 | 补足 GetComponentInChildren 先查自身、默认不搜索未激活子对象，以及多候选结果并不等同业务目标。 |
| l009 | 解释普通多播事件处理中的异常会中断后续调用，避免误以为事件自带独立投递与异常隔离。 |
| l010 | 推导倒序删除为何不漏相邻元素，并明确回调仍会改动集合时不能机械套用此结论。 |
| l011 | 区分 `new` 普通对象与正常挂接的 MonoBehaviour；主动调用生命周期方法不会重建引擎状态。修正 Start 预测前提。 |
| l012 | 引入 maximumDeltaTime 对长帧时间与固定步追赶的限制，不以真实卡顿时长推断无限补步。 |
| l013 | 用 Destroy(this) 与 Destroy(gameObject) 区分只销毁脚本组件和销毁整个对象。 |
| l014 | 分开取得 IEnumerator 与 StartCoroutine 实际推进迭代器，补上第一次 yield 前的执行起点。 |
| l015 | 用明确的 Prepare→取得数据→Init 调用链解释启动顺序，说明异步完成和循环依赖不能用顺序数字代替。 |
| l016 | 指出 Attach 只归零位置和旋转，没有重置 localScale；尺寸一致需独立规定和验收。 |
| l017 | 用两个单位向量的数值推导有符号投影长度与投影向量，说明参照方向归一化的前提。 |
| l018 | 计算固定0.1比例十次后仍剩约31.4度，区分调用次数、按秒衰减与固定时长。新符号均在句中解释。 |
| l019 | 说明 ScreenPointToRay 从近平面对应位置发出，distance 从 ray.origin 量起，正交相机射线方向平行但起点不同。 |
| l020 | 修复红绿线重合的核心教学错误；补数值报告入口、对照表及平移前后完整推导。 |
| l021 | 明确 FixedUpdate 中 deltaTime 的固定步语义，以及卡顿后 maximumDeltaTime 对缩放时间增长的影响。 |
| l022 | 给出 WaitUntil 在 Update 后、LateUpdate 前检查条件的具体阶段；提醒条件函数避免反复产生副作用。 |
| l023 | 区分 CancellationTokenSource.Cancel 与 Dispose，解释旧任务收尾不应清理新一轮状态。 |
| l024 | 区分人工传入10.2秒的算法测试与引擎经过 maximumDeltaTime 限制后提供的实际 deltaTime。 |
| l025 | 在t=0.25秒算出 previous=0.1、current=0.2、显示=0.15，分清相对最新样本和连续运动的延迟。 |
| l026 | 用两个摇杆的具体数值说明 Value 动作不会简单相加所有绑定输入，需记录实际驱动控件。 |
| l027 | 用 Hold 区分跨过按下阈值与保持完成，解释 WasPressedThisFrame 为真而 performed 尚未发生的情况。 |
| l028 | 补足 PlayerInput 与 UI Input Module 的动作同步和玩家身份，避免只凭共用资源就认定运行中引用相同。 |
| l029 | 区分 overridePath=null（无覆盖）与空字符串（禁用绑定），说明恢复默认应移除覆盖。 |
| l030 | 修正跨 Update/FixedUpdate 的时间解释，先用可操作的长窗口验证，再用自动条件检查短窗口边界。 |

## 官方依据

实际打开核对了以下相关官方说明，HTTP 200 仅表示链接可访问，技术结论依据正文而非状态码：

- [OnValidate](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnValidate.html)：加载线程、轻量数据校验与不自动保存。
- [TransformPoint](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformPoint.html)、[TransformVector](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformVector.html)：点与向量转换的平移、缩放含义。红绿线重合由这些定义与示例画线参数推导。
- [GetComponentInChildren](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.GetComponentInChildren.html)：先检查自身、搜索活动子对象与 includeInactive。
- [maximumDeltaTime](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-maximumDeltaTime.html)、[deltaTime](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-deltaTime.html)、[timeAsDouble](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-timeAsDouble.html)：时间上限和固定步语义。
- [WaitUntil](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/WaitUntil.html)：条件委托检查阶段。
- [ScreenPointToRay](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Camera.ScreenPointToRay.html)：射线的世界空间与近平面起点。
- [InputActionType](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.InputActionType.html)、[InputAction](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.InputAction.html)、[PlayerInput](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.PlayerInput.html)、[InputBinding](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.InputBinding.html)：值动作选择、按下与交互、UI动作同步及覆盖空路径的含义。

为相关课程增加8条支持性引用条目，涉及6个不同的官方页面。既有官方 URL 未替换。

## 代码、结构与验证边界

- 本轮1—6章只有 l020 的 C# 源码发生改变，增加只读的组件菜单报告；没有改变原 Gizmo 的绘制算法。旧源码 SHA-256 为 `c19a29c280d1949e3416081901ce9050577cea29fdd1c501a0675e14c2875a2f`，新源码为 `884432f8dd7cbd55ad14ccd56ccdb989bd6bd3437e9fa2d852f98c0049dd1aee`。
- 与提交 `87f2fa6` 比较，30课 ID、先修、5小时课时与300分钟分配保持一致，90道自测的题干、选项、答案索引、解析均未修改。实验只改文字与可复现步骤，没有修改分钟数或独立练习评分。
- `npm run check` 通过：20章、100课、500小时、200实验、300自测，错误与警告均为0。此检查是结构检查，不代表语言或机制已经没有任何问题。
- 本次未在 Unity 编辑器中逐课执行场景。l020 需要主编重新进行实际编译检查；浏览器显示也由主编统一验证。不能把原版的编译结果直接宣称为新增代码已通过运行。
- 写作学者只读交叉复核 l001/l006/l010/l011/l012/l014/l020/l022 后，提出并关闭了 l011 预测前提、l020 残余表述和 l006 表格描述三项问题；未据此扩大为全书逐句互审。

## 跨章节复核与问题关闭

在其他两位学者的修订落盘后，完整阅读了 l031/l033/l034/l035/l058/l083/l087/l090 的正文、导读、示例、实验与自测。这里的8课是实际交叉复核范围，没有扩展为对其余章节的逐句背书。

| 课程 | 复核发现及最终处理 |
| --- | --- |
| l031 | 开篇要求不挂移动脚本，实验却要求禁用“控制脚本”。作者改为禁用本课只读状态探针，明确观察脚本与刚体模拟不是同一开关，已复读确认。 |
| l033 | 多形状归并为角色计数的0→1→2→1→0过程、普通三维碰撞前提与 disabled MonoBehaviour 接收物理消息的表述，未发现新增实质错误。仍需按目标场景实际验证。 |
| l034 | 代码字段是 targets，说明误写为 environment；作者已统一，最终复读确认。掩码8与1<<8=256的推导、查询几何与同步限制一致。 |
| l035 | 适配器会在运动层停用后继续向普通公开方法提交输入，重新填入刚清空的方向和跳跃。作者新增 ClearInput 同时清两类状态，以 isActiveAndEnabled 阻止向停用运动层提交；输入层停用、设备缺失与失焦也清理。又补 OnApplicationFocus 回调，避免后台停止 Update 时清理根本没有执行。最终源码、说明和分别停用两层的实验已复读确认；这仍不是全平台暂停方案。 |
| l058 | 发现官方 AddListener 说明与本机程序集探针不一致，详见下文。作者最终不再保证自动去重，改为明确注册者、保存同一委托并配对解绑；积累演示使用每轮新建局部变量的不同闭包。正文、导读、故障原因与实验已复读确认。 |
| l083 | SRP Batcher 减少兼容绘制间的 CPU 状态准备，不保证 Draw Call 同比下降；GPU Instancing 的条件与独立材质观察实验未被混为同一机制。未发现新增实质错误。 |
| l087 | 原 Prefab 实验直接改根位置，再要求用普通覆盖 Revert 回源位置，忽略根 Position/Rotation 特殊规则。作者改用实例内 Marker 子 Transform：源局部X=1、实例根世界X=2，子世界X=3；工具后子世界X=0/局部X=-2，Revert后恢复局部1/世界3，根仍为2。已核对官方 Transform overrides 说明并复读最终正文、代码前提和实验。 |
| l090 | 只扫描选择对象本身、不递归、不修复的示例，与只读范围、缺失脚本计数及 Console 对象上下文的说明一致。未发现新增实质错误。 |

### UnityEvent 文档与程序集观察的差异

6000.3 官方 `UnityEvent.AddListener` 页面在本轮访问时写明：同一监听重复添加，每次事件只调用一次。为核对这项结论，在不启动或修改用户 Unity 项目的条件下，通过 PowerShell 加载本机 Unity 6000.3.28f1 安装附带的 `UnityEngine.CoreModule.dll`，创建一个 UnityEvent 和一个 UnityAction，向同一事件连续两次添加同一委托变量，再调用一次 Invoke；计数结果为2。该程序集 SHA-256 为 `7e218ca5a8bf0890bf310361b25a2aed323a7642fcba2ce803cb4a23be13272b`。

这是纯托管程序集探针，不是 Unity 场景测试，不能据此宣称所有平台或版本都已验证。但既然观察与页面表述不一致，教材不宜把自动去重作为正确性的前提。最终正文采用显式管理一次注册与对应解绑；本轮保留差异供目标版本场景复核，并将官方说明、实际观察和工程选择分别记录。不同闭包保留旧数据的实验不依赖这一争议行为。

跨审发现均已向对应作者与主编反馈，并在最终落盘文本中复读确认；新增 C# 的编译与网站整体浏览器验证仍由主编统一执行。没有把源码复读或本次纯托管探针算成逐课 Unity 场景运行通过。
