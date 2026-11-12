// 语境修订：题目背景、实验准备与学习用途。
window.COURSE_MODULES.push({
  "id": "m09",
  "number": 9,
  "title": "素材、导入与资源身份",
  "subtitle": "追踪图片和模型怎样成为项目资源",
  "description": "用实际尺寸、切片和引用关系理解导入设置、Sprite、Prefab与资源依赖，让别人也能重复得到相同结果。",
  "accent": "#8b6e4d",
  "lessons": [
    {
      "hours": 5,
      "prerequisites": [
        "l040"
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
      "id": "l041",
      "title": "纹理与 Sprite：像素怎样成为世界单位",
      "goals": [
        "解释 PPU、过滤与压缩的不同职责",
        "配置像素画导入",
        "用显示尺寸反推导入错误"
      ],
      "theory": [
        {
          "title": "同一张PNG为什么能得到不同画面",
          "paragraphs": [
            "将一张PNG复制到 Assets 后，Unity 不会只把文件原封不动交给显卡。导入器会按照平台、纹理类型、最大尺寸、压缩等设置生成引擎可用的数据。磁盘上的源文件与运行时使用的纹理因此是两个层次，同一个源文件换一组设置，也可能得到不同清晰度和内存占用。",
            "例如一张大图被 Max Size 缩小后，放大显示会丢失细节；改变过滤则影响采样时怎样混合相邻像素。遇到图片模糊，应先确认实际导入尺寸和过滤配置，而不是反复导出相同PNG。导入设置属于资源的一部分，需要与源文件一起保存。"
          ]
        },
        {
          "title": "PPU把图片像素换算成世界尺寸",
          "paragraphs": [
            "一张Sprite切片的矩形宽64像素，Pixels Per Unit设为32，未额外缩放时按矩形换算的宽度是64 ÷ 32 = 2个世界单位。这里的64来自该切片的像素矩形，不一定是整张PNG的宽度：一张512像素宽的图集可以切出多个64像素帧。PPU改为64时，同一帧换算为1个世界单位，源帧像素没有因此减少。",
            "接着还要乘Transform缩放：若前一个Sprite的X缩放为2，世界宽度约变成4单位。这能解释为什么两张图片像素尺寸相同，放到场景却大小不同。碰撞体和移动速度使用世界单位，因此团队应先约定像素与世界尺寸的关系，再制作角色、墙体和动画，避免每个对象靠不同缩放补救。"
          ]
        },
        {
          "title": "Point过滤不等于自动像素完美",
          "paragraphs": [
            "Point采样倾向于直接选取相邻纹素，常用于保留像素画的硬边；Bilinear会混合邻近采样，放大时更平滑。两者回答的是纹理怎样采样，不决定摄像机如何把世界投到屏幕。即使设为Point，世界像素落在屏幕上的比例和位置不稳定时，画面仍可能出现不均匀边缘或抖动。",
            "可以让摄像机不动，先用整数比例放大观察，再移动角色和相机，比较问题何时出现。需要严格像素对齐时，还要研究Pixel Perfect等相应设置。不能只根据“已选Point”就断言渲染链路正确，也不能把所有模糊都归给压缩。",
            "屏幕映射也能先算：若一个世界单位最终占32个屏幕像素，而PPU也是32，理想情况下一个源像素可对应一个屏幕像素；若一个世界单位占40个屏幕像素，每个源像素平均对应1.25个屏幕像素，就无法都用同样宽的整数屏幕格表示。Point仍只是选取采样值，不能替你消除这个比例不整除的问题。"
          ]
        },
        {
          "title": "透明边缘与内存需要分别测量",
          "paragraphs": [
            "PNG在磁盘上很小，可能只是文件压缩效果好，并不能证明运行时纹理也小。运行时大小与分辨率、格式、Mip Map和平台压缩有关；宽高都翻倍，基础像素数量约变为4倍。Read/Write等选项也可能保留额外数据，只有确有CPU读取需求时才应开启。",
            "角色透明边缘发黑或出现颜色渗漏时，要同时检查边缘像素、过滤、压缩与图集留边。先放在明暗两种背景上近看，再用目标平台格式比较。清晰度、边缘质量和内存是不同证据，不能靠一张Editor截图说明所有平台都合格。"
          ]
        },
        {
          "title": "建立一套可重复的素材标尺",
          "paragraphs": [
            "准备宽32、64和128像素的测试Sprite，给出统一PPU，在世界中放一条单位刻度线。使用脚本读取Sprite的像素矩形、PPU和bounds，再与场景尺寸核对。随后只改变PPU、缩放或导入尺寸中的一项，先预测再观察，便能分清每项设置的作用。",
            "正式素材应记录源图大小、目标世界尺寸、过滤、压缩和平台例外。若后来角色看起来忽大忽小，先比较这些记录及动画帧矩形，而不是随意改根缩放。稳定的导入规则让美术资源更容易复用，也使碰撞、速度和镜头的数值能在同一把世界标尺下解释。",
            "测试纹理质量时，应把源图与游戏截图分开放大。源图已经没有细节，修改导入设置无法把它恢复；源图清楚而游戏模糊，才继续查缩小、压缩与采样。再检查最终截图有没有被查看软件二次缩放，否则可能把图片查看器的插值误认为引擎输出。"
          ]
        }
      ],
      "code": {
        "title": "读取 Sprite 的实际尺度",
        "language": "csharp",
        "filename": "SpriteScaleProbe.cs",
        "source": "using UnityEngine;\n[RequireComponent(typeof(SpriteRenderer))]\npublic class SpriteScaleProbe : MonoBehaviour\n{\n    void Start()\n    {\n        var s = GetComponent<SpriteRenderer>().sprite;\n        if (!s) return;\n        Debug.Log($\"rect={s.rect.size}, ppu={s.pixelsPerUnit}, local bounds={s.bounds.size}\", this);\n    }\n}",
        "explanation": [
          "选择一个带SpriteRenderer的对象，读取其Sprite矩形、PPU与bounds，并用世界标尺对照。",
          "修改PPU后重新导入，观察世界尺寸变化；比较时保持Transform缩放不变。"
        ]
      },
      "lab": [
        {
          "title": "用标尺推导尺寸",
          "minutes": 60,
          "steps": [
            "准备矩形分别宽32、64、128像素的测试Sprite，统一PPU=32、Transform缩放=1；先预测世界矩形宽度为1、2、4，再与单位标尺核对。图集使用切片的rect.width，不用整张PNG宽度代算。",
            "先算世界宽度，再分别只改PPU或Transform缩放，记录实际尺寸。",
            "固定摄像机比较Point和Bilinear，再移动相机检查像素边缘。"
          ],
          "result": "能区分源像素、世界尺寸和屏幕采样的对照图。",
          "setup": [
            "在Project窗口的Assets下建EngineLabs/Textures，将32、64、128像素宽的测试PNG复制进去；没有素材时可先用一个已知切片宽度的Sprite，不把整张图集宽度当帧宽。",
            "选中PNG，在Inspector的Texture Type选Sprite (2D and UI)，Sprite Mode先用Single，Pixels Per Unit设32，点Apply。将图片拖入Hierarchy生成SpriteRenderer对象，Transform缩放设(1,1,1)。",
            "保存SpriteScaleProbe.cs到Assets/EngineLabs，选该对象用Inspector > Add Component添加；Window > General > Console看rect、ppu和local bounds日志。世界标尺可用相邻X坐标相差1的两个空对象。"
          ],
          "purpose": "亲手把像素数换成世界尺寸，再只改一项，避免靠根缩放补所有导入错误。"
        },
        {
          "title": "同时比较画质与占用",
          "minutes": 60,
          "steps": [
            "在亮暗背景上检查透明边缘，分别只改变过滤或压缩。",
            "比较不同Max Size和目标平台格式下的清晰度与纹理占用。",
            "说明磁盘文件大小为什么不能代表运行时内存，并保存推荐设置。"
          ],
          "result": "含目标格式、边缘样本和内存数据的导入说明。",
          "setup": [
            "用File > Save As另存L041_Quality，保留同一Sprite和静止Camera；背景用Camera的Background颜色或两块明暗Sprite，保持观察距离相同。",
            "选PNG，在Inspector记录Max Size、Filter Mode、Compression以及平台覆盖；每轮只改其中一项并Apply。Project资源预览可看导入尺寸，Window > Analysis > Profiler用于运行内存观察。",
            "只对照相同平台和格式的数据；若尚无目标设备，把结果写成Editor中的导入对照，不声称已经通过全部手机平台。"
          ],
          "purpose": "把画质、透明边缘与运行内存分别取证，避免拿小PNG文件误判显存成本。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "同尺寸原图进入场景大小不同",
          "cause": "PPU 或对象缩放不一致。",
          "fix": "比较源像素、PPU 和 lossyScale，建立统一标尺。"
        },
        {
          "symptom": "编辑器清楚，设备模糊",
          "cause": "目标平台覆盖降低尺寸或使用有损格式。",
          "fix": "检查实际平台导入预览，逐项比较压缩与最大尺寸。"
        }
      ],
      "exercise": {
        "brief": "为 Tiny Swords 制作一份有证据的像素导入规范。",
        "deliverables": [
          "标尺场景",
          "三种 PPU 对比",
          "平台质量表"
        ],
        "rubric": [
          {
            "item": "尺度推导正确",
            "points": 25
          },
          {
            "item": "过滤比较受控",
            "points": 25
          },
          {
            "item": "平台格式记录",
            "points": 25
          },
          {
            "item": "规范可执行",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "64像素宽、PPU为32、X缩放为1，世界宽度是多少？",
          "options": [
            "2个世界单位",
            "32个世界单位",
            "0.5个世界单位",
            "64个世界单位"
          ],
          "answer": 0,
          "explanation": "用像素宽度除以PPU，得到64 ÷ 32 = 2。",
          "scenario": "Sprite切片矩形宽64像素，Pixels Per Unit为32，Transform的X缩放为1；按完整矩形估算世界宽度，不考虑父级额外缩放。"
        },
        {
          "question": "PNG文件很小，能证明运行时纹理占用很小吗？",
          "options": [
            "能，显卡直接使用PNG压缩文件",
            "不能，运行时格式和分辨率等因素另行决定占用",
            "能，只要图片有透明通道",
            "能，只要PPU足够大"
          ],
          "answer": 1,
          "explanation": "源文件压缩与运行时纹理格式是不同层次，应查看导入结果和实际占用。",
          "scenario": "一张PNG在磁盘上仅几十KB；尚未知道实际导入分辨率、纹理格式、Mip Map或平台压缩设置。"
        },
        {
          "question": "Point过滤能保证所有分辨率下像素完美吗？",
          "options": [
            "能，它会自动对齐摄像机",
            "不能，屏幕映射和相机等条件仍需检查",
            "能，它会自动取消所有Transform缩放",
            "能，只要不使用Mip Map"
          ],
          "answer": 1,
          "explanation": "Point改变采样方式，不自动保证世界像素与屏幕像素的比例和位置。",
          "scenario": "一张像素Sprite设为Point过滤，但相机和对象可能在非整数屏幕像素位置，窗口分辨率也会变化。"
        }
      ],
      "references": [
        {
          "label": "TextureImporter",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/TextureImporter.html"
        },
        {
          "label": "Sprite",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Sprite.html"
        }
      ],
      "summary": [
        "用像素数、PPU和缩放推导世界尺寸，再检查屏幕采样。",
        "磁盘PNG大小不能直接代表运行时纹理内存。"
      ],
      "teaching": {
        "question": "64像素宽的角色，PPU为32、X缩放为1，应该有多宽？",
        "keyIdea": "PPU表示每个世界单位容纳多少源像素。先用像素数除以PPU，再考虑对象缩放，就能从资源设置推导世界尺寸。",
        "walkthrough": [
          {
            "title": "读取源数据",
            "text": "在Sprite导入设置确认宽64像素、PPU为32，并将对象的X缩放恢复为1，排除额外缩放影响。"
          },
          {
            "title": "计算世界宽度",
            "text": "64 ÷ 32 = 2，因此这个Sprite在未额外缩放时宽2个世界单位，可用场景标尺验证。"
          },
          {
            "title": "只改变PPU",
            "text": "将PPU改为64并重新导入，源图仍宽64像素，但世界宽度变成1；这不是删掉了一半像素。"
          }
        ],
        "prediction": {
          "question": "将Point过滤打开，能保证任何分辨率下每个像素都均匀清晰吗？",
          "answer": "不能。过滤只控制纹理采样，屏幕映射还受相机、位置、缩放比例和输出分辨率影响。",
          "scenario": "Sprite切片像素矩形宽64，PPU=32，Transform缩放1；你只把Filter Mode改为Point，未限定相机位置、输出分辨率或屏幕缩放比例。"
        },
        "scenario": "同一张骑士PNG，拖进场景后有时像巨人，有时又小得看不清；把Filter Mode设为Point仍然可能抖动。先拿一张64像素宽的Sprite，以PPU=32、缩放1建立一把世界标尺。",
        "purpose": "导入时能分别调整源像素、世界尺寸与屏幕映射，知道图片模糊该从哪一项开始查。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l041"
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
      "id": "l042",
      "title": "切片、轴心与稳定的子资源身份",
      "goals": [
        "按网格切出稳定动画帧",
        "解释轴心引起的抖动",
        "理解 GUID 与子资源引用"
      ],
      "theory": [
        {
          "title": "一张图集里有多个可引用的帧",
          "paragraphs": [
            "Tiny Swords的一张角色图片可能包含多行动作，每个动作又有多个帧。Texture是整张纹理，Sprite是其中一块矩形及其轴心等信息。设置Sprite Mode为Multiple并切片后，Project中展开图片，就能看到独立Sprite子资源；动画通常引用这些子帧。",
            "如果把整张纹理或错误行拖进时间轴，Unity不会根据文件名猜出你想要Idle。先核对每格宽高、行列位置和透明留白，再选择切片方法。规则网格适合已知格尺寸的图集，自动切片则依据图像内容分析，结果未必保留你需要的统一帧框。"
          ]
        },
        {
          "title": "为什么根位置不动，脚底仍在跳",
          "paragraphs": [
            "设每帧矩形都是192像素高，脚底到矩形底边的距离一致，Pivot也一致，切换Sprite时脚底就更容易保持稳定。若自动切片把每帧透明边裁得不同，再使用各自中心为Pivot，角色的参考点便会随矩形变化，看起来像上下跳动。",
            "Pivot是Sprite相对Transform放置时的参考点，不是碰撞体自动接地的保证。先在Sprite Editor中比较每帧矩形和轴心，再回到场景切帧观察。修复前不要用逐帧移动根对象补偿，因为那会把导入问题变成动画位置曲线，后续物理控制更难解释。",
            "Pivot 的归一化比例相同，也要配合帧框比较。设第一帧高192像素、脚底距底边16像素，要把参考点放在脚底，纵向比例约为16÷192=0.0833；若另一帧被裁成高160、脚底距底边仍16，所需比例变为0.1。给两帧都填0.0833并不保证脚底重合。固定网格减少了这类帧框变化，再统一对应的脚底参考点才有依据。"
          ]
        },
        {
          "title": "资源身份不是文件名",
          "paragraphs": [
            "Assets中两处路径都叫Idle.png，它们仍可能是两个独立资源。Unity通过meta中的标识以及子资源的相应标识来维护引用，名称主要帮助人查找。删除meta再让Unity重新生成，可能让原来场景和动画所保存的引用失去对应对象。",
            "因此移动或重命名资源时，优先在Unity里操作，并将源文件和meta一起纳入版本管理。团队复制素材时也要明确是新增一份资源，还是移动已有资源。仅仅把新文件改成旧名字，并不保证所有已有引用会自动指向它。"
          ]
        },
        {
          "title": "重新切片前先看谁在引用",
          "paragraphs": [
            "假设Idle.anim引用了八个Sprite子帧。你删掉全部切片后重新自动生成，外观看上去一样，但子资源身份可能已经改变，动画关键帧便可能丢失或错指。修改切片时要先确认依赖范围，并在完成后逐帧核对现有动画。",
            "追查时从场景实际使用的SpriteRenderer和Animator开始，找到实际Controller、Clip，再看关键帧中的Sprite。不要先打开某个名字像Idle的文件就认定找对了。路径、Inspector引用和时间轴对象引用共同构成证据，能够分清重复素材、错误帧与空引用。"
          ]
        },
        {
          "title": "用一个八帧Idle验证切片规范",
          "paragraphs": [
            "先复制测试图到专用实验目录，避免破坏正式资源。按固定网格切出八帧，统一Pivot，逐帧切换并观察脚底。再在另一份独立素材上做自动切片，比较矩形边界与轴心，说明哪一种更适合这张图，而不是给自动切片贴上总是好或坏的标签。",
            "建立Clip后保存场景，重启编辑器或重新导入再验证引用。将每格尺寸、PPU、Pivot、切片顺序和已有依赖写入说明。以后调整美术时，先判断哪些设置可以保持身份，哪些修改需要回归测试，就能减少“图片没有变但动画突然坏了”的意外。",
            "切片顺序同样需要检查。按名称排序得到的帧序不一定就是角色动作的时间顺序，例如未统一补零的编号可能出现意外排列。将八帧逐一拖入时间轴并播放慢速预览，再对照原图的行列，确认开始帧、结束帧和循环接点，而不是只凭选中了八张图就认为动作已经正确。"
          ]
        }
      ],
      "lab": [
        {
          "title": "比较固定网格与自动切片",
          "minutes": 60,
          "steps": [
            "将图集放进实验目录，确认格尺寸和行列，再用网格切出八帧。",
            "对独立副本自动切片，逐帧记录矩形高度、脚底距底边的像素数与Pivot。用“脚底距底边÷帧高”核对所需纵向参考比例，再在固定根坐标下切帧，而不是只比较Pivot数字是否相同。",
            "记录适合该素材的切片方式，统一PPU和轴心。"
          ],
          "result": "能够解释脚底稳定性与帧框、Pivot之间的关系。",
          "setup": [
            "先把图集复制到Assets/EngineLabs/Slicing，避免直接改正式Tiny Swords资源。选PNG，Inspector设Texture Type=Sprite (2D and UI)、Sprite Mode=Multiple并Apply。",
            "在同一Inspector点Sprite Editor；若提示未安装2D Sprite，从Window > Package Management > Package Manager安装兼容2D Sprite包后再打开。",
            "Sprite Editor中点Slice，按源图确认的Cell Size设置Grid By Cell Size；本课不替所有Tiny Swords文件假定192格。记录实际宽高和目标动作所在行，切出八帧后Apply。",
            "把一个子帧拖进Scene，再逐个把SpriteRenderer的Sprite字段换成其余帧；保持Transform不动，在脚底放一个固定参照Sprite或Scene标尺。"
          ],
          "purpose": "看到帧框和Pivot怎样共同决定脚底，而非只记一个统一的轴心数字。"
        },
        {
          "title": "从场景追踪到子帧",
          "minutes": 60,
          "steps": [
            "选中第一组的场景Sprite，点击Inspector中SpriteRenderer > Sprite字段的资源，沿Project中的选中位置展开原PNG，记下正在引用的子帧名称和资源路径。",
            "在另一个实验目录复制PNG并等导入，保留各自meta。先不改Sprite字段，确认场景仍指向原资源；再手动拖入副本的一帧，重新点击字段追踪，比较这次真正发生的引用更换。",
            "在副本中用Sprite Editor调整一个子帧的矩形或Pivot并Apply，观察场景使用该子帧时的外观和脚底位置；保留原图对照并恢复副本。已有动画者可再追踪Controller到Clip的Sprite轨道，此项在第46课后补做。"
          ],
          "result": "一条从场景SpriteRenderer到实际PNG子帧的引用记录，包含路径、子帧名称及切换前后的证据。",
          "setup": [
            "先完成本课第一组八帧切片，把其中一帧拖进Scene，保存为L042_References；必做部分只用SpriteRenderer，不要求已经会制作AnimationClip。",
            "在Project中复制PNG到Assets/EngineLabs/SlicingCopy，等Unity导入。可让两份都叫Idle.png，但必须在不同目录；保留两份各自meta，不在文件管理器覆盖原meta。",
            "选Hierarchy中的场景Sprite，在Inspector找到SpriteRenderer > Sprite。单击该字段中的资源可在Project定位；必要时展开原PNG查看子帧，避免只凭显示名称判断。调整副本时打开其Sprite Editor，Apply后再检查实际字段指向哪一份。"
          ],
          "purpose": "沿真实使用链追到子资源，理解同名新图为什么不会自动修好旧引用。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "Idle 像踩着弹簧",
          "cause": "帧画布或轴心不统一，也可能是美术自身起伏。",
          "fix": "固定根位置，用脚底标尺逐帧比较矩形和 Pivot。"
        },
        {
          "symptom": "改好图片仍没有变化",
          "cause": "修改的是另一个拥有独立身份的副本。",
          "fix": "从当前 SpriteRenderer 或动画关键帧定位实际资源。"
        }
      ],
      "exercise": {
        "brief": "给八帧 Idle 建立可长期维护的切片与引用记录。",
        "deliverables": [
          "八帧切片截图",
          "轴心标准",
          "引用链与副本说明"
        ],
        "rubric": [
          {
            "item": "帧矩形正确",
            "points": 25
          },
          {
            "item": "轴心一致可解释",
            "points": 25
          },
          {
            "item": "资源身份准确",
            "points": 25
          },
          {
            "item": "引用验证完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "两个目录中的PNG都叫Idle，它们必然是同一资源吗？",
          "options": [
            "是，Unity只按名称保存引用",
            "不一定，它们可以有独立身份",
            "是，只要像素内容相同",
            "是，只要PPU相同"
          ],
          "answer": 1,
          "explanation": "路径与名称方便查找，实际引用由资源及子资源身份维持。",
          "scenario": "Assets/Art/Idle.png与Assets/Test/Idle.png是分别导入的两个文件，文件名相同，但各有自己的meta。"
        },
        {
          "question": "根Transform不动但脚底逐帧跳动，应优先检查什么？",
          "options": [
            "提高FixedUpdate频率",
            "每帧矩形和Pivot是否一致",
            "增加Rigidbody2D质量",
            "把所有帧改成同一名称"
          ],
          "answer": 1,
          "explanation": "图像相对Transform的位置由帧框和参考点决定，先排除导入数据问题。",
          "scenario": "SpriteRenderer所在根的Transform位置保持不变；八帧播放时，脚底相对地板上下跳，尚未核对各帧矩形和Pivot。"
        },
        {
          "question": "制作Sprite逐帧动画时，关键帧应引用什么？",
          "options": [
            "整张图集文件名的字符串",
            "所需的Sprite子帧",
            "任意材质资源",
            "Sprite Editor窗口本身"
          ],
          "answer": 1,
          "explanation": "对象引用轨道保存实际Sprite引用，不会从纹理名称自动选择动作行。",
          "scenario": "一张图集已经切出八个Sprite子帧，正在为SpriteRenderer.sprite建立逐帧AnimationClip。"
        }
      ],
      "references": [
        {
          "label": "Sprite",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Sprite.html"
        },
        {
          "label": "AssetImporter",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetImporter.html"
        }
      ],
      "summary": [
        "帧矩形与Pivot决定每张图片如何相对Transform放置。",
        "沿实际引用定位Sprite子帧，同名文件不代表同一资源。"
      ],
      "teaching": {
        "question": "Idle八帧都有内容，为什么播放时脚底上下跳，Transform却没有变化？",
        "keyIdea": "Transform放置的是Sprite参考点。每帧裁切范围或Pivot不同，即使根坐标不变，画出来的脚底位置也可能改变。",
        "walkthrough": [
          {
            "title": "固定观察对象",
            "text": "关闭根位置动画，让同一个SpriteRenderer逐帧切换，记录脚底相对场景标尺的位置。"
          },
          {
            "title": "检查帧框和轴心",
            "text": "在Sprite Editor比较八帧矩形高度、透明边距和Pivot，判断参考点是否一致。"
          },
          {
            "title": "统一后重新验证",
            "text": "在测试副本用固定网格与一致Pivot切片，再切换同样八帧，观察脚底是否稳定并检查引用。"
          }
        ],
        "prediction": {
          "question": "把另一目录的新PNG也命名为Idle，会自动接替旧动画中的全部Sprite引用吗？",
          "answer": "不会。资源和子资源有独立身份，引用不是只按文件名查找；要核对实际对象引用。",
          "scenario": "旧Idle.anim已经引用原图集的八个Sprite子资源。你在另一个目录导入一张新PNG，也命名为Idle，但没有手动替换动画关键帧引用。"
        },
        "scenario": "Idle有八张图，每张单看都对，连起来脚底却上下跳；重切一次又让旧动画引用丢了。本课使用一张含八帧的图集，先检查每格矩形和脚底参考点，再看资源如何被动画保存引用。",
        "purpose": "能稳定切出角色帧，并在修改素材后核对已有动画，不再用移动身体来掩盖轴心问题。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l042"
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
      "id": "l043",
      "title": "Prefab、实例与覆盖的传播规则",
      "goals": [
        "区分资产、实例和覆盖",
        "预测 Apply 与 Revert 的影响范围",
        "给角色建立稳定的复用边界"
      ],
      "theory": [
        {
          "title": "从一个角色到可复用的角色结构",
          "paragraphs": [
            "场景里做好的角色包含根对象、碰撞体、Visual子对象和脚本。将它做成Prefab后，这套对象结构及其可序列化配置就有了可复用来源。场景中的实例保留与来源的关联，因此以后调整源Prefab，可以把适用的默认修改传播到多个实例。",
            "它不是只复制一张图片，也不是创建一个会自动寻找所有场景依赖的万能角色。脚本需要的字段仍要正确配置。开始时先在一个干净场景拖入Prefab，检查不依赖旧场景中的偶然对象也能按预期出现，再考虑变体和嵌套。"
          ]
        },
        {
          "title": "覆盖表示这个实例有意不同",
          "paragraphs": [
            "设源Prefab的speed为5，场景有实例A和B。A没有修改，B在Inspector改为7，B就对这个属性有了覆盖。此时源speed从5改为6，A通常跟随变成6，B仍保留7；这是实例有意不同，而不是Prefab更新失效。",
            "覆盖可以涉及属性以及允许的对象、组件等结构差异，实际支持范围以对应操作为准。查看Overrides面板时，先确认改的是哪个实例、哪个来源和哪个字段，再决定保留、Apply还是Revert。外观相同不能证明引用相同，Play中的临时值也要与已保存配置区分。"
          ]
        },
        {
          "title": "Apply和Revert分别让谁跟随谁",
          "paragraphs": [
            "对B的speed覆盖执行Apply，相当于将所选差异写回相应源，可能影响其他依赖这个源的实例。Revert则放弃实例的所选覆盖，让它重新采用来源值。这是相反方向的操作，不能都理解成“同步一下”。",
            "例如B仅为了某一场战斗变快，却把全部覆盖Apply，可能把临时改动写成全项目默认值。审阅时应选择必要差异，并先看来源层级。Prefab Mode、场景实例和变体各处的修改范围不同，操作前要能够回答这次究竟修改哪个资源。",
            "两种方向应从同一份初始状态分别试。源为6、A无覆盖、B覆盖7时，对B执行Revert，结果是源6、A6、B6；重新建立B=7的覆盖后，再只Apply这个字段，源改成7，A也跟随7。不要在已经Revert、差异消失后立即寻找同一个字段的Apply，那时已没有这项覆盖可应用。"
          ]
        },
        {
          "title": "变体与嵌套让依赖逐层增加",
          "paragraphs": [
            "如果普通敌人与精英敌人结构相同，仅数值和外观不同，可以考虑让精英成为基础敌人的变体。基础来源负责共用结构，变体保存差异，场景实例还可以有自己的覆盖。某个属性最终来自哪一层，就取决于这些层有没有各自覆盖。",
            "嵌套则让一个Prefab包含另一个Prefab实例，适合复用武器或界面部件。依赖越深，修改影响也越需要追踪。不要为了减少重复而制造难以判断来源的长链，也不要随意Unpack来掩盖不理解的覆盖；应先明确哪些内容需要共同变化。"
          ]
        },
        {
          "title": "复用还要求清楚的场景接线",
          "paragraphs": [
            "通用角色可能需要当前场景相机或出生点，但源Prefab不能凭空可靠地依赖旧场景里的某个具体对象。可由场景装配脚本、生成代码或明确注册过程提供这些引用，同时在缺失时给出可理解的检查结果。",
            "验证时把Prefab放进全新场景，关闭原有管理对象，再检查缺失引用、默认Layer、碰撞形状和Animator。记录基础、变体、实例各层的speed，再修改来源验证预测。只有默认值、覆盖和场景依赖都能说明，复制角色才是稳定复用，而不是复制一份暂时还能工作的旧场景。",
            "还要分清修改发生在编辑状态还是播放状态。播放中改一个实例字段，可能只是为了即时试验，退出后不一定留下同样配置。测试传播时先退出播放，在明确的资源或实例位置修改并保存，再重新进入。这样不会把临时运行值误写成对Prefab规则的判断。"
          ]
        }
      ],
      "code": {
        "title": "用字段观察实例覆盖",
        "language": "csharp",
        "filename": "PrefabSettingsProbe.cs",
        "source": "using UnityEngine;\npublic class PrefabSettingsProbe : MonoBehaviour\n{\n    [SerializeField] float speed = 5;\n    [SerializeField] Transform optionalTarget;\n    void Start()\n    {\n        Debug.Log($\"{name}: speed={speed}, target={optionalTarget}\", this);\n    }\n}",
        "explanation": [
          "将带示例字段的对象制作成Prefab，再在场景中创建两个实例，比较Inspector值与Overrides。",
          "脚本中的默认字段值不代表所有已保存实例都会自动重置。以序列化数据和实际覆盖来源为准。"
        ]
      },
      "lab": [
        {
          "title": "预测来源修改的传播",
          "minutes": 60,
          "steps": [
            "创建speed为5的Prefab实例A与B，只将B改为7。",
            "将来源改成6，先写出A与B的预测值，再检查实际结果。",
            "先对B的speed执行Revert，核对源6、A6、B6；随后重新把B设为7，再只Apply speed，核对来源和A的传播。每轮注明重建了哪项覆盖，不在覆盖已被撤销后继续假设它还存在。"
          ],
          "result": "每次操作都有修改前后数值和来源说明。",
          "setup": [
            "新建场景L043_Prefab。GameObject > Create Empty建Knight，保存PrefabSettingsProbe.cs到Assets/EngineLabs并用Knight的Inspector > Add Component添加；Speed=5。",
            "在Project建Assets/EngineLabs/Prefabs，将Hierarchy里的Knight拖到该目录生成Prefab；从Project拖两次到场景，分别命名KnightA、KnightB。只选KnightB把Speed改为7。",
            "在Hierarchy选中实例，Inspector顶部Overrides查看差异；双击Project中的Prefab进入Prefab Mode修改来源。全组在退出Play后操作，避免运行临时值混入判断。"
          ],
          "purpose": "通过来源、默认实例和覆盖实例的三列数值，验证Apply与Revert各修改谁。"
        },
        {
          "title": "在干净场景验证复用",
          "minutes": 60,
          "steps": [
            "建立基础Prefab与一个变体，列出共用内容和明确差异。",
            "拖入全新场景，核对Layer、碰撞、动画及外部引用。",
            "通过明确场景装配提供相机等依赖，验证缺失时能被发现。"
          ],
          "result": "不依赖旧场景偶然状态的复用样本。",
          "setup": [
            "从原Prefab开始，在Project对它创建Prefab Variant并命名EliteKnight；用Inspector记录基础、变体与场景实例的Speed分别来自哪一层。",
            "File > New Scene创建独立空场景，保存L043_Clean，再从Project拖入基础和变体。Optional Target先留空，确认代码报告的是缺失配置而非自动寻找旧场景对象。",
            "若练习要提供场景相机，先在新场景创建Camera，再只在场景实例的Optional Target字段拖入它。说明这是本场景装配，不把来源Prefab写成依赖旧场景的具体对象。"
          ],
          "purpose": "让角色离开原场景仍能使用，暴露复制时容易遗漏的相机或出生点依赖。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "修改 Prefab 后某实例不更新",
          "cause": "实例具有相应属性覆盖。",
          "fix": "查看 Overrides，明确保留还是回退单项。"
        },
        {
          "symptom": "新场景角色找不到摄像机",
          "cause": "通用资产隐含依赖旧场景对象。",
          "fix": "通过场景组装设置引用，或声明可用的查找与失败策略。"
        }
      ],
      "exercise": {
        "brief": "建立基础骑士 Prefab 和颜色变体，保留一份可解释的实例覆盖。",
        "deliverables": [
          "基础与变体资产",
          "覆盖传播表",
          "空场景验证"
        ],
        "rubric": [
          {
            "item": "资产实例概念准确",
            "points": 25
          },
          {
            "item": "覆盖预测正确",
            "points": 25
          },
          {
            "item": "变体边界合理",
            "points": 25
          },
          {
            "item": "依赖声明完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "实例speed覆盖为7，来源由5改成6，通常先预期什么？",
          "options": [
            "覆盖自动消失，实例变6",
            "实例保留覆盖7",
            "实例恢复脚本声明时的5",
            "实例取两者平均值"
          ],
          "answer": 1,
          "explanation": "覆盖代表实例对相应属性的明确差异，来源变化不会无条件抹去它。",
          "scenario": "Knight.prefab的speed原为5；场景实例KnightA未改字段，KnightB在Inspector覆盖为7。现在来源speed改为6并保存。"
        },
        {
          "question": "Apply所选覆盖的核心含义是什么？",
          "options": [
            "将实例的所选差异写回相应来源",
            "只把来源值下载到实例",
            "只修改运行时内存，不影响资源",
            "清除全部Prefab关联"
          ],
          "answer": 0,
          "explanation": "Apply会向来源传播修改，执行前要检查具体来源和影响范围。",
          "scenario": "场景实例KnightB有一个speed覆盖，你在Overrides面板选择该字段执行Apply；问题问这次操作写入哪一方向。"
        },
        {
          "question": "通用角色需要当前场景相机时，较合理的做法是什么？",
          "options": [
            "让Prefab永久引用旧场景里的相机",
            "通过明确的场景装配等过程提供",
            "依赖所有场景恰好存在同名对象",
            "把相机字段隐藏就无需配置"
          ],
          "answer": 1,
          "explanation": "复用对象与场景依赖应有清楚的接线过程，并能检查缺失引用。",
          "scenario": "一份可复用角色Prefab要在多个场景使用，每个场景的相机对象都不同，Prefab资源本身不处在这些场景层级中。"
        }
      ],
      "references": [
        {
          "label": "PrefabUtility",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/PrefabUtility.html"
        },
        {
          "label": "Object.Instantiate",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.Instantiate.html"
        }
      ],
      "summary": [
        "先确定某个值来自源、变体还是实例覆盖，再预测修改传播。",
        "Apply写向来源，Revert放弃所选覆盖，操作前检查影响范围。"
      ],
      "teaching": {
        "question": "源Prefab的speed从5改成6，为什么有的实例仍然是7？",
        "keyIdea": "没有覆盖的实例采用来源值，有覆盖的实例保留自己明确修改的值。先判断某个值来自哪一层，才能正确预测修改传播。",
        "walkthrough": [
          {
            "title": "建立两个实例",
            "text": "源speed为5，实例KnightA保持默认，实例KnightB改成7；在Overrides面板确认只有KnightB有该字段覆盖。"
          },
          {
            "title": "修改来源",
            "text": "将源speed改为6并保存，再看场景：A跟随为6，B仍采用自己的覆盖7。"
          },
          {
            "title": "选择传播方向",
            "text": "对KnightB执行Revert会采用源值6；Apply则把所选差异写向来源，操作前检查会影响哪些实例。"
          }
        ],
        "prediction": {
          "question": "B只是某一场景里的高速敌人，应不加检查地Apply所有覆盖吗？",
          "answer": "不应。那可能把场景专用差异写成来源默认值；应选择保留实例覆盖或建立合适变体，并审查影响范围。",
          "scenario": "基础Prefab名Knight，speed原为5；实例KnightA未覆盖该字段，实例KnightB覆盖为7，来源后来改为6。B只需要在当前战斗场景里更快。"
        },
        "scenario": "你把骑士做成Prefab，源speed从5改到6，场景里一名骑士却仍然是7。实验里把两个实例明确命名为KnightA和KnightB：A保持来源值，B有自己的speed覆盖。",
        "purpose": "修改前能预测哪些角色会变，知道一次Apply会把场景差异写向哪份来源。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l043"
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
      "id": "l044",
      "title": "模型、材质与导入后的依赖关系",
      "goals": [
        "区分模型网格与材质",
        "解释粉色材质的管线问题",
        "检查模型比例、法线和依赖"
      ],
      "theory": [
        {
          "title": "一个模型文件不只产生一个网格",
          "paragraphs": [
            "将模型文件拖入Assets后，展开资源可能看到网格、材质、骨骼或动画等内容。源文件是一种容器，Unity导入后可能生成多个可引用资源。场景对象再引用这些结果，因此“模型已经在目录里”只说明源文件存在，还没有证明材质、动画和外部纹理都正确连接。",
            "排查时从场景中实际使用的MeshRenderer或SkinnedMeshRenderer开始，沿网格、材质、纹理与Shader逐项查看。不要先把所有文件再复制一遍；那会增加重复身份，反而使依赖关系更难判断。",
            "沿实际引用写出四个节点：角色Renderer→材质→Shader及其纹理槽→贴图。保留材质而清空一张颜色贴图，检验的是贴图输入缺失；保持贴图却改成当前管线不支持的Shader，检验的是绘制程序不匹配。这两次都可能让外观不对，却发生在不同节点，因此“贴图文件存在”不能单独证明材质链路完整。"
          ]
        },
        {
          "title": "尺寸和朝向从导入处开始核对",
          "paragraphs": [
            "假设建模软件里角色高2米，导入后却高200个世界单位。若每个场景都把Transform缩成0.01，虽然一时看着正确，动画根位移、碰撞和子对象接线仍可能变得难以统一。先核对源单位、导入比例和项目世界尺度，再决定在哪一层修正。",
            "朝向也类似：模型的前轴、上轴与项目约定不同，会让脚本的forward看起来不朝脸的方向。可在受控层级中让Visual承担美术修正，但物理根与运动方向要保持明确约定。记录一根方向箭头和一个单位标尺，比只说“旋转看起来差不多”更便于协作。"
          ]
        },
        {
          "title": "光照异常不一定是灯太暗",
          "paragraphs": [
            "网格法线描述表面朝向，是光照计算的重要输入。法线或切线不合适时，模型可能出现不自然明暗；此时不断增加灯光强度会把症状放大，而不是解释原因。先用简单材质和固定光源比较导入法线与重新计算的结果，并按模型用途决定设置。",
            "材质还必须使用当前渲染管线支持的Shader。项目从Built-in切到URP后，旧材质可能不兼容，粉色外观应优先检查Shader与管线，而非默认认为纹理丢了。真正缺图则要沿材质槽位查看实际纹理引用，两类故障需要不同证据。"
          ]
        },
        {
          "title": "依赖列表不是内存快照",
          "paragraphs": [
            "一个场景引用角色Prefab，Prefab引用模型和材质，材质再引用贴图，这是一条资源依赖链。AssetDatabase可以在编辑器中列出相关资产，帮助查出漏交付的文件或意外引用，但它报告的是编辑器资源依赖，不等于此刻玩家内存里驻留了哪些对象。",
            "运行内存还受加载方式、实例、缓存和引用释放等因素影响。不能因为依赖列表出现某贴图就断言它当前占用内存，也不能用列表文件总大小替代Profiler测量。工具脚本应放在Editor-only范围，避免将UnityEditor接口带进玩家构建。"
          ]
        },
        {
          "title": "用干净环境检查交付是否完整",
          "paragraphs": [
            "把模型、材质、纹理及相应meta作为一组检查，明确哪些是源文件，哪些是Unity导入生成的结果。若材质被提取成独立资产，提取后的引用也要检查；不要同时留下多份名称相近却来源不清的材质，靠手动换槽位维持表面正常。",
            "在干净场景用固定尺度、光源和相机验证外观，再检查动画与构建。若条件允许，在另一份干净检出中重新导入，能够暴露本机缓存或遗漏文件。最终记录应包含版本、管线、比例、法线策略和依赖来源，使别人可以从源文件重复得到相同资源，而不是只能复制你当前的Library。",
            "若某个贴图在本机正常而干净检出丢失，要检查它是否实际位于项目外或根本没有提交。编辑器当前保存的引用与磁盘交付范围应对应。先记录材质槽里的资源路径，再检查该源文件及meta是否存在，比重新链接一份同名图片更容易保留原有身份。"
          ]
        }
      ],
      "code": {
        "title": "列出当前资产依赖",
        "language": "csharp",
        "filename": "Assets/Editor/DependencyReport.cs",
        "source": "using UnityEditor;\nusing UnityEngine;\npublic static class DependencyReport\n{\n    [MenuItem(\"Learning/Print Selected Dependencies\")]\n    static void Print()\n    {\n        string path = AssetDatabase.GetAssetPath(Selection.activeObject);\n        if (string.IsNullOrEmpty(path)) return;\n        foreach (string dependency in AssetDatabase.GetDependencies(path, true))\n            Debug.Log(dependency);\n    }\n}",
        "explanation": [
          "这是编辑器检查工具，放在Editor-only范围，在Project里选中目标资源后输出依赖。",
          "列表用于追踪资源关系和交付范围，不把它当作运行时内存驻留清单。"
        ]
      },
      "lab": [
        {
          "title": "核对尺度与表面方向",
          "minutes": 60,
          "steps": [
            "将模型与1单位标尺并排，记录源单位、导入比例和场景最终高度。",
            "加方向箭头检查前轴，再用固定光源检查法线与材质。",
            "每次只改导入比例、法线或材质中的一项，保存前后图。"
          ],
          "result": "能够解释尺寸、方向和光照异常的来源。",
          "setup": [
            "在Assets/EngineLabs/Models导入一个已知来源单位的模型；先记录文件格式和源高度。若暂时没有模型，可用Cube练习材质和依赖，源单位换算部分标记待模型补齐。",
            "创建测试场景，放一个Scale=(1,1,1)的Cube当一单位标尺；选模型资源在Inspector看Model导入页，记录Scale Factor、轴向及Normals，不先给每个实例随意补缩放。",
            "使用已有URP项目时，在Edit > Project Settings > Graphics检查当前Render Pipeline Asset；选Renderer实际材质，核对Shader。材质故障用专用副本，不改正式共享资源。"
          ],
          "purpose": "分别控制尺度、方向和表面着色，知道“看起来不对”具体发生在导入链哪个位置。"
        },
        {
          "title": "追踪材质与资源依赖",
          "minutes": 60,
          "steps": [
            "从实际Renderer选中材质，记录Shader名称及颜色纹理槽指向的资源路径。在实验材质副本中先只清空纹理槽再恢复，另一次只替换Shader，对照两类现象；不要修改正式共享材质。",
            "运行依赖工具，检查遗漏文件和重复材质，确认工具仅在编辑器使用。",
            "在干净场景或干净检出中重新导入，验证无需旧Library也能恢复外观。"
          ],
          "result": "含管线条件与完整来源的交付检查记录。",
          "setup": [
            "在Project的Assets下建Editor文件夹，将本课工具保存为Assets/Editor/DependencyReport.cs；它是菜单工具，不挂到GameObject。等Console没有编译错误。",
            "在Project点选模型或角色Prefab，再执行编辑器顶部Learning > Print Selected Dependencies；用Window > General > Console查看路径。若没选资源，工具可能没有有效路径。",
            "把实际源模型、材质、纹理和meta纳入测试副本；在File > New Scene的新场景重新引用。干净检出验证必须从源和设置生成，不复制原Library来绕过缺失文件。"
          ],
          "purpose": "从实际引用列出交付文件，区分编辑资源依赖和运行时驻留。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "模型变成粉色",
          "cause": "Shader 缺失、不兼容或编译失败。",
          "fix": "检查当前管线与 Console，使用兼容 Shader 并核对参数。"
        },
        {
          "symptom": "转到背面模型消失",
          "cause": "单面几何与剔除或法线方向。",
          "fix": "检查法线和负缩放，按设计修几何或选择适当材质。"
        }
      ],
      "exercise": {
        "brief": "给一个三维模型建立可复现的 URP 导入与交付说明。",
        "deliverables": [
          "尺寸法线表",
          "材质兼容说明",
          "依赖图与干净项目验证"
        ],
        "rubric": [
          {
            "item": "尺度验证准确",
            "points": 25
          },
          {
            "item": "材质诊断清楚",
            "points": 25
          },
          {
            "item": "依赖完整",
            "points": 25
          },
          {
            "item": "交付可复现",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "模型呈粉色时，首先应检查什么？",
          "options": [
            "材质Shader与当前渲染管线是否兼容、是否报错",
            "优先增加PNG压缩质量",
            "优先把所有模型缩放改为1",
            "优先将所有碰撞体删除"
          ],
          "answer": 0,
          "explanation": "先沿实际渲染引用检查Shader，再分别判断纹理等依赖，避免盲目复制资源。",
          "scenario": "项目使用URP，场景模型呈粉色；Renderer的材质来自另一个渲染管线，尚未检查Shader兼容性与Console错误。"
        },
        {
          "question": "编辑器依赖列表等于当前运行内存驻留吗？",
          "options": [
            "等于，所有依赖一直加载",
            "不等于，两者描述不同状态",
            "等于，只要递归列出所有依赖",
            "等于，只要把文件大小相加"
          ],
          "answer": 1,
          "explanation": "资产之间的依赖与运行时加载、释放及缓存状态不同。",
          "scenario": "编辑器调用AssetDatabase.GetDependencies得到贴图路径列表，但没有采集Player的内存快照。"
        },
        {
          "question": "使用AssetDatabase的工具应放在哪里？",
          "options": [
            "任意运行时程序集，构建会自动理解全部API",
            "Editor-only范围",
            "挂到所有角色上随玩家发布",
            "放进Resources便可运行于所有平台"
          ],
          "answer": 1,
          "explanation": "AssetDatabase属于UnityEditor工具，不是通用玩家加载接口。",
          "scenario": "一个C#工具使用UnityEditor.AssetDatabase列出资源依赖，仅准备在编辑器菜单中运行，不需要进入Player。"
        }
      ],
      "references": [
        {
          "label": "AssetDatabase.GetDependencies",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetDatabase.GetDependencies.html"
        },
        {
          "label": "ModelImporter",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ModelImporter.html"
        }
      ],
      "summary": [
        "分别检查网格、比例、法线、材质、Shader与贴图引用。",
        "依赖列表说明资源关系，运行内存驻留需要另外测量。"
      ],
      "teaching": {
        "question": "角色模型变成粉色，为什么不应先重新下载所有PNG？",
        "keyIdea": "最终画面依赖网格、材质、Shader和纹理的连接。粉色常提示Shader不兼容或出错，应先查当前材质与渲染管线。",
        "walkthrough": [
          {
            "title": "从实际对象出发",
            "text": "选中场景里粉色角色，查看Renderer正在引用的材质，不凭Project里相似名称猜测。"
          },
          {
            "title": "检查Shader与管线",
            "text": "确认项目使用URP还是其他管线，再看材质Shader是否支持它，记录错误信息与实际配置。"
          },
          {
            "title": "分别验证纹理",
            "text": "使用兼容的简单材质验证网格，再检查纹理槽位引用；把Shader故障和缺图故障分开处理。"
          }
        ],
        "prediction": {
          "question": "AssetDatabase列出的贴图依赖，等于运行时当前全部纹理内存吗？",
          "answer": "不等于。依赖是资产关系，驻留内存还取决于加载和引用状态，应使用相应运行时测量。",
          "scenario": "编辑器工具AssetDatabase.GetDependencies列出一个角色Prefab依赖的贴图。当前Player没有连接Profiler，也没有检查资源是否已加载或释放。"
        },
        "scenario": "模型已经导入，场景里的角色却一片粉色；再下载一遍贴图仍然没好。先从真实Renderer引用的材质查到Shader与纹理槽，不按文件名猜它正在使用哪份资源。",
        "purpose": "能把尺寸、管线不兼容和漏交付素材分开，给别人一份无需复制Library也能重建的资源说明。"
      }
    },
    {
      "hours": 5,
      "prerequisites": [
        "l044"
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
      "id": "l045",
      "title": "导入器、meta 与可重复的素材规范",
      "goals": [
        "解释导入设置如何保存",
        "安全地批量检查导入参数",
        "区分源资源与缓存"
      ],
      "theory": [
        {
          "title": "同一份素材为什么在别人机器上不同",
          "paragraphs": [
            "甲机器上的像素角色很清晰，乙机器导入后却模糊。若两人只交换PNG，没有交换meta和约定的导入规则，Unity就可能采用不同设置。可重复导入的意思是：给出相同源文件、设置和版本，另一份干净工程也能得到可解释的结果，而不是依赖某台机器的缓存。",
            "导入器负责把源文件转换为引擎数据。meta通常保存资源身份及相应导入信息，所以源文件与meta应一起管理。Library等缓存可以重新生成，不能把复制整份缓存当成长期保持一致的方法。先让源和规则齐全，再谈自动化。"
          ]
        },
        {
          "title": "先检查，再决定是否批量修改",
          "paragraphs": [
            "设项目规定某个像素角色目录使用Point、固定PPU与适当压缩。第一版工具应只读地扫描这个目录，报告当前值与规则差异。这样既能确认范围选对，也能发现UI图标或特殊贴图并不适用同一设置。",
            "如果工具一开始就重写整个Assets，可能覆盖手工设置并触发大量重新导入。更稳妥的过程是先检查、审阅差异、确认例外，再对限定范围执行修改。自动化的价值来自一致且可追踪，不是一次改动越多越好。报告应给出资源路径和具体字段，而非只写“发现错误”。",
            "一行报告可以写成“Assets/Art/Characters/Knight.png：Filter= Bilinear，规则要求Point，待修正”；另一行写“Assets/UI/Portrait.png：不属于角色目录，未应用该规则”。前者比较的是已确认规范，后者说明根本不在适用范围。若连目录或用途都未确定，只能报告待确认，不能把所有非Point图片一律判错。"
          ]
        },
        {
          "title": "导入回调要能安全重复执行",
          "paragraphs": [
            "资源可能因为源文件变化、设置变化或依赖变化而重新导入，因此自定义导入逻辑不能假定只执行一次。相同输入重复处理后，应得到稳定结果；若每轮都改变文件、名字或配置，就可能产生反复导入，甚至形成循环。",
            "例如仅在发现目标设置不同且确有必要时才更新，而不是每次都把全部字段写一遍。自定义规则还要避开会再次触发自身的无条件保存与刷新。开始实现前先记录触发路径，用一个小目录验证，再逐步扩大，避免全项目同时导入时才发现副作用。"
          ]
        },
        {
          "title": "编辑器导入不是运行时加载",
          "paragraphs": [
            "AssetImporter、TextureImporter和AssetDatabase属于编辑器工作流程。它们适合检查和生成资源，不意味着玩家发布后仍能按Assets路径访问源PNG并重新导入。运行时如何加载，应根据构建内容与相应资源管理方案另行设计。",
            "所以检查脚本要放在Editor-only范围，报告也应说明它验证的是导入配置而非当前内存状态。若要验证特定平台的纹理格式，应检查该平台覆盖与实际构建结果；只在Editor看见Point和某个PPU，不能证明目标平台所有压缩选择都正确。"
          ]
        },
        {
          "title": "让规范包含例外和验证方法",
          "paragraphs": [
            "一条有用规范应写清适用目录、目标字段、原因、允许例外与检查方法。例如角色帧图采用统一PPU是为了保持世界尺度，而大背景或UI图可能使用另一套规则。例外应有明确依据，不能靠文件名里随便出现某个词就永久跳过。",
            "先在实验目录保存检查报告，再让第二份干净导入验证结果。之后修改规范时，对照旧报告说明哪些资源和视觉表现会变化。这样导入工具就成为帮助人作判断的检查器，而不是隐藏决定的黑盒；新人也能根据同一套条件解释为什么某张图需要不同设置。",
            "报告还应区分错误与建议。明确违反项目约定的值可标为需要修改；暂时没有统一依据的参数，应列为待确认，而不是自行套用默认值。这样后来调整规范时，人们能够追溯规则为什么存在，也能避免工具把个人偏好包装成引擎必须遵守的要求。"
          ]
        }
      ],
      "code": {
        "title": "只读导入设置报告",
        "language": "csharp",
        "filename": "Assets/Editor/TextureImportReport.cs",
        "source": "using UnityEditor;\nusing UnityEngine;\npublic static class TextureImportReport\n{\n    [MenuItem(\"Learning/Texture Import Report\")]\n    static void Report()\n    {\n        string path = AssetDatabase.GetAssetPath(Selection.activeObject);\n        var importer = AssetImporter.GetAtPath(path) as TextureImporter;\n        if (!importer) { Debug.Log(\"Select a texture asset.\"); return; }\n        Debug.Log($\"{path}: type={importer.textureType}, ppu={importer.spritePixelsPerUnit}, filter={importer.filterMode}, compression={importer.textureCompression}\");\n    }\n}",
        "explanation": [
          "工具只读取选定资源的导入设置并输出报告，不自动覆盖项目。放在Editor-only范围运行。",
          "先用少量测试纹理检查路径和规则，再审阅是否需要编写受限的批量修改步骤。"
        ]
      },
      "lab": [
        {
          "title": "验证干净导入能否重现",
          "minutes": 60,
          "steps": [
            "记录目标目录的源图、meta、Unity版本和平台设置，运行只读检查。",
            "在测试副本重新导入，与原报告比较过滤、PPU和实际外观。",
            "解释哪些文件是源与配置，哪些缓存可以再生成。"
          ],
          "result": "别人能够依照同一输入与设置得到相同导入结果。",
          "setup": [
            "把工具保存为Assets/Editor/TextureImportReport.cs，等待Unity编译；不挂到场景对象。Project中选中一张PNG，再执行顶部Learning > Texture Import Report。",
            "Window > General > Console保存输出路径、PPU、Filter和Compression；同时记录Edit > Project Settings中目标平台相关设置与编辑器具体版本。",
            "只在独立实验副本重新导入：Project选资源后右键Reimport。重建Library属于整个项目级操作，不是本组必须删除用户现有缓存的步骤。"
          ],
          "purpose": "检查别人能否靠源与配置重建素材，而不是依赖你当前机器的缓存。"
        },
        {
          "title": "找出规范不该覆盖的例外",
          "minutes": 60,
          "steps": [
            "为角色、UI与背景列出各自用途，限定检查目录和字段。",
            "放入一张角色图、一张UI头像和一张故意误设过滤的角色图；先列适用范围，再要求报告给出路径、当前值、期望值与处理状态。确认UI头像被明确排除，不把它默默改成角色设置。",
            "设计小范围修改流程，再验证第二次执行不产生多余变化。"
          ],
          "result": "一份有适用范围、例外依据和复验步骤的规范。",
          "setup": [
            "在Project建立Assets/EngineLabs/Characters与Assets/EngineLabs/UI两个目录，各放测试图；另把一张Characters中的图故意设为Bilinear。",
            "继续使用顶部Learning > Texture Import Report逐个选资源输出。现成工具一次只报所选纹理，尚未自动扫描目录、判断错误或批量修复。",
            "用表格自行加“适用目录、期望值、允许例外、处理状态”列，再设计扫描器扩展。修改只在实验目录，先审阅差异，不能把演示只读工具当成已实现批处理。"
          ],
          "purpose": "通过角色图与UI头像的区别，验证规则范围和例外为何必须先于批量修改。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "重新导入后引用断了",
          "cause": "资源身份或切片身份发生变化。",
          "fix": "保留 meta 和版本记录，比较实际引用而非只看文件名。"
        },
        {
          "symptom": "打包时报 UnityEditor 不存在",
          "cause": "导入工具进入运行时程序集。",
          "fix": "将工具放进 Editor-only 范围，拆开玩家逻辑。"
        }
      ],
      "exercise": {
        "brief": "制定一份限定目录、允许例外、可检查的角色素材规范。",
        "deliverables": [
          "只读报告",
          "规范与例外表",
          "复现步骤"
        ],
        "rubric": [
          {
            "item": "身份和缓存区分",
            "points": 25
          },
          {
            "item": "规范范围合理",
            "points": 25
          },
          {
            "item": "工具边界正确",
            "points": 25
          },
          {
            "item": "复现证据完整",
            "points": 25
          }
        ]
      },
      "quiz": [
        {
          "question": "资源的meta通常应怎样处理？",
          "options": [
            "与源资源一起同步和版本管理",
            "只保留PNG，让每台机器任意生成新meta",
            "改名后删除meta以方便更新",
            "仅在Library中备份即可"
          ],
          "answer": 0,
          "explanation": "meta关联资源身份和导入信息，丢失它可能影响已有引用和导入一致性。",
          "scenario": "团队要在另一台电脑重建同一Sprite导入结果，源PNG已有场景和动画引用；meta保存资源标识及相关导入信息。"
        },
        {
          "question": "运行时能普遍用AssetDatabase加载Assets路径吗？",
          "options": [
            "能，Editor中运行过就能发布",
            "不能，它属于编辑器API",
            "能，只要路径写成绝对路径",
            "能，只要把脚本放进Resources"
          ],
          "answer": 1,
          "explanation": "编辑器数据库与发布内容的加载方式不同，应明确工具与运行时边界。",
          "scenario": "一个脚本调用UnityEditor.AssetDatabase，Editor里可以读到Assets路径；现在准备把相同脚本用于已构建Player加载。"
        },
        {
          "question": "统一导入设置的批处理，较好的第一步是什么？",
          "options": [
            "先重写整个Assets，之后再观察",
            "限定范围并输出只读差异报告",
            "先删除所有meta排除历史设置",
            "先让每次导入都触发一次全局Refresh"
          ],
          "answer": 1,
          "explanation": "先检查范围与差异，才能保留合理例外并控制重新导入的影响。",
          "scenario": "你准备把角色目录统一为Point，但Assets还包含UI和背景等不同用途素材，目前尚未列出例外。"
        }
      ],
      "references": [
        {
          "label": "AssetImporter",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetImporter.html"
        },
        {
          "label": "TextureImporter",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/TextureImporter.html"
        }
      ],
      "summary": [
        "源文件、meta、导入规则和版本共同支持可重复导入。",
        "先限定范围输出报告，再审查差异和合理例外。"
      ],
      "teaching": {
        "question": "要统一角色目录的Point过滤，为什么第一版工具只检查、不直接改全项目？",
        "keyIdea": "先确认规则适用谁，再修改，才能避免把正确的例外一起覆盖。只读报告让目录范围、实际差异和修改理由都可审查。",
        "walkthrough": [
          {
            "title": "限定对象",
            "text": "只扫描约定的角色帧目录，输出每张图片的路径、过滤和PPU，不递归修改整个Assets。"
          },
          {
            "title": "审阅差异",
            "text": "把报告中的不一致项与用途对照，找出确实错误的角色图，以及需要保留不同设置的特殊资源。"
          },
          {
            "title": "小范围复验",
            "text": "在测试副本执行必要修改，重新导入并比较外观，再验证重复运行不会继续产生无意义变化。"
          }
        ],
        "prediction": {
          "question": "发布后的玩家程序，可以把AssetDatabase当作通用Assets加载接口吗？",
          "answer": "不能。它属于编辑器资源数据库，玩家加载需要使用相应运行时方案与已构建内容。",
          "scenario": "你准备发布Windows Player，想用Assets路径运行AssetDatabase加载PNG。这个接口来自UnityEditor，尚未设计对应运行时加载方案。"
        },
        "scenario": "同一PNG在你电脑清楚，到另一份工程却模糊；批量改Point又可能把UI头像一起改坏。先让工具只读出被选资源的导入值，再决定规则适用于哪个目录。",
        "purpose": "能写清源文件、meta和导入规则怎样共同复现结果，自动检查也能保留合理例外。"
      }
    }
  ]
});
