# dsh-humanizer-zh

**DSH 插件：中文文本去 AI 痕迹综合技能 (humanizer-zh)**

整合 5 套开源去 AI 方案的最佳实践，一键加载 `humanizer-zh` 技能，降低 AIGC 检测率。

## 功能

- **5 维 AI 指纹检测**：句长波动、段落波动、词汇指纹、连接词密度、空转大词
- **15 种改写手法**：结构替换 → 节奏手术 → 词汇微调
- **文体敏感**：学术论文、MBA 论文、商务报告、通用文章各有不同的"人味"定义
- **信息保全红线**：数字、结论、专名、引用一律不变

## 安装

### 从 npm 安装

```bash
dsh plugin add dsh-humanizer-zh
```

### 从 GitHub 安装

```bash
dsh plugin add https://github.com/LeonRoxie/dsh-humanizer-zh
```

## 使用

安装后，在 DSH 会话中加载技能：

```
请使用 humanizer-zh 技能
```

技能会自动出现在可用技能列表中（和 `dsh-doc`、`office` 同级别）。

### 触发词

- 去AI味 / 降AIGC / 改写像人
- 去智障感 / 论文AI率 / 检测AI痕迹
- humanize

## 技能内容

| 文件 | 说明 |
|------|------|
| `skills/humanizer-zh/SKILL.md` | 主技能指令（16KB）：5 阶段工作流、15 种手法、AI 特征清单 |
| `skills/humanizer-zh/references/detection-rules.md` | AI 指纹检测规则、正则模式、指标计算 |
| `skills/humanizer-zh/references/rewrite-moves.md` | 15 种改写手法完整中文实例（before/after 对照） |
| `skills/humanizer-zh/references/style-guide.md` | 风格指南、不同文体的"人味"定义、中英文混排规范 |
| `skills/humanizer-zh/references/workflow.md` | 详细工作流指南，含每步的实际操作模板 |

## 整合来源

本技能整合自以下开源项目（均 MIT 协议）：

- [stephenlzc/humanize-mba-text-skill](https://github.com/stephenlzc/humanize-mba-text-skill) — MBA 论文去 AI 检测
- [swaylq/humanize-chinese](https://github.com/swaylq/humanize-chinese) — 中文文本去痕迹
- [Rain13Sad/ai-patina](https://github.com/Rain13Sad/ai-patina) — "更像人话"理念 + 14 种操作
- [jiutianxvanyin/humanizer-formal](https://github.com/jiutianxvanyin/humanizer-formal) — 商务+学术双语去 AI
- [ycc77cn/aigc-humanizer](https://github.com/ycc77cn/aigc-humanizer) — 论文 AIGC 率降低实战

## 结构

```
dsh-humanizer-zh/
├── package.json          # npm 包元数据 + dsh.bundle 配置
├── cordis.patch.yml      # Cordis 组合层插入
├── index.js              # 插件入口：注册 humanizer-zh 技能
├── LICENSE               # MIT 协议
├── README.md             # 本文件
└── skills/
    └── humanizer-zh/
        ├── SKILL.md
        └── references/
            ├── detection-rules.md
            ├── rewrite-moves.md
            ├── style-guide.md
            └── workflow.md
```

## License

MIT