#!/usr/bin/env bash
# 新开一期产品：从 templates/product 生成一个独立的产品子仓库，并挂到 products/<slug>。
#
# 用法：tools/new-product.sh <slug> <中文名> [期数]
#   例：tools/new-product.sh dishwasher 洗碗机 2
#
# 子仓库先在本地建好（../scale-map-<slug>），.gitmodules 里写的是 GitHub 地址
# https://github.com/<owner>/scale-map-<slug>.git。在 GitHub 上建同名空仓库后：
#   git -C ../scale-map-<slug> push -u origin main
# owner 默认 David0936，可用环境变量 OWNER 改。
set -euo pipefail

SLUG="${1:?用法：tools/new-product.sh <slug> <中文名> [期数]}"
NAME="${2:?缺中文名}"
[[ "$SLUG" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || { echo "slug 只能用小写字母、数字和连字符：$SLUG" >&2; exit 1; }

HUB="$(cd "$(dirname "$0")/.." && pwd)"
OWNER="${OWNER:-David0936}"
DEST="$(dirname "$HUB")/scale-map-$SLUG"
[ -e "$HUB/products/$SLUG" ] && { echo "products/$SLUG 已存在" >&2; exit 1; }
[ -e "$DEST" ] && { echo "$DEST 已存在" >&2; exit 1; }

# 期数默认 = 现有产品数 + 1
EP="${3:-$(( $(ls -d "$HUB"/products/*/ 2>/dev/null | wc -l) + 1 ))}"
EP2="$(printf '%02d' "$EP")"

cp -R "$HUB/templates/product" "$DEST"
mv "$DEST/films/60s/eras_ep__EP2__.js" "$DEST/films/60s/eras_ep$EP2.js"
find "$DEST" -type f \( -name '*.md' -o -name '*.yaml' -o -name '*.js' \) -print0 |
  xargs -0 sed -i.bak -e "s/__SLUG__/$SLUG/g" -e "s/__NAME__/$NAME/g" -e "s/__EP2__/$EP2/g" -e "s/__EP__/$EP/g"
find "$DEST" -name '*.bak' -delete

git -C "$DEST" init -q -b main
git -C "$DEST" add -A
git -C "$DEST" commit -q -m "EP$EP2 $NAME：从 scale-map 模板新建"

cd "$HUB"
git -c protocol.file.allow=always submodule add -q -b main "$DEST" "products/$SLUG"
git config -f .gitmodules "submodule.products/$SLUG.url" "https://github.com/$OWNER/scale-map-$SLUG.git"
git submodule sync -q "products/$SLUG"
git -C "products/$SLUG" remote set-url origin "https://github.com/$OWNER/scale-map-$SLUG.git"
git -C "$DEST" remote add origin "https://github.com/$OWNER/scale-map-$SLUG.git" 2>/dev/null || true

cat <<EOF
已建 EP$EP2 $NAME
  子仓库  $DEST
  挂载点  products/$SLUG（已 git add，记得在母仓库提交）

接着：
  1. 在 GitHub 建空仓库 $OWNER/scale-map-$SLUG，然后  git -C "$DEST" push -u origin main
  2. 填 products/$SLUG/product.yaml 和 films/60s/镜头表.md（lint 绿灯才写代码）
  3. tools/products.sh  更新 README 里的产品目录
EOF
