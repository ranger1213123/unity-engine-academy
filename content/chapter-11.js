// 学者修订：补足具体推导、实验起点及教学边界。
window.COURSE_MODULES.push({
  "id": "m11",
  "number": 11,
  "title": "摄像机、光照与渲染",
  "subtitle": "从世界位置推导最终屏幕画面",
  "description": "用投影和绘制实验理解相机、URP光照、排序、材质与离屏纹理，再测量实际渲染成本。",
  "accent": "#55718d",
  "lessons": [
    {
      "hours": 5,
      "prerequisites": [
        "l050"
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
      "id": "l051",
      "title": "Camera：投影、视口与屏幕坐标",
      "goals": [
        "计算正交摄像机可见范围",
        "解释透视大小与距离",
        "正确进行屏幕到世界的转换"
      ],
      "theory": [
        {
          "title": "画面先来自一套投影规则",
          "paragraphs": [
            "场景里同一个箱子，换一台Camera可能看起来大小不同，甚至完全看不见。相机先根据位置和朝向把世界点转换到自己的坐标，再按投影规则得到屏幕位置，还会使用视野范围、裁剪面和Culling Mask筛选内容。它不是一张贴到眼前的截图，而是决定如何生成截图的一组规则。",
            "排查物体消失时，先确认使用哪台相机、是否位于视野与裁剪范围、Layer是否被允许，再检查Renderer。Scene窗口可见不能证明Game相机可见，因为Scene使用自己的观察方式。屏幕上看着相邻，也不代表世界坐标距离相同。"
          ]
        },
        {
          "title": "正交size表示垂直半高度",
          "paragraphs": [
            "正交相机的Orthographic Size为5时，可见垂直范围约为10个世界单位，而不是5。若画面宽高比为16:9，可见宽度约为10 × 16 ÷ 9 = 17.78个世界单位。将宽高比改成4:3，垂直范围不变，水平范围则变窄。",
            "正交投影下，单纯把物体沿相机深度方向移远，通常不会像透视那样变小，但仍会受到裁剪与遮挡等条件影响。二维关卡适配时要先决定保持垂直范围还是其他目标，再推导横向多看或少看多少，不应靠随意缩放全部角色补偿窗口比例。"
          ]
        },
        {
          "title": "透视缩放取决于距离与视野",
          "paragraphs": [
            "透视相机中，近物看起来大、远物看起来小。减小视野角FOV或把相机靠近目标都可能让某个物体变大，但它们对不同深度物体的相对大小影响不同，不能总当成完全等价的放大按钮。",
            "可以把两个同样大小的箱子分别放在近处和远处，先改变FOV，再移动相机，比较二者的大小关系与背景。Near和Far裁剪面决定参与投影的深度范围，也不是只影响画面亮度。理解这些变量后，镜头调整才能明确是在改变构图、透视关系还是可见范围。"
          ]
        },
        {
          "title": "屏幕上的点还缺少深度",
          "paragraphs": [
            "鼠标坐标只给出屏幕二维位置，沿同一视线可以对应许多世界点。因此ScreenToWorldPoint还需要深度条件；它的Z输入涉及相对相机的深度，不应误当成你想得到的世界Z坐标。相机旋转或不在原点时，这种混淆尤其明显。",
            "若目标是与地面相交，可以从屏幕点生成世界射线，再与明确平面或碰撞体求交。例如俯视游戏约定在XY平面放置标记，就定义该平面，再计算交点。查询失败也要处理，如射线与平面平行或没有碰撞，不能无条件拿默认结果移动角色。",
            "例如相机位于(0,0,-10)、朝世界+Z看，目标平面是世界Z=0，屏幕中心对应平面上的点。传给ScreenToWorldPoint的深度应是距相机10个单位，而不是因为目标世界Z=0就传0。若相机转了方向，不能继续机械地取两个Z值相减；用ScreenPointToRay与明确平面求交，能直接表达这时真正要解的几何问题。"
          ]
        },
        {
          "title": "跟随相机也会放大更新差异",
          "paragraphs": [
            "身体在固定物理步改变位置，相机在显示帧跟随，如果读取的目标呈阶梯变化，画面就可能轻微顿挫。LateUpdate通常适合在目标的常规更新之后跟随，但它本身不会自动增加物理频率，也不能解决另一个脚本随后又写相机的问题。",
            "先固定相机看目标是否平滑，再启用跟随，分别检查身体插值、目标更新阶段与相机写入者。最后在宽屏、窄屏和不同输出尺寸测试边缘内容及屏幕点转换。把每个坐标都标明是屏幕像素、视口比例还是世界单位，计算与调试就更容易对齐。"
          ]
        },
        {
          "title": "视口比例与屏幕像素别混用",
          "paragraphs": [
            "视口坐标通常用相对于相机视口的比例表达位置，例如中心是(0.5, 0.5)。屏幕坐标则按像素表达，窗口尺寸变化后，中心像素数也会变。两种接口名字相近，传错后在某个分辨率可能碰巧正常，换窗口就暴露问题。把四角和中心作为固定样本，可以快速验证转换是否使用正确空间。"
          ]
        }
      ],
      "code": {
        "title": "屏幕中心射线与世界平面相交",
        "language": "csharp",
        "filename": "CameraPlaneProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Camera))]\npublic class CameraPlaneProbe : MonoBehaviour\n{\n    void Update()\n    {\n        var cameraComponent = GetComponent<Camera>();\n        Ray ray = cameraComponent.ViewportPointToRay(new Vector3(0.5f, 0.5f, 0));\n        Plane plane = new Plane(Vector3.forward, Vector3.zero);\n        if (plane.Raycast(ray, out float distance))\n            Debug.DrawLine(ray.origin, ray.GetPoint(distance), Color.yellow);\n    }\n}",
        "explanation": [
          "示例从屏幕中心生成射线，再与明确的世界平面求交。先检查相机引用与目标平面的方向。",
          "交点依赖相机、视口和几何约束；并非把屏幕像素直接复制为世界坐标。"
        ]
      },
      "lab": [
        {
          "title": "用标尺比较两种投影",
          "minutes": 60,
          "steps": [
            "在正交size为5时测量上下范围，再切换16:9与4:3预测水平范围。",
            "放近远两个同尺寸箱子，分别改变透视FOV和相机距离。",
            "记录哪些变化影响构图，哪些改变不同深度的相对大小。"
          ],
          "result": "包含数值预测与实际画面范围的投影记录。"
        },
        {
          "title": "验证转换与跟随",
          "minutes": 60,
          "steps": [
            "先用位于(0,0,-10)、朝+Z的相机，把屏幕中心转换到世界Z=0平面，比较深度输入0与10的结果；再旋转相机，改用ScreenPointToRay与同一平面求交，标出中心和四角。",
            "固定相机观察刚体，再加入LateUpdate跟随与身体插值，分步定位抖动。",
            "改变分辨率和相机朝向，检查中心与边缘的转换是否仍正确。"
          ],
          "result": "坐标空间、深度条件和跟随时点均明确。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "鼠标转世界落在摄像机旁边",
          "cause": "屏幕点没有提供正确深度或目标平面。",
          "fix": "用射线与明确平面或表面相交。"
        },
        {
          "symptom": "窗口变宽后看见更多左右区域",
          "cause": "正交大小保持半高度，水平范围随宽高比变化。",
          "fix": "按预期计算边界，决定适配规则。"
        }
      ],
      "exercise": {
        "brief": "为固定大小的二维练习区设计三种宽高比下的相机适配。",
        "deliverables": [
          "投影公式",
          "三种比例对照",
          "转换和跟随说明"
        ],
        "rubric": [
          {
            "item": "半高度理解正确",
            "points": 25
          },
          {
            "item": "适配规则明确",
            "points": 25
          },
          {
            "item": "坐标约束完整",
            "points": 25
          },
          {
            "item": "跟随验证受控",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "正交size为5，垂直可见世界范围大约是多少？",
          "options": [
            "5",
            "10",
            "由摄像机到物体距离直接决定",
            "始终等于窗口像素高度"
          ],
          "answer": 1,
          "explanation": "size是半高度，完整垂直范围约为2 × 5。"
        },
        {
          "question": "屏幕二维点能唯一确定三维世界点吗？",
          "options": [
            "能，屏幕中心永远对应世界原点",
            "不能，还需要深度或几何条件",
            "能，只要相机没有旋转",
            "能，只要使用透视投影"
          ],
          "answer": 1,
          "explanation": "同一屏幕点对应一条视线，必须用平面、深度或碰撞等约束选择世界点。"
        },
        {
          "question": "相机后退与增大FOV总是完全等价吗？",
          "options": [
            "是，二者都只是统一缩放",
            "不是，不同深度物体的相对关系可能不同",
            "是，只要目标位于画面中心",
            "是，只要Near和Far保持不变"
          ],
          "answer": 1,
          "explanation": "透视关系会随相机位置改变，不能只看一个目标大小相似就认为整体相同。"
        }
      ],
      "references": [
        {
          "label": "Camera",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Camera.html"
        },
        {
          "label": "Camera.ScreenPointToRay",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Camera.ScreenPointToRay.html"
        }
      ],
      "summary": [
        "先明确投影、相机和坐标空间，再计算可见范围。",
        "屏幕点缺少深度，需要明确平面、表面或其他几何条件。"
      ],
      "teaching": {
        "question": "正交size为5，16:9窗口里大约能看到多宽的世界？",
        "keyIdea": "正交size是垂直半高度。先算完整高度，再乘宽高比，就能预测窗口比例变化后多出或减少的横向视野。",
        "walkthrough": [
          {
            "title": "明确参数含义",
            "text": "相机使用正交投影，size设为5，没有额外改变视口，先得到垂直范围约10个世界单位。"
          },
          {
            "title": "计算宽度",
            "text": "16:9时宽度约为10 × 16 ÷ 9 = 17.78个世界单位，在场景中用左右标尺核对。"
          },
          {
            "title": "改变宽高比",
            "text": "切到4:3时高度仍约10，宽度约13.33；记录边缘内容减少，而不是把它误认为角色变大。"
          }
        ],
        "prediction": {
          "question": "把鼠标二维坐标直接当作世界XY，所有相机下都正确吗？",
          "answer": "不正确。屏幕像素与世界单位不同，且缺少深度条件，应使用适当坐标转换或射线求交。"
        }
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l051"
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
      "id": "l052",
      "title": "URP 的灯光、材质与二维排序",
      "goals": [
        "区分内置管线与 URP",
        "解释二维光照成立条件",
        "建立精灵遮挡和 Sorting Group 规则"
      ],
      "theory": [
        {
          "title": "先确认项目使用哪套渲染配置",
          "paragraphs": [
            "在URP项目里放一个Light2D，角色却没有变亮，问题未必在灯的强度。最终画面取决于当前URP资源、相机使用的Renderer、材质Shader以及灯的作用范围。只有这些环节支持并参与同一条二维光照流程，灯光才可能产生预期效果。",
            "先建立最小场景，用一个Sprite、一盏灯和一台相机验证。记录当前Renderer是二维还是其他配置，再看Sprite使用的材质。不从一个复杂关卡里同时调环境光、后处理和多盏灯，更容易确定是哪一环没有接上。"
          ]
        },
        {
          "title": "Lit和Unlit决定是否按该模型受光",
          "paragraphs": [
            "Unlit材质通常按自己的颜色和纹理显示，不使用普通受光模型；因此增加Light2D不一定改变它。适用的Lit材质才会按相应二维光照规则响应。这里不是“灯照不到图片”的日常空间直觉，而是Shader有没有执行对应计算。",
            "将同一Sprite复制两份，分别用兼容的Lit与Unlit材质，保持位置、颜色和贴图一致，再调灯光。这样能把材质能力与灯范围分开。某个Lit版本仍不变时，再检查灯启用状态、强度、目标Sorting Layers和相机Renderer，不急于重新导入整张图。"
          ]
        },
        {
          "title": "先画谁与物理前后不是一回事",
          "paragraphs": [
            "二维角色遮挡通常涉及Sorting Layer、Order in Layer、材质队列及透明排序等条件。两个Sprite谁盖住谁，不应只根据Collider、对象创建先后或Hierarchy列表位置推断。Z位置可能参与某些排序规则，但不是所有二维排序的唯一依据。",
            "例如一个角色由身体和武器两个Renderer组成。如果它们分别参与外部排序，另一个角色可能被画在身体与武器之间。Sorting Group可让多部件作为一组参与外部排序，但组内仍需配置各部件顺序。先明确角色内部关系，再规定角色与环境之间的遮挡。"
          ]
        },
        {
          "title": "脚底排序要说明用哪个参考点",
          "paragraphs": [
            "俯视游戏常希望脚底更靠下的角色盖住靠上的角色。可以根据脚底世界位置计算排序值，但要统一取点、方向、比例和更新方法。若有人用图片中心，有人用脚底，较高的角色或挥动武器时就可能出现不稳定遮挡。",
            "排序只解决显示先后，不会让两个角色产生或取消物理阻挡。透明效果也要单独检查，火花、阴影和血条是否属于同组、是否需要覆盖角色，都应有明确规则。把所有部件的Order持续加大，可能暂时盖住问题，却会使后续效果更难插入。",
            "一种最小映射是order = -RoundToInt(脚底世界Y×100)。脚底Y=2的角色得到-200，Y=1的角色得到-100；在同一Sorting Layer等相同条件下，更大的Order画在前面，于是靠下的角色盖住靠上的角色。100只决定排序分辨率，不是引擎规定；相同脚底值如何打破平局、装饰物怎样插入，仍需项目明确规则。"
          ]
        },
        {
          "title": "灯光和排序用不同实验验证",
          "paragraphs": [
            "先固定排序，验证灯能否影响目标Sprite；再固定光照，只让两个角色沿上下方向交叉，验证遮挡。加入多部件、透明粒子和环境装饰后重复测试。这样每次故障都能指出是光照链路还是排序关系，不会把角色变暗误认为被别的Sprite盖住。",
            "Scene窗口的相机图标、灯光标记和选择框可能只是Gizmos，并不都是游戏内容。对比Game画面与Gizmos开关，再查看Frame Debugger中的实际绘制。保存一份基准场景及材质、Renderer和排序规则，换素材时先在基准中验证，再放回复杂关卡。"
          ]
        },
        {
          "title": "透明效果需要背景对照",
          "paragraphs": [
            "一个半透明阴影在黑背景上不明显，在白背景上却很清楚，这可能是正常混合结果，而非排序失效。检查效果时至少使用明暗两种背景，并观察它与角色、地板和其他透明物体交叠的情况。若只在一种背景截图，很难判断缺失的是绘制事件、颜色对比还是正确的混合关系。"
          ]
        }
      ],
      "lab": [
        {
          "title": "验证二维光照每个环节",
          "minutes": 60,
          "steps": [
            "建立一台相机、一个Lit Sprite和一盏Light2D的基准场景，记录URP与Renderer配置。",
            "复制成左右并排的同Sprite样本，在同一Global Light 2D下仅比较兼容Lit与Unlit材质；然后另开一组改灯范围和目标Sorting Layers，分别记录哪种改变让响应消失。",
            "对每个不变亮的情况指出断开的环节，恢复后再次验证。"
          ],
          "result": "能区分Shader能力、灯范围与Renderer配置。"
        },
        {
          "title": "验证多部件遮挡",
          "minutes": 60,
          "steps": [
            "用身体和武器组成两个角色，让它们上下交叉，先观察独立排序的问题。",
            "加入Sorting Group并确定组内顺序，再统一脚底参考点进行外部排序。",
            "加入半透明阴影与粒子，用明暗背景复测，并对比Gizmos与真实Game内容。"
          ],
          "result": "一组包含角色、环境与透明效果的明确排序规则。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "添加二维灯后精灵完全不变",
          "cause": "Renderer、Shader 或灯光作用范围不匹配。",
          "fix": "确认二维渲染路径，使用已知兼容材质建立基线。"
        },
        {
          "symptom": "剑穿插到另一个角色中间",
          "cause": "多个 Renderer 各自参与外部透明排序。",
          "fix": "研究 Sorting Group 并明确组内顺序。"
        }
      ],
      "exercise": {
        "brief": "制作受光与不受光精灵并存、两角色正确交叠的基准场景。",
        "deliverables": [
          "管线配置记录",
          "光照对照",
          "组内与组外的排序规则"
        ],
        "rubric": [
          {
            "item": "管线识别准确",
            "points": 25
          },
          {
            "item": "受光条件验证",
            "points": 25
          },
          {
            "item": "组内外排序正确",
            "points": 25
          },
          {
            "item": "基准可复用",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "Unlit表面一定会随Light2D增强而变亮吗？",
          "options": [
            "一定，所有Sprite使用同样光照",
            "不应这样期待，要看Shader是否执行相应受光计算",
            "一定，只要灯与Sprite同名",
            "一定，只要Order in Layer足够高"
          ],
          "answer": 1,
          "explanation": "是否受光首先是渲染配置与Shader能力问题。"
        },
        {
          "question": "Sorting Group的主要价值之一是什么？",
          "options": [
            "让多个Renderer作为整体参与外部排序",
            "把多个Collider合成一个刚体",
            "自动给所有Sprite设置Lit材质",
            "自动计算角色受到的所有灯光"
          ],
          "answer": 0,
          "explanation": "它服务于显示排序，组内外关系仍需按需求配置。"
        },
        {
          "question": "Scene窗口中的白色相机图标一定会出现在游戏画面吗？",
          "options": [
            "一定，它属于相机渲染的网格",
            "不一定，它可能只是编辑器Gizmos",
            "一定，只要相机启用",
            "一定，只要没有隐藏Hierarchy对象"
          ],
          "answer": 1,
          "explanation": "编辑器辅助图标与相机实际绘制内容不同，应对照Game视图和Gizmos开关。"
        }
      ],
      "references": [
        {
          "label": "Universal Render Pipeline 17.3",
          "url": "https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.3/manual/index.html"
        },
        {
          "label": "SortingGroup",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rendering.SortingGroup.html"
        }
      ],
      "summary": [
        "Renderer、Shader与灯光配置需要配合，Unlit不会自动按普通受光方式响应。",
        "角色内部、角色之间与透明效果的排序分别定义和验证。"
      ],
      "teaching": {
        "question": "Light2D越来越亮，为什么使用Unlit材质的角色仍没有明显受光变化？",
        "keyIdea": "光照效果需要材质执行相应受光计算。先检查Shader和Renderer，再检查灯范围；单纯加大强度不能补齐缺失的渲染环节。",
        "walkthrough": [
          {
            "title": "保持其他条件相同",
            "text": "复制同一个Sprite并左右并排放置，采用同一贴图、颜色和缩放，放在同一盏Global Light 2D作用下；分别使用兼容的Lit与Unlit材质，避免两张图重叠遮住比较结果。"
          },
          {
            "title": "验证渲染链路",
            "text": "确认相机使用支持二维光照的Renderer，灯启用且目标Sorting Layer包含测试Sprite。"
          },
          {
            "title": "比较响应",
            "text": "改变灯强度和位置，观察哪种材质响应；若Lit也不变，再逐项检查范围与配置，而非反复改图片。"
          }
        ],
        "prediction": {
          "question": "Sorting Group会把角色的多个Collider自动合成一个物理身体吗？",
          "answer": "不会。它处理绘制排序，物理身体仍由Rigidbody2D和Collider2D等组件关系决定。"
        }
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l052"
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
      "id": "l053",
      "title": "Material、Shader 与实例化的代价",
      "goals": [
        "解释 Shader 和 Material 的关系",
        "区分 sharedMaterial 与 material",
        "评估逐对象参数和批处理的取舍"
      ],
      "theory": [
        {
          "title": "Shader负责怎么算，Material提供参数",
          "paragraphs": [
            "同一个Shader可以配出红色和蓝色两份材质。Shader描述顶点和像素等阶段怎样处理，Material选择Shader并提供颜色、贴图与其他参数。Renderer再引用Material参与绘制。因此“改颜色”可能只是改参数，而“改变受光方式”可能需要合适Shader，不能把两者都叫换贴图。",
            "开始实验时让两个Cube引用同一材质，记录Shader与颜色属性名。不同Shader的属性名称未必一致，代码改了一个不存在或不使用的属性，画面不会按预期变化。先在Inspector确认真实属性，再编写脚本，能避免把无效赋值误判成渲染故障。"
          ]
        },
        {
          "title": "共享材质为什么让所有人一起变色",
          "paragraphs": [
            "若两个Renderer共用一个Material，修改该共享对象的颜色，就可能影响所有使用者。只想让一个受击敌人变红，却改sharedMaterial，是常见范围错误；脚本改的是公共资源，而非仅给某个敌人附加一份状态。",
            "Renderer.material的访问又可能实例化材质，使该Renderer拥有独立副本。它方便隔离修改，但不是完全无成本的读取，生成的实例还需要明确谁负责销毁。不能在大量对象或每帧流程里随意访问，却只根据代码没有显式new就认定没有创建资源。",
            "把两个Renderer的关系写成A→材质M、B→材质M。改M的颜色，两个箭头仍指向同一份数据，因而一起变化。为A取得独立实例MA后，关系变成A→MA、B→M，再改MA才只影响A。首次访问material可能建立这种实例关系；不能反过来说每次读取都必定再创建一个新实例，但应避免把可能实例化的属性当作完全没有副作用的普通字段。"
          ]
        },
        {
          "title": "属性块不等于任何时候都更快",
          "paragraphs": [
            "MaterialPropertyBlock可给Renderer提供部分属性覆盖，不必仅为某个颜色差异创建一份完整材质。但它不是适用于一切渲染路径的优化按钮。官方明确说明它不兼容SRP Batcher，在URP中使用可能降低性能，不能把减少材质实例数直接等同于总渲染更快。",
            "实验应确认目标Shader支持的属性以及实际路径，再比较共享材质、独立材质与属性块。观察Frame Debugger里的批次与状态，并测目标设备帧时间。一个方案占用更少材质对象，却产生更高CPU提交开销，也是需要承认的结果。"
          ]
        },
        {
          "title": "谁创建资源，谁负责结束使用",
          "paragraphs": [
            "若脚本主动创建材质副本，就要保存引用并在合适阶段销毁；如果只是借用外部共享材质，就不应在停用时随意Destroy。修改和释放是两种权限，能使用一个对象并不代表拥有删除它的责任。先写清创建者、修改范围和结束时机，代码更容易审查。",
            "属性覆盖也可能与其他脚本冲突。两个组件各自设置完整属性块时，可能覆盖彼此的字段。应规定由谁集中写入，或使用不会丢失所需字段的明确更新方式。把颜色恢复到白色也不一定恢复原状，因为原材质颜色未必就是白色。"
          ]
        },
        {
          "title": "用可比较的场景判断代价",
          "paragraphs": [
            "建立固定数量、相同网格、相同光照的测试对象，只改变材质修改方案。记录材质实例数、批处理情况、CPU与GPU时间，再重复启用停用检查资源是否增长。若测试场景同时改变阴影、分辨率和数量，就无法把改善归因到属性块。",
            "受击闪色还要检查功能：结束后恢复原色、不同敌人互不串色、停用再启用没有残留。最后按具体平台和渲染配置选择，不把某一次结果写成引擎永恒规律。渲染优化必须保持视觉需求成立，不能只展示更少对象却省略颜色效果。"
          ]
        },
        {
          "title": "运行修改与编辑资源要区分",
          "paragraphs": [
            "Editor中修改共享材质资产还可能影响之后的编辑结果，不能把Play当成绝对隔离的实验箱。练习时使用专用材质副本，结束后检查资源是否被保存修改。记录修改发生在资产、运行实例还是属性覆盖层，别人才能准确复现“哪个敌人变红，哪些对象不该变化”。"
          ]
        }
      ],
      "code": {
        "title": "URP 颜色属性块实验",
        "language": "csharp",
        "filename": "ColorPropertyProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Renderer))]\npublic class ColorPropertyProbe : MonoBehaviour\n{\n    [SerializeField] Color color = Color.red;\n    Renderer targetRenderer;\n    MaterialPropertyBlock block;\n    static readonly int BaseColor = Shader.PropertyToID(\"_BaseColor\");\n    void Awake()\n    {\n        targetRenderer = GetComponent<Renderer>();\n        block = new MaterialPropertyBlock();\n    }\n    void Start()\n    {\n        if (!targetRenderer.sharedMaterial || !targetRenderer.sharedMaterial.HasProperty(BaseColor)) return;\n        targetRenderer.GetPropertyBlock(block);\n        block.SetColor(BaseColor, color);\n        targetRenderer.SetPropertyBlock(block);\n    }\n}",
        "explanation": [
          "先确认URP Shader实际使用的颜色属性，再对指定Renderer设置属性块，观察局部颜色覆盖。",
          "这是一组正确性与成本对照实验。属性块不兼容SRP Batcher，不能把此代码当作通用URP提速方案。"
        ]
      },
      "lab": [
        {
          "title": "分清共享、实例和覆盖",
          "minutes": 60,
          "steps": [
            "让两个对象引用同一材质，修改共享颜色并记录影响范围。",
            "取得A的独立材质后保存该引用，记录A与B各自实际引用的对象；重复读取时观察实例数，不预设每次访问都创建。清理时只销毁自己创建或拥有的实例，绝不销毁B仍在使用的共享材质。",
            "使用属性块仅改变一个Renderer，核对Shader属性及恢复结果。"
          ],
          "result": "能指出每种方案修改哪个对象、由谁清理。"
        },
        {
          "title": "比较URP中的实际成本",
          "minutes": 60,
          "steps": [
            "固定对象数、网格、灯光和相机，分别使用三种材质方案。",
            "用Frame Debugger看批次，用Profiler测CPU/GPU时间，不只数材质。",
            "反复开关闪色和对象，检查串色、原色恢复及实例数量是否持续增长。"
          ],
          "result": "一份同时覆盖视觉、寿命与帧时间的比较记录。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "一个敌人受击，全场变红",
          "cause": "修改共享材质参数。",
          "fix": "按需求选独立实例或适合当前路径的逐对象参数。"
        },
        {
          "symptom": "属性写了却无颜色变化",
          "cause": "Shader 不含相应属性或该属性未参与输出。",
          "fix": "核对 Shader 属性名与实现，先用已知材质验证。"
        }
      ],
      "exercise": {
        "brief": "实现十个对象独立染色，比较两种策略并说明资源释放责任。",
        "deliverables": [
          "颜色实验",
          "材质创建者、使用者与释放者表",
          "渲染测量条件"
        ],
        "rubric": [
          {
            "item": "共享实例区分",
            "points": 25
          },
          {
            "item": "属性名称、用途和修改范围正确",
            "points": 25
          },
          {
            "item": "生命周期完整",
            "points": 25
          },
          {
            "item": "性能结论有证据",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "只想改一个对象却修改sharedMaterial，可能发生什么？",
          "options": [
            "其他共享该材质的对象也受影响",
            "Unity自动为每个对象保存不同颜色",
            "只有当前选择的Inspector对象变化",
            "自动生成不会影响批处理的独立材质"
          ],
          "answer": 0,
          "explanation": "sharedMaterial指向共享对象，修改范围可能超出单个Renderer。"
        },
        {
          "question": "MaterialPropertyBlock保证URP更快吗？",
          "options": [
            "保证，因为材质实例更少就是帧时间更短",
            "不保证，它不兼容SRP Batcher，需要实测",
            "保证，只要使用颜色属性",
            "保证，只要每帧重新创建一个块"
          ],
          "answer": 1,
          "explanation": "对象数量与渲染成本不是同一指标，属性块在具体路径可能降低性能。"
        },
        {
          "question": "脚本创建的材质实例应由谁管理释放？",
          "options": [
            "明确负责创建与结束使用的拥有者",
            "任何曾经读取它的脚本都可以销毁",
            "必须永远不销毁",
            "只要禁用Renderer就自动完成全部清理"
          ],
          "answer": 0,
          "explanation": "先区分自己创建的实例和借用的共享资源，避免泄漏或误删。"
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
        }
      ],
      "summary": [
        "共享材质、独立材质和属性块的影响范围与成本不同。",
        "URP属性块不兼容SRP Batcher，应按实际路径比较总帧时间。"
      ],
      "teaching": {
        "question": "只想让敌人A变红，为什么敌人B也一起变红？",
        "keyIdea": "两个Renderer可能引用同一个材质对象。修改共享对象会影响所有使用者，必须先确定修改范围，再选择实例或属性覆盖等方法。",
        "walkthrough": [
          {
            "title": "确认共享关系",
            "text": "选择敌人A和B，核对Renderer引用是否指向同一Material，并记录原始颜色和Shader属性。"
          },
          {
            "title": "修改共享颜色",
            "text": "在测试材质上修改sharedMaterial的颜色，观察A和B同时变化，证明改的是公共资源。"
          },
          {
            "title": "再比较隔离方案",
            "text": "分别测试有明确销毁责任的独立材质与属性块，验证只有A变化，并在URP下测实际批处理和耗时。"
          }
        ],
        "prediction": {
          "question": "属性块减少材质副本，能据此保证URP更快吗？",
          "answer": "不能。它不兼容SRP Batcher，可能降低性能，必须按实际路径与目标设备测量。"
        }
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l053"
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
      "id": "l054",
      "title": "从 Draw Call 到 Frame Debugger",
      "goals": [
        "区分 CPU 提交与 GPU 工作",
        "用 Frame Debugger 解释绘制顺序",
        "建立渲染优化的测量假设"
      ],
      "theory": [
        {
          "title": "一帧慢，先问时间花在哪里",
          "paragraphs": [
            "画面包含100个角色不一定比10个角色慢十倍，Draw Call更少也不一定更快。一帧可能受CPU逻辑、渲染提交、GPU顶点处理、像素着色、透明覆盖或等待限制。先在相同设备和场景看帧时间，再提出具体瓶颈假设。",
            "例如降低分辨率后GPU时间明显下降，支持像素工作量较大的可能；减少复杂脚本后CPU时间下降，则是另一条线索。它们都不是单独一次改动就能证明全部原因，但比只盯着一个Draw Call计数更接近可验证的分析。"
          ]
        },
        {
          "title": "Draw Call是工作提交的一种观察",
          "paragraphs": [
            "绘制通常需要设置相应状态并提交几何，合批可以在满足条件时减少部分提交工作。相同贴图或相同名字，并不自动保证同批；材质、Shader变体、网格、排序和渲染路径等条件都可能影响结果。具体批处理机制也有各自要求。",
            "因此不要一看到批次高就把所有东西强行合成一个对象。合并可能改变剔除粒度、更新成本和资源组织。应先在Frame Debugger中观察哪些事件被分开、为什么状态不同，再选择与实际瓶颈相关的改动，并验证功能和可维护性。"
          ]
        },
        {
          "title": "透明画面常在同一像素上工作多次",
          "paragraphs": [
            "一个屏幕位置先画背景，再画烟雾、火焰和半透明界面，同一像素就可能被重复着色和混合。即使每张图的几何很简单、Draw Call不多，大面积透明覆盖仍可能很贵。看起来空白的透明纹理区域也不能仅凭肉眼认定毫无成本。",
            "实验可以保持粒子数量不变，只缩小屏幕覆盖面积，再观察GPU时间。若成本明显下降，就有理由继续研究过度绘制或像素Shader。排序和遮挡正确性仍要保持，不能通过删除关键效果来把一项功能退化包装成同等效果下的优化。"
          ]
        },
        {
          "title": "Frame Debugger解释这帧怎么画成",
          "paragraphs": [
            "暂停在某一帧后，Frame Debugger允许逐个检查绘制事件、使用的目标与状态，观察画面从早到晚如何累积。某个Sprite未显示时，可以找它是否提交、写到了哪里、是否被后续事件覆盖。这比只看最终截图更能解释渲染链。",
            "它不是精确性能计时器。调试模式本身也会影响运行，不能用逐步按钮点击速度判断哪个事件耗时最多。性能数据应回到Profiler及合适GPU工具，在稳定条件和目标设备采样。解释内容与测量时间各有工具，两者结合才完整。"
          ]
        },
        {
          "title": "一份优化提案需要可被推翻",
          "paragraphs": [
            "先写假设，例如“全屏透明叠加造成主要GPU成本”，再设计只减少覆盖面积的对照。若GPU时间不变或瓶颈在CPU，这个假设就需要修正。允许实验否定自己的想法，是性能工作正常的一部分，而不是失败。",
            "记录版本、设备、分辨率、场景、预热条件与多次采样结果。使用毫秒比较改善，比仅给平均FPS更容易看到一帧中节省多少预算。最后检查外观、排序、交互和资源占用没有出现不可接受变化；优化结论应说明适用条件与测量范围。"
          ]
        },
        {
          "title": "FPS相同也可能隐藏时间差",
          "paragraphs": [
            "垂直同步或帧率上限可能让两种实现都显示60FPS，即使其中一种留出了更多GPU余量。应检查受限制的等待及实际工作时间，而不是看到相同FPS就说没有改善。反过来，Editor和开发构建的附加开销也可能不同，正式决策要以合适构建和目标平台数据为依据。",
            "例如60Hz垂直同步下，一帧显示间隔约16.7毫秒。GPU实际工作由14毫秒降到10毫秒，两种方案仍可能都显示60FPS，但后者多出约4毫秒余量。若另一场景CPU仍需20毫秒，单独缩短GPU工作也可能不改变总帧率。这里的关键是分别读取工作和等待，而不是把1/FPS当成每个子系统各自耗时。"
          ]
        }
      ],
      "lab": [
        {
          "title": "解释一帧的形成",
          "minutes": 60,
          "steps": [
            "在含背景、角色和透明效果的场景启用Frame Debugger。",
            "逐步查看事件，记录目标、材质、排序和最终画面如何累积。",
            "故意隐藏或覆盖一个对象，再根据事件确定它未提交还是被后续覆盖。"
          ],
          "result": "一份能由绘制事件解释的画面形成记录。"
        },
        {
          "title": "提出并检验瓶颈假设",
          "minutes": 60,
          "steps": [
            "固定设备、分辨率和场景，记录CPU工作、GPU工作与等待的毫秒数；同时记录VSync和帧率上限。即使两组都显示60FPS，也保留各自工作时间，再提出一个可被对照实验推翻的瓶颈假设。",
            "只改变分辨率、透明覆盖或提交方式之一，比较同条件多次采样。",
            "检查视觉与排序，保留支持或推翻假设的数据，并说明测量限制。"
          ],
          "result": "一份包含假设、对照、结果和适用范围的优化报告。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "Draw Call 减少但帧率没有改善",
          "cause": "瓶颈可能在 GPU 像素工作或其他阶段。",
          "fix": "用帧时间定位主要限制，再选措施。"
        },
        {
          "symptom": "把 SRP Batcher 当成所有对象一次绘制",
          "cause": "混淆 CPU 状态处理优化与合并提交。",
          "fix": "结合官方说明与 Frame Debugger 检查实际路径。"
        }
      ],
      "exercise": {
        "brief": "选择一个渲染瓶颈，用两种相反方向的实验支持或推翻你的判断。",
        "deliverables": [
          "修改前的对照数据",
          "事件证据",
          "优化与回退说明"
        ],
        "rubric": [
          {
            "item": "瓶颈假设明确",
            "points": 25
          },
          {
            "item": "实验变量受控",
            "points": 25
          },
          {
            "item": "工具解释准确",
            "points": 25
          },
          {
            "item": "结论边界清楚",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "Draw Call很少能保证画面很快吗？",
          "options": [
            "能，它代表全部渲染成本",
            "不能，像素、Shader等工作仍可能很重",
            "能，只要没有动态灯光",
            "能，只要网格顶点数不多"
          ],
          "answer": 1,
          "explanation": "提交数量只反映一部分工作，不代表CPU/GPU的全部时间。"
        },
        {
          "question": "降低分辨率明显改善GPU时间，支持哪种假设？",
          "options": [
            "可能受像素相关工作限制",
            "必然是C#垃圾回收",
            "必然是所有网格顶点太多",
            "证明所有Draw Call都没有成本"
          ],
          "answer": 0,
          "explanation": "分辨率主要改变像素规模，是定位线索而非对所有原因的绝对证明。"
        },
        {
          "question": "Frame Debugger的核心用途是什么？",
          "options": [
            "解释绘制事件、目标与状态",
            "替代所有目标平台GPU计时",
            "自动找出并修复所有慢脚本",
            "用事件数量直接计算最终FPS"
          ],
          "answer": 0,
          "explanation": "它帮助解释画面如何生成，耗时仍需相应Profiler数据。"
        }
      ],
      "references": [
        {
          "label": "Frame Debugger",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/FrameDebugger.html"
        },
        {
          "label": "Profiler",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Profiling.Profiler.html"
        }
      ],
      "summary": [
        "Draw Call只解释部分成本，先看CPU、GPU和等待各占多少时间。",
        "用Frame Debugger解释绘制，再用相应工具测量耗时。"
      ],
      "teaching": {
        "question": "Draw Call已经减少，为什么游戏帧时间几乎没有变化？",
        "keyIdea": "减少提交工作只改善相应部分。如果主要成本来自像素、脚本或等待，批次减少不一定改变当前瓶颈，需要同时看时间分布。",
        "walkthrough": [
          {
            "title": "确认测量范围",
            "text": "固定设备、分辨率和场景，记录CPU、GPU与等待情况，检查是否被VSync或帧率上限限制。"
          },
          {
            "title": "检查改变的工作",
            "text": "用Frame Debugger确认批次确实减少，再查看CPU提交时间是否下降，而不是只比较一个总计数。"
          },
          {
            "title": "验证主要瓶颈",
            "text": "若GPU仍由大面积透明效果主导，可另做缩小覆盖面积的对照，观察时间是否变化并修正假设。"
          }
        ],
        "prediction": {
          "question": "Frame Debugger能直接替代目标设备上的准确GPU计时吗？",
          "answer": "不能。它主要解释绘制事件和状态，性能计时应使用相应分析工具与稳定目标环境。"
        }
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l054"
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
      "id": "l055",
      "title": "RenderTexture：离屏画面与资源寿命",
      "goals": [
        "创建并释放专属渲染目标",
        "解释相机目标与 UI 采样",
        "避免重复创建和共享资源误释放"
      ],
      "theory": [
        {
          "title": "先把画面写到纹理，再交给别人显示",
          "paragraphs": [
            "小地图、角色预览和监控画面都可以让Camera先渲染到RenderTexture。它不是普通导入PNG，而是运行中可作为渲染目标的纹理。之后RawImage或材质再读取它，形成“相机写入、界面读取”的关系。",
            "这条链的每一环都要单独验证。UI引用一张RenderTexture，只证明它拿到了纹理，不证明相机正在写内容。先查看相机是否启用、targetTexture是否正确、Culling Mask是否包含目标，再看消费者的纹理引用和显示区域，便能分清黑画面发生在哪一端。",
            "两个文件都叫Preview，也可能是两份不同目标。先将专用相机的targetTexture与RawImage.texture实际对象引用对照，而不是只看显示名；相机写A、界面读B时，两端各自配置看似完整，画面仍不会更新。测试时用鲜明清屏颜色和一个固定物体，可以先验证这条最短写读关系。"
          ]
        },
        {
          "title": "分辨率同时影响清晰度和成本",
          "paragraphs": [
            "宽256、高256的目标约有65536个像素，宽高都翻倍到512后，像素数变成262144，约为4倍。实际显存还与颜色格式、深度缓冲、多重采样和其他设置有关，不能只根据宽度判断全部占用。",
            "一个只显示在小角落的预览，未必需要主屏幕相同分辨率。先按界面最终尺寸选择，再比较模糊程度和GPU成本。目标相机还会执行它自己的渲染工作，即使纹理没有出现在当前屏幕，也不应自动假定完全免费。关闭不用的功能时，应同时考虑生产者是否还在工作。"
          ]
        },
        {
          "title": "创建、绑定、解除和释放要有顺序",
          "paragraphs": [
            "设脚本创建一份专用RenderTexture，将它赋给专用相机，再交给UI显示。这个脚本就需要负责结束使用：先解除仍指向它的消费者和相机关系，再释放对应资源并销毁自己创建的对象。不能仅清空字段，却让相机或界面继续持有旧引用。",
            "相反，如果纹理由外部系统创建，当前脚本只是借用，就不能在自己停用时随意Release。能显示一个资源不等于有权销毁它。示例要求专用相机起初没有其他targetTexture，检测到已有外部绑定就报告并退出，避免覆盖别人正在使用的目标。"
          ]
        },
        {
          "title": "别在每个Update里重建目标",
          "paragraphs": [
            "RenderTexture涉及GPU资源，不应为了保持显示每帧重新创建一份。通常在功能打开或需要改变尺寸时建立，保持复用；尺寸确实变化时，先按顺序结束旧目标，再创建新目标。重建频率应来自明确需求，而非因为画面每帧刷新就以为纹理也必须重建。",
            "反复开关预览是很有价值的寿命测试。记录纹理对象数量、内存与相机绑定，检查关闭后是否回到稳定状态。画面表面正常，也可能每次打开都泄漏一份旧资源，因此只看一次成功截图不足以证明创建与释放正确。"
          ]
        },
        {
          "title": "离屏内容与主画面要按需求隔离",
          "paragraphs": [
            "角色预览只想画一个角色，不希望把关卡、UI或其他相机再次收入目标，可以用专用Layer、相机Culling Mask和明确背景设置组织内容。若不小心把显示这张纹理的对象也纳入相机，可能形成不符合需求的反馈画面，应检查生产者能看见什么。",
            "消费者停用时要结束借用，创建者释放前也要让消费者知道资源已无效。测试更换场景、关闭界面、禁用相机与重新开启，确认双方都不会继续读写已结束的目标。最终说明谁创建、谁绑定、谁显示、谁释放，就能把“黑了或泄漏了”的故障定位到具体关系。"
          ]
        },
        {
          "title": "黑画面先用简单内容检验",
          "paragraphs": [
            "可以让离屏相机只看一个颜色鲜明的Cube，并使用明确清屏颜色。若目标纹理能看到它，生产者基本工作正常，再接回复杂角色；若纹理正常而UI黑，检查消费者材质、透明度和引用。每次只替换一端，能避免同时调整灯光、相机与界面后无法知道真正原因。"
          ]
        }
      ],
      "code": {
        "title": "拥有一份离屏纹理",
        "language": "csharp",
        "filename": "OwnedCameraTarget.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(Camera))]\npublic class OwnedCameraTarget : MonoBehaviour\n{\n    Camera source;\n    RenderTexture owned;\n    void OnEnable()\n    {\n        source = GetComponent<Camera>();\n        if (source.targetTexture != null) { Debug.LogError(\"Use a camera with no targetTexture assigned.\", this); return; }\n        owned = new RenderTexture(512, 512, 16);\n        owned.name = \"Learning Preview Target\";\n        owned.Create();\n        source.targetTexture = owned;\n    }\n    void OnDisable()\n    {\n        if (source && source.targetTexture == owned) source.targetTexture = null;\n        if (owned) { owned.Release(); Destroy(owned); owned = null; }\n    }\n}",
        "explanation": [
          "使用初始targetTexture为空的专用相机。若相机已有外部目标，示例会报告并返回，避免接管别人的绑定。",
          "脚本创建并负责自己的RenderTexture；对外部共享目标不能照搬释放行为，消费者也需在结束借用时解除引用。"
        ]
      },
      "lab": [
        {
          "title": "接通相机到界面",
          "minutes": 60,
          "steps": [
            "建立只看测试物体的专用相机，将目标纹理交给RawImage显示。",
            "分别故意断开相机目标、内容层与UI引用，定位每种黑画面的原因。",
            "比较256与512分辨率，记录清晰度和资源设置。"
          ],
          "result": "生产者、纹理和消费者三端都能独立验证。"
        },
        {
          "title": "检查反复开启与资源结束",
          "minutes": 60,
          "steps": [
            "首次打开时记录纹理实例与相机targetTexture；关闭RawImage但暂不关闭相机，在Frame Debugger或Profiler观察离屏相机是否仍提交工作。随后按功能关闭流程解除绑定并停止不用的生产者，再检查开关十次的资源数量。",
            "关闭时确认消费者与相机解除绑定，再检查创建者释放后的稳定内存。",
            "测试相机已有外部targetTexture的情况，确认示例拒绝覆盖它。"
          ],
          "result": "无外部绑定被误改，重复使用后资源数量不持续增长。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "预览第一次正常，重开黑屏",
          "cause": "消费者保留旧的已释放目标。",
          "fix": "在建立和结束时配对更新所有引用。"
        },
        {
          "symptom": "每帧显存或资源数量持续增长",
          "cause": "重复创建目标却没有正确释放。",
          "fix": "只在必要变化时重建，明确拥有者与清理顺序。"
        }
      ],
      "exercise": {
        "brief": "制作可重复打开的角色预览，附十次开关与场景切换验收。",
        "deliverables": [
          "相机写入、纹理与界面读取的关系图",
          "分辨率比较",
          "打开、关闭与切场景的资源检查表"
        ],
        "rubric": [
          {
            "item": "相机目标与界面引用连接正确",
            "points": 25
          },
          {
            "item": "资源创建者与释放者明确",
            "points": 25
          },
          {
            "item": "尺寸预算合理",
            "points": 25
          },
          {
            "item": "重复开关稳定",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "RenderTexture宽高都翻倍，基础像素数大约如何变化？",
          "options": [
            "2倍",
            "4倍",
            "不变，只增加显示尺寸",
            "8倍，与颜色格式无关"
          ],
          "answer": 1,
          "explanation": "像素数等于宽乘高，两维各翻倍得到4倍。"
        },
        {
          "question": "借用共享RenderTexture的脚本可以随意Release吗？",
          "options": [
            "可以，谁拿到引用谁都能结束使用",
            "不应该，先确认谁创建和负责释放",
            "可以，只要自己的UI已经隐藏",
            "可以，只要清空自己的字段"
          ],
          "answer": 1,
          "explanation": "借用者的结束不代表所有使用者都结束，释放责任需要明确。"
        },
        {
          "question": "UI指定纹理能证明相机已经写入内容吗？",
          "options": [
            "能，只要资源名正确",
            "不能，生产者与消费者需要分别验证",
            "能，只要纹理尺寸大于零",
            "能，只要RawImage处于激活状态"
          ],
          "answer": 1,
          "explanation": "引用存在与内容生成不同，应检查实际相机、目标和内容范围。"
        }
      ],
      "references": [
        {
          "label": "RenderTexture",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RenderTexture.html"
        },
        {
          "label": "Camera.targetTexture",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Camera-targetTexture.html"
        }
      ],
      "summary": [
        "相机先写纹理，界面再读取；两端都要独立检查。",
        "明确谁创建和释放，结束前解除绑定，反复开关检查资源增长。"
      ],
      "teaching": {
        "question": "RawImage已经指定RenderTexture，为什么预览仍是黑的？",
        "keyIdea": "纹理同时连接生产者和消费者。UI拿到纹理并不证明相机已写入，应分别检查相机内容和UI显示。",
        "walkthrough": [
          {
            "title": "验证相机写入",
            "text": "确认专用相机启用、targetTexture为目标纹理，并只让它看见一个颜色鲜明的测试物体。"
          },
          {
            "title": "验证界面读取",
            "text": "检查RawImage实际引用同一份纹理，显示区域、颜色和材质允许看见它，避免只凭相同名字判断。"
          },
          {
            "title": "再验证关闭流程",
            "text": "关闭功能后检查绑定已解除且只有创建者释放资源，重新打开多次确认画面正常、资源数量不持续增长。"
          }
        ],
        "prediction": {
          "question": "宽高同时从256改到512，基础像素数只是翻倍吗？",
          "answer": "不是，宽高各翻倍使像素数约变为4倍，实际资源成本还受格式、深度和采样设置影响。"
        }
      }
    }
  ]
});
