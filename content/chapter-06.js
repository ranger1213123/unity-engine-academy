window.COURSE_MODULES.push({
  "id": "m06",
  "number": 6,
  "title": "Input System",
  "subtitle": "从物理按键到可测试的玩家意图",
  "description": "以已安装的 Input System 1.20.1 为基线，掌握 Actions、状态与事件、映射切换、改键持久化和固定步输入缓冲。",
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
      "id": "l026",
      "title": "Action、Binding 与设备：为什么正式项目不直接写 WASD",
      "prerequisites": [
        "l025"
      ],
      "goals": [
        "创建Value/Vector2移动动作及不同绑定",
        "让角色只读取统一移动向量",
        "明确由哪个组件启停动作"
      ],
      "theory": [
        {
          "title": "先让角色只关心想做什么",
          "paragraphs": [
            "角色需要的是向哪个方向移动，而不是必须由D键驱动。直接写Keyboard可以快速验证原型，但添加方向键、手柄和改键后，每种设备规则都塞进角色，代码会越来越难维护。Action把这层关系拆开。",
            "定义名为Move的动作，表达移动意图；Binding说明哪个控件产生它。更换绑定后，角色仍读取同一种Vector2。这里不是禁止使用底层设备接口，而是让正式控制逻辑不必随着每一种设备和玩家设置反复改写。"
          ]
        },
        {
          "title": "动作类型和值类型要对应",
          "paragraphs": [
            "Value类型动作适合连续数值，例如移动方向；Button适合按钮类操作；PassThrough有不同通知规则，不能只按名字选择。值类型Vector2说明读取的是两个分量，绑定和ReadValue也应匹配。",
            "键盘二维复合可以把上下左右组合成向量，手柄摇杆本身提供二维值。若动作配置为按钮却要求读取Vector2，不能靠移动公式修好。应先核对Action类型、预期值和绑定控件，再检查消费者如何使用结果。"
          ]
        },
        {
          "title": "从设备到角色有几层连接",
          "paragraphs": [
            "可按设备、控件、绑定、动作、脚本数值和角色移动逐层检查。键盘确实有按键事件，不代表绑定正确；绑定资源存在，不代表动作已启用；脚本读到向量，也不代表刚体已经接到速度。",
            "每层都可以独立观察。Input Debugger检查设备，动作探针检查值，角色脚本检查输出。先找到数值从哪一层开始变为零，才能避免输入问题还没解决，就反复调整speed、碰撞体或动画。"
          ]
        },
        {
          "title": "动作必须处于监听状态",
          "paragraphs": [
            "项目中保存一个动作资源，只说明配置存在。运行时还要Enable它，并满足设备、焦点和绑定等条件。示例在OnEnable检查引用并启用，在Update读取，OnDisable停用并清空Value。",
            "如果该动作也由PlayerInput管理，另一个脚本再随意Disable就可能影响整个角色。因此启停责任要明确。引用外部动作资源不等于组件拥有任意销毁它的权利；自行new出的动作与借用资源动作，也应按不同方式管理结束过程。"
          ]
        },
        {
          "title": "处理输入大小时保留需要的强度",
          "paragraphs": [
            "MoveActionProbe使用ClampMagnitude将长度限制为1，避免过大输入，但不会把半推摇杆自动变满速。上游复合绑定与Processor也可能处理归一化或死区，因此实验要记录这些设置。",
            "角色之后把方向乘速度，再交给合适移动阶段。输入组件不应顺便每次改变所有刚体状态。先用日志确认轴向、斜向、小强度与零输入，再接移动，能区分数值处理错误和物理控制错误。"
          ]
        },
        {
          "title": "新旧输入设置不会自动互换",
          "paragraphs": [
            "UnityEngine.Input属于旧输入API，UnityEngine.InputSystem来自新包。项目的Active Input Handling决定可用后端。仅添加using不会把Input.GetAxis重写成Action，也不会自动创建名为Horizontal的动作。",
            "当前项目采用新系统时，应使用对应包和工作流，或者为了兼容旧教程明确选择相应设置。教学实验要写出版本和后端，避免两套示例混用。是否同时启用两套，应有具体目的，不能把它当作所有输入问题的默认修复。"
          ]
        },
        {
          "title": "设备范围要如实测试",
          "paragraphs": [
            "先测试Game视图焦点，再分别检查键盘和实际可用手柄。没有硬件时，可以验证向量消费者的边界，但不能因此声称所有设备已实测。失焦、设备断开和输入模式切换，也需要按项目规则清除或保留缓存。",
            "独立练习应让角色只接收向量，并写明输入缺失时行为。若禁用输入组件后仍沿旧方向走，就检查Value有没有清零，以及角色是否还存着另一份方向。设备配置与消费状态都对上，才算把整条链路接好。"
          ]
        }
      ],
      "code": {
        "title": "由单个组件拥有动作启用状态",
        "language": "csharp",
        "filename": "MoveActionProbe.cs",
        "source": "using UnityEngine;\nusing UnityEngine.InputSystem;\npublic sealed class MoveActionProbe : MonoBehaviour\n{\n    [SerializeField] InputActionReference move;\n    public Vector2 Value { get; private set; }\n    void OnEnable()\n    {\n        if (move == null || move.action == null)\n        {\n            Debug.LogError(\"Assign a Value/Vector2 action.\", this);\n            enabled = false;\n            return;\n        }\n        move.action.Enable();\n    }\n    void Update() => Value = Vector2.ClampMagnitude(move.action.ReadValue<Vector2>(), 1f);\n    void OnDisable()\n    {\n        if (move != null && move.action != null) move.action.Disable();\n        Value = Vector2.zero;\n    }\n}",
        "explanation": [
          "先安装并启用Input System。创建Player/Move（Value、Vector2），配置键盘二维复合和手柄左摇杆，再赋给move。此例由组件管理动作启停，不与PlayerInput同时管理同一动作。"
        ]
      },
      "lab": [
        {
          "title": "让不同设备产生相同方向",
          "minutes": 60,
          "steps": [
            "创建Move动作，配置WASD、方向键与可用手柄左摇杆，再赋动作引用。",
            "测试轴向、斜向与小强度，记录二维复合和Processor设置。",
            "没有手柄时标明未实测，先用受控向量验证角色接收范围。"
          ],
          "result": "角色只使用方向值，设备支持范围有实际证据。"
        },
        {
          "title": "逐层制造并排除故障",
          "minutes": 60,
          "steps": [
            "分别停用动作、改错绑定、移走窗口焦点，每次只改一项。",
            "观察设备、动作值和角色结果，恢复后验证禁用组件会清Value。",
            "写明唯一启停负责者，检查没有其他组件随意Disable共享动作。"
          ],
          "result": "故障定位在对应层，而非全部靠改移动公式。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "动作资源已创建，读取值却一直为零",
          "cause": "动作没有启用，绑定不匹配，或窗口焦点等条件不满足。",
          "fix": "从设备、绑定、启用状态到脚本读值逐层检查，暂时不改移动公式。"
        },
        {
          "symptom": "关闭一个面板后，角色输入也失效",
          "cause": "多个组件管理同一共享动作，一个停用了另一个仍需要的监听。",
          "fix": "明确由一个入口管理动作启停，其他组件读取或请求模式变化。"
        }
      ],
      "exercise": {
        "brief": "将WASD读取替换为独立Move输入组件，角色只使用向量；写明禁用、失焦与设备缺失时如何清理。",
        "deliverables": [
          "动作资源与引用图",
          "键盘及模拟强度测试",
          "故障分层记录"
        ],
        "rubric": [
          {
            "item": "意图与设备解耦",
            "points": 25
          },
          {
            "item": "动作类型和值类型正确",
            "points": 25
          },
          {
            "item": "启用所有权明确",
            "points": 25
          },
          {
            "item": "停用无残留输入",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "Action 的主要价值是什么？",
          "options": [
            "分开逻辑意图与设备控件",
            "让所有设备必须产生键盘事件",
            "自动把方向写入Rigidbody",
            "将配置资源自动变成已启用状态"
          ],
          "answer": 0,
          "explanation": "动作提供统一意图，绑定适配具体设备，角色无需知道每个控件名称。"
        },
        {
          "question": "资源中存在一个 Action 是否代表它正在监听？",
          "options": [
            "一定，创建资源就自动监听",
            "不一定，还需启用并满足设备、绑定等条件",
            "只要名叫Move就会监听",
            "赋给字段后无需检查启用状态"
          ],
          "answer": 1,
          "explanation": "保存配置与运行监听是两层状态。"
        },
        {
          "question": "using InputSystem 后调用 Input.GetAxis 会怎样？",
          "options": [
            "自动转成新输入调用",
            "自动创建同名Action",
            "仍是旧接口，需要匹配项目后端",
            "新旧接口的更新时机自动完全一致"
          ],
          "answer": 2,
          "explanation": "using没有代码转换功能，旧调用目标不会因此改变。"
        }
      ],
      "references": [
        {
          "label": "Actions",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/Actions.html"
        },
        {
          "label": "Using Actions",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/using-actions-workflow.html"
        },
        {
          "label": "Reading device state directly",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/using-direct-workflow.html"
        }
      ],
      "summary": [
        "Action说明想做什么，Binding连接具体设备。",
        "动作存在不等于已启用，读到向量也不等于角色已经移动。"
      ],
      "teaching": {
        "question": "现在移动代码直接检查WASD，如果再支持方向键、手柄和改键，是否要把每种设备都写进角色脚本？",
        "keyIdea": "Action表达“移动”等操作意图，Binding把设备控件接到意图上。角色读取统一的方向值，不必知道来自哪一个按键或摇杆。",
        "walkthrough": [
          {
            "title": "建立意图",
            "text": "创建Player/Move动作，类型设为Value，值类型Vector2，表示角色需要二维移动输入。"
          },
          {
            "title": "连接不同设备",
            "text": "为Move配置键盘二维复合和手柄左摇杆。先观察它们都怎样形成同一种二维数值，再交给角色。"
          },
          {
            "title": "明确谁启停",
            "text": "将动作引用赋给MoveActionProbe，由该组件Enable和Disable；不要再让其他组件同时争管同一动作。"
          }
        ],
        "prediction": {
          "question": "仅在文件开头加using UnityEngine.InputSystem，旧Input.GetAxis会自动变成新系统吗？",
          "answer": "不会。using只帮助解析类型名称，旧API仍是旧API；需要明确更改调用方式，并匹配项目的输入处理设置。"
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
      "id": "l027",
      "title": "轮询、回调与 Interaction：按下、保持和完成不是同一事件",
      "prerequisites": [
        "l026"
      ],
      "goals": [
        "区分当前状态与本帧按下",
        "根据Interaction解释三个动作阶段",
        "在回调中复制数据供后续处理"
      ],
      "theory": [
        {
          "title": "状态与变化回答不同问题",
          "paragraphs": [
            "“现在按着吗”和“刚才按下了吗”听起来相近，使用方式却不同。IsPressed适合读取持续状态，WasPressedThisFrame适合查询当前输入帧发生的按下边沿。若用持续状态每帧开火，按住期间就可能执行很多次。",
            "一次跳跃通常需要一条请求，持续移动则可以反复读取最新方向。先决定行为需要连续值还是一次变化，再选择查询或回调。不能因为某个接口返回bool，就认为它们都表达同一件事。"
          ]
        },
        {
          "title": "动作阶段来自动作和交互规则",
          "paragraphs": [
            "started、performed、canceled描述动作过程。默认按钮、Hold和Tap有不同完成条件。Hold可能先开始，持续满足时间后才performed；提前放开可能取消。因此performed不能被无条件翻译为物理按键刚压下。",
            "若修改交互后攻击“变迟”，先看是不是预期的完成时间，而不是立即去改Update。把动作阶段与实际按下、保持、松开时刻一起记录，能解释配置如何改变通知过程。阶段名字有共同形式，但具体触发条件要看设置。"
          ]
        },
        {
          "title": "轮询与回调是两种读取方式",
          "paragraphs": [
            "轮询是在适当阶段主动询问当前值或边沿，回调是在动作阶段变化时接到通知。两者都能合理使用，关键是不要对同一个请求同时从两个入口执行同一行为，导致一次按下发射两次。",
            "可以让回调只复制输入或记录请求，再由玩法阶段决定是否执行。也可以用简单轮询完成明确需求。选择应让时机与次数容易解释，而不是为了展示更多API，把所有方式一起叠加到一个按钮上。"
          ]
        },
        {
          "title": "回调上下文只在回调中使用",
          "paragraphs": [
            "CallbackContext携带当前通知的相关信息，可以在处理函数中读取值。它不是设计给你长期保存的跨帧容器。需要之后使用的方向、时间或请求标记，应在回调中复制到自己保存的字段或结构。",
            "这样后续代码处理的是明确快照，而不是重新访问已经离开有效范围的上下文。只复制真正需要的数据，也能说明玩法依赖什么。例如跳跃请求通常不必保存整个设备对象和回调结构，记录一次请求就够了。"
          ]
        },
        {
          "title": "自己创建的动作要自己结束",
          "paragraphs": [
            "示例在Awake中new一个Fire并订阅，在启用和禁用时切换监听，销毁时退订并Dispose。这里动作属于该组件，不是来自外部资源，所以组件有责任释放自己的运行资源。",
            "仅Disable表示停止监听，不等于永久释放。反复启用也不应该反复累加相同订阅。本例订阅一次，销毁移除一次；若选择启用期订阅，则应对应禁用期退订。具体组合可以不同，但次数和寿命必须对得上。"
          ]
        },
        {
          "title": "停用动作也可能产生阶段变化",
          "paragraphs": [
            "动作正在进行时Disable，可能产生取消相关通知。处理函数需要考虑此时组件是否正在结束工作，不应假定所有通知只可能来自玩家新按键。模式切换、设备变化也可能影响动作值。",
            "因此取消阶段往往需要清空持续输入，但是否丢弃已排队的一次请求仍要由需求决定。把输入状态与业务状态分开，才能说明菜单打开后角色为什么停止，而不是靠最后一次通知碰巧把方向写成零。"
          ]
        },
        {
          "title": "用操作序列检查次数与阶段",
          "paragraphs": [
            "分别测试快速点按、保持2秒、连续点按、等待Hold前松开和组件开关。记录玩家动作、阶段日志与最终行为次数，避免只看最后效果判断。关闭再开启十次后，一次操作仍应有预期次数。",
            "再把回调改为只记录请求，由另一阶段处理，比较输入请求数和接受数。两者未必永远相等，例如冷却会拒绝攻击，但每条差异应有原因。这样的记录能同时发现重复订阅、语义误解和处理次数错误。"
          ]
        }
      ],
      "code": {
        "title": "自有动作的对称订阅与释放",
        "language": "csharp",
        "filename": "ButtonCallbackProbe.cs",
        "source": "using UnityEngine;\nusing UnityEngine.InputSystem;\npublic sealed class ButtonCallbackProbe : MonoBehaviour\n{\n    InputAction fire;\n    int count;\n    void Awake()\n    {\n        fire = new InputAction(\"Fire\", InputActionType.Button, \"<Keyboard>/space\");\n        fire.performed += OnFire;\n    }\n    void OnEnable() => fire.Enable();\n    void OnDisable() => fire.Disable();\n    void OnFire(InputAction.CallbackContext context)\n    {\n        count++;\n        Debug.Log($\"Performed count={count}; value={context.ReadValue<float>()}\", this);\n    }\n    void OnDestroy()\n    {\n        fire.performed -= OnFire;\n        fire.Dispose();\n    }\n}",
        "explanation": [
          "已安装Input System后挂空对象，让Game视图获得焦点。动作由脚本new创建，空格用于观察默认Button的performed；Hold或Tap需在独立对照实验中另配。"
        ]
      },
      "lab": [
        {
          "title": "对照状态、边沿与完成阶段",
          "minutes": 60,
          "steps": [
            "在相同按钮上分别记录IsPressed、WasPressedThisFrame与performed。",
            "测试保持2秒、快速点按和连续点击，比较每种记录的次数。",
            "另配Hold或Tap，先预测阶段，再观察完成条件怎样改变。"
          ],
          "result": "不把performed或持续状态都理解为一次刚按下。"
        },
        {
          "title": "分开通知与行为执行",
          "minutes": 60,
          "steps": [
            "重复启用禁用10次后按一次，检查没有重复注册。",
            "让回调只保存一条请求，再由Update接受并清除，记录两边次数。",
            "审查只复制需要值，没有保存CallbackContext供以后读取，也不再用轮询重复执行。"
          ],
          "result": "请求有明确保存和处理次数，数据不依赖过期上下文。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "一直按着攻击键，每帧都发射",
          "cause": "把持续按住状态当成了一次刚按下。",
          "fix": "按需求使用按下边沿或动作完成通知，并记录每条请求最多处理几次。"
        },
        {
          "symptom": "加Hold后，按下瞬间不再攻击",
          "cause": "Hold改变了performed的完成条件，要保持达到要求才发生。",
          "fix": "先明确要在开始还是长按完成时攻击，再选择阶段并测试提前松开。"
        }
      ],
      "exercise": {
        "brief": "实现点按与长按两种请求，先记录阶段再交给独立逻辑执行；不能通过轮询和回调重复触发同一次行为。",
        "deliverables": [
          "阶段时序表",
          "订阅与消费代码",
          "重复启用和取消测试"
        ],
        "rubric": [
          {
            "item": "状态与事件区分正确",
            "points": 25
          },
          {
            "item": "交互阶段符合需求",
            "points": 25
          },
          {
            "item": "订阅释放对称",
            "points": 25
          },
          {
            "item": "上下文寿命与消费次数正确",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "performed 是否总等于物理按键刚按下？",
          "options": [
            "不是，要看动作类型及Interaction",
            "总是物理按键刚压下",
            "只有回调发生在Update时才是",
            "加Hold后仍必须在最初按下时完成"
          ],
          "answer": 0,
          "explanation": "performed表达满足动作完成条件，Hold等交互会改变这些条件。"
        },
        {
          "question": "CallbackContext 应如何用于跨帧消费？",
          "options": [
            "保存整个上下文到以后再读",
            "回调中复制需要的数据供之后使用",
            "只保存上下文就能保证设备一直有效",
            "等待下一帧后上下文才可读取"
          ],
          "answer": 1,
          "explanation": "回调上下文不应作为长期数据容器。"
        },
        {
          "question": "自己创建的 InputAction 最终应怎样？",
          "options": [
            "永远只Disable就完成释放",
            "保存为static后不再管理",
            "停止监听，并按所有权退订和Dispose",
            "销毁键盘设备替代动作释放"
          ],
          "answer": 2,
          "explanation": "自行创建的动作属于组件，应明确终止其通知关系和资源。"
        }
      ],
      "references": [
        {
          "label": "InputAction",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.InputAction.html"
        },
        {
          "label": "Actions",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/Actions.html"
        }
      ],
      "summary": [
        "performed的含义由动作和交互配置决定。",
        "同一请求不要同时由轮询与回调重复执行。"
      ],
      "teaching": {
        "question": "按住空格2秒，是想连续开火，还是只开一枪？加上Hold以后，performed为什么不再立即发生？",
        "keyIdea": "持续状态和一次变化不是同一种数据。动作阶段由类型及Interaction共同决定，不能把performed固定理解为按键刚按下。",
        "walkthrough": [
          {
            "title": "先观察一次点击",
            "text": "运行ButtonCallbackProbe，在Game视图按一次空格，记录performed次数与读取值，先理解默认按钮行为。"
          },
          {
            "title": "再保持按住",
            "text": "持续2秒，比较IsPressed与一次按下查询：前者可以持续为真，后者描述本帧是否发生变化。"
          },
          {
            "title": "改变交互条件",
            "text": "另给动作添加Hold，先预测需要保持多久再完成，再记录started、performed和canceled，而非沿用旧解释。"
          }
        ],
        "prediction": {
          "question": "在回调中保存CallbackContext，过几帧再用它读值是否合适？",
          "answer": "不合适。应在回调有效期间复制需要的值和时间等数据，之后使用自己的数据，不长期保存上下文。"
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
      "id": "l028",
      "title": "Action Map、PlayerInput 与设备切换",
      "prerequisites": [
        "l027"
      ],
      "goals": [
        "按允许行为划分Gameplay与UI模式",
        "把设备方案与输入模式分开测试",
        "使用对应玩家的动作并清理缓存"
      ],
      "theory": [
        {
          "title": "输入模式先表达允许哪些行为",
          "paragraphs": [
            "游戏中允许移动与攻击，菜单中允许导航与确认。ActionMap将相关动作组织成组，便于按当前模式管理。先列出行为，再建Gameplay和UI，名字只是方便识别，不会自动为项目提供完整菜单规则。",
            "同一个按钮可以在不同模式表达不同意图，但应防止两种行为同时被接受。打开菜单时攻击是否继续、移动是否立即停止，需要明确，而不是期望UI画在屏幕上就能自动阻止世界输入。"
          ]
        },
        {
          "title": "设备方案和模式是两个维度",
          "paragraphs": [
            "键鼠与手柄控制方案说明使用哪组设备与绑定；Gameplay和UI Map说明现在允许什么逻辑操作。手柄也能玩游戏和操作菜单，键鼠同样如此，两者不是只能互相替代的一组名字。",
            "可以画二维表：行是玩法或菜单，列是键鼠或手柄。每格都写出应有动作。这样热插拔更换设备不必被误解为打开菜单，切菜单也不必被误解为更换控制方案，问题更容易分别测试。"
          ]
        },
        {
          "title": "PlayerInput管理属于玩家的输入",
          "paragraphs": [
            "PlayerInput可以帮助启用动作、接收通知和关联设备。多个玩家使用相同资源时，可能涉及各自管理的动作副本，读取时应从对应玩家的PlayerInput.actions确认，而不是随手使用项目中共享原资源。",
            "它不会自动决定角色怎么移动，也不会替你完成全部UI和暂停逻辑。先把它看成输入管理组件，按文档选择通知方式，并确认你读到的动作属于哪个玩家。这在单人原型正常、多人时串输入的问题中尤其重要。"
          ]
        },
        {
          "title": "当前Map切换有明确边界",
          "paragraphs": [
            "示例用SwitchCurrentActionMap选择名为Gameplay或UI的Map。前提是资源里存在这两组，且PlayerInput已正确配置。拼错名称、没有默认设置或引用错误，都应先从管理组件状态检查。",
            "不要把切换当前Map理解为清理所有手工启用的动作。若其他脚本又单独Enable一组Map，它们可能仍有自己的状态。应明确由哪个入口负责启停，避免一个系统切菜单、另一个系统继续接收攻击。"
          ]
        },
        {
          "title": "消费者缓存需要自己处理",
          "paragraphs": [
            "输入组件上一次读到(1,0)，角色把它存在字段里。切Map以后，即使Move不再产生正常变化，角色仍可能反复使用这份旧向量。停止监听与清空外部字段是两个不同动作，所以菜单打开后仍向右走不一定是Map未切成功。",
            "模式入口可以明确通知消费者清零持续方向，按需要丢弃过期跳跃与攻击。某些取消回调会提供清零机会，但不能假定它能管理所有独立缓存。测试按住时切换，最容易暴露这种差别。"
          ]
        },
        {
          "title": "UI、时间与光标需要另行安排",
          "paragraphs": [
            "uGUI通常还需EventSystem和InputSystemUIInputModule，并配置相应UI动作。更换Map不等于自动连接这个模块。timeScale、鼠标锁定和菜单显示也由不同设置控制，应在模式转换流程中分别调用。",
            "这些职责可以由一个入口组织，但不必混为一个神奇开关。列出每个步骤和负责组件，失败时逐项检查。否则“菜单出现了”会被误当成所有暂停与输入切换均已正确，实际却可能仍有点击穿透。"
          ]
        },
        {
          "title": "分别测试模式、焦点和设备变化",
          "paragraphs": [
            "失去窗口焦点、拔掉手柄、切换到菜单是不同事件。它们可能都导致输入不可用，却需要不同恢复策略。没有硬件时不要声称热插拔已验证，可以先测试逻辑切换并保留未测范围。",
            "按住移动开菜单、菜单里松开、再回游戏，确认不保留旧方向；连续切换十次确认没有重复监听。多人时再分别确认每个玩家的设备与动作实例。把这些过程记录成具体步骤，比一句“支持设备切换”更有检查价值。"
          ]
        }
      ],
      "code": {
        "title": "通过 PlayerInput 明确切换 Map",
        "language": "csharp",
        "filename": "InputModeProbe.cs",
        "source": "using UnityEngine;\nusing UnityEngine.InputSystem;\n[RequireComponent(typeof(PlayerInput))]\npublic sealed class InputModeProbe : MonoBehaviour\n{\n    PlayerInput input;\n    void Awake() => input = GetComponent<PlayerInput>();\n    [ContextMenu(\"Enter gameplay\")]\n    public void EnterGameplay() => input.SwitchCurrentActionMap(\"Gameplay\");\n    [ContextMenu(\"Enter menu\")]\n    public void EnterMenu() => input.SwitchCurrentActionMap(\"UI\");\n}",
        "explanation": [
          "PlayerInput指定含Gameplay和UI的动作资源，默认Gameplay，播放时执行组件菜单。示例只切Map，不自动连接UI输入模块、暂停时间或清除其他脚本缓存。"
        ]
      },
      "lab": [
        {
          "title": "区分模式与设备方案",
          "minutes": 60,
          "steps": [
            "建立Gameplay的Move、Fire与UI的Navigate等动作，列出每种模式允许项。",
            "由PlayerInput切换Map，逐个记录哪些动作仍能响应，检查额外手动启用项。",
            "配置键鼠与手柄方案，填一张模式×设备表，说明两者不是同一维度。"
          ],
          "result": "动作模式与设备组合能够分别选择。"
        },
        {
          "title": "清理旧方向与其他状态",
          "minutes": 60,
          "steps": [
            "按住移动开菜单，菜单中松开再回游戏，观察方向缓存是否残留。",
            "连续切换10次，测试失焦恢复；有实际硬件再验证热插拔。",
            "分别列出Map、UI输入模块、timeScale与光标由谁控制，并检查一步失败如何处理。"
          ],
          "result": "不会把菜单显示当作全部输入与暂停配置完成。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "菜单已打开，角色仍沿旧方向走",
          "cause": "动作停用，但角色还保存上一次方向并继续使用。",
          "fix": "模式转换时明确清零持续方向，并按规则丢弃过期请求。"
        },
        {
          "symptom": "一个资源动作没变化，PlayerInput却有通知",
          "cause": "读取的项目资源与该玩家管理的动作可能不是同一实例。",
          "fix": "从对应PlayerInput.actions获取动作，核对玩家、设备与引用来源。"
        }
      ],
      "exercise": {
        "brief": "制作玩法、菜单和改键3种输入状态，不要求完整界面；每次转换都列出允许动作及缓存清理。",
        "deliverables": [
          "模式转换表",
          "集中管理代码",
          "按住、失焦、重复切换测试"
        ],
        "rubric": [
          {
            "item": "模式与控制方案分离",
            "points": 25
          },
          {
            "item": "动作所有权一致",
            "points": 25
          },
          {
            "item": "缓存无残留",
            "points": 25
          },
          {
            "item": "嵌套或重复转换可解释",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "键鼠与手柄控制方案是否等同 Gameplay/UI 模式？",
          "options": [
            "不等同，设备组合与允许动作是两个维度",
            "相同，UI就是键鼠、Gameplay就是手柄",
            "只能用Map或控制方案中的一个",
            "两者都只由timeScale决定"
          ],
          "answer": 0,
          "explanation": "同一种设备能使用多个模式，同一模式也能适配不同设备。"
        },
        {
          "question": "停用 Move 动作后缓存向量一定自动归零吗？",
          "options": [
            "一定，所有外部字段都自动归零",
            "不一定，消费者的缓存要明确清理",
            "只要动作名叫Move就会",
            "Disable会自动销毁所有保存向量的脚本"
          ],
          "answer": 1,
          "explanation": "动作无法自动维护每个消费者自己的数据。"
        },
        {
          "question": "多人时从哪里读取动作更可靠？",
          "options": [
            "项目里任意一个共享动作资源",
            "全局第一个键盘对应动作",
            "该玩家PlayerInput管理的动作实例",
            "通过场景对象名字猜测所属动作"
          ],
          "answer": 2,
          "explanation": "玩家身份、设备和动作必须对应，避免读共享原资源造成混用。"
        }
      ],
      "references": [
        {
          "label": "PlayerInput",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.PlayerInput.html"
        },
        {
          "label": "Actions",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/Actions.html"
        },
        {
          "label": "Input System settings",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/Settings.html"
        }
      ],
      "summary": [
        "Map与控制方案分别描述操作组和设备组合。",
        "模式切换还需处理方向、请求、UI模块和时间规则。"
      ],
      "teaching": {
        "question": "打开菜单后为什么角色仍沿旧方向走？手柄方案与Gameplay/UI两个Map到底是什么关系？",
        "keyIdea": "Map组织当前允许的操作，控制方案描述设备组合。切换输入模式还要清理自己保存的方向和请求，不能只换一组动作名称。",
        "walkthrough": [
          {
            "title": "列出允许动作",
            "text": "创建Gameplay的Move与Fire，以及UI的Navigate与Submit。先写清玩法和菜单分别允许哪些操作。"
          },
          {
            "title": "由玩家组件切换",
            "text": "给PlayerInput指定动作资源与默认Gameplay，再执行Enter menu，观察它所管理当前Map的变化。"
          },
          {
            "title": "清理外部缓存",
            "text": "按住移动进入菜单，检查角色保存的方向是否归零；动作停止监听不代表所有消费者缓存都会自动清除。"
          }
        ],
        "prediction": {
          "question": "切到UI Map，是否已经自动暂停游戏并配置好菜单按钮？",
          "answer": "没有。示例只切换Map，时间、光标、EventSystem与InputSystemUIInputModule等仍需分别配置。"
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
      "id": "l029",
      "title": "运行时改键与保存：覆盖绑定而不修改原配置",
      "prerequisites": [
        "l028"
      ],
      "goals": [
        "区分默认路径、覆盖路径和有效路径",
        "验证单按钮改键在重启后仍恢复",
        "处理改键取消、冲突和操作释放"
      ],
      "theory": [
        {
          "title": "保留默认值再叠加个人选择",
          "paragraphs": [
            "默认Fire绑定空格，玩家想改成Enter，不必把开发者资源文件直接改掉。binding override在原绑定之上提供覆盖值，让实际使用路径变化，同时保留默认配置，以后可以清除覆盖恢复。",
            "path表示默认路径，overridePath表示覆盖，effectivePath表示当前实际使用路径。显示改键结果时应依据有效绑定，不要继续硬写“空格”。默认配置和个人设置分开，也方便版本更新时保留玩家偏好，而不是让每次改键都改变项目源资源。"
          ]
        },
        {
          "title": "读懂这个例子的最小范围",
          "paragraphs": [
            "示例只创建一个Fire和唯一按钮绑定，因此明确使用索引0。Rebind把该项覆盖为Enter，保存overridePath字符串；下一次创建动作后，再将保存路径应用到这唯一项。它没有声称能处理完整动作集合。",
            "键名路径是输入控件描述，不是面向玩家的所有语言下最佳显示文本。PlayerPrefs在此只存非敏感学习配置。真实设置界面还需要配置版本、非法或不再可用路径的处理，以及清楚的恢复默认入口。"
          ]
        },
        {
          "title": "为什么同名不能代替稳定身份",
          "paragraphs": [
            "SaveBindingOverridesAsJson会保存绑定ID，LoadBindingOverridesFromJson按ID寻找对应项。每次new InputAction产生的绑定身份可能不同，即使名字一直叫Fire，旧JSON也不一定能匹配新绑定，所以不能用名字相同推断恢复成功。",
            "多动作系统应使用保留稳定绑定ID的.inputactions资源，并按适用方式保存覆盖。这个例子选择只存唯一绑定路径，正是避开随机身份匹配问题。索引0成立是因为结构只有一项，不能不加说明扩展到复杂资源。"
          ]
        },
        {
          "title": "复合绑定要找到具体子项",
          "paragraphs": [
            "Move可能包含复合父项和上下左右子项，还有键盘与手柄等多组绑定。直接改索引0，可能碰到复合父项或另一个方案，不是玩家选择的“向上”。先确认动作、绑定组、身份及复合部分，再应用覆盖。",
            "资源更新后增删绑定，旧索引也可能改变含义。应考虑迁移或回退，而不是因为某次保存成功就默认以后都有效。独立练习可以先为一个复合子项建立明确定位，再验证结构变化时是否仍然正确。"
          ]
        },
        {
          "title": "交互式改键也是一个临时模式",
          "paragraphs": [
            "PerformInteractiveRebinding监听玩家接下来操作的控件。开始前应按文档停用被改动作，并防止玩法把这次输入当成攻击。设置允许控件、取消键和必要过滤，避免鼠标移动或取消本身成为错误新绑定。",
            "监听成功、取消、组件关闭与场景结束都可能终止过程。每条路径都应释放RebindingOperation并恢复正确输入模式。只在成功时清理，会让取消后仍有旧监听，或者动作一直停用，表现成改键后游戏无法操作。"
          ]
        },
        {
          "title": "冲突不是API自动替你决定",
          "paragraphs": [
            "两个动作都绑定Enter可能合法，也可能冲突。需要选择允许、拒绝、交换或提示，并考虑它们是否在同一时刻启用。不同Map上的同键，不应直接按一个全局按键表判定必然错误。",
            "检测冲突时也不要随意启用所有动作去试，否则可能真的触发行为。保存、显示刷新、动作恢复和输入缓存应依次检查。改键界面成功关掉，只证明界面流程结束，不证明当前会话已经恢复到预期操作模式。"
          ]
        },
        {
          "title": "用完整往返而非当前成功验证",
          "paragraphs": [
            "依次测试默认键、应用覆盖、新键生效旧键不触发、保存、停止重新播放、恢复默认，再重启。只看刚改完能够触发，无法证明持久化。再加入取消、关闭组件和无效配置，验证失败没有误改默认资源。",
            "本例的Use Enter不是交互式监听，只是固定目标路径的演示，实验需另补交互流程。没有真实手柄时不声称全设备改键已通过。把支持范围与失败路径写清，才能分辨示例展示的原则和完整产品仍需完成的部分。"
          ]
        }
      ],
      "code": {
        "title": "单按钮覆盖的保存往返",
        "language": "csharp",
        "filename": "BindingOverrideProbe.cs",
        "source": "using System;\nusing UnityEngine;\nusing UnityEngine.InputSystem;\npublic sealed class BindingOverrideProbe : MonoBehaviour\n{\n    const string Key = \"learning.fire.singleBindingPath.v2\";\n    InputAction fire;\n    void Awake()\n    {\n        fire = new InputAction(\"Fire\", InputActionType.Button, \"<Keyboard>/space\");\n        try\n        {\n            if (PlayerPrefs.HasKey(Key))\n                fire.ApplyBindingOverride(0, PlayerPrefs.GetString(Key));\n        }\n        catch (Exception error) { Debug.LogWarning(error.Message, this); }\n    }\n    void OnEnable() => fire.Enable();\n    void OnDisable() => fire.Disable();\n    void Update() { if (fire.WasPressedThisFrame()) Debug.Log(\"Fire\", this); }\n    [ContextMenu(\"Use Enter\")]\n    void Rebind()\n    {\n        fire.ApplyBindingOverride(0, \"<Keyboard>/enter\");\n        PlayerPrefs.SetString(Key, fire.bindings[0].overridePath);\n        PlayerPrefs.Save();\n    }\n    [ContextMenu(\"Restore default\")]\n    void Restore()\n    {\n        fire.RemoveAllBindingOverrides();\n        PlayerPrefs.DeleteKey(Key);\n        PlayerPrefs.Save();\n    }\n    void OnDestroy() => fire.Dispose();\n}",
        "explanation": [
          "播放模式执行组件菜单。唯一按钮使用索引0，保存的是overridePath；重建动作后恢复该路径，不按旧随机ID找绑定。",
          "多动作持久化应使用稳定.inputactions资源与覆盖JSON，并明确动作由谁管理。示例未实现交互监听、冲突检测，PlayerPrefs仅存非敏感学习配置。"
        ]
      },
      "lab": [
        {
          "title": "完成保存往返",
          "minutes": 60,
          "steps": [
            "默认空格测试后，在播放模式执行Use Enter，比较两个按键。",
            "停止并重播确认Enter仍有效，执行Restore default后再重播确认空格恢复。",
            "记录两次新建动作的绑定ID与路径，解释本例存路径而多绑定JSON需要稳定资源。"
          ],
          "result": "当前修改、重启恢复与默认还原都有验证。"
        },
        {
          "title": "补上交互改键流程",
          "minutes": 60,
          "steps": [
            "按官方RebindingOperation建立监听，限定按钮类型并设置取消键。",
            "分别完成、取消和关闭组件，检查监听释放及输入模式恢复。",
            "为两个动作写冲突策略，再选定Move中一个明确复合子项测试。"
          ],
          "result": "每条结束路径都不会留下旧监听或停用的动作。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "改索引0，却没有改到期望方向键",
          "cause": "复合绑定可能有父项、子项与多个方案，0并不普遍代表某个方向。",
          "fix": "确认动作、绑定组、身份和复合子项，再应用覆盖。"
        },
        {
          "symptom": "取消改键后角色不能再操作",
          "cause": "取消路径没有结束旧监听，或没有重新启用应有动作。",
          "fix": "逐一测试完成、取消、禁用和销毁，配对释放操作与恢复模式。"
        }
      ],
      "exercise": {
        "brief": "制作支持取消与恢复默认的单动作改键，再为Move的一个复合子项实现可靠定位，记录保存格式版本。",
        "deliverables": [
          "覆盖数据与版本说明",
          "完整终止路径代码",
          "重启往返与冲突测试"
        ],
        "rubric": [
          {
            "item": "默认与覆盖分离",
            "points": 25
          },
          {
            "item": "目标绑定定位可靠",
            "points": 25
          },
          {
            "item": "取消释放与模式恢复完整",
            "points": 25
          },
          {
            "item": "持久化和默认恢复正确",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "运行时 binding override 通常会直接改项目默认资源吗？",
          "options": [
            "不会，它改变有效绑定而保留默认配置",
            "会直接改磁盘上的动作资源",
            "保存PlayerPrefs就会自动改源资源",
            "只有关闭动作时才会覆盖资源文件"
          ],
          "answer": 0,
          "explanation": "运行时覆盖与资源默认值分开，移除覆盖可以恢复原配置。"
        },
        {
          "question": "交互式改键取消后最需要检查？",
          "options": [
            "只看改键面板是否关闭",
            "操作释放、动作恢复和模式恢复",
            "只看配置文件是否存在",
            "只要没报错就无需检查监听"
          ],
          "answer": 1,
          "explanation": "取消也是结束路径，应确保旧监听结束且输入恢复。"
        },
        {
          "question": "每次 new 同名 InputAction 后直接加载上次的覆盖 JSON，为什么可能恢复失败？",
          "options": [
            "动作名字相同就必然匹配",
            "PlayerPrefs不能保存字符串",
            "新绑定ID不同，而JSON按ID匹配",
            "只要Enable在Load之后就一定匹配"
          ],
          "answer": 2,
          "explanation": "稳定绑定身份不可由同名代替；本例因此只恢复唯一绑定路径。"
        }
      ],
      "references": [
        {
          "label": "Rebind an action at runtime",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/rebind-action-runtime.html"
        },
        {
          "label": "InputActionRebindingExtensions",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.InputActionRebindingExtensions.html"
        }
      ],
      "summary": [
        "个人覆盖保留默认配置，恢复默认应移除覆盖。",
        "JSON按绑定ID恢复，必须考虑稳定身份。"
      ],
      "teaching": {
        "question": "玩家把空格改成Enter，怎样保存个人选择，又让“恢复默认”还能回到空格？",
        "keyIdea": "默认绑定保留设计值，运行时覆盖保存玩家选择。单按钮示例保存路径；多绑定JSON恢复需要稳定绑定身份，不能只靠动作同名。",
        "walkthrough": [
          {
            "title": "验证默认状态",
            "text": "运行BindingOverrideProbe，默认空格触发Fire；记录绑定path、overridePath和effectivePath的区别。"
          },
          {
            "title": "应用个人选择",
            "text": "在播放模式执行Use Enter，overridePath变为Enter，保存这条路径，再停止并重新播放检验恢复。"
          },
          {
            "title": "还原设计默认",
            "text": "执行Restore default，移除覆盖并删除对应PlayerPrefs，再重新播放，确认空格恢复而Enter不再替代。"
          }
        ],
        "prediction": {
          "question": "每次new同名InputAction，再读上次覆盖JSON，是否保证恢复成功？",
          "answer": "不保证。新绑定ID可能改变，而覆盖JSON按ID匹配；应使用稳定.inputactions资源，或像本例只恢复唯一绑定路径。"
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
      "id": "l030",
      "title": "输入缓冲与固定步消费：让按键不丢、不重复",
      "prerequisites": [
        "l029"
      ],
      "goals": [
        "分别保存持续方向与一次请求",
        "用截止时间限制输入缓冲",
        "证明成功后清除请求且不重复处理"
      ],
      "theory": [
        {
          "title": "读取和执行可能不是同一次更新",
          "paragraphs": [
            "动态输入通常在相应输入更新中处理，角色Update采样，物理FixedUpdate按固定步执行。某个渲染帧可以没有固定步，也可能有多个。因此不能假定每次短按都恰好对应一次FixedUpdate。",
            "若只在固定步查询动态输入帧边沿，可能漏掉没有固定步时发生的短按；若把一次按下标记留着不清，又可能在多个固定步重复执行。问题不是按键不灵，而是输入结果没有按正确寿命在两个阶段之间保存。"
          ]
        },
        {
          "title": "持续方向与一次请求分别保存",
          "paragraphs": [
            "移动方向表示现在想往哪里走，可以保存最新向量，供多个固定步重复读取。跳跃表示发生了一次请求，通常不能因为多次读取就重复跳跃。两者虽然来自同一个输入系统，处理次数要求却不同。",
            "可以把请求想成一张待处理记录，但不要把这个类比延伸成无限队列。最简单实现只有一个pending标记，表示有一条最近请求。再次按下会更新它，旧请求不另留一份；这是一种明确选择，适合先理解基本问题。"
          ]
        },
        {
          "title": "有效期让请求不会无限延期",
          "paragraphs": [
            "示例按下时记录当前游戏时间，再加0.15秒作为expires。固定步检查是否超过截止时间，超过便清除。假设在落地前0.1秒按跳跃，落地后仍可响应；若早了0.3秒，就不会在之后突然执行。",
            "缓冲宽容的是请求时刻。土狼时间宽容的是离开地面后仍允许跳跃的条件时刻，两者可以组合，但不是同一规则。先分别测试，再决定窗口大小，才知道手感变化来自哪项处理。"
          ]
        },
        {
          "title": "处理条件由实际规则判断",
          "paragraphs": [
            "输入层只报告玩家想跳。是否落地、是否受控、能量是否足够，应由负责角色状态的逻辑判断。示例用Inspector的canConsume代表一个可控制条件，方便测试算法，并没有实现真实落地检测。",
            "条件暂时不满足且未过期，可以保留；成功接受后立即清除pending，再执行结果。若多个系统都把同一条请求当作授权，仍可能重复改变状态，因此应有明确接受入口，再通知动画与音效显示已发生的事实。"
          ]
        },
        {
          "title": "使用同一种时钟比较时间",
          "paragraphs": [
            "输入系统事件时间与Time.time不是可以不加条件混算的两个数。示例在采样时用Time.timeAsDouble记录，在相同游戏时间思路下比较，使单位与缩放选择明确。更精密输入需要另外说明时间基准转换。",
            "选择游戏时间意味着暂停时窗口行为与游戏时间一起变化；菜单切换是否清掉请求，则还要另行决定。不要只调整timeScale就假定所有缓存都已清空。组件禁用时本例明确清pending，避免重新启用后执行旧输入。"
          ]
        },
        {
          "title": "默认输入更新模式是实验前提",
          "paragraphs": [
            "本例按默认动态输入更新安排Update读取、FixedUpdate处理。改成固定输入更新后，读取时机与边沿含义也会变化，应重新检查查询所在阶段，而不是只改设置却继续引用旧实验结论。",
            "短按测试应记录按下次数、pending变化、截止时刻和处理步。这样能区分输入没有产生、请求过期、条件未允许与重复执行。只听玩家说感觉偶尔丢键，不能直接判断究竟是哪一层出了问题。"
          ]
        },
        {
          "title": "用边界时序确认不漏不重",
          "paragraphs": [
            "测试有效期内与期外开放条件、无固定步的帧、同帧多个固定步、禁用启用、暂停和菜单转换。每条请求最多处理一次，但有些请求可以被规则拒绝，因此输入次数与结果次数不必永远相等。",
            "如果要保留连续多次请求，应改为有容量和期限的队列，并规定过载时保留哪些，而不是无限累积。记录请求编号与接受原因，才能证明恢复后没有延迟连发。这个实验先证明保存与处理规则，真正角色还要接入物理检测再验证。"
          ]
        }
      ],
      "code": {
        "title": "用受控条件测试有限缓冲",
        "language": "csharp",
        "filename": "BufferedCommandProbe.cs",
        "source": "using UnityEngine;\nusing UnityEngine.InputSystem;\npublic sealed class BufferedCommandProbe : MonoBehaviour\n{\n    [SerializeField] bool canConsume = true;\n    [SerializeField, Min(0f)] float bufferSeconds = 0.15f;\n    InputAction jump;\n    bool pending;\n    double expires;\n    void Awake() => jump = new InputAction(\"Jump\", InputActionType.Button, \"<Keyboard>/space\");\n    void OnEnable() => jump.Enable();\n    void Update()\n    {\n        if (!jump.WasPressedThisFrame()) return;\n        pending = true;\n        expires = Time.timeAsDouble + bufferSeconds;\n    }\n    void FixedUpdate()\n    {\n        if (!pending) return;\n        if (Time.timeAsDouble > expires) { pending = false; return; }\n        if (!canConsume) return;\n        pending = false;\n        Debug.Log(\"Consumed exactly once.\", this);\n    }\n    void OnDisable() { jump.Disable(); pending = false; }\n    void OnDestroy() => jump.Dispose();\n}",
        "explanation": [
          "保持Input System默认动态更新。canConsume只是Inspector中的算法测试条件，不代表真实落地。示例保留最近一条请求，用游戏时间计算0.15秒窗口，禁用时清除请求。"
        ]
      },
      "lab": [
        {
          "title": "检查一次请求只处理一次",
          "minutes": 60,
          "steps": [
            "保持动态输入更新，改变固定步长，制造采样与物理步频率不同的条件。",
            "短按一次，记录输入次数、pending变化与处理次数，检查多个固定步不重复。",
            "禁用再启用组件，确认旧pending清除，记录不会补执行旧请求。"
          ],
          "result": "每条请求最多成功处理一次，拒绝原因可说明。"
        },
        {
          "title": "比较窗口内外",
          "minutes": 60,
          "steps": [
            "令canConsume为false，按键后在0.15秒窗口内开放条件，观察处理。",
            "再次按键但在窗口外才开放条件，确认旧请求被丢弃。",
            "测试暂停与菜单切换，写清时钟和清理选择，并区分缓冲与土狼时间。"
          ],
          "result": "缓冲仅提供有限宽容，不永久排队。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "快速短按有时没有跳跃",
          "cause": "输入变化与固定步不一一对应，未把请求保存到处理时。",
          "fix": "在输入阶段记录请求与有效期，再让固定步检查和处理。"
        },
        {
          "symptom": "恢复条件后连续执行多次旧跳跃",
          "cause": "成功后未清请求，或没有限制积压与过期。",
          "fix": "处理成功立即清除，并规定窗口、容量和切模式时怎样丢弃。"
        }
      ],
      "exercise": {
        "brief": "将移动方向与跳跃请求组织成不依赖设备的输入数据，加入请求编号和有效期，给出6种可复现时序测试。",
        "deliverables": [
          "意图接口与缓冲代码",
          "请求消费日志",
          "暂停与模式切换协议"
        ],
        "rubric": [
          {
            "item": "持续与离散数据分离",
            "points": 25
          },
          {
            "item": "一次消费与过期正确",
            "points": 25
          },
          {
            "item": "时钟与模式策略明确",
            "points": 25
          },
          {
            "item": "边界时序测试完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "持续移动和跳跃请求最重要的差别是？",
          "options": [
            "持续值可重复读，一次请求要规定最多处理次数",
            "两者都应永远保持true",
            "跳跃请求不需要跨阶段保存",
            "只要都在FixedUpdate就不会丢失"
          ],
          "answer": 0,
          "explanation": "两种数据的有效时长和处理次数不同，必须分别保存。"
        },
        {
          "question": "输入缓冲与土狼时间是否完全相同？",
          "options": [
            "相同，都是把速度调大",
            "不同，分别宽容请求时间与条件时间",
            "只有名字不同，判断条件完全一样",
            "两者都不需要时间窗口"
          ],
          "answer": 1,
          "explanation": "提前请求与离地后仍允许，是不同边界，可以独立测试和组合。"
        },
        {
          "question": "永久保留所有失败输入可能造成什么？",
          "options": [
            "永远降低延迟",
            "只要条件恢复就自动改善手感",
            "条件恢复后可能连发过期命令",
            "只会增加内存，不影响行为"
          ],
          "answer": 2,
          "explanation": "缓冲需要有效期、容量与模式切换清理，否则旧请求会变成延迟行为。"
        }
      ],
      "references": [
        {
          "label": "InputAction",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/api/UnityEngine.InputSystem.InputAction.html"
        },
        {
          "label": "Input System settings",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/Settings.html"
        }
      ],
      "summary": [
        "采样与物理处理之间需要明确保存数据。",
        "请求必须有有效期、容量和成功后清除规则。"
      ],
      "teaching": {
        "question": "快速按一下跳跃，为什么有时固定更新没读到；把标记留着以后，又为什么连续跳了几次？",
        "keyIdea": "读取输入和执行物理不一定同频。持续方向可以反复读取，一次请求要暂存、限定有效期，并在成功处理后清除。",
        "walkthrough": [
          {
            "title": "记录短按",
            "text": "在默认动态输入更新下，Update发现按下就令pending=true，记录expires=当前游戏时间+0.15秒。"
          },
          {
            "title": "等待可执行",
            "text": "FixedUpdate发现请求未过期但canConsume=false，先保留。若条件在有效期内变真，允许处理。"
          },
          {
            "title": "只处理一次",
            "text": "执行前把pending清为false，所以同一渲染帧里的其他固定步不会再次处理同一请求。"
          }
        ],
        "prediction": {
          "question": "请求在0.15秒后过期，直到0.3秒才允许跳跃，还应执行旧请求吗？",
          "answer": "不应。本例会丢弃过期请求。缓冲是短时间宽容，不是永久排队等条件出现。"
        }
      }
    }
  ]
});
