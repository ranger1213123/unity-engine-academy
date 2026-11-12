# 高级章节作者交叉审阅：第 01–07 章

审阅日期：2026-11-12。审阅人：第 15–20 章作者，与第 01–07 章作者分开。

## 范围和方法

逐课阅读第 01–07 章（l001–l035）的理论、示例、前提、实验和自测。重点核对 l006、l011–l015、l016–l025、l026–l030、l031–l035，检查生命周期、Unity 对象空值语义、空间与时间、输入采样/消费以及三维物理的契约。用 Unity 6000.3 官方 API 页面及学习项目已安装的官方 Input System 包源码核对关键断言。

这是教材语义和代码阅读审阅；没有把这些示例导入 Unity 逐一执行，不构成编辑器、设备或 Player 运行验证。Roslyn 隔离编译与网站自动检查由主编另行记录。

## 发现并关闭的问题

### P1：l029 的绑定覆盖不能跨次运行恢复

原示例每次 Awake 都 `new InputAction("Fire", ..., "<Keyboard>/space")`，保存 `SaveBindingOverridesAsJson()`，再对新建动作调用 `LoadBindingOverridesFromJson()`。新建绑定会产生不同 ID，名字相同不能保证持久身份相同，因而“停止并重新播放后恢复”的实验不能成立。

直接证据来自已安装官方包文件：

`projects/tinysword/Library/PackageCache/com.unity.inputsystem@2436e68c60c4/InputSystem/Runtime/Actions/InputActionRebindingExtensions.cs`

其中载入循环用 `entry.id` 构造 `InputBinding` 并调用 `FindBinding`；找不到时输出无法覆盖绑定的警告。它不根据相同动作名字把每次随机产生的绑定自动配回原项。

作者修复后已重新阅读确认：

- 最小单按钮示例保存 `fire.bindings[0].overridePath`，新建动作后明确对唯一绑定索引 0 应用路径。
- PlayerPrefs 键升级为 `learning.fire.singleBindingPath.v2`，避免把旧 JSON 当作路径载入。
- 理论、目标、实验、自测和代码说明同时补充：多动作覆盖 JSON 应应用于保留稳定绑定 ID 的 `.inputactions` 资源；单绑定索引方案不能冒充通用持久化系统。
- 默认恢复仍移除覆盖、删除配置并保存，完整往返实验保留。

结论：本次审阅发现的阻塞项已修复。跨次运行行为仍需学习者按实验在 Unity 中验证。

### 契约补全：l013 的 OnDestroy 适用对象

建议将“不要依赖未活动对象收到销毁回调”写成官方明确前提。作者已补充：`OnDestroy` 只对曾经处于活动状态的 GameObject 调用，曾激活后再失活与从未激活不同。重新阅读修复正文，与官方 API 页面一致。

## 关键契约核对

| 范围 | 审阅结果 |
| --- | --- |
| C# 与 Unity 对象（l006） | 区分托管引用和原生对象寿命；说明 Unity `== null` 的特殊语义，以及 `?.`、`??` 和不同静态类型的边界。 |
| Awake / OnEnable / Start（l011、l015） | 区分 GameObject 的活动状态和组件 enabled；不承诺不同对象的 Awake 顺序；Start 依赖和运行时实例化有前提说明。 |
| 帧与固定步（l012） | 没有把 FixedUpdate 说成独立线程；允许一帧零次、一次或多次固定步，并区分脚本阶段与物理模拟。 |
| 停用、协程与清理（l013–l014） | 区分组件禁用与 GameObject 失活的协程行为；订阅退订保持对称；不把 OnDestroy 或退出回调当可靠存盘保证。 |
| 空间与数学（l016–l020） | 点、方向、世界/局部空间、旋转与缩放分开；斜向限幅保留模拟强度；屏幕深度不冒充世界平面；Slerp 的 t 不是角速度。 |
| 时间和异步（l021–l025） | 区分缩放与非缩放时间；WaitForSeconds 有帧边界；协程不是线程；Awaitable 有池化和单次 await 限制；异步任务讨论取消与对象寿命。 |
| Input System（l026–l030） | 新旧输入后端明确；Actions 与控件分离；回调上下文不跨帧保存；PlayerInput 的动作副本及启停所有权明确；离散命令一次消费。l029 修复见上。 |
| 三维物理（l031–l035） | 动态刚体的状态拥有权清楚；不混淆二维和三维系统；AddForce 的模式、质量和时间单位合理；查询结果与基础控制器能力边界有说明。 |

没有发现需要阻止教材交付的剩余语义问题。此结论限于上述阅读范围和核对方法，不等于覆盖所有 Unity 平台或引擎内部实现。

## 直接查阅的官方依据

以下页面于审阅日成功读取正文：

- [MonoBehaviour.Awake](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.Awake.html)：活动对象、enabled 不影响 Awake 的前提、非确定的跨对象顺序、构造阶段序列化状态。
- [MonoBehaviour.Start](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.Start.html)：实例中仅一次、在 Awake 后、初始化和启用状态的关系。
- [MonoBehaviour.OnDestroy](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnDestroy.html)：仅对曾活动对象调用及移动系统强制终止的限制。
- [Awaitable](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Awaitable.html)：池化、不可重复等待同一实例及主/后台线程切换入口。
- [Rigidbody.AddForce](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.AddForce.html)：Force、Acceleration、Impulse、VelocityChange 的速度变化关系与模拟时机。
- [Quaternion.Slerp](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Quaternion.Slerp.html)：单位四元数、比例 t 与 [0,1] 限制。
- [InputActionRebindingExtensions](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.InputActionRebindingExtensions.html)：覆盖 API；绑定 ID 的具体匹配过程进一步通过上述官方包源码确认。

## 我负责的第 15–20 章交付自检

本轮交付 30 课（l071–l100），每课 5 小时，共 150 小时。理论合计 29,276 汉字，最少一课 925 汉字。每课五个理论主题、两个实验合计 120 分钟、总预算 300 分钟、至少三题带解析自测、两个具体故障案例、两条官方引用和总和 100 分的评分项。26 课包含 C# 示例；多文件示例已拆为 `code.files`。

高级章节实际来源及可选包的版本边界记录于 `research-advanced.md`。示例未标记为已通过 Unity 运行测试。
