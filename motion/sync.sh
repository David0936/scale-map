#!/usr/bin/env bash
# 把一支片子接到 huashu-art-motion 引擎上：复制引擎到 <片子目录>/.work/engine（第一次），
# 再把 Scale Map 工具包、本片 scenes、eras_<片名>.js 同步进去。之后打印渲染与门禁命令。
# 片子目录在产品子仓库里：products/<slug>/films/<id>
#
# 用法：motion/sync.sh products/robot-vacuum/films/60s
# 引擎位置：环境变量 HUASHU_DIR，否则依次找 ~/.claude/skills、~/.agents/skills、~/.codex/skills 下的 huashu-art-motion。
set -euo pipefail

EP_DIR="${1:?用法：motion/sync.sh products/<slug>/films/<id>}"
EP_DIR="$(cd "$EP_DIR" && pwd)"
REPO="$(cd "$(dirname "$0")/.." && pwd)"

HUASHU="${HUASHU_DIR:-}"
if [ -z "$HUASHU" ]; then
  for d in "$HOME/.claude/skills/huashu-art-motion" "$HOME/.agents/skills/huashu-art-motion" "$HOME/.codex/skills/huashu-art-motion"; do
    [ -d "$d/scripts/engine" ] && HUASHU="$d" && break
  done
fi
[ -n "$HUASHU" ] && [ -d "$HUASHU/scripts/engine" ] || { echo "找不到 huashu-art-motion。先装：npx skills add alchaincyf/huashu-art-motion，或设 HUASHU_DIR" >&2; exit 1; }

ERAS_FILE="$(ls "$EP_DIR"/eras_*.js 2>/dev/null | head -1)"
[ -n "$ERAS_FILE" ] || { echo "$EP_DIR 里没有 eras_<片名>.js" >&2; exit 1; }
FILM="$(basename "$ERAS_FILE" .js)"; FILM="${FILM#eras_}"
[[ "$FILM" =~ ^[a-z0-9_]+$ ]] || { echo "片名「$FILM」只能用小写字母、数字、下划线（引擎的 --film 规则）" >&2; exit 1; }

WORK="$EP_DIR/.work/engine"
if [ ! -d "$WORK" ]; then
  mkdir -p "$EP_DIR/.work"
  cp -R "$HUASHU/scripts/engine" "$WORK"
  rm -rf "$WORK/reference_films" "$WORK/__pycache__"
  echo "已复制引擎 → $WORK"
fi
mkdir -p "$WORK/scale_map" "$WORK/$FILM/scenes"
cp "$REPO/motion/kit/scale_map_kit.js" "$WORK/scale_map/kit.js"
rm -f "$WORK/$FILM/scenes/"*.js
cp "$EP_DIR/scenes/"*.js "$WORK/$FILM/scenes/"
cp "$ERAS_FILE" "$WORK/"
echo "已同步：kit、$(ls "$EP_DIR/scenes" | wc -l | tr -d ' ') 个场景、eras_$FILM.js"

L="$HUASHU/scripts"
cat <<EOF

下一步（在 $WORK 里跑）：
  镜头表 lint   uv run $L/storyboard_lint.py "$EP_DIR/镜头表.md"
  单段静帧     uv run --with playwright python render.py --film $FILM --solo <段id> --stills 0.5,2 --no-counter --out "$EP_DIR/静帧/<段id>"
  配乐         python3 "$EP_DIR/score.py" "$EP_DIR/配乐.wav"     （有 score.py 时）
  整片         uv run --with playwright python render.py --film $FILM --fps 30 --out "$EP_DIR/渲染/成片.mp4" [--audio 配乐.wav]
  qa           uv run $L/qa.py --project "$WORK" --film $FILM --out "$EP_DIR/qa"
  独立审片     派一个没参与制作的 agent 只看成片，结论写进 "$EP_DIR/审片/"
  交付         uv run $L/deliver.py "$EP_DIR/渲染/成片.mp4" --qa "$EP_DIR/qa" --root "$EP_DIR" --out "$EP_DIR/output"
EOF
