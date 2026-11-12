// 语境修订：题目背景、实验准备与学习用途。
window.COURSE_MODULES.push({
  "id": "m08",
  "number": 8,
  "title": "二维物理：运动、接触与查询",
  "subtitle": "一步步解释二维角色怎样运动",
  "description": "从刚体类型与碰撞条件开始，学习二维查询、输入到速度的转换，以及穿透和抖动的不同原因。",
  "accent": "#527c63",
  "lessons": [
    {
      "hours": 5,
      "prerequisites": [
        "l035"
      ],
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
      "id": "l036",
      "title": "Rigidbody2D 的三种身体",
      "goals": [
        "预测 Dynamic、Kinematic、Static 的行为",
        "区分显示组件与物理组件",
        "为俯视角色配置稳定的刚体"
      ],
      "theory": [
        {
          "title": "图片没有告诉物理系统角色是什么",
          "paragraphs": [
            "俯视游戏里，角色图片看起来站在地面上，但 Rigidbody2D 不理解“这是地板”的美术含义。它根据身体类型、重力、形状和速度推进二维物理。先在空场景放一个带 Collider2D 的方块，再加入 Dynamic Rigidbody2D，观察它在重力下落，这比直接在复杂角色上试参数更容易看清原因。",
            "二维物理主要在 XY 平面处理运动。Sprite 的排序、透明部分和 Z 坐标不等于碰撞形状；普通三维 Collider 也不参与这套二维模拟。俯视角色通常关闭重力并限制不需要的旋转，但这些设置来自玩法需要，并不是二维项目天然不用重力。"
          ]
        },
        {
          "title": "三种身体类型分别交给谁控制",
          "paragraphs": [
            "Dynamic 身体会接受重力、力与接触作用，适合希望物理系统处理运动响应的物体。Kinematic 身体的轨迹主要由代码决定，不应期待它像动态身体一样被普通力推走。Static 则适合不动的环境形状，不是为了让一个每步搬位置的平台更省事而选的类型。",
            "设动态角色撞到静态墙，通常希望接触求解阻止它继续进入。改成运动学身体后，不能仍假定每种身体组合都会得到同样的阻挡和消息；Full Kinematic Contacts 等选项也有明确适用范围。身体类型改变的是模拟规则，应对照文档和最小组合测试。"
          ]
        },
        {
          "title": "速度是每秒多少，不是本帧走多少",
          "paragraphs": [
            "linearVelocity 表示每秒移动的世界单位数。设速度为向右5个世界单位/秒，步长为0.02s，忽略阻碍时一步约前进0.1个世界单位。赋值速度时不再乘步长；只有自己计算目标位移时，才需要将速度乘对应时间。否则角色速度会被意外缩小。",
            "直接指定速度可以让键盘角色迅速响应，却会覆盖之前的速度贡献。例如击退向左后，输入脚本下一步又写向右5个世界单位/秒，击退就消失了。若希望自然受力，可研究 AddForce；若要强控制，则明确哪些分量由输入接管。MovePosition 则有自己的运动学用途和位移限制，不是所有身体的通用替代品。"
          ]
        },
        {
          "title": "睡着、停用脚本和退出模拟不是一回事",
          "paragraphs": [
            "物体静止时可能进入睡眠，以减少不必要的物理计算；睡眠不是删除身体，也不表示 Collider2D 从世界里消失。正常受力或相应条件可以让身体醒来。排查时，应先区分物体没有运动的原因，而不是遇到静止就不断调用 WakeUp。",
            "禁用移动脚本，只停止该脚本的相应工作，刚体仍可能继续受重力。将 Rigidbody2D.simulated 设为 false 则会改变它及所附形状参与物理世界的资格，相关接触和查询表现也会变化。隐藏 SpriteRenderer 只改变显示。这三种操作看似都能“让角色消失”，实际影响的系统不同。",
            "可用同一条只包含该对象层的 Physics2D.Raycast 做对照：隐藏 SpriteRenderer 后，形状仍可被查到；禁用移动脚本后也应单独检查，因为刚体没有因此退出模拟；再将 simulated 设为 false，该身体附属的 Collider2D 不再参加这套物理模拟和查询。把“是否看得见、是否在动、是否能被查到”记成三列，三种操作的差别就不再只是文字定义。"
          ]
        },
        {
          "title": "用一张配置表预测结果",
          "paragraphs": [
            "把三个相同方块分别设为 Dynamic、Kinematic 和 Static，使用相同碰撞体和允许交互的 Layer。先不加脚本，观察重力；再只对适用身体施加受力或代码移动，记录位置与速度。每轮只改变一个条件，才能将结果归因到身体类型。",
            "接着在开阔地把恒定速度从5改为10个世界单位/秒，再将步长减半，测量相同真实时长后的位移。插值可能让画面更顺，却不会增加物理步数。最后保留身体类型、重力、阻尼、约束、检测模式和模拟开关，后续动画或摄像机问题才能与物理配置分开检查。",
            "做俯视测试时，建议先用简单方形图片和胶囊形状。若身体会绕Z轴转动，先确认是否需要冻结旋转，再观察墙边接触；不要在转动发生后每帧把 Transform 旋回去。约束属于刚体配置，强行写回旋转则会引入另一个控制来源，两种做法的含义不同。"
          ]
        }
      ],
      "code": {
        "title": "恒定速度的俯视身体",
        "language": "csharp",
        "filename": "TopDownBodyProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Rigidbody2D))]\npublic class TopDownBodyProbe : MonoBehaviour\n{\n    [SerializeField] Vector2 targetVelocity = new Vector2(2, 0);\n    Rigidbody2D body;\n    void Awake() { body = GetComponent<Rigidbody2D>(); }\n    void FixedUpdate() { body.linearVelocity = targetVelocity; }\n}",
        "explanation": [
          "使用带 Collider2D 的 Dynamic 身体，关闭重力并冻结不需要的旋转，在开阔地测试恒定速度。",
          "脚本向 linearVelocity 写每秒世界单位，不额外乘步长；其他速度写入脚本应先关闭。"
        ]
      },
      "lab": [
        {
          "title": "比较三种身体",
          "minutes": 60,
          "steps": [
            "给三个相同方块设置同样Collider2D，分别选择Dynamic、Kinematic、Static。先不挂速度脚本，进入Play比较重力作用，记录哪个身体下落、哪个保持初始位置。",
            "让DynamicBox落到地板上，记录双方身体类型、Collider2D及Layer。Kinematic或Static不自行下落，不足以证明它们在任意移动接口下都能阻挡任意身体；把这一限制写入结果。",
            "另开一轮，只给DynamicBox挂本课TopDownBodyProbe并设Gravity Scale=0、Target Velocity=(2,0)。依次仅关闭SpriteRenderer、速度脚本和Rigidbody2D的Simulated，每轮退出再进Play恢复起点，记录显示与运动。停用脚本后已有速度可能继续，不能把禁用写入者等同于清零速度。"
          ],
          "result": "一张区分身体类型、显示、速度写入和模拟参与的配置表，并明确停用脚本不会自动清除已有刚体速度。",
          "setup": [
            "用File > New Scene建L036_Bodies。GameObject > 2D Object > Sprites > Square建三个方块，分别命名DynamicBox、KinematicBox、StaticBox，Position设(-2,3,0)、(0,3,0)、(2,3,0)。",
            "逐个选方块，Inspector > Add Component添加BoxCollider2D和Rigidbody2D，Body Type分别设Dynamic、Kinematic、Static；先不挂速度脚本。另建Square命名Floor，Position=(0,0,0)、Scale=(12,0.5,1)，只加BoxCollider2D作地板。",
            "第二轮把本课TopDownBodyProbe.cs保存到Assets/EngineLabs，等编译后只给DynamicBox添加；Gravity Scale=0、Linear Damping=0、冻结Rotation Z，Target Velocity=(2,0)。窗口入口为Window > General > Scene、Inspector和Console。",
            "本组必做只比较身体、显示和运动，不需要未来课程的射线代码。完成第38课后，可返回加RayProbe2D独立检查Simulated关闭前后的查询结果。"
          ],
          "purpose": "把身体类型、隐藏、禁用脚本和退出模拟分开，看清“不动”背后的不同原因。"
        },
        {
          "title": "用位移检查速度单位",
          "minutes": 60,
          "steps": [
            "在空场景设置恒定速度5个世界单位/秒，记录运行相同时间前后的坐标。",
            "将速度改为10个世界单位/秒，再将固定步长减半，每次单独复测。",
            "开关插值，分别记录实际位移和可见平滑程度。"
          ],
          "result": "速度、时间、位移一致，且能区分显示与模拟。",
          "setup": [
            "另存L036_Speed，只保留一个Square；Add Component添加Dynamic Rigidbody2D与BoxCollider2D，Gravity Scale=0、Linear Damping=0，在Constraints冻结Rotation Z。",
            "保存本课TopDownBodyProbe.cs到Assets/EngineLabs，等编译结束后选方块Add Component添加；Target Velocity设(5,0)。原脚本默认(2,0)，本组特意改为5。",
            "Edit > Project Settings > Time查看Fixed Timestep，记录原值；每轮从同一位置退出再进Play，按相同游戏时长记录坐标，结束后恢复步长。"
          ],
          "purpose": "直接测量每秒速度，避免重复乘时间把5单位/秒变成0.1单位/秒；另看插值只改变哪一层。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "俯视骑士自动向下掉",
          "cause": "Dynamic 默认受到二维重力。",
          "fix": "将 Gravity Scale 设为 0，并确认使用 Rigidbody2D。"
        },
        {
          "symptom": "击退只持续一瞬间",
          "cause": "每步的完整速度赋值覆盖了击退。",
          "fix": "明确输入与外部速度的合成规则，避免两个脚本争写同一速度。"
        }
      ],
      "exercise": {
        "brief": "为 Tiny Swords 骑士建立脚底碰撞身体，并提交刚体选择的理由。",
        "deliverables": [
          "独立实验场景",
          "运动与击退的短记录",
          "组件责任表"
        ],
        "rubric": [
          {
            "item": "刚体类型选择与理由",
            "points": 25
          },
          {
            "item": "碰撞形状与表现分离",
            "points": 25
          },
          {
            "item": "速度单位实验正确",
            "points": 25
          },
          {
            "item": "外力覆盖原因解释",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "linearVelocity 的量纲是什么？",
          "options": [
            "世界单位每秒",
            "每次 Update 的世界位移",
            "每次物理步的世界位移",
            "相对屏幕的像素每帧"
          ],
          "answer": 0,
          "explanation": "物理系统根据速度与步长推进位置，因此赋值速度不再额外乘步长。",
          "scenario": "二维动态身体的脚本给linearVelocity赋值(5,0)，没有额外时间乘法。问题只问这个属性所用的单位。"
        },
        {
          "question": "Kinematic 身体撞向静态墙时，应该怎样预期？",
          "options": [
            "必然像 Dynamic 一样被墙自然推停",
            "不能依赖无条件阻挡，应核对身体组合和移动接口",
            "只要 Freeze Rotation 就保证完全阻挡",
            "只要画面上重叠就必然收到所有碰撞消息"
          ],
          "answer": 1,
          "explanation": "身体类型决定运动与接触规则，不能把动态身体的行为直接套到运动学身体。",
          "scenario": "角色改成Kinematic Rigidbody2D，墙是静态BoxCollider2D；你还没有确认Full Kinematic Contacts及所用移动接口。"
        },
        {
          "question": "插值会提高物理求解频率吗？",
          "options": [
            "会，每个显示帧都增加一次求解",
            "会，只要显示器刷新率提高",
            "不会，主要改善可见运动的平滑程度",
            "不会，但会自动启用连续碰撞检测"
          ],
          "answer": 2,
          "explanation": "插值和固定时间步属于不同层次，画面平滑不代表碰撞检测增加。",
          "scenario": "身体的固定步长保持0.02秒，仅将Rigidbody2D的Interpolation从None改为Interpolate。"
        }
      ],
      "references": [
        {
          "label": "Rigidbody2D",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody2D.html"
        },
        {
          "label": "Rigidbody2D.MovePosition",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody2D.MovePosition.html"
        }
      ],
      "summary": [
        "Body Type改变身体如何参与物理模拟，不只是一个移动速度开关。",
        "linearVelocity表示每秒运动量，计算位移时才乘相应时间。"
      ],
      "teaching": {
        "question": "无重力角色每秒要走5个世界单位，为什么不能把 linearVelocity 设成5乘 fixedDeltaTime？",
        "keyIdea": "速度本身已经包含“每秒”的含义。物理模拟会根据步长推进位置，调用方再乘一次时间就重复换算了。",
        "walkthrough": [
          {
            "title": "明确单位",
            "text": "设目标速度为每秒5个世界单位，固定步长0.02s，场景没有墙和阻尼影响。"
          },
          {
            "title": "推算一步",
            "text": "将 linearVelocity 的水平分量设为5，物理步预计移动5 × 0.02 = 0.1个世界单位。"
          },
          {
            "title": "检查错误写法",
            "text": "若先把5 × 0.02再赋值，实际速度变成每秒0.1个世界单位，一步仅约0.002。"
          }
        ],
        "prediction": {
          "question": "保持速度5个世界单位/秒，把步长减半，相同一秒里的理想位移会减半吗？",
          "answer": "不会。每步位移减半，但每秒步数增加；在无阻碍等相同条件下，一秒仍约走5个世界单位。",
          "scenario": "在无重力、无阻尼、无障碍的二维场景，动态身体的linearVelocity始终为(5,0)。比较固定步长0.02秒与0.01秒，各运行相同1秒游戏时间。"
        },
        "scenario": "俯视骑士刚加入Rigidbody2D就往画面下方掉，关闭移动脚本后它还在动。先不用正式角色：用一个方形Sprite、一个BoxCollider2D和三种身体类型，查清每个开关实际停了什么。",
        "purpose": "能独立配置俯视身体，并用速度单位解释角色移动，不靠照搬重力、阻尼和步长数值。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l036"
      ],
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
      "id": "l037",
      "title": "Collider2D、Trigger 与碰撞过滤",
      "goals": [
        "建立触发与实体接触的区别",
        "按检查顺序定位没有回调的问题",
        "为攻击区域设计分层规则"
      ],
      "theory": [
        {
          "title": "图片碰到一起，不等于发生物理接触",
          "paragraphs": [
            "两个 Sprite 的像素重叠，物理回调却没有出现，这是常见现象。图片只负责显示，接触需要相应 Collider2D、有效模拟状态和允许交互的身体组合。先将动态角色和一个带 BoxCollider2D 的区域放到空场景，确认最基本的接触，再逐个增加其他组件。",
            "区域勾选 Is Trigger 后，适合用来报告进入和离开，而不是像墙一样阻挡。希望角色不能穿过的墙，应使用适当的普通碰撞体。消息方法也要使用二维签名，例如参数是 Collider2D，不能把三维 OnTriggerEnter 的写法直接搬过来。",
            "测试消息时还要让方法和需求一致：将区域从 Trigger 改为普通碰撞体后，OnTriggerEnter2D 不再是这一组实体接触的观察入口，应换看对应的碰撞消息和阻挡结果。否则你改变了接触类型，却仍只盯着旧日志，很容易得出“取消 Trigger 后物理坏了”的错误结论。"
          ]
        },
        {
          "title": "Layer 负责物理过滤，排序层负责显示",
          "paragraphs": [
            "设角色属于 Player 层，墙属于 World 层，拾取范围属于 Pickup 层。Physics 2D 的层碰撞矩阵可以规定哪些组合参与交互，避免每个回调都先检查大量无关对象。这相当于在接触开始前缩小候选范围，不只是给文件或对象分组。",
            "Sorting Layer 和 Order in Layer 负责绘制先后，不决定物理接触。把角色显示到墙前面，不会因此穿过墙；把 Sorting Layer 改名，也不会恢复被物理矩阵禁止的触发。排查没有消息时，应读取对象真正的 Layer，并检查相关二维物理设置和局部过滤选项。"
          ]
        },
        {
          "title": "先认出是哪一个形状进入了区域",
          "paragraphs": [
            "一个角色根上有 Rigidbody2D，脚和身体各有 Collider2D。两者通常可通过 attachedRigidbody 指向同一个身体，但各自仍是独立形状。区域可能先收到脚进入，再收到身体进入；回调次数因此不等于角色数量。",
            "先打印碰撞体实例标识和所属刚体，观察这两个层次。若要维护角色列表，应选择稳定的角色标识；按角色接触计数时，第一次进入加入成员，最后一个形状离开才移除。只用名字去重不可靠，因为不同角色可以同名，同一角色的形状也可能名字不同。"
          ]
        },
        {
          "title": "从接触变化建立游戏状态",
          "paragraphs": [
            "进入、停留、离开消息描述模拟发现的变化，区域提示、伤害和奖励则是游戏规则。例如一次挥剑只能伤害同一敌人一次，单靠每个 OnTriggerEnter2D 都扣血无法表达这个限制，还要记录攻击身份及已结算目标。",
            "不同对象的回调顺序也不应被当成固定的业务顺序。若同一步既触发拾取又发生死亡，应由明确规则决定是否获得物品，而不是依赖哪个日志先出现。将接触事实、角色身份和游戏处理分别记录，会让重复扣血之类问题更容易定位。"
          ]
        },
        {
          "title": "正常离开之外，还要验证突然消失",
          "paragraphs": [
            "假设角色仍在区域里就被禁用或销毁，区域自己的集合不会因为对象消失就自动变成正确状态。负责集合的脚本应定义停用时清理、无效成员移除和重复移除的行为；不能把所有清理都押在未来某一次 Exit 上。",
            "实验时让两个子形状先后进出，再测试禁用区域、改变模拟状态和销毁角色。每种情况都记录期望成员数与实际成员数。大量日志仅用于短时观察，日常运行可换成计数与可关闭的诊断。这样学到的是可维护的区域模型，而不仅仅是写出一个能触发的函数。",
            "如果一个区域既需要提示又需要造成伤害，可以让同一份接触观察提供目标身份，但两种行为仍各自维护规则。提示可能只关心有无角色，伤害则还需要频率与角色存活条件。先确定这些差异，才不会把为了提示而去重的集合误当成已经完成伤害结算的证据。"
          ]
        }
      ],
      "code": {
        "title": "触发区域观察器",
        "language": "csharp",
        "filename": "TriggerProbe2D.cs",
        "source": "using UnityEngine;\npublic class TriggerProbe2D : MonoBehaviour\n{\n    void OnTriggerEnter2D(Collider2D other)\n    {\n        Debug.Log($\"Enter collider={other.GetInstanceID()} body={other.attachedRigidbody}\", this);\n    }\n    void OnTriggerExit2D(Collider2D other)\n    {\n        Debug.Log($\"Exit collider={other.GetInstanceID()}\", this);\n    }\n}",
        "explanation": [
          "区域使用 BoxCollider2D 并勾选 Is Trigger，移动角色使用 Dynamic Rigidbody2D 和 CapsuleCollider2D。",
          "确认两者物理 Layer 允许交互。示例只观察消息，角色去重、奖励与伤害规则需要另外实现。"
        ]
      },
      "lab": [
        {
          "title": "逐项定位没有回调的原因",
          "minutes": 60,
          "steps": [
            "基线：Player 层的动态 Rigidbody2D 搭配 Collider2D，区域为允许交互的静态 BoxCollider2D 且勾 Is Trigger。使用 OnTriggerEnter2D(Collider2D other) 打印对象名，穿过一次确认收到进入消息。",
            "保存六行对照：基线；仅关闭双方层交互；仅关角色 simulated；仅关区域 Collider2D；仅取消区域 Is Trigger；仅把角色形状换成三维 BoxCollider。每次从基线重做，记录触发消息是否仍符合条件。",
            "取消 Trigger 那一组另外观察实体阻挡，并使用 OnCollisionEnter2D(Collision2D other) 检查普通接触。将“没有触发消息”和“没有任何物理接触”分开，不把换了消息类型误判为输入失效。"
          ],
          "result": "至少六种配置与消息结果，能够说明各失败原因。",
          "setup": [
            "新建L037_Filter。GameObject > 2D Object > Sprites > Square建Player，加Dynamic Rigidbody2D和BoxCollider2D；Gravity Scale=0。另建Square命名Zone，加BoxCollider2D并勾Is Trigger。",
            "保存TriggerProbe2D.cs到Assets/EngineLabs并通过Zone的Inspector > Add Component添加。把Player起点放在Zone左侧；进入Play后用Scene移动工具让它穿过区域，仅用于接触观察。",
            "物理Layer在对象Inspector右上Layer设置；层矩阵在Edit > Project Settings > Physics 2D。显示用的Sorting Layer在SpriteRenderer内，先记录这两个位置，别改错面板。Console入口是Window > General > Console。"
          ],
          "purpose": "一次只破坏一个接触条件，学会区分没有触发消息、没有实体阻挡和错误方法签名。"
        },
        {
          "title": "分清形状数和角色数",
          "minutes": 60,
          "steps": [
            "在同一 Rigidbody2D 下放两个子 Collider2D，让它们先后进入区域。",
            "比较回调中的碰撞体标识与 attachedRigidbody，画出形状到角色的对应关系。",
            "按角色计数后测试部分离开、角色禁用和区域禁用，检查是否遗留成员。"
          ],
          "result": "人数不随子碰撞体数量错误增加，异常结束能清理。",
          "setup": [
            "另存L037_Members，在Player根下面新建两个子Square，命名BodyShape和FootShape；根保留一个Rigidbody2D，子对象各有Collider2D，不各自添加刚体。",
            "Zone宽度应能同时容纳两个形状；沿行进方向错开两个子形状，使它们先后进入、先后离开。",
            "现成TriggerProbe2D只打印进入/离开，人数和清理属于本组要扩展的逻辑。先做“形状名→attachedRigidbody”的记录表，再编写计数，不能把输出日志次数直接当人数。"
          ],
          "purpose": "让日志中的两个形状对应同一个骑士，亲眼检查部分离开为什么不等于角色已经离开。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "精灵前后层次正确却仍撞到自己攻击",
          "cause": "Sorting Layer 不负责物理过滤。",
          "fix": "配置物理 Layer 和二维碰撞矩阵。"
        },
        {
          "symptom": "一个角色进门触发两次计数",
          "cause": "角色具有多个碰撞体，直接按事件加一。",
          "fix": "按所属角色身份去重，或维护每个角色的重叠计数。"
        }
      ],
      "exercise": {
        "brief": "设计只接受角色、忽略装饰和攻击区域的检查点。",
        "deliverables": [
          "交互矩阵",
          "六种配置验证",
          "多碰撞体去重方案"
        ],
        "rubric": [
          {
            "item": "层语义准确",
            "points": 25
          },
          {
            "item": "触发条件验证",
            "points": 25
          },
          {
            "item": "去重规则完整",
            "points": 25
          },
          {
            "item": "禁用重置处理",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "Sorting Layer 能禁止二维碰撞吗？",
          "options": [
            "能，它同时控制所有层过滤",
            "不能，它负责绘制排序",
            "能，只要使用 SpriteRenderer",
            "能，但必须把物体放在相同 Z 位置"
          ],
          "answer": 1,
          "explanation": "物理过滤使用对象 Layer 与相关 Physics 2D 配置，显示排序不是碰撞规则。",
          "scenario": "二维角色与墙的物理Layer相同并允许交互；开发者只改SpriteRenderer的Sorting Layer，未改Collider2D或Physics 2D设置。"
        },
        {
          "question": "两个子 Collider2D 属于同一角色时，怎样维护区域人数？",
          "options": [
            "每次 Enter 都把人数加一",
            "只记录第一个 Collider，以后永远忽略其他形状",
            "按角色身份归并，并处理多个形状的接触计数",
            "按 Collider 名称去重即可"
          ],
          "answer": 2,
          "explanation": "需要同时保留逻辑身份和形状接触状态，才能正确处理部分形状先离开。",
          "scenario": "骑士根有一个Rigidbody2D，脚和身体各有Collider2D；区域需要统计角色人数，而不是碰撞形状数量。"
        },
        {
          "question": "二维触发消息始终不出现，首先检查什么？",
          "options": [
            "提高输入采样频率以增加事件次数",
            "核对二维组件、模拟状态、身体组合与过滤",
            "只延长动画片段，使角色停留更久",
            "将所有消息统一改为三维签名"
          ],
          "answer": 1,
          "explanation": "先建立有效物理条件。增加业务代码无法补齐不存在的二维接触关系。",
          "scenario": "角色与区域看起来重叠，Console一直没有OnTriggerEnter2D记录；目前还未核对Collider2D、身体模拟、Layer及方法签名。"
        }
      ],
      "references": [
        {
          "label": "Collider2D",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Collider2D.html"
        },
        {
          "label": "Rigidbody2D",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody2D.html"
        }
      ],
      "summary": [
        "图片重叠不等于有效二维接触，接触也不自动等于一次游戏结算。",
        "一个角色有多个形状时，要处理身份归并和部分离开。"
      ],
      "teaching": {
        "question": "角色有脚和身体两个 Collider2D，脚离开区域时为什么提示不应立即关闭？",
        "keyIdea": "区域需要知道的是整个角色是否仍在，物理消息提供的却是单个形状进出。把多个形状归到同一角色并计数，才能正确处理部分离开。",
        "walkthrough": [
          {
            "title": "开始重叠",
            "text": "脚的 Collider2D 先进入，角色接触数从0变为1，此时第一次加入角色并显示提示。"
          },
          {
            "title": "第二个形状进入",
            "text": "身体的 Collider2D 随后进入，接触数从1变为2，但两个形状属于同一角色，人数仍为1。"
          },
          {
            "title": "分两次离开",
            "text": "脚退出后计数剩一，保持提示；身体也退出，计数归零，才移除角色。"
          }
        ],
        "prediction": {
          "question": "将角色的 Sorting Layer 调到最前，会恢复被 Physics 2D 层矩阵禁止的接触吗？",
          "answer": "不会。排序层决定显示顺序，物理 Layer 与接触配置决定能否交互。",
          "scenario": "角色有两个Collider2D，区域有Is Trigger的BoxCollider2D。Physics 2D层矩阵已禁止双方交互；现在只改变SpriteRenderer的Sorting Layer，其他物理设置不变。"
        },
        "scenario": "同一张骑士图片，改到最前面的Sorting Layer后仍然穿过检查点；另一个检查点又把一个骑士算成两个人。本课在一个二维动态角色和一个感应区里，分别查物理过滤和形状身份。",
        "purpose": "看日志前先确认接触条件，人数统计能在多形状、禁用或销毁时保持正确。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l037"
      ],
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
      "id": "l038",
      "title": "二维射线、形状投射与查询证据",
      "goals": [
        "解释射线和体积投射的区别",
        "使用 LayerMask 限定查询",
        "观察起点在碰撞体内部的结果"
      ],
      "theory": [
        {
          "title": "射线回答的是一条线的问题",
          "paragraphs": [
            "角色面前有一道窄缝，中心射线没有命中，但身体过不去。原因并不神秘：Physics2D.Raycast 没有角色宽度，只检查从起点沿某方向的一段线。它返回命中信息，不会自动推动物体，也不会替你限制下一步位移。",
            "若要问“整个身体向右走会撞到什么”，应研究 Collider2D 或 Rigidbody2D 的 Cast，或选择适当形状投射。若只需知道脚下某点有没有地面，一条射线可能足够。先写清要证明的事实，再画出几何范围，可以避免用十几根随意摆放的射线补救错误的问题定义。"
          ]
        },
        {
          "title": "方向不是终点，范围不是无限",
          "paragraphs": [
            "设起点在世界坐标(10, 2)，目标在(13, 2)，方向应由目标减起点得到，而不是直接使用目标坐标。如果把(13, 2)当方向，射线就会稍微向上，且移动整个场景后方向还会变化。将差值作为方向，再明确检测距离，才能表达同一个几何问题。",
            "environment 掩码应只包含所需环境层。LayerMask 是层集合，不是单个 Layer 编号；查询是否包含 Trigger、是否限定深度，也需要按具体重载或过滤器设置。二维物理主要看 XY，但接口还可能使用 Z 深度作筛选，因此同一画面上的对象也可能被深度条件排除。"
          ]
        },
        {
          "title": "从形状内部出发会得到特殊结果",
          "paragraphs": [
            "把探针放进墙的 Collider2D 内，再向右发射射线，二维查询仍可能报告这个包含起点的形状。此时没有通常意义上的进入表面，fraction 可能是零，法线按射线反方向表示。若不知道这个规则，就可能把自己的角色误认成贴在面前的墙。",
            "先显示命中对象与距离，再决定如何处理。可以用环境掩码排除自身，选择合适起点，或明确筛掉自己的形状。但不能直接丢弃所有零距离结果，因为出生在障碍内部也可能是需要发现的真实问题。三维射线的内部起点规则不同，不能凭接口名字相似就认为行为相同。",
            "例如射线最大距离是2个单位，墙的进入点距起点0.5单位，fraction约为0.5÷2=0.25。把起点移进墙后，开启“查询从形状内部开始也命中”的相应设置时，包含起点的墙可得到fraction=0。示例只画颜色和法线；实验要读这些数值，还需在 if(hit) 中临时记录 hit.collider.name、hit.distance 与 hit.fraction，再与图上的起点核对。"
          ]
        },
        {
          "title": "查到几个不等于总共只有几个",
          "paragraphs": [
            "假设一个范围里有10个目标，结果数组只能容纳4个。返回4个并不证明附近只有4个，而是可能已经装满。若游戏规则要求处理所有目标，就需要扩容、重试或其他明确策略；如果只关心最近一个，应直接选符合这个问题的接口。",
            "缓存数组还要按本次有效数量读取。例如上次命中4个，这次只命中1个，其余位置可能仍有旧引用。顺序是否按距离排列，要看具体接口文档，而不能把某次日志顺序当成长期保证。这些细节决定了性能优化有没有悄悄改变游戏结果。"
          ]
        },
        {
          "title": "把查询时点也写进实验",
          "paragraphs": [
            "查询读取物理世界在某个时刻的状态。先在一个脚本里改 Transform，又在另一个脚本里立即查询，并不天然保证两者按你想象的顺序完成同步。优先统一身体移动接口和查询阶段，需要即时同步时再理解对应设置与成本。",
            "建立三个回归样本：内部起点、高密度目标、射线能过但身体不能过的窄缝。每次修改过滤或缓存方式，都检查实际命中对象、法线、距离和数量。将这些信息与可视化一起保留，查询结果才是一份可核对的证据，而不只是一个看似正确的 true。",
            "方向还应与移动身体使用同一套坐标约定。若探针挂在旋转父对象下，局部的右方未必等于世界右方。先在 Scene 中旋转父对象，再检查射线显示，能够发现局部方向未经转换就与世界起点混用的问题。这比单看返回的布尔值更容易定位。"
          ]
        }
      ],
      "code": {
        "title": "可见的环境探针",
        "language": "csharp",
        "filename": "RayProbe2D.cs",
        "source": "using UnityEngine;\npublic class RayProbe2D : MonoBehaviour\n{\n    [SerializeField] LayerMask environment;\n    [SerializeField, Min(0)] float distance = 2;\n    void Update()\n    {\n        Vector2 origin = transform.position;\n        RaycastHit2D hit = Physics2D.Raycast(origin, Vector2.right, distance, environment);\n        Debug.DrawRay(origin, Vector2.right * distance, hit ? Color.red : Color.green);\n        if (hit) Debug.DrawRay(hit.point, hit.normal * 0.4f, Color.yellow);\n    }\n}",
        "explanation": [
          "探针放在空对象，environment 只勾选二维墙的层，Scene 视图打开 Gizmos。",
          "该 Update 查询用于观察和绘图；将结果用于物理移动时，还要与身体模拟的实际时点协调。"
        ]
      },
      "lab": [
        {
          "title": "看清命中来自哪里",
          "minutes": 60,
          "steps": [
            "在 Scene 中画出起点、方向和最大距离，并记录命中对象与法线。",
            "在 if (hit) 分支临时输出 hit.collider.name、hit.distance 和 hit.fraction。射线长2、表面距起点0.5时先预测fraction约0.25，再将起点放进墙，记录 Physics 2D 的 Queries Start In Colliders 设置及实际结果。",
            "将角色自身加入查询层观察自命中，再改用仅环境掩码。"
          ],
          "result": "能够用图解释普通表面命中和内部起点命中。",
          "setup": [
            "新建L038_Ray。用Square建Wall，Position=(1,0,0)，BoxCollider2D宽1；新建空Probe，Position=(0,0,0)。保存RayProbe2D.cs并加到Probe。",
            "Inspector > Layer > Add Layer创建Environment，给Wall设置该层；Probe脚本Environment只勾它，Distance设2。代码沿世界+X发射，不会随Probe旋转自动改方向。",
            "打开Window > General > Console；Scene右上打开Gizmos。Edit > Project Settings > Physics 2D查Queries Start In Colliders，记录开关状态后再把Probe移入墙内。"
          ],
          "purpose": "用画出的线与命中字段对应普通表面命中和内部起点命中，排除“探针其实查到了自己”。"
        },
        {
          "title": "用反例选择几何与容量",
          "minutes": 60,
          "steps": [
            "建立宽度小于角色、中心射线能通过的窄缝，比较射线和身体形状投射。",
            "在范围内逐步增加目标数量，检查固定数组装满时是否遗漏。",
            "重复查询前后移动目标，只遍历本次有效结果，确认没有读入上轮残留。"
          ],
          "result": "查询形状、容量和有效区间都有明确处理。",
          "setup": [
            "另存L038_Shape，用两个带BoxCollider2D的Square夹出0.6单位缝隙，准备宽1单位的角色参照物。保留空Probe的射线作基准。",
            "本组需要把查询改为与身体匹配的Collider2D.Cast或形状投射；现成RayProbe2D只做单射线和单命中，不能自动产生多目标数组。先打开本课官方对应接口页选择重载，再在实验副本实现。",
            "容量对照先放3个可命中目标，结果数组设4格；再逐一增加到4、5个。每次只读本次返回的有效数量，不遍历数组上轮残留。"
          ],
          "purpose": "证明中心线通行不等于身体通行，并检查固定数组装满是否漏掉了目标。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "探针总命中角色自己",
          "cause": "起点位于自身碰撞体且掩码包含角色。",
          "fix": "使用环境专用 LayerMask，并画出查询。"
        },
        {
          "symptom": "移动越远射线方向越奇怪",
          "cause": "把目标位置作为方向向量。",
          "fix": "使用目标位置减起点，再指定范围。"
        }
      ],
      "exercise": {
        "brief": "制作可解释的前方障碍检查器，给出窄缝、内部起点和 Trigger 三类反例。",
        "deliverables": [
          "可视化探针",
          "三个反例场景",
          "射线与形状投射选择理由"
        ],
        "rubric": [
          {
            "item": "方向距离正确",
            "points": 25
          },
          {
            "item": "掩码证据完整",
            "points": 25
          },
          {
            "item": "反例可复现",
            "points": 25
          },
          {
            "item": "几何选择合理",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "射线未命中，能证明整个角色可以穿过窄缝吗？",
          "options": [
            "能，中心路径代表整个身体",
            "不能，射线没有身体宽度",
            "能，只要射线长度超过角色宽度",
            "能，只要查询放在 FixedUpdate"
          ],
          "answer": 1,
          "explanation": "身体通行与线相交是不同几何问题，需选择合适的形状查询。",
          "scenario": "门缝宽0.6个世界单位，角色身体宽1；一条无宽度的中心Physics2D射线朝门缝发射，没有命中门框。"
        },
        {
          "question": "LayerMask 的数值表示什么？",
          "options": [
            "单个对象的 Layer 编号",
            "允许参与查询的多个层的位集合",
            "最近命中对象的 Sorting Layer",
            "查询距离的整数部分"
          ],
          "answer": 1,
          "explanation": "一个掩码可以同时包含多个层。单个层编号不能直接替代对应位集合。",
          "scenario": "环境层编号为8，查询需要同时允许地面和墙所在的若干Layer；参数类型为LayerMask，不是gameObject.layer。"
        },
        {
          "question": "二维射线从形状内部出发，可能得到什么？",
          "options": [
            "所有接口必然忽略该形状",
            "零距离命中及内部起点对应的特殊法线",
            "只要起点在内部就必然抛异常",
            "自动将起点移到形状表面再查询"
          ],
          "answer": 1,
          "explanation": "需结合命中对象与 fraction 识别内部起点，不能假定每个命中都有普通进入表面。",
          "scenario": "探针起点位于墙的Collider2D内部；本题启用Queries Start In Colliders，从内部向右发射一条非零方向射线。"
        }
      ],
      "references": [
        {
          "label": "Physics2D.Raycast",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics2D.Raycast.html"
        },
        {
          "label": "Collider2D.Cast",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Collider2D.Cast.html"
        }
      ],
      "summary": [
        "射线只检查一条线；判断身体能否通过，要选择合适形状。",
        "同时核对起点、方向、范围、过滤、时点和结果容量。"
      ],
      "teaching": {
        "question": "墙有 Collider2D，探针就在墙内，为什么命中距离会是零？",
        "keyIdea": "二维射线可以报告包含起点的形状。它没有穿过一个进入表面，所以零距离和特殊法线需要按内部起点来解释。",
        "walkthrough": [
          {
            "title": "从墙外发射",
            "text": "把探针放在墙左边并保持起点在形状之外，向右发射，观察命中对象、正距离与表面法线。"
          },
          {
            "title": "把起点移入墙",
            "text": "其余参数不变，可能得到 fraction 为零的命中，命中对象仍是墙。"
          },
          {
            "title": "区分自己与障碍",
            "text": "查看命中形状归属；自身可由环境掩码排除，真实的墙内出生则应单独报告。"
          }
        ],
        "prediction": {
          "question": "结果数组长度四，本次恰好返回4个，能据此证明没有第五个目标吗？",
          "answer": "不能。数组可能已满，需要明确容量不足时的处理，才能判断结果是否完整。",
          "scenario": "某次二维多结果查询使用4格数组，返回本次有效数量4。调用者没有进行扩容重查，也还不知道范围内真实目标总数。"
        },
        "scenario": "你站在窄缝前，中心射线没有变红，角色却挤不过去；把探针挪进墙里，命中距离又突然变成0。这个二维实验让起点、方向、最大距离和身体宽度都能在Scene里看见。",
        "purpose": "每个查询结果都能说清“查的是什么、从哪出发、被什么过滤”，不再只拿一个true或false猜问题。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l038"
      ],
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
      "id": "l039",
      "title": "俯视移动：输入、身体与表现的边界",
      "goals": [
        "将输入采样和物理运动拆开",
        "消除斜向速度增大",
        "避免两个组件争写位置"
      ],
      "theory": [
        {
          "title": "按键表达想往哪走，不是已经怎样移动",
          "paragraphs": [
            "按住 D 时，玩家想向右走；如果角色顶着墙，实际移动却可能接近零。把这两个量都叫 move，就容易让动画、击退和身体控制互相混淆。先把按键读成输入方向，再由运动组件决定目标速度，最后让物理模拟处理接触，这样每个数值的含义都明确。",
            "最小示例可以在 Update 读取键盘并缓存 Vector2，在 FixedUpdate 中写 Rigidbody2D 的速度。二者是不同更新节奏，并非两个独立线程。没有物理步的显示帧仍可能收到输入；连续多个物理步也可能使用同一次最近输入。"
          ]
        },
        {
          "title": "右上为什么比正右快",
          "paragraphs": [
            "单按 D 得到(1, 0)，向量长度是1；同时按 W 和 D 得到(1, 1)，长度是根号二。直接乘速度5，斜向速度约为7.07。将非零向量归一化，就能保持键盘各方向的速度一致。",
            "但归一化也会把手柄轻推0.25变成长度1，慢走意图随之丢失。ClampMagnitude 到1只限制过长的输入，会保留小于1的幅度。应根据设备表达的是方向还是方向加强度来选择。数学处理不是固定仪式，每一步都应能解释它保留和丢掉了什么信息。",
            "先不接设备，直接把四个向量代入：零输入保持零；(1,0)保持长度1；(1,1)应被限制到长度1；(0.25,0)应保留长度0.25。若某种处理让最后一组也变成1，它改变的不只是斜向速度，而是删除了模拟输入的强度。四个简单值就能验证算法，再接回键盘和手柄，设备差异不容易掩盖数学问题。"
          ]
        },
        {
          "title": "只翻转图片，不翻转整个物理身体",
          "paragraphs": [
            "可以让根对象放 Rigidbody2D、Collider2D 与移动脚本，Visual 子对象放 SpriteRenderer 和动画。向左走时只翻转图片，根身体的坐标和形状保持稳定。这样美术朝向不会意外改变脚底探针、子碰撞体或挂点的物理关系。",
            "方向还可以保存最后一次非零输入，让角色停下后继续面向刚才的方向。动画是否播放走路则另作选择：读取输入会让角色顶墙仍跑步，读取实际速度则可能停步。两种都可能符合玩法，但必须清楚读的是意图还是身体结果，而不是靠一个参数同时代表所有含义。"
          ]
        },
        {
          "title": "一次按下和持续方向需要不同传递方法",
          "paragraphs": [
            "移动方向在按住时持续成立，重复使用最近值通常合理。冲刺或交互按下只表示一次请求，如果仅保留一个显示帧，恰好没有物理步时可能丢失；如果一直保留到松键，多个物理步又可能重复消费。",
            "简单方案是保存一个待处理标记，由负责动作的组件接受后清除，也可以使用递增请求编号。还要规定繁忙时拒绝还是短暂缓存，以及暂停、失焦或禁用时是否清空。换成 Input Action 后，这些规则仍然需要，因为设备接口不会自动替你定义动作的生命周期。"
          ]
        },
        {
          "title": "用单一写入者排查抖动",
          "paragraphs": [
            "若移动脚本写刚体速度，Animator 同时给根对象播放 Position 曲线，两个系统就可能分别移动同一个身体。症状可能是走不动、抖动或瞬移。正确检查是列出所有位置与速度写入点，再逐个关闭，观察问题在哪个组合出现。",
            "本课将动态身体的速度交给运动脚本，动画只换 Sprite，先不处理根运动与复杂外力。失焦或停用时也要避免保留旧方向导致返回后继续移动。完成后测量正向与斜向的相同时长位移，并用轻推输入验证幅度，才能证明控制规则与代码一致。",
            "命名也能帮助检查控制过程。将字段分别叫输入方向、目标速度和实际速度，比只写一个 move 更容易读懂日志。加入减速区时，可以先检查输入是否仍为满幅，再检查目标速度是否已经降低，最后确认身体是否受墙或外力影响。按这个顺序排查，不需要先引入庞大框架。"
          ]
        }
      ],
      "code": {
        "title": "最小的新输入系统俯视移动",
        "language": "csharp",
        "filename": "TopDownKeyboardMotor.cs",
        "source": "using UnityEngine;\nusing UnityEngine.InputSystem;\n[RequireComponent(typeof(Rigidbody2D))]\npublic class TopDownKeyboardMotor : MonoBehaviour\n{\n    [SerializeField] float speed = 5;\n    Rigidbody2D body;\n    Vector2 input;\n    void Awake() { body = GetComponent<Rigidbody2D>(); }\n    void Update()\n    {\n        var k = Keyboard.current;\n        input = k == null ? Vector2.zero : new Vector2(\n            (k.dKey.isPressed ? 1 : 0) - (k.aKey.isPressed ? 1 : 0),\n            (k.wKey.isPressed ? 1 : 0) - (k.sKey.isPressed ? 1 : 0));\n        input = Vector2.ClampMagnitude(input, 1);\n    }\n    void FixedUpdate() { body.linearVelocity = input * speed; }\n    void OnDisable() { input = Vector2.zero; if (body) body.linearVelocity = Vector2.zero; }\n}",
        "explanation": [
          "启用 Input System 1.20.x。角色使用 Dynamic、无重力并冻结旋转的 Rigidbody2D，同时关闭旧移动脚本。",
          "固定键盘读取用于看清输入到速度的过程。正式设备切换与重绑定可通过 Move Action 提供，但仍需保留清楚的动作消费规则。"
        ]
      },
      "lab": [
        {
          "title": "用数值解释斜向与轻推",
          "minutes": 60,
          "steps": [
            "在无墙、无阻尼的俯视场景，从同一起点分别保持D和W+D各2秒，读取起止世界坐标并计算位移长度。先关闭加速和平滑，排除起步过程，再比较是否约为10个世界单位。",
            "对照原向量、normalized 和 ClampMagnitude 三种处理。",
            "直接依次提供(0,0)、(1,0)、(1,1)、(0.25,0)作为测试输入，不要求先接手柄；记录每种处理后的向量和目标速度，再解释哪些规则保留了慢走。"
          ],
          "result": "能根据输入设备说明为什么选择某种向量处理。",
          "setup": [
            "新建L039_Keyboard。GameObject > 2D Object > Sprites > Square建Player，添加Dynamic Rigidbody2D和BoxCollider2D；Gravity Scale=0、Linear Damping=0，冻结Rotation Z。",
            "保存TopDownKeyboardMotor.cs到Assets/EngineLabs，选Player用Inspector > Add Component添加，Speed=5，关闭其他移动脚本。Window > Package Management > Package Manager确认Input System已安装；Player Settings启用相应Active Input Handling。",
            "按Play后先点Game窗口取得键盘焦点。记录Inspector的Transform坐标；向量算法对照在学习项目的脚本副本改input处理，不改正式角色代码。"
          ],
          "purpose": "先用固定向量证明归一化和限幅各保留什么，再用相同时间位移验证键盘结果。"
        },
        {
          "title": "定位两个系统同时移动身体",
          "minutes": 60,
          "steps": [
            "给根对象临时添加 Position 动画，观察与刚体移动同时启用时的异常。",
            "分别关闭 Animator 与移动脚本，记录哪个组合会出现抖动。",
            "删除实验位置曲线，将图片放到 Visual，只翻转显示；再测试停用恢复是否留下旧输入。"
          ],
          "result": "身体移动与图片表现分开，故障定位有对照过程。",
          "setup": [
            "先把键盘移动场景另存L039_Visual。选Player，GameObject > Create Empty建Visual子对象，将SpriteRenderer放到Visual，根保留身体和运动脚本。",
            "Window > Animation > Animation打开动画窗口。在实验副本中给根Transform录制一条Position曲线，与刚体移动同时运行；记下这条临时曲线，测试后删除。",
            "翻转先改Visual的SpriteRenderer > Flip X；不要同时给根对象负缩放。每轮分别记录输入、速度和根位置，停用恢复也只关一个组件。"
          ],
          "purpose": "定位动画与物理都在改根位置的冲突，避免把抖动归咎于输入设备。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "斜向跑得更快",
          "cause": "输入向量长度大于一。",
          "fix": "根据设备是否表达输入强度来选择 ClampMagnitude 或归一化。"
        },
        {
          "symptom": "运动时反复弹回原点",
          "cause": "动画曲线或其他脚本也在写根位置。",
          "fix": "列出写入者，动画只负责需要的表现属性。"
        }
      ],
      "exercise": {
        "brief": "改造自己的骑士移动，让输入、身体与 Visual 分离，并解释贴墙时动画依据。",
        "deliverables": [
          "控制器和层级截图",
          "斜向测量表",
          "写入责任说明"
        ],
        "rubric": [
          {
            "item": "采样与物理分离",
            "points": 25
          },
          {
            "item": "速度单位正确",
            "points": 25
          },
          {
            "item": "视觉分层明确",
            "points": 25
          },
          {
            "item": "禁用状态可解释",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "手柄轻推需要保留慢速，适合怎样处理？",
          "options": [
            "所有非零输入都归一化",
            "用 ClampMagnitude 将最大长度限制为一",
            "只保留方向正负，丢弃幅度",
            "把输入长度乘上渲染帧率"
          ],
          "answer": 1,
          "explanation": "限制上界不会把小输入放大，因而能保留轻推强度。",
          "scenario": "手柄输出(0.25,0)，表示向右轻推四分之一幅度；希望保留慢走，同时避免对角输入长度超过1。"
        },
        {
          "question": "Update 与 FixedUpdate 分工说明什么？",
          "options": [
            "输入和物理分别运行于两个必然并行的线程",
            "两种更新节奏可以承担不同工作",
            "每个 Update 后必然紧接一个 FixedUpdate",
            "FixedUpdate 无法使用前面缓存的输入"
          ],
          "answer": 1,
          "explanation": "Unity 的更新调度不等于多线程。要考虑一帧零次或多次物理更新的情况。",
          "scenario": "一个MonoBehaviour在Update缓存持续移动方向，在FixedUpdate用缓存写Rigidbody2D速度；两个方法都按Unity主循环调度。"
        },
        {
          "question": "只改变角色图片朝向时，通常优先修改哪里？",
          "options": [
            "整个物理根的所有轴缩放",
            "显示子对象或 SpriteRenderer",
            "所有子碰撞体的世界位置",
            "每次重建 Rigidbody2D"
          ],
          "answer": 1,
          "explanation": "纯显示变化尽量局限于显示层，避免连带改变身体和探针的空间关系。",
          "scenario": "角色根放Rigidbody2D和Collider2D，Visual子对象只放SpriteRenderer；本次需求仅是让图片面向左方，不改变身体和探针。"
        }
      ],
      "references": [
        {
          "label": "Rigidbody2D.linearVelocity",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody2D-linearVelocity.html"
        },
        {
          "label": "Input System direct workflow",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/using-direct-workflow.html"
        }
      ],
      "summary": [
        "输入表达想怎样移动，实际速度表达身体怎样运动。",
        "移动脚本控制身体，显示子对象处理图片朝向和动画。"
      ],
      "teaching": {
        "question": "W 和 D 一起按时跑得更快，直接 normalized 就适合所有设备吗？",
        "keyIdea": "键盘对角向量需要限制长度，但手柄还表达推杆幅度。归一化保留方向、丢掉强度；限制最大长度则能保留轻推。",
        "walkthrough": [
          {
            "title": "计算键盘长度",
            "text": "D 对应的输入长度为1，W+D 的长度为√2；直接乘速度5时，后者的目标速度约为7.07。"
          },
          {
            "title": "选择键盘处理",
            "text": "将非零键盘向量归一化后再乘速度5，正向和斜向的目标速度长度都为5，不再额外加速。"
          },
          {
            "title": "加入手柄反例",
            "text": "输入长度0.25时，normalized 会变满速，ClampMagnitude 到1则仍保留四分之一速度。"
          }
        ],
        "prediction": {
          "question": "角色顶住墙时仍有输入长度1，实际速度为0，动画应读取哪一个？",
          "answer": "取决于希望表现奋力跑步还是停步。前者可读输入，后者可读实际速度，关键是明确参数表示什么。",
          "scenario": "骑士持续按向右，输入向量长度为1；动态身体被墙阻挡，当前实际速度为0。你正在选择动画参数描述“想移动”还是“真的在移动”。"
        },
        "scenario": "骑士单按D走得正常，同时按W和D却突然加速；修好后又发现手柄轻推也满速。先在无墙的二维场景比较输入向量，再让墙、刚体和动画分别加入，看到每一层改变了什么。",
        "purpose": "把设备意图、身体结果和图片朝向分开，既能解释斜向速度，也能决定顶墙时动画该怎样表现。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l039"
      ],
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
      "id": "l040",
      "title": "穿透、插值与物理故障实验",
      "goals": [
        "用可重复条件研究穿透",
        "区分插值与连续检测",
        "用证据选择修复方案"
      ],
      "theory": [
        {
          "title": "一步能走多远，先算再调",
          "paragraphs": [
            "设小球速度为每秒50个世界单位，固定步长0.02秒，一步约走1个世界单位。墙厚只有0.1个世界单位，小球前后两个采样位置就可能分别位于墙两侧。离散检测主要在离散状态上寻找接触，细小高速物体可能因此漏掉穿越过程。",
            "但穿墙不一定都来自这个原因。墙是 Trigger、Layer 禁止交互、身体类型不符合预期，或代码直接传送 Transform，也会产生相似表象。先确认基本接触能成立，再用速度乘步长与墙厚、身体尺寸比较，才有理由讨论检测精度。"
          ]
        },
        {
          "title": "连续检测与插值分别改变哪一层",
          "paragraphs": [
            "连续碰撞检测尝试考虑两个物理状态之间的运动路径，用来改善高速碰撞。它有额外开销，也受身体类型、模式和运动方式等条件限制，不能理解为勾上后任何代码都不会穿墙。若每帧直接把身体传送到墙后，就不是普通速度推进下的同一实验。",
            "插值解决的是显示问题：身体只在固定步更新，显示帧更频繁时，它可以在已知状态之间生成较平滑的可见运动。插值没有增加物理步数，所以画面变顺而命中仍失败完全可能。应分别记录“碰撞是否正确”和“画面是否平滑”。"
          ]
        },
        {
          "title": "重复实验比一次成功更有说明力",
          "paragraphs": [
            "薄墙漏检可能随起点和采样时机变化。固定速度跑一次没有穿过，不能证明所有相近状态都正确。每次重置位置和速度，保留同样的墙厚、半径和检测模式，至少重复多次并统计失败数；改变条件后用同样流程再测。",
            "例如分别测试 Discrete 与 Continuous，先只改检测模式；下一组再减小步长。不要同一轮同时加厚墙、降速和打开连续检测，否则成功后无法知道哪个改变有效。实验表应保留实际位置或接触证据，而不是仅写“好像好了”。",
            "同一起点重复十次主要检查结果是否稳定，未必覆盖所有穿墙条件。下一组可有计划地把发射起点沿路径平移0、0.02、0.04等距离，每个起点再重复，保持其他参数不变。起点变化使球与墙在固定采样间隔中的相对位置不同，才能检验一次成功是否只是恰好落在容易检测的状态。"
          ]
        },
        {
          "title": "更小时间步也占用整场游戏的预算",
          "paragraphs": [
            "步长从0.02s减到0.01s，每秒物理更新约从50次变成100次。碰撞检测、约束求解和用户的 FixedUpdate 工作都随之增加，影响的不只是那颗小球。在较慢设备上，还可能遇到追赶模拟与最大允许时间等设置带来的行为差异。",
            "因此先问是否只有少量高速对象需要更强检测，再比较针对这些对象的方案。测试平滑问题时先固定相机，再启用跟随；相机每帧读取阶梯变化的目标，也可能制造抖动。目标、相机和物理的影响要分开观察，不能用一次全局步长修改同时解释所有改善。"
          ]
        },
        {
          "title": "高速子弹不一定需要完整刚体模型",
          "paragraphs": [
            "若子弹只需要判断飞行路径上的命中，可以比较沿路径做线段或形状投射的方案。若还需要真实弹跳、旋转碰撞、持续受力与推挤，刚体模型可能更符合需求。两种方案的差异在于谁负责路径与命中，不是给某个失败接口随意打补丁。",
            "路径查询也要处理自身过滤、内部起点、多个候选和可穿透目标。最终报告应说明需求、选择、目标设备成本和仍未覆盖的反例。正确性来自可重复证据，性能来自同条件测量，不能用“连续永远更好”或“步长越小越专业”代替判断。",
            "不要只统计小球最后停在哪里。发生接触后可能反弹或继续滑动，最终位置无法完整说明中间是否命中。可同时记录接触计数、首次命中时的位置和最终状态。若使用自动复位脚本，也应先保存这轮结果再重置，避免证据在下一次发射时被覆盖。"
          ]
        }
      ],
      "code": {
        "title": "一次发射的速度样本",
        "language": "csharp",
        "filename": "FastBody2D.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Rigidbody2D))]\npublic class FastBody2D : MonoBehaviour\n{\n    [SerializeField] float speed = 80;\n    void Start()\n    {\n        GetComponent<Rigidbody2D>().linearVelocity = Vector2.right * speed;\n    }\n    void OnCollisionEnter2D(Collision2D collision)\n    {\n        Debug.Log($\"Contact: {collision.gameObject.name}\", this);\n    }\n}",
        "explanation": [
          "小球使用无重力的 Dynamic Rigidbody2D，右侧放非 Trigger 静态薄墙，并允许 Layer 交互。",
          "每次重进 Play 复位后比较 Discrete 与 Continuous；记录速度、半径和步长，不在同一轮同时改多个条件。"
        ]
      },
      "lab": [
        {
          "title": "重复构造高速漏检",
          "minutes": 60,
          "steps": [
            "固定圆球半径、墙厚、起点和物理步长，计算一步位移。",
            "每个速度先从固定起点重复十次，检查失败是否会再次发生；十次只是本课便于完成的小样本，不是引擎规定，也不能证明故障概率为零。再将起点沿路径平移0、0.02、0.04单位，各自重复，比较接触与失败记录。",
            "分别只改连续模式或步长，再用同样次数测试，并观察物理耗时。"
          ],
          "result": "可复现条件、失败统计与成本观察齐全的表。",
          "setup": [
            "新建L040_Fast。用GameObject > 2D Object > Sprites > Circle建Ball，加CircleCollider2D和Dynamic Rigidbody2D；Gravity Scale=0、Linear Damping=0。",
            "保存FastBody2D.cs后从Ball的Add Component添加，Speed先设50（代码默认80）。用Square建Wall，BoxCollider2D沿X厚0.1，放在球右侧；Is Trigger关闭，双方Layer允许交互。",
            "Edit > Project Settings > Time记下Fixed Timestep原值，先设0.02。Window > General > Console观察Contact日志。每次退出再进入Play，让Start重新发射；不要在同次运行拖回球当成已重置速度。"
          ],
          "purpose": "重复是为了检查结果稳定性，变化起点则覆盖不同采样相位；两者都不构成永远不穿墙的保证。"
        },
        {
          "title": "分别验证平滑和命中",
          "minutes": 60,
          "steps": [
            "在开阔地用慢速球比较插值开关，保持相机静止。",
            "加入跟随相机，再回到薄墙实验，分别记录可见抖动和命中正确性。",
            "增加一个直接写 Transform 传送的反例，说明它为何不属于普通速度积分的同一条件。"
          ],
          "result": "能够区分显示、控制接口和碰撞精度问题。",
          "setup": [
            "另存L040_Smooth，先移走薄墙，保留Ball和静止相机。Inspector > Rigidbody2D分别设Interpolation=None与Interpolate，速度和步长保持相同。",
            "本课没有现成跟随相机脚本；先完成静止相机比较，再按第51课的跟随实验扩展，别把未知相机代码同时引入。",
            "回到薄墙组时恢复同一组起点和墙尺寸；插值对照记录画面平滑与Contact日志两列。直接传送Transform的反例要另存副本，不与普通速度发射混在一轮。"
          ],
          "purpose": "先固定相机排查身体显示，再加入跟随，判断顺滑是否掩盖了仍然失败的命中。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "开启插值后仍然穿薄墙",
          "cause": "插值处理可见状态，不直接增加物理采样。",
          "fix": "确认有效接触，再研究连续检测、步长或查询式命中。"
        },
        {
          "symptom": "把步长调很小后全场变慢",
          "cause": "每秒物理计算次数上升。",
          "fix": "在目标设备用 Profiler 衡量，并优先缩小需要高精度的对象范围。"
        }
      ],
      "exercise": {
        "brief": "提交高速投射物的技术决策：连续刚体或路径查询，附反例与性能预算。",
        "deliverables": [
          "至少三组参数各十次实验",
          "显示与碰撞分别记录",
          "方案边界说明"
        ],
        "rubric": [
          {
            "item": "变量控制完整",
            "points": 25
          },
          {
            "item": "失败统计可信",
            "points": 25
          },
          {
            "item": "成本比较具体",
            "points": 25
          },
          {
            "item": "决策边界明确",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "近似估计一步位移，应怎样计算？",
          "options": [
            "速度乘物理步长",
            "速度除以物理步长",
            "速度乘渲染帧率",
            "物体直径乘质量"
          ],
          "answer": 0,
          "explanation": "速度的单位是每秒位移，乘秒得到本步距离，再与障碍尺寸比较。",
          "scenario": "小球在无加速度的一步里速度为50世界单位/秒，固定步长0.02秒；这里只估算这一物理步的移动距离。"
        },
        {
          "question": "插值主要改善哪一项？",
          "options": [
            "增加碰撞检测的采样次数",
            "显示运动的平滑程度",
            "自动修复 Layer 过滤",
            "让所有身体自动获得连续检测"
          ],
          "answer": 1,
          "explanation": "显示平滑与碰撞正确性需要分开验证。",
          "scenario": "一个动态Rigidbody2D的位置由固定步推进；你仅开启Interpolation，未改变检测模式或Fixed Timestep。"
        },
        {
          "question": "测试一次没有穿墙，能宣布修复吗？",
          "options": [
            "能，只要打开了 Continuous",
            "不能，应固定条件重复并覆盖反例",
            "能，只要平均帧率很高",
            "能，只要最后位置恰好在墙前"
          ],
          "answer": 1,
          "explanation": "采样相位和起点可能隐藏偶发问题，应保留重复次数和失败数据。",
          "scenario": "薄墙试验只发射了一次，球这次停在墙前；还没改变起点或重复发射，也没有保存接触记录。"
        }
      ],
      "references": [
        {
          "label": "CollisionDetectionMode2D",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CollisionDetectionMode2D.html"
        },
        {
          "label": "Rigidbody2D.interpolation",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody2D-interpolation.html"
        }
      ],
      "summary": [
        "先确认有效碰撞，再讨论高速运动下的检测精度。",
        "碰撞命中与视觉平滑分别测试，成本也要在目标设备比较。"
      ],
      "teaching": {
        "question": "小球每秒50个世界单位、步长0.02s，为什么0.1单位厚的墙容易出问题？",
        "keyIdea": "一次物理步约前进一单位，远大于墙厚。应先确认有效接触，再比较是否需要检测步与步之间的路径。",
        "walkthrough": [
          {
            "title": "核对基本碰撞",
            "text": "确认小球为参与模拟的 Dynamic 身体，墙不是 Trigger，双方 Layer 允许接触。"
          },
          {
            "title": "估算采样跨度",
            "text": "50 × 0.02 = 1个世界单位。将一步跨度画在墙旁，直观看到可能跨过薄墙。"
          },
          {
            "title": "隔离改进因素",
            "text": "保持速度和起点不变，仅比较离散与连续；另开一组再缩短步长，并统计多次结果。"
          }
        ],
        "prediction": {
          "question": "只打开插值，能据此期待薄墙命中必然修复吗？",
          "answer": "不能。插值主要改善显示采样，不提高物理检测频率，也不替代连续路径检测。",
          "scenario": "高速球与薄墙已能正常产生接触，Layer和Trigger配置未改。现在仅将Rigidbody2D的Interpolation开启，固定步长、碰撞检测模式与速度全部保持。"
        },
        "scenario": "小球大多能撞墙，偶尔却穿过去；开启插值后画面更顺，穿墙仍没消失。设球速度50单位/秒、固定步长0.02秒、墙厚0.1，先算一物理步会越过多长，再决定测哪种改动。",
        "purpose": "把碰撞正确性与显示平滑分开，能用可复现条件比较连续检测的收益与成本。"
      }
    }
  ]
});
