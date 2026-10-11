# 产品蒸馏 EP__EP2__｜__NAME__

> 论点：（写一句）
> 结尾问题：（写一句）

[product-art](https://github.com/David0936/product-art) 系列的产品子仓库。方法和动画工具包在母仓库；这里只放这个产品的镜头表、证据账本、场景、配乐和成片。

| 路径 | 内容 |
|---|---|
| [product.yaml](product.yaml) | 产品清单 |
| [films/60s/镜头表.md](films/60s/镜头表.md) | 镜头表 + 史实与出处（lint 绿灯才写代码） |
| films/60s/scenes/ | 场景代码，一段一个文件 |
| films/60s/score.py | 配乐（可从 EP01 复制改写） |
| publish/ | 交付给平台的视频 |

渲染：在母仓库里跑 `motion/sync.sh products/__SLUG__/films/60s`。
