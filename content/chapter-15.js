window.COURSE_MODULES.push({
  "id": "m15",
  "number": 15,
  "title": "数据与序列化",
  "subtitle": "分清编辑器配置、运行状态和持久化存档",
  "description": "从字段怎样进入场景文件，到 ScriptableObject、JSON、版本迁移与存档可靠性，建立可解释的数据所有权。",
  "accent": "#527c63",
  "lessons": [
    {
      "id": "l071",
      "title": "Unity 序列化：Inspector 为什么记住这个值",
      "prerequisites": [
        "l010",
        "l070"
      ],
      "goals": [
        "预测字段是否会被 Unity 序列化",
        "解释代码初始值和场景保存值的关系",
        "设计不依赖属性 setter 的数据约束"
      ],
      "theory": [
        {
          "title": "为什么改了源码，角色还是跑原来的速度",
          "paragraphs": [
            "把组件的 speed 初始值写成 5，添加组件后，Inspector 显示 5。现在在 Inspector 改成 3并保存场景，再把源码里的初始值改成 10。重新进入播放模式，速度仍可能是 3。这里没有哪个值“失灵”：代码提供创建时的初始设置，场景文件则已经保存了这个组件自己的配置。",
            "序列化就是把需要保存的数据写成之后能恢复的表示。Unity 恢复已有组件时，会把它保存的字段值还原。因此修改初始化器，并不会把所有历史场景和 Prefab 中的配置统一改掉。你需要区分新添加组件、已有组件和执行 Reset 后的组件，分别观察它们的来源。"
          ]
        },
        {
          "title": "Inspector 编辑的是哪些数据",
          "paragraphs": [
            "不是所有 C# 成员都由 Unity 自动保存。字段需要满足序列化规则，例如合适类型的 public 实例字段，或者标注 SerializeField 的 private 实例字段。普通属性和静态字段不能因为写在同一个类里，就被当作相同的序列化数据。列表也要满足元素类型等条件。",
            "一个常见误会是给 Speed 属性写 setter，然后期待 Inspector 改 speed 时经过它。默认字段编辑并不会这样调用普通属性 setter。因此若限制速度不能为负，不能只在属性里检查。先明确数据实际从哪条路径进入：Inspector、存档、运行时方法，还是网络输入，再安排对应检查。"
          ]
        },
        {
          "title": "沿着编辑、运行和重置做一次对照",
          "paragraphs": [
            "本课把同一字段追踪四次：第一次添加时是 5；保存为 3后，3 成为该组件的场景配置；源码改成 10，不会覆盖已保存的 3；播放中暂时改成 7，再停止，通常回到编辑模式保存的值。每一次都记录是否处于播放模式以及是否保存，便能解释数值为什么变化。",
            "Reset 为组件恢复默认设置提供另一个入口，适合观察新默认配置，但不应被当成通用数据迁移方案。它会影响组件配置，做对照时先使用实验副本。真正要批量更新历史资源，应清楚列出修改范围、保留哪些用户值，并检查 Prefab 覆盖，而不是要求所有人逐个重置。"
          ]
        },
        {
          "title": "编辑器检查和运行时检查分别保护什么",
          "paragraphs": [
            "OnValidate 可以在编辑器数据变化等情况下纠正或提示配置，例如把负速度限制为零，让作者较早发现问题。但它不是只在你拖动 Inspector 时执行，也不是一个可以任意创建场景对象的普通更新函数。保持工作简短，尽量只检查本对象的数据，不在这里堆放复杂行为。",
            "运行时仍要验证真正接收的数据。假设存档读出负速度，它未必经过编辑器中的那次检查。示例在 Awake 处理运行入口，正式组件也可以通过明确的方法验证参数。检查应发生在数据将要被使用的地方；编辑器提示帮助作者，运行时检查则防止程序收到不合法状态。"
          ]
        },
        {
          "title": "字段改名也是一次数据变更",
          "paragraphs": [
            "如果旧场景保存着字段 speed，而你把字段直接改名，旧数据与新字段的对应关系可能受影响。重构时不仅要让 C# 编译通过，还要打开历史场景和资源检查。对于适合的字段改名，可以查阅 FormerlySerializedAs；若结构或含义已经变化，还需要另外设计迁移。",
            "字典、多维容器或复杂对象关系也不能仅凭 Inspector 看不到就随意猜测。先查官方支持范围，再选可保存的表示，例如键值条目列表，并在恢复后建立运行时索引。最终应能说明：文件里保存什么、运行时怎样还原、约束在哪里检查，以及旧资源修改后怎样验证。"
          ]
        }
      ],
      "code": {
        "title": "对比序列化值与源码默认值",
        "language": "csharp",
        "filename": "SerializedSpeedProbe.cs",
        "source": "using UnityEngine;\n\n// 挂到空对象；先在编辑模式修改 speed，再运行。\npublic sealed class SerializedSpeedProbe : MonoBehaviour\n{\n    [SerializeField] private float speed = 5f;\n    public float Speed => speed;\n    private static float Valid(float value) => Mathf.Max(0f, value);\n    private void OnValidate() => speed = Valid(speed);\n    private void Awake()\n    {\n        speed = Valid(speed);\n        Debug.Log($\"Loaded speed: {speed}\", this);\n    }\n}",
        "explanation": [
          "把组件挂到实验空对象。speed 字段由 Unity 保存，只读属性供其他代码获取；OnValidate 和 Awake 分别检查编辑器数据与运行入口。",
          "先在 Inspector 保存 speed=3，再把源码初始值改为 10。对比已有组件、新添加组件和 Reset 后的结果，避免把三种情况混在一起。"
        ]
      },
      "lab": [
        {
          "title": "追踪一个字段的四次变化",
          "minutes": 60,
          "steps": [
            "在独立实验场景给空对象添加组件，先记录 Inspector 中 speed 的代码默认值 5。",
            "把 speed 改为 3，保存场景，停止任何播放后把源码初始值改为 10。",
            "重新运行，记录日志；对组件执行 Reset，再记录区别。",
            "进入 Play Mode 改成 7，停止播放，观察编辑模式数值并解释。"
          ],
          "result": "形成默认值、序列化值、重置值、临时运行值的对照表。"
        },
        {
          "title": "验证与容器边界",
          "minutes": 60,
          "steps": [
            "在编辑模式的 Inspector 输入负速度，观察 OnValidate 的纠正，再对照运行入口检查。",
            "在副本脚本里添加普通属性、static 字段和带 SerializeField 的 private 字段。",
            "比较 Inspector 与保存后恢复的内容。",
            "为字典设计可序列化键值列表，不假定 Dictionary 自动保存。"
          ],
          "result": "能依据规则预测结果，且记录不符合直觉的字段。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "修改源码默认速度后游戏仍用旧值",
          "cause": "场景中已保存的序列化字段覆盖初始值。",
          "fix": "检查对象实际配置；若需重置先确认影响范围，若需全局迁移写迁移工具。"
        },
        {
          "symptom": "属性 setter 的校验没有执行",
          "cause": "Inspector 操作字段序列化数据而非属性赋值接口。",
          "fix": "抽出验证函数，在 OnValidate 和运行入口分别调用。"
        }
      ],
      "exercise": {
        "brief": "为一个移动配置组件设计可编辑字段、只读访问和双环境校验，解释每个数值的来源。",
        "deliverables": [
          "组件代码与挂载说明",
          "四阶段数值对照表",
          "一段字段类型边界说明"
        ],
        "rubric": [
          {
            "item": "正确区分初始值与保存值",
            "points": 30
          },
          {
            "item": "验证规则能在运行时成立",
            "points": 25
          },
          {
            "item": "容器与属性解释准确",
            "points": 25
          },
          {
            "item": "复现步骤完整",
            "points": 20
          }
        ]
      },
      "quiz": [
        {
          "question": "已保存 speed=3，源码初始化器从 5 改为 10，通常会得到什么？",
          "options": [
            "3",
            "10",
            "先显示 10，第一帧后自动变成 5"
          ],
          "answer": 0,
          "explanation": "场景已经保存了这个组件的 3。修改初始化器不是修改所有历史组件配置的命令。"
        },
        {
          "question": "Inspector 改字段是否保证调用同名属性的 setter？",
          "options": [
            "保证，字段和属性名字相近就会关联",
            "不保证，默认 Inspector 按序列化字段编辑",
            "只要 setter 是 public 就保证"
          ],
          "answer": 1,
          "explanation": "默认 Inspector 编辑的是序列化字段，不会保证经过同名普通属性的 setter。"
        },
        {
          "question": "运行时输入还需要验证吗？",
          "options": [
            "不需要，OnValidate 会检查一切数据来源",
            "需要，编辑器检查不能覆盖所有运行时输入",
            "只需在保存场景时检查一次"
          ],
          "answer": 1,
          "explanation": "外部存档或运行时调用可能带来编辑器没有检查过的数据，因此要在实际接收和使用前验证。"
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
        "代码初始值、场景保存值和播放中的临时值有不同来源。",
        "Inspector 按字段编辑，数据限制还需在运行时接收数据的位置检查。"
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
        "question": "speed 已在场景里保存为 3，把源码默认值从 5 改成 10，为什么仍读到 3？",
        "keyIdea": "已有组件会恢复自己保存的字段值。源码初始值提供创建时的起点，不会自动迁移历史场景里的配置。",
        "walkthrough": [
          {
            "title": "创建组件",
            "text": "新添加组件，初始值为 5；此时还没有人为改过这个实例的配置。"
          },
          {
            "title": "保存实例值",
            "text": "在 Inspector 设置为 3 并保存场景，场景现在记住的是 3。"
          },
          {
            "title": "只改源码",
            "text": "把初始化器改为 10，再运行已有场景；恢复的仍是 3，新组件才用于对照新默认值。"
          }
        ],
        "prediction": {
          "question": "只在 Speed 属性 setter 中禁止负数，能保证 Inspector 永远不能写入负数吗？",
          "answer": "不能。默认 Inspector 按序列化字段编辑，不保证经过普通属性 setter；编辑器和运行时接收数据的位置都需要相应检查。"
        }
      }
    },
    {
      "id": "l072",
      "title": "ScriptableObject：共享配置与实例状态",
      "prerequisites": [
        "l071"
      ],
      "goals": [
        "说明 ScriptableObject 的共享身份",
        "把配置与运行时状态分离",
        "用资源引用替代重复配置而不污染存档"
      ],
      "theory": [
        {
          "title": "两个角色共用配置，不等于共用当前生命",
          "paragraphs": [
            "场景里有两个同类敌人，最大生命都是100，移动速度都是三。若每个组件分别填写，以后调整时容易漏改。可以把这些设计参数放进一个 ScriptableObject 资源，让两个角色都引用它。这里共享的是同一份配置资源，并不是 Unity 自动为每个引用者复制一份。",
            "如果把 currentHealth 也放进去，角色甲受伤把它减到90，角色乙读的也会是90。因为两者指向的是同一对象。要让甲受伤、乙不变，就把最大生命放在共享模板里，而把当前生命放在各自的角色组件中。先决定哪些值应该相同，再决定放在哪里。"
          ]
        },
        {
          "title": "一步一步看模板怎样变成初始状态",
          "paragraphs": [
            "示例先检查模板是否已赋值，再从模板取得最大生命，用它初始化组件自己的 Current。两个组件各执行一次，就得到两份独立的当前生命。对甲执行 Damage 10，改变的是甲组件中的值，所以甲变为90，乙仍是100；模板最大生命也还是100。",
            "这个过程不是深复制整个角色，只是读取配置后建立必要的运行状态。若模板还有图标、材质等资源引用，是否共享要继续按实际需求决定。不要为了追求“独立”就无差别复制所有资源；也不要因为共享模板方便，就把每局会变化的所有值都塞回模板。"
          ]
        },
        {
          "title": "读一次配置和持续读配置有什么区别",
          "paragraphs": [
            "假设模板最大生命在运行期间由100改成200。若组件只在初始化时读一次，已存在角色的 Current 不会因此自动变为200；新创建角色则可能按新配置初始化。如果组件每次计算都读模板，变化又可能立即影响它。两种行为都需要代码明确实现，资源引用本身不会替你选择。",
            "因此要写清配置在什么时候生效：只影响新角色、立即影响所有角色，还是需要重建关卡。对最大生命还要决定是否同步改变当前生命。例如由100改成200时，当前90是保持90，还是按比例变180？这是使用配置的具体规则，不能从 ScriptableObject 类型名推导出来。"
          ]
        },
        {
          "title": "编辑器中的资源变化不能当作发布版存档",
          "paragraphs": [
            "在编辑器中，资源对象和资源文件的关系会让播放模式修改产生容易误判的现象。不能照搬“普通场景对象停止播放会恢复”的直觉，假定资源变化必定自动撤回。做实验时使用专门副本，停止后检查资源内容，避免在学习中意外修改正式设计数据。",
            "发布后的程序里，改变内存中的 ScriptableObject 字段也不会自动生成玩家存档。需要跨次启动保留当前生命或解锁状态，仍要把相应数据交给文件等持久化机制。保存时通常记录角色标识和必要状态，再在恢复时找到配置，不是把编辑器资源对象本体当作玩家文件。"
          ]
        },
        {
          "title": "让别人能看出角色依赖哪份模板",
          "paragraphs": [
            "把模板通过序列化字段明确放在 Inspector 中，测试者可以直接检查引用是否正确。模板缺失时给出包含对象上下文的错误，并停止依赖它的初始化，比之后在受伤方法里才出现空引用更容易定位。两个角色看似同类却数值不同，也应先比较实际引用了哪份资源。",
            "最后做一个反向实验：在副本模板里加入共享 currentHealth，让两个组件都修改它，观察互相影响。再恢复分离设计。你应能用引用图解释两次结果，而不是只记住“ScriptableObject 适合配置”这句结论。它提供资源对象，合理的数据放置仍需要你根据共享范围判断。"
          ]
        }
      ],
      "code": {
        "title": "两个脚本：配置资源与独立生命",
        "language": "csharp",
        "files": [
          {
            "filename": "CharacterDefinition.cs",
            "source": "\nusing UnityEngine;\n\n[CreateAssetMenu(menuName = \"Engine Lab/Character Definition\")]\npublic sealed class CharacterDefinition : ScriptableObject\n{\n    [SerializeField, Min(1)] private int maxHealth = 100;\n    public int MaxHealth => Mathf.Max(1, maxHealth);\n}\n\n"
          },
          {
            "filename": "CharacterHealth.cs",
            "source": "using UnityEngine;\n// 挂在两个不同对象上，引用同一份配置资源。\npublic sealed class CharacterHealth : MonoBehaviour\n{\n    [SerializeField] private CharacterDefinition definition;\n    public int Current { get; private set; }\n    private void Awake()\n    {\n        if (definition == null) { enabled = false; return; }\n        Current = definition.MaxHealth;\n    }\n    public void Damage(int amount) => Current = Mathf.Max(0, Current - Mathf.Max(0, amount));\n    [ContextMenu(\"Damage 10\")]\n    private void TestDamage() => Damage(10);\n}"
          }
        ],
        "explanation": [
          "先通过 Assets/Create/Engine Lab 创建模板资源。把角色组件分别挂到两个对象，再给它们指定同一模板。",
          "组件的 Damage 改自己的 Current，模板只提供初始配置。播放中用上下文菜单分别伤害两个角色，记录当前值和模板值。"
        ]
      },
      "lab": [
        {
          "title": "共享身份实验",
          "minutes": 60,
          "steps": [
            "用 Assets/Create 创建最大生命 100 的模板，让两个角色组件在 Inspector 引用同一资源。",
            "运行后只对第一个对象执行 Damage 10。",
            "记录第一个 Current 为 90、第二个为 100。",
            "更改模板数值并重新运行，解释读配置的时机。"
          ],
          "result": "证明模板共享但运行生命独立。"
        },
        {
          "title": "错误设计的反证",
          "minutes": 60,
          "steps": [
            "只在实验副本的模板增加 currentHealth，再让两个组件都修改它，观察共享状态怎样互相影响。",
            "观察互相影响，并画出同一资源被两处引用的图。",
            "恢复配置/状态分离，为模板缺失补充清晰日志。",
            "写出发布版保存生命时要保存的数据，不写资源对象本体。"
          ],
          "result": "能解释串改成因与存档边界。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "打一个敌人，所有敌人的生命都减少",
          "cause": "把当前生命写入了所有对象共享的 ScriptableObject。",
          "fix": "模板保留最大值，当前值放到各实例状态。"
        },
        {
          "symptom": "发布版重启后资源修改丢失",
          "cause": "误把资源内存修改当作持久化存档。",
          "fix": "设计 JSON 等存档协议和明确的保存入口。"
        }
      ],
      "exercise": {
        "brief": "做两种角色模板、三个角色实例，证明共享配置和独立伤害，并设计稳定模板标识。",
        "deliverables": [
          "两份配置资源",
          "三个实例实验记录",
          "配置与存档字段分工表"
        ],
        "rubric": [
          {
            "item": "配置复用合理",
            "points": 25
          },
          {
            "item": "当前状态相互独立",
            "points": 35
          },
          {
            "item": "缺失配置可诊断",
            "points": 20
          },
          {
            "item": "持久化边界解释清楚",
            "points": 20
          }
        ]
      },
      "quiz": [
        {
          "question": "两组件引用同一个 ScriptableObject，默认得到什么？",
          "options": [
            "共享同一资源对象",
            "自动深复制",
            "每帧复制"
          ],
          "answer": 0,
          "explanation": "两个引用默认指向同一资源对象。需要独立的变化状态时，应另外创建并保存，而不是期待引用自动深复制。"
        },
        {
          "question": "适合保存在角色模板里的字段是？",
          "options": [
            "当前受击剩余无敌时间",
            "最大生命与基础移动速度",
            "本局临时连击数"
          ],
          "answer": 1,
          "explanation": "最大生命和基础速度通常用于描述一类角色；剩余无敌时间和连击数属于某次运行的个体状态。"
        },
        {
          "question": "ScriptableObject 字段改变是否自动成为发布版存档？",
          "options": [
            "是",
            "否，需要独立持久化机制",
            "只要 public 就可以"
          ],
          "answer": 1,
          "explanation": "字段在内存里变化不等于已写入玩家存档；跨次启动恢复需要单独的保存和读取流程。"
        }
      ],
      "references": [
        {
          "label": "ScriptableObject",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ScriptableObject.html"
        },
        {
          "label": "Object.Instantiate",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.Instantiate.html"
        }
      ],
      "summary": [
        "共享模板不自动复制，当前生命等独立状态放在各角色自己身上。",
        "修改资源内存不等于写好玩家存档，跨次恢复需要独立保存流程。"
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
        "question": "两个角色引用同一模板，为什么只想伤害一个，却可能让两个都少血？",
        "keyIdea": "同一 ScriptableObject 引用指向同一对象。共享最大生命通常合理；当前生命若应独立，就要保存在各角色自己的状态里。",
        "walkthrough": [
          {
            "title": "共享不变配置",
            "text": "创建最大生命为 100 的模板资源，甲、乙两个角色都在 Inspector 明确引用同一份模板。"
          },
          {
            "title": "建立独立状态",
            "text": "甲、乙分别把 Current 初始化为 100，各自保存当前生命。"
          },
          {
            "title": "只改变甲",
            "text": "Damage 10 改甲的 Current，结果为甲 90、乙 100、模板最大生命仍为 100。"
          }
        ],
        "prediction": {
          "question": "把 Current 也移到同一个模板，甲减 10 后乙读到多少？",
          "answer": "如果乙直接读取该共享字段，它也读到 90，因为改变的是两者共同引用的那一份数据。"
        }
      }
    },
    {
      "id": "l073",
      "title": "JSON 存档：结构化数据与恢复流程",
      "prerequisites": [
        "l071",
        "l072"
      ],
      "goals": [
        "使用 JsonUtility 处理明确的数据对象",
        "在 persistentDataPath 保存并恢复实验数据",
        "解释存档结构与场景对象的映射"
      ],
      "theory": [
        {
          "title": "存档保存的是恢复所需的事实",
          "paragraphs": [
            "角色当前生命42，停掉程序后还想恢复这个值。最直接的需求是记住一个数字，以及判断它属于哪种存档。你并不需要先把整个场景、所有组件和临时动画状态都写进去。先定义一个小的数据类，把确实需要恢复的字段列出来，后面的保存流程才容易检查。",
            "这种专门传递数据的对象常叫 DTO，你可以把它理解为“只装恢复资料的表”。它没有必要继承 MonoBehaviour，也不负责自己创建角色。JsonUtility 按 Unity 支持的结构化序列化规则把这张表转成 JSON；它不是任意对象图的自动存档器，也不是通用 JSON 树查询工具。"
          ]
        },
        {
          "title": "先在内存里确认要写什么",
          "paragraphs": [
            "保存时先从当前游戏状态生成一份数据快照，再转成 JSON，最后写文件。把这几步分开，就可以在真正写盘前查看内容。例如当前 hp=42，生成的数据也应是 42；若这里已经错了，问题在状态提取，不需要先怀疑文件系统。",
            "运行时可写位置用 Application.persistentDataPath 等适合目标平台的路径。编辑器里的项目目录并不等于发布版可写目录，因此保存日志要包含实际路径。示例只写自己专用的实验文件，不扫描或覆盖其他文件。文件不存在、写入被拒绝或存储不足，都应有明确的失败提示。"
          ]
        },
        {
          "title": "读取分成解析、检查、应用三步",
          "paragraphs": [
            "加载时不要边读一个字段边改场景。先读取文本，再解析为候选数据，检查版本和数值是否合法，整份数据可以接受后才应用。假设存档里的 hp 是负数，检查阶段应拒绝；此时当前角色原本的生命不应已经被改掉。分阶段处理使失败后仍能保持原来的游戏状态。",
            "JSON 语法能解析，并不代表数据符合游戏规则。字段缺失、默认值、越界数和未知道具 ID，都需要有明确政策。尤其不要假定所有缺失字段都会按你想象的构造逻辑补齐；要根据使用的反序列化接口确认行为，并在恢复流程中显式提供需要的默认值或拒绝原因。"
          ]
        },
        {
          "title": "用两次运行证明不是缓存",
          "paragraphs": [
            "实验先保存 hp=42，再在内存里把 hp 改成九，加载后应恢复为42。这证明当前流程能从保存内容还原。接着停止播放、重新进入，再执行加载；若仍恢复42，才排除了“只是同一次运行中的变量还没清掉”这种解释。",
            "再备份文件，分别制造非法 JSON、合法 JSON 中的负数，以及文件缺失。每一种都记录加载前后 hp 和错误信息。失败时不要自动把坏文件覆盖成默认值，否则你会破坏诊断证据，也可能把仍可恢复的玩家数据抹掉。恢复默认应该是明确选择，而不是异常后的隐藏动作。"
          ]
        },
        {
          "title": "数据和场景对象之间还需要映射",
          "paragraphs": [
            "下一步若保存位置或背包，仍应保存清楚的数据：位置数值、物品标识、数量，而不是直接期望引擎对象引用跨次运行保持有效。恢复时先找到标识对应的配置或对象，再应用状态。某个物品已经从新版本移除，如何跳过或替换，也要由恢复流程决定。",
            "本课代码直接写实验文件，便于先看懂保存和读取的基本过程。它还没有解决写到一半中断、主文件替换和多版本迁移；这些问题在下一课展开。把最小示例的能力范围写清，才能既用它验证 JSON，又不把一次成功演示误当成已经完成可靠存档系统。"
          ]
        }
      ],
      "code": {
        "title": "仅供桌面实验的小型 JSON 存档",
        "language": "csharp",
        "filename": "JsonSaveProbe.cs",
        "source": "using System;\nusing System.IO;\nusing UnityEngine;\n\npublic sealed class JsonSaveProbe : MonoBehaviour\n{\n    [Serializable] private sealed class SaveData { public int version = 1; public int hp; }\n    [SerializeField] private int hp = 100;\n    private string SavePath => Path.Combine(Application.persistentDataPath, \"engine-lab-save.json\");\n    [ContextMenu(\"Save Lab Data\")]\n    private void Save()\n    {\n        try { File.WriteAllText(SavePath, JsonUtility.ToJson(new SaveData { hp = hp }, true)); }\n        catch (IOException e) { Debug.LogError(e.Message, this); }\n        catch (UnauthorizedAccessException e) { Debug.LogError(e.Message, this); }\n    }\n    [ContextMenu(\"Load Lab Data\")]\n    private void Load()\n    {\n        if (!File.Exists(SavePath)) { Debug.Log(\"No save yet\", this); return; }\n        try\n        {\n            SaveData data = JsonUtility.FromJson<SaveData>(File.ReadAllText(SavePath));\n            if (data == null || data.version != 1 || data.hp < 0 || data.hp > 100)\n                throw new ArgumentException(\"Invalid save data\");\n            hp = data.hp;\n        }\n        catch (Exception e) when (e is IOException || e is ArgumentException || e is UnauthorizedAccessException)\n        { Debug.LogError($\"Load failed: {e.Message}\", this); }\n    }\n}",
        "explanation": [
          "把组件挂在空对象上，播放中从组件菜单保存或加载。查看日志确认实际路径；示例只操作自己的 engine-lab-save.json。",
          "先验证数据内容和跨次读取。本例直接写文件，尚未实现中断恢复；临时文件、备份和迁移在下一课处理。"
        ]
      },
      "lab": [
        {
          "title": "验证跨运行恢复",
          "minutes": 60,
          "steps": [
            "播放中通过 Inspector 把 hp 设为 42，从组件菜单保存，并记录日志给出的真实文件路径。",
            "把 hp 设为 9，再加载并确认恢复为 42。",
            "停止播放后重新运行再加载，排除只是内存缓存的可能。",
            "阅读 JSON 并解释每一个字段的意义。"
          ],
          "result": "保存与恢复证据包含一次完全重启。"
        },
        {
          "title": "主动制造失败",
          "minutes": 60,
          "steps": [
            "先备份自己的实验 JSON，再故意破坏语法，从组件菜单加载并记录错误及角色原值。",
            "把 hp 改为负数并再次加载。",
            "确认失败没有半途改变当前 hp，也没有自动覆盖损坏文件。",
            "设计位置和道具标识的验证规则，但先不实现庞大的背包。"
          ],
          "result": "建立缺失、损坏、非法值三种恢复行为表。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "在编辑器能保存，发布后找不到文件",
          "cause": "把路径写死为 Assets 或依赖工作目录。",
          "fix": "从 persistentDataPath 构造路径，记录平台与应用标识。"
        },
        {
          "symptom": "JSON 能解析但角色状态异常",
          "cause": "只做语法解析，没验证数值范围和对象映射。",
          "fix": "解析到候选 DTO，验证后再应用。"
        }
      ],
      "exercise": {
        "brief": "把存档扩展为版本、位置和生命，拒绝非法浮点数，保留加载前状态直到全部验证通过。",
        "deliverables": [
          "存档 DTO 与验证函数",
          "一次重启恢复记录",
          "三个失败样本及处理结果"
        ],
        "rubric": [
          {
            "item": "数据与场景对象分离",
            "points": 25
          },
          {
            "item": "重启恢复可靠",
            "points": 30
          },
          {
            "item": "非法输入不部分应用",
            "points": 30
          },
          {
            "item": "路径与失败可诊断",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "最适合先序列化什么？",
          "options": [
            "整个场景的任意对象图",
            "只包含恢复必需事实的 DTO",
            "所有静态字段"
          ],
          "answer": 1,
          "explanation": "先保存恢复必需的数据，才能逐字段验证含义。DTO 是专门装这些数据的对象，而不是整个场景的替身。"
        },
        {
          "question": "JsonUtility 能否据此当作任意 JSON 树查询器？",
          "options": [
            "能",
            "不能，它遵循结构化序列化规则",
            "只有编辑器不能"
          ],
          "answer": 1,
          "explanation": "JsonUtility 根据预先定义的数据结构工作。任意 JSON 节点查询需要符合该需求的其他表示或工具。"
        },
        {
          "question": "读取成功之后应该立即逐字段修改场景吗？",
          "options": [
            "应该，越快越好",
            "先验证整份候选数据再应用",
            "先删除旧存档"
          ],
          "answer": 1,
          "explanation": "整份候选通过检查后再应用，可避免前几个字段已改、后一个字段出错的半恢复状态。"
        }
      ],
      "references": [
        {
          "label": "JsonUtility",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/JsonUtility.html"
        },
        {
          "label": "Application.persistentDataPath",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-persistentDataPath.html"
        }
      ],
      "summary": [
        "先保存恢复必需的数据，再把它们映射回角色和场景。",
        "加载先解析和验证整份候选，通过后才改变当前状态。"
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
        "question": "保存 hp=42 后把角色改成 9，怎样证明重新加载的 42 真来自文件？",
        "keyIdea": "保存和恢复应分步检查，且至少跨一次完整运行。加载先形成候选数据，验证通过后再改变角色。",
        "walkthrough": [
          {
            "title": "生成快照",
            "text": "从角色提取 hp=42，转为 JSON，写到日志显示的持久化路径。"
          },
          {
            "title": "在同次运行对照",
            "text": "在同一次运行中把角色生命改为 9，再执行加载；先验证候选数据合法，再应用并确认恢复为 42。"
          },
          {
            "title": "重新启动验证",
            "text": "停止再播放，执行加载并检查仍为 42，同时查看实际文件内容。"
          }
        ],
        "prediction": {
          "question": "把文件里的 hp 改成 -10，是否应先赋给角色再报错？",
          "answer": "不应。先验证候选数据，确认整份可以接受再应用。拒绝加载时应保留当前角色状态和原文件证据。"
        }
      }
    },
    {
      "id": "l074",
      "title": "版本迁移、备份与存档事务",
      "prerequisites": [
        "l073"
      ],
      "goals": [
        "设计可重复的版本迁移",
        "解释临时文件与备份的作用",
        "用故障注入评估保存流程"
      ],
      "theory": [
        {
          "title": "为什么一个改名也需要迁移",
          "paragraphs": [
            "第一版存档用 coins 表示货币，第二版把字段改成 currency。旧玩家的文件里只有 coins=12，新程序若只读 currency，可能把这12枚当成零。代码编译通过并不能证明旧数据还能理解，因此文件里需要记录数据结构版本，加载时按版本选择转换过程。",
            "这里的版本号记录的是存档格式，不必跟宣传版本或补丁号同步。只有保存含义或结构发生变化时，才需要相应更新。先为每版写出具体字段和含义，再决定怎样转换。不要遇到解析失败就把版本号改小；数字变了，文件中的实际结构并不会跟着改变。"
          ]
        },
        {
          "title": "把迁移看成可检查的数据转换",
          "paragraphs": [
            "本课例子把 v1 的 coins=12 转成 v2 的 currency=12，而原本 v2 的 currency=20 仍保持20。迁移输出使用新格式，输入对象不被随手修改。这样可以保存原始样本，逐项比较转换前后，也便于在测试中重复执行，不依赖场景里是否有角色或商店。",
            "再把已经迁移的输出送入流程，结果不应又多12枚货币。迁移负责解释旧数据，不负责给玩家发奖励或创建敌人。若转换中夹带这些副作用，重试就可能重复发放。未知的未来版本也应拒绝并保护原文件，因为旧程序没有足够信息保证理解它。"
          ]
        },
        {
          "title": "一次保存什么时候才算提交成功",
          "paragraphs": [
            "直接覆盖主文件，若写到一半程序中断，就可能留下不完整文本。更谨慎的桌面原型会先生成快照、写到临时文件、检查内容，再按目标平台支持的方式替换主文件，并按策略保留备份。这些步骤的目的，是减少“旧文件已坏，新文件又没完整产生”的窗口。",
            "但临时扩展名不是可靠性的魔法。替换是否原子、数据是否真正落到存储设备、断电后会怎样，都依赖文件系统和平台实现。一次替换不被观察为半个文件，与断电后必定保留新数据，是不同保证。教材中的流程需要在目标设备上验证，不能直接宣称所有平台都不会丢档。"
          ]
        },
        {
          "title": "故意失败，才能知道恢复顺序是否完整",
          "paragraphs": [
            "在实验目录里为各阶段加入可控失败：临时文件刚创建、写完但未校验、替换前、替换后。每次中断后重新运行，检查主文件和备份各自是否可读。然后明确恢复优先级，例如先尝试有效主文件，再尝试有效备份；不要只根据文件存在就认定它可用。",
            "显示“保存成功”的时机也要和实现一致。刚把任务加入队列，不代表已经完成写入。若磁盘失败，界面应让用户知道状态尚未保存，并保留可重试的数据。自动保存频率则要在损失范围和写入开销之间选择，不宜在每一帧都重写整个存档。"
          ]
        },
        {
          "title": "校验能发现损坏，却不是安全防护",
          "paragraphs": [
            "为文件增加校验值，可以帮助发现传输或存储中是否发生意外变化。但如果修改者能同时更改文件和校验值，它通常无法证明内容没有被恶意篡改。把“检测意外损坏”和“防止作弊”分开，才能选对实现，也避免向玩家或团队给出过大的保证。",
            "最终交付一张清楚的状态表：每个阶段成功留下什么，失败后从哪里恢复，哪个时刻允许向用户报告成功。再保存几份真实的旧版本样本，作为以后修改后的回归资料。可靠存档来自对每个失败点的处理，不是只在正常路径上多写一个 try/catch。"
          ]
        }
      ],
      "code": {
        "title": "纯数据迁移：可重复、可测试",
        "language": "csharp",
        "filename": "SaveMigration.cs",
        "source": "using System;\n\n[Serializable]\npublic sealed class VersionedSave\n{\n    public int version = 1;\n    public int coins;\n    public int currency;\n}\n\npublic static class SaveMigration\n{\n    public static VersionedSave ToCurrent(VersionedSave input)\n    {\n        if (input == null || input.version < 1 || input.version > 2)\n            throw new ArgumentException(\"Unsupported save version\");\n        int value = input.version == 1 ? input.coins : input.currency;\n        if (value < 0) throw new ArgumentException(\"Negative currency\");\n        return new VersionedSave { version = 2, currency = value, coins = 0 };\n    }\n}",
        "explanation": [
          "这是普通 C# 数据工具，不挂到对象上。在上一课解析出候选数据后调用，再验证迁移结果。",
          "函数不发奖励、不创建场景对象、不写文件，也不改变输入对象。文件替换和备份由另一个明确步骤处理。"
        ]
      },
      "lab": [
        {
          "title": "旧数据与未来数据",
          "minutes": 60,
          "steps": [
            "在数据测试中分别准备 version=1、coins=12 与 version=2、currency=20 的候选对象。",
            "调用迁移，比较输出均为 v2，分别保留 12 和 20。",
            "对已迁移输出再次迁移，确认没有新增货币。",
            "输入未来版本 99，确认拒绝且不覆盖原文件。"
          ],
          "result": "得到迁移输入输出表与重复执行证据。"
        },
        {
          "title": "纸面事务与故障注入",
          "minutes": 60,
          "steps": [
            "在纸上画出从生成快照到替换主文件的各步骤，为每步标出成功后保留的文件。",
            "在实验目录使用自己的文件实现桌面原型，先明确平台限制。",
            "在每阶段主动抛出异常，重启后观察主文件与备份。",
            "写出恢复优先级以及何时显示保存成功。"
          ],
          "result": "每个失败点都有确定的恢复路径。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "每次加载旧档都重复发补偿",
          "cause": "迁移把一次性业务副作用放进了可重复转换。",
          "fix": "将纯数据升级与受控、可记录的补偿流程分开。"
        },
        {
          "symptom": "出错后主档和备份都坏了",
          "cause": "备份时机或覆盖顺序没有事务边界。",
          "fix": "先验证候选，保留最后已知良好数据，再按平台支持的提交方式替换。"
        }
      ],
      "exercise": {
        "brief": "设计含三版本的存档协议和五个中断点的恢复测试，不把平台未保证的原子性写成绝对承诺。",
        "deliverables": [
          "版本迁移图",
          "故障点与恢复表",
          "保存成功判定规则"
        ],
        "rubric": [
          {
            "item": "迁移无重复副作用",
            "points": 30
          },
          {
            "item": "未知版本保护合理",
            "points": 20
          },
          {
            "item": "五个故障点均可恢复",
            "points": 35
          },
          {
            "item": "平台保证边界明确",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "未知未来版本应怎样处理？",
          "options": [
            "按当前版本硬读并覆盖",
            "保护原文件并报告不兼容",
            "把版本号直接改小"
          ],
          "answer": 1,
          "explanation": "旧程序不能保证理解未来结构。保留原文件，才能让兼容它的版本或恢复工具继续处理。"
        },
        {
          "question": "临时文件方案保证所有平台断电不丢数据吗？",
          "options": [
            "保证",
            "不保证，需结合文件系统和平台语义",
            "只要扩展名是 tmp 就保证"
          ],
          "answer": 1,
          "explanation": "临时文件能减少部分覆盖风险，但原子替换、落盘和断电恢复依赖目标平台，必须分别验证。"
        },
        {
          "question": "迁移最易测试的形式是？",
          "options": [
            "纯数据输入到数据输出",
            "边迁移边生成敌人",
            "依赖当前场景顺序"
          ],
          "answer": 0,
          "explanation": "纯数据输入输出方便固定样本、重复转换和比较结果；场景生成等副作用会使重试难以保证。"
        }
      ],
      "references": [
        {
          "label": "JsonUtility.FromJson",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/JsonUtility.FromJson.html"
        },
        {
          "label": "Application.persistentDataPath",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-persistentDataPath.html"
        }
      ],
      "summary": [
        "迁移只转换数据含义，不在重试中重复发奖或创建对象。",
        "保存要明确成功时刻和失败恢复，未知版本先保护原文件。"
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
        "question": "旧档只有 coins=12，新版改用 currency，怎样避免重试迁移时重复增加货币？",
        "keyIdea": "迁移应把旧表示转换为新表示，结果可重复检查。它不负责发奖励或改变场景，提交文件是另外一个步骤。",
        "walkthrough": [
          {
            "title": "识别旧格式",
            "text": "确认输入为 v1，读取 coins=12，不直接修改正在使用的角色。"
          },
          {
            "title": "构造新数据",
            "text": "根据 v1 候选构造一份新数据：版本为 v2、currency=12，原始输入保留，再检查输出范围是否合法。"
          },
          {
            "title": "再次执行检查",
            "text": "把 v2 输出重新送入流程，应仍为 currency=12，而不是累加成 24。"
          }
        ],
        "prediction": {
          "question": "读到 version=99，能把版本号改成 2 后覆盖吗？",
          "answer": "不能。当前程序不知道未来格式的含义，应保护原文件并报告不兼容；改数字并不能完成数据转换。"
        }
      }
    },
    {
      "id": "l075",
      "title": "多态、托管引用与自定义序列化",
      "prerequisites": [
        "l071",
        "l074"
      ],
      "goals": [
        "判断是否需要 SerializeReference",
        "解释序列化回调的线程限制",
        "用可序列化表示恢复运行结构"
      ],
      "theory": [
        {
          "title": "为什么列表存得下来，字典却需要另一种表示",
          "paragraphs": [
            "你希望在 Inspector 配置 speed、damage 等参数，运行时又想按键名快速查找。可以把一组可序列化条目作为保存来源，再由条目建立 Dictionary 索引。文件负责保存编辑者填的内容，字典负责方便运行时查询；两者不是两份都能任意修改的独立数据。",
            "若列表里 speed=3，而字典被另一段代码改成五，就必须回答保存时以谁为准。本课明确以条目列表为来源，字典是可以重建的查询缓存。先确定谁决定真实内容，再讨论转换方法，能避免为了“支持序列化”而制造长期不同步的两套数值。"
          ]
        },
        {
          "title": "序列化回调用来转换表示",
          "paragraphs": [
            "ISerializationCallbackReceiver 提供序列化前后参与处理的入口。你可以在合适的回调里把可保存条目转换为运行结构，而不是要求 Unity 直接保存不支持的容器。示例恢复后重建索引，只操作自己拥有的普通数据；查询未知键时返回 false，让调用者决定默认值或报错。",
            "重复键也需要明确规则。示例采用后面的条目覆盖前面的值，因此两个 speed 条目按列表顺序决定结果。实际项目也可以拒绝重复并显示问题。重要的是把政策写出来并测试，而不是依赖某次运行碰巧保留了一个值。修改列表后何时重建，也应有清楚的调用位置。"
          ]
        },
        {
          "title": "基础类型字段为什么不总能保存派生类型",
          "paragraphs": [
            "设想一个规则字段声明为基础 Rule，实际装的是伤害规则或治疗规则。普通内联序列化把符合规则的数据按值保存，并不自动满足所有多态和共享引用需求。若你确实需要保存托管派生类型、空值或同一宿主内的引用关系，就需要研究 SerializeReference 的适用范围。",
            "SerializeReference 处理的是托管对象的引用表示，不是给任意场景对象做存档的开关。UnityEngine.Object 派生资源本来有自己的引用方式；需要跨多个宿主共享配置时，ScriptableObject 可能更适合。先画出谁引用谁、哪些对象需要共享身份，再选择最简单、符合保存范围的方式。"
          ]
        },
        {
          "title": "恢复数据不等于场景已经可以操作",
          "paragraphs": [
            "序列化相关回调可能不在 Unity 主线程上执行，也可能在你没有预期的编辑器处理过程中出现。因此不能在这里随意 Instantiate、查找场景角色或驱动动画。回调尽量只完成必要的数据转换，把依赖场景的工作留给适合的运行阶段。",
            "例如建立字符串到数值的字典，只需要已有条目；根据这些数值创建敌人，则需要场景和其他组件都已准备好。这是两个不同步骤。即使字典已经恢复，也不能据此推断所有引用对象的 Awake 或 Start 都已完成。把缓存建立和场景初始化分开，处理顺序更容易预测。"
          ]
        },
        {
          "title": "类型变动后，要回看历史资源",
          "paragraphs": [
            "托管引用保存了与类型有关的信息，因此类名、命名空间或程序集改变，可能影响旧数据能否正确恢复。字段能够在当前编译器里使用，并不能证明旧资源已自动迁移。重构之前保留代表性历史资源，修改后重新加载并检查实际类型、字段和缺失信息。",
            "本课最后比较三种方案：条目按值保存、共享 ScriptableObject、宿主内的 SerializeReference。它们分别适合不同的身份和编辑需求，没有一项总是最先进。你应能为眼前的一种规则说明为什么选择它、如何恢复、在哪里建立缓存，以及类型变化后要用哪些旧样本回归。"
          ]
        }
      ],
      "code": {
        "title": "列表是保存源，字典是派生索引",
        "language": "csharp",
        "filename": "StatTable.cs",
        "source": "using System;\nusing System.Collections.Generic;\nusing UnityEngine;\n\n[CreateAssetMenu(menuName = \"Engine Lab/Stat Table\")]\npublic sealed class StatTable : ScriptableObject, ISerializationCallbackReceiver\n{\n    [Serializable] private struct Entry { public string key; public float value; }\n    [SerializeField] private List<Entry> entries = new List<Entry>();\n    private Dictionary<string, float> lookup = new Dictionary<string, float>();\n    private void Rebuild()\n    {\n        lookup.Clear();\n        foreach (Entry item in entries)\n            if (!string.IsNullOrEmpty(item.key)) lookup[item.key] = item.value;\n    }\n    public bool TryGet(string key, out float value) => lookup.TryGetValue(key, out value);\n    public void OnBeforeSerialize() { }\n    public void OnAfterDeserialize() => Rebuild();\n    private void OnEnable() => Rebuild();\n}",
        "explanation": [
          "创建资源后在 Inspector 添加条目，再用读取脚本调用 TryGet。重复键按后项覆盖，实际需求也可改为拒绝重复。",
          "回调只转换自有数据，不操作场景。按示例声明的重新启用或加载时机验证修改后的查询结果，不假定列表改动会自动通知所有缓存。"
        ]
      },
      "lab": [
        {
          "title": "恢复字典索引",
          "minutes": 60,
          "steps": [
            "在资源 Inspector 添加 speed 和 damage 两条参数，保存资源后记录各自数值。",
            "重新加载项目或资源，通过小型读取脚本调用 TryGet。",
            "加入重复 speed，验证后者覆盖策略并记录。",
            "增加未知键读取，确认由调用者处理 false。"
          ],
          "result": "序列化源和派生缓存的职责清晰。"
        },
        {
          "title": "判断托管引用必要性",
          "minutes": 60,
          "steps": [
            "为一个 Rule 基类字段画出伤害、治疗两种派生数据，说明是否需要共享同一对象。",
            "列出普通内联、ScriptableObject 资源、SerializeReference 三种表示的身份边界。",
            "在独立实验类中保存派生类型并重新加载，观察是否保留。",
            "设计类型改名时的历史资源回归检查清单。"
          ],
          "result": "能够为一种具体需求选择最简单的表示。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "字典重新打开项目后为空",
          "cause": "把运行索引误当作直接可保存数据，或未执行重建。",
          "fix": "保存受支持的条目列表，并在数据恢复后重建索引。"
        },
        {
          "symptom": "反序列化时报主线程相关错误",
          "cause": "在回调里调用场景或资源 API。",
          "fix": "回调仅转换自有数据，场景绑定移到主线程生命周期入口。"
        }
      ],
      "exercise": {
        "brief": "实现一个拒绝重复键的只读属性表，并提出需要多态的规则数据方案与重构回归测试。",
        "deliverables": [
          "属性表与重复键规则",
          "三种表示的比较说明",
          "历史资源回归样本"
        ],
        "rubric": [
          {
            "item": "保存源唯一且可恢复",
            "points": 30
          },
          {
            "item": "重复与缺失键有约定",
            "points": 25
          },
          {
            "item": "线程边界正确",
            "points": 25
          },
          {
            "item": "类型演进风险可验证",
            "points": 20
          }
        ]
      },
      "quiz": [
        {
          "question": "SerializeReference 最直接解决哪类需求？",
          "options": [
            "保存托管对象的多态及引用表示",
            "让所有 Dictionary 自动显示在 Inspector",
            "把任意场景层级自动转换成存档"
          ],
          "answer": 0,
          "explanation": "它用于符合条件的托管对象多态与引用表示，不能因此推导它会自动保存任意场景对象。"
        },
        {
          "question": "序列化回调里能否随意 Instantiate GameObject？",
          "options": [
            "能，只要对象最终会在场景里使用",
            "不应，回调可能不在主线程",
            "只要先检查 Application.isPlaying 就保证可以"
          ],
          "answer": 1,
          "explanation": "相关回调可能不在主线程；Instantiate 等场景操作不应随意放进去。"
        },
        {
          "question": "列表和字典都能被外部独立修改时，首要问题是？",
          "options": [
            "先减少字典条目数量",
            "先解决两份数据谁为准、怎样同步",
            "先把列表和字典都标成 public"
          ],
          "answer": 1,
          "explanation": "两份数据都能独立改变，就必须解决保存和读取以谁为准。先确定来源，另一份作为可以重建的缓存。"
        }
      ],
      "references": [
        {
          "label": "SerializeReference",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SerializeReference.html"
        },
        {
          "label": "ISerializationCallbackReceiver",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ISerializationCallbackReceiver.html"
        }
      ],
      "summary": [
        "条目列表作为保存来源，字典等运行索引按明确时机重建。",
        "序列化回调只做合适的数据工作，托管引用的身份范围要单独判断。"
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
        "question": "Inspector 保存参数列表，运行时却用字典，哪一份才应该决定真实数值？",
        "keyIdea": "先选定要保存的来源，再把另一种结构当作可重建的查询工具。序列化回调负责数据转换，场景操作留到合适的运行阶段。",
        "walkthrough": [
          {
            "title": "配置条目",
            "text": "列表中放 speed=3、damage=10，它们是保存来源。"
          },
          {
            "title": "重建查询结构",
            "text": "恢复条目后建立字典；TryGet(speed) 得到 3，未知键返回 false。"
          },
          {
            "title": "明确冲突政策",
            "text": "再加入 speed=5，本例让后项覆盖，因此结果为 5；把这个规则写入测试。"
          }
        ],
        "prediction": {
          "question": "能在反序列化回调里顺便创建角色吗？",
          "answer": "不应这样做。回调可能不在主线程，场景也未必准备好；先转换自有数据，再在适合的运行阶段创建对象。"
        }
      }
    }
  ]
});
