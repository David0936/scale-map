# Scale Map 镜头表模板

Copy the block below to `products/<slug>/films/<id>/镜头表.md`. The three lock lines and the table follow huashu-art-motion's format, so `storyboard_lint.py` can check them. Scale Map adds four things: the 论点 line, the frame role on each shot, an ad slot marker, and an evidence ledger that every on-screen number must appear in.

```markdown
# 产品蒸馏 EP<nn>｜<产品> · <时长> 秒镜头表

画风：时代媒介接力——<媒介1>（<年代>）→ <媒介2> → <媒介3> → <媒介4>，同一年代内画风不变，换媒介只在年代边界
色板：#2a2118, #ece2c9, #c8402e, #e8a93a, #2f5d50, #f6efe2
角色：只出手和背影

论点：<一句话因果论点>；最后问：<消失之问>
广告位：<秒数> 秒处（当代段之前）留剪辑点

| 时间段 | 画面里的物 | 它在做什么 | 镜头 | 屏上字 | 做法 |
|---|---|---|---|---|---|
| 0–4 | HOOK：<今天的产品＋一个物> | <它在做的小事> | 砸入 | | scenes/e1_now.js |
| … | BEFORE / TURNING POINT / EVOLUTION / NOW / AFTER … | | | | |
| 55–60 | AFTER：<产品＋开头那个物> | <产品自己的动作>，镜头拉远看全貌 | 快推 | <消失之问，写在物上> | scenes/e5_now.js |

## 史实与出处（屏上字里的每个年份、数字）

| 屏上 | 史实 | 来源 | 标记（事实／解读／推测） |
|---|---|---|---|
```

The frame role prefix (`HOOK：`, `BEFORE：` …) is optional inside the 物 column. Leave it out if it pushes a cell past readability; the lint ignores it either way.

Lint: `uv run <huashu>/scripts/storyboard_lint.py products/<slug>/films/<id>/镜头表.md`. Do not write code until it is green. See `products/robot-vacuum/films/60s/镜头表.md` for a complete example.
