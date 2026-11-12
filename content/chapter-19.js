window.COURSE_MODULES.push({
  "id": "m19",
  "number": 19,
  "title": "导航、Jobs、Burst 与 ECS",
  "subtitle": "理解并发和数据布局，再决定是否采用",
  "description": "把路径规划、任务依赖、原生容器、编译与数据导向架构放在各自边界里，用同等工作量比较可选技术。",
  "accent": "#527c63",
  "lessons": [
    {
      "id": "l091",
      "title": "AI Navigation：路径规划不是角色运动的全部",
      "prerequisites": [
        "l035",
        "l076"
      ],
      "goals": [
        "建立可行走表面并配置 Agent",
        "区分路径请求、路径状态和运动控制权",
        "处理未上网格与不可达目标"
      ],
      "theory": [
        {
          "title": "角色走不过门，先看导航表示",
          "paragraphs": [
            "场景里一扇门看着能过，导航角色却绕路。碰撞体、渲染模型和导航使用的可行走区域不是同一份表示。NavMesh 把适合某类代理通过的空间整理出来，路径计算基于这份结果，而不是每次看屏幕上有没有空隙。因此先显示导航网格，查看门口是否真的连通。",
            "烘焙时使用的代理半径，会影响导航系统认为角色需要多宽的通道。先只看平面几何：门宽 1.2 个世界单位，半径 0.8 的代理直径为 1.6，就不能因为视觉模型缩到很小而认为它能通过。实际烘焙还受采样精度等设置影响，因此这个算式用来说明尺寸关系，最终仍要查看门口的 NavMesh 是否连通。改变需要重新烘焙的代理设置后应重建并检查。本课先安装兼容的 AI Navigation 包，用 NavMeshSurface 制作平面、窄门和孤立平台三个对照。"
          ]
        },
        {
          "title": "提交目标、得到路径和到达是三个时刻",
          "paragraphs": [
            "SetDestination 返回 true，只说明目标请求被接受，不证明路径已经计算完成，更不证明角色到了。后续需要观察 pathPending、路径状态和剩余距离等条件，并按实际需求定义到达。例如仍在计算时，不能只凭一个暂时数值宣布失败或成功。",
            "完整路径能通向目标，部分路径只能到达某个可到位置，没有有效路径又是另一种情况。目标在孤立平台时，角色可能只能走到附近边缘。把“请求已收下”“当前路径可走到哪里”“角色是否停止并满足到达条件”分别显示，调试就不会只有一个含糊的到达布尔值。"
          ]
        },
        {
          "title": "沿着最小请求检查必要条件",
          "paragraphs": [
            "本课菜单先检查正在播放、目标存在、Agent 启用且位于导航网格上，然后才请求目标。每个检查都对应一个可观察问题。Agent 不在网格时，把目标换近一点未必有用；没有烘焙表面时，反复点请求也不会凭空生成一条路。",
            "先把目标放在同一连通区域，再放到不可达平台，记录请求返回与后续路径状态。然后让 Agent 离开网格重测，观察清楚的诊断。正常案例帮助理解基本流程，故障对照则告诉你应检查地形表示、初始位置还是路径计算，不用直接重写移动逻辑。"
          ]
        },
        {
          "title": "谁最终决定角色位置",
          "paragraphs": [
            "NavMeshAgent、动态 Rigidbody 和 Root Motion 都可能参与移动。如果它们同时直接写身体位置，结果可能抖动、穿插或被下一阶段覆盖。先决定谁最终驱动身体，再按官方支持方式让其他系统提供计划或跟随结果；改变脚本执行顺序不能代替这个决定。",
            "例如只让 Agent 驱动时，先验证导航流程。若改由物理移动，导航可以提供方向或路径，但需要设计相应同步；动画则根据实际运动表现。不同方案都有前提，本课不把一个简单 Agent 示例扩张为已经完成导航、物理、动画三者的完整角色控制器。"
          ]
        },
        {
          "title": "目标一直变化时，不要盲目重复请求",
          "paragraphs": [
            "追逐目标每帧都移动，不表示你必须每帧提交相同目的地。可以按目标变化距离、更新间隔或当前路径状态决定重算，同时考虑响应速度和计算成本。规则需要明确，例如目标只轻微抖动时保留现有路径，变化超过阈值再更新，而不是凭感觉选一个固定数字。",
            "还要规定被阻挡、部分路径和长期无法到达时怎样处理：继续等待、换目标还是报告失败。将这些状态和时间记录在日志中，才能区分规划有问题还是运动被其他系统覆盖。导航解决可达性和路线问题，完整行为仍要管理请求、执行与失败恢复。"
          ]
        }
      ],
      "code": {
        "title": "提交一次导航目标并验证状态",
        "language": "csharp",
        "filename": "NavigationRequestProbe.cs",
        "source": "using UnityEngine;\nusing UnityEngine.AI;\n\n[RequireComponent(typeof(NavMeshAgent))]\npublic sealed class NavigationRequestProbe : MonoBehaviour\n{\n    [SerializeField] private Transform destination;\n    private NavMeshAgent agent;\n    private void Awake() => agent = GetComponent<NavMeshAgent>();\n    [ContextMenu(\"Request Path\")]\n    private void RequestPath()\n    {\n        if (!Application.isPlaying || destination == null || !agent.enabled || !agent.isOnNavMesh)\n        { Debug.LogWarning(\"Need a running agent on a baked NavMesh and a destination.\", this); return; }\n        bool accepted = agent.SetDestination(destination.position);\n        Debug.Log($\"Request accepted: {accepted}; completion must be checked later.\", this);\n    }\n}",
        "explanation": [
          "先安装与编辑器兼容的 AI Navigation，用 NavMeshSurface 烘焙三维表面，并确认 Agent 初始就在网格上。",
          "播放中执行组件菜单只提交目标。随后另行观察路径计算、路径状态和到达条件，不能用返回值代替它们。"
        ]
      },
      "lab": [
        {
          "title": "烘焙参数与可达性",
          "minutes": 60,
          "steps": [
            "在独立三维场景建平面、窄门和孤立平台，再安装兼容 AI Navigation 并配置烘焙表面。",
            "使用 NavMeshSurface 烘焙，观察 Agent 半径变化后的通路。",
            "把目标置于可达与不可达区域，记录路径状态。",
            "移出网格后再次请求，确认诊断清楚。"
          ],
          "result": "路径状态与地形表示对应。"
        },
        {
          "title": "运动控制权对照",
          "minutes": 60,
          "steps": [
            "先移除其他位置写入者，只让 Agent 驱动角色，建立可以稳定请求与移动的正常基线。",
            "在副本中加入另一个位置写入者，观察冲突后移除。",
            "设计导航、物理或 Root Motion 主导的三种控制权方案。",
            "为请求处理中、部分路径和被阻挡状态写恢复规则。"
          ],
          "result": "能够区分规划问题和运动抢写。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "SetDestination 接受后角色仍未到目标",
          "cause": "请求接受不等于路径完成或目标可达。",
          "fix": "检查 pending、路径状态、停止距离和是否在网格。"
        },
        {
          "symptom": "导航角色抖动",
          "cause": "Agent、物理或动画同时写位置。",
          "fix": "选择唯一运动所有者并按方案同步。"
        }
      ],
      "exercise": {
        "brief": "做一名能报告不可达目标的导航角色，覆盖窄门、离网格、动态阻挡和目标切换四种情况。",
        "deliverables": [
          "烘焙参数与路径状态表",
          "运动控制权说明",
          "四种失败/恢复实验"
        ],
        "rubric": [
          {
            "item": "导航前提正确",
            "points": 25
          },
          {
            "item": "异步状态判断完整",
            "points": 30
          },
          {
            "item": "控制权无冲突",
            "points": 25
          },
          {
            "item": "失败反馈可操作",
            "points": 20
          }
        ]
      },
      "quiz": [
        {
          "question": "SetDestination 返回 true 是否证明已到达？",
          "options": [
            "是，返回时已完成移动",
            "否，只说明请求被接受",
            "否，但已保证得到完整路径"
          ],
          "answer": 1,
          "explanation": "请求被接受之后仍有路径计算和实际运动，因此 true 不等于完整路径或已到达。"
        },
        {
          "question": "烘焙半径会影响什么？",
          "options": [
            "哪些区域适合该尺寸代理通过",
            "只改变 Agent 在运行时的显示大小",
            "只改变渲染碰撞，不影响烘焙连通性"
          ],
          "answer": 0,
          "explanation": "代理半径参与可通过区域的表示，窄门能否连通需要结合烘焙结果检查。"
        },
        {
          "question": "Agent 和动态刚体同时写位置应先做什么？",
          "options": [
            "只把导航脚本调到最后执行",
            "明确最终运动者，再按支持方式同步",
            "提高物理频率就能自动协调"
          ],
          "answer": 1,
          "explanation": "先决定最终位置由谁修改，再设计同步；仅调整执行顺序或频率仍可能相互覆盖。"
        }
      ],
      "references": [
        {
          "label": "AI Navigation 2.0",
          "url": "https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/index.html"
        },
        {
          "label": "NavMeshAgent.SetDestination",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AI.NavMeshAgent.SetDestination.html"
        }
      ],
      "summary": [
        "请求被接受、路径算完和角色到达是三个不同阶段。",
        "路径依据导航网格，身体运动还要明确由哪个系统最终驱动。"
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
        "question": "SetDestination 返回 true，为什么角色仍可能到不了孤立平台？",
        "keyIdea": "返回值说明请求被接受。路径计算结果与实际到达需要后续检查，且路径依赖烘焙出的可达区域。",
        "walkthrough": [
          {
            "title": "先验证连通地形",
            "text": "安装兼容导航包并烘焙表面，Agent 初始位于网格，先给同一区域内目标。"
          },
          {
            "title": "检查请求后状态",
            "text": "提交请求后等待计算，观察 pathPending 和路径状态，不把返回 true 当作到达。"
          },
          {
            "title": "换成不可达目标",
            "text": "把目标移到孤立平台，对照部分或无效路径，并记录角色实际能到的位置。"
          }
        ],
        "prediction": {
          "question": "Agent 与动态刚体互相拉扯，调高物理频率能自动解决吗？",
          "answer": "不能。先明确谁驱动最终位置，再按支持方式同步导航、物理和动画；频率不能替你决定控制关系。"
        }
      }
    },
    {
      "id": "l092",
      "title": "Job System：任务依赖与原生容器寿命",
      "prerequisites": [
        "l078",
        "l081"
      ],
      "goals": [
        "区分主线程、作业调度与完成同步",
        "使用 NativeArray 的明确所有权",
        "解释依赖与 Complete 对并发收益的影响"
      ],
      "theory": [
        {
          "title": "把一段数值工作交给作业",
          "paragraphs": [
            "有数组 [1,2,3,4]，希望每个数乘 2。普通循环能做，IJob 也能描述这段工作。Job System 负责安排数据任务和依赖，不是让某个 MonoBehaviour 的 Update 自动变成线程。先选择不需要查场景对象的纯数据计算，才能清楚看到调度与结果之间的关系。",
            "本例的 Execute 遍历数组并改为 [2,4,6,8]。作业里不访问任意 GameObject，也不靠 Debug.Log 展示每个元素。主线程负责准备数据、提交任务和读取结果，让“做什么计算”和“什么时候可以使用结果”成为两个明确问题。"
          ]
        },
        {
          "title": "NativeArray 是数据入口，也是释放责任",
          "paragraphs": [
            "NativeArray 让符合条件的数据可供作业使用，但它涉及原生内存分配。把 NativeArray 结构体赋给另一个变量，通常只是复制访问同一底层分配的句柄，不是自动深复制整份数据。因此不能因为变量名字不同，就让两处各自随意释放同一块内存。",
            "分配器说明预期使用时间。示例使用 TempJob，并在本次操作完成后尽快 Dispose；更长寿命应选择合适分配器并遵守限制。分配、调度和释放放在同一段可追踪流程中，才能在异常或提前退出时仍有机会收拾，不把原生分配误认为总会由托管 GC 自动解决。"
          ]
        },
        {
          "title": "Schedule 只表示提交，不表示算完",
          "paragraphs": [
            "主线程调用 Schedule 后得到 JobHandle，可以把它理解为跟踪本次任务及其依赖的凭据。此时工作可能尚未开始或还没完成，不能立刻读取、修改或释放它正在使用的数据。调用 Complete 会确保相关任务完成，并按要求使主线程可以安全继续访问。仅观察 IsCompleted 不替代所需的 Complete；完成调用还涉及相关安全状态和内部记录的处理。",
            "本例故意紧接着 Complete，让初学者先得到明确顺序：填入 1 到 4，提交翻倍作业，完成后读取首项 2、末项 8，最后释放。立即等待在正确性上有用，却可能没有留下多少与主线程重叠的机会，所以不能据此宣称已经展示最佳并发性能。"
          ]
        },
        {
          "title": "两个作业需要按数据依赖连接",
          "paragraphs": [
            "若作业 A 把 [1,2,3,4] 翻倍为 [2,4,6,8]，作业 B 再求和，正确结果应是 20。B 不能在 A 尚未完成写入时读取同一数组。调度 B 时传入 A 的 JobHandle，就把“A 完成后 B 才能使用这些数据”交给调度器；主线程无需为了表达依赖，先 Complete A、再提交 B。最终主线程要读总和时，再完成 B 及其相关依赖。在这期间，主线程只能处理不与这些作业冲突的工作，不能把“已经连好依赖”误解成数据可以随时访问。",
            "ReadOnly 等声明帮助表达数据只读，具体并发仍要符合容器和安全规则。安全检查报错时，不应直接关闭检查来“修复”；先看是不是提前访问、依赖漏连或共享写入。结果偶尔正确不代表没有数据竞争，小数组可能只是让错误暂时没暴露。"
          ]
        },
        {
          "title": "并发收益要算上准备和同步",
          "paragraphs": [
            "4 个整数的工作太少，调度本身可能比计算更显眼。本课先用它验证顺序，再比较大数组与串行版本，保持输入输出一致。测量包括数据准备、调度、计算、完成等待和释放，不能只摘出工作线程的一小段时间就宣布整体加速。",
            "释放前始终确保相关任务已完成，失败路径也一样。本例 finally 再次完成后才释放，是为了把原生数据寿命收束在明确范围。最终你应能画出一条具体时间线：何时创建、谁在使用、何时允许读取、谁最终释放。理解这条线后，再尝试安排真正可重叠的工作。"
          ]
        }
      ],
      "code": {
        "title": "最小作业：完成后读取并释放",
        "language": "csharp",
        "filename": "JobOwnershipProbe.cs",
        "source": "using Unity.Collections;\nusing Unity.Jobs;\nusing UnityEngine;\n\npublic sealed class JobOwnershipProbe : MonoBehaviour\n{\n    private struct DoubleJob : IJob\n    {\n        public NativeArray<int> Values;\n        public void Execute()\n        {\n            for (int i = 0; i < Values.Length; i++) Values[i] *= 2;\n        }\n    }\n    [ContextMenu(\"Run Job Lab\")]\n    private void Run()\n    {\n        var values = new NativeArray<int>(4, Allocator.TempJob);\n        JobHandle handle = default;\n        try\n        {\n            for (int i = 0; i < values.Length; i++) values[i] = i + 1;\n            handle = new DoubleJob { Values = values }.Schedule();\n            handle.Complete();\n            Debug.Log($\"First={values[0]}, Last={values[3]}\", this);\n        }\n        finally { handle.Complete(); if (values.IsCreated) values.Dispose(); }\n    }\n}",
        "explanation": [
          "挂到空对象，确认项目可解析兼容的 Unity.Collections 和 Unity.Jobs；自定义程序集需配置相应引用。",
          "输入 1、2、3、4，完成后首项为 2、末项为 8。紧接 Complete 用于说明安全顺序，不代表最佳并发安排。"
        ]
      },
      "lab": [
        {
          "title": "所有权与正确性",
          "minutes": 60,
          "steps": [
            "播放中执行四元素作业菜单，先手算 [1,2,3,4] 翻倍结果，再对照完成后的日志。",
            "在实验副本中尝试未完成读取，观察安全检查。",
            "恢复同步后测试零长度和大数组。",
            "标出分配、调度、完成、读取和释放顺序。"
          ],
          "result": "没有未完成读取或原生内存滞留。"
        },
        {
          "title": "依赖与调度成本",
          "minutes": 60,
          "steps": [
            "设计作业 A 先改数组、B 再使用结果的过程，先画依赖箭头，再把 A 的句柄传给 B。",
            "与串行计算保持同样输入输出。",
            "分别测小数组与大数组，观察调度成本。",
            "提出可与主线程重叠的工作，而不提前读取结果。"
          ],
          "result": "收益结论有规模与同步条件。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "作业结果偶发错误或安全检查报错",
          "cause": "主线程或另一个作业在依赖未完成时访问同一数据。",
          "fix": "建立句柄依赖并在读取前 Complete。"
        },
        {
          "symptom": "作业更慢",
          "cause": "工作量太小、每帧分配或立即同步抵消并行收益。",
          "fix": "保留串行基线，测规模并重排真正可重叠工作。"
        }
      ],
      "exercise": {
        "brief": "把一个批量数值转换做成串行和作业两版，覆盖边界并提交依赖图、容器寿命和规模收益表。",
        "deliverables": [
          "参考实现与作业结果对照",
          "JobHandle 依赖图",
          "内存所有权与三种规模性能"
        ],
        "rubric": [
          {
            "item": "结果正确",
            "points": 30
          },
          {
            "item": "依赖同步合法",
            "points": 30
          },
          {
            "item": "释放责任明确",
            "points": 25
          },
          {
            "item": "收益有条件说明",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "Schedule 后立刻读取输出是否安全？",
          "options": [
            "总安全",
            "需先保证相关作业完成",
            "只要数组小就安全"
          ],
          "answer": 1,
          "explanation": "Schedule 只提交工作。访问相关数据前需按作业依赖确保完成。"
        },
        {
          "question": "复制 NativeArray 结构体是否自动深复制数据？",
          "options": [
            "是",
            "通常复制句柄，底层数据仍共享",
            "会立刻释放原数据"
          ],
          "answer": 1,
          "explanation": "结构体复制通常仍指向同一底层分配，不能把变量副本当成独立数据和独立释放责任。"
        },
        {
          "question": "立即 Complete 的主要性能限制是？",
          "options": [
            "必定结果错误",
            "减少可重叠并行时间",
            "禁止 Burst"
          ],
          "answer": 1,
          "explanation": "立即等待可以正确，但可能失去主线程与作业重叠的机会，未必带来更好整体性能。"
        }
      ],
      "references": [
        {
          "label": "IJob",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Jobs.IJob.html"
        },
        {
          "label": "JobHandle.Complete",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Jobs.JobHandle.Complete.html"
        }
      ],
      "summary": [
        "调度不等于完成，读取和释放前要正确处理作业依赖。",
        "NativeArray 副本可能共享分配，释放责任与性能都要明确验证。"
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
        "question": "作业已经 Schedule，为什么主线程还不能立刻读数组？",
        "keyIdea": "提交和完成是不同状态。主线程必须保证相关作业完成，才能访问结果或释放底层内存；句柄用于表达这段依赖。",
        "walkthrough": [
          {
            "title": "准备4 个元素",
            "text": "主线程分配 NativeArray，写入 [1,2,3,4]，明确这份分配由当前流程释放。"
          },
          {
            "title": "提交翻倍任务",
            "text": "Schedule 返回句柄，任务将执行乘 2；此时不提前读取或释放它使用的数组。"
          },
          {
            "title": "完成后使用结果",
            "text": "Complete 后检查 [2,4,6,8]，再 Dispose；失败清理路径也先确保任务结束。"
          }
        ],
        "prediction": {
          "question": "立刻 Complete 能保证结果正确，是否也说明并发收益最佳？",
          "answer": "不能。它可能让主线程马上等待，减少可重叠时间；性能还要连同调度和准备成本测量。"
        }
      }
    },
    {
      "id": "l093",
      "title": "Burst：编译优化的范围与证据",
      "prerequisites": [
        "l092"
      ],
      "goals": [
        "解释 Burst 与 Jobs 的关系",
        "识别可支持的高性能 C# 子集",
        "用正确基线评估编译收益"
      ],
      "theory": [
        {
          "title": "Jobs 决定什么时候做，Burst 优化怎样计算",
          "paragraphs": [
            "上一课已经能把数据计算提交给作业，现在想让符合条件的计算生成更高效机器代码，可以研究 Burst。它是编译器，和作业调度不是同一件事。给代码加 BurstCompile，不会自动把所有循环拆到多个线程，也不会替你连接依赖或释放数组。",
            "本课平方计算用 IJobParallelFor 表示按索引处理的任务，用 Burst 编译符合支持范围的代码。并行安排来自作业接口和调度，计算优化来自编译。分开理解两者，才能设计未 Burst、已 Burst、串行三组有意义的对照，而不是把所有收益都归给一个属性。"
          ]
        },
        {
          "title": "为什么先把数据整理成简单数组",
          "paragraphs": [
            "Burst 支持的是特定范围的 C# 与数据类型，不能假定普通托管对象、任意字符串或场景 API 都能原样进入。先把计算需要的内容整理成适合的值类型和原生容器，把场景读取与显示留在主线程。这种准备工作有成本，也应进入整体评估。",
            "示例 Input 和 Output 等长且不重叠。每个索引读取一个值，只写自己的输出位置，例如 -3 的平方是 9，0 的平方是 0。ReadOnly 与 WriteOnly 表达使用方向，但不会帮你自动修复长度不匹配或错误索引。也不要在写输出前把其中旧值当作输入，那已经违反本例独立平方的计算设计。先检查结果和边界，再考虑生成指令有多好看。"
          ]
        },
        {
          "title": "从编译入口到输出逐项核对",
          "paragraphs": [
            "先安装与编辑器兼容的 Burst 和容器依赖，再用上一课主线程流程分配、调度、完成和释放。这个作业类型本身不挂到 GameObject。缺少驱动代码时，文件能够编译也不会自动运行；示例说明给出调度形式，实验需要你明确输入长度和 batchSize。",
            "在 Burst Inspector 查看目标入口，确认它确实能走对应编译路径。再用普通串行平方逐项比较结果。Inspector 中出现某种向量指令，可以帮助解释实现，却不是数值正确或整场游戏更快的证明。先获得输入输出证据，避免把“加了标记”误当成已验证成功。"
          ]
        },
        {
          "title": "首次编译和稳定计算不要混测",
          "paragraphs": [
            "编辑器中的编译、预热与安全检查可能影响首次表现，Player 构建的准备方式又可能不同。记录 Burst 状态、编译设置和采样阶段，先观察首次调用，再在相同预热条件下比较稳定区间。不要用未预热的一版去对比已经准备好的一版。",
            "调度批次大小会影响开销和可并行程度，需要在同样规模下测量。也可以先做一笔理想化算术：假设一帧原为 10 毫秒，其中只有 2 毫秒属于待优化循环，其余 8 毫秒完全不变；即使循环快 10 倍变成 0.2 毫秒，整帧也只是 8.2 毫秒，约快 1.22 倍。这还没有增加准备和同步开销，所以只是解释整体收益上限的例子，不是实测承诺。分别记录计算段和完整流程，才能知道实际节省了哪里。"
          ]
        },
        {
          "title": "更快的浮点模式需要更明确的误差要求",
          "paragraphs": [
            "一些编译选项允许改变浮点运算处理方式，可能影响精度和特殊值行为。不能只看几个普通数字相同，就认定所有输入语义都不变。先定义应用允许的误差，再加入零、负数、极大极小值及相关边界，按目标平台验证。",
            "若这是需要严格可重现的计算，应特别谨慎；若是允许小误差的视觉近似，也要记录采用原因。最后报告安装版本、实际编译证据、数值比较、规模和整体耗时。Burst 提供有条件的编译优化，正确的数据和寿命安排仍然由你负责。"
          ]
        }
      ],
      "code": {
        "title": "在同一作业上加入 Burst 编译",
        "language": "csharp",
        "filename": "BurstSquareJob.cs",
        "source": "using Unity.Burst;\nusing Unity.Collections;\nusing Unity.Jobs;\n\n// 由主线程分配容器、Schedule、Complete 并释放；本文件不挂组件。\n[BurstCompile]\npublic struct BurstSquareJob : IJobParallelFor\n{\n    [ReadOnly] public NativeArray<float> Input;\n    [WriteOnly] public NativeArray<float> Output;\n    public void Execute(int index)\n    {\n        float value = Input[index];\n        Output[index] = value * value;\n    }\n}",
        "explanation": [
          "安装兼容 Burst 与容器依赖。Input、Output 等长且不共享同一分配；该文件是作业类型，不直接挂组件。",
          "沿用上一课的主线程驱动：分配并填入输入，Schedule(length, batchSize)，完成后读取，最后释放两份数组。"
        ]
      },
      "lab": [
        {
          "title": "编译与等价性",
          "minutes": 60,
          "steps": [
            "在驱动中分配等长且独立的输入输出数组，填入 0、负数和普通值，先写串行参考答案。",
            "调度并完成作业，与串行平方逐项比较。",
            "在 Burst Inspector 检查入口确实可编译。",
            "记录预热前后和安全检查开关，不把首次延迟当稳定性能。"
          ],
          "result": "编译路径与结果均有证据。"
        },
        {
          "title": "端到端收益",
          "minutes": 60,
          "steps": [
            "保留相同输入输出，分别建立串行、同结构未 Burst 与 Burst 三版，不同时修改算法。",
            "对小中大三种规模分别测计算和全部流程。",
            "改变批次大小并保持功能结果不变。",
            "在目标 Player 复测，说明编辑器和构建差别。"
          ],
          "result": "收益报告没有隐藏准备与同步成本。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "加了属性但没有预期加速",
          "cause": "入口未编译、规模太小或端到端瓶颈在其他阶段。",
          "fix": "验证编译状态并拆分准备、计算、同步时间。"
        },
        {
          "symptom": "快速浮点设置后结果不稳定",
          "cause": "编译选项改变了数值精度假设。",
          "fix": "恢复保守设置，按算法容差和目标平台验证。"
        }
      ],
      "exercise": {
        "brief": "对一个已知 CPU 热点做三版对照，记录可编译范围、结果误差、端到端收益和采用条件。",
        "deliverables": [
          "三版结果对照",
          "编译与配置证据",
          "规模、误差与收益表"
        ],
        "rubric": [
          {
            "item": "职责与支持范围准确",
            "points": 25
          },
          {
            "item": "结果及误差可靠",
            "points": 30
          },
          {
            "item": "完整流程测量",
            "points": 30
          },
          {
            "item": "采用条件理性",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "Burst 与 Jobs 的关系是？",
          "options": [
            "完全同一功能",
            "编译优化与任务调度的不同职责",
            "Burst 自动解决所有依赖"
          ],
          "answer": 1,
          "explanation": "Jobs 负责调度和依赖，Burst 负责编译优化，两者常一起用，但不替代彼此。"
        },
        {
          "question": "局部循环快十倍，游戏必快十倍吗？",
          "options": [
            "必然",
            "不必，需看关键路径和端到端成本",
            "只有编辑器必然"
          ],
          "answer": 1,
          "explanation": "局部收益还会受到它在关键路径中的占比，以及准备、同步和其他阶段限制。"
        },
        {
          "question": "浮点快速模式应怎样采用？",
          "options": [
            "只要单次结果肉眼无差异就可全面开启",
            "依据精度契约、边界输入和目标平台验证",
            "Burst Inspector 出现 SIMD 就证明数值语义相同"
          ],
          "answer": 1,
          "explanation": "快速浮点选项可能改变运算性质，应按误差要求、边界输入与平台测试，不能用生成指令代替等价验证。"
        }
      ],
      "references": [
        {
          "label": "Burst compiler 1.8",
          "url": "https://docs.unity3d.com/Packages/com.unity.burst@1.8/manual/index.html"
        },
        {
          "label": "IJobParallelFor",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Jobs.IJobParallelFor.html"
        }
      ],
      "summary": [
        "Jobs 安排任务，Burst 优化支持范围内的计算，二者不互相替代。",
        "先确认实际编译与输出正确，再连准备和同步一起测收益。"
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
        "question": "加上 BurstCompile 后，为什么不能说任务已经自动并行并且游戏会更快？",
        "keyIdea": "Burst 优化符合条件的计算代码；Job System 安排任务。实际收益还受到数据准备、调度、同步和原来瓶颈的影响。",
        "walkthrough": [
          {
            "title": "固定数学结果",
            "text": "准备等长独立数组，输入 0、-3、2，串行参考输出为 0、9、4。"
          },
          {
            "title": "确认实际编译",
            "text": "用主线程驱动作业并在 Burst Inspector 检查入口，完成后逐项比较输出。"
          },
          {
            "title": "比较完整过程",
            "text": "对不同规模测串行、未 Burst 作业和 Burst 作业，同时记录准备与等待成本。"
          }
        ],
        "prediction": {
          "question": "计算循环快 10 倍，整帧是否也必定快 10 倍？",
          "answer": "不一定。只看一个理想化例子：整帧 10 毫秒中，循环占 2 毫秒，其余 8 毫秒不变。循环快 10 倍后变为 0.2 毫秒，整帧约为 8.2 毫秒，而不是 1 毫秒；准备、调度和同步还可能增加成本。"
        }
      }
    },
    {
      "id": "l094",
      "title": "ECS 与 Baking：数据布局为何影响架构",
      "prerequisites": [
        "l092",
        "l093"
      ],
      "goals": [
        "区分 Entity、Component 与 System",
        "说明 GameObject Authoring 到实体的 Baking",
        "理解结构变化和查询的成本边界"
      ],
      "theory": [
        {
          "title": "先认识实体、组件数据和系统",
          "paragraphs": [
            "可以先把 ECS 拆成三个具体角色。Entity 是身份，例如“实体甲”，不是一个必须带 Transform 的 GameObject；组件保存数据，例如 LabLifetime.Seconds=5；系统规定对哪些数据做什么，例如查询所有带 LabLifetime 的实体并加上 dt。系统不需要逐个等对象自己收到 MonoBehaviour.Update，而是按查询条件成批处理数据。这里的“组件”与继承 MonoBehaviour、同时装着方法的脚本含义不同；先分清身份、数据和处理规则，再讨论布局与性能。",
            "本课只给实体放一个 LabLifetime，里面有 Seconds。系统查找带这个组件的实体，每次把经过时间加进去。没有图像和物理也能观察这个过程，便于先弄清哪些数据被选中、谁修改它。不要一开始把完整 ARPG 迁过去，再同时排查显示、输入和实体数据。"
          ]
        },
        {
          "title": "编辑时的作者对象怎样变成运行数据",
          "paragraphs": [
            "为了让作者仍能在 Inspector 填值，可以用 Authoring 组件提供编辑入口。Baking 再把适合的数据转换成实体组件。例如 initialSeconds=5，Baker 取得实体并添加 LabLifetime，初始 Seconds 也为 5。作者组件用于输入，运行实体用于系统查询，两者阶段不同。",
            "本例要求在安装兼容 Entities 1.4 的独立实验项目中，正确使用已加载 SubScene 并完成 Baking。仅仅创建一个名字含 Authoring 的脚本，不保证实体已经产生。出现找不到数据时，先查转换与加载流程，而不是马上怀疑系统查询语法。"
          ]
        },
        {
          "title": "沿着一个数值找到实际运行的世界",
          "paragraphs": [
            "在 Entities Hierarchy 中选择正确的运行 World，找到带 LabLifetime 的实体。系统取自己的时间步长，例如某次为 0.02 秒，就把 Seconds 从 5 加到 5.02。接下来的更新继续累加。你检查的是运行组件，而不是误把 Inspector 中作者输入框当成正在变化的数据。",
            "World 组织实体和系统。若看错 World，或系统没有在预期环境更新，就可能误判数据不存在。记录作者值、Baking 结果和运行值三处证据，能说明转换是否发生、系统是否选中目标；这比仅看到场景里一个对象存在更接近真正的数据链路。"
          ]
        },
        {
          "title": "改数值和改组件组合不同",
          "paragraphs": [
            "把已有 LabLifetime.Seconds 从 5 改为 6，是修改现有数据；给实体新增或移除某种组件，则可能改变它的组成和存储布局，属于结构变化。不能从前一种操作很方便，推断后一种也有完全相同的同步和成本。",
            "查询根据组件条件选择实体。没有 LabLifetime 的实体不会被本例系统更新。若运行时改变组件组合，应学习相应安全阶段和命令缓冲等机制；本课先用有组件、无组件两类样本推演，不在尚未理解基本查询时就加入复杂并发修改。",
            "例如实体甲带计时组件，实体乙只带另一种数据。一次系统更新后，甲的计时增加，乙没有可写的计时字段，因此不会因为“也是一个实体”就被一起更新。新增一个带计时组件的实体丙，则会让查询多一个目标。这说明系统按数据条件选中对象，而非按场景里的名称或外观判断。"
          ]
        },
        {
          "title": "采用 ECS 前，也要看内容工作流",
          "paragraphs": [
            "数据批量布局能为某些大规模任务提供机会，但包版本、Baking、调试和团队工具都会影响实际成本。小型项目并不因为没有 ECS 就无法优化，清晰的传统组件和集中循环也可以是好方案。先用真实工作量比较，再决定是否扩大。",
            "混合使用时还需说明传统对象和实体数据谁为准、何时交换。例如界面读取实体状态，不能让另一套角色生命同时独立变化却没有同步。最终要能从作者输入一直追踪到系统输出，并指出本例没有验证渲染、物理和完整混合架构；这才是可继续扩展的起点。"
          ]
        }
      ],
      "code": {
        "title": "Entities 1.4 的最小 Baking 与数据更新",
        "language": "csharp",
        "filename": "LifetimeAuthoring.cs",
        "source": "// 仅放入已安装兼容 Entities 1.4 的独立实验项目。\nusing Unity.Entities;\nusing UnityEngine;\n\npublic struct LabLifetime : IComponentData { public float Seconds; }\n\npublic sealed class LifetimeAuthoring : MonoBehaviour\n{\n    public float initialSeconds;\n    private sealed class LifetimeBaker : Baker<LifetimeAuthoring>\n    {\n        public override void Bake(LifetimeAuthoring authoring)\n        {\n            Entity entity = GetEntity(TransformUsageFlags.None);\n            AddComponent(entity, new LabLifetime { Seconds = authoring.initialSeconds });\n        }\n    }\n}\n\npublic partial class LabLifetimeSystem : SystemBase\n{\n    protected override void OnUpdate()\n    {\n        float dt = SystemAPI.Time.DeltaTime;\n        foreach (var lifetime in SystemAPI.Query<RefRW<LabLifetime>>())\n            lifetime.ValueRW.Seconds += dt;\n    }\n}",
        "explanation": [
          "只在安装兼容 Entities 1.4 的独立实验项目使用。作者组件放进正确加载的 SubScene，完成 Baking 后查看运行 World。",
          "在 Entities Hierarchy 观察 LabLifetime.Seconds。示例只验证作者输入、实体转换和查询更新，不含渲染、物理或额外并发安排。"
        ]
      },
      "lab": [
        {
          "title": "找到真实运行数据",
          "minutes": 60,
          "steps": [
            "新建独立实验项目，安装兼容 Entities，记录编辑器、包版本以及所用 SubScene。",
            "建立 SubScene，放入作者对象并设置初始秒数。",
            "运行后在正确 World 查找 LabLifetime。",
            "观察值增长并区分作者字段与运行实体字段。"
          ],
          "result": "转换和运行阶段都有可定位证据。"
        },
        {
          "title": "查询与结构变化推演",
          "minutes": 60,
          "steps": [
            "准备带 LabLifetime 与不带该组件的实体，先预测系统更新谁，再到运行 World 核对。",
            "设计启停标记组件的变更流程。",
            "解释何处可能发生结构变化和同步，不先写复杂命令缓冲。",
            "与高质量传统批量循环做采用成本比较。"
          ],
          "result": "技术选择基于数据规模和工作流。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "作者组件存在但查不到运行实体",
          "cause": "未进入正确 Baking/SubScene/World 流程。",
          "fix": "逐阶段确认转换、加载和运行查询。"
        },
        {
          "symptom": "添加组件后性能出现同步尖峰",
          "cause": "结构变化的时机和批量策略未设计。",
          "fix": "分析实际数据移动与依赖，选择合适缓冲或组织方式。"
        }
      ],
      "exercise": {
        "brief": "建立一个只含计数数据的 ECS 实验，证明作者值、运行值和查询范围，再写一页当前项目是否采用的评估。",
        "deliverables": [
          "Baking 与运行数据证据",
          "组件/系统/World 图",
          "采用或不采用的论证"
        ],
        "rubric": [
          {
            "item": "概念边界准确",
            "points": 30
          },
          {
            "item": "链路可观察",
            "points": 30
          },
          {
            "item": "结构变化理解正确",
            "points": 25
          },
          {
            "item": "取舍包含工具成本",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "普通作者组件存在是否保证运行实体已生成？",
          "options": [
            "保证，作者组件本身就是运行实体",
            "不保证，还需要正确 Baking 与加载流程",
            "只要类名包含 Authoring 就保证"
          ],
          "answer": 1,
          "explanation": "作者组件只是输入。实体是否产生，还取决于正确 Baking、SubScene 加载和实际运行 World。"
        },
        {
          "question": "修改已有组件数值与添加组件是否同类操作？",
          "options": [
            "完全相同，都只是赋值",
            "不同，添加组件可能是结构变化",
            "修改字段一定比添加组件更昂贵"
          ],
          "answer": 1,
          "explanation": "增加组件可能改变实体组成与存储布局，和改已有字段的同步及成本不一样。"
        },
        {
          "question": "ECS 是否要求小型学习项目立即迁移？",
          "options": [
            "要求，否则项目无法获得性能提升",
            "不要求，应按需求和采用成本选择",
            "只要用了 Jobs 就必须同时迁入 ECS"
          ],
          "answer": 1,
          "explanation": "是否采用取决于规模、收益和工作流成本；传统项目也可用其他方法优化。"
        }
      ],
      "references": [
        {
          "label": "Entities package 1.4",
          "url": "https://docs.unity3d.com/Packages/com.unity.entities@1.4/manual/index.html"
        },
        {
          "label": "IJob",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Jobs.IJob.html"
        }
      ],
      "summary": [
        "Authoring 提供编辑数据，Baking 产生运行实体，系统按组件查询。",
        "修改现有数值与改变组件组成不同，采用前还要看内容和调试成本。"
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
        "question": "Authoring 组件里 initialSeconds=5，为什么它的输入框不一定随运行时间增长？",
        "keyIdea": "作者数据用于 Baking，系统更新的是运行 World 中的实体组件。先找到正确实体，才能观察真正被修改的 Seconds。",
        "walkthrough": [
          {
            "title": "填入作者配置",
            "text": "在正确 SubScene 的作者对象设置 initialSeconds=5，等待兼容 Entities 流程完成 Baking。"
          },
          {
            "title": "检查转换结果",
            "text": "在运行 World 查找带 LabLifetime 的实体，确认其初始 Seconds 为 5。"
          },
          {
            "title": "跟踪系统更新",
            "text": "系统每次给实体组件加 dt，例如加 0.02 后为 5.02；作者输入不必同步改变。"
          }
        ],
        "prediction": {
          "question": "给一个实体添加 LabLifetime，与把已有 Seconds 改成 6 是同类操作吗？",
          "answer": "不是。添加组件可能引起结构变化；修改现有字段主要改变已有数据，需要分别理解允许时机和成本。"
        }
      }
    },
    {
      "id": "l095",
      "title": "技术选型实验：传统组件、批量循环与 DOTS",
      "prerequisites": [
        "l085",
        "l091",
        "l092",
        "l093",
        "l094"
      ],
      "goals": [
        "建立公平的技术比较基线",
        "把维护和内容工具计入决策",
        "写出可逆的渐进采用方案"
      ],
      "theory": [
        {
          "title": "先把比较的问题写成同一句话",
          "paragraphs": [
            "你想知道大量单位的数值更新是否该用 DOTS。比较前先约定：相同 N 个单位、相同初始数据、相同规则、相同输出。传统组件、集中循环、Jobs 加 Burst，以及可选 ECS 都要完成这件事。如果一版少更新一半对象，快了也不能说明技术本身更适合。",
            "Jobs、Burst 和 ECS 分别涉及任务调度、编译优化、数据组织，不能把它们当成同一个按钮。集中批量循环也可能先解决许多重复调用。先把各方案改变了什么讲清，再设计对照，才能知道收益来自更少调度、更好计算，还是更合适的数据布局。"
          ]
        },
        {
          "title": "100、1000、10000 个单位可能得出不同结论",
          "paragraphs": [
            "并发有准备、调度和同步等成本，因此不能只比较工作线程上的计算段。用一组假设数字理解：小规模普通循环用 0.1 毫秒；作业方案准备与同步共 0.15 毫秒、计算 0.02 毫秒，总共 0.17 毫秒，反而更慢。规模增大后，若普通循环为 2 毫秒，而作业准备同步仍为 0.15、计算为 0.3，总时间 0.45 毫秒，选择就可能改变。这些仅是算术示例，不是任何设备的实测成绩。实验仍应对 100、1000、10000 三种规模分别记录完整流程。",
            "每组先预热，多次采样并保留波动。设备、后端和质量设置一致，输入可以用固定种子产生。若结果差异在噪声范围内，就写尚未确认。选型需要的是通常表现和规模转折点，不是比赛式挑一次最好成绩；没有实际跑过的版本明确标记未验证。"
          ]
        },
        {
          "title": "计算更快，不代表制作和维护更轻松",
          "paragraphs": [
            "ECS 方案可能需要新的 Baking 流程、包依赖、调试工具和作者组件。传统方案已有编辑器支持和团队经验，也不是零价值。把首次接入、内容制作、构建和问题定位的时间记录下来，才能比较完整成本，不只看最后一段循环的毫秒数。",
            "同样，数据从场景对象复制到原生容器、再把结果同步回来，可能抵消计算收益。测量入口到输出的完整流程，另列各阶段帮助解释。若你只想加速纯数组计算，未必需要同时迁移整个游戏架构；采用范围可以很小，按已证明的需求逐步扩大。"
          ]
        },
        {
          "title": "留下一条能退回的路",
          "paragraphs": [
            "让调用者使用稳定的输入和结果表示，避免整个项目直接依赖某个实验后端的内部类型。保留清楚的串行参考实现和结果比较，就能在升级包、修复平台问题或结果异常时，区分算法错误与后端问题，必要时回到已知正确版本。",
            "可逆不等于永远维护所有版本，而是提前明确切换条件与数据边界。例如达到某规模且目标设备总时间稳定获益，才扩大采用；低于该规模继续用简单方案。若维护成本超预算或构建支持不完整，撤回同样应有具体步骤，而不是只能全部重写。"
          ]
        },
        {
          "title": "写出选择，也写出为什么没选另外几项",
          "paragraphs": [
            "一份可审阅的结论应说明当前采用范围、测量证据、维护代价和未验证部分。选择集中循环时，可以写明它已满足预算，而其他方案收益不足以抵消接入成本；选择 Jobs 时，也要说明哪些工作适合数据任务，哪些仍留在主线程。",
            "拒绝某项技术不表示没理解它，全部使用也不表示设计成熟。最后把记录交给另一位学习者，问他能否用相同数据重现结果，以及换一台设备后哪项结论需要重测。技术选择是对具体问题的回答，不是给整个项目贴一个越新越好的标签。"
          ]
        }
      ],
      "code": {
        "title": "对照实验记录模板",
        "language": "text",
        "filename": "architecture-comparison.txt",
        "source": "问题：同样的 N 个单位执行同样的数值规则\n规模：100 / 1000 / 10000\n版本：Unity、包、构建后端、目标设备\n每版记录：输入、输出校验、准备ms、计算ms、同步ms、总ms、峰值内存\n实现A：清晰的传统组件\n实现B：集中批量循环\n实现C：Jobs + Burst（说明依赖与容器寿命）\n实现D：可选ECS（单独计入Baking与内容管线成本）\n结论：采用范围 / 不采用范围 / 扩大使用阈值 / 撤回条件",
        "explanation": [
          "这是实验记录模板，不是已经测出的性能表。逐项填写真实输入、结果校验和各阶段耗时。",
          "某版本无法运行或尚未完成时，写明未验证。不要用猜测数字填表，也不把未测方案宣布为性能赢家。"
        ]
      },
      "lab": [
        {
          "title": "三规模公平比较",
          "minutes": 60,
          "steps": [
            "选定一条所有版本都能完成的纯数据规则，用固定种子生成输入，并保存参考输出。",
            "建立传统和集中循环两版，保证结果一致。",
            "加入已有作业版，按三规模采样。",
            "记录未完成或不可比部分，不用猜测填表。"
          ],
          "result": "比较具有相同工作量和环境。"
        },
        {
          "title": "写可逆采用方案",
          "minutes": 60,
          "steps": [
            "列出每种方案增加的包、编辑工具、构建和调试步骤，记录实际接入时间或未测部分。",
            "设计不暴露后端实现的输入输出边界。",
            "保留串行参考与回归测试。",
            "写采用阈值和撤回条件，尝试说服另一个学习者。"
          ],
          "result": "决策包含收益、成本和退路。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "技术比较只有一句“某方案更现代”",
          "cause": "没有具体负载、基线和预算。",
          "fix": "先定义同一问题，再做规模曲线。"
        },
        {
          "symptom": "迁移后无法回退",
          "cause": "技术类型渗透全部业务与内容流程。",
          "fix": "限定采用边界并保留正确性参考实现。"
        }
      ],
      "exercise": {
        "brief": "提交一份面向当前学习项目的技术决策记录，允许选择不采用 DOTS，但必须用实验与成本支持。",
        "deliverables": [
          "公平对照表",
          "结果校验与规模曲线",
          "采用范围和撤回条件"
        ],
        "rubric": [
          {
            "item": "比较公平",
            "points": 30
          },
          {
            "item": "数据与不确定性诚实",
            "points": 30
          },
          {
            "item": "成本覆盖完整",
            "points": 25
          },
          {
            "item": "方案可逆",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "Jobs、Burst、ECS 是完全相同的能力吗？",
          "options": [
            "完全一样，只是名字不同",
            "不同，分别涉及调度、编译和数据组织",
            "采用其中一个会自动具备另两个的全部能力"
          ],
          "answer": 1,
          "explanation": "三者常配合使用，却解决不同问题：调度、编译和数据架构需要分别比较。"
        },
        {
          "question": "单一规模最好成绩足够做决策吗？",
          "options": [
            "最大规模最好一次足以代表全部场景",
            "通常不够，应比较多个规模、相同预热与波动",
            "只需记录循环，准备与同步不影响选择"
          ],
          "answer": 1,
          "explanation": "固定成本、规模转折点和波动影响结论。只看一个规模的一次最好成绩会遗漏日常使用情况。"
        },
        {
          "question": "当前项目选择不采用某技术可以是专业结论吗？",
          "options": [
            "可以，只要依据需求、证据和成本",
            "不可以，新技术总比已有方案适合",
            "只有未尝试实现时才可以决定不采用"
          ],
          "answer": 0,
          "explanation": "依据已知需求、预算与维护成本选择不用某技术，同样可以是有证据的工程决策。"
        }
      ],
      "references": [
        {
          "label": "Burst compiler 1.8",
          "url": "https://docs.unity3d.com/Packages/com.unity.burst@1.8/manual/index.html"
        },
        {
          "label": "Entities package 1.4",
          "url": "https://docs.unity3d.com/Packages/com.unity.entities@1.4/manual/index.html"
        }
      ],
      "summary": [
        "用相同输入、工作量和输出比较多种规模。",
        "技术采用范围由收益、维护成本和可退回方案共同决定。"
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
        "question": "10000 个单位的 Burst 版本最快，为什么100个单位的小场景仍可能选择普通循环？",
        "keyIdea": "不同规模下固定开销占比不同，维护和内容成本也不同。选型要比较同一任务的完整时间，并限定采用范围。",
        "walkthrough": [
          {
            "title": "规定相同工作",
            "text": "所有方案更新同样单位和数值规则，用固定输入验证输出一致，不偷偷减少工作量。"
          },
          {
            "title": "比较三种规模",
            "text": "分别测试 100、1000、10000 个单位，记录准备、计算、同步、总时间和波动。"
          },
          {
            "title": "把成本加入决策",
            "text": "若小规模普通循环已达预算，记录理由并保留扩展阈值，不因大规模最快就全面迁移。"
          }
        ],
        "prediction": {
          "question": "当前选择不采用 ECS，可以是专业结论吗？",
          "answer": "可以，前提是说明实际需求、测量范围和采用成本；也应写出未来哪些变化会触发重新评估。"
        }
      }
    }
  ]
});
