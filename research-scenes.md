# 场景与资源章节的官方资料阅读记录

检查日期：2026-11-12。编写范围：第 14 章，l066–l070，共 25 小时。基线为 Unity 6.3（6000.3），Addressables 为可选的 2.7 系列资料。本记录列出编写和复核中实际阅读的关键契约，不表示逐字通读整个官方站点。

- [SceneManager.LoadSceneAsync](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.SceneManager.LoadSceneAsync.html)：场景名/路径与加载模式，异步操作完成与自定义内容准备的边界。叠加加载、活动场景和对象归属在教材中分别观察。
- [AsyncOperation.allowSceneActivation](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AsyncOperation-allowSceneActivation.html)：禁止激活时进度停在 0.9，isDone 保持 false，并可能阻塞后续异步操作队列。不能等待 isDone 才开放激活门。
- [Object.DontDestroyOnLoad](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.DontDestroyOnLoad.html)：仅适用于根 GameObject 或根对象上的组件，对应子树一同保留；这不是玩家存档机制。
- [Resources.UnloadUnusedAssets](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Resources.UnloadUnusedAssets.html)：依据场景层级、组件与静态字段等引用判断未使用资源，不检查脚本执行栈。教材避免把局部变量或场景卸载简单等同于资源所有权保证。
- [ObjectPool<T>](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Pool.ObjectPool_1.html)：创建、取出、归还与销毁回调，非线程安全，defaultCapacity 不是预热，maxSize 约束池内保留数量而非活跃实例数量。
- [Addressables 2.7：Managing Addressable asset memory](https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/memory-assets.html)：句柄与引用计数需要成对管理；计数归零不保证资源立即离开内存，所属 AssetBundle 仍可能被其他使用者持有。

第 14 章由另一位作者交叉审阅，发现并修复 l067 禁用组件后的确认循环等待问题：OnDisable 在开放激活门前先解除自身确认条件。完整审阅见 `REVIEW-system-cross.md`。本章示例纳入统一编译检查；尚未逐课执行 Unity 场景实验，不能将编译或网页示意实验当作 Runtime 验证。
