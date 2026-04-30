模态显示信息并接受用户输入。要创建模式，请创建一个扩展 [[Reference/TypeScript API/Modal|Modal]] 的类：

```ts
import { App, Modal } from 'obsidian';

export class ExampleModal extends Modal {
  constructor(app: App) {
    super(app);
	this.setContent('Look at me, I\'m a modal! 👀')
  }
}
```

要打开模式，请创建 `ExampleModal` 的新实例并对其调用 [[Reference/TypeScript API/Modal/open|open()]]：

```ts
import { Plugin } from 'obsidian';
import { ExampleModal } from './modal';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'display-modal',
      name: 'Display modal',
      callback: () => {
        new ExampleModal(this.app).open();
      },
    });
  }
}
```

## 接受用户输入

上一个示例中的模态框仅显示一些信息。让我们看一个稍微复杂一点的示例，它也处理用户输入。

![[modal-input.png]]

```ts
import { App, Modal, Setting } from 'obsidian';

export class ExampleModal extends Modal {
  constructor(app: App, onSubmit: (result: string) => void) {
    super(app);
	this.setTitle('What\'s your name?');

	let name = '';
    new Setting(this.contentEl)
      .setName('Name')
      .addText((text) =>
        text.onChange((value) => {
          name = value;
        }));

    new Setting(this.contentEl)
      .addButton((btn) =>
        btn
          .setButtonText('Submit')
          .setCta()
          .onClick(() => {
            this.close();
            onSubmit(name);
          }));
  }
}
```

当用户点击 **Submit** 时，结果将传递到 `onSubmit` 回调中：

```ts
new ExampleModal(this.app, (result) => {
  new Notice(`Hello, ${result}!`);
}).open();
```

## 从建议列表中选择

[[SuggestModal|SuggestModal]] 是一种特殊模式，可让您向用户显示建议列表。

![[suggest-modal.gif]]

```ts
import { App, Notice, SuggestModal } from 'obsidian';

interface Book {
  title: string;
  author: string;
}

const ALL_BOOKS = [
  {
    title: 'How to Take Smart Notes',
    author: 'Sönke Ahrens',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
  },
];

export class ExampleModal extends SuggestModal<Book> {
  // Returns all available suggestions.
  getSuggestions(query: string): Book[] {
    return ALL_BOOKS.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Renders each suggestion item.
  renderSuggestion(book: Book, el: HTMLElement) {
    el.createEl('div', { text: book.title });
    el.createEl('small', { text: book.author });
  }

  // Perform action on the selected suggestion.
  onChooseSuggestion(book: Book, evt: MouseEvent | KeyboardEvent) {
    new Notice(`Selected ${book.title}`);
  }
}
```

### 近似字符串匹配结果

除了“SuggestModal”之外，Obsidian API 还提供了一种更专业的建议模式：[[FuzzySuggestModal|FuzzySuggestModal]]，它可以让您开箱即用地进行[模糊字符串搜索](https://en.wikipedia.org/wiki/Approximate_string_matching)。

![[fuzzy-suggestion-modal.png]]

```ts
import {FuzzySuggestModal, Notice} from "obsidian";

export class ExampleSuggestModal extends FuzzySuggestModal<Book> {
  getItems(): Book[] {
    return ALL_BOOKS;
  }

  getItemText(book: Book): string {
    return book.title;
  }

  onChooseItem(book: Book, evt: MouseEvent | KeyboardEvent) {
    new Notice(`Selected ${book.title}`);
  }
}
```

### 自定义呈现模糊搜索结果

对于更自定义的 UI，您可以实现 [[Reference/TypeScript API/fuzzysuggestmodal/renderSuggestion|renderSuggestion]] 函数，如前面的示例所示。
[[renderResults]] 方法负责渲染不同的字符串，同时突出显示匹配的部分。

![[fuzzy-suggestion-custom-modal.png]]


```ts
import {FuzzyMatch, FuzzySuggestModal, Notice, renderResults} from "obsidian";

export class ExampleSuggestModal extends FuzzySuggestModal<Book> {  
  
    //return a string representation, so there is something to search  
    getItemText(item: Book): string {  
       return item.title + " " + item.author;  
    }  
  
    getItems(): Book[] {  
       return ALL_BOOKS;  
    }  
  
    renderSuggestion(match: FuzzyMatch<Book>, el: HTMLElement) {  
       const titleEl = el.createDiv();  
       renderResults(titleEl, match.item.title, match.match);  
  
       // Only render the matches in the author name.  
       const authorEl = el.createEl('small');  
       const offset = -(match.item.title.length + 1);  
       renderResults(authorEl, match.item.author, match.match, offset);  
    }  
  
    onChooseItem(book: Book, evt: MouseEvent | KeyboardEvent): void {  
       new Notice(`Selected ${book.title}`);  
    }  
  
}
```