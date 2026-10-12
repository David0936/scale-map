#!/usr/bin/env bash
# 卡司工具，见 tools/cast.py 开头的说明。用法：tools/cast.sh list | new | check
exec python3 "$(dirname "$0")/cast.py" "$@"
