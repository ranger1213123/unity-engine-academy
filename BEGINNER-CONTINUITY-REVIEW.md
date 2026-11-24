# 第二章初学者连续性修订

## 修订原因

读者反馈指出，第二章从零散的 `GetComponentInChildren` 直接进入复杂用法，却没有先说明 `GetComponent` 家族有哪些常用入口、每个入口从哪里开始搜索，以及单数和复数的区别。相邻课程还重复讨论“缓存引用”，部分实验要求读者自己补写教材没有提供的调用脚本。

本轮将问题按“术语前置、单课职责、完整实验、重复控制”四个方面处理。课程 ID、自测正确选项序号、课时、实验时长和评分分值保持不变，以免破坏已有学习档案。

## 五课职责

| 课程 | 现在只负责什么 | 不再提前混入什么 |
| --- | --- | --- |
| l006 | 变量、值、类型、对象引用和 Unity 特殊空值 | 不再提前教授缓存策略 |
| l007 | 字段、属性、方法、Inspector 与序列化 | 不再用尚未讲解的 GetComponent 作为实验前提 |
| l008 | GetComponent 家族、搜索范围、结果数量与失败分支 | 不再只列 InChildren 而省略方法地图 |
| l009 | 发布者、事件、监听者、处理方法和订阅次数 | 不再从 static 事件与 Domain Reload 起步 |
| l010 | List 成员关系、Destroy、RemoveAt、Clear 与遍历删除 | 不再同时塞入无关的冷却模型 |

## GetComponent 方法地图

第 8 课现在完整覆盖以下常用入口：

- `GetComponent<T>()`
- `TryGetComponent<T>(out value)`
- `GetComponents<T>()`
- `GetComponentInChildren<T>()`
- `GetComponentsInChildren<T>()`
- `GetComponentInParent<T>()`
- `GetComponentsInParent<T>()`

教材先解释一行泛型调用中每一部分的含义，再用“仅自身 / 向下 / 向上”和“一个 / 全部”组成选择表。单独说明 `InChildren` 与 `InParent` 都会先检查调用对象自身、未激活对象参数的作用，以及 Type 和字符串重载为何不是初学阶段的首选。

## 完整实验

- l007 新增 `SpeedCaller.cs`，不再要求读者自行猜出调用脚本。
- l008 新增 `ComponentLookupProbe.cs`，一次输出七种获取结果的类型和所在对象名。
- l009 拆为 `SignalHub.cs` 与 `ListenerProbe.cs`，每次 Connect、Disconnect、Publish 都由组件菜单明确触发。
- l010 新增 `ListLifetimeProbe.cs`，同时输出 Count、有效成员数和索引内容。

每个实验都说明脚本挂在哪个对象、Inspector 槽拖入什么、命令从哪个组件菜单触发，以及 Console 应观察哪些字段。

## 防止回退

`npm run audit:beginner` 检查以下内容：

- 第 8 课是否仍包含七种常用组件获取入口和七行选择表。
- 完整示例文件是否存在。
- 第 6、7 课是否重新抢先讨论缓存或依赖 GetComponent。
- 第 9 课是否重新提前引入 Domain Reload 或 static event。
- 第 10 课是否重新混入 Cooldown。

技术行为依据 Unity 6.3 官方脚本参考核对。浏览器和 Unity 编译验证结果以仓库当前审计文件为准，不能仅凭这份修订说明推断运行实验已经完成。
