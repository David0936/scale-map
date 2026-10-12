#!/usr/bin/env python3
"""卡司工具：tools/cast.sh 调这个文件。只用 Python 标准库。

  tools/cast.sh list                         能找到的所有卡司
  tools/cast.sh new <id> <NPC名> [--egg 彩蛋名] [--public]
                                             建一套卡司（默认在 ~/.config/scale-map/cast/，--public 建在仓库 cast/）
  tools/cast.sh check <id> [--product 产品目录]
                                             定规写全了没有、帧库格式对不对
  tools/cast.sh engine <id> <产品目录> <引擎目录>
                                             给 motion/sync.sh 用：把帧库复制进引擎，输出注册用的 JS

查找顺序：<产品目录>/cast/<id> → $SCALE_MAP_CAST_HOME/<id>（默认 ~/.config/scale-map/cast）→ 仓库 cast/<id>
"""
import json, os, re, shutil, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
HOME = Path(os.environ.get("SCALE_MAP_CAST_HOME") or
            Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "scale-map" / "cast")
ROUTES = {"npc": {"frames", "back-only", "none"}, "egg": {"frames", "code", "none"}}


# ---------- 极简 YAML：映射、列表、标量、[]，够读 cast.yaml / product.yaml ----------
def load_yaml(path):
    rows = []
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = re.sub(r"\s+#.*$", "", raw) if not raw.lstrip().startswith("#") else ""
        if line.strip(): rows.append((len(line) - len(line.lstrip()), line.strip()))
    def block(i, ind):
        if i < len(rows) and rows[i][1].startswith("- "):
            out = []
            while i < len(rows) and rows[i][0] == ind and rows[i][1].startswith("-"):
                out.append(scalar(rows[i][1][1:].strip())); i += 1
            return out, i
        out = {}
        while i < len(rows) and rows[i][0] == ind:
            k, _, v = rows[i][1].partition(":"); v = v.strip(); i += 1
            if v: out[k.strip()] = scalar(v)
            elif i < len(rows) and rows[i][0] > ind: out[k.strip()], i = block(i, rows[i][0])
            else: out[k.strip()] = None
        return out, i
    def scalar(v):
        if v == "[]": return []
        if v in ("", "~", "null"): return None
        return v.strip("'\"")
    return block(0, rows[0][0])[0] if rows else {}


def search_dirs(product=None):
    dirs = []
    if product: dirs.append(("产品", Path(product) / "cast"))
    dirs += [("私人", HOME), ("仓库", REPO / "cast")]
    return dirs

def find(cid, product=None):
    for where, d in search_dirs(product):
        if (d / cid / "cast.yaml").is_file(): return where, d / cid
    return None, None

def product_cast(product):
    y = Path(product) / "product.yaml"
    return (load_yaml(y).get("cast") if y.is_file() else None) or "david"


# ---------- 子命令 ----------
def cmd_list(args):
    product = args[0] if args else None
    seen = set()
    for where, d in search_dirs(product):
        if not d.is_dir(): continue
        for c in sorted(d.iterdir()):
            if c.name.startswith("_") or not (c / "cast.yaml").is_file(): continue
            y = load_yaml(c / "cast.yaml"); npc = y.get("npc") or {}; egg = y.get("egg") or {}
            shadow = "（被前面的同名卡司盖住）" if c.name in seen else ""
            seen.add(c.name)
            print(f"{c.name:<14} {where}  NPC {npc.get('name') or '-'}（{npc.get('route')}）  彩蛋 {egg.get('name') or '-'}（{egg.get('route')}）  {c}{shadow}")
    if not seen: print("没有找到卡司")

def cmd_new(args):
    if len(args) < 2: sys.exit("用法：tools/cast.sh new <id> <NPC名> [--egg 彩蛋名] [--public]")
    cid, npc = args[0], args[1]
    egg = args[args.index("--egg") + 1] if "--egg" in args else ""
    public = "--public" in args
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", cid): sys.exit(f"卡司 id 只能用小写字母、数字和连字符：{cid}")
    dest = (REPO / "cast" if public else HOME) / cid
    if dest.exists(): sys.exit(f"{dest} 已存在")
    shutil.copytree(REPO / "cast" / "_template", dest)
    y = dest / "cast.yaml"
    t = y.read_text(encoding="utf-8").replace("__ID__", cid).replace("__NPC__", npc).replace("__OWNER__", npc).replace("__EGG__", egg)
    y.write_text(t, encoding="utf-8")
    print(f"已建卡司 {cid}：{dest}")
    print("接着：")
    print(f"  1. 编辑 {y}：写定规（identity / silhouette），选每个角色走哪条路（route）")
    print(f"  2. 参考图放进 {dest / 'refs'}；有帧库的放进 {dest / 'frames'}/<动作>/")
    print(f"  3. 在产品的 product.yaml 里写  cast: {cid}")
    print(f"  4. tools/cast.sh check {cid}")
    if not public: print("  这套卡司在你的配置目录里，不进仓库；想公开就用 --public 重建，或手动搬进仓库 cast/")

def frame_libs(d):
    libs = {}
    fd = d / "frames"
    if fd.is_dir():
        for a in sorted(fd.iterdir()):
            if a.is_dir(): libs[a.name] = a
    return libs

def check_lib(a):
    errs = []
    m = a / "meta.json"
    if not m.is_file(): return [f"frames/{a.name}：缺 meta.json"]
    try: meta = json.loads(m.read_text(encoding="utf-8"))
    except Exception as e: return [f"frames/{a.name}/meta.json 读不出来：{e}"]
    fr = meta.get("frames") or []
    if not fr: errs.append(f"frames/{a.name}/meta.json：frames 是空的")
    if not meta.get("ref_h"): errs.append(f"frames/{a.name}/meta.json：缺 ref_h（站直身高像素）")
    for f in fr:
        if not (a / f.get("file", "")).is_file(): errs.append(f"frames/{a.name}：缺图 {f.get('file')}")
        for k in ("ax", "ay", "w", "h"):
            if k not in f: errs.append(f"frames/{a.name}/{f.get('file')}：缺 {k}")
    return errs

def cmd_check(args):
    if not args: sys.exit("用法：tools/cast.sh check <id> [--product 产品目录]")
    cid = args[0]; product = args[args.index("--product") + 1] if "--product" in args else None
    where, d = find(cid, product)
    if not d: sys.exit(f"找不到卡司 {cid}（查过：{', '.join(str(p / cid) for _, p in search_dirs(product))}）")
    y = load_yaml(d / "cast.yaml"); errs, warns = [], []
    libs = frame_libs(d)
    for slot in ("npc", "egg"):
        s = y.get(slot) or {}; r = s.get("route") or "none"; name = s.get("name") or slot
        if r not in ROUTES[slot]: errs.append(f"{slot}.route 写的是 {r}，只能是 {' / '.join(sorted(ROUTES[slot]))}"); continue
        if r == "none": continue
        ident = [x for x in (s.get("identity") or []) if x]
        if r == "frames":
            if not ident: errs.append(f"{name}：走帧库就要写定规（identity）")
            if not libs: errs.append(f"{name}：走帧库，但 frames/ 下没有动作文件夹")
            if not [p for p in (d / "refs").glob("*") if not p.name.startswith(".")]: warns.append(f"{name}：refs/ 里没有参考图，生图时身份会飘")
        if slot == "npc" and r == "back-only" and not [x for x in (s.get("silhouette") or []) if x]:
            warns.append(f"{name}：只出背影，最好写几条 silhouette（帽子、发型、包、站姿），不然认不出来")
        if slot == "egg" and r == "code":
            draw = {k: v for k, v in (s.get("draw") or {}).items() if v}
            if not draw: errs.append(f"{name}：走代码画就要在 draw 里写每种画风用哪个函数")
            kit = (REPO / "motion" / "kit" / "scale_map_kit.js").read_text(encoding="utf-8")
            for style, fn in draw.items():
                if not re.search(rf"EP\.{re.escape(fn)}\s*=", kit): errs.append(f"{name}：draw.{style} 写的 {fn}，motion/kit 里没有 SM.{fn}")
    for a in libs.values(): errs += check_lib(a)
    print(f"卡司 {cid}（{where}）：{d}")
    for w in warns: print("  黄灯", w)
    for e in errs: print("  红灯", e)
    if errs: sys.exit(1)
    print("  通过" if not warns else "  通过（有黄灯）")

def cmd_engine(args):
    """把卡司接进引擎：复制帧库到 <引擎>/scale_map/cast/<id>/，向 stdout 输出注册 JS。"""
    cid, product, work = args[0], args[1], Path(args[2])
    where, d = find(cid, product)
    if not d: sys.exit(f"找不到卡司 {cid}")
    y = load_yaml(d / "cast.yaml")
    dst = work / "scale_map" / "cast" / cid
    if dst.exists(): shutil.rmtree(dst)
    frames, assets = {}, []
    for name, a in frame_libs(d).items():
        if check_lib(a): continue
        shutil.copytree(a, dst / name)
        meta = json.loads((a / "meta.json").read_text(encoding="utf-8"))
        frames[name] = meta
        assets += [f"scale_map/cast/{cid}/{name}/{f['file']}" for f in meta["frames"]]
    cast = {"id": cid, "where": where, "npc": y.get("npc") or {}, "egg": y.get("egg") or {}, "frames": frames}
    print("// —— 卡司（motion/sync.sh 生成，别手改）——")
    print(f"window.SM.CAST = {json.dumps(cast, ensure_ascii=False)};")
    print(f"window.EXTRA_ASSETS = (window.EXTRA_ASSETS || []).concat({json.dumps(assets)});")
    print(f"卡司 {cid}（{where}）：{len(frames)} 个帧库", file=sys.stderr)

if __name__ == "__main__":
    cmds = {"list": cmd_list, "new": cmd_new, "check": cmd_check, "engine": cmd_engine, "product-cast": lambda a: print(product_cast(a[0]))}
    if len(sys.argv) < 2 or sys.argv[1] not in cmds: sys.exit(__doc__)
    cmds[sys.argv[1]](sys.argv[2:])
