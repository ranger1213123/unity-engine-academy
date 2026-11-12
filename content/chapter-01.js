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
        "找到编辑器窗口，创建并运行第一个环境探针",
        "记录版本与实验前后唯一改变的条件",
        "用手册和脚本参考区分观察与保证"
      ],
      "theory": [
        {
          "title": "认识编辑器的六个窗口",
          "paragraphs": [
            "先不急着写代码。Hierarchy（层级）列出当前场景的对象；Project（项目）列出 Assets 里的文件和文件夹；Inspector（检视）显示当前选中对象的组件或资源设置。它们是三种不同的视角：场景里有什么、磁盘中有什么、当前选中了什么。",
            "Scene（场景）供你摆放和观察对象，Game（游戏）显示游戏相机看到的结果，Console（控制台）显示日志、警告和错误。Scene 中看得见某个编辑轮廓，不代表相机一定会在 Game 中画出它。",
            "窗口位置可以被拖动，先认标签，不必追求与教程截图完全一致。缺失时依次用顶部 Window > General > Hierarchy、Project、Inspector、Scene、Game 或 Console 打开对应窗口；中文界面的含义分别就是层级、项目、检视、场景、游戏、控制台。下面提到“选择对象”，指在 Hierarchy 单击它，再看 Inspector。"
          ]
        },
        {
          "title": "创建并挂载第一个脚本",
          "paragraphs": [
          "本课只用一份 EnvironmentProbe.cs 和一个挂有它的 Probe。下面是第一次创建的详细操作；如果你读正文时已经照做，后面实验只检查已有结果，直接继续运行，不要再创建第二份文件、第二个 Probe 或重复添加组件。",
          "在 Project 点开 Assets。若已有 Scripts 文件夹就打开它；没有时才在资源列表空白处右键，选 Create > Folder，命名 Scripts。点开 Scripts，再使用顶部 Assets > Create > Scripting > MonoBehaviour Script，立即将脚本命名 EnvironmentProbe，不要保留默认 NewMonoBehaviourScript。最终文件应为 EnvironmentProbe.cs，类名也必须是 EnvironmentProbe。已有这份脚本时直接打开检查，不再新建。",
            "向下找到本课“环境探针：先记录实验前提”的代码示例，复制从 using UnityEngine; 到最后一个右大括号的完整内容。双击新脚本，在打开的代码编辑器中全选原模板并替换，保存。若没有配置代码编辑器，可以在 Project 右键脚本选 Show in Explorer（在资源管理器中显示），用已有文本编辑器打开这个 .cs 文件，再替换保存；确认文件仍叫 EnvironmentProbe.cs，没有变成 .cs.txt。",
          "回到 Unity，等待代码编译完成，再看 Console。若红色错误文字包含 error CS 等编译信息，单击它可在下方面板查看完整错误、文件名和行号；已配置代码编辑器时可双击跳转。本课新探针出错时，先核对文件名 EnvironmentProbe.cs、类名 EnvironmentProbe，再重新完整替换本课示例并按 Ctrl+S 保存，回 Unity 等重新编译。未配置代码编辑器时，仍可用 Project 中的 Show in Explorer 打开已有文件，不必先学会完整的错误分析。若错误仍在，先保存完整错误文字、文件名与行号作为求助依据，不要随意删除代码或轮换设置。",
          "即使编译红字来自旧的 movePlayer.cs 等其他脚本，也会阻止项目正常进入 Play；只改新探针还不够。如果不理解旧工程的错误，可在 Unity Hub 的 Projects > New project 中选择 Unity 6.3 与已安装的2D或3D基础模板，在新文件夹创建独立学习项目，再从本课第一步操作。新建场景仍属于原项目，不能隔离原项目的编译错误。这里只要求新学习项目中的完整探针能编译，不要求你在第一课凭空修复旧游戏的所有错误。",
          "代码编译通过后，若 Hierarchy 已有本课的 Probe，就继续使用它；没有才用顶部 GameObject > Create Empty 建空对象并命名 Probe。Probe 只是我们起的名字，你也可以取别的名字；这个操作不会生成可见角色。",
          "选中 Hierarchy 的 Probe，若 Inspector 已有 EnvironmentProbe 组件就不再添加；没有时才点 Add Component，搜索 EnvironmentProbe 并添加一次。组件出现在 Inspector 中，才表示脚本已挂到该对象；Project 中只有脚本文件还不会执行。"
          ]
        },
        {
          "title": "运行探针并找到结果",
          "paragraphs": [
            "打开 Console，点 Clear 清除旧记录。Collapse 会把相同消息折叠在一起，本课先将它关闭，便于看到原始输出。点击编辑器顶部三角形 Play 按钮进入播放，再看 Console；同一个按钮再次点击即可停止。",
            "这个脚本的 Start 在实例符合启动条件时执行一次，所以一次 Play 应看到两条来自探针的日志，而不是每帧不断输出。第一条给出 Unity 的具体版本与平台，第二条给出 fixedDeltaTime 和 timeScale。场景若还有其他组件输出，先按内容识别这两条。没有出现小人或动画是正常的：我们只创建了空对象并打印信息。",
          "记录时在 Console 单击第一条日志，按 Ctrl+C，再到笔记按 Ctrl+V；对第二条重复。若复制内容带调用栈或不方便整理，直接抄下 Unity、platform、fixedDeltaTime、timeScale 四个字段及其值也可以，并标上本轮设置。代码里的 Debug.Log 把内容送到 Console；Application 与 Time 提供本课读取的环境数据。目前只需把这段程序当作测量工具，后面再解释生命周期和不同时间值。"
          ]
        },
      {
        "title": "点击 Play 后没有两条日志，按顺序检查",
        "paragraphs": [
          "第一步先看是否真正进入 Play：顶部 Play 按钮应显示正在播放的状态；若 Unity 提示必须修复编译错误才能播放，就回到上一节的新探针恢复路线。Console 中单击红色错误读完整内容，区分本课 EnvironmentProbe.cs 与旧脚本，不把一切红字都交给新手盲改。编译通过后再开始下一步。",
          "第二步检查挂载和启用。停止 Play，在 Hierarchy 选 Probe，Inspector 应有 EnvironmentProbe 组件，而且只添加一次。Inspector 顶部对象名称旁的活动勾选、该脚本标题旁的启用勾选都应开启。如果 Probe 被拖到另一个对象下面，先展开并检查父对象的活动勾选也开启。本课可让 Probe 保持顶层，避免父级条件干扰。然后重新 Play。",
          "第三步检查日志有没有被隐藏。打开 Window > General > Console，将搜索框内容清空；在 Console 工具栏确认普通日志的开关已开启，它与黄色警告、红色错误的过滤图标并排。EnvironmentProbe 用 Debug.Log 输出普通日志，只显示错误时会把它们藏起来；Collapse 也先关闭，方便数清两条。",
          "第四步重新取得一次输出。若你是在 Play 之后点 Clear，Start 已经打印过，不会为了 Console 清空而再执行。先停止，再 Clear，最后重新点 Play；不要只盯着已清空的窗口等待。这时仍没有输出，回查正在使用的场景是否含那个已挂载的 Probe，以及文件是否保存为完整示例，并记录 Console 内容与 Inspector 设置后求助。"
        ]
      },
        {
          "title": "只改变固定步长，再比较两次运行",
          "paragraphs": [
            "停止 Play，打开顶部 Edit > Project Settings，左侧选 Time。Fixed Timestep 是每个固定更新步骤使用的游戏时间长度；0.02秒对应计划每个游戏秒50步，0.01秒对应100步。它不是画面一秒刷新多少次，也不是独立线程的真实20毫秒闹钟。",
            "抄下原 Fixed Timestep 与 Time Scale。先设 Fixed Timestep=0.02，Time Scale=1，清 Console 后 Play 并保存日志；停止，再只改 Fixed Timestep=0.01，清 Console 后重新 Play。因为日志只在 Start 打印一次，中途修改设置后不重播，旧日志不会自动更新。",
            "把两组日志并排，指出第二组的哪一个值改变。脚本读到了固定步长设置，却没有测渲染帧率、实际固定步调用次数或物理耗时；这些问题需要后面更合适的计数与测量。比较结束后停止 Play，恢复刚才抄下的原值，避免下一课继承了未说明的实验条件。"
          ]
        },
        {
          "title": "从具体问题进入官方文档",
          "paragraphs": [
            "手册适合先理解一个系统负责什么，脚本参考适合查某个成员的参数、返回值与使用限制。以本课为例，你可以沿参考链接查 Time.fixedDeltaTime 的含义，再与两次日志对照。读到“通常”“只在某条件下”时，把条件一起记下，不要只摘一个结论。",
            "探针没有报告全部环境。需要输入包版本时，到 Window > Package Management > Package Manager 查看已安装包；需要渲染管线与目标平台时，另外记录相应项目设置。先准确说明当前测到了什么，再补足新问题需要的信息。",
            "自测里还有一个 A/B 顺序的纸面例子：题目前会定义两个对象和各自打印的字母，它不是当前探针输出。连续运行十次只是作者选择的重复观察数量，用来检查当前结果是否稳定；无论重复多少次，都不能自行补出文档没有承诺的执行顺序。你暂时不用为这道题另写回调脚本。"
          ]
        },
        {
          "title": "把一次观察写成可以重做的记录",
          "paragraphs": [
            "用五项记录本课：问题是什么、运行前预测什么、只改了哪个条件、两次实际输出是什么、还不能据此回答什么。比如“第二次 fixedDeltaTime 从0.02变成0.01”，比“引擎变快了”清楚，因为后一句没有指出哪个环节变快，也没有测量。",
            "以后检查角色不动时，同样把过程拆开：是否读到输入，是否设置速度，位置是否变化，相机是否看到。每次观察决定下一步检查，不要同时更改许多设置后只说“现在能用了”。",
            "本课的5小时是阅读、搭建、重复比较、独立练习、自测与复盘的建议投入，可以分次完成。实验中的60分钟包含首次找窗口、处理文件和编译问题、整理记录，不要求某一步恰好耗时60分钟。读得快可以把时间用于重做与解释，不用等待网页计时来代替学习产物。"
          ]
        }
      ],
      "code": {
        "title": "环境探针：先记录实验前提",
        "language": "csharp",
        "filename": "EnvironmentProbe.cs",
        "source": "using UnityEngine;\npublic sealed class EnvironmentProbe : MonoBehaviour\n{\n    void Start()\n    {\n        Debug.Log($\"Unity={Application.unityVersion}; platform={Application.platform}\");\n        Debug.Log($\"fixedDeltaTime={Time.fixedDeltaTime}; timeScale={Time.timeScale}\");\n    }\n}",
        "explanation": [
          "代码示例的文件名与类名都是 EnvironmentProbe。首次操作时把完整内容替换进 Assets/Scripts/EnvironmentProbe.cs，保存并等 Unity 编译，再把它添加到场景空对象 Probe；具体步骤见正文。已按正文完成的读者只需检查，不要为代码示例或后面的实验再建脚本、对象或重复挂载。",
          "点击顶部 Play 后，到 Console 读取两条日志。Start 在本次实例启动时打印一次；脚本不生成图像或移动角色，也不测实际帧率。每次改设置后应停止再 Play，取得新一轮记录。"
        ]
      },
      "lab": [
        {
          "title": "建立独立实验场景",
          "minutes": 60,
          "steps": [
          "检查准备中选定的场景已经保存；在 Project 的 Assets/Scripts 找到唯一一份 EnvironmentProbe.cs。若正文中已经创建并替换完整代码，直接检查并继续；尚未做才按正文创建、替换和保存。回 Unity 等编译；出错时按正文的完整替换与错误记录路线处理。",
          "在 Hierarchy 选中同一个 Probe，检查 Inspector 中只有一个 EnvironmentProbe 组件。已经建好并挂载就直接继续；尚无 Probe 才用 GameObject > Create Empty 创建并命名，尚未挂载才用 Add Component 添加。不要为本步骤再建一个副本。",
            "在 Edit > Project Settings > Time 抄下原设置，设 Fixed Timestep=0.02、Time Scale=1；回 Console 点 Clear，关闭 Collapse，点顶部 Play。",
          "在 Console 单击一条日志后 Ctrl+C，到笔记 Ctrl+V，对另一条重复；也可直接抄四个字段及其值，标为“0.02基线”。然后点 Play 停止，解释为何 Game 没有出现可见角色；完全没有日志则按正文四步排查。",
            "只将 Fixed Timestep 改成0.01，其余条件不变；Clear 后重新 Play，保存两条新日志。停止后恢复原 Fixed Timestep 与 Time Scale。",
            "把两组输出并排，圈出改变的值，记录版本与平台；另注明本探针没有报告包版本、渲染帧率和实际物理耗时。"
          ],
          "result": "记录能证明固定步长设置变化，并指出它没有测量帧率。",
          "purpose": "把第一个探针从文件变成能运行的组件，并确认日志实际记录了哪些量。",
          "setup": [
            "停在非播放状态。先读本课“认识编辑器的六个窗口”一节，按页签名找到 Project、Hierarchy、Inspector 和 Console；它们的位置随布局改变，缺失时从 Window > General 中重开。若原项目仍有旧脚本编译错误，先修复或按正文在 Hub 新建独立6.3学习项目，新建场景不能隔离这些错误。",
          "在 Project 的 Assets 下检查 Scenes、Scripts 文件夹，已有就使用，没有才新建。用 File > Save As 将当前练习场景保存为 Assets/Scenes/L001_Environment.unity；已经保存为这份练习场景就直接继续。若当前是正式游戏场景，先用 File > New Scene 新建 Basic 或 Empty 场景，再另存。",
          "准备本课“环境探针”完整代码示例，阅读正文的创建与挂载指引即可。准备阶段不重复新建脚本和 Probe，正式步骤会检查它们；如果阅读正文时已做完，正式步骤同样只检查已有结果。全课始终复用同一份脚本和同一个 Probe。",
            "打开 Edit > Project Settings > Time，抄下原有 Fixed Timestep 和 Time Scale，再开始实验。"
          ]
        },
        {
          "title": "让结论对应实际测到的内容",
          "minutes": 60,
          "steps": [
            "用实验一的同一场景和探针，先在纸上写预测：“把固定步长减半后，探针中的哪个数会改变？画面帧率是否已被这个脚本测量？”",
            "再次分别用0.02与0.01运行，Time Scale 保持1；每次先停止、改设置、Clear，再 Play，避免用旧日志代替新观察。",
            "将原句“物理和画面都快一倍”拆开，逐项标注本课是否有对应证据。对未测量项写下一种下一步可采用的测量，而不猜测结果。",
            "打开本课 Time.fixedDeltaTime 参考页，找到固定步长的说明；把官方含义与自己的日志分别写入记录，说明二者如何对应。",
            "恢复原设置并保存场景。请另一位读者只看你的记录，指出从哪个窗口改了什么、怎样重新运行、结果在哪里；若无法重做，就补全漏掉的步骤。"
          ],
          "result": "能用明确设置和日志支持有限结论，说明仍需测量的内容，并留下无需口头解释的重做步骤。",
          "purpose": "用同一份探针的两次记录，练习为结论划定范围；现在还不要求你编写生命周期对照脚本。",
          "setup": [
            "继续使用实验一已能打印两条日志的 Probe，不更换代码、不添加角色。准备一张三列表：本次设置、日志记录、仍未测量的内容。",
            "从 Edit > Project Settings > Time 确认 Time Scale=1，Fixed Timestep=0.02。打开 Console，找到 Clear 与 Collapse，准备保存两次独立 Play 的日志。"
          ]
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
      },
      {
        "symptom": "点击 Play 后 Console 没有探针日志",
        "cause": "可能没有成功进入播放、对象或组件未启用、普通日志被过滤，或 Start 输出后又清空了记录。",
        "fix": "依正文四步依次检查编译与播放状态、唯一 Probe 的挂载及活动勾选、Console 搜索与普通日志过滤，最后停止、Clear、重新 Play。新探针编译错误先核对文件/类名并完整替换示例；不理解的旧工程错误可用独立6.3学习项目隔离。"
        }
      ],
      "exercise": {
        "brief": "任选本课一个问题，例如“只改 Fixed Timestep 会让本探针的哪些输出变化”，写出3个可观察的小问题，选1个完整重做；也可以提出关于 Play、日志或组件挂载的问题，不要求先会角色移动。",
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
          "explanation": "重复观察不能补出文档没有承诺的顺序。记录观察条件，再查官方规定。",
          "scenario": "这是一道纸面题：设场景中有两个空对象 OrderA、OrderB，它们及其父对象的活动勾选均开启；本题称这种状态为“活动”。各自脚本的 Awake 分别打印字母 A、B；现在只需把 Awake 理解为对象初始化时由 Unity 调用的那段代码，具体触发条件后面再学。项目没有人为设置这两种脚本的执行顺序。每次停止后重新 Play，共观察十次，想检查当前表现是否重复；十次是本次选择的观察数量，不要求你另外编写这组脚本。"
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
          "explanation": "成员页说明参数、返回值与调用限制，手册再补充系统背景。",
          "scenario": "你准备使用一个尚未学过的方法。现在需要知道它接收什么参数、返回什么、在哪些条件下可以调用，而不是仅模仿别人示例的写法。"
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
          "explanation": "这是学习活动预算，应记录实际投入与产物。",
          "scenario": "本教材把每课规划为5小时，并分给阅读、实验、独立练习、自测和复盘。学习者可以分多天完成，也会因基础不同而实际用时不同。"
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
        },
        {
          "label": "Time.fixedDeltaTime",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-fixedDeltaTime.html"
        },
        {
          "label": "Time project settings reference",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/class-TimeManager.html"
        }
      ],
      "summary": [
        "一次只检验一个问题，记录预测与实际结果。",
        "观察到的结果需要附带条件，不能自动变成引擎保证。"
      ],
      "teaching": {
        "question": "把 Fixed Timestep 从0.02秒改为0.01秒，探针打印的数值改变了，是否就能证明画面帧率也提高了？",
        "keyIdea": "设置值、实际执行和最终画面是不同的证据。先说清探针测到了什么，再判断它能支持哪个结论；没有测量的部分，不能顺带当成已经证明。",
        "walkthrough": [
          {
            "title": "让代码成为场景里的组件",
            "text": "首次只需一份 EnvironmentProbe.cs、一个 Probe 及一次挂载；已经建立就检查已有结果。正文会逐步说明 Project 建脚本、复制保存代码、Hierarchy 建空对象和 Inspector 添加组件的操作。"
          },
          {
            "title": "读第一次实际输出",
            "text": "打开 Console，清空旧记录后 Play。确认两条日志分别包含版本/平台和固定步长/时间缩放，然后停止播放。"
          },
          {
            "title": "改一个设置并重做",
            "text": "在 Edit > Project Settings > Time，只将 Fixed Timestep 从0.02改为0.01，保持 Time Scale=1，重新 Play 保存第二组输出，再恢复原值。"
          }
        ],
        "prediction": {
          "question": "第二次 fixedDeltaTime 变为0.01，能否只凭这两条日志认定画面帧率翻倍？",
          "answer": "不能。探针只读到了固定步长设置，没有统计画面每秒刷新次数。若要讨论帧率，需要另测渲染帧间隔或使用相应分析工具；本次对照只能支持已经测量的内容。",
          "scenario": "EnvironmentProbe 的 Start 只打印版本、平台、fixedDeltaTime 和 timeScale。第一次 Fixed Timestep=0.02，第二次为0.01；两次 timeScale 均为1，脚本没有计算每秒显示多少帧。"
        },
        "scenario": "你刚打开 Unity 6.3，本课先不制作角色。我们要在一个单独保存的场景中，让 EnvironmentProbe 脚本打印编辑器版本、固定步长和时间缩放，再只改变固定步长比较两次结果。Probe 是给场景空对象取的名字，不是菜单项或某种内置角色。",
        "purpose": "先建立一条可以亲手重复的验证流程：找到窗口、创建脚本、挂到对象、运行、读日志。此后讨论引擎规则时，就有办法区分实际观察与自己的推断。"
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
            "创建空对象后，可以命名和移动它，却不会自动出现角色画面。添加 SpriteRenderer 并指定 Sprite 资源，它才具备绘制精灵的条件；添加 Collider2D 或 Collider，才能分别为二维或三维物理提供接触形状。两套物理系统不能混用。GameObject 把这些组件组织到同一个对象上。",
            "容器并不替所有组件工作。Renderer 负责画面，Collider 描述形状，Rigidbody 参与物理运动，脚本执行自定义规则。遇到问题先找到负责该功能的组件，比把整个角色当成一个无法拆分的整体更容易排查。",
            "空 GameObject 也不是完全没有组件：它自带 Transform，用于保存位置、旋转、缩放和父子关系。Component 表示挂在对象上的组件；Behaviour 是其中带 enabled 开关的一类；MonoBehaviour 再提供供自定义脚本使用的生命周期入口。不是所有 Component 都继承 Behaviour，例如 Rigidbody 有自己的运动与模拟设置，不能把“所有组件都有相同的启用开关”当作规则。"
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
            "设想有一个带普通 speed 数值字段的移动脚本，A、B 两个对象分别挂它，会得到两个组件实例。改 A 的 speed 不会自动改 B。这里用 speed 解释实例概念；本课 ActiveStateProbe 没有这个字段，实际实验改用各自已有的活动与组件开关。脚本文件相同只说明行为定义相同，不表示运行中的字段只有一份。",
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
            "复制 Root/Child 组后，给两组临时命名 RootA/ChildA、RootB/ChildB。只改变 ChildA 的活动或组件勾选，再选 ChildB 核对它自己的设置。日志中看清对象名；遇到同名对象时再结合选中实例检查，不凭文字相同判断同一个方法重复执行。"
          ]
        }
      ],
      "code": {
        "title": "观察对象有效性",
        "language": "csharp",
        "filename": "ActiveStateProbe.cs",
        "source": "using UnityEngine;\npublic sealed class ActiveStateProbe : MonoBehaviour\n{\n    void OnEnable() => Debug.Log($\"{name}: OnEnable\");\n    void OnDisable() => Debug.Log($\"{name}: OnDisable\");\n    void Start() => Report();\n    [ContextMenu(\"Report state\")]\n    void Report()\n    {\n        Debug.Log($\"self={gameObject.activeSelf}, hierarchy={gameObject.activeInHierarchy}, enabled={enabled}\");\n    }\n}",
        "explanation": [
          "创建空父对象 Root 与子对象 Child，把 ActiveStateProbe 挂到 Child。选 Child 后，在 Inspector 的组件右上角三点菜单点 Report state，Console 会报告三个状态；命令直接调用普通方法，不代表禁用组件仍会收到 Update。"
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
          "result": "得到开关与各系统结果的对应表，不用不可见推断不存在。",
          "purpose": "把三个开关的影响分别落实到显示、接触和脚本日志。",
          "setup": [
            "File > New Scene 建 Basic 场景并另存。用 GameObject > 3D Object > Cube 创建 Cube；Inspector 可看到 Transform、Mesh Filter、Mesh Renderer、Box Collider。添加 ActiveStateProbe。",
            "如需观察接触：再建 Plane 作为地面，将 Cube 的 Position Y 设为2，并通过 Add Component 添加 Rigidbody，保留 Use Gravity；每轮停止后重新 Play 从同一起点落下。",
            "在 Inspector 顶部找到整个对象活动开关，再找到 Mesh Renderer 与 ActiveStateProbe 各自的组件开关，先确认三者都开启。"
          ]
        },
        {
          "title": "比较父子活动状态",
          "minutes": 60,
          "steps": [
            "建立Root/Child，Child保持自身开启，将探针挂Child。",
            "只关闭Root，从组件菜单报告Child状态，再开启Root并比较。",
            "复制整个Root/Child为RootA/ChildA与RootB/ChildB两组，只切换ChildA的组件勾选，再分别用Report state报告，核对ChildB设置没有自动同步。"
          ],
          "result": "解释自身开关与层级结果不同，并能识别独立实例。",
          "purpose": "把“子对象自己的设置”与“父级使它能否活动”分开。",
          "setup": [
            "非播放时用 GameObject > Create Empty 创建 Root，再创建空对象 Child，拖动 Child 到 Hierarchy 的 Root 名称上成为子对象；给 Child 添加 ActiveStateProbe。",
            "选中 Child，在 Inspector 的 ActiveStateProbe 右上角三点菜单找到 Report state。该命令是脚本声明的测试入口，可直接调用 Report，不等于引擎仍在调用 Update。",
            "复制整个 Root，命名 RootA、RootB；两组子对象分别改名 ChildA、ChildB。比较两组独立的活动/组件勾选，不需要不存在的自定义数值字段。"
          ]
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
          "explanation": "子对象自己的开关被保留，但父级关闭使它在层级中不活动。",
          "scenario": "Root 是父对象，Child 是其子对象；Child 名称旁的活动勾选为开，Root 的为关。这里问的是 Child 的 activeSelf 与 activeInHierarchy。"
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
          "explanation": "Renderer 的开关只负责相关显示，没有等同于关闭整个对象。",
          "scenario": "一个活动的 Cube 同时有 MeshRenderer、BoxCollider 和启用的脚本。只取消 MeshRenderer 组件标题旁的勾选，其他组件与 GameObject 活动开关不变。"
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
          "explanation": "类型定义可以相同，具体实例仍各有自己的状态。",
          "scenario": "场景里有 SoldierA、SoldierB 两个不同对象，各自挂同一种脚本。讨论的是该脚本的普通非 static 数值字段，没有额外代码同步它们。"
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
          "answer": "通常不需要。Child 自己的开启设置还在，父级恢复后它可以重新在层级中活动。",
          "scenario": "Hierarchy 中 Root 是 Child 的父对象；Child 自己名称旁的活动勾选保持打开。只取消 Root 的活动勾选，然后再把 Root 打开，期间不改 Child 自己的设置。"
        },
        "scenario": "场景里放一个立方体 Cube，它同时有负责画面的 MeshRenderer、负责碰撞形状的 BoxCollider 和本课 ActiveStateProbe。再把它拖到空父对象 Root 下。我们分别操作显示、脚本、整个对象三个开关，检查影响是否相同。",
        "purpose": "建立“对象由组件组合而成”的认识。以后遇到看不见、不会动或不能碰撞时，先定位负责该行为的组件。"
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
            "先把同一个 CubeTemplate Prefab 从 Project 拖到场景两次，分别命名 A、B。把 A 缩放改为两倍，这个属性可能形成实例覆盖，也就是 A 在此处另有数值。模板后来修改同一属性时，A 是否跟随变化受覆盖影响。查看覆盖提示，判断当前值来自模板还是实例。"
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
            "引用还可能指向文件内部的某个 Sprite，而非整张图片。重新切片以后，文件仍在，原来那帧却未必存在。排查时展开资源确认具体成员，并分清纹理、Sprite、AnimationClip 与 AnimatorController：它们的用途不同，缩略图相似也不能互换。",
            "可把一个资源引用分成两级身份来理解：GUID 找到资源文件，文件内部的标识再找到具体子资源。文件名像给人看的标签，身份才负责连接引用。因此改名不等于换资源，重新生成 meta 却可能相当于换了身份；同一张图仍在，也不能保证重新切片后的每个 Sprite 都保留原来的内部身份。"
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
          "result": "能解释源修改、实例覆盖、应用和撤销的不同方向。",
          "purpose": "看清模板传递、实例覆盖及 Apply/Revert 的方向。",
          "setup": [
            "在 Project 的 Assets 下创建 Prefabs 文件夹；GameObject > 3D Object > Cube 创建 Cube，将 Hierarchy 中的 Cube 拖入该文件夹生成 CubeTemplate.prefab。",
            "把 Project 中的 CubeTemplate.prefab 拖到 Hierarchy 两次，场景对象分别命名 A、B；选中 A 后在 Inspector 改 Transform Scale。",
            "选中实例时 Inspector 顶部可找到 Overrides。修改前先截图源与两个实例的 Scale；用 Box Collider 的 Size 作为另一项可独立观察的源配置。"
          ]
        },
        {
          "title": "核对保存位置与身份",
          "minutes": 60,
          "steps": [
            "播放时让生成脚本创建副本，并修改副本名字与位置。",
            "停止播放，对比Hierarchy、Prefab资源和场景未保存标记，说明哪些只是运行变化。",
            "在Unity内移动Prefab文件夹，检查引用及meta；不要在正式资源上删除meta试验。"
          ],
          "result": "分清临时实例、编辑保存和资源身份。",
          "purpose": "确认运行副本的寿命，以及在编辑器内移动资源时如何保留引用。",
          "setup": [
            "延用 CubeTemplate.prefab；它只能包含 Cube 本身的组件，不要把 PrefabSpawnProbe 挂到模板上。",
            "GameObject > Create Empty 创建 Spawner，添加 PrefabSpawnProbe；从 Project 将 CubeTemplate.prefab 拖进其 Template 字段。保存场景。",
            "打开 Hierarchy 与 Project 并排观察；仅在停止播放后，从 Project 内移动 Prefabs 文件夹。要查看 .meta，可对资源右键 Show in Explorer，查看而不删除。"
          ]
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
        "brief": "建立 CubeTemplate Prefab 与两个实例 A、B，给它们设置不同的 Transform Scale 或 Box Collider Size，标出各值来自源资源还是实例覆盖。这里只用已有组件，不需要生命脚本；观察目标身份时结合选中对象与引用，不能只看名字。",
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
          "explanation": "实例修改和写回源资源是两个步骤。",
          "scenario": "Project 中有 Enemy.prefab；场景里有从它拖出的实例 EnemyA。你只在 Hierarchy 中给 EnemyA 改名，尚未执行任何 Apply 覆盖操作。"
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
          "explanation": "稳定身份关系到已有引用，原文件名不能替代丢失的 meta。",
          "scenario": "某个图片或 Prefab 文件旁有一个同名 .meta 文件，其他资源已通过 Unity 建立对它的引用。这里讨论保留资源身份与导入配置所需的信息。"
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
          "explanation": "星号提示未保存修改，本身没有证明数据损坏。",
          "scenario": "编辑模式中，你移动了场景对象，但尚未再次保存场景；场景名旁出现星号。没有其他损坏或丢失证据。"
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
          "answer": "通常不会。资源身份和 meta 一起保留时，引用可以继续；丢失 meta 后不能只靠文件名保证。",
          "scenario": "Spawner 的 template 已指向 Project 中的 CubeTemplate.prefab。现在准备在 Unity 的 Project 窗口里把保存该 Prefab 的文件夹拖到另一个文件夹，不更名或删除 .meta 文件。"
        },
        "scenario": "Project 窗口中的 CubeTemplate.prefab 是模板资源；Hierarchy 中由它拖出的 A、B 是两个场景实例。第三个对象 RuntimeCopy 由 PrefabSpawnProbe 在 Play 后生成。三者让我们比较修改与保存发生在哪里。",
        "purpose": "避免把运行时改动、场景保存和模板修改混为一件事，也为以后安全地复用角色资源打基础。"
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
            "运行代码仍需在真正使用数据时检查必要条件。OnValidate 还可能在加载线程而非主线程调用，因此应只校验改变的数据，不要在其中创建场景对象或调用非线程安全的 Unity API。它本身也不负责保存；加载时算出的值，不等于已写回场景或 Prefab。示例只把 maximum 限到至少1，何时保存配置、何时重置 current，仍是另外两件事。"
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
          "编辑模式在 Inspector 配置 Maximum，进入 Play 后在 HealthStateProbe 右上角三点菜单点 Damage once；每点一次调用一次方法。Inspector 显示最大值配置，Console 的 config/runtime 显示配置与当前生命。停止后不会保存受伤进度，同一实例重新启用也不自动重跑 Awake。"
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
          "result": "用两个组件解释代码起点与保存配置，而非猜测编译失败。",
          "purpose": "用已有组件与新组件对照，识别保存配置与代码初值。",
          "setup": [
            "建立空对象 Existing，添加 HealthStateProbe，在 Inspector 将 Maximum 设为9，用 File > Save 保存场景。复制场景作为实验副本。",
            "打开 HealthStateProbe.cs，只在实验副本对应项目把声明初值5改为6，保存并返回 Unity 等待编译。新建空对象 Fresh，再 Add Component 添加同一脚本。",
            "组件右上角三点菜单里的 Reset 会重置配置；此操作先只对实验对象做，记录后可以 Edit > Undo。完成实验后还原示例初值5。"
          ]
        },
        {
          "title": "跟踪一次生命变化",
          "minutes": 60,
          "steps": [
            "播放后连续执行伤害，分别记录maximum与current。",
            "禁用启用组件，再关闭开启对象，记录是否新建实例及current是否改变。",
            "停止并重新播放，比较Awake初始化；再写出显式复活方法应重置哪些状态。"
          ],
          "result": "说明状态改变、重新启用与重新初始化的区别。",
          "purpose": "跟踪同一实例受伤、停用与重新开始时的状态。",
          "setup": [
            "选中挂有 HealthStateProbe 的对象，打开 Window > General > Console。进入 Play，先读 config 与 runtime 的初始化日志。",
            "在该组件右上角三点菜单选择 Damage once；每点一次调用一次伤害方法。Maximum 在 Inspector 查看，current 是未序列化字段，应读日志里的 runtime。",
            "找到组件勾选和 Inspector 顶部对象活动勾选，分别测试；每轮注明是原实例重新开启，还是停止后重新 Play。"
          ]
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
          "explanation": "已有实例保存值与代码初值是不同来源，比较新建组件更容易验证。",
          "scenario": "已有组件的 Maximum 被设为9并保存。随后把脚本声明中的初值改为6，等待 Unity 编译结束；没有 Reset、删除重加组件或明确写回字段。"
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
          "explanation": "OnValidate 是编辑器辅助，不替代运行初始化或保存策略。",
          "scenario": "编辑模式下，设计者可能在 Inspector 输入不合法的最大生命。你准备使用 OnValidate 进行配置校验，尚未涉及玩家存档或运行循环。"
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
          "explanation": "这样能区分配置、当前状态和修改入口。",
          "scenario": "角色需要可配置最大生命，进入游戏建立当前生命，受伤后逐次减少。希望从代码和日志判断每次修改由谁发起。"
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
          "answer": "不会仅因同一实例重新启用而重跑 Awake；需要复活时应提供明确的重置方法。",
          "scenario": "HealthStateProbe 已在本次 Play 中执行 Awake，随后通过组件菜单 Damage once 受伤。只取消再勾回同一个组件的启用开关，没有销毁或重新创建对象。"
        },
        "scenario": "一个对象已经挂了 HealthStateProbe，Inspector 中 Maximum 被你设成9并保存。代码仍写 maximum=5；它在 Awake 用配置建立 current，然后 Damage once 只减少 current。当前生命通过 Console 查看，并没有独立的 Inspector 字段。",
        "purpose": "让你能解释“数字从哪里来”：代码提供新组件起点，保存的数据提供配置，运行方法改变本次状态。"
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
            "NullReferenceException 常表示解引用了空引用；Unity 对象已被销毁后再访问，还可能出现 MissingReferenceException，具体诊断会受运行环境影响。读取 target.position 失败，只能先确定使用时目标不可用。它可能从未赋值，也可能查找失败，或在等待期间被别处销毁。应把异常类型、调用栈和引用来源一起看，不能仅凭报错行认定最早根因。",
            "双击错误后继续追问 target 在哪里获得、何时确认有效。应从失败使用处往前查，而不是删除报错行。必要引用缺失时，一次说明缺少什么并停止无效逻辑，比每帧重复异常更好；但真正修复仍需建立正确引用。",
            "本课 ReferenceProbe 特意在读取前检查 target，并用 Debug.LogError 主动报告 Missing target 后停用。它没有在该分支抛出 NullReferenceException；红色日志也可能是你主动写出的诊断。下面的异常讨论是未做此保护时的另一种情况，应先读清 Console 的具体内容再分类。"
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
          "将 ReferenceProbe 挂到 Probe。先保留 Target 为 None，Play 后检查一次 Missing target 诊断及对象上下文；再停止，把 Hierarchy 的 TargetCube 拖入 Inspector 的 Target 槽，重新 Play。Start 不会因你临时补引用而在同一实例自动重跑，禁用组件也没有替你补上引用。"
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
          "result": "三类故障使用不同入口，而非全部靠空值判断。",
          "purpose": "把不同故障放在可重复的场景中，避免用同一招处理所有问题。",
          "setup": [
            "在 Basic 场景创建空对象 Probe，添加 ReferenceProbe；再用 GameObject > 3D Object > Cube 创建 TargetCube，保持默认 MeshRenderer。",
            "选 Probe，在 Inspector 找到 Target 槽；赋值方式是将 Hierarchy 的 TargetCube 拖到该槽，不是把脚本文件拖入。第一轮先保持槽为 None。",
            "打开 Console。ReferenceProbe 只在 Start 运行一次；修改 Target 后应停止并重新 Play，不能只等待它自动重试。",
            "可见性测试先确认 Game 视图能看到 Cube；再改它的位置使其离开相机。若使用断点，先按所用代码编辑器的 Unity 调试说明配置，未配置时先用带上下文日志完成定位。"
          ]
        },
        {
          "title": "缩减到最小复现",
          "minutes": 60,
          "steps": [
            "给Probe添加父级和第二个同名实例，分别记录target指向谁。",
            "加入帧号与上下文，用断点查看一次调用的变量与调用栈。",
            "逐步去掉无关对象，每次确认问题仍在，最后写出两对象场景的完整操作步骤。"
          ],
          "result": "另一个人可按记录复现并验证修复。",
          "purpose": "写出别人也能重现的最小步骤，并识别同名对象中的正确实例。",
          "setup": [
            "复制 Probe 两份并分别设为不同 Target；可以先取不同名字做基线，再故意改为同名。创建一个空父对象，将其中一个 Probe 拖入其下。",
            "选中 Console 的一条日志：下方面板显示调用栈；日志传入 this，可通过对应对象上下文定位发出日志的组件。",
            "如果已配置 Unity 调试器，在 ReferenceProbe.Start 的检查处设断点，连接 Unity Editor 后进入 Play；否则先记录 Target 槽、对象位置及调用栈，不把未做的断点检查写成已完成。"
          ]
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
          "explanation": "错误位置说明使用失败，还应追查引用如何获取和何时失效。",
          "scenario": "某个未做空值保护的脚本在读取 target.position 时抛出 NullReferenceException。target 原本应由更早的查找或赋值提供；本题不是 ReferenceProbe 主动打印的 Missing target 日志。"
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
          "explanation": "日志和断点会扰动时间，Profiler 才提供相应耗时证据。",
          "scenario": "移动功能在复杂场景里偶尔变慢。你想测量正常运行中的脚本耗时，而大量 Debug.Log 或断点会改变运行节奏。"
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
          "explanation": "需要重走原触发步骤，不能只把证据隐藏。",
          "scenario": "已经能用固定步骤重现一个引用故障。现在修改了代码或配置，准备判断是否修复，而不是仅隐藏 Console 中旧记录。"
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
          "answer": "不能。Clear 只删记录；应按原步骤再次触发，并验证行为和错误两方面。",
          "scenario": "你运行未赋 Target 的 ReferenceProbe，Console 出现 Missing target。现在只点击 Console 的 Clear，尚未赋值，也未重新运行验证。"
        },
        "scenario": "Probe 挂 ReferenceProbe，Target 应引用另一个场景对象。代码已主动检查缺失引用，并用 Debug.LogError 报告；它不会在该分支抛出 NullReferenceException。另用可见 Cube 作为目标，才有条件检查相机之外的“不可见”故障。",
        "purpose": "根据编译失败、引用缺失、显示配置三类不同问题选择工具，修复后回到同一触发条件验证。"
      }
    }
  ]
});
