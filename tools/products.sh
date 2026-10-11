#!/usr/bin/env bash
# 读 products/*/product.yaml，打印产品目录表；加 --write 时写进 README.md 的
# <!-- products:start --> 与 <!-- products:end --> 之间。
# 只读顶层的 key: value 行，不需要装 YAML 库。
set -euo pipefail
HUB="$(cd "$(dirname "$0")/.." && pwd)"

field() {  # field <文件> <key>：取顶层字段，去掉行尾注释
  sed -n "s/^$2:[[:space:]]*//p" "$1" | head -1 | sed 's/[[:space:]]*#.*$//'
}
status_cn() {
  case "$1" in
    research) echo 研究中;; storyboard) echo 镜头表;; preview) echo 预览已出;;
    gated) echo 门禁通过;; published) echo 已发布;; *) echo "$1";;
  esac
}

table() {
  echo "| 期 | 产品 | 结尾问题 | 状态 | 子仓库 |"
  echo "|---|---|---|---|---|"
  for y in "$HUB"/products/*/product.yaml; do
    [ -f "$y" ] || continue
    slug="$(field "$y" slug)"; ep="$(field "$y" episode)"
    printf '| EP%02d | [%s](products/%s/) | %s | %s | `product-art-%s` |\n' \
      "$ep" "$(field "$y" name)" "$slug" "$(field "$y" question)" \
      "$(status_cn "$(field "$y" status)")" "$slug"
  done | sort
}

if [ "${1:-}" = "--write" ]; then
  T="$(mktemp)"; table > "$T"
  awk -v t="$T" '
    /<!-- products:start -->/ { print; while ((getline l < t) > 0) print l; skip=1; next }
    /<!-- products:end -->/   { skip=0 }
    !skip' "$HUB/README.md" > "$HUB/README.md.new"
  mv "$HUB/README.md.new" "$HUB/README.md"; rm -f "$T"
  echo "已更新 README.md 的产品目录"
else
  table
fi
