# AI 指纹检测规则

来源整合自：humanize-mba-text-skill (TOML 规则集) + humanizer-formal (语料校准规则) + ai-patina (5 维检测) + aigc-humanizer (签名扫描)

---

## D1: 句长波动分析

### 指标计算

```
句长 CV = 标准差 / 均值 × 100%
邻句跳跃 = abs(句i 字符数 - 句i+1 字符数)
```

### 判定阈值

| 指标 | 正常范围 | AI 信号 | 严重 AI 信号 |
|------|---------|---------|-------------|
| 句长 CV | ≥ 0.45 | 0.30–0.44 | < 0.30 |
| 短句占比(≤10字) | ≥ 12% | 5%–11% | < 5% |
| 极长句占比(≥45字) | 15%–30% | 30%–50% | > 50% 或 < 5% |
| 邻句跳跃均值 | ≥ 15 | 8–14 | < 8 |
| 句长极差 | ≥ 40 | 20–39 | < 20 |

### 处理建议

- CV < 0.40 → 执行 B7（长短句手术）
- 短句 < 5% → 插入 2–3 段极短句（如"结果令团队意外。"）
- 邻句跳跃 < 8 → 调整相邻句子长度差异

---

## D2: 段落波动分析

### 指标计算

```
段落长度 CV = 各段落字符数的 CV
结构指纹检测：段首段末 4 字是否连续 3+ 段相同
四元句法指纹：相邻段落的主/谓/宾结构模式是否相同
章法模板：同一章内 3+ 节使用相同的"定义→类型→作用"模板
```

### 判定阈值

| 指标 | 正常 | AI 信号 | 严重 |
|------|------|---------|------|
| 段落 CV | ≥ 0.40 | 0.20–0.39 | < 0.20 |
| 段首模板重复 | 无 | ≥ 3 段相同 | ≥ 5 段相同 |
| 段末模板重复 | 无 | ≥ 3 段相同 | ≥ 5 段相同 |
| 四元句法指纹 | < 3 段 | ≥ 3 段相同 | ≥ 5 段相同 |
| 章法模板 | 无 | 3+ 节同模 | 5+ 节同模 |

### 处理建议

- 段落 CV < 0.25 → 合并短段、拆分长段、插入单句段
- 段首模板重复 → 手动改写段首句（每段换一种开头方式）
- 四元句法指纹重复 → 每段换句法结构（从"主谓宾"换"状语+主谓"等）

---

## D3: 词汇指纹检测

### 规则匹配模式

来源：humanize-mba-text-skill 的 TOML 规则集（7 大类）

#### 1. AI 词汇/互联网黑话 (ai_buzzwords)

```regex
赋能|抓手|闭环|痛点|赛道|底层逻辑|颗粒度|对齐|落地|倾斜|复用|击穿|生态|范式|迭代|矩阵|场景|维度|深耕|敏捷|重构|延展|护城河|组合拳|洞察|解构|飞轮|方法论|颗粒感|体感
```

#### 2. 模糊归因 (vague_attribution)

```regex
有研究指出|专家认为|研究表明|数据显示|相关数据|众所周知|不言而喻|毋庸置疑|不可否认
```

#### 3. 过度强调 (excessive_emphasis)

```regex
至关重要|不可或缺|极其重要|非常关键|极为重要|最大|最高|最佳|最优|最具|前所未有|史无前例|无与伦比
```

#### 4. 宏观叙事 (macro_narrative)

```regex
时代背景下|发展浪潮|历史潮流|发展趋势|新的纪元|深刻变革|转型期|新常态|新形势|新时代|大潮|洪流
```

#### 5. 表面分析 (surface_analysis)

```regex
凸显了|反映了|体现了|揭示了|展现了|昭示了|彰显了|折射出|映射出
```

#### 6. 套话 (cliche_endings)

```regex
综上所述|由此可见|总而言之|归根结底|不言而喻|从我做起|从现在做起
```

#### 7. 虚假辩证 (fake_dialectic)

```regex
虽然……但是……（无实质对立面）| 一方面……另一方面……（无实际区分）| 既是……也是……（空洞并列）
```

#### 8. 来自 humanizer-formal 的补充模式

```regex
)
# 抽象名词（register markers）
抽象名词清单：landschap|ecosystem|paradigm|framework|synergy|leverage|optimize|streamline|holistic|strategic|innovation
# 中文商务抽象公式
дальнейший|усиливать|обеспечить|осуществлять|реализация (俄式翻译特征)
# 英文 "of" 结构过度使用
the .+ of .+ of .+ (3层以上嵌套)
```

### 中文句法模式（来源：humanizer-formal）

```
模式 21: 填充词（filler phrases）
  可以预见的是|值得注意的是|不可忽视的是|需要指出的是|
  众所周知|毫无疑问|不可否认|毋庸置疑|从某种意义上说|
  在某种程度上|在一定程度上

模式 22: 过度强调（hedging overload）
  可能/也许/或许 + 较为/比较/相对 + 一定/必然/必须（同一句内叠加）

模式 23: 协作式沟通痕迹（chatbot conversation residue）
  当然|你可以|如果你愿意|让我|我们需要|让我们一起|
  另外，我还想|除此之外|我建议你

模式 24: 虚假谦虚（false modesty）
  试图|尝试|希望|应该是|可能是（降低论断力度）
  
模式 25: 谄媚语气（sycophantic praise）
  非常好的问题|您提出了一个深刻的问题|您说得对|这是一个很有见地的观点
```

### 处理建议

- 所有 AI 高频词（高优先级）必须替换
- 同一句中命中 ≥ 2 个模式 → 该句需要重写
- "有研究指出"类 → 替换为具体引用（作者+年份+数据）
- 无来源断言 → 补来源/注明不可核实

---

## D4: 连接词密度检测

### 段首连接词

```
段首连接词 % = 以连接词开头的段落数 / 总段落数 × 100%
```

**AI 信号**：段首连接词 % > 30%
**目标**：≤ 15%

**段首连接词清单**：此外 / 另外 / 再者 / 进一步 / 进一步说 / 同时 / 与此同时 / 此外还 / 因此 / 所以 / 因而 / 从而 / 然而 / 但是 / 不过 / 而且 / 并且

### 逻辑连接词密度

```
逻辑连接词密度 = 连接词总数 / 总字数 × 1000‰
```

**AI 信号**：> 15‰（即每千字超过 15 个连接词）

**常见逻辑连接词**：
- 递进：而且、并且、此外、况且、甚至
- 转折：但是、然而、不过、却、可是
- 因果：因此、所以、从而、因而、以致
- 顺序：首先、其次、最后、然后、继而

### 三连段模式 (chain_three_part_rule)

≥ 3 段连续使用相同的结构标记 → 需要重写。

**模式举例**：
```
一是……二是……三是……
首先……其次……最后……
第一……第二……第三……
```

---

## D5: 空转大词与升华检测

### 规则

**主题升华**：结论段出现以下任一 → AI 信号
- 时代/趋势/浪潮/浪潮之巅/历史/纪元/篇章
- 从……到……的伟大跨越/重要里程碑

**笼统价值结论**：结尾段出现以下任一 → AI 信号
- 具有重要(的)(理论/实践)(意义/价值)
- 意义深远/影响深远/价值巨大/贡献突出

**无根据断言**：
- 客户满意度提升 X%（80 字内无来源标记）
- 据调查/据统计/据估算（无样本量/时间/方法）

### 处理建议

- 所有升华句 → 执行 A2（删除升华）
- 笼统结论 → 替换为具体研究发现
- 无根据断言 → 补来源或标注"该指标需进一步核实"

---

## 语义链分析（跨段/跨章节）

来源：humanize-mba-text-skill

### 作者罗列模式 (chain_author_listing)

单章内 ≥ 4 处"作者(年份)指出/认为/研究发现" → AI 信号

### 方法名堆叠 (chain_method_name)

单段堆叠 ≥ 2 个方法/模型/理论名，且无逐方法说明 → AI 信号

### 绪论-结论呼应模式 (chain_conclusion_echo)

结论章首段与绪论首段字符级 Jaccard 相似度 ≥ 0.30 → AI 信号

### 跨章问题-对策跟踪 (cross_section_problem_trace)

问题章 ↔ 对策章关键词重叠率 < 30% → 结构问题（非 AI，但需关注）

---

## 统计计算辅助

### 句长计算

```python
# 伪代码
import re

def sentence_stats(text):
    # 中文按字符数、英文按单词数
    sentences = re.split(r'[。！？\n]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    lengths = [len(s) for s in sentences]
    mean = sum(lengths) / len(lengths)
    variance = sum((x - mean)**2 for x in lengths) / len(lengths)
    cv = variance**0.5 / mean
    
    short = sum(1 for l in lengths if l <= 10) / len(lengths) * 100
    long = sum(1 for l in lengths if l >= 45) / len(lengths) * 100
    
    adjacent_jumps = [abs(lengths[i] - lengths[i-1]) for i in range(1, len(lengths))]
    mean_jump = sum(adjacent_jumps) / len(adjacent_jumps) if adjacent_jumps else 0
    
    return {
        'cv': round(cv, 2),
        'short_pct': round(short, 1),
        'long_pct': round(long, 1),
        'mean_jump': round(mean_jump, 1),
        'range': max(lengths) - min(lengths) if lengths else 0
    }
```

### "的"字密度计算

```python
def de_density(text):
    """计算'的'字密度"""
    de_count = text.count('的')
    total_chars = len(text.replace(' ', '').replace('\n', ''))
    return de_count / total_chars if total_chars > 0 else 0
```

### 段落长度计算

```python
def paragraph_cv(text):
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    lengths = [len(p) for p in paragraphs]
    if len(lengths) < 2:
        return 0
    mean = sum(lengths) / len(lengths)
    variance = sum((x - mean)**2 for x in lengths) / len(lengths)
    return variance**0.5 / mean
```