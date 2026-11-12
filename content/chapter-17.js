window.COURSE_MODULES.push({
  "id": "m17",
  "number": 17,
  "title": "Profiler 与优化",
  "subtitle": "用证据定位瓶颈，用实验验证收益",
  "description": "学习 CPU/GPU 时间、托管分配、资源内存和帧时间分布，完成可复现的优化报告，而非背诵性能禁忌。",
  "accent": "#527c63",
  "lessons": [
    {
      "id": "l081",
      "title": "CPU Timeline：先找等待，再找工作",
      "prerequisites": [
        "l080"
      ],
      "goals": [
        "用毫秒而非只用 FPS 分析帧预算",
        "区分主线程工作与同步等待",
        "在目标设备记录可复现基线"
      ],
      "theory": [
        {
          "title": "玩家感到卡顿时，先看一帧用了多久",
          "paragraphs": [
            "游戏大部分时间很流畅，却每隔几秒停一下，平均 FPS 仍可能看起来不错。因为平均值把短帧和长帧混在一起，无法说明那次停顿发生在哪里。先改看帧时间：60 FPS 对应约 16.7 毫秒一帧，偶尔一帧达到 80 毫秒，玩家就可能明显感觉中断。",
            "因此先选一个能重复的片段，例如角色沿相同路线移动 10 秒，记录正常区间和长帧。不要只挑全程最快的一帧，也不要把首次进入场景的创建成本混进稳定战斗。先固定设备、分辨率、质量设置和预热方式，后面的差异才容易解释。"
          ]
        },
        {
          "title": "Timeline 帮你看谁在做事、谁在等",
          "paragraphs": [
            "Profiler 的 CPU Timeline 用横向时间轴呈现各线程上的样本，条越长，表示这个样本覆盖的时间越长。假设主线程某帧有 4 毫秒实际工作，又等待了 12 毫秒，不能据此说它做了 16 毫秒计算，更不能把等待代码删掉就期待节省 12 毫秒。它可能在等 GPU、其他线程、垂直同步或帧率限制。应把主线程与相关线程的同一段时间对齐，检查等待期间谁在工作，再结合设置判断。不同线程会重叠运行，各条耗时不能直接全部相加当作一帧时间。",
            "例如改变帧率上限后，某段等待明显变化，而你的计算标记基本不变，就说明这段时间可能与限帧有关。相反，增加循环次数后计算标记逐步增长，才支持该循环消耗 CPU 的判断。把“看到一个长条”和“找到了可以优化的工作”分成两步。"
          ]
        },
        {
          "title": "用一个明确标记缩小查找范围",
          "paragraphs": [
            "本课用 ProfilerMarker 标出受控循环。标记名称表达这段工作做什么，Begin 与 End 或作用域包住同一项操作。这样在 Timeline 中能从大范围找到它，再查看它和父级的关系。标记不会把代码变快，只帮助你把测到的时间与某段行为对应起来。",
            "一次只改变 iterations，记录标记耗时怎样变化。保存结果字段，使实验有明确计算输出，但不要把这个人造循环的毫秒数推广成“某类游戏系统一定多快”。同样，若给每条微小语句都加标记，采样和阅读成本也会上升；先标出你真正需要区分的工作阶段。"
          ]
        },
        {
          "title": "编辑器与 Player 要分别看",
          "paragraphs": [
            "编辑器还在运行 Inspector、窗口绘制和其他工具，数据不完全等同发布程序。先在编辑器定位方向，再连接目标设备的开发构建复测，记录两者差异。目标设备不同、构建后端不同或分辨率不同，都可能改变瓶颈；不能只拿开发机编辑器结果决定手机预算。",
            "Deep Profiling 会加入更多观测，因此可能明显改变被测负载。它适合短时间追查调用，不适合直接拿来当发布版的性能承诺。找到路径后关闭额外诊断，再以相同场景重测，确认真正需要运行的代码仍表现出相同问题。"
          ]
        },
        {
          "title": "每次捕获都要带着下一步问题",
          "paragraphs": [
            "一份有用的记录不只是 Profiler 截图，还要说明所选帧发生什么、哪条路径可能限制帧时间，以及怎样区分其他解释。例如“降低分辨率后 GPU 时间下降”与“降低循环次数后 CPU 时间下降”，是两种不同的验证，不能只凭 FPS 变化判断同一个原因。",
            "本课完成时，你应能提出一个小而明确的下一步实验：只改一个变量，预测哪个标记变化，再比较实际数据。结果不符合预测就保留记录，调整解释。Profiler 是把猜测变成可检查问题的工具，不是出现长条后立即开始重写代码的命令。"
          ]
        }
      ],
      "code": {
        "title": "用稳定标记包围一段确定工作",
        "language": "csharp",
        "filename": "MarkerProbe.cs",
        "source": "using Unity.Profiling;\nusing UnityEngine;\n\npublic sealed class MarkerProbe : MonoBehaviour\n{\n    private static readonly ProfilerMarker WorkMarker = new ProfilerMarker(\"EngineLab.SensorWork\");\n    [SerializeField, Min(1)] private int iterations = 1000;\n    private float result;\n    private void Update()\n    {\n        using (WorkMarker.Auto())\n        {\n            float sum = 0f;\n            for (int i = 0; i < iterations; i++) sum += Mathf.Sqrt(i + 1f);\n            result = sum;\n        }\n    }\n}",
        "explanation": [
          "挂到空对象，逐步调整 iterations。结果字段保留计算输出，在 CPU Timeline 中查找自定义标记。",
          "这只是可调的 CPU 工作实验，不代表真实玩法的固定性能。记录环境后，再到目标设备开发构建复测。"
        ]
      },
      "lab": [
        {
          "title": "建立可重复基线",
          "minutes": 60,
          "steps": [
            "开始捕获前记录编辑器版本、设备、实际分辨率、质量设置、帧率上限和预热时长。",
            "捕获固定 iterations 下十秒数据，保存正常区间和尖峰。",
            "在 Timeline 找到自定义标记及其父级。",
            "比较编辑器与目标设备开发构建，记录差异。"
          ],
          "result": "得到有环境说明的两份捕获。",
          "setup": [
            "新建空场景与空对象 Work，挂 MarkerProbe，Iterations 留1000，打开 Window > Analysis > Profiler。",
            "在 CPU Usage 模块将下方视图切为 Timeline，开启记录并播放；查找 EngineLab.SensorWork。若找不到，先确认目标为当前编辑器并且组件启用。",
            "先约定预热时长和随后十秒的捕获区间，记录设备、分辨率、质量、VSync 与帧率限制。构建比较需已安装目标模块，启用 Development Build 并连接对应 Player。"
          ],
          "purpose": "十秒提供一段连续帧样本便于看波动，不是固定性能标准；编辑器与 Player 分开留档，避免把环境差异当算法差异。"
        },
        {
          "title": "定位而非猜测",
          "minutes": 60,
          "steps": [
            "先只改探针的 iterations，捕获相同运行区间，观察计算标记的毫秒变化，不同时改画质。",
            "改变帧率上限，观察等待标记而非只看 FPS。",
            "短暂启用 Deep Profiling，记录干扰后关闭。",
            "列出 CPU 工作、同步等待与 GPU 限制三种可能的区分实验。"
          ],
          "result": "能用一次下一步实验排除一个假设。",
          "setup": [
            "使用上一组同场景和捕获配置，另存基线。先保持画质、相机和帧率限制不动。",
            "在 Work 的 Inspector 只改变 Iterations，例如1000与10000，分别捕获同样长区间；这些数值只是制造不同工作量。",
            "恢复循环量后再改变帧率限制；Deep Profiling 只临时用于定位，完成后关闭并重新测量。"
          ],
          "purpose": "用两次彼此独立的改变区分计算增长与等待变化，避免一次改很多设置却无法解释收益。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "CPU 样本很长就去删循环",
          "cause": "未判断样本是计算还是等待。",
          "fix": "在 Timeline 沿线程依赖和等待标记追踪关键路径。"
        },
        {
          "symptom": "优化后 FPS 不变就认为无收益",
          "cause": "可能受垂直同步或帧率上限限制。",
          "fix": "比较相同条件下的工作毫秒和目标预算。"
        }
      ],
      "exercise": {
        "brief": "对自己的移动/感知场景加两个领域标记，提交基线、瓶颈假设和单变量实验，不先重写全部代码。",
        "deliverables": [
          "原始 Profiler 捕获",
          "环境与负载说明",
          "三条假设及验证顺序"
        ],
        "rubric": [
          {
            "item": "基线可复现",
            "points": 30
          },
          {
            "item": "等待与工作区分准确",
            "points": 30
          },
          {
            "item": "标记范围有意义",
            "points": 20
          },
          {
            "item": "假设可被实验推翻",
            "points": 20
          }
        ]
      },
      "quiz": [
        {
          "question": "平均 FPS 最容易遗漏什么？",
          "options": [
            "帧率上限永远是否开启",
            "偶发长帧及其分布",
            "所有帧执行顺序一定相同"
          ],
          "answer": 1,
          "explanation": "平均 FPS 可能掩盖少量明显长帧。帧时间分布和对应调用更能解释偶发停顿。",
          "scenario": "十秒捕获中大部分帧较短，少数帧明显更长，学习者目前只记录整段平均 FPS。"
        },
        {
          "question": "长等待标记说明应该优化等待函数本身吗？",
          "options": [
            "应该，最长标记就是最慢算法",
            "不一定，要结合限帧、其他线程和 GPU 找原因",
            "不必看别的线程，它已证明主线程计算过多"
          ],
          "answer": 1,
          "explanation": "等待通常有原因，应沿其他线程、GPU 和限帧条件查找依赖，不能直接把等待当成主线程计算热点。",
          "scenario": "Timeline 最长一段名字含 Wait。你要决定下一步调查方向，目前还不清楚被等待的对象。"
        },
        {
          "question": "Deep Profiling 时间能直接作为发布预算吗？",
          "options": [
            "能，细节越多数据就越接近发布",
            "不能，要考虑诊断干扰并重新测量",
            "只要取最快一帧就能抵消诊断开销"
          ],
          "answer": 1,
          "explanation": "详细诊断会改变负载。定位后应去掉额外观测，在接近实际发布的条件下重新测量。",
          "scenario": "为了定位调用栈，临时启用了 Deep Profiling。现在想拿这次带详细诊断的时间作为发布版本预算。"
        }
      ],
      "references": [
        {
          "label": "Profiler",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/Profiler.html"
        },
        {
          "label": "ProfilerMarker",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Profiling.ProfilerMarker.html"
        }
      ],
      "summary": [
        "帧时间和长帧分布比单个平均 FPS 更容易解释卡顿。",
        "先区分计算与等待，再在目标设备按同样条件复测。"
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
        "question": "平均 FPS 很高，却每隔几秒卡一下，应该先看哪个数字？",
        "keyIdea": "先看每帧耗时和长帧发生的阶段。Timeline 中的长时间既可能是计算，也可能是等待，必须结合相邻工作和运行设置判断。",
        "walkthrough": [
          {
            "title": "固定复现场景",
            "text": "预热后重复同一段 10 秒流程，保存正常帧和长帧，同时记录设备与质量设置。"
          },
          {
            "title": "区分等待和计算",
            "text": "在 Timeline 找受控循环标记，并查看它周围的等待、其他线程和帧率限制。"
          },
          {
            "title": "只改变一个条件",
            "text": "调整 iterations，观察标记毫秒数；再独立调整帧率上限，比较等待是否变化。"
          }
        ],
        "prediction": {
          "question": "看到等待标记最长，是否应该重写等待函数？",
          "answer": "不一定。先查它在等谁，以及是否受限帧、VSync 或 GPU 影响；长等待并不等于该函数计算太多。",
          "scenario": "CPU Timeline 中一个等待标记比自定义 EngineLab.SensorWork 更长。当前还没有检查 VSync、帧率上限、其他线程或 GPU 数据。"
        },
        "scenario": "场景里只有一个可调循环 MarkerProbe。平时看着流畅，偶尔一帧很长；你想知道卡顿是循环计算、等待其他线程，还是帧率限制造成。平均 FPS 无法把这些原因分开。",
        "purpose": "先学会读一帧里的工作与等待，再改一个条件验证原因，为后续优化提供可复测的起点。"
      }
    },
    {
      "id": "l082",
      "title": "托管分配与 GC：把尖峰还原成分配路径",
      "prerequisites": [
        "l081"
      ],
      "goals": [
        "解释分配、回收和对象存活的关系",
        "识别热路径中的隐含分配",
        "在证据支持下复用缓存"
      ],
      "theory": [
        {
          "title": "每帧创建小东西，为什么也值得观察",
          "paragraphs": [
            "一段 Update 每次创建小数组和字符串，单次看起来很少，但在每秒几十帧中会重复产生托管分配。GC.Alloc 样本说明这一位置分配了托管内存，并不表示这里立刻进行了完整垃圾回收。分配发生、对象不再使用、回收器处理它们，是相关但不同的过程。",
            "先测每帧分配量，再结合执行频率看每秒产生多少。例如某路径每帧分配 1 KB，60 FPS 下约为每秒 60 KB；是否需要优化，还要看目标设备、其他分配和长帧。不能只看到非零就重写所有代码，也不能因为单次数字小而忽略高频重复。"
          ]
        },
        {
          "title": "不要凭语法猜哪里分配",
          "paragraphs": [
            "不要只凭代码看起来短就判断没有分配。例如 int count=3 使用值类型；随后写 object boxed=count，数值需要放进可作为 object 引用的托管对象，这个过程称为装箱。反过来，声明一个结构体局部变量，并不自动等于每次都会在堆上分配。字符串拼接、捕获变量的闭包和部分集合调用也可能分配，但要按实际编译与调用路径核验。先用 Profiler 的分配调用栈定位，再解释是哪种转换或操作带来了内存。",
            "打开分配调用栈，找到真正产生内存的位置，再改一项重测。Debug.Log 本身也会带来构造文本和输出成本，若一边逐帧打印，一边声称已经测到算法的纯分配，就混入了诊断负担。实验先保留必要输出确认行为，再去掉高频日志进行正式比较。"
          ]
        },
        {
          "title": "复用缓冲区必须保留原来的结果",
          "paragraphs": [
            "常见优化是预先创建数组或集合，之后清空并复用，减少重复申请。但固定缓冲区可能装不下全部结果。假设原查询返回 25 个目标，数组只能装 16 个，分配确实少了，却可能漏掉距离最近的那个；这不是同一功能更快，而是功能变了。",
            "因此要同时检查有效数量、容量边界、过滤规则和目标选择结果。超出容量时可以扩容、分批或采用明确降级策略，但必须让调用者知道。测试应包含刚好装满和超出容量两种情况，而不能只在目标很少的场景里证明没有分配。"
          ]
        },
        {
          "title": "缓存节省时间，也会多留住东西",
          "paragraphs": [
            "把结果保存起来能减少重复计算，但还要规定谁持有、什么时候过期、什么时候释放。缓存角色列表若从不移除已退出角色，就会把性能优化变成状态和引用问题。容量开得很大也会增加常驻内存，并不因为叫“预分配”就没有成本。",
            "本课比较小容量扩容与过大容量常驻两种情况，同时看分配率和内存。选择依据应是实际峰值和可接受开销，而不是让 GC.Alloc 显示零的单一目标。增量 GC 能分摊部分工作，却不意味着完全没有停顿或无需控制分配；仍要查看目标环境的实际帧时间。"
          ]
        },
        {
          "title": "测量工具也有自己的资源",
          "paragraphs": [
            "ProfilerRecorder 需要按示例启停和释放。某计数器在目标平台不可用时，Valid 为 false，应标明未获得数据，不把默认数字写成测量结果。重复启停探针，可以检查有没有把诊断资源一直留下，以及禁用后是否仍在产生日志。",
            "最后一份报告至少同时给出行为结果、分配来源、改动前后分配量和帧时间，再说明增加了多少缓存及其清理规则。若分配下降但尖峰没改善，要继续查真正瓶颈；若结果漏目标，先修正确性。工具数字只有和完整行为联系起来，才有优化意义。"
          ]
        }
      ],
      "code": {
        "title": "读取分配计数时控制日志频率",
        "language": "csharp",
        "explanation": [
          "挂到实验空对象，先确认计数器 Valid。若当前平台不可用，记录未测到，不把默认值当作真实分配量。",
          "每秒日志也有开销。正式比较时减少输出，结合 Profiler 查看路径；重复启停组件，核对 Recorder 已释放。"
        ],
        "files": [
          {
            "filename": "AllocationCounterProbe.cs",
            "source": "using Unity.Profiling;\nusing UnityEngine;\n\npublic sealed class AllocationCounterProbe : MonoBehaviour\n{\n    private ProfilerRecorder allocated;\n    private float nextReport;\n    private void OnEnable()\n    {\n        allocated = ProfilerRecorder.StartNew(ProfilerCategory.Memory, \"GC Allocated In Frame\");\n    }\n    private void Update()\n    {\n        if (!allocated.Valid || Time.unscaledTime < nextReport) return;\n        nextReport = Time.unscaledTime + 1f;\n        Debug.Log($\"Previous sampled frame allocated bytes: {allocated.LastValue}\", this);\n    }\n    private void OnDisable() => allocated.Dispose();\n}"
          },
          {
            "filename": "AllocationWorkProbe.cs",
            "source": "using UnityEngine;\n\npublic sealed class AllocationWorkProbe : MonoBehaviour\n{\n    [SerializeField] private bool reuseBuffer;\n    private readonly int[] cached = new int[64];\n    private int result;\n    private void Update()\n    {\n        int[] values = reuseBuffer ? cached : new int[64];\n        int sum = 0;\n        for (int i = 0; i < values.Length; i++)\n        {\n            values[i] = i;\n            sum += values[i];\n        }\n        result = sum;\n    }\n}"
          }
        ]
      },
      "lab": [
        {
          "title": "制造并追踪短命分配",
          "minutes": 60,
          "steps": [
            "运行给出的 AllocationWorkProbe，先保持 Reuse Buffer 关闭，在 Update 的 new int[64] 路径观察短命分配；字符串分配可作为后续独立扩展。",
            "用 GC.Alloc 调用栈定位临时数组，记录采样帧分配；若要每秒总量，另对这一秒所有帧求和，不能把探针的一条日志当总量。",
            "控制日志后复测，排除日志污染。",
            "把可复用数据移入预分配集合，保持工作结果一致。"
          ],
          "result": "分配减少有对应代码路径证据。",
          "setup": [
            "新建空对象 AllocationLab，分别保存并挂 AllocationCounterProbe 与 AllocationWorkProbe。后者每帧填64个整数；Reuse Buffer 不勾选时新建数组，勾选时复用。",
            "打开 Window > Analysis > Profiler，查看 CPU Usage 中 GC.Alloc 的调用路径；需要调用栈时只开启相关分配捕获选项。Console 的每秒探针日志用于辅助，不代表整秒分配总和。",
            "两版均保留64个元素和同一求和工作。先不勾 Reuse Buffer 捕获，再勾选重测；正式比较时停用日志探针，避免日志自身分配混入。"
          ],
          "purpose": "用同样计算量制造和移除临时数组，先确认分配路径，再比较变化；不要把一个采样帧的字节数直接乘成未经验证的整秒数据。"
        },
        {
          "title": "检查缓存代价",
          "minutes": 60,
          "steps": [
            "分别用较小与明显过大的预分配容量运行同样查询，记录扩容、结果数和常驻内存。",
            "重复启停探针，确认 ProfilerRecorder 被释放。",
            "给每个缓存写所有者、失效和释放规则。",
            "比较分配率、尖峰、目标命中数，确认功能没有缩水。"
          ],
          "result": "优化报告同时覆盖 CPU 与内存代价。",
          "setup": [
            "保留上一组正确工作的探针，记录预分配数组在组件存活期间会一直占用空间。",
            "容量与目标漏选属于扩展实验：另准备固定25个候选，比较容量16和足够容量的查询，记录 API 返回数量及截断规则。",
            "通过组件勾选重复启停 AllocationCounterProbe；先用两轮验证启停路径，再增加轮数看是否累积。每份缓存另写所有者、失效与释放条件。"
          ],
          "purpose": "比较少分配的收益与缓存常驻代价，同时检查容量边界，避免用漏结果换来好看的 GC 数字。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "分配下降了，内存却持续上升",
          "cause": "缓存或池没有容量边界和释放规则。",
          "fix": "跟踪存活对象与常驻容量，增加生命周期策略。"
        },
        {
          "symptom": "移除 LINQ 后仍然卡顿",
          "cause": "未证实分配是关键瓶颈，或日志和原生资源占主要开销。",
          "fix": "回到调用栈与帧时间证据，不按语法特征猜测。"
        }
      ],
      "exercise": {
        "brief": "优化一个已证明每帧分配的查询，但保持命中结果完全一致，并记录缓存的最大容量和失效策略。",
        "deliverables": [
          "前后分配调用栈",
          "功能结果对照",
          "缓存寿命与内存成本说明"
        ],
        "rubric": [
          {
            "item": "瓶颈有证据",
            "points": 25
          },
          {
            "item": "结果一致",
            "points": 30
          },
          {
            "item": "分配收益可重复",
            "points": 25
          },
          {
            "item": "缓存成本受控",
            "points": 20
          }
        ]
      },
      "quiz": [
        {
          "question": "GC.Alloc 样本代表什么？",
          "options": [
            "这个位置产生了托管分配",
            "这个位置完成了一次完整 GC",
            "这个位置申请了所有 GPU 纹理"
          ],
          "answer": 0,
          "explanation": "GC.Alloc 指向托管分配位置。分配和垃圾收集相关，但不是同一个事件。",
          "scenario": "Profiler 在创建数组的调用位置显示 GC.Alloc；这题只解释该样本本身，并没有给出收集事件。"
        },
        {
          "question": "预分配巨大池子是否总更好？",
          "options": [
            "是，容量越大越不需要管理",
            "否，常驻内存和清理工作也有成本",
            "是，只要 GC.Alloc 为零就能忽略总内存"
          ],
          "answer": 1,
          "explanation": "预留过多空间会增加常驻内存，缓存还需要管理失效和释放，不能只看分配次数。",
          "scenario": "为避免扩容，开发者准备把常用几十项的缓存预留成极大数组，希望以后不再分配。"
        },
        {
          "question": "优化查询时最关键的正确性检查是？",
          "options": [
            "固定数组装满就代表结果完整",
            "候选完整、过滤和目标选择仍符合原来的要求",
            "分配减少就可以忽略数组以外的目标"
          ],
          "answer": 1,
          "explanation": "减少分配不能以悄悄漏结果为代价。必须验证有效数量、容量和原来的过滤选择规则。",
          "scenario": "原查询应考虑25个有效目标，新版固定缓冲只能容纳16个；需要判断新版是否仍完成原任务。"
        }
      ],
      "references": [
        {
          "label": "ProfilerRecorder",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Profiling.ProfilerRecorder.html"
        },
        {
          "label": "Profiler",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/Profiler.html"
        }
      ],
      "summary": [
        "分配、存活和回收分别观察，不根据一条语法猜瓶颈。",
        "减少分配时保留结果完整性，同时管理缓存容量和退出。"
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
        "question": "把查询结果改成固定数组后 GC.Alloc 降了，为什么仍可能是错误优化？",
        "keyIdea": "复用缓冲区可以减少分配，但容量不足可能丢结果。优化需要同时保持候选完整性、选择规则和实际行为。",
        "walkthrough": [
          {
            "title": "记录原始结果",
            "text": "原查询本次有 25 个有效目标，保留最终选择，作为比较依据。"
          },
          {
            "title": "检查缓冲边界",
            "text": "改用容量 16 的数组，确认 API 返回数量与截断语义，不把数组装满当成结果完整。"
          },
          {
            "title": "复测相同功能",
            "text": "明确处理超过容量的情况后，逐项验证最终目标选择没有变化，再比较托管分配量与实际帧时间。"
          }
        ],
        "prediction": {
          "question": "出现 GC.Alloc 样本，是否说明此刻发生了一次完整 GC？",
          "answer": "不是。该样本说明产生托管分配；回收发生的时机和开销要用相应数据另外检查。",
          "scenario": "Profiler 在某个函数下面显示 GC.Alloc 样本，当前只看到分配记录，尚未查看垃圾收集阶段或其耗时。"
        },
        "scenario": "一段每帧查询会创建临时集合。你改成容量16的复用数组后，分配少了，但某次原本有25个目标，数组可能装不下。现在既要查 GC，也要确认没有漏目标。",
        "purpose": "看懂托管分配从哪里来、回收发生在哪里，并把减少分配与功能完整、常驻内存一起评价。"
      }
    },
    {
      "id": "l083",
      "title": "渲染性能：CPU 提交、GPU 像素与批处理",
      "prerequisites": [
        "l055",
        "l081"
      ],
      "goals": [
        "区分渲染 CPU 与 GPU 瓶颈",
        "用分辨率和可见对象做对照实验",
        "解释批处理和材质变化的条件"
      ],
      "theory": [
        {
          "title": "为什么 Draw Call 减少，帧时间却没变",
          "paragraphs": [
            "一帧渲染包含 CPU 准备和提交工作，也包含 GPU 处理顶点、像素和各种效果。Draw Call 是观察的一项计数，不是整帧成本的总分。假设瓶颈在大量透明像素反复覆盖，减少少量提交次数可能并不缩短最慢阶段，帧率自然未必提高。",
            "先查看 CPU 与可用的 GPU 时间，再提出具体假设。你想知道的是当前设备在哪个阶段忙不过来，而不是让某个统计尽量小。渲染管线、Shader 和平台会改变可用机制；本教材使用 URP，不能把内置管线或另一个版本的结论直接当作当前保证。"
          ]
        },
        {
          "title": "用分辨率区分一部分像素工作",
          "paragraphs": [
            "保持摄像机、场景和质量设置不变，只降低渲染分辨率。像素数量减少，某些像素计算和带宽负担也会下降。记录实际渲染尺寸，不要把编辑器窗口大小和内部渲染分辨率当成同一个值。若 GPU 帧时间明显改善，就为像素相关负载提供了线索；但这不能直接证明所有 CPU 代码都没问题，也不能在未取得 GPU 数据时过度确定原因。",
            "然后恢复分辨率，只减少对象数做第二组实验。对象减少往往同时改变提交、阴影和屏幕覆盖，所以要记录这些伴随变化。对照不是为了给每种改动贴上单一标签，而是逐步缩小可能原因。一次改变多个画质开关，虽然可能更快，却很难说明究竟为什么。"
          ]
        },
        {
          "title": "共享材质和独立材质有什么后果",
          "paragraphs": [
            "多个 Renderer 可以共享同一材质资源。访问 Renderer.material 时需要注意可能得到用于该 Renderer 的材质实例；独立修改颜色不再等于修改所有共享者，但可能增加材质数量。既然自己创建或持有实例，就要明确在不用时由谁清理，避免只看画面正确。",
            "本课示例刻意展示实例的创建、使用和释放，不宣称这是最佳批处理方法。先确认 URP Shader 支持 _BaseColor，再与共享材质方案比较。Shader 不存在该属性时，改值无效果不能直接归因于渲染性能；基本配置正确后，才讨论它对批次和内存的影响。"
          ]
        },
        {
          "title": "批处理机制不是同一个开关",
          "paragraphs": [
            "SRP Batcher 和 GPU Instancing 都可能减少渲染开销，但处理的工作不同。可以先这样区分：SRP Batcher 重点减少兼容绘制之间重复准备渲染状态的 CPU 成本，不要求把它们变成一条 Draw Call；GPU Instancing 则在满足网格、材质、Shader 等条件时，让一次实例化绘制处理多个实例。因此看到 SRP Batcher 生效，Draw Call 数没有同比减少，并不自相矛盾。具体走哪条路径仍要查看当前 URP 和 Shader 的支持条件，再用 Frame Debugger 核对实际事件。",
            "透明物体通常还受到排序和重复覆盖影响，阴影与后处理则可能增加额外渲染工作。先分别降低某一效果，看时间和画面怎样变化，再决定质量取舍。只看批次数下降，可能漏掉透明像素或阴影实际仍占据主要预算的问题。"
          ]
        },
        {
          "title": "第一次尖峰与每帧负担分别处理",
          "paragraphs": [
            "第一次出现某种材质或效果时的尖峰，可能与首次准备或 Shader 相关；稳定运行每一帧都慢，则是另一种问题。比较数据时分别保留首次使用和预热后的区间，不能把一段预热前数据与另一段预热后数据混作同样条件。",
            "最后报告应包括设备、管线、分辨率、画面差异、CPU/GPU 时间，以及用 Frame Debugger 看到的关键事件。任何画质降级都要说明它减少了什么效果。你要交付的是一个能解释收益与视觉代价的选择，而不是一张单项计数变小、却看不出场景是否相同的截图。"
          ]
        }
      ],
      "code": {
        "title": "明确拥有并释放运行时材质实例",
        "language": "csharp",
        "filename": "OwnedMaterialProbe.cs",
        "source": "using UnityEngine;\n\n[RequireComponent(typeof(Renderer))]\npublic sealed class OwnedMaterialProbe : MonoBehaviour\n{\n    private Material owned;\n    private static readonly int BaseColor = Shader.PropertyToID(\"_BaseColor\");\n    private void Awake()\n    {\n        owned = GetComponent<Renderer>().material;\n        if (owned.HasProperty(BaseColor)) owned.SetColor(BaseColor, Color.cyan);\n    }\n    private void OnDestroy()\n    {\n        if (owned != null) Destroy(owned);\n    }\n}",
        "explanation": [
          "挂到使用 URP 材质的三维对象，先确认 Shader 有 _BaseColor 属性；缺少该属性时不能期待同样改色结果。",
          "示例展示独立材质实例由谁使用和释放。它不是通用合批建议，需与共享材质方案比较实际事件、内存和帧时间。"
        ]
      },
      "lab": [
        {
          "title": "区分像素与对象负载",
          "minutes": 60,
          "steps": [
            "固定摄像机、设备和画质，捕获同一画面的 CPU 与可用 GPU 时间，并保存截图。",
            "只降低渲染分辨率再捕获。",
            "恢复分辨率，只减少对象数，记录阴影和屏幕覆盖变化。",
            "用两组结果形成假设，并列出尚未排除因素。"
          ],
          "result": "结论包含证据与混杂变量。",
          "setup": [
            "在 URP 的独立三维场景创建 Cube，确认所用 Shader 有 _BaseColor，再挂 OwnedMaterialProbe；保留摄像机。",
            "打开 Window > Analysis > Profiler，固定相机、设备与质量。GPU 计时若不可用，写明未测到，不用 CPU 等待时间冒充 GPU 时间。",
            "为了研究屏幕覆盖，可加若干使用同一材质的对象或已有透明效果；先截图记录数量、覆盖与阴影。改变分辨率和减少对象必须分别做。"
          ],
          "purpose": "降低像素数量与减少对象数改变的工作不同；分别测量才能判断提交、像素或其他成本的线索。"
        },
        {
          "title": "检查批次断开",
          "minutes": 60,
          "steps": [
            "打开 Frame Debugger，选择同一帧中的实际绘制事件，记录材质与批次对应关系。",
            "比较共享材质与每对象实例材质。",
            "在当前 URP/Shader 下查看 SRP Batcher 和实例化的实际路径。",
            "对透明粒子或阴影逐项降级，保存画面对照。"
          ],
          "result": "机制解释与实际事件一致。",
          "setup": [
            "沿用固定画面，打开 Window > Analysis > Frame Debugger，启用后选择绘制事件，查看该事件的材质与原因。",
            "保存不挂材质探针的共享材质版本，再与每对象挂 OwnedMaterialProbe 的版本比较；不要在同一份资产上混改而丢失基线。",
            "核对当前 URP 与 Shader 的 SRP Batcher、GPU Instancing 条件；结束帧调试后再采集实际运行时间，透明效果或阴影每次只改一项。"
          ],
          "purpose": "把材质实例、具体渲染事件和时间变化连起来，检验机制是否真的适用于当前画面。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "Draw Call 少了但更慢",
          "cause": "忽略剔除、像素、阴影或 GPU 其他负载。",
          "fix": "比较关键路径毫秒与画面，不只比较一个计数。"
        },
        {
          "symptom": "运行时材质越来越多",
          "cause": "反复取得或创建材质实例而未管理寿命。",
          "fix": "明确实例所有者，缓存并释放自有实例。"
        }
      ],
      "exercise": {
        "brief": "为一个 URP 场景做分辨率、对象数量、阴影三组实验，提出一个保留主要视觉目标的质量档方案。",
        "deliverables": [
          "三组 CPU/GPU 捕获",
          "Frame Debugger 解释",
          "前后画面和质量取舍表"
        ],
        "rubric": [
          {
            "item": "瓶颈方向可信",
            "points": 30
          },
          {
            "item": "实验变量受控",
            "points": 25
          },
          {
            "item": "批处理前提准确",
            "points": 25
          },
          {
            "item": "视觉代价明确",
            "points": 20
          }
        ]
      },
      "quiz": [
        {
          "question": "Draw Call 少是否必然更快？",
          "options": [
            "必然，次数是渲染成本的全部",
            "不必然，要看当前瓶颈是否被减少",
            "只要材质数不变就必然"
          ],
          "answer": 1,
          "explanation": "提交次数降低是否有用，取决于它是否减少当前最慢阶段的工作。GPU 像素或其他瓶颈可能没有变化。",
          "scenario": "优化后 Draw Call 数下降，但透明覆盖、分辨率和阴影工作未必改变。现在评估是否一定提升帧时间。"
        },
        {
          "question": "Renderer.material 使用后应关注？",
          "options": [
            "是否产生材质实例，以及由谁释放",
            "它始终只是原资源引用，不会产生实例",
            "它一定自动启用最优合批路径"
          ],
          "answer": 0,
          "explanation": "使用 material 时要关注实例产生和清理，也要检查它是否改变共享关系及实际渲染路径。",
          "scenario": "一个组件通过 Renderer.material 获得材质并在 Awake 改色，这个对象之后会被销毁。"
        },
        {
          "question": "降低分辨率实验主要用于？",
          "options": [
            "证明 CPU 所有脚本都不再有瓶颈",
            "帮助诊断像素和带宽相关负载",
            "直接比较不同画质的视觉优劣而无需测时间"
          ],
          "answer": 1,
          "explanation": "降低分辨率减少像素数量，可帮助研究像素和带宽相关负担，但不能直接排除所有其他瓶颈。",
          "scenario": "摄像机与对象暂时固定，实验只降低渲染分辨率，并分别记录 CPU 与可用 GPU 时间。"
        }
      ],
      "references": [
        {
          "label": "Renderer.material",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Renderer-material.html"
        },
        {
          "label": "MaterialPropertyBlock",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MaterialPropertyBlock.html"
        },
        {
          "label": "Scriptable Render Pipeline Batcher in URP",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/SRPBatcher.html"
        },
        {
          "label": "Introduction to GPU instancing",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/GPUInstancing.html"
        }
      ],
      "summary": [
        "CPU 提交与 GPU 执行都要看，Draw Call 不是总成本。",
        "材质实例、批处理和画质变化要结合实际管线验证。"
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
        "question": "Draw Call 减少了，为什么透明粒子很多的场景仍可能一样慢？",
        "keyIdea": "提交次数只是渲染成本的一部分。透明覆盖、像素处理、阴影等可能仍限制 GPU，需要用受控对照判断当前瓶颈。",
        "walkthrough": [
          {
            "title": "固定画面",
            "text": "固定摄像机、设备、质量和分辨率，记录 CPU 与可用的 GPU 帧时间。"
          },
          {
            "title": "减少像素负担",
            "text": "只降低渲染分辨率，观察 GPU 时间变化，并保存对应画面以说明条件。"
          },
          {
            "title": "回查实际事件",
            "text": "恢复分辨率，用 Frame Debugger 检查粒子、材质和阴影的渲染事件，再单独改变一项。"
          }
        ],
        "prediction": {
          "question": "Renderer.material 改色成功，能证明它自动选择了最优批处理吗？",
          "answer": "不能。它可能涉及材质实例，正确改色与最优提交路径是不同问题；应检查实例数量和实际渲染事件。",
          "scenario": "对象的 Renderer.material 已成功把 URP 材质改成青色。你只验证了画面颜色，尚未检查材质实例数或 Frame Debugger 的实际事件。"
        },
        "scenario": "同一台设备上，许多透明效果叠在屏幕中央。你设法减少了绘制提交次数，画面却仍慢。另一方面，给每个物体用 material 改色又可能产生独立材质；这两类成本需要分别检查。",
        "purpose": "通过分辨率、对象与材质的单项对照，判断当前主要花时间的地方，再理解批处理能改善什么。"
      }
    },
    {
      "id": "l084",
      "title": "内存快照：从引用链找到资源滞留",
      "prerequisites": [
        "l070",
        "l082"
      ],
      "goals": [
        "区分托管、原生和 GPU 相关内存",
        "用稳定状态快照比较资源增长",
        "把资源释放与引用所有权联系起来"
      ],
      "theory": [
        {
          "title": "先问增加的是哪类内存",
          "paragraphs": [
            "反复进出关卡后，任务管理器里的进程内存高了。这是一个线索，却还不是“纹理泄漏”的证据。托管堆、原生对象、纹理、网格和内存分配器保留空间，反映的问题不同。快照的作用是把一个大数字拆成可以追查的对象和引用，而不是只换一个界面看总量。",
            "先明确要比较的指标和范围。如果关心纹理，就记录纹理数量、大小和仍被谁引用；如果关心托管对象，就检查对应类型及保留路径。某种内存没有立刻还给操作系统，也不自动证明应用中仍存在同样数量的有效资源。"
          ]
        },
        {
          "title": "相同稳定点才能看出趋势",
          "paragraphs": [
            "本课固定“菜单→关卡→菜单”的流程，先预热，再在第 1、5、10 次返回后的相同阶段记录。比较时先看具体对象类别：假设三次纹理数都是 80，说明这个计数在所测区间稳定；若是 80、120、170，就应继续找新增纹理的持有者。这些数字只是读表例子，不是测量结果。每次仍要等待同样的卸载和清理条件；一份快照在关卡还开着时取，另一份在菜单清理后取，两者就没有相同起点。",
            "预热后数量稳定，可能符合缓存设计；相同资源类型每次返回都新增一批，则值得追踪。但增长趋势仍不是根因，要继续看具体对象为什么留下。可选安装兼容的 Memory Profiler 获得更细引用信息；没有该工具时也应保留可得到的对象和阶段证据，不编造快照结论。"
          ]
        },
        {
          "title": "沿着引用链找一个具体保留原因",
          "paragraphs": [
            "例如临时关卡对象已销毁，但某个静态列表还保存它加载的资源或托管数据。快照中的保留路径帮助你找到这张列表。此时问题不是“清理次数不足”，而是代码仍明确持有内容。回到列表的创建、添加和清空位置，才能判断哪一步忘了结束。",
            "事件、缓存、材质实例和加载句柄也可能延长使用时间。先列一份资源清单：谁创建或取得、谁使用、谁最终释放。不同资源机制有不同操作，不能对所有内容统一调用 Destroy，也不能期待 UnloadUnusedAssets 卸载仍被有效根引用的资源。"
          ]
        },
        {
          "title": "对象池中的保留要分清活跃和空闲",
          "paragraphs": [
            "池会主动保留可再次使用的对象，因此池里有实例不一定是错误。但要记录空闲容量和仍借出的对象。示例限制闲置存储，却不能替调用方自动结束所有在外使用的对象；销毁池前，必须先安排它们归还或由明确代码销毁。",
            "如果每次进入关卡都创建新池，旧池又由常驻服务保留，数量就可能持续增长。检查的是池为何还被持有，而不是看到“池化”就把增长视为合理。容量应依据实际峰值和预算选择，既看创建开销，也看长时间保留的内存代价。"
          ]
        },
        {
          "title": "稳定内存合格，切换峰值仍可能超预算",
          "paragraphs": [
            "旧关卡尚未完全退出，新关卡资源已经开始进入时，两边可能短暂重叠。返回菜单后的内存可以很低，切换中最高点却可能超过设备预算。于是需要分别记录稳定点趋势和切换峰值，不能用前者正常来证明后者安全。",
            "修复后用相同流程重新取数，查看对应引用链是否消失、资源数量是否不再持续增加，以及峰值是否满足目标。一次成功清理只说明该路径的一次结果。最终报告保留阶段、次数、对象类别和限制，让别人能够复测，也让以后增加内容时知道该检查哪部分。"
          ]
        }
      ],
      "code": {
        "title": "池容量、可重复场景进退与静态持有观察",
        "language": "csharp",
        "explanation": [
          "BoundedPoolProbe保留原闲置容量逻辑；PoolCycleProbe记录本调用方借出的批次。两个组件放在MemoryContent的Pool上，Prefab字段指定自己制作的小Prefab。",
          "RepeatedMemorySceneProbe放在MemoryMenu的CycleLoader，只在你点击组件菜单时进入或返回。返回协程会显式调用ReturnBeforeSceneExit归还批次，再卸载内容场景、等待一次UnloadUnusedAssets；看到cleanup complete才算该轮结束。",
          "StaticTextureRetentionProbe放在MemoryMenu的TextureKeeper，通过菜单加载专用Resources纹理到静态字段。返回关卡不会替你清除此字段；释放菜单只清本探针的引用并做清理观察，不承诺编辑器全部引用都已消失。"
        ],
        "files": [
          {
            "filename": "BoundedPoolProbe.cs",
            "source": "using System.Collections.Generic;\nusing UnityEngine;\n\npublic sealed class BoundedPoolProbe : MonoBehaviour\n{\n    [SerializeField] private GameObject prefab;\n    [SerializeField, Min(0)] private int maxRetained = 16;\n    private readonly Stack<GameObject> idle = new Stack<GameObject>();\n    public GameObject Rent()\n    {\n        GameObject item = idle.Count > 0 ? idle.Pop() : Instantiate(prefab);\n        item.SetActive(true);\n        return item;\n    }\n    public void Return(GameObject item)\n    {\n        if (item == null) return;\n        if (idle.Count >= maxRetained) { Destroy(item); return; }\n        item.SetActive(false);\n        item.transform.SetParent(transform, false);\n        idle.Push(item);\n    }\n}"
          },
          {
            "filename": "PoolCycleProbe.cs",
            "source": "using System.Collections.Generic;\nusing UnityEngine;\n\npublic sealed class PoolCycleProbe : MonoBehaviour\n{\n    [SerializeField] private BoundedPoolProbe pool;\n    [SerializeField, Min(1)] private int count = 20;\n    private readonly List<GameObject> borrowed = new List<GameObject>();\n    [ContextMenu(\"Rent Batch\")]\n    private void RentBatch()\n    {\n        if (!Application.isPlaying || pool == null || borrowed.Count != 0) return;\n        for (int i = 0; i < count; i++) borrowed.Add(pool.Rent());\n        Debug.Log($\"Borrowed {borrowed.Count}; return this batch before renting again.\", this);\n    }\n    [ContextMenu(\"Return Batch\")]\n    private void ReturnBatch()\n    {\n        if (!Application.isPlaying || pool == null) return;\n        foreach (GameObject item in borrowed) pool.Return(item);\n        borrowed.Clear();\n        Debug.Log(\"Batch returned; inspect idle children after the destruction stage.\", this);\n    }\n    // 场景夹具在卸载前显式调用；public不表示引擎会自动调用。\n    public void ReturnBeforeSceneExit() => ReturnBatch();\n    private void OnDestroy()\n    {\n        foreach (GameObject item in borrowed)\n            if (item != null) Destroy(item);\n        borrowed.Clear();\n    }\n}"
          },
          {
            "filename": "RepeatedMemorySceneProbe.cs",
            "source": "using System.Collections;\nusing UnityEngine;\nusing UnityEngine.SceneManagement;\n\n// 挂在MemoryMenu的CycleLoader；MemoryContent必须在有效构建场景列表中。\npublic sealed class RepeatedMemorySceneProbe : MonoBehaviour\n{\n    [SerializeField] private string contentScene = \"MemoryContent\";\n    private bool busy;\n    private int completedRounds;\n\n    [ContextMenu(\"Enter Memory Content\")]\n    private void Enter()\n    {\n        if (!Application.isPlaying || busy) return;\n        Scene content = SceneManager.GetSceneByName(contentScene);\n        if (content.IsValid() && content.isLoaded) return;\n        StartCoroutine(LoadContent());\n    }\n\n    private IEnumerator LoadContent()\n    {\n        busy = true;\n        try\n        {\n            AsyncOperation operation = SceneManager.LoadSceneAsync(contentScene, LoadSceneMode.Additive);\n            if (operation == null) yield break;\n            yield return operation;\n            Scene content = SceneManager.GetSceneByName(contentScene);\n            if (!content.IsValid() || !content.isLoaded) yield break;\n            SceneManager.SetActiveScene(content);\n            Debug.Log($\"MemoryLab loaded: {contentScene}; next round={completedRounds + 1}\", this);\n        }\n        finally { busy = false; }\n    }\n\n    [ContextMenu(\"Return To Memory Menu\")]\n    private void Return()\n    {\n        if (!Application.isPlaying || busy) return;\n        Scene content = SceneManager.GetSceneByName(contentScene);\n        if (!content.IsValid() || !content.isLoaded) return;\n        StartCoroutine(UnloadContent(content));\n    }\n\n    private IEnumerator UnloadContent(Scene content)\n    {\n        busy = true;\n        try\n        {\n            foreach (GameObject root in content.GetRootGameObjects())\n                foreach (PoolCycleProbe batch in root.GetComponentsInChildren<PoolCycleProbe>(true))\n                    batch.ReturnBeforeSceneExit();\n            yield return null;\n            SceneManager.SetActiveScene(gameObject.scene);\n            yield return SceneManager.UnloadSceneAsync(content);\n            yield return Resources.UnloadUnusedAssets();\n            completedRounds++;\n            Debug.Log($\"MemoryLab cleanup complete; completedRounds={completedRounds}\", this);\n        }\n        finally { busy = false; }\n    }\n\n    [ContextMenu(\"Reset Completed Rounds\")]\n    private void ResetCount()\n    {\n        if (!Application.isPlaying || busy) return;\n        Scene content = SceneManager.GetSceneByName(contentScene);\n        if (content.IsValid() && content.isLoaded) return;\n        completedRounds = 0;\n        Debug.Log(\"MemoryLab completedRounds reset to 0 after warm-up.\", this);\n    }\n}"
          },
          {
            "filename": "StaticTextureRetentionProbe.cs",
            "source": "using System.Collections;\nusing UnityEngine;\n\npublic sealed class StaticTextureRetentionProbe : MonoBehaviour\n{\n    private static Texture2D retained;\n    private bool busy;\n\n    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]\n    private static void ResetStatics() => retained = null;\n\n    [ContextMenu(\"Hold Memory Test Texture\")]\n    private void Hold()\n    {\n        if (!Application.isPlaying || busy) return;\n        retained = Resources.Load<Texture2D>(\"MemoryProbeTexture\");\n        Debug.Log(retained != null ? \"MemoryLab static texture retained\" : \"Missing Assets/Resources/MemoryProbeTexture.png\", this);\n    }\n\n    [ContextMenu(\"Report Static Texture\")]\n    private void Report()\n        => Debug.Log($\"MemoryLab static texture held: {retained != null}\", this);\n\n    [ContextMenu(\"Release Static Texture And Clean\")]\n    private void Release()\n    {\n        if (Application.isPlaying && !busy) StartCoroutine(ReleaseAndClean());\n    }\n\n    private IEnumerator ReleaseAndClean()\n    {\n        busy = true;\n        try\n        {\n            retained = null;\n            yield return Resources.UnloadUnusedAssets();\n            Debug.Log(\"MemoryLab static field cleared; cleanup pass complete. Verify other holders separately.\", this);\n        }\n        finally { busy = false; }\n    }\n}"
          }
        ]
      },
      "lab": [
        {
          "title": "比较重复流程快照",
          "minutes": 60,
          "steps": [
            "按准备建立两个专用场景、加载夹具和池，先完成一次预热进退；看到cleanup complete后在菜单状态重置轮数。",
            "保持同一次Play，按Enter Memory Content→等待loaded→Rent Batch→Return To Memory Menu→等待cleanup complete执行一整轮；第1、5、10轮在该完成信号后记录。",
            "比较相同稳定点的对象种类与数量，区分预热缓存和持续增长。Count=20只是跨过闲置容量16，不代表应有20个对象一直保留。",
            "可选安装兼容Memory Profiler，跟踪一个增长资源的引用链；夹具已清理不等于所有共享资源都必须立刻消失。"
          ],
          "result": "得到带阶段标注的增长趋势。",
          "setup": [
            "本组独立建立MemoryMenu.unity、MemoryContent.unity，保存到Assets/EngineLab/Scenes，在File > Build Profiles的有效场景列表加入并启用两者。MemoryMenu保留摄像机，MemoryContent不放重复摄像机。不要挂第66课只自动运行一轮的AdditiveSceneProbe。",
            "MemoryMenu创建空对象CycleLoader，挂RepeatedMemorySceneProbe，Content Scene填MemoryContent。MemoryContent创建Pool，挂BoundedPoolProbe和PoolCycleProbe；自制一个小Cube Prefab拖入池的Prefab，Max Retained留16；驱动Pool引用指向同对象池，Count留20。保存两场景，只打开MemoryMenu开始Play。",
            "打开Window > General > Console并清空搜索。选CycleLoader，从组件⋮菜单Enter Memory Content进入，等MemoryLab loaded；再选MemoryContent的Pool，用驱动Rent Batch借20个，可先Return Batch检查闲置最多16个。没有三秒自动退出，观察完再选CycleLoader执行Return To Memory Menu。",
            "返回会自动归还本夹具在内容场景找到的全部PoolCycleProbe批次，等销毁阶段、卸载和清理；看到MemoryLab cleanup complete才记这一轮。先预热一轮，在菜单状态执行Reset Completed Rounds归零；随后不停止Play，重复进入→借出→返回，在completedRounds=1、5、10时记录Profiler Memory同项指标。"
          ],
          "purpose": "第1、5、10轮是趋势采样，帮助区分预热后稳定与持续增长；同一阶段才可比较，十轮无增长也不保证其他路径没有泄漏。"
        },
        {
          "title": "资源账本与峰值",
          "minutes": 60,
          "steps": [
            "列出专用场景的Prefab实例、材质、纹理、事件与加载操作各由谁创建、持有、归还、释放。",
            "在命名明确的Retention场景副本中，用TextureKeeper菜单加载自制MemoryProbeTexture并保留静态字段；完成一轮场景进退后报告该字段，观察它仍被持有。",
            "执行Release Static Texture And Clean，等完成日志再核对字段与资源证据；不要把字段为空直接当成全局内存必降。",
            "捕获整个加载/卸载过渡的峰值，与cleanup complete后的稳定点分开记录，解释两种数字各回答什么。"
          ],
          "result": "释放动作与引用链变化相互印证。",
          "setup": [
            "本组的“副本”专指将MemoryMenu、MemoryContent通过File > Save As保存为MemoryMenuRetention、MemoryContentRetention两个独立场景；原两场景保留不动。把副本加入有效构建列表，在副本CycleLoader将Content Scene改为MemoryContentRetention。不复制.cs文件、不创建同名类。",
            "自己制作一张小PNG，只作为实验数据，保存为Assets/Resources/MemoryProbeTexture.png。副本菜单场景创建TextureKeeper空对象，挂StaticTextureRetentionProbe；它没有Inspector纹理字段，避免额外场景字段成为另一条持有路径。",
            "只打开MemoryMenuRetention开始Play，从TextureKeeper菜单Hold Memory Test Texture加载并持有，再做一轮进入/借出/返回。收到cleanup complete后执行Report Static Texture，确认这条静态引用仍在；随后Release Static Texture And Clean，等static field cleared日志，再报告字段并比较资源证据。",
            "本例加载协议就是Resources.Load与解除自有静态引用后显式UnloadUnusedAssets，不涉及Addressables句柄。编辑器、Inspector或其他使用者可能仍持有纹理，字段为空只证明本路径解除。切换峰值另捕获进入到返回的全过程，不能只看完成日志后的稳定点。"
          ],
          "purpose": "用一条可主动建立、报告和解除的静态引用检验持有责任，再单独测过渡峰值。场景副本用于保存正常基线，实验只使用自制专用纹理，不改正式素材。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "GC 后纹理内存没降",
          "cause": "把托管回收等同于全部原生和图形资源释放。",
          "fix": "查资源引用、所有者和加载释放协议。"
        },
        {
          "symptom": "没有泄漏仍在切关时内存不足",
          "cause": "同时驻留旧新内容造成峰值超预算。",
          "fix": "测峰值并调整加载顺序和内容粒度。"
        }
      ],
      "exercise": {
        "brief": "为一条重复切关流程建立资源账本，消除一个主动制造的滞留，并量化峰值和稳定点。",
        "deliverables": [
          "三次稳定点对比",
          "引用链与修复说明",
          "资源所有权账本"
        ],
        "rubric": [
          {
            "item": "可比较快照",
            "points": 25
          },
          {
            "item": "根因沿引用定位",
            "points": 30
          },
          {
            "item": "释放协议正确",
            "points": 30
          },
          {
            "item": "峰值与趋势分开",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "预热后十次退出关卡，同一稳定点纹理数量持续增加，下一步最有价值的是？",
          "options": [
            "每帧增加清理次数",
            "追踪仍存活的引用和对应释放责任",
            "只看进程工作集是否最终下降"
          ],
          "answer": 1,
          "explanation": "在相同阶段持续增长值得追查，下一步是定位持有引用和相应资源机制，频繁清理不能替代这一步。",
          "scenario": "同一设备与内容已预热，十次都在返回菜单并完成同样清理后记录，某类纹理仍逐轮增长。"
        },
        {
          "question": "UnloadUnusedAssets 能清理仍被有效根引用的资源吗？",
          "options": [
            "能，清理操作会忽略所有字段引用",
            "不能用它替代解除错误持有",
            "多调用几次总能强制清除"
          ],
          "answer": 1,
          "explanation": "只要资源仍被相关规则认可的有效引用持有，就不能把清理操作当作解除错误引用的替代。",
          "scenario": "一个仍存活的服务字段持有纹理，你只请求 Resources.UnloadUnusedAssets，尚未解除该字段。"
        },
        {
          "question": "对象池应记录哪项？",
          "options": [
            "只记录池容器已经创建",
            "记录空闲容量及借出对象由谁管理",
            "只统计取出次数，不跟踪归还"
          ],
          "answer": 1,
          "explanation": "空闲对象和在外使用的对象都有管理成本，必须分别记录并安排池退出时的处理。",
          "scenario": "对象池有闲置栈，另有调用者正在使用一批借出对象；现在需要规定池退出时的清理。"
        }
      ],
      "references": [
        {
          "label": "Resources.UnloadUnusedAssets",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Resources.UnloadUnusedAssets.html"
        },
        {
          "label": "Object.DontDestroyOnLoad",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.DontDestroyOnLoad.html"
        }
      ],
      "summary": [
        "相同稳定点比较趋势，再沿引用链找到具体持有原因。",
        "稳定内存、切换峰值和反复进退的增长是不同问题。"
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
        "question": "预热后每次退关，纹理数量仍持续增加，下一步应该查哪里？",
        "keyIdea": "在相同阶段比较数量，再沿增长对象的引用链查谁仍在持有。解除错误持有并使用对应释放方式，才可能解决根因。",
        "walkthrough": [
          {
            "title": "固定比较时刻",
            "text": "每次都在菜单返回且规定清理完成后记录，不混入仍在关卡中的快照。"
          },
          {
            "title": "找到增长对象",
            "text": "比较第 1、5、10 次的纹理数量，挑出持续增加的一类并追踪引用。"
          },
          {
            "title": "验证释放责任",
            "text": "发现静态列表持有旧资源后，按退出流程清理，再用相同循环查看趋势。"
          }
        ],
        "prediction": {
          "question": "返回菜单后的内存稳定，是否说明切场景绝不会超内存？",
          "answer": "不能。新旧资源可能在过渡期重叠，最高点要另外测量；稳定点和峰值回答不同问题。",
          "scenario": "每次返回菜单并完成约定清理后，内存读数稳定；目前没有采集加载新关卡与卸载旧关卡重叠期间的最高值。"
        },
        "scenario": "你反复从菜单进入同一关卡再返回，想知道资源是否滞留。关卡有容量16的闲置对象池，实验每批借20个，归还后应区分池保留的对象、超额销毁的对象和仍在外借用的对象。",
        "purpose": "在同一流程阶段比较数量，沿引用找保留原因，避免把合理缓存当泄漏，也避免只看菜单稳定点而漏掉切换峰值。"
      }
    },
    {
      "id": "l085",
      "title": "一次完整优化：预算、等价性与收益复测",
      "prerequisites": [
        "l081",
        "l082",
        "l083",
        "l084"
      ],
      "goals": [
        "写出可证伪的性能假设",
        "保持优化前后行为等价",
        "形成包含代价和回退条件的报告"
      ],
      "theory": [
        {
          "title": "先说明为什么要优化",
          "paragraphs": [
            "“让代码更快”没有可判断的终点。若目标设备要求稳定 60 FPS，一帧大约只有 16.7 毫秒，且其中还要留给渲染、物理和其他系统。先用捕获确认当前哪段影响体验，再给它一个合理预算，才能判断改动是否值得，而不是为了消除看起来长的函数随意重写。",
            "本课只选一个已测到的热点，例如目标筛选。保存当前代码和数据作为可回退基线，记录设备、构建设置、目标数量、路线和预热时间。没有这些条件，改动前后一快一慢可能只是采样内容不同，不能说明优化成功。"
          ]
        },
        {
          "title": "把假设写成能被否定的话",
          "paragraphs": [
            "一个具体假设可以是：查询过程中反复创建结果集合，增加了托管分配；若改为一次遍历候选并直接保留最佳结果，分配应减少，同时最终目标不变。它同时指出原因、改动和预期指标。若分配减少但长帧没变，就说明这可能并不是当前主要瓶颈。",
            "对比时一次只做一个主要改动。若同时换算法、减少目标、降低画质，就难以知道收益来自哪里。实验不是为原计划寻找赞同证据；实际结果否定假设时，保留数据并调整下一步，比挑一帧最好成绩宣布成功更有价值。"
          ]
        },
        {
          "title": "速度比较之前先检查结果一致",
          "paragraphs": [
            "示例避免创建查询结果集合，但仍遍历全部指定候选。它不是自动建立空间索引，也不自动发现整个场景。比较时要给两版同样的候选、距离规则和无效目标处理。候选减少一半当然可能更快，却不再是同样工作量。",
            "边界尤其重要：没有目标、等距离目标、目标失效、数组包含空项，都要有明确预期。若改动后漏掉合法目标，应先修复。确实允许减少范围或降低精度时，可以把它作为明确的质量取舍报告，不能继续用“行为完全相同”的名称掩盖。"
          ]
        },
        {
          "title": "复测要看分布，也要去掉额外诊断",
          "paragraphs": [
            "复测时不要只挑一次最快值。假设连续 20 帧里，19 帧各为 10 毫秒，另一帧为 80 毫秒，平均仍只有 13.5 毫秒；单看平均值，会漏掉那次明显停顿。优化前后都应保留多个相同采样区间，同时看通常帧、长帧和目标标记。若还使用百分位，就写清采样数量和统计方法。首次使用与预热后的区间也要分开，避免拿一版的准备成本与另一版的稳定计算作不公平比较。",
            "在接近发布的设置下再测一次，确认日志、Deep Profiling 或其他诊断没有主导结果。收益若小于本次波动，就应写“尚未确认”，而不是强行给出精确百分比。新增缓存、常驻内存和代码复杂度也要记录，它们是这项收益的实际成本。"
          ]
        },
        {
          "title": "让另一个人能够重复你的结论",
          "paragraphs": [
            "报告至少包含问题、基线、假设、改动、功能比较、测量步骤、结果和限制。把场景、参数和运行入口说清，让另一位学习者照着复测；没有同伴时，也可以在干净起点按文档重新做一遍，查出依赖自己记忆却没有写下的步骤。",
            "若收益很小却明显增加维护负担，可以依据预算撤回，这同样是有效结论。保留选择原因和未来需要重测的条件，例如目标数超过某规模或换了设备。优化不是一次永久获胜：内容、引擎和硬件变化后，原来合理的折中仍需要用相同方法重新判断。"
          ]
        }
      ],
      "code": {
        "title": "可复用候选列表，保持完整遍历",
        "language": "csharp",
        "explanation": [
          "挂在传感器对象并显式配置候选列表。示例只查询这些候选，不替代场景查找或完整空间索引。",
          "查询避免创建结果集合，但保留遍历全部候选的行为。先验证最终目标一致，再测它是否改善当前热点。"
        ],
        "files": [
          {
            "filename": "NearestTargetProbe.cs",
            "source": "using System.Collections.Generic;\nusing UnityEngine;\n\npublic sealed class NearestTargetProbe : MonoBehaviour\n{\n    [SerializeField] private List<Transform> candidates = new List<Transform>();\n    public Transform FindNearest()\n    {\n        Transform best = null;\n        float bestDistance = float.PositiveInfinity;\n        Vector3 origin = transform.position;\n        foreach (Transform candidate in candidates)\n        {\n            if (candidate == null) continue;\n            float distance = (candidate.position - origin).sqrMagnitude;\n            if (distance >= bestDistance) continue;\n            bestDistance = distance;\n            best = candidate;\n        }\n        return best;\n    }\n}"
          },
          {
            "filename": "NearestQueryProbe.cs",
            "source": "using UnityEngine;\n\npublic sealed class NearestQueryProbe : MonoBehaviour\n{\n    [SerializeField] private NearestTargetProbe sensor;\n    [ContextMenu(\"Report Nearest Target\")]\n    private void Report()\n    {\n        if (sensor == null) { Debug.LogWarning(\"Assign the sensor first.\", this); return; }\n        Transform found = sensor.FindNearest();\n        Debug.Log(found == null ? \"No valid target\" : $\"Nearest={found.name}; position={found.position}\", this);\n    }\n}"
          }
        ]
      },
      "lab": [
        {
          "title": "写假设并建立对照",
          "minutes": 60,
          "steps": [
            "从已有 Profiler 捕获里选择一个实际热点，写出它影响的体验和允许占用的时间预算。",
            "写出机制、单变量改动和预期指标。",
            "记录正常及边界行为，保存可回退基线。",
            "以相同工作量采样三个区间。"
          ],
          "result": "优化开始前已有可证伪计划。",
          "setup": [
            "新建 Sensor 空对象，位置设(0,0,0)，挂 NearestTargetProbe 与 NearestQueryProbe，将驱动 Sensor 字段指向本对象组件。",
            "再建 TargetNear=(1,0,0)、TargetFar=(3,0,0)，在传感器 Candidates 列表按顺序拖入。组件菜单 Report Nearest Target 输出结果到 Window > General > Console。",
            "先加入一个空条目、交换等距离候选顺序等验证行为。给出的代码是完整遍历参考，不是已经证实更快的基准；性能研究从第81课捕获中选真实热点，保存原实现。"
          ],
          "purpose": "三个相同流程的采样区间用于看结果是否稳定，不能只挑最快一段；先有行为基线，速度对照才有意义。"
        },
        {
          "title": "复测与同行复现",
          "minutes": 60,
          "steps": [
            "只完成计划中的单项改动，先用相同候选与边界输入比较结果，再测速度。",
            "用相同设备和采样流程复测，记录分布。",
            "在接近发布设置下检查诊断开销。",
            "把步骤交给另一位学习者或按全新环境自行复现，记录无法重现的点。"
          ],
          "result": "报告包含收益、误差、代价与限制。",
          "setup": [
            "保存基线源码、固定候选列表和边界输入；如优化对象不是本课传感器，也要写出对应输入输出。",
            "先运行菜单驱动核对候选与最终目标，计时阶段关闭逐次日志，保持设备、分辨率、预热与工作量一致。",
            "把环境、步骤、数据和撤回方法写成新读者能复现的记录；找同伴复现，或自己换一个干净工作副本照步骤运行。"
          ],
          "purpose": "用独立复现暴露隐藏前提，再把时间分布、正确性和维护成本一起报告，不用某一次快帧代表整体收益。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "快了一倍却漏掉远处敌人",
          "cause": "工作量变化，比较不再等价。",
          "fix": "把目标集合与边界行为作为回归验证。"
        },
        {
          "symptom": "多项改动后不知哪项有效",
          "cause": "同时改变多个因素，失去归因能力。",
          "fix": "回退到基线，逐项实验并保存数据。"
        }
      ],
      "exercise": {
        "brief": "写一份别人能够复测的性能实验报告，只处理一个已经测到的瓶颈。若收益不足，可以保留证据并撤回改动。",
        "deliverables": [
          "预算与假设",
          "基线与改动版本",
          "前后等价性及性能证据",
          "代价和回退条件"
        ],
        "rubric": [
          {
            "item": "问题和假设明确",
            "points": 25
          },
          {
            "item": "行为等价验证",
            "points": 30
          },
          {
            "item": "数据可复测",
            "points": 30
          },
          {
            "item": "诚实说明取舍",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "优化后更快但漏目标，应怎样报告？",
          "options": [
            "只要更快就是成功",
            "行为不一致，先修复或说明明确的降级范围",
            "只要正常场景没漏就忽略边界"
          ],
          "answer": 1,
          "explanation": "漏目标说明行为改变了，先修复或明确接受的降级范围，再评价速度收益。",
          "scenario": "新查询用更短时间返回，但在候选较多时漏掉列表后半段中真正最近的目标。任务要求仍是考虑全部候选。"
        },
        {
          "question": "结果不支持原假设时应该？",
          "options": [
            "保留证据并修改假设",
            "只报告最快的一次以减少波动",
            "继续增加其他改动，直到数据看起来更快"
          ],
          "answer": 0,
          "explanation": "结果不支持假设时，应据此修订解释并保留反例；挑最佳帧会掩盖真实表现。",
          "scenario": "在同样候选、设备与采样流程下，新版没有减少原先预测的耗时。这个反例已复现，最快一帧之外也保留了完整区间数据。"
        },
        {
          "question": "收益很小但代码复杂很多，合理选择是？",
          "options": [
            "任何变快的改动都必须保留",
            "可以依据预算和维护成本撤回",
            "先继续增加缓存，不需要再测"
          ],
          "answer": 1,
          "explanation": "收益需要与预算和维护成本比较；小收益、高复杂度的改动可以合理撤回。",
          "scenario": "当前预算已满足，增加复杂缓存后的时间差与运行波动接近；团队要决定是否保留这次改动。"
        }
      ],
      "references": [
        {
          "label": "Profiler",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/Profiler.html"
        },
        {
          "label": "ProfilerMarker",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Profiling.ProfilerMarker.html"
        }
      ],
      "summary": [
        "先固定预算、工作量和结果，再比较单项改动的收益。",
        "收益不足或维护成本过高时，可以保留证据并撤回。"
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
        "question": "查询更快了，却偶尔漏掉最近目标，这算优化成功吗？",
        "keyIdea": "先确认工作量和结果相同，再比较速度。若允许功能降级，应把它作为明确取舍，而不能声称原行为已被无损加速。",
        "walkthrough": [
          {
            "title": "保存原始行为",
            "text": "固定同一组候选，记录空目标、等距离和失效目标等情况下的选择结果。"
          },
          {
            "title": "执行单项改动",
            "text": "改为一次遍历且不建结果集合，仍检查全部候选，不顺便缩小查询范围。"
          },
          {
            "title": "复测并报告代价",
            "text": "验证结果一致后，在相同设备多次测量，记录分配、帧时间和新增维护成本。"
          }
        ],
        "prediction": {
          "question": "只快了很少，代码却复杂许多，能选择撤回吗？",
          "answer": "可以。若当前预算已满足、收益不确定或维护代价更高，保留基线并说明原因是合理决策。",
          "scenario": "基线已满足预算，新版只测出很小且不稳定的收益，却增加较多复杂分支。代码与原始版本都已保存。"
        },
        "scenario": "传感器 Sensor 要从候选甲、候选乙中找最近者。你准备把“建立结果集合再排序”改为一次遍历，但必须保留空引用处理、等距离选择和全部候选，而非只挑前几个。",
        "purpose": "完成一次从预算、行为对照到复测的优化，并能在收益很小时有依据地保留或撤回改动。"
      }
    }
  ]
});
