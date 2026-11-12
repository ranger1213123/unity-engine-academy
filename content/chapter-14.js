window.COURSE_MODULES.push({
  "id": "m14",
  "number": 14,
  "title": "场景与资源生命周期",
  "subtitle": "追踪谁创建、谁持有、谁负责释放",
  "description": "以容器、引用和所有权理解场景加载、异步激活、跨场景服务、资源释放与对象池，避免切场景后出现悬空引用和常驻内存。",
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
      "id": "l066",
      "title": "场景容器、活动场景与叠加加载",
      "prerequisites": [
        "l015",
        "l065"
      ],
      "goals": [
        "区分已加载场景、活动场景与对象所属场景",
        "用 Additive 加载和卸载一个内容场景",
        "解释销毁场景对象与释放共享素材的边界"
      ],
      "theory": [
        {
          "title": "先分清“加载了谁”和“谁是活动场景”",
          "paragraphs": [
            "假设游戏启动时只有 Bootstrap 场景，其中放着摄像机和加载脚本。随后用 Additive 方式加载 Content，里面只有地面和角色。加载完成后，两个场景的对象会同时存在：摄像机仍工作，角色也能显示。Additive 的意思是把一个场景加入当前已加载的场景集合，而不是让原场景立刻退出。",
            "这时还有一个容易漏看的状态：活动场景。它是 Unity 在若干操作中使用的默认场景，例如普通 new GameObject 创建的新对象归到哪里。最后加载的场景不一定自动成为活动场景。因此“Content 已加载”和“Content 是活动场景”必须分别检查，不能用画面上是否出现角色来代替。"
          ]
        },
        {
          "title": "沿着示例追踪一个新对象",
          "paragraphs": [
            "示例等到 Content 加载完成后，取得表示它的 Scene，再调用 SetActiveScene(content)。Scene 在这里相当于指向已加载场景的标识，不能拿它当成一个可以挂组件的 GameObject。接着执行 new GameObject 创建 marker，marker 默认进入此时的活动场景 Content。在 Hierarchy 展开场景分组，就能直接核对归属。场景分组管理对象的去留，不是画面中的一块地理区域：marker 即使没有图像、位置也不在角色旁边，仍属于 Content。",
            "接着只注释 SetActiveScene 那一行，其他条件保持不变。Bootstrap 仍是活动场景，新建 marker 就归到 Bootstrap。两次运行都能看到 Content 的地面，但 marker 的退出时机不同。这组对照解释了为什么调试场景加载时，既要看场景列表，也要记录每个关键对象的 scene。"
          ]
        },
        {
          "title": "卸载场景时，先判断对象归属",
          "paragraphs": [
            "当 UnloadSceneAsync(Content) 完成，Content 中的普通场景对象被卸载。第一种运行里的 marker 属于 Content，因此也随之销毁；第二种运行里的 marker 属于 Bootstrap，因此仍保留。这里决定结果的是对象归属，而不是哪个脚本创建它、对象位于屏幕哪里，或者名字里是否写着 Content。",
            "如果 Bootstrap 的服务字段还指向被卸载角色，字段不会自动变成一个新角色。使用引用前可以检查 Unity 的空值状态，但更完整的做法是在关卡退出时取消注册、清除目标，在新关卡进入时重新建立引用。这样服务记录的角色才和当前关卡一致。"
          ]
        },
        {
          "title": "对象不在了，不等于所有资源都回收了",
          "paragraphs": [
            "角色实例销毁后，它引用的纹理可能仍被另一个场景中的角色使用。两个角色共享一张纹理，就像两处显示同一个资源；退出一处不会要求另一处也丢掉它。因此场景卸载完成，只能证明这一场景的实例退出，不能据此宣称全部纹理内存归零，也不能推断托管垃圾已经完成回收。",
            "本课先观察可直接验证的量：已加载场景数、活动场景名、marker 的归属和卸载后的对象状态。资源是否仍被持有，要到后续内存实验里查看引用关系。把这些问题拆开，能避免看到任务管理器数字没下降，就误认为场景根本没有卸载。"
          ]
        },
        {
          "title": "让实验在独立构建中也成立",
          "paragraphs": [
            "编辑器里能打开某个场景，不代表构建后的程序一定可以按名字加载它。实验前要保存 Bootstrap、Content，并把它们加入当前 Build Profile 使用的场景列表。名字必须能明确指向目标；重复名字或拼写错误会让加载结果难以判断。Content 不再重复放摄像机和音频监听器，便于隔离本课变量。",
            "最终记录应写出完整过程：从哪个场景启动、采用哪种加载方式、何时切换活动场景、在哪里创建对象、最后卸载谁。再做一次独立 Player 验证。别人只要照着这份记录操作，就应能预测同样的对象去留；这比一张“成功加载”的截图说明了更多引擎行为。"
          ]
        }
      ],
      "code": {
        "title": "观察叠加场景与新对象的归属",
        "language": "csharp",
        "filename": "AdditiveSceneProbe.cs",
        "source": "using System.Collections;\nusing UnityEngine;\nusing UnityEngine.SceneManagement;\n\n// 挂在 Bootstrap 根对象。创建 Content 场景并加入当前 Build Profile 场景列表。\npublic sealed class AdditiveSceneProbe : MonoBehaviour\n{\n    [SerializeField] private string contentScene = \"Content\";\n    private IEnumerator Start()\n    {\n        Scene original = gameObject.scene;\n        yield return SceneManager.LoadSceneAsync(contentScene, LoadSceneMode.Additive);\n        Scene content = SceneManager.GetSceneByName(contentScene);\n        if (!content.IsValid() || !content.isLoaded) yield break;\n        SceneManager.SetActiveScene(content);\n        GameObject marker = new GameObject(\"OwnedByContent\");\n        Debug.Log($\"active={SceneManager.GetActiveScene().name}; owner={marker.scene.name}\");\n        yield return new WaitForSecondsRealtime(3f);\n        SceneManager.SetActiveScene(original);\n        yield return SceneManager.UnloadSceneAsync(content);\n        Debug.Log($\"Content unloaded; marker == null: {marker == null}\");\n    }\n}",
        "explanation": [
          "两个场景必须都已保存并加入当前 Build Profile。Content 使用唯一场景名，且没有重复摄像机或监听器。脚本所属 Bootstrap 会保留，因而可以继续等待卸载操作。",
          "此例通过三秒实时等待便于观察；正式流程应由明确的内容退出条件驱动。销毁 marker 不表示它曾引用的所有资源也已立即释放。"
        ]
      },
      "lab": [
        {
          "title": "建立容器与活动场景对照",
          "minutes": 60,
          "steps": [
            "创建 Bootstrap 和 Content；后者放两个空对象，不放摄像机。保存并加入当前 Build Profile 的场景列表。",
            "在 Bootstrap 根对象挂示例，先预测运行后的 loaded 场景数、active 场景名和 marker 所属场景。",
            "运行，暂停在三秒等待期间；对照 Hierarchy 的场景分组与日志，记录 marker 所属 Content。",
            "注释 SetActiveScene(content) 一行重测；解释 marker 为什么改变归属，以及卸载后是否保留。"
          ],
          "result": "叠加加载不会自动切换 active scene；默认新建对象的归属随活动场景改变。"
        },
        {
          "title": "证明实例卸载与引用清理的差别",
          "minutes": 60,
          "steps": [
            "在 Bootstrap 中增加一个 Inspector 引用，运行中把 Content 对象赋给它，等待卸载。",
            "记录卸载后引用的显示和引擎 null 判断；避免继续读已销毁对象的属性。",
            "把 Content 设为未加入构建列表或故意写错唯一名字，保存错误日志，再修复。",
            "制作一次小型独立构建，复测加载流程并归档场景列表、日志和解释。"
          ],
          "result": "场景对象失效和资源回收是不同观察量；构建配置也是运行时加载的前提。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "卸载关卡后新生成对象仍留在 Hierarchy",
          "cause": "对象被创建在仍常驻的活动场景中。",
          "fix": "记录实例的 scene.name；在创建前设置活动场景，或对根对象显式 MoveGameObjectToScene。"
        },
        {
          "symptom": "编辑器能打开场景，构建后名字加载失败",
          "cause": "场景未加入当前构建配置，或名字重复导致定位错误。",
          "fix": "检查 Build Profiles 的有效场景列表，改用唯一场景名/完整路径并在构建中验证。"
        }
      ],
      "exercise": {
        "brief": "搭建 Bootstrap 加两个可交替加载的内容场景；每个场景退出后，归它所有的运行实例必须清空，常驻 UI 必须撤销对角色的引用。",
        "deliverables": [
          "加载/活动/所属场景的状态表",
          "连续切换十次的根对象数量和引用日志",
          "一次编辑器与构建行为对照"
        ],
        "rubric": [
          {
            "item": "能准确区分三种场景状态",
            "points": 25
          },
          {
            "item": "创建对象归属明确，退出无遗留",
            "points": 30
          },
          {
            "item": "跨场景引用有注册与撤销流程",
            "points": 25
          },
          {
            "item": "构建中复现并保存证据",
            "points": 20
          }
        ]
      },
      "quiz": [
        {
          "question": "Additive 加载 Content 后立即 new GameObject，能否保证新对象属于 Content？",
          "options": [
            "能，最后加载的场景会自动成为活动场景",
            "不能，还要检查活动场景",
            "能，调用加载的脚本决定所有新对象归属",
            "不能，新对象要等保存场景后才有归属"
          ],
          "answer": 1,
          "explanation": "Additive 改变已加载场景集合，却不自动保证 Content 成为活动场景。先查活动场景，才能判断普通新建对象的默认归属。"
        },
        {
          "question": "UnloadSceneAsync 完成能直接证明什么？",
          "options": [
            "所有纹理都已释放",
            "所有托管垃圾都已回收",
            "目标场景对象已被卸载",
            "其他已加载场景也停止运行"
          ],
          "answer": 2,
          "explanation": "完成的是目标场景的卸载。纹理可能仍由别的对象共享，托管垃圾回收也有自己的时机。"
        },
        {
          "question": "常驻服务仍持有已卸载角色引用，最完整的改进是什么？",
          "options": [
            "每帧查找同名对象，忽略登记过程",
            "依赖各对象 OnDestroy 的先后顺序",
            "捕获异常后继续保留旧引用",
            "在关卡进入时登记角色，退出时撤销登记"
          ],
          "answer": 3,
          "explanation": "让角色在进入时登记、退出时撤销，服务就不会一直把旧关卡角色当成当前角色。使用前检查状态仍然必要。"
        }
      ],
      "references": [
        {
          "label": "SceneManager.LoadSceneAsync",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.SceneManager.LoadSceneAsync.html"
        },
        {
          "label": "SceneManager.SetActiveScene",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.SceneManager.SetActiveScene.html"
        },
        {
          "label": "SceneManager.UnloadSceneAsync",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.SceneManager.UnloadSceneAsync.html"
        }
      ],
      "summary": [
        "已加载场景和活动场景是不同状态；新对象的默认归属取决于活动场景。",
        "退出关卡时，要结束常驻服务与旧角色的联系。"
      ],
      "teaching": {
        "question": "Content 已叠加加载，为什么新建的 marker 仍可能在卸载 Content 后留下？",
        "keyIdea": "加载场景和切换活动场景是两次不同操作。普通新建对象默认进入活动场景，卸载时则按对象实际所属场景处理。",
        "walkthrough": [
          {
            "title": "初始状态",
            "text": "只有 Bootstrap 已加载，它也是活动场景；摄像机和加载脚本都在这里。"
          },
          {
            "title": "改变默认归属",
            "text": "叠加加载 Content 后显式设它为活动场景，再创建 marker；marker 归到 Content。"
          },
          {
            "title": "执行卸载",
            "text": "卸载 Content，marker 随场景对象一起销毁。摄像机仍留在 Bootstrap。"
          }
        ],
        "prediction": {
          "question": "如果不调用 SetActiveScene，marker 会怎样？",
          "answer": "在本实验没有其他代码切换活动场景的前提下，活动场景仍是 Bootstrap，marker 也归它，因此卸载 Content 不会销毁 marker。"
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
      "id": "l067",
      "title": "异步加载、激活门与进度的真实含义",
      "prerequisites": [
        "l023",
        "l066"
      ],
      "goals": [
        "解释 allowSceneActivation=false 时的 0.9 平台",
        "避免用 isDone 等待一个尚未打开的激活门",
        "用独立状态表达加载、待确认、激活与可交互"
      ],
      "theory": [
        {
          "title": "加载条显示的不是“可以玩”的比例",
          "paragraphs": [
            "玩家点击进入关卡后，你希望先显示加载画面，等玩家确认再出现角色。LoadSceneAsync 返回的 AsyncOperation 可以帮助观察这个过程，但 progress 并不是整个“进入游戏”流程的完成比例。载入场景、允许场景激活，以及你自己恢复存档角色，是不同阶段；这个数值不会自动把后三者合并成一个统一百分比。",
            "先把流程写成容易理解的几个状态：开始加载、等待激活、正在激活、完成后初始化、允许交互。每个状态都要有一个能检查的进入条件。例如玩家按下确认按钮只负责开放激活，不代表存档已经应用。这样加载界面才知道自己应该显示什么，也不会把一次进度变化解释得过多。"
          ]
        },
        {
          "title": "为什么会停在0.9",
          "paragraphs": [
            "当 allowSceneActivation 设为 false，场景加载会在激活前等待。官方说明此时进度可以停在0.9，isDone 仍为 false。把它想成“材料已经准备到可以进入下一阶段，但门还没打开”，有助于理解这两个数值；这个比喻只解释等待关系，不说明内部每一步占多少时间。",
            "错误写法是先等待 isDone，再设置 allowSceneActivation=true。因为完成需要激活，而激活又被代码关着，两边便互相等待。正确顺序是观察已到等待激活阶段，检查一个独立条件，例如上下文菜单确认，然后打开激活，最后再等待 isDone。"
          ]
        },
        {
          "title": "沿着一次手动激活看执行顺序",
          "paragraphs": [
            "本课使用 Additive 加载，目的是让 Bootstrap 中的观察脚本继续存在。脚本输出 Ready 后，先不要操作，记录 progress 和 isDone。再从组件上下文菜单选择 Allow Activation。你应该把开放门、引擎操作完成、新场景脚本初始化和可以交互分别记在笔记里，不把它们压成一个“加载结束”。",
            "有些加载界面会把原始 progress 除以 0.9：原始值 0.45 显示为 50%，原始值 0.9 显示为 100%。这只是把“激活前的准备阶段”映射到一条完整进度条，并没有改变 isDone，更不能说明剩余时间是零。若还要等玩家确认，界面应写“准备就绪，等待确认”；若激活后还有初始化，则显示另一个明确阶段。分阶段反馈比让一个失真的百分比缓慢上涨更容易理解。"
          ]
        },
        {
          "title": "观察流程停了，加载操作不一定停",
          "paragraphs": [
            "协程负责等待和执行你的代码，AsyncOperation 代表引擎正在进行的操作。停掉协程，只能确定这段观察流程不会继续往下执行，不能据此推断引擎加载已取消。使用 Single 加载时，旧场景脚本可能随场景退出；看不到它后面的日志，也不自动意味着新场景没有成功加载。",
            "示例在 OnDisable 中处理尚未开放的激活门，是为了避免遗留一个一直关着的门，并不是取消加载。正式项目通常让稳定存在的加载管理对象保存当前操作、目标场景和请求状态。重复请求如何处理、管理对象何时退出，都要写清，不能靠某段协程恰好活着维持。"
          ]
        },
        {
          "title": "异步也可能在最后一刻卡顿",
          "paragraphs": [
            "异步加载能把部分等待拆到多个帧，却不保证所有工作都在后台线程完成。场景激活、对象创建、Awake 或你自己的初始化仍可能占用主线程。加载时出现尖峰，应在 Profiler 中查看相应时刻的调用，而不是只把进度条移动得更慢，掩盖真正耗时的工作。",
            "另外，关闭激活门会阻塞后续异步操作队列。若代码又等后面的卸载完成才开门，就可能形成新的循环等待。画出“谁等谁”的箭头，往往比反复增加延时更快找到原因。实验完成后保留原始进度、显示进度、操作完成和内容可交互四类记录。"
          ]
        }
      ],
      "code": {
        "title": "用组件上下文菜单手动打开激活门",
        "language": "csharp",
        "filename": "ActivationGateProbe.cs",
        "source": "using System.Collections;\nusing UnityEngine;\nusing UnityEngine.SceneManagement;\n\n// 挂在 Bootstrap，Content 已加入 Build Profile；运行中用组件菜单选择 Allow Activation。\npublic sealed class ActivationGateProbe : MonoBehaviour\n{\n    [SerializeField] private string contentScene = \"Content\";\n    private AsyncOperation pending;\n    private bool confirmed;\n    private IEnumerator Start()\n    {\n        pending = SceneManager.LoadSceneAsync(contentScene, LoadSceneMode.Additive);\n        if (pending == null) yield break;\n        pending.allowSceneActivation = false;\n        while (pending.progress < 0.9f) yield return null;\n        Debug.Log($\"Ready: progress={pending.progress}, done={pending.isDone}\");\n        while (!confirmed) yield return null;\n        pending.allowSceneActivation = true;\n        yield return pending;\n        Debug.Log(\"Scene operation completed; custom content readiness is a separate step.\");\n        pending = null;\n    }\n    [ContextMenu(\"Allow Activation\")]\n    private void AllowActivation() => confirmed = true;\n    private void OnDisable()\n    {\n        confirmed = true;\n        if (pending != null && !pending.isDone) pending.allowSceneActivation = true;\n    }\n}",
        "explanation": [
          "该实验使用 Additive 以保留观察协程。上下文菜单只是教学控制，不依赖旧 Input 或额外 UI 包。",
          "OnDisable 处理的是遗留激活门，不是取消操作。正式系统应让稳定的加载协调者持有状态，处理重复请求、失败和回收。"
        ]
      },
      "lab": [
        {
          "title": "在零点九处验证完成条件",
          "minutes": 60,
          "steps": [
            "创建本章前课的两个场景；挂脚本前先预测到零点九时的 isDone。",
            "运行并等待 Ready 日志，记录 progress/isDone 和 Hierarchy。",
            "在脚本组件上下文菜单执行 Allow Activation，记录操作完成及新对象回调发生时刻。",
            "把等待条件故意写成 while (!pending.isDone) 并禁止激活，观察无法前进的逻辑；停止后恢复正确代码。"
          ],
          "result": "关闭激活门时零点九并不表示完成；等 isDone 才开放门会互相等待。"
        },
        {
          "title": "检查观察者失效和队列依赖",
          "minutes": 60,
          "steps": [
            "预测禁用加载组件后引擎操作是否自动取消，实际禁用并对照场景变化。",
            "画出“加载等待激活—后续卸载等待队列—代码等待卸载”的依赖图，指出循环位置。",
            "创建 Single 模式对照版本，说明旧场景协程观察者的寿命；不要误把没有最终日志当成加载失败。",
            "记录五个加载时刻，并在笔记中区分原始进度、显示进度和内容可交互状态。"
          ],
          "result": "协程寿命、操作寿命与业务流程寿命需要分别管理；激活门会影响后续异步队列。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "加载条一直停在90%，代码始终不继续",
          "cause": "allowSceneActivation=false，代码又在等 isDone 才允许激活。",
          "fix": "达到progress>=0.9后等待独立确认，再开放激活门；不要建立循环依赖。"
        },
        {
          "symptom": "销毁加载界面后，后续场景操作也卡住",
          "cause": "引擎异步操作仍在执行，但控制者丢失了尚未打开的激活门引用。",
          "fix": "用稳定协调者持有操作，退出时明确开放/完成后卸载策略；不要把停止协程当取消API。"
        }
      ],
      "exercise": {
        "brief": "设计具有 Loading、AwaitingConfirmation、Activating、Ready、Failed 五个状态的加载流程，拒绝重复点击，并为离开加载界面规定一条不会遗留门锁的策略。",
        "deliverables": [
          "状态转移图和每个状态的可用按钮",
          "五时刻日志及错误条件复现",
          "说明停止协程与取消请求为什么不同"
        ],
        "rubric": [
          {
            "item": "状态与操作条件明确",
            "points": 30
          },
          {
            "item": "没有激活门与队列循环等待",
            "points": 30
          },
          {
            "item": "重复请求和离开界面有处理",
            "points": 25
          },
          {
            "item": "记录来源与限制清晰",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "禁止场景激活时 progress=0.9、isDone=false，下一步正确做法是？",
          "options": [
            "先等 isDone，再允许激活",
            "满足独立确认条件后允许激活",
            "先等待队列里后续卸载完成再开门",
            "把显示进度改成 100% 就算完成"
          ],
          "answer": 1,
          "explanation": "isDone 变真依赖激活完成。确认条件要来自外部，例如玩家允许进入，然后才开放激活。"
        },
        {
          "question": "停止等待加载的协程，一般能推断什么？",
          "options": [
            "后台加载一定取消了",
            "引擎已经释放目标场景",
            "这段协程不再观察，加载未必取消",
            "加载会自动重新开始"
          ],
          "answer": 2,
          "explanation": "协程和引擎操作的寿命不同；没有后续日志只能证明观察代码没有走到那里。"
        },
        {
          "question": "异步文件加载后仍出现主线程尖峰，最有价值的证据是？",
          "options": [
            "只观察进度条是否平滑",
            "查看 Profiler 中激活和初始化附近的调用",
            "增加加载画面的固定等待时间",
            "把所有初始化方法改名为 Async"
          ],
          "answer": 1,
          "explanation": "查看激活与初始化附近的主线程调用，才有机会区分引擎工作和自定义 Awake 等开销。"
        }
      ],
      "references": [
        {
          "label": "AsyncOperation.allowSceneActivation",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AsyncOperation-allowSceneActivation.html"
        },
        {
          "label": "AsyncOperation.progress",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AsyncOperation-progress.html"
        },
        {
          "label": "SceneManager.LoadSceneAsync",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.SceneManager.LoadSceneAsync.html"
        }
      ],
      "summary": [
        "禁止激活时，isDone 不会先替你完成；开放门需要独立条件。",
        "操作完成和内容可交互分开判断，停止观察协程不等于取消加载。"
      ],
      "teaching": {
        "question": "加载进度停在 0.9，isDone=false。为什么再等十分钟也不一定前进？",
        "keyIdea": "如果禁止场景激活，等待的是开放激活的条件。isDone 需要激活完成才会变真，因此不能用 isDone 本身作为开门条件。",
        "walkthrough": [
          {
            "title": "关上激活门",
            "text": "启动 Additive 加载，保存操作并设置 allowSceneActivation=false。"
          },
          {
            "title": "观察等待状态",
            "text": "看到 Ready 后记录 progress=0.9、isDone=false；此时不要把它判为失败。"
          },
          {
            "title": "从外部开门",
            "text": "执行 Allow Activation，让引擎继续激活，再等待 isDone，最后做内容初始化。"
          }
        ],
        "prediction": {
          "question": "把观察协程停止，是否能证明加载已取消？",
          "answer": "不能。停止的是你的等待代码。引擎操作可能继续，必须根据所用 API 的能力与实际操作状态另行判断。"
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
      "id": "l068",
      "title": "跨场景服务、常驻对象与退出清理",
      "prerequisites": [
        "l013",
        "l066"
      ],
      "goals": [
        "说明 DontDestroyOnLoad 的根对象与子树规则",
        "建立跨场景服务的唯一性和重复实例策略",
        "追踪事件订阅和场景引用的退出清理"
      ],
      "theory": [
        {
          "title": "为什么切换关卡后音乐不该重来",
          "paragraphs": [
            "假设背景音乐和音量设置放在主菜单场景。切换到战斗场景时，普通场景对象会退出，音乐也随之停止。你希望音乐服务继续存在，可以对合适的根对象使用 DontDestroyOnLoad。它改变的是对象在场景切换中的去留，不会自动替你设计服务之间的依赖。",
            "还要看根对象下面挂了什么。根对象被保留时，它的 Transform 子对象也一起保留。如果把临时角色、整张地图都放在音乐服务下面，它们也可能跟着留下。因此常驻根节点应尽量小，只放确实需要跨关卡保留的对象；不要为了方便拖动层级，就把整个场景变成它的子树。"
          ]
        },
        {
          "title": "两个场景都有服务时会发生什么",
          "paragraphs": [
            "为了让两个场景都能单独测试，你可能各放一个服务 Prefab。先进入场景 A，服务甲成为常驻对象；再加载场景 B，Prefab 又创建服务乙。如果两者都继续工作，音乐、事件计数或存档请求便可能执行两次。问题不是有没有静态字段，而是怎样识别和处理后来的重复者。",
            "示例让第一个有效实例登记为当前服务。后来者在 Awake 发现已有实例，就调用 Destroy(gameObject)，然后立即 return。Destroy 不会替你跳出当前 C# 方法，return 才能阻止这一段 Awake 继续初始化。不过 return 只退出当前方法，不能代替其他回调的检查：示例在 OnEnable 里还用 Instance == this 判断身份，只有保留者才订阅。沿着 Awake 和 OnEnable 分别追踪甲、乙，比笼统记住“销毁后返回就安全”更准确。"
          ]
        },
        {
          "title": "用实例身份和回调次数证明只有一个",
          "paragraphs": [
            "切换10 次场景时，观察同一个保留实例的 ID，而不是只看 Hierarchy 中某一时刻有几个同名对象。再记录每次 sceneLoaded 回调和 Visits 的变化。若一次加载增加两次，先检查是否出现重复实例或重复订阅，不要直接把计数器减半，那只会隐藏真正原因。",
            "sceneLoaded 说明场景加载事件发生，不一定等于“玩家成功进入一个关卡”。叠加加载 UI 场景也可能触发它，加载完成后还可能有内容初始化。服务命名和统计解释必须对齐真实事件。若要统计进入战斗，应在相应流程完成时单独定义一次通知。"
          ]
        },
        {
          "title": "常驻服务不能永远保留旧角色",
          "paragraphs": [
            "常驻服务活得比关卡角色久。场景卸载后，服务字段中仍可能留着旧角色引用，事件列表也可能保留旧订阅者。解决办法是让角色进入时登记、退出时撤销；在 OnEnable 订阅的组件，通常应在 OnDisable 取消订阅。每一条联系都要有结束它的具体位置。",
            "只在访问时写一个空判断，可以避免部分错误，却不能告诉服务新角色是谁，更不能清除所有无效业务状态。先列出服务保存的内容，例如当前角色、当前关卡编号、等待中的保存请求，再分别规定切关卡时保留还是重置，常驻才会成为可理解的行为。"
          ]
        },
        {
          "title": "编辑器设置会改变下一次播放的起点",
          "paragraphs": [
            "默认进入播放模式会重载域和场景，而关闭 Domain Reload 后，静态字段不再按原来的方式重新开始。示例处理静态重置，实验仍需记录 Scene Reload 是否开启。不要只写“关闭重载也支持”，却不说明关闭了哪一项；不同组合下，现有实例是否重建会改变初始化需要。",
            "本课先在默认设置下完成切场景、去重、订阅清理，再只关闭 Domain Reload 做对照。若进一步关闭 Scene Reload，必须另行安排保留实例如何重新登记。把这些设置写入实验记录，才能判断下一次播放的异常来自服务逻辑，还是起始状态已经不同。"
          ]
        }
      ],
      "code": {
        "title": "可观察的最小常驻服务",
        "language": "csharp",
        "filename": "PersistentVisitCounter.cs",
        "source": "using UnityEngine;\nusing UnityEngine.SceneManagement;\n\n// 挂在根 GameObject；两个实验场景各放一份以验证去重。\npublic sealed class PersistentVisitCounter : MonoBehaviour\n{\n    public static PersistentVisitCounter Instance { get; private set; }\n    public int Visits { get; private set; }\n    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]\n    private static void ResetStatics() => Instance = null;\n    private void Awake()\n    {\n        if (Instance != null && Instance != this)\n        {\n            Destroy(gameObject);\n            return;\n        }\n        Instance = this;\n        DontDestroyOnLoad(gameObject);\n    }\n    private void OnEnable()\n    {\n        if (Instance == this) SceneManager.sceneLoaded += CountVisit;\n    }\n    private void OnDisable() => SceneManager.sceneLoaded -= CountVisit;\n    private void CountVisit(Scene scene, LoadSceneMode mode)\n    {\n        Visits++;\n        Debug.Log($\"Service {GetInstanceID()}: visits={Visits}, scene={scene.name}\");\n    }\n    private void OnDestroy()\n    {\n        if (Instance == this) Instance = null;\n    }\n}",
        "explanation": [
          "两个场景中的服务对象必须是根对象。计数统计 sceneLoaded 事件，而不是“玩家进入关卡”的业务事件，二者含义不同。",
          "示例展示最小去重和订阅清理，没有解决所有服务依赖或无场景重载时的编辑器组合。本章后练习需记录 Enter Play Mode 设置；关闭 Scene Reload 的组合要另外定义实例重注册流程。"
        ]
      },
      "lab": [
        {
          "title": "切换十次，追踪真正留下的对象",
          "minutes": 60,
          "steps": [
            "创建两个含服务 Prefab 的场景并加入当前 Build Profile，确认服务是根对象。",
            "在默认进入播放模式设置下运行并交替切换十次，保存实例ID与Visits日志。",
            "把一个可视子对象放到服务根对象下，观察它随常驻服务一起保留；记录常驻子树的风险。",
            "故意移除重复者 Awake 中 return，观察可能继续执行的初始化路径，再恢复并解释 Destroy 延迟处理。"
          ],
          "result": "保留的服务实例ID稳定；重复者不能继续参与订阅与初始化。"
        },
        {
          "title": "验证事件清理与静态重置边界",
          "minutes": 60,
          "steps": [
            "在内容场景中增加一个临时订阅者，按 OnEnable/OnDisable 对称订阅 sceneLoaded。",
            "禁用订阅者并切换场景，确认回调次数；对照忘记取消时的行为并修复。",
            "记录默认 Domain/Scene Reload 设置；仅关闭 Domain Reload、保持 Scene Reload 开启，复测静态重置和服务重建。",
            "写出若进一步关闭 Scene Reload，还需要重新定义哪些实例初始化步骤；不把该组合的偶然结果当普遍保证。"
          ],
          "result": "事件次数能验证订阅是否成对；编辑器播放模式设置属于实验前提。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "回到菜单后音乐叠加、事件响应两遍",
          "cause": "每个场景又创建服务，去重失败或重复者继续初始化。",
          "fix": "记录实例ID；重复者 Destroy 后立即返回，事件订阅与取消成对。"
        },
        {
          "symptom": "重复者销毁后 Instance 突然为空",
          "cause": "任意实例 OnDestroy 都无条件清空静态字段。",
          "fix": "只有 Instance==this 的持有者才清理该注册；同样原则适用于其他共享注册表。"
        }
      ],
      "exercise": {
        "brief": "把服务拆成常驻的统计记录和可替换的关卡角色引用。每次进入注册角色，退出撤销角色；禁止常驻根对象意外带走整个关卡。",
        "deliverables": [
          "服务和角色的寿命关系图",
          "十次切换的实例ID/回调次数/引用表",
          "编辑器重载设置及明确支持范围"
        ],
        "rubric": [
          {
            "item": "常驻对象子树最小且归属清晰",
            "points": 25
          },
          {
            "item": "唯一实例及重复销毁策略正确",
            "points": 30
          },
          {
            "item": "事件与场景引用退出时清理",
            "points": 30
          },
          {
            "item": "记录重载前提及复测结果",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "DontDestroyOnLoad 对根对象生效时，它的 Transform 子对象怎样？",
          "options": [
            "只有根对象保留，所有子对象都销毁",
            "子对象也随根对象保留",
            "子对象自动变成资源文件",
            "子对象仍依赖原场景卸载"
          ],
          "answer": 1,
          "explanation": "保留范围包含根对象的 Transform 子树。层级安排会影响哪些对象意外跨场景留下。"
        },
        {
          "question": "重复实例 Awake 内 Destroy(gameObject) 之后为什么通常还要 return？",
          "options": [
            "Destroy 已经自动终止方法",
            "防止它继续订阅和初始化",
            "return 会让销毁改成立即执行",
            "return 用来重置所有静态字段"
          ],
          "answer": 1,
          "explanation": "Destroy 不会替你跳出当前方法。return 防止重复实例在真正退出前继续订阅或启动工作。"
        },
        {
          "question": "常驻服务访问已卸载角色引用的最好策略是？",
          "options": [
            "缓存一次后永远复用旧角色引用",
            "把所有旧角色也设为常驻",
            "进入时登记，退出时撤销，使用前检查状态",
            "只关闭 Domain Reload 就能自动清除引用"
          ],
          "answer": 2,
          "explanation": "让角色进入时登记、退出时撤销，再在使用时检查有效状态，才能使长寿命服务跟上短寿命角色的更换。"
        }
      ],
      "references": [
        {
          "label": "Object.DontDestroyOnLoad",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.DontDestroyOnLoad.html"
        },
        {
          "label": "RuntimeInitializeOnLoadMethodAttribute",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RuntimeInitializeOnLoadMethodAttribute.html"
        },
        {
          "label": "SceneManager.sceneLoaded",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.SceneManager-sceneLoaded.html"
        }
      ],
      "summary": [
        "常驻根对象及其子树会保留，新场景中的重复服务仍需明确退出。",
        "服务比角色活得久，因此要在角色更换时登记、撤销并清理订阅。"
      ],
      "teaching": {
        "question": "每个场景都放一个音乐服务 Prefab，切关卡后为什么可能听到两份音乐？",
        "keyIdea": "常驻对象不会随旧场景退出，新场景中的 Prefab 却仍会创建实例。必须明确谁保留、谁退出，并让退出者立即停止后续初始化。",
        "walkthrough": [
          {
            "title": "进入场景 A",
            "text": "先从场景 A 启动：服务甲登记为当前实例，将自己的根对象设为常驻，之后切场景时它继续存在。"
          },
          {
            "title": "加载场景 B",
            "text": "加载场景 B 后又创建服务乙；乙检查到甲仍有效，请求销毁自己，然后立即返回，不再重复参与工作。"
          },
          {
            "title": "停止重复工作",
            "text": "乙立即 return，不再订阅；甲继续接收一次场景加载通知。"
          }
        ],
        "prediction": {
          "question": "把角色设为音乐服务的子对象，切场景时角色会自动退出吗？",
          "answer": "不能这样假定。常驻根对象的 Transform 子树会一起保留，因此应把短期角色放在由关卡管理的层级中。"
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
      "id": "l069",
      "title": "资源可达性、释放协议与内存证据",
      "prerequisites": [
        "l045",
        "l068"
      ],
      "goals": [
        "区分运行实例、资源对象、托管回收和原生内存",
        "用引用路径解释资源为何仍被持有",
        "比较直接引用、Resources与可选Addressables的责任边界"
      ],
      "theory": [
        {
          "title": "关闭图片后，内存为什么没有立刻下降",
          "paragraphs": [
            "场景里有两个物体使用同一张纹理。你销毁其中一个，画面少了一个物体，但纹理还要供另一个使用，当然不能简单认定它已经没用了。显示它的实例、纹理资源、脚本持有的引用，分别有自己的结束条件。把其中一个 Destroy 掉，不会同时结束所有关系。",
            "可以把问题分成三层看。第一层是场景里的角色实例，Destroy 结束它的引擎对象寿命；第二层是脚本中的托管对象，只有满足回收条件后才由 GC 处理；第三层是纹理等引擎资源，要遵循对应资源系统的卸载规则。一个角色持有纹理引用，不表示三层是同一个东西。即使资源已释放，分配器也可能暂时保留申请过的空间，因此任务管理器的工作集没有马上下降，仍不足以证明纹理还被使用。"
          ]
        },
        {
          "title": "从“谁还需要它”开始画引用",
          "paragraphs": [
            "本课脚本把 Resources.Load 得到的纹理保存在 held 字段。再让另一个组件通过 Inspector 保存同一纹理，你就得到两条持有路径。清空 held 只断开其中一条，另一个组件仍然需要这张纹理。先画出这两条箭头，再预测清理结果，比直接按卸载按钮容易理解。",
            "Resources.UnloadUnusedAssets 会按它规定的规则寻找不用的资源。官方说明会检查 GameObject 层级、组件和静态变量，但不检查脚本执行栈。因而不能把“某个局部变量还拿着它”当成这个 API 保留资源的保证。需要持续使用的资源，应有明确且合适的持有位置。"
          ]
        },
        {
          "title": "先解除使用，再安排一次清理",
          "paragraphs": [
            "实验菜单先解除示例字段，再请求清理并等待操作完成。顺序表达的是：当前使用者已经不需要它，然后让资源系统检查是否还能卸载。示例不承诺纹理必定消失，因为其他场景、编辑器或其他组件可能仍持有它。观察不符合预测时，先找剩余引用。",
            "不应把 UnloadUnusedAssets 放到 Update 里不断调用。清理本身有成本，也不能替代对引用的管理。选择关卡退出等合适过渡阶段进行实验，记录调用前后资源数量与已知持有者；不要再叠加强制 GC，把多个机制混在一次操作里，导致无法判断是谁产生变化。"
          ]
        },
        {
          "title": "怎样区分缓存和持续泄漏",
          "paragraphs": [
            "第一次加载会创建一些之后继续复用的内容，所以第一次进入后的内存比启动时高，并不自动构成泄漏。更有解释力的办法是先预热一次，再反复加载、退出10 轮，每轮都在相同的稳定时刻记录。若资源数量和引用链持续增加，就有了进一步追查的方向。",
            "可以故意把每轮结果加入静态列表，制造一个清楚的对照。列表越来越长，退出场景并不会自动清空它；清空后再比较趋势。如果资源数稳定而工作集仍高，要继续检查分配器和工具统计范围，不能仅凭单个数字下结论。"
          ]
        },
        {
          "title": "换资源系统时，也要重新检查释放方法",
          "paragraphs": [
            "Resources 示例的释放方式不能直接套到所有加载工具上。Addressables 等可选系统还需要跟踪加载句柄和引用计数，说明谁取得、谁使用、谁释放。释放句柄或计数归零，不保证资源立刻从内存消失；它所属的 AssetBundle 可能还因其他使用者驻留，实际释放要结合依赖关系和资源系统规则判断。本课先阅读其官方内存管理说明，不要求安装新包。",
            "完成实验后，你应能为一张仍在内存里的纹理回答三个具体问题：谁在持有它、哪个操作会结束使用、用什么证据确认结果。若只知道“清理按钮按过了”，就还没解释清楚资源为何留下。内存排查的目标是找到保留原因，再修改管理方式，而不是追求某一时刻数字越小越好。"
          ]
        }
      ],
      "code": {
        "title": "明确持有并在实验中解除 Resources 引用",
        "language": "csharp",
        "filename": "ResourceOwnershipProbe.cs",
        "source": "using System.Collections;\nusing UnityEngine;\n\n// 放一张测试纹理到 Assets/Resources/ProbeTexture.png，再挂到空对象。\npublic sealed class ResourceOwnershipProbe : MonoBehaviour\n{\n    private Texture2D held;\n    private bool releasing;\n    private void Start()\n    {\n        held = Resources.Load<Texture2D>(\"ProbeTexture\");\n        Debug.Log(held != null ? $\"Holding {held.name}\" : \"Missing ProbeTexture\");\n    }\n    [ContextMenu(\"Release Test Reference\")]\n    private void ReleaseTestReference()\n    {\n        if (Application.isPlaying && !releasing) StartCoroutine(ReleaseAndObserve());\n    }\n    private IEnumerator ReleaseAndObserve()\n    {\n        releasing = true;\n        held = null;\n        yield return Resources.UnloadUnusedAssets();\n        Debug.Log(\"Unload pass completed; inspect resource counts and other references.\");\n        releasing = false;\n    }\n}",
        "explanation": [
          "此例不承诺纹理一定释放：编辑器、其他场景字段和其他使用者可能仍持有该资源。必须用引用证据核对，构建行为也可能与编辑器观察不同。",
          "UnloadUnusedAssets 是一次明确的实验操作，不建议把它放进 Update；示例没有强制 GC，也不直接卸载仍可能在使用的资源。"
        ]
      },
      "lab": [
        {
          "title": "给同一纹理建立两条持有路径",
          "minutes": 60,
          "steps": [
            "制作专用 ProbeTexture，加入 Resources 目录；在独立场景运行脚本并记录基线。",
            "另建组件通过 Inspector 持有同一纹理，预测只清空示例 held 后资源能否卸载。",
            "使用上下文菜单执行释放，等待操作完成；记录第二条引用仍存在的事实。",
            "解除所有已知持有者，复测资源计数并说明编辑器额外引用与缓存对结论的影响。"
          ],
          "result": "销毁显示者或清空单一路径不足以证明资源无引用；必须解释所有持有者。"
        },
        {
          "title": "建立反复加载退出的稳定点曲线",
          "minutes": 60,
          "steps": [
            "预热一次后，执行十轮加载、解除使用、过渡阶段清理，记录同一稳定点的资源数量与内存指标。",
            "故意把每轮加载结果存入静态集合，观察累积引用；再清空集合比较趋势。",
            "阅读官方 Addressables Memory management，画出加载句柄取得、共享、释放的责任链，不需要安装该可选包。",
            "写出一个“内存不下降但尚不能证明泄漏”的解释，以及还需要什么证据。"
          ],
          "result": "持续增长的持有关系比单次工作集高低更能指向责任泄漏。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "Destroy角色后纹理仍占内存",
          "cause": "资源被其他对象或静态状态持有，或测量指标包含缓存和保留空间。",
          "fix": "在相同稳定点比较资源数量和引用路径，逐条解除责任，避免只看进程总内存。"
        },
        {
          "symptom": "每帧清理未使用资源导致周期性卡顿",
          "cause": "把成本较高的全局资源遍历放入帧循环。",
          "fix": "先修正资源所有权，再在合适的过渡阶段测量释放开销。"
        }
      ],
      "exercise": {
        "brief": "为一个小内容区写资源所有权表，分别说明直接引用、Resources加载和可选Addressables句柄在进入、共享、退出时由谁承担责任，并用十轮稳定点实验验证一种方案。",
        "deliverables": [
          "包含持有者、借用者和释放时机的表格",
          "十轮资源数量与内存指标曲线",
          "对缓存、泄漏和托管回收的边界解释"
        ],
        "rubric": [
          {
            "item": "能区分实例与资源寿命",
            "points": 25
          },
          {
            "item": "所有权与释放API匹配",
            "points": 30
          },
          {
            "item": "稳定点对照实验可复现",
            "points": 30
          },
          {
            "item": "结论没有超出证据",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "UnloadUnusedAssets 官方遍历规则不检查哪一项？",
          "options": [
            "GameObject 层级",
            "组件字段",
            "静态变量",
            "脚本执行栈"
          ],
          "answer": 3,
          "explanation": "该 API 的规则不包括检查脚本执行栈，因此需要使用的资源不能只靠局部变量保留。"
        },
        {
          "question": "Destroy一个引用纹理的实例后，纹理会怎样？",
          "options": [
            "纹理必定立即释放",
            "取决于其他引用和资源管理规则",
            "只要当前场景卸载就一定释放",
            "只要托管 GC 运行就一定释放"
          ],
          "answer": 1,
          "explanation": "纹理可能由其他对象共享。实例销毁没有说明所有资源引用都已经结束。"
        },
        {
          "question": "哪一项最有助于判断资源责任泄漏？",
          "options": [
            "只比较启动和第一次进入的工作集",
            "每帧强制 GC 后看帧率",
            "预热后多轮进退，在相同稳定点查看资源数和引用链",
            "只比较两张不同时刻的任务管理器截图"
          ],
          "answer": 2,
          "explanation": "预热和相同稳定点能排除部分首次创建影响，持续增加的引用关系比一次内存高低更有解释力。"
        }
      ],
      "references": [
        {
          "label": "Resources.Load",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Resources.Load.html"
        },
        {
          "label": "Resources.UnloadUnusedAssets",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Resources.UnloadUnusedAssets.html"
        },
        {
          "label": "Addressables 2.7 · Managing Addressable asset memory（可选包）",
          "url": "https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/memory-assets.html"
        }
      ],
      "summary": [
        "实例销毁、托管回收和资源卸载处理不同内容。",
        "先找仍在持有资源的对象，再在相同阶段重复测量。"
      ],
      "teaching": {
        "question": "held 已设为 null，为什么同一纹理仍可能无法卸载？",
        "keyIdea": "清空一个字段只解除一条引用。资源是否还能使用、能否卸载，要结合其他持有者和对应资源系统的规则判断。",
        "walkthrough": [
          {
            "title": "建立两个持有者",
            "text": "示例 held 和另一个 Inspector 字段都指向 ProbeTexture。"
          },
          {
            "title": "只断开一条",
            "text": "清空 held，再等待 UnloadUnusedAssets；第二个字段仍需要这张纹理。"
          },
          {
            "title": "重复相同退出过程",
            "text": "把已知持有者逐一解除后，重复相同进退流程，在同一稳定点记录资源数，区分首次缓存和持续累积。"
          }
        ],
        "prediction": {
          "question": "只把纹理放在局部变量里，能保证 UnloadUnusedAssets 保留它吗？",
          "answer": "不能。官方说明该操作不检查脚本执行栈，局部变量不是这里的保留保证。应按需要使用的范围明确持有资源。"
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
      "id": "l070",
      "title": "对象池：复用实例与每轮状态重置",
      "prerequisites": [
        "l014",
        "l066",
        "l069"
      ],
      "goals": [
        "区分一次实例寿命与多次租用寿命",
        "为对象池定义创建、取出、归还和销毁四个边界",
        "用状态污染与重复归还实验验证复用正确性"
      ],
      "theory": [
        {
          "title": "对象池省掉的是哪些重复工作",
          "paragraphs": [
            "设想每秒发射几十颗子弹。若每次都创建对象、查找组件，再在命中后销毁，就会反复做类似工作。对象池先保留一批可以再次使用的实例，需要时取出，不用时归还。这里“归还”通常只是停用并存进池里，同一个实例之后还会回来，不等于已经销毁。",
            "所以要区分两个时间范围：实例从创建到销毁的一生，以及每一次从取出到归还的使用过程。Awake 或 Start 适合放一次性的初始化；本次目标、生命值、命中标记等会随每次使用改变，必须在取出时重新设置，不能因为代码写在 Start 就期待下次自动执行。"
          ]
        },
        {
          "title": "先读懂容量，不要从名字猜行为",
          "paragraphs": [
            "ObjectPool 的 defaultCapacity 是内部集合的初始容量，不表示构造池时就创建这么多个游戏对象。示例设为 4，启动时仍没有立方体，因为还没调用 Get。若要预热 4 个实例，应先连续 Get 4 次并暂时保留，再把这 4 个全部 Release。若写成 Get 一个、立刻 Release 一个，并把这两步重复 4 次，后面往往只是反复借出同一个实例，实际只创建了 1 个。观察创建次数，才能判断预热是否符合原意。",
            "maxSize 约束的是池保留的最大空闲数量，也不是场上活跃对象的上限。连续取出十个仍可能得到10 个实例；归还时若空闲池只能保留 4 个，超出的归还对象会走销毁处理。若游戏只允许十颗子弹同时存在，还需要单独检查活跃数量并决定拒绝、覆盖还是排队。"
          ]
        },
        {
          "title": "沿着一次取出和归还追踪状态",
          "paragraphs": [
            "示例第一次取出立方体时，若没有空闲对象就创建，再执行取出回调，让它可以被使用。归还时执行相应回调并停用。第二次若取到同一实例，就不会重新经历实例的所有首次初始化。给对象记录实例 ID、Start 次数和 OnEnable 次数，就能看出这两种时间范围的区别。",
            "最容易漏的是看不见的状态：刚体速度、一次性命中标记、事件订阅、旧目标，以及上次启动的延时任务。列一张每次使用前必须重置的清单，再故意让第一次使用改变这些值。第二次取出逐项检查，才能证明复用没有把上一轮行为带回来。"
          ]
        },
        {
          "title": "为什么晚到的回调可能归还错对象",
          "paragraphs": [
            "假设子弹第一次发射时启动了2 秒后归还的任务，但它1 秒后已经命中并归还，又马上被取出第二次使用。原来的任务2 秒到点时，面对的还是同一个实例，却已经是另一轮使用。如果它直接归还，会提前终止第二发子弹。这不是重复创建问题，而是旧任务误操作了新一轮状态。",
            "常见处理方法是为每次取出记录一个编号，回调只在编号仍匹配时执行；同时取消能取消的旧任务。碰撞和超时都可能请求归还，也应保证一次使用只成功归还一次。示例只演示手动操作，真实弹道需要补齐这些条件，不能把池容器的存在当成完整子弹系统。"
          ]
        },
        {
          "title": "池退出时，活跃对象也要有人处理",
          "paragraphs": [
            "池保存着空闲实例，还可能有已经借出、仍在场上的实例。关卡退出时要决定先停止新借用，再结束活跃对象，最后清空池。只清空空闲集合并不能自动安排每一个借出对象怎样退出。示例把对象放在池对象子树中便于观察，但正式项目仍要明确层级和场景归属。",
            "对象池还会让资源和实例多留一段时间，减少创建销毁不等于降低所有内存。Unity 对象操作放在主线程，池容器也不能随意跨线程使用。等重置和退出行为都正确后，再在相同负载下测量创建次数、分配和帧时间，判断池是否为这个场景带来值得维护的收益。"
          ]
        }
      ],
      "code": {
        "title": "不依赖输入包的手动租用与回收",
        "language": "csharp",
        "filename": "PoolLeaseProbe.cs",
        "source": "using System.Collections.Generic;\nusing UnityEngine;\nusing UnityEngine.Pool;\n\n// 挂在空对象。运行时用组件菜单 Rent One、Return One 观察数量。\npublic sealed class PoolLeaseProbe : MonoBehaviour\n{\n    private ObjectPool<GameObject> pool;\n    private readonly List<GameObject> active = new List<GameObject>();\n    private void Awake()\n    {\n        pool = new ObjectPool<GameObject>(\n            createFunc: CreateItem,\n            actionOnGet: item => { item.transform.position = Vector3.zero; item.SetActive(true); },\n            actionOnRelease: item => item.SetActive(false),\n            actionOnDestroy: item => Destroy(item),\n            collectionCheck: true, defaultCapacity: 4, maxSize: 4);\n    }\n    private GameObject CreateItem()\n    {\n        var item = GameObject.CreatePrimitive(PrimitiveType.Cube);\n        item.transform.SetParent(transform);\n        item.SetActive(false);\n        return item;\n    }\n    [ContextMenu(\"Rent One\")]\n    private void RentOne()\n    {\n        if (!Application.isPlaying || pool == null) return;\n        active.Add(pool.Get());\n        Report();\n    }\n    [ContextMenu(\"Return One\")]\n    private void ReturnOne()\n    {\n        if (!Application.isPlaying || active.Count == 0) return;\n        int last = active.Count - 1;\n        GameObject item = active[last];\n        active.RemoveAt(last);\n        pool.Release(item);\n        Report();\n    }\n    private void Report() => Debug.Log($\"active={pool.CountActive}, idle={pool.CountInactive}\");\n    private void OnDestroy()\n    {\n        foreach (GameObject item in active) if (item != null) Destroy(item);\n        active.Clear();\n        pool?.Clear();\n    }\n}",
        "explanation": [
          "立方体都在池对象子树中；示例重置位置，不模拟弹道、碰撞或异步回调。正式子弹还要重置刚体速度、命中标记与租用令牌。",
          "默认容量4不会预先创建四个立方体；最大空闲4也不阻止你租出十个。池不是线程安全容器，所有 Unity 对象操作留在主线程。"
        ]
      },
      "lab": [
        {
          "title": "测出容量字段究竟限制什么",
          "minutes": 60,
          "steps": [
            "挂脚本并运行，确认启动时没有立方体；再比较“先借出四个再归还”与“借一个立即归还、重复四次”的创建次数，解释为什么后者可能只创建一个。",
            "连续 Rent One 十次，记录 CountActive 与 Hierarchy 实例数，验证 maxSize 没有限制活跃数。",
            "逐个 Return One，记录空闲数何时达到四，以及额外对象归还后被销毁的行为。",
            "重复第二轮，比较创建次数、Awake/Start与OnEnable次数；给每个观察标明实例寿命或租用寿命。"
          ],
          "result": "集合初始容量、池内最大空闲数和场上活跃上限是不同概念。"
        },
        {
          "title": "制造并修复复用污染",
          "minutes": 60,
          "steps": [
            "给租用对象增加一次性命中标记、颜色与目标字段；在归还前改变它们，预测第二次租用结果。",
            "故意只在 Start 重置，记录污染；改成显式每次租用初始化后重测。",
            "设计碰撞与超时同时归还的场景，用租用标记保护，保存重复归还前后证据。",
            "写出关卡退出时活跃列表与空闲池的清理顺序，再在同条件下测一次复用与创建销毁的开销。"
          ],
          "result": "池的正确性来自每次租用的重置与一次归还责任，性能收益必须在正确性通过后测量。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "第二次发出的子弹立即命中或立即消失",
          "cause": "命中标记/超时任务只在 Start 初始化，复用时仍携带旧租用状态。",
          "fix": "把租用重置显式化，并用版本号或取消机制使旧延迟回调失效。"
        },
        {
          "symptom": "maxSize设为4却能生成十个对象",
          "cause": "把最大保留空闲数量误当同时活跃上限。",
          "fix": "根据申请策略显式限制活跃数，使用计数日志验证容量语义。"
        }
      ],
      "exercise": {
        "brief": "设计一个可复用的标记对象池，支持最多八个活跃租用、超时与点击两种回收原因，任何对象一次租用只能归还一次；退出内容场景时收回全部租用。",
        "deliverables": [
          "四个生命周期边界的重置责任清单",
          "重复归还和旧延迟任务的测试记录",
          "同条件性能与保留内存对照"
        ],
        "rubric": [
          {
            "item": "实例初始化与租用初始化分开",
            "points": 30
          },
          {
            "item": "重复归还及旧回调有防护",
            "points": 30
          },
          {
            "item": "场景退出清理全部活跃与空闲项",
            "points": 25
          },
          {
            "item": "性能结论同时记录收益与代价",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "ObjectPool.defaultCapacity=10，构造完成能保证已有十个实例吗？",
          "options": [
            "能，构造时已完成预热",
            "不能，它是内部集合初始容量",
            "能，只是实例都处于停用状态",
            "第一次归还会自动补足十个"
          ],
          "answer": 1,
          "explanation": "defaultCapacity 预留的是内部集合空间。只有实际创建或显式预热，才会产生可借出的游戏对象。"
        },
        {
          "question": "对象第二次从池取出时，哪项初始化不能只依赖 Start？",
          "options": [
            "缓存固定不变的组件引用",
            "本轮使用的生命值和目标",
            "计算始终不变的常量",
            "验证脚本上要求的组件类型"
          ],
          "answer": 1,
          "explanation": "Start 对同一实例只执行一次。本次目标和生命值必须在每次使用开始时设置。"
        },
        {
          "question": "清空池后仍有活跃对象在外使用，应该怎样处理？",
          "options": [
            "假定 Clear 已销毁所有借出对象",
            "等待托管 GC 自动销毁场上的实例",
            "记录活跃对象，明确关闭和归还顺序",
            "把池设为静态字段就不用关闭"
          ],
          "answer": 2,
          "explanation": "清空空闲池不会替你安排借出对象的退出。需要记录仍在使用的对象，先结束它们，再按规定归还或销毁。"
        }
      ],
      "references": [
        {
          "label": "UnityEngine.Pool.ObjectPool<T>",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Pool.ObjectPool_1.html"
        },
        {
          "label": "GameObject.SetActive",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/GameObject.SetActive.html"
        },
        {
          "label": "MonoBehaviour.Start",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.Start.html"
        }
      ],
      "summary": [
        "同一实例可以经历多轮使用，每轮目标、速度和延时任务都要检查。",
        "初始集合容量、最大空闲数量和最大活跃数量要分别理解。"
      ],
      "teaching": {
        "question": "同一颗子弹第二次取出时，为什么仍带着第一次的目标和速度？",
        "keyIdea": "对象池复用的是同一个实例。实例初始化通常只执行一次，而每次使用需要的状态必须由取出和归还流程明确重置。",
        "walkthrough": [
          {
            "title": "第一次使用",
            "text": "首次从池中取出实例 A，设置目标甲和运动速度；它命中后被归还，但实例本身并没有销毁。"
          },
          {
            "title": "检查保留内容",
            "text": "再次使用之前检查 A 的字段：停用不会自动恢复声明值，旧目标、速度与命中标记仍可能留着。"
          },
          {
            "title": "第二次准备",
            "text": "再次取出 A，在允许它运动前设置新目标、清除命中标记并重置速度。"
          }
        ],
        "prediction": {
          "question": "maxSize=4，能保证最多只借出四个对象吗？",
          "answer": "不能。它限制保留的空闲对象数量。若要限制同时活跃的数量，需要由借用逻辑另行判断。"
        }
      }
    }
  ]
});
