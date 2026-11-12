// 语境修订：题目背景、实验准备与学习用途。
window.COURSE_MODULES.push({
  "id": "m12",
  "number": 12,
  "title": "UI：布局、事件与呈现",
  "subtitle": "让界面在不同尺寸与输入下正常工作",
  "description": "比较uGUI与UI Toolkit，推导坐标和布局，接通点击与导航，并验证数据刷新、列表复用和界面性能。",
  "accent": "#ad7c42",
  "lessons": [
    {
      "hours": 5,
      "prerequisites": [
        "l055"
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
      "id": "l056",
      "title": "Canvas 与界面坐标空间",
      "goals": [
        "选择合适 Canvas 模式",
        "区分屏幕空间和世界空间尺寸",
        "建立跨比例 UI 验收标准"
      ],
      "theory": [
        {
          "title": "界面放在哪个空间，先决定清楚",
          "paragraphs": [
            "血条可以固定在屏幕左上，也可以悬在角色头顶。这两种界面需要不同空间关系。Screen Space Overlay直接按屏幕组织显示；Screen Space Camera使用指定相机参与屏幕界面呈现；World Space则把Canvas作为世界中的平面，可以随对象移动并受相机观察。",
            "先为同一个按钮分别建立三种Canvas，移动相机和按钮，比较它们跟谁变化。不要先背模式名字，再把所有界面都放进一个Canvas。固定HUD、屏幕弹窗和场景标牌各有需求，应明确显示空间、相机和预期遮挡，再选择模式。"
          ]
        },
        {
          "title": "参考分辨率不是输出分辨率",
          "paragraphs": [
            "CanvasScaler可以按指定策略缩放界面。使用Scale With Screen Size时，Reference Resolution是计算缩放的参照，不会强迫游戏窗口变成这个像素尺寸。假设参照为1920 × 1080，窗口改变后，控件如何变大或变小，还取决于宽高匹配等设置。",
            "Match Width Or Height偏向宽度或高度，会在不同比例下产生不同结果。先选择需要保持的内容尺寸，再在16:9、4:3和窄屏中比较。背景铺满与按钮可点击并不是同一个验收条件，文字、边距和安全区域也要检查，不能只看Canvas边框能否盖住屏幕。",
            "先看两端设置：参照1920×1080，实际960×540，宽高比都缩到一半，匹配哪一端都会得到约0.5的缩放；实际960×1080时，宽度比为0.5、高度比为1，Match=0与Match=1就会得到不同缩放。这说明参考分辨率提供计算基准，真正的适配还要决定优先保持哪一项。"
          ]
        },
        {
          "title": "透明与不接收点击是两个属性",
          "paragraphs": [
            "将CanvasGroup.alpha设为0可以让内容不可见，但不代表它必然停止拦截界面射线。交互与射线阻挡由对应设置决定，Image的Raycast Target也可能让透明图挡住下面按钮。于是“看不见但点不到后面”不一定是输入坏了，而可能是隐藏层仍在参与检测。",
            "关闭弹窗时，应明确要隐藏、禁用交互、停止阻挡还是直接停用对象。不同方式对动画、脚本和布局的影响不同。测试时放一个可点击按钮在后面，开关透明层并统计点击，就能把可见性与输入资格分开，而不是仅靠肉眼判断关闭成功。"
          ]
        },
        {
          "title": "世界点转成界面点要经过正确相机",
          "paragraphs": [
            "给角色头顶放屏幕血条时，先用观察角色的世界相机把世界点投影到屏幕，再按目标Canvas的坐标规则转换。RectTransformUtility等接口所需相机取决于Canvas模式；Overlay场景通常传null，其他模式应使用相应事件或渲染相机，不能随意拿Camera.main代替所有情况。",
            "还要处理目标在相机背后、超出屏幕和窗口尺寸变化。世界位置的Z与屏幕转换的深度不是同一种含义，界面局部坐标也不等于屏幕像素。每一步标明输入和输出空间，再显示一个测试标记，能快速发现偏移来自哪次转换。"
          ]
        },
        {
          "title": "适配要让内容仍能读和用",
          "paragraphs": [
            "同一界面在宽屏看着正常，窄屏可能让长中文文案遮住按钮；提高缩放并不一定解决，因为可用空间反而更少。应决定哪些区域拉伸、哪些保持最小尺寸、何时换行或滚动。交互目标还要保持可用大小，不能只让截图外观勉强塞下。",
            "建立窗口比例、文本长度和输入方式的测试表，覆盖最短与最长内容。Overlay、Camera和World Space各选一个典型样本，记录位置、尺寸与相机依赖。后续发现HUD漂移时，就能先查空间和缩放策略，而不必逐个修改所有控件的坐标。"
          ]
        },
        {
          "title": "多台相机时不要依赖偶然默认值",
          "paragraphs": [
            "项目加入小地图或分屏后，自动找到的主相机未必就是生成这条界面标记的那台相机。应明确世界点来自哪个观察视角，最终要显示在哪个Canvas。把相机引用作为可检查配置，再用不同视口测试中心和边缘，能避免只在单相机全屏时碰巧正确。"
          ]
        }
      ],
      "lab": [
        {
          "title": "比较三个Canvas空间",
          "minutes": 60,
          "steps": [
            "各建立一个同内容Canvas，分别使用Overlay、Camera和World Space，记录相机配置。",
            "移动相机与世界对象，观察哪些界面固定屏幕、哪些随世界变化。",
            "加透明阻挡层，分别测试alpha、交互与射线阻挡。"
          ],
          "result": "空间关系和输入资格分开记录的对照表。",
          "setup": [
            "新建L056_Canvas。从GameObject > UI创建Canvas，选中后在Inspector > Canvas查看Render Mode；复制成三个，分别设Screen Space - Overlay、Screen Space - Camera、World Space，每轮只开一个比较。",
            "Camera模式把实际Camera拖到Render Camera；World Space的Canvas先缩到合理世界尺寸并放进相机视野。模式名在Canvas组件，不在CanvasScaler。",
            "为点击对照创建一个uGUI Button，并确认正常能响应；在它上层加Panel或Image，通过Inspector > Add Component添加CanvasGroup。Alpha、Interactable、Blocks Raycasts在该组件中分别控制。"
          ],
          "purpose": "把看不见、不能交互和不再阻挡分成三个可验证条件，不用透明度替代完整关闭逻辑。"
        },
        {
          "title": "验证比例与世界标记",
          "minutes": 60,
          "steps": [
            "参考分辨率设为1920×1080，先比较实际960×540与960×1080；分别将Match设为0和1，预测缩放后再观察。接着测4:3与窄屏，记录文字换行、按钮尺寸和边距，不只确认背景能铺满。",
            "给世界角色添加屏幕标记，明确世界投影相机和Canvas转换相机。",
            "测试相机背后、屏幕边缘、多相机和长文本，确认标记与内容可用。"
          ],
          "result": "具有明确空间转换与内容适配规则的界面样本。",
          "setup": [
            "另存L056_Resize，先使用Overlay Canvas。选Canvas的CanvasScaler，将UI Scale Mode设Scale With Screen Size、Reference Resolution=(1920,1080)。",
            "Window > General > Game打开Game，顶部尺寸下拉添加960×540、960×1080等固定输出；CanvasScaler的Match依次设0和1，不同时改锚点。",
            "世界标记属于独立编写部分：先指定看角色的Camera和目标Canvas，再按本节转换链实现；本课没有一挂就出现血条的脚本。先在纸上标每步坐标空间，再逐点显示验证。"
          ],
          "purpose": "在明确参照与实际尺寸的条件下验证适配，避免把屏幕像素直接当界面局部坐标。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "菜单透明了但后面的按钮点不到",
          "cause": "透明图形或 CanvasGroup 仍阻挡射线。",
          "fix": "明确淡出、交互与 blocksRaycasts 的状态转换。"
        },
        {
          "symptom": "世界血条变得特别大",
          "cause": "混淆世界单位与屏幕 UI 单位。",
          "fix": "先选择空间模式，再按对应标尺配置尺寸。"
        }
      ],
      "exercise": {
        "brief": "给二维练习场景设计一个屏幕 HUD 和一个角色标记，并说明坐标策略。",
        "deliverables": [
          "Canvas 模式说明",
          "三种比例截图",
          "显示与交互状态表"
        ],
        "rubric": [
          {
            "item": "空间选择正确",
            "points": 25
          },
          {
            "item": "适配规则明确",
            "points": 25
          },
          {
            "item": "长文本和窄屏等情况已测试",
            "points": 25
          },
          {
            "item": "交互状态完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "透明度为0就一定不挡点击吗？",
          "options": [
            "一定，透明对象不会参与任何检测",
            "不一定，射线阻挡与交互设置仍可能有效",
            "一定，只要使用CanvasGroup",
            "一定，只要图片没有可见像素"
          ],
          "answer": 1,
          "explanation": "可见性和命中资格分开配置，需实际测试后层控件。",
          "scenario": "一个全屏CanvasGroup的Alpha设为0，但Blocks Raycasts和Interactable仍保持开启，后面有一个可点击按钮。"
        },
        {
          "question": "参考分辨率会强制游戏输出相同分辨率吗？",
          "options": [
            "会，它等于窗口大小设置",
            "不会，它是UI缩放策略的参照",
            "会，但只对Overlay生效",
            "会，只要Match设为0.5"
          ],
          "answer": 1,
          "explanation": "输出尺寸与CanvasScaler的参照值是不同设置。",
          "scenario": "CanvasScaler设Scale With Screen Size，Reference Resolution=(1920,1080)，实际Game窗口为960×540。"
        },
        {
          "question": "世界标记转换前应先明确什么？",
          "options": [
            "观察世界的相机和目标Canvas坐标空间",
            "只要世界坐标X和Y数值",
            "只要控件在Hierarchy中的顺序",
            "只要将所有坐标乘屏幕宽度"
          ],
          "answer": 0,
          "explanation": "要沿世界、屏幕和界面局部空间逐步转换，不能直接混用数值。",
          "scenario": "世界角色上方需要显示屏幕血条；场景有主世界相机和小地图相机，目标Canvas可能使用Overlay或Camera模式。"
        }
      ],
      "references": [
        {
          "label": "Canvas",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Canvas.html"
        },
        {
          "label": "RectTransformUtility",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RectTransformUtility.html"
        }
      ],
      "summary": [
        "先选择界面所在空间，再决定相机、缩放与坐标转换。",
        "透明、可交互和射线阻挡是不同条件，需要分别验收。"
      ],
      "teaching": {
        "question": "弹窗alpha已经是0，为什么下面按钮仍然点不到？",
        "keyIdea": "显示透明度与射线阻挡分开控制。看不见的对象仍可能参与界面命中，需要根据关闭需求同时检查交互和阻挡。",
        "walkthrough": [
          {
            "title": "建立可观察对照",
            "text": "在后层放一个统计点击次数的按钮，前层放全屏Image或CanvasGroup，确认按钮本来能够响应。"
          },
          {
            "title": "只改变透明度",
            "text": "将前层alpha设为0，保持Raycast Target或blocksRaycasts不变，再点击同一位置观察计数。"
          },
          {
            "title": "明确关闭行为",
            "text": "关闭前层射线阻挡后重试，确认后层按钮恢复；再根据需求决定是否同时禁用交互或停用对象。"
          }
        ],
        "prediction": {
          "question": "Reference Resolution设为1920 × 1080，会让所有设备强制输出这个分辨率吗？",
          "answer": "不会。它参与界面缩放计算，实际输出尺寸与宽高比仍需在目标窗口和设备上验证。",
          "scenario": "CanvasScaler使用Scale With Screen Size，Reference Resolution设1920×1080；运行窗口可以变化，题目只问这个参照值是否强制实际输出。"
        },
        "scenario": "弹窗已经透明，后面的按钮还是点不到；血条在宽屏正常，换成窄窗口又飘开。先让同一按钮出现在三种Canvas空间，再分别测显示、缩放和射线阻挡。",
        "purpose": "能说明HUD和头顶标记各处在哪个空间，隐藏面板时也能正确处理后方输入。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l056"
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
      "id": "l057",
      "title": "RectTransform、锚点与布局驱动",
      "goals": [
        "解释锚点、轴心和偏移",
        "预测父尺寸变化后的布局",
        "避免脚本与布局组件争写"
      ],
      "theory": [
        {
          "title": "RectTransform是在描述一块矩形",
          "paragraphs": [
            "普通Transform主要描述位置、旋转和缩放，RectTransform还要表达一块界面矩形相对父矩形的关系。Anchor决定参照父对象的哪里，Pivot决定自身以哪里作为参考。右上角按钮希望随窗口保持右上边距，通常应先设置合适锚点，而不是每个分辨率都重写绝对坐标。",
            "先在空Canvas中建立父面板和一个按钮，显示锚点与轴心，再只改变父面板尺寸。观察按钮哪些量保持不变、哪些随父对象变化，才能理解Inspector上的数值不是单独存在，而是共同描述一套几何关系。"
          ]
        },
        {
          "title": "sizeDelta为什么不一定是实际宽度",
          "paragraphs": [
            "当左右锚点重合时，锚点跨度为0，sizeDelta.x通常可直接对应矩形宽度；左右锚点分开时，还要把父矩形提供的跨度算进去。简化到无额外变换的横向例子：父宽1000，锚点从0.25到0.75，跨度为500，sizeDelta.x为100，最终宽度就是约600。",
            "父宽改成1200后，锚点跨度变为600，sizeDelta仍是100，最终宽度约700。这个推导解释了为什么打印sizeDelta相同，两次看到的控件宽度却不同。要观察局部最终矩形可看rect；世界或屏幕尺寸还需考虑缩放和转换，不能把这些数值继续混为一谈。"
          ]
        },
        {
          "title": "位置和轴心一起决定怎样移动",
          "paragraphs": [
            "Pivot设为左侧时，改变宽度通常更像从左边向右展开；设为中心时，参考点在中间，边缘变化不同。anchoredPosition表达相对相应锚点参考的位置，不应被当成对所有锚点配置都一样的屏幕像素坐标。",
            "例如进度条从左到右增长，可选左侧轴心并保持起始边缘；一个中心弹窗则可能需要中心轴心和中心锚点。先说明哪条边或哪个点应保持稳定，再选择参数。不要只凭某次拖动摆得漂亮就复制到所有控件，父尺寸改变会暴露原来隐藏的几何假设。"
          ]
        },
        {
          "title": "布局组件可能正在替你写尺寸",
          "paragraphs": [
            "Horizontal Layout Group、Vertical Layout Group、Content Size Fitter等组件会根据规则计算某些尺寸或位置。如果脚本同时把同一宽度写成固定值，布局下一轮又改回去，就出现“数值一改就弹回”的现象。这通常不是Inspector失灵，而是两个地方同时控制同一个属性。",
            "先检查驱动信息和父级布局，再决定由谁负责。可以让外层受布局控制，内层负责局部动画，或调整布局规则表达需求；不宜每帧强行把布局结果改回。多个自动尺寸组件相互依赖时，还要检查是否形成循环关系，而不是叠加更多修正脚本。",
            "例如父面板有Horizontal Layout Group且勾选Control Child Size的Width，子按钮宽度就由布局规则计算。手动给按钮sizeDelta.x写200，随后又变回布局值，是这一设置的可预期结果。若要求按钮整体参与自动排布、内部图标独立缩放，可保留外层由布局驱动，把局部动画放到不受该宽度驱动的内层；先改变控制关系，再谈何时读取尺寸。"
          ]
        },
        {
          "title": "布局计算有时机，不是每行代码都即时完成",
          "paragraphs": [
            "修改文本后立刻读取矩形，可能仍读到布局更新前的结果。应理解布局何时计算，并在合适阶段读取；确实需要当下强制计算时，再使用相应刷新接口。频繁ForceUpdateCanvases并不是通用修复，因为它既可能增加成本，也无法消除错误约束。",
            "用短文本和长文本触发尺寸变化，分别记录设置后与布局完成后的rect，能直接看出时点差异。最后测试父尺寸、文本增长和多语言，确认稳定边缘、最小尺寸和滚动行为都符合预期。几何规则、写入者和更新时机一起明确，布局才不需要靠不断试数值维持。"
          ]
        },
        {
          "title": "先预测，再拖动验证",
          "paragraphs": [
            "每轮实验只改变锚点、轴心或父尺寸中的一项，先画出预计保持不动的点或边。若观察不符，检查是否有父缩放或布局组件参与，而不是马上更换所有参数。保存一份无布局的几何样本与一份自动布局样本，对照起来能区分计算公式和组件驱动的影响。"
          ]
        }
      ],
      "code": {
        "title": "打印最终矩形与驱动者",
        "language": "csharp",
        "filename": "RectGeometryProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(RectTransform))]\npublic class RectGeometryProbe : MonoBehaviour\n{\n    [ContextMenu(\"Report Rect Geometry\")]\n    void Report()\n    {\n        var r = GetComponent<RectTransform>();\n        Debug.Log($\"rect={r.rect}, sizeDelta={r.sizeDelta}, anchors={r.anchorMin}/{r.anchorMax}, driver={r.drivenByObject}\", this);\n    }\n}",
        "explanation": [
          "用探针比较sizeDelta、rect和驱动来源，先从无布局、无额外缩放的父子矩形开始。",
          "加入布局组件后再观察哪些属性受到驱动；最终局部矩形不等于屏幕像素尺寸。"
        ]
      },
      "lab": [
        {
          "title": "推导锚点与尺寸",
          "minutes": 60,
          "steps": [
            "建立父宽1000的面板，分别测试重合锚点和0.25到0.75的拉伸锚点。",
            "设置sizeDelta.x为100，先算实际宽度，再打印rect.width核对。",
            "改变父宽和Pivot，画出保持不动的参考点或边。"
          ],
          "result": "每组设置都有公式、预测和实测结果。",
          "setup": [
            "新建L057_Rect，GameObject > UI > Canvas建Overlay Canvas；在其下建Panel命名Parent，将RectTransform锚点设为不拉伸并把Width设1000、Height设400，Scale=(1,1,1)。",
            "在Parent下建子UI对象Child。Inspector中找到RectTransform的Anchor Min/Max：先都设(0.5,0.5)，再在横向分别设0.25、0.75，纵向仍重合。",
            "保存RectGeometryProbe.cs并挂到Child；通过组件标题菜单Report Rect Geometry输出rect、sizeDelta和driver。Window > General > Console查看，不把Inspector显示的Left/Right误当成普通Width字段。"
          ],
          "purpose": "在没有自动布局干扰时亲自算最终宽度，建立后续排错可用的几何基线。"
        },
        {
          "title": "找到布局属性的写入者",
          "minutes": 60,
          "steps": [
            "给父面板加Horizontal Layout Group并勾选Control Child Size→Width。尝试手改子按钮sizeDelta.x，观察驱动提示与回弹；再取消该轴驱动或把局部动画移到内层，比较控制关系变化。",
            "故意让脚本写同一尺寸，定位弹回原因，再改成清楚的单一控制方式。",
            "用长文本触发布局，比较修改后立即读取与布局完成后的矩形，避免每帧强制刷新。"
          ],
          "result": "能解释尺寸来源与读取时点的布局样本。",
          "setup": [
            "先完成无布局基线，另存L057_Layout。选Parent，Inspector > Add Component添加Horizontal Layout Group，勾Control Child Size的Width。",
            "在Child挂载的探针菜单重新Report Rect Geometry，查看driver变化；把同一尺寸交给脚本写入的反例仅在副本中实现，避免正式面板出现两个写入者。",
            "添加长文本时使用与当前UI系统匹配的Text或TextMeshPro组件，并检查父布局与Content Size Fitter是否同时约束同一轴；先记录组件链，不靠每帧ForceUpdateCanvases掩盖约束冲突。"
          ],
          "purpose": "让数值弹回成为可解释的驱动结果，再设计外层布局与内层显示各自负责什么。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "改宽度一会又被改回",
          "cause": "布局组件拥有该轴尺寸。",
          "fix": "调整布局约束，避免脚本争写。"
        },
        {
          "symptom": "sizeDelta 一样但实际宽度不同",
          "cause": "拉伸锚点跨度与父尺寸不同。",
          "fix": "结合 anchorMin、anchorMax 和父 rect 分析。"
        }
      ],
      "exercise": {
        "brief": "制作一个可适应三种标题长度的设置列表，说明每个轴的尺寸来源。",
        "deliverables": [
          "布局结构",
          "几何预测表",
          "长文本验证"
        ],
        "rubric": [
          {
            "item": "锚点解释正确",
            "points": 25
          },
          {
            "item": "能说明每个尺寸由谁计算",
            "points": 25
          },
          {
            "item": "无循环争写",
            "points": 25
          },
          {
            "item": "内容适配完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "sizeDelta永远等于最终rect尺寸吗？",
          "options": [
            "是，它就是实际宽高的另一个名字",
            "不是，还取决于锚点跨度和父尺寸",
            "是，只要对象位于Canvas下",
            "是，只要Pivot为中心"
          ],
          "answer": 1,
          "explanation": "拉伸锚点提供父尺寸的一部分，sizeDelta表示相对这部分的尺寸差值。",
          "scenario": "父RectTransform宽1000，子元素横向锚点从0.25到0.75，sizeDelta.x=100；无父缩放或布局组件驱动。"
        },
        {
          "question": "布局组与脚本同时修改同一宽度意味着什么？",
          "options": [
            "Unity必然自动选取较大的值",
            "可能出现两个写入者相互覆盖",
            "只会增加一次事件，不影响结果",
            "只要都在Update里就没有问题"
          ],
          "answer": 1,
          "explanation": "应明确最终控制者，不能靠执行顺序偶然得到正确外观。",
          "scenario": "父布局组自动计算子按钮宽度，一个脚本又每帧向同一子按钮宽度写固定200，双方都启用。"
        },
        {
          "question": "频繁ForceUpdateCanvases是通用布局修复吗？",
          "options": [
            "是，它能自动重写所有错误锚点",
            "不是，应先理解约束与更新时机",
            "是，它不会产生额外工作",
            "是，它能消除所有尺寸控制冲突"
          ],
          "answer": 1,
          "explanation": "强制更新不替代正确几何关系与写入范围，也需要考虑成本。",
          "scenario": "文本改长后立即读取到旧矩形；尚未核对布局约束与更新阶段，开发者准备在每个Update强制刷新整个Canvas。"
        }
      ],
      "references": [
        {
          "label": "RectTransform",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RectTransform.html"
        },
        {
          "label": "Canvas.ForceUpdateCanvases",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Canvas.ForceUpdateCanvases.html"
        }
      ],
      "summary": [
        "RectTransform尺寸由父矩形、锚点跨度和尺寸差值等共同决定。",
        "布局组件和脚本不要持续改同一属性，并在明确时点读取结果。"
      ],
      "teaching": {
        "question": "父宽1000、横向锚点0.25到0.75、sizeDelta.x为100，最终宽度为什么是600？",
        "keyIdea": "拉伸锚点先从父矩形获得一段宽度，sizeDelta再在这段跨度上增加或减少。它不总是控件最终宽度。",
        "walkthrough": [
          {
            "title": "先算锚点跨度",
            "text": "父矩形宽1000，横向锚点覆盖比例0.75 - 0.25 = 0.5，因此先得到500的跨度。"
          },
          {
            "title": "再加尺寸差值",
            "text": "在没有布局组件额外驱动等条件下，加上sizeDelta.x的100，局部最终宽度约为600。"
          },
          {
            "title": "改变父宽复验",
            "text": "父宽改为1200后跨度变600，sizeDelta保持100，局部最终宽度约700，用rect.width核对。"
          }
        ],
        "prediction": {
          "question": "布局组正在驱动宽度，脚本每帧改宽度就能从根本上解决弹回吗？",
          "answer": "不能。应先确定最终由谁控制尺寸，再调整布局规则或层级，避免持续相互覆盖。",
          "scenario": "父面板有Horizontal Layout Group，并在控制子尺寸时启用Width。子按钮宽度由布局驱动，脚本同时在每帧强行写同一个宽度。"
        },
        "scenario": "按钮宽度明明写100，换父面板后却变成600；脚本每帧写回200又被立刻改掉。用一个1000宽的父矩形和一个子按钮，把锚点跨度、轴心和自动布局依次拆开。",
        "purpose": "读懂Inspector里的矩形数值，知道应该修改约束还是手写尺寸，做出能容纳长标题的界面。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l057"
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
      "id": "l058",
      "title": "EventSystem 与新版输入的界面分发",
      "goals": [
        "构建 uGUI 的点击链",
        "正确配置 InputSystemUIInputModule",
        "避免重复监听与输入穿透"
      ],
      "theory": [
        {
          "title": "按钮点击依赖一整条路径",
          "paragraphs": [
            "屏幕上画着按钮，只说明界面被显示。点击还需要输入被合适模块接收、EventSystem进行分发、对应Raycaster找到控件，最后Button等组件产生回调。任何一处没有接上，都可能表现为“按钮没反应”。先用一个空Canvas和按钮验证完整路径，再放回复杂面板。",
            "使用新版Input System的uGUI项目，应核对InputSystemUIInputModule以及所需Actions，不要因为场景里存在EventSystem就认为输入配置已正确。多个有效系统或混用模块也会增加歧义，应按项目需要保持清楚配置，并分别测试指针与导航。"
          ]
        },
        {
          "title": "最先命中的可能不是你看见的按钮",
          "paragraphs": [
            "按钮上面可能盖着一张透明Image，只要它仍参与射线检测，就可能拦住输入。CanvasGroup的射线和交互设置、GraphicRaycaster、控件可交互状态也会影响结果。看得见不代表能点到，完全透明也不代表不会被命中。",
            "排查时先观察实际命中对象或逐层关闭覆盖层，而不是不断添加Button监听。恢复后将背景装饰的Raycast Target按需求关闭，保留真正需要拦截的弹窗。这样既能避免“点不动”，也能避免弹窗打开时点击穿过它误操作后方控件。"
          ]
        },
        {
          "title": "监听注册一次，就应有对应清理",
          "paragraphs": [
            "面板重复打开后一次点击多次，要先检查监听是谁、注册在哪、旧关系是否已经解除。一次输入可能被不同组件实例、不同方法，或多份匿名函数同时处理；不能只看AddListener这行执行了几次就推断原因，也不要依赖事件系统替你容忍重复注册。稳定做法是由一个明确组件负责自己的注册，结束时解除同一关系。",
            "例如每次启用时都创建一个局部变量保存本轮编号，再添加一个使用它的匿名函数；函数会保留这份局部数据，这种形式常称为闭包。三轮产生三份不同监听，若旧关系未解除，点击时就可能处理三轮数据。应保存自己注册的同一委托并配对移除。本课正确示例用命名方法，也保证面板停用后不继续响应。RemoveAllListeners可能清掉其他人的回调，不能代替查清谁留下了监听。"
          ]
        },
        {
          "title": "鼠标能点，不代表手柄能导航",
          "paragraphs": [
            "指针点击主要关心当前位置命中谁，键盘和手柄导航还关心当前选中对象、方向连接、Submit与Cancel动作。一个弹窗打开后若没有合理初始焦点，鼠标测试正常，手柄却可能无法操作；关闭后也需要按规则恢复焦点。",
            "测试时不用鼠标，仅通过方向、确认和取消走完整流程，再检查禁用按钮与动态列表。按住移动键打开菜单时，世界角色是否仍运动也要单独规定。UI与世界输入不会自动互斥，输入分配需要用清楚规则处理，而不是认为任何UI命中都会替游戏停掉控制。"
          ]
        },
        {
          "title": "UI检测要注意输入更新时点",
          "paragraphs": [
            "Input System文档提醒，在Input Action回调中直接查询IsPointerOverGameObject可能读取上次更新的UI状态并产生警告。因此不能不看调用阶段，就把这个判断当成同一次输入下绝对实时的屏蔽条件。应依据文档和实际分发流程选择合适时点或输入隔离方式。",
            "按钮回调最好提交一个明确请求，由游戏规则决定是否接受，不在多个控件里重复扣资源或推进场景。记录输入、命中对象、回调次数与请求消费结果，连续打开关闭面板并验证一次操作只产生预期请求，这比偶尔点成功更能证明系统完整。"
          ]
        },
        {
          "title": "关闭后的点击也要验证",
          "paragraphs": [
            "面板关闭可以是隐藏、停用或销毁，这会影响监听与焦点处理。分别测试关闭后点击原位置、再次打开和切换场景，确认旧对象没有继续接收请求，也没有透明层遗留。每条路径都使用同一个计数器记录结果，就能发现只有第二次打开才出现的重复监听问题。"
          ]
        }
      ],
      "code": {
        "title": "配对注册按钮监听",
        "language": "csharp",
        "filename": "ButtonSubscriptionProbe.cs",
        "source": "using UnityEngine;\nusing UnityEngine.UI;\npublic class ButtonSubscriptionProbe : MonoBehaviour\n{\n    [SerializeField] Button button;\n    int requests;\n    void OnEnable() { if (button) button.onClick.AddListener(Request); }\n    void OnDisable() { if (button) button.onClick.RemoveListener(Request); }\n    void Request() { requests++; Debug.Log($\"Request {requests}\", this); }\n}",
        "explanation": [
          "将脚本连接到指定Button，在OnEnable添加自己的方法，在OnDisable移除同一个方法。",
          "重复启停面板后统计点击次数。示例只管理自己的监听，不清除其他系统的回调。"
        ]
      },
      "lab": [
        {
          "title": "逐层检查点击为什么不到达",
          "minutes": 60,
          "steps": [
            "用单按钮场景确认EventSystem、新输入模块、Actions和GraphicRaycaster正常。",
            "加入透明Image，观察是否拦截，再分别测试Raycast Target与CanvasGroup设置。",
            "记录实际命中对象和按钮回调次数，不仅观察按钮颜色。"
          ],
          "result": "从输入到命中再到回调的完整检查记录。",
          "setup": [
            "新建L058_Button。用GameObject > UI创建带Button组件的按钮，若菜单把普通按钮列在Legacy中，从UI > Legacy > Button进入；保留自动生成的Canvas与EventSystem。",
            "窗口入口为Window > General > Hierarchy、Inspector和Console。选EventSystem，确认使用InputSystemUIInputModule；若旧StandaloneInputModule出现，在Input System项目按Inspector提示替换并配置Actions，不同时启用两套输入模块。",
            "保存ButtonSubscriptionProbe.cs。GameObject > Create Empty建ListenerHost，Add Component添加该脚本，把Hierarchy中按钮的Button组件拖进Button字段；点击后Console应输出Request计数。",
            "在Canvas下加Image并让它盖住按钮。选Image，在Inspector比较Color的Alpha与Raycast Target，这两个开关分开测试。"
          ],
          "purpose": "把点击链逐段接通，再用透明覆盖层制造一个能解释的失败。"
        },
        {
          "title": "重复启停与无鼠标导航",
          "minutes": 60,
          "steps": [
            "先运行正确示例，连续打开关闭十次，每次点击一次并记录请求增量；这样检查监听关系是否随启停积累，十次只是练习样本。停用ListenerHost后再点仍活动的按钮，应不再由该宿主处理。新闭包反例另建副本，每轮捕获不同局部编号，观察旧轮次是否仍被调用。",
            "只用键盘或手柄测试初始焦点、方向、确认、取消和焦点恢复。",
            "测试弹窗是否按规则阻止世界输入，并检查UI状态查询所在阶段。"
          ],
          "result": "同时覆盖重复打开、焦点和输入分配的验收表。",
          "setup": [
            "从单按钮基线另存L058_Navigation。让ListenerHost与按钮分开，这样关闭监听宿主后仍能点按钮检验是否继续响应。",
            "先选EventSystem，在Inspector把First Selected指定为该按钮；确认InputSystemUIInputModule的Move、Submit、Cancel动作可用。Play后不用鼠标，只用方向键、确认键完成操作。",
            "一次开关只改ListenerHost的对象总勾选或脚本勾选，记录哪一种。若测试新闭包，另存代码副本并保留旧版本；不要用RemoveAllListeners把其他系统监听一起清掉。"
          ],
          "purpose": "重复打开用于发现残留关系，无鼠标操作用于检查另一套选择与导航链，十次不是引擎要求。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "面板开关越多，点击执行次数越多",
          "cause": "未明确注册者及监听身份，或旧关系未解绑而留下不同实例、方法或捕获数据的回调",
          "fix": "使用命名委托并在禁用时移除自己的监听。"
        },
        {
          "symptom": "新输入系统下按钮不能点",
          "cause": "事件输入模块与项目输入工作流不匹配或未配置。",
          "fix": "检查 InputSystemUIInputModule 与 UI Actions。"
        }
      ],
      "exercise": {
        "brief": "实现一个可反复开关、支持键盘导航且不穿透世界输入的暂停面板。",
        "deliverables": [
          "设备输入到界面与游戏的分发图",
          "十次开关计数",
          "导航测试"
        ],
        "rubric": [
          {
            "item": "点击链完整",
            "points": 25
          },
          {
            "item": "每次注册都有对应解绑",
            "points": 25
          },
          {
            "item": "焦点规则完整",
            "points": 25
          },
          {
            "item": "世界输入隔离",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "OnEnable添加自己的按钮监听后，通常怎样清理？",
          "options": [
            "在对应OnDisable移除同一监听",
            "每次点击后调用RemoveAllListeners清空所有人",
            "再添加一个相同匿名函数抵消旧监听",
            "只隐藏Image即可自动移除全部监听"
          ],
          "answer": 0,
          "explanation": "注册和解绑应对应，并只管理自己拥有的回调。",
          "scenario": "面板在OnEnable对一个指定Button.onClick注册自己的Request命名方法，期望面板停用时不再处理按钮。"
        },
        {
          "question": "完全透明的全屏Image可能挡住按钮点击吗？",
          "options": [
            "可能，是否参与射线检测是独立条件",
            "不可能，alpha为0必然完全忽略",
            "不可能，只要Button可交互",
            "不可能，只要使用新输入系统"
          ],
          "answer": 0,
          "explanation": "需要检查Raycast Target、CanvasGroup等命中设置，不能只看透明度。",
          "scenario": "按钮上方有全屏Image，颜色Alpha=0，Raycast Target仍勾选，所在Canvas有GraphicRaycaster。"
        },
        {
          "question": "鼠标可点能证明手柄导航正常吗？",
          "options": [
            "能，所有输入共用鼠标坐标",
            "不能，还需检查焦点与导航动作",
            "能，只要Button存在",
            "能，只要没有透明遮挡"
          ],
          "answer": 1,
          "explanation": "指针命中和导航选中是不同工作，需要分别验收。",
          "scenario": "鼠标能点击一个uGUI按钮；还没检查EventSystem的当前选中对象，也没测试导航、确认和取消动作。"
        }
      ],
      "references": [
        {
          "label": "uGUI Event System",
          "url": "https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/EventSystem.html"
        },
        {
          "label": "Input System UI support",
          "url": "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/using-ui-input-module.html"
        },
        {
          "label": "UnityEvent.AddListener：相同监听的调用规则",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Events.UnityEvent.AddListener.html"
        }
      ],
      "summary": [
        "按钮显示正常不代表输入、命中和回调都正常。",
        "配对管理监听，分别测试指针、导航焦点和世界输入分配。"
      ],
      "teaching": {
        "question": "每次打开菜单都创建一个捕获本次数据的新监听，打开三次后为什么一次点击可能处理三轮数据？",
        "keyIdea": "每轮创建的匿名函数可以保留不同的局部数据，旧监听未解绑就可能留下旧轮次。主动保存并解除自己的同一委托，让一次注册对应一次清理；不依赖重复相同监听会怎样处理。",
        "walkthrough": [
          {
            "title": "确认监听是否真的不同",
            "text": "记录每次注册来自哪个组件实例、哪个方法、是否捕获本轮局部数据。先确认监听身份及谁负责解除，不把AddListener调用次数直接当成执行次数，也不依赖自动去重。"
          },
          {
            "title": "观察旧数据是否仍被处理",
            "text": "在实验副本每轮新建局部变量保存打开编号，再添加使用它的新匿名函数；三轮后点击一次，观察是否同时处理旧编号与当前编号。这些是不同的监听，不能靠相同名称推断同一身份。"
          },
          {
            "title": "按同一委托解绑",
            "text": "改回示例的命名方法，并在OnDisable移除自己的监听；重做三轮并在关闭后触发一次外部按钮，验证请求数及停用边界。"
          }
        ],
        "prediction": {
          "question": "鼠标能点击按钮，就能宣布手柄操作也通过吗？",
          "answer": "不能。还需测试选中焦点、方向导航、Submit和Cancel，以及弹窗关闭后的焦点恢复。",
          "scenario": "同一个按钮用鼠标点击已通过测试，但还没用键盘或手柄测试方向选择、Submit、Cancel与关闭后的焦点恢复。"
        },
        "scenario": "按钮画出来了，点击没反应；菜单多开几次后，一次操作又处理了旧一轮的数据。本课从一个按钮、一套EventSystem与一个配对监听脚本，沿输入到回调的路径找断点。",
        "purpose": "能排除透明覆盖层、输入模块和监听身份问题，鼠标之外也能验收键盘导航。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l058"
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
      "id": "l059",
      "title": "UI Toolkit：视觉树、样式与回调",
      "goals": [
        "建立 UI Toolkit 的保留式模型",
        "区分 UXML、USS 与逻辑",
        "正确查询并解绑控件回调"
      ],
      "theory": [
        {
          "title": "界面先有结构，再有样式和响应",
          "paragraphs": [
            "UI Toolkit把界面组织成长期存在的视觉树。可以用UXML描述有哪些控件、怎样嵌套，用USS描述颜色、尺寸与布局，用脚本查询元素并响应操作。它与每帧手动画一遍控件的思路不同，脚本通常操作已经存在的VisualElement。",
            "先做一个标题、按钮和状态文本，理解根元素和子元素关系，再增加复杂样式。UIDocument提供宿主与相关配置，但挂上它不代表脚本已经找到正确按钮。运行时应查看实际rootVisualElement，确认文档内容已经建立，再开始接线。"
          ]
        },
        {
          "title": "用稳定名字找到控件",
          "paragraphs": [
            "本课源码查询name为learn-button的Button，UXML也必须使用完全相同的标识。按钮显示“确定”还是“确认购买”是文案，可能随语言变化，不适合当作唯一身份。name是按约定供代码查找的属性，类名主要表达一组共同样式；给两个按钮相同类名不表示它们就是同一个对象。",
            "查询失败时，检查根是否正确、name是否一致、类型是否匹配以及树是否已创建。不要用空条件悄悄忽略后就认为界面可用；关键控件缺失时应给出明确诊断。若多个文档都有learn-button，查询范围尤其重要，不能从任意全局根找到一个同名元素就认定接线成功。"
          ]
        },
        {
          "title": "样式结果取决于整条层级",
          "paragraphs": [
            "某个控件的最终外观可能同时受到USS选择器、类名、父层级和行内样式等影响。脚本改了宽度却没得到预期布局时，先查看实际解析后的样式和布局关系，不要只盯着刚写入的一行。父容器的空间、伸缩方向和子元素约束都会参与计算。",
            "可以先删除额外样式，在简单容器中验证按钮，再逐项恢复。这样能区分是控件数据问题还是样式规则覆盖。长文本和多语言也要测试，因为视觉树结构相同不代表内容占用相同；布局应允许需要的换行、伸缩和滚动，而非依赖一张固定截图。"
          ]
        },
        {
          "title": "回调还涉及传播和对象寿命",
          "paragraphs": [
            "事件可能经过视觉树的不同阶段，目标元素与当前处理元素不一定相同。给父容器和按钮都添加回调时，一次操作可能在多个位置被观察；不能看到两条日志就认定设备重复发送。应根据事件类型和注册方式理解传播，并谨慎使用停止传播。",
            "注册与解绑也要按生命周期配对。元素移除并不自动替你清理它向外部游戏事件注册的委托。缓存元素引用时，要知道对应文档是否仍是当前使用的树；旧按钮虽然仍有C#引用，却可能早已不在当前屏幕里。"
          ]
        },
        {
          "title": "文档替换后需要重新建立关系",
          "paragraphs": [
            "假设脚本启动时查询confirm并注册点击，运行中换了UXML或重建UIDocument，新的视觉树里会出现新的按钮。旧字段不应被假定自动指向它。负责文档切换的流程需要解除旧关系、取得新根、重新查询并注册，再更新显示状态。",
            "最小示例用于固定文档的启停绑定，扩展到动态替换时要增加明确重建步骤。技术选择也应结合项目需求、控件能力和团队维护方式，不能因为UI Toolkit较新就推断所有uGUI都应重写。先让结构、样式、数据与回调关系清楚，界面才容易持续修改。"
          ]
        },
        {
          "title": "用树检查器验证你操作的是谁",
          "paragraphs": [
            "当脚本已执行但界面不变时，可检查真实视觉树中的元素name、类和最终样式，再与缓存引用对照。若新旧文档同时存在，应先确认当前Panel展示哪一棵树。记录这个对应关系，比反复增加延时更能解释为何代码看似运行，却只改到了旧元素。"
          ]
        }
      ],
      "code": {
        "title": "查询命名按钮并配对回调",
        "language": "csharp",
        "filename": "ToolkitButtonProbe.cs",
        "source": "using UnityEngine;\nusing UnityEngine.UIElements;\n[RequireComponent(typeof(UIDocument))]\npublic class ToolkitButtonProbe : MonoBehaviour\n{\n    Button button;\n    void OnEnable()\n    {\n        var root = GetComponent<UIDocument>().rootVisualElement;\n        button = root?.Q<Button>(\"learn-button\");\n        if (button != null) button.clicked += HandleClick;\n    }\n    void OnDisable()\n    {\n        if (button != null) button.clicked -= HandleClick;\n        button = null;\n    }\n    void HandleClick() { Debug.Log(\"Toolkit request\", this); }\n}",
        "explanation": [
          "UXML中Button的name必须设为learn-button，UIDocument要指定该UXML及有效PanelSettings。把脚本挂到同一对象，点击后Console打印Toolkit request；它没有自动创建标题、按钮或状态Label。",
          "固定文档启停可按示例理解；运行中替换文档时，还需明确重新获取根、查询新控件和解绑旧关系的流程。"
        ]
      },
      "lab": [
        {
          "title": "建立可查询的视觉树",
          "minutes": 60,
          "steps": [
            "新建UXML，用UI Builder放入标题、Button和状态Label；Button的Name填learn-button，显示文字填“确定”。创建带UIDocument的场景对象，指定该UXML和有效PanelSettings，再挂ToolkitButtonProbe。",
            "先运行现成脚本，点击后确认Console出现Toolkit request；再自行为状态Label设置稳定name，在同一root下查询它并修改text。区分“现成示例只打印”与“这一步需要自己扩展”。",
            "改变文案和类名，分别观察哪些变化影响查询、哪些只影响样式。"
          ],
          "result": "结构、样式与交互引用清楚分开的最小界面。",
          "setup": [
            "Project中在Assets/EngineLabs/UI下用Create > UI Toolkit > UI Document建Learn.uxml；从Window > UI Toolkit > UI Builder打开它，在Library拖入Button，给Name填learn-button、Text填“确定”。保存UXML。",
            "在Project用Create > UI Toolkit > Panel Settings Asset建LearnPanel。GameObject > Create Empty建LearnUI，Inspector > Add Component添加UIDocument，Source Asset拖Learn.uxml，Panel Settings拖LearnPanel。",
            "保存ToolkitButtonProbe.cs并挂到同一LearnUI。Window > General > Console看Toolkit request；它只打印，不会自动创建UXML或修改状态Label。若要显示状态，另在UXML建有稳定name的Label并扩展查询。"
          ],
          "purpose": "让一个真实Button先能被查到和点击，再改变文案与样式，验证稳定标识的作用。"
        },
        {
          "title": "验证内容变化和文档寿命",
          "minutes": 60,
          "steps": [
            "用长文本和不同语言检查伸缩、换行与滚动，查看实际解析样式。",
            "反复启停文档，统计一次点击的响应数。",
            "在测试副本替换文档，明确解绑旧元素、重新查询与绑定，再验证当前树收到更新。"
          ],
          "result": "不会依赖旧元素或固定文案的界面样本。",
          "setup": [
            "先完成固定文档点击，File > Save As另存L059_Tree。用UI Builder给按钮放长文案并调整容器布局，先测同一文档下的换行和伸缩。",
            "从Window > UI Toolkit > Debugger查看运行时实际元素树与解析样式；选择对应Panel，核对name、类与当前控件，不把Project里打开的另一份UXML当成运行树。",
            "文档动态替换是这组的扩展：明确旧元素解绑、替换、取新根、重新查询绑定四步。现成ToolkitButtonProbe只覆盖固定文档启停，不会自动监听任意UXML重建。"
          ],
          "purpose": "验证当前屏幕展示哪棵树，防止文档重建后还向旧引用写数据。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "Q 查询返回 null",
          "cause": "查询名称、当前文档或元素创建时点不符合预期。",
          "fix": "检查当前视觉树与 UIDocument 配置，显式处理缺失。"
        },
        {
          "symptom": "修改 USS 没效果",
          "cause": "选择器未匹配或内联样式覆盖。",
          "fix": "检查实际类名与最终样式来源。"
        }
      ],
      "exercise": {
        "brief": "用 UI Toolkit 重做一个简单设置页，并比较它与 uGUI 的维护成本。",
        "deliverables": [
          "UXML/USS/脚本",
          "长文本测试",
          "技术选择说明"
        ],
        "rubric": [
          {
            "item": "结构命名稳定",
            "points": 25
          },
          {
            "item": "样式布局清楚",
            "points": 25
          },
          {
            "item": "回调生命周期完整",
            "points": 25
          },
          {
            "item": "比较有具体证据",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "UXML、USS和脚本通常分别承担什么？",
          "options": [
            "结构、样式和交互逻辑",
            "纹理压缩、刚体模拟和声音播放",
            "三者必须都写相同界面结构",
            "结构只能由USS创建，脚本只负责颜色"
          ],
          "answer": 0,
          "explanation": "职责可有具体实现选择，但基本分工帮助组织视觉树、样式与响应。",
          "scenario": "你准备一个UI Toolkit设置页，既有元素层级、颜色布局，也需要点击响应，文件分别使用UXML、USS和C#。"
        },
        {
          "question": "把显示文案当作唯一控件身份合适吗？",
          "options": [
            "合适，翻译后代码会自动跟随",
            "通常不如稳定name，文案可能变化",
            "合适，只要字符串不超过十个字",
            "合适，所有同文案按钮本来就是同一个对象"
          ],
          "answer": 1,
          "explanation": "稳定标识与用户文字分开，能减少文案和本地化变化带来的接线故障。",
          "scenario": "按钮显示文字可能从“确定”变为“确认购买”或其他语言；脚本还要持续找到同一个用途的控件。"
        },
        {
          "question": "替换文档后旧按钮引用一定仍对应当前界面吗？",
          "options": [
            "一定，字段会自动重新查询",
            "不一定，需要重新建立当前树的引用和回调",
            "一定，只要新旧name相同",
            "一定，只要旧对象还没被垃圾回收"
          ],
          "answer": 1,
          "explanation": "同名不代表同对象，旧引用存在也不证明它仍属于当前展示的视觉树。",
          "scenario": "UIDocument从旧UXML换成新UXML并重建视觉树；旧脚本字段还持有先前查到的Button引用，新旧按钮name相同。"
        }
      ],
      "references": [
        {
          "label": "VisualElement",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.VisualElement.html"
        },
        {
          "label": "UIDocument",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.UIDocument.html"
        }
      ],
      "summary": [
        "UXML、USS与脚本分别组织结构、样式和交互。",
        "使用稳定标识，文档重建后重新取得元素并建立回调关系。"
      ],
      "teaching": {
        "question": "按钮文案从“确定”改成“确认购买”，为什么不应因此让脚本找不到按钮？",
        "keyIdea": "显示文字面向用户，稳定name面向代码引用。把身份与文案分开，改语言和表达时就不必同时破坏交互接线。",
        "walkthrough": [
          {
            "title": "给出稳定标识",
            "text": "在UXML中给Button设置name为learn-button，显示文字先写“确定”；这与下面源码Q<Button>(\"learn-button\")一致，查询只在这个UIDocument的根中进行。"
          },
          {
            "title": "改变用户文案",
            "text": "将显示文字改为确认购买或其他语言，保持name不变，验证同一点击回调仍然工作。"
          },
          {
            "title": "测试文档重建",
            "text": "替换文档后重新取得当前根和按钮，再配对注册回调；确认旧缓存不会被误当成新控件。"
          }
        ],
        "prediction": {
          "question": "运行中重建UIDocument后，旧按钮字段会自动引用新按钮吗？",
          "answer": "不能这样假定。新视觉树中的元素可能是新对象，需要按文档重建流程重新查询和绑定。",
          "scenario": "脚本保存了旧UIDocument根下一个Button对象。运行中重建文档，新树里也有同名Button；旧字段没有执行重新查询或绑定。"
        },
        "scenario": "UI文字从“确定”改成“确认购买”，点击就失效；另一次换了UXML，脚本仍在改屏幕上不存在的旧按钮。这个最小页面用稳定name找到控件，再看文档替换后引用为什么要重新建立。",
        "purpose": "做出结构、样式与响应各有位置的UI Toolkit页面，改文案时不会误改代码身份。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l059"
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
      "id": "l060",
      "title": "UI 数据呈现与重建成本",
      "goals": [
        "避免无变化的每帧刷新",
        "解释 Canvas 重建和布局传播",
        "给列表与 HUD 制定性能验收"
      ],
      "theory": [
        {
          "title": "界面显示状态，不应反过来成为唯一数据",
          "paragraphs": [
            "背包金币是游戏状态，文本“金币：125”是它的一种显示。若把剩余金币只藏在Text中，再每次解析字符串计算，就让文案格式承担了数据存储责任。应先有明确数值，再让界面根据它更新，按钮提交的也是购买等请求，由游戏规则决定结果。",
            "这能解释为什么关闭面板不该让金币消失，也能让另一种界面复用同一状态。打开面板时需要获取当前快照，之后再接收变化；只订阅未来事件而不显示现状，可能让首次打开的界面保持空白，直到下一次金币变化才正确。"
          ]
        },
        {
          "title": "没有可见变化，不一定需要重新写文本",
          "paragraphs": [
            "如果金币仍为125，每个Update都重新拼接并写入相同字符串，就在做不必要的工作。具体UI系统可能有内部去重，但不应因此忽略调用方的分配、格式化和重建成本。可比较新旧显示值，确实变化时再更新，而不是单纯把所有界面都搬进Update。",
            "计时器若只显示一位小数，底层时间每帧微变也不要求每次都重写。先将时间转换为最终显示的离散值，再比较它是否改变。这里不是减少更新越多越好：动画进度条或实时交互可能需要更频繁刷新，应从用户能看到的变化和性能数据出发。",
            "例如用FloorToInt(经过秒数×10)作为一位小数显示的刻度，时间1.01秒与1.08秒都得到10，显示均为1.0；到1.11秒得到11，才显示1.1。首次打开应不经比较直接呈现快照，之后比较这个整数刻度。若产品要求四舍五入，应改用相应取整规则，并同步调整边界测试，不能让缓存规则与显示规则各算一套。"
          ]
        },
        {
          "title": "第一次显示不能借用合法值当标记",
          "paragraphs": [
            "示例用hasValue表示是否已经呈现过，再用缓存数值比较后续变化。这样第一次输入即使是int.MinValue，也会正常显示。若把某个合法整数当作“尚未初始化”的特殊值，就会在真实数据恰好等于它时跳过第一次更新。",
            "这是一般的数据建模问题：有没有值，与值是多少，是两件事。切换数据源或重新绑定控件时，也要明确是否清空已显示标记并立即渲染快照。否则新角色碰巧与旧角色数值相同，界面可能误以为不需要更新其他相关内容。"
          ]
        },
        {
          "title": "Canvas拆分要比较两边成本",
          "paragraphs": [
            "频繁变化的计时器和几乎不变的背景放在一起，可能让更新影响更大范围，因此可研究按变化频率拆分Canvas。但每个控件一个Canvas也会增加批次、管理和其他开销，不能当成通用最优结构。",
            "先测界面重建、布局和绘制成本，再尝试将高频区域隔离，比较相同交互下的帧时间。拆分后还要检查排序、缩放与输入。某项重建时间下降而总提交时间上升时，需要按最终目标权衡，不应只选报告里变绿的一个数字。"
          ]
        },
        {
          "title": "大量列表需要复用，也需要重新绑定",
          "paragraphs": [
            "背包有1000项但屏幕只显示十几项时，可以研究虚拟列表，让可见控件反复绑定不同数据。复用的是显示对象，不是旧条目的状态：文字、图标、选中样式、按钮回调和提示都要更新。旧回调若仍引用上一次条目，就可能点甲物品却操作乙物品。",
            "滚动、筛选、删除、重排和重新打开都应测试。每个可见行的当前数据身份要明确，解绑旧关系后再绑定新数据。不要仅检查创建对象数量稳定；选中状态串行、点击错误和隐藏旧图标同样是复用失败。"
          ]
        },
        {
          "title": "先固定数据集再比较性能",
          "paragraphs": [
            "使用同一份条目和相同步骤测试更新策略，记录字符串分配、布局或Canvas重建及实际帧时间。同时核对显示值、点击目标和选择状态。只有正确显示与交互保持成立，减少刷新才有意义。最后说明哪些字段按变化更新、哪些持续更新，以及面板启停时谁负责订阅、解绑和首次快照。"
          ]
        }
      ],
      "code": {
        "title": "只在数值变化时刷新文本",
        "language": "csharp",
        "filename": "CounterView.cs",
        "source": "using UnityEngine;\nusing UnityEngine.UI;\npublic class CounterView : MonoBehaviour\n{\n    [SerializeField] Text label;\n    int lastValue;\n    bool hasValue;\n    public void Present(int value)\n    {\n        if (!label || (hasValue && value == lastValue)) return;\n        lastValue = value;\n        hasValue = true;\n        label.text = value.ToString();\n    }\n    void OnEnable() { hasValue = false; }\n}",
        "explanation": [
          "CounterView用hasValue记录是否已呈现过，避免与合法整数值冲突；后续只有数值改变才写文本。",
          "第一次绑定应提供当前快照。若扩展为事件驱动，启停时也要成对订阅和解绑。"
        ]
      },
      "lab": [
        {
          "title": "只在可见变化时刷新",
          "minutes": 60,
          "steps": [
            "用同一计数器分别测试每帧写文本和数值变化后写文本，记录调用次数与分配。",
            "使用1.01、1.08、1.11秒作为固定输入，以FloorToInt(t×10)得到10、10、11；先预测显示和写入次数，再比较每帧写入与刻度变化时写入。另测首次打开，确保初始快照不会被缓存跳过。",
            "测试首次值为int.MinValue、关闭再打开和切换数据源，确认首次显示正确。"
          ],
          "result": "刷新减少且首次呈现、数据切换都正确的证据。",
          "setup": [
            "新建L060_Counter。在Canvas下创建旧版uGUI Text（GameObject > UI > Legacy > Text），不是TextMeshPro；本课CounterView字段类型是UnityEngine.UI.Text。",
            "保存CounterView.cs，建空ViewHost并Add Component添加，将旧版Text拖到Label字段。创建几个Button，在Inspector的On Click添加ViewHost，选择CounterView.Present(int)，给静态参数分别设10、10、11。",
            "Play后依次点击可观察显示值；要验证重复值是否跳过写入，在学习项目副本Present中临时加一次写入计数或断点。现成脚本没有自动计时驱动，也不会自行调用Present。"
          ],
          "purpose": "用明确输入序列检查首次呈现与重复值，避免缓存把合法值当成未初始化标记。"
        },
        {
          "title": "比较列表规模和复用正确性",
          "minutes": 60,
          "steps": [
            "使用固定1000条数据，在相同步骤下比较全部创建与虚拟复用。",
            "给1000项各分配固定ID，并让每行点击打印“当前绑定ID”。滚动、筛选、删除和重排后，对照当前显示文字与打印ID；重点检查复用前的旧回调是否仍指向上一条数据。",
            "尝试按高低频区域拆分Canvas，测总成本并复测排序与交互。"
          ],
          "result": "同时覆盖性能、数据身份与交互的规模测试。",
          "setup": [
            "先保留十几个可见行作最小复用实验，再扩到1000条固定数据；1000是压力样本，不是接口限制或通用容量建议。给每项ID，例如Item0001。",
            "现成CounterView不是列表系统。列表是独立迁移实现：用Scroll View组织可见行，明确何时绑定文字、图标、选中状态和点击ID；尚未实现虚拟化时先完成少量行的正确绑定。",
            "Window > Analysis > Profiler记录同一路径的更新与布局；Canvas拆分前后保持相同数据、滚动步骤和显示内容，不把少显示物品当成等价优化。"
          ],
          "purpose": "规模是为了暴露复用身份问题；对象数少并不能替代点击是否操作正确数据的检查。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "滚动后点击操作了旧数据",
          "cause": "复用条目没有更新绑定或监听闭包。",
          "fix": "每次绑定重置状态并使用稳定身份。"
        },
        {
          "symptom": "拆了很多 Canvas 反而更复杂且没提速",
          "cause": "未确认重建瓶颈，增加了绘制与管理成本。",
          "fix": "按变化频率提出假设并实测。"
        }
      ],
      "exercise": {
        "brief": "为一个 HUD 与100项列表建立变化驱动呈现，并证明复用不会串数据。",
        "deliverables": [
          "数据呈现接口",
          "性能对照",
          "复用正确性测试"
        ],
        "rubric": [
          {
            "item": "数据与视图分离",
            "points": 25
          },
          {
            "item": "刷新频率合理",
            "points": 25
          },
          {
            "item": "复用状态正确",
            "points": 25
          },
          {
            "item": "测量证据完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "只显示0.1秒刻度的计时器，需要每个微小浮点变化都重写吗？",
          "options": [
            "通常不必，可按最终显示值的变化刷新",
            "必须，否则时间计算会停止",
            "必须，否则Input System不工作",
            "不必，因为UI永远没有任何更新成本"
          ],
          "answer": 0,
          "explanation": "显示精度低于底层数据变化时，可以减少重复写入，但仍要验证响应与首次呈现。",
          "scenario": "计时器底层每帧变化，但界面按向下取整只显示0.1秒刻度，两帧可能得到相同的最终文字。"
        },
        {
          "question": "每个控件单独一个Canvas是通用最优方案吗？",
          "options": [
            "是，它同时保证零重建和零Draw Call",
            "不是，需要权衡重建、批处理和管理成本",
            "是，只要控件数足够多",
            "是，只要所有控件都用相同字体"
          ],
          "answer": 1,
          "explanation": "拆分改变的是成本分布，必须以实际场景总时间和功能正确性判断。",
          "scenario": "一个HUD混有静态背景和高频计时器，开发者准备给每个控件各加一个Canvas，尚未测总重建或绘制成本。"
        },
        {
          "question": "虚拟列表复用控件时，必须关注什么？",
          "options": [
            "重新绑定数据、选中状态和事件关系",
            "只要不再创建对象，旧回调可以保留",
            "只更新文字，图标和选择会自动跟随",
            "只要行号相同，就永远代表同一数据"
          ],
          "answer": 0,
          "explanation": "可见行会代表不同数据，旧状态和回调不清理会导致显示或操作串到其他条目。",
          "scenario": "列表只有少量可见行，滚动时同一行GameObject会绑定不同物品；每个物品有稳定ID、图标、选中状态与点击动作。"
        }
      ],
      "references": [
        {
          "label": "Canvas",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Canvas.html"
        },
        {
          "label": "UI Toolkit ListView",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.ListView.html"
        }
      ],
      "summary": [
        "根据最终可见数据的变化刷新，同时保证首次呈现正确。",
        "列表复用和Canvas拆分都要一起验证成本与交互结果。"
      ],
      "teaching": {
        "question": "计时器只显示一位小数，底层时间每帧变化就必须每帧重写文本吗？",
        "keyIdea": "可以先计算用户最终看见的显示值，再仅在这个值变化时更新。刷新策略应跟随可见变化，同时保留首次呈现与数据绑定的正确性。",
        "walkthrough": [
          {
            "title": "确定显示精度",
            "text": "假设计时器显示0.1秒刻度，先将连续时间转换为用于显示的整数刻度或格式化结果。"
          },
          {
            "title": "比较显示值",
            "text": "连续两帧落在相同刻度时，不必重复写同样文字；跨过下一刻度时才刷新，但首次打开必须先显示。"
          },
          {
            "title": "验证真实成本",
            "text": "对同一段时间分别测试每帧写入与变化后写入，比较分配和重建，并检查显示节奏没有错误。"
          }
        ],
        "prediction": {
          "question": "为了避免重建，给每一个控件都加独立Canvas一定最优吗？",
          "answer": "不一定。拆分也有绘制和管理开销，应按变化范围、批处理和实测总时间决定。",
          "scenario": "把每个UI控件拆成独立Canvas，某项重建范围可能缩小；尚未比较新增绘制提交、布局与管理成本。"
        },
        "scenario": "金币没有变化，界面仍每帧重新拼文字；列表滚动后，点一行却操作了上一件物品。先用一个只在数值变化时刷新的文本，再把同样的“显示对象和数据身份分开”带到列表。",
        "purpose": "减少无可见变化的刷新，同时保住首次显示、重新打开与列表复用的正确性。"
      }
    }
  ]
});
