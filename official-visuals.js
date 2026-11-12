'use strict';
// Official images remain hosted by Unity; Chinese notes and locator markers are original.
window.UNITY_OFFICIAL_VISUALS = [
  {
    "id": "editor-overview",
    "title": "先在真实界面里，认出三个工作区",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/project-window-context.png",
    "source": "https://docs.unity3d.com/6000.3/Documentation/Manual/ProjectView.html",
    "sourceTitle": "Project window reference",
    "version": "Unity 6.3 官方手册",
    "width": 783,
    "height": 501,
    "alt": "Unity官方编辑器截图：Scene在左，Hierarchy在右上，Project在其下，Inspector在最右；顶部中间有播放按钮。",
    "markers": [
      {
        "x": 57,
        "y": 9,
        "label": "1"
      },
      {
        "x": 57,
        "y": 50,
        "label": "2"
      },
      {
        "x": 79,
        "y": 9,
        "label": "3"
      }
    ],
    "read": [
      "先看① Hierarchy：这里列的是场景中的对象。图里有Buildings等示例对象，你自己的项目不需要有这些名字。",
      "再看② Project：Assets下面是文件和文件夹。第1课的Scripts文件夹与EnvironmentProbe.cs要建在这里。",
      "最后看③ Inspector：单击Hierarchy里的对象后，到这里看它的Transform和其他组件；图中下方的Add Component就是添加组件入口。"
    ],
    "action": "在你自己的Unity里各单击一次Hierarchy、Project和Inspector页签，再选中一个对象，看Inspector顶部的名字是否随选择改变。",
    "note": "这是官方示例项目的布局，窗口可以拖动。用页签名称认窗口，不要求你的界面与图完全相同。蓝色数字是本教材添加的定位标记。"
  },
  {
    "id": "hierarchy-window",
    "title": "Hierarchy：先确认自己选中了谁",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/hierarchy-window.png",
    "source": "https://docs.unity3d.com/6000.3/Documentation/Manual/Hierarchy.html",
    "sourceTitle": "Manage GameObjects in the Hierarchy window",
    "version": "Unity 6.3 官方手册",
    "width": 359,
    "height": 418,
    "alt": "Hierarchy窗口截图：SampleScene场景下列出Main Camera和Directional Light两个对象。",
    "read": [
      "SampleScene是场景名，下面缩进的Main Camera、Directional Light才是这个场景中的对象。",
      "第1课创建Probe后，它也应出现在这个列表里。Probe是你起的名字，官方图里没有它。"
    ],
    "action": "从GameObject > Create Empty新建空对象；回Hierarchy找新增的一行，命名Probe。已建过则只选中它，不再新建。",
    "note": "这张图来自3D示例。2D模板里的灯光或相机配置可能不同，不需要照图补一个Directional Light。"
  },
  {
    "id": "empty-inspector",
    "title": "Inspector：空对象也已经有Transform",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/EmptyGO1.png",
    "source": "https://docs.unity3d.com/6000.3/Documentation/Manual/Components.html",
    "sourceTitle": "Introduction to components",
    "version": "Unity 6.3 官方手册",
    "width": 600,
    "height": 255,
    "alt": "空GameObject的Inspector截图：顶部显示对象名和启用勾选框，下面的Transform列出Position、Rotation、Scale三组XYZ字段。",
    "read": [
      "最上方的GameObject是对象名；在你的练习中，这里应显示Probe。名字左边的勾选框控制对象是否活动。",
      "下面标题为Transform的区域是一个组件。Position是位置，Rotation是旋转，Scale是缩放，每组有X、Y、Z。",
      "挂脚本成功后，Inspector会多出EnvironmentProbe组件区块；Project里有.cs文件，还不表示这里已经有组件。"
    ],
    "action": "在Hierarchy选中Probe，确认Inspector顶部是Probe。向下找到Add Component，搜索并添加EnvironmentProbe，然后确认多出的组件区块。",
    "note": "官方图只展示空对象和Transform，没有展示本教材的脚本；Add Component在此截图范围之外。"
  },
  {
    "id": "console-window",
    "title": "Console：从一条输出找到它的详细内容",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/Console.png",
    "source": "https://docs.unity3d.com/6000.3/Documentation/Manual/Console.html",
    "sourceTitle": "Console window reference",
    "version": "Unity 6.3 官方手册",
    "width": 1600,
    "height": 672,
    "alt": "官方Console截图：顶部有Clear、Collapse和搜索框；消息列表显示错误及警告，底部显示选中消息的完整文本；图内已有A、B、C、D标记。",
    "read": [
      "先看顶部A区域：Clear清掉旧显示记录，Collapse合并相同消息；右边长条是搜索框，做第1课前先清空。",
      "中间C区域是一条条输出。单击其中一条，底部D区域就显示它的详细内容，可以从这里读文件名、行号或日志全文。",
      "右上角三类消息按钮控制日志、警告、错误是否显示。看不到预期输出时，先检查过滤开关和搜索条件。"
    ],
    "action": "用Window > General > Console打开窗口，点Clear并关闭Collapse，再Play。第1课应读到Unity/platform与fixedDeltaTime/timeScale两条探针日志。",
    "note": "图里的红色报错是官方示例消息，不是你应该制造的结果，也不是第1课探针的正常输出。A/B/C/D是官方图内区域标记，不是题目中的对象名。"
  },
  {
    "id": "play-controls",
    "title": "播放、暂停、单步：先认清三个图标",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/Editor-PlayButtons.png",
    "source": "https://docs.unity3d.com/6000.3/Documentation/Manual/GameView.html",
    "sourceTitle": "Game view reference",
    "version": "Unity 6.3 官方手册",
    "width": 87,
    "height": 16,
    "compact": true,
    "alt": "三个播放控制图标，从左到右为三角形Play、双竖线Pause、向右单步Step。",
    "read": [
      "从左到右是Play（进入或退出播放）、Pause（暂停）、Step（暂停时前进一步）。第1课先只用Play。"
    ],
    "action": "点击编辑器顶部三角形Play进入运行；本次运行结束后，再用同一位置的播放控制退出。",
    "note": "这是官方手册的小尺寸图标示意。按钮的颜色和运行时外观可能不同，应同时看鼠标悬停时的提示。"
  },
  {
    "id": "lifecycle-chart",
    "title": "把回调放回生命周期里看",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/monobehaviour_flowchart.svg",
    "source": "https://docs.unity.com/en-us/engine/6000.3/manual/scripting/managing-update-order/execution-order",
    "sourceTitle": "Event function execution order",
    "version": "Unity 6.3 官方手册",
    "width": 769,
    "height": 1327,
    "alt": "Unity脚本事件执行顺序图，按初始化、物理与游戏逻辑、场景渲染和销毁等阶段标出回调。",
    "read": [
      "第一遍只找图上方的Awake、OnEnable、Start，和本课初始化例子一一对应；暂时跳过还没学的渲染回调。",
      "读第12课时，再沿图找FixedUpdate、Update、LateUpdate。固定阶段可以重复或不发生，不能把它读成每个画面帧都恰好运行一次。",
      "读清理时，再找下方OnDisable、OnDestroy。箭头旁的条件也属于规则；图不是所有对象按同一先后顺序排队的承诺。"
    ],
    "action": "点击放大，先找到本课正在解释的三个函数，再回到你的日志，逐条对应；不要求现在记住整张图。",
    "note": "图有条件分支，不能删除对象活动状态、组件启用状态等前提。 它不是不同对象回调顺序的无条件承诺。 长图需支持放大；手机缩成整张缩略图将无法阅读。"
  },
  {
    "id": "transform-inspector",
    "title": "三个Transform字段，分别改了什么",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/TransformExample4.png",
    "source": "https://docs.unity.com/en-us/engine/6000.3/manual/class-transform",
    "sourceTitle": "Introduction to transforms",
    "version": "Unity 6.3 官方手册",
    "width": 500,
    "height": 165,
    "alt": "Inspector中的Transform组件，Position和Rotation的X/Y/Z为0，Scale的X/Y/Z为1。",
    "read": [
      "Position（位置）、Rotation（旋转）、Scale（缩放）是三行不同数据，每行都有X、Y、Z三个分量。",
      "图中Position与Rotation都是0，Scale都是1；这些是本图的初始值，不代表所有对象都应这样设置。",
      "有父对象时，Inspector中的这些Transform值按父级坐标来解释，不能直接把Position抄成世界坐标。"
    ],
    "action": "在独立练习场景选中一个Cube，记下原值，只将Position的X改大1，再看Scene里的变化；随后撤销，避免把其他条件一起改掉。",
    "note": "图只显示组件区域，不能用来认整个编辑器布局。"
  },
  {
    "id": "parent-child-hierarchy",
    "title": "看缩进，就能读出谁是谁的父对象",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/parenting-in-hierarchy-window.png",
    "source": "https://docs.unity.com/en-us/engine/6000.3/manual/class-transform",
    "sourceTitle": "Introduction to transforms",
    "version": "Unity 6.3 官方手册",
    "width": 360,
    "height": 403,
    "alt": "Hierarchy的SampleScene里，Parent下缩进列出Child 1和Child 2，Child 3又缩进在Child 2下面。",
    "read": [
      "Parent、Child 1、Child 2、Child 3都是作者给对象起的名字，不是内置按钮。",
      "Child 1与Child 2缩进相同，直接父对象都是Parent。Child 3又缩进一级，它的直接父对象是Child 2。",
      "这是层级关系，不能从列表的上下排列推出两个脚本回调的执行顺序。"
    ],
    "action": "在练习场景新建两个空对象，命名Parent和Child；把Hierarchy里的Child拖到Parent名字上，检查是否形成下一层缩进。",
    "note": "Parent/Child 1等是官方示例对象名，是作者命名，不是菜单或预装组件。"
  },
  {
    "id": "transform-axis-colors",
    "title": "把X、Y、Z和场景里的箭头对应起来",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/TransformExample2.png",
    "source": "https://docs.unity.com/en-us/engine/6000.3/manual/class-transform",
    "sourceTitle": "Introduction to transforms",
    "version": "Unity 6.3 官方手册",
    "width": 500,
    "height": 411,
    "alt": "Scene中的移动手柄，X轴红色、Y轴绿色、Z轴蓝色，右上角也显示坐标轴标记。",
    "read": [
      "图中X用红色，Y用绿色，Z用蓝色。右上角的小轴标帮助你认观察方向。",
      "物体上的三色箭头是移动手柄。拖一根轴可以约束在该方向移动；不要把自由拖动与单轴移动混在同一组对照中。",
      "方向还取决于工具栏Local/Global模式；仅凭这张截图，不能判断你的物体现在采用哪种模式。"
    ],
    "action": "在Scene选中练习对象，切到Move工具；先只认三种颜色，再核对工具栏Local/Global的实际选择。",
    "note": "图本身不能证明当前手柄选择了Local或Global模式；若讲坐标模式，要另看实际工具栏选项。 这是官方复用的示例场景图，图内菜单与主题可能与本机不同。"
  },
  {
    "id": "collider-outline",
    "title": "看得见的树，与物理使用的边界",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/RigidbodyandCollider.png",
    "source": "https://docs.unity.com/en-us/engine/6000.3/manual/physics-section/physics-overview/rigidbody/rigidbody-configure-colliders",
    "sourceTitle": "Configure Rigidbody Colliders",
    "version": "Unity 6.3 官方手册",
    "width": 1790,
    "height": 1088,
    "alt": "Scene中的树模型叠加绿色碰撞轮廓，Inspector展开Mesh Collider并勾选Convex。",
    "read": [
      "先看左侧树模型上叠加的绿色轮廓，再看右侧Mesh Collider。显示外形与检测接触的形状分别由不同组件负责。",
      "图里勾了Convex，这是这个Mesh Collider示例的配置；初学实验用Box Collider也可以看同样的职责区别。",
      "本图没有展开Rigidbody，不能从这张图读取质量或速度，也不能把它当成2D碰撞体的配置图。"
    ],
    "action": "在本课的3D箱子上选中Box Collider，到Scene观察绿色轮廓；只改Collider的Size，比较轮廓与可见箱子是否仍重合。",
    "note": "图中Inspector没有显示Rigidbody组件，不能把它当作刚体字段截图。 这是3D Mesh Collider示例，不是2D Collider；二维物理课不应借图混淆两套系统。"
  },
  {
    "id": "sprite-editor-bounds-pivot",
    "title": "切片范围、Border、Pivot：图里的A/B/C各指什么",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/sprite-editor_sprite-selected.jpg",
    "source": "https://docs.unity.com/en-us/engine/6000.3/manual/unity2d/sprite/sprite-editor-window-reference/reference",
    "sourceTitle": "Sprite Editor tab reference for the Sprite Editor window",
    "version": "Unity 6.3 官方手册",
    "width": 573,
    "height": 380,
    "alt": "Sprite Editor平台地块示例：A标出蓝色精灵选区边框，B标出绿色Border边框，C标出蓝色空心轴心圆。",
    "read": [
      "A标的是蓝色切片框：这一块图片会成为一个Sprite。先检查它有没有截掉角色或混入别的帧。",
      "B标的是绿色Border边界，主要用于九宫格等用途；它不是Idle每帧脚底的基准。",
      "C标的是蓝色空心Pivot圆，也就是轴心。不同帧若轴心与脚底的相对位置不一致，即使对象位置没变，也可能看起来跳动。"
    ],
    "action": "在自己的图集中连续选两帧，分别核对蓝色切片范围和Pivot；把观察到的差异写下来，再决定是否修改。",
    "note": "官方图用的是平台地块，不是Tiny Swords角色；A/B/C含义按官方正文解释，不能自行把B当成角色包围框。"
  },
  {
    "id": "animator-state-graph",
    "title": "先沿Entry箭头，找到默认状态",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/MecanimAnimatorControllerWindow.png",
    "source": "https://docs.unity.com/en-us/engine/6000.3/manual/animation-section/animation-mecanim/animation-animator-controller/animator-window",
    "sourceTitle": "Animator window",
    "version": "Unity 6.3 官方手册",
    "width": 739,
    "height": 403,
    "alt": "Animator窗口示例，左侧Parameters列出参数，右侧Entry箭头指向橙色Grounded状态，其他状态有Jumping、Falling和Die。",
    "read": [
      "左边Parameters列参数，右边方框是状态，连线箭头表示过渡。Animator窗口决定用哪个状态；Animation窗口查看片段的时间轴，两个名字不要混读。",
      "绿色Entry的箭头指向橙色Grounded，它是这份官方示例的默认状态。自己的Idle控制器里要找对应的Idle，不必创建一个叫Grounded的状态。",
      "选中自己的状态后，还要去Inspector检查Motion是否引用正确片段；这张状态图本身不能证明片段有关键帧。"
    ],
    "action": "在练习对象的Animator组件确认Controller后，打开Window > Animation > Animator；沿Entry找启动状态，再点这个状态检查Inspector中的Motion。",
    "note": "这是6.3文档沿用的浅色示例图，主题和工具栏可能不同。Grounded、Jumping等是示例自己创建的状态，不是新控制器预装的内容。"
  },
  {
    "id": "animation-empty-clip",
    "title": "打开Animation窗口，不等于已经有动画内容",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/AnimationWindowEmptyClip.png",
    "source": "https://docs.unity.com/en-us/engine/6000.3/manual/animation-section/animation-mecanim/animation-clips/animation-editor-guide/animeditor-using-animation-editor",
    "sourceTitle": "Use the Animation view",
    "version": "Unity 6.3 官方手册",
    "width": 711,
    "height": 216,
    "alt": "Animation窗口的空动画片段，左侧有Add Property按钮，顶部Samples为60，右侧时间轴还没有关键帧。",
    "read": [
      "先认左侧Add Property按钮和右侧空时间轴：当前片段还没有能改变属性的关键帧。",
      "Samples是时间采样设置。图中的60只是示例值，不能据此要求所有Idle都设60，也不等于游戏必须60FPS。",
      "自己的逐帧Idle应检查Sprite Renderer.Sprite轨道是否存在、各时间点是否引用了对应的Sprite帧。"
    ],
    "action": "选中实际挂动画的对象，打开Window > Animation > Animation并选择自己的Idle片段，先看轨道与关键帧是否为空。",
    "note": "图中片段名Sphere Empty Animation属于官方示例，不是你需要寻找的内置Idle。6.3文档沿用了这张旧浅色界面图。"
  },
  {
    "id": "animation-dope-sheet",
    "title": "左边一行属性，右边一串关键帧",
    "image": "https://docs.unity.com/api/media?file=/engine/6000.3/media/images/AnimationEditorDopeSheetView.png",
    "source": "https://docs.unity.com/en-us/engine/6000.3/manual/animation-section/animation-mecanim/animation-clips/animation-editor-guide/animeditor-using-animation-editor",
    "sourceTitle": "Use the Animation view",
    "version": "Unity 6.3 官方手册",
    "width": 853,
    "height": 346,
    "alt": "Animation的Dope Sheet视图，左侧列出机器人手臂的属性轨道，右侧用菱形显示各时间点的关键帧。",
    "read": [
      "先看左边属性行，再横向看同一行右边的菱形。菱形代表某个时刻保存的属性值。",
      "这张图记录机器人手臂的旋转；你的Sprite动画应看Sprite Renderer.Sprite轨道，两者用同一类时间轴展示不同属性。",
      "移动播放头时，观察被选对象的属性怎样改变；仅看时间轴上有菱形，还不能证明它写到了正确对象。"
    ],
    "action": "在自己的Animation窗口选中Sprite轨道的两个关键帧，依次移动播放头，核对Sprite Renderer的Sprite字段是否切换。",
    "note": "这是6.3文档沿用的旧浅色示例，不要去项目里找图中的机器人对象。图里的关键帧分布也不是Idle帧间隔的推荐值。"
  }
];

window.UNITY_LESSON_VISUALS = {
  "l001": [
    {
      "section": 0,
      "visual": "editor-overview"
    },
    {
      "section": 1,
      "visual": "empty-inspector"
    },
    {
      "section": 2,
      "visual": "console-window"
    }
  ],
  "l002": [
    {
      "section": 0,
      "visual": "empty-inspector"
    },
    {
      "section": 2,
      "visual": "parent-child-hierarchy"
    }
  ],
  "l016": [
    {
      "section": 0,
      "visual": "transform-inspector"
    },
    {
      "section": 1,
      "visual": "parent-child-hierarchy"
    }
  ],
  "l011": [
    {
      "section": 1,
      "visual": "lifecycle-chart"
    }
  ],
  "l012": [
    {
      "section": 0,
      "visual": "lifecycle-chart"
    }
  ],
  "l013": [
    {
      "section": 1,
      "visual": "lifecycle-chart"
    }
  ],
  "l015": [
    {
      "section": 3,
      "visual": "lifecycle-chart"
    }
  ],
  "l017": [
    {
      "section": 0,
      "visual": "transform-axis-colors"
    }
  ],
  "l018": [
    {
      "section": 1,
      "visual": "transform-inspector"
    }
  ],
  "l031": [
    {
      "section": 0,
      "visual": "collider-outline"
    }
  ],
  "l033": [
    {
      "section": 0,
      "visual": "collider-outline"
    }
  ],
  "l041": [
    {
      "section": 0,
      "visual": "sprite-editor-bounds-pivot"
    }
  ],
  "l042": [
    {
      "section": 1,
      "visual": "sprite-editor-bounds-pivot"
    }
  ],
  "l046": [
    {
      "section": 0,
      "visual": "animation-empty-clip"
    },
    {
      "section": 1,
      "visual": "animation-dope-sheet"
    }
  ],
  "l047": [
    {
      "section": 0,
      "visual": "animator-state-graph"
    }
  ],
  "l048": [
    {
      "section": 0,
      "visual": "animator-state-graph"
    }
  ],
  "l050": [
    {
      "section": 1,
      "visual": "animation-dope-sheet"
    },
    {
      "section": 2,
      "visual": "animator-state-graph"
    }
  ]
};
