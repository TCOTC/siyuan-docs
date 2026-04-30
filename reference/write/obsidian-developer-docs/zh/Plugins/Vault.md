Obsidian 中的每个笔记集合都称为 Vault。 Vault 由一个文件夹及其中的所有子文件夹组成。

虽然您的插件可以像任何其他 Node.js 应用程序一样访问文件系统，但 [[Reference/TypeScript API/Vault|Vault]] 模块旨在让您更轻松地使用 Vault 中的文件和文件夹。


> [!NOTE]
> Vault API 只允许访问应用程序内可见的文件，隐藏文件夹中包含的文件只能使用适配器 API 访问。


以下示例递归打印 Vault 中所有 Markdown 文件的路径：

```ts
const files = this.app.vault.getMarkdownFiles()

for (let i = 0; i < files.length; i++) {
  console.log(files[i].path);
}
```

> [!tip]
> 如果您想列出_所有_文件，而不仅仅是 Markdown 文档，请使用 [[getFiles|getFiles()]] 代替。

## 读取文件

有两种方法可以读取文件内容：[[Reference/TypeScript API/Vault/read|read()]] 和 [[cachedRead|cachedRead()]]。

- 如果您只想向用户显示内容，请使用“cachedRead()”以避免多次从磁盘读取文件。
- 如果您想读取内容、更改内容，然后将其写回磁盘，请使用“read()”以避免可能用过时的副本覆盖文件。

> [!info]
> `cachedRead()` 和 `read()` 之间的唯一区别是在插件读取文件之前在 Obsidian 外部修改文件。一旦文件系统通知 Obsidian 文件已从外部更改，“cachedRead()”的行为就与“read()”完全相同。同样，如果您将文件保存在 Obsidian 中，读取缓存也会被刷新。

以下示例读取 Vault 中所有 Markdown 文件的内容并返回平均文档大小：

```ts
import { Notice, Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addRibbonIcon('info', 'Calculate average file length', async () => {
      const fileLength = await this.averageFileLength();
      new Notice(`The average file length is ${fileLength} characters.`);
    });
  }

  async averageFileLength(): Promise<number> {
    const { vault } = this.app;

    const fileContents: string[] = await Promise.all(
      vault.getMarkdownFiles().map((file) => vault.cachedRead(file))
    );

    let totalLength = 0;
    fileContents.forEach((content) => {
      totalLength += content.length;
    });

    return totalLength / fileContents.length;
  }
}
```

## 修改文件

要将文本内容写入现有文件，请使用[[modify|Vault.modify()]]。

```ts
function writeCurrentDate(vault: Vault, file: TFile): Promise<void> {
  return vault.modify(file, `Today is ${new Intl.DateTimeFormat().format(new Date())}.`);
}
```

如果您想根据当前内容修改文件，请使用 [[process|Vault.process()]]。第二个参数是一个回调，它提供当前文件内容并返回修改后的内容。

```ts
// emojify replaces all occurrences of :) with 🙂.
function emojify(vault: Vault, file: TFile): Promise<string> {
  return vault.process(file, (data) => {
    return data.replace(':)', '🙂');
  })
}
```

`Vault.process()` 是 [[Reference/TypeScript API/Vault/read|Vault.read()]] 和 [[modify|Vault.modify()]] 之上的抽象，保证文件在读取当前内容和写入更新内容之间不会发生更改。始终优先选择“Vault.process()”而不是“Vault.read()”/“Vault.modify()”，以避免意外丢失数据。

### 异步修改

[[process|Vault.process()]] 仅支持同步修改。如果需要异步修改文件：

1. 使用[[cachedRead|Vault.cachedRead()]]读取文件。
2. 执行异步操作。
3. 使用[[Reference/TypeScript API/Vault/process|Vault.process()]]更新文件。

请记住检查“process()”回调中的“data”是否与“cachedRead()”返回的数据相同。如果它们不相同，则意味着该文件已被不同的进程更改，您可能需要请求用户确认，或重试。

## 删除文件

删除文件有两种方法：[[delete|delete()]] 和 [[trash|trash()]]。您应该使用哪一种取决于您是否想让用户改变主意。

- `delete()` 删除文件而不留痕迹。
- `trash()` 将文件移动到垃圾箱。

当您使用“trash()”时，您可以选择将文件移至系统的垃圾箱，或移至用户 Vault 根目录下的本地“.trash”文件夹。

## 它是文件还是文件夹？

某些操作返回或接受 [[TAbstractFile|TAbstractFile]] 对象，该对象可以是文件或文件夹。使用之前请务必检查“TAbstractFile”的具体类型。

```ts
const folderOrFile = this.app.vault.getAbstractFileByPath('folderOrFile');

if (folderOrFile instanceof TFile) {
  console.log('It\'s a file!');
} else if (folderOrFile instanceof TFolder) {
  console.log('It\'s a folder!');
}
```
