// 学者修订：补足具体推导、实验起点及教学边界。
window.COURSE_MODULES.push({
  "id": "m10",
  "number": 10,
  "title": "动画：Clip、状态机与控制权",
  "subtitle": "让Idle从帧数据真正播放起来",
  "description": "先验证图片和绑定，再连接Animator状态与过渡；理解参数、动作时点和根运动，按证据定位动画故障。",
  "accent": "#8e6680",
  "lessons": [
    {
      "hours": 5,
      "prerequisites": [
        "l045"
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
      "id": "l046",
      "title": "AnimationClip：时间怎样驱动属性",
      "goals": [
        "区分数值曲线和对象引用帧",
        "检查动画绑定路径",
        "制作独立可验证的 Idle 片段"
      ],
      "theory": [
        {
          "title": "先做一个只换图片的Idle",
          "paragraphs": [
            "角色的Idle可以先理解为：时间推进时，SpriteRenderer使用的Sprite按顺序更换。AnimationClip保存“哪个时刻给哪个属性什么值”，它不理解待机、走路或死亡的游戏含义。把片段命名为Idle只便于人识别，不会让它自动在松开按键时播放。",
            "先在一个独立测试角色上建立八帧片段，只保留Sprite轨道。逐帧拖动时间轴，确认每个时点都切到正确图片。此时检验的是片段数据；游戏运行时由谁选择它，要在Animator或其他明确播放方案中另外配置。将这两件事分开，能减少初学时同时修改多个窗口的混乱。",
            "第一次创建时可按这个顺序操作：选中Hierarchy中的测试角色，打开 Window→Animation→Animation，在窗口为这个场景对象创建并保存Clip；再从Project展开图片，拖入已经切好的Sprite子帧。若Animator在根、SpriteRenderer在Visual，就选择并检查这条实际层级。不要选中PNG后等待它自动变成动画宿主，也不要把导入图片的预览窗口当作Animation时间轴。"
          ]
        },
        {
          "title": "轨道怎样找到要修改的组件",
          "paragraphs": [
            "一个动画轨道除了属性，还保存相对于动画宿主的对象路径和组件类型。例如Animator在Player根上，SpriteRenderer在Visual子对象，轨道就需要通过Visual找到该组件，再修改Sprite属性。把Visual改名或移到更深层级后，旧轨道可能无法找到原目标。",
            "因此动画预览失败时，先看轨道绑定了哪个对象、是否出现缺失提示，不要先调播放速度。给物理根添加Position轨道也要谨慎：它会让动画参与移动，与刚体脚本产生冲突。纯逐帧Idle只需改变图片时，就不应顺手录下根位置和缩放。"
          ]
        },
        {
          "title": "采样率与关键帧位置怎样配合",
          "paragraphs": [
            "设Samples为8，每个采样格相隔0.125s。把八个Sprite放在不同采样格，决定了图片何时切换；若多张帧误放到同一时点，时间轴可能看似有内容，实际却没有预期序列。样本率不是游戏必然以每秒八帧运行，而是片段编辑和采样相关的时间标尺。",
            "还要检查片段实际长度、播放速度与循环接点。最后一个关键帧的位置不应被随意当成完整循环时长的全部定义，实际播放需结合片段数据核对。Sprite轨道保存对象引用，不是像Transform数值曲线那样在两张图片之间自然画出新图。"
          ]
        },
        {
          "title": "循环既要设置，也要观察接缝",
          "paragraphs": [
            "待机常常循环播放，可以在相应片段设置中启用Loop Time，再用真实角色观察最后一帧回到第一帧是否自然。若首尾图片姿态差距很大，开了循环也只会重复一个明显跳变。帧框或Pivot不一致，则可能每次切帧都让脚底晃动。",
            "先慢放观察，再恢复正常速度。需要区分动作本身的起伏、轴心不一致的漂移，以及身体实际移动三种现象。保持根Transform不动并显示脚底标尺，是检查纯Sprite动画的有效办法；不要先用摄像机平滑掩盖帧数据问题。"
          ]
        },
        {
          "title": "片段正确后，再接入运行选择",
          "paragraphs": [
            "Animation窗口能预览，不代表顶部Play运行时必然播放。运行对象还要有启用的Animator、正确的Controller或相应播放关系，状态要引用目标Clip，并且执行路径真的进入该状态。脚本修改参数、过渡和更高层动画还可能改变最终结果。",
            "可以先使用只有一个状态的Controller，把该Clip设为Motion，排除过渡干扰。运行时观察实际状态和当前片段，再逐步加入Walk。最后保存Clip、Controller、Prefab与场景，重新进入Play复验。这样获得的是一条从子帧到显示的完整链，而不只是时间轴里一排看起来存在的关键帧。",
            "录制模式也值得单独检查。打开红色录制按钮后，在场景中移动对象可能给片段新增属性轨道；这与仅拖动时间轴预览不同。完成Sprite关键帧后关闭录制，查看是否意外记录了位置或缩放。删除无关轨道前先确认用途，避免Idle每次播放都把身体拉回录制时的地点。"
          ]
        }
      ],
      "code": {
        "title": "观察 Animator 的当前片段",
        "language": "csharp",
        "filename": "ClipStateProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Animator))]\npublic class ClipStateProbe : MonoBehaviour\n{\n    Animator animator;\n    void Awake() { animator = GetComponent<Animator>(); }\n    [ContextMenu(\"Report Current State\")]\n    void Report()\n    {\n        if (!animator || !animator.runtimeAnimatorController) return;\n        foreach (var info in animator.GetCurrentAnimatorClipInfo(0))\n            Debug.Log($\"clip={info.clip.name}, weight={info.weight}\", this);\n    }\n}",
        "explanation": [
          "把探针放到实际持有Animator的对象，运行后查看当前片段信息，并与Inspector中的Controller和状态对照。",
          "探针用于观察，不会替你补全空Motion、错误绑定路径或没有进入的状态。"
        ]
      },
      "lab": [
        {
          "title": "制作可逐帧核对的Idle",
          "minutes": 60,
          "steps": [
            "选中Hierarchy中的测试角色，打开Window→Animation→Animation，创建并保存Idle.anim。确认角色已有SpriteRenderer或明确的Visual子对象，再从Project展开图集，按动作顺序将八个Sprite子帧拖到Sprite轨道，不拖整张PNG。",
            "设置采样标尺，逐帧检查顺序、帧框和Pivot，再检查循环接点。",
            "完成Sprite关键帧后关闭红色录制按钮，检查轨道列表仅包含目标Sprite属性。固定根Transform并显示脚底标尺，逐帧区分姿态起伏、Pivot漂移与身体位置变化。"
          ],
          "result": "一份顺序、目标属性和循环效果都能解释的Idle。"
        },
        {
          "title": "验证绑定路径与运行链",
          "minutes": 60,
          "steps": [
            "记录Animator宿主到SpriteRenderer的相对路径，在测试副本改名子对象观察绑定失效。",
            "恢复路径，用单状态Controller连接该Clip，运行确认实际状态与片段。",
            "退出Play保存资源，重新运行，再检查是否仍能播放。"
          ],
          "result": "能分别定位数据、绑定和运行选择问题的记录。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "片段文件存在但时间轴空白",
          "cause": "尚未添加任何属性曲线或引用帧。",
          "fix": "把正确子帧拖入选定对象的 Sprite 轨道并核对关键帧。"
        },
        {
          "symptom": "改层级后动画失效",
          "cause": "绑定相对路径不再对应目标组件。",
          "fix": "检查轨道路径，恢复原对象路径，或重新建立轨道绑定。"
        }
      ],
      "exercise": {
        "brief": "制作一份只改变 Visual/SpriteRenderer.sprite 的 Idle，并证明没有根位置曲线。",
        "deliverables": [
          "片段与层级",
          "八帧时间表",
          "绑定与循环验证"
        ],
        "rubric": [
          {
            "item": "数据帧完整",
            "points": 25
          },
          {
            "item": "时间节奏正确",
            "points": 25
          },
          {
            "item": "绑定路径稳定",
            "points": 25
          },
          {
            "item": "运行预览区分",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "片段命名为Idle会自动响应停止输入吗？",
          "options": [
            "会，Unity识别这个固定名称",
            "不会，状态选择需要另外配置",
            "会，只要启用Loop Time",
            "会，只要动画帧数量超过一"
          ],
          "answer": 1,
          "explanation": "Clip描述属性随时间变化，输入与状态选择需要明确连接。"
        },
        {
          "question": "Sprite逐帧轨道主要保存什么？",
          "options": [
            "每帧重新绘制的像素代码",
            "各时点使用的Sprite对象引用",
            "物理系统每步的速度",
            "每帧图片文件名的搜索条件"
          ],
          "answer": 1,
          "explanation": "轨道引用实际子帧资源，不会仅按名字自动找到相应图片。"
        },
        {
          "question": "编辑预览正常能证明运行时状态机正确吗？",
          "options": [
            "能，预览使用的就是全部运行配置",
            "不能，还需检查实际对象和状态选择链",
            "能，只要关闭录制按钮",
            "能，只要采样率与显示器一致"
          ],
          "answer": 1,
          "explanation": "预览和Play的入口不同，应分别验证绑定、Motion和真实运行状态。"
        }
      ],
      "references": [
        {
          "label": "AnimationClip",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AnimationClip.html"
        },
        {
          "label": "Animator.GetCurrentAnimatorClipInfo",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator.GetCurrentAnimatorClipInfo.html"
        }
      ],
      "summary": [
        "Clip保存属性随时间的变化，运行时还要有明确的播放选择。",
        "分别验证帧数据、绑定路径、状态Motion和实际画面。"
      ],
      "teaching": {
        "question": "Animation窗口能看到八帧Idle，为什么进入Play后角色还是不动？",
        "keyIdea": "预览证明片段有可采样的数据，运行播放还需要对象、Animator、Controller、状态和Motion连起来。先分别验证数据和选择，再找断开的环节。",
        "walkthrough": [
          {
            "title": "单独检验片段",
            "text": "选择实际角色，在Animation窗口逐帧拖动，确认SpriteRenderer确实显示八个正确子帧。"
          },
          {
            "title": "建立最短运行链",
            "text": "给该角色Animator指定只含一个状态的Controller，将这个状态的Motion设为刚验证的Idle片段。"
          },
          {
            "title": "运行观察实际状态",
            "text": "进入Play，查看该Animator实际使用的Controller和当前状态；能循环后，再逐项加入其他状态与过渡。"
          }
        ],
        "prediction": {
          "question": "将片段改名为Idle，能自动让松开移动键时播放它吗？",
          "answer": "不能。名称不代表状态选择规则，仍需参数、过渡或其他明确的播放逻辑。"
        }
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l046"
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
      "id": "l047",
      "title": "Animator Controller：默认状态与过渡条件",
      "goals": [
        "建立完整的 Animator 播放链",
        "预测条件和 Exit Time 的组合",
        "识别不可达状态与过渡竞争"
      ],
      "theory": [
        {
          "title": "状态机负责现在选哪段动作",
          "paragraphs": [
            "已有Idle和Walk两个正确Clip后，还缺一个选择者。Animator Controller用状态和过渡描述播放流程：状态通常引用Motion，过渡描述什么时候可以从一个状态走到另一个。可以把它想成可观察的播放规则图，但实际运行仍由图中的条件和时间设置决定。",
            "先创建Idle和Walk，检查每个状态的Motion是否真的引用正确Clip，再将Idle设为默认状态。状态名叫Walk却Motion为空，不会自动找到同名资源。默认状态也只是相应层进入时的起点，不意味着所有时候都强制停在Idle。"
          ]
        },
        {
          "title": "沿一次Idle到Walk推导",
          "paragraphs": [
            "建立Bool参数Moving，初始为false。Idle到Walk的条件为Moving等于true，Walk到Idle则为false。脚本在玩家开始移动时设置true，图中的对应边才具备条件。参数是控制器读取的数据，不是一个状态本身；设置它不等于立即、无条件地切换。",
            "例如过渡还启用了Has Exit Time，除了参数条件，还要满足退出时间等规则。若希望按下移动就尽快切换，应检查退出时间和过渡持续时间。先用单一参数跑通双向流程，再加入复杂规则，能清楚看到每个设置带来的变化。"
          ]
        },
        {
          "title": "切换时刻与过渡时间是两件事",
          "paragraphs": [
            "退出时间关注在片段进度的什么条件下允许过渡，过渡持续时间关注开始过渡后混合多久。设移动参数已经为true，仍在等待退出条件，这是一种延后开始；过渡已经开始但画面慢慢改变，则是混合持续，两种现象不能靠同一个数字解释。",
            "循环片段还要结合Normalized Time等规则理解。不同过渡的Fixed Duration设置影响时长含义，不能不看单位就说某个值永远代表相同秒数。实验先只改Has Exit Time，再只改Duration，观察Animator窗口，才能把等待与混合区分开。",
            "例如源状态片段长2秒，Transition Duration填0.25：勾选Fixed Duration时按秒解释，即0.25秒；不勾时按相对源状态的归一化时间解释，在这个固定长度例子里约为0.25×2=0.5秒。数值一样、单位不同，混合时长就不同。先保持状态速度和片段不变做这组对照，再测试变速等更复杂条件。"
          ]
        },
        {
          "title": "Trigger不是可靠消息仓库",
          "paragraphs": [
            "Bool适合持续条件，Float适合连续数值，Trigger常用于触发一次状态变化。但Trigger仍是Animator参数，由过渡规则消费，不是带顺序、确认和重试的通用业务事件队列。若攻击请求具有不可丢失或必须编号的要求，不能仅靠设一次Trigger就证明规则完整。",
            "Any State也不是免费的快捷方式。过多可达边会让中断和优先关系难以推断；同一状态重复触发、过渡被另一条边打断，都需要测试。先让输入或游戏状态生成清楚参数，再让动画负责选择表现，不让状态图悄悄成为所有游戏规则的唯一存储。"
          ]
        },
        {
          "title": "把每条常走路径都实际走一遍",
          "paragraphs": [
            "最小验收包括启动Idle、开始移动、停止移动、快速反复切换和停用后恢复。运行时观察的是场景对象上的实际Animator，而非另一个同名Controller。参数名、大小写、类型和脚本引用都要对齐，才能避免脚本写到错误对象。",
            "若有多层、子状态机或混合树，再逐层增加测试。记录当前状态、正在过渡与参数值，先确认哪条边被允许，再看Clip内容。发现切换迟缓时，按“参数是否变化、条件是否满足、是否等待退出、过渡是否在混合”的顺序检查，比重复创建Idle更能说明原因。",
            "两条过渡都存在，也不代表两条都能走通。测试停止时，应确认Walk到Idle条件写的是Moving为false，而不是把去程条件原样复制。运行中手动改变参数可先隔离状态图，之后再接回输入脚本；若手动切换正常而脚本驱动失败，检查范围就缩小到参数写入和对象引用。"
          ]
        }
      ],
      "code": {
        "title": "显式驱动一个 Bool 参数",
        "language": "csharp",
        "filename": "AnimatorBoolProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Animator))]\npublic class AnimatorBoolProbe : MonoBehaviour\n{\n    [SerializeField] bool moving;\n    Animator animator;\n    static readonly int Moving = Animator.StringToHash(\"Moving\");\n    void Awake() { animator = GetComponent<Animator>(); }\n    void Update() { animator.SetBool(Moving, moving); }\n}",
        "explanation": [
          "脚本只负责向指定Animator写入一个Bool。先核对参数名称、类型和Controller中的双向条件。",
          "若值变化却迟迟不切换，观察过渡的退出时间和持续时间，而不是立即认定输入失效。"
        ]
      },
      "lab": [
        {
          "title": "搭建最短双向流程",
          "minutes": 60,
          "steps": [
            "创建只有Idle与Walk的Controller，分别指定正确Motion，设置默认Idle。",
            "添加Moving Bool及双向条件，运行时手工改参数验证两条边。",
            "再接入脚本，确认修改的是场景角色实际Animator。"
          ],
          "result": "从启动到移动再回Idle的一条明确运行路径。"
        },
        {
          "title": "隔离退出时间与混合时长",
          "minutes": 60,
          "steps": [
            "在相同Clip和输入下，仅开关Has Exit Time，记录过渡开始时刻。",
            "用长度已知且播放速度为1的片段，保持Duration=0.25，分别勾选和取消Fixed Duration，记录单位与预计秒数；随后只改Duration，观察过渡开始后的混合。不要把开始前等待时间也算进Duration。",
            "快速反复切换和停用恢复，记录当前参数与状态，检查是否出现意外中断。"
          ],
          "result": "能把延后开始和缓慢混合分别解释。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "按键后过一会才走路动画",
          "cause": "过渡等待 Exit Time 或存在过长混合。",
          "fix": "按响应需求分别检查退出时间、条件和持续时间。"
        },
        {
          "symptom": "参数变化但状态不切换",
          "cause": "参数类型名称、当前状态可达边或其他条件不匹配。",
          "fix": "运行时观察图，逐条核对边的全部条件。"
        }
      ],
      "exercise": {
        "brief": "建立 Idle/Walk/Attack 三状态图，写出每条边的允许条件与打断策略。",
        "deliverables": [
          "状态图",
          "参数表",
          "边与反例测试"
        ],
        "rubric": [
          {
            "item": "默认播放链正确",
            "points": 25
          },
          {
            "item": "条件完整",
            "points": 25
          },
          {
            "item": "退出混合可解释",
            "points": 25
          },
          {
            "item": "游戏规则与动画表现分工清楚",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "状态没有设置Motion，通常意味着什么？",
          "options": [
            "状态名会自动匹配同名Clip",
            "不能提供预期的片段内容",
            "会自动读取前一状态的最后一帧作为新Clip",
            "只要默认状态正确就完全没有影响"
          ],
          "answer": 1,
          "explanation": "状态选择与片段引用都要正确，名称不能替代Motion。"
        },
        {
          "question": "Idle到Walk需要尽快响应时，应检查什么？",
          "options": [
            "Has Exit Time和过渡持续时间",
            "只提高Sprite的PPU",
            "只增加Idle片段总长度",
            "只把Moving从Bool改为Trigger"
          ],
          "answer": 0,
          "explanation": "参数满足后仍可能等待退出条件，开始后也可能持续混合。"
        },
        {
          "question": "Trigger能直接替代可靠业务消息队列吗？",
          "options": [
            "能，它会自动保存所有触发次序",
            "不能，它是受状态过渡规则消费的动画参数",
            "能，只要参数名唯一",
            "能，只要每帧都再次SetTrigger"
          ],
          "answer": 1,
          "explanation": "Trigger不自动提供编号、确认、重试和完整顺序，应另行定义关键动作请求规则。"
        }
      ],
      "references": [
        {
          "label": "Animator",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator.html"
        },
        {
          "label": "Animator.SetBool",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator.SetBool.html"
        }
      ],
      "summary": [
        "参数条件、退出时间和过渡持续时间共同影响切换。",
        "观察实际Animator，沿每条需要的状态路径运行验证。"
      ],
      "teaching": {
        "question": "Moving已经变true，角色为什么仍过了一会儿才从Idle切到Walk？",
        "keyIdea": "参数条件只是过渡规则的一部分。还要区分是否在等待退出时间，以及是否已经进入有持续时间的混合。",
        "walkthrough": [
          {
            "title": "确认写到了正确参数",
            "text": "运行时选中实际角色的Animator，在Parameters中观察Moving是否确实从false变为true。"
          },
          {
            "title": "看过渡何时开始",
            "text": "检查Idle到Walk是否启用Has Exit Time，观察参数满足后状态条是否仍等待指定播放进度。"
          },
          {
            "title": "再看混合持续多久",
            "text": "只修改过渡Duration并重复测试，区分开始前的等待与开始后的混合，最后按角色需求选择。"
          }
        ],
        "prediction": {
          "question": "Walk状态名称正确但Motion为空，能靠参数Moving=true自动补上Walk片段吗？",
          "answer": "不能。状态名与资源名没有这种自动关联，必须显式指定Motion并验证实际播放。"
        }
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l047"
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
      "id": "l048",
      "title": "动画参数、Blend Tree 与数据选择",
      "goals": [
        "选择输入或实际速度驱动动画",
        "解释参数平滑与延迟",
        "为二维和三维选择不同表现方案"
      ],
      "theory": [
        {
          "title": "先说明Speed到底代表什么",
          "paragraphs": [
            "角色按住向右移动键、身体顶住墙时，输入仍表示想移动，实际身体速度却可能接近零。如果动画参数Speed来自输入，就可能继续跑步；来自实际速度，则可能回到Idle。两种选择都能实现，差别在于表现要描述努力还是实际位移，不能用同一个名字掩盖含义。",
            "先为每个参数写来源和单位。例如Speed表示每秒世界单位，FacingX表示最后朝向的水平分量。移动平台上的角色还可能需要相对平台速度，而不是绝对世界速度。确定要表现哪种事实后，再决定读哪个值和怎样计算。"
          ]
        },
        {
          "title": "速度长度与平方长度不能混阈值",
          "paragraphs": [
            "若速度向量是(3, 4)，长度为5，平方长度为25。为了避免开平方，有时用sqrMagnitude做阈值比较，但阈值也要平方：若真实速度超过0.1才算走路，平方值应与0.01比较，而不是仍与0.1比较。",
            "这不是微不足道的命名问题。参数叫SpeedSquared却配置普通Speed的混合阈值，会让状态在错误区间切换。可以先用几个已知向量做表，确认零速、慢走和快跑对应数值，再把这些值输入Animator。先保证含义正确，之后再判断这点计算是否真的需要优化。"
          ]
        },
        {
          "title": "Blend Tree按参数混合，不代替物理",
          "paragraphs": [
            "一维Blend Tree适合按一个数值在Idle、Walk、Run等动作之间选择和混合。设阈值分别为0、2和5，参数处于中间时，系统依对应树的规则混合相关动作。二维树则利用两个参数表示方向等信息，还要选择符合需求的混合类型。",
            "混合树不会替你计算角色实际速度，也不会让不一致的片段自动步幅匹配。Sprite对象引用轨道不能简单理解为像两张颜色图片那样连续融合出新动作。使用的Clip内容、维度、阈值与可见结果都要测试，不能只看节点摆得像一个方向盘就认定正确。"
          ]
        },
        {
          "title": "平滑能去抖，也会迟到",
          "paragraphs": [
            "速度在零附近波动，直接驱动动画可能频繁切换。阈值容差、迟滞或阻尼能减少抖动，但每种都会改变响应。设角色已经停止，带阻尼的显示参数仍缓慢下降，那么回到Idle就可能比身体停止晚；这不是参数没更新，而是滤波造成的延迟。",
            "先关闭平滑检查原始数据，再引入一项平滑并测停止时间。不要同时在运动、脚本参数和状态过渡三处增加很大延迟，否则角色动作会显得迟钝，却很难说清哪一层负责。实际容差应结合物理噪声、玩法节奏和美术动作选择。",
            "另一种去抖方法是迟滞：静止时只有速度大于0.15才进入走路，走路后要低于0.08才回待机；处在0.08到0.15之间则保留原状态。这样速度在0.10附近微小波动时，不会每帧来回切换。它不是把原值慢慢拉向目标，而是给进入与退出两条不同边界，适合与阻尼作对照。"
          ]
        },
        {
          "title": "多层动画同样需要明确写入范围",
          "paragraphs": [
            "一个Animator可以有多个层与遮罩，不同层可能影响不同身体部位，也可能写同一个属性。上层权重、混合方式与遮罩改变后，即使底层Speed和状态都正确，最终画面仍可能被另一层覆盖。排查时先只启用基础层，再逐层恢复。",
            "建立顶墙、击退、慢推输入、急停与方向切换的样本，同时记录输入、身体速度、参数值和当前动作。四列一对照，就能判断是数据选择错误、阈值错误还是混合规则错误。最后注明阈值单位和阻尼时间，后续改角色速度时才能同步维护表现。",
            "还可以将身体与参数的时间曲线同时画出来。急停时身体速度先下降，参数稍后下降，说明延迟来自平滑；参数已归零但状态未切换，则继续检查过渡。用同一时轴比较这两层，比在不同窗口凭印象判断快慢更容易找到实际延迟来源。"
          ]
        }
      ],
      "code": {
        "title": "由二维实际速度驱动参数",
        "language": "csharp",
        "filename": "BodyAnimationAdapter.cs",
        "source": "using UnityEngine;\npublic class BodyAnimationAdapter : MonoBehaviour\n{\n    [SerializeField] Rigidbody2D body;\n    [SerializeField] Animator animator;\n    static readonly int Speed = Animator.StringToHash(\"Speed\");\n    void Update()\n    {\n        if (!body || !animator) return;\n        animator.SetFloat(Speed, body.linearVelocity.magnitude);\n    }\n}",
        "explanation": [
          "参数来自二维刚体的实际速度，先在无平滑时比较顶墙和自由移动，明确它表达身体结果。",
          "若改成输入驱动或平方长度，参数名、单位和Controller阈值也要一起检查，不能只换取值表达式。"
        ]
      },
      "lab": [
        {
          "title": "比较想移动与实际移动",
          "minutes": 60,
          "steps": [
            "记录自由行走、顶墙和击退时的输入长度及身体速度。",
            "分别让动画读取输入和实际速度，写出两种表现适合什么需求。",
            "检查方向参数是否在停止后保留最后一次有效朝向。"
          ],
          "result": "一张参数来源与可见表现的选择表。"
        },
        {
          "title": "验证阈值和平滑的代价",
          "minutes": 60,
          "steps": [
            "用已知速度计算长度和平方长度，为阈值建立数值表。",
            "先关闭所有平滑，输入0.07、0.10、0.16、0.10、0.07的速度序列；分别比较单阈值和“进入0.15、退出0.08”的迟滞。再单独加参数阻尼，测量急停延迟，不同时叠加多个改动。",
            "关闭其他层后复测，再逐层恢复检查属性覆盖。"
          ],
          "result": "阈值有单位，平滑有响应时间记录。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "放开按键很久才回 Idle",
          "cause": "输入、速度和参数多层平滑叠加。",
          "fix": "分别测量每层响应，保留有意设计的延迟。"
        },
        {
          "symptom": "参数正常但某动作永远不可见",
          "cause": "层权重、遮罩或属性写入冲突。",
          "fix": "简化为单层验证，再逐项恢复。"
        }
      ],
      "exercise": {
        "brief": "为骑士写一个表现适配器，并用墙、击退和停止验证参数语义。",
        "deliverables": [
          "参数来源、单位、范围和使用规则",
          "三种边界录像或记录",
          "平滑延迟测量"
        ],
        "rubric": [
          {
            "item": "来源选择有理由",
            "points": 25
          },
          {
            "item": "单位阈值一致",
            "points": 25
          },
          {
            "item": "写入责任单一",
            "points": 25
          },
          {
            "item": "边界测试完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "输入长度与实际身体速度何时可能不同？",
          "options": [
            "顶墙或受到击退时",
            "只要把变量命名为Speed就完全相同",
            "只在Editor不相同，构建后必然相同",
            "开启插值后两者就永远相同"
          ],
          "answer": 0,
          "explanation": "输入是意图，身体结果还受到接触和外部运动影响。"
        },
        {
          "question": "将Speed改成SpeedSquared后能直接沿用数值阈值吗？",
          "options": [
            "能，平方不会改变比较意义",
            "不能，阈值也需要采用对应平方",
            "能，只要参数仍然是Float",
            "能，只要速度小于1"
          ],
          "answer": 1,
          "explanation": "长度与平方长度的数值和量纲不同，应从原始速度条件推导阈值。"
        },
        {
          "question": "阻尼通常带来什么取舍？",
          "options": [
            "减少抖动，同时可能增加响应延迟",
            "减少抖动，并保证零延迟",
            "自动修复错误的参数单位",
            "自动保证动画和物理步完全同步"
          ],
          "answer": 0,
          "explanation": "平滑是有时间尺度的数据处理，应同时检查稳定性与响应速度。"
        }
      ],
      "references": [
        {
          "label": "Animator.SetFloat",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator.SetFloat.html"
        },
        {
          "label": "Animator.SetLayerWeight",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator.SetLayerWeight.html"
        }
      ],
      "summary": [
        "参数先写清来源与单位，平方长度要使用平方阈值。",
        "平滑能减少波动，也可能引入延迟，需要分层测量。"
      ],
      "teaching": {
        "question": "SpeedSquared在速度0.1时是多少，为什么不能直接沿用Speed的阈值？",
        "keyIdea": "平方长度和长度不是同一个量。比较方式变化后，阈值也必须用同样运算，才能表达原来那个速度条件。",
        "walkthrough": [
          {
            "title": "定义原始条件",
            "text": "假设设计要求实际速度大于0.1个世界单位/秒时离开Idle，先把这个含义写清楚。"
          },
          {
            "title": "换成平方比较",
            "text": "如果读取sqrMagnitude，应比较0.1 × 0.1 = 0.01，不能仍与普通长度阈值0.1比较。"
          },
          {
            "title": "用边界值验证",
            "text": "输入速度0、0.05、0.1和0.2，记录平方值与判断结果，再检查Animator阈值是否采用同一含义。"
          }
        ],
        "prediction": {
          "question": "给参数增加阻尼后，急停回Idle变慢一定是错误吗？",
          "answer": "不一定。平滑会引入响应延迟，应测量并判断是否符合需求，再检查是否多层重复平滑。"
        }
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l048"
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
      "id": "l049",
      "title": "Animation Event、根运动与动作时序",
      "goals": [
        "选择动画事件的合适用途",
        "明确根运动与物理的控制权",
        "区分表现时点与可靠业务规则"
      ],
      "theory": [
        {
          "title": "脚落地的那一刻可以由动画报告",
          "paragraphs": [
            "走路片段播放到脚接触地面的画面时，希望响起脚步声。Animation Event适合给这个时点附加通知，由接收方法播放声音或产生脚印。它把表现时间与片段联系起来，比另写一个与动作不同步的固定间隔计时器更直观。",
            "先在测试Clip放一个事件，确认方法名、参数类型、接收对象和事件时点。脚本没有正确挂到可接收的位置，或方法签名不匹配，事件就不会按预期被处理。事件只说明播放经过某个标记，不应被理解成物理系统已经证明脚真的踩到地面。"
          ]
        },
        {
          "title": "中断、循环与速度会改变事件上下文",
          "paragraphs": [
            "一次走路循环可能经过同一脚步标记多次，这是正常重复。攻击动画还可能在事件之前被打断，或因为混合、中断和速度变化，让收到回报的时刻与原先简单预想不同。因此不能仅凭“片段里有扣血事件”就证明每次攻击恰好结算一次。",
            "关键动作可由游戏逻辑建立动作编号和有效阶段，收到动画回报时检查是否仍属于当前动作。若已经取消，就忽略旧回报；若规则要求只结算一次，再记录是否已消费。动画负责报告表现时点，业务负责判断当前是否仍允许产生结果。",
            "这里的身份检查有个前提：必须能判断回报属于哪一次动作。Clip里写死的整数参数只是固定标记，不会在每次播放时自动变成本次攻击编号；无参数事件里直接读取“当前编号”，也不能证明迟到事件来自当前动作。初学实验先把Animation Event限制在脚步等表现，关键判定由独立的当前动作流程推进；确实让动画回报关键结果时，再设计可核验的状态、阶段及身份传递。"
          ]
        },
        {
          "title": "根运动提供位移来源，不自动解决冲突",
          "paragraphs": [
            "有些三维动作包含根位移，Animator可以通过根运动相关机制提供移动信息。它适合让动作步幅与位移协调，但不代表同一个对象可以同时让移动脚本、导航和根运动各自写位置。若两者都推进，可能重复位移或互相覆盖。",
            "先决定身体由谁移动，再决定怎样使用动画提供的位移。纯Sprite待机通常不需要让片段写物理根位置；如果动画只负责外观，就让运动脚本保留身体移动责任。需要接入OnAnimatorMove等方案时，还要按实际刚体类型和模拟时点验证，不能直接从一个样例推广。"
          ]
        },
        {
          "title": "把动作事实和表现回报分开记录",
          "paragraphs": [
            "设游戏已经确认一次命中，随后播放火花与音效。即使火花资源暂时不可用，也不应自然撤销已经确认的伤害。反过来，单独预览带火花事件的Clip，也不应意外创建真实伤害。这说明游戏事实与表现通知应有可区分的入口。",
            "动作是否允许被打断、何时扣资源、何时产生判定、何时结束，都应先写清。对每个阶段注明使用哪种时钟和谁负责清理，停用、死亡和切场景时再按这些规则结束。没有这些规定，仅把逻辑放到不同函数里，也不能自动获得正确时序。"
          ]
        },
        {
          "title": "用故意打断来验证事件设计",
          "paragraphs": [
            "先验证正常播放只产生预期脚步，再在事件前后切换状态，测试加速、循环和对象停用。日志记录动作编号、当前状态、事件名与消费结果，就能看清旧回报是否误作用于新动作。逐个检查位置写入点，确认没有根运动与脚本同时推进身体。",
            "教学脚步接收器只展示如何响应表现回报，不是完整攻击系统。扩展时先补齐动作身份与取消规则，再处理组合动作。一个可靠例子不仅能解释正常播放，也能解释为何过期事件被忽略，以及表现中断后身体仍由谁继续控制。"
          ]
        }
      ],
      "code": {
        "title": "只负责表现的脚步接收器",
        "language": "csharp",
        "filename": "FootstepEventReceiver.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(AudioSource))]\npublic class FootstepEventReceiver : MonoBehaviour\n{\n    [SerializeField] AudioClip step;\n    AudioSource source;\n    void Awake() { source = GetComponent<AudioSource>(); }\n    public void Footstep()\n    {\n        if (step && source) source.PlayOneShot(step);\n    }\n}",
        "explanation": [
          "在脚接近地面的关键画面添加对应事件，并将接收器放在实际可接收该事件的动画对象。",
          "该接收器只负责脚步等表现。不要把它当成带取消、去重和目标验证的完整攻击判定。"
        ]
      },
      "lab": [
        {
          "title": "验证正常与中断的事件",
          "minutes": 60,
          "steps": [
            "先用一个脚步事件验证方法名、签名、对象与正常调用次数。",
            "在事件前后切换状态，再改变播放速度与循环，记录实际回报。",
            "画出攻击A开始、A取消、攻击B开始、旧回报到达的四个时点。检查回报究竟携带了什么，特别说明“事件中读取当前编号”为什么不能单独证明来源；在未解决来源前，仅让本例事件播放脚步，不让它直接扣血。"
          ],
          "result": "正常路径和过期回报都有解释的时序记录。"
        },
        {
          "title": "检查身体到底由谁移动",
          "minutes": 60,
          "steps": [
            "列出移动脚本、Animator根运动、导航及位置曲线的写入对象。",
            "在测试场景逐个开关这些来源，观察重复移动或覆盖。",
            "选择一个明确身体移动者，验证事件表现不会偷偷修改物理根。"
          ],
          "result": "一份身体移动责任与动画回报范围的说明。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "脚步声找不到接收函数",
          "cause": "事件函数名、签名或组件所在对象不匹配。",
          "fix": "核对事件接收对象与公开方法，再测试最小片段。"
        },
        {
          "symptom": "冲刺抖动或位移翻倍",
          "cause": "根运动与移动脚本同时控制身体。",
          "fix": "明确最终移动身体的组件，由它接收并处理动画提供的位移。"
        }
      ],
      "exercise": {
        "brief": "设计一个能被中断的攻击流程说明，把表现事件与是否允许结算伤害的判断分开。",
        "deliverables": [
          "时序图",
          "事件接收实验",
          "中断与暂停反例"
        ],
        "rubric": [
          {
            "item": "动作阶段清楚",
            "points": 25
          },
          {
            "item": "事件用途合适",
            "points": 25
          },
          {
            "item": "运动责任明确",
            "points": 25
          },
          {
            "item": "失败策略完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "Animation Event最直接适合哪类用途？",
          "options": [
            "脚步声等与画面相关的表现时点",
            "无需校验地执行所有攻击伤害",
            "替代所有物理接触查询",
            "保证重要消息永远只到达一次"
          ],
          "answer": 0,
          "explanation": "事件报告动画时点，关键业务还需要独立有效性和身份判断。"
        },
        {
          "question": "根运动与脚本同时写同一身体位置，主要风险是什么？",
          "options": [
            "移动被重复应用或相互覆盖",
            "自动得到更准确的双重模拟",
            "只影响名字，不影响画面",
            "Unity必然自动按最佳顺序合并"
          ],
          "answer": 0,
          "explanation": "不同来源不会天然理解彼此意图，应明确最终由谁推进身体。"
        },
        {
          "question": "动作被中断后，应怎样处理可能过期的回报？",
          "options": [
            "无论当前状态如何都继续结算",
            "检查当前动作身份与状态后决定是否接受",
            "只比较动画资源文件名",
            "把所有回报都延后到下一帧就一定正确"
          ],
          "answer": 1,
          "explanation": "延后不能替代有效性校验。应明确动作取消后的处理规则。"
        }
      ],
      "references": [
        {
          "label": "AnimationEvent",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AnimationEvent.html"
        },
        {
          "label": "Animator.applyRootMotion",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator-applyRootMotion.html"
        }
      ],
      "summary": [
        "动画事件报告表现时点，关键结果还需要当前动作状态校验。",
        "根运动与脚本移动应由明确流程整合，避免重复写身体位置。"
      ],
      "teaching": {
        "question": "攻击已经被打断，旧动画回报为什么不能直接给新目标扣血？",
        "keyIdea": "动画回报需要放在当前动作上下文中解释。关键结果由动作身份和有效状态确认，不能仅凭收到一个方法调用就认为仍然允许执行。",
        "walkthrough": [
          {
            "title": "建立动作身份",
            "text": "开始攻击时记录动作编号与目标，明确本次判定何时有效，以及是否已经结算过一次。"
          },
          {
            "title": "提前打断动作",
            "text": "在事件到达前取消攻击，将当前有效动作改为取消或新编号，同时结束旧动作的判定资格。"
          },
          {
            "title": "检查迟到回报",
            "text": "先确认回报携带可核验的来源身份，再结合有效阶段决定是否接受；直接在旧回报中读取新动作的当前编号不能认证来源。若来源无法区分，就只作表现通知，关键结果由独立动作逻辑推进。"
          }
        ],
        "prediction": {
          "question": "脚步事件被正常触发，能证明角色此刻一定有地面接触吗？",
          "answer": "不能。事件来自动画播放时点，地面事实仍需相应物理判断；可以结合状态决定是否播放脚步效果。"
        }
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l049"
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
      "id": "l050",
      "title": "Idle 故障诊断：从证据到完整修复",
      "goals": [
        "按链路定位静止动画",
        "分辨空 Clip、空 Controller 和错误绑定",
        "建立可复现的回归检查"
      ],
      "theory": [
        {
          "title": "把“做不了Idle”改成可检查的现象",
          "paragraphs": [
            "“Idle做不了”可能指Create按钮不可用、图片无法拖进时间轴、预览不换帧、Play后不播放，或播放时脚底跳动。这些现象发生在不同环节，不能用同一套重建步骤处理。先记录选中了场景对象还是Project资源、哪个窗口不能操作、有没有Console错误。",
            "例如不能创建片段，先检查实际选中对象和动画宿主；关键帧已有Sprite但运行静止，则往播放选择链检查。报错也要记录完整位置，不要仅截图空白画面。准确描述能让接下来的每一步都针对一个明确假设。"
          ]
        },
        {
          "title": "先证明图片帧本身可用",
          "paragraphs": [
            "展开图集，逐个选择实际Sprite子帧，看预览是否是正确角色和动作行。确认Sprite Mode、切片矩形、PPU与Pivot，排除整张图误当一帧、空白切片或帧序错误。把单帧直接放到SpriteRenderer，先证明图片能正常显示。",
            "接着查看Clip的Sprite轨道与绑定路径，逐帧拖动时间轴。若根位置不动而脚底跳，优先比较帧框与Pivot；若切帧完全不生效，检查轨道是否找到实际组件。不要在数据仍有问题时同时修改物理速度与状态条件，那会让现象更难归因。"
          ]
        },
        {
          "title": "沿运行对象逐层追踪引用",
          "paragraphs": [
            "选中Hierarchy里真实角色，查看它的Animator是否启用、使用哪个Controller。再打开这个Controller，找默认状态、当前状态和每个状态的Motion，最后核对Motion实际引用的Clip。项目里另一个同名Idle正确，不代表角色使用的就是它。",
            "进入Play后再看参数是否改变、哪条过渡正在运行、是否等待Exit Time，以及是否被其他层或状态覆盖。每到一个节点先确认输入和输出，再继续下一层。这样即使故障来自错误Controller，也不需要把原本正确的图片与Clip全部重做。"
          ]
        },
        {
          "title": "同名副本会增加判断成本",
          "paragraphs": [
            "反复点击创建可能得到Idle、Idle1、Idle2和多个Controller。它们看着相似，却有独立资源身份和不同引用。此时不应先删掉所有多余文件，避免误删仍被使用的资源；应先从实际组件定位当前使用链，记录路径后再清理。",
            "可以在测试副本中建立一个只含Idle的最短Controller，验证片段与对象能运行。如果最短链正常，再逐项恢复Walk、参数和过渡，找出哪一步引入故障。临时替换要有记录，完成后检查场景和Prefab实际保存了哪个版本，避免“测试修好了但正式角色没改”。",
            "先做一张三列诊断表：单帧放到SpriteRenderer是否正确、Animation窗口采样是否换帧、Play运行是否换帧。错误Sprite常在第一列就暴露；绑定路径错时，单帧可用但时间轴无法作用到目标；空Motion或错误Controller则可能前两列都正常、第三列才失败。这个顺序不是替每种问题给唯一答案，而是用最早失效的节点缩小检查范围。"
          ]
        },
        {
          "title": "修复要留下别人能重复的证据",
          "paragraphs": [
            "最终验收不只是一张角色动起来的截图。退出Play再运行，检查启动Idle、移动到Walk、停止回Idle、重复启停和脚底稳定性；重新打开场景后再核对引用。若曾修复切片或路径，现有其他Clip也应做相应回归，防止修一个动作破坏另一个。",
            "报告按“原现象、定位证据、根因、修改、复测结果”组织。能明确说出哪条引用错了或哪个条件在等待，比“重建之后好了”更有学习价值。以后遇到攻击动画、UI动画或导入片段，也可以复用同样从数据到选择再到最终显示的检查方法。",
            "修复过程中应保存最小证据，而不是堆满所有窗口截图。例如错误Motion的Inspector、实际状态和修正后的运行结果，就能支持这一根因；若声称是脚本覆盖参数，则需要看到对应写入位置与运行参数变化。证据应服务于结论，每个结论都能指出依据，避免把猜测写成已经证实的事实。"
          ]
        }
      ],
      "code": {
        "title": "检查 Animator 的最低配置",
        "language": "csharp",
        "filename": "AnimatorConfigurationProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Animator))]\npublic class AnimatorConfigurationProbe : MonoBehaviour\n{\n    void Start()\n    {\n        var a = GetComponent<Animator>();\n        Debug.Log($\"enabled={a.enabled}, controller={a.runtimeAnimatorController}, layers={a.layerCount}, speed={a.speed}\", this);\n    }\n}",
        "explanation": [
          "把检查器挂到实际动画对象，先检查Animator是否存在及基本引用是否齐全。",
          "最低配置检查通过不代表完整状态图与所有轨道都正确，仍需按引用链和运行路径逐项验证。"
        ]
      },
      "lab": [
        {
          "title": "故意制造四类可区分故障",
          "minutes": 60,
          "steps": [
            "在副本中分别制造错误Sprite帧、错误绑定路径、空Motion和错误Controller。",
            "每个故障都填写三列：单帧显示、时间轴采样、Play运行。再指出最早失败的是数据、绑定还是运行选择；只修改这一处后重复三列验证，不用“重建后好了”代替定位证据。",
            "记录哪一步首次失败及实际引用，修复后复测，不重建全部资源。"
          ],
          "result": "四份现象、证据与根因一一对应的诊断记录。"
        },
        {
          "title": "从实际引用完成回归",
          "minutes": 60,
          "steps": [
            "整理场景角色到Controller、状态、Clip、Sprite的真实引用路径。",
            "启动后测试Idle、移动、停止、重复启停与脚底稳定，再重开场景。",
            "清理重复资产前确认依赖，保存最终Prefab和场景并再次运行。"
          ],
          "result": "别人能按步骤重复得到同样结果的修复报告。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "修了 Idle 但运行仍是旧动作",
          "cause": "实际 Controller 指向 Idle1 或另一份 Clip。",
          "fix": "从运行对象沿引用定位，不按名字猜。"
        },
        {
          "symptom": "预览有帧而运行静止",
          "cause": "运行选择链或属性写入链仍有断点。",
          "fix": "依次检查 Animator、Controller、默认状态、Motion、绑定和覆盖写入。"
        }
      ],
      "exercise": {
        "brief": "为自己的 Idle 故障写一份可交给他人复现的诊断报告。",
        "deliverables": [
          "触发步骤、预期与实际表现",
          "实际引用链",
          "四个回归结果"
        ],
        "rubric": [
          {
            "item": "现象描述准确",
            "points": 25
          },
          {
            "item": "证据定位有序",
            "points": 25
          },
          {
            "item": "变更最小可解释",
            "points": 25
          },
          {
            "item": "回归覆盖充分",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "时间轴存在关键帧，能保证顶部Play会播放吗？",
          "options": [
            "能，关键帧存在就会自动接入所有角色",
            "不能，还需要实际运行选择链正确",
            "能，只要文件名为Idle",
            "能，只要Clip启用Loop Time"
          ],
          "answer": 1,
          "explanation": "Clip数据、绑定目标和运行状态选择都要连通。"
        },
        {
          "question": "面对Idle和Idle1两个资源，优先怎样定位？",
          "options": [
            "先删除较新的一个",
            "从实际Animator和Motion沿引用找到使用者",
            "只看哪个名字更短",
            "把两个都拖到同一状态就自动合并"
          ],
          "answer": 1,
          "explanation": "先确认真实引用再修改，避免修到未使用的副本。"
        },
        {
          "question": "修复后最有价值的交付是什么？",
          "options": [
            "只有动起来的一张截图",
            "可重复测试步骤与真实引用、运行证据",
            "一句“重新创建就好了”",
            "保留更多Idle副本供以后尝试"
          ],
          "answer": 1,
          "explanation": "复现和回归证据帮助判断根因，也能避免保存或重新导入后故障复发。"
        }
      ],
      "references": [
        {
          "label": "Animator",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator.html"
        },
        {
          "label": "AnimationClip",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AnimationClip.html"
        }
      ],
      "summary": [
        "先把“做不了”描述成具体操作、预期和实际表现。",
        "从场景真实对象沿引用检查，每次只修复已定位的环节。"
      ],
      "teaching": {
        "question": "项目里Idle预览正常，角色Play后却静止，第一步该打开哪个Idle？",
        "keyIdea": "先从场景实际Animator沿引用查找，确定角色真的用了哪个Controller和Clip。名字相同不能证明引用相同。",
        "walkthrough": [
          {
            "title": "锁定真实角色",
            "text": "在Hierarchy选中运行中的角色，记录Animator的启用状态和实际Controller路径，不先搜索所有Idle。"
          },
          {
            "title": "继续沿Motion查找",
            "text": "打开这个Controller，确认当前或默认状态，再从Motion定位它真正引用的Clip和Sprite轨道。"
          },
          {
            "title": "只修断开的节点",
            "text": "若实际Motion为空就补上正确片段；若状态没进入则查参数与过渡，再退出重进Play验证。"
          }
        ],
        "prediction": {
          "question": "已经能在时间轴拖动看到换帧，能因此排除Controller配置错误吗？",
          "answer": "不能。时间轴采样与运行时状态选择分开，仍要查看实际Animator、状态和Motion。"
        }
      }
    }
  ]
});
