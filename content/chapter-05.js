window.COURSE_MODULES.push({
  "id": "m05",
  "number": 5,
  "title": "时间、协程与异步",
  "subtitle": "时间不是一个全局数字",
  "description": "比较游戏时间与非缩放时间，逐步理解等待误差、取消、周期余量和显示插值，用具体实验设计暂停、慢动作与异步流程。",
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
      "id": "l021",
      "title": "deltaTime、fixedDeltaTime 与 timeScale：设计暂停规则",
      "prerequisites": [
        "l020"
      ],
      "goals": [
        "按需求选择缩放或非缩放时间",
        "解释暂停后代码为何仍可执行",
        "让暂停与慢动作恢复到正确比例"
      ],
      "theory": [
        {
          "title": "先分清执行代码与时间前进",
          "paragraphs": [
            "timeScale=0 后 Update 仍可以执行，只是相应缩放时间增量为零。若移动每帧直接增加固定距离，不依赖缩放时间，它仍可能继续走。暂停没有替你检查每一行代码，也不会自动使所有对象失活。",
            "因此实验应同时记录 Update 次数和累计时间。看到菜单能响应，不代表暂停失败；看到角色还走，也不该先怀疑赋值未生效。先看这段移动使用什么时间、是否根本没有乘时间，才知道它为什么继续。"
          ]
        },
        {
          "title": "deltaTime 表示当前阶段的时间增量",
          "paragraphs": [
            "常见 Update 中，deltaTime 用于按缩放游戏时间推进，例如速度乘秒数得到位移。正常速度下两帧间隔约0.02秒，timeScale=0.5时缩放增量约0.01秒，角色按同一每游戏秒速度运行，在真实时间里看起来变慢。",
            "它不是永远恒定的数字。固定步相关阶段使用的时间语义也不同，不能把某一帧的观察推广到任意回调。用时间值前，应明确代码在哪个阶段执行，以及需要按游戏时间还是非缩放时间推进。"
          ]
        },
        {
          "title": "非缩放时间适合暂停期间仍运行的内容",
          "paragraphs": [
            "菜单渐变、暂停界面的计时或网络提示，可能不希望随游戏变慢，可使用 unscaledDeltaTime。示例将它单独累计，便于与 deltaTime 对照。它的用途是忽略 timeScale，不是保证程序被系统挂起时仍持续执行每一帧。",
            "命名 realSeconds 只是示例变量名，不应据此认为它是万能现实世界时钟。离线收益、系统时间调整和长时间后台状态需要另外定义。先把“忽略游戏缩放”和“可靠跨应用暂停计时”分开，后面的计时选择才不会混乱。"
          ]
        },
        {
          "title": "fixedDeltaTime 不等于显示帧间隔",
          "paragraphs": [
            "固定模拟以设定步长推进，不要求每次画面更新都恰好一次。timeScale 改变后，真实时间内发生的固定步安排也会受影响；设为零时，普通固定更新不再照常推进。它仍不是独立于主线程的物理时钟。",
            "不要为了做一次慢动作就随意改固定步长。是否同时调整应根据模拟精度与性能需求决定，并记录原值与恢复方式。先保持步长不变比较三种 timeScale，能更直接观察时间缩放本身的影响。"
          ]
        },
        {
          "title": "暂停要为每个系统写一句规则",
          "paragraphs": [
            "可以列出角色移动、动画、音频、菜单、粒子和输入，分别决定暂停时是否继续。菜单要继续接收恢复操作，角色攻击却不应穿透菜单触发。timeScale 解决不了全部输入与显示规则，其他系统也有自己的配置。",
            "这张表不需要复杂框架，先写“哪个系统停，使用哪个时钟，谁来切换”。恢复操作应能在暂停期间收到，否则把唯一恢复逻辑放在不再执行的固定更新中，就可能无法恢复。对不同系统分别验证，比只看一个角色是否停住更完整。"
          ]
        },
        {
          "title": "让一个入口负责全局比例",
          "paragraphs": [
            "假设慢动作把 timeScale 设为0.5，暂停把它设为0。若恢复时另一个脚本直接写1，原慢动作就丢失。多个脚本各自保存和恢复还可能互相覆盖，结果取决于最后谁赋值。",
            "应由明确管理入口决定最终比例，并说明如何处理多个暂停来源。最简单实验可保存暂停前值，但正式系统若存在叠加请求，还需管理请求的开始与结束。重要的是不要让互不知道的脚本争写同一个全局状态。"
          ]
        },
        {
          "title": "恢复时也检查被缓存的行为",
          "paragraphs": [
            "暂停期间输入脚本可能仍读取键盘。恢复后角色是否执行旧的跳跃或攻击，取决于你怎样处理缓存请求。让时间停住和清除过期请求是不同操作，应按需求明确，而不是默认 timeScale 会清掉所有状态。",
            "测试从正常进入暂停、从慢动作进入暂停、重复暂停及恢复，再观察菜单、移动和输入。记录原比例与最终比例，确认没有长期遗留为零。实验完成也要恢复编辑器中的时间设置，避免下一课误以为脚本不执行。"
          ]
        }
      ],
      "code": {
        "title": "两个时钟的并行计数",
        "language": "csharp",
        "filename": "ClockProbe.cs",
        "source": "using UnityEngine;\npublic sealed class ClockProbe : MonoBehaviour\n{\n    float gameSeconds;\n    float realSeconds;\n    void Update()\n    {\n        gameSeconds += Time.deltaTime;\n        realSeconds += Time.unscaledDeltaTime;\n    }\n    [ContextMenu(\"Report clocks\")]\n    void Report() => Debug.Log($\"game={gameSeconds:F2}; unscaled={realSeconds:F2}\", this);\n}",
        "explanation": [
          "将 ClockProbe 挂到空对象，分别在timeScale=1、0.5、0时运行，从组件菜单报告累计值。realSeconds 在此只表示非缩放帧增量累计，不是跨后台的完整计时方案。"
        ]
      },
      "lab": [
        {
          "title": "比较正常、半速和暂停",
          "minutes": 60,
          "steps": [
            "分别将timeScale设为1、0.5、0，每次从干净运行等待相近真实时间。",
            "记录两种累计值、Update与FixedUpdate次数，说明时间为零和代码不执行的区别。",
            "在副本加入每帧固定位置增量，观察它为何不随暂停停止，之后移除。"
          ],
          "result": "实测区分游戏时间、非缩放时间与直接状态修改。"
        },
        {
          "title": "从慢动作进入暂停再恢复",
          "minutes": 60,
          "steps": [
            "先进入0.5慢动作，再暂停为0，恢复时检查是否回到0.5。",
            "为移动、动画、音频、粒子、菜单和输入写出暂停规则及负责组件。",
            "从Update等有效入口恢复，重复切换并核对没有其他脚本覆盖最终比例。"
          ],
          "result": "恢复保留原状态，各系统规则有具体验证。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "暂停后菜单动画也停住",
          "cause": "界面使用了缩放时间",
          "fix": "按需求使用非缩放增量或相应动画更新模式"
        },
        {
          "symptom": "慢动作结束后固定步长越来越小",
          "cause": "反复基于已缩放值相乘",
          "fix": "保存基础步长，按当前策略重新计算"
        }
      ],
      "exercise": {
        "brief": "设计与慢动作兼容的暂停控制，逐项写清系统是否继续；验证继续走的菜单时钟和停止的玩法时钟。",
        "deliverables": [
          "时间所有权图",
          "三比例实测表",
          "慢动作暂停恢复测试"
        ],
        "rubric": [
          {
            "item": "时钟选择正确",
            "points": 25
          },
          {
            "item": "暂停可恢复且比例正确",
            "points": 25
          },
          {
            "item": "无全局时间争写",
            "points": 25
          },
          {
            "item": "单位与固定步解释正确",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "timeScale=0 时 Update 是否必然停止？",
          "options": [
            "不会，只要组件有效，Update仍可执行",
            "会，全部脚本回调都冻结",
            "会，同时禁用所有输入设备",
            "只要deltaTime为零，任何代码都不能改变状态"
          ],
          "answer": 0,
          "explanation": "时间增量为零不等于禁止执行代码；不依赖该增量的逻辑仍可能改变状态。"
        },
        {
          "question": "暂停菜单继续计时更适合？",
          "options": [
            "每帧固定加1秒",
            "unscaledDeltaTime",
            "缩放后的deltaTime",
            "只累加FixedUpdate次数"
          ],
          "answer": 1,
          "explanation": "暂停菜单若要忽略timeScale，应选择非缩放时间；更新次数本身不是秒数。"
        },
        {
          "question": "控制全局暂停最需要避免什么？",
          "options": [
            "记录暂停前比例",
            "逐项验证系统暂停规则",
            "多个系统各自争写timeScale且没有统一处理",
            "在暂停期间保留恢复入口"
          ],
          "answer": 2,
          "explanation": "互相覆盖全局比例会破坏恢复结果，需要明确负责决定最终值的入口。"
        }
      ],
      "references": [
        {
          "label": "Time.timeScale",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-timeScale.html"
        },
        {
          "label": "Time.unscaledDeltaTime",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-unscaledDeltaTime.html"
        },
        {
          "label": "Time.fixedDeltaTime",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-fixedDeltaTime.html"
        }
      ],
      "summary": [
        "timeScale为零不等于所有代码冻结。",
        "全局时间比例应由明确入口管理，其他系统仍需各自暂停规则。"
      ],
      "teaching": {
        "question": "把 timeScale 设为0以后，为什么菜单还能点击，有些物体甚至还在移动？",
        "keyIdea": "时间缩放改变某些时间数值和调度，不是冻结所有代码。暂停需要逐个决定哪些系统停止，哪些仍继续工作。",
        "walkthrough": [
          {
            "title": "比较两个时钟",
            "text": "运行 ClockProbe，timeScale=1时观察 gameSeconds 与 realSeconds，它们分别累加缩放与非缩放增量。"
          },
          {
            "title": "进入半速",
            "text": "设为0.5并等待约2秒真实时间。游戏累计约增1秒，非缩放累计约增2秒，实际记录包含帧误差。"
          },
          {
            "title": "再暂停",
            "text": "设为0时继续执行菜单与报告，观察 Update 可运行而 deltaTime 为0，说明暂停不是禁止全部方法调用。"
          }
        ],
        "prediction": {
          "question": "先慢动作0.5，再暂停，恢复时直接设成1是否总正确？",
          "answer": "不一定。若应回到慢动作，需要保存暂停前比例，由统一入口恢复；还要处理其他系统的暂停需求。"
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
      "id": "l022",
      "title": "yield 的真实含义：等待精度与恢复阶段",
      "prerequisites": [
        "l021"
      ],
      "goals": [
        "解释等待起算与恢复帧带来的误差",
        "比较缩放、非缩放和阶段等待",
        "按完成条件等待资源，而非猜一个延时"
      ],
      "theory": [
        {
          "title": "yield 表示暂时交出执行",
          "paragraphs": [
            "协程执行到 yield 时保存当前进度并把控制交回引擎。之后是否恢复，要看等待对象或条件。例如 yield return null 表达等到后续帧继续，不是启动一个后台线程，让剩余代码与当前帧并行运行。",
            "等待前的普通计算仍在当前调用中执行。把很长循环放在第一次 yield 之前，照样可能卡住主线程。理解协程应逐个看暂停点：这里暂停后，哪些对象可能被销毁，哪些状态可能改变，再决定恢复时需要检查什么。"
          ]
        },
        {
          "title": "WaitForSeconds 按缩放时间等待",
          "paragraphs": [
            "参数1表示等待约1个缩放游戏秒。timeScale=0.5时，游戏时间前进较慢，真实经过时间通常约为2秒；为零时，这种等待不会靠普通游戏时间继续完成。它适合跟随游戏节奏的延迟，不适合所有暂停提示。",
            "示例在前后分别记录游戏时间与实际经过时间，使你能观察两种结果。不要只看到日志晚出现，就把它当成计算错误。先确认所选时钟，才能说明延迟是预期的缩放效果，还是其他调度造成的误差。"
          ]
        },
        {
          "title": "等待不是从任意瞬间精确起算",
          "paragraphs": [
            "WaitForSeconds 从当前帧结束开始等待。若调用所在帧还有很长工作，它不会简单保证从这一行执行的瞬间开始计满指定真实时长。因此长启动帧可能让你用外部计时看到更长间隔。",
            "满足等待条件后，协程也只能在相应后续帧恢复，不能插进两个帧之间精确到某个毫秒。帧率较低时误差更容易观察。实验应记录容差与帧长，不要把一次输出的小数位数当成定时精度保证。"
          ]
        },
        {
          "title": "不同等待对象表达不同要求",
          "paragraphs": [
            "WaitForSecondsRealtime 忽略timeScale，适合部分暂停期间仍要计时的流程，但恢复仍依赖游戏循环。WaitForFixedUpdate 关注固定步相关阶段，不等于创建一个独立物理线程。选择依据应是需要的时钟或阶段。",
            "等待一个 ready 条件，则表示流程尚未满足完成要求。固定等0.5秒只能赌它差不多准备好，不能替代真正状态。优先说明等待什么，再选择对应方式，而不是为了让代码短就给所有初始化都塞一个延时。"
          ]
        },
        {
          "title": "等待中对象状态仍会变化",
          "paragraphs": [
            "协程挂起时，其他脚本仍能修改或销毁目标。恢复后应重新检查所需对象与状态。开始等待前引用有效，不保证之后仍有效。暂停、场景切换和对象池回收，都可能让原任务已经不再有意义。",
            "仅禁用MonoBehaviour不会自动停止它已运行的全部协程，关闭GameObject或销毁则有不同效果。需要只在启用期间工作的流程，应明确保存与停止任务。等待方式只回答何时恢复，不替你决定任务是否仍该继续。"
          ]
        },
        {
          "title": "周期等待会包含额外工作时间",
          "paragraphs": [
            "假设循环先处理0.1秒工作，再等1秒，下一轮开始间隔就不只是1秒。即使工作很短，每轮的帧边界和调度误差也可能累积。连续运行后产生偏移，称为周期漂移，不是单次等待参数自己改变。",
            "若需要长期贴合预定节拍，应考虑累计时间或下次截止时刻，并决定落后时补发还是跳过。普通提示无需追求复杂定时，但音频衔接等精度需求不能只靠协程等待，应使用专门的时间与调度接口。"
          ]
        },
        {
          "title": "用多次数据描述精度",
          "paragraphs": [
            "在正常、半速和较低帧率条件分别多次运行，记录参数、两种经过时间以及恢复帧。比较误差和帧长，而不是只选一次最接近1秒的结果。这样才能分清缩放、起算点和恢复帧各自的影响。",
            "最后测试暂停中恢复、对象关闭和目标销毁。每种结果应能解释任务继续还是结束。为自己的延迟流程写清时钟、结束条件与允许误差，才知道某个等待对象是否适用，而不是只记住几个 yield 名称。"
          ]
        }
      ],
      "code": {
        "title": "记录两种等待的两个时钟",
        "language": "csharp",
        "filename": "WaitClockProbe.cs",
        "source": "using System.Collections;\nusing UnityEngine;\npublic sealed class WaitClockProbe : MonoBehaviour\n{\n    IEnumerator Start()\n    {\n        double realStart = Time.realtimeSinceStartupAsDouble;\n        float gameStart = Time.time;\n        yield return new WaitForSeconds(1f);\n        Debug.Log($\"Scaled wait: game={Time.time-gameStart:F3}, real={Time.realtimeSinceStartupAsDouble-realStart:F3}\", this);\n        realStart = Time.realtimeSinceStartupAsDouble;\n        yield return new WaitForSecondsRealtime(1f);\n        Debug.Log($\"Unscaled wait: real={Time.realtimeSinceStartupAsDouble-realStart:F3}\", this);\n    }\n}",
        "explanation": [
          "挂到空对象，先在正常速度运行，再改为半速。timeScale=0会让第一段缩放等待无法照常完成，因此不会直接进入第二段；测试后恢复时间比例。"
        ]
      },
      "lab": [
        {
          "title": "比较两种时间的等待结果",
          "minutes": 60,
          "steps": [
            "timeScale为1和0.5时各运行5次，记录两段等待的真实与游戏经过时间。",
            "降低实际帧率重做，比较恢复误差与帧长，记录测量容差。",
            "解释调用所在帧工作很长时，为何WaitForSeconds不保证从该行瞬间精确起算。"
          ],
          "result": "误差解释包含时钟、起算点和恢复帧。"
        },
        {
          "title": "等待中改变状态",
          "minutes": 60,
          "steps": [
            "另建小探针分别用下一帧等待、固定步等待和ready条件，记录恢复阶段。",
            "等待中分别暂停、禁用脚本、关闭对象，每次从独立运行开始比较。",
            "给延迟提示写清结束规则，销毁等待目标后确认不再访问过期对象。"
          ],
          "result": "知道等什么，也知道任务何时不该继续。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "参数写1秒，日志却不是恰好1.000秒出现",
          "cause": "等待起算与恢复依赖帧边界，还可能受到timeScale影响。",
          "fix": "记录时钟与帧长，按允许误差判断，不把协程当精确毫秒计时器。"
        },
        {
          "symptom": "等0.5秒后资源仍不可用",
          "cause": "固定延时没有说明资源真的已完成。",
          "fix": "等待实际完成状态或通知，并处理失败和任务结束。"
        }
      ],
      "exercise": {
        "brief": "制作暂停时仍消失的提示与暂停时冻结的冷却，各测10次，记录误差并给出允许范围。",
        "deliverables": [
          "两个等待示例",
          "重复测量与误差表",
          "两种计时及停止规则"
        ],
        "rubric": [
          {
            "item": "等待类型匹配需求",
            "points": 25
          },
          {
            "item": "误差来源解释完整",
            "points": 25
          },
          {
            "item": "任务取消安全",
            "points": 25
          },
          {
            "item": "实验数据含版本与帧长",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "WaitForSeconds 是否保证从调用瞬间起精确等待指定毫秒？",
          "options": [
            "不保证，受到缩放及帧开始结束与恢复调度影响",
            "保证从这一行精确计时",
            "只要使用double就能精确恢复",
            "等待时间足够长就不受帧影响"
          ],
          "answer": 0,
          "explanation": "协程在游戏循环中恢复，不是硬实时定时器；小数位数不等于保证精度。"
        },
        {
          "question": "等待资源准备的更强条件是什么？",
          "options": [
            "固定等0.5秒",
            "读取实际完成信号或ready状态",
            "把延时改成1秒就永远足够",
            "提前把timeScale设大"
          ],
          "answer": 1,
          "explanation": "完成状态直接表达依赖，固定延时无法适应不同负载。"
        },
        {
          "question": "周期循环每次工作后等一秒，长期可能怎样？",
          "options": [
            "每轮都绝对保持同一节拍",
            "等待会自动扣掉本轮全部工作耗时",
            "间隔包含工作与调度成本，长期可能漂移",
            "代码写在协程里就自动并行"
          ],
          "answer": 2,
          "explanation": "每次从工作结束再等一段时间，会把额外成本带入周期。"
        }
      ],
      "references": [
        {
          "label": "WaitForSeconds",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/WaitForSeconds.html"
        },
        {
          "label": "WaitForSecondsRealtime",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/WaitForSecondsRealtime.html"
        },
        {
          "label": "WaitUntil",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/WaitUntil.html"
        }
      ],
      "summary": [
        "等待对象说明条件，不保证精确毫秒恢复。",
        "时间来源、恢复阶段与任务是否仍有效需要分别检查。"
      ],
      "teaching": {
        "question": "写了 WaitForSeconds(1)，日志为什么不是恰好在调用后的1.000秒出现？",
        "keyIdea": "协程把执行交还给引擎，满足等待条件后再恢复。等待使用哪个时钟、从何时开始计、在哪一帧恢复，都影响观测结果。",
        "walkthrough": [
          {
            "title": "记录起点",
            "text": "运行 WaitClockProbe，同时记录游戏时间和非缩放经过时间，保持timeScale=1先做基线。"
          },
          {
            "title": "改变缩放",
            "text": "设为0.5后重做。等待1个游戏秒通常需要约2个真实秒，但输出还包含帧结束与恢复调度误差。"
          },
          {
            "title": "比较另一种等待",
            "text": "观察 WaitForSecondsRealtime，它不随timeScale等比例变慢；再用低帧率验证恢复仍受到帧边界影响。"
          }
        ],
        "prediction": {
          "question": "等待资源完成时，固定等0.5秒是否比检查 ready 更可靠？",
          "answer": "不是。设备速度和负载会变化；实际完成信号或状态更直接表达依赖，固定延时可能过早也可能浪费时间。"
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
      "id": "l023",
      "title": "async、Awaitable 与取消：跨时间流程的另一种表达",
      "prerequisites": [
        "l022"
      ],
      "goals": [
        "区分等待表达与后台计算",
        "为销毁和禁用选择各自取消范围",
        "遵守Awaitable单次等待及线程限制"
      ],
      "theory": [
        {
          "title": "async 首先改变表达方式",
          "paragraphs": [
            "一个流程先等待资源，再更新显示，用async和await可以按阅读顺序表达，不必把每一步写成分散回调。await遇到未完成操作时允许方法暂停，之后再从该处继续，但关键字本身没有把计算自动搬去后台。",
            "在第一次真正挂起之前，普通代码仍照常执行。长循环没有合适调度就仍可能阻塞主线程。先判断想等待I/O、等待下一帧还是并行计算，再选工具，比看到async就期待自动加速更准确。"
          ]
        },
        {
          "title": "线程切换取决于实际操作",
          "paragraphs": [
            "方法在哪个线程继续，取决于具体等待对象和调度规则。Unity提供相关Awaitable入口，但切到后台后也不能随意访问GameObject、Transform等要求主线程的API。一个方法能编译，不代表所有调用都允许在任意线程执行。",
            "需要后台处理时，应先取出纯数据，完成计算，再按正确方式回到主线程应用结果。此例只演示逐帧等待，没有使用后台计算。不要把例子的成功日志解释为已经验证线程安全或性能收益。"
          ]
        },
        {
          "title": "Awaitable 不能按任意Task用法复用",
          "paragraphs": [
            "Unity的Awaitable会使用对象池，减少某些分配成本。代价之一是同一个实例不能随意多次await。保存一次等待对象，再让多个消费者重复等待，可能产生不符合规则的行为。",
            "示例每轮都调用NextFrameAsync取得这一次等待，再await它，而不是循环复用一个已保存实例。阅读文档时要看返回类型，不要因为两种对象都能跟在await后，就认为它们在结果缓存和重复等待方面完全相同。"
          ]
        },
        {
          "title": "销毁不会自动结束任意异步方法",
          "paragraphs": [
            "普通异步方法不是自动附着在MonoBehaviour上的协程。对象结束后，它的等待或外部操作不一定自行停止。需要向支持取消的操作传入令牌，并在取消时结束后续逻辑，避免恢复后访问无效对象。",
            "destroyCancellationToken对应对象销毁相关寿命。示例先取得令牌，再用于每次帧等待。销毁使流程通过预期取消路径结束。取消令牌表达停止请求，具体操作是否支持并及时响应，还应查看该API，而不是一概认为取消立即终止所有工作。"
          ]
        },
        {
          "title": "启用期和销毁期不同",
          "paragraphs": [
            "组件只是enabled=false时，对象仍可能存在，销毁令牌不会因此替你覆盖启用边界。如果任务只应在面板显示时运行，就需要额外管理启用期间的CancellationTokenSource，并在禁用时发出取消。",
            "重新启用通常要开始新的流程，不能继续使用已经取消的令牌源。谁创建、谁发出取消、谁释放，都应对应清楚。否则快速开关可能叠加多个异步流程，即使每个方法单独看都很简单，结果也会重复出现。"
          ]
        },
        {
          "title": "异常要在能说明原因的位置被观察",
          "paragraphs": [
            "示例用async void Start作为引擎入口，并只捕获预期的OperationCanceledException。取消意味着任务按生命周期结束，不应当成普通失败刷屏；其他异常则不能一并吞掉，否则真正错误会失去原因。",
            "一般可被调用和等待的方法，宜返回能够被上层等待的结果类型，而不是随意async void。上层才能知道何时完成和怎样处理失败。入口函数的限制与内部方法设计要分开，不要因为Start这样写就推广到所有异步函数。"
          ]
        },
        {
          "title": "帧等待不等于固定秒数",
          "paragraphs": [
            "连续等待120帧，在约60帧/秒时可能接近2秒，在约30帧/秒时可能接近4秒，实际还要看帧变化。示例数帧是为了让等待和销毁容易观察，不是实现固定时长定时器。",
            "测试自然完成、等待中销毁、仅禁用和重新启用，记录开始与结束帧。再检查恢复处有没有使用过期引用，是否重复等待同一实例。这样可以分别证明时间含义、结束边界和资源处理，不会用一条完成日志概括全部正确性。"
          ]
        }
      ],
      "code": {
        "title": "销毁时取消一个逐帧异步流程",
        "language": "csharp",
        "filename": "AwaitableLifetimeProbe.cs",
        "source": "using System;\nusing UnityEngine;\npublic sealed class AwaitableLifetimeProbe : MonoBehaviour\n{\n    async void Start()\n    {\n        var token = destroyCancellationToken;\n        try\n        {\n            for (int i = 0; i < 120; i++)\n                await Awaitable.NextFrameAsync(token);\n            Debug.Log(\"120 frame waits completed.\", this);\n        }\n        catch (OperationCanceledException) { }\n    }\n}",
        "explanation": [
          "挂空对象，等待中销毁应取消。仅禁用组件不触发同一销毁令牌；120次帧等待不是固定2秒。代码只处理预期取消，不会忽略所有异常。"
        ]
      },
      "lab": [
        {
          "title": "比较完成、禁用与销毁",
          "minutes": 60,
          "steps": [
            "记录120次等待前后帧号与时间，验证它不是固定2秒。",
            "等待中销毁对象，确认取消后不打印完成，也不访问无效成员。",
            "另一次运行只禁用组件，比较销毁令牌没有覆盖此种结束需求。"
          ],
          "result": "知道销毁取消何时生效，以及何时需要另一种取消。"
        },
        {
          "title": "建立只在启用期间的任务",
          "minutes": 60,
          "steps": [
            "为启用期工作创建明确的CancellationTokenSource，禁用时请求取消。",
            "分别测试完成、禁用、销毁、再次启用，标注每次任务属于哪一轮。",
            "检查没有重复await同一实例，后台代码没有随意访问场景对象，异常有观察入口。"
          ],
          "result": "旧任务不会干扰新一轮，取消与资源释放有人负责。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "对象已销毁，异步完成后仍访问它",
          "cause": "异步任务未绑定生命周期",
          "fix": "传入取消令牌，并在恢复处检查目标与请求轮次"
        },
        {
          "symptom": "保存 Awaitable 后重复 await 出现异常行为",
          "cause": "忽视其池化与单次等待限制",
          "fix": "每次获取相应操作结果，不复用同一 Awaitable 实例"
        }
      ],
      "exercise": {
        "brief": "制作只在启用期间运行的异步准备流程，分别记录完成、取消与失败；重启后旧任务不得更新新一轮状态。",
        "deliverables": [
          "任务寿命图",
          "取消与异常代码",
          "四条终止路径测试"
        ],
        "rubric": [
          {
            "item": "任务的结束范围符合组件需求",
            "points": 25
          },
          {
            "item": "取消与资源释放配对",
            "points": 25
          },
          {
            "item": "旧任务不影响新一轮",
            "points": 25
          },
          {
            "item": "失败信息没有被忽略",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "给方法加 async 是否自动把计算移到后台？",
          "options": [
            "不会，取决于具体等待和调度",
            "会，第一次await前也自动后台执行",
            "返回void就一定后台执行",
            "用了Awaitable就允许任意UnityAPI跨线程"
          ],
          "answer": 0,
          "explanation": "async提供等待表达，线程安排必须看具体操作和API条件。"
        },
        {
          "question": "destroyCancellationToken 何时对应取消？",
          "options": [
            "每次普通Update结束",
            "对应对象销毁相关寿命",
            "组件失去窗口焦点时",
            "enabled=false时总会触发"
          ],
          "answer": 1,
          "explanation": "禁用和销毁是不同边界，启用期间任务需要额外取消设计。"
        },
        {
          "question": "同一个 Awaitable 实例可随意多次 await 吗？",
          "options": [
            "总可以，它会缓存结果供无限读取",
            "只要先检查完成就能多次等待",
            "不应如此，池化Awaitable有单次等待限制",
            "每帧重新await同一实例就是下一帧等待"
          ],
          "answer": 2,
          "explanation": "每次等待应按API取得适用的新实例，不能照搬所有Task的复用习惯。"
        }
      ],
      "references": [
        {
          "label": "Awaitable",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Awaitable.html"
        },
        {
          "label": "Awaitable.NextFrameAsync",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Awaitable.NextFrameAsync.html"
        },
        {
          "label": "MonoBehaviour.destroyCancellationToken",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour-destroyCancellationToken.html"
        }
      ],
      "summary": [
        "async不自动将计算转到后台。",
        "任务需要明确的取消来源与异常处理入口。"
      ],
      "teaching": {
        "question": "给方法加上 async，是否就能把重计算放到后台？对象销毁后，等待中的方法又由谁停止？",
        "keyIdea": "async 允许表达等待，不自动选择后台线程。异步流程需要明确等待对象、取消来源、恢复后仍可使用的数据以及异常处理。",
        "walkthrough": [
          {
            "title": "看每次等待",
            "text": "示例循环120次，每次取得新的 NextFrameAsync 并等待。它数的是后续帧，不是固定2秒。"
          },
          {
            "title": "触发销毁",
            "text": "等待期间销毁挂载对象，destroyCancellationToken使等待取消，预期取消异常被单独处理。"
          },
          {
            "title": "比较禁用",
            "text": "只把组件enabled关闭再测试，它不是销毁，不会因此触发同一销毁令牌；需要另设启用期取消。"
          }
        ],
        "prediction": {
          "question": "保存一次 NextFrameAsync 的 Awaitable，之后反复 await 它，是否和重复等下一帧相同？",
          "answer": "不是。Awaitable实例使用池化，有单次等待限制；应为每次等待取得新的实例，不能当作可反复复用的Task。"
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
      "id": "l024",
      "title": "计时器与调度：周期漂移、漏步和补偿策略",
      "prerequisites": [
        "l023"
      ],
      "goals": [
        "计算周期触发后的剩余时间",
        "按需求选择补发、合并或跳过",
        "限制卡顿后的单帧追赶工作量"
      ],
      "theory": [
        {
          "title": "先定义“每隔一秒”的意思",
          "paragraphs": [
            "定时刷新界面、持续伤害和重试请求，都可能写成每隔1秒，但错过一次后的要求不同。界面通常只要最新结果，伤害可能需要补算总量，网络重试也未必应该一口气补发十次。先定义允许漏什么，再选择循环。",
            "还要说明使用游戏时间还是非缩放时间。暂停期间周期是否积累，会直接影响恢复后的行为。仅给一个period字段并不能表达全部需求，时间来源和落后处理才决定计时器在异常情况下做什么。"
          ]
        },
        {
          "title": "超时余量不应该无意丢失",
          "paragraphs": [
            "累计到1.1秒时触发一次，若直接设为零，就把超过周期的0.1秒丢掉。下次又从零开始，频繁丢失后，实际节拍会越来越偏。这个现象可以用一串输入直接计算，不需要真实等很久。",
            "更合适的基础做法是减去已处理的1秒，保留0.1秒。注意这只解决余量被无意丢弃，不代表所有调度都精确，也没有消除浮点误差。每一步应能解释处理了多少时间、留下多少时间。"
          ]
        },
        {
          "title": "一个增量可能跨过多个周期",
          "paragraphs": [
            "若累计2.4秒，只用if触发一次并减1，还剩1.4秒。while可以继续处理第二次，留下0.4秒。这样对应已经跨过的两个周期，而不是假定一帧最多只需要一次。",
            "但“需要补发”是设计前提。只更新显示时，执行两次相同刷新可能没有价值；可以直接计算最新状态。循环次数应该由系统含义决定，不能因为while看起来更完整，就对所有功能补发全部历史事件。"
          ]
        },
        {
          "title": "追赶也会消耗当前帧",
          "paragraphs": [
            "长卡顿积累大量周期，补发每次又有成本，就可能让下一帧继续变长，再积累更多。完全无限追赶会放大卡顿。示例使用maxPerFrame限制每帧最多处理多少次，给当前帧工作量一个边界。",
            "上限不是时间自动正确的证明。超过上限之后还要决定保留积压、合并结果还是丢弃。只加计数器却不说明余下时间如何处理，会让测试者无法判断之后延迟执行是错误还是预期。"
          ]
        },
        {
          "title": "读懂示例最后的取余",
          "paragraphs": [
            "示例在达到上限后，如果还剩至少一个完整周期，就对周期取余。这保留不足一个周期的零头，却丢掉额外完整周期。若积累10.2秒、周期1秒、上限4，处理4次后最后保留约0.2秒，另外6次不再补发。",
            "这是一项明确的丢弃策略，适合教学观察，不能当作所有计费或战斗逻辑的默认算法。正式系统可以记录丢弃次数，或将未处理的总量合并计算。选择必须与功能允许的误差一致。"
          ]
        },
        {
          "title": "字符串调度也不能省略生命周期",
          "paragraphs": [
            "某些延时接口按方法名调度，调用方便，但方法重命名、取消入口和对象结束都需要注意。用协程或显式计时器，也同样要说明任务何时开始、暂停、结束，工具名称不会替你决定这些规则。",
            "把一个任务的状态保存在清楚位置，便于检查重复启动和停止遗漏。对于只在启用期间运行的任务，测试开关后是否叠加；对于跨场景服务，确认旧对象结束后没有继续请求。计时准确与任务是否仍有意义是两个问题。"
          ]
        },
        {
          "title": "用相同总时长的不同分割测试",
          "paragraphs": [
            "准备总计相同的增量序列，例如小步均匀输入和夹杂一个大步的输入，比较触发数与剩余时间。若按设计应一致却不同，就检查归零、边界比较和上限策略。可控输入比手动等秒更容易重做。",
            "测试零增量、恰好到周期、稍微超过、跨多个周期和超过补发上限。表中记录输入前后余量、触发次数与丢弃量，才能同时检查节拍规则和最坏工作量，而不只是观察日志似乎每秒出现。"
          ]
        }
      ],
      "code": {
        "title": "保留余量且有补发上限",
        "language": "csharp",
        "filename": "PeriodicProbe.cs",
        "source": "using UnityEngine;\npublic sealed class PeriodicProbe : MonoBehaviour\n{\n    [SerializeField, Min(0.01f)] float period = 1f;\n    [SerializeField, Min(1)] int maxPerFrame = 4;\n    double accumulated;\n    void Update()\n    {\n        double safePeriod = Mathf.Max(0.01f, period);\n        accumulated += Time.deltaTime;\n        int count = 0;\n        while (accumulated >= safePeriod && count < Mathf.Max(1, maxPerFrame))\n        {\n            accumulated -= safePeriod;\n            count++;\n            Debug.Log(\"Period elapsed\", this);\n        }\n        if (accumulated >= safePeriod) accumulated %= safePeriod;\n    }\n}",
        "explanation": [
          "PeriodicProbe 用缩放deltaTime累计。达到maxPerFrame后取余，表示丢弃超出预算的完整周期；它不是稍后补齐全部积压的方案。"
        ]
      },
      "lab": [
        {
          "title": "手算余量再验证",
          "minutes": 60,
          "steps": [
            "将计时规则放入可传增量的方法，依次输入0.4、0.4、0.4秒。",
            "比较触发后归零与减1秒两种方法，记录触发次数和剩余时间。",
            "准备总时长相同但分段不同的输入，核对规则是否按预期一致。"
          ],
          "result": "用数值说明归零丢余量如何产生漂移。"
        },
        {
          "title": "明确长帧后的处理",
          "minutes": 60,
          "steps": [
            "输入跨10个周期的大增量，分别演算全部补发、合并与跳过。",
            "为每种策略写具体适用例子，估计最多需要执行多少次工作。",
            "加入maxPerFrame限制，记录超过上限的完整周期最后保留还是丢弃。"
          ],
          "result": "时间含义与每帧工作上限都可解释。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "周期运行越久越慢",
          "cause": "每次到期把累计清零丢掉余量",
          "fix": "减去周期或采用明确截止时刻算法"
        },
        {
          "symptom": "卡顿后补发大量任务进一步卡顿",
          "cause": "没有补偿上限和积压策略",
          "fix": "限制每帧工作量并选择丢弃、合并或延后"
        }
      ],
      "exercise": {
        "brief": "为持续伤害、界面刷新和资源重试分别选择漏周期策略，实现其中一个可测试模型，并记录补发或丢弃量。",
        "deliverables": [
          "三种策略说明",
          "时间序列测试",
          "最坏成本与取消协议"
        ],
        "rubric": [
          {
            "item": "余量处理正确",
            "points": 25
          },
          {
            "item": "策略符合具体需求",
            "points": 25
          },
          {
            "item": "补偿工作有界",
            "points": 25
          },
          {
            "item": "测试覆盖不同帧分割",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "周期1秒，累计1.1秒触发后减去1秒，剩余多少？",
          "options": [
            "约0.1秒",
            "0秒",
            "仍为1.1秒",
            "负0.1秒"
          ],
          "answer": 0,
          "explanation": "超过周期的0.1秒已经发生，减周期会保留这部分余量。"
        },
        {
          "question": "长帧后是否总应补发全部周期？",
          "options": [
            "总应全部立即补发",
            "取决于功能含义与每帧工作预算",
            "总应全部丢弃",
            "只要改成double就无需选择策略"
          ],
          "answer": 1,
          "explanation": "显示、伤害与重试的要求不同，不能套一个补发答案。"
        },
        {
          "question": "有界补偿主要防止什么？",
          "options": [
            "防止所有浮点误差",
            "保证永远不漏任何历史事件",
            "防止积压追赶继续放大卡顿",
            "自动让每个回调在精确时刻运行"
          ],
          "answer": 2,
          "explanation": "限制每帧补偿次数控制最坏工作量，剩余积压仍需明确处理。"
        }
      ],
      "references": [
        {
          "label": "MonoBehaviour.InvokeRepeating",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.InvokeRepeating.html"
        },
        {
          "label": "Time.timeAsDouble",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-timeAsDouble.html"
        },
        {
          "label": "Time.deltaTime",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-deltaTime.html"
        }
      ],
      "summary": [
        "处理一个周期后减去周期，保留余量。",
        "补偿有上限以后，还要明确剩余积压怎样处理。"
      ],
      "teaching": {
        "question": "每隔1秒执行一次，累计到1.1秒时触发后归零，为什么长时间运行会越来越晚？",
        "keyIdea": "超过周期的余量也是已经过去的时间。要保留它，并明确卡顿后补多少、合并多少或丢弃多少，才能控制节拍与工作量。",
        "walkthrough": [
          {
            "title": "计算一次超时",
            "text": "周期1秒，累计1.1秒触发一次，减去1秒以后还剩0.1秒，不能把这0.1秒当作没发生。"
          },
          {
            "title": "比较连续输入",
            "text": "依次加入0.4、0.4、0.4秒后触发一次，剩0.2秒；归零方案会丢掉这部分余量。"
          },
          {
            "title": "遇到长帧",
            "text": "一次积累10个周期，示例最多处理4次，随后取余丢弃额外完整周期。它明确选择有限工作量，而非全部补发。"
          }
        ],
        "prediction": {
          "question": "只要用 while 补齐所有周期，就一定比单次触发更好吗？",
          "answer": "不一定。积压过多时补发本身会继续卡顿；应按功能决定补发、合并或跳过，并设置每帧工作上限。"
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
      "id": "l025",
      "title": "固定模拟与显示插值：平滑并不等于更准",
      "prerequisites": [
        "l024"
      ],
      "goals": [
        "分别记录模拟位置与显示位置",
        "计算插值比例并观察延迟",
        "传送时同步重置历史，避免位置争写"
      ],
      "theory": [
        {
          "title": "模拟与显示可以使用不同频率",
          "paragraphs": [
            "假设位置每0.1秒更新一次，每次前进0.1单位。模拟速度为1单位/秒，但画面若直接显示最新位置，可能连续几帧停在原地，然后跳一下。问题来自状态更新与绘制频率不同，不一定是速度计算错误。",
            "插值在相邻已知状态之间选择显示位置，让画面更连续。它没有在两次模拟之间再求新的物理接触，也没有修改已经算好的current。先分清“模拟状态在哪里”和“画面画在哪里”，才能解释为什么平滑与准确不是一回事。"
          ]
        },
        {
          "title": "保存前后两个样本",
          "paragraphs": [
            "示例每次模拟前令previous=current，再推进current。previous是上一模拟样本，current是新样本。显示阶段使用这两个已知值，不把每次绘制结果当成下一次模拟起点，否则显示平滑会反过来改变规则。",
            "例如previous.x=0.2、current.x=0.3，显示可以取中间0.25。这个值描述画面过渡，不表示模拟额外执行了半个物理步骤。将三者分别打印或画线，能看出显示位置与实际模拟状态的区别。"
          ]
        },
        {
          "title": "累计余量决定插值比例",
          "paragraphs": [
            "固定步执行后，accumulator保留不足一个步长的时间。用余量除以Step，得到0到1之间的比例。余量0.05秒、步长0.1秒，比例就是0.5，显示前后样本的中点。比例不是速度，也不是任意平滑强度。",
            "下一帧余量增加，显示继续接近current；达到下一步时，模拟产生新样本，再开始下一段。这样时间的推进与样本的替换相互配合，而不是每帧盲目把当前位置向目标挪固定百分比。"
          ]
        },
        {
          "title": "平滑常以落后一点为代价",
          "paragraphs": [
            "用过去与当前已知样本插值，画面通常落后最新模拟状态约一个步长范围。这个延迟换来不必预测未来的平滑。它可能适合远处对象，却不一定适合需要极低输入延迟的控制体验。",
            "外推则根据速度等估计未来状态，能够减少一部分落后，却可能猜错并需要修正。两者没有一个永远最佳。比较时要同时看连续性、响应延迟和突变时的表现，不能只凭看起来顺滑就认定系统更准确。"
          ]
        },
        {
          "title": "传送要中断旧历史",
          "paragraphs": [
            "传送是不连续变化。若current从1改成100而previous仍为旧位置，显示可能在两者之间穿过长距离。应在明确的传送操作中，同时把前后样本设到新位置，并决定余量如何重置，避免用旧轨迹插值。",
            "对象池复用、重生和场景重定位也可能需要同样处理。仅修改Transform不能保证自定义模拟缓存同步；下一帧脚本可能又用旧样本把它拉回。检查谁保存真实状态，比反复调整插值系数更重要。"
          ]
        },
        {
          "title": "刚体插值要交给物理系统配合",
          "paragraphs": [
            "Unity刚体提供自己的插值选项，涉及物理状态和Transform显示的协调。若启用后又由另一个脚本每帧写同一Transform，就出现多个位置控制者，可能抖动或与接触结果不一致。",
            "本例只挂无刚体显示对象，演示自定义样本插值，不是完整物理引擎或网络回滚实现。将结构示意直接贴到动态刚体上，不会自动保留全部物理规则。实际控制器应选择正确物理接口，并明确根对象由谁移动。"
          ]
        },
        {
          "title": "长帧也需要模拟追赶上限",
          "paragraphs": [
            "示例一帧最多推进8步，超过后取余，丢弃额外完整步。这防止演示无限追赶，却意味着长卡顿时未模拟全部经过时间，不能据此宣称严格确定或永不丢时。上限策略与周期计时器的问题相同。",
            "实验先用正常帧长比较current是否一致，再制造大增量检查丢步。最后测试传送、停用与重新开始，确认样本和显示都重置到预期位置。把轨迹、延迟和结束行为一起验收，才能判断平滑方案是否适合实际需求。"
          ]
        }
      ],
      "code": {
        "title": "无刚体数值模拟与视觉插值",
        "language": "csharp",
        "filename": "InterpolationProbe.cs",
        "source": "using UnityEngine;\npublic sealed class InterpolationProbe : MonoBehaviour\n{\n    const float Step = 0.1f;\n    Vector3 previous, current;\n    float accumulator;\n    void Awake() => previous = current = transform.position;\n    void Update()\n    {\n        accumulator += Time.deltaTime;\n        int steps = 0;\n        while (accumulator >= Step && steps < 8)\n        {\n            previous = current;\n            current += Vector3.right * Step;\n            accumulator -= Step;\n            steps++;\n        }\n        if (accumulator >= Step) accumulator %= Step;\n        transform.position = Vector3.Lerp(previous, current, accumulator / Step);\n    }\n}",
        "explanation": [
          "仅用于无刚体对象。模拟速度1单位/秒，步长0.1秒，显示在前后样本间插值；一帧最多8步，额外完整积压被丢弃，不能视为完整物理或确定性方案。"
        ]
      },
      "lab": [
        {
          "title": "比较样本和画面",
          "minutes": 60,
          "steps": [
            "先直接显示current，使用0.1秒步长观察阶梯移动。",
            "启用插值，使用同样输入比较current记录，确认模型没有因显示改变。",
            "记录显示位置与最新current的差别，解释平滑为何伴随一定落后。"
          ],
          "result": "同时比较连续性与延迟，而不把两者当作模拟精度。"
        },
        {
          "title": "测试传送与写入来源",
          "minutes": 60,
          "steps": [
            "加入明确传送方法，同时重置previous和current。",
            "在副本仅改current，观察跨距离过渡，再恢复完整重置。",
            "另用刚体插值实验，检查所有写Transform的脚本，明确物理根由谁控制。"
          ],
          "result": "传送历史会重置，位置不会被多个系统无意竞争。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "平滑后碰撞时刻仍离散",
          "cause": "插值只改变显示，不增加物理模拟步",
          "fix": "按需求分别调整模拟设置与显示策略"
        },
        {
          "symptom": "传送时角色从远处滑过来",
          "cause": "没有重置插值历史",
          "fix": "在不连续状态改变时同步重置前后样本"
        }
      ],
      "exercise": {
        "brief": "用固定步模型制作可暂停和传送的标记，切换直接显示与插值，证明显示选择不改变模型样本。",
        "deliverables": [
          "模型与显示所有权图",
          "延迟与轨迹对照",
          "长帧和传送测试"
        ],
        "rubric": [
          {
            "item": "模拟显示分离",
            "points": 25
          },
          {
            "item": "插值代价解释正确",
            "points": 25
          },
          {
            "item": "传送历史重置",
            "points": 25
          },
          {
            "item": "追赶预算明确",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "插值平滑是否增加真实物理碰撞模拟次数？",
          "options": [
            "不会，它利用已有状态改善显示",
            "会，每帧插值都多做一次接触计算",
            "只有2D会增加碰撞次数",
            "只要画面连续就说明模拟精度提高"
          ],
          "answer": 0,
          "explanation": "显示中间位置不是额外物理模拟。"
        },
        {
          "question": "传送时通常应如何处理历史？",
          "options": [
            "只写Transform而不改缓存",
            "同步重置前后样本，避免跨距离过渡",
            "永远保留旧样本以增加平滑",
            "只提高插值速度"
          ],
          "answer": 1,
          "explanation": "传送要明确打断连续轨迹，否则旧历史仍参与显示。"
        },
        {
          "question": "刚体插值后再每帧覆盖同一 Transform 有什么风险？",
          "options": [
            "总能同时得到两套控制的优点",
            "最多影响显示，不会与物理冲突",
            "多个系统争写位置，可能抖动或不一致",
            "会自动把刚体改成无碰撞模式"
          ],
          "answer": 2,
          "explanation": "应明确物理根由谁控制，避免插值与Transform覆盖互相竞争。"
        }
      ],
      "references": [
        {
          "label": "Rigidbody.interpolation",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-interpolation.html"
        },
        {
          "label": "Vector3.Lerp",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Vector3.Lerp.html"
        },
        {
          "label": "Time.fixedTime",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-fixedTime.html"
        }
      ],
      "summary": [
        "显示连续不代表物理模拟更密。",
        "传送要中断旧样本，动态刚体应由明确物理控制者移动。"
      ],
      "teaching": {
        "question": "每0.1秒更新一次的位置看起来一格一格跳，插值为什么能变平滑，却不能让碰撞更精确？",
        "keyIdea": "模拟决定实际状态，显示可以在已有状态间绘制中间位置。插值增加画面连续性，不会自动增加模拟次数，而且通常引入延迟。",
        "walkthrough": [
          {
            "title": "计算模拟样本",
            "text": "示例速度1单位/秒，固定步长0.1秒，每步先保存旧current，再让current向右增加0.1单位。"
          },
          {
            "title": "计算显示位置",
            "text": "剩余累计0.05秒时，比例0.05/0.1=0.5，显示previous与current中点，但current本身不因此改变。"
          },
          {
            "title": "比较真实变化",
            "text": "直接显示current会阶梯跳动，插值更连续；两者模拟样本相同，所以不能据此说碰撞计算更多。"
          }
        ],
        "prediction": {
          "question": "从x=1传送到x=100，只改current却保留旧previous，会看到什么？",
          "answer": "插值可能沿旧位置到新位置的长距离绘制过渡。传送应同时重置历史样本，明确中断原来的连续轨迹。"
        }
      }
    }
  ]
});
