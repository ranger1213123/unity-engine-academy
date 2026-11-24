import fs from 'node:fs';
import path from 'node:path';
import {root, loadContent} from './content-loader.mjs';

// This layer runs after the editorial and contextual revisions. It keeps the
// second chapter teachable without discarding profile-stable lesson IDs,
// schedules, rubric scores, or quiz answer indexes.
const modules = loadContent();
const module = modules.find(item => item.number === 2);
if (!module) throw new Error('Chapter 02 not found');

const lesson = id => {
  const value = module.lessons.find(item => item.id === id);
  if (!value) throw new Error(`Lesson ${id} not found`);
  return value;
};

const section = (title, ...paragraphs) => ({title, paragraphs});
const file = (filename, source) => ({filename, source});
const reference = (label, url) => ({label, url});

module.description = '先补齐 Unity 脚本真正会用到的 C# 基础：数值与对象、Inspector 字段、组件获取、事件关系和对象列表。每课只解决一个核心问题，术语第一次出现时都配具体对象和可运行实验。';

{
  const l = lesson('l006');
  l.goals = [
    '看懂变量、值、类型和对象这四个词分别指什么',
    '预测 Vector3 数值复制与 Transform 引用复制的不同结果',
    '解释 Unity 对象销毁后两种空值判断为何可能不同'
  ];
  l.theory = [
    section('先把四个词放进一行代码里',
      '看 `Vector3 position = new Vector3(1, 2, 3);`：`position` 是变量名，也就是代码里用来找到这份数据的名字；`Vector3` 是类型，规定这份数据由 x、y、z 三个数值组成；右侧创建出的 `(1,2,3)` 是当前值。类型决定能保存什么、能调用什么，变量只是你在这段代码中使用它的入口。',
      '再看 `Transform target = transform;`。`target` 仍是变量，`Transform` 仍是类型，但变量里保存的不是一整份场景对象副本，而是指向某个 Transform 组件的引用。初学时不要先背“栈”和“堆”；先问这次赋值复制的是数值本身，还是通往同一个对象的引用。'),
    section('值类型复制一份数值',
      '令 `Vector3 a=(1,2,3)`，再执行 `Vector3 b=a`。`Vector3` 是结构体，属于值类型，所以 b 得到一份独立的三个数值。随后只写 `b.x=9`，结果是 a 仍为 `(1,2,3)`，b 变为 `(9,2,3)`。两个变量的内容起初相同，不代表以后会自动同步。',
      '数值复制最容易混淆的地方，是“相同”与“同一个”并不是一回事。两张纸都写着 5，它们的内容相同；改掉第二张纸，不会改第一张纸。Vector2、Vector3、Color 和 Quaternion 等 Unity 结构体，在普通赋值时都应先按这个模型理解。'),
    section('引用类型可以共同指向一个对象',
      '让 `Transform first=transform`，再执行 `Transform second=first`。此时复制的是引用，两条引用都通向同一个 Transform 组件。通过 second 修改 `position`，first 随后读到的新位置也会变化，因为被修改的是两者共同指向的对象。',
      '如果把 second 重新赋为另一个 Transform，只是让 second 改指向，first 不会跟着换目标。调试时可以画变量框和箭头：赋值引用是复制箭头，经引用修改成员是改箭头所指的对象。把这两种动作分开，便不会把“换目标”和“改目标”混成一件事。'),
    section('Unity 对象还有引擎内部的一层',
      'GameObject、Transform 等 Unity 对象在 C# 一侧有托管包装，真正的引擎对象由 Unity 管理。调用 `Destroy(target)` 后，销毁通常在当前 Update 循环结束后生效；引擎对象失效时，C# 变量仍可能保留包装引用。变量里还有一条引用，不等于引用所对应的引擎对象仍可使用。',
      '因此销毁完成后，`target == null` 可能为 true，而 `ReferenceEquals(target, null)` 为 false。前者会使用 UnityEngine.Object 的特殊比较，连对应引擎对象是否仍存在也纳入判断；后者只检查 C# 包装引用本身是不是普通 null。两行代码回答的问题不同，所以结果不同并不矛盾。'),
    section('读取 position 得到的是 Vector3 值',
      '`transform.position` 的类型是 Vector3。把它读到 `local` 后，local 是一个数值副本；修改 `local.x` 只改副本，还没有把结果写回 Transform。正确过程是先读取完整位置、修改副本，再执行 `transform.position=local`。',
      '这里不是说“属性都不能改”，而是要看属性返回的类型和真正的写入发生在哪里。遇到“数值已经变了，物体却没动”，先打印 local 和 transform.position，再检查是否漏了最后一次完整赋值。这样能指出断在哪一步，而不是靠换一种语法碰运气。'),
    section('空值简写不等于 Unity 对象有效性检查',
      '对普通 C# 引用，`?.`、`??`、`is null` 都有各自明确的空引用语义。UnityEngine.Object 还叠加了引擎对象寿命；已经 Destroy 的对象可能不是普通 C# null，却会被 Unity 的 `== null` 判断为失效。因此不要因为写法更短，就假设它检查了同一件事。',
      '可以把“正常对象、真正的 C# null、已销毁但包装引用仍在”写成三行，再分别预测 `== null`、`is null` 和 `ReferenceEquals`。这张表的目的不是让你以后到处写三种判断，而是弄清楚它们为何不同。场景逻辑通常应保留明确的 Unity 类型，并在每次真正使用目标的边界检查它是否仍有效。'),
    section('等待之后要重新检查当时的事实',
      '假设协程先取得敌人的 Transform，确认它有效，然后等待一帧。等待期间，另一个脚本可能销毁敌人。等待前的判断只证明当时的状态，不能替恢复后的访问提供保证；继续读取 position 前应重新检查。',
      '对象被禁用和对象被销毁也不是同一状态。禁用通常保留实例，只是改变参与哪些系统和回调；销毁则让引擎对象失效。实验要分别覆盖正常目标、等待中禁用和等待中销毁，并记录每种情况下变量与对象发生了什么，不要用一句“引用丢了”概括三种不同结果。')
  ];
  l.summary = [
    '赋值前先判断复制的是数值还是指向对象的引用。',
    'Unity 对象的包装引用仍在，不代表对应引擎对象仍可使用。'
  ];
  l.teaching.question = '同样是赋值，为什么改 Vector3 副本不影响原值，改 Transform 指向的对象却能被两个变量同时看到？';
  l.teaching.keyIdea = '值类型变量直接保存并复制数值；引用类型变量保存并复制通往对象的引用。UnityEngine.Object 还要额外检查引用背后的引擎对象是否已经销毁。';
  l.teaching.purpose = '看懂脚本中的变量究竟保存了什么，并在对象经过等待或销毁后做出正确判断。';
}

{
  const l = lesson('l007');
  l.goals = [
    '区分字段、属性、方法和 Inspector 输入框',
    '让私有字段参与 Unity 序列化，同时控制其他脚本的修改入口',
    '用完整调用脚本验证合法值与非法值的处理结果'
  ];
  l.theory = [
    section('先认识组件里的三个入口',
      '字段是对象保存数据的位置，例如 `float speed`。属性是代码读取或设置数据的入口，例如 `public float Speed => speed`。方法是一段可以被调用的行为，例如 `TrySetSpeed(3f)`。Inspector 中看见的输入框通常对应可序列化字段，并不是“脚本中所有变量和方法的窗口”。',
      '本课有两个脚本。`SpeedSettings` 保存速度并决定哪些值允许写入；`SpeedCaller` 负责提供测试输入。只把第一个脚本挂到对象上，不会有人自动调用 `TrySetSpeed`，物体也不会自己移动。必须有调用者或编辑器测试命令，方法才会执行。'),
    section('代码访问和 Inspector 保存是两个问题',
      '`public float speed` 同时让其他代码能直接赋值，并通常让 Unity 序列化这个字段。很多初学代码因此误以为 public 的意思就是“显示在 Inspector”。其实 public 是 C# 访问权限；Unity 是否保存字段还要看序列化规则。',
      '写成 `[SerializeField] private float speed` 后，speed 仍是私有字段，其他类不能直接写它，但 Unity 可以把符合规则的值显示并保存到场景或 Prefab。这样便能把“设计者需要配置”和“任意脚本能否绕过规则修改”分开。'),
    section('序列化保存的是配置，不是整块运行内存',
      '序列化可以理解为：Unity 把符合规则的字段值写进场景、Prefab 或资源，之后再还原。它不会把脚本运行时的所有内存原样保存。普通属性、局部变量和 static 字段，都不能因为代码里存在就自动成为场景配置。',
      '测试时分别声明普通 private 字段、`[SerializeField] private` 字段、public 字段、只读属性和 static 字段。先看 Inspector 中出现哪些，再保存并重新打开场景。每一项都记录“其他脚本能否直接访问”和“Unity 是否保存”，不要只用“看得见”替代这两个问题。'),
    section('属性可以限制入口，但不会冻结对象',
      '`public float Speed => speed` 只提供 getter，所以外部代码可以读取 `settings.Speed`，不能通过这个属性写入。组件内部仍可修改 speed，Inspector 也仍能编辑被序列化的字段。只读属性限制的是这条公开入口，不是让整个组件从此不可改变。',
      '属性 getter 也是代码。有的只返回字段，有的会计算或查找对象，所以“写起来像字段”不等于永远没有成本。当前 Speed 只是返回一个 float，先按最简单情况理解；以后高频读取陌生属性时，再查看其定义和实际调用频率。'),
    section('修改规则放在真正会被调用的方法里',
      '`TrySetSpeed` 先检查 NaN、Infinity 和负数。输入不合法时返回 false，并保留原 speed；合法时才赋值并返回 true。Try 前缀在这里表示“尝试做一件可能失败的事”，调用者必须读取布尔结果，不能假设请求一定成功。',
      '`[Min(0f)]` 主要帮助 Inspector 输入，不会拦住所有 C# 调用。`SpeedCaller` 在播放模式通过组件菜单依次传入 -2、3、NaN 和正无穷，并同时打印参数、返回值与最终 Speed。这样既能看见方法说成功还是失败，也能确认失败后旧数据没有被污染。'),
    section('实例字段与 static 字段回答不同的归属问题',
      '场景中有 SettingsA 和 SettingsB 两个组件实例时，普通 speed 字段各有一份。修改 A 不会自动修改 B。static 字段则属于类型本身，所有实例看到同一份共享值，所以不适合直接保存每个角色各自的当前生命或速度。',
      'static 并不是坏语法，关键是数据本来属于谁。全局统计可能需要共享，每个角色的当前状态通常应跟随角色实例。决定字段放哪里前，先把句子补完整：“这是哪一个对象的值，还是所有实例共同的值？”'),
    section('Inspector 赋值不会自动调用你的修改方法',
      '设计者直接改 Inspector 中的 speed 时，Unity 写入序列化字段，不会自动改成调用 `TrySetSpeed`。因此 Inspector 辅助、运行时代码入口和加载旧数据是不同路径。简单下限可以用 Min 帮助输入，真正不能破坏的运行规则仍要在使用边界验证。',
      '本课先把这几条路径分开，不急着把全部校验塞进一个技巧。后续遇到跨字段约束、旧数据迁移或编辑器校验时，再学习 OnValidate 等工具。此时最重要的是能指出某个值从哪里进入、经过了哪条检查、最后保存在谁身上。')
  ];
  l.teaching.comparison = {
    caption: '同一个“速度”可以通过不同成员暴露；先看访问和保存，再决定写法。',
    headers: ['写法', '其他脚本可直接访问', '默认是否显示并保存', '本课用途'],
    rows: [
      ['private float speed', '不可以', '不可以', '只供组件内部使用的运行数据'],
      ['[SerializeField] private float speed', '不可以', '可以', 'Inspector 配置，同时保留私有访问'],
      ['public float speed', '可以读写', '通常可以', '确实允许外部任意写入时才使用'],
      ['public float Speed => speed', '只可读取', '属性本身不按字段保存', '给外部提供受控读取入口'],
      ['static float speed', '取决于访问修饰符', '不按普通实例字段保存', '所有实例共享的一份类型状态']
    ]
  };
  l.code = {
    title: '速度配置与完整测试调用者',
    language: 'csharp',
    files: [
      file('SpeedSettings.cs', `using UnityEngine;

public sealed class SpeedSettings : MonoBehaviour
{
    [SerializeField, Min(0f)] private float speed = 5f;

    public float Speed => speed;

    public bool TrySetSpeed(float value)
    {
        if (float.IsNaN(value) || float.IsInfinity(value) || value < 0f)
            return false;

        speed = value;
        return true;
    }
}`),
      file('SpeedCaller.cs', `using UnityEngine;

public sealed class SpeedCaller : MonoBehaviour
{
    [SerializeField] private SpeedSettings settings;

    [ContextMenu("Run speed tests")]
    private void RunSpeedTests()
    {
        if (!Application.isPlaying)
        {
            Debug.LogWarning("Enter Play Mode before running the tests.", this);
            return;
        }

        if (settings == null)
        {
            Debug.LogError("Assign Speed Settings in the Inspector.", this);
            return;
        }

        Test(-2f);
        Test(3f);
        Test(float.NaN);
        Test(float.PositiveInfinity);
    }

    private void Test(float value)
    {
        bool accepted = settings.TrySetSpeed(value);
        Debug.Log($"input={value}, accepted={accepted}, speed={settings.Speed}", this);
    }
}`)
    ],
    explanation: [
      '把两个脚本挂到同一个 Settings 对象。将该对象上的 SpeedSettings 组件拖进 SpeedCaller 的 Settings 槽；拖的是组件引用，不是脚本文件。',
      '进入 Play，打开 SpeedCaller 组件右上角三点菜单，选择 Run speed tests。菜单命令才是本例调用入口；SpeedSettings 本身不会自动移动对象或自动运行测试。'
    ]
  };
  l.lab[1].setup = [
    '把本课两个完整文件放进 Assets/Scripts，等待 Console 没有编译错误。创建空对象 Settings，给它依次添加 SpeedSettings 和 SpeedCaller。',
    '在 SpeedCaller 的 Settings 槽中，把同一对象上的 SpeedSettings 组件拖入。进入 Play 后，从 SpeedCaller 组件三点菜单选择 Run speed tests。',
    'Console 关闭 Collapse。逐行记录 input、accepted 和 speed；复制 Settings 为 SettingsB 时，也分别拖好各自的 Settings 槽，并在日志对象上下文中区分实例。'
  ];
  l.references = [
    reference('SerializeField', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SerializeField.html'),
    reference('MinAttribute', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MinAttribute.html'),
    reference('ContextMenu', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ContextMenu.html')
  ];
  l.teaching.scenario = 'Settings 对象上同时挂 SpeedSettings 和 SpeedCaller。SpeedSettings 保存 speed；SpeedCaller 通过 Inspector 槽取得这个组件，并由组件菜单传入四个测试值。没有调用者时，TrySetSpeed 不会自己执行。';
  l.teaching.purpose = '分清字段、属性、方法和 Inspector 的职责，并能亲手运行一个不会缺调用脚本的完整实验。';
}

{
  const l = lesson('l008');
  l.title = 'GetComponent 家族：从哪里找、找一个还是找全部';
  l.goals = [
    '看懂 GetComponent<T>() 中调用对象、类型参数和返回值',
    '按当前对象、子级、父级以及单个、全部选择获取方法',
    '区分 GetComponent、TryGetComponent、Inspector 引用和保存结果'
  ];
  l.theory = [
    section('先逐段读懂最常见的一行',
      '`Rigidbody2D body = GetComponent<Rigidbody2D>();` 可以拆成四部分：左侧 `Rigidbody2D` 是变量类型，`body` 是变量名，`GetComponent` 是要调用的方法，尖括号里的 `Rigidbody2D` 是要寻找的组件类型。返回值找到时是一份组件引用，当前对象没有这种组件时则是 null。',
      '脚本继承 MonoBehaviour，而 MonoBehaviour 本身也是 Component，所以可以直接写 `GetComponent<T>()`。没有写调用对象时，调用者就是挂载这段脚本的那个组件，搜索目标是该组件所在的 GameObject。也可以写 `gameObject.GetComponent<T>()`，意思更显式，但搜索范围相同。'),
    section('当前对象：一个用 GetComponent，全部用 GetComponents',
      '`GetComponent<T>()` 只检查当前 GameObject，并返回一个匹配组件。它不会自动向子级、父级或整个场景扩大范围。对象上允许存在多个同类型组件时，“得到一个”也不等于“已经确认是业务想要的那个”。',
      '`GetComponents<T>()` 同样只检查当前 GameObject，但返回全部匹配项。数组长度为 0 表示没有找到。若一个对象有两个 Collider2D，需要逐个检查，就应使用复数形式；不要连续调用单数方法并期待它自动给出下一个。'),
    section('当前对象的可读失败分支：TryGetComponent',
      '`TryGetComponent<T>(out T component)` 也只检查当前 GameObject。找到时把引用写入 out 变量并返回 true，找不到时把变量设为 null 并返回 false。`out` 表示方法除了返回布尔值，还会给调用者写出一个结果变量。',
      '它与 GetComponent 的搜索范围相同，区别主要在调用形状：`if (TryGetComponent(out body))` 把“尝试获取”和“是否成功”写在同一个条件里。它不会搜索子对象，也不会在失败时自动添加组件。想让缺失组件自动补上，要讨论的是 RequireComponent 或明确的创建逻辑。'),
    section('向下找：InChildren 也会先检查自己',
      '`GetComponentInChildren<T>()` 先检查调用对象自身，再按层级向下搜索子孙对象，返回第一个匹配项。名字里的 InChildren 很容易让人误以为会跳过自己，官方说明明确指出调用对象自身始终会被检查。',
      '默认调用不包含未激活的子对象；传入 `true` 可以包含它们，例如 `GetComponentsInChildren<SpriteRenderer>(true)`。复数版本返回自身和后代中的全部匹配项。单数版本遇到多个候选时只给出一个，而且同一对象上多个组件的检查顺序没有业务保证，因此关键目标不应依赖“碰巧先找到谁”。'),
    section('向上找：InParent 也从自己开始',
      '`GetComponentInParent<T>()` 先检查调用对象自身，再沿父级向上寻找，返回第一个匹配项。`GetComponentsInParent<T>()` 返回自身与父级链上的全部匹配项。它们适合表达“从武器找到所属角色”或“从界面子元素找到外层控制器”这类层级关系。',
      '带 `includeInactive` 的重载可以决定是否把未激活父对象纳入遍历。无论选哪种方法，都要先画出实际 Hierarchy，再说“向上”究竟经过哪些对象。若对象运行时会被换父，查找结果也可能随结构变化。'),
    section('泛型、Type 和字符串是同一目的的不同重载',
      '官方 API 还提供 `GetComponent(typeof(Rigidbody2D))` 这样的 Type 重载，以及接受类型名称字符串的旧式重载。它们都在表达“找某种组件”，但返回类型和类型检查方式不同。初学阶段优先写泛型 `GetComponent<Rigidbody2D>()`：结果类型明确，重命名类型时也更容易由编译器发现问题。',
      '知道其他重载存在，是为了看官方文档时不困惑，不是要求把每种写法都混进项目。Type 重载常见于运行时才拿到 System.Type 的工具代码；字符串写法效率更低，也更容易把拼写错误拖到运行时，普通玩法脚本没有必要优先使用。'),
    section('组件家族不等于场景全局查找',
      'GetComponent 家族围绕“当前对象及它的父子层级”工作。它不会从整个场景任意挑一个同类型对象。Unity 另有按场景查找对象的 API，但那是范围更大的另一类工具，不能把它们都简称成 GetComponent。',
      '如果脚本只应控制一个明确的 Body，最清楚的做法有时是在 Inspector 暴露 `SpriteRenderer body`，由设计者把指定组件拖入，而不是每次从多个子级猜一个。获取方法与 Inspector 引用都不是永远更好的答案；要看关系是“同对象固定依赖”“稳定层级关系”还是“人为指定目标”。'),
    section('只在这里正式讨论保存查找结果',
      '同一组件会反复使用固定 Rigidbody2D 时，可以在 Awake 获取一次并保存到字段，之后直接使用这份引用。这通常叫缓存组件引用。它避免重复查找，也让缺失依赖能在初始化附近暴露。',
      '保存引用不会复制组件，也不会阻止别的系统销毁目标。若目标会被替换或销毁，就要规定由谁重新赋值、何时停止使用。第 6 课讲的是引用与对象寿命；本课只把那条规则应用到组件获取，不再把“缓存”当成每一课都要重新讲的独立主题。')
  ];
  l.teaching = {
    scenario: '在 Hierarchy 建立 Actors/Player/Body 和 Actors/Player/Shadow。探针挂在 Player：Player 自己有 Rigidbody2D 和两个 Collider2D；Body 有 SpriteRenderer；Shadow 也有 SpriteRenderer，但对象先设为未激活；Actors 有 AudioSource。现在每个问题都有明确范围和预期数量。',
    question: '脚本要取得这些组件时，怎样根据“当前、向下、向上”和“一个、全部”选择正确方法？',
    purpose: '看到任何 GetComponent 家族调用，都能说清从哪个对象开始、搜索哪一段层级、返回一个还是多个，以及找不到时得到什么。',
    keyIdea: '先确定搜索范围，再确定结果数量，最后决定失败分支。方法名不是要背的七个孤立单词，而是“方向 + 单复数 + 获取方式”的组合。',
    walkthrough: [
      {title: '先查 Player 自身', text: '在 Player 上调用 GetComponent<Rigidbody2D>() 应取得 Player 的刚体；调用 GetComponents<Collider2D>() 应取得 Player 上全部二维碰撞组件，不查看 Body。'},
      {title: '再比较活动与未活动子级', text: '调用 GetComponentInChildren<SpriteRenderer>() 时先查 Player，再向下找活动子级；Shadow 未激活时默认不计入。复数版本传 true 后，Body 与 Shadow 都应出现在结果里。'},
      {title: '最后沿父级向上', text: '从 Player 调用 GetComponentInParent<AudioSource>(true)，先检查 Player，再检查 Actors，最终取得 Actors 上的 AudioSource。输出组件类型和所在对象名，不能只写“找到了”。'}
    ],
    comparison: {
      caption: 'GetComponent 家族选择表。这里的“自身”都是调用方法的那个 GameObject。',
      headers: ['方法', '搜索范围', '结果数量', '未激活对象', '未找到'],
      rows: [
        ['GetComponent<T>()', '仅自身', '一个', '自身活动状态不影响取得自身组件', 'null'],
        ['TryGetComponent<T>(out value)', '仅自身', '一个', '自身活动状态不影响取得自身组件', 'false，value 为 null'],
        ['GetComponents<T>()', '仅自身', '全部', '自身活动状态不影响取得自身组件', '空数组'],
        ['GetComponentInChildren<T>()', '自身，再向下', '第一个', '默认跳过未激活子级；可传 true', 'null'],
        ['GetComponentsInChildren<T>()', '自身和全部后代', '全部', '默认跳过未激活子级；可传 true', '空数组'],
        ['GetComponentInParent<T>()', '自身，再向上', '第一个', '可用 includeInactive 重载控制父级', 'null'],
        ['GetComponentsInParent<T>()', '自身和父级链', '全部', '可用 includeInactive 重载控制父级', '空数组']
      ]
    },
    prediction: {
      scenario: 'Player 自己后来也添加了 SpriteRenderer，Body 仍保留另一个 SpriteRenderer。探针继续从 Player 调用单数 GetComponentInChildren<SpriteRenderer>()。',
      question: '它还会跳过 Player，直接返回 Body 上的 SpriteRenderer 吗？',
      answer: '不会。InChildren 会先检查调用对象自身；Player 已有匹配组件时，单数方法会先返回它。若业务明确需要 Body，应使用可核对的显式引用，或让层级与查找规则能唯一确定目标。'
    }
  };
  l.code = {
    title: '一次输出七种获取结果的完整探针',
    language: 'csharp',
    files: [
      file('ComponentLookupProbe.cs', `using UnityEngine;

public sealed class ComponentLookupProbe : MonoBehaviour
{
    [ContextMenu("Report component lookups")]
    private void Report()
    {
        Rigidbody2D current = GetComponent<Rigidbody2D>();
        bool foundCurrent = TryGetComponent<Rigidbody2D>(out Rigidbody2D currentViaTry);
        Collider2D[] currentColliders = GetComponents<Collider2D>();
        SpriteRenderer firstBelow = GetComponentInChildren<SpriteRenderer>();
        SpriteRenderer[] allBelow = GetComponentsInChildren<SpriteRenderer>(true);
        AudioSource firstAbove = GetComponentInParent<AudioSource>(true);
        AudioSource[] allAbove = GetComponentsInParent<AudioSource>(true);

        Debug.Log($"GetComponent: {Label(current)}", this);
        Debug.Log($"TryGetComponent: {foundCurrent}, {Label(currentViaTry)}", this);
        Debug.Log($"GetComponents: {Labels(currentColliders)}", this);
        Debug.Log($"GetComponentInChildren: {Label(firstBelow)}", this);
        Debug.Log($"GetComponentsInChildren(true): {Labels(allBelow)}", this);
        Debug.Log($"GetComponentInParent(true): {Label(firstAbove)}", this);
        Debug.Log($"GetComponentsInParent(true): {Labels(allAbove)}", this);
    }

    private static string Label(Component item)
    {
        return item == null ? "not found" : $"{item.GetType().Name} on {item.gameObject.name}";
    }

    private static string Labels<T>(T[] items) where T : Component
    {
        if (items.Length == 0) return "none";

        string[] labels = new string[items.Length];
        for (int i = 0; i < items.Length; i++)
            labels[i] = Label(items[i]);

        return string.Join(", ", labels);
    }
}`),
      file('RendererDependency.cs', `using UnityEngine;

[RequireComponent(typeof(SpriteRenderer))]
public sealed class RendererDependency : MonoBehaviour
{
    private SpriteRenderer view;

    private void Awake()
    {
        if (!TryGetComponent<SpriteRenderer>(out view))
        {
            Debug.LogError("SpriteRenderer is required on this GameObject.", this);
            enabled = false;
        }
    }

    public void SetVisible(bool value)
    {
        if (view != null)
            view.enabled = value;
    }
}`)
    ],
    explanation: [
      'ComponentLookupProbe 是查找范围实验。按说明搭好 Actors/Player/Body/Shadow，把探针挂 Player，进入 Play 后从组件三点菜单执行 Report component lookups；Console 每行都会给出类型和对象名。',
      'RendererDependency 是另一个独立实验：它要求 SpriteRenderer 与脚本在同一对象上，用来比较 RequireComponent 与 TryGetComponent。不要把它挂到只有子级 SpriteRenderer 的 Player 后，误以为它会展示子级查找。'
    ]
  };
  l.lab[0] = {
    ...l.lab[0],
    title: '把七种方法放进同一棵层级验证',
    purpose: '用一套固定 Hierarchy 对照当前、向下、向上以及单数、复数结果。',
    steps: [
      '按准备说明建立对象和组件，先画出预期：每种方法应返回哪些对象。',
      '运行完整 ComponentLookupProbe，从组件菜单执行报告，把七行结果与方法选择表逐项对照。',
      '依次激活 Shadow、给 Player 添加 SpriteRenderer、移除一个 Collider2D；每次只改一项并重新报告。'
    ],
    result: '每种结果都能由起点、方向、数量和活动状态解释，并能指出组件所在对象。',
    setup: [
      '创建空对象 Actors，再创建子对象 Player；在 Player 下创建 Body 和 Shadow。最终 Hierarchy 为 Actors/Player/Body 与 Actors/Player/Shadow。',
      '给 Actors 添加 AudioSource；给 Player 添加 Rigidbody2D、BoxCollider2D、CircleCollider2D 和 ComponentLookupProbe；给 Body、Shadow 各添加 SpriteRenderer。先取消 Shadow 对象左侧活动勾选。',
      'SpriteRenderer 的 Sprite 槽可以为空，因为本实验只查组件是否存在。进入 Play，选中 Player，在 ComponentLookupProbe 右上角三点菜单选择 Report component lookups，Console 关闭 Collapse。'
    ]
  };
  l.lab[1] = {
    ...l.lab[1],
    title: '比较自动补依赖、失败分支和显式引用',
    purpose: '分清 RequireComponent、TryGetComponent 和 Inspector 指定目标各自解决什么。',
    steps: [
      '给新空对象添加 RendererDependency，观察 Unity 同时添加同对象 SpriteRenderer；再核对 Awake 的 TryGetComponent 只查当前对象。',
      '建立一个带 [SerializeField] SpriteRenderer 槽的对照脚本，分别拖入 Body 与 Shadow，确认显式引用不会因为候选顺序改变而换目标。',
      '在实验副本销毁被引用对象，等销毁生效后再使用引用；记录失败并选择停止操作或由明确流程重新赋值。'
    ],
    result: '能说明添加时辅助、运行时获取、人工指定和对象销毁是四个不同问题。',
    setup: [
      '另建空对象 RequiredView，添加 RendererDependency，观察 Inspector 是否自动出现同对象 SpriteRenderer。这个对象不沿用 Player 的父子查找层级。',
      '显式引用对照脚本可只含 [SerializeField] private SpriteRenderer target 和一个报告 target.gameObject.name 的 ContextMenu 方法；把 Body 或 Shadow 的组件拖入 Target 槽。',
      '销毁实验必须在 Play 中进行，并由另一个仍活动的持有者保存引用。销毁目标后至少等待到当前 Update 循环结束，再检查 Unity 对象有效性。'
    ]
  };
  l.pitfalls = [
    {symptom: '子对象有组件，GetComponent 却返回 null', cause: 'GetComponent 只查调用对象自身，没有向下搜索', fix: '先确认组件位置；需要层级搜索时选 InChildren，目标固定时考虑 Inspector 引用'},
    {symptom: 'GetComponentInChildren 返回非空，却控制了错误对象', cause: '自身或多个子级都有匹配组件，单数方法只返回其中一个', fix: '输出对象身份；改用明确结构、复数筛选或显式引用，不把非空当作找对'}
  ];
  l.exercise.brief = '建立 Equipment/Character/Visual/Shadow 四层对象，并写出一张“组件需求表”：每项先注明起点、方向、数量和是否包含未激活对象，再实现获取与身份报告。';
  l.exercise.deliverables = ['组件需求表', '完整查找探针源码', '四种层级变化前后的结果记录'];
  l.exercise.rubric = l.exercise.rubric.map((item, index) => ({...item, item: [
    '每次调用的起点与方向明确',
    '单数与复数选择符合需求',
    '未激活对象规则经过验证',
    '返回对象身份和失败分支可检查'
  ][index]}));
  l.quiz[0] = {...l.quiz[0], question: 'Player 的 SpriteRenderer 只在子对象 Body 上，Player.GetComponent<SpriteRenderer>() 会得到什么？', options: ['null，因为它只查 Player 自身', 'Body 的组件，因为会自动遍历全部子级', '场景中任意一个 SpriteRenderer', '自动在 Player 上添加一个组件'], explanation: 'GetComponent 只检查调用对象自身。父子方向必须由 InChildren 或显式引用表达。', scenario: '探针挂在 Player。Player 本身没有 SpriteRenderer，直接子对象 Body 有一个；当前只调用 Player.GetComponent<SpriteRenderer>()。'};
  l.quiz[1] = {...l.quiz[1], question: '需要取得 Player 及其后代的全部 SpriteRenderer，包括未激活的 Shadow，应选哪种写法？', options: ['GetComponent<SpriteRenderer>()', 'GetComponentsInChildren<SpriteRenderer>(true)', 'TryGetComponent<SpriteRenderer>(out value)', 'GetComponentInParent<SpriteRenderer>()'], explanation: '复数 InChildren 表示自身和后代的全部匹配项，true 表示把未激活子对象也纳入搜索。', scenario: 'Player 自身、Body 和未激活 Shadow 都可能有 SpriteRenderer；需求明确要求取得全部三个范围中的组件。'};
  l.quiz[2] = {...l.quiz[2], question: 'TryGetComponent<Rigidbody2D>(out body) 返回 false 说明什么？', options: ['它会继续每帧重试', '它已在子对象创建刚体', '当前 GameObject 没找到该类型，body 为 null', '把字段改成 static 就能找到'], explanation: 'TryGetComponent 只检查当前 GameObject，以布尔值表示成功与否，并通过 out 给出结果。', scenario: '脚本从自己所在的 Player 调用 TryGetComponent<Rigidbody2D>(out body)。Player 没有 Rigidbody2D，父级和子级即使有也不在这次搜索范围。'};
  l.references = [
    reference('Component.GetComponent', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.GetComponent.html'),
    reference('Component.TryGetComponent', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.TryGetComponent.html'),
    reference('Component.GetComponents', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.GetComponents.html'),
    reference('Component.GetComponentInChildren', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.GetComponentInChildren.html'),
    reference('Component.GetComponentsInChildren', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.GetComponentsInChildren.html'),
    reference('Component.GetComponentInParent', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.GetComponentInParent.html'),
    reference('Component.GetComponentsInParent', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Component.GetComponentsInParent.html'),
    reference('RequireComponent', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RequireComponent.html')
  ];
  l.summary = [
    '先定起点和方向，再选单数或复数；TryGet 只改变失败分支，不扩大范围。',
    'InChildren 与 InParent 都先检查调用对象自身，找到非空后还要核对对象身份。'
  ];
}

{
  const l = lesson('l009');
  l.title = '事件入门：谁发布、谁监听、何时断开';
  l.goals = [
    '用具体对象解释发布者、事件、监听者和处理方法',
    '看懂 Action、event、+=、-= 与 Invoke 在示例中的作用',
    '通过重复连接实验发现同一处理方法被加入多次'
  ];
  l.theory = [
    section('先把四个名词对应到两个对象',
      '场景里有 SignalHub 和 ListenerA。SignalHub 是发布者，因为事实发生时由它发出通知；它公开的 Signal 是事件；ListenerA 是监听者；ListenerA 中收到通知后执行的 HandleSignal 是处理方法。先记住这四个角色，再读语法。',
      '事件适合“某件事发生后，可能有零个、一个或多个对象想知道”的情景。发布者不必逐个保存所有界面和音效脚本，只负责发出语义清楚的通知；监听者自己决定是否建立联系。事件不是自动出现的全局消息，也不会替你寻找场景对象。'),
    section('Action 描述处理方法的形状',
      '`Action` 是一种委托类型。当前示例的 `Action` 表示可以引用“没有参数、没有返回值”的方法，所以 `HandleSignal()` 与它匹配。若事件需要携带分数，可以使用 `Action<int>`，相应处理方法就必须接收一个 int。',
      '委托可以理解为可调用的方法引用。`event Action Signal` 在此基础上限制了谁能从外部直接触发或覆盖列表：其他对象可以订阅和退订，真正 Invoke 事件的责任仍留在发布者内部。初学时先用这个边界，不要把 event 与 UnityEvent、Input Action 或协程混成同一种东西。'),
    section('+= 建立联系，-= 移除同一联系',
      '`hub.Signal += HandleSignal` 把当前对象的 HandleSignal 加入 hub 的调用列表。`hub.Signal -= HandleSignal` 移除对应的处理方法。这里的“同一”包含目标对象和方法身份，不是只看两段文字长得像不像。',
      '若连续执行三次 += 而没有 -=，同一次 Publish 就可能调用三次。重复十次不是 Unity 的规定，只是故意把错误放大，方便数日志。正确代码可以用 connected 状态防止重复连接，并在不再需要监听时断开。'),
    section('Invoke 是当前调用链中的普通调用',
      'SignalHub 执行 `Signal?.Invoke()` 时，`?.` 表示没有监听者就跳过调用；有监听者时依次调用当前列表中的处理方法。普通 C# 事件不会自动等待下一帧，也不会自动切换到后台线程。',
      '因此处理方法仍是发布动作的一部分。某个处理方法执行很久，发布者也会被拖住；某个处理方法抛出未处理异常，后面的处理也可能收不到这次调用。事件解决的是对象之间怎样建立通知关系，不负责自动隔离错误或调度时间。'),
    section('Inspector 槽决定监听哪一个发布者',
      '本课不用 static 事件。ListenerProbe 有一个 `[SerializeField] SignalHub hub` 字段，你要把场景中的 Hub 对象拖进这个槽。这样每个监听者连接哪一个发布者在 Inspector 中可见，不需要先理解全局静态状态和域重载。',
      '若 Hub 槽为空，Connect 会明确报告并停止；它不会从场景里随便找一个同类型对象。场景有两个 Hub 时，这个选择尤其重要。引用建立与事件订阅是两步：先让字段指向发布者，再执行 += 建立监听关系。'),
    section('连接多久，要由功能寿命决定',
      '示例提供 Connect 和 Disconnect 两个组件菜单命令，让你先看清每一步。它还在 OnDisable 中调用 Disconnect，避免组件停用后继续监听。OnDisable 是 Unity 生命周期函数，下一章会系统学习；本课只把它当作“组件退出启用状态时，结束这条关系”的清理入口。',
      '不是所有订阅都必须机械地放在 OnEnable/OnDisable。若功能需要在禁用期间继续监听，边界就不同。正确问题是：这条关系从何时开始，到何时应该结束？本课场景规定监听只在组件启用期间存在，所以停用时断开。'),
    section('用次数检查关系，而不是只看画面',
      '先给 ListenerA 和 ListenerB 各连接一次，再发布一次，期望各收到一条日志。随后对 B 执行 Disconnect，下一次发布应只有 A 收到。重新连接 B 后再发布，两者应各增加一次。',
      '最后在实验副本暂时去掉 connected 防重，连续 Connect 十次，再 Publish 一次。若出现十条 B 日志，就证明列表中真的累积了十份处理关系。恢复完整代码后重复同样操作，次数应回到一份。这个实验说明为什么要重复，也说明你到底在数什么。')
  ];
  l.teaching = {
    scenario: '场景有一个 Hub 和两个监听对象 ListenerA、ListenerB。Hub 挂 SignalHub；两个监听对象各挂 ListenerProbe，并在 Inspector 把同一个 Hub 拖入 Hub 槽。所有连接、断开和发布都通过组件三点菜单明确触发。',
    question: '一次 Publish 为什么能通知两个对象，而重复 Connect 又为什么可能让同一个对象收到多次？',
    purpose: '看懂事件语法背后的对象关系，知道每条订阅从哪里建立、由谁调用、在什么条件下移除。',
    keyIdea: '事件内部维护的是处理方法列表。+= 添加一条关系，-= 移除对应关系，Invoke 调用当前列表；对象隐藏或名字相同都不会自动替你管理这张列表。',
    walkthrough: [
      {title: '先明确两个对象的角色', text: 'Hub 是发布者，ListenerA/B 是监听者。把 Hub 分别拖入两个监听者的 Hub 槽，此时只有字段引用，尚未订阅。'},
      {title: '连接后发布一次', text: '在两个 ListenerProbe 菜单各执行 Connect，再在 SignalHub 菜单执行 Publish。Console 应出现 Received by ListenerA 和 Received by ListenerB 各一条。'},
      {title: '断开一个再比较', text: '对 ListenerB 执行 Disconnect，再发布。只有 A 应新增一条；B 重新 Connect 后才恢复接收。日志次数直接对应当前订阅关系。'}
    ],
    comparison: {
      caption: '把事件代码中的词与当前场景对象对应起来。',
      headers: ['术语', '本例是谁', '对应代码', '负责什么'],
      rows: [
        ['发布者', 'Hub 对象上的 SignalHub', 'event Action Signal', '保存事件并在事实发生时 Invoke'],
        ['事件', 'Signal', 'hub.Signal', '维护当前处理方法列表'],
        ['监听者', 'ListenerA / ListenerB', 'ListenerProbe', '决定何时加入或离开列表'],
        ['处理方法', '每个监听者自己的 HandleSignal', '+= / -= HandleSignal', '通知发生时执行具体响应']
      ]
    },
    prediction: {
      scenario: '实验副本去掉 connected 防重后，对 ListenerB 连续执行三次 Connect，没有执行 Disconnect，随后 Hub 只 Publish 一次。',
      question: 'ListenerB 的 HandleSignal 最可能执行几次，为什么？',
      answer: '最可能执行三次，因为三次 += 向同一事件列表加入了三份处理关系。一次 Publish 会遍历当前列表。重复次数是实验制造的订阅数量，不是 Unity 对事件的固定规则。'
    }
  };
  l.code = {
    title: '一个发布者和一个可明确连接的监听者',
    language: 'csharp',
    files: [
      file('SignalHub.cs', `using System;
using UnityEngine;

public sealed class SignalHub : MonoBehaviour
{
    public event Action Signal;

    [ContextMenu("Publish")]
    private void Publish()
    {
        Debug.Log("Hub published", this);
        Signal?.Invoke();
    }
}`),
      file('ListenerProbe.cs', `using UnityEngine;

public sealed class ListenerProbe : MonoBehaviour
{
    [SerializeField] private SignalHub hub;
    private bool connected;

    [ContextMenu("Connect")]
    private void Connect()
    {
        if (hub == null)
        {
            Debug.LogError("Assign a SignalHub in the Inspector.", this);
            return;
        }

        if (connected) return;

        hub.Signal += HandleSignal;
        connected = true;
        Debug.Log($"Connected {name}", this);
    }

    [ContextMenu("Disconnect")]
    private void Disconnect()
    {
        if (!connected) return;

        hub.Signal -= HandleSignal;
        connected = false;
        Debug.Log($"Disconnected {name}", this);
    }

    private void OnDisable()
    {
        Disconnect();
    }

    private void HandleSignal()
    {
        Debug.Log($"Received by {name}", this);
    }
}`)
    ],
    explanation: [
      '创建 Hub、ListenerA、ListenerB 三个空对象。Hub 挂 SignalHub；A、B 各挂 ListenerProbe，并把 Hub 对象上的 SignalHub 组件拖入各自 Hub 槽。',
      '进入 Play 后，通过组件三点菜单执行 Connect、Disconnect 和 Publish。OnDisable 只作为本例清理入口；下一章会从对象状态开始系统解释它何时调用。'
    ]
  };
  l.lab[0] = {
    ...l.lab[0],
    title: '逐步建立和断开两条监听关系',
    purpose: '让每一条日志都能对应到一次明确的 Connect、Disconnect 或 Publish。',
    steps: ['A、B 各 Connect 一次，Publish 一次，确认两者各收到一条。', 'B Disconnect 后再次 Publish，确认只有 A 新增一条；B 重新 Connect 后再发布。', '禁用 B 的 ListenerProbe 后发布，确认 OnDisable 已断开；重新启用不会自动 Connect，需手动建立新关系。'],
    result: '能用当前事件列表解释每次发布由哪些对象接收。',
    setup: ['创建 Hub、ListenerA、ListenerB 三个空对象，按代码说明添加组件。', '把 Hub 上的 SignalHub 组件分别拖入 A、B 的 ListenerProbe/Hub 槽；进入 Play，Console 关闭 Collapse。', 'Connect、Disconnect 在 ListenerProbe 三点菜单；Publish 在 SignalHub 三点菜单。每次操作后先看 Connected/Disconnected/Hub published，再数 Received。']
  };
  l.lab[1] = {
    ...l.lab[1],
    title: '故意制造重复订阅并说明十次的用途',
    purpose: '证明重复响应来自列表中累积的处理关系，而不是设备或 Update 自动重复。',
    steps: ['在实验副本暂时移除 `if (connected) return;`，让同一 Listener 连续 Connect 十次，再只 Publish 一次。', '记录这一次发布产生多少条 Received，并把十次改成三次重做，检查响应数是否跟订阅数变化。', '恢复防重代码和 Disconnect，再重复十次 Connect；确认一次 Publish 最多只让该监听者响应一次。'],
    result: '能说明重复次数是人为建立的订阅数量，并用修复前后日志证明关系恢复。',
    setup: ['只修改 ListenerProbe 的实验副本，正式代码保留 connected 防重；每轮从停止并重新 Play 的干净状态开始。', 'A 保持正常，只对 B 做重复 Connect，避免两个变量同时变化。', '十次用于放大错误，三次用于验证响应数随订阅数变化；它们都不是 Unity 规定值。实验结束后恢复完整代码。']
  };
  l.pitfalls = [
    {symptom: '一次 Publish 让同一对象响应多次', cause: '同一处理方法被重复 +=，而没有防重或配对 -=', fix: '记录 Connect 次数，保存连接状态，并在关系结束时移除同一处理方法'},
    {symptom: 'Connect 后完全没有收到通知', cause: 'Hub 槽未赋值、没有实际 Connect，或发布的是另一个 Hub', fix: '依次核对 Inspector 引用、Connected 日志和 Hub published 的对象上下文'}
  ];
  l.exercise.brief = '制作 DoorHub 和两个 DoorIndicator：通过组件菜单连接、断开和发布“门状态变化”，连续连接 20 次后一次发布仍只让每个有效监听者响应一次。20 次只是压力样本。';
  l.exercise.deliverables = ['发布者/事件/监听者/处理方法关系图', '两个完整脚本', '正常连接、断开与重复连接三组日志'];
  l.quiz[0] = {...l.quiz[0], question: 'Signal?.Invoke() 默认怎样执行已订阅的处理方法？', options: ['自动排到下一帧', '自动切到后台线程', '在当前调用链中同步调用', '只在发布者有 Update 时调用'], explanation: '普通 C# 事件调用是当前调用链中的方法调用，不自带队列、协程或线程切换。', scenario: 'SignalHub 的 Publish 直接执行 Signal?.Invoke()；项目没有额外消息队列、协程或线程调度代码。'};
  l.quiz[1] = {...l.quiz[1], question: '同一 Listener 连续三次 += HandleSignal，未做 -=，一次 Publish 可能发生什么？', options: ['HandleSignal 可能执行三次', '事件会自动合并成一次', '监听者会自动销毁', '只影响内存，不影响调用次数'], explanation: '每次 += 都向调用列表加入一条处理关系；事件不会按方法名称自动去重。', scenario: 'connected 防重被移除，同一个对象对同一个 hub.Signal 连续执行三次 += HandleSignal，然后只发布一次。'};
  l.quiz[2] = {...l.quiz[2], question: '监听需求只在组件启用期存在时，本例用哪组边界清理？', options: ['每次 Update 加入、FixedUpdate 移除', '连接后在 OnDisable 断开', '只连接而永不移除', '每次收到事件后再重复连接'], explanation: '本例规定关系随启用期结束，因此 OnDisable 调用 Disconnect；下一章会进一步学习生命周期条件。', scenario: 'ListenerProbe 停用后不应继续接收 Hub 通知；它可能之后重新启用，但重新启用不应保留旧的重复关系。'};
  l.references = [
    reference('ContextMenu', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ContextMenu.html'),
    reference('MonoBehaviour.OnDisable', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnDisable.html'),
    reference('Debug.Log', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Debug.Log.html')
  ];
  l.summary = ['事件是处理方法列表，不是自动异步的全局消息。', '重复次数来自建立了多少条关系；测试次数必须说明用途和预期观察。'];
}

{
  const l = lesson('l010');
  l.title = 'List 与场景对象：列表删掉了，物体为什么还在';
  l.goals = [
    '看懂 List<GameObject>、元素、索引和 Count 的具体含义',
    '区分 Clear、RemoveAt 与 Destroy 分别改变什么',
    '在删除相邻无效元素时避免正向遍历漏项'
  ];
  l.theory = [
    section('List 是一张可变长度的成员清单',
      '`List<GameObject>` 表示一张只接收 GameObject 引用的列表。尖括号里的 GameObject 是元素类型；列表中的每一项叫元素；元素所在位置叫索引，第一项索引为 0；`Count` 表示当前有多少个元素。',
      '若列表依次保存 One、Two、Three，Count 为 3，索引 1 对应 Two。列表保存的是引用，不是把三个场景对象复制进一个容器。Hierarchy 里的对象和 List 中的成员关系是两套状态，任何实验都应分别观察。'),
    section('Destroy 对象不会自动删除列表位置',
      '调用 `Destroy(Two)` 后，Unity 会安排销毁 Two 对应的引擎对象，通常在当前 Update 循环结束后生效。列表仍有原来的三个位置，所以 Count 通常仍是 3；其中一个元素只是变成了指向已销毁 Unity 对象的失效引用。',
      '因此 Count 回答“列表有几个位置”，不回答“其中几个对象仍可使用”。报告时要同时输出 Count、有效成员数和每个索引的对象名或 `<destroyed>`。只看一个数字，很容易把容器状态误当成场景状态。'),
    section('Clear、RemoveAt 和 Destroy 改变的对象不同',
      '`targets.Clear()` 清空列表的全部元素，Count 变成 0，但不会自动对每个场景对象调用 Destroy。`targets.RemoveAt(1)` 只删除索引 1 的列表元素，后面的元素向前移动，也不会销毁那个 GameObject。',
      '`Destroy(targets[1])` 处理的是场景对象，却不自动移除列表元素。若需求是“删除对象并从清单移除”，代码要明确完成两步，并决定先保存引用再 Remove，还是先请求 Destroy 再清理失效项。方法名相似不代表管理的是同一层。'),
    section('正向删除会让下一个元素前移',
      '列表 `[A, null, null, D]` 从索引 0 向后检查。到索引 1 时删除第一个 null，原索引 2 的 null 会前移到索引 1；如果循环随后把 i 增加到 2，就跳过了刚刚前移的元素。结果会残留一个本应删除的项。',
      '倒序从最后一个索引向 0 检查时，删除较大索引不会改变尚未检查的较小索引，所以适合这种简单清理。实验必须制造两个相邻失效成员；只有一个失效项时，错误写法也可能碰巧通过。'),
    section('倒序不是所有修改的万能答案',
      '倒序安全依赖一个前提：本轮只删除当前索引，不会由回调同时添加、重排或删除别的位置。如果检查过程中还会触发其他代码修改列表，索引仍可能失去原含义。',
      '复杂流程可以先遍历并记录待移除对象，等本轮检查结束后统一修改；也可以禁止回调在遍历期间改集合。先写清允许哪些变化，再选择算法，比背“删除一定倒序”更可靠。'),
    section('谁拥有对象，谁决定是否销毁',
      '列表能引用对象，不代表它拥有销毁权限。敌人管理器可能只观察由场景生成器创建的对象；界面列表可能只显示背包数据。清空观察列表时随意 Destroy，会误删仍被其他系统使用的对象。',
      '为每张列表写一句责任说明：谁添加和移除成员，谁创建和销毁对象，失效成员何时清理。若同一个脚本确实同时负责创建与销毁，也应让两个动作在代码中分别可见，而不是把 Clear 想成隐含的销毁命令。'),
    section('异常不是用空 catch 隐藏的噪声',
      '遍历普通 List 时直接在 foreach 中修改集合，可能抛出 InvalidOperationException。捕获后什么也不做，只会让剩余清理中断且原因消失；列表可能停在一半完成的状态。',
      '应先选择允许的修改方式，例如倒序索引或两阶段处理。若确实捕获异常，要记录足够上下文并决定恢复、停止还是继续，而不是只为了让 Console 没有红字。本课的目标是让列表变化可预测，不是练习把错误藏起来。')
  ];
  l.teaching = {
    scenario: '场景中有 ListHost、One、Two、Three 四个对象。ListHost 上的 ListLifetimeProbe 通过 Inspector 引用后三者，并在 Play 开始时建立 `[One, Two, Three]` 列表。所有实验命令都在 ListLifetimeProbe 组件三点菜单中。',
    question: 'Destroy Two、RemoveAt(1) 和 Clear 看起来都像“删除”，为什么它们对 Count 与 Hierarchy 的影响完全不同？',
    purpose: '能分别观察列表成员和场景对象，写清每一步删的是引用位置还是引擎对象，并安全清理相邻失效元素。',
    keyIdea: 'List 管理成员关系，Destroy 管理 Unity 对象寿命。一个动作不会自动替另一个动作完成；Count 也只统计列表元素，不验证对象是否仍有效。',
    walkthrough: [
      {title: '建立三个成员', text: 'Reset list 后输出 Count=3，并逐项看到 One、Two、Three。此时列表和 Hierarchy 都包含对应关系。'},
      {title: '只销毁中间对象', text: '执行 Destroy middle and report next frame。等销毁生效后，Hierarchy 少了 Two，但列表 Count 仍为 3，中间元素报告为 destroyed。'},
      {title: '再清理或只清列表', text: 'Remove invalid 会让 Count 变为 2；Clear list only 会让 Count 变为 0，但剩余 One、Three 仍在 Hierarchy。每条命令只证明自己改变的那一层。'}
    ],
    comparison: {
      caption: '三种“删除”作用在不同目标上。',
      headers: ['操作', '列表 Count', 'Hierarchy 对象', '后续索引'],
      rows: [
        ['Destroy(target)', '不会自动减少', '对象在销毁生效后消失', '原位置仍在，可能成为失效引用'],
        ['RemoveAt(index)', '减少 1', '对象仍在', '后方元素向前移动'],
        ['Clear()', '变为 0', '对象仍在', '列表中不再有索引']
      ]
    },
    prediction: {
      scenario: 'targets 依次保存 One、Two、Three。调用 Destroy(Two)，等销毁生效，但还没有调用 Remove、RemoveAt 或 Clear。',
      question: '此时 targets.Count 最可能是多少？',
      answer: '仍是 3。Destroy 使 Two 的引擎对象失效，却不会自动删除 List 中原有的位置。需要另外清理失效元素，Count 才会减少。'
    }
  };
  l.code = {
    title: '分别报告列表成员和场景对象状态',
    language: 'csharp',
    files: [
      file('ListLifetimeProbe.cs', `using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public sealed class ListLifetimeProbe : MonoBehaviour
{
    [SerializeField] private GameObject one;
    [SerializeField] private GameObject two;
    [SerializeField] private GameObject three;

    private readonly List<GameObject> targets = new List<GameObject>();

    private void Start()
    {
        ResetList();
    }

    [ContextMenu("Reset list")]
    private void ResetList()
    {
        targets.Clear();
        targets.Add(one);
        targets.Add(two);
        targets.Add(three);
        Report("reset");
    }

    [ContextMenu("Destroy middle and report next frame")]
    private void DestroyMiddle()
    {
        if (!Application.isPlaying || targets.Count < 2) return;
        Destroy(targets[1]);
        StartCoroutine(ReportNextFrame());
    }

    private IEnumerator ReportNextFrame()
    {
        yield return null;
        Report("after Destroy");
    }

    [ContextMenu("Remove invalid")]
    private void RemoveInvalid()
    {
        for (int i = targets.Count - 1; i >= 0; i--)
            if (targets[i] == null)
                targets.RemoveAt(i);

        Report("after RemoveInvalid");
    }

    [ContextMenu("Clear list only")]
    private void ClearListOnly()
    {
        targets.Clear();
        Report("after Clear");
    }

    [ContextMenu("Report")]
    private void ReportNow()
    {
        Report("manual report");
    }

    private void Report(string stage)
    {
        string[] labels = new string[targets.Count];
        int valid = 0;

        for (int i = 0; i < targets.Count; i++)
        {
            bool exists = targets[i] != null;
            if (exists) valid++;
            labels[i] = exists ? targets[i].name : "<destroyed>";
        }

        Debug.Log($"{stage}: Count={targets.Count}, valid={valid}, [{string.Join(", ", labels)}]", this);
    }
}`)
    ],
    explanation: [
      '创建 ListHost、One、Two、Three，把脚本挂 ListHost，再把三个对象分别拖入同名槽。进入 Play 后 Start 会建立列表并输出 reset 报告。',
      '按顺序执行 Destroy middle and report next frame、Remove invalid、Clear list only。每条日志同时给出 Count、有效对象数和索引内容，便于和 Hierarchy 对照。'
    ]
  };
  l.lab[0] = {
    ...l.lab[0],
    title: '区分 Destroy、RemoveAt 与 Clear',
    purpose: '把列表成员数、有效对象数和 Hierarchy 对象数分开记录。',
    steps: ['运行完整探针，保存 reset 的 Count、valid 和三项名称。', '执行 Destroy middle and report next frame，对照 Hierarchy 与下一帧日志；再执行 Remove invalid。', '从干净运行重新开始，只执行 Clear list only，确认 One、Two、Three 仍在 Hierarchy。'],
    result: '三种操作各自改变哪一层都有前后证据。',
    setup: ['创建空对象 ListHost、One、Two、Three，给 ListHost 添加 ListLifetimeProbe。', '把 One、Two、Three 从 Hierarchy 分别拖入脚本的 One、Two、Three 槽；进入 Play，Console 关闭 Collapse。', '每个对照从停止并重新 Play 的干净状态开始，避免上一轮已经销毁 Two 或清空列表影响结果。']
  };
  l.lab[1] = {
    ...l.lab[1],
    title: '证明正向删除为什么会漏掉相邻元素',
    purpose: '用两个相邻失效成员检验遍历删除策略，而不是只测一个容易碰巧通过的成员。',
    steps: ['在实验副本建立 `[One, Two, Three, Four]`，让 Two、Three 都失效；先手算正向删除时索引怎样变化。', '运行正向 `for` 中直接 RemoveAt 的版本，记录是否残留；再改为倒序版本对照。', '增加一个会在检查期间修改其他位置的回调，说明为什么此时应改用两阶段收集，而不能只喊“倒序”。'],
    result: '能用索引前移解释漏项，并写出所选算法成立的前提。',
    setup: ['这个实验使用 ListLifetimeProbe 的副本，新建 Four 槽和对象；不要破坏第一组实验代码。', '销毁 Two、Three 后等一帧再清理，确保比较的是两个相邻失效元素。', '每轮记录删除前列表、每次 i、删除后的列表和最终结果；测试结束恢复完整倒序版本。']
  };
  l.pitfalls = [
    {symptom: 'Destroy 中间对象后 Count 仍是 3', cause: '对象销毁不自动删除 List 中的成员位置', fix: '分别报告 Count 与有效成员，并由列表维护者明确清理失效项'},
    {symptom: '连续两个无效元素只删掉一个', cause: '正向 RemoveAt 后后项前移，循环自增跳过新当前位置', fix: '在仅删除当前项的前提下倒序遍历，复杂修改使用两阶段处理'}
  ];
  l.exercise.brief = '制作 TargetRegistry：能登记四个场景目标、报告 Count 与有效数、清理相邻失效项，并用单独命令演示 Clear 不会销毁剩余对象。';
  l.exercise.deliverables = ['完整列表探针', 'Destroy/RemoveAt/Clear 对照表', '相邻失效项的索引变化记录'];
  l.exercise.rubric = l.exercise.rubric.map((item, index) => ({...item, item: [
    '列表术语与索引变化解释正确',
    '对象寿命和成员关系分开处理',
    '相邻失效项不会漏删',
    '每个命令都有可复现前后证据'
  ][index]}));
  l.quiz[0] = {...l.quiz[0], question: 'targets.Clear() 会自动 Destroy 列表里的场景对象吗？', options: ['不会，只移除列表成员', '会逐一调用 Destroy', '只销毁没有其他引用的对象', '会删除对应 Prefab 资源'], explanation: 'Clear 改变列表成员关系，不是 Unity 场景对象销毁命令。', scenario: 'targets 保存 One、Two、Three。代码只执行 targets.Clear()，没有任何 Destroy 调用或其他清理系统。'};
  l.quiz[1] = {...l.quiz[1], question: 'Destroy(Two) 生效后，没有 Remove 时 Count 最可能怎样？', options: ['自动变成 2', '仍为 3，但一个元素已失效', '自动变成 0', 'Count 会抛异常而无法读取'], explanation: 'List 位置仍在；Destroy 不会自动替容器删除成员。', scenario: '列表为 `[One, Two, Three]`，只调用 Destroy(Two) 并等销毁生效，随后立即读取 Count。'};
  l.quiz[2] = {...l.quiz[2], question: '正向遍历时 RemoveAt 为什么可能漏掉相邻失效元素？', options: ['因为任何 for 都不能访问 List', '因为 Destroy 会随机重排列表', '删除后后项前移，而 i 随后又增加', '因为 Count 永远不会变化'], explanation: '删除当前项后，下一项前移到当前索引；循环再自增会跳过它。', scenario: '列表中索引 1 和 2 连续失效。正向 for 在索引 1 RemoveAt 后仍按常规执行 i++。'};
  l.references = [
    reference('Object.Destroy', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object.Destroy.html'),
    reference('Object.operator ==', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Object-operator_eq.html'),
    reference('ContextMenu', 'https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ContextMenu.html')
  ];
  l.summary = ['List 的 Count 统计元素位置，不等于仍有效的 Unity 对象数量。', 'Clear、RemoveAt 和 Destroy 分别修改列表或对象，任何一个都不会自动替另外两个完成工作。'];
}

const target = path.join(root, 'content', 'chapter-02.js');
fs.writeFileSync(target, `window.COURSE_MODULES.push(${JSON.stringify(module, null, 2)});\n`);
console.log('Chapter 02 beginner continuity revision applied.');
