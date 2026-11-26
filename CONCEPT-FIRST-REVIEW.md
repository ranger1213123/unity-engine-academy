# 前六章概念连续性修订

## 读者问题

初学者在正文中第一次看到 `TransformPoint`、`LookRotation`、`Plane.Raycast` 等名称时，还不知道它属于哪个类型、点号左边是谁、参数属于哪套坐标，也不知道返回结果会不会直接改变对象。原课程虽然在后文解释过部分行为，但“先使用，后定义”的顺序会让读者失去上下文。

## 固定教学顺序

第 1 至 30 课现在都在学习目标之后增加“先认清本课会出现的东西”。每课先说明与前一课的连接，再为 2 至 5 个新概念给出：

- 名称和种类；
- 不依赖术语的解释；
- 在编辑器中的位置（需要实际寻找时）；
- 方法调用的完整语句、调用者、输入、输出和不会发生的副作用。

正文仍负责推导、实验和边界条件。概念卡只建立最小阅读前提，避免同一解释散落在三节课中反复出现。

## TransformPoint 首次教学

`TransformPoint` 只在第 16 课首次完整定义。教材先让读者在 Inspector 找到 Transform，再建立局部空间与世界空间，随后逐段阅读：

```csharp
Vector3 worldPoint = root.TransformPoint(localPoint);
```

其中 `root` 决定采用哪套局部坐标系，`localPoint` 是相对于 `root` 的位置点，返回值是世界位置。方法只换算并返回数值，不会移动任何对象。新增 `CoordinateSpaceProbe.cs` 同时打印局部输入、世界输出和 `InverseTransformPoint` 的往返结果。第 20 课只复习并比较 `TransformPoint`、`TransformVector` 与 `TransformDirection`，不再承担首次定义。

## 技术核对

- [Transform component](https://docs.unity.com/en-us/engine/6000.3/manual/class-transform)
- [Transform.TransformPoint](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformPoint.html)
- [Transform.InverseTransformPoint](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.InverseTransformPoint.html)
- [Transform.TransformVector](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformVector.html)
- [Transform.TransformDirection](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformDirection.html)

内容校验会检查前 30 课的概念卡数量与必填字段；浏览器测试会检查呈现顺序、全文搜索、打印和 320/390 像素宽度。第 16 课代码及官方引用的稳定字段变更记录在 `scholar-reviewed-changes.json`。
