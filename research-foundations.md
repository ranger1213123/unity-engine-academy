# 第 1–7 章：官方依据与技术核验

核验日期：2026-11-12。文档基线为 Unity 6.3 LTS（6000.3），输入包基线为当前学习项目的 Input System 1.20.1。以下页面通过直接读取官方页面正文核验；引用状态的全量检查由主审另行生成。教材使用原创中文解释，并区分官方契约、实验推论与尚未运行的验证计划。

## 对象、C# 与生命周期

- [GameObject](https://docs.unity3d.com/6000.3/Documentation/Manual/class-GameObject.html)、[Components](https://docs.unity3d.com/6000.3/Documentation/Manual/Components.html)：200。用于解释场景对象、组件、活动状态与资源/实例的边界，不把脚本类等同于任意可直接 new 的引擎组件。
- [Object.operator ==](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object-operator_eq.html)：200。原生对象已经销毁而托管包装引用仍存在时，Unity 空值比较与普通 C# 引用身份不是同一种判断。教材明确 `ReferenceEquals`、`?.`、`??` 不应被当成同一检测。
- [Event function execution order](https://docs.unity3d.com/6000.3/Documentation/Manual/execution-order.html)：200。核实 Awake、OnEnable、Start、Update、FixedUpdate 和 LateUpdate 的阶段关系。没有给不同对象同名回调虚构全局顺序，也没有把固定步说成独立线程。
- [MonoBehaviour.Awake](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.Awake.html)、[Start](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.Start.html)：200。区分 inactive GameObject 与 disabled MonoBehaviour，讨论实例化、首次启动和协程 Start 的边界。Start 的第一次等待之后不是其他对象的全局准备屏障。
- [MonoBehaviour.OnDestroy](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnDestroy.html)：200。正文明确只对曾激活的 GameObject 调用，并警告移动平台挂起后可能被系统直接结束。教材因此不把退出或销毁回调当作唯一存档保证。
- [Coroutines](https://docs.unity3d.com/6000.3/Documentation/Manual/Coroutines.html)：200。协程不是线程；仅禁用组件与关闭 GameObject 对现有协程的行为不同，不能假定 disabled 脚本会自动停止全部协程。

## 空间、时间与异步

- [Transform](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.html)、[Transform.SetParent](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.SetParent.html)：200。核实世界/局部位置和重新设父的空间含义。教材以父级旋转和非均匀缩放制造反例，不把位置差直接当局部方向。
- [Transform.TransformDirection](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformDirection.html)：200。方向变换不受平移与缩放影响；与点变换的适用语义分开。
- [Quaternion.RotateTowards](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Quaternion.RotateTowards.html)：200。角速度转为单步角度上限，不把插值参数当固定持续时间。
- [Camera.ScreenToWorldPoint](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Camera.ScreenToWorldPoint.html)：200。z 是相对于相机的深度，鼠标屏幕位置不能不加前提直接当世界平面交点。
- [WaitForSeconds](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/WaitForSeconds.html)：200。等待使用缩放时间，从当前帧结束开始，并在满足条件后的帧恢复；教材没有承诺硬实时精度。
- [Awaitable](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Awaitable.html)：200。核实池化与续体边界，明确不能像普通 Task 一样多次等待同一个 Awaitable 实例；切换后台线程也不允许任意调用 Unity 主线程 API。

## 输入系统

- [Input System manual](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/index.html)、[Actions](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/Actions.html)、[Settings](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/Settings.html)：200。把设备控件、Actions、Maps、控制方案、更新模式和玩法意图区分，不混用旧 `UnityEngine.Input` 与新包。
- [InputAction](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.InputAction.html)：200。代码自行创建的动作有 Enable、Disable 和 Dispose 责任，动作回调不直接夺取动态刚体的物理更新所有权。
- [Rebind an action at runtime](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/rebind-action-runtime.html)、[InputActionRebindingExtensions](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.InputActionRebindingExtensions.html)：200。核实覆盖非破坏式修改默认路径，交互式 RebindingOperation 在成功、取消、关闭等路径都需结束并释放。
- 本地 `com.unity.inputsystem@2436e68c60c4`（manifest 所对应 1.20.1）源码再次核实 JSON 恢复按绑定 ID 查找：`InputSystem/Runtime/Actions/InputActionRebindingExtensions.cs` 的 `LoadBindingOverridesFromJsonInternal` 使用 `entry.id` 查找并应用覆盖。l029 因此不再对每次新建、ID 不稳定的动作直接载入旧 JSON，而将最小单按钮实验限定为保存并恢复唯一绑定路径。完整多绑定持久化要求稳定资源身份。

## 三维物理与控制权

- [Rigidbody](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.html)、[linearVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-linearVelocity.html)、[AddForce](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.AddForce.html)：200。Unity 6 代码使用 linearVelocity。设置速度是明确的街机控制取舍，不能默认推荐覆盖自然模拟的所有结果；力模式、单位与质量关系分别解释。
- [Rigidbody.MovePosition](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.MovePosition.html)：200。作为合适刚体模式下的物理移动入口，不与每帧 Transform 写入混成两个控制者。
- [MonoBehaviour.OnCollisionEnter](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnCollisionEnter.html)、[OnTriggerEnter](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnTriggerEnter.html)：200。检查刚体与 Collider 条件，以及禁用 MonoBehaviour 仍可收到相关物理消息的文档边界。
- [Physics.Raycast](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.Raycast.html)：200。使用 LayerMask、距离与触发策略建立查询契约，不假定射线从 Collider 内部必能命中该 Collider。
- [Rigidbody.collisionDetectionMode](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-collisionDetectionMode.html)：200。CCD 有模式和成本边界；插值是显示层处理，不能替代接触检测。
- 本章补充 RigidbodyConstraints、Joint 与 Transform 父子层级的区别；控制器对照中明确 CharacterController.Move 不自动施加重力，与动态刚体属于不同控制权模型。

## 文档路径修订

实际读取发现旧 `Manual/ExecutionOrder.html` 不可用，已改用 `Manual/execution-order.html`。Input System 1.20 的旧 `ActionBindings.html`、`Workflow-Direct.html` 不可用，动作页实际指向 `using-actions-workflow.html`、`using-direct-workflow.html`、`rebind-action-runtime.html`。教材按实际页面更新，不能只从旧教程推测 URL。路径状态检查不等于理解内容；本记录列出了相应关键契约。

## 作者自检与验证范围

- 7 章、35 课、175 小时；每课 5 小时是阅读、预测、120 分钟引擎实验、独立练习、自测与复盘的完整预算，不是声称阅读网页即可自动积累 175 小时。
- 理论正文共 33,564 个汉字，单课最低为 l015 的 901 个汉字。每课至少有三段理论主题、两组实验、两项故障诊断、三道有解析自测、两个官方引用和总分 100 的评分规约。
- 跨作者审阅已修复 l029 绑定身份持久化错误，补强 l013 的 OnDestroy 激活前提；第 8–13 章的交叉审阅另见 `REVIEW-foundations-cross.md`。
- 没有修改用户的 tinysword 学习项目。代码实验未逐课在 Unity 场景中运行；主审的隔离编译不能替代场景、物理、输入设备和平台运行验证。无法验证的范围在教材和审校记录中保留。
