# 第 8–13 章交叉审阅

审阅日期：2026-11-12。审阅者：第 1–7 章作者；审阅对象为另一作者的 `chapter-08.js` 至 `chapter-13.js`。本轮从机制、代码前提和自测答案进行交叉检查，覆盖 30 课，每课至少核对一个关键契约。运行版本基线为 Unity 6.3 LTS、Input System 1.20.1、URP 17.3。

## 逐课检查

| 课号 | 检查重点 | 审阅结论 |
| --- | --- | --- |
| l036 | Rigidbody2D 类型、linearVelocity 单位、插值 | 正确区分 Dynamic、Kinematic 与 Static；速度接口不再额外乘时间。插值改善显示而非增加物理精度。 |
| l037 | 二维触发条件、层矩阵与多 Collider 身份 | 二维与三维系统分开，触发配置和 Rigidbody2D 前提明确；不会把每个 Collider 回调直接当成不同角色。 |
| l038 | 二维射线从 Collider 内开始的结果 | 正确提醒 Physics2D.Raycast 可能返回零距离的内部命中，与三维射线的行为区别清楚。 |
| l039 | 输入采样与刚体消费的阶段 | 持续值先采样再供固定步使用；Keyboard 原型范围明确，不声称它替代正式动作资源架构。 |
| l040 | CCD、速度与视觉插值 | 正确区分穿透防护和显示平滑，不宣称 CCD 能无条件解决所有接触问题。 |
| l041 | PPU、过滤与磁盘/运行时资源尺寸 | PPU 解释为单位换算；没有把源文件体积直接视为纹理驻留成本。 |
| l042 | Sprite 切片、Pivot、meta 与子资源身份 | 切片和枢轴会影响帧对齐；稳定资源身份与文件路径、图像外观分开解释。 |
| l043 | Prefab 实例覆盖和源资源传播 | 对实例修改、覆盖、Apply 与 Revert 的责任区分清楚，未把实例等同于复制出的独立源资产。 |
| l044 | AssetDatabase 边界与依赖 | 编辑器 API 与 Player 分开；依赖关系不等同于已经加载或一直驻留。 |
| l045 | 导入规范与批量检查 | 先只读报告再考虑修复，允许例外并记录；规范覆盖可观察的导入状态。 |
| l046 | Clip 绑定路径、对象引用帧、预览范围 | 正确解释 Sprite 帧写入的是对象引用曲线；编辑器预览不能证明运行时 Controller 链路。 |
| l047 | 默认状态、Motion、Exit Time | 空状态和缺少 Motion 的排查链清楚；退出时间与条件分开检查，未把状态选中当作播放证据。 |
| l048 | Animator 参数、速度与阻尼 | 参数单位和输入意图/实际速度区别明确；阻尼不是修复错误数据的替代品。 |
| l049 | Animation Event 与根运动所有权 | 不将关键结算只托付给可能被中断的事件；根运动、脚本与物理的位移所有者需唯一。 |
| l050 | Idle 故障的引用链和证据 | 从纹理、切片、Clip、Controller、Animator 到运行状态逐段验证；不会用“无报错”证明动画正确。 |
| l051 | 正交相机可见高度与屏幕深度 | orthographicSize 为半高度；ScreenToWorldPoint 的深度相对于相机解释正确。 |
| l052 | URP Renderer、Shader、Light2D 与排序 | 明确 2D 光照需要匹配渲染器和材质；Sorting Layer 不等同于物理 Layer。 |
| l053 | material/sharedMaterial/MPB 和 SRP Batcher | 实例材质和共享材质修改后果分明；MPB 与 SRP Batcher 的取舍没有被写成通用优化结论。 |
| l054 | Draw Call、Frame Debugger 与时间测量 | 绘制事件解释和性能时间证据分开；不把调用数下降直接等同于总帧时间下降。 |
| l055 | RenderTexture 生产、消费与寿命 | 释放自己创建的资源、先解除引用的顺序正确；已有目标时拒绝接管，已复核修订。 |
| l056 | Canvas 空间与点击阻挡 | 透明不代表不阻挡点击；Screen Space 与 World Space 的坐标边界清楚。 |
| l057 | RectTransform、锚点、sizeDelta 与布局 | 不把 sizeDelta 永远等同于最终宽高；布局组件与手工写位置的所有权冲突解释准确。 |
| l058 | InputSystemUIInputModule 与成对订阅 | 对新版输入模块的配置前提明确；OnEnable/OnDisable 配对注册避免重复点击执行。 |
| l059 | UI Toolkit 查询与视觉树重建 | name、文本与元素身份分开；重建视觉树后旧缓存和监听必须重新建立。 |
| l060 | 变化驱动显示和首次呈现 | 刷新频率原则正确；已改用独立初始化标志，完整整数域都能首次呈现。 |
| l061 | 线性音量转 dB 与 Mixer 参数 | 对零输入做下限保护；音频参数更新阶段有说明，不把线性值直接当 dB。 |
| l062 | DSP 时钟、PlayScheduled 与帧等待 | 区分音频调度时钟与渲染帧等待；没有宣称协程能提供采样级精度。 |
| l063 | ParticleSystem 模块与停止行为 | 模块结构体是原生系统接口，不按普通值拷贝误解；StopEmitting 与清空已有粒子分开。 |
| l064 | ObjectPool 的空闲容量和并发上限 | maxSize 不是自动限制活跃数量；代码额外维护活跃上限和归还路径，清理不遗留池内实例。 |
| l065 | 反馈事实、timeScale 所有权和恢复 | 单发射器范围明确；没有用多个反馈脚本互相覆盖全局 timeScale，停止路径负责恢复。 |

## 发现与修订

1. **l060 首次呈现的合法整数边界，已修复并复核。** 原来 `lastValue = int.MinValue` 与 `if (value == lastValue) return` 会漏掉第一次 `Present(int.MinValue)`。作者已使用独立 `bool hasValue`，只在已经呈现且数据相同时跳过，并在 OnEnable 重置初始化状态。复读代码确认首次的任意合法整数均会进入呈现路径，避免合法数据与内部状态碰撞。
2. **l055 已有 targetTexture 的借用前提，已修复并复核。** 原例说明不接管外部共享目标，但 OnEnable 会直接覆盖已有绑定，结束后也不会恢复。修订代码先检查已有 targetTexture，存在就报告并返回；说明同步要求专用相机初始目标为空。复读确认失败路径不会分配资源，OnDisable 不会清除已有的外部非空绑定，只释放本组件自行创建的纹理。

## 关联的基础章节修订

另一位作者对第 1–7 章交叉审阅，发现 l029 每次 `new InputAction` 后按上次 JSON 绑定 ID 恢复的条件不成立。本作者已将唯一按钮实验改为保存 `overridePath`，再对重建动作的索引零应用该路径；同时更新目标、讲解、实验、自测与配置版本。真实多绑定 JSON 往返明确要求稳定 `.inputactions` 资源身份。依据包括 Input System 1.20.1 本地包的 `LoadBindingOverridesFromJsonInternal`：仅按 `entry.id` 调用 `FindBinding`，未找到就记录警告。

l013 同时补充了官方精确前提：OnDestroy 只对曾经处于活动状态的 GameObject 调用，从未激活的对象不得以它作为唯一清理入口。

## 验证范围

本记录是源码、官方契约与自测推理审阅，不等同于已在 Unity 场景中执行全部实验。独立 C# 编译、全教材结构检查、网页交互与引用状态由主审另外记录。物理接触、图形管线、UI 输入、音频调度和平台行为仍需读者按实验步骤在目标环境验证，不声称所有运行路径已经通过。
