此页面列出了扩展 [[Developer policies]] 的插件特定要求，所有插件必须遵循这些要求才能发布。

## 仅使用 `fundingUrl` 链接到财务支持服务

如果您接受插件的财务支持，请使用“请我一杯咖啡”或 GitHub 赞助商等服务，请使用 [[Manifest#fundingUrl|fundingUrl]]。

如果您不接受捐赠，请从清单中删除“fundingUrl”。

## 设置适当的 `minAppVersion`

[[Reference/Manifest|Manifest]] 中的 `minAppVersion` 应设置为您的插件兼容的 Obsidian 应用程序所需的最低版本。
如果您不知道合适的版本号是什么，请使用最新的稳定版本号。

## 保持插件描述简短

好的插件描述可以帮助用户快速、简洁地理解您的插件。好的描述通常以行动陈述开头，例如：

- “将选定的文本翻译成...”
- “自动生成笔记...”
- “从...导入笔记”
- “同步亮点和注释...”
- “打开链接...”

避免以“这是一个插件”开始您的描述，因为它对于社区插件目录上下文中的用户来说是显而易见的。

您的描述应该：

- 遵循[黑曜石风格指南](https://help.obsidian.md/Contributing+to+Obsidian/Style+guide)。
- 最多 250 个字符。
- 以句点“.”结尾。
- 避免使用表情符号或特殊字符。
- 使用正确的首字母缩略词、专有名词和商标大小写，例如“Obsidian”、“Markdown”、“PDF”。如果您不确定如何大写某个术语，请参阅其网站或维基百科描述。

## Node.js 和 Electron API 只允许在桌面上使用

Node.js 和 Electron API 仅在 Obsidian 桌面版本中可用。例如，“fs”、“crypto”和“os”等 Node.js 包仅在桌面上可用。

如果您的插件使用任何这些 API，您**必须**在“manifest.json”中将“isDesktopOnly”设置为“true”。

> [!tip]
> 许多 Node.js 功能都有 Web API 替代方案：
>
> - [`SubtleCrypto`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) 而不是 [`crypto`](https://nodejs.org/api/crypto.html)。
> - `navigator.clipboard.readText()` 和 `navigator.clipboard.writeText()` 用于访问剪贴板内容。

## 不要在命令 ID 中包含插件 ID

Obsidian 会自动在命令 ID 前添加您的插件 ID 前缀。
您不需要自己包含插件 ID。

## 删除所有示例代码

示例插件包含如何执行插件所需的许多最常见操作的示例。
它只是为了帮助您入门，在提交之前应从您的插件中删除示例代码。