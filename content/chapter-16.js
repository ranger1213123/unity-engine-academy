window.COURSE_MODULES.push({
  "id": "m16",
  "number": 16,
  "title": "架构与测试",
  "subtitle": "把引擎回调变成清晰的边界",
  "description": "用职责、依赖、生命周期和测试建立可修改的工程结构；不把模式名称或管理器数量当作架构质量。",
  "accent": "#527c63",
  "lessons": [
    {
      "id": "l076",
      "title": "组件职责与依赖：谁拥有这段行为",
      "prerequisites": [
        "l015",
        "l075"
      ],
      "goals": [
        "按变化原因拆分组件",
        "用显式引用表达依赖",
        "解释 RequireComponent 与运行时验证的区别"
      ],
      "theory": [
        {
          "title": "先从两个脚本同时改速度看问题",
          "paragraphs": [
            "假设移动脚本在一次固定更新里把刚体的 x 速度设为 +5，击退脚本又把它设为 -3。如果移动先写、击退后写，最后是 -3；交换顺序，最后就成了 +5。每次赋值都覆盖这个分量，Unity 不会自动替你把它们合成 +2。两个脚本单独运行都可能正常，一起运行却会争用同一个状态。把文件分别命名为 Player 和 Knockback，也不会决定移动、击退与眩晕谁应该优先。",
            "因此划分组件前，先问谁最终决定速度。可以让输入、眩晕和击退提供各自的数据，由一个运动组件统一计算并写入刚体。这里说的“控制权”，具体就是同一时刻由哪段代码负责最终修改这个状态，而不是哪个类名字看起来更重要。"
          ]
        },
        {
          "title": "一个组件负责一件能讲清楚的事",
          "paragraphs": [
            "本课 Motor 接收移动意图，根据速度配置，在固定更新中设置 Rigidbody2D 的运动。它不读取具体键位，也不负责存档和血条。这样换手柄时主要修改输入部分，调整移动速度时主要检查 Motor；每种变化有一个容易找到的位置，而不是一个脚本包含所有系统。",
            "不过脚本越多并不一定越好。若一个组件只有转发一次调用的作用，又没有隔离变化或配置，拆分可能只让查找更费力。判断依据是修改需求时要理解和改变多少内容。先用真实的输入切换、眩晕、缺失依赖三个例子检验，不急着搭很大的抽象层次。"
          ]
        },
        {
          "title": "把需要的东西明摆出来",
          "paragraphs": [
            "组件依赖刚体，就用明确字段、RequireComponent 和启动检查表达。其他组件调用 SetIntent，也应该知道参数代表什么：方向或强度是否限制在合理范围，什么时候读取，停用后是否清零。写出这些约定，调用者才不用打开 Motor 的所有实现才能安全使用它。",
            "RequireComponent 帮助补齐组件类型，却不能保证刚体就是 Dynamic、重力为零或场景中的外部引用已赋值。俯视移动若忘记关重力，角色可能一边接受方向一边下落。缺少配置时尽早报告具体对象和原因，比等运行很久后出现“移动有点怪”更容易排查。"
          ]
        },
        {
          "title": "用意图隔开输入设备和运动实现",
          "paragraphs": [
            "键盘产生向右向量，手柄也可以产生向右但强度较小的向量。Motor 接收的是意图，不需要知道哪一种设备。测试时甚至可以不用真实设备，直接提交一个固定向量，观察刚体速度；这使你能单独判断运动逻辑，而不同时猜键位绑定是否正确。",
            "眩晕规则要放在哪里，则取决于谁管理最终允许的运动。若只把键盘输入归零，却让击退或 AI 仍直接改速度，角色可能继续移动。先画出所有来源，决定哪些被眩晕禁止、哪些仍允许，再交给最终写入者处理，避免每个来源各自猜测优先级。"
          ]
        },
        {
          "title": "用变化和故障检验划分是否有用",
          "paragraphs": [
            "实验先增加第二个速度写入脚本，观察冲突，再停用它恢复唯一写入者。接着保持 Motor 接口不变，分别接键盘和受控测试输入。你要解释的不是哪种写法更漂亮，而是哪种变化被局限在一个位置、最终速度在哪里产生、故障时能从哪里开始检查。",
            "当组件可以用简单输入独立验证，通常说明它的责任更清楚。仍需把配置、启停和更新阶段写入说明：测试通过的向量计算不代表碰撞配置也正确，接口好用也不代表可以随意跨线程调用引擎对象。清楚的小边界，比笼统承诺“低耦合”更能帮助后续维护。"
          ]
        }
      ],
      "code": {
        "title": "只有 Motor 写刚体速度",
        "language": "csharp",
        "filename": "IntentMotor2D.cs",
        "source": "using UnityEngine;\n\n[RequireComponent(typeof(Rigidbody2D))]\npublic sealed class IntentMotor2D : MonoBehaviour\n{\n    [SerializeField, Min(0f)] private float speed = 5f;\n    private Rigidbody2D body;\n    private Vector2 intent;\n    private void Awake() => body = GetComponent<Rigidbody2D>();\n    public void SetIntent(Vector2 value) => intent = Vector2.ClampMagnitude(value, 1f);\n    private void FixedUpdate() => body.linearVelocity = intent * speed;\n    private void OnDisable()\n    {\n        intent = Vector2.zero;\n        if (body != null) body.linearVelocity = Vector2.zero;\n    }\n}",
        "explanation": [
          "挂在带 Rigidbody2D 的实验对象上。俯视实验把重力设为 0，并核对示例需要的刚体类型；本例没有输入读取代码。",
          "通过 SetIntent 提交方向和强度，由 Motor 最终写入速度。先移除其他直接写同一刚体速度的脚本，再观察结果。"
        ]
      },
      "lab": [
        {
          "title": "识别并消除抢写",
          "minutes": 60,
          "steps": [
            "在实验副本给同一 Rigidbody2D 再挂一个脚本，每个固定步写不同速度，对照 Motor 的最终结果。",
            "停用临时写入者，恢复唯一控制权。",
            "用组件菜单或简单测试驱动提交移动意图。",
            "写出 Motor 的输入、输出和配置前提。"
          ],
          "result": "能指出最终刚体写入者且无隐式抢写。"
        },
        {
          "title": "变化需求演练",
          "minutes": 60,
          "steps": [
            "给相同 Motor 分别设计键盘和手柄输入，先写它们提交的同一向量含义，再保持运动接口不变。",
            "加入眩晕规则，决定在意图源还是控制权层处理。",
            "为缺失依赖建立启动诊断。",
            "比较改动文件数量，删除没有实际用途的抽象。"
          ],
          "result": "三种变化具有清晰影响范围。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "击退方向偶尔被移动覆盖",
          "cause": "两个系统争夺同一物理状态写入权。",
          "fix": "单一运动所有者合成意图与击退。"
        },
        {
          "symptom": "场景复制后大量空引用",
          "cause": "依赖隐藏在全场景查找或命名假设中。",
          "fix": "用明确引用与启动验证表达配置。"
        }
      ],
      "exercise": {
        "brief": "在独立实验副本中，把输入读取、运动和画面表现拆成三个明确职责；保留原有移动效果，并说明谁最终修改刚体。",
        "deliverables": [
          "三个职责的接口与挂载表",
          "唯一写入者证明",
          "三个变化需求的改动记录"
        ],
        "rubric": [
          {
            "item": "控制权唯一",
            "points": 35
          },
          {
            "item": "依赖可见且可验证",
            "points": 25
          },
          {
            "item": "变化范围受控",
            "points": 25
          },
          {
            "item": "不过度抽象",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "两个组件都写同一刚体速度的主要问题是？",
          "options": [
            "主要是脚本数量太多",
            "最终修改权和执行顺序发生冲突",
            "只要把两个脚本放同一目录就能解决"
          ],
          "answer": 1,
          "explanation": "两个组件同时修改同一状态，职责名称也无法决定谁优先，结果容易依赖执行顺序。"
        },
        {
          "question": "RequireComponent 是否替代全部运行时验证？",
          "options": [
            "是，存在刚体就说明所有设置符合玩法",
            "否，类型存在不保证配置和使用阶段正确",
            "是，只要 Awake 中 GetComponent 成功即可"
          ],
          "answer": 1,
          "explanation": "类型存在与配置正确是两件事，刚体类型、重力和外部引用仍需要检查。"
        },
        {
          "question": "输入设备变化理想情况下先影响哪里？",
          "options": [
            "先影响把设备信号转换成意图的输入部分",
            "必须重写最终刚体运动算法",
            "必须改动所有读取角色状态的界面"
          ],
          "answer": 0,
          "explanation": "输入适配部分把设备信号变成稳定的意图，Motor 因此不必跟着每种设备重写。"
        }
      ],
      "references": [
        {
          "label": "RequireComponent",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RequireComponent.html"
        },
        {
          "label": "Component.GetComponent",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.GetComponent.html"
        }
      ],
      "summary": [
        "先决定谁最终写同一状态，再让输入、眩晕等来源提供数据。",
        "组件依赖、参数含义和使用时机要让调用者看得见。"
      ],
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
      "teaching": {
        "question": "移动和击退都写同一个刚体速度，为什么换执行顺序就会改变结果？",
        "keyIdea": "两次写入竞争同一个状态，后写入者可能覆盖前者。先决定由一个运动组件最终写速度，再让各来源提交可合并或有优先级的输入。",
        "walkthrough": [
          {
            "title": "观察冲突",
            "text": "移动组件写向右速度，另一个组件又写向左；记录最终值及两个写入位置。"
          },
          {
            "title": "统一修改位置",
            "text": "停用第二个直接写入者，让 Motor 成为唯一决定最终刚体速度的组件。"
          },
          {
            "title": "改变输入来源",
            "text": "保持 SetIntent 接口不变，用受控向量替代键盘，单独验证运动结果和配置。"
          }
        ],
        "prediction": {
          "question": "只有 RequireComponent(Rigidbody2D)，能保证俯视角色不会受重力下落吗？",
          "answer": "不能。它帮助保证组件类型存在，不会替你把 gravityScale 设为 0，也不会验证所有运动配置。"
        }
      }
    },
    {
      "id": "l077",
      "title": "事件与生命周期：订阅者怎样安全退出",
      "prerequisites": [
        "l013",
        "l076"
      ],
      "goals": [
        "用事件表达已发生事实",
        "配对订阅和取消订阅",
        "定位静态事件导致的重复响应与对象滞留"
      ],
      "theory": [
        {
          "title": "先改生命，再通知血条",
          "paragraphs": [
            "角色受到 10 点伤害，血条需要刷新，音效可能也要播放。角色不必知道每个界面的具体类，可以在状态改变后发出 Changed 事件，愿意关心变化的组件订阅它。这与“请角色执行一次伤害”的命令不同：命令请求做事，事件说明已经发生了什么。",
            "顺序很重要。若当前生命从 100 减到 90，应先保存 90，再广播。否则回调里读取生命的血条可能仍看到 100。普通 C# event 默认同步调用订阅方法，不会自动排到下一帧，也不会自动移到后台线程，因此回调耗时和异常都可能影响当前调用过程。"
          ]
        },
        {
          "title": "订阅也是一条需要结束的联系",
          "paragraphs": [
            "可以沿一条具体联系理解订阅：长寿命服务保存 Changed 的委托，委托记录血条对象和要调用的方法，于是形成“服务→委托→血条”的持有路径。只要订阅仍在，服务发事件时就会尝试沿这条路径调用。场景退出不等于普通 C# event 自动删除这条记录；对于已经失效的 Unity 对象，残留联系也可能引出异常或旧状态。因此订阅不是发完即散的纸条，而是一条必须在合适时机解除的调用关系。",
            "本例在启用时订阅，在停用时取消，让参与通知的时间与组件工作时间一致。反复启停 10 次后，一次伤害仍只应调用一次。如果每次启用都加一次，却没有对应移除，回调可能越来越多。用命名方法或保存委托身份，才能取消当时实际加入的那一个回调。"
          ]
        },
        {
          "title": "晚打开的界面为什么不能只等事件",
          "paragraphs": [
            "角色已经从 100 变到 90，随后才打开新血条。如果它只订阅未来的 Changed，暂时没有下一次伤害，就不知道现在该显示多少。事件描述变化，不会自动重放全部历史；所以订阅建立后，还需要读取当前状态来完成首次显示。",
            "你可以把两者分清：当前值回答“现在是多少”，事件回答“刚刚变了，可能需要刷新”。示例先建立合适的联系，再用当前快照初始化。具体顺序还要避免过程中漏掉变化；在本课主线程同步实验里先看清调用过程，涉及并发时则需另外设计同步。"
          ]
        },
        {
          "title": "切换发布者时，先结束旧联系",
          "paragraphs": [
            "界面最初观察角色甲，之后要观察角色乙。只把 source 字段改成乙，不会自动从甲的事件里移除旧方法。更稳妥的过程是记住当前绑定对象，先从旧对象取消，再设置新对象，订阅并读取新状态。每一步都要允许旧源已经失效的情况。",
            "示例为缩小变量，实验期间不替换 source。扩展时应单独实现更换方法，而不是让任意代码直接改字段。你可以用两个角色轮流受伤做对照：切到乙后，甲再受伤不应刷新该界面，乙受伤则应该刷新，这比只检查字段看起来指向乙更有说服力。"
          ]
        },
        {
          "title": "静态事件更需要检查播放模式起点",
          "paragraphs": [
            "静态发布者可能跨越普通实例的寿命。在编辑器关闭 Domain Reload 时，静态状态不再按默认流程清空，上一轮留下的联系可能影响下一轮。不能用一次默认设置下的实验，保证所有播放模式组合都没问题。记录重载设置，并为静态重置安排明确入口。",
            "最后把三类证据分开：状态数值是否正确、订阅次数是否正确、订阅者退出后是否仍被引用。一个血条显示正常，并不证明没有重复监听；一次回调正常，也不证明晚加入能正确初始化。按这些问题逐项实验，事件就会成为清楚的协作方式，而不是难找的隐形调用链。"
          ]
        }
      ],
      "code": {
        "title": "发布状态与成对订阅",
        "language": "csharp",
        "files": [
          {
            "filename": "HealthSignal.cs",
            "source": "using System;\nusing UnityEngine;\n\npublic sealed class HealthSignal : MonoBehaviour\n{\n    public int Current { get; private set; } = 100;\n    public event Action<int> Changed;\n    public void Damage(int amount)\n    {\n        Current = Mathf.Max(0, Current - Mathf.Max(0, amount));\n        Changed?.Invoke(Current);\n    }\n}\n\n"
          },
          {
            "filename": "HealthObserver.cs",
            "source": "using UnityEngine;\npublic sealed class HealthObserver : MonoBehaviour\n{\n    [SerializeField] private HealthSignal source;\n    private void OnEnable()\n    {\n        if (source == null) return;\n        source.Changed += Show;\n        Show(source.Current);\n    }\n    private void OnDisable()\n    {\n        if (source != null) source.Changed -= Show;\n    }\n    private void Show(int value) => Debug.Log($\"HP: {value}\", this);\n}"
          }
        ],
        "explanation": [
          "按代码块分别创建对应文件，把 Observer 的 source 指定为实验中的发布者。通过主线程上的 Damage 触发生命变化。",
          "本例运行时不更换 source。若要支持切换，增加明确方法：取消旧订阅、绑定新对象，再刷新当前状态。"
        ]
      },
      "lab": [
        {
          "title": "重复启停审计",
          "minutes": 60,
          "steps": [
            "给 Observer 赋一个明确 source，在播放中调用一次 Damage，记录生命和通知次数。",
            "停用 Observer 后再次伤害，确认它不响应。",
            "重复启停十次，每次伤害只应产生一次通知。",
            "故意删去解绑，观察重复响应，再修复。"
          ],
          "result": "订阅寿命与组件启停一致。"
        },
        {
          "title": "迟到的界面",
          "minutes": 60,
          "steps": [
            "先让角色受伤，再启用第二个 Observer，观察它是否立即显示当前生命，而非等待下一次受伤。",
            "确认初始快照立即显示当前值。",
            "移除快照读取，解释为何没有新事件时界面空白。",
            "记录静态事件在当前重载配置中的行为，不把一次实验扩展为所有设置。"
          ],
          "result": "明确区分当前状态和变化事件。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "打开界面多次后一次受伤更新多次",
          "cause": "每次启用都订阅却未配对解除。",
          "fix": "在同一生命周期配对绑定与解绑，检查静态发布者。"
        },
        {
          "symptom": "新界面一直显示初始生命",
          "cause": "只监听变化，没有读取当前状态。",
          "fix": "订阅建立时同步当前快照。"
        }
      ],
      "exercise": {
        "brief": "建立生命事件驱动的 UI/日志两个观察者，验证十次启停、迟到订阅、场景退出和更换发布者。",
        "deliverables": [
          "订阅关系图",
          "启停、晚加入、场景退出和更换来源四种情况的记录",
          "具名回调及切源代码"
        ],
        "rubric": [
          {
            "item": "绑定解除配对",
            "points": 30
          },
          {
            "item": "状态先提交后通知",
            "points": 25
          },
          {
            "item": "初始同步正确",
            "points": 25
          },
          {
            "item": "切源与退出无滞留",
            "points": 20
          }
        ]
      },
      "quiz": [
        {
          "question": "普通 C# event 调用默认会怎样执行？",
          "options": [
            "自动后台线程",
            "同步执行订阅回调",
            "自动下一帧"
          ],
          "answer": 1,
          "explanation": "普通 event 在当前调用过程中同步执行订阅方法；线程和延迟行为需要另外实现。"
        },
        {
          "question": "晚加入的 UI 只订阅 Changed 足够吗？",
          "options": [
            "总是足够",
            "通常还需当前状态快照",
            "必须每帧广播所有历史"
          ],
          "answer": 1,
          "explanation": "若当前没有新变化，只有事件订阅无法告诉晚加入者现有值，还需要读取当前状态。"
        },
        {
          "question": "长寿命发布者忘记解绑可能造成？",
          "options": [
            "订阅者被引用并重复响应",
            "必定立即崩溃",
            "自动被 GC 安全清理"
          ],
          "answer": 0,
          "explanation": "发布者的委托关系可能继续引用订阅者，也可能因重复订阅造成多次响应；它不会因为场景意图上退出就自动消失。"
        }
      ],
      "references": [
        {
          "label": "MonoBehaviour.OnEnable",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnEnable.html"
        },
        {
          "label": "MonoBehaviour.OnDisable",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnDisable.html"
        }
      ],
      "summary": [
        "先修改状态再通知观察者，启用订阅和停用取消要成对。",
        "晚加入者需要当前状态，更换发布者要先解除旧联系。"
      ],
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
      "teaching": {
        "question": "角色已经剩 90 生命，新打开的血条只订阅 Changed，为什么可能一直不显示？",
        "keyIdea": "事件通知变化，不自动提供过去发生的内容。界面需要先获得当前状态，并在工作的时间内保持恰好一次订阅。",
        "walkthrough": [
          {
            "title": "状态先改变",
            "text": "角色先从 100 减到 90，再广播 Changed；已有观察者此时能读取到 90。"
          },
          {
            "title": "晚加入观察者",
            "text": "新血条启用时建立订阅，并立即读取当前生命，显示 90，而不是等下次受伤。"
          },
          {
            "title": "退出后核对",
            "text": "停用血条时取消它的订阅，再伤害角色；日志应只来自仍在工作的观察者，停用血条不再响应。"
          }
        ],
        "prediction": {
          "question": "source 从甲改成乙，是否自动取消甲的事件订阅？",
          "answer": "不会。需要先对旧源取消订阅，再绑定新源并读取新状态；只改字段不会修改旧事件列表。"
        }
      }
    },
    {
      "id": "l078",
      "title": "程序集与工程边界：让编译器检查依赖",
      "prerequisites": [
        "l076",
        "l077"
      ],
      "goals": [
        "设计单向程序集依赖",
        "隔离 Editor 与 Runtime 代码",
        "解释 asmdef 对编译和包引用的作用"
      ],
      "theory": [
        {
          "title": "为什么放进 Core 文件夹还会互相引用",
          "paragraphs": [
            "你把伤害公式放到 Core 文件夹，界面放到 UI 文件夹，但 Core 仍能直接调用血条类。文件夹帮助人找文件，却未必让编译器阻止这条依赖。若希望底层规则无法读取场景和界面，需要建立实际的程序集划分，并配置它能引用哪些程序集。",
            "程序集可以理解为一起编译并暴露类型的一组代码。Assembly Definition 文件，也就是 asmdef，告诉 Unity 这一组代码的边界和引用配置。它的价值不是多出几个文件，而是让越界访问在编译时就失败，避免约定只写在文档里，后来的代码却悄悄绕过。"
          ]
        },
        {
          "title": "用最小规则层试一次真正的限制",
          "paragraphs": [
            "本课把普通伤害函数放进 Rules 程序集，只使用基础类型和所需的 System 能力，并配置不引用引擎。调用它的 Runtime 适配层可以引用 Rules，负责把角色数据交进去，再把结果写回组件。依赖方向是 Runtime 使用规则，规则不反过来查找角色。",
            "然后故意在 Rules 中引用 MonoBehaviour。如果配置正确，编译器应拒绝。这个失败恰好证明限制有效；撤销非法代码后再继续。不要只画一张漂亮的箭头图而从未尝试越界，也不要认为命名空间叫 Rules 就自动拥有同样的保护。"
          ]
        },
        {
          "title": "找不到类型时，区分三个问题",
          "paragraphs": [
            "using 只影响类型名字怎样书写。比如把 UnityEngine.InputSystem.Keyboard 写成 Keyboard，需要 using UnityEngine.InputSystem；但如果 Input System 包没安装，完整名字和简写都找不到。包已安装而当前 asmdef 没引用它提供的程序集，同样不是再加一个 using 就能解决。排查时依次确认“代码从哪个包来”“本程序集能否引用它”“命名空间是否写对”，最后再核对平台限制。这几个问题发生在不同层次，错误提示相似，修法却不同。",
            "创建自定义程序集后，还要理解它和预定义程序集的关系，不能把所有旧引用假定为保持不变。项目中使用的包类型、测试类型和编辑器类型各有来源。实验保持范围小，每增加一个 asmdef 就检查其脚本归属与引用，避免一次重排整个项目后不知从哪里恢复。"
          ]
        },
        {
          "title": "Editor 代码要在 Player 编译之外",
          "paragraphs": [
            "自定义 Inspector 需要 UnityEditor，而发布的 Player 不包含这套编辑器 API。可靠做法是把工具放进明确的 Editor-only 程序集，并让它引用所需 Runtime 数据；运行代码不能反过来依赖编辑器。两边在编辑器里都能见到，不代表发布时也都存在。",
            "特别是父目录已经有 Runtime asmdef 时，不能仅凭下面文件夹名字叫 Editor，就推断全部工具代码已被排除。要建立正确的独立程序集并配置平台，实际检查脚本归属。最后做一次目标平台构建，因为只有编辑器内编译成功，还没有验证 Player 所见的边界。"
          ]
        },
        {
          "title": "出现循环引用，先回头看职责",
          "paragraphs": [
            "若 Rules 想调用 UI，UI 又要调用 Rules，不能靠把两个方向的引用都勾选上解决。你需要重新划分：规则返回结果，界面读取结果；或者把双方真正共享的简单数据和接口提到共同依赖的地方。目的不是消灭一切联系，而是让联系有清楚方向。",
            "用一次需求变化检验结果，例如新增一种伤害规则时，不应必须让 Rules 了解新的血条样式。与此同时，程序集并不替你管理资源路径、场景引用或所有运行时顺序。保留依赖图、越界失败记录和 Player 构建结果，才能说明哪些边界确实由编译器检查，哪些仍需其他验证。"
          ]
        }
      ],
      "code": {
        "title": "不依赖 UnityEngine 的规则程序集",
        "language": "json",
        "filename": "Assets/EngineLab/Rules/EngineLab.Rules.asmdef",
        "source": "{\n  \"name\": \"EngineLab.Rules\",\n  \"rootNamespace\": \"EngineLab.Rules\",\n  \"references\": [],\n  \"includePlatforms\": [],\n  \"excludePlatforms\": [],\n  \"allowUnsafeCode\": false,\n  \"autoReferenced\": true,\n  \"noEngineReferences\": true\n}",
        "explanation": [
          "只在独立实验目录使用该配置，让 Rules 不引用 UnityEngine。先用一个普通数值函数验证，再逐步迁移。",
          "分别配置 Runtime、Editor、Tests 的实际程序集引用。测试程序集先由 Test Runner 创建模板，Editor 程序集明确限制为编辑器。"
        ]
      },
      "lab": [
        {
          "title": "把边界交给编译器",
          "minutes": 60,
          "steps": [
            "在独立目录创建 Rules asmdef，按示例配置为不引用引擎，再放入普通伤害函数。",
            "在适配层创建独立 asmdef 并引用 Rules。",
            "故意在 Rules 引用 MonoBehaviour，确认编译器拒绝。",
            "撤销非法依赖，保存最终依赖图。"
          ],
          "result": "底层无法直接访问引擎场景 API。"
        },
        {
          "title": "验证 Editor 隔离",
          "minutes": 60,
          "steps": [
            "为工具建立 Editor-only 程序集，显式引用 Runtime，检查对应脚本实际编译到哪里。",
            "确认工具能访问 Runtime，而 Runtime 不引用 Editor。",
            "检查包类型使用所需的程序集引用。",
            "运行一次目标平台构建并记录结果。"
          ],
          "result": "边界同时在编辑器和 Player 编译中成立。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "using 写了却仍找不到类型",
          "cause": "类型所在包未安装或程序集未引用。",
          "fix": "检查 package、asmdef 引用和平台约束。"
        },
        {
          "symptom": "编辑器正常但构建找不到 UnityEditor",
          "cause": "编辑器代码混入运行程序集。",
          "fix": "移动到正确的 Editor-only 程序集并重新构建。"
        }
      ],
      "exercise": {
        "brief": "为规则、运行适配、编辑器和测试四个边界设计无环依赖图，并迁移一个小功能。",
        "deliverables": [
          "四程序集目的说明",
          "引用图与配置截图",
          "一次故意越界失败和一次构建成功记录"
        ],
        "rubric": [
          {
            "item": "依赖无环",
            "points": 30
          },
          {
            "item": "Editor 正确隔离",
            "points": 30
          },
          {
            "item": "规则可独立测试",
            "points": 25
          },
          {
            "item": "证据可复现",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "Runtime asmdef 覆盖目录下有 Editor 子文件夹，怎样可靠隔离工具代码？",
          "options": [
            "父 Runtime asmdef 下的 Editor 名称一定自动隔离",
            "建立独立 Editor-only 程序集并配置引用",
            "把命名空间改成 UnityEditor 就自动隔离"
          ],
          "answer": 1,
          "explanation": "存在父 asmdef 时，不能仅凭 Editor 目录名断定编译归属。独立程序集和平台约束要配置并实际验证。"
        },
        {
          "question": "循环引用通常应怎样解决？",
          "options": [
            "把两个方向的引用全部勾上",
            "重新划分职责或抽取双方共用的接口和数据",
            "只把其中一个命名空间改名"
          ],
          "answer": 1,
          "explanation": "循环通常说明双方职责或共享内容放错位置，应重划方向或提取共同依赖，而不是增加更多交叉引用。"
        },
        {
          "question": "Player 构建验证了什么？",
          "options": [
            "所有游戏行为都已验证",
            "发现编辑器环境可能掩盖的 Player 编译依赖问题",
            "所有平台都不再需要构建验证"
          ],
          "answer": 1,
          "explanation": "目标 Player 构建能暴露编辑器环境中看不出的运行代码依赖，但不能替代行为测试或其他平台验证。"
        }
      ],
      "references": [
        {
          "label": "Organize scripts into assemblies",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/assembly-definition-files.html"
        },
        {
          "label": "CompilationPipeline.GetAssemblies",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Compilation.CompilationPipeline.GetAssemblies.html"
        }
      ],
      "summary": [
        "文件夹帮助组织，程序集配置才能实际限制代码引用。",
        "运行代码不能依赖编辑器，引用方向要用越界实验和构建验证。"
      ],
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
      "teaching": {
        "question": "把规则放进 Core 文件夹，为什么仍能意外调用 UI？",
        "keyIdea": "文件夹主要组织文件；真正限制代码引用，需要建立程序集并配置依赖方向。用一次故意越界的编译失败验证限制。",
        "walkthrough": [
          {
            "title": "建立规则程序集",
            "text": "在独立目录创建 Rules asmdef，只放普通伤害函数，配置它不能引用 UnityEngine。"
          },
          {
            "title": "建立调用方向",
            "text": "Runtime 适配程序集引用 Rules，把数值交给函数，接收结果后再修改组件。"
          },
          {
            "title": "验证边界生效",
            "text": "临时在 Rules 引用 MonoBehaviour，确认编译失败；撤销后再验证 Player 构建。"
          }
        ],
        "prediction": {
          "question": "Runtime asmdef 下建一个 Editor 文件夹就一定隔离了吗？",
          "answer": "不能这样推断。父 asmdef 会影响脚本归属，应建立并配置独立的 Editor-only 程序集，再用构建验证。"
        }
      }
    },
    {
      "id": "l079",
      "title": "Edit Mode 测试：用例验证规则而非复述实现",
      "prerequisites": [
        "l074",
        "l078"
      ],
      "goals": [
        "建立 Edit Mode 测试程序集",
        "选择有业务意义的边界用例",
        "区分实现细节和行为契约"
      ],
      "theory": [
        {
          "title": "从一个真实错误开始写测试",
          "paragraphs": [
            "伤害函数收到当前生命 5、伤害 8，要求结果不能低于 0。若实现只是相减，会返回 -3。一个有用的测试应明确写出这组输入和期望 0，让错误实现失败，而不是把同样的减法复制进测试，再算出 -3 作为预期。预期来自行为要求，不来自被测代码本身。",
            "测试不需要一开始覆盖所有函数。先保护一个重要、容易说清楚的行为：过量伤害会把生命限制到 0。记录失败信息，修正实现，再确认测试通过。这样的用例能证明自己确实区分了错误和正确，比从未看过失败的绿灯更有信息。"
          ]
        },
        {
          "title": "把安排、执行和断言分开",
          "paragraphs": [
            "一份测试先准备输入，再执行一次被测动作，最后检查结果，这三段通常称为 Arrange、Act、Assert。名字只是帮助阅读，关键是让人一眼看出已知条件、发生的操作和失败原因。若准备过程已经包含复杂场景行为，测试失败时就难以判断是在测公式还是在测环境。",
            "数值规则尽量用固定输入，不依赖当前帧率、机器时间或另一个测试留下的静态值。整数可以精确比较；浮点计算则按用途选择容差，例如位置误差允许多少米，并说明依据。不能因为浮点略有差异就接受任意误差，也不能把所有计算都要求位级相同。"
          ]
        },
        {
          "title": "测试代码也需要正确的程序集",
          "paragraphs": [
            "Edit Mode 测试适合许多纯规则和编辑器环境下的验证，不要求为了一个伤害函数先运行完整游戏。通过 Test Runner 创建模板，再给测试程序集显式引用 Rules。被测规则放在运行或规则程序集，测试文件放在测试程序集，不要将 NUnit 依赖混进最终 Player 代码。",
            "示例的两个文件分别属于规则和测试范围，必须按说明放置。找不到类型时，先检查程序集引用，而不是把两个文件拼成一个含多处 using 的文件。测试能启动，是环境正确的一部分；它实际验证什么，还要继续看输入和断言是否对应需求。"
          ]
        },
        {
          "title": "边界输入比堆很多相似样本更有用",
          "paragraphs": [
            "边界样本可以直接从规则推出来：生命 100、伤害 0 应仍为 100；生命 5、伤害 5 应恰好为 0；生命 5、伤害 8 也应为 0；生命已经为 0 时，再受伤仍应为 0。这四组分别检查零操作、刚好到边界、越过边界和停留在边界，不是随意凑四个数字。负伤害则先由规则说明应拒绝、忽略还是当作治疗，再写对应断言。少量有明确目的的样本，比把许多普通正数机械排列更有解释力。",
            "若负伤害按规则应被拒绝，就检查拒绝行为；若被定义为治疗，则期望应不同。测试不替你决定产品规则，而是把已经明确的规则固定下来。缺陷修复后保留最小重现用例，之后内部实现即使换了算法，只要对外要求不变，测试也应继续有用。"
          ]
        },
        {
          "title": "绿灯的含义必须与测试范围一致",
          "paragraphs": [
            "伤害函数测试全部通过，只能支持有关数值规则的结论，不能证明动画过渡、碰撞层或输入绑定正确。这些需要其他层次验证。反过来，为每个私有字段和每次内部调用都写断言，也可能让无害重构造成大量失败，却没有保护玩家看得到的行为。",
            "本课最终检查测试是否能单独运行、重复运行，以及换顺序运行。若结果取决于前一个用例，说明隔离还没完成。把测试当作清楚的小实验：条件固定、动作明确、结果可解释、失败能定位。维护它的价值在于阻止已经理解的重要错误回来，而不是让报告里用例数量看起来更多。"
          ]
        }
      ],
      "code": {
        "title": "规则与测试分别放在对应程序集",
        "language": "csharp",
        "files": [
          {
            "filename": "HealthMath.cs",
            "source": "// Rules 程序集中的 HealthMath.cs\nusing System;\npublic static class HealthMath\n{\n    public static int AfterDamage(int current, int amount)\n    {\n        if (current < 0 || amount < 0) throw new ArgumentOutOfRangeException();\n        return amount >= current ? 0 : current - amount;\n    }\n}\n\n"
          },
          {
            "filename": "Tests/EditMode/HealthMathTests.cs",
            "source": "// Edit Mode 测试程序集中的 HealthMathTests.cs\nusing NUnit.Framework;\npublic sealed class HealthMathTests\n{\n    [TestCase(100, 20, 80)]\n    [TestCase(10, 99, 0)]\n    [TestCase(0, 0, 0)]\n    public void Damage_RespectsZeroFloor(int hp, int amount, int expected)\n        => Assert.That(HealthMath.AfterDamage(hp, amount), Is.EqualTo(expected));\n    [Test]\n    public void NegativeDamage_IsRejected()\n        => Assert.Throws<System.ArgumentOutOfRangeException>(() => HealthMath.AfterDamage(10, -1));\n}"
          }
        ],
        "explanation": [
          "规则文件和测试文件放在不同程序集。先用 Test Runner 创建测试程序集，再让它引用 Rules，运行对应测试。",
          "断言检查输入对应的行为结果，不要求私有字段名或内部调用顺序固定。先确认错误实现会失败，再验证修复。"
        ]
      },
      "lab": [
        {
          "title": "从缺陷得到回归测试",
          "minutes": 60,
          "steps": [
            "从 Test Runner 创建 Edit Mode 测试程序集，配置对 Rules 的引用，再放入规则测试。",
            "先故意实现 current-amount，使过量伤害产生负数。",
            "运行测试记录失败，再修复零下限。",
            "保留测试作为回归，修改内部实现后再次执行。"
          ],
          "result": "测试确实能区分错误与正确行为。"
        },
        {
          "title": "补充边界而非复制公式",
          "minutes": 60,
          "steps": [
            "在笔记列出零伤害、过量伤害、负输入等边界，先写规则要求，再挑具体输入手算结果。",
            "选择最有价值的五个输入，人工推导结果。",
            "检查用例是否依赖执行顺序或静态残留。",
            "为浮点移动函数设计容差，并说明尺度依据。"
          ],
          "result": "测试集有边界和失败诊断价值。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "普通项目编译时报 NUnit 不存在",
          "cause": "测试脚本放进了产品运行程序集。",
          "fix": "用 Test Runner 创建测试程序集并配置引用。"
        },
        {
          "symptom": "测试全绿仍出现负生命",
          "cause": "用例只检查一个正常输入，或复制了同一个错误公式。",
          "fix": "加入过量伤害与生命不小于零的不变量。"
        }
      ],
      "exercise": {
        "brief": "给存档迁移函数编写正常、重复迁移、未知版本和非法数值四类测试，并故意注入一次错误验证测试有效。",
        "deliverables": [
          "测试用例与手工推导",
          "错误版本失败记录",
          "修复后测试结果"
        ],
        "rubric": [
          {
            "item": "契约与边界明确",
            "points": 30
          },
          {
            "item": "至少四类用例",
            "points": 25
          },
          {
            "item": "能抓住注入错误",
            "points": 30
          },
          {
            "item": "程序集隔离正确",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "测试把被测公式原样复制一遍的风险是？",
          "options": [
            "输入相同，就已经独立验证了结果",
            "可能把实现中的错误也复制到预期里",
            "只有浮点公式才存在这个风险"
          ],
          "answer": 1,
          "explanation": "相同实现方式可能带来相同错误。期望要从已知要求、手算或独立参考得到。"
        },
        {
          "question": "纯函数测试全绿说明物理动画正确吗？",
          "options": [
            "说明，所有组件最终都依赖数值",
            "不说明，两者验证的层次不同",
            "只要用例数量足够多就说明"
          ],
          "answer": 1,
          "explanation": "测试只支持它实际覆盖的条件和行为。数值规则绿灯不能推导引擎协作正确。"
        },
        {
          "question": "最有价值的缺陷回归测试通常是？",
          "options": [
            "能够重现真实缺陷的最小输入与断言",
            "固定所有私有方法的调用顺序",
            "检查每个局部变量必须使用原来的名字"
          ],
          "answer": 0,
          "explanation": "真实缺陷的最小重现用例能明确防止该行为退化；检查实现细节未必具有同样价值。"
        }
      ],
      "references": [
        {
          "label": "Unity Test Framework scripting reference",
          "url": "https://docs.unity3d.com/Packages/com.unity.test-framework@1.6/manual/index.html"
        },
        {
          "label": "Organize scripts into assemblies",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/assembly-definition-files.html"
        }
      ],
      "summary": [
        "测试预期来自要求或独立推导，不能照抄同一个错误公式。",
        "先确认测试能抓住缺陷，再把它留下保护未来修改。"
      ],
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
      "teaching": {
        "question": "生命 5、伤害 8，为什么测试预期应手算成 0，而不是复制函数里的减法？",
        "keyIdea": "测试要依据行为要求独立判断结果。若测试与实现复制同一错误，两者可能一起给出错误答案仍显示通过。",
        "walkthrough": [
          {
            "title": "写出要求",
            "text": "过量伤害不能让生命低于 0，所以输入 5 和 8 时，人工期望为 0。"
          },
          {
            "title": "先运行错误实现",
            "text": "临时只做 5-8，测试得到 -3，应明确失败，并指出期望和实际差异。"
          },
          {
            "title": "修复后保留用例",
            "text": "加入下限处理，再运行得到 0；保留该用例，防止以后重构把缺陷带回来。"
          }
        ],
        "prediction": {
          "question": "纯规则测试全部通过，能证明角色碰撞与动画都正确吗？",
          "answer": "不能。它们验证数值规则，碰撞配置和动画时序需要在适合的 Unity 环境中另做验证。"
        }
      }
    },
    {
      "id": "l080",
      "title": "Play Mode 测试：验证引擎协作与时序",
      "prerequisites": [
        "l079",
        "l035",
        "l050"
      ],
      "goals": [
        "用 UnityTest 等待引擎帧或物理阶段",
        "创建并清理测试拥有的对象",
        "设计不依赖固定帧率的集成断言"
      ],
      "theory": [
        {
          "title": "为什么有些问题必须进入播放环境",
          "paragraphs": [
            "伤害公式可以只用数字验证，但对象销毁、刚体推进和组件回调需要 Unity 引擎参与。Play Mode 测试让测试在相应运行环境里创建对象、等待阶段并检查结果。它不是把普通测试多等几秒，而是让要验证的引擎行为真的有机会发生。",
            "本课从 Destroy 开始。调用它后，当前 C# 方法会继续，实际销毁发生在引擎规定的后续时间。测试如果立即断言“已经完成”，就把请求发出和结果生效混在一起。先说明断言要检查哪一个时刻，再选择与该时刻匹配的等待方式。"
          ]
        },
        {
          "title": "同一个引用，为什么两种空值判断不同",
          "paragraphs": [
            "测试创建对象并保存 obj，调用 Destroy 后先等待示例规定的帧阶段，再分别计算 obj == null 和 ReferenceEquals(obj, null)。引擎原生对象销毁后，第一项可以为 true，因为 Unity 的比较考虑了原生对象是否失效；第二项仍可以为 false，因为 C# 变量还持有包装对象的引用。这不是一个判断错了，而是两个问题的答案不同：“引擎对象还能不能用”和“变量本身有没有引用”。先写出各自检查的内容，结果就不再矛盾。",
            "这不是要求你在业务中到处混用空值工具，而是帮助解释对象的两个层次。测试应写清到底在检查“引擎对象还能不能使用”还是“托管变量是否真的没有引用”。只写一个含糊的“对象为空”，会让等待时机和断言含义都难以审阅。"
          ]
        },
        {
          "title": "等待一帧不等于推进一次物理",
          "paragraphs": [
            "渲染帧和固定物理步并非一一对应，一帧里可能没有物理步，也可能有多个。因此 yield return null 只能按其调度意义理解，不能直接当作“移动正好一个固定步”。移动集成测试应明确物理配置、提交意图的时刻，以及等待到哪个模拟阶段。",
            "位置断言通常还需要合理范围。假设测试速度与等待过程允许少量差异，应检查运动方向和允许误差，而不是用一个过于精确的位置常量掩盖时序假设。时间相关等待还必须有上限：条件一直不成立时应输出有用失败，而不是让整个测试运行永久挂起。"
          ]
        },
        {
          "title": "每个测试只收拾自己创建的内容",
          "paragraphs": [
            "测试创建的 GameObject、订阅和临时设置，都应在结束时恢复，包括断言失败的路径。若修改 Time.timeScale 或固定步长，不恢复就可能让后面的测试以不同条件运行。一次偶然的通过和一组可以重复运行的测试，往往就差在这些清理细节。",
            "不要按名字删除场景里所有同名对象来图省事。测试应保存自己创建对象的引用，只清理自己负责的内容，避免误删其他测试或场景资源。连续运行 10 次，检查对象数、事件次数和全局设置，能帮助发现第一次通过却逐次污染环境的问题。"
          ]
        },
        {
          "title": "把多种验证组合起来，而不是互相替代",
          "paragraphs": [
            "Play Mode 适合检查组件协作、生命阶段和部分输入模拟；Edit Mode 更适合快速验证纯规则；独立 Player 用来检查构建环境；真实设备测试处理焦点、热插拔和平台差异。选择层次时看要验证的问题，不是把所有用例都移到最慢的环境里。",
            "模拟按键能证明软件在指定事件下如何响应，却不能证明真实键盘、手柄或目标平台驱动已经测试。最终报告记录运行环境、完成条件、容差、超时和清理方式。读者应能据此判断绿灯支持什么结论，以及哪些行为还需要另一次独立验证。"
          ]
        }
      ],
      "code": {
        "title": "验证对象销毁跨帧生效",
        "language": "csharp",
        "filename": "ObjectLifetimeTests.cs",
        "source": "// 放入 Test Runner 创建的 Play Mode 测试程序集。\nusing System.Collections;\nusing NUnit.Framework;\nusing UnityEngine;\nusing UnityEngine.TestTools;\n\npublic sealed class ObjectLifetimeTests\n{\n    [UnityTest]\n    public IEnumerator DestroyedObject_IsNullAfterFrame()\n    {\n        var owned = new GameObject(\"OwnedByLifetimeTest\");\n        Object.Destroy(owned);\n        yield return null;\n        Assert.That(owned == null, Is.True);\n        Assert.That(ReferenceEquals(owned, null), Is.False);\n    }\n}",
        "explanation": [
          "配置 Play Mode 测试程序集。示例只创建和销毁自己的对象，结束后检查是否有残留。",
          "等待后分别解释 Unity 空值比较与托管引用比较。它们回答不同问题，不能用其中一种的结果替代另一种。"
        ]
      },
      "lab": [
        {
          "title": "销毁与伪 null",
          "minutes": 60,
          "steps": [
            "配置 Play Mode 测试程序集后运行完整样例，记录创建、Destroy 请求和等待后的断言时刻。",
            "解释两个 null 断言为何可以同时成立。",
            "把断言移到 Destroy 后立即执行并记录不同语义。",
            "连续执行十次，确认无残留测试对象。"
          ],
          "result": "时序与对象身份的断言能被解释。"
        },
        {
          "title": "移动集成测试设计",
          "minutes": 60,
          "steps": [
            "在测试自己创建的对象上配置刚体与零重力，保存原来的时间设置，明确结束时怎样恢复。",
            "提交运动意图，等待明确的物理推进阶段。",
            "用位置范围和超时验证移动，再验证停用后停止。",
            "在失败后检查时间设置、事件和对象都被恢复。"
          ],
          "result": "集成测试有条件、容差、上限和清理。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "本机能过，CI 偶尔失败",
          "cause": "测试依赖固定渲染帧数、未声明的时间设置或残留状态。",
          "fix": "显式环境、完成条件和容差，并清理所有自有状态。"
        },
        {
          "symptom": "某用例失败后后续全部异常",
          "cause": "测试对象或静态订阅在失败路径没有清理。",
          "fix": "使用专用清理钩子，保存并恢复被修改的环境。"
        }
      ],
      "exercise": {
        "brief": "为移动组件写启用移动、停用停止、销毁解除订阅三项集成测试，各自给出超时、容差与清理策略。",
        "deliverables": [
          "三项测试的前置条件",
          "十次重复运行结果",
          "自动验证与人工体验的范围表"
        ],
        "rubric": [
          {
            "item": "等待语义匹配系统",
            "points": 30
          },
          {
            "item": "断言有界且合理",
            "points": 25
          },
          {
            "item": "失败清理完整",
            "points": 30
          },
          {
            "item": "范围说明诚实",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "yield return null 是否保证正好完成一个物理步？",
          "options": [
            "是",
            "否，渲染帧与物理步不是一一对应",
            "仅低帧率时保证"
          ],
          "answer": 1,
          "explanation": "渲染帧和物理固定步并非一一对应；等待必须匹配真正要验证的模拟阶段。"
        },
        {
          "question": "异步测试等待条件应有什么？",
          "options": [
            "无限等待",
            "明确完成条件和最大超时",
            "每次固定等一分钟"
          ],
          "answer": 1,
          "explanation": "明确条件让测试知道何时完成，最大超时则让失败可诊断，避免无限等待。"
        },
        {
          "question": "测试清理应该删除哪些对象？",
          "options": [
            "按名字匹配的所有对象",
            "仅测试明确创建并拥有的对象",
            "整个场景"
          ],
          "answer": 1,
          "explanation": "测试保存并清理自己创建的内容，才能避免按名字删除其他对象或污染后续用例。"
        }
      ],
      "references": [
        {
          "label": "Unity Test Framework scripting reference",
          "url": "https://docs.unity3d.com/Packages/com.unity.test-framework@1.6/manual/index.html"
        },
        {
          "label": "Object.Destroy",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.Destroy.html"
        }
      ],
      "summary": [
        "等待方式要匹配要检查的引擎阶段，一帧不等于一个物理步。",
        "测试写清环境、容差、超时，并在失败时清理自己创建的状态。"
      ],
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
      "teaching": {
        "question": "Destroy 后托管引用还存在，为什么 Unity 的空值判断却可能认为对象已失效？",
        "keyIdea": "Unity 对象包含托管引用和原生对象两层。Play Mode 测试要等待正确阶段，并明确每个断言检查的是哪一层。",
        "walkthrough": [
          {
            "title": "只创建测试对象",
            "text": "测试新建一个 GameObject 并保存引用，不借用场景里已有的角色或服务。"
          },
          {
            "title": "发出销毁请求",
            "text": "调用 Destroy 后按示例等待，让引擎完成对应阶段，再检查对象可用性。"
          },
          {
            "title": "解释两个结果",
            "text": "Unity 空值比较与 ReferenceEquals 检查不同内容；销毁原生对象不代表变量立即没有托管引用。"
          }
        ],
        "prediction": {
          "question": "yield return null 能保证刚体正好前进一步吗？",
          "answer": "不能。它与渲染帧调度有关，物理固定步可能零次或多次；需要按实际验证阶段安排等待。"
        }
      }
    }
  ]
});
