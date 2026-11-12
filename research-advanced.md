# 第 15–20 章：官方依据与作者技术检查

核验日期：2026-11-12。编辑器文档基线为 `6000.3`。以下内容通过直接 HTTP 读取官方页面正文及 Remarks/示例核实，不以搜索摘要代替正文。全教材引用链接的统一状态检查由主审脚本另外输出。

## 已读取的核心依据

- [JsonUtility](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/JsonUtility.html)：200。使用 Unity 字段序列化规则，顶层必须是对象，数组/列表需包在自定义类或结构中。教材据此区分 DTO、解析、验证和场景应用。
- [SerializeReference](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SerializeReference.html)：200。核实多态、null、宿主内托管引用关系与额外成本；不能替代跨宿主共享的 ScriptableObject 资源引用。
- [ISerializationCallbackReceiver](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ISerializationCallbackReceiver.html)：200。正文明确提醒序列化可能在不同线程执行，只处理对象直接拥有的数据。教材不在回调中调用场景 API，不保证任意托管对象间顺序。
- [ScriptableObject](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ScriptableObject.html)：200。核实共享配置、资源创建入口和原生销毁后包装引用仍存在的语义。
- [Application.persistentDataPath](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-persistentDataPath.html)：200。教材将其作为平台相关路径，不宣称跨平台文件事务语义完全一致。
- [PlayerPrefs](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/PlayerPrefs.html)：200。作为简单偏好数据入口参考，不将其描述为任意安全数据库。
- [Organize scripts into assemblies](https://docs.unity3d.com/6000.3/Documentation/Manual/assembly-definition-files.html)：200。核实运行、编辑器、测试边界和显式程序集依赖。
- [Unity Test Framework 1.6](https://docs.unity3d.com/Packages/com.unity.test-framework@1.6/manual/index.html)：200，页面标题显示 1.6.0。首页明确说明 Unity 6.2+ 的用户指南迁入 Unity Manual，包站保留脚本参考。课程没有假定测试脚本可直接丢进普通运行程序集。
- [Profiler](https://docs.unity3d.com/6000.3/Documentation/Manual/Profiler.html)：200。按 CPU/GPU、编辑器/Player、详细采样干扰和自定义标记组织教学。
- [ProfilerMarker](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Profiling.ProfilerMarker.html)：200。核实 Auto 范围和稳定实例标记用法。
- [ProfilerRecorder](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Profiling.ProfilerRecorder.html)：200。核实计数器可用性检查、上一帧与当前值差别、原生资源和 Dispose 责任。教材明确日志探针本身不是零开销。
- [Editor](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Editor.html)、[SerializedObject](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SerializedObject.html)：200。正文示例说明 Update/ApplyModifiedProperties、独立数据流同步、多对象与自动 Undo。教材优先使用序列化属性。
- [Undo](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Undo.html)：200。核实字段修改前记录，以及创建/销毁等结构性动作需对应 API。
- [PrefabUtility.RecordPrefabInstancePropertyModifications](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/PrefabUtility.RecordPrefabInstancePropertyModifications.html)：200。正文优先推荐 SerializedObject，并示范直接改实例时保留覆盖。作者进一步限制排列工具排除持久资源，防止误改 Prefab 源资产。
- [IJob](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Jobs.IJob.html)、[JobHandle.Complete](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Jobs.JobHandle.Complete.html)：200。核实工作线程、依赖传递与同步，Complete 可能在调用线程执行剩余工作。课程不把 Schedule 描述为已完成，也不把立即同步样例宣称为最优性能。
- [BuildPipeline.BuildPlayer](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/BuildPipeline.BuildPlayer.html)：200。页面包含 BuildPlayerOptions 与 BuildPlayerWithProfileOptions。课程明确教学脚本使用显式场景列表，不冒称自动应用任意 Build Profile 覆盖。

## 可选包与版本边界

- [AI Navigation 2.0](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/index.html)：200，读取时页面为 2.0.16。以 NavMesh、Agent、动态障碍和 Link 边界展开；需用户在独立实验中安装兼容包。
- [Burst 1.8](https://docs.unity3d.com/Packages/com.unity.burst@1.8/manual/index.html)：200，读取时页面为 1.8.31。核实高性能 C# 子集、LLVM、Jobs 与静态方法编译、AOT 和工具链边界。没有把 Burst 当作自动并行开关。
- [Entities 1.4](https://docs.unity3d.com/Packages/com.unity.entities@1.4/manual/index.html)：200，读取时页面为 1.4.8。以实体/数据/系统、Baking 和 SubScene 组织入门，明确只在安装兼容包的独立项目中试验，主学习项目不自动迁移。

## 自检结果与未验证范围

- 6 章、30 课、150 小时；每课 300 分钟时间预算，两个实验合计 120 分钟，评分表总计 100 分。
- 理论正文合计 29,276 个汉字，单课最少 925 个汉字。每课至少 5 个理论主题、2 个故障案例、3 道有解析的测验和 2 个官方引用。
- 26 课含 C# 示例。跨文件示例采用 `code.files`，避免复制后 using 出现在类型定义之后；MonoBehaviour 和 Editor 文件目录分开。
- 示例未在 Unity 运行时执行。主审的隔离 Roslyn 编译只验证语法和可用引用，不等于引擎运行测试；可选包仍需在对应兼容环境执行。
- 文件系统事务、性能收益和平台行为需要目标设备实测。教材提供实验和边界，不编造性能数字，也不宣称计时达到 500 小时自动获得专家认证。
