# Paper-news 页面维护

新版页面服务于每天约半小时的研究阅读。首页用简短导读说明这组论文的具体阅读价值，阅读页呈现已批准的研究文章。导读须与当前正文绑定并通过核验；页面排版不能临时补写科学判断或跨论文趋势。

## 内容与页面契约

- `_pages/paper-news.md` 是真实站点入口。沿用宽版白色圆角外框、青绿色日期、大号黑色标题和浅灰卡片。头部显示简短整期标题、导语，各篇卡片显示短标题和一句具体阅读理由；卡片链接指向文章锚点。中文全文与 English 入口只出现一组。最新期次只在顶部出现，其他期次按月份归档，可检索日期或标题。
- `_layouts/paper-news-research.html` 包装新版文章，提供期次、语言和归档导航。
- `_layouts/paper-news.html` 为既有旧期提供相同的外层阅读排版，保留原有 Markdown 正文，不再复制 front matter 的主题、推荐、要点或论文卡。
- `_layouts/paper-news-index.html` 提供首页外层。
- `_includes/paper-news-pagination.html` 根据实际存在的同语言期次生成前后链接。
- `assets/css/paper-news.css` 是站点与 Python 预览共用的样式来源。所有规则限定在 `.pn-shell`，不改变个人网站其他页面。
- `assets/js/paper-news.js` 只增强归档检索；关闭 JavaScript 后，每个月和每期链接仍然可用。
- `src/render_research_brief.py` 从已批准 JSON 生成正文 HTML、独立预览与 Markdown。正文使用本地 MathML，不依赖浏览器端公式脚本。

阅读页依次呈现文章标题、链接至准确版本的原论文名、正文、已有阅读理由和可展开的来源位置。页首目录提供文章跳转，默认收起。首页导读通常约 300–450 个中文字符，说明为什么值得打开这组论文；不搬运正文首段，不展示长英文论文名、arXiv ID 徽章或“精选／阅读价值”等固定空标题。每篇各占一张紧凑卡片，首篇没有额外重复区域。桌面为三列，中等宽度两列，手机单列。

## 新版 front matter

同步程序读取已核验且与当前正文绑定的导读，写入 `homepage` 字段。模板不生成、改写或拼接导读。导读所有字段均为纯文本，模板必须 `escape` 后输出，不能 `markdownify` 或直接输出任意 HTML。

导读须同时通过基于审定正文的事实审查，以及不看正文的独立首页阅读检查。后者确认非该细分方向的 AI 研究者能看懂发现和阅读收益，不能借助正文解释首页中堆叠的术语。导读与正文的哈希绑定、最终两份审查记录由同步程序验证，模板不承担审批逻辑。

```yaml
layout: paper-news-research
brief_format: research
title: "2026-08-29 · paper-news"
date: 2026-08-29
lang: zh-CN
permalink: /paper-news/2026-08-29-zh/
author_profile: false
brief_title: "第一篇已批准文章的标题"
translation_url: /paper-news/2026-08-29/
translation_label: English
article_index:
  - paper_id: "2608.27782"
    headline: "该篇已批准的文章标题"
    paper_title: "Original title from paper_metadata"
homepage:
  headline: "简短的整期编辑标题"
  dek: "说明这组论文为什么值得阅读的短导语。"
  items:
    - paper_id: "2608.27782"
      title: "该篇的简短阅读钩子"
      reason: "一句具体、可由已批准正文支持的阅读理由。"
```

`homepage.items` 的论文 ID 和顺序必须与所选正文一致，标题与理由不能超出正文证据。生成、绑定和核验由上游负责，页面只呈现已有结果。`article_index` 仍可供归档检索使用，保留原文标题等元数据，但不作为头部导读。链接格式是 `#paper-` 加论文 ID，仅将旧式 ID 中的 `/` 替换为 `-`。排版不修改原始 article 或 content_hash。

旧稿中的 `themes`、`takeaways`、`lead_paper`、`signals`、`top_papers` 不是新版必填项。最新期缺少有效 `homepage` 时，仅显示已有 `brief_title`、日期和全文入口；没有标题时使用日期。不得退回正文首段、旧推荐卡或临时摘要。

## 本地预览

有 Ruby、Bundler 和 Jekyll 时，在 `site` 目录执行 `bundle exec jekyll serve`。这是正式模板兼容性的完整检查路径。

当前 Windows 环境没有 Ruby/Jekyll，可使用隔离依赖的忠实预览工具：

```powershell
python -m pip install --target D:\paper-news\site\local\preview-tools python-liquid libsass
python D:\paper-news\src\preview_paper_news.py --brief D:\paper-news\data\2026-08-29\experiments\terra-autonomous-v2\brief.approved.json
python -m http.server 4173 --bind 127.0.0.1 --directory D:\paper-news\site\local\preview
```

入口：`http://127.0.0.1:4173/paper-news/`。

该工具读取真实 Liquid 页面、三种布局、个人站页眉页脚、现有期次，并编译实际 SCSS。`--brief` 只在内存中加入未发布的已批准期次，不写入 `site/_paper_news`。依赖和产物均位于已忽略的 `site/local`，不提交、不发布。工具不读取 `.env`、不调用模型、不执行 Git。

局限写入 `preview-manifest.json`：使用 Python Liquid，旧期 Markdown 使用 Python Markdown 而非 kramdown；跳过 HTML 压缩及分析统计；个人站页脚已有一个多余的 `%` 仅在本地适配；只构建 paper-news，个人站其他栏目仍应通过原生 Jekyll 验证。新版正文已经由正式 renderer 产生 HTML，站点预览与独立预览使用同一文章结构和 MathML。

独立预览也可指定语言与归档链接：

```powershell
python src/render_research_brief.py path/to/brief.approved.json --output path/to/index.html --translation-url en.html --archive-url http://127.0.0.1:4173/paper-news/#archive
```

## 检查

- 新版正文与已批准 JSON 的文字、数字、条件、顺序和来源一致。
- 首页导读来自已核验的 `homepage`，每篇各出现一次，卡片标题链接能打开对应文章；没有导读时按安全回退规则显示。纯文本中的 HTML 不得执行。
- 搜索清空后恢复月份展开状态；无 JavaScript 仍可访问全部归档。
- 中文行长、长英文论文名和来源在窄屏下不造成整页横向滚动。
- 公式保持 MathML，长独立公式可水平滚动；打印不隐藏正文或证据条件。
- 仅同步经过健康检查的已批准期次。不要把本地预览产物当作已经发布的页面。
