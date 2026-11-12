window.COURSE_MODULES.push({
  "id": "m01",
  "number": 1,
  "title": "引擎对象与学习方法",
  "subtitle": "先建立可验证的引擎模型",
  "description": "用最小场景理解对象、组件、资源和运行时边界；建立版本记录、实验预测与故障证据习惯。",
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
      "id": "l001",
      "title": "从照着操作到提出可验证的问题",
      "prerequisites": [],
      "goals": [
        "把角色移动拆成可以分别观察的步骤",
        "记录版本与实验前后唯一改变的条件",
        "用手册和脚本参考区分观察与保证"
      ],
      "theory": [
        {
          "title": "把最后的现象拆成中间步骤",
          "paragraphs": [
            "按右方向键后，角色应该往右走。从按键到画面变化，至少要经过读取输入、计算方向、设置速度、推进位置和绘制对象。任一步没有接上，都可能表现为“不动”。只盯着最后一行移动代码，很容易错过更早的问题。",
            "先分别问：读到的方向是否非零？刚体速度变了吗？位置变了但相机没拍到吗？这些问题都有可观察的数值。拆开以后，即使还不知道答案，也能知道接下来检查什么。先理解这条过程，再学每个接口，知识才有可以连接的位置。"
          ]
        },
        {
          "title": "一次只改变一个条件",
          "paragraphs": [
            "假设要检查禁用脚本是否阻止 Awake。先建立空对象，只挂一个打印脚本，保持对象活动，关闭脚本自己的勾选框，再运行。结果只对应“对象活动、脚本禁用”这一组条件，不能直接推广到关闭整个对象。",
            "接着恢复脚本勾选，改为关闭对象，再从头测试。保留其他条件，才容易解释两次差别。若同时换脚本、场景和输入设置，即使恢复正常，也不知道是哪项起效。失败结果同样值得记录，因为它可以排除原先的一种解释。"
          ]
        },
        {
          "title": "记录环境才方便比较",
          "paragraphs": [
            "两个项目都使用 Unity，不表示环境相同。编辑器版本、包版本、渲染管线、目标平台和播放模式设置，都可能影响示例。除了记录 Unity 6.3 LTS，还应保留具体版本号，输入包则另外到 Package Manager 查看。",
            "环境探针只证明它实际读取的内容，不能顺便证明所有包都匹配。截图适合保存 Inspector，日志适合记录调用与数值，Profiler 适合分析时间。先确认问题，再选择证据；一张角色能动的截图不能说明每个步骤如何执行。"
          ]
        },
        {
          "title": "从问题进入官方文档",
          "paragraphs": [
            "不知道 Rigidbody 负责什么时，先读手册建立概念；要了解 AddForce 的参数和限制时，打开对应成员的脚本参考。依次找输入、结果、调用条件和注意事项，再看示例，避免只根据方法名猜测行为。",
            "官方示例往往突出一个接口，可能没有展示完整错误处理。复制前要确认需要的组件、输入系统和对象寿命。把这些前提写进自己的笔记，再对照当前场景。文档保证、自己观察和工程建议可以互相帮助，却不应混为同一种证据。"
          ]
        },
        {
          "title": "写成别人能重做的记录",
          "paragraphs": [
            "记录应包括问题、预测、唯一改动、观察和仍未排除的原因。例如“对象活动时禁用脚本，仍打印 Awake”，比“关闭后还执行”明确得多，后者没有说明究竟关闭了哪个开关。下一次实验应优先回答仍然不确定的部分。",
            "五小时包括阅读、搭建、比较、独立练习和复盘，不是网页打开的时间。完成后换一个对象或条件，再独立预测结果。如果能用同一规则解释变化，才说明经验开始变成可重复使用的知识。记录被证明错误的预测，也能看见自己的理解如何改变。"
          ]
        },
        {
          "title": "把一个猜想变成下一次预测",
          "paragraphs": [
            "假设你认为角色不动是因为没有读到输入，就先打印输入值。若数值始终为零，接下来检查设备、焦点和绑定；若数值已经变化，就暂时把输入链路放到一边，去看刚体速度。每次观测都应决定下一步，而不是在所有设置之间来回试。",
            "这也说明为什么实验前要写预测。先写下来，结果出来后才能知道自己原本理解哪里有偏差。如果等结果出现再补一个理由，很容易把任何现象都说成早已知道，却没有形成能预测新情况的模型。保留原预测和修改后的解释，能避免这种错觉。"
          ]
        }
      ],
      "code": {
        "title": "环境探针：先记录实验前提",
        "language": "csharp",
        "filename": "EnvironmentProbe.cs",
        "source": "using UnityEngine;\npublic sealed class EnvironmentProbe : MonoBehaviour\n{\n    void Start()\n    {\n        Debug.Log($\"Unity={Application.unityVersion}; platform={Application.platform}\");\n        Debug.Log($\"fixedDeltaTime={Time.fixedDeltaTime}; timeScale={Time.timeScale}\");\n    }\n}",
        "explanation": [
          "在空场景创建 Probe，挂探针，清空 Console 后运行，将两条日志复制到笔记。包版本需要另外记录，脚本也没有测量实际帧率。"
        ]
      },
      "lab": [
        {
          "title": "建立独立实验场景",
          "minutes": 60,
          "steps": [
            "新建空场景并保存，记录编辑器、输入包、渲染管线与目标平台。",
            "创建Probe并挂环境探针，清空Console后运行，保存本轮两条日志。",
            "把Fixed Timestep从0.02改成0.01后重跑，其余设置保持不变；比较后恢复原值。"
          ],
          "result": "记录能证明固定步长设置变化，并指出它没有测量帧率。"
        },
        {
          "title": "纠正一个过强预测",
          "minutes": 60,
          "steps": [
            "在笔记写下预测：禁用脚本后是否任何函数都不执行，并说明禁用的是哪个开关。",
            "在实验副本把打印入口改为Awake，保持对象活动而禁用脚本，运行并保存结果。",
            "再关闭整个对象重跑，对照官方说明，将原预测改成包含对象状态的结论。"
          ],
          "result": "能分别解释禁用组件与未激活对象，而不使用含糊的“关闭后”。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "同样代码在另一个教程中无法编译",
          "cause": "编辑器 API 或包版本不一致",
          "fix": "记录完整版本，在对应版本文档确认成员及命名空间"
        },
        {
          "symptom": "日志数量少于实际执行次数",
          "cause": "Console 开启 Collapse 折叠相同日志",
          "fix": "关闭 Collapse 并在日志中加入帧号或计数器"
        }
      ],
      "exercise": {
        "brief": "选一个以前只会照着做的功能，提出3个关于运行过程的问题，再选择其中1个用对照实验回答。",
        "deliverables": [
          "环境清单",
          "预测、对照、结果、限制四段实验记录",
          "两条官方文档与相关段落的中文释义"
        ],
        "rubric": [
          {
            "item": "问题确实涉及引擎机制",
            "points": 25
          },
          {
            "item": "对照组仅改变一个变量",
            "points": 25
          },
          {
            "item": "证据可由他人复现",
            "points": 25
          },
          {
            "item": "结论说明适用边界",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "十次运行中 A 都先于 B 执行，最严谨的结论是什么？",
          "options": [
            "十次重复已证明顺序保证",
            "当前条件下观察如此，仍需查文档保证",
            "对象名字不变就一定保持顺序",
            "再运行一次就能推广到所有场景"
          ],
          "answer": 1,
          "explanation": "重复观察不能补出文档没有承诺的顺序。记录观察条件，再查官方规定。"
        },
        {
          "question": "查一个方法返回值及调用限制，优先读哪里？",
          "options": [
            "对应成员的脚本参考页",
            "只看组件提示",
            "只看示例最后一行",
            "只按方法名推断"
          ],
          "answer": 0,
          "explanation": "成员页说明参数、返回值与调用限制，手册再补充系统背景。"
        },
        {
          "question": "五小时课程预算主要表示什么？",
          "options": [
            "所有人都必须连续读五小时",
            "打开网页满五小时就完成",
            "完成阅读、实验、迁移与复盘的建议投入",
            "各项活动耗时必须完全相同"
          ],
          "answer": 2,
          "explanation": "这是学习活动预算，应记录实际投入与产物。"
        }
      ],
      "references": [
        {
          "label": "Application.unityVersion",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-unityVersion.html"
        },
        {
          "label": "MonoBehaviour.Awake",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.Awake.html"
        }
      ],
      "summary": [
        "一次只检验一个问题，记录预测与实际结果。",
        "观察到的结果需要附带条件，不能自动变成引擎保证。"
      ],
      "teaching": {
        "question": "同一段移动脚本在教程里正常，在你的场景里却不动，怎样找出到底是哪一步出了问题？",
        "keyIdea": "从按键到画面变化，中间有几个步骤。每次只改变一个条件并比较前后结果，才能知道哪一步造成差别。",
        "walkthrough": [
          {
            "title": "记录起点",
            "text": "在空场景建立 Probe 并运行探针，记录编辑器版本、固定步长和时间缩放，暂时不加入角色和插件。"
          },
          {
            "title": "改变条件",
            "text": "把 Fixed Timestep 从 0.02 改为 0.01，其他配置不变，重新运行并将两组日志并排比较。"
          },
          {
            "title": "限定结论",
            "text": "日志能证明固定步长设置改变，却没有记录渲染帧率；要讨论画面流畅度，还需另测显示和时间。"
          }
        ],
        "prediction": {
          "question": "连续十次都是 A 先打印，能否断言 Unity 保证它在前？",
          "answer": "不能。十次结果只能说明当前观察；是否保证顺序，应查看对应回调的官方说明和适用条件。"
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
      "id": "l002",
      "title": "GameObject 与 Component：组合为什么是引擎的基础",
      "prerequisites": [
        "l001"
      ],
      "goals": [
        "指出显示、碰撞和脚本分别由什么组件负责",
        "解释activeSelf与activeInHierarchy不同的原因",
        "用具体实例比较组件开关和对象开关"
      ],
      "theory": [
        {
          "title": "对象的能力来自组件",
          "paragraphs": [
            "创建空对象后，可以命名和移动它，却不会自动出现角色画面。添加 SpriteRenderer 并指定图片，它才有显示能力；添加 Collider，物理系统才有接触形状。GameObject 可以理解成把这些组件组织到一起的容器。",
            "容器并不替所有组件工作。Renderer 负责画面，Collider 描述形状，Rigidbody 参与物理运动，脚本执行自定义规则。遇到问题先找到负责该功能的组件，比把整个角色当成一个无法拆分的整体更容易排查。"
          ]
        },
        {
          "title": "组件开关各管一部分",
          "paragraphs": [
            "Cube 同时有显示、碰撞和移动脚本。只禁用 Renderer 后，画面里看不到它，但碰撞与脚本仍可能工作。因此“看不见”不能直接推出“已经停止运行”。这个实验最重要的地方，是把视觉结果与其他系统分开观察。",
            "脚本自己的 enabled 又是另一个开关。它影响 Update 等要求启用状态的回调，却不能概括为任何函数都不能调用。Awake 和部分物理消息有自己的条件。判断某个回调时要看具体文档，不要把 Renderer 的效果照搬到脚本。"
          ]
        },
        {
          "title": "父级影响当前是否活动",
          "paragraphs": [
            "对象名字旁的开关作用于整个 GameObject。关闭它会影响多种组件，也会影响子对象在层级中能否活动。这里有两个值：activeSelf 表示对象自己的设置，activeInHierarchy 表示考虑父级之后当前是否活动。",
            "Root 关闭、Child 自己开启时，Child 的前者为真、后者为假。这不矛盾：自己的选择被保留，却暂时被父级阻止生效。重新打开 Root，Child 可以恢复而不用重新勾选。同时记录两个值，比只看一个勾选框更能解释结果。"
          ]
        },
        {
          "title": "相同类型可以有多个实例",
          "paragraphs": [
            "A、B 两个对象挂相同脚本，会得到两个组件实例。普通实例字段各自保存数据：改 A 的 speed，不会自动改 B。脚本文件相同只说明行为定义相同，不表示运行中的所有字段只有一份。",
            "两个组件也可以主动引用同一资源，或者通过 static 共享数据，但那是另外建立的关系。日志应带对象上下文，方便确认来自 A 还是 B；两个同名对象也可能是不同实例，不能只靠名字判断某个方法是否重复执行。"
          ]
        },
        {
          "title": "从存在继续查到工作条件",
          "paragraphs": [
            "有 Renderer 不代表相机一定画到它，位置、遮罩和材质仍会影响结果。有 Collider 不代表任意两个物体都会碰撞，物理层与刚体配置也需要满足条件。组件存在是起点，不是功能正常的完整证明。",
            "可依次检查：实例在不在，层级是否活动，相关组件是否开启，系统是否允许处理，数据是否已赋值。这是排查方法，不是引擎新增规定。每次把“没反应”缩小到其中一项，再改一个相关设置，才能说明结果为什么发生。"
          ]
        },
        {
          "title": "看不到的对象也要能找到",
          "paragraphs": [
            "关闭 Renderer 后，可以在 Hierarchy 选择对象，查看 Transform 是否仍改变，再通过受控的接触实验检查 Collider。不要只用 Game 画面判断它是否存在。反过来，Scene 视图里看见编辑辅助轮廓，也不能说明游戏相机一定会绘制该对象。",
            "复制两个对象时，给它们临时命名为 A 和 B，并在日志中加入对象上下文。只修改 A 的字段，分别选中两者核对数值。这个小实验同时检查了组件分工、实例身份和显示证据的范围。以后排查复杂角色时，也可以先把问题缩到一个组件和一个明确实例。"
          ]
        }
      ],
      "code": {
        "title": "观察对象有效性",
        "language": "csharp",
        "filename": "ActiveStateProbe.cs",
        "source": "using UnityEngine;\npublic sealed class ActiveStateProbe : MonoBehaviour\n{\n    void OnEnable() => Debug.Log($\"{name}: OnEnable\");\n    void OnDisable() => Debug.Log($\"{name}: OnDisable\");\n    void Start() => Report();\n    [ContextMenu(\"Report state\")]\n    void Report()\n    {\n        Debug.Log($\"self={gameObject.activeSelf}, hierarchy={gameObject.activeInHierarchy}, enabled={enabled}\");\n    }\n}",
        "explanation": [
          "在 Root 下创建 Child，将脚本挂到 Child。从组件菜单执行 Report state，比较自身活动与层级活动状态。菜单直接调用方法，不代表禁用组件仍会收到 Update。"
        ]
      },
      "lab": [
        {
          "title": "分别关闭三个开关",
          "minutes": 60,
          "steps": [
            "创建Cube，保留Renderer和Collider，另挂状态探针，先记录全部开启时的结果。",
            "每次只关闭Renderer、脚本或GameObject中的一个，测试后恢复，再检查其他项。",
            "分别记录画面、日志与受控碰撞结果，指出哪些变化属于哪个组件。"
          ],
          "result": "得到开关与各系统结果的对应表，不用不可见推断不存在。"
        },
        {
          "title": "比较父子活动状态",
          "minutes": 60,
          "steps": [
            "建立Root/Child，Child保持自身开启，将探针挂Child。",
            "只关闭Root，从组件菜单报告Child状态，再开启Root并比较。",
            "复制出A、B两个实例，只改A的字段，点击日志上下文确认来源。"
          ],
          "result": "解释自身开关与层级结果不同，并能识别独立实例。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "子对象勾选着却不显示",
          "cause": "父层级未激活或 Renderer 被单独关闭",
          "fix": "逐层检查 activeInHierarchy，再检查 Renderer 与摄像机"
        },
        {
          "symptom": "禁用移动脚本后对象仍下落",
          "cause": "刚体模拟并不由移动脚本的 enabled 开关控制",
          "fix": "按目标选择刚体约束或暂停策略，不混淆组件职责"
        }
      ],
      "exercise": {
        "brief": "用一个简单对象验证显示、碰撞与脚本可分别控制，列出“隐藏但可碰撞”等4种配置与预期结果。",
        "deliverables": [
          "职责与引用图",
          "四组开关截图",
          "每组预期与实际结果"
        ],
        "rubric": [
          {
            "item": "组件职责解释正确",
            "points": 25
          },
          {
            "item": "四种配置均可复现",
            "points": 25
          },
          {
            "item": "父层级条件被记录",
            "points": 25
          },
          {
            "item": "无隐藏的全局查找依赖",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "父对象关闭、子对象自己勾选时，子对象状态是？",
          "options": [
            "两者都真",
            "activeSelf 真，activeInHierarchy 假",
            "两者都假",
            "activeSelf 假，activeInHierarchy 真"
          ],
          "answer": 1,
          "explanation": "子对象自己的开关被保留，但父级关闭使它在层级中不活动。"
        },
        {
          "question": "只禁用 Renderer，通常会发生什么？",
          "options": [
            "所有脚本一起停止",
            "对象马上被销毁",
            "停止绘制，其他系统仍可能工作",
            "所有子对象自身开关都取消"
          ],
          "answer": 2,
          "explanation": "Renderer 的开关只负责相关显示，没有等同于关闭整个对象。"
        },
        {
          "question": "两个对象同类型组件中的普通实例字段通常是什么关系？",
          "options": [
            "各自拥有实例字段值",
            "修改一方立即同步另一方",
            "脚本相同所以总共享字段",
            "只有选中的组件可以保存数值"
          ],
          "answer": 0,
          "explanation": "类型定义可以相同，具体实例仍各有自己的状态。"
        }
      ],
      "references": [
        {
          "label": "GameObjects",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/class-GameObject.html"
        },
        {
          "label": "GameObject.activeInHierarchy",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/GameObject-activeInHierarchy.html"
        }
      ],
      "summary": [
        "关闭显示组件不等于关闭碰撞或脚本。",
        "父级影响层级活动结果，不会自动抹掉子级自己的开关设置。"
      ],
      "teaching": {
        "question": "只关闭 Cube 的显示后为什么还能碰撞，关闭父对象后子对象的自身勾选又为什么没有取消？",
        "keyIdea": "GameObject 把不同组件放在一起。组件开关各有影响范围，而层级活动状态还受到父对象的影响。",
        "walkthrough": [
          {
            "title": "看组件分工",
            "text": "创建 Cube，分别找到 MeshRenderer 与 Collider，确认画面和碰撞形状由不同组件提供。"
          },
          {
            "title": "只关显示",
            "text": "取消 MeshRenderer 的 Enabled，比较画面与物理接触，确认没有删除 Collider 或移动脚本。"
          },
          {
            "title": "再关父级",
            "text": "将 Cube 放到 Root 下并关闭 Root，同时打印两个活动状态，比较自身设置和层级生效结果。"
          }
        ],
        "prediction": {
          "question": "重新打开 Root，需要再勾选原本开启的 Child 吗？",
          "answer": "通常不需要。Child 自己的开启设置还在，父级恢复后它可以重新在层级中活动。"
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
      "id": "l003",
      "title": "Asset、Scene 与 Prefab：三种不同的持久化边界",
      "prerequisites": [
        "l002"
      ],
      "goals": [
        "区分Project资源、编辑场景和运行实例",
        "预测应用或撤销Prefab覆盖会改变谁",
        "检查一次修改实际保存到了哪里"
      ],
      "theory": [
        {
          "title": "资源与使用它的对象不同",
          "paragraphs": [
            "Project 中的图片是一份资源。把它放入场景后，场景组件引用图片来显示。删除这个场景对象，不等于删除图片文件；其他对象仍能使用同一图片。先分清文件本身和谁在使用它，才能理解共享与删除的影响范围。",
            "Scene 保存有哪些对象、位置和组件配置。保存图片导入设置与保存场景，写入内容不同。遇到“保存后又变回去”，先确认刚才修改的是资源、场景，还是播放中的临时数据，再检查相应的保存操作。"
          ]
        },
        {
          "title": "模板产生多个具体实例",
          "paragraphs": [
            "敌人由身体、碰撞体和脚本组成，需要重复放十个时，可保存为 Prefab，再从模板创建实例。不必逐个重复搭结构，每个实例仍有自己的位置和运行状态。模板减少重复工作，却不会把所有敌人变成同一个场景对象。",
            "实例可以有特殊设置。把 A 缩放改为两倍，这个属性可能形成实例覆盖，也就是 A 在此处另有数值。模板后来修改同一属性时，A 是否跟随变化受覆盖影响。因此要查看覆盖提示，判断当前值来自模板还是实例。"
          ]
        },
        {
          "title": "应用和撤销是相反方向",
          "paragraphs": [
            "在 A 上改值，通常先只改变 A。希望其他实例采用修改，需要明确把相应覆盖应用到源资源；希望 A 放弃特殊设置，则撤销覆盖，让它重新使用模板值。操作方向不同，不能因为菜单都出现 Prefab 就随意点击。",
            "每次操作前写下预测：改哪一项，会影响 A、B 还是源资源？之后逐一比较。遇到嵌套模板时还要确认操作的是哪层。先在简单 Cube 上理解两个方向，再处理角色复杂层级，比靠删除重建恢复更有帮助。"
          ]
        },
        {
          "title": "播放副本不自动成为存档",
          "paragraphs": [
            "运行后 Instantiate 生成的是本次运行的实例。它可以移动、改名、受伤，但普通场景对象的播放修改通常不会在停止后自动写回编辑场景。停止后副本消失表示这次运行结束，不是刚才生成失败。",
            "玩家进度要另外保存需要的数据，并在之后读取，不能指望保存场景捕获全部运行状态。另一方面，编辑共享资源可能真的影响项目内容。实验前应确认正在改哪一类对象，尽量使用独立测试资源，避免将临时修改应用到正式模板。"
          ]
        },
        {
          "title": "引用依赖身份，也可能指向内部成员",
          "paragraphs": [
            "Unity 用 meta 等信息保留资源身份与导入设置。通过编辑器移动资源时，这些信息通常一起保留。若丢失 meta 后重新导入，即使文件名相同，也可能产生新身份，使原引用失效。资源与 meta 应一起管理。",
            "引用还可能指向文件内部的某个 Sprite，而非整张图片。重新切片以后，文件仍在，原来那帧却未必存在。排查时展开资源确认具体成员，并分清纹理、Sprite、AnimationClip 与 AnimatorController：它们的用途不同，缩略图相似也不能互换。"
          ]
        },
        {
          "title": "保存前说清要保留什么",
          "paragraphs": [
            "假设你只想保留敌人新的碰撞体大小，就应确认修改的是模板还是某个实例。如果目的是让所有敌人采用新形状，应检查对应源资源；如果只是场景里一个特殊敌人，就应保留局部覆盖，而不是顺手应用全部修改。",
            "保存以后关闭再打开场景，检查两个实例和源资源，能验证实际写入了哪里。播放前后再比较一次，可把编辑保存与运行变化分开。截图应同时标明所在窗口和选中对象，否则同一组数值可能来自不同容器，别人很难根据图片重现你的操作。"
          ]
        }
      ],
      "code": {
        "title": "实例化不会修改模板",
        "language": "csharp",
        "filename": "PrefabSpawnProbe.cs",
        "source": "using UnityEngine;\npublic sealed class PrefabSpawnProbe : MonoBehaviour\n{\n    [SerializeField] GameObject template;\n    void Start()\n    {\n        if (template == null) { Debug.LogError(\"Assign a prefab.\", this); return; }\n        GameObject copy = Instantiate(template, Vector3.right * 2f, Quaternion.identity);\n        copy.name = \"RuntimeCopy\";\n    }\n}",
        "explanation": [
          "脚本挂到空对象 Spawner，template 指向 Project 中的 Prefab。先用不带生成脚本的 Cube，避免新实例再次生成而无限递归。"
        ]
      },
      "lab": [
        {
          "title": "比较源与两个实例",
          "minutes": 60,
          "steps": [
            "制作Cube的Prefab，再放A、B两个实例到已保存场景。",
            "只改A缩放，检查Overrides；再改源的一个未覆盖字段，观察B与A。",
            "分别应用与撤销一项覆盖，操作前写预期影响范围，之后逐项核对。"
          ],
          "result": "能解释源修改、实例覆盖、应用和撤销的不同方向。"
        },
        {
          "title": "核对保存位置与身份",
          "minutes": 60,
          "steps": [
            "播放时让生成脚本创建副本，并修改副本名字与位置。",
            "停止播放，对比Hierarchy、Prefab资源和场景未保存标记，说明哪些只是运行变化。",
            "在Unity内移动Prefab文件夹，检查引用及meta；不要在正式资源上删除meta试验。"
          ],
          "result": "分清临时实例、编辑保存和资源身份。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "退出运行后位置修改消失",
          "cause": "修改的是播放模式中的临时实例",
          "fix": "在编辑模式设置并保存，必要时先复制所需数值"
        },
        {
          "symptom": "同名素材重新放回后仍显示 Missing",
          "cause": "新资源身份与原引用不同",
          "fix": "恢复原 meta 或在明确范围内重新赋值引用"
        }
      ],
      "exercise": {
        "brief": "建立一个基础目标Prefab和两个生命配置不同的实例，标出各字段来自源资源还是实例；查找目标不能只依赖名字。",
        "deliverables": [
          "Prefab 与场景",
          "Overrides 对照记录",
          "一次运行前后状态比较"
        ],
        "rubric": [
          {
            "item": "资源和实例区分正确",
            "points": 25
          },
          {
            "item": "覆盖方向预测正确",
            "points": 25
          },
          {
            "item": "运行状态未误当持久化",
            "points": 25
          },
          {
            "item": "资源移动保持引用",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "场景里的 Prefab 实例改名，是否必然修改源资源？",
          "options": [
            "实例改名必然立即改源",
            "不会自动改源，要看覆盖应用操作",
            "同名对象都会跟着改",
            "只能在播放期间改实例名"
          ],
          "answer": 1,
          "explanation": "实例修改和写回源资源是两个步骤。"
        },
        {
          "question": "meta 文件重要的原因是？",
          "options": [
            "仅保存缩略图",
            "仅记录窗口位置",
            "包含资源身份和导入设置",
            "仅记录打开时间，可任意删除"
          ],
          "answer": 2,
          "explanation": "稳定身份关系到已有引用，原文件名不能替代丢失的 meta。"
        },
        {
          "question": "未保存星号意味着什么？",
          "options": [
            "当前修改可能未写入磁盘",
            "场景必然已损坏",
            "全部项目资源都丢失",
            "项目无法进入播放"
          ],
          "answer": 0,
          "explanation": "星号提示未保存修改，本身没有证明数据损坏。"
        }
      ],
      "references": [
        {
          "label": "Prefabs",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/Prefabs.html"
        },
        {
          "label": "Object.Instantiate",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.Instantiate.html"
        }
      ],
      "summary": [
        "Prefab实例与源资源的修改有明确方向。",
        "资源文件、meta与内部子资源都可能影响已有引用。"
      ],
      "teaching": {
        "question": "同一 Prefab 放出的两个角色为什么可以不同，停止播放后新生成的角色为什么消失了？",
        "keyIdea": "Project 资源、编辑场景和运行实例保存不同内容。Prefab 提供模板，实例自己的修改不会自动写回模板。",
        "walkthrough": [
          {
            "title": "保存模板",
            "text": "把 Cube 从 Hierarchy 拖入 Project，生成 Prefab，再放两个实例 A、B 到场景中。"
          },
          {
            "title": "只改实例",
            "text": "把 A 缩放改为两倍，查看 Overrides，并比较 B 与模板的缩放，确认修改方向。"
          },
          {
            "title": "观察临时副本",
            "text": "播放时由脚本生成新副本，停止后检查场景和 Project，区分运行实例和长期资源。"
          }
        ],
        "prediction": {
          "question": "在编辑器里移动 Prefab 文件夹，引用一定断开吗？",
          "answer": "通常不会。资源身份和 meta 一起保留时，引用可以继续；丢失 meta 后不能只靠文件名保证。"
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
      "id": "l004",
      "title": "Inspector 数据、字段初值与运行时状态",
      "prerequisites": [
        "l003"
      ],
      "goals": [
        "解释代码初值与已有组件保存值的差别",
        "分开最大生命配置与当前生命状态",
        "明确重置状态何时发生"
      ],
      "theory": [
        {
          "title": "Inspector 数值有自己的来源",
          "paragraphs": [
            "首次添加组件时，你可能看到代码初值，例如最大生命5。随后在 Inspector 改成9并保存，组件便有了自己的配置。再把代码初值改成6，已有组件仍可能保持9，这不等于代码编译失败。",
            "代码初值提供新建数据的起点，序列化保存值记录这个实例的配置。两者服务的时刻不同。实验应同时观察已有组件与新添加组件；若需要统一更新旧配置，应明确编辑或迁移，不要期待修改初值自动覆盖全部已有对象。"
          ]
        },
        {
          "title": "最大值与当前值回答不同问题",
          "paragraphs": [
            "maximum 表示设计者允许多少生命，current 表示这次运行现在还剩多少。示例在 Awake 从配置建立 current，之后伤害只改 current，就不会把一次受伤误写成新的最大生命。即使类型相同，两个字段承担的职责仍不同。",
            "角色开场只有3点时，可依次查 maximum 是否本来为3，初始化是否正确，是否已发生伤害。若多个脚本随意改两个字段，很难知道3从哪里来。用方法集中修改当前值，会留下更明确的调试入口，也方便之后增加规则。"
          ]
        },
        {
          "title": "重新启用不是重新开始",
          "paragraphs": [
            "关闭再开启同一组件，通常保留实例与字段；停止播放后重新进入，则经历新的运行过程。Awake 用于实例的一次初始化，不能当成每次开关都触发的复活按钮。同一实例保留受伤值，必须按明确设计处理。",
            "Inspector 的 Reset 用来恢复相应组件设置，也不等于游戏里的复活。复活可能需要回满血、清除无敌时间和播放效果，应由方法组织这些步骤。将恢复编辑配置与重建运行状态分开，程序就不会依赖你碰巧点击哪个菜单。"
          ]
        },
        {
          "title": "编辑器校验不能替代运行检查",
          "paragraphs": [
            "把最大生命输入成负数时，可以用编辑器检查尽早发现。OnValidate 适合轻量数据校验，但会因加载和编辑等情况调用，不能当成正式运行中可靠的一次启动步骤。它能帮助输入正确，却不能保证所有运行路径正确。",
            "运行代码仍需在真正使用数据时检查必要条件。长时间计算、创建复杂对象或保存玩家进度，不宜放进 OnValidate。范围合法只回答配置是否可用，没有说明当前值何时重置、谁可以造成伤害，这些需要分别安排。"
          ]
        },
        {
          "title": "修改之前确认正在编辑谁",
          "paragraphs": [
            "同时选多个对象时，Inspector 可能显示混合值。输入一个数可能应用给全部选择，并不是脚本自动同步。Prefab 实例的数值还可能来自模板或覆盖。修改前看选择数量，之后看覆盖，能避免把一次试验变成批量改动。",
            "临时状态不必全变成可编辑配置。可用带上下文日志观察 current。最后要能回答：谁提供初始数值，哪个函数读取它，哪个方法改当前值，什么操作会重新建立状态？回答清楚这些问题，比只凭字段名称判断用途可靠。"
          ]
        },
        {
          "title": "用一张表追踪数值变化",
          "paragraphs": [
            "为生命实验列出操作、maximum、current 和实例是否新建四列。先记录进入播放，再记录一次伤害、禁用启用、停止重新播放。表中的变化会直接显示：伤害改变当前值，开关未必创建实例，而新运行会重新经历初始化。",
            "若你希望开关对象也回满血，就把这个需求写出来，再决定是否在启用时调用专门的重置方法。不要为了让一次测试通过，把所有状态都塞进 OnEnable；对象池、菜单隐藏或暂时停用也可能触发它。需求不同，重置时机也应不同。"
          ]
        }
      ],
      "code": {
        "title": "把配置与状态分离",
        "language": "csharp",
        "filename": "HealthStateProbe.cs",
        "source": "using UnityEngine;\npublic sealed class HealthStateProbe : MonoBehaviour\n{\n    [SerializeField, Min(1)] int maximum = 5;\n    int current;\n    void Awake() { current = Mathf.Max(1, maximum); Report(); }\n    [ContextMenu(\"Damage once\")]\n    void DamageOnce() { current = Mathf.Max(0, current - 1); Report(); }\n    void Report() => Debug.Log($\"config={maximum}; runtime={current}\", this);\n    void OnValidate() => maximum = Mathf.Max(1, maximum);\n}",
        "explanation": [
          "编辑模式配置 maximum，播放后执行 Damage once，比较配置与本次生命。停止不会保存受伤进度，同一实例重新启用也不自动重跑 Awake。"
        ]
      },
      "lab": [
        {
          "title": "比较已有与新建组件",
          "minutes": 60,
          "steps": [
            "把已有组件maximum设为9并保存场景，再将脚本初值改为6。",
            "等编译后比较原组件与新添加组件，记录各自的maximum。",
            "在测试副本执行Reset、撤销与重新播放，逐次记录数值来源。"
          ],
          "result": "用两个组件解释代码起点与保存配置，而非猜测编译失败。"
        },
        {
          "title": "跟踪一次生命变化",
          "minutes": 60,
          "steps": [
            "播放后连续执行伤害，分别记录maximum与current。",
            "禁用启用组件，再关闭开启对象，记录是否新建实例及current是否改变。",
            "停止并重新播放，比较Awake初始化；再写出显式复活方法应重置哪些状态。"
          ],
          "result": "说明状态改变、重新启用与重新初始化的区别。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "代码初值从5改成10，已有组件仍使用8",
          "cause": "该组件恢复了保存的序列化配置8，没有自动改成新默认值。",
          "fix": "查看Inspector，明确选择修改配置、Reset或迁移；先用新组件比较默认值。"
        },
        {
          "symptom": "属性在代码可用，却没有显示在Inspector",
          "cause": "普通属性不等于符合Unity保存规则的字段。",
          "fix": "用明确的SerializeField字段保存配置，另用属性提供需要的读取入口。"
        }
      ],
      "exercise": {
        "brief": "给计时器分别设置总时长配置与剩余时间，提供明确的Restart方法，并说明重新启用是否应该重启。",
        "deliverables": [
          "组件源码",
          "状态所有权表",
          "重新启用与重开游戏对比日志"
        ],
        "rubric": [
          {
            "item": "配置与运行状态分开",
            "points": 25
          },
          {
            "item": "重新开始的时机明确",
            "points": 25
          },
          {
            "item": "数值限制可验证",
            "points": 25
          },
          {
            "item": "操作前后证据完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "修改字段的代码初值后，已有组件一定同步吗？",
          "options": [
            "一定同步新初值",
            "不一定，保存的序列化值可能仍优先",
            "public 字段一定同步",
            "重新播放必定覆盖旧配置"
          ],
          "answer": 1,
          "explanation": "已有实例保存值与代码初值是不同来源，比较新建组件更容易验证。"
        },
        {
          "question": "OnValidate 应主要承担什么？",
          "options": [
            "轻量编辑器配置检查",
            "正式运行的每帧更新",
            "替代所有 Awake",
            "唯一可靠的玩家存档入口"
          ],
          "answer": 0,
          "explanation": "OnValidate 是编辑器辅助，不替代运行初始化或保存策略。"
        },
        {
          "question": "哪个设计最能说明当前生命值来源？",
          "options": [
            "每帧设回满血",
            "所有脚本任意改生命",
            "配置最大值、初始化当前值、用方法修改",
            "只靠变量名约定"
          ],
          "answer": 2,
          "explanation": "这样能区分配置、当前状态和修改入口。"
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
        "修改代码初值不等于批量更新已有配置。",
        "开关、初始化、复活与保存是不同操作。"
      ],
      "teaching": {
        "question": "把 maximum 初值改成6，已有对象为什么仍显示9？当前生命和最大生命应如何区分？",
        "keyIdea": "代码默认值与保存的组件配置来自不同地方。配置建立本次状态，再由方法修改当前状态，才能追查数值来源。",
        "walkthrough": [
          {
            "title": "保存自己的配置",
            "text": "为已有组件将 maximum 设为9并保存，这个值现在属于该组件的保存配置。"
          },
          {
            "title": "再改代码初值",
            "text": "把代码初值改成6，等编译后比较已有组件和新添加组件，观察它们读取的数据来源。"
          },
          {
            "title": "建立运行状态",
            "text": "进入播放，Awake 将 maximum 复制到 current。执行伤害只减少 current，不改最大生命配置。"
          }
        ],
        "prediction": {
          "question": "伤害后禁用再启用组件，会重新 Awake 回满血吗？",
          "answer": "不会仅因同一实例重新启用而重跑 Awake；需要复活时应提供明确的重置方法。"
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
      "id": "l005",
      "title": "Console、断点与官方 API：建立故障定位闭环",
      "prerequisites": [
        "l004"
      ],
      "goals": [
        "区分编译失败、运行异常与配置结果错误",
        "用调用栈和对象上下文追查引用来源",
        "修复后按原触发步骤验证"
      ],
      "theory": [
        {
          "title": "先判断问题发生阶段",
          "paragraphs": [
            "把 Rigidbody 拼错与漏赋 target，都会让人觉得脚本不工作，但两者发生阶段不同。类型错误会阻止当前代码正确编译，应先看 Console 的文件、行号和错误类型。引用缺失常在运行到使用位置才显露，要检查组件和初始化。",
            "还有无异常但结果错误的情况：对象位置变了，却被相机遮罩排除。增加空值判断不会让它显示。先分类才知道下一步：编译问题查代码依赖，异常查调用过程，无异常的结果错误查数值、配置和执行时机。"
          ]
        },
        {
          "title": "报错行是显露问题的位置",
          "paragraphs": [
            "NullReferenceException 表示使用了空引用。读取 target.position 出错，说明使用时没有可用 target，却没解释原因。可能从未赋值，可能之前查找失败，也可能对象在等待期间被别处销毁，不能只凭行号判断最早根因。",
            "双击错误后继续追问 target 在哪里获得、何时确认有效。应从失败使用处往前查，而不是删除报错行。必要引用缺失时，一次说明缺少什么并停止无效逻辑，比每帧重复异常更好；但真正修复仍需建立正确引用。"
          ]
        },
        {
          "title": "让日志区分对象和时间",
          "paragraphs": [
            "两个同名角色都打印“开始移动”，单看文字不知谁执行。传入对象上下文后可以点击日志定位实例，再加帧号、计数与关键数值，区分一次行为调用两遍，还是两个对象各调用一遍。日志内容应围绕正在检验的猜想。",
            "Collapse 会折叠相同消息，因此行数未必等于次数。数次数应关闭折叠或加计数。日志也有开销，不要每帧大量打印又宣称测出了真实性能。确认执行行为与分析耗时是两件事，后者需要 Profiler 等测量工具。"
          ]
        },
        {
          "title": "断点查看一次调用的中间状态",
          "paragraphs": [
            "程序停在断点时，可以检查局部变量、引用和调用栈。调用栈说明哪些方法一路调用到这里，变量窗口帮助确认“我以为已赋值”是否属实。在关键读取前停下，再逐步执行，比在很多无关位置打印更适合追踪复杂调用。",
            "暂停会改变实际时间关系，不能用来测性能。输入、网络或跨帧问题也可能受调试影响。保留正常运行日志，再用断点理解中间状态，才能避免把调试器带来的延迟当成原来的错误。不同工具提供的证据应相互补充。"
          ]
        },
        {
          "title": "回到原步骤验证修复",
          "paragraphs": [
            "最小复现只保留产生问题必要的对象和步骤。复杂场景的重复通知，可能缩减到一个发布者和监听者就能出现。每删一部分都确认原现象仍在，才能排除无关条件，而不是换到一个不触发问题的场景。",
            "修复后从原起点再触发，并测试相近反例。引用赋好先验证正常目标，再试目标销毁时是否停止无效行为。把版本、对象设置、点击顺序和实际结果写全，别人才能重做。清空记录、吞掉异常或重启后不再触发，都不是充分证据。"
          ]
        },
        {
          "title": "为自己的解释寻找反例",
          "paragraphs": [
            "认为问题是引用缺失，就在 Inspector 正确赋值后重测；认为回调顺序导致失败，就记录对象、帧号与调用位置。若反例仍失败，说明原解释还缺条件。不要同时改很多地方后用“现在能用了”代替原因分析。",
            "需要容错时，也要让失败可见。记录一次明确原因、停止无效行为，并给出重新配置或重新尝试的入口，比捕获全部异常后继续运行更容易维护。诊断说明应该使另一个人不用和你实时聊天，就能复现同一问题并核对修复结果。"
          ]
        }
      ],
      "code": {
        "title": "带上下文的一次性诊断",
        "language": "csharp",
        "filename": "ReferenceProbe.cs",
        "source": "using UnityEngine;\npublic sealed class ReferenceProbe : MonoBehaviour\n{\n    [SerializeField] Transform target;\n    void Start()\n    {\n        if (target == null)\n        {\n            Debug.LogError($\"Missing target on {name}, frame={Time.frameCount}\", this);\n            enabled = false;\n            return;\n        }\n        Debug.Log($\"Target={target.name}, distance={Vector3.Distance(transform.position, target.position):F2}\", this);\n    }\n}",
        "explanation": [
          "脚本挂到 Probe，先不指定 target，运行查看一次错误与对象上下文；再赋目标重试。停用组件只停止无效行为，没有替你补上引用。"
        ]
      },
      "lab": [
        {
          "title": "选择对应的检查工具",
          "minutes": 60,
          "steps": [
            "把Transform故意拼错，观察编译错误，修正后等代码重新编译。",
            "运行未赋target的探针，双击错误并点击上下文，查明哪一个实例缺引用。",
            "赋正确目标后将其移出相机，比较没有异常却不可见的另一种故障。"
          ],
          "result": "三类故障使用不同入口，而非全部靠空值判断。"
        },
        {
          "title": "缩减到最小复现",
          "minutes": 60,
          "steps": [
            "给Probe添加父级和第二个同名实例，分别记录target指向谁。",
            "加入帧号与上下文，用断点查看一次调用的变量与调用栈。",
            "逐步去掉无关对象，每次确认问题仍在，最后写出两对象场景的完整操作步骤。"
          ],
          "result": "另一个人可按记录复现并验证修复。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "修复后 Console 仍满是旧异常",
          "cause": "混淆历史记录与本次运行结果",
          "fix": "先保存旧证据，再清空并重新运行验证"
        },
        {
          "symptom": "大量日志后误判游戏非常慢",
          "cause": "调试输出本身带来编辑器开销",
          "fix": "限制日志次数，用 Profiler 和构建测量正式性能"
        }
      ],
      "exercise": {
        "brief": "制造一个缺失组件或错误引用问题，写出可复现步骤、实际原因和修复后的重试结果，禁止盲目轮换项目设置。",
        "deliverables": [
          "最小场景与源码",
          "含调用栈的故障记录",
          "修复后的行为证据与官方说明"
        ],
        "rubric": [
          {
            "item": "分类与根因正确",
            "points": 25
          },
          {
            "item": "复现步骤完整",
            "points": 25
          },
          {
            "item": "修复针对根因",
            "points": 25
          },
          {
            "item": "回归验证包含原场景",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "NullReferenceException 所在行一定就是最早根因吗？",
          "options": [
            "报错行一定是最早根因",
            "不一定，引用获取可能更早失败",
            "跳过这行就证明功能正确",
            "空引用只可能来自 Inspector"
          ],
          "answer": 1,
          "explanation": "错误位置说明使用失败，还应追查引用如何获取和何时失效。"
        },
        {
          "question": "测量脚本真实性能更适合什么？",
          "options": [
            "每帧输出全部变量",
            "在断点暂停后计时",
            "Profiler 并控制日志干扰",
            "只数 Console 行数"
          ],
          "answer": 2,
          "explanation": "日志和断点会扰动时间，Profiler 才提供相应耗时证据。"
        },
        {
          "question": "故障修复完成的必要证据是什么？",
          "options": [
            "红字清空即可",
            "换到不含相关对象的场景",
            "原条件下行为恢复且对应错误不再发生",
            "捕获全部异常并忽略"
          ],
          "answer": 2,
          "explanation": "需要重走原触发步骤，不能只把证据隐藏。"
        }
      ],
      "references": [
        {
          "label": "Debug.Log",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Debug.Log.html"
        },
        {
          "label": "Debug.LogError",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Debug.LogError.html"
        }
      ],
      "summary": [
        "报错行显示使用失败，最早原因可能发生得更早。",
        "清空Console不等于修复，必须重现原条件再检查结果。"
      ],
      "teaching": {
        "question": "没有红字为什么角色仍不显示？出现空引用时，报错行是否一定是最早出错的位置？",
        "keyIdea": "先判断故障发生阶段，再选择工具。报错位置常是问题显露处，还需沿引用和数据来源继续追查。",
        "walkthrough": [
          {
            "title": "检查编译",
            "text": "将 Transform 故意拼错，查看文件、行号和错误类型，先恢复可编译状态再观察运行。"
          },
          {
            "title": "检查引用",
            "text": "不指定 target 后运行 ReferenceProbe，通过错误上下文找到具体组件，再赋正确目标重试。"
          },
          {
            "title": "检查显示",
            "text": "引用正确后把对象移出相机，比较没有异常但不可见的情况，确认它需要另一类检查。"
          }
        ],
        "prediction": {
          "question": "清空 Console，是否证明问题已经修好？",
          "answer": "不能。Clear 只删记录；应按原步骤再次触发，并验证行为和错误两方面。"
        }
      }
    }
  ]
});
