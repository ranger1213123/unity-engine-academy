window.COURSE_MODULES.push({
  "id": "m02",
  "number": 2,
  "title": "Unity 中的 C#",
  "subtitle": "理解托管代码与引擎对象的交界",
  "description": "聚焦最影响引擎使用的语言机制：值与引用、Unity 对象空值、序列化字段、组件查找、事件和集合所有权。",
  "accent": "#527c63",
  "lessons": [
    {
      "hours": 5,
      "timePlan": [
        {
          "label": "阅读与预测",
          "minutes": 50
        },
        {
          "label": "引擎实验",
          "minutes": 120
        },
        {
          "label": "独立练习",
          "minutes": 75
        },
        {
          "label": "自测与回忆",
          "minutes": 35
        },
        {
          "label": "复盘与归档",
          "minutes": 20
        }
      ],
      "id": "l006",
      "title": "值类型、引用类型与 Unity 的特殊空值",
      "prerequisites": [
        "l005"
      ],
      "goals": [
        "预测结构体数值与对象引用复制后的差别",
        "解释Unity空值与普通引用空值为何不同",
        "在等待后重新检查目标是否可用"
      ],
      "theory": [
        {
          "title": "先分清复制的是什么",
          "paragraphs": [
            "令 Vector3 a 为 (1,2,3)，执行 b=a 后，b 获得这三个数值的副本。再把 b.x 改成9，a.x 仍为1。Vector3 是结构体，属于值类型。这里没有让两个变量共同管理一份可变位置数据。",
            "再让 Transform first 和 second 都引用同一场景对象。修改 first.position 后，通过 second 读取也会得到新位置，因为改的是共同指向的对象。复制引用不会自动复制场景对象；需要独立对象时，必须明确创建另一个实例。"
          ]
        },
        {
          "title": "局部变量改变与对象改变不同",
          "paragraphs": [
            "把 second 重新赋为另一个 Transform，只改变 second 指向哪里，不会让 first 跟着换目标。相反，经 second 修改它当前目标的成员，改变的就是目标对象。调试时画两条箭头，往往比记住“引用类型会共享”更准确。",
            "这种区别也适用于普通 C# 类。引用可以有多个，实例可以只有一个。先看赋值是在换引用，还是在修改被引用的内容，再预测其他变量会不会观察到变化，不要只根据变量名是否不同判断。"
          ]
        },
        {
          "title": "Unity 对象还有引擎内部的生命期",
          "paragraphs": [
            "GameObject、Transform 等对象由 Unity 管理。C# 变量持有的是托管包装引用，包装所对应的原生对象则存在于引擎内部。调用 Destroy 并完成销毁后，引擎对象已失效，C# 变量却不一定马上变成真正的空引用。",
            "因此示例等待一帧后，target == null 可以为真，而 ReferenceEquals(target,null) 为假。前者使用 Unity 的比较规则，也检查对应引擎对象；后者只问托管引用是不是空。这不是矛盾，而是两者回答的问题不同。"
          ]
        },
        {
          "title": "属性返回的结构体常是副本",
          "paragraphs": [
            "读取 transform.position 得到 Vector3 值。将它存进 local 后修改 local.x，只改变局部副本，尚未写回 Transform。需要先取值、修改副本，再把整个结果赋回 position。这能解释为什么“我改了数值，画面却没变”。",
            "不要把这个规则简化成所有属性都不能修改。关键是属性返回什么类型、调用了哪个写入接口。看清数据在哪一步复制，在哪一步真正写回引擎对象，就能逐行预测结果，而不是依靠试错记某种写法。"
          ]
        },
        {
          "title": "便捷空值语法不能替代有效性检查",
          "paragraphs": [
            "对于 UnityEngine.Object，== null 使用特殊规则，而 ?. 和 ?? 按普通 C# 空引用规则工作。原生对象已经销毁但包装仍存在时，这些简写不一定像你想象的那样跳过访问。不能因为语句更短就认为检查更完整。",
            "变量的静态类型也重要。如果先转成普通 object，再比较空值，可能不再使用相同的重载。一般场景逻辑应保留明确的 Unity 类型，并用相应检查。普通纯 C# 类没有这个原生对象层，仍按照普通语言规则理解。",
            "is null 和 ReferenceEquals 一样，不能代替 Unity 的原生对象有效性判断。可做一张对照表：以正常对象、真正的 C# null、已完成 Destroy 但仍留有包装引用作为三行，以 == null、is null、ReferenceEquals 作为三列，分别预测结果。第三行最能解释差别：变量还指向包装，并不表示引擎对象仍可使用。"
          ]
        },
        {
          "title": "等待之后重新确认目标",
          "paragraphs": [
            "假设协程保存了敌人的 Transform，然后等待受击动画结束。等待期间敌人可能被销毁。开始时的检查只能证明当时有效，不能保证恢复执行时仍有效。因此应在使用处重新确认，必要时结束这次操作。",
            "缓存引用能减少重复查找，却不会延长 Unity 对象寿命。测试时分别覆盖正常目标、等待中销毁和对象只被禁用三种情况，记录它们的差别。禁用通常保留实例，销毁则使引擎对象失效，两者不应使用同一种恢复假设。"
          ]
        },
        {
          "title": "用图检查你理解的是哪一层",
          "paragraphs": [
            "画两个变量框和一个场景对象框。复制引用时增加一条指向同一目标的箭头；创建新对象时增加一个目标框；销毁时划掉引擎对象，但不要擅自把每个变量框都擦掉。这样就能看出为什么引用仍在，却不能继续正常访问成员。",
            "再对照数值复制：两个 Vector3 框里各写一组数字，修改其中一组不会改另一组。把两种图并排放，遇到赋值语句先判断复制了数值还是引用，再追踪写入动作，往往比背一串类型名称更有效。"
          ]
        }
      ],
      "code": {
        "title": "比较销毁后的两种 null",
        "language": "csharp",
        "filename": "UnityNullProbe.cs",
        "source": "using System.Collections;\nusing UnityEngine;\npublic sealed class UnityNullProbe : MonoBehaviour\n{\n    IEnumerator Start()\n    {\n        GameObject target = new GameObject(\"Temporary\");\n        Destroy(target);\n        yield return null;\n        Debug.Log($\"Unity equality: {target == null}\");\n        Debug.Log($\"ReferenceEquals: {ReferenceEquals(target, null)}\");\n    }\n}",
        "explanation": [
          "脚本挂空对象运行。Destroy 后等待一帧，再比较 Unity 空值与托管引用；示例不会继续访问已销毁对象的成员。"
        ]
      },
      "lab": [
        {
          "title": "比较数值与引用复制",
          "minutes": 60,
          "steps": [
            "写Vector3 a=(1,2,3)、b=a，只改b.x，打印两个结果。",
            "让两个Transform变量引用同一对象，经其中一个改位置，再经另一个读取。",
            "画出数值副本与引用箭头，逐句解释两组变化为什么不同。"
          ],
          "result": "分清改局部数值、换引用和改对象成员。",
          "purpose": "分别观察结构体副本和指向同一对象的两个变量。",
          "setup": [
            "创建空对象 ValueProbe，另建 CopyProbe.cs 并挂上；在 Start 中依次写 Vector3 a=new Vector3(1,2,3); Vector3 b=a; b.x=9;，随后用 Debug.Log 分别打印 a、b。",
            "在同一 Start 的后半段用 Transform first=transform; Transform second=first;，通过 second.position 赋新位置，再打印 first.position。两变量都指 ValueProbe 自身，不是两个副本。",
            "保持 Console 的 Collapse 关闭，按输出标签区分数值 a/b 与引用 first/second。"
          ]
        },
        {
          "title": "观察销毁后的两种空值",
          "minutes": 60,
          "steps": [
            "运行UnityNullProbe，保存等待后的两种比较结果。",
            "在实验副本等待后尝试读取已销毁目标，记录错误，再恢复安全检查。",
            "改为恢复时先用Unity空值判断，再与普通C#类的空引用比较。"
          ],
          "result": "理解包装引用与原生对象寿命不同，等待后重新检查。",
          "purpose": "把 C# 包装引用是否为空与引擎对象是否仍存在分别观察。",
          "setup": [
            "创建空对象 NullHost，添加完整 UnityNullProbe，Console 清空后 Play；Temporary 由代码创建，不需要事先在 Hierarchy 手动创建。",
            "复制脚本实验版时更换文件名与类名，避免同名编译冲突；只在副本中增加销毁后的成员访问，观察后删除该不安全访问。",
            "每次改动后保存、等编译，再重新 Play。等待结束后用 target==null 检查，普通 C# 类的对照对象则没有 Unity 原生对象这一层。"
          ]
        }
      ],
      "pitfalls": [
        {
          "symptom": "改了局部 position.x，对象没动",
          "cause": "只修改了结构体副本",
          "fix": "计算后把完整 Vector3 写回 transform.position"
        },
        {
          "symptom": "空条件访问仍碰到已销毁对象问题",
          "cause": "语言空引用语义不等同 Unity 对象有效性",
          "fix": "在使用边界显式判断 Unity 对象是否有效"
        }
      ],
      "exercise": {
        "brief": "制作目标跟踪探针：目标销毁后安全停止，同时用日志比较数值副本与引用副本，不能用全局查找绕过失效处理。",
        "deliverables": [
          "源码",
          "销毁前后日志",
          "变量与对象关系图"
        ],
        "rubric": [
          {
            "item": "值复制解释正确",
            "points": 25
          },
          {
            "item": "Unity 空值判断正确",
            "points": 25
          },
          {
            "item": "等待后重新检查",
            "points": 25
          },
          {
            "item": "无无效对象成员访问",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "Vector3 b = a 后修改 b.x，会自动改 a.x 吗？",
          "options": [
            "不会，b 是结构体数值副本",
            "会，因为两个变量有相同数值",
            "只有字段赋值会改，局部变量不会",
            "普通赋值仍共享，必须Clone才复制"
          ],
          "answer": 0,
          "explanation": "赋值复制结构体值，修改 b 不会反向写入 a。",
          "scenario": "方法中声明 Vector3 a=new Vector3(1,2,3)，再执行 Vector3 b=a，最后只执行 b.x=9；没有将 b 再赋回 a。"
        },
        {
          "question": "销毁后 == null 为真而 ReferenceEquals 为假，说明什么？",
          "options": [
            "两个判断至少有一个失效",
            "托管包装仍存在，原生对象已经失效",
            "原生对象仍可正常使用",
            "Destroy会自动把所有持有变量赋成C# null"
          ],
          "answer": 1,
          "explanation": "两种检查面对不同层次：Unity 比较还检查关联的引擎对象。",
          "scenario": "UnityNullProbe 的局部 GameObject target 指向新建 Temporary；Destroy(target) 后等一帧，再输出 target==null 为 true、ReferenceEquals(target,null) 为 false。"
        },
        {
          "question": "等待数帧后使用目标，正确做法是？",
          "options": [
            "依靠等待前的一次检查",
            "只看保存的对象名称",
            "恢复执行时重新检查目标有效",
            "用 ?. 就保证检查原生对象寿命"
          ],
          "answer": 2,
          "explanation": "等待期间目标可能销毁，便捷语法也不能替代 Unity 的对象有效性判断。",
          "scenario": "协程开始时保存了场景目标的 Transform，在 yield 等待数帧后打算读取 position；其他系统可在等待期间销毁目标。"
        }
      ],
      "references": [
        {
          "label": "Object.operator ==",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object-operator_eq.html"
        },
        {
          "label": "Transform.position",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform-position.html"
        }
      ],
      "summary": [
        "复制引用不等于复制被引用的对象。",
        "引擎对象已经销毁，托管包装仍可能被变量持有。"
      ],
      "teaching": {
        "question": "复制一个 Vector3 后改副本，原值没变；复制一个 Transform 引用后移动它，为什么两个变量都看到新位置？",
        "keyIdea": "值类型赋值复制数值，引用类型赋值复制指向对象的引用。Unity 对象还要分清 C# 包装引用与引擎内部对象是否仍存在。",
        "walkthrough": [
          {
            "title": "复制一个数值",
            "text": "令 a 为位置 (1,2,3)，再令 b=a。修改 b.x 为9后，分别打印 a、b，确认 a.x 仍是1。"
          },
          {
            "title": "指向同一个对象",
            "text": "令两个 Transform 变量引用同一对象，经其中一个修改 position，再经另一个读取，会得到相同新位置。"
          },
          {
            "title": "观察销毁之后",
            "text": "运行 UnityNullProbe，等待销毁完成，比较 == null 与 ReferenceEquals，理解两种判断为何不同。"
          }
        ],
        "prediction": {
          "question": "等待前检查目标有效，等一帧后还能无条件读取它吗？",
          "answer": "不能。等待期间别的代码可能销毁目标；恢复执行后应重新用适合 Unity 对象的方式检查。",
          "scenario": "某个流程取得 Transform target 并检查它有效，然后等待一帧。等待期间另一个脚本可能调用 Destroy(target.gameObject)，之后原流程将继续执行。"
        },
        "scenario": "本课比较两次赋值：Vector3 a=(1,2,3)，b=a；另有 first、second 两个 Transform 变量，都指向场景中的同一个对象。最后 UnityNullProbe 在 Start 中创建 Temporary、请求销毁并等一帧，比较两种空值检查。",
        "purpose": "区分复制数值、复制引用与对象销毁，避免把“变量仍有包装引用”误认为目标还能使用。"
      }
    },
    {
      "hours": 5,
      "timePlan": [
        {
          "label": "阅读与预测",
          "minutes": 50
        },
        {
          "label": "引擎实验",
          "minutes": 120
        },
        {
          "label": "独立练习",
          "minutes": 75
        },
        {
          "label": "自测与回忆",
          "minutes": 35
        },
        {
          "label": "复盘与归档",
          "minutes": 20
        }
      ],
      "id": "l007",
      "title": "字段、属性与序列化：给组件设计一个清晰接口",
      "prerequisites": [
        "l006"
      ],
      "goals": [
        "让私有字段参与保存，同时控制外部修改入口",
        "测试设置方法如何拒绝非法数值",
        "区分实例状态、静态共享与属性读取"
      ],
      "theory": [
        {
          "title": "先把编辑配置与代码访问分开",
          "paragraphs": [
            "设计者要在 Inspector 输入速度，其他脚本却不该随意写入负值。如果直接声明 public 字段，通常既让编辑器显示它，也允许其他代码直接赋值。两个需求被绑在一起，后面增加限制就不方便。",
            "使用私有字段加 SerializeField，可以让符合规则的字段参与 Unity 序列化，同时保持 C# 的私有访问范围。外部通过 Speed 属性读取，通过 TrySetSpeed 尝试修改。这样编辑器配置和运行修改各有清楚入口。"
          ]
        },
        {
          "title": "序列化只保存符合规则的数据",
          "paragraphs": [
            "序列化是把特定数据保存成之后能够还原的形式。Unity 不会把整个 C# 内存原样复制到场景。它有字段类型、访问修饰与属性标记等规则，普通属性与 static 字段也不能按普通实例字段的方式期待保存。",
            "实验可分别写普通私有字段、SerializeField 字段、公开字段和属性。先看 Inspector，再保存并重开场景，对比哪些值保留下来。看到某字段不显示，不代表它不能在代码使用；看到属性能读取，也不表示它自动成为存档。",
            "Inspector 直接编辑被序列化的字段，不会为了赋值而调用你写的 Speed 属性或 TrySetSpeed 方法。因此“运行修改经过验证”和“Inspector 配置经过验证”必须分别检查。本例的 Min 帮助编辑，TrySetSpeed 保护代码调用；若增加跨字段限制，还需安排轻量编辑校验和运行前检查，不能只在属性 setter 中实现后就以为两条路径都被覆盖。"
          ]
        },
        {
          "title": "只读属性并不等于只读对象",
          "paragraphs": [
            "Speed => speed 提供只有读取入口的属性，调用者不能通过它直接赋新值。这限制的是这个入口，并没有让组件内部永远不能修改 speed。组件的方法仍可更新字段，Inspector 也可能编辑被序列化的配置。",
            "属性的 getter 本质上可以执行代码。有的只是返回字段，有的会查找对象或计算结果，所以只读不代表零成本。当前示例很简单，但以后高频调用陌生属性时，仍应检查实现，不能只根据语法短就断言没有开销。"
          ]
        },
        {
          "title": "把验证放在真正的修改入口",
          "paragraphs": [
            "TrySetSpeed 先检查 NaN、Infinity 与负值，不满足条件就返回 false，并保留原速度。合法时才赋值并返回 true。调用者因此能区分修改成功和被拒绝，而不必修改后再猜当前数据是否可用。",
            "Inspector 的 Min 提示对编辑方便，却不能保证所有运行代码都经过同一检查。把规则放进方法，才能保护从其他系统来的调用。若需要将超范围值自动限制而非拒绝，也应明确设计；返回 false 与悄悄截断对调用者的意义不同。"
          ]
        },
        {
          "title": "普通字段与 static 字段属于不同范围",
          "paragraphs": [
            "A、B 两个角色各有 SpeedSettings，实例 speed 默认各自保存。将 A 改为3，B 不会自动改变。若改成 static，则数值属于类型层面的共享状态，不再是每个组件自己的那份。",
            "共享并非总是错误，例如公共统计可能需要它，但当前生命这类每角色状态通常应跟随实例。决定字段放哪里时，先问这个数值是某个对象的，还是全体共用的。不要为了让别的脚本访问方便，就把原本独立的数据改成全局共享。"
          ]
        },
        {
          "title": "用调用结果说明规则是否成立",
          "paragraphs": [
            "测试时先记录当前速度，再依次传入负值、正常值和非数值。每次同时记录返回结果和读取值。只记录“没有异常”不够，因为方法可能悄悄接受错误数据；只记录返回 false 也不够，还要确认旧值没有被污染。",
            "之后再接入实际移动组件，区分两个问题：设置方法能正确保护数值，移动组件是否正确使用它。前者可以独立检查，后者还要看更新阶段和单位。把数据与使用者分开，不是为了增加类的数量，而是让每个失败有明确检查位置。"
          ]
        }
      ],
      "code": {
        "title": "受控的速度配置",
        "language": "csharp",
        "filename": "SpeedSettings.cs",
        "source": "using UnityEngine;\npublic sealed class SpeedSettings : MonoBehaviour\n{\n    [SerializeField, Min(0f)] float speed = 5f;\n    public float Speed => speed;\n    public bool TrySetSpeed(float value)\n    {\n        if (float.IsNaN(value) || float.IsInfinity(value) || value < 0f) return false;\n        speed = value;\n        return true;\n    }\n}",
        "explanation": [
          "挂组件后在 Inspector 配置 speed。外部读取 Speed，修改时调用 TrySetSpeed 并检查布尔结果。该组件只管理速度设置，不会自行移动对象。",
          "测试方法需要调用者：把 SpeedCaller 挂到同一对象，在 Start 通过 GetComponent<SpeedSettings>() 取得设置组件后，调用 TrySetSpeed 并打印返回值和 Speed。仅在 Inspector 看见字段，不会自动执行这些方法；本课实验准备给出具体输入。"
        ]
      },
      "lab": [
        {
          "title": "比较访问与保存规则",
          "minutes": 60,
          "steps": [
            "在测试组件中添加私有字段、SerializeField字段、public字段、属性与static字段。",
            "先记录Inspector显示，再保存并重开场景，比较各自数值。",
            "对照官方序列化规则，分别写谁能在代码访问、哪些数据会保存。"
          ],
          "result": "不把公开访问与参与保存当作同一开关。",
          "purpose": "观察代码访问权限与编辑器保存能力的区别。",
          "setup": [
            "创建空对象 Settings，添加 SpeedSettings，先在 Inspector 改 Speed 并保存场景；该脚本没有 Update，不会让对象自动移动。",
            "另建 SerializationComparison.cs 测试组件，分别声明不同名字的 private、[SerializeField] private、public、static 数值字段及一个普通属性，挂到另一个空对象。",
            "先记录哪些成员能在 Inspector 看见，再修改可见字段、保存并重新打开场景；static 与普通属性的代码访问测试在独立调用脚本中完成。"
          ]
        },
        {
          "title": "测试修改方法的结果",
          "minutes": 60,
          "steps": [
            "在调用脚本的Start依次传入负数、正常值、NaN与Infinity。",
            "每次记录返回值和Speed，核对失败后原速度是否保留。",
            "复制两个组件只改其中一个，再在实验副本比较static效果，结束后恢复。"
          ],
          "result": "验证修改入口，并观察实例数据与共享数据。",
          "purpose": "验证方法拒绝非法值后保留原状态，而不是只看函数返回。",
          "setup": [
            "创建 SpeedCaller.cs 挂到 Settings 同一对象；在 Start 先用 GetComponent<SpeedSettings>() 取得引用，检查非空后再调用 TrySetSpeed。",
            "在 Start 中逐项传入 -2f、3f、float.NaN、float.PositiveInfinity；每次调用后用 Debug.Log 同时记录本次参数、布尔返回值和 settings.Speed。不要直接访问私有 speed。",
            "复制 Settings 为 SettingsB，每个调用脚本应读取自身的 SpeedSettings；在日志加 name 区分实例。static 对照仅放实验副本，结束后还原。"
          ]
        }
      ],
      "pitfalls": [
        {
          "symptom": "所有角色生命一起变化",
          "cause": "误用 static 存每实例状态",
          "fix": "将状态放回实例，并通过明确共享服务处理真正共享数据"
        },
        {
          "symptom": "Inspector 限制了数值但运行时仍出现非法值",
          "cause": "编辑器属性不覆盖所有代码写入路径",
          "fix": "把验证放进实际修改入口"
        }
      ],
      "exercise": {
        "brief": "设计能量槽的最大值配置、只读当前值和Consume/Restore方法，明确最大值变化后当前值如何处理。",
        "deliverables": [
          "组件接口",
          "非法输入测试记录",
          "四列字段所有权表"
        ],
        "rubric": [
          {
            "item": "公开读写入口明确",
            "points": 25
          },
          {
            "item": "保存与重置规则清楚",
            "points": 25
          },
          {
            "item": "非法输入被正确处理",
            "points": 25
          },
          {
            "item": "测试覆盖正常与边界输入",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "SerializeField 的主要作用是？",
          "options": [
            "使字段对全部脚本公开",
            "使符合条件的非公开字段参加 Unity 序列化",
            "将普通属性自动变成玩家存档",
            "禁止字段在播放期间变化"
          ],
          "answer": 1,
          "explanation": "访问权限与保存规则是不同问题；SerializeField 不会把 private 改成 public。",
          "scenario": "组件中有 private float speed，设计者要在 Inspector 配置并保存它，同时希望其他脚本不能直接写 speed；该字段的类型符合 Unity 序列化规则。"
        },
        {
          "question": "哪个最适合每个角色自己的当前生命？",
          "options": [
            "单个 static 整数供所有角色直接修改",
            "编译期常量",
            "属于具体角色实例的状态字段",
            "不区分角色身份的共享计数"
          ],
          "answer": 2,
          "explanation": "每角色的当前状态应能分别保存，并与该角色的寿命对应。",
          "scenario": "场景中有两个角色，每个角色各自受伤与恢复，需要独立保存当前生命；这里讨论运行实例状态，而不是所有角色共同使用的设计常量。"
        },
        {
          "question": "只读属性一定没有成本吗？",
          "options": [
            "不一定，getter 可以执行计算或查找",
            "一定只是读取内存，没有代码",
            "一定比方法调用更快",
            "只要不提供 setter 就没有任何开销"
          ],
          "answer": 0,
          "explanation": "属性是调用接口；其成本取决于具体实现和调用频率。",
          "scenario": "你看到公开只读属性 Speed，尚未阅读其 getter。其他脚本会频繁读取这个属性，想判断读取是否便宜。"
        }
      ],
      "references": [
        {
          "label": "SerializeField",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SerializeField.html"
        },
        {
          "label": "MonoBehaviour.OnValidate",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnValidate.html"
        }
      ],
      "summary": [
        "编辑器保存规则与C#访问权限是两个问题。",
        "验证应在实际修改入口执行，而非只依赖Inspector提示。"
      ],
      "teaching": {
        "question": "speed 想让设计者在 Inspector 调整，却不希望任意脚本写成负数，应该怎样提供接口？",
        "keyIdea": "编辑器能保存字段与其他代码能否直接访问它，是两个独立问题。私有序列化字段保存配置，公开方法负责检查外部修改。",
        "walkthrough": [
          {
            "title": "开放编辑配置",
            "text": "观察 [SerializeField] private 字段，设计者可在 Inspector 赋值，但外部脚本不能直接写这个私有字段。"
          },
          {
            "title": "读取当前设置",
            "text": "通过只读 Speed 属性取得数值。属性提供读取入口，不会因为公开就自动允许外部赋值。"
          },
          {
            "title": "验证外部修改",
            "text": "调用 TrySetSpeed(-2) 返回 false；再传入3得到 true，比较前后 Speed，确认非法输入没有覆盖原值。"
          }
        ],
        "prediction": {
          "question": "Inspector 有 Min(0)，运行代码调用设置方法时是否就不必检查负数？",
          "answer": "仍要检查。Inspector 辅助限制不等于所有运行调用都经过验证；实际修改入口应保证自己的条件。",
          "scenario": "SpeedSettings 的 speed 声明带 Min(0)，外部调用者打算执行 TrySetSpeed(-2)。这次输入来自 C# 方法调用，未经过 Inspector 控件。"
        },
        "scenario": "SpeedSettings 有一个 Inspector 可编辑的私有 speed 字段、只供读取的 Speed 属性，以及允许外部请求修改的 TrySetSpeed。它只保存设置，不移动物体；我们用另一个调用组件传入正常值和非法值，检查返回结果。",
        "purpose": "把数据是否保存、代码能否直接访问以及允许怎样修改三个问题分开，给组件设计可理解的使用入口。"
      }
    },
    {
      "hours": 5,
      "timePlan": [
        {
          "label": "阅读与预测",
          "minutes": 50
        },
        {
          "label": "引擎实验",
          "minutes": 120
        },
        {
          "label": "独立练习",
          "minutes": 75
        },
        {
          "label": "自测与回忆",
          "minutes": 35
        },
        {
          "label": "复盘与归档",
          "minutes": 20
        }
      ],
      "id": "l008",
      "title": "GetComponent：找到并保存正确的组件引用",
      "prerequisites": [
        "l007"
      ],
      "goals": [
        "按组件所在位置选择查找范围",
        "解释RequireComponent与运行验证各解决什么",
        "缓存目标失效后明确停止或重新绑定"
      ],
      "theory": [
        {
          "title": "先问需要哪个对象的组件",
          "paragraphs": [
            "GetComponent 在当前对象上寻找指定类型。父对象没有 SpriteRenderer，而子对象有时，父级调用不会自动得到任意子对象上的那个组件。看到返回空值，先确认查找范围，而不是马上怀疑类型名字写错。",
            "GetComponentInChildren、GetComponentInParent 与显式引用表达不同关系。选择哪个，应由你的结构决定。若有多个显示子对象，单说“找一个 Renderer”仍不够清楚；最好明确需要身体、武器还是特效的那个，避免层级稍改就找错目标。",
            "名字里的 InChildren 不代表只查子对象：GetComponentInChildren 会先检查调用对象本身，再向下查找，默认不遍历未激活的子对象；需要这些子对象时要明确传 includeInactive=true。多个候选还会让“第一个找到的”与“业务上要的”不同。先在 Root 自身也放一个候选，再开关 View，能看出查找范围和活动状态如何共同改变结果。"
          ]
        },
        {
          "title": "声明依赖帮助搭建，验证确认现状",
          "paragraphs": [
            "RequireComponent 可以在添加脚本时帮助补上同对象需要的组件。示例声明 SpriteRenderer，表达这个脚本希望与显示组件放在一起，初学者不必每次手动记住添加顺序。",
            "但声明不等于证明任何已有场景都正确。旧对象、预制配置和之后的改动仍需检查。Awake 中 TryGetComponent 同时完成尝试获取与结果判断：没有得到必要组件时，报告缺少什么并停止无效逻辑，使问题在建立依赖时就暴露。"
          ]
        },
        {
          "title": "缓存只是不再重复寻找",
          "paragraphs": [
            "在 Awake 找到 view 并保存在字段中，之后 SetVisible 可以直接使用它。这叫缓存引用，也就是记住一次查找结果。它减少重复访问，却不会给目标复制一个备份，更不会阻止其他代码销毁目标。",
            "假设外部系统删除 View，缓存不可能凭空创建新的 Renderer。使用前是否检查、何时重新绑定，应根据对象寿命决定。长期固定的同对象依赖与随场景替换的外部目标，不能一律套用同一种缓存策略。"
          ]
        },
        {
          "title": "引用失效时要有明确反应",
          "paragraphs": [
            "必要依赖不存在时，每帧报一次空引用只会淹没 Console。更容易处理的方式是说明对象、所缺组件以及当前操作为什么停止。错误应靠近引用建立或实际使用的位置，而不是在很远的地方才表现成画面异常。",
            "如果依赖是可选的，例如没有装饰特效时仍允许玩法继续，就应把“允许缺失”写清。不要用返回随便一个场景对象来掩盖失败；那会让代码表面不报错，却控制错误目标，后续比空引用更难解释。"
          ]
        },
        {
          "title": "层级改变会改变查找含义",
          "paragraphs": [
            "原来只有一个 View，后来加入武器与影子，子级查找可能面对更多候选。即使它仍返回非空，也不表示选中了你想要的那个。记录返回组件所在对象，有助于发现查找成功但对象错误的情况。",
            "Inspector 直接引用让关系更明显，但也需要正确赋值和保存。运行时替换对象时，旧引用仍需主动更新。查找与显式引用没有永远优胜的一方，关键是结构变化时，哪种关系更容易被发现、验证和维护。"
          ]
        },
        {
          "title": "按功能确认依赖是否真的够用",
          "paragraphs": [
            "拿到 SpriteRenderer 后，SetVisible 只修改其 enabled。它没有关闭 Collider，也没有暂停脚本，更没有保证相机会绘制这个 Sprite。代码只完成自己负责的显示开关，其他显示条件仍需分别检查。",
            "实验应先验证组件获取，再验证开关数值，最后观察相机画面。若字段已改变而画面没变，下一步应看图片、材质、相机和排序，而不是重复调用 GetComponent。将“引用正确”和“功能全部成立”分开，才能逐层找到剩余问题。"
          ]
        },
        {
          "title": "为查找结果加上可核对的身份",
          "paragraphs": [
            "一次查找返回非空以后，输出组件所在对象的名称和上下文。场景同时存在身体与武器时，要验证返回的是预期对象，不能把“找到一个”当作“找对一个”。",
            "接着把候选子对象换个层级再测试。若结果改变，就说明实现依赖层级结构；若设计不允许这种变化，应将结构要求写清，或者改为显式引用。这样查找策略的限制就来自具体实验，而不是一句模糊的“缓存比较快”。"
          ]
        }
      ],
      "code": {
        "title": "验证并缓存必需组件",
        "language": "csharp",
        "filename": "RendererDependency.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(SpriteRenderer))]\npublic sealed class RendererDependency : MonoBehaviour\n{\n    SpriteRenderer view;\n    void Awake()\n    {\n        if (!TryGetComponent(out view))\n        {\n            Debug.LogError(\"SpriteRenderer required on this object.\", this);\n            enabled = false;\n        }\n    }\n    public void SetVisible(bool value) { if (view != null) view.enabled = value; }\n}",
        "explanation": [
          "RendererDependency 挂到空对象时会要求同对象有 SpriteRenderer。SetVisible 只控制显示组件，不会关闭碰撞或其他脚本；示例也没有自动指定图片。",
          "正文的 Root/View 是查找范围对照，RendererDependency 则要求同对象依赖，不能把它直接挂在只有子级 SpriteRenderer 的 Root 上再当作子级查找示例。显示 Sprite 还需要为 SpriteRenderer 指定 Sprite，查找实验可以先不指定图片。"
        ]
      },
      "lab": [
        {
          "title": "确定查找范围与结果身份",
          "minutes": 60,
          "steps": [
            "在父级、当前对象和子级分别放置同类测试组件，给对象不同名字。",
            "比较GetComponent与子级查找，每次输出找到的对象上下文。",
            "移动子级后重测，再比较Inspector直接引用，说明各自依赖哪种结构。"
          ],
          "result": "能找到组件，也能说明为什么是这个实例。",
          "purpose": "用已知层级验证查找范围和返回对象身份。",
          "setup": [
            "创建空对象 Ancestor、Root、View；在 Hierarchy 拖成 Ancestor/Root/View。分别通过 Add Component 给三者添加 SpriteRenderer，并记录名字。Sprite 槽可以暂空，查找不依赖画面是否可见。",
            "另建 ComponentLookupProbe 挂 Root，在 Start 中分别调用 GetComponent<SpriteRenderer>()、GetComponentInChildren<SpriteRenderer>()；打印结果对象名与上下文。先保留 Root 组件，再移除 Root 组件重做，避免误以为子级查找必定跳过自身。",
            "若有多个候选，预先说明想要哪个 View；新增一个 [SerializeField] SpriteRenderer 槽，从 Hierarchy 将指定 View 拖进去作为直接引用对照。"
          ]
        },
        {
          "title": "测试依赖缺失和引用失效",
          "minutes": 60,
          "steps": [
            "给空对象添加RendererDependency，观察RequireComponent的辅助效果。",
            "另写需要外部引用的探针，故意漏赋，核对一次错误是否明确说明对象与原因。",
            "取得外部目标后销毁它，再使用缓存，加入安全停止或明确重新绑定。"
          ],
          "result": "缺失与失效都有可解释处理，不依赖缓存自动恢复。",
          "purpose": "区分添加时辅助、外部必需引用和已经缓存后的失效。",
          "setup": [
            "另建空对象 RequiredView，添加本课 RendererDependency，观察 Inspector 自动出现同对象 SpriteRenderer；此实验不沿用只有子级 Renderer 的布置。",
            "需要外部引用的对照可沿用第5课 ReferenceProbe，将 Target 槽留空并重新 Play，检查一次诊断。",
            "销毁后检查用另外一个始终活动的持有者保存目标引用；只销毁目标、不销毁持有者。通过 Play 中 Hierarchy 的删除操作制造失效，再由持有者检查并停止使用缓存。"
          ]
        }
      ],
      "pitfalls": [
        {
          "symptom": "子对象有组件，当前对象GetComponent却返回空",
          "cause": "这个方法只查当前对象，没有自动扩大到子级。",
          "fix": "确认所需组件的位置，使用对应范围或直接赋引用，并打印返回对象身份。"
        },
        {
          "symptom": "缓存过的目标后来仍报MissingReferenceException",
          "cause": "其他逻辑销毁了目标，缓存没有延长它的寿命。",
          "fix": "使用时检查目标；按需求停止或明确绑定新对象，不假定缓存会自愈。"
        }
      ],
      "exercise": {
        "brief": "制作可替换显示目标的控制组件，不依赖固定子对象名字；缺少必要显示目标时说明原因并停止无效操作。",
        "deliverables": [
          "引用关系图",
          "组件源码",
          "层级调整与目标销毁两项测试"
        ],
        "rubric": [
          {
            "item": "引用范围清晰",
            "points": 25
          },
          {
            "item": "必要依赖有验证",
            "points": 25
          },
          {
            "item": "缓存寿命有处理",
            "points": 25
          },
          {
            "item": "层级变化无隐式失效",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "GetComponent 会自动查找任意子对象吗？",
          "options": [
            "不会，它只查当前对象",
            "会遍历任意深度的所有子对象",
            "同名时自动扩大到子对象",
            "找不到时自动创建目标组件"
          ],
          "answer": 0,
          "explanation": "查找范围由方法决定，需要子级时应选择相应接口或明确引用。",
          "scenario": "脚本挂在 Root，SpriteRenderer 只挂在它的子对象 View；Root 本身没有该组件。现在仅调用 Root.GetComponent<SpriteRenderer>()。"
        },
        {
          "question": "缓存 Transform 后，目标能被别人销毁吗？",
          "options": [
            "不能，缓存会锁住对象",
            "能，引用缓存不延长原生对象寿命",
            "只要字段非空就会自动恢复",
            "缓存会留下独立复制的目标"
          ],
          "answer": 1,
          "explanation": "记住引用不等于拥有目标的创建和销毁权。",
          "scenario": "组件把另一个对象的 Transform 存入字段 cachedTarget；该对象的拥有者仍可在之后调用 Destroy。缓存操作没有复制或接管目标。"
        },
        {
          "question": "必需依赖缺失时更好的反馈是？",
          "options": [
            "持续重试并忽略全部异常",
            "找另一个同类型对象临时顶替",
            "一次明确报告并停止当前无效逻辑",
            "把引用改 static 就保证存在"
          ],
          "answer": 2,
          "explanation": "必要条件失败应明确暴露，随机替换会把故障变成错误对象控制。",
          "scenario": "一个必须有目标才能工作的组件在初始化时发现目标缺失。随便找另一个同类对象可能控制错人，也没有证据表明稍后一定会补齐。"
        }
      ],
      "references": [
        {
          "label": "Component.GetComponent",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.GetComponent.html"
        },
        {
          "label": "RequireComponent",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RequireComponent.html"
        },
        {
          "label": "Component.GetComponentInChildren",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.GetComponentInChildren.html"
        }
      ],
      "summary": [
        "找到非空组件以后，还要确认是不是预期实例。",
        "缓存减少查找，不会延长目标寿命。"
      ],
      "teaching": {
        "question": "脚本需要子对象上的 SpriteRenderer，为什么在父对象调用 GetComponent 却找不到？缓存后目标又为什么会失效？",
        "keyIdea": "查找方法决定查找范围。缓存只是记住找到的引用，不会自动复制目标或保证目标一直存在。",
        "walkthrough": [
          {
            "title": "明确组件在哪",
            "text": "在 Root 下建立 View，只把 SpriteRenderer 放在 View。先在 Root 调用 GetComponent，记录没有找到的结果。"
          },
          {
            "title": "改变查找方式",
            "text": "改用明确的子级查找或 Inspector 引用，记录实际得到哪个对象，避免场景里有多个候选时靠猜测。"
          },
          {
            "title": "检查引用寿命",
            "text": "保存 View 的引用后销毁 View，再检查缓存。缓存仍可能保留托管引用，但对应引擎对象已经失效。"
          }
        ],
        "prediction": {
          "question": "加上 RequireComponent 后，运行时可以完全不检查现有依赖吗？",
          "answer": "不能把声明当作所有历史配置的证明。它帮助添加依赖，但已有对象或后来变化仍要按实际需求验证。",
          "scenario": "某脚本类型写了 RequireComponent(typeof(SpriteRenderer))。你面对的是项目里实际存在的对象，可能有历史配置或运行时变化，尚未逐一检查这些对象的依赖。"
        },
        "scenario": "先做查找实验：Root 下有 View，SpriteRenderer 只加在 View。再单独做依赖实验：RendererDependency 要求 SpriteRenderer 与自己在同一个对象上。前一个问题是去哪里找，后一个问题是声明同对象依赖，两者不能混用。",
        "purpose": "能解释查到哪个组件、为什么是它，以及缓存以后由谁保证目标仍可使用。"
      }
    },
    {
      "hours": 5,
      "timePlan": [
        {
          "label": "阅读与预测",
          "minutes": 50
        },
        {
          "label": "引擎实验",
          "minutes": 120
        },
        {
          "label": "独立练习",
          "minutes": 75
        },
        {
          "label": "自测与回忆",
          "minutes": 35
        },
        {
          "label": "复盘与归档",
          "minutes": 20
        }
      ],
      "id": "l009",
      "title": "事件、委托与启用周期：订阅也是一种资源",
      "prerequisites": [
        "l008"
      ],
      "goals": [
        "解释订阅如何形成对处理方法的引用",
        "让启用期订阅与禁用期退订成对出现",
        "用通知次数发现重复订阅和残留关系"
      ],
      "theory": [
        {
          "title": "事件先解决通知谁的问题",
          "paragraphs": [
            "假设计数器变化后，多个面板都要更新。计数器可以逐一查找面板并调用，也可以发出“数值变了”的事件，让关心它的面板自己订阅。发布者因此不必了解每种显示组件，新增监听者也不必改发布逻辑。",
            "订阅并不神秘：它把一个处理方法放入委托列表。普通 C# 事件被调用时，处理方法默认沿当前调用链同步执行，不会自动推迟到下一帧或后台线程。因此处理方法仍应避免长时间阻塞，也要考虑处理期间是否再次触发其他通知。",
            "普通多播事件默认沿当前线程依次调用处理方法。若某个处理方法抛出异常，且调用链没有处理它，这次调用不会自动继续执行列表后面的处理方法。于是“面板B没收到”除了漏订阅，也可能是面板A先失败了。日志应同时记发布开始、各处理入口和异常；不要把普通 C# event 想成会独立投递、彼此隔离的消息队列。"
          ]
        },
        {
          "title": "监听多久就配对管理多久",
          "paragraphs": [
            "一个面板只在显示期间需要通知，可在 OnEnable 注册、OnDisable 移除。打开时加一次，关闭时减一次，再打开时重新加入。这样十次开关以后，列表里仍只有当前需要的一份处理方法。",
            "若每次启用都 +=，却从不 -=，一次发布可能执行多次。对象看不见并不等于委托列表已经删除它。对需要从创建一直监听到销毁的对象，边界可以不同，但仍要说明何时加入、何时移除，而不是机械套用某两个函数。"
          ]
        },
        {
          "title": "退订需要对应同一方法身份",
          "paragraphs": [
            "命名方法 Handle 便于在两处使用同一个处理目标和方法。匿名函数也可以订阅，但之后重新写一个看起来相同的 lambda，不能被当作可靠的同一委托。需要移除时，应保留最初订阅的委托引用。",
            "这里重要的是关系身份，不是两段文字长得是否一样。捕获局部变量的匿名函数还会持有相关数据。写完订阅后，立刻问“以后用什么移除它”，能比等重复通知出现后再寻找原因更早暴露问题。"
          ]
        },
        {
          "title": "发布者可能比监听对象活得更久",
          "paragraphs": [
            "长期服务或静态事件可以继续持有处理方法引用。若面板不再使用却未退订，发布者可能仍尝试通知它，也可能让托管对象和捕获数据继续被引用。垃圾回收不能替你决定这条业务关系何时不再需要。",
            "Unity 对象销毁又有原生与托管包装之分，所以不能靠“场景里已经没了”推断事件列表干净。将通知次数与对象身份打印出来，确认销毁之后不再收到不该有的处理，比只观察画面是否关闭更可靠。"
          ]
        },
        {
          "title": "静态事件需要考虑播放模式设置",
          "paragraphs": [
            "示例用static事件让两个对象共享发布者。Domain Reload（域重载）通常会重建托管运行环境；关闭它时，不能假定每次按播放都会清掉上一轮静态状态。示例用运行初始化方法明确清空静态事件，而非依赖上一次停止。",
            "本课比较域重载时，保持Scene Reload（场景重载）开启，让场景实例重新经历相应启用流程。如果两种重载都关闭，保留实例未必重走OnEnable；此时只清空静态列表，可能没有重新订阅。本例不保证支持这种组合，需要另行设计重置与重新注册。正式架构也不必全部使用全局事件。"
          ]
        },
        {
          "title": "用次数验证关系是否正确",
          "paragraphs": [
            "测试按一次发布，记录期望收到的对象和每个对象次数。再禁用一个，确认它不再参与；重新启用后应恢复一次。最后销毁它再次发布，检查没有残留处理。这一组变化能直接检验订阅寿命。",
            "若只是给处理方法加一个布尔开关防止重复结果，可能掩盖列表已经累积的问题。应先核对实际调用次数与注册位置，再决定是否需要业务防重。事件负责通知，业务是否接受这次请求仍由明确规则判断，两者不能混在一起。"
          ]
        }
      ],
      "code": {
        "title": "同一脚本文件中的发布者与观察者",
        "language": "csharp",
        "filename": "SignalProbe.cs",
        "source": "using System;\nusing UnityEngine;\npublic sealed class SignalProbe : MonoBehaviour\n{\n    public static event Action Signal;\n    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]\n    static void ResetStatics() => Signal = null;\n    void OnEnable() => Signal += Handle;\n    void OnDisable() => Signal -= Handle;\n    void Handle() => Debug.Log($\"Received by {name}\", this);\n    [ContextMenu(\"Publish\")]\n    void Publish() => Signal?.Invoke();\n}",
        "explanation": [
          "放两个空对象并挂SignalProbe，在播放模式从组件菜单Publish。static只用于演示共享发布者，正式设计不必使用全局事件。",
          "比较Domain Reload（域重载）开关时保持Scene Reload（场景重载）开启。若两者都关闭，保留实例不一定重走OnEnable，清空静态事件后还需重新注册；这不属于本例保证。"
        ]
      },
      "lab": [
        {
          "title": "用次数检查注册与移除",
          "minutes": 60,
          "steps": [
            "创建两个SignalProbe，播放后Publish一次，确认各一条日志。",
            "反复开关其中一个10次，再发布，比较每个有效对象次数。",
            "在副本暂时移除退订，看次数怎样累积，记录后恢复正确代码。"
          ],
          "result": "用调用次数证明关系是否成对管理。",
          "purpose": "通过同一次发布的接收数，检查订阅和退订是否配对。",
          "setup": [
            "创建两个空对象 ListenerA、ListenerB，各添加 SignalProbe；Console 关闭 Collapse，以便数清 Received by ListenerA/B。",
            "Play 后选中任一对象，在 SignalProbe 组件右上角三点菜单点 Publish。这里是测试命令，不是按键，也无需另建事件发布脚本。",
            "只切换 ListenerB 的组件勾选，ListenerA 保持启用；每次恢复后发布一次。十次是重复操作的测试样本，看到累积趋势就应先检查注册代码。"
          ]
        },
        {
          "title": "测试对象结束与静态残留",
          "minutes": 60,
          "steps": [
            "销毁一个监听者后发布，确认不会继续执行它的不需要处理。",
            "比较命名方法退订与重新写lambda，记录实际移除的是不是原处理身份。",
            "查看Enter Play Mode设置，保持Scene Reload开启，对比Domain Reload开关。两者都关需要额外重新注册，不属于本例验证范围。"
          ],
          "result": "区分对象启用、订阅关系和static状态的寿命。",
          "purpose": "检查实例结束与重新进入 Play 时，共享事件是否仍符合当前监听者集合。",
          "setup": [
            "沿用 ListenerA/B 场景，Play 中在 Hierarchy 删除 ListenerB，再通过 A 的 Publish 发布。下一轮重新 Play 会恢复编辑场景，不要把删除前后的轮次混记。",
            "lambda 对照在单独测试脚本中保存一个 Action handler 变量：先用原变量 +=、-=，再比较临时新建表达式；不改正式 SignalProbe 的配对代码。",
            "域重载对照打开 Edit > Project Settings > Editor，在 Enter Play Mode Settings 的 When entering play mode 下拉中，比较 Reload Domain and Scene（重载域与场景）与 Reload Scene Only（只重载场景）。这样始终保留场景重载，只改变域重载。抄下原选项，实验后恢复。"
          ]
        }
      ],
      "pitfalls": [
        {
          "symptom": "每打开一次面板响应次数加一",
          "cause": "启用时订阅而关闭时没有退订",
          "fix": "匹配订阅边界并用重复启用测试验证"
        },
        {
          "symptom": "匿名函数看似退订却仍收到通知",
          "cause": "移除的不是原先注册的委托实例",
          "fix": "改用命名方法或保存原委托"
        }
      ],
      "exercise": {
        "brief": "建立计数发布者和两个可独立开关的观察者，连续开关20次后，验证一次通知对每个有效观察者仍最多处理一次。 其中20次开关是重复操作的压力样本，不是事件机制规定的次数；每次发布分别统计当前监听者的接收增量。",
        "deliverables": [
          "订阅寿命图",
          "完整源码",
          "重复启用与销毁后的计数证据"
        ],
        "rubric": [
          {
            "item": "通知表达事实且参数清晰",
            "points": 25
          },
          {
            "item": "订阅退订对称",
            "points": 25
          },
          {
            "item": "重复启用无累计",
            "points": 25
          },
          {
            "item": "销毁与静态残留处理明确",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "普通 C# 事件被 Invoke 时默认在哪里执行？",
          "options": [
            "自动排队到下一帧",
            "自动交给后台线程",
            "在当前调用链同步执行",
            "只在发布者收到 Update 时执行"
          ],
          "answer": 2,
          "explanation": "普通事件只是方法调用列表，不自带异步调度。",
          "scenario": "一个普通 C# event Action 有两个命名处理方法。发布者在当前方法里直接执行 Signal?.Invoke()，没有队列、协程或线程切换代码。"
        },
        {
          "question": "长期发布者持有未退订订阅者可能造成什么？",
          "options": [
            "保留引用并继续通知已经不需要的对象",
            "自动删除被关闭的监听者",
            "自动替监听者完成销毁",
            "只影响内存，不会影响行为"
          ],
          "answer": 0,
          "explanation": "委托列表形成引用关系，也会造成重复调用或过期处理。",
          "scenario": "一个长期存在的发布者保留面板处理函数。面板关闭后不再需要通知，但程序没有从发布者的委托列表移除该函数。"
        },
        {
          "question": "面板只在开启期间监听，最自然的一组边界是？",
          "options": [
            "每次 Update 加入、FixedUpdate 移除",
            "OnEnable 加入、OnDisable 移除",
            "只在构造器加入而从不移除",
            "每次收到事件后再重复订阅"
          ],
          "answer": 1,
          "explanation": "监听需求与启用期一致时，这一对边界最直接。",
          "scenario": "面板的监听需求恰好等于组件启用期：每次启用开始听，停用立刻停止听。同一实例会被多次启用，没有跨停用继续监听的需求。"
        }
      ],
      "references": [
        {
          "label": "MonoBehaviour.OnEnable",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnEnable.html"
        },
        {
          "label": "RuntimeInitializeOnLoadMethodAttribute",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RuntimeInitializeOnLoadMethodAttribute.html"
        }
      ],
      "summary": [
        "普通事件默认同步调用处理方法，不自带线程调度。",
        "退订要对应原来的处理身份，重复开关后仍应次数正确。"
      ],
      "teaching": {
        "question": "面板反复打开十次后，一次通知却执行十次，为什么关闭画面没有自动消除这些调用？",
        "keyIdea": "订阅事件是把处理方法加入发布者的调用列表。需要在合适时间加入，也要在不再监听时移除同一个处理方法。",
        "walkthrough": [
          {
            "title": "建立通知关系",
            "text": "场景放两个 SignalProbe，进入播放后执行一次 Publish，确认两个对象各收到一次通知。"
          },
          {
            "title": "开关一个监听者",
            "text": "将其中一个禁用再启用十次，再发布一次。正确配对的订阅和退订不会让次数不断增长。"
          },
          {
            "title": "检查共享状态",
            "text": "保持Scene Reload开启，对照Domain Reload（域重载）开关的多次播放，比较静态重置；同时关闭两种重载不属于本例验证范围。"
          }
        ],
        "prediction": {
          "question": "写一个外观相同的新 lambda 去 -=，一定能移除原匿名订阅吗？",
          "answer": "不能这样依赖。退订需要对应的委托身份；需要之后移除时，应保存原委托或使用明确的命名方法。",
          "scenario": "代码先用一个 lambda 订阅事件，之后准备重新写一个外观相同的 lambda 并用 -= 退订；没有保存最初的委托变量。想知道第二段表达式能否代表原订阅身份。"
        },
        "scenario": "场景中两个对象 ListenerA、ListenerB 都挂 SignalProbe，共同监听这个类型的 static Signal。通过任一组件的 Publish 菜单发布一次；反复开关 ListenerB，再比较每次发布各收到几条日志。十轮开关用于放大重复注册问题，并非 Unity 要求的次数。",
        "purpose": "把事件订阅当作需要建立和结束的联系，通过调用次数检查开关后是否有残留。"
      }
    },
    {
      "hours": 5,
      "timePlan": [
        {
          "label": "阅读与预测",
          "minutes": 50
        },
        {
          "label": "引擎实验",
          "minutes": 120
        },
        {
          "label": "独立练习",
          "minutes": 75
        },
        {
          "label": "自测与回忆",
          "minutes": 35
        },
        {
          "label": "复盘与归档",
          "minutes": 20
        }
      ],
      "id": "l010",
      "title": "集合、异常与纯 C# 模型：把引擎依赖留在边界",
      "prerequisites": [
        "l009"
      ],
      "goals": [
        "分别检查列表成员和场景对象是否存在",
        "用可控时间验证冷却规则",
        "删除列表元素时避免漏项"
      ],
      "theory": [
        {
          "title": "先把规则从引擎调用中取出来",
          "paragraphs": [
            "冷却规则可以描述为：剩余时间为零时允许使用，使用后设为2秒，之后按传入时间减少。它不必自己读取键盘、找对象或更新界面。示例的普通 Cooldown 类接收 Tick 的增量，组件只负责提供 Time.deltaTime。",
            "这样就可以不等真实时间而验证。TryUse 成功后，Tick(1) 留下1秒，再次使用失败；再 Tick(1) 后剩余为零，使用恢复成功。规则正确和场景是否每帧调用它，是两个可以分别检查的问题。"
          ]
        },
        {
          "title": "可控输入让边界更容易检查",
          "paragraphs": [
            "等待真实2秒会受到操作和帧长影响，不方便重复测试边界。手动传入零增量、负增量或超过剩余的大增量，可以快速检查规则是否按设计限制数据。示例将负增量按零处理，并让剩余时间不低于零。",
            "这不等于所有游戏系统都已确定，也不消除浮点误差。它只是让这段规则的输入更可控。接入引擎之后，仍需验证暂停时选了哪个时钟、组件是否有效、调用频率是否合适，不能用纯规则测试替代场景测试。"
          ]
        },
        {
          "title": "普通类也要选择合适边界",
          "paragraphs": [
            "普通 C# 模型适合保存不依赖场景的状态与规则。它可以由组件创建，也可以独立测试。并非每一行代码都要拆类，关键在于拆开以后是否减少了不必要依赖，让问题更容易解释，而不是仅仅增加文件数量。",
            "示例仍使用 Mathf 做简单限制，所以它不是完全脱离 Unity 程序集的库。这里强调的是不直接依赖 GameObject 生命周期和输入。如果需要移到独立程序集，还可以进一步改用普通数学接口，并明确对应引用。"
          ]
        },
        {
          "title": "集合记录成员，不管理全部寿命",
          "paragraphs": [
            "List<GameObject> 保存一组对象引用。Clear 会移除列表元素，但不会逐一 Destroy 场景对象。反过来，Destroy 一个成员对应的对象，也不会自动把列表位置删除。列表数量与实际有效对象数量可以不同。",
            "因此一个池或管理器应分别说明谁维护列表、谁创建对象、谁销毁对象。看到 Count 为零不能证明场景对象已经清理；看到对象已经消失，也不能证明所有集合引用都已移除。分别观察两边，才不会把内存或状态问题隐藏起来。"
          ]
        },
        {
          "title": "遍历时修改集合要考虑索引变化",
          "paragraphs": [
            "列表 A、B、C 中删除 B 后，C 会前移。如果从前往后遍历并直接删除，再按原方式递增索引，就可能跳过新移到当前位置的元素。使用倒序删除，或者先记录待删除项再统一处理，能让变化过程更清楚。",
            "foreach 遍历普通 List 时随意修改集合，还可能触发异常。不要捕获后直接忽略；那只会让部分清理没有完成。实验应包含连续两个无效成员，验证不会漏项，而不只是一个恰好没有暴露问题的例子。",
            "倒序删除也有具体前提：删除索引 i 后，尚未检查的较小索引不变，所以继续 i-1 不会漏掉它们。若回调还会添加、重排或删除别的成员，单凭倒序就不再足够。此时可先收集待移除项，等本轮检查结束后统一修改，并写清回调能否改集合。算法的安全性来自允许哪些变化，不是“倒序”这两个字本身。"
          ]
        },
        {
          "title": "异常应保留可追查的原因",
          "paragraphs": [
            "异常说明某一步没有按预期完成。捕获它的意义是决定怎样恢复、停止或报告，而不是让 Console 看起来干净。若方法需要正常处理失败，可以像 TryUse 那样返回结果，让调用者按明确分支处理。",
            "测试记录应同时写输入、返回值与剩余状态。遇到错误后检查对象和集合是否仍一致，再决定是否继续运行。规则模型、集合清理与场景接线分别留证据，可以避免一种测试通过后就误以为整个功能都正确。"
          ]
        }
      ],
      "code": {
        "title": "显式推进的冷却模型",
        "language": "csharp",
        "filename": "CooldownProbe.cs",
        "source": "using UnityEngine;\npublic sealed class CooldownProbe : MonoBehaviour\n{\n    readonly Cooldown cooldown = new Cooldown(2f);\n    void Update() => cooldown.Tick(Time.deltaTime);\n    [ContextMenu(\"Try use\")]\n    void TryUse() => Debug.Log(cooldown.TryUse() ? \"Used\" : \"Cooling\", this);\n}\npublic sealed class Cooldown\n{\n    readonly float duration;\n    float remaining;\n    public Cooldown(float duration) { this.duration = Mathf.Max(0f, duration); }\n    public void Tick(float dt) { remaining = Mathf.Max(0f, remaining - Mathf.Max(0f, dt)); }\n    public bool TryUse()\n    {\n        if (remaining > 0f) return false;\n        remaining = duration;\n        return true;\n    }\n}",
        "explanation": [
          "先手动调用 Cooldown 的 TryUse 与 Tick 验证规则，再挂 CooldownProbe 由 Update 提供时间。这里使用了 Mathf，但模型没有直接查找场景或读取设备。",
          "Try use 在组件三点菜单中；只有 Play 后才由 Update 持续推进时间。手工序列应另建调用者只传入指定 Tick，不同时让 Update 额外推进，否则输入已经不再受控。原例不暴露 remaining，记录内部余量需要实验观察入口。"
        ]
      },
      "lab": [
        {
          "title": "不用真实等待测试冷却",
          "minutes": 60,
          "steps": [
            "先预测TryUse、Tick(1)、TryUse、Tick(1)、TryUse的结果，再逐项调用。",
            "测试零冷却、负增量与超过剩余的大增量，记录返回值和状态。",
            "最后接入Update的deltaTime，分别说明纯规则和场景接线测试证明什么。"
          ],
          "result": "能重做输入序列，并解释正常与边界结果。",
          "purpose": "先不依赖真实等待，检查冷却规则的输入和输出。",
          "setup": [
            "把本课 CooldownProbe.cs 完整保存：文件同时包含可挂组件 CooldownProbe 与普通类 Cooldown。只需要一个文件，不要再复制定义一份 Cooldown。",
            "另建 CooldownSequenceProbe 挂空对象，在 Start 里 new Cooldown(2f)，依次调用 TryUse、Tick(1f)、TryUse、Tick(1f)、TryUse，每次 TryUse 用 Debug.Log 输出返回值。这个对照对象不要同时接 Update.Tick。",
            "真实时间对照另建空对象挂原 CooldownProbe，Play 时在组件三点菜单选择 Try use；原例没有暴露 remaining 字段，若需记录内部余量，在实验副本增只读观察入口，不把不可见字段当 Inspector 已有控件。"
          ]
        },
        {
          "title": "分开列表元素与场景对象",
          "minutes": 60,
          "steps": [
            "列表保存3个场景对象，销毁中间对象后查看Count与有效成员。",
            "连续制造两个失效成员，倒序删除，检查没有跳过相邻元素。",
            "仅Clear列表再看Hierarchy，随后由负责创建的逻辑另行销毁对象。"
          ],
          "result": "删除成员与销毁对象互不自动代替。",
          "purpose": "分别观察列表计数、有效成员数与 Hierarchy 中实际对象。",
          "setup": [
            "创建空对象 ListHost 和三个独立空对象 One、Two、Three。另建列表测试组件，提供三个 GameObject 槽，从 Hierarchy 拖入对应对象，再在 Start 建立列表。",
            "在测试方法中销毁 Two 后等一帧再记录 Count 和用 Unity 空值检查得到的有效数，避免把延迟销毁尚未完成的时刻混入结果。",
            "相邻失效测试新开一轮，销毁 Two 与 Three 后再清理；Clear 测试也新开一轮，只清列表再看 Hierarchy，最后由明确的创建/管理者销毁对象。"
          ]
        }
      ],
      "pitfalls": [
        {
          "symptom": "删除列表项时漏掉相邻目标",
          "cause": "正向索引移除后元素前移",
          "fix": "使用倒序或明确的两阶段修改策略"
        },
        {
          "symptom": "清空列表后场景对象仍在",
          "cause": "移除引用不等于 Destroy 引擎对象",
          "fix": "由拥有者分别处理容器与对象寿命"
        }
      ],
      "exercise": {
        "brief": "用普通模型写3次充能规则，由组件传入时间。列出至少6组可重复的输入序列，不要求先搭测试框架。",
        "deliverables": [
          "模型与适配组件",
          "六组输入预期表",
          "集合清理实验记录"
        ],
        "rubric": [
          {
            "item": "模型无场景隐式依赖",
            "points": 25
          },
          {
            "item": "边界情况有明确结果",
            "points": 25
          },
          {
            "item": "组件只负责引擎适配",
            "points": 25
          },
          {
            "item": "对象与容器所有权清晰",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "List<GameObject>.Clear 会自动销毁场景对象吗？",
          "options": [
            "不会，只移除列表成员",
            "会对每个成员调用 Destroy",
            "只销毁没有其他引用的成员",
            "会同时删除对应 Prefab 资源"
          ],
          "answer": 0,
          "explanation": "清空集合不是场景对象销毁命令。对象寿命需要另行管理。",
          "scenario": "targets 是 List<GameObject>，保存三个仍在场景中的对象。代码仅执行 targets.Clear()，没有执行 Destroy，也没有其他脚本清理这些对象。"
        },
        {
          "question": "给冷却模型传入时间增量有什么价值？",
          "options": [
            "保证全部引擎行为都确定",
            "不真实等待也能验证冷却规则",
            "自动消除浮点误差",
            "替代所有场景验证"
          ],
          "answer": 1,
          "explanation": "可控增量让纯规则容易测试，但实际调用与暂停行为仍需场景检查。",
          "scenario": "2秒冷却模型提供 Tick(dt) 接口。你希望验证使用后1秒拒绝、累计2秒后允许，以及零/负/大增量等边界。"
        },
        {
          "question": "捕获异常后直接忽略为什么危险？",
          "options": [
            "任何 catch 都会导致编译失败",
            "忽略异常会自动修复剩余数据",
            "可能让错误状态继续流动并丢失原因",
            "异常被忽略后所有代码都会重新执行"
          ],
          "answer": 2,
          "explanation": "没有决定恢复方式就吞掉异常，会同时失去执行保障和定位证据。",
          "scenario": "清理方法中发生异常后，catch 什么也不记录、不恢复，也不通知上层，随后程序继续使用可能只完成一半的状态。"
        }
      ],
      "references": [
        {
          "label": "Object.Destroy",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.Destroy.html"
        },
        {
          "label": "Time.deltaTime",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-deltaTime.html"
        }
      ],
      "summary": [
        "清空列表不自动销毁场景对象，销毁也不自动删成员。",
        "规则测试与场景接线测试各自回答不同问题。"
      ],
      "teaching": {
        "question": "测试一个2秒冷却，能否不真的等2秒？清空保存对象的列表，场景对象会不会一起消失？",
        "keyIdea": "纯数据规则可以接受明确输入来验证；引擎负责提供时间和显示。集合保存的是成员关系，清除关系不等于销毁对象。",
        "walkthrough": [
          {
            "title": "直接推动规则",
            "text": "新建2秒冷却，依次 TryUse、Tick(1)、TryUse、Tick(1)、TryUse，先写下三次尝试的预期结果。"
          },
          {
            "title": "接入真实场景",
            "text": "再由组件 Update 传入 Time.deltaTime，比较模型规则测试与场景接线测试各证明了什么。"
          },
          {
            "title": "分开成员和对象",
            "text": "列表放三个对象，Clear 后查看 Count 和 Hierarchy，确认列表清空不会自动调用 Destroy。"
          }
        ],
        "prediction": {
          "question": "销毁列表中间的对象，Count 会自动减少吗？",
          "answer": "通常不会。列表仍保留该成员位置，需要明确清理失效引用；销毁引擎对象和删除列表元素是两件事。",
          "scenario": "List<GameObject> targets 依次保存场景对象 One、Two、Three。调用 Destroy(Two)，等销毁生效，但尚未调用 Remove、RemoveAt 或 Clear；准备查看 targets.Count。"
        },
        "scenario": "Cooldown 是不挂到 GameObject 的普通规则对象：新建2秒冷却，TryUse 尝试使用，Tick(dt) 明确推进时间。CooldownProbe 才负责把 Unity 的 Time.deltaTime 传入。另用 List<GameObject> 保存三个场景对象，比较列表与对象各自的变化。",
        "purpose": "用可控输入验证规则，并学会分别管理容器成员与场景对象寿命。"
      }
    }
  ]
});
