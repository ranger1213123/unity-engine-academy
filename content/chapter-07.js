// 语境修订：题目背景、实验准备与学习用途。
window.COURSE_MODULES.push({
  "id": "m07",
  "number": 7,
  "title": "三维物理",
  "subtitle": "先理解物体为何下落、碰撞与穿透",
  "description": "分清显示、碰撞形状和刚体模拟，再用数值与实验学习力、速度、接触过滤、空间查询和高速碰撞。",
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
      "id": "l031",
      "title": "Rigidbody 与 Collider：谁决定物体怎么动",
      "prerequisites": [
        "l030"
      ],
      "goals": [
        "区分形状、运动状态与物理模拟",
        "解释动态、运动学和静态对象职责",
        "避免 Transform 与刚体争夺位置"
      ],
      "theory": [
        {
          "title": "为什么看得见的箱子会穿过地板",
          "paragraphs": [
            "在空场景中创建一个 Cube 和一块地板。Cube 上的 MeshRenderer 负责把网格画出来，BoxCollider 负责描述一个可以碰撞的盒形范围。只有显示组件时，画面里虽然像有个箱子，物理系统却没有可接触的形状。添加 Collider 后，箱子可以被查询到，但仍不会仅仅因此下落。",
            "再添加 Rigidbody，并保持非运动学、开启重力，物理系统才会计算它的速度与位置。地板通常只需固定的 Collider。由此可见，显示、形状和运动是三项分开的工作；排查问题时要逐项确认，不能凭模型外观推断组件已经齐全。二维的 Rigidbody2D 也不会代替这里的三维 Rigidbody。",
            "Unity 菜单创建的 Cube 通常已经带有 BoxCollider。为了真正比较“只有显示”与“显示加形状”，第一组应先移除它。三组都不要挂移动脚本，初始位置也不要与地板重叠；这样是否下落才能归因到 Rigidbody，而非出生时的穿插修正。"
          ]
        },
        {
          "title": "先决定由谁推进位置",
          "paragraphs": [
            "假设箱子正在受重力下落，一个脚本却在 Update 中不断把 Transform.position 写回起点。物理系统想让它向下，脚本又把它搬回去，最终画面与接触结果就可能抖动。这就是常说的位置控制权冲突：两个地方都认为自己可以决定同一个位置。",
            "对于动态刚体，正常移动应通过速度或受力等物理接口表达。运动学刚体则适合由代码给定轨迹。确实需要传送时，要单独定义目标位置以及是否保留速度，不把每帧传送当成连续运动。把任意写位置的代码挪进 FixedUpdate，并不能自动解决两个系统相互覆盖的问题。"
          ]
        },
        {
          "title": "用实际尺寸理解重力",
          "paragraphs": [
            "设一个箱子从离地5个世界单位的位置落下。忽略阻力时，落地时间主要由高度和重力加速度决定；将质量从1kg改为2kg，并不会让它在理想情况下快一倍落地。但对两个箱子施加相同的力，较重的箱子得到的加速度较小。质量对受力有影响，与自由落体的结论并不矛盾。",
            "Unity 的常见物理设置按合理世界尺度使用，通常把一个世界单位当作一米。如果模型高200个世界单位，你所看到的小人实际上可能相当于一栋大楼。此时应先核对导入比例、碰撞体高度与物理根对象的缩放，再考虑调整重力。"
          ]
        },
        {
          "title": "一个身体可以由几个形状拼成",
          "paragraphs": [
            "设一辆小车有一个车身和两个突出的挡板。可以在根对象放一个 Rigidbody，再让子对象上的多个 Collider 描述整体形状。这些形状一起属于相应刚体，受到接触作用时，运动的是同一个整体。若给每个挡板再加独立刚体，就可能把原来的整体拆成几个身体。",
            "Transform 的父子关系主要描述空间继承，不等于物理连接。需要铰链或绳链时，应进一步学习 Joint 的连接刚体、锚点与限制。简单胶囊或盒形常比紧贴每个细节的网格更适合角色；动态 MeshCollider 还有具体限制，需要按组件文档选择。"
          ]
        },
        {
          "title": "用最小场景确认每项职责",
          "paragraphs": [
            "先关闭其他移动脚本，只留下地板和箱子。分别禁用 Renderer、禁用控制脚本、切换 isKinematic，记录箱子是否可见、是否下落、是否阻挡。你会发现，隐藏图片不等于移除碰撞，停用脚本也不等于停止物理模拟。这种对照能把一个模糊的“物体坏了”拆成可检查的问题。",
            "角色若不应被撞倒，可以冻结指定旋转轴；冻结约束只是限制允许的运动方向，不会修复错误层设置或两个脚本争写位置。保留质量、尺度、约束、插值和碰撞检测模式的记录，再复制对象做比较，才知道差异来自哪一个条件。",
            "还可以检查一次“碰到了什么”。把箱子的 Collider 临时调小，让外观明显大于形状，观察外观看似已经碰到地板时，物理系统是否仍允许继续下落。这个实验说明接触依据的是碰撞形状，而非网格最底端。恢复尺寸后保存场景，避免把用于演示的错误配置带入后续实验。"
          ]
        }
      ],
      "code": {
        "title": "观察刚体拥有的速度",
        "language": "csharp",
        "filename": "RigidbodyStateProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Rigidbody))]\npublic sealed class RigidbodyStateProbe : MonoBehaviour\n{\n    Rigidbody body;\n    void Awake() => body = GetComponent<Rigidbody>();\n    [ContextMenu(\"Report physics\")]\n    void Report()\n    {\n        if (body == null) return;\n        Debug.Log($\"position={body.position}; velocity={body.linearVelocity}; kinematic={body.isKinematic}\", this);\n    }\n}",
        "explanation": [
          "给带 BoxCollider 的 Cube 添加此脚本；RequireComponent 会要求同对象存在 Rigidbody。地板也要有三维 Collider。",
          "进入 Play 后从组件菜单选择 Report physics，比较 position、linearVelocity 与 isKinematic。脚本只读状态，不负责移动。"
        ]
      },
      "lab": [
        {
          "title": "逐项添加组件",
          "minutes": 60,
          "steps": [
            "在新建的三维空场景创建地板并保留 BoxCollider。另建 Cube 作为箱子，先移除它默认自带的 BoxCollider，只留显示组件；复制为三份，第二份加 BoxCollider，第三份再加动态 Rigidbody。三份都放在地板上方，进入 Play 比较。",
            "在 Inspector 切换 Is Kinematic，记录是否下落；把“是否可见”和“是否受模拟推进”分开记录。",
            "关闭第三个箱子的Renderer，观察显示消失但重力与接触仍存在；再恢复显示并禁用本课的只读状态探针，确认探针停止工作不等于Rigidbody停止模拟。"
          ],
          "result": "一张列出组件组合、可见性、下落和阻挡结果的表。",
          "setup": [
            "在练习项目用File > New Scene新建空场景，File > Save As保存为L031_Components；需要的窗口可从Window > General打开Hierarchy、Inspector和Console。",
            "用GameObject > 3D Object > Cube建Floor，Inspector的Transform设Position=(0,-0.5,0)、Scale=(10,1,10)。再建Cube命名Box，Position=(0,3,0)；菜单建的Cube自带BoxCollider。",
            "要添加脚本，先把本课代码保存为Assets/EngineLabs/RigidbodyStateProbe.cs，回Unity等编译结束；选中第三组箱子，在Inspector点Add Component搜索RigidbodyStateProbe。不要把探针挂到“仅显示”组，因为它会要求自动添加Rigidbody。"
          ],
          "purpose": "分清看得见、能被碰到和会自己运动，得到后续碰撞实验可复用的组件基线。"
        },
        {
          "title": "检查尺度与整体形状",
          "minutes": 60,
          "steps": [
            "将1个世界单位高的 Cube 放到5个世界单位高处，记录质量1kg与2kg时的落地表现。",
            "只缩放显示子对象，再对比缩放整个物理根，观察碰撞体实际尺寸。",
            "建立一个根 Rigidbody 和两个子 Collider，撞击其中一侧，确认整体如何运动。"
          ],
          "result": "能用场景截图说明视觉大小、碰撞形状和刚体归属。",
          "setup": [
            "先完成组件实验，退出Play，用File > Save As另存L031_Scale。保留Floor和一个动态Box，Box的Scale=(1,1,1)、Position=(0,5,0)。",
            "选中Box，在Inspector > Rigidbody将Use Gravity打开、Is Kinematic关闭、Linear Damping设0。每轮退出再进入Play复位；质量在Mass字段改1或2。",
            "复合形状组用GameObject > Create Empty建Body，Add Component添加Rigidbody；在Body下建两个Cube，只保留子对象BoxCollider，不给子对象加Rigidbody。"
          ],
          "purpose": "用同一高度与不同质量分开检验重力、尺寸和复合形状；不是凭外观看组件职责。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "有模型却穿过地面",
          "cause": "缺少 Collider、层过滤错误或运动方式不当",
          "fix": "先检查组件组合与模式，再检查速度和连续检测"
        },
        {
          "symptom": "角色抖动，脚本与物理交替拉位置",
          "cause": "多个系统争写同一物理根 Transform",
          "fix": "由一个明确组件通过合适刚体接口控制身体位置"
        }
      ],
      "exercise": {
        "brief": "设计一个动态箱子、一个运动学平台和一个静态地面，解释各自组件、控制接口与尺度，禁止连续直接改动态 Transform。",
        "deliverables": [
          "组件职责图",
          "三种运动模型场景",
          "禁用与尺度对照记录"
        ],
        "rubric": [
          {
            "item": "运动模型选择正确",
            "points": 25
          },
          {
            "item": "只有一个组件最终控制身体位置",
            "points": 25
          },
          {
            "item": "尺度与形状合理",
            "points": 25
          },
          {
            "item": "二维三维边界清楚",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "只有 MeshRenderer 的模型会自动阻挡动态球吗？",
          "options": [
            "不会，还需要物理形状和正确配置",
            "会，网格表面天然参与碰撞",
            "会，只要没有设置 Is Trigger",
            "会，只要两者处于同一 Layer"
          ],
          "answer": 0,
          "explanation": "MeshRenderer 只提交绘制信息。物理系统需要 Collider 等条件才能建立接触。",
          "scenario": "一个可见模型只有MeshRenderer，没有任何Collider；另一个球有动态Rigidbody和SphereCollider，朝模型运动，双方层允许交互。"
        },
        {
          "question": "动态箱子的移动脚本已禁用，箱子仍下落，最合理的解释是？",
          "options": [
            "禁用脚本等于只暂停了 Update，刚体必须另有隐藏脚本",
            "刚体仍在参与物理模拟",
            "Renderer 按重力更新显示位置",
            "必须等待下一帧，禁用脚本才会同时关闭重力"
          ],
          "answer": 1,
          "explanation": "禁用一个 MonoBehaviour 不会自动禁用同对象的 Rigidbody。应分别检查脚本与模拟设置。",
          "scenario": "箱子带动态Rigidbody，Use Gravity开启；你只禁用同对象上的移动MonoBehaviour，没有关闭GameObject或改变刚体配置。"
        },
        {
          "question": "Rigidbody2D 与普通 BoxCollider 放在相同位置会形成二维接触吗？",
          "options": [
            "会，名字相近的组件可以混用",
            "会，只要双方的 Z 都为零",
            "不会，它们属于两套不同的物理组件",
            "会，只要将项目设为二维模式"
          ],
          "answer": 2,
          "explanation": "二维物理要求对应的 Collider2D。编辑器的二维视图不会把三维组件转换成二维组件。",
          "scenario": "角色带Rigidbody2D，障碍只带三维BoxCollider。二者坐标重叠，未添加任何Collider2D。"
        }
      ],
      "references": [
        {
          "label": "Rigidbody",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.html"
        },
        {
          "label": "Collider",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Collider.html"
        },
        {
          "label": "Rigidbody.linearVelocity",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-linearVelocity.html"
        }
      ],
      "summary": [
        "MeshRenderer画外观，Collider提供碰撞形状，Rigidbody模拟运动。",
        "先决定动态、运动学或静态模式，再选择移动接口和约束。"
      ],
      "teaching": {
        "question": "Cube 已经能显示，也有 BoxCollider，为什么按下 Play 后仍悬在半空？",
        "keyIdea": "MeshRenderer 画出外观，Collider 描述碰撞形状，Rigidbody 模拟运动。若希望箱子受重力影响而下落，还要添加启用物理模拟的 Rigidbody。",
        "walkthrough": [
          {
            "title": "先看组件",
            "text": "地板有 BoxCollider，Cube 只有显示组件和 BoxCollider。没有控制脚本时，两者都不会自行运动。"
          },
          {
            "title": "加入动态刚体",
            "text": "给 Cube 添加 Rigidbody，取消 Is Kinematic 并开启 Use Gravity。物理步开始积累向下速度。"
          },
          {
            "title": "观察接触",
            "text": "Cube 的形状接触地板后，物理系统处理两者的接触，阻止箱子继续穿过地板。只关闭 Renderer，箱子虽然消失，形状和模拟仍在。"
          }
        ],
        "prediction": {
          "question": "只禁用 Cube 上的移动脚本，重力会自动关闭吗？",
          "answer": "不会。只要刚体仍在参与动态模拟且重力开启，物理系统仍会推进运动。",
          "scenario": "箱子有启用的动态Rigidbody和BoxCollider，Use Gravity开启；另有一个移动MonoBehaviour。只取消该脚本组件标题旁的勾选，保持整个对象活动。"
        },
        "scenario": "你把一个箱子放到地板上方，画面里都看得见，按下编辑器顶部三角形Play后，箱子却不落下。本课使用三维Cube箱子与Cube地板，先不接动画或输入，逐项检查显示、碰撞形状和运动组件。",
        "purpose": "学完能判断“没画出来”“没有碰撞形状”和“没有运动模拟”分别应查哪个组件，避免角色不动时到处改设置。"
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
      "id": "l032",
      "title": "力、冲量、速度与 MovePosition：选择可解释的控制方式",
      "prerequisites": [
        "l031"
      ],
      "goals": [
        "用单位解释四种 ForceMode",
        "区分直接设速度和施加力的控制意图",
        "正确使用运动学刚体的连续移动接口"
      ],
      "theory": [
        {
          "title": "推动箱子和指定速度有什么不同",
          "paragraphs": [
            "想象两个操作：持续推箱子，以及要求箱子立刻以每秒五单位向右走。前者告诉物理系统“施加多大的力”，之后的速度还取决于质量、时间和已有运动；后者直接指定速度。AddForce 表达前一种请求，linearVelocity 赋值表达后一种。",
            "例如箱子已经向下落，如果写入速度为水平5m/s、竖直0m/s，就同时取消了原有下落速度。若只想控制水平运动，应先读取旧速度，再替换水平分量并保留竖直分量。持续覆盖速度适合某些街机控制，但会削弱自然受力响应；官方也不把它作为真实动力学物体的通用做法。"
          ]
        },
        {
          "title": "把四种 ForceMode 换成可计算的变化",
          "paragraphs": [
            "先关闭重力与阻尼，设质量为2kg、物理步长为0.02s。给 Force 模式传入10N的力，一步速度增量为Δv = 10 × 0.02 ÷ 2 = 0.1m/s。Acceleration 把10当作10m/s²的加速度，同一步得到0.2m/s，不再除以质量。",
            "Impulse 把输入当作一次冲量，传入10N·s得到速度增量5m/s，不再乘步长。VelocityChange 则直接增加10m/s的速度，不依赖质量。这里比较的是相同输入数值在不同模式下的含义，不能把四个数都当成同一种单位。理解单位后，才知道为什么冲量再乘 fixedDeltaTime 会把一次冲击错误缩小。",
            "公式使用10作为便于比较的输入，下面源码却是另一组实验：默认每步施加向右1m/s²的 Acceleration，菜单操作只增加一次向上3N·s的 Impulse。质量为2kg时，一步水平增量约0.02m/s，一次竖直增量约1.5m/s。先用这两个预测核对源码，再在副本中改模式与数值；不要把公式表中的10误认为脚本已经配置好的参数。"
          ]
        },
        {
          "title": "调用一次还是每步调用",
          "paragraphs": [
            "若每个固定步都施加同样的力，力会在连续时间里积累效果。把步长减半，每秒调用次数翻倍，每次积累的速度变化减半，在理想隔离条件下，一秒后的总变化应相近。反过来，冲量通常用于一次跳跃或爆炸，每步重复施加就相当于不断重新爆炸。",
            "AddForce 的作用由后续模拟应用，因此不能在调用的下一行就假定读到了最终模拟结果。实验应明确记录时点，例如在模拟推进后取样，或观察一段固定时长后的速度。否则你可能把观测过早误认为接口没有作用。"
          ]
        },
        {
          "title": "运动学平台要给目标位置",
          "paragraphs": [
            "如果平台严格沿一条预定路线移动，可用运动学刚体表达由代码控制的轨迹。先计算本步位移（速度 × 固定步长），再把位移加到当前位置，得到下一目标世界位置，再调用 MovePosition。接口接收的是位置；把方向向量直接传入，会把平台拉向一个靠近世界原点的点。",
            "这类连续移动还可以与插值配合。直接设置 Rigidbody.position 更接近明确传送，不能将两者不加区分地替换。平台能平滑移动，也不证明乘客一定能稳定站住；乘客的摩擦、接触、控制方式和相对运动仍需要单独验证。"
          ]
        },
        {
          "title": "多种运动来源要先规定如何相加",
          "paragraphs": [
            "设玩家输入希望向右5m/s，爆炸提供向左3m/s。如果两个脚本依次写完整速度，结果只剩最后一个值；这不是自动相加。可以让一个运动组件收集输入和外部速度，再按规则合成，也可以选择以力驱动的方案。关键是先说明击退是否应被玩家立即抵消，随后才能判断实现是否正确。",
            "平地教学控制器即使保留了竖直速度，也还没有处理斜坡、台阶和移动地面。完成质量1kg与2kg、两种步长的对照后，应写明目前支持的场景。能够用单位、调用频率和保留分量预测结果，比一组碰巧好用的速度参数更便于迁移。",
            "测量时还要区分输入值与最后看到的总速度。如果箱子原来已经向右运动，新的力是在原状态上继续增加速度；若箱子同时碰到墙，接触也会改变结果。先在无接触、初速度为零的条件下验证公式，再恢复重力与障碍，才能知道偏差来自哪一个环节。"
          ]
        }
      ],
      "code": {
        "title": "一次冲量与持续加速度",
        "language": "csharp",
        "filename": "ForceModeProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Rigidbody))]\npublic sealed class ForceModeProbe : MonoBehaviour\n{\n    [SerializeField] Vector3 acceleration = Vector3.right;\n    Rigidbody body;\n    bool impulsePending;\n    void Awake() => body = GetComponent<Rigidbody>();\n    [ContextMenu(\"Queue impulse\")]\n    void QueueImpulse() => impulsePending = true;\n    void FixedUpdate()\n    {\n        body.AddForce(acceleration, ForceMode.Acceleration);\n        if (!impulsePending) return;\n        impulsePending = false;\n        body.AddForce(Vector3.up * 3f, ForceMode.Impulse);\n    }\n}",
        "explanation": [
          "动态刚体关闭重力，将 linearDamping 设为零，便于观察单一因素。每个 FixedUpdate 都施加持续加速度。",
          "播放时从组件菜单执行 Queue impulse；待处理标记只会被消费一次，所以一次菜单操作只施加一次冲量。"
        ]
      },
      "lab": [
        {
          "title": "验证质量和时间的影响",
          "minutes": 60,
          "steps": [
            "先用原示例验证：质量2kg、步长0.02s、无重力和阻尼时，每步水平速度约增加0.02m/s；执行一次 Queue impulse 后，竖直速度约增加1.5m/s。暂停并逐步观察，不将两种轴向变化混算。",
            "四模式对照使用独立脚本副本：将持续加速度设为零，在待处理请求被消费的分支中只保留一次 AddForce。每次重新运行并清零初速度，分别输入 Force=10N、Acceleration=10m/s²、Impulse=10N·s、VelocityChange=10m/s。先预测下一模拟步的增量，再读数。",
            "将固定步长减半，先按公式预测一步和一秒后的差别，再记录模拟后的速度。"
          ],
          "result": "包含单位、质量、步长、调用次数和速度增量的对照表。",
          "setup": [
            "用File > New Scene建空场景并保存L032_Forces；GameObject > 3D Object > Cube建ForceBox，Position=(0,3,0)。保存本课ForceModeProbe.cs到Assets/EngineLabs后，在选中箱子的Inspector > Add Component添加它。",
            "在Inspector > Rigidbody设Mass=2、Use Gravity关闭、Linear Damping=0；ForceModeProbe的Acceleration设(1,0,0)。删除或停用其他会移动箱子的脚本。",
            "用Edit > Project Settings > Time查看Fixed Timestep并记下原值，先设0.02。打开Window > General > Console；Play后通过ForceModeProbe组件标题右侧菜单选择Queue impulse。实验后恢复原时间设置。"
          ],
          "purpose": "把源码的真实数值与公式对齐，查明质量、时间和输入单位分别在哪一步起作用。"
        },
        {
          "title": "比较速度控制与平台移动",
          "minutes": 60,
          "steps": [
            "让箱子自由下落，分别测试只替换水平速度和覆盖完整速度，记录竖直速度。",
            "建立运动学平台，在 FixedUpdate 中计算世界目标位置并调用 MovePosition。",
            "给平台加乘客，再检查接触；写出此实验尚未解决的坡面或平台相对速度问题。"
          ],
          "result": "能说明每个接口接收什么，以及哪些运动被保留。",
          "setup": [
            "另存场景L032_Controls。比较速度分量时给箱子打开Use Gravity，并停用ForceModeProbe，避免它继续叠加水平加速度。",
            "本课没有现成MovePosition平台脚本。这组是独立编写练习：先用GameObject > 3D Object > Cube建Platform，Add Component添加Rigidbody并勾Is Kinematic，记录起点。",
            "平台控制只在FixedUpdate计算“当前位置+速度×Time.fixedDeltaTime”并交给MovePosition；只给这个新脚本写平台位置。先不放乘客，确认平台轨迹后再加动态箱子。"
          ],
          "purpose": "验证一次完整速度赋值到底覆盖了什么，再把严格轨迹的平台与动态箱子区分开。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "跳跃冲量非常小且随步长变",
          "cause": "对 Impulse 又乘了一次 fixedDeltaTime",
          "fix": "按模式单位与文档公式计算，不再额外乘一次时间"
        },
        {
          "symptom": "角色无法下落或击退被清零",
          "cause": "每步覆盖了全部速度",
          "fix": "写清输入接管哪些分量，以及如何保留重力或击退"
        }
      ],
      "exercise": {
        "brief": "为可推动箱子、街机角色和运动学平台分别选择接口，给出单位、调用频率与质量影响，并实现其中两种。",
        "deliverables": [
          "控制策略表",
          "两种实现",
          "质量与固定步长对照"
        ],
        "rubric": [
          {
            "item": "ForceMode 公式正确",
            "points": 25
          },
          {
            "item": "接口匹配运动模型",
            "points": 25
          },
          {
            "item": "调用频率和消费正确",
            "points": 25
          },
          {
            "item": "外部速度保留规则明确",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "一次 Impulse 的速度增量还需要再乘模拟步长吗？",
          "options": [
            "不需要，冲量除以质量得到速度增量",
            "需要，因为所有 FixedUpdate 中的数值都必须乘步长",
            "需要，并且要再除以渲染帧率",
            "不需要，因为所有 ForceMode 都忽略质量"
          ],
          "answer": 0,
          "explanation": "Impulse 已经具有时间积分后的含义。是否乘时间必须看单位，不能只看调用函数所在的位置。",
          "scenario": "质量2kg的动态箱子初速度为零，无重力与阻尼。在一个物理步前只执行一次AddForce，模式为Impulse，输入冲量为10N·s。"
        },
        {
          "question": "向 linearVelocity 写入一个完整的新向量会发生什么？",
          "options": [
            "自动保留此前每种受力产生的速度",
            "替换当前速度，包括未保留的分量",
            "把该向量解释为附加外力",
            "只改变水平分量，竖直分量永远保留"
          ],
          "answer": 1,
          "explanation": "赋值不是叠加。希望保留重力或击退时，需要显式保留或组合相应分量。",
          "scenario": "箱子当前linearVelocity=(0,-3,0)，脚本接着执行body.linearVelocity=new Vector3(5,0,0)，没有其他写入者。"
        },
        {
          "question": "MovePosition 的参数表示什么？",
          "options": [
            "每秒移动的速度",
            "从当前位置出发的位移增量",
            "期望到达的世界位置",
            "相对父对象的固定偏移"
          ],
          "answer": 2,
          "explanation": "调用方通常根据当前位置、速度和时间计算目标世界位置，再提交给接口。",
          "scenario": "运动学平台本步位置为(2,0,0)，计划向右移动。脚本准备调用三维Rigidbody.MovePosition，需要决定传入值的含义。"
        }
      ],
      "references": [
        {
          "label": "Rigidbody.AddForce",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.AddForce.html"
        },
        {
          "label": "Rigidbody.MovePosition",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.MovePosition.html"
        },
        {
          "label": "Rigidbody.linearVelocity",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-linearVelocity.html"
        }
      ],
      "summary": [
        "根据单位、质量和调用次数，推导力或冲量怎样改变速度。",
        "直接写速度时，要明确保留哪些分量以及怎样处理外力。"
      ],
      "teaching": {
        "question": "质量为2kg的箱子，分别收到10N的Force和10N·s的Impulse，为什么速度变化不同？",
        "keyIdea": "输入数值的物理含义由 ForceMode 决定。力需要乘持续时间，冲量已经代表一段时间里累积的作用，两者不能再用同一个公式。",
        "walkthrough": [
          {
            "title": "固定测试条件",
            "text": "关闭重力和阻尼，将质量设为2kg、固定步长设为0.02s，并将初速度设为0m/s。"
          },
          {
            "title": "计算持续力的一步",
            "text": "Force 的速度增量是10 × 0.02 ÷ 2 = 0.1m/s。先预测，再等模拟推进后读数。"
          },
          {
            "title": "重新开始测试冲量",
            "text": "复位后只施加一次10N·s的 Impulse，增量为10 ÷ 2 = 5m/s。差别来自单位，而非接口随机。"
          }
        ],
        "prediction": {
          "question": "质量不变，把物理步长减半，一次 Impulse 的理论速度增量也会减半吗？",
          "answer": "不会。一次冲量的速度增量不再乘模拟步长；持续 Force 每步的增量才会随步长变化。",
          "scenario": "同一个质量2kg、初速度为零且无阻尼的箱子，每轮只接收一次相同10N·s的Impulse；唯一改变是固定步长从0.02秒变为0.01秒。"
        },
        "scenario": "同样是把箱子向右推，有时质量加倍就明显变慢，有时却毫无变化。先把试验箱子设为2kg，关闭重力和阻尼，再看“力”“冲量”和“直接指定速度”究竟各输入了什么。",
        "purpose": "把运动参数连同单位和调用次数一起读懂，遇到跳跃太弱或移动慢几十倍时能算出原因。"
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
      "id": "l033",
      "title": "接触、触发器、层矩阵与物理材质",
      "prerequisites": [
        "l032"
      ],
      "goals": [
        "区分阻挡接触与触发通知",
        "用碰撞矩阵和刚体条件检查回调",
        "解释摩擦与弹性需要结合接触条件测量"
      ],
      "theory": [
        {
          "title": "先区分墙和感应区",
          "paragraphs": [
            "角色走向墙时，希望墙把它挡住；走入商店范围时，希望出现提示，却仍可以继续走。这是两个不同需求。普通 Collider 接触可以参与阻挡、摩擦与反弹，勾选 Is Trigger 的形状则主要用来通知重叠变化，不提供相同的实体阻挡。",
            "因此不能因为想知道角色是否踩在地面上，就把地面全改成 Trigger。先把“是否阻挡”和“是否发送区域通知”分别写出来，再选择配置。三维消息使用 OnCollisionEnter、OnTriggerEnter 等相应签名；二维消息与参数类型不同，名字和参数混用不会自动适配。"
          ]
        },
        {
          "title": "为什么重叠却没有回调",
          "paragraphs": [
            "两个看起来重叠的模型，不一定建立了有效物理接触。先检查双方有没有三维 Collider、对象和形状是否有效，再查看刚体类型和 Layer。普通三维碰撞消息通常要求至少一方是非运动学刚体；触发器的消息条件另有规定，需要按所用接口的文档核对。",
            "例如球是动态刚体、区域是静态触发器时，可以先建立一个已知可工作的组合，再逐项修改。若项目 Physics 的层碰撞矩阵禁止双方交互，单纯增加日志不会改变这项过滤设置。将组件、模式与过滤条件列成表，通常比重建整个场景更快找到原因。"
          ]
        },
        {
          "title": "一个角色为什么进入了两次",
          "paragraphs": [
            "给角色根对象一个 Rigidbody，在两个子对象各放一个 Collider。角色进入区域时，区域可能分别收到两个形状的进入通知。物理系统报告的是形状接触，而商店想数的是角色，这两种身份并不总是一对一。",
            "若 Enter 每次把人数加一，角色就被算了两次；若任何一次 Exit 都设置“不在区域”，前面的形状离开时，后面的形状还可能留在里面。可根据所属刚体或明确角色标识归并身份，再维护接触计数。奖励是否只发一次、伤害多久结算一次，则是游戏规则，还需要独立判断。",
            "把记录写成一列状态：脚进入，角色A的计数0→1，人数0→1；身体进入，计数1→2，人数仍为1；脚退出，计数2→1，人数仍为1；身体退出，计数1→0，人数才归零。每一步先认所属刚体，再改该角色的计数。这个小表说明了为什么只维护一个布尔值，无法区分“还剩一个形状”与“已经全部离开”。"
          ]
        },
        {
          "title": "摩擦和连接要放在正确系统里理解",
          "paragraphs": [
            "把箱子放在斜面上，分别配置双方物理材质，再比较滑动与反弹。接触结果受两侧参数、组合方式、法线和运动影响，不能只看箱子上的一个摩擦数值。若脚本每步强行覆盖速度，接触带来的变化又被抹掉，便可能让人误以为摩擦完全失效。",
            "渲染 Material 决定外观，物理材质决定接触参数，二者不是同一种资源。类似地，Joint 让刚体之间按约束运动，父子层级只描述空间关系。做铰链时应配置锚点和连接刚体，不用父对象硬拉位置来模拟同一件事。"
          ]
        },
        {
          "title": "处理离开，也要处理突然结束",
          "paragraphs": [
            "正常走出区域会产生退出变化，但角色也可能被销毁，或区域突然停用。维护区域成员的代码应在自身停用等阶段清理状态，而不是只等某一次 Exit。移除已经不存在的成员也应安全，避免重复清理把计数减成负数。",
            "还有一个容易误判的细节：官方三维接触与触发消息允许发送给 disabled 的 MonoBehaviour，以便它响应后启用。因此，如果要求停用期间完全不处理区域逻辑，应在入口检查自己的参与状态。用正常进出、多形状、区域禁用和对象销毁四条路径复测，才算真正理解消息与状态的区别。",
            "判断是否收到重复消息时，应同时看对象身份和发生时点。两条 Enter 日志可能来自不同子形状，也可能来自对象离开后再次进入。给记录加上帧号、碰撞体实例标识和所属刚体，再对照 Scene 中的实际运动，就能区分正常再次进入与错误重复结算。"
          ]
        }
      ],
      "code": {
        "title": "仅观察三维触发事实",
        "language": "csharp",
        "filename": "TriggerFactProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Collider))]\npublic sealed class TriggerFactProbe : MonoBehaviour\n{\n    void OnTriggerEnter(Collider other)\n        => Debug.Log($\"Enter collider={other.name}; body={other.attachedRigidbody}\", this);\n    void OnTriggerExit(Collider other)\n        => Debug.Log($\"Exit collider={other.name}\", this);\n}",
        "explanation": [
          "将观察器挂到带 BoxCollider 的区域并勾选 Is Trigger；移动球使用动态 Rigidbody 和 Collider，双方 Layer 允许交互。",
          "示例仅打印收到的接触消息。它尚未将多个碰撞体归并成角色，也没有实现一次性奖励。"
        ]
      },
      "lab": [
        {
          "title": "分别检查阻挡和通知",
          "minutes": 60,
          "steps": [
            "建立动态球、静态地面和触发区域，先记录球落地与穿过区域的表现。",
            "每次只改变 Is Trigger、刚体模式或层矩阵中的一个条件，再进入 Play。",
            "用两列分别记录“是否阻挡”和“是否通知”，不要把两者当成同一个成功条件。"
          ],
          "result": "一张能解释消息前提与实体阻挡差异的配置表。",
          "setup": [
            "新建并保存L033_Contact。GameObject > 3D Object > Cube建Floor，放在(0,-0.5,0)并缩放为(10,1,10)；建Sphere命名Ball，Position=(0,3,0)，Add Component添加Rigidbody。",
            "建Cube命名Zone，Position=(0,1.5,0)、Scale=(3,1,3)；在Inspector取消Mesh Renderer勾选并勾BoxCollider > Is Trigger。保存TriggerFactProbe.cs并通过Zone的Add Component添加。",
            "打开Window > General > Console。Edit > Project Settings > Physics中的Layer Collision Matrix先保留两者允许交互的基线，每次只改一项。"
          ],
          "purpose": "看到同一配置中的阻挡和通知各是什么，知道为什么取消Trigger后应换看碰撞消息。"
        },
        {
          "title": "观察重复接触与异常清理",
          "minutes": 60,
          "steps": [
            "在同一个 Rigidbody 下放两个沿运动方向错开的子 BoxCollider，让角色缓慢穿过静态触发区域。每条 Enter/Exit 日志包含碰撞体实例ID、attachedRigidbody 实例ID和该角色当前接触数，按0→1→2→1→0核对。",
            "按角色记录接触数，再测试只离开一个子形状、销毁角色和禁用区域。",
            "将球放在同一斜面上，对照两组摩擦与弹性，保持速度、尺度和刚体设置不变。"
          ],
          "result": "能解释角色人数、形状数量和材质效果分别来自什么。",
          "setup": [
            "另存L033_Members。用GameObject > Create Empty建Character，Add Component添加Rigidbody并关闭Use Gravity；在它下面建BodyShape与FootShape两个Cube，沿X错开，子物体只保留Collider。",
            "Zone触发区沿X的宽度要大于两个形状合计跨度，保证能出现两个形状同时在区内的阶段。把角色起点放在Zone左侧，Play中用Scene的移动工具缓慢穿过，仅用于观察接触。",
            "现成TriggerFactProbe只打印，不会维护人数；先记录它输出的形状名和attachedRigidbody，再在实验副本按同一个刚体累计接触数。物理材质对照另用GameObject > 3D Object > Cube搭斜面，避免和计数同时修改。"
          ],
          "purpose": "把多个形状归到同一角色，验证部分离开与突然结束为什么需要不同清理路径。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "物体重叠却没触发回调",
          "cause": "组件、刚体组合、层过滤或消息签名不满足条件",
          "fix": "按两对象配置表逐层验证，核对三维参数类型"
        },
        {
          "symptom": "一个角色触发多次奖励",
          "cause": "多个 Collider 被当成多个逻辑实体",
          "fix": "按明确实体身份去重并实现一次性消费"
        }
      ],
      "exercise": {
        "brief": "实现一个统计区域内逻辑刚体数量的传感器，支持多碰撞体、区域禁用和对方销毁，不直接发奖励。",
        "deliverables": [
          "物体标识及其碰撞体计数方法",
          "四条边界测试",
          "材质对照记录"
        ],
        "rubric": [
          {
            "item": "回调前提解释正确",
            "points": 25
          },
          {
            "item": "多 Collider 去重正确",
            "points": 25
          },
          {
            "item": "禁用或销毁时也能清理成员",
            "points": 25
          },
          {
            "item": "接触通知与奖励等游戏处理分开",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "Trigger 通常怎样参与交互？",
          "options": [
            "主要通知重叠，不提供普通碰撞体的同样阻挡",
            "在发送通知的同时必然像墙一样阻挡",
            "只要有 Rigidbody 就自动恢复实体阻挡",
            "仅取消摩擦，仍保留所有普通碰撞反弹"
          ],
          "answer": 0,
          "explanation": "感应区与墙的用途不同。要同时需要两种效果时，应明确配置相应形状和规则。",
          "scenario": "商店范围有BoxCollider并勾Is Trigger，角色有动态Rigidbody和普通Collider；双方Layer允许接触。商店只需知道角色是否进入范围。"
        },
        {
          "question": "Enter 的次数一定等于进入区域的角色数吗？",
          "options": [
            "一定，Unity 会自动按脚本类型去重",
            "不一定，同一个角色可能带多个 Collider",
            "一定，只要角色只有一个 Rigidbody",
            "不一定，但可以直接按 Collider 名称去重"
          ],
          "answer": 1,
          "explanation": "一个刚体可以带多个碰撞形状。应选择稳定的角色身份，不能靠形状名字假定唯一性。",
          "scenario": "一个角色根上有Rigidbody，两个子对象各有Collider，两个形状先后进入同一个触发区。区域代码在每次Enter时计数。"
        },
        {
          "question": "区域成员清理只依赖 Exit，有什么风险？",
          "options": [
            "只会多打印日志，不影响状态",
            "会让所有接触消息立即停止",
            "禁用或销毁等路径可能留下错误成员状态",
            "Unity 会自动清空脚本中的集合，所以没有风险"
          ],
          "answer": 2,
          "explanation": "脚本自己的集合需要自己清理。物理退出通知不能替代对象停用与销毁时的状态管理。",
          "scenario": "区域脚本维护自己的成员集合，只在OnTriggerExit中移除角色；角色可能在仍重叠时被销毁，区域也可能被停用。"
        }
      ],
      "references": [
        {
          "label": "MonoBehaviour.OnCollisionEnter",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnCollisionEnter.html"
        },
        {
          "label": "MonoBehaviour.OnTriggerEnter",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnTriggerEnter.html"
        },
        {
          "label": "Collider.attachedRigidbody",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Collider-attachedRigidbody.html"
        },
        {
          "label": "Joint",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Joint.html"
        }
      ],
      "summary": [
        "墙的阻挡与区域的进入通知是不同需求。",
        "先识别碰撞形状属于哪个角色，再维护区域成员与游戏规则。"
      ],
      "teaching": {
        "question": "同一个角色有两个子 Collider，为什么区域人数变成了二？",
        "keyIdea": "回调告诉你某个形状接触了区域，没有自动判断它是否属于已计数的角色。需要把形状归到同一角色，再维护角色仍有多少形状重叠。",
        "walkthrough": [
          {
            "title": "区分两种身份",
            "text": "角色根上一个 Rigidbody，脚和身体各有 Collider。区域需要人数，物理系统处理两个形状。"
          },
          {
            "title": "观察两次进入",
            "text": "两个形状先后进入，打印各自实例标识和所属刚体。形状标识不同，所属刚体相同。"
          },
          {
            "title": "按角色维护状态",
            "text": "首次接触时加入角色，第二次只增加该角色的接触数。直到最后一个形状离开才移除角色。"
          }
        ],
        "prediction": {
          "question": "两个形状中只有一个退出区域，可以立即隐藏“角色在范围内”的提示吗？",
          "answer": "不能仅凭这一次 Exit 决定。另一个形状仍重叠时，该角色仍应视为在范围内。",
          "scenario": "同一角色根有一个Rigidbody，脚和身体各有一个子Collider；两个形状都已进入同一触发区。现在只有脚退出，身体仍与区域重叠。"
        },
        "scenario": "角色走进商店区域，提示却出现两次；把区域改成Trigger后，墙又挡不住角色。场景里有动态球、普通地板和一个感应区，先分开“要阻挡”与“要知道进入了谁”这两个需求。",
        "purpose": "建立能解释回调数量和角色人数差异的传感器，避免一次接触被当成多次奖励。"
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
      "id": "l034",
      "title": "Raycast、形状查询与连续碰撞：用空间问题选择工具",
      "prerequisites": [
        "l033"
      ],
      "goals": [
        "用 LayerMask 与 QueryTriggerInteraction 明确查询范围",
        "区分射线、重叠与形状扫掠",
        "解释高速穿透与连续检测的限制"
      ],
      "theory": [
        {
          "title": "把要检查的空间问题说清楚",
          "paragraphs": [
            "假设角色前面有一道窄门。中心射线可以穿过门缝，却不代表宽一米的角色也能通过。Raycast 检查一条没有宽度的线，Overlap 检查某个范围当前覆盖哪些形状，SphereCast 或 CapsuleCast 则检查一个有体积的形状沿路移动会遇到什么。",
            "因此应先问“前方有没有墙”“身体能否通过”还是“此刻有哪些物体在范围里”，再选接口。查询只返回信息，不会替角色移动或停止。控制器还要根据距离、法线和允许动作决定下一步；在 Scene 里画出查询范围，可以立即检查提问是否符合身体大小。"
          ]
        },
        {
          "title": "层编号和层集合不要混用",
          "paragraphs": [
            "一个对象的 layer 是单个编号，例如地面位于第8层。查询的 LayerMask 却表示允许哪些层参加，是一个由多个位组成的集合。编号8和“包含第8层”的掩码不是同一个整数，直接把 layer 传给 mask 参数很容易查错对象。",
            "初学时优先用 Inspector 的 LayerMask 字段勾选地面与墙。还要明确最大距离和 QueryTriggerInteraction，决定是否考虑感应区。若探测地面时把角色自身也包括进去，就可能永远得到有地面的结果；配置专门的环境层比碰到错误后不断增加例外更容易检查。",
            "用数字看区别：第8层对应第8个位，单独选中它的掩码是1 << 8，也就是256；同时选第0层和第8层得到1 | 256 = 257。把编号8直接当掩码，二进制含义却是选中了第3层。Inspector 的勾选框替你组成这些位，理解这组数字则能解释为什么把 gameObject.layer 直接传入查询会查错。"
          ]
        },
        {
          "title": "查询看到的是哪个时刻的位置",
          "paragraphs": [
            "假设脚本刚把墙的 Transform 移到右边，紧接着就发出查询。查询读取的是物理世界的状态，是否已经看到新位置还涉及变换同步设置和执行阶段，不能只依据代码两行相邻就推断状态必然同步。优先用恰当的刚体接口移动物体，并在明确阶段执行检测。",
            "确实需要同步时，再研究 Physics.SyncTransforms 的用途和成本，而不是每次查询前都无条件调用。起点也有边界：三维射线对起点位于碰撞体内部的情况有具体限制，不能照搬二维射线可能返回零距离命中的经验。没有命中时，应逐项检查范围、过滤、起点与时点。"
          ]
        },
        {
          "title": "高速物体还需要考虑两步之间",
          "paragraphs": [
            "一个小球每秒移动50个世界单位，步长为0.02s，一步位移为50 × 0.02 = 1个世界单位。若墙很薄，离散检测的两个采样位置可能分处墙的两侧。此时“现在是否重叠”不足以描述沿路发生的事，连续碰撞检测通过相应算法改善这类漏检。",
            "连续模式有形状、模式与运动组合限制，也增加成本。相关文档列出了球、胶囊和盒形等支持范围，不应据此承诺任意复杂网格都同样可靠。投机连续与扫掠类模式也不完全相同。插值只让显示位置平滑，不会把一次物理步拆成很多次碰撞检测。"
          ]
        },
        {
          "title": "完整结果与性能都要验证",
          "paragraphs": [
            "有些接口返回最近一个命中，有些返回多个候选。使用固定数组收集结果时，数组装满只能证明至少有这些结果，不能证明场景没有更多。还要按本次有效数量读取，避免把上轮残留项当成新结果；顺序是否有保证，应看具体重载说明。",
            "实验可以逐渐增加目标数量，确认容量不足时如何处理。优化前保留命中对象、距离、范围图与实际耗时，优化后用相同场景比较。减少一次分配若换来了漏检，不能算成功；而一个失败案例若本来就被 Layer 过滤，也不能拿来否定连续碰撞算法。",
            "观察查询图时要使用与物理计算相同的坐标。角色局部的向前方向，需要先转换成世界方向才能与世界起点配合；父对象旋转后尤其容易看出差异。保持角色不动、只旋转父对象，检查画出的射线是否仍指向你想检查的地方，这能发现坐标混用。"
          ]
        }
      ],
      "code": {
        "title": "带明确过滤的前方射线",
        "language": "csharp",
        "filename": "FilteredRayProbe.cs",
        "source": "using UnityEngine;\npublic sealed class FilteredRayProbe : MonoBehaviour\n{\n    [SerializeField] LayerMask targets;\n    [SerializeField, Min(0.01f)] float distance = 10f;\n    void FixedUpdate()\n    {\n        Vector3 origin = transform.position;\n        Vector3 direction = transform.forward;\n        bool hit = Physics.Raycast(origin, direction, out RaycastHit result,\n            distance, targets, QueryTriggerInteraction.Ignore);\n        Debug.DrawRay(origin, direction * distance, hit ? Color.red : Color.green);\n        if (hit) Debug.DrawRay(result.point, result.normal, Color.yellow);\n    }\n}",
        "explanation": [
          "将探针放在角色之外的空对象，targets 只勾选要检查的环境层，Scene 视图打开 Gizmos。",
          "对照射线显示的起点、长度和返回命中对象；示例负责观察，不负责完整角色碰撞处理。"
        ]
      },
      "lab": [
        {
          "title": "从空间问题选查询",
          "minutes": 60,
          "steps": [
            "先只用现成FilteredRayProbe运行：把一个带BoxCollider的Cube放到Probe正前方，确认射线由绿变红，并在命中面画出黄色法线。再把Cube移出射线路径，确认颜色恢复。",
            "把门框放在Probe前方，中央留0.6单位缝，用宽1单位的角色参照物比较：中心射线能穿过缝，不代表有宽度的身体也能通过。在纸上画出射线与身体各覆盖哪里；形状投射与重叠查询的代码实现留作官方文档扩展。",
            "把门框设为第8层Environment。先在Inspector只勾该层，再记录对应位掩码应为1 << 8，即256；说明直接写整数8会选择另一组位。现成脚本使用LayerMask字段，本组不需要另写转换代码。"
          ],
          "result": "现成射线可运行，能解释无宽度的命中结果与身体通行判断为何不同，并写出第8层的掩码。",
          "setup": [
            "新建场景L034_Queries。GameObject > Create Empty建Probe，Position=(0,1,0)、Rotation=(0,0,0)，保存FilteredRayProbe.cs后从Inspector > Add Component添加。此代码沿Probe的世界forward，也就是初始+Z查询。",
            "在Probe前方Z=3附近用两个Cube作门框，BoxCollider保持开启，中央留0.6单位缝；另建宽1单位的角色参照物。Inspector右上Layer > Add Layer把空闲的User Layer 8命名Environment，再选门框把Layer设为Environment。若该层已有用途，在独立实验项目中操作，不覆盖正式项目层名。",
            "选Probe，将脚本Targets只勾Environment，Distance设10；Scene窗口右上打开Gizmos，Console从Window > General > Console打开。"
          ],
          "purpose": "把实际要问的空间问题画出来，再证实层编号与查询掩码确实不同。"
        },
        {
          "title": "逐项检查射线为什么命中",
          "minutes": 60,
          "steps": [
            "另存场景后，先把单个带BoxCollider的墙放到Probe正前方，并确认Targets只勾Environment。只改变墙的Layer，观察射线红绿变化；恢复后再只改变Targets，每轮记录实际条件。",
            "把墙的Is Trigger勾选再取消，保持其他条件不变。现成脚本明确传入QueryTriggerInteraction.Ignore，核对触发形状是否被忽略；再到Edit > Project Settings > Physics记录Queries Hit Triggers的当前值，解释显式Ignore为什么不依赖该全局默认。",
            "恢复普通Collider，把探针移到墙形状内部，再移回外部，观察起点位置带来的差异。最后在Scene只改BoxCollider的Center或Size而保持墙的外观不变，核对射线依据的是碰撞形状；测完恢复原配置。"
          ],
          "result": "能从Layer、显式Trigger策略、射线起点与Collider形状解释同一画面中的不同查询结果。",
          "setup": [
            "把第一组场景另存为L034_Filter，删除多余参照物，只留Probe和一面墙。墙的Position=(0,1,3)、Scale=(2,2,0.2)，保留BoxCollider，Layer=Environment。",
            "Probe保持Position=(0,1,0)、Rotation=(0,0,0)，Targets只勾Environment，Distance=10。进入Play后在Scene打开Gizmos；脚本只画线和命中法线，不自动打印命中对象名称或多结果数量。",
            "墙的BoxCollider > Is Trigger、Center和Size在Inspector调整；每轮只改一项并记录。高速刚体和固定数组容量属于正文的进一步问题，现成单射线代码不提供发射或多结果驱动，本组不要求自行实现。"
          ],
          "purpose": "先用已经能运行的探针逐项排除过滤与形状原因，再研究需要新增代码的查询种类。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "选择第3层却查询到奇怪对象",
          "cause": "把层索引当层掩码传入",
          "fix": "使用 LayerMask 字段或正确位集合"
        },
        {
          "symptom": "角色总被判定落地",
          "cause": "地面查询包含自身 Collider",
          "fix": "明确地面层并排除角色层，画出检测形状"
        }
      ],
      "exercise": {
        "brief": "实现带过滤、距离和可视化的地面传感器，再对高速弹丸选择离散、连续或扫掠方案并说明取舍。",
        "deliverables": [
          "查询配置与代码",
          "五种失败条件测试",
          "高速方案对比与成本记录"
        ],
        "rubric": [
          {
            "item": "几何问题与接口匹配",
            "points": 25
          },
          {
            "item": "掩码与触发器选项正确",
            "points": 25
          },
          {
            "item": "自身和容量边界明确",
            "points": 25
          },
          {
            "item": "准确说明连续检测的条件与限制",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "地面在第8层时，能直接把整数八当成“只检查第8层”的 LayerMask 吗？",
          "options": [
            "不能，掩码表示层集合而非单个编号",
            "能，层编号和位集合始终等价",
            "能，只要查询距离大于八",
            "能，只要关闭 Trigger 查询"
          ],
          "answer": 0,
          "explanation": "应通过 LayerMask 字段或正确位操作建立集合，不能把索引值直接当掩码。",
          "scenario": "环境对象的Layer编号是8，脚本要让Physics.Raycast只检查该层，查询参数要求LayerMask。"
        },
        {
          "question": "插值主要解决什么问题？",
          "options": [
            "增加每秒物理解算次数",
            "让物理状态之间的可见运动更平滑",
            "保证所有高速物体不穿透",
            "把射线转换为身体形状"
          ],
          "answer": 1,
          "explanation": "插值调整显示采样。碰撞检测是否正确仍取决于模拟、接口与配置。",
          "scenario": "刚体在固定步中更新，渲染帧更频繁；开发者开启Rigidbody的Interpolate观察显示，但没有改变Fixed Timestep。"
        },
        {
          "question": "固定结果数组已经装满，能够确定什么？",
          "options": [
            "已获得场景中的全部结果",
            "只有最后一个结果可靠",
            "至少找到了这么多结果，仍可能有更多",
            "所有查询重载都会自动扩容"
          ],
          "answer": 2,
          "explanation": "容量是结果完整性的限制。需要明确溢出处理，并只读取本次有效区间。",
          "scenario": "某次多结果查询使用长度4的固定数组，返回有效结果数4；没有执行额外查询，也不知道场景中总目标数。"
        }
      ],
      "references": [
        {
          "label": "Physics.Raycast",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.Raycast.html"
        },
        {
          "label": "Physics.SphereCast",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.SphereCast.html"
        },
        {
          "label": "Rigidbody.collisionDetectionMode",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-collisionDetectionMode.html"
        }
      ],
      "summary": [
        "先写出空间问题，再选择查询形状、范围、过滤和调用时点。",
        "连续检测和固定缓存都有适用条件，需要用反例检查。"
      ],
      "teaching": {
        "question": "中心射线穿过门缝，为什么角色还是撞在门框上？",
        "keyIdea": "射线没有身体宽度。线能通过只说明那条路径没有命中，要判断身体能否通过，需要选择符合身体形状的查询。",
        "walkthrough": [
          {
            "title": "给出几何条件",
            "text": "门缝宽0.6个世界单位，角色胶囊宽1个世界单位。把射线起点放在角色中心，方向朝门缝。"
          },
          {
            "title": "预测射线结果",
            "text": "中心线可以从缝隙通过，不碰两侧门框；没有命中只回答这条线的问题。"
          },
          {
            "title": "改用有体积的查询",
            "text": "用与角色接近的胶囊做投射，边缘会遇到门框。由命中距离再决定可移动多少，而非让查询自动移动角色。"
          }
        ],
        "prediction": {
          "question": "把射线加长两倍，会使它开始具备角色的身体宽度吗？",
          "answer": "不会。距离改变检查长度，不改变几何形状。判断宽度问题仍需要合适的形状查询。",
          "scenario": "角色身体宽1个世界单位，门缝宽0.6；一条没有宽度的中心射线沿门缝穿过，其他条件不变，只将最大距离翻倍。"
        },
        "scenario": "你画出一根穿过门缝的射线，检测说前方没墙，角色身体却卡在门框上。门缝宽0.6个单位，角色宽1个单位；本课先看一条线与一个有宽度的身体到底在问什么不同问题。",
        "purpose": "用几何、过滤和取样时点说明查询结果，避免把“查不到”一律当成碰撞系统失效。"
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
      "id": "l035",
      "title": "整合一个可解释的三维移动组件",
      "prerequisites": [
        "l034"
      ],
      "goals": [
        "组合设备无关意图、地面查询和固定步运动",
        "保留竖直物理速度并一次消费跳跃",
        "给教学控制器列出明确能力与未覆盖限制"
      ],
      "theory": [
        {
          "title": "先写出这个角色具体支持什么",
          "paragraphs": [
            "本课要把输入、刚体运动与地面检查接起来，先限定为平地上的简化三维角色：输入控制水平速度，物理系统根据重力更新竖直速度，地面查询决定能否接受跳跃。把这些条件写出来，可以避免把几个可用接口拼在一起，就误以为得到了完整商业控制器。",
            "例如斜坡、台阶、移动平台与击退各自会改变运动规则，本课不因为用了 Rigidbody 就自动解决它们。输入负责表达玩家想做什么，运动组件决定如何改速度，查询提供空间信息。每一部分的输出和使用时点都应能用一句自然话说清。"
          ]
        },
        {
          "title": "跟着一个物理步看速度怎样变化",
          "paragraphs": [
            "设角色当前水平速度为2m/s，竖直速度为-3m/s。玩家希望向右5m/s，如果水平由玩家直接接管，新速度应把水平改成5m/s，同时保留-3m/s的下落速度。随后物理模拟继续处理重力和接触。若直接写成完整的水平向量，竖直变成零，角色就会出现下落被不断中断的现象。",
            "但保留竖直分量也不是保留全部外力：爆炸带来的水平击退可能在下一步被输入覆盖。要不要覆盖是角色规则，必须明确。为了保持直立，可冻结不需要的旋转轴；动画和显示子对象则不要再给物理根写位置。"
          ]
        },
        {
          "title": "地面检查为什么需要几何前提",
          "paragraphs": [
            "本例没有使用射线，而是在 groundPoint 的世界位置调用半径0.12的 Physics.CheckSphere，检查这个小球是否与允许层中的形状重叠。假设平地顶面为Y=0，球心Y=0.08，小球向下延伸到-0.04，因而可以与地面重叠。将球心升到0.2而其余不变，小球不再碰到平地，结果就应改变。这里检查的是一个有大小的范围，不是一条向下的线。",
            "groundLayers 只勾地面层，并把角色自己放在别的层，否则探测球可能查到自己的胶囊，造成始终接地。CheckSphere 只返回有无重叠，不返回表面法线，因此仅靠这行代码无法判断斜面是否足够平缓、墙边是否可站。先限定平地，并在 Scene 中检查探测球的位置和半径；需要坡面规则时，再选择能提供接触方向的查询。"
          ]
        },
        {
          "title": "持续方向可以保留，跳跃请求要消费",
          "paragraphs": [
            "Update 与 FixedUpdate 的调用节奏不相同。某个渲染帧可能没有物理步，之后又可能补做多个物理步。持续移动方向可以缓存，下一物理步继续使用最近的意图；一次跳跃按下则需要保留到运动组件读取，读取后按规则清除。",
            "源码选择了短时缓冲：RequestJump 把请求保留至当前游戏时间加0.15秒；在有效期内遇到接地，才把竖直速度设为 jumpSpeed，并立即消费请求。超过有效期就丢弃。比如按下时离地，0.10秒后落地仍可接受，0.20秒后才落地则已过期。这个规则不同于“空中一律拒绝”，也不意味着允许二段跳。",
            "清输入缓存不等于清刚体的当前速度。只禁用运动层时，它不再写速度，但动态刚体仍可因已有速度继续滑动，也仍会受重力；重新启用后，下一物理步才按当前输入重新接管水平速度。若只停用输入适配器、运动层仍启用，ClearInput之后下一步会按零方向写水平速度。实验应把缓存、组件启用与身体模拟分开观察，不能看到滑动就断言旧按键仍被保存。"
          ]
        },
        {
          "title": "如何证明组合后的控制器可解释",
          "paragraphs": [
            "建立三组测试：静止和移动时跳跃，贴墙时保持输入，关闭脚本后再次启用。分别记录输入、查询结果、目标速度与实际速度。异常时沿这条顺序检查，就能分辨输入没收到、地面误判、速度被覆盖还是模拟受到接触影响。",
            "CharacterController 是另一种常用方案，不应与动态刚体同时争写同一对象。它的 Move 接收位移，不自动施加重力；接地信息也与对应移动过程有关。比较两种方案时，逐项问谁移动、谁算重力、谁处理外力和台阶，而不是给某一种贴上永远正确的标签。",
            "接入新功能时，不妨先给速度每个分量写来源说明。例如水平来自玩家输入，竖直来自上一步模拟，跳跃只在接受请求的那个物理步改变竖直速度。随后加入击退时，先修改这份说明，再修改代码。这样能直接看见新增规则会覆盖什么，而不是在抖动出现后猜测执行顺序。"
          ]
        }
      ],
      "code": {
        "title": "设备无关的平地刚体运动层",
        "language": "csharp",
        "explanation": [
          "将两个完整文件分别保存为同名 .cs，并挂在同一胶囊角色根上。第二个文件是实验输入适配器，要求第6章已安装并启用 Input System；它调用运动层的 SetMove 与 RequestJump。只有运动层而没有调用方时，按键不会自动产生移动。",
          "角色使用动态 Rigidbody，冻结不需要的旋转。新建 Ground 层仅给地板，角色留在其他层；groundLayers 只选 Ground。创建 groundPoint 子对象并拖入字段，让半径0.12的探测球在站立时略微进入地板。",
          "WASD 在世界XZ平面移动，空格提出一次跳跃请求。速度写入与接地检查仍集中在 SimpleGroundMotor 的 FixedUpdate。此例只保证有明确条件的平地实验，未实现坡度、台阶和移动平台。",
          "ClearInput同时清除持续方向和待处理跳跃。输入适配器在运动层停用时不再提交意图；无键盘、应用失焦或适配器停用时清空输入。分别测试只禁用运动层、只禁用输入层与关闭整个对象，不把组件停用等同于所有普通方法都不能被调用。"
        ],
        "files": [
          {
            "filename": "SimpleGroundMotor.cs",
            "source": "using UnityEngine;\n[RequireComponent(typeof(Rigidbody), typeof(CapsuleCollider))]\npublic sealed class SimpleGroundMotor : MonoBehaviour\n{\n    [SerializeField] Transform groundPoint;\n    [SerializeField] LayerMask groundLayers;\n    [SerializeField, Min(0f)] float speed = 5f;\n    [SerializeField, Min(0f)] float jumpSpeed = 5f;\n    Rigidbody body;\n    Vector2 move;\n    bool jumpPending;\n    double expires;\n    void Awake() => body = GetComponent<Rigidbody>();\n    public void SetMove(Vector2 value) => move = Vector2.ClampMagnitude(value, 1f);\n    public void RequestJump()\n    {\n        jumpPending = true;\n        expires = Time.timeAsDouble + 0.15;\n    }\n    void FixedUpdate()\n    {\n        if (groundPoint == null) return;\n        Vector3 velocity = body.linearVelocity;\n        velocity.x = move.x * speed;\n        velocity.z = move.y * speed;\n        if (jumpPending && Time.timeAsDouble > expires) jumpPending = false;\n        bool grounded = Physics.CheckSphere(groundPoint.position, 0.12f,\n            groundLayers, QueryTriggerInteraction.Ignore);\n        if (jumpPending && grounded)\n        {\n            jumpPending = false;\n            velocity.y = jumpSpeed;\n        }\n        body.linearVelocity = velocity;\n    }\n    public void ClearInput()\n    {\n        move = Vector2.zero;\n        jumpPending = false;\n    }\n    void OnDisable() => ClearInput();\n}"
          },
          {
            "filename": "GroundMotorKeyboardProbe.cs",
            "source": "using UnityEngine;\nusing UnityEngine.InputSystem;\n\n[RequireComponent(typeof(SimpleGroundMotor))]\npublic sealed class GroundMotorKeyboardProbe : MonoBehaviour\n{\n    SimpleGroundMotor motor;\n\n    void Awake() => motor = GetComponent<SimpleGroundMotor>();\n\n    void Update()\n    {\n        if (!motor.isActiveAndEnabled) return;\n        Keyboard keyboard = Keyboard.current;\n        if (keyboard == null || !Application.isFocused)\n        {\n            motor.ClearInput();\n            return;\n        }\n\n        float x = (keyboard.dKey.isPressed ? 1f : 0f)\n            - (keyboard.aKey.isPressed ? 1f : 0f);\n        float z = (keyboard.wKey.isPressed ? 1f : 0f)\n            - (keyboard.sKey.isPressed ? 1f : 0f);\n        motor.SetMove(new Vector2(x, z));\n        if (keyboard.spaceKey.wasPressedThisFrame) motor.RequestJump();\n    }\n\n    void OnApplicationFocus(bool hasFocus)\n    {\n        if (!hasFocus && motor != null) motor.ClearInput();\n    }\n\n    void OnDisable()\n    {\n        if (motor != null) motor.ClearInput();\n    }\n}"
          }
        ]
      },
      "lab": [
        {
          "title": "逐步接通控制流程",
          "minutes": 60,
          "steps": [
            "按代码说明保存两个 .cs 文件并挂到同一胶囊根；地面使用 Ground 层，角色使用别的层，groundLayers 只勾 Ground。拖入脚底 groundPoint。先关闭动画，在 Game 窗口取得焦点后用WASD检查XZ平面移动。",
            "以半径0.12的小球检查 groundPoint：平地Y=0时，分别将球心放在Y=0.08与Y=0.2，记录重叠结果。站到边缘后复测，说明这不是射线，也不能用一个布尔值判断坡度。",
            "按空格检查一次请求只起跳一次；再比较落地前约0.10秒和更早提出请求，按0.15秒有效期解释是否接受。记录游戏时间、grounded与竖直速度，而非只凭画面判断缓冲。"
          ],
          "result": "一段可以逐项解释输入、判地与速度结果的运行记录。",
          "setup": [
            "新建L035_Motor场景。用Cube建Floor，Position=(0,-0.5,0)、Scale=(20,1,20)；Inspector > Layer > Add Layer建Ground后给Floor设置Ground。",
            "用GameObject > 3D Object > Capsule建Player，Position=(0,1,0)；把两个代码块分别保存为Assets/EngineLabs/SimpleGroundMotor.cs和GroundMotorKeyboardProbe.cs。等Console无编译错后，选Player用Add Component添加两个类。",
            "Player的Rigidbody关闭Is Kinematic、开启Use Gravity，在Constraints冻结旋转；Player保持Default层。其下GameObject > Create Empty建GroundPoint，调整到站立时世界Y约0.08，拖进运动脚本Ground Point；Ground Layers只勾Ground。",
            "从Window > Package Management > Package Manager确认Input System已安装；Edit > Project Settings > Player > Other Settings > Active Input Handling启用Input System。按提示重启后进入Play并点Game窗口取得焦点。"
          ],
          "purpose": "亲手接通输入到物理的最短路径，分辨按键未调用、接地配置错和速度覆盖三个位置。"
        },
        {
          "title": "验证停止和不支持的情况",
          "minutes": 60,
          "steps": [
            "分别只禁用SimpleGroundMotor、只禁用GroundMotorKeyboardProbe和关闭整个角色对象。在每种情况下按移动或跳跃再恢复，检查ClearInput已同时清除方向与跳跃请求，适配器没有向停用的运动层重新提交。另测试失焦再返回，确认旧输入不残留。",
            "分别加入墙、斜坡和移动平台，记录可正常工作的条件及失败现象。",
            "列出所有写根位置或速度的组件，关闭多余写入者；比较 CharacterController 时使用独立对象。"
          ],
          "result": "分别记录组件开关、缓存与刚体速度；能解释仅停运动层时身体仍可惯性运动，仅停输入层时活动运动层会在下一物理步用零方向接管水平速度，并检查旧跳跃不被消费。",
          "setup": [
            "先完成平地实验，退出Play另存L035_Boundaries，保留Player上的两个独立脚本组件，均先启用。",
            "用Window > General > Inspector选Player，辨认组件标题勾选框与对象名称旁总开关：前者只停该组件，后者停整个对象。分别测试，不一次全关。",
            "在Floor旁另建Cube作墙和坡面；移动平台尚未实现，本组先记录需求与失败，不声称现成平地控制器已经带平台相对速度处理。"
          ],
          "purpose": "证明清输入、停止控制器和停止整个对象并非一件事，同时给未支持地形建立扩展边界。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "跳跃一直可用",
          "cause": "地面检测包含自身或半径与位置不合理",
          "fix": "专用地面层、可视化检测形状并测试离地"
        },
        {
          "symptom": "控制器看似完整但上坡或平台行为异常",
          "cause": "把平地教学模型当商业角色系统",
          "fix": "单独设计坡度、平台与外力的处理规则，并增加针对测试"
        }
      ],
      "exercise": {
        "brief": "完成平地移动验收后，仅选一个扩展：空中转向、离地后短时间仍允许跳跃（土狼时间）、击退组合。先写清触发条件、结果与停止方式，再实现，不同时堆加三项。",
        "deliverables": [
          "分层关系图",
          "十项基础回归表",
          "一个扩展的前后对照与限制"
        ],
        "rubric": [
          {
            "item": "输入与物理边界清晰",
            "points": 25
          },
          {
            "item": "正确保留速度分量并传递一次跳跃请求",
            "points": 25
          },
          {
            "item": "地面与自身过滤正确",
            "points": 25
          },
          {
            "item": "支持范围及扩展证据完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "水平控制直接写完整速度时，最容易遗漏什么？",
          "options": [
            "应保留的竖直速度或外部运动分量",
            "给速度再乘一次质量",
            "给地面切换 Sorting Layer",
            "把所有运动改为 Update"
          ],
          "answer": 0,
          "explanation": "完整赋值会替换旧速度。应先明确哪些分量被接管，再写组合结果。",
          "scenario": "动态角色当前竖直速度为-3m/s。水平控制代码准备用一个Y=0的新完整向量覆盖linearVelocity，而不读取原速度。"
        },
        {
          "question": "一次跳跃按下为什么不宜只保留一个渲染帧？",
          "options": [
            "因为所有输入都必须等待一秒",
            "该帧可能没有物理步，运动组件会错过请求",
            "因为 FixedUpdate 总比 Update 慢十倍",
            "因为按键回调只能访问 Transform"
          ],
          "answer": 1,
          "explanation": "两种更新频率不一致。需要按接收、保留和消费的规则传递一次请求。",
          "scenario": "输入在Update中发现空格刚按下，这个渲染帧恰好没有FixedUpdate；运动层只会在随后物理步检查跳跃请求。"
        },
        {
          "question": "平地控制器能移动后，下一步合理结论是什么？",
          "options": [
            "已自动支持所有台阶与坡度",
            "可直接同时添加 CharacterController 增强稳定性",
            "还需分别验证边缘、坡面、平台等条件",
            "只要冻结旋转就能保证任何场景都正确"
          ],
          "answer": 2,
          "explanation": "在有限条件下成立的控制器，应通过新增场景验证扩展能力，不能由一次正常移动推导全部正确。",
          "scenario": "你只在平坦地板完成了移动和跳跃验收，还没有试过斜坡、台阶、墙边或移动平台。"
        }
      ],
      "references": [
        {
          "label": "Rigidbody.linearVelocity",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-linearVelocity.html"
        },
        {
          "label": "Physics.CheckSphere",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.CheckSphere.html"
        },
        {
          "label": "RigidbodyConstraints",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RigidbodyConstraints.html"
        },
        {
          "label": "CharacterController.Move",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController.Move.html"
        }
      ],
      "summary": [
        "把输入、判地和身体运动按明确的读写顺序连接起来。",
        "平地控制成立后，再逐项验证坡面、平台和外力等扩展。"
      ],
      "teaching": {
        "question": "角色向右移动并起跳时，怎样让它向右移动又继续受重力影响？",
        "keyIdea": "水平输入与竖直运动先分开计算，再由同一个运动组件写入刚体速度。这样每个分量来自哪里都可以说明，也容易发现哪一项被覆盖。",
        "walkthrough": [
          {
            "title": "读取原状态",
            "text": "当前竖直速度是-3m/s，输入要求水平速度5m/s，地面查询此时未命中。"
          },
          {
            "title": "只改接管的分量",
            "text": "将水平速度换成5m/s，保留竖直-3m/s；此步不接地，不起跳。源码将请求最多保留0.15秒，期间接地才消费，超时就丢弃。"
          },
          {
            "title": "让模拟继续推进",
            "text": "物理步继续应用重力和碰撞。下一步再根据最新查询决定动作，不让动画写回身体位置。"
          }
        ],
        "prediction": {
          "question": "每步都将完整速度设为“水平输入乘速度”，会怎样影响自由下落？",
          "answer": "这个向量的竖直分量通常为零，会反复抹掉已有下落速度。若希望保留重力效果，应明确保留相应分量。",
          "scenario": "动态角色正下落，当前竖直速度为-3m/s；输入要求水平5m/s。讨论的是每步直接把完整速度赋成水平向量、把Y分量设0的写法，场景没有其他速度写入者。"
        },
        "scenario": "角色左右移动正常，一加跳跃就像悬在空中；还有人复制运动脚本后按键毫无反应。这个平地实验把键盘输入、接地球和刚体速度连接起来，两个文件各负责一段，不让动画同时移动身体。",
        "purpose": "从一个能实际操作的最小控制器看清数据怎样穿过更新阶段，并能解释为何要保留竖直速度和消费一次请求。"
      }
    }
  ]
});
