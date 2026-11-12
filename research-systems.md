# 系统章节的官方资料阅读记录

检查日期：2026-11-12。编写范围：第 08–13 章，30 课、150 小时。依据 Unity 6.3（6000.3）脚本参考、URP 17.3、uGUI 2.0 和 Input System 1.20 系列文档。下列记录描述实际取得并阅读的正文说明与 Remarks 节选，不宣称逐字阅读整个 API 站点。

## 阅读方法与版本

旧 ScriptReference URL 多数会重定向到 Unity 新文档站。页面开头有很长的导航，直接截取第一个 Description 会拿到导航而非正文；本次从 `page-content-container` 后提取正文。包站点通常仍使用 article 正文。使用 Node fetch 重新读取了 PowerShell 因字节响应或重定向解析失败的页面。

- [Rigidbody2D](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody2D.html)：姿态、速度、身体类型和子碰撞体；Unity 6 的 linearVelocity / linearDamping。
- [Rigidbody2D.MovePosition](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody2D.MovePosition.html)：在下一物理步计算运动，推荐运动学身体与较小位移；不能等同任意瞬移或“必然受墙阻挡”。
- [Collider2D](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Collider2D.html)、[Physics2D.Raycast](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics2D.Raycast.html)：形状接触、层过滤、查询范围；内部起点可能 fraction=0，法线有特殊含义。
- [CollisionDetectionMode2D](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CollisionDetectionMode2D.html)：离散检测和连续检测；教材额外说明控制权错误与无效接触不能靠插值修复。
- [TextureImporter](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/TextureImporter.html)、[Sprite](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Sprite.html)：源文件、导入格式、PPU、纹理区域和轴心各自职责。
- [AssetImporter](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetImporter.html)、[AssetDatabase](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetDatabase.html)、[PrefabUtility](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/PrefabUtility.html)：meta 保存导入信息，编辑器资产接口与玩家运行边界。
- [AnimationClip](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AnimationClip.html)、[Animator](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator.html)：属性曲线、引用关键帧、控制器与状态选择；编辑预览不能证明运行链成立。
- [AnimationEvent](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AnimationEvent.html)、[Animator.applyRootMotion](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator-applyRootMotion.html)：时点回报和运动责任；教材不把表现事件等同关键业务的可靠队列。
- [Camera](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Camera.html)：屏幕坐标、视口坐标与相对摄像机深度；投影转换需明确几何条件。
- [URP 17.3 入口](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.3/manual/index.html)：实际重定向到 Unity 6.3 的 URP introduction；教材区分二维 Renderer、三维 Renderer 与 Shader 光照能力。
- [MaterialPropertyBlock](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MaterialPropertyBlock.html)：官方明确指出不兼容 SRP Batcher，URP 中可能降低性能。第 53 课据此明确限制，没有宣称属性块是通用优化。
- [Renderer.material](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Renderer-material.html)：访问可生成专属材质，拥有者有销毁责任；共享材质是另一种范围。
- [Frame Debugger](https://docs.unity3d.com/6000.3/Documentation/Manual/FrameDebugger.html)：逐渲染事件解释目标、材质与画面构成，时间测量仍需 Profiler 和目标设备。
- [Canvas](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Canvas.html)、[RectTransform](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RectTransform.html)、[VisualElement](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.VisualElement.html)：界面宿主、矩形约束与保留式视觉树。
- [uGUI Event System](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/EventSystem.html)：输入模块、选中对象、射线检测与事件分发的不同责任。
- [Using UI Input Module](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/using-ui-input-module.html)、[Introduction to the UI Input Module](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/introduction-ui-input-module.html)：uGUI 使用 InputSystemUIInputModule；该组件的设置可优先于项目级 UI Actions。
- [Handling input target ambiguity](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/handling-input-target-ambiguity.html)：UI 与世界输入没有自动互斥保证；在 Input Action 回调中查询 UI 指针状态可能读取上次更新并警告。
- [AudioSource](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource.html)、[AudioListener](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioListener.html)、[AudioMixer](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Audio.AudioMixer.html)：播放、空间混合、唯一有效监听与暴露参数控制。
- [AudioSource.PlayScheduled](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource.PlayScheduled.html)：相对于 dspTime 的绝对时间调度，应留准备时间；不以逐帧等待冒充采样精确拼接。
- [ParticleSystem](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ParticleSystem.html)、[ParticleSystem.IsAlive](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ParticleSystem.IsAlive.html)：模块结构体是原生接口，停止发射与存活尾迹不同，子系统需纳入结束判定。

## 修正过的来源

- `Workflow-Direct.html` 已失效。通过 Input System 的真实 `toc.html` 找到并改用 `using-direct-workflow.html`。
- `UISupport.html` 与猜测的 `ui-support.html` 均为 404。通过真实目录定位到 `using-ui-input-module.html`，已更新第 58 课。
- `AssemblyDefinitionAsset.html`、猜测的 `AssemblyDefinitionImporter.html` 均为 404。交叉审阅将第 78 课第二条来源改为官方 `Compilation.CompilationPipeline.GetAssemblies.html`，保留已有效的程序集手册来源。
- 交叉审阅实际读取 [Addressables 2.7 Managing Addressable asset memory](https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/memory-assets.html)，将第 69 课从目录页改为这篇具体正文，并补充“引用计数归零不保证立即卸载，所属 Bundle 仍可能因其他使用者保留”。

HTTP 与标题的完整检查由网站的统一来源审计生成，见 `sources-audit.json`。本文记录阅读依据，不替代链接审计，也不把教材中实验推论写成官方跨版本保证。
