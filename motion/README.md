# motion/

Scale Map 的动画层，跑在 [huashu-art-motion](https://github.com/alchaincyf/huashu-art-motion) 引擎上。引擎本身不放进这个仓库：它有 22MB，也有自己的许可证（代码 MIT，字体和部分素材另有许可）。

| 文件 | 作用 |
|---|---|
| `kit/scale_map_kit.js` | 共用工具，挂在 `window.SM`：脉冲镜头（带世界边界）、镜内硬切、线条沸腾缓存、铜版画排线套件、当代扁平零件 |
| `sync.sh` | 把一集接上引擎：第一次复制引擎到 `<剧集>/.work/engine`，之后同步 kit、scenes、`eras_<片名>.js`，并打印渲染和门禁命令 |

依赖：先装 huashu-art-motion（`npx skills add alchaincyf/huashu-art-motion`），再装 uv、ffmpeg 和 Playwright Chromium（`uv run --with playwright playwright install chromium`）。

新开一集：建 `episodes/<nn-slug>/`，写 `镜头表.md`（模板见 `references/storyboard-template.md`）、`eras_<片名>.js` 和 `scenes/`，然后 `motion/sync.sh episodes/<nn-slug>`。EP01 是完整的参考实现。
