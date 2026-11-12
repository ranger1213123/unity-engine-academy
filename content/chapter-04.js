window.COURSE_MODULES.push({
  "id": "m04",
  "number": 4,
  "title": "Transform 与空间数学",
  "subtitle": "给每个位置、方向和角度写明空间",
  "description": "掌握世界与局部坐标、向量单位、四元数旋转、屏幕投影与层级缩放，能够推理而非反复试数值。",
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
      "id": "l016",
      "title": "世界坐标、局部坐标与重新设父对象",
      "prerequisites": [
        "l015"
      ],
      "goals": [
        "用父子对象解释世界与局部位置",
        "预测换父级时哪套数值需要改变",
        "明确挂点吸附和放下的局部姿态"
      ],
      "theory": [
        {
          "title": "同一位置可以用不同参照来描述",
          "paragraphs": [
            "想象角色站在移动平台上。相对于平台，角色没有挪脚；相对于场景地面，角色跟着平台移动。这就是局部坐标与世界坐标描述同一对象的两种方式。position 表示世界位置，localPosition 表示相对父对象的位置。",
            "先只考虑平移：父级世界 x 为5，子级局部 x 为2，子级世界 x 为7。这个简单例子帮助理解两组数值为什么可以不同，但不能据此认为所有层级位置都能简单相加。后面加入旋转和缩放，换算过程就会改变。"
          ]
        },
        {
          "title": "父级旋转会改变局部轴的方向",
          "paragraphs": [
            "父对象旋转后，它的“右方”不再必然是世界右方。子对象 localPosition=(2,0,0)，表示沿父对象局部 x 方向偏移2个单位。局部数值没变，世界方向却可能已经变化，因此世界位置也会改变。",
            "实验时保留子级局部值，只转父级，记录两套坐标并画出坐标轴。这样能看到改变来自参照系，而不是某段隐藏脚本在改子对象字段。不要因为 Inspector 局部位置没动，就断言对象在场景里没移动。"
          ]
        },
        {
          "title": "点转换要包含整套父级变换",
          "paragraphs": [
            "一个局部位置点要转为世界位置，可以使用 TransformPoint。它考虑当前变换的平移、旋转与缩放。与之对应的逆变换能把世界点转换回局部坐标，适合检查某个世界目标在挂点坐标系中位于哪里。",
            "使用前先明确点属于谁的局部空间。拿 A 的局部数值交给 B 转换，会得到数值上合法却意义错误的结果。转换方法不会知道你心里想的是哪个对象，所以记录时应同时写“这个点相对于谁”，不能只写三个数字。"
          ]
        },
        {
          "title": "换父级时先决定要保留什么",
          "paragraphs": [
            "把物品从地面挂到角色手上，有两种需求：保持眼前世界姿态不跳变，或保持局部设置让它随新父级重新定位。SetParent 的 worldPositionStays 参数就是帮助表达这类差别，调用前应先写清你期望的结果。",
            "选择保留世界变换后，局部数值通常需要改变；选择保留局部数值后，世界结果可能改变。这里不存在两套数值永远同时不变的普遍保证。面对旋转与缩放复杂的层级，更应该实际记录结果，而不是只观察某一个字段。"
          ]
        },
        {
          "title": "吸附需要明确设置局部姿态",
          "paragraphs": [
            "示例的 Attach 先设置 socket 为父级，再令 localPosition 为零、localRotation 为单位旋转。零位置表示与挂点原点重合；单位旋转表示相对父级没有额外旋转。这样比尝试几个世界偏移值更明确。",
            "SetParent(false) 本身不等于把所有局部值自动归零。物品如果还需要美术上的握持偏移，应明确保留在专用子对象或配置中。先让逻辑挂点对齐，再处理模型修正，能避免角色转向后偏移忽然跑到另一边。",
            "这里尚未重置 localScale。若物品原来局部缩放为2，Attach 后它仍可能保留这个数，再叠加 socket 的层级缩放。若需求是直接采用挂点尺寸，应明确设置合适的局部缩放；若需求是保留模型自身尺寸，则需要把模型修正和挂点规则分开。位置归零、旋转对齐和尺寸一致，是三个可分别验收的条件。"
          ]
        },
        {
          "title": "解除父级也要说明保留目标",
          "paragraphs": [
            "Detach 用 SetParent(null,true) 去掉父级并尽量保留当前世界姿态。此后平台或角色再移动，物品不再通过这个父子关系跟随。这是改变变换关系，不是自动删除对象，也不等于取消所有脚本约束。",
            "若还有跟随脚本每帧写位置，解除父级后仍可能跟随。排查时应查看谁还在写 Transform。父级变化也可能改变层级活动状态，因此“离开关闭的父对象后又出现”需要同时检查活动状态，不能只归因于位置。"
          ]
        },
        {
          "title": "用一张前后表核对转换",
          "paragraphs": [
            "表中列出父级位置、旋转、缩放，以及子级的世界与局部位置。每次只改父级一项，再比较。这能把简单平移例子与旋转、非均匀缩放条件分开，指出之前的相加公式在哪些前提下才成立。",
            "最后测试两个姿态不同的挂点和一次解除父级。每次操作前预测保留世界还是局部，之后核对画面与数值。能说明两套坐标为何变化，比记住某个按钮通常会让物品看起来正确更有用。"
          ]
        }
      ],
      "code": {
        "title": "挂点与世界位置保留",
        "language": "csharp",
        "filename": "ParentSpaceProbe.cs",
        "source": "using UnityEngine;\npublic sealed class ParentSpaceProbe : MonoBehaviour\n{\n    [SerializeField] Transform socket;\n    [ContextMenu(\"Attach at socket\")]\n    void Attach()\n    {\n        if (socket == null) return;\n        transform.SetParent(socket, false);\n        transform.localPosition = Vector3.zero;\n        transform.localRotation = Quaternion.identity;\n    }\n    [ContextMenu(\"Detach keeping world\")]\n    void Detach() => transform.SetParent(null, true);\n}",
        "explanation": [
          "把 ParentSpaceProbe 挂到待挂接对象，socket 指向另一个挂点。从组件菜单执行 Attach 或 Detach。吸附由设父级、归零局部位置和旋转共同完成，不是 SetParent 单独完成。"
        ]
      },
      "lab": [
        {
          "title": "记录两套坐标",
          "minutes": 60,
          "steps": [
            "建立父子对象，记录世界与局部位置；先让父级只有平移，再加入旋转和缩放。",
            "每次只改父级一项，保持子级localPosition不动，比较世界结果。",
            "用父级TransformPoint转换子级局部位置，核对简单相加在哪些前提才成立。"
          ],
          "result": "用具体数值说明参照系参与位置换算。"
        },
        {
          "title": "明确换父和挂点吸附",
          "minutes": 60,
          "steps": [
            "建立两个姿态不同的socket，分别测试SetParent的true和false。",
            "记录局部与世界变化，再执行示例显式归零，区分换父和吸附。",
            "解除父级并保留世界姿态，观察是否跳变，同时检查层级活动状态。"
          ],
          "result": "每次操作都能说明希望保留哪一组结果。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "换父对象后角色突然跳走",
          "cause": "局部数值被新参照系重新解释",
          "fix": "明确 worldPositionStays，并显式设置挂点局部姿态"
        },
        {
          "symptom": "局部位置没变但世界位置变了",
          "cause": "父对象变换参与层级映射",
          "fix": "按空间读取数值，检查完整父层级"
        }
      ],
      "exercise": {
        "brief": "制作可拾取物：吸附时明确局部位置和旋转，放下时保持世界姿态，禁止用固定世界坐标修补。",
        "deliverables": [
          "组件与场景",
          "换父前后坐标表",
          "旋转和缩放父对象后的验证"
        ],
        "rubric": [
          {
            "item": "参照空间标注明确",
            "points": 25
          },
          {
            "item": "SetParent 参数正确",
            "points": 25
          },
          {
            "item": "转换不依赖简化假设",
            "points": 25
          },
          {
            "item": "位置写入者唯一",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "父对象旋转后，子对象 localPosition 不变意味着世界位置不变吗？",
          "options": [
            "不意味着，父级可改变局部轴在世界中的方向",
            "一定不变，局部坐标是最终位置",
            "只要子对象没有脚本就一定不变",
            "只有改变缩放才会改变世界位置"
          ],
          "answer": 0,
          "explanation": "局部位置相对于父级，父级旋转会改变它对应的世界位置。"
        },
        {
          "question": "TransformPoint 适合转换什么？",
          "options": [
            "忽略平移的纯方向",
            "需要包含平移等影响的位置点",
            "直接把屏幕像素变成地面坐标",
            "只需要改变长度的速度"
          ],
          "answer": 1,
          "explanation": "位置点与方向意义不同，TransformPoint 包含位置点所需的变换。"
        },
        {
          "question": "想吸附到挂点，较明确的做法是？",
          "options": [
            "直接试一个世界坐标常量",
            "只换父级并假定自动归零",
            "设父级后明确设置局部位置和旋转",
            "只设localScale为1，位置与旋转便会自动归零"
          ],
          "answer": 2,
          "explanation": "归零位置和指定相对旋转，才能清楚表达对齐结果。"
        }
      ],
      "references": [
        {
          "label": "Transform.SetParent",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.SetParent.html"
        },
        {
          "label": "Transform.TransformPoint",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformPoint.html"
        }
      ],
      "summary": [
        "坐标必须说明以谁为参照。",
        "设父级与吸附归零不是同一操作。"
      ],
      "teaching": {
        "question": "父对象向右移动5个单位，子对象的 localPosition 没变，为什么画面位置仍然变了？",
        "keyIdea": "局部坐标以父对象为参照，世界坐标以整个场景为参照。换参照系时要说明希望保留哪一组结果。",
        "walkthrough": [
          {
            "title": "建立简单坐标",
            "text": "先让父对象只有平移：世界 x 为5，子对象局部 x 为2，此时子对象世界 x 为7。"
          },
          {
            "title": "加入父级旋转",
            "text": "把父对象绕 Y 轴旋转90度，子对象局部坐标仍保持不变，但它在世界中的方向和位置会随父级变化。"
          },
          {
            "title": "明确吸附结果",
            "text": "执行 Attach at socket，先设父级，再将局部位置归零、局部旋转设为单位旋转，明确让对象与挂点对齐。"
          }
        ],
        "prediction": {
          "question": "仅调用 SetParent(socket,false)，是否就一定吸附到挂点原点？",
          "answer": "不一定。它保留局部变换数值，不会自动把已有 localPosition 归零；示例另有明确归零步骤。"
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
      "id": "l017",
      "title": "向量、长度与投影：移动之前先检查单位",
      "prerequisites": [
        "l016"
      ],
      "goals": [
        "写清方向、速度与位移各自的单位",
        "比较归一化与限幅对半强度输入的影响",
        "用方向线解释点积和投影"
      ],
      "theory": [
        {
          "title": "先看数字表达的是什么",
          "paragraphs": [
            "Vector3 可以表示位置，也可以表示方向、速度或位移，类型相同不表示意义相同。targetPosition-currentPosition 得到从当前点指向目标的位移。它的长度是距离，尚不是长度必为1的方向。",
            "例如当前点(1,0,0)、目标(4,0,0)，相减得到(3,0,0)。长度3表示相距3个单位。若只需要朝向，可再归一化；若要判断是否接近，保留距离才有用。计算前给数值写上含义，可以避免把不同量直接相加。"
          ]
        },
        {
          "title": "斜向更快来自长度增加",
          "paragraphs": [
            "键盘右键产生(1,0)，右上同时按下可能得到(1,1)。后者长度为√2，而不是1。若两者都直接乘速度5，斜向速度约为7.07，因此更快并不是 Update 调用了更多次，而是输入向量更长。",
            "将最大长度限制到1，可以让满强度输入在各方向具有相同最大速度。零向量仍是零。先手算长度，再对照实际位移，能说明修复针对的是大小，而不是碰巧把某个方向的坐标改小。"
          ]
        },
        {
          "title": "归一化可能丢掉模拟强度",
          "paragraphs": [
            "手柄轻推得到(0.3,0.4)，长度0.5，通常希望走满速的一半。normalized 会保留方向却把非零长度变成1，使轻推也满速。ClampMagnitude 只有超过上限才缩短，小于上限则保留原强度。",
            "所以先问输入要不要表达力度。纯键盘方向可以适合归一化，模拟摇杆一般还要保留大小。示例用限幅展示这种差别，实际 Input System 的复合绑定和处理器也可能已处理长度，实验应记录配置，避免重复加工后误判。"
          ]
        },
        {
          "title": "速度与位移要用时间连接",
          "paragraphs": [
            "输入通常没有世界距离单位，乘 speed 后才得到每秒移动多少单位的速度。再乘本步时间，才得到这一步位移。速度3单位/秒，时间0.02秒，满输入位移0.06单位；半输入则0.03单位。",
            "先算位移delta=velocity×dt，再把delta加到position。帧间隔变长时，单步应走得更远，但相同时间内调用次数更少；这样总距离才不会只由帧率决定。示例没有刚体，只演示Transform移动；动态刚体应由相应物理接口控制。"
          ]
        },
        {
          "title": "点积帮助比较两个方向",
          "paragraphs": [
            "把角色 forward 与指向目标的单位方向点乘，结果在前方时为正、后方时为负、垂直时为零。两个单位方向的点积等于夹角余弦，不是角度本身，因此不能将0.5直接称为0.5度。",
            "这个规则不依赖角色面朝世界哪个方向。角色转身后，目标是否在前应随 forward 改变，而不是始终比较目标世界 z 是否更大。先画方向线，再看点积，能把数字与几何关系对应起来。",
            "用数字看投影更容易理解：两个单位方向 u=(1,0,0)、v=(0.6,0.8,0)，点积 u·v=0.6，表示 v 沿 u 的有符号分量为0.6。若要得到真正的投影向量，还要乘回 u，得到(0.6,0,0)。只有参照方向已归一化时，才能这样直接用点积作投影长度；未归一化时还必须处理它的长度。"
          ]
        },
        {
          "title": "投影用于保留某个平面上的分量",
          "paragraphs": [
            "想让角色在地面转向时，可把目标方向投影到地面平面，去掉不需要的竖直分量。目标在高处仍能提供水平朝向，但投影后可能接近零，例如目标恰好在头顶，这时需要明确保留旧朝向或采取其他处理。",
            "ProjectOnPlane 表达按平面法线去掉对应分量，比在所有场景都随手把 y 设零更一般。若地面不是水平，直接清零世界 y 与投影到斜面不是同一操作。使用前先说明允许在哪个平面运动。"
          ]
        },
        {
          "title": "用画线与测量交叉检查",
          "paragraphs": [
            "Debug.DrawRay 可以帮助观察方向和长度，但它是调试显示，不代表物理碰撞检测已经发生。先记录输入、限幅结果、速度与位移，再测相同时间的路程，才能检查计算与视觉是否一致。",
            "将输入依次设为轴向、斜向、半强度和零，比较结果。若半强度仍满速，应检查是否提前 normalized；若斜向更快，应检查上游是否未限幅。每个结果都对应一个明确处理步骤，排查就不必盲目调整 speed。"
          ]
        }
      ],
      "code": {
        "title": "保留输入强度的平面速度",
        "language": "csharp",
        "filename": "VectorMotionProbe.cs",
        "source": "using UnityEngine;\npublic sealed class VectorMotionProbe : MonoBehaviour\n{\n    [SerializeField] Vector2 input = new Vector2(0.3f, 0.4f);\n    [SerializeField, Min(0f)] float speed = 3f;\n    void Update()\n    {\n        Vector2 limited = Vector2.ClampMagnitude(input, 1f);\n        Vector3 velocity = new Vector3(limited.x, 0f, limited.y) * speed;\n        transform.position += velocity * Time.deltaTime;\n        Debug.DrawRay(transform.position, velocity, Color.cyan);\n    }\n}",
        "explanation": [
          "VectorMotionProbe 只用于没有刚体的对象。输入先限幅，再乘每秒速度和本帧时间；(0.3,0.4)会保留半强度。动态刚体移动不应照搬此 Transform 写法。"
        ]
      },
      "lab": [
        {
          "title": "用同组输入比较三种处理",
          "minutes": 60,
          "steps": [
            "把输入依次设为(1,0)、(1,1)、(0.3,0.4)与零，先算长度。",
            "比较原值、normalized和ClampMagnitude后的值，预测每秒位移。",
            "在无刚体对象上测相同时间的距离，表中分开输入强度、速度与位移。"
          ],
          "result": "能解释斜向限速与半推慢走是怎样同时成立的。"
        },
        {
          "title": "把点积与投影画出来",
          "minutes": 60,
          "steps": [
            "在角色前后左右放4个目标，计算forward与各目标单位方向点积。",
            "将一个带竖直分量的方向投影到水平面，用不同颜色画原向量和结果。",
            "旋转角色后重做，比较前方判断为何不能只看世界z。"
          ],
          "result": "数字结果与方向几何对应，而非只背公式。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "手柄轻推也全速",
          "cause": "对所有非零输入直接 normalized",
          "fix": "按控制目标采用 ClampMagnitude 保留小幅强度"
        },
        {
          "symptom": "半径检测范围异常",
          "cause": "sqrMagnitude 与未平方半径比较",
          "fix": "两边使用一致的平方单位"
        }
      ],
      "exercise": {
        "brief": "编写不依赖具体设备的平面移动函数，保留半强度输入，再加入前方判断与零方向保护。",
        "deliverables": [
          "函数与单位说明",
          "四组输入测试表",
          "点积几何截图"
        ],
        "rubric": [
          {
            "item": "空间与单位正确",
            "points": 25
          },
          {
            "item": "模拟输入强度保留",
            "points": 25
          },
          {
            "item": "零向量和阈值处理清晰",
            "points": 25
          },
          {
            "item": "点积不是角度的解释正确",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "targetPosition - currentPosition 表示什么？",
          "options": [
            "从当前点指向目标的位移",
            "已经归一化的方向",
            "两个位置的平均点",
            "目标相对当前的速度"
          ],
          "answer": 0,
          "explanation": "相减保留距离大小，不会自动归一化或求速度。"
        },
        {
          "question": "轻推手柄仍要慢走，应优先考虑？",
          "options": [
            "始终 normalized",
            "用 ClampMagnitude 限制最大长度",
            "将非满强度输入全部当零",
            "先把每个分量都设为1"
          ],
          "answer": 1,
          "explanation": "限幅保留未超过上限的输入强度；归一化会丢掉非零输入的大小。"
        },
        {
          "question": "两个单位方向的点积是什么？",
          "options": [
            "直接得到角度的度数",
            "得到两个对象的距离",
            "得到夹角的余弦",
            "只要都是单位向量就总为1"
          ],
          "answer": 2,
          "explanation": "单位方向点积描述夹角关系，不是位置距离或角度单位。"
        }
      ],
      "references": [
        {
          "label": "Vector3.ClampMagnitude",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Vector3.ClampMagnitude.html"
        },
        {
          "label": "Vector3.Dot",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Vector3.Dot.html"
        },
        {
          "label": "Vector3.ProjectOnPlane",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Vector3.ProjectOnPlane.html"
        }
      ],
      "summary": [
        "输入方向乘速度得到速度，再乘时间才得到位移。",
        "限幅保留小输入，归一化会改变非零输入大小。"
      ],
      "teaching": {
        "question": "按右键速度正常，同时按右上却更快；轻推摇杆又为什么不该总被变成满速？",
        "keyIdea": "向量同时包含方向和大小。移动计算应区分输入强度、速度和每一步位移，限幅与归一化的作用也不同。",
        "walkthrough": [
          {
            "title": "先计算长度",
            "text": "输入(1,0)长度为1，输入(1,1)长度为√2，约1.414，所以原样乘同一速度会让斜向更快。"
          },
          {
            "title": "保留小输入",
            "text": "输入(0.3,0.4)长度为0.5。ClampMagnitude 限到1会保留它，normalized 则把长度变成1。"
          },
          {
            "title": "计算位移",
            "text": "速度3单位/秒，输入强度0.5时实际速度1.5单位/秒；若一帧0.02秒，本帧位移是0.03单位。"
          }
        ],
        "prediction": {
          "question": "两段方向都是单位向量，点积为0，是否表示两个对象在同一位置？",
          "answer": "不是。它说明方向相互垂直；点积没有提供对象位置是否相同的信息。"
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
      "id": "l018",
      "title": "四元数、欧拉角与平滑转向",
      "prerequisites": [
        "l017"
      ],
      "goals": [
        "区分欧拉显示值与四元数表示",
        "将角速度换算为单步最大角度",
        "比较恒速、定时与逐渐靠近三种转向"
      ],
      "theory": [
        {
          "title": "先明确你希望怎样转",
          "paragraphs": [
            "转向可以有不同要求。炮塔可能需要恒定角速度，界面演出可能要求恰好用一段时间转完，摄像机跟随则常希望逐渐接近目标。它们都看似平滑，时间含义却不同，不能用一个“平滑”词代替需求。",
            "先写出可检查条件：120度/秒，或从开始到结束用0.5秒。之后再选择接口与参数。否则把某个插值比例调到看起来顺眼，只能说明当前场景的视觉效果，无法预测换帧率或换转角后的表现。"
          ]
        },
        {
          "title": "欧拉角是方便输入的表达",
          "paragraphs": [
            "Inspector 用三个角度帮助编辑旋转，代码里的 Quaternion 则用另一种表示。Quaternion.x、y、z、w 不是三个欧拉角加一个无用数字，不应直接把90写进某个分量来表达转90度。",
            "需要从欧拉角建立旋转时，用相应构造方法；需要面对方向时，用 LookRotation 等接口。欧拉角还可能用不同数字描述等价朝向，所以调试时除了读数，也应查看 forward 和实际姿态，不要把显示数字当作旋转的唯一身份。"
          ]
        },
        {
          "title": "先算方向，再算目标旋转",
          "paragraphs": [
            "示例先用目标位置减当前位置得到方向，再投影到水平面，让角色只绕竖直轴转向。若目标在角色正上方，投影可能接近零，此时没有可靠水平朝向，代码选择直接返回，保持原姿态。",
            "方向足够有效后，LookRotation 才建立所需朝向。这个判断不是随意的异常屏蔽，而是承认“目标重合或只有竖直差”时问题缺少水平答案。不同游戏可以选择默认方向，但必须明确，不能无条件把零向量交给求朝向方法。"
          ]
        },
        {
          "title": "恒定角速度先换算单步角度",
          "paragraphs": [
            "RotateTowards 的最大变化量是这一步最多转多少度。设置120度/秒，应乘本帧秒数：0.02秒对应2.4度。方法再根据剩余角度限制，不会因为最后只差1度就还转2.4度越过目标。",
            "目标静止时，90度约需0.75秒，180度约需1.5秒。完成时刻只能落在实际帧上，测量应保留容差。角速度乘时间得到角度，单位对应关系很清楚；不要把每秒120直接当成每帧120。"
          ]
        },
        {
          "title": "固定时长插值需要保存起点",
          "paragraphs": [
            "若要求0.5秒完成，应保存开始旋转，计算已经过去的时间除以总时长，再从固定起点插到目标。这里比例表示整段过程走了多少，不是每帧重新取一个起点。目标是否允许中途变化，也要先约定。",
            "每帧从当前姿态向目标做固定比例 Slerp，是另一种逐步靠近的行为。差距越来越小，每次变化也越来越小。它可能很好看，却不能因此说成固定时长或恒角速度，测试时应分别记录两种曲线。",
            "固定比例还会依赖调用次数。假设目标只绕一个轴转动，初始相差90度，每帧取剩余差距的0.1，十次后仍约差90×0.9的10次方，即31.4度。60 FPS一秒做60次，30 FPS只做30次，结果不同。若需要按秒定义渐近速度，可用比例1-exp(-k×dt)，其中exp是指数函数，k表示每秒的衰减速率、dt是本帧秒数。它仍是渐近过程，并非保证某一秒恰好结束。"
          ]
        },
        {
          "title": "旋转组合也有空间与顺序",
          "paragraphs": [
            "rotation 是世界旋转，localRotation 是相对父级旋转。父级已经旋转时，给子对象两者填写相同值，通常不会得到相同世界姿态。先分清参照系，再讨论模型为什么朝错方向。",
            "先绕一个轴90度，再绕另一个轴90度，交换顺序可能得到不同结果。旋转组合不能当作普通数字交换相加。实验可使用带明显前后标记的模型，每步画出 forward，观察最终朝向，而不是仅比较欧拉角文本。"
          ]
        },
        {
          "title": "比较轨迹，也比较异常情况",
          "paragraphs": [
            "把恒角速度、固定时长和逐渐靠近三种方案放在相同起点与目标上，记录中间角度和完成时间。只看最终都面向目标，无法知道过程是否符合需要；帧率变化时，也应检查时间换算是否仍正确。",
            "再测试目标销毁、目标重合、目标正上方和父级旋转。每种情况都应有能解释的结果。复杂角色还要检查动画或物理是否同时写旋转；如果多个系统争着改变同一姿态，调插值比例往往只能掩盖抖动。"
          ]
        }
      ],
      "code": {
        "title": "明确角速度的地面转向",
        "language": "csharp",
        "filename": "TurnTowardsProbe.cs",
        "source": "using UnityEngine;\npublic sealed class TurnTowardsProbe : MonoBehaviour\n{\n    [SerializeField] Transform target;\n    [SerializeField, Min(0f)] float degreesPerSecond = 120f;\n    void Update()\n    {\n        if (target == null) return;\n        Vector3 direction = Vector3.ProjectOnPlane(target.position - transform.position, Vector3.up);\n        if (direction.sqrMagnitude < 0.0001f) return;\n        Quaternion desired = Quaternion.LookRotation(direction, Vector3.up);\n        transform.rotation = Quaternion.RotateTowards(transform.rotation, desired, degreesPerSecond * Time.deltaTime);\n    }\n}",
        "explanation": [
          "脚本挂到无刚体的转向对象，target 指向另一个对象。它只求水平朝向，忽略接近零的方向，再按 degreesPerSecond×deltaTime 限制单步旋转。"
        ]
      },
      "lab": [
        {
          "title": "检查旋转的参照和顺序",
          "minutes": 60,
          "steps": [
            "建立带旋转的父级与子模型，比较给rotation和localRotation赋值。",
            "分别做两个90度轴旋转，再交换执行顺序，用模型前方标记比较。",
            "记录不同欧拉显示是否可能描述相同朝向，画出最终forward。"
          ],
          "result": "参照系与组合顺序会影响旋转结果。"
        },
        {
          "title": "测量三种转向过程",
          "minutes": 60,
          "steps": [
            "用RotateTowards测转90度和180度时间，和120度/秒的预测比较。",
            "另用固定起点做定时Slerp，再对比每帧从当前值插值的中间角度。",
            "加入目标重合、目标消失与帧率变化测试，记录每种停止或保持行为。"
          ],
          "result": "区分恒速、定时与渐近过程，并处理无方向情况。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "朝向总差九十度",
          "cause": "美术模型轴约定与逻辑前方不同",
          "fix": "在视觉子对象修正轴，不把补偿散落到控制数学"
        },
        {
          "symptom": "Slerp 看起来永远靠近却不准时到达",
          "cause": "每帧重置起点形成渐近响应",
          "fix": "按需求保存初始旋转或使用 RotateTowards"
        }
      ],
      "exercise": {
        "brief": "分别实现恒角速度与固定时长转向，测试3组起始角差，不能通过直接写四元数分量表达欧拉角。",
        "deliverables": [
          "两种算法",
          "角差与耗时表",
          "零方向和父空间测试"
        ],
        "rubric": [
          {
            "item": "目标方向与参照空间正确",
            "points": 25
          },
          {
            "item": "恒速与定时过程有区别",
            "points": 25
          },
          {
            "item": "零方向和目标丢失有处理",
            "points": 25
          },
          {
            "item": "测量数据支持结论",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "Quaternion 的 x、y、z 可以直接写欧拉角吗？",
          "options": [
            "可以，x/y/z 就是三个角度",
            "不可以，应使用对应构造或求朝向接口",
            "只要把 w 设为1就可以任意填角度",
            "只有世界旋转可以直接这样写"
          ],
          "answer": 1,
          "explanation": "四元数分量不是欧拉角，必须按旋转表示的规则构造。"
        },
        {
          "question": "匀速每秒转一百二十度更适合？",
          "options": [
            "RotateTowards，最大单步角度为120×deltaTime",
            "固定比例 Slerp 必然保持相同角速度",
            "每帧直接加120度",
            "在四个分量上分别加角度"
          ],
          "answer": 0,
          "explanation": "角速度先乘时间得到单步角度，才符合这个接口参数。"
        },
        {
          "question": "目标与当前位置重合时应怎样？",
          "options": [
            "直接用零向量求 LookRotation",
            "随意选一个 Quaternion 分量",
            "识别方向退化并保持或采用明确默认朝向",
            "把旋转值全部设成零分量"
          ],
          "answer": 2,
          "explanation": "重合点没有唯一方向，应先处理问题本身缺少方向的情况。"
        }
      ],
      "references": [
        {
          "label": "Quaternion.RotateTowards",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Quaternion.RotateTowards.html"
        },
        {
          "label": "Quaternion.LookRotation",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Quaternion.LookRotation.html"
        }
      ],
      "summary": [
        "四元数分量不能直接填写欧拉角。",
        "先定义时间要求，再选择RotateTowards或合适插值。"
      ],
      "teaching": {
        "question": "角色转90度和转180度，怎样才能都保持每秒120度，而不是越接近目标越慢？",
        "keyIdea": "先确定需要恒定角速度、固定时长还是逐渐靠近，再选择旋转方法。四元数表示旋转，不能把它的分量当成欧拉角直接填写。",
        "walkthrough": [
          {
            "title": "建立目标朝向",
            "text": "用目标位置减角色位置，并投影到地面，得到需要面对的水平方向；长度过小时不继续计算。"
          },
          {
            "title": "换成每步角度",
            "text": "角速度120度/秒，一帧0.02秒时允许转2.4度，再交给 RotateTowards 限制这一步。"
          },
          {
            "title": "比较两次转向",
            "text": "目标不动时，转90度约需0.75秒、转180度约需1.5秒，实际完成还受帧边界影响。"
          }
        ],
        "prediction": {
          "question": "每帧用当前旋转和目标做 Slerp，t 固定0.1，是否一定1秒转完？",
          "answer": "不是。它每次只走剩余差距的一部分，通常逐渐靠近；t 不是秒数，也不是角速度。"
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
      "id": "l019",
      "title": "屏幕、视口与世界：鼠标位置为什么没有天然深度",
      "prerequisites": [
        "l018"
      ],
      "goals": [
        "区分屏幕像素、视口比例和世界单位",
        "解释深度为何以相机为参照",
        "用明确表面求出唯一交点"
      ],
      "theory": [
        {
          "title": "二维输入还缺少深度",
          "paragraphs": [
            "屏幕像一张平面，同一条视线上的远近物体可以落在同一个像素位置。鼠标给出的 x、y 因此不足以确定唯一世界点。并非转换函数不够聪明，而是你还没有告诉它选择视线上的哪一处。",
            "可以提供离相机多远的深度，也可以规定点必须在地面或某个碰撞表面上。这些条件解决不同问题。点击地面移动应找地面交点，屏幕空间特效可能只需要固定深度，不能在所有场合都套同一个常数。"
          ]
        },
        {
          "title": "先分清像素、视口与世界单位",
          "paragraphs": [
            "屏幕坐标通常以像素表达，窗口大小变化后中心数值也会变化。视口坐标则用相对比例描述，例如中心为(0.5,0.5)。世界坐标使用场景单位，与屏幕像素没有一个永远固定的直接加减关系。",
            "记录一个点时要写它属于哪种坐标。把屏幕宽度的一半当作世界 x，通常会让对象跑到很远的位置。相机投影、位置和朝向参与转换，所以换相机以后，同一个像素对应的世界视线也可能改变。"
          ]
        },
        {
          "title": "ScreenToWorldPoint 的深度相对相机",
          "paragraphs": [
            "该方法接收屏幕点及一个深度值。这里的 z 描述相对于相机平面的世界单位深度，不是直接填写最终世界 z。相机旋转后，这两种含义的差别会非常明显，不能因为相机碰巧沿世界轴摆放就混为一谈。",
            "对同一屏幕点分别指定两个深度，通常能得到不同世界点。再将结果用 WorldToScreenPoint 投回屏幕，可以检查转换理解。回投影接近原像素，只证明投影对应，不说明该点真的落在你想要的地面上。"
          ]
        },
        {
          "title": "射线加平面能明确地面条件",
          "paragraphs": [
            "示例从相机向屏幕中心发出几何射线，再与水平地面平面求交。法线是垂直于平面的方向：向上的法线对应水平面，再让平面经过世界原点，就选定了高度为0的地面。求出距离后，ray.GetPoint得到实际交点。",
            "将平面高度改为2，交点应随新的约束变化；这不是给旧结果随便加2。对于倾斜相机，射线与高处平面的交点可能同时改变水平位置。先求正确交点，再移动标记，才能保持几何意义。",
            "ScreenPointToRay 返回的射线从相机近平面上的对应位置出发，不一定以相机 Transform 的位置为起点。正交相机尤其容易看出区别：屏幕左右两点产生的射线方向平行，起点却不同。ray.GetPoint(distance) 中的 distance 是从 ray.origin 开始沿射线量出的距离，不能直接理解成物体离相机 Transform 有多远。"
          ]
        },
        {
          "title": "求交可能没有你需要的结果",
          "paragraphs": [
            "射线与平面平行时，可能没有可用交点；朝向错误时，也可能找不到前方交点。示例判断 Raycast 的结果，只在成功时写 marker，避免把未得到的距离当成正确位置。",
            "无交点时应该保留标记、隐藏标记还是提示不可点击，是上层交互选择。先让失败情况显式存在，再决定表现，比分别试几个补偿偏移值可靠。测试相机接近平行地面时，尤其容易看出这条分支是否处理清楚。"
          ]
        },
        {
          "title": "数学平面与场景碰撞体不同",
          "paragraphs": [
            "Plane.Raycast 只求射线和你指定的无限平面相交，不读取场景墙、坡道或敌人的 Collider。它适合几何演示和已知平面交互，但不会自动替你找最近可见表面。图上标记穿过墙，不一定是求交公式错。",
            "需要实际遮挡时，应使用相应的物理查询，并设置层、距离与触发策略。2D 与3D查询还属于不同系统。先明确“我要哪个表面”，再选择方法，才能避免用一种接口承担另一种问题。"
          ]
        },
        {
          "title": "相机变化后重新验证条件",
          "paragraphs": [
            "切换透视与正交、旋转相机、改变窗口比例后，应再做同一套投影实验。透视下远近会改变缩放感，正交下投影规则不同，但屏幕点仍需要额外条件才能成为你需要的世界位置。",
            "保留屏幕点、相机参数、选定平面和最终交点四项记录。若只在一种窗口尺寸能正常点击，应检查是否硬编码像素；若相机转过后偏移，检查深度是否误当世界 z。每一种错误都能沿这些条件找到对应来源。"
          ]
        }
      ],
      "code": {
        "title": "屏幕中心射线与地面平面",
        "language": "csharp",
        "filename": "ScreenPlaneProbe.cs",
        "source": "using UnityEngine;\npublic sealed class ScreenPlaneProbe : MonoBehaviour\n{\n    [SerializeField] Camera view;\n    [SerializeField] Transform marker;\n    void Update()\n    {\n        if (view == null || marker == null) return;\n        Vector3 screen = new Vector3(Screen.width * 0.5f, Screen.height * 0.5f);\n        Ray ray = view.ScreenPointToRay(screen);\n        Plane ground = new Plane(Vector3.up, Vector3.zero);\n        if (ground.Raycast(ray, out float distance))\n            marker.position = ray.GetPoint(distance);\n    }\n}",
        "explanation": [
          "指定 Camera 和 marker，运行后标记跟随屏幕中心射线与 y=0 平面的交点。这里没有读取鼠标位置，也不检测墙体；它演示的是几何求交。"
        ]
      },
      "lab": [
        {
          "title": "比较深度与相机参照",
          "minutes": 60,
          "steps": [
            "对同一屏幕点用两个深度调用ScreenToWorldPoint，记录不同世界结果。",
            "切换正交与透视，再转相机，检查深度为什么不能当世界z。",
            "将结果回投影，比较像素误差，并说明回到原像素不保证落在地面。"
          ],
          "result": "屏幕点与具体世界点之间需要额外约束。"
        },
        {
          "title": "测试几何求交限制",
          "minutes": 60,
          "steps": [
            "运行中心射线示例，移动和旋转相机，记录标记落点。",
            "把平面高度改为2，先预测交点变化，再观察不是简单固定补偿。",
            "令射线接近平行平面，检查无交点处理，再用两个窗口尺寸重测。"
          ],
          "result": "成功与失败都能由几何条件解释。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "鼠标世界点总贴在相机附近",
          "cause": "ScreenToWorldPoint 深度设为零或误当世界 z",
          "fix": "定义所需深度或改用射线求交"
        },
        {
          "symptom": "换相机或分屏后点击偏移",
          "cause": "使用了错误相机或混淆坐标来源",
          "fix": "显式传递目标摄像机，核对像素区域与原点"
        }
      ],
      "exercise": {
        "brief": "写接收摄像机、屏幕点与地面高度的求交方法，返回是否成功及世界点；测试平行射线和两种分辨率。",
        "deliverables": [
          "几何方法",
          "回投影对照表",
          "无交点和相机切换测试"
        ],
        "rubric": [
          {
            "item": "坐标单位与原点明确",
            "points": 25
          },
          {
            "item": "深度解释正确",
            "points": 25
          },
          {
            "item": "无交点安全返回",
            "points": 25
          },
          {
            "item": "转换与输入解耦",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "ScreenToWorldPoint 的 z 参数主要表示什么？",
          "options": [
            "直接指定最终世界 z",
            "相对相机平面的世界单位深度",
            "将鼠标滚轮值原样作为距离",
            "指定距屏幕左边的像素"
          ],
          "answer": 1,
          "explanation": "深度以相机为参照，相机旋转后尤其不能当成世界 z。"
        },
        {
          "question": "屏幕点变世界点还缺什么？",
          "options": [
            "深度或表面交点条件",
            "只需把像素转换成 float",
            "只需知道屏幕宽度",
            "只需给结果加一个固定偏移"
          ],
          "answer": 0,
          "explanation": "同一屏幕点对应视线上的多个点，额外条件才确定具体位置。"
        },
        {
          "question": "几何 Plane.Raycast 会自动考虑墙体遮挡吗？",
          "options": [
            "会自动检测最近墙体",
            "相机开启透视时会自动检测",
            "不会，需要场景物理查询等方法处理",
            "只要地面有 Collider 就会考虑所有遮挡"
          ],
          "answer": 2,
          "explanation": "数学平面求交不查询场景碰撞体，条件与物理射线不同。"
        }
      ],
      "references": [
        {
          "label": "Camera.ScreenToWorldPoint",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Camera.ScreenToWorldPoint.html"
        },
        {
          "label": "Camera.ScreenPointToRay",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Camera.ScreenPointToRay.html"
        },
        {
          "label": "Plane.Raycast",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Plane.Raycast.html"
        }
      ],
      "summary": [
        "屏幕点还需要深度或表面条件。",
        "数学平面求交不会自动检测墙体遮挡。"
      ],
      "teaching": {
        "question": "鼠标只有屏幕 x、y，为什么不能直接用它们得到地面上的唯一世界位置？",
        "keyIdea": "一个屏幕点通常对应一条向场景延伸的射线。还要给出深度或目标表面，才能选出这条线上的具体位置。",
        "walkthrough": [
          {
            "title": "确定屏幕点",
            "text": "取屏幕中心(width/2,height/2)，这是像素位置，尚未指定场景中的高度或距离。"
          },
          {
            "title": "建立相机射线",
            "text": "由 Camera.ScreenPointToRay 得到射线。相机的位置和朝向共同决定这条线指向哪里。"
          },
          {
            "title": "用地面选交点",
            "text": "建立通过世界原点、法线向上的平面，求射线与它的交点；有交点时才移动 marker。"
          }
        ],
        "prediction": {
          "question": "Plane.Raycast 得到交点前，若有一堵墙，它会自动返回墙上位置吗？",
          "answer": "不会。它只求与指定数学平面的交点；实际墙体遮挡需要另用物理查询等方式处理。"
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
      "id": "l020",
      "title": "层级缩放、点与方向：发现隐藏在模型里的变换问题",
      "prerequisites": [
        "l019"
      ],
      "goals": [
        "按点、向量和方向的含义选择转换接口",
        "观察父级非均匀缩放与旋转组合",
        "分开美术修正与逻辑根的控制范围"
      ],
      "theory": [
        {
          "title": "先问三个数代表哪一种量",
          "paragraphs": [
            "局部值(1,0,0)可以表示“右边的一个位置点”，也可以表示“向右偏移一个单位”，还可以表示朝向。数字一样，含义不同。点需要知道原点在哪里，纯方向则不应该因为对象搬家而改变。",
            "所以转换前先用一句话描述要算什么。挂点位置应按位置点处理；带长度的偏移可能需要包含缩放；只想把局部朝向换成世界朝向，则通常不需要平移与缩放。方法名字是入口，量的含义才是选择依据。"
          ]
        },
        {
          "title": "位置点包含平移旋转与缩放",
          "paragraphs": [
            "TransformPoint 将局部位置点变成世界点。对象位于世界 x=5，局部点 x=1，且只有平移时，结果为6；若局部 x 还缩放2倍，结果便变为7。加入旋转后，要沿旋转后的局部轴理解这个偏移。",
            "TransformPoint 得到世界位置，TransformVector 得到世界偏移，不能把两种结果当同一种量。这里的 Gizmo 有一个应当主动解释的现象：红线从 transform.position 连到 TransformPoint(local)，其位移正好等于 TransformVector(local)，所以红线和绿线应重合，而不是画成不同方向。后画的绿线还可能盖住红线；这不表示点转换失败。"
          ]
        },
        {
          "title": "向量含缩放，方向转换不含缩放",
          "paragraphs": [
            "TransformVector 用于把局部向量变到世界，保留旋转和缩放影响，但不加入对象平移。TransformDirection 则不受平移和缩放影响，保留方向向量本来的长度，只改变朝向关系。",
            "输入长度2时，方向转换不会自动变成单位长度。需要单位方向，应另外归一化。将对象缩放改成(2,1,1)，用局部(1,0,0)比较绿色和蓝色线：绿色随缩放拉长，蓝色保持长度。再移动对象并执行数值报告，Point 数值会变，Vector 和 Direction 数值不会仅因平移改变；三条线的画法与三个返回值必须分别观察。"
          ]
        },
        {
          "title": "层级缩放会累积影响结果",
          "paragraphs": [
            "子对象 localScale 为1，不代表世界里一定没有放大。父对象的缩放也参与变换。模型看起来大一倍时，应沿父级查看，而不是只盯子对象的三个缩放字段。旋转也会改变子级轴与父级轴的关系。",
            "若父级各轴缩放不同，再叠加子级旋转，最终形状可能出现剪切。此时只用世界三个缩放量描述整套变换会丢掉信息。lossyScale 的名字也提醒它是近似表达，不应当成任何层级下都完整准确的还原工具。"
          ]
        },
        {
          "title": "非均匀缩放让简单直觉失效",
          "paragraphs": [
            "设父对象 x 缩放2、y 缩放1，再旋转子模型。原本互相垂直的外观轴，经过组合后可能呈现倾斜拉扯。把世界位置和三个旋转、缩放数值各自拿出来，不一定能无损重建同样结果。",
            "因此遇到形状异常，应先比较均匀与非均匀缩放，并查看整条层级。不是所有问题都来自图片或网格。对物理和挂点尤其要检查引擎对该形状的具体支持条件，不能从 Gizmo 看起来正常就推断碰撞也完全相同。"
          ]
        },
        {
          "title": "把美术修正与逻辑根分开",
          "paragraphs": [
            "一个模型可能原始朝向不合适或尺寸过大。常见做法是用稳定的逻辑根负责位置与物理，在视觉子对象上处理模型缩放、翻转或朝向修正。这样移动代码不用每次补偿美术偏差，碰撞结构也更容易理解。",
            "多一层对象不是目的。应清楚说明哪层由移动代码控制，哪层由动画或美术调整，挂点跟谁走。若两层都在改同一世界位置，仍可能发生竞争。结构的价值来自职责清楚，而不是层级越深越专业。"
          ]
        },
        {
          "title": "用分组实验检查每种影响",
          "paragraphs": [
            "先在默认变换下观察，再单独改位置、旋转和缩放。每次记录三种转换结果，检查哪些项改变、哪些不变。不要同时改三项后，只凭辅助线外观猜规则。逆变换也可以帮助核对往返关系。",
            "最后在有父级、非均匀缩放和旋转组合的条件下重做，并记录之前的简化公式不再适用之处。视觉子根拆开以后，还要确认相机目标和武器挂点仍指向正确层级，不能只看模型外观恢复就结束验证。"
          ]
        }
      ],
      "code": {
        "title": "同时检查转换数值与重合的辅助线",
        "language": "csharp",
        "filename": "TransformKindsProbe.cs",
        "source": "using UnityEngine;\npublic sealed class TransformKindsProbe : MonoBehaviour\n{\n    [SerializeField] Vector3 local = Vector3.right;\n    void OnDrawGizmosSelected()\n    {\n        Gizmos.color = Color.red;\n        Gizmos.DrawLine(transform.position, transform.TransformPoint(local));\n        Gizmos.color = Color.green;\n        Gizmos.DrawRay(transform.position, transform.TransformVector(local));\n        Gizmos.color = Color.blue;\n        Gizmos.DrawRay(transform.position, transform.TransformDirection(local));\n    }\n    [ContextMenu(\"Report transformed values\")]\n    void Report()\n    {\n        Vector3 point = transform.TransformPoint(local);\n        Vector3 vector = transform.TransformVector(local);\n        Vector3 direction = transform.TransformDirection(local);\n        Debug.Log($\"point={point}, vector={vector}, direction={direction}; point-origin={point - transform.position}\", this);\n    }\n}",
        "explanation": [
          "把 TransformKindsProbe 挂到对象，选中后在 Scene 观察 Gizmo，确保 Gizmos 已开启。红线和绿线使用相同起点与终点，应重合；后画的绿线可能遮住红线。蓝线在存在相应缩放时会显示不同长度。",
          "从组件菜单执行 Report transformed values，同时查看返回值与 point-origin。分别只改位置、旋转、缩放，比较数值和辅助线；Game 画面不一定显示这些编辑辅助线。"
        ]
      },
      "lab": [
        {
          "title": "单独改变三种变换",
          "minutes": 60,
          "steps": [
            "令对象位置(5,0,0)、无旋转、缩放(2,1,1)，输入保持(1,0,0)。先算三种返回值，再执行组件菜单 Report transformed values 对照。",
            "观察红绿线重合、蓝线长度不同。只把世界x由5改为8，分别记录三个返回值和线段起点，解释为什么平移改变Point却没有让红绿线分开。",
            "再分别改变旋转和非均匀缩放，用对应逆变换核对返回值；不要将“线段重合”等同于“返回值相同”。"
          ],
          "result": "同时解释返回量与画线方式，能用Point减起点得到Vector，按含义选择转换接口。"
        },
        {
          "title": "检查父级造成的形状变化",
          "minutes": 60,
          "steps": [
            "建立均匀与非均匀缩放两种父级，再分别旋转子模型。",
            "比较实际形状、轴线和lossyScale，说明三分量为何可能不足以完整还原。",
            "把美术修正移到视觉子对象，检查物理根、相机目标与挂点引用。"
          ],
          "result": "层级调整有明确控制范围，并检查关联对象。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "父对象放大后方向速度也变了",
          "cause": "把纯方向当作受缩放向量转换",
          "fix": "按意义选择 TransformDirection，另显式管理速度幅度"
        },
        {
          "symptom": "翻面后碰撞和挂点也意外镜像",
          "cause": "在整个根对象施加负缩放",
          "fix": "评估视觉翻面与逻辑朝向，分离视觉根或使用 flipX"
        }
      ],
      "exercise": {
        "brief": "检查导入角色的层级，安排逻辑根、视觉子对象与挂点，用非默认缩放验证移动方向不随模型尺寸改变。",
        "deliverables": [
          "层级职责图",
          "三种转换实验表",
          "资源替换后的回归记录"
        ],
        "rubric": [
          {
            "item": "点向量方向区分正确",
            "points": 25
          },
          {
            "item": "缩放限制解释清楚",
            "points": 25
          },
          {
            "item": "逻辑与视觉职责明确",
            "points": 25
          },
          {
            "item": "非默认条件验证完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "TransformDirection 是否受对象缩放影响？",
          "options": [
            "不受缩放影响，并保留输入向量长度",
            "总会乘 localScale",
            "受平移影响但忽略旋转",
            "会自动变成单位长度"
          ],
          "answer": 0,
          "explanation": "不受缩放与归一化是不同概念，长度不会自动变为1。"
        },
        {
          "question": "非均匀缩放与旋转组合可能产生什么？",
          "options": [
            "自动取消子对象全部旋转",
            "可能出现剪切，三个缩放数不足以完整描述",
            "一定让所有轴仍保持垂直",
            "lossyScale 必定能无损重建完整矩阵"
          ],
          "answer": 1,
          "explanation": "非均匀缩放与旋转组合可能包含比三个缩放分量更多的信息。"
        },
        {
          "question": "拆视觉根的主要依据是什么？",
          "options": [
            "层级越多就越可靠",
            "每层都应同时控制世界位置",
            "分开美术修正与逻辑、物理的控制范围",
            "增加一层必定没有维护成本"
          ],
          "answer": 2,
          "explanation": "拆层应解决具体控制职责，而不是追求对象数量。"
        }
      ],
      "references": [
        {
          "label": "Transform.TransformDirection",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformDirection.html"
        },
        {
          "label": "Transform.TransformVector",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformVector.html"
        },
        {
          "label": "Transform.lossyScale",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform-lossyScale.html"
        },
        {
          "label": "Transform.TransformPoint",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformPoint.html"
        }
      ],
      "summary": [
        "TransformDirection不受缩放影响，但不自动归一化。",
        "父级变换可能让三个缩放数不足以完整描述最终形状。"
      ],
      "teaching": {
        "question": "点转换包含平移，向量转换不含平移，为什么示例中 TransformPoint 的红线仍与 TransformVector 的绿线重合？",
        "keyIdea": "先分清返回的量，再检查辅助线怎样画。世界位置减去世界起点才是位移；红线的位移与绿色向量相同，因此重合符合转换规则。",
        "walkthrough": [
          {
            "title": "分别算出三种结果",
            "text": "对象世界位置(5,0,0)、无旋转、缩放(2,1,1)，局部输入(1,0,0)。Point为(7,0,0)，Vector为(2,0,0)，Direction为(1,0,0)。"
          },
          {
            "title": "从返回值推导画线",
            "text": "红线由世界x=5连到x=7，绿线从x=5沿向量2画到x=7，所以两线重合。蓝线只画到x=6。不同量的返回数值不能直接当作不同终点。"
          },
          {
            "title": "只平移再核对",
            "text": "把对象世界x改为8，其他条件不变。Point变为10，Vector仍为2，Direction仍为1；三条线的起点都随对象移到8。执行Report transformed values核对数值。"
          }
        ],
        "prediction": {
          "question": "上述对象只从世界x=5移到8，红绿线仍重合，能否据此说TransformPoint忽略了平移？",
          "answer": "不能。Point由7变为10，确实包含平移；但红线起点也从5变为8，两次线段的位移都为2。辅助线重合只能说明两种画法形成相同线段，不能代替检查返回值。"
        },
        "comparison": {
          "caption": "对象位置(5,0,0)、无旋转、缩放(2,1,1)，局部输入(1,0,0)",
          "headers": [
            "接口",
            "返回的量",
            "本例数值"
          ],
          "rows": [
            [
              "TransformPoint",
              "世界位置，含平移与缩放",
              "(7,0,0)"
            ],
            [
              "TransformVector",
              "世界偏移，含缩放但不含平移",
              "(2,0,0)"
            ],
            [
              "TransformDirection",
              "只转换朝向，不含平移或缩放",
              "(1,0,0)"
            ]
          ]
        }
      }
    }
  ]
});
