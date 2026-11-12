window.COURSE_MODULES.push({
  "id": "m18",
  "number": 18,
  "title": "编辑器扩展",
  "subtitle": "把重复操作变成可预览、可撤销的工具",
  "description": "实践 Inspector、Undo、Scene 工具、EditorWindow、导入策略和只读验证，并用构建检查保护运行时代码边界。",
  "accent": "#527c63",
  "lessons": [
    {
      "id": "l086",
      "title": "自定义 Inspector 与 SerializedObject",
      "prerequisites": [
        "l071",
        "l078"
      ],
      "goals": [
        "正确隔离运行组件和编辑器代码",
        "使用序列化属性编辑数据",
        "解释多对象编辑、Prefab 覆盖与 Undo 的关系"
      ],
      "theory": [
        {
          "title": "自定义 Inspector 首先要像一个可靠编辑器",
          "paragraphs": [
            "你想给移动组件增加提示和更好看的速度输入框，写一个自定义 Inspector 就能控制显示。但默认 Inspector 原来已经提供撤销、多对象编辑和 Prefab 覆盖等行为。自定义界面若只把字段画出来，却丢掉这些能力，作者看似操作成功，之后却可能无法恢复或保存正确配置。",
            "因此先列出真正任务：编辑 speed、显示缺失依赖提示，以及在明确按钮操作时执行某项工具。不要把所有运行逻辑搬进面板绘制函数。一个可靠的小 Inspector，应先保持字段原有的数据含义，再改善作者的理解和操作。"
          ]
        },
        {
          "title": "SerializedObject 让界面接入序列化编辑流程",
          "paragraphs": [
            "可以把这段流程看成一次有明确起点和提交点的字段编辑。serializedObject 表示当前目标的序列化数据，FindProperty(\"speed\") 找到 speed 对应的 SerializedProperty；这里的 property 是序列化属性，并不是要求你新增一个 C# get/set 属性。先调用 Update 取得当前状态，再用 PropertyField 让用户编辑，最后 ApplyModifiedProperties 应用变化。若只写 target.speed=新值，就绕开了这条流程，需要自行处理相应编辑行为。",
            "本课示例按字段名字查找属性，因此字段重命名后也要检查工具是否仍能找到它。通过这个流程编辑，有助于维护撤销和实例覆盖，但仍需实际验证。不要把“使用了 SerializedObject”当作所有副作用都已自动正确的保证，尤其额外按钮若直接操作对象，还需要单独处理。"
          ]
        },
        {
          "title": "多选时，两个不同速度不能假装成一个值",
          "paragraphs": [
            "对象甲的 speed=3，乙为 5，同时选中时，界面应能表示它们原本不同，而不是直接显示甲的值并悄悄覆盖乙。多对象编辑支持和混合值显示，帮助用户理解当前操作影响哪些对象。用户真正输入新值后，再按声明的选择范围应用。",
            "直接强制把 target 转成一个组件，并不会自动更新所有选中对象；只调用 SetDirty 也不等于完整支持多选和撤销。测试应同时覆盖单选、多选不同值、Prefab 实例，以及撤销重做。每一种都正常，才说明工具在常见编辑场景下保留了应有行为。"
          ]
        },
        {
          "title": "绘制函数不是每帧一次的游戏逻辑",
          "paragraphs": [
            "OnInspectorGUI 会因布局、重绘和输入等编辑器事件多次执行。若在里面无条件扫描所有资源、生成对象或写文件，打开面板就可能反复触发昂贵操作，用户还没有点击任何按钮。临时记录调用次数，可以直接看到一次看似简单的界面交互包含多次绘制。",
            "把昂贵工作放到明确按钮或专门任务中，显示“当前配置有问题”和自动改变配置也应分开。例如发现模板未赋值，可以提示原因和位置，不应为了消除红色提示就随意替用户选择一个资源。界面反馈应帮助做决定，而不是隐藏修改项目。"
          ]
        },
        {
          "title": "工具依赖运行数据，Player 不依赖工具",
          "paragraphs": [
            "运行组件保留在 Runtime 范围，自定义 Editor 类放进正确的编辑器目录或 Editor-only 程序集。若父目录已有 asmdef，要检查实际程序集归属和引用，不能只看文件夹名字。Editor 可以读取运行组件类型，运行代码不能因为一个面板而依赖 UnityEditor。",
            "完成后构建一次 Player，确认工具代码不会混入运行编译。再关闭并重开场景，核对字段保存和 Prefab 覆盖。面板还应保留足够的字段名称、单位和提示，避免换了样式后连实际保存什么都看不出来。自定义 Inspector 的完成标准不是截图更漂亮，而是作者能看懂数据、知道操作范围，并在改错时可靠撤销；这些基础成立后，再考虑更多视觉样式。"
          ]
        }
      ],
      "code": {
        "title": "普通组件与 Editor 代码分开",
        "language": "csharp",
        "files": [
          {
            "filename": "Runtime/LabTuning.cs",
            "source": "// Assets/EngineLab/Runtime/LabTuning.cs\nusing UnityEngine;\npublic sealed class LabTuning : MonoBehaviour\n{\n    [SerializeField, Min(0f)] private float speed = 5f;\n    public float Speed => speed;\n}\n\n"
          },
          {
            "filename": "Editor/LabTuningEditor.cs",
            "source": "// Assets/EngineLab/Editor/LabTuningEditor.cs\nusing UnityEditor;\n[CustomEditor(typeof(LabTuning)), CanEditMultipleObjects]\npublic sealed class LabTuningEditor : Editor\n{\n    private SerializedProperty speed;\n    private void OnEnable() => speed = serializedObject.FindProperty(\"speed\");\n    public override void OnInspectorGUI()\n    {\n        serializedObject.Update();\n        EditorGUILayout.PropertyField(speed);\n        EditorGUILayout.HelpBox(\"速度是配置；运行时状态由各实例持有。\", MessageType.Info);\n        serializedObject.ApplyModifiedProperties();\n    }\n}"
          }
        ],
        "explanation": [
          "运行组件和自定义 Editor 按各自文件名分别保存。若项目已有 asmdef，Editor-only 程序集要正确引用 Runtime。",
          "示例使用序列化属性编辑。完成后用单选、多选不同值、Undo 和 Prefab 覆盖四组对照验证，而不只检查控件是否出现。"
        ]
      },
      "lab": [
        {
          "title": "单选、多选、撤销与 Prefab 四种编辑情况",
          "minutes": 60,
          "steps": [
            "按各自文件名创建 Runtime 组件和 Editor 类，配置程序集，再分别挂载并打开 Inspector。",
            "单对象修改后撤销和重做。",
            "多选具有不同 speed 的对象，观察混合值。",
            "创建 Prefab 实例，修改字段并检查覆盖。"
          ],
          "result": "编辑行为与 Unity 数据机制一致。"
        },
        {
          "title": "界面不是更新循环",
          "minutes": 60,
          "steps": [
            "临时为 OnInspectorGUI 计数，执行一次选择和字段交互，观察布局、重绘等造成的多次调用。",
            "设计一个昂贵扫描按钮，保证只在明确点击时运行。",
            "对非法配置只显示诊断，避免自动破坏数据。",
            "构建一次 Player，确认 UnityEditor 不进入运行程序集。"
          ],
          "result": "工具副作用与界面重绘分离。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "更改字段无法撤销",
          "cause": "直接写对象字段却未走正确的 Undo/序列化流程。",
          "fix": "优先使用 SerializedObject 和 SerializedProperty。"
        },
        {
          "symptom": "多选对象时只改了第一个",
          "cause": "工具只操作 target，未设计多对象语义。",
          "fix": "使用序列化属性或显式处理 targets，并测试混合值。"
        }
      ],
      "exercise": {
        "brief": "为一个具有数值范围和资源引用的配置组件写 Inspector，支持混合值、撤销和 Prefab 覆盖，并提供非破坏性诊断。",
        "deliverables": [
          "运行与 Editor 两文件",
          "单选、多选、Undo 与 Prefab 覆盖验证表",
          "Player 构建结果"
        ],
        "rubric": [
          {
            "item": "程序集隔离",
            "points": 25
          },
          {
            "item": "序列化流程正确",
            "points": 30
          },
          {
            "item": "多选及 Undo 可靠",
            "points": 30
          },
          {
            "item": "诊断无隐藏副作用",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "OnInspectorGUI 可以当作每帧一次的运行逻辑吗？",
          "options": [
            "可以",
            "不可以，它随编辑器事件多次执行",
            "只在 Play Mode 可以"
          ],
          "answer": 1,
          "explanation": "它响应编辑器的布局、重绘和输入等事件，次数不等于运行时每帧一次，不能用作游戏更新循环。"
        },
        {
          "question": "多对象编辑应关注？",
          "options": [
            "承认混合值，使用 SerializedProperty 对声明范围应用修改",
            "直接写 target 会自动把所有选中对象改成相同值",
            "只调用 SetDirty 就完整支持多选与撤销"
          ],
          "answer": 0,
          "explanation": "同时选择不同值时要明确显示混合状态，并按实际选择范围应用修改；单写 target 或 SetDirty 不能代替这些处理。"
        },
        {
          "question": "Editor 应依赖哪一层？",
          "options": [
            "Runtime 数据层",
            "Runtime 反向依赖 Editor",
            "Player 必须引用 UnityEditor"
          ],
          "answer": 0,
          "explanation": "工具读取运行数据，运行代码不反向依赖 UnityEditor，才能使 Player 编译边界成立。"
        }
      ],
      "references": [
        {
          "label": "Editor",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Editor.html"
        },
        {
          "label": "SerializedObject",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SerializedObject.html"
        }
      ],
      "summary": [
        "自定义 Inspector 要保留序列化编辑的基本行为。",
        "单选、多选、Prefab 和撤销分别测，绘制本身不应隐藏修改。"
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
        "question": "两个对象 speed 分别为 3 和 5，多选后 Inspector 应该显示什么？",
        "keyIdea": "多选界面要承认原值不同，并通过序列化属性应用用户明确提出的修改。绘制本身不应偷偷改项目。",
        "walkthrough": [
          {
            "title": "确认原始数据",
            "text": "单独选择甲和乙，分别看到 speed=3 与 5，再同时选择两者作为多选对照。"
          },
          {
            "title": "呈现差异",
            "text": "自定义 Inspector 使用 SerializedProperty，显示混合值，而不是把甲的 3 当作两者共同值。"
          },
          {
            "title": "验证编辑结果",
            "text": "输入一个新值，检查声明范围内对象的修改，再撤销、重做并查看 Prefab 覆盖。"
          }
        ],
        "prediction": {
          "question": "把资源扫描无条件放在 OnInspectorGUI 中，只会每帧执行一次吗？",
          "answer": "不能这样假定。布局、重绘和输入可能多次调用它，扫描应由明确操作触发，并有适当范围。"
        }
      }
    },
    {
      "id": "l087",
      "title": "Undo 与 Prefab：让编辑操作可以安全回退",
      "prerequisites": [
        "l086"
      ],
      "goals": [
        "在修改前记录正确对象",
        "区分对象创建、销毁与字段修改的 Undo API",
        "维护 Prefab 实例覆盖信息"
      ],
      "theory": [
        {
          "title": "一次对齐操作，怎样才能一步撤销",
          "paragraphs": [
            "场景中甲的位置是 (2,1,0)，乙是 (-4,3,0)。本课菜单 Align Selected X 把两者的世界 X 都设为 0，结果应为甲 (0,1,0)、乙 (0,3,0)；Y 和 Z 保持原值，它并不是把两者移到同一高度。如果一次 Undo 只能恢复一个，或者恢复不了，工具就没有按用户理解的“一次操作”记录变化。先把修改对象、修改分量和原数值列清楚，再决定怎样记录撤销。",
            "本课先使用两个互不为父子的可编辑场景对象，工具只修改所选 Transform，不创建、删除对象，也过滤持久资源。这个前提有实际原因：若父子同时被选中，移动父对象还会带动子对象，逐项写世界坐标就可能依赖处理顺序。扩展嵌套选择前，应另定只处理最上层选择，还是缓存全部目标世界位置后按层级处理。先缩小样本范围，再逐项验证未选对象、撤销与重做，才不会把一个最小工具误当成所有层级都已支持。"
          ]
        },
        {
          "title": "先记录，再赋新值",
          "paragraphs": [
            "Undo.RecordObject 或 RecordObjects 要在修改之前调用，用来记录修改前可比较的状态。若先把位置全部赋成目标值，再要求保存原来位置，引擎已无法从当前字段推断你刚才覆盖掉的数据。实验故意交换顺序，就能看到记录时机不是格式偏好，而影响恢复含义。",
            "多个对象属于一次动作时，要给操作一个有意义的名称，例如示例中的 Align Selected X，并用合适记录或分组让用户一次撤销整组变化。这样历史中的这一项，才对应刚才同时处理甲、乙的动作，而不是十几条不明记录。涉及创建、删除或父子结构变化时，则要使用对应的 Undo API；记录一个普通字段的办法，不能自动覆盖所有结构操作。"
          ]
        },
        {
          "title": "脏状态、撤销和保存不是同一件事",
          "paragraphs": [
            "脏状态表示数据相对保存内容已经修改，Undo 历史用于恢复之前状态，保存则把合适内容写入文件。调用 SetDirty 并不自动得到完整撤销历史；能撤销也不说明场景已经写盘。把三个问题分开检查，才能解释“刚才看起来改了，重开却没了”这类现象。",
            "优先使用适合的序列化编辑流程或 Undo 记录，并按对象类型处理相应变化。完成操作后查看场景标记，再保存、重开核对。不要靠频繁强制保存掩盖缺少记录，也不要认为控制台没有异常，就已经验证了项目数据的持久结果。"
          ]
        },
        {
          "title": "在实例子对象上观察普通属性覆盖",
          "paragraphs": [
            "Prefab 实例的根位置和旋转有特殊规则：它们是为了把各个实例摆到场景中而保留的默认变换，并不是通常在 Overrides 中列出的显式覆盖。因此本课不拿“移动 Prefab 根后 Revert 回源位置”验证普通覆盖，而选择 Root/Marker 子对象。设源 Prefab 中 Marker 的 localPosition.x=1，场景实例甲的根位于世界 x=2，旋转不变、缩放为1；此时 Marker 世界 x=3。选中甲的 Marker 执行工具，世界 x 变为0，对应局部 x=-2，这才是可以观察的子对象属性覆盖。",
            "另放一个来自同一 Prefab 的实例乙，保持它的 Marker 局部 x=1。只修改甲的 Marker 后，乙和源资产都应不变；在甲的子对象上对该位置覆盖执行 Revert，局部 x 应恢复为1，因此世界 x 又成为3，而甲的根仍位于世界 x=2。这里撤回的是子对象相对源的差异，不是把整个实例搬回源资产的原点。修改实例、编辑源资产以及根变换的特殊默认行为是三种情况，要分别说明范围，不能只看位置一度正确就认定覆盖流程已验证。"
          ]
        },
        {
          "title": "撤销不能包办所有外部变化",
          "paragraphs": [
            "Unity 对象字段修改的 Undo，不等于任意文件系统操作都能自动回滚。工具若还写入外部文件、移动资源或调用别的服务，需要相应 API、备份或独立恢复设计。不能因为按钮里开了一个撤销组，就向用户保证所有副作用都可一键复原。",
            "最后按正常操作、无选择、多选、Prefab 实例和重开场景检查一遍。保留修改前后位置及覆盖信息，说明一次撤销恢复了哪些内容。可靠的编辑工具让作者知道将改谁、怎样撤回、哪些变化需要另外保存；这些比“只需一键”的宣传更有实际价值。"
          ]
        }
      ],
      "code": {
        "title": "只移动当前选择，保留撤销与覆盖",
        "language": "csharp",
        "filename": "Editor/AlignSelectedTools.cs",
        "source": "using UnityEditor;\nusing UnityEngine;\n\npublic static class AlignSelectedTools\n{\n    [MenuItem(\"Engine Lab/Align Selected X\")]\n    private static void Align()\n    {\n        Transform[] targets = System.Array.FindAll(Selection.transforms, t => !EditorUtility.IsPersistent(t));\n        if (targets.Length == 0) return;\n        Undo.RecordObjects(targets, \"Align Selected X\");\n        foreach (Transform target in targets)\n        {\n            Vector3 p = target.position;\n            target.position = new Vector3(0f, p.y, p.z);\n            if (PrefabUtility.IsPartOfPrefabInstance(target))\n                PrefabUtility.RecordPrefabInstancePropertyModifications(target);\n        }\n    }\n}",
        "explanation": [
          "保存到正确的 Editor 范围。在实验场景选取两个互不为父子的 Transform；本例过滤持久资源，只直接写入选择范围。父子嵌套选择会受层级联动与处理顺序影响，扩展前需单独制定选择和赋值策略。",
          "工具只改已有对象的位置。若要创建、删除或改变父子关系，需要改用对应的 Undo 方式并重新验证。",
          "Prefab 覆盖实验使用实例内的 Marker 子 Transform。Prefab 根的 Position/Rotation 属于特殊默认变换，不能用它们代替普通显式属性覆盖的 Revert 实验。"
        ]
      },
      "lab": [
        {
          "title": "撤销顺序实验",
          "minutes": 60,
          "steps": [
            "创建两个互不为父子的场景对象：甲放到 (2,1,0)、乙放到 (-4,3,0)。同时选中两者执行 Align Selected X；核对只有世界 X 变为 0，未选对象不变。",
            "一次撤销应恢复两者原位置，重做再次对齐。",
            "故意把 RecordObjects 移到赋值之后，在副本实验比较。",
            "恢复正确代码并检查无选择时无动作。"
          ],
          "result": "记录时机与数据所有者都正确。"
        },
        {
          "title": "Prefab 覆盖验证",
          "minutes": 60,
          "steps": [
            "创建 Root/Marker 的 Prefab，令 Marker 的 localPosition=(1,0,0)。场景放甲、乙两个实例，根旋转保持零、缩放为1；甲根的世界X设为2，记录甲子对象世界X=3。",
            "只选甲的 Marker 子 Transform 执行 Align Selected X，不同时选其父级。记录世界X=0、局部X=-2，检查乙子对象及源资产仍保持原值。",
            "查看甲子对象的位置覆盖并对它执行 Revert，核对局部X恢复1、世界X恢复3，而甲根仍在世界X=2。不要用 Prefab 根的 Position/Rotation 作普通显式覆盖对照。",
            "再执行一次对子对象的修改，保存并重开实验场景，核对该覆盖仍在；结合第一组独立场景对象实验，分别说明 Undo 与 Revert 恢复的来源。"
          ],
          "result": "子对象覆盖可保存并恢复到源资产局部值；根变换的默认行为与普通显式覆盖分别解释，源资产和其他实例未被误改。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "Ctrl+Z 没恢复原值",
          "cause": "在修改后才记录，或记录了错误对象。",
          "fix": "修改前记录真正的数据所有者。"
        },
        {
          "symptom": "其他 Prefab 实例一起变化",
          "cause": "工具改到了源资产或共享资源。",
          "fix": "明确实例/资产范围并检查覆盖记录。"
        }
      ],
      "exercise": {
        "brief": "编写一个选中对象排列工具，具备操作范围、一次撤销、重做、Prefab 覆盖和空选择处理。",
        "deliverables": [
          "工具脚本",
          "五阶段回退验证",
          "实例与资产作用范围说明"
        ],
        "rubric": [
          {
            "item": "记录时机正确",
            "points": 30
          },
          {
            "item": "一动作一撤销",
            "points": 25
          },
          {
            "item": "Prefab 范围安全",
            "points": 30
          },
          {
            "item": "空选择和诊断清楚",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "Undo.RecordObject 应何时调用？",
          "options": [
            "修改之前",
            "先赋完新值再记录",
            "只在保存场景时记录"
          ],
          "answer": 0,
          "explanation": "先记录修改前状态，再赋新值，才有依据恢复原数据；赋值之后记录不能替你找回已覆盖内容。"
        },
        {
          "question": "SetDirty 等同完整 Undo 吗？",
          "options": [
            "等同，文件最后会被保存即可",
            "不等同，修改标记不等于完整撤销历史",
            "等同，实例覆盖会补齐所有撤销记录"
          ],
          "answer": 1,
          "explanation": "脏标记、撤销历史和 Prefab 实例覆盖分别处理不同问题，不能用 SetDirty 代替完整编辑流程。"
        },
        {
          "question": "修改实例位置后应验证什么？",
          "options": [
            "未选实例和源资产没有误改，本实例覆盖正确",
            "所有同 Prefab 实例都跟着变化",
            "控制台没有异常就不必检查覆盖"
          ],
          "answer": 0,
          "explanation": "只选一个实例时，源资产及其他实例应保持不变，同时确认本实例覆盖可撤回和保存。"
        }
      ],
      "references": [
        {
          "label": "Undo",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Undo.html"
        },
        {
          "label": "PrefabUtility.RecordPrefabInstancePropertyModifications",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/PrefabUtility.RecordPrefabInstancePropertyModifications.html"
        },
        {
          "label": "Prefab instance overrides：Transform overrides",
          "url": "https://docs.unity3d.com/6000.3/Documentation/Manual/PrefabInstanceOverrides.html"
        }
      ],
      "summary": [
        "赋值前记录正确对象，按一次用户动作组织撤销。",
        "脏标记、Undo 和 Prefab 覆盖解决不同问题，外部文件另行处理。"
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
        "question": "把两个对象的世界 X 都设为 0 后，为什么 Undo 可能找不回它们原来的位置？",
        "keyIdea": "撤销需要在修改前记录状态，并明确一次操作包含哪些对象。保存、脏标记和 Prefab 覆盖也要分别处理。",
        "walkthrough": [
          {
            "title": "记录修改对象",
            "text": "甲原为 (2,1,0)，乙为 (-4,3,0)；同时选中两者，并在赋值前记录两个 Transform 的 Undo。"
          },
          {
            "title": "应用一次操作",
            "text": "运行 Align Selected X：甲变成 (0,1,0)，乙变成 (0,3,0)。只改 X，不改两者高度，并记录需要的 Prefab 实例覆盖。"
          },
          {
            "title": "检查恢复范围",
            "text": "一次 Undo 应恢复两者位置；重做后再检查未选实例和源资产都没有改变。"
          }
        ],
        "prediction": {
          "question": "调用 SetDirty 后，是否已经获得完整撤销历史？",
          "answer": "没有。它涉及数据修改标记，不等于记录了修改前状态；仍要使用适合的 Undo 或序列化编辑方式。"
        }
      }
    },
    {
      "id": "l088",
      "title": "Scene 视图工具：把空间数据变得可见",
      "prerequisites": [
        "l020",
        "l087"
      ],
      "goals": [
        "用 Gizmos 与 Handles 区分展示和编辑",
        "在世界/局部空间之间正确转换",
        "让 Scene 修改支持 Undo"
      ],
      "theory": [
        {
          "title": "先说清楚圆圈表示多少距离",
          "paragraphs": [
            "你为范围攻击画一个 Scene 视图圆圈，半径字段是 2。它表示世界中 2 个单位，还是物体局部空间中的 2？如果图形按父级缩放变大，而物理查询仍用世界半径 2，作者看到的命中范围就与实际不同。先定义单位，再讨论怎样画，才能避免工具给出错误提示。",
            "本课把 radius 明确定义为世界单位，圆心取目标的世界位置。父对象缩放改变时，半径仍表示世界距离 2，不再额外乘 lossyScale。若需求本来是局部圆，经过非均匀缩放后形状可能改变，那是另一种表示，需要另写转换与说明，不能混用同一个字段含义。"
          ]
        },
        {
          "title": "从已知尺子开始验证空间",
          "paragraphs": [
            "先用明确坐标代替“看着差不多”：令圆心的世界位置为 (10,0,0)，radius=2，那么沿世界 X 轴的两个球面边界就是 x=8 和 x=12。示例画的是三维球形范围，在 Scene 视图中可看到它的线框圆。旁边放单位立方体作尺子，再移动或旋转父对象，核对圆心跟随目标世界位置、半径仍为 2。只在原点、无父级时测试，局部与世界坐标的错误可能碰巧抵消，因此不能只凭那一组结果判断正确。",
            "接着旋转父对象，再设置不相同的轴向缩放。因为本课半径以世界单位定义，画出的距离不应跟着某个缩放轴任意改变。再用相同圆心和半径做物理查询，把命中的位置与图形比较。图形漂亮不够，作者需要相信它显示的是运行时实际使用的空间规则。"
          ]
        },
        {
          "title": "句柄改变后才写回数据",
          "paragraphs": [
            "Handles 提供可交互的 Scene 视图控件。绘制过程中先读取当前半径，显示句柄，检测用户是否真的修改；确认改变后，才记录 Undo 并写回新值。不是每次 OnSceneGUI 执行都应该重新赋值，因为布局和重绘本身并不代表用户有新意图。",
            "把数据写入与真实变化对应，可以减少无意义脏状态和撤销记录。修改后还要处理 Prefab 实例覆盖，并验证撤销、重做和 Revert。空间数学正确却无法撤销，仍不是可靠工具；反过来，撤销正常也不能证明圆圈与实际查询用的是同一坐标空间。"
          ]
        },
        {
          "title": "单选和多选是两种操作设计",
          "paragraphs": [
            "本例只支持单对象半径句柄，避免替多选交互作未经定义的决定。多选时是每个对象各画一个句柄，还是改变一个共同半径？拖动一个是否影响全部？这些问题需要工具作者先确定，不能只加上多选标记就假定行为自然合理。",
            "选择变化时，也要确认句柄对应当前对象，不能继续使用上次缓存目标。Scene 视图工具应尽量与 Inspector 使用同一份数据来源。一个窗口显示旧值、另一个地方改新值，会让作者无法判断实际结果；必要时刷新数据，并清楚区分只显示与真正修改。"
          ]
        },
        {
          "title": "极端配置能暴露隐藏假设",
          "paragraphs": [
            "测试零半径、大半径、远离原点、旋转父级和非均匀缩放。负值应根据约束拒绝或限制，绘制不能产生与字段含义相反的结果。大范围时句柄仍需可选中、不会挡住所有视图；这属于工具可用性，也值得记录，不是只有数学公式正确才算完成。",
            "还要比较编辑模式保存的修改与播放中的临时修改。停止播放后结果为何恢复或留下，应按实际对象和编辑流程解释。最终交付示例、单位说明和对照截图，让别人能从 radius=2 预测世界里哪一圈会被检查，而不是只能凭直觉拖到看起来差不多。"
          ]
        }
      ],
      "code": {
        "title": "世界半径句柄：不受父级缩放改变语义",
        "language": "csharp",
        "files": [
          {
            "filename": "Runtime/WorldRadius.cs",
            "source": "// Runtime/WorldRadius.cs\nusing UnityEngine;\npublic sealed class WorldRadius : MonoBehaviour\n{\n    [Min(0f)] public float radius = 2f;\n    private void OnDrawGizmosSelected()\n    {\n        Gizmos.color = Color.green;\n        Gizmos.DrawWireSphere(transform.position, radius);\n    }\n}\n\n"
          },
          {
            "filename": "Editor/WorldRadiusEditor.cs",
            "source": "// Editor/WorldRadiusEditor.cs\nusing UnityEditor;\nusing UnityEngine;\n[CustomEditor(typeof(WorldRadius))]\npublic sealed class WorldRadiusEditor : Editor\n{\n    private void OnSceneGUI()\n    {\n        var value = (WorldRadius)target;\n        EditorGUI.BeginChangeCheck();\n        float next = Handles.RadiusHandle(Quaternion.identity, value.transform.position, value.radius);\n        if (!EditorGUI.EndChangeCheck()) return;\n        Undo.RecordObject(value, \"Change World Radius\");\n        value.radius = Mathf.Max(0f, next);\n        PrefabUtility.RecordPrefabInstancePropertyModifications(value);\n    }\n}"
          }
        ],
        "explanation": [
          "运行组件与 Editor 类分别保存。radius 明确是世界单位，绘制和查询都按这个含义使用，不额外乘 lossyScale。",
          "本例句柄只处理单对象。扩展多选前先定义修改一个句柄对其他对象的影响，再补相应撤销与覆盖测试。"
        ]
      },
      "lab": [
        {
          "title": "世界单位不变量",
          "minutes": 60,
          "steps": [
            "在 Scene 视图放已知尺寸的单位立方体作尺子，把目标移到原点外后设置世界半径。",
            "在原点外拖半径，观察绘制与数值对应。",
            "加入旋转和非均匀缩放父级，确认仍是世界半径。",
            "明确使用三维 Physics.OverlapSphere，以相同世界圆心和半径做查询；在球面内外各放一个带 3D Collider 的测试对象，比较命中与可视范围。不要用 2D 查询来验证这个三维球。"
          ],
          "result": "查询与图形使用同一世界空间定义。"
        },
        {
          "title": "编辑行为回归",
          "minutes": 60,
          "steps": [
            "拖动半径句柄，分别执行撤销和重做，查看字段值与可视范围是否一起恢复。",
            "在 Prefab 实例上验证覆盖和 Revert。",
            "测试零半径、大半径和父级变化。",
            "比较 Play Mode 临时修改与编辑模式保存修改。"
          ],
          "result": "空间正确性与编辑器数据机制同时成立。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "圈内对象没有被检测到",
          "cause": "绘制和查询使用了不同坐标或缩放约定。",
          "fix": "统一字段空间定义，并在带父级情况下验证。"
        },
        {
          "symptom": "场景每次重绘都变脏",
          "cause": "未检测变化便持续写字段。",
          "fix": "只在句柄实际变化后记录和提交。"
        }
      ],
      "exercise": {
        "brief": "做一个局部矩形生成区域工具，支持旋转父级，显示四角并保留撤销，说明非均匀缩放的含义。",
        "deliverables": [
          "字段与空间定义",
          "带父级场景验证",
          "Undo 和 Prefab 回归结果"
        ],
        "rubric": [
          {
            "item": "空间转换正确",
            "points": 35
          },
          {
            "item": "运行与绘制一致",
            "points": 25
          },
          {
            "item": "编辑事务可靠",
            "points": 25
          },
          {
            "item": "边界约定明确",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "世界半径应直接乘父级缩放吗？",
          "options": [
            "必须，世界量也总要再乘父缩放",
            "不应，它已经按世界单位定义",
            "只乘 lossyScale.x 就适用于所有非均匀缩放"
          ],
          "answer": 1,
          "explanation": "世界半径已经是最终距离，再乘缩放会改变含义；非均匀缩放也不是用单个分量就能统一修正。"
        },
        {
          "question": "每次 OnSceneGUI 都写字段会怎样？",
          "options": [
            "提高浮点计算精度",
            "可能产生无意义修改和脏状态",
            "能自动保证物理查询与图形一致"
          ],
          "answer": 1,
          "explanation": "绘制事件不等于用户修改。无条件赋值可能带来无意义脏状态或历史记录。"
        },
        {
          "question": "最能暴露空间错误的实验是？",
          "options": [
            "只在原点、无父级时测试",
            "旋转父级并使用非均匀缩放测试",
            "只比较字段声明值是否为正"
          ],
          "answer": 1,
          "explanation": "旋转和非均匀缩放会暴露坐标空间假设；只在原点默认变换下测，错误可能碰巧看不出来。"
        }
      ],
      "references": [
        {
          "label": "Handles.RadiusHandle",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Handles.RadiusHandle.html"
        },
        {
          "label": "Transform.TransformPoint",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.TransformPoint.html"
        }
      ],
      "summary": [
        "先定义字段的空间和单位，再让图形、句柄与查询保持一致。",
        "只在实际交互改变后写数据，并验证父级变换、撤销和实例覆盖。"
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
        "question": "父对象放大两倍，世界半径为 2 的攻击圈为什么不应该再乘两倍？",
        "keyIdea": "字段已经按世界距离定义，再乘父缩放会改变它原来的含义。绘制和物理查询必须使用相同圆心、空间和单位。",
        "walkthrough": [
          {
            "title": "定义单位",
            "text": "radius=2 表示世界距离 2，以目标世界位置为圆心，旁边放单位立方体作尺子。"
          },
          {
            "title": "改变父级",
            "text": "旋转并非均匀缩放父对象；世界半径仍为 2，不用一个缩放分量补偿。"
          },
          {
            "title": "对照真实查询",
            "text": "使用同样世界圆心和半径做查询，比较边界位置是否与 Scene 图形一致。"
          }
        ],
        "prediction": {
          "question": "每次重绘都写回 radius，会提高精度吗？",
          "answer": "不会。应在真实交互改变时才记录和写入，否则可能制造无意义修改与撤销记录，不能改善空间定义。"
        }
      }
    },
    {
      "id": "l089",
      "title": "资源导入工具：范围、幂等与批处理",
      "prerequisites": [
        "l045",
        "l087"
      ],
      "goals": [
        "把导入规则限制到明确目录",
        "理解重复导入的幂等性",
        "避免导入回调循环与全项目误改"
      ],
      "theory": [
        {
          "title": "先限定哪些图片才是像素精灵",
          "paragraphs": [
            "项目中同时有像素角色、UI 图标和三维材质纹理。若导入工具把所有 PNG 都设成 Point Sprite，角色也许清晰了，其他资源却可能被错误处理。自动导入规则首先要说明用途和范围，例如只处理指定实验目录里的小像素图，而不是根据扩展名猜所有图片用途相同。",
            "示例把范围写在入口的路径判断中：只有路径以 Assets/EngineLab/PixelArt/ 开头，才继续设置 TextureImporter。于是 Assets/EngineLab/PixelArt/Hero.png 会命中，Assets/UI/Hero.png 不会；Assets/EngineLab/PixelArtwork/Hero.png 也不应因为名字相近就命中。这里判断的是项目资源路径，末尾斜杠有助于表达完整目录边界。AssetPostprocessor 随导入过程运行，修改的是导入配置；把这几类路径放在一起作对照，才能验证自动规则真正处理了谁。"
          ]
        },
        {
          "title": "重复导入为什么应得到同样设置",
          "paragraphs": [
            "同一张图连续 Reimport 三次，理想结果是同样的导入配置，没有额外副本，也没有越改越大的数值。这样的性质称为幂等，可以直接理解为“重复执行不会再叠加改变”。例如把过滤模式设为 Point，而不是每次导入都根据当前值再偏移一项。",
            "回调中无条件调用 SaveAndReimport，可能再次请求导入，引发重复甚至循环。本课直接在合适导入阶段赋需要的设置，不主动让自己再触发一次。确实需要后续重导入的工具，也应检测差异、控制范围并解释终止条件，不能靠用户手动打断。"
          ]
        },
        {
          "title": "统一设置不等于每种资源都最优",
          "paragraphs": [
            "像素精灵还涉及 PPU、切片、枢轴和压缩，但本课最小示例并未自动替你完成这些工作。过滤方式一致，只解决采样的一部分问题；角色大小不同可能来自 PPU，动画位置跳动可能来自切片和枢轴。不要看到一个导入工具就以为素材所有配置已经正确。",
            "示例选择无压缩便于观察图像差异，也不代表发布时无压缩总是最好。平台支持、内存预算、尺寸和视觉质量都要考虑。先用小图验证规则，再在目标设备看实际结果；实验为了控制变量作出的选择，应与正式资源政策分别写明。"
          ]
        },
        {
          "title": "批量修改前，先让作者知道将改什么",
          "paragraphs": [
            "将规则扩展到现有素材时，先做只读扫描，列出命中路径、当前值和计划值。作者应能看到哪些会变化、哪些例外会跳过，再明确执行。尤其第三方素材可能依赖自带切片和设置，不宜为了统一风格就批量覆盖所有导入器。",
            "批处理可能中途失败，因此需要进度、失败清单和恢复说明。版本控制能帮助查看文件变化，但并不代替限定作用范围。先复制少量实验资源，保存修改前后对照，确认没有无关文件被改，再考虑较大范围；工具越自动，越需要让操作对象清晰可见。"
          ]
        },
        {
          "title": "最终结果还受目标平台配置影响",
          "paragraphs": [
            "导入器的通用设置之外，还可能有平台覆盖、尺寸限制和格式选择。编辑器当前预览正确，并不能证明目标构建最终使用相同格式和占用。查看实际目标平台结果，记录覆盖是否改变通用设置，再判断资源在设备上是否符合预算。",
            "最终实验交付包含三张目标图和一张范围外对照、三次重导入结果，以及明确未自动处理的项目。别人应能回答为什么这张图被修改、为什么另一张跳过、重复执行会怎样。这样导入工具才是可预测的数据处理，而不是藏在后台、出现问题时无从追查的魔法。"
          ]
        }
      ],
      "code": {
        "title": "仅对实验像素素材设置导入参数",
        "language": "csharp",
        "filename": "Editor/PixelArtImportPolicy.cs",
        "source": "using UnityEditor;\nusing UnityEngine;\n\npublic sealed class PixelArtImportPolicy : AssetPostprocessor\n{\n    private void OnPreprocessTexture()\n    {\n        if (!assetPath.StartsWith(\"Assets/EngineLab/PixelArt/\", System.StringComparison.Ordinal)) return;\n        var importer = (TextureImporter)assetImporter;\n        importer.textureType = TextureImporterType.Sprite;\n        importer.filterMode = FilterMode.Point;\n        importer.mipmapEnabled = false;\n        importer.textureCompression = TextureImporterCompression.Uncompressed;\n    }\n}",
        "explanation": [
          "保存到正确的 Editor 范围，只用指定实验文件夹里的小图测试。示例不自动完成 Sprite 切片、枢轴或 PPU 配置。",
          "回调里不主动调用 SaveAndReimport。连续重导入并比较范围外图片，验证重复执行和作用范围。"
        ]
      },
      "lab": [
        {
          "title": "三张目标与一张例外",
          "minutes": 60,
          "steps": [
            "把三张小像素图的副本放入规则指定的实验目录，先记录 importer 的原始设置。",
            "在其他目录放一张对照图，记录初始设置。",
            "导入后比较四张图片的 importer。",
            "连续 Reimport 三次，确认没有追加资源或额外变化。"
          ],
          "result": "规则范围与幂等性有对照证据。"
        },
        {
          "title": "从政策到批量工具计划",
          "minutes": 60,
          "steps": [
            "针对两类图片分别写出 PPU、切片、枢轴和压缩需要哪些设置，哪些不该由此例自动决定。",
            "设计只读扫描报告，显示哪些资源将改变。",
            "为例外纹理和失败资源规定处理行为。",
            "用版本控制查看实验改动，不批量修改全部第三方素材。"
          ],
          "result": "自动化政策具有范围和回滚说明。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "普通 UI 或法线图被错误改成 Sprite",
          "cause": "导入规则范围过宽。",
          "fix": "按明确目录和资源类别过滤，加入例外对照。"
        },
        {
          "symptom": "Unity 不断重新导入资源",
          "cause": "回调无条件触发 SaveAndReimport 等递归行为。",
          "fix": "区分本次参数设置和新一轮导入请求。"
        }
      ],
      "exercise": {
        "brief": "设计像素角色与普通 UI 两类导入政策，先输出差异预览，再在实验副本中提交，重复执行应无额外改动。",
        "deliverables": [
          "两类政策说明",
          "差异预览与例外样本",
          "重复执行和回滚记录"
        ],
        "rubric": [
          {
            "item": "作用范围精确",
            "points": 30
          },
          {
            "item": "重复执行幂等",
            "points": 30
          },
          {
            "item": "例外不误改",
            "points": 25
          },
          {
            "item": "平台与画质取舍清楚",
            "points": 15
          }
        ]
      },
      "quiz": [
        {
          "question": "所有 PNG 都设为 Point Sprite 合理吗？",
          "options": [
            "合理，扩展名相同就应有同样用途",
            "不合理，精灵、UI 和材质纹理需求不同",
            "合理，之后所有使用者会自动修正类型"
          ],
          "answer": 1,
          "explanation": "PNG 可能用于精灵、界面或材质。导入政策要按用途与范围决定，不能只按扩展名统一。"
        },
        {
          "question": "导入回调里无条件 SaveAndReimport 风险是？",
          "options": [
            "保证每次导入更接近目标结果",
            "可能重复导入或形成循环",
            "自动处理所有平台覆盖"
          ],
          "answer": 1,
          "explanation": "回调中的再次重导入可能触发自身，形成重复请求或循环，需要差异检测和明确终止条件。"
        },
        {
          "question": "无压缩示例是否等于发布最佳格式？",
          "options": [
            "是，无压缩总能同时减少内存和失真",
            "否，要结合平台、质量和内存预算",
            "是，编辑器显示正确就无需设备验证"
          ],
          "answer": 1,
          "explanation": "实验里的无压缩便于观察，不代表发布最优；仍要按平台支持、视觉和内存预算选择。"
        }
      ],
      "references": [
        {
          "label": "AssetPostprocessor",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetPostprocessor.html"
        },
        {
          "label": "TextureImporter",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/TextureImporter.html"
        }
      ],
      "summary": [
        "导入规则先确定用途和范围，重复导入不应继续叠加变化。",
        "实验参数不自动等于发布最优配置，平台覆盖需要实际检查。"
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
        "question": "为何导入工具不能把所有 PNG 都统一设成像素 Sprite？",
        "keyIdea": "文件格式不能说明用途。规则要先匹配明确资源范围，再设置可重复得到相同结果的导入参数。",
        "walkthrough": [
          {
            "title": "准备对照资源",
            "text": "三张小像素图放在实验目录，另放一张目录外图，记录原有 importer 设置。"
          },
          {
            "title": "执行范围内规则",
            "text": "执行导入后，只让命中实验目录的图片采用示例设置，并检查目录外对照图的 importer 没有被修改。"
          },
          {
            "title": "验证重复执行",
            "text": "连续 Reimport 三次，检查设置不再叠加改变，也没有额外资源或循环请求。"
          }
        ],
        "prediction": {
          "question": "设置 Point 后，PPU、切片和枢轴也自动正确了吗？",
          "answer": "没有。最小工具只处理已声明的参数，其他设置仍需根据资源用途配置和验证。"
        }
      }
    },
    {
      "id": "l090",
      "title": "EditorWindow 与只读验证：把问题变成报告",
      "prerequisites": [
        "l086",
        "l089"
      ],
      "goals": [
        "构建任务导向的编辑器窗口",
        "把扫描与修复分离",
        "输出带对象上下文的可操作诊断"
      ],
      "theory": [
        {
          "title": "验证窗口先回答一个作者正在问的问题",
          "paragraphs": [
            "你在场景里找不到 Idle 动画为何不播放，可能需要检查是否有 Animator、Controller 是否赋值，以及动画是否进入默认状态。一个实用的窗口应帮助定位这些具体条件，而不是堆一整页无关按钮。先列出用户想完成的检查，再决定扫描对象和显示内容。",
            "本课最小示例只检查当前选择对象的缺失脚本，不扫描子对象，也不自动移除组件。范围窄并不是缺点，只要界面说清楚。用户知道它检查了谁，才能正确理解“未发现问题”；否则可能把只扫描一个对象的结果误当成整个项目都已通过。"
          ]
        },
        {
          "title": "一条报告要让人知道去哪里、看什么",
          "paragraphs": [
            "一条报告至少要回答“谁、什么问题、去哪看”。例如先显示“检查 2 个选中对象，发现 1 个缺失脚本”，再用带对象上下文的警告指出具体是 Player。示例把 GameObject 作为 Debug.LogWarning 的 context 参数，作者可从 Console 的该条消息定位对象；仅有窗口中的汇总数字还不够。多个对象同名时，应继续补充层级或资源位置，让使用者无需逐个猜测。建议应针对缺失脚本的原因，而不是直接替用户删除组件。",
            "规则也要说明前提。有 SpriteRenderer 但没有 Animator，可能是漏配置的角色，也可能是合法静态装饰。若工具不知道作者意图，就应标成需检查的提示，而不是确定错误。动画诊断应逐层核对必要条件，不能只凭一个组件缺失就宣判所有对象有问题。"
          ]
        },
        {
          "title": "只读扫描和修复按钮分开",
          "paragraphs": [
            "打开窗口或点击扫描，不应该悄悄删除组件、写资源或修正场景。先让作者看到问题和影响范围，再决定是否执行单独修复。这样重复扫描可以安全比较结果，用户也不用担心“为了了解情况”已经改变了项目。",
            "确实提供修复时，要说明将改哪些对象，处理 Undo、Prefab 覆盖和保存。某些问题没有唯一修复方式，例如动画 Controller 可以选择多种资源，工具不能随意猜一个。能明确且安全自动修复的部分与需要人工判断的部分分开，会比一个“全部修复”按钮更可靠。"
          ]
        },
        {
          "title": "报告读取的是哪一刻的数据",
          "paragraphs": [
            "打开场景中的未保存修改，可能与磁盘上的场景文件不同。验证当前实时对象和读取磁盘资源，是两个任务。报告应记录来源与扫描范围，必要时标明未保存状态。否则用户对照文件看不到问题，或保存后问题变化，都难以解释。",
            "选择对象、组件或资源变化后，旧报告也不会自动变成当前真相。可以要求重新扫描，或明确实现适合的刷新；不要仍显示“全部正常”却不提示报告已经过时。本课先按按钮产生一次报告，把时点说清，再讨论更自动的更新方式。"
          ]
        },
        {
          "title": "扫描器也要有已知正确与错误的样本",
          "paragraphs": [
            "为工具准备正常对象、缺失脚本对象、空选择和多对象选择，按声明范围逐项核对。重复扫描后查看场景脏状态，确认扫描本身没有写数据。扩展子对象范围时，新增层级对照，避免父子重复计数或遗漏停用对象等条件。",
            "再为 Idle 准备三类样本：静态 Sprite、Animator 缺 Controller、正常播放 Idle 的角色。写出每条判断能确定什么、还需要人工确认什么。工具完成标准是报告准确、可定位且不会误改；它帮助你缩小问题，而不是替代引擎原理学习或用红绿图标掩盖不确定性。"
          ]
        }
      ],
      "code": {
        "title": "仅扫描当前选择的缺失脚本",
        "language": "csharp",
        "filename": "Editor/SelectionAuditWindow.cs",
        "source": "using UnityEditor;\nusing UnityEngine;\n\npublic sealed class SelectionAuditWindow : EditorWindow\n{\n    private string result = \"尚未扫描。只读检查当前选择，不修改对象。\";\n    [MenuItem(\"Engine Lab/Selection Audit\")]\n    private static void Open() => GetWindow<SelectionAuditWindow>(\"Selection Audit\");\n    private void OnGUI()\n    {\n        EditorGUILayout.LabelField(\"范围：当前选中的 GameObject\");\n        if (GUILayout.Button(\"只读扫描\")) Scan();\n        EditorGUILayout.HelpBox(result, MessageType.Info);\n    }\n    private void Scan()\n    {\n        int missing = 0;\n        foreach (GameObject item in Selection.gameObjects)\n            foreach (MonoBehaviour component in item.GetComponents<MonoBehaviour>())\n                if (component == null)\n                {\n                    missing++;\n                    Debug.LogWarning($\"Missing script on {item.name}\", item);\n                }\n        result = $\"检查 {Selection.gameObjects.Length} 个对象，发现 {missing} 个缺失脚本。\";\n    }\n}",
        "explanation": [
          "保存到正确的 Editor 范围。示例只扫描当前选择对象，不递归子对象，也不会自动移除缺失组件。",
          "扩展规则时继续说明对象范围和数据来源，给报告附可定位上下文；修复另设明确操作并处理撤销。"
        ]
      },
      "lab": [
        {
          "title": "验证扫描器不写数据",
          "minutes": 60,
          "steps": [
            "在专用场景准备一个正常对象和一个缺失脚本对象，先记录保存状态，再逐个选中扫描。",
            "选中后扫描，点击控制台上下文定位。",
            "重复扫描，确认场景没有因扫描产生新修改。",
            "空选择、多个对象和含子对象时验证已声明范围。"
          ],
          "result": "扫描结果准确且没有隐藏修改。"
        },
        {
          "title": "为 Idle 建立诊断规则",
          "minutes": 60,
          "steps": [
            "准备静态 Sprite、Animator 未赋 Controller、正常 Idle 三类对象，明确哪些情况才算错误。",
            "写下每条规则的适用前提和建议。",
            "只读扫描，区分确定错误和可能合法的静态图。",
            "设计独立修复动作的 Undo/Prefab 方案，但不自动删数据。"
          ],
          "result": "报告能指导下一步操作而不误解设计意图。"
        }
      ],
      "pitfalls": [
        {
          "symptom": "点检查后场景被悄悄修改",
          "cause": "扫描和修复混在同一流程。",
          "fix": "默认只读报告，修复使用独立且可撤销动作。"
        },
        {
          "symptom": "装饰对象全被报错",
          "cause": "规则没有适用前提。",
          "fix": "区分必需角色配置与合法静态表现。"
        }
      ],
      "exercise": {
        "brief": "做一个角色准备度验证窗口，检查缺失脚本、缺失 Animator Controller 和必要引用，提供可定位的只读报告与误报测试。",
        "deliverables": [
          "规则及适用前提",
          "窗口与四类样本",
          "误报/漏报和无写入验证"
        ],
        "rubric": [
          {
            "item": "范围透明",
            "points": 20
          },
          {
            "item": "诊断具体可操作",
            "points": 30
          },
          {
            "item": "规则样本覆盖",
            "points": 30
          },
          {
            "item": "只读与构建隔离",
            "points": 20
          }
        ]
      },
      "quiz": [
        {
          "question": "打开验证窗口就应自动修复全部问题吗？",
          "options": [
            "应该，扫描到问题就删除相关组件",
            "不应，先报告，再明确执行修复",
            "只要按钮名字叫修复就不用说明影响"
          ],
          "answer": 1,
          "explanation": "了解问题与改变项目是两件事。先报告，再让作者根据具体影响决定修复，能避免隐藏修改。"
        },
        {
          "question": "磁盘场景与实时场景扫描可能不同吗？",
          "options": [
            "不会，打开场景就总和磁盘一致",
            "会，实时场景可能存在未保存修改",
            "只要代码编译成功就不会不同"
          ],
          "answer": 1,
          "explanation": "实时场景可能有未保存变化，磁盘文件则仍是上次保存的状态，报告必须说明读取哪一个。"
        },
        {
          "question": "好的诊断至少包含什么？",
          "options": [
            "只显示红色图标和问题总数",
            "对象上下文、具体原因和处理建议",
            "只有扫描耗时，避免显示对象名称"
          ],
          "answer": 1,
          "explanation": "对象、原因和建议能让用户找到并处理问题；只有数量或颜色不足以指导行动。"
        }
      ],
      "references": [
        {
          "label": "EditorWindow",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/EditorWindow.html"
        },
        {
          "label": "Selection.gameObjects",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Selection-gameObjects.html"
        },
        {
          "label": "Debug.LogWarning：对象上下文",
          "url": "https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Debug.LogWarning.html"
        }
      ],
      "summary": [
        "报告写明检查了谁、何时检查，以及规则适用前提。",
        "先只读定位问题，修复作为独立操作，并用正常与错误样本验证工具。"
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
        "question": "扫描器说“没有问题”，为什么仍不能证明整个场景的 Idle 都能播放？",
        "keyIdea": "结论只适用于实际扫描范围和规则。报告要写清对象、时点及判定前提，只读检查与修改操作应分开。",
        "walkthrough": [
          {
            "title": "明确最小范围",
            "text": "选中 Player 后扫描，本例只检查该对象本身的缺失脚本，不检查子对象和动画状态。"
          },
          {
            "title": "解释具体结果",
            "text": "报告附对象上下文和原因，让作者定位；没有命中规则只表示本范围内未发现该类问题。"
          },
          {
            "title": "用已知样本验证",
            "text": "分别扫描正常、缺失脚本和空选择，重复执行并确认场景没有因扫描而修改。"
          }
        ],
        "prediction": {
          "question": "有 SpriteRenderer、无 Animator 的对象一定是错误吗？",
          "answer": "不一定。它可能是静态装饰；只有明确要求播放动画时，这才成为需要修复的配置条件。"
        }
      }
    }
  ]
});
