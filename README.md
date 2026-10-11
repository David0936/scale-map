# Scale Map

**把产品放回人类文明尺度中观察。**

Scale Map 是一套研究驱动的视觉叙事系统。它从人的欲望出发，沿着时间、人物、空间与物的形态追踪一个产品为何出现、为何长成今天这样，并在最后追问：当需求被彻底解决，产品本身是否还需要存在？

它不是科技产品介绍模板，也不是“找几幅名画来恶搞”的提示词合集。

> **Never decorate history. Visualize it.**
> 不要拿历史做装饰，要让视觉本身承担叙事。

## 六层地图

- **HUMAN｜人的欲望** — 人为什么需要它？
- **TIME｜时间** — 从原始行为经过哪些节点走到今天？
- **PEOPLE｜人物** — 谁真正改变了路径？
- **SPACE｜空间** — 它怎样进入家庭、建筑、城市和生活？
- **OBJECT｜物** — 它为什么最终形成今天的形态？
- **FUTURE｜未来** — 当同一个需求被彻底解决，这个产品还会存在吗？

## 两种成品

**图文（6 张）**：HOOK、BEFORE、TURNING POINT、EVOLUTION、NOW、AFTER，每张只承担一个观点，配可生成的图像 brief。

**短片（60–90 秒，代码画出来的动画）**：同一条故事线展开成 12–16 个镜头，每个年代用那个年代的媒介来画——水墨、铜版画、广告海报、当代插画——这叫「时代媒介接力」。动画引擎用 [huashu-art-motion](https://github.com/alchaincyf/huashu-art-motion)，它的门禁全部照用：镜头表 lint 绿灯才写代码，qa、独立审片、deliver 红灯就不交付。

两种成品共用研究、论点、六帧故事、证据账本和角色规范。短片是把图文的因果主线放进时间里，不是另讲一个故事。

## 两个角色

**David 是 Narrative NPC。** 他不站在每页中心讲解，而是属于历史现场的人，也是建立空间尺度的 scale figure。图文里封面出现一次，正文随机出现一至两次，正文不看镜头。短片里最多出现在两段，只出背影或混在人群里。

**小龙虾是 Visual Easter Egg。** 它负责一点荒诞和寻找乐趣，不必与 David 绑定，也不承担知识解释。短片里每种媒介最多藏一只。

## 使用

将本仓库作为 Skill 使用后，可以直接提出：

> Scale Map：蒸馏洗衣机。
> Scale Map：把洗碗机做成 60 秒短片。

图文产出研究论点、六层地图、逐页故事板、视觉与角色调度、可生成的图像 brief、发布文案和证据账本。短片在此基础上再产出镜头表、三个风格方向、逐段场景代码和过了门禁的成片。

## 目录

| 路径 | 内容 |
|---|---|
| [SKILL.md](SKILL.md) | 核心执行规则：六层地图、五个阶段、质量门 |
| [references/style-bible.md](references/style-bible.md) | David、小龙虾、历史媒介、构图（含短片部分） |
| [references/deliverable.md](references/deliverable.md) | 完整交付格式（图文与短片） |
| [references/film-pipeline.md](references/film-pipeline.md) | 从六帧到镜头表、屏上字、媒介接力、搭建、EP01 踩过的坑、门禁 |
| [references/media-relay.md](references/media-relay.md) | 年代 → 媒介 → 渲染器 → 转场对照表，以及备选方向 |
| [references/storyboard-template.md](references/storyboard-template.md) | Scale Map 版镜头表模板 |
| [motion/](motion/) | 动画工具包和接引擎的脚本 |
| [episodes/01-robot-vacuum/](episodes/01-robot-vacuum/) | 第一集：扫地机器人（进行中，参考实现） |

## 短片依赖

```sh
npx skills add alchaincyf/huashu-art-motion
uv run --with playwright playwright install chromium      # 另需 uv、ffmpeg
motion/sync.sh episodes/01-robot-vacuum                    # 接上引擎，打印渲染与门禁命令
```
