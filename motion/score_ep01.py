"""EP01 配乐：纯代码合成（numpy），无采样、无版权素材。
段落换音色：当代=木琴、古代=五声拨弦、1876–1908=八音盒、海报=跳音钢琴＋贝斯；关键画面加音效。
用法：python3 score_ep01.py out.wav
"""
import sys, numpy as np, wave

SR = 44100; DUR = 60.0; BPM = 96; B = 60 / BPM
N = int(SR * DUR); mix = np.zeros(N)
SEG = [(0, 4, 'now'), (4, 12, 'ink'), (12, 25, 'box'), (25, 42, 'pop'), (42, 60, 'now')]

def hz(m): return 440 * 2 ** ((m - 69) / 12)
def env(n, a=0.005, d=0.4):
    t = np.arange(n) / SR; e = np.exp(-t / d); k = int(a * SR); e[:k] *= np.linspace(0, 1, k) if k else 1; return e
def add(t0, sig, g=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig)); mix[i:j] += sig[:j - i] * g

def marimba(m, L=0.6):
    n = int(L * SR); t = np.arange(n) / SR; f = hz(m)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.05)) * env(n, 0.002, 0.25)
def pluck(m, L=1.0, bend=0.0):      # 五声拨弦（Karplus-Strong）
    n = int(L * SR); f = hz(m); p = max(2, int(SR / f)); rng = np.random.default_rng(int(m * 7))
    buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    if bend: t = np.arange(n) / SR; out *= 1 + 0 * t
    return out * env(n, 0.001, 0.8)
def musicbox(m, L=0.9):
    n = int(L * SR); t = np.arange(n) / SR; f = hz(m + 12)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.08)) * env(n, 0.001, 0.35)
def piano(m, L=0.35):
    n = int(L * SR); t = np.arange(n) / SR; f = hz(m)
    s = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.5 for k in range(1, 6)); return s * env(n, 0.002, 0.12)
def bass(m, L=0.4):
    n = int(L * SR); t = np.arange(n) / SR; f = hz(m)
    return np.tanh(2 * np.sin(2 * np.pi * f * t)) * env(n, 0.004, 0.18)
def pad(ms, L):
    n = int(L * SR); t = np.arange(n) / SR; s = sum(np.sin(2 * np.pi * hz(m) * t) + 0.3 * np.sin(2 * np.pi * hz(m) * 2.001 * t) for m in ms)
    e = np.minimum(1, t / 0.4) * np.minimum(1, (L - t) / 0.6); return s * e / len(ms)
def kick():
    n = int(0.25 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * (50 + 90 * np.exp(-t / 0.03)) * t) * env(n, 0.001, 0.09)
def noise_hit(L=0.12, d=0.03, seed=1):
    n = int(L * SR); return np.random.default_rng(seed).uniform(-1, 1, n) * env(n, 0.001, d)

# 和声：C – Am – F – G（每小节 4 拍）
PROG = [[48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50]]
PENTA = [60, 62, 64, 67, 69, 72, 74, 76]
MEL = [0, 2, 4, 2, 3, 4, 5, 4, 2, 1, 0, 1, 2, 4, 3, 2]

beat = 0; t = 0.0
while t < DUR - 0.01:
    seg = next(s for s in SEG if s[0] <= t < s[1])[2]
    bar = int(beat // 4); ch = PROG[bar % 4]; b = beat % 4
    if b == 0: add(t, pad(ch, B * 4), 0.10 if seg != 'ink' else 0.07)
    note = PENTA[MEL[beat % 16]]
    if seg == 'now':
        add(t, marimba(note), 0.32); add(t + B / 2, marimba(ch[(beat) % 3] + 12, 0.4), 0.16)
        if b in (0, 2): add(t, kick(), 0.45)
        add(t + B / 2, noise_hit(0.05, 0.012, beat), 0.05)
    elif seg == 'ink':
        if b in (0, 1, 3): add(t, pluck(note - 12 + (12 if b == 3 else 0), 1.4), 0.55)
        if b == 0: add(t, pluck(ch[0] - 12, 2.0), 0.32)
    elif seg == 'box':
        add(t, musicbox(note), 0.22); add(t + B / 2, musicbox(ch[(beat + 1) % 3] + 12, 0.6), 0.12)
        if b == 0: add(t, kick(), 0.30)
    else:  # pop
        add(t, bass(ch[0] - 12), 0.30); add(t + B / 2, bass(ch[2] - 12, 0.25), 0.20)
        add(t + B / 2, piano(ch[0] + 24) + piano(ch[1] + 24) + piano(ch[2] + 24), 0.12)
        if b == 1 or b == 3: add(t, noise_hit(0.1, 0.03, beat), 0.10)
        add(t, kick(), 0.40)
    beat += 1; t = beat * B

# 段落交界：一记钹（高频噪声长衰减）
for x in (4, 12, 25, 42): add(x - 0.02, noise_hit(1.2, 0.35, int(x)) * 0.6, 0.22)
# 音效（时间对齐画面）
def thud(f=70, L=0.3): n = int(L * SR); tt = np.arange(n) / SR; return np.sin(2 * np.pi * f * tt) * env(n, 0.001, 0.08) + noise_hit(L, 0.02, 9) * 0.3
add(2.25, noise_hit(0.08, 0.02, 3), 0.5); add(2.25, marimba(84, 0.3), 0.25)          # 扫地机撞扫帚
add(2.85, thud(), 0.8)                                                                  # 扫帚落地（砸入）
add(21 + 1.25, thud(90, 0.25), 0.5)                                                     # 1908 越过门槛
add(25 + 8 + 1.0, noise_hit(0.25, 0.08, 4), 0.25)                                       # 红笔划掉 $1500
add(25 + 8 + 1.7, thud(60, 0.35), 0.9); add(25 + 8 + 1.7, piano(84) + piano(88), 0.3)  # $199 盖章
add(42 + 13 + 2.45, marimba(79, 0.8) + marimba(84, 0.8), 0.35)                          # 屏幕问「还需要我吗」
add(42 + 13 + 3.6, pad([48, 55, 64, 67], 1.4) * 1.0, 0.35)                              # 拉远：收尾长音
# 尾部 1.4s 淡出
fo = int(1.4 * SR); mix[-fo:] *= np.linspace(1, 0, fo)
mix = np.tanh(mix * 1.4) * 0.85
pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', sys.argv[1])
