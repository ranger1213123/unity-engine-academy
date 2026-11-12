# 本轮采用的写作 skills

查询与采用日期：2026-11-12。目的是改善中文讲解、补全读者背景并检验能否独立照做。GitHub 星数只反映仓库关注度，不是单个 skill 的评分，也不是 Unity 技术正确性的证明。引擎行为仍以对应版本的 Unity 官方文档为依据。

| Skill | GitHub 来源 | 查询时仓库星数 | 采用的固定提交 |
| --- | --- | ---: | --- |
| Humanizer-zh | [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh)，根目录 SKILL.md | 22,641 | `f4518a8eab97b8bfebc66a89d34320a89bef6930` |
| doc-coauthoring | [anthropics/skills](https://github.com/anthropics/skills/tree/2c5958ecac7cee2b583967a2c4981d0f4a75c579/skills/doc-coauthoring)，skills/doc-coauthoring/SKILL.md | 193,326 | `2c5958ecac7cee2b583967a2c4981d0f4a75c579` |

已通过 Codex 的 skill-installer 安装到本机 skills 目录，修订者读取后使用；公开仓库只保留来源和采用说明，不复制外部 skill 全文。后续 Codex 会话可直接发现已安装的 skills。

## Humanizer-zh 怎样用于教材

采用明确主语、具体对象、自然段落和可观察的动作，删除泛泛的评价、重复结语、模糊指代和生硬的对比句。保留准确术语，同时解释它在当前例子中指什么。不能为了句子顺口删掉版本、前提、数量单位和结论范围，也不能虚构“实测过”的经历。

本轮允许扩写情景，因此遇到 A/B、甲乙、“该组件”等指代时补出实际对象和初始状态；重复十次、比较两组时说明为什么重复、只改变什么。写作目标是可理解的中文技术教材，不采用营销语气，也不以规避检测作为验收目标。

## doc-coauthoring 怎样用于教材

采用“明确受众与目标—修订正文—新读者盲测”的方法。受众和500小时课程目标已确定，直接进入修订。另启一位不继承作者历史的读者，只给第一课材料，要求指出必须靠猜才能继续的步骤；作者修正后再复核。

这次盲测专查具体问题：词指什么、窗口从哪里打开、下一步做什么、结果在哪看、失败时怎样继续。自动结构检查只验证字段齐全、网页呈现和导航，不能代替盲读，更不能证明真实初学者一定能完成所有 Unity 实验。

## 查找后未采用的候选

同时查看了 [blader/humanizer](https://github.com/blader/humanizer)（查询时68,131星）和 [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills)（27,479星）。前者与中文版本规则重叠；后者查看的相关技能侧重格式、配图与分发，未作为这轮深度讲解修订的主方法。没有为凑数量叠加社媒或营销技能。

实际修订范围和验证结果见 [本轮修订记录](CONTEXT-REVIEW.md)，独立读者原始发现见 [第一课盲读报告](CONTEXT-reader-review.md)。
