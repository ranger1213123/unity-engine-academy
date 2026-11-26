window.LESSON_FOUNDATIONS = {
  l001: {
    bridge: '你不需要预先会用 Unity。本课从“打开编辑器后能看见什么”开始，只要求你会新建文件夹、复制文字和保存文件。',
    concepts: [
      {term: 'Hierarchy', kind: '编辑器窗口', plain: '列出当前场景里的 GameObject。以后说“选中对象”，默认就是在这里单击对象。', find: '顶部菜单 Window > General > Hierarchy。'},
      {term: 'Inspector', kind: '编辑器窗口', plain: '显示当前选中对象或资源的设置。选中的东西不同，Inspector 内容也会跟着变化。', find: '顶部菜单 Window > General > Inspector。'},
      {term: 'MonoBehaviour 脚本', kind: '可以挂到 GameObject 上的 C# 组件', plain: '脚本编译成功并挂到对象后，Unity 才能在规定时机调用其中的 Start、Update 等函数。', find: '在 Project 的 Assets 文件夹中创建脚本；选中场景对象后，可在 Inspector 的 Add Component 中添加它。'},
      {term: 'Play Mode', kind: '编辑器运行状态', plain: '点击顶部三角形 Play 后，Unity 会运行当前场景。停止播放后，大多数运行时改动不会自动保存。', find: 'Unity 编辑器顶部中央的三角形按钮。'}
    ]
  },
  l002: {
    bridge: '第 1 课演示了怎样在 Hierarchy 选对象、在 Inspector 看设置。本课解释一个场景对象为什么能显示、碰撞或运行脚本；如果这两个窗口还找不到，先返回第 1 课。',
    concepts: [
      {term: 'GameObject', kind: '场景中的对象容器', plain: '它是 Hierarchy 里的一项，负责承载名称、层级和组件；具体能力主要由组件提供。', find: 'Hierarchy 中的每一行通常对应一个 GameObject。'},
      {term: 'Component', kind: '附着在 GameObject 上的功能模块', plain: 'Transform、SpriteRenderer、Collider 和你写的 MonoBehaviour 脚本都是组件。一个对象可以组合多个组件。', find: '选中 GameObject 后，在 Inspector 中从上到下查看。'},
      {term: 'activeSelf / activeInHierarchy', kind: 'GameObject 的两种活动状态', plain: 'activeSelf 是对象自己的开关；activeInHierarchy 是考虑全部父对象后，它当前是否真的处于活动层级。', find: '对象自己的活动勾选在 Inspector 顶部；代码可读取这两个属性。'}
    ]
  },
  l003: {
    bridge: '第 2 课解释了 GameObject 与 Component。现在要分清 Project 里的文件、Scene 里的对象和 Prefab 生成的实例分别保存在哪里。',
    concepts: [
      {term: 'Asset', kind: '项目资源', plain: '保存在项目 Assets 文件夹中的文件，例如图片、脚本、材质和 Prefab。它不等于场景里正在使用它的对象。', find: 'Project 窗口的 Assets 下。'},
      {term: 'Scene', kind: '场景资源与运行空间', plain: 'Scene 文件保存一组 GameObject 及其组件配置。打开场景后，Hierarchy 显示这组对象。', find: 'Project 中通常是带场景图标的 .unity 文件；双击可打开。'},
      {term: 'Prefab', kind: '可复用的对象模板资源', plain: 'Prefab 资源可以生成多个场景实例。修改实例、应用覆盖和修改模板不是同一件事。', find: 'Project 中是 Prefab 资源；拖入 Scene 或 Hierarchy 后得到实例。'}
    ]
  },
  l004: {
    bridge: '上一课分清了资源、场景和实例。本课继续追踪一个数值到底来自代码、Inspector 保存值，还是本次运行中产生的状态。',
    concepts: [
      {term: '字段初值', kind: 'C# 代码中的默认值', plain: '写在字段声明右侧的值，用于新建组件时提供起点；已有组件保存过的序列化值不一定随代码初值变化。'},
      {term: '序列化字段', kind: '可由 Unity 保存的组件数据', plain: 'Unity 将符合规则的字段写入 Scene、Prefab 或资源。private 字段加 SerializeField 后也可以显示并保存。', find: '选中挂有该脚本的对象，在 Inspector 的脚本组件中查看。'},
      {term: '运行时状态', kind: '播放过程中变化的数据', plain: '例如当前生命、剩余冷却和当前目标。它们与最大生命等配置回答不同问题，停止播放后通常不会成为永久配置。'}
    ]
  },
  l005: {
    bridge: '前四课已经演示脚本运行和 Inspector 数据。本课学习在结果不对时先判断错误发生在哪个阶段，再沿证据回到原因。',
    concepts: [
      {term: '编译错误', kind: '代码还不能生成可运行程序集时的错误', plain: 'Console 中常见 error CS 开头的信息。项目存在编译错误时，新的脚本逻辑通常无法正常进入运行验证。', find: 'Window > General > Console。'},
      {term: '运行异常', kind: '程序运行到某一步时抛出的错误', plain: '代码已经编译，但执行时遇到空引用、越界等问题。异常信息和调用栈能说明经过了哪些方法。', find: 'Play 后查看 Console 的红色记录并展开调用栈。'},
      {term: '调用栈', kind: '一次调用经过的方法路径', plain: '它从报错位置向外列出调用者，帮助判断错误来自哪个对象、哪一帧和哪条入口，而不只是盯着最后一行。'},
      {term: 'Script Reference', kind: 'Unity API 参考文档', plain: '说明某个类、属性或方法的签名和契约。它与按任务组织的 Manual 用途不同。', find: '本课“官方依据”中的 Unity 官方链接。'}
    ]
  },
  l006: {
    bridge: '前五课已经让脚本运行起来。第二章先补齐读 Unity C# 代码需要的最小语言模型，不要求先背内存术语。',
    concepts: [
      {term: '类型', kind: '数据允许保存和操作的规则', plain: 'Vector3、Transform、int 都是类型。类型决定变量能保存什么，以及可以调用哪些成员。'},
      {term: '值类型', kind: '赋值时复制数值的类型', plain: 'Vector3 是值类型。把 a 赋给 b 后，b 得到一份数值副本，随后修改 b 不会自动修改 a。'},
      {term: '引用类型', kind: '变量可共同指向同一对象的类型', plain: 'Transform 变量保存通往组件的引用。两个变量可指向同一个 Transform，通过任一变量修改它都会反映到同一对象。'},
      {term: 'Unity 特殊空值', kind: '托管引用与引擎对象寿命的交界', plain: 'Unity 对象被 Destroy 后，C# 包装对象与引擎对象的状态可能不同。检查 Unity 对象是否可用时应使用教材给出的明确判断方式。'}
    ]
  },
  l007: {
    bridge: '上一课分清了类型、值和引用。本课学习把组件的数据与操作组织成其他脚本能够正确使用的接口。',
    concepts: [
      {term: '字段', kind: '对象保存的数据成员', plain: '字段直接保存值或引用。访问级别决定其他代码能否直接读写，序列化规则决定 Unity 能否保存并显示它。'},
      {term: '属性', kind: '带 get / set 访问规则的成员', plain: '属性看起来像字段，但读写时可以执行检查或限制。它不会因为叫属性就自动出现在 Inspector。'},
      {term: '方法', kind: '对象可以执行的操作', plain: '方法可以接收参数、修改状态并返回结果。修改规则放进真正会被调用的方法，才能形成统一入口。'},
      {term: 'SerializeField', kind: 'Unity 序列化特性', plain: '让符合条件的 private 字段在 Inspector 中显示并被保存，但不会把它变成其他脚本可直接访问的 public 字段。', find: '写在字段前：`[SerializeField] private float speed;`。'}
    ]
  },
  l008: {
    bridge: '第 7 课说明了怎样声明 Transform、Renderer 等组件引用。本课只解决“从哪个对象开始，向哪里找，取一个还是全部”。',
    concepts: [
      {term: 'GetComponent<T>()', kind: 'Component 的查找方法', api: true, plain: '从调用者所在的同一个 GameObject 上，取得一个 T 类型组件。', syntax: 'T value = source.GetComponent<T>();', caller: 'source：规定从哪个组件所在的 GameObject 开始找。', input: 'T：要找的组件类型；这一写法没有普通参数。', output: '找到时返回一个 T 引用；找不到时返回 null。', doesNot: '不会自动向父级、子级或整个场景继续查找。'},
      {term: 'GetComponents<T>()', kind: 'Component 的复数查找方法', api: true, plain: '取得调用者所在 GameObject 上全部 T 类型组件。', syntax: 'T[] values = source.GetComponents<T>();', caller: 'source：查找起点。', input: 'T：要收集的组件类型。', output: '返回 T 数组；没有结果时得到空数组。', doesNot: '不会只返回第一个，也不会遍历父子层级。'},
      {term: 'GetComponentInChildren<T>()', kind: '向子层级查找一个组件的方法', api: true, plain: '从调用者自己开始，再沿子对象向下查找一个 T。', syntax: 'T value = source.GetComponentInChildren<T>();', caller: 'source：层级查找的起点。', input: 'T：目标类型；部分重载可决定是否包含未激活子对象。', output: '返回找到的一个 T；找不到时返回 null。', doesNot: '不保证在存在多个匹配项时替你选择具有业务意义的那个。'},
      {term: 'GetComponentsInParent<T>()', kind: '向父层级查找全部组件的方法', api: true, plain: '从调用者自己开始，沿父级向上收集 T 类型组件。', syntax: 'T[] values = source.GetComponentsInParent<T>();', caller: 'source：向上查找的起点。', input: 'T：目标类型；重载可控制未激活对象处理。', output: '返回收集到的 T 数组。', doesNot: '不会搜索兄弟对象或无关场景对象。'},
      {term: 'TryGetComponent<T>()', kind: '带成功结果的同对象查找方法', api: true, plain: '尝试在同一 GameObject 上取得一个 T，并用 bool 明确表示成功或失败。', syntax: 'bool found = source.TryGetComponent(out T value);', caller: 'source：查找起点。', input: 'out value：用于接收结果的变量。', output: '返回 bool；成功时 value 是找到的组件。', doesNot: '不会向父级或子级查找。'}
    ]
  },
  l009: {
    bridge: '第 7 课讲组件接口，第 8 课讲怎样取得另一个组件。本课学习两个对象怎样建立“发生事情时通知我”的关系。',
    concepts: [
      {term: '发布者', kind: '拥有并触发事件的对象', plain: '它决定什么时候发出通知，但不需要知道每个监听者要做什么。'},
      {term: '监听者', kind: '订阅事件并处理通知的对象', plain: '它把自己的处理方法加入事件；不再需要通知时，应移除同一个处理方法。'},
      {term: 'Action', kind: '描述无返回值方法形状的委托类型', plain: 'Action 可以保存符合签名的方法引用。event 用它限制外部代码只能订阅或退订。'},
      {term: '+= / -= / Invoke', kind: '事件关系的三个操作', plain: '+= 加入处理方法，-= 移除同一处理方法，Invoke 调用当前已登记的处理方法。它们不是自动的网络消息或后台线程。'}
    ]
  },
  l010: {
    bridge: '第 8 课讲单个组件引用，第 9 课讲对象之间的事件关系。本课学习保存一组对象时，清单本身与场景对象的寿命为什么是两回事。',
    concepts: [
      {term: 'List<T>', kind: '可变长度的有序清单', plain: 'T 说明元素类型。List 可以增加、删除和清空元素，Count 表示当前有多少个位置。'},
      {term: '索引', kind: '列表元素的位置编号', plain: '索引从 0 开始。删除一个元素后，后面的元素会前移，所以边遍历边删除需要明确顺序。'},
      {term: 'RemoveAt / Clear', kind: '只修改列表的方法', plain: 'RemoveAt 删除一个列表位置，Clear 删除全部列表位置；它们不会因此销毁场景中的 GameObject。'},
      {term: 'Destroy', kind: '请求销毁 Unity 对象的方法', plain: 'Destroy 改变对象寿命，但不会自动从你维护的每个 List 中移除对应位置。'}
    ]
  },
  l011: {
    bridge: '第二章已经补齐字段、组件引用和事件。本章开始回答：脚本挂到对象后，Unity 在什么时候调用你的函数。',
    concepts: [
      {term: '生命周期回调', kind: '由 Unity 在规定阶段调用的方法', plain: '你声明符合名称和签名的方法，Unity 决定调用时机。它不同于其他代码显式调用的普通方法。'},
      {term: 'Awake', kind: '实例初始化回调', plain: '常用于准备本实例自己的引用和初始状态。同一实例通常只接收一次。', find: '写在 MonoBehaviour 类体内：`void Awake() { ... }`。'},
      {term: 'OnEnable', kind: '组件进入有效启用状态时的回调', plain: '对象或组件每次重新进入启用状态都可能再次调用，适合建立需要随启用期存在的联系。'},
      {term: 'Start', kind: '第一次更新前的一次性回调', plain: '组件满足启用条件后，在第一次 Update 前调用一次；重新勾选同一实例不会再次开始一个新的 Start。'}
    ]
  },
  l012: {
    bridge: '第 11 课解释了脚本怎样开始工作。本课把“每帧”拆成画面更新、固定模拟步和本帧末尾三个不同阶段。',
    concepts: [
      {term: '渲染帧', kind: '一次画面更新周期', plain: '帧间隔会随性能变化，不保证固定。Update 通常按渲染帧调用。'},
      {term: 'Update', kind: '逐渲染帧回调', plain: '适合读取当帧输入和推进与画面帧同步的逻辑；调用间隔不是固定常数。'},
      {term: 'FixedUpdate', kind: '按固定时间步调度的回调', plain: '常用于配合物理模拟。一帧可能没有、一次或多次 FixedUpdate，不能把它理解为“每帧固定一次”。'},
      {term: 'LateUpdate', kind: '普通 Update 之后的逐帧回调', plain: '常用于读取其他对象在本帧更新后的最终位置，例如相机跟随；它不是物理固定步。'}
    ]
  },
  l013: {
    bridge: '第 11、12 课解释了实例怎样开始并持续更新。本课学习它暂时停止参与和永久销毁时，哪些关系需要清理。',
    concepts: [
      {term: 'OnDisable', kind: '离开启用状态时的回调', plain: '组件被禁用、GameObject 离开活动层级等情况会触发；同一实例可以多次收到。'},
      {term: 'OnDestroy', kind: '实例销毁时的回调', plain: '用于处理与实例销毁相对应的收尾，但不应被当作任何平台上唯一可靠的重要存档入口。'},
      {term: '成对清理', kind: '资源与关系的寿命规则', plain: '在哪里订阅、占用或启动，就要安排对应的退订、释放或停止，并让重复清理不会破坏状态。'},
      {term: '存档', kind: '需要独立可靠性设计的数据保存', plain: '正常退出回调可能来不及执行。重要进度应在明确节点保存，而不是只赌最后一次退出通知。'}
    ]
  },
  l014: {
    bridge: '前面所有回调都在一次调用中从头执行到尾。本课第一次学习一个方法怎样暂停，并在之后的某个阶段继续。',
    concepts: [
      {term: '协程', kind: '可分段继续执行的方法流程', plain: '协程在主线程的多个阶段之间暂停和恢复；它不会因为使用 yield 就自动变成后台计算线程。'},
      {term: 'IEnumerator', kind: '协程方法常用的返回类型', plain: '它让 Unity 能逐步推进方法。方法运行到 yield 时交出控制，满足条件后从后面继续。'},
      {term: 'yield return', kind: '协程的暂停点', plain: '右侧对象表达等待条件。它不是“结束方法”，也不是让整个游戏停住。'},
      {term: 'Coroutine 句柄', kind: '已启动协程的标识', plain: '保存 StartCoroutine 的返回值后，可以停止当初那一项任务；只保存方法名无法区分多个并行实例。'}
    ]
  },
  l015: {
    bridge: '第 11 至 14 课讲的是单个组件的生命周期。现在处理多个对象互相依赖时，不能把 Hierarchy 排列顺序误当成初始化保证。',
    concepts: [
      {term: '依赖', kind: '一个步骤开始前必须已经存在的条件', plain: '依赖应具体到数据或状态，例如“配置已经载入”，而不是含糊地说“另一个脚本先运行”。'},
      {term: '显式 Init', kind: '由调用者明确触发的初始化方法', plain: '调用者可以传入依赖并检查成功或失败，让顺序成为可读的流程，而不是依靠碰巧的回调先后。'},
      {term: '启动器', kind: '组织多个初始化步骤的组件', plain: '它按已声明的依赖顺序调用各对象，负责报告缺失条件；不是让每个组件互相猜测何时准备好。'},
      {term: 'Script Execution Order', kind: 'Unity 的回调顺序设置', plain: '它能调整同类事件函数的相对执行顺序，但不能替你表达所有数据依赖，也不能自动安排之后动态创建的完整业务流程。', find: 'Project Settings > Script Execution Order。'}
    ]
  },
  l016: {
    bridge: '前三章已经讲过 GameObject、Component、Transform 引用和父子层级。本课第一次把 Transform 当作一套坐标系来使用。',
    concepts: [
      {term: 'Transform', kind: '每个 GameObject 都有的组件', plain: '它保存对象的位置、旋转、缩放和父子关系。Transform 既描述对象姿态，也定义一套以该对象为原点和坐标轴的局部空间。', find: '在 Hierarchy 选中任意 GameObject，Inspector 最上方就是 Transform 组件。'},
      {term: '局部空间 / 世界空间', kind: '描述坐标所采用的参照系', plain: '局部空间以某个 Transform 为参照；世界空间以整个场景的全局坐标为参照。同一位置可以在两套空间中写成不同数字。'},
      {term: 'TransformPoint', kind: 'Transform 组件的方法', api: true, plain: '把相对于某个 Transform 的局部位置点，换算成世界位置点。', syntax: 'Vector3 worldPoint = root.TransformPoint(localPoint);', caller: 'root：规定采用哪一套局部坐标系。方法属于这个 Transform。', input: 'localPoint：相对于 root 原点和局部坐标轴的位置点。', output: 'worldPoint：同一个点在世界空间中的位置。换算包含 root 层级的平移、旋转和缩放。', doesNot: '不会移动 root、localPoint 对应的对象或任何场景对象；它只计算并返回一组 Vector3 数值。'},
      {term: 'SetParent', kind: 'Transform 组件的父级设置方法', api: true, plain: '更改一个 Transform 的父对象，并用参数决定换父时是否尽量保留当前世界姿态。', syntax: 'item.SetParent(socket, worldPositionStays);', caller: 'item：要更换父级的 Transform。', input: 'socket：新的父 Transform；worldPositionStays：是否保留世界姿态。', output: '没有返回值；调用后 item 的父子关系和相应变换数值发生变化。', doesNot: '不会自动把 localPosition、localRotation 或 localScale 全部归零。'}
    ]
  },
  l017: {
    bridge: '上一课已经用 Vector3 保存位置点。本课说明同一种 Vector3 还可以表示方向、速度和位移，因此每次计算都要先写清含义。',
    concepts: [
      {term: 'Vector3', kind: '由 x、y、z 三个分量组成的值类型', plain: '它可以承载位置、方向、速度或位移。类型只说明数据形状，不会替你记录这三个数的物理含义。'},
      {term: 'magnitude', kind: '向量的长度', plain: '对位移表示距离，对速度表示速率，对输入表示强度。向量 (3,4,0) 的长度是 5。'},
      {term: 'normalized / ClampMagnitude', kind: '两种不同的向量大小处理', plain: 'normalized 把非零向量长度变成 1；ClampMagnitude 只缩短超过上限的向量，因此能保留小于上限的输入强度。'},
      {term: 'Dot / ProjectOnPlane', kind: 'Vector3 的几何方法', plain: 'Dot 用一个数描述两个方向的夹角关系；ProjectOnPlane 去掉沿平面法线的分量。它们解决不同问题，不能互相替代。'}
    ]
  },
  l018: {
    bridge: '第 17 课用“目标位置减当前位置”得到方向。本课把这个方向变成目标旋转，并控制每一步转多少。',
    concepts: [
      {term: '欧拉角', kind: '用绕轴角度描述旋转的方式', plain: 'Inspector 用三个角度方便人编辑，但不同角度组合可能表示同一朝向，组合顺序也会影响结果。'},
      {term: 'Quaternion', kind: 'Unity 代码中表示旋转的值类型', plain: '它的 x、y、z、w 不是四个可直接填写的欧拉角。通常通过 Euler、LookRotation 等方法构造。'},
      {term: 'LookRotation', kind: '根据前方方向构造旋转的方法', api: true, plain: '根据给定 forward 方向计算一个 Quaternion。', syntax: 'Quaternion targetRotation = Quaternion.LookRotation(forward);', caller: 'Quaternion 类型本身：这是静态方法，不从某个场景对象实例调用。', input: 'forward：希望旋转后面对的方向；接近零时缺少有效朝向。', output: '返回表示目标朝向的 Quaternion。', doesNot: '不会把结果自动写入某个 Transform，也不会负责平滑转向。'},
      {term: 'RotateTowards', kind: '按最大单步角度接近目标旋转的方法', api: true, plain: '从当前旋转向目标旋转前进，每次最多改变指定角度。', syntax: 'Quaternion next = Quaternion.RotateTowards(current, target, maxDegreesDelta);', caller: 'Quaternion 类型本身：静态方法。', input: 'current、target，以及本次最多旋转的角度。', output: '返回本步的新 Quaternion。', doesNot: '参数不是每秒角速度；若需求用度/秒，必须先乘本步时间。'}
    ]
  },
  l019: {
    bridge: '前两课处理的坐标都已在世界中。本课开始处理鼠标像素，先补上相机和目标表面，才能得到唯一世界点。',
    concepts: [
      {term: '屏幕坐标', kind: '以像素描述窗口位置的二维坐标', plain: '通常从屏幕左下角开始计数。相同像素可以对应视线上的多个世界位置，因此 x、y 不足以确定深度。'},
      {term: '视口坐标', kind: '以 0 到 1 比例描述画面位置的坐标', plain: '中心通常是 (0.5,0.5)。它减少了对固定像素尺寸的依赖，但仍没有自动给出世界深度。'},
      {term: 'Camera.ScreenPointToRay', kind: '从相机穿过屏幕点建立射线的方法', api: true, plain: '把一个屏幕位置变成从相机出发、穿过该像素的世界射线。', syntax: 'Ray ray = camera.ScreenPointToRay(screenPoint);', caller: 'camera：决定采用哪台相机的位置、朝向和投影。', input: 'screenPoint：屏幕像素位置。', output: '返回世界空间中的 Ray，包含起点和方向。', doesNot: '不会自动选择地面、墙体或射线上的唯一距离。'},
      {term: 'Plane.Raycast', kind: '几何平面的射线求交方法', api: true, plain: '检查一条 Ray 是否与这个无限数学平面相交，并给出沿射线的距离。', syntax: 'bool hit = plane.Raycast(ray, out float enter);', caller: 'plane：要测试的数学平面。', input: 'ray：射线；enter：接收交点距离。', output: '返回是否相交；成功时可用 ray.GetPoint(enter) 得到世界交点。', doesNot: '不会查询场景中的 Collider，也不会处理墙体遮挡。'}
    ]
  },
  l020: {
    bridge: '第 16 课已经完整学习 TransformPoint。本课不再重新教坐标系，而是比较“位置点、位移向量、纯方向”三种量应选择哪种转换。',
    concepts: [
      {term: '位置点 / 位移向量 / 方向', kind: '三种含义不同的 Vector3', plain: '位置点需要原点；位移向量有方向和长度但不含世界原点；纯方向通常只关心朝向。数字相同不代表应使用同一种转换。'},
      {term: 'TransformVector', kind: 'Transform 组件的向量转换方法', api: true, plain: '把局部位移向量换算为世界向量，包含旋转和缩放影响，但不加入对象平移。', syntax: 'Vector3 worldOffset = root.TransformVector(localOffset);', caller: 'root：规定局部向量所属的坐标系。', input: 'localOffset：局部空间中的位移向量。', output: 'worldOffset：世界空间中的位移向量。', doesNot: '不会返回世界位置点，也不会移动对象。'},
      {term: 'TransformDirection', kind: 'Transform 组件的方向转换方法', api: true, plain: '把局部方向换成世界方向，不受平移和缩放影响。', syntax: 'Vector3 worldDirection = root.TransformDirection(localDirection);', caller: 'root：规定局部方向所属的坐标系。', input: 'localDirection：局部空间中的方向向量。', output: 'worldDirection：世界空间中的方向，长度与输入相同。', doesNot: '不会自动归一化，也不会把长度强制变成 1。'},
      {term: 'lossyScale', kind: 'Transform 的世界缩放近似属性', plain: '它用三个数近似描述层级产生的世界缩放。非均匀缩放与旋转组合产生剪切时，三个分量不足以完整还原整套变换。'}
    ]
  },
  l021: {
    bridge: '空间章节已经分清速度与位移。本课补上“这一步经过多少时间”，并区分游戏时间、真实时间和固定模拟步。',
    concepts: [
      {term: 'deltaTime', kind: '当前更新阶段的时间增量', plain: '常用于把每秒速度换成本步位移。它受 timeScale 影响，也不保证每个渲染帧相同。'},
      {term: 'fixedDeltaTime', kind: '固定模拟步长设置', plain: '它描述固定更新的时间步，不是当前显示帧间隔。默认常见值为 0.02 秒，但项目可以修改。'},
      {term: 'timeScale', kind: '游戏时间相对真实时间的全局比例', plain: '设为 0 会让相应缩放时间不再前进，但不会自动阻止所有 Update 代码或所有系统工作。'},
      {term: 'unscaledDeltaTime', kind: '不受 timeScale 影响的时间增量', plain: '适合暂停时仍需推进的菜单动画或计时，但是否继续仍是该系统自己的规则。'}
    ]
  },
  l022: {
    bridge: '第 21 课区分了几种时间。本课把时间用于协程等待，重点是等待条件与恢复阶段，不把秒数误解为精确闹钟。',
    concepts: [
      {term: 'yield', kind: '协程暂时交出执行的位置', plain: '协程运行到这里暂停，Unity 在相应条件满足后的阶段继续后面的代码。'},
      {term: 'WaitForSeconds', kind: '按缩放游戏时间等待的指令', plain: '等待时会受 timeScale 影响，恢复只能发生在某个后续帧，因此不保证恰好在指定的墙钟时刻继续。'},
      {term: 'WaitForSecondsRealtime', kind: '按非缩放时间等待的指令', plain: '不随 timeScale 缩放，适合暂停期间仍需计时的协程；它仍受帧边界影响。'},
      {term: 'WaitUntil', kind: '等待条件为真的指令', plain: '每次检查一个明确完成条件。等待资源或状态时，它比猜一个固定延时更能表达真正依赖。'}
    ]
  },
  l023: {
    bridge: '第 14、22 课用协程表达分段流程。本课学习 async / await 的另一种写法，并明确“等待”不等于“后台线程”。',
    concepts: [
      {term: 'async 方法', kind: '可以使用 await 分段继续的方法', plain: 'async 改变流程表达和返回方式，不保证方法自动离开主线程。具体操作在哪个线程完成，要看等待对象。'},
      {term: 'Awaitable', kind: 'Unity 提供的可等待类型', plain: '它用于等待帧、异步操作或线程切换等 Unity 流程。一个 Awaitable 实例不能随意按可重复 Task 使用。'},
      {term: 'CancellationToken', kind: '向异步流程传递取消请求的值', plain: '取消是协作式的：等待和代码需要观察令牌并停止后续操作。禁用期与销毁期可能需要不同的取消范围。'},
      {term: '主线程', kind: '大多数 Unity 场景 API 所属的线程', plain: 'Transform、GameObject 等对象通常应在主线程访问。后台计算完成后，需要回到允许的线程再改场景。'}
    ]
  },
  l024: {
    bridge: '上一课处理一次异步流程。本课处理重复计时：一帧越过一个或多个周期时，系统要明确补发、合并还是跳过。',
    concepts: [
      {term: '周期', kind: '两次计划触发之间的目标时间', plain: '“每 1 秒一次”先要说明按哪种时钟，以及卡顿后是否保留原有节奏。'},
      {term: '超时余量', kind: '越过触发点后多出来的时间', plain: '触发后直接把计时器归零会丢掉余量，长期可能形成漂移；减去周期能保留节奏信息。'},
      {term: '漏步策略', kind: '一次更新跨过多个周期时的业务选择', plain: '可以逐次补发、合并成一次或直接跳到最新状态。没有一种策略适合所有系统。'},
      {term: '追赶上限', kind: '限制单帧补发工作量的保护', plain: '卡顿后无限 while 补发可能让当前帧更慢。上限需要与可接受的数据损失一起设计。'}
    ]
  },
  l025: {
    bridge: '第 12、21 课区分了渲染帧与固定步。本课让模拟保持固定步，同时用前后样本生成更平滑的显示位置。',
    concepts: [
      {term: '模拟状态', kind: '固定步计算出的权威结果', plain: '玩法和碰撞以它为准。显示层可以平滑它，但不应反过来偷偷改写模拟历史。'},
      {term: '显示状态', kind: '为当前画面生成的表现结果', plain: '它可以在两个模拟样本之间插值，因此看起来平滑，但可能有一个样本的延迟。'},
      {term: '插值', kind: '在已知前后样本之间取中间值', plain: '比例来自当前累计时间在固定步中的位置。插值平滑显示，不会提高模拟计算本身的频率或准确度。'},
      {term: '传送', kind: '不沿旧轨迹连续移动的状态跳变', plain: '传送时要同时重置前后显示样本，否则插值会把对象从旧位置拖到新位置。'}
    ]
  },
  l026: {
    bridge: '时间章节已经说明输入读取与固定步消费可以分开。本章先建立设备控件到玩家意图之间的映射。',
    concepts: [
      {term: 'Input Action', kind: '描述玩家意图及值类型的输入对象', plain: '例如 Move 表示移动意图，值类型为 Vector2。角色读取 Action，不必把逻辑绑定死在某个按键上。'},
      {term: 'Binding', kind: '控件到 Action 的连接规则', plain: 'WASD、方向键和手柄摇杆都可以绑定到同一个 Move Action。改绑定不必改角色移动公式。'},
      {term: 'Control', kind: '设备上的具体输入源', plain: '键盘按键、手柄摇杆轴和鼠标按钮都是控件。Binding 用路径选择它们。'},
      {term: 'Action 启用状态', kind: '是否正在监听绑定的运行状态', plain: 'Action 必须由明确的组件或代码 Enable 后才会产生有效输入；也要明确谁负责 Disable。'}
    ]
  },
  l027: {
    bridge: '上一课已经得到统一的 Move 或 Jump Action。本课比较每帧读取当前值，与在动作阶段变化时接收回调。',
    concepts: [
      {term: '轮询', kind: '在 Update 等位置主动读取当前输入', plain: '适合每帧都需要的持续值，例如移动方向。它回答“现在是多少”。'},
      {term: '回调', kind: '动作状态变化时由 Input System 调用的方法', plain: '适合按下、完成等离散时机。回调里的 context 只应在回调期间读取，所需数据要复制出来。'},
      {term: 'started / performed / canceled', kind: 'Input Action 的三个阶段', plain: '具体何时进入各阶段由 Action 类型和 Interaction 决定，不能把 performed 永远等同于物理按键刚按下。'},
      {term: 'Interaction', kind: '解释输入过程的规则', plain: 'Press、Hold、Tap 等 Interaction 会改变阶段时机。选择它们前先定义按下、保持和完成的业务含义。'}
    ]
  },
  l028: {
    bridge: '第 26、27 课依次介绍 Action、状态和回调。本课把一组 Action 按玩法模式组织，并让每位玩家持有自己的输入实例。',
    concepts: [
      {term: 'Action Map', kind: '一组相关 Input Action', plain: '例如 Gameplay 与 UI。切换 Map 表达当前允许哪些行为，不等于切换了物理设备。'},
      {term: 'PlayerInput', kind: '管理某位玩家输入副本的组件', plain: '它可以管理 Action、通知方式、当前 Map 和设备配对。多人时应读取对应玩家的 Actions。', find: '选中玩家 GameObject，在 Inspector 中 Add Component > Player Input。'},
      {term: 'Control Scheme', kind: '一组设备与绑定要求', plain: '例如 Keyboard&Mouse 或 Gamepad。它描述设备组合，不是 Gameplay / UI 这种输入模式。'},
      {term: '缓存清理', kind: '切换模式时由消费者负责的状态处理', plain: '停用 Map 不会替移动脚本清空之前保存的方向或一次请求。切换时要显式处理旧输入。'}
    ]
  },
  l029: {
    bridge: '上一课让每位玩家拥有自己的 Action。现在只覆盖这位玩家的绑定，不修改项目中作为默认值的原始配置。',
    concepts: [
      {term: '默认路径', kind: 'Input Action Asset 中保存的原始 Binding 路径', plain: '它是项目提供的起点，运行时改键通常不应直接破坏这份默认配置。'},
      {term: 'Binding Override', kind: '叠加在默认 Binding 上的运行时覆盖', plain: '覆盖路径优先成为有效路径，可以保存为玩家数据并在之后恢复。'},
      {term: 'effectivePath', kind: '当前真正生效的控件路径', plain: '有 Override 时反映覆盖结果，否则来自默认路径。显示按键提示时应区分它与原始 path。'},
      {term: 'RebindingOperation', kind: '一次交互式改键过程', plain: '它会监听候选控件，并需要处理完成、取消、冲突与释放。改键期间也要限制正常玩法输入。'}
    ]
  },
  l030: {
    bridge: '第 12 课已经知道 Update 与 FixedUpdate 不总是一一对应。本课把输入先记录下来，再由满足条件的固定步消费。',
    concepts: [
      {term: '持续状态', kind: '在一段时间内一直有效的输入', plain: '例如移动方向。固定步通常读取最新状态，不需要把每一帧相同方向都排成请求队列。'},
      {term: '一次请求', kind: '成功处理一次后就应清除的输入', plain: '例如跳跃按下。只保存当前按键状态可能漏掉两次固定步之间短暂发生的按下。'},
      {term: '输入缓冲', kind: '短时间保留一次请求的机制', plain: '请求带有过期时间。条件暂时不满足时可以稍后消费，但不能无限保留或重复执行。'},
      {term: '消费', kind: '执行请求并改变其待处理状态', plain: '只有真正成功执行后才清除，还是尝试后立即清除，要由玩法规则明确；测试必须证明不会漏也不会重复。'}
    ]
  }
};
