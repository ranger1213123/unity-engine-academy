window.COURSE_MODULES.push({
  "id": "m03",
  "number": 3,
  "title": "MonoBehaviour 生命周期",
  "subtitle": "不背顺序表，理解每个回调的契约",
  "description": "深入初始化、逐帧与固定步调度、启用禁用、销毁、协程启动及跨对象依赖，建立可被日志验证的生命周期模型。",
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
      "id": "l011",
      "title": "Awake、OnEnable、Start：一次性初始化与参与工作",
      "prerequisites": [
        "l010"
      ],
      "goals": [
        "说清 Awake、OnEnable、Start 分别何时调用",
        "区分禁用脚本与关闭整个 GameObject 的结果",
        "用日志验证同一实例重新启用时，哪些回调会重复"
      ],
      "theory": [
        {
          "title": "先认识回调：由 Unity 来调用的函数",
          "paragraphs": [
            "你已经写过 Update：按下 Play 后，它就不断运行，却没有别的脚本每帧主动调用它。这是因为 Unity 会在相应阶段调用特定名称的函数。这样的函数叫作回调。MonoBehaviour 的生命周期，描述的就是脚本实例从初始化、开始更新，到停止工作和销毁的过程。",
            "先只看一个角色。它刚出现时需要找到自己的 Rigidbody2D，开始工作时可能需要监听输入，正式启动后才开始移动。这几件事发生的次数不同：找自身组件通常只需一次，监听则可能在每次启用时重新建立。理解这个差别，才知道代码该放在哪里。",
            "回调的名称和参数必须符合 Unity 的规定。例如把 Awake 写成小写的 awake，C# 代码可能仍能编译，但 Unity 不会将它识别为这个生命周期入口。",
            "创建普通 C# 对象可以使用 new；创建附着于 GameObject 的 MonoBehaviour 则应通过编辑器添加组件、AddComponent 或实例化已有对象。new 一个脚本类不会得到正常挂接的 Unity 组件。也不要主动调用 Awake 或 Start 来“补一次生命周期”：那只是一次普通方法调用，不会重建引擎记录的实例状态；需要重置时应单独定义方法。"
          ]
        },
        {
          "title": "把三个名字对应到三个具体动作",
          "paragraphs": [
            "Awake 适合准备本实例自己的引用和初始状态，例如用 GetComponent 找到刚体。对同一个脚本实例，它只调用一次。OnEnable 发生在脚本进入启用状态、所在对象也在活动层级中时，适合注册事件等需要反复建立的联系。",
            "Start 也只调用一次，但要等组件符合启用条件，并且位于它的第一次 Update 之前。对场景初始就活动的对象，先用 Awake 准备自身数据，再用 Start 启动与其他对象的配合，是常见做法。这里的一次，是“这个实例的一次”，不是“每次勾选框的一次”。"
          ]
        },
        {
          "title": "只取消脚本勾选，与关闭对象有什么区别",
          "paragraphs": [
            "Inspector 中有两个容易混淆的勾选框：GameObject 名称旁的勾选框控制整个对象，脚本组件旁的勾选框控制这个脚本。若对象已在活动层级中，即使脚本最初未启用，初始化时仍会调用 Awake；OnEnable 和 Start 则需要等脚本启用。",
            "如果整个对象一开始就未激活，Awake 要等它第一次进入活动层级时才会发生。父对象未激活也会让子对象不在活动层级，即使子对象自己的勾选框是开的。activeSelf 记录自身设置，activeInHierarchy 反映整个父子层级的结果，enabled 记录组件设置。观察日志时要把三者一起记下。"
          ]
        },
        {
          "title": "重新启用，保留的仍然是原实例",
          "paragraphs": [
            "假设角色已经执行 Start，随后被关闭，再重新打开。字段仍属于同一个脚本实例，所以 Awake 和 Start 不会重跑；OnEnable 则会再次发生。如果你把“每次重生恢复满血”只写在 Start，复用这个角色时就不会恢复，因为没有创建新实例。",
            "这时应明确增加一个重生方法，例如 ResetForSpawn，由负责重生的代码调用；如果规则确实是每次启用都重置，也可以在合适的 OnEnable 流程处理。要先确定什么时候应该重置，而不是看到 Start 没有重复，就把所有初始化一起搬到 OnEnable。"
          ]
        },
        {
          "title": "一个对象的顺序，不能直接推广到所有对象",
          "paragraphs": [
            "本课探针显示的是某个实例的回调。两个对象各有 Awake 时，不要根据 Hierarchy 上下位置或某次日志，推断下次一定谁先运行。A 在自己的 Awake 里读 B 尚未准备的字段，就可能依赖一个没有保证的顺序。第十五课会用明确的初始化调用处理这种情况。",
            "运行中再 Instantiate 新对象，也不会让已经更新过许多帧的旧对象回到初始化阶段。此外，MonoBehaviour 的构造器和字段初始化阶段不适合访问尚未准备好的场景对象；需要读取组件、Inspector 恢复后的配置时，使用对应的生命周期入口。最后请用“四种初始状态”的日志证明自己的结论，并在每条结论旁写出对象和组件的状态。"
          ]
        }
      ],
      "code": {
        "title": "记录Awake、OnEnable与Start的调用",
        "language": "csharp",
        "filename": "InitializationProbe.cs",
        "source": "using UnityEngine;\npublic sealed class InitializationProbe : MonoBehaviour\n{\n    void Log(string phase) => Debug.Log($\"{name} {phase} frame={Time.frameCount}\", this);\n    void Awake() => Log(\"Awake\");\n    void OnEnable() => Log(\"OnEnable\");\n    void Start() => Log(\"Start\");\n    void OnDisable() => Log(\"OnDisable\");\n}",
        "explanation": [
          "把脚本分别挂到四个空对象：对象活动且脚本启用、对象活动但脚本禁用、对象自身未激活、对象的父节点未激活。给对象取不同名字，方便区分日志。",
          "Console 关闭 Collapse，避免同类日志被折叠。每一行带有对象名、阶段名和帧号；先按对象归组，再数 Awake、Start 与 OnEnable 各出现几次。"
        ]
      },
      "lab": [
        {
          "title": "比较对象与组件的四种初始状态",
          "minutes": 60,
          "steps": [
            "创建四个挂有探针的空对象，按代码说明设置状态。按 Play 前，先预测每个对象会打印哪些回调。",
            "进入播放后，依次启用脚本、激活对象或激活父对象。每次操作前清楚记下对象状态，保存这一轮日志。",
            "让所有对象都更新过至少一帧，再分别禁用和启用脚本。统计各自的 Awake、Start 和 OnEnable 次数，解释为什么不同。"
          ],
          "result": "重新启用同一实例会重复 OnEnable；Awake、Start 不会因为重新勾选而重复。尚未执行过 Start 的实例要另行判断。"
        },
        {
          "title": "把同一个探针放到运行时创建的对象上",
          "minutes": 60,
          "steps": [
            "将活动的探针对象保存为 Prefab，再制作一个最初未激活的版本，注意记录 Prefab 自身的活动状态。",
            "在简单生成脚本中分别 Instantiate 两个版本，在调用前后打印标记。之后激活未激活的实例，比较日志出现在哪一步。",
            "让另一个探针始终运行，记录生成时的帧号。说明为什么旧对象已经执行过 Update，新对象却才开始 Awake。"
          ],
          "result": "回调围绕每个实例自己的初始化发生，运行中新建对象不会让整场游戏重新初始化。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "同一个角色重新出现，却没有恢复满血",
          "cause": "角色只是重新启用，Start 已经在上次使用时执行过。",
          "fix": "先确认重生是否创建了新实例，再让重生流程明确调用重置方法；不要依赖 Start 重复执行。"
        },
        {
          "symptom": "A 的 Awake 读到了 B 尚未赋值的字段",
          "cause": "两个对象都在 Awake 准备数据，A 却假定 B 一定先完成。",
          "fix": "让各自先完成自身准备，再由明确的初始化调用连接两者。第十五课给出具体做法。"
        }
      ],
      "exercise": {
        "brief": "创建四种初始状态的对象，再加入运行时生成的版本。记录各次操作与回调次数，解释哪些结论只针对当前状态成立。",
        "deliverables": [
          "对象活动状态与脚本启用状态的对照表",
          "场景、完整日志和每次操作记录",
          "五条写明条件的生命周期结论"
        ],
        "rubric": [
          {
            "item": "inactive 与 disabled 区分正确",
            "points": 25
          },
          {
            "item": "一次性与重复周期区分正确",
            "points": 25
          },
          {
            "item": "运行时生成被覆盖",
            "points": 25
          },
          {
            "item": "未宣称不保证的顺序",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "对象从一开始就在活动层级中，但脚本未启用。初始化时会调用它的 Awake 吗？",
          "options": [
            "会，Awake 不要求这个脚本的 enabled 为 true",
            "不会，要等 OnEnable 先执行",
            "不会，要等第一次 Update 后执行",
            "只要父对象未激活也一定立即执行"
          ],
          "answer": 0,
          "explanation": "本题已明确对象处于活动层级。组件的 enabled 决定是否启用，但不会阻止这个条件下的 Awake。若整个对象未激活，需另行判断。"
        },
        {
          "question": "角色已执行过 Start，禁用后重新启用同一个脚本，会再次执行 Start 吗？",
          "options": [
            "会，每次 OnEnable 后都执行",
            "不会，同一实例的 Start 只调用一次",
            "会，只要禁用时间超过一帧",
            "不会，因为 OnEnable 也不会再执行"
          ],
          "answer": 1,
          "explanation": "实例已经执行过 Start，再次启用只会进入新的启用过程。OnEnable 可以重复，Start 不会重复。"
        },
        {
          "question": "A 必须使用 B 初始化后的数据，怎样安排更可靠？",
          "options": [
            "把 B 拖到 Hierarchy 最上面",
            "根据上一次日志假定 B 先执行",
            "明确先准备 B，再把准备好的数据交给 A",
            "让 A 随机等待一帧，不检查 B 的状态"
          ],
          "answer": 2,
          "explanation": "把依赖写成明确的准备和传递步骤，才能说明 A 为什么此时可以读取。Hierarchy 排列和一次运行的顺序都不能提供这个保证。"
        }
      ],
      "references": [
        {
          "label": "MonoBehaviour.Awake",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.Awake.html"
        },
        {
          "label": "MonoBehaviour.Start",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.Start.html"
        },
        {
          "label": "Event function execution order",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/execution-order.html"
        }
      ],
      "summary": [
        "同一个实例从创建到重新启用，Awake、OnEnable、Start 分别执行几次？请说明初始状态。",
        "如果需要每次重生都恢复数据，为什么不能只放在 Start 中？"
      ],
      "teaching": {
        "question": "把角色脚本取消勾选，再勾回来，为什么 OnEnable 又执行了，Start 却没有？",
        "keyIdea": "先分清“创建了一个新实例”和“重新启用原来的实例”。Awake 和 Start 各自只会在符合条件时执行一次，OnEnable 则会随着启用反复执行。",
        "walkthrough": [
          {
            "title": "第一次进入播放模式",
            "text": "角色对象处于活动状态，脚本也已启用。Unity 先调用 Awake、OnEnable，再在第一次 Update 前调用 Start。"
          },
          {
            "title": "暂时禁用脚本",
            "text": "取消脚本组件左侧的勾选框，会调用 OnDisable。角色和脚本实例仍然存在，字段中保存的数据也不会因此自动清空。"
          },
          {
            "title": "重新启用原来的脚本",
            "text": "再次勾选后会调用 OnEnable。因为这个实例已经执行过 Start，所以后续帧继续更新，不会重新执行 Start。"
          }
        ],
        "prediction": {
          "question": "如果在 Start 尚未执行时就禁用脚本，之后再启用同一个实例，Start 会不会执行？",
          "answer": "会在之后满足启用条件、第一次 Update 之前执行。题目明确这个实例还没执行过 Start；仅说“第一次 Update 之前禁用”不够，因为 Start 可能已经执行。关键是此前是否执行过 Start，而不是已经勾选过几次。"
        },
        "comparison": {
          "caption": "同一个实例首次初始化时，分别检查对象活动状态与组件启用状态",
          "headers": [
            "初始条件",
            "Awake",
            "OnEnable",
            "Start"
          ],
          "rows": [
            [
              "对象活动、脚本启用",
              "初始化时调用",
              "初始化时调用",
              "第一次Update前调用"
            ],
            [
              "对象活动、脚本禁用",
              "初始化时调用",
              "等到组件启用",
              "启用后、第一次Update前调用"
            ],
            [
              "对象自身或父对象未激活",
              "等首次进入活动层级",
              "对象进入活动层级且组件启用时调用",
              "符合条件后、第一次Update前调用"
            ]
          ]
        }
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
      "id": "l012",
      "title": "Update、FixedUpdate、LateUpdate：一帧里有几种时间",
      "prerequisites": [
        "l011"
      ],
      "goals": [
        "用具体时间间隔推算一帧中可能出现的固定步数量",
        "为输入记录、刚体运动和相机跟随选择合适阶段",
        "区分速度与位移，解释何时需要乘时间"
      ],
      "theory": [
        {
          "title": "先把“帧”和“步”分别数出来",
          "paragraphs": [
            "一帧可以理解为画面更新的一轮。Update 通常在启用组件的每个渲染帧调用一次，帧与帧之间的实际间隔会变：简单场景可能快，复杂画面可能慢。固定步则按设定的游戏时间间隔推进，常见默认值 fixedDeltaTime=0.02 秒，也就是计划每个游戏秒推进50步。",
            "为什么另设一种节奏？物理系统需要根据时间计算运动和接触，固定步让每次模拟处理相同长度的游戏时间。在默认自动物理模拟模式下，相应的 FixedUpdate 发生在该步物理计算之前。它仍是引擎安排执行的阶段，并不是后台有一条线程每隔真实20毫秒精确叫醒你的脚本。"
          ]
        },
        {
          "title": "用前两帧算出“这一帧没有固定步”",
          "paragraphs": [
            "先做简化推导：timeScale=1，画面稳定60 FPS，每帧约1/60秒，即16.7毫秒；固定步长20毫秒。假设起始累积时间为0，第一帧还凑不满一步。第二帧总计约33.3毫秒，可以处理20毫秒，留下约13.3毫秒继续积累。",
            "这说明“每个 Update 都应对应一个 FixedUpdate”本来就不成立。画面变慢后，一帧可能需要处理多个固定步。真实运行的起始时间、帧耗时和补步上限会影响具体排列，所以这组数字解释的是累积关系，不能要求编辑器日志逐帧完全复制。遇到严重卡顿，也不能简单假定会无限补齐所有步。",
            "还要区分“真实卡了多久”和“引擎随后补多少游戏时间”。Time.maximumDeltaTime 会限制长帧后 deltaTime 的增长及固定步追赶范围，避免补步又把下一帧拖慢。因此真实停顿1秒，不一定在下帧看到相当于1秒的全部物理步；测量时应同时记录非缩放经过时间、游戏时间和该上限，而不是只数 FixedUpdate。"
          ]
        },
        {
          "title": "让数据在合适的时机被使用",
          "paragraphs": [
            "以常见的动态输入更新模式为例，Update 可以读取并保存最近的移动方向，FixedUpdate 使用这份记录设置刚体运动。注意，这并不表示同一帧里总是先读输入再算物理；固定步可能使用上一次已经保存的数据。这样做的目的，是把“收到输入”和“进行运动计算”连接起来。",
            "持续方向可以被多个固定步重复使用。一次跳跃请求却要单独保存并在处理后清除，否则可能因为这一帧没有固定步而漏掉，或在补做多个步时跳多次。Input System 的更新模式可以调整，具体项目需要核对配置；第六章会把这些保存与处理规则写成完整输入代码。"
          ]
        },
        {
          "title": "LateUpdate 为什么常用来跟随角色",
          "paragraphs": [
            "如果角色在 Update 改变位置，相机也在 Update 读取它的位置，就要面对两个脚本谁先运行的问题。把相机跟随放到 LateUpdate，可以让它读取本轮 Update 之后的结果。这里解决的是两个阶段之间的先后关系。",
            "如果两个相机脚本都在 LateUpdate 写同一个位置，问题仍然存在：阶段相同不代表实例顺序已确定。刚体插值、动画更新也各有自己的时机，因此“相机放 LateUpdate”是有条件的常用安排。调试时应先说明目标由谁移动，再检查相机实际读取的是哪次更新的状态。"
          ]
        },
        {
          "title": "乘不乘时间，先看接口接收什么",
          "paragraphs": [
            "设速度为5单位/秒，一帧经过0.02秒，该帧位移就是5×0.02=0.1单位。直接修改 Transform 的位置时，需要把算出的位移加上去。若每帧固定加0.1，60 FPS就走6单位/秒，30 FPS却只走3单位/秒。帧率越低，移动反而越慢。",
            "Rigidbody.linearVelocity 接收的已经是速度，应直接赋5单位/秒对应的向量；再乘0.02，会错误地把速度缩成0.1。AddForce 又有不同的输入含义，后面会按 ForceMode 分别推导。完成本课探针时，分别记录帧号、固定步次数和实际时间，再用单位检查每一条移动语句，才能同时解释调用时机与运动结果。"
          ]
        }
      ],
      "code": {
        "title": "观察每帧固定步数量",
        "language": "csharp",
        "filename": "LoopPhaseProbe.cs",
        "source": "using UnityEngine;\npublic sealed class LoopPhaseProbe : MonoBehaviour\n{\n    int fixedSteps;\n    int previous;\n    void FixedUpdate() => fixedSteps++;\n    void Update()\n    {\n        if (Time.frameCount < 20)\n            Debug.Log($\"Update frame={Time.frameCount}, stepsSinceLast={fixedSteps - previous}\", this);\n        previous = fixedSteps;\n    }\n    void LateUpdate()\n    {\n        if (Time.frameCount < 20) Debug.Log($\"Late frame={Time.frameCount}, totalFixed={fixedSteps}\", this);\n    }\n}",
        "explanation": [
          "挂到空场景中的空对象。fixedSteps 每次 FixedUpdate 增加1；Update 用它减去上次记录，得到两次 Update 之间共发生了几个固定步。",
          "Time.frameCount 表示渲染帧号。代码只打印前20帧，避免日志过多干扰运行；按帧号整理结果，分别查看 Update 与 LateUpdate 的位置。"
        ]
      },
      "lab": [
        {
          "title": "按帧号统计固定步",
          "minutes": 60,
          "steps": [
            "在 Project Settings → Time 确认 Fixed Timestep 为0.02。将探针挂到空对象，运行并保存前20帧日志。",
            "按同一个 frame 值整理 Update、LateUpdate 与 stepsSinceLast。解释出现0或大于1时，各代表什么。",
            "改变目标帧率或固定步长后重新运行，只改一个条件。记录实际帧耗时；目标帧率不一定就是实际帧率。"
          ],
          "result": "固定步次数可以在不同帧之间变化；LateUpdate 所在阶段晚于本轮 Update。"
        },
        {
          "title": "用单位解释两种移动结果",
          "minutes": 60,
          "steps": [
            "创建两个无刚体的空对象，分别使用“每帧移动0.1单位”和“每秒5单位乘deltaTime得到本帧位移”的写法。",
            "在不同实际帧率下比较相同时间内的移动距离。将预测距离、实际距离和测量时间放在同一张表里。",
            "画出“保存输入方向→固定步读取→运动计算→相机跟随”的流程，标明持续方向与一次跳跃请求的不同处理方式。"
          ],
          "result": "以每帧常量移动会依赖帧率；速度换算位移才需要乘时间，接口本身接收速度时不应再次换算。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "画面帧率降低后，角色移动也明显变慢",
          "cause": "每帧加了固定距离，相同时间内的调用次数减少。",
          "fix": "先写出期望的每秒速度，再按实际时间换算位移；若使用刚体速度接口，直接传速度。"
        },
        {
          "symptom": "某一帧没有 FixedUpdate，被误判为脚本没有运行",
          "cause": "这段时间还不够一个固定步，或时间与模拟设置使固定步没有推进。",
          "fix": "同时查看帧号、固定步计数、fixedDeltaTime 和 timeScale，按累积时间解释观察。"
        }
      ],
      "exercise": {
        "brief": "先手算一组10帧时间序列可能对应的固定步，再记录真实运行作比较；另外制作两个无刚体移动对象，解释帧率改变时谁会变慢。",
        "deliverables": [
          "写明起始累积量与步长的手算表，以及实际计数表",
          "速度换算位移的算式与单位",
          "输入记录、物理更新和相机跟随的流程图"
        ],
        "rubric": [
          {
            "item": "固定步计数正确",
            "points": 25
          },
          {
            "item": "没有线程或硬实时误解",
            "points": 25
          },
          {
            "item": "移动单位正确",
            "points": 25
          },
          {
            "item": "采样与消费区分明确",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "同一个渲染帧里，启用脚本的 FixedUpdate 可能调用几次？",
          "options": [
            "每帧固定一次",
            "可能零次、一次或多次",
            "只要帧率更高就一定更多次",
            "必定等于这一帧的输入事件数"
          ],
          "answer": 1,
          "explanation": "固定步按累积的游戏时间安排。画面帧的长度与固定步长不同，次数自然不必一一对应。"
        },
        {
          "question": "要把刚体速度设为5单位/秒，使用 linearVelocity 时通常怎样做？",
          "options": [
            "直接传入大小为5的速度向量",
            "先乘deltaTime，得到本步位移再传入",
            "先除以当前帧率两次",
            "同时每帧用Transform再移动一次"
          ],
          "answer": 0,
          "explanation": "linearVelocity 接收速度。乘时间后得到的是位移，已不是这个接口所要表达的数值。"
        },
        {
          "question": "把相机跟随放在 LateUpdate，自动保证了什么？",
          "options": [
            "所有相机脚本都按对象名排序",
            "任何动画与插值都已完成最终显示",
            "它处在 Update 之后的阶段，但同阶段实例顺序仍需另外判断",
            "目标即使从未移动也会自动平滑"
          ],
          "answer": 2,
          "explanation": "LateUpdate 提供的是阶段关系，不能代替所有脚本之间的依赖安排，也不会自动添加平滑效果。"
        }
      ],
      "references": [
        {
          "label": "MonoBehaviour.FixedUpdate",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.FixedUpdate.html"
        },
        {
          "label": "MonoBehaviour.LateUpdate",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.LateUpdate.html"
        },
        {
          "label": "Event function execution order",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/execution-order.html"
        },
        {
          "label": "Time.maximumDeltaTime",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-maximumDeltaTime.html"
        }
      ],
      "summary": [
        "固定步长20毫秒、每帧约16.7毫秒时，为什么有的帧可以没有FixedUpdate？",
        "分别修改Transform.position和Rigidbody.linearVelocity时，为什么不能照抄同一个乘时间的公式？"
      ],
      "teaching": {
        "question": "画面每秒更新 60 次，物理每秒计划推进 50 步，那么每帧会调用几次 FixedUpdate？",
        "keyIdea": "画面帧与固定物理步使用不同的节奏。Unity 会根据累积的游戏时间安排固定步，因此一帧中可能没有 FixedUpdate，也可能有一次或多次。",
        "walkthrough": [
          {
            "title": "写出两种间隔",
            "text": "在这个简化例子中 timeScale=1，每个画面帧约16.7毫秒，固定步长为20毫秒，初始没有尚未处理的累积时间。"
          },
          {
            "title": "累积前两帧的时间",
            "text": "第一帧约16.7毫秒，不足一步；第二帧累计约33.3毫秒，可以推进一个20毫秒固定步，余下约13.3毫秒。"
          },
          {
            "title": "改变画面帧率再推导",
            "text": "若每帧改为约33.3毫秒，部分帧便要推进两步。实际次数还受起始累积量、时间设置及卡顿补步限制影响。"
          }
        ],
        "prediction": {
          "question": "画面仍在刷新，但 timeScale 设为0，普通自动固定步还会按原来频率推进吗？",
          "answer": "不会。在通常的自动模拟设置下，缩放后的游戏时间不再前进，普通 FixedUpdate 也不再推进；Update 仍可以继续调用，因此暂停菜单仍能处理界面。"
        }
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
      "id": "l013",
      "title": "OnDisable、OnDestroy 与暂停退出：清理不等于存档",
      "prerequisites": [
        "l012"
      ],
      "goals": [
        "解释禁用、关闭对象和销毁对实例分别意味着什么",
        "让同一份注册只获得一次、释放一次",
        "说明正常退出与系统直接终止为何需要不同的保存策略"
      ],
      "theory": [
        {
          "title": "先问：这个角色还在不在",
          "paragraphs": [
            "取消脚本的 enabled，常见结果是它不再执行普通 Update，但脚本实例和字段仍在。关闭 GameObject 会让整个对象不再处于活动层级，同样不等于删除对象。如果调用 Destroy，请求的是结束相应引擎对象的寿命。暂停工作和永久退出，应该分别判断。",
            "OnDisable 常发生在原本启用的脚本被禁用、对象失活或进入销毁流程时。编辑器脚本重载也可能产生相关回调，所以实验要记录当前是在编辑器还是独立 Player。OnDestroy 对应销毁，但有一个重要前提：对象曾经处于活动状态。从未激活便被销毁的对象，不能靠它完成唯一清理。"
          ]
        },
        {
          "title": "先获得什么，就安排好在哪里释放",
          "paragraphs": [
            "假设血条每次启用时订阅角色的生命变化事件。如果禁用后还保留订阅，它虽然不执行 Update，却仍可能收到发布者的事件调用。若下次启用又订阅一次，同一条通知还可能处理两遍。因此，在 OnEnable 建立的这条联系，通常要在 OnDisable 中解除。",
            "另一些资源需要保留到实例最终结束，例如组件自己创建并长期使用的资源副本。它们不一定每次禁用都释放。可以列一张小表，逐项写出谁创建、谁使用、什么时候不再需要、由谁释放。这就是本书所说的资源所有权；含义是明确责任，并不是给资源加上某种神秘的引擎标记。"
          ]
        },
        {
          "title": "让重复清理仍然安全",
          "paragraphs": [
            "本课示例故意让 OnDisable、OnDestroy 都调用 Release。第一次 Release 看到 registered=true，把它设为false并打印释放日志；第二次看到false就返回。这样无论调用几次，已经释放的注册都不会再释放。这种“重复执行不增加额外影响”的性质叫作幂等。",
            "实际资源应同样保存可判断的状态：例如释放后清空自己保存的句柄，取消订阅时使用原来的发布者和处理函数。不能用“把所有异常吞掉”代替正确状态，因为重复归还可能已经改变了池的计数。示例中的布尔值只是说明控制过程，并没有真正申请一份引擎资源。"
          ]
        },
        {
          "title": "Destroy 之后，当前方法还会往下运行",
          "paragraphs": [
            "执行 Destroy(gameObject) 是向引擎提出销毁请求，不是立即跳出当前 C# 方法。若这一行后面还有发奖励、订阅事件等代码，它们仍可能执行。确定对象已不该继续工作时，应自己 return 或改变状态，阻止后续逻辑。",
            "销毁也不会自动从你维护的所有列表和字段里删掉引用。外部系统需要在适当时机取消登记，或在使用前确认目标仍有效。不要为了追求“立即”而把常规运行代码统一换成 DestroyImmediate；它有不同用途和行为，不能直接当成 Destroy 的修正版。",
            "销毁的目标也必须看清。Destroy(this) 请求销毁当前脚本组件，GameObject 上的 Renderer、Collider 等其他组件仍可能继续存在；Destroy(gameObject) 才是请求销毁整个对象及其组件，并影响子对象。用同一个带显示的 Cube 分别测试这两行，就能区分“脚本停止了”与“角色对象被删除了”，也能解释为什么只有前一种操作后画面仍然存在。"
          ]
        },
        {
          "title": "退出回调，不能承担唯一一次重要存档",
          "paragraphs": [
            "正常关闭桌面程序时可能有机会收到退出通知，但移动应用被系统回收、进程被直接结束时，最后一段 C# 代码未必有机会运行。因此，将整局唯一的存档放在 OnDestroy 或 OnApplicationQuit 中，会留下真实的丢失窗口。换一个回调名字不能让突然终止变得可靠。",
            "更合理的起点是确定可以接受损失多少进度。例如完成关卡、获得重要奖励时保存，暂停或失焦时再补充处理，而不是每帧写磁盘。编辑器切到别的窗口，只能说明该次失焦观察；要了解手机进入后台或强制终止的结果，还需在目标平台构建后验证。实验记录应明确区分已经观察到的结果和尚未执行的测试。"
          ]
        }
      ],
      "code": {
        "title": "让释放函数重复调用时仍只清理一次",
        "language": "csharp",
        "filename": "RegistrationProbe.cs",
        "source": "using UnityEngine;\npublic sealed class RegistrationProbe : MonoBehaviour\n{\n    bool registered;\n    void OnEnable()\n    {\n        if (registered) return;\n        registered = true;\n        Debug.Log(\"Acquire registration\", this);\n    }\n    void OnDisable() => Release();\n    void OnDestroy() => Release();\n    void Release()\n    {\n        if (!registered) return;\n        registered = false;\n        Debug.Log(\"Release registration\", this);\n    }\n}",
        "explanation": [
          "registered 表示本次是否已有注册。OnEnable 设置它；Release 在清理前先将它清除，使第二次调用可以直接返回。",
          "先禁用组件，再销毁对象，观察 Acquire 与 Release 的实际输出次数。这个例子使用日志代替真正的申请与释放，重点是看清两条退出路径怎样汇合。"
        ]
      },
      "lab": [
        {
          "title": "观察暂时停用与永久销毁",
          "minutes": 60,
          "steps": [
            "挂载示例，运行后记录一次 Acquire。取消脚本勾选，记录 Release；再勾选，检查是否建立新的一次注册。",
            "分别从全新运行开始测试关闭GameObject和Destroy。保留对象名字、操作步骤和日志，不把不同运行的结果混在一起。",
            "在已经禁用后再销毁对象，核对实际Release次数。逐句说明为什么第二次进入清理函数没有再次归还。"
          ],
          "result": "对象可以经历多次启用；每次注册有对应释放，而重复的退出路径不会多归还一次。"
        },
        {
          "title": "检查场景退出与应用退出",
          "minutes": 60,
          "steps": [
            "准备两个已保存并加入构建列表的简单场景，让第一个场景中的探针随场景切换退出，保存它的生命周期日志。",
            "增加暂停、失焦和退出日志，在编辑器中测试能实际触发的情况；给这些结果明确标上“编辑器观察”。",
            "列出目标平台的正常退出、后台停留和强制终止测试，记录重要存档发生在哪个检查点，以及哪些路径尚未执行。"
          ],
          "result": "清理回调与保存策略各有用途；编辑器中的一次成功保存不能证明所有终止情况都可靠。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "角色先关闭再销毁，同一个资源被归还两次",
          "cause": "两个回调都直接执行释放，却没有记录这份资源是否已经释放。",
          "fix": "统一进入可重复调用的释放方法，只有仍持有资源时才实际归还，并立即更新状态。"
        },
        {
          "symptom": "正常退出能保存，系统直接关闭后却丢失进度",
          "cause": "重要数据直到退出回调才提交，突然终止时回调没有机会运行。",
          "fix": "在重要进度检查点及时保存，并单独验证目标平台的后台与终止行为。"
        }
      ],
      "exercise": {
        "brief": "为一个带事件订阅和倒计时的可复用对象，分别规定启用、停用、归还和销毁时做什么。验证先停用再销毁，也不会重复清理。",
        "deliverables": [
          "每条联系或资源由谁建立、何时结束的说明",
          "正常结束与中途退出的日志",
          "重要数据何时保存，以及目标平台还要测试什么"
        ],
        "rubric": [
          {
            "item": "清理与获得边界对应",
            "points": 25
          },
          {
            "item": "重复释放安全",
            "points": 25
          },
          {
            "item": "禁用与销毁语义正确",
            "points": 25
          },
          {
            "item": "未依赖不可靠退出保存",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "一个已启用的脚本被设置为enabled=false，OnDisable表示什么？",
          "options": [
            "这次启用过程结束，但实例不一定销毁",
            "这个GameObject已经从内存永久删除",
            "所有字段已自动恢复初始值",
            "只要没有调用Destroy就不会发生OnDisable"
          ],
          "answer": 0,
          "explanation": "禁用会结束这次启用过程，字段与实例通常仍然保留。销毁是另一种结束方式，两者不能混为同一个动作。"
        },
        {
          "question": "唯一一次重要存档放在OnDestroy，能保证覆盖系统直接终止程序吗？",
          "options": [
            "能，所有终止都会先让脚本运行完",
            "不能，应在重要检查点及时保存",
            "能，只要释放函数可以重复调用",
            "能，改成OnApplicationQuit就覆盖所有情况"
          ],
          "answer": 1,
          "explanation": "系统直接终止进程时，退出或销毁回调不一定被执行。幂等清理解决的是重复操作，也不能保证代码获得执行机会。"
        },
        {
          "question": "同一份注册先经OnDisable再经OnDestroy处理，怎样实现幂等释放？",
          "options": [
            "每次都再减少一次注册计数",
            "只捕获错误，保留原来的注册状态",
            "仍持有时才释放，并立即标记为已释放",
            "第二次调用时直接重新注册"
          ],
          "answer": 2,
          "explanation": "第一次改变真实状态，后续调用看到已经释放便安全返回。这样多条退出路径可以使用同一个方法。"
        }
      ],
      "references": [
        {
          "label": "MonoBehaviour.OnDestroy",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnDestroy.html"
        },
        {
          "label": "MonoBehaviour.OnDisable",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnDisable.html"
        },
        {
          "label": "Object.Destroy",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.Destroy.html"
        }
      ],
      "summary": [
        "同一个对象先禁用再销毁时，怎样证明没有重复释放？",
        "如果最后一次退出通知没有发生，哪些重要进度仍应该已经保存？"
      ],
      "teaching": {
        "question": "禁用角色后又销毁它，清理函数被调用两次。怎样避免同一份资源被归还两次？",
        "keyIdea": "禁用表示暂停这段组件行为，销毁表示实例结束。两条路径可能先后发生，因此公共清理函数需要记录资源是否仍由自己持有，重复调用时安全返回。",
        "walkthrough": [
          {
            "title": "先记录获得状态",
            "text": "OnEnable 将 registered 设为true，表示本次已建立注册。示例只打印日志，实际项目中这里可以对应一次事件订阅。"
          },
          {
            "title": "禁用时归还一次",
            "text": "OnDisable 调用 Release。它发现 registered 为true，就先改为false，再执行这次需要的清理。"
          },
          {
            "title": "销毁时再次检查",
            "text": "OnDestroy 也调用 Release，但标记已经是false，于是直接返回。两个清理入口最终只执行了一次实际归还。"
          }
        ],
        "prediction": {
          "question": "从未激活过的 GameObject 被销毁，能否把唯一的清理工作都托付给 OnDestroy？",
          "answer": "不能。官方说明 OnDestroy 只会对曾经处于活动状态的 GameObject 调用。需要在其他地方获得资源时，也在那里规定可靠的释放路径，不能假定所有对象都会收到这个回调。"
        }
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
      "id": "l014",
      "title": "协程与组件寿命：Start 可以等待，Awake 不可以",
      "prerequisites": [
        "l013"
      ],
      "goals": [
        "沿着第一次yield解释协程什么时候执行、什么时候等待",
        "预测禁用脚本和关闭GameObject对协程的不同影响",
        "保存并停止正确的任务，避免反复启用后出现重复循环"
      ],
      "theory": [
        {
          "title": "先看一个会暂停、再继续的方法",
          "paragraphs": [
            "普通方法通常从入口一路执行到返回。协程允许执行到某个位置先把控制权交回Unity，等条件满足后再继续。ReportLoop中的yield return new WaitForSeconds(1f)就是一个等待点；方法等待时，引擎仍能处理下一帧的其他工作。",
            "暂停后还能继续，是因为迭代器保存了执行位置和局部状态。调用StartCoroutine会推进这段代码，直到遇到第一次等待。因此示例第一次Tick会在启动时打印，而不是先等待一秒。之后的WaitForSeconds使用缩放后的游戏时间，恢复也受帧边界影响，不能把日志间隔当作精准的墙上时钟。",
            "等待条件也要分开看：yield return null通常让流程到下一帧再继续，等待一秒则按相应时间条件恢复。把前者误当作等待一秒，日志频率就会完全不同。",
            "这里有一个容易跳过的 C# 步骤：仅调用 ReportLoop() 得到 IEnumerator，并不等于已经执行循环体；它先创建保存进度的迭代器。StartCoroutine 才开始推进这个迭代器。先写 routine=ReportLoop()，再在下一行调用 StartCoroutine(routine)，分别放日志或断点，就能分清“取得一份流程”和“实际开始执行”。"
          ]
        },
        {
          "title": "协程没有自动得到另一条计算线程",
          "paragraphs": [
            "等待能把一段流程分散到多帧，不代表计算自动搬到了后台。如果在第一个yield之前写一个耗时两秒的大循环，这两秒内主线程仍在忙，画面仍可能卡住。把方法返回类型改成IEnumerator，本身不会让计算更快。",
            "判断一个协程时，可以先在纸上画出等待点：第一次等待前做什么，恢复后做什么，期间是否需要保存某些结果。需要把大批计算分到多个帧时，还必须主动划分每批工作量。需要并行计算时，则应学习后续章节对应的工具，不能只靠协程这个名字推断执行线程。"
          ]
        },
        {
          "title": "Start可以等待，但等待完成不等于挡住其他Update",
          "paragraphs": [
            "Start可以写成返回IEnumerator的协程，让一次性启动包含等待。Awake和OnEnable不支持直接按这种方式作为协程回调。若想在OnEnable启动等待流程，像示例一样明确调用StartCoroutine即可，并保存需要停止的任务。",
            "还要注意Start中的等待范围。若它先yield，再读取资源，其他对象和本对象的后续更新并不会因此全部等它完成。需要资源才能工作的Update，应检查自己定义的ready状态。Start的启动时机和整段异步准备何时结束，是两个需要分别判断的问题。"
          ]
        },
        {
          "title": "禁用脚本、关闭对象、停止任务分别看",
          "paragraphs": [
            "仅设置脚本enabled=false，不会自动停止它已经运行的协程。把挂载的GameObject设为未激活，或销毁相应MonoBehaviour，则会停止相关协程。对象重新激活后，被停止的那段流程不会自动从原等待点继续。",
            "这解释了常见故障：每次OnEnable都启动循环，却没有在OnDisable停止；取消组件勾选时旧循环还在，再勾选就出现新旧两份。本课示例在OnDisable明确停止，表达的是“只在本次启用期间运行”。如果要暂停后保留进度，应把进度单独存到字段，重新启动时根据它决定下一步。"
          ]
        },
        {
          "title": "停止时要找到当初启动的那个任务",
          "paragraphs": [
            "StartCoroutine返回的Coroutine可以作为停止任务的句柄。示例把它存到task，停止时原样传回，再清空字段。若重新调用ReportLoop()创建一个新迭代器，不能把这个新对象当成旧任务的身份。StopAllCoroutines也只影响当前MonoBehaviour上的协程，还可能误停同组件内其他工作。",
            "最后，等待期间目标可能被销毁，场景可能切换。同一个池中对象甚至可能已经被重新拿去使用；它还存在，也不代表旧请求仍有效。恢复后要重新确认目标和这一轮任务是否有效，或在结束使用时主动取消。需要释放的外部资源也要另有清理入口，不能把唯一的归还写在可能永远走不到的协程末尾。"
          ]
        }
      ],
      "code": {
        "title": "启用时启动循环，停用时明确停止",
        "language": "csharp",
        "filename": "CoroutineLifetimeProbe.cs",
        "source": "using System.Collections;\nusing UnityEngine;\npublic sealed class CoroutineLifetimeProbe : MonoBehaviour\n{\n    Coroutine task;\n    void OnEnable() => task = StartCoroutine(ReportLoop());\n    void OnDisable()\n    {\n        if (task != null) StopCoroutine(task);\n        task = null;\n    }\n    IEnumerator ReportLoop()\n    {\n        while (true)\n        {\n            Debug.Log($\"Tick {name}\", this);\n            yield return new WaitForSeconds(1f);\n        }\n    }\n}",
        "explanation": [
          "OnEnable启动循环，并用task保存它的句柄。循环先打印，再等待；WaitForSeconds受timeScale影响，不能拿它做精确的实时秒表。",
          "OnDisable显式停止task，再将其清空。这个动作保证了示例的设计目标：组件禁用后不再继续打印，再启用时只创建一个新循环。"
        ]
      },
      "lab": [
        {
          "title": "分别验证引擎默认规则与主动停止",
          "minutes": 60,
          "steps": [
            "先运行原示例，确认禁用脚本后日志停止。然后在实验副本中暂时移除OnDisable内的StopCoroutine调用，其他逻辑保持一致。",
            "分别取消脚本勾选和关闭GameObject。两次从干净运行开始，记录哪个操作后循环仍然输出，哪个停止。",
            "恢复完整的OnDisable代码，再重复两种操作。解释这次结果中哪些来自引擎默认行为，哪些来自你主动写下的停止逻辑。"
          ],
          "result": "仅禁用组件不会默认停止已有协程；示例通过显式清理，让它按预期随组件停用结束。"
        },
        {
          "title": "检查重复启用与任务身份",
          "minutes": 60,
          "steps": [
            "在原示例上反复禁用和启用10次，每轮至少观察一次Tick，确认没有多份循环同时运行。",
            "在副本中把停止参数暂改成新创建的ReportLoop()迭代器，观察它为什么无法代表旧任务；随后恢复保存的句柄。",
            "增加一个会在等待期间被销毁的目标。恢复后先检查Unity对象是否有效，再决定继续或退出，保存两种情况的日志。"
          ],
          "result": "停止需要正确的任务身份；等待后的访问也需要重新检查目标，不能只信任等待前的状态。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "脚本取消勾选，旧计时循环却继续运行",
          "cause": "只停止了普通组件更新，没有显式停止已经启动的协程。",
          "fix": "为这段行为明确启用和结束规则，在OnDisable使用保存的句柄停止任务。"
        },
        {
          "symptom": "每次重新勾选，日志频率都会增加",
          "cause": "OnEnable启动了新循环，旧循环却没有被正确停止。",
          "fix": "逐次记录启动和停止，使用同一个已保存句柄，验证任意时刻最多只有一份循环。"
        }
      ],
      "exercise": {
        "brief": "制作只在启用期间闪烁的对象，停用后立即结束旧任务。再让同一实例重新使用，验证上轮延迟操作不会干扰新一轮。",
        "deliverables": [
          "源码与启动、等待、停止的过程图",
          "10次启用和停用的任务数量记录",
          "目标销毁和同实例重新使用的测试结果"
        ],
        "rubric": [
          {
            "item": "协程不是线程的解释正确",
            "points": 25
          },
          {
            "item": "启动取消身份一致",
            "points": 25
          },
          {
            "item": "重复启用无叠加",
            "points": 25
          },
          {
            "item": "等待后验证对象与轮次",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "只设置脚本enabled=false，不主动停止任务，已有协程会自动全部停止吗？",
          "options": [
            "不会，禁用组件与关闭GameObject的规则不同",
            "会，和普通Update完全相同",
            "会，但只有通过OnEnable启动的会停止",
            "会，并在再次启用时自动从原等待处恢复"
          ],
          "answer": 0,
          "explanation": "仅禁用MonoBehaviour不会自动停止已有协程。若设计上要停止，就明确调用相应停止方法。"
        },
        {
          "question": "想在OnEnable开始一个等待流程，怎样写符合回调规则？",
          "options": [
            "把Awake直接改成IEnumerator即可",
            "保留正常OnEnable，在其中显式StartCoroutine",
            "把方法改成public就会自动等待",
            "将Update移进Start后，所有对象都会等它完成"
          ],
          "answer": 1,
          "explanation": "Start支持协程形式；Awake、OnEnable不能直接作为这种协程回调。OnEnable可以明确启动另一个IEnumerator方法。"
        },
        {
          "question": "旧的延迟伤害影响了池中已经重新使用的角色，应该补上什么判断？",
          "options": [
            "只比较GameObject是否还存在",
            "只把等待时间缩短",
            "在结束旧使用时取消，或检查请求属于哪一轮使用",
            "只保证所有角色名字不同"
          ],
          "answer": 2,
          "explanation": "对象池复用的是同一实例。对象还存在并不能证明它仍属于发出旧请求的那一轮，需要取消旧任务或核对轮次。"
        }
      ],
      "references": [
        {
          "label": "Write and run coroutines",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/Coroutines.html"
        },
        {
          "label": "MonoBehaviour.StopCoroutine",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.StopCoroutine.html"
        },
        {
          "label": "MonoBehaviour.Start",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.Start.html"
        }
      ],
      "summary": [
        "为什么禁用脚本后Update停止，协程却可能继续？",
        "重新启用后启动新任务，与从旧任务的等待处恢复，有什么区别？"
      ],
      "teaching": {
        "question": "脚本已经取消勾选，为什么它启动的“每秒打印一次”还在继续？",
        "keyIdea": "普通 Update 和已经启动的协程有不同的停止规则。仅禁用 MonoBehaviour 不会自动停止已有协程；如果希望行为随组件停用而结束，就要明确停止自己启动的那个任务。",
        "walkthrough": [
          {
            "title": "先看任务从哪里开始",
            "text": "示例的OnEnable调用StartCoroutine，并保存返回的Coroutine。ReportLoop先打印一次，再等待一个缩放后的游戏秒。"
          },
          {
            "title": "停用时使用原来的句柄",
            "text": "OnDisable将保存的task交给StopCoroutine，然后把字段清空。这里停止的是之前实际启动的那一个协程。"
          },
          {
            "title": "重新启用时建立新任务",
            "text": "再次启用会重新调用OnEnable并启动新循环。旧任务已经停止，所以不会出现两条循环一起打印，也不是从旧等待位置续跑。"
          }
        ],
        "prediction": {
          "question": "把StopCoroutine(task)换成StopCoroutine(ReportLoop())，为什么不能据此停止旧任务？",
          "answer": "再次调用ReportLoop()会创建另一个迭代器对象，它不是先前正在运行的那个。需要保存启动时的Coroutine句柄，或使用与启动时对应的同一个迭代器身份。"
        },
        "comparison": {
          "caption": "已有协程的默认停止规则；如果脚本自己写了停止代码，还要叠加考虑该代码",
          "headers": [
            "操作",
            "已有协程",
            "再次启用时"
          ],
          "rows": [
            [
              "仅将脚本enabled设为false",
              "不会因此自动停止",
              "旧任务可能仍在；避免重复启动"
            ],
            [
              "将挂载的GameObject设为未激活",
              "相关协程停止",
              "不会自动从旧等待点续跑"
            ],
            [
              "销毁对应MonoBehaviour",
              "相关协程停止",
              "原实例已结束"
            ],
            [
              "显式StopCoroutine传入正确句柄",
              "停止该任务",
              "需要时由代码重新启动"
            ]
          ]
        }
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
      "id": "l015",
      "title": "跨对象依赖与显式启动：何时使用执行顺序",
      "prerequisites": [
        "l014"
      ],
      "goals": [
        "指出一个初始化流程具体依赖哪些数据",
        "使用明确的Init调用，让失败和成功都能被判断",
        "解释脚本执行顺序能排列什么，以及运行时生成还需要安排什么"
      ],
      "theory": [
        {
          "title": "把“先运行”换成“先准备好哪份数据”",
          "paragraphs": [
            "假设B负责读取角色配置，A负责显示角色名字。A在Awake读取B.Name，而B也在自己的Awake中才给Name赋值。如果A先运行，看到的可能仍是默认值。真正的问题是A需要一份已经准备好的名字；让B对象排在Hierarchy顶部，并没有把这个要求写进程序。",
            "先画一个箭头：B准备配置→A接收配置→A允许显示。箭头两端不一定是整个对象，也可以是一份数据。对象已存在、字段已赋值、异步资源已加载，是不同的完成条件。把这些条件写清，才能决定下一步应该等待什么。"
          ]
        },
        {
          "title": "看懂示例中的三个状态变化",
          "paragraphs": [
            "ExplicitInitProbe开始时ready=false。Init接收一个Transform，先检查它是否有效；无效则返回false，有效才保存target并把ready设为true。这里的方法名没有引擎魔法，它只是我们主动定义的普通方法，调用位置与返回值都由代码明确表达。",
            "Start提供了一个便于场景实验的入口：如果尚未初始化，就尝试使用Inspector中保存的target。Update只有在ready=true且target仍有效时才画线。这个额外检查很重要，因为目标可能在初始化成功之后被销毁。若再次调用Init并传入无效目标，当前代码只报告本次失败，不会自动清除上一次成功的状态；正式接口应明确这种重复调用规则。"
          ]
        },
        {
          "title": "从一个组件扩展到一个简单启动器",
          "paragraphs": [
            "当多个组件确实有先后要求，可以用一个场景启动器保存它们的引用。先检查引用是否齐全，再让配置组件准备数据，随后把结果传给显示组件，最后允许交互。这样读启动器就能看到启动顺序，不必在多个Awake里来回猜测。",
            "尽量先完成必要检查，再启动会产生外部影响的工作。如果第一步已经订阅事件，第二步却失败，还要规定谁撤销第一步。简单项目通常不需要先引入大型框架；把成功、失败和重复调用说明白，一个小启动器就可以解决许多依赖问题。",
            "例如启动器先调用 B.Prepare()，确认成功后读取准备结果，再调用 A.Init(结果)，最后开启交互。这样三步的先后来自同一条同步调用链；若 B.Prepare 返回的是未完成任务，就必须改为先等待它完成，而不是只等方法返回。还可画出依赖箭头：若 A 又要求 B 等 A，继续加执行顺序数字无法解除这个环，需要拆出双方都能先取得的配置或共同启动阶段。"
          ]
        },
        {
          "title": "执行顺序设置到底排了什么",
          "paragraphs": [
            "DefaultExecutionOrder和项目中的Script Execution Order，可以为脚本类型安排相应事件阶段的相对先后。例如确有稳定要求时，让某类更新早于另一类更新。但它不会自动安排你随意调用的普通方法，也不能保证同一脚本类型的两个实例按名字先后运行。",
            "项目设置还可能覆盖脚本上给出的默认顺序，需要一起检查。更重要的是，让某个Awake更早返回，不等于让它启动的网络或资源加载更早完成。若越修越需要大量顺序数字，应回头检查依赖是否绕成了环，或把本可以明确传递的数据藏进了全局读取。"
          ]
        },
        {
          "title": "运行时新建对象，要另看创建过程",
          "paragraphs": [
            "调用Instantiate创建一个活动对象时，它的Awake、OnEnable可能在Instantiate返回前就已经执行。创建者随后一行才写入外部目标，就来不及供这些回调使用。可以让这些回调只准备自身，再由明确的Init接收外部参数，并在准备完成前拒绝执行实际行为。",
            "另一种做法是从初始未激活的模板创建，先配置再激活。不过此时Init可能早于Awake，不能反过来假定Awake中的缓存一定存在。每种方案都要把这个前提说明白。最终请用漏赋目标、目标销毁、重复调用与运行时生成四种情况验证：程序不仅要在正常启动时工作，也要能解释失败时停在哪一步。"
          ]
        }
      ],
      "code": {
        "title": "先检查目标，再允许Update工作",
        "language": "csharp",
        "filename": "ExplicitInitProbe.cs",
        "source": "using UnityEngine;\npublic sealed class ExplicitInitProbe : MonoBehaviour\n{\n    [SerializeField] Transform target;\n    bool ready;\n    public bool Init(Transform value)\n    {\n        if (value == null) return false;\n        target = value;\n        ready = true;\n        return true;\n    }\n    void Start()\n    {\n        if (!ready && !Init(target)) Debug.LogError(\"Initialization failed.\", this);\n    }\n    void Update()\n    {\n        if (!ready || target == null) return;\n        Debug.DrawLine(transform.position, target.position, Color.green);\n    }\n}",
        "explanation": [
          "先在Inspector把target指向另一个对象。Start会在尚未准备时尝试Init；初始化成功后，Update才会画出两对象之间的绿线。",
          "运行时创建者也可直接调用Init并检查返回值。ready只是本组件记录的状态，不会自动代表其他组件、资源或整场游戏都已准备完毕。"
        ]
      },
      "lab": [
        {
          "title": "把隐藏的先后要求写出来",
          "minutes": 60,
          "steps": [
            "创建A、B两个简单脚本，令B在Awake赋值，A在Awake读取。先说明A期待什么值，以及这个期待需要B先做完什么。",
            "让A改为通过明确的初始化方法接收B已准备的数据，由一个启动器顺序调用。交换Hierarchy位置并复制实例，再观察结果。",
            "故意漏赋其中一个引用，检查启动器是否先报告失败、停止依赖它的行为。记录失败前是否已有工作需要撤销。"
          ],
          "result": "正确性来自明确的数据准备与传递，不再依赖某次恰好出现的跨对象回调顺序。"
        },
        {
          "title": "比较类型排序与运行时创建",
          "minutes": 60,
          "steps": [
            "对两个不同脚本类型设置DefaultExecutionOrder，在同一回调阶段输出日志；同时检查项目是否存在覆盖设置。",
            "添加两个相同脚本类型的实例，说明类型之间的排序为什么不能提供这两个实例的身份顺序。",
            "分别从活动与未激活Prefab创建对象，在Instantiate前后和Init中打印标记。记录Awake、OnEnable与外部赋值各发生在哪一步。"
          ],
          "result": "执行顺序只解决其规定范围内的排序；外部参数何时可用、异步准备何时结束，仍需明确安排。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "偶尔读到另一个组件尚未赋值的数据",
          "cause": "读取者只找到对方对象，却没有确认对方所需的数据已经准备好。",
          "fix": "写出具体依赖，以明确的初始化顺序传入已准备数据，并处理失败。"
        },
        {
          "symptom": "Instantiate之后已经赋值，OnEnable里却还是读到空",
          "cause": "活动实例的OnEnable可能在Instantiate返回之前就已经执行。",
          "fix": "把外部配置放到明确的Init流程，或选择先配置再激活，并核对Init与Awake的先后前提。"
        }
      ],
      "exercise": {
        "brief": "为配置读取、对象生成和显示编写一个小启动器。缺少必要引用时应报告并停止启动；运行中新建对象也必须完成配置后才工作。",
        "deliverables": [
          "每一步需要哪些已准备数据的依赖图",
          "成功与失败时各自执行的代码",
          "改变对象排列、增加同类型实例和运行时生成的测试"
        ],
        "rubric": [
          {
            "item": "依赖状态定义清楚",
            "points": 25
          },
          {
            "item": "启动顺序由明确调用表达",
            "points": 25
          },
          {
            "item": "失败不产生半工作系统",
            "points": 25
          },
          {
            "item": "执行顺序边界解释正确",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "给某脚本类型设置DefaultExecutionOrder，会保证该类型两个实例按对象名先后执行吗？",
          "options": [
            "会，名字会成为同类型实例的第二排序条件",
            "不会，类型排序不能代替实例之间的明确安排",
            "会，只要两个实例都在同一场景",
            "会，只要它们各自只执行一次Awake"
          ],
          "answer": 1,
          "explanation": "这里安排的是脚本类型在相应事件阶段的顺序。不能由此推断同类型两个实例按对象名排列。"
        },
        {
          "question": "服务的Awake启动异步加载后返回，使用者此时应该怎样判断资源可用？",
          "options": [
            "检查明确的就绪状态或等待完成信号",
            "只要Awake调用过就立即使用",
            "把服务的执行顺序数字调小即可保证",
            "只检查服务GameObject是否活动"
          ],
          "answer": 0,
          "explanation": "Awake返回与异步加载完成是两件事。存在和活动状态都不能证明资源已加载。"
        },
        {
          "question": "创建活动Prefab后才给外部字段赋值，为什么OnEnable仍可能看到空？",
          "options": [
            "因为Instantiate只复制资源，不创建实例",
            "因为所有OnEnable都必须再等一帧",
            "因为OnEnable可能已在Instantiate返回前执行，需要另行安排配置过程",
            "因为公开字段永远不能在运行时赋值"
          ],
          "answer": 2,
          "explanation": "创建活动实例会触发相应初始化。若回调依赖创建者尚未传入的数据，就要调整职责或采用先配置、后激活的明确流程。"
        }
      ],
      "references": [
        {
          "label": "DefaultExecutionOrder",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/DefaultExecutionOrder.html"
        },
        {
          "label": "Object.Instantiate",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.Instantiate.html"
        },
        {
          "label": "Event function execution order",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/execution-order.html"
        }
      ],
      "summary": [
        "找到组件引用之后，还可能缺少哪一步准备？请举一个具体例子。",
        "执行顺序数字能否让异步加载自动完成，为什么？"
      ],
      "teaching": {
        "question": "A 在 Awake 读取 B 的数据，B 也在 Awake 才准备这些数据。怎样保证 A 读到的已经可用？",
        "keyIdea": "先把“对象存在”和“数据准备好”分开，再明确写出谁先准备、谁把结果交给谁。执行顺序设置能排列部分回调，却不能代替一次真正完成的初始化流程。",
        "walkthrough": [
          {
            "title": "先检查实际需要的东西",
            "text": "示例需要一个有效Transform作为目标。场景中可以在Inspector赋值，运行时也可以由创建者将目标传给Init。"
          },
          {
            "title": "通过Init明确建立状态",
            "text": "Init检查传入目标。有效时才保存引用并设置ready=true；返回值让调用者知道这次初始化是否成功。"
          },
          {
            "title": "更新前验证是否可以工作",
            "text": "Update同时检查ready和目标有效性，满足后才画线。目标之后被销毁时，曾经初始化成功也不能代替当前检查。"
          }
        ],
        "prediction": {
          "question": "若服务的Awake启动了资源加载，并且Awake已经返回，能否据此断定资源也准备好了？",
          "answer": "不能。同步的Awake已经结束，只说明这一段代码返回了；异步加载可能仍在进行。使用者需要检查明确的就绪状态或等待完成通知，不能只看回调是否发生过。"
        }
      }
    }
  ]
});
