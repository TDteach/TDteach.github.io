# Paper-news 页面维护

新版页面服务于每天约半小时的研究阅读。页面呈现已批准的研究文章；排版和导航不能新增论文判断、总结或跨论文趋势。

## 内容与页面契约

- `_pages/paper-news.md` 是真实站点入口。沿用线上简报的宽版白色圆角外框、青绿色日期、大号黑色标题和浅灰卡片。首篇标题与完整首段置于头部，其余文章各占一张卡片；每篇原论文名与全文链接指向相应文章锚点。最新期次只在顶部出现，其他期次按月份归档，可检索日期或标题。
- `_layouts/paper-news-research.html` 包装新版文章，提供期次、语言和归档导航。
- `_layouts/paper-news.html` 为既有旧期提供相同的外层阅读排版，保留原有 Markdown 正文，不再复制 front matter 的主题、推荐、要点或论文卡。
- `_layouts/paper-news-index.html` 提供首页外层。
- `_includes/paper-news-pagination.html` 根据实际存在的同语言期次生成前后链接。
- `assets/css/paper-news.css` 是站点与 Python 预览共用的样式来源。所有规则限定在 `.pn-shell`，不改变个人网站其他页面。
- `assets/js/paper-news.js` 只增强归档检索；关闭 JavaScript 后，每个月和每期链接仍然可用。
- `src/render_research_brief.py` 从已批准 JSON 生成正文 HTML、独立预览与 Markdown。正文使用本地 MathML，不依赖浏览器端公式脚本。

阅读页依次呈现文章标题、链接至准确版本的原论文名、正文、已有阅读理由和可展开的来源位置。页首目录提供文章跳转，默认收起。首页只摘取已批准正文的首段，不新写摘要，不截断条件。彩色徽标显示真实 arXiv ID，不生成主题口号或数量宣告。首篇不再重复出现在卡片或归档中。

## 新版 front matter

同步程序只从已批准内容确定性地产生这些字段。不得使用模型生成首页元数据。

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
    opening_html: "<p>已批准正文的完整首段，经安全渲染。</p>"
```

`article_index` 遵循正文顺序，`headline` 与正文一致，`paper_title` 来自已绑定内容哈希的原论文元数据。`opening_html` 只能由 `render_article_opening(article)` 生成：完整首段经已有安全 HTML/MathML 渲染，保留原文文字与链接；模板直接输出该安全字段，禁止把任意原始 HTML 或模型生成的摘要填入其中。链接格式是 `#paper-` 加论文 ID，仅将旧式 ID 中的 `/` 替换为 `-`。读者审查通过后重新排版不修改原始 article 或 content_hash。

旧稿中的 `themes`、`takeaways`、`lead_paper`、`signals`、`top_papers` 不再是新版必填项。旧期缺少 `article_index` 时，首页可使用已有 `top_papers.title`，不生成新摘要。

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
- 首页每篇各出现一次，展示的首段与已批准正文一致，阅读全文链接能打开对应文章；中英文和前后期次链接指向实际页面。
- 搜索清空后恢复月份展开状态；无 JavaScript 仍可访问全部归档。
- 中文行长、长英文论文名和来源在窄屏下不造成整页横向滚动。
- 公式保持 MathML，长独立公式可水平滚动；打印不隐藏正文或证据条件。
- 仅同步经过健康检查的已批准期次。不要把本地预览产物当作已经发布的页面。
