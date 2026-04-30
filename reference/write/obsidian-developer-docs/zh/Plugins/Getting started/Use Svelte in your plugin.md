本指南说明如何配置插件以使用 [Svelte](https://svelte.dev/)——相较于 React、Vue 等传统框架的一种轻量方案。

Svelte 围绕编译器构建：预先处理代码并输出优化的原生 JavaScript。因此它不需要虚拟 DOM 来追踪状态变化，插件运行时额外开销可以保持在较低水平。

若想进一步了解 Svelte 及其用法，请参阅[教程](https://svelte.dev/tutorial/svelte/welcome-to-svelte)与[文档](https://svelte.dev/docs/svelte/overview)。

本指南假定你已完成 [[Build a plugin]]。

> [!tip] Visual Studio Code
> Svelte 提供[官方 Visual Studio Code 扩展](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)，可在 Svelte 组件中启用语法高亮与完整的 IntelliSense。

## 配置插件

若要使用 Svelte 构建插件，需要安装依赖并将插件配置为编译 Svelte 代码。
若只想使用 TypeScript 的*纯类型*特性，则不需要 `svelte-preprocess`。

1. 将 Svelte 加入插件依赖：

   ```bash
   npm install --save-dev svelte svelte-preprocess esbuild-svelte svelte-check
   ```

   > [!info]
   > Svelte 至少需要 TypeScript 5.0。若要升级到 TypeScript 5.0，请在终端运行：
   >
   > ```bash
   > npm install typescript@~5.0.0
   > ```

2. 扩展 `tsconfig.json`，为常见 Svelte 问题启用额外类型检查。`verbatimModuleSyntax` 为 `svelte-preprocess` 所需，`skipLibCheck` 则保证 `svelte-check` 正常工作。

   ```json
   {
     "compilerOptions": {
       "verbatimModuleSyntax": true,
       "skipLibCheck": true,
       // ...
     },
     "include": [
       "**/*.ts",
       "**/*.svelte"
     ]
   }
   ```

3. 在 `esbuild.config.mjs` 文件顶部添加下列导入：

   ```js
   import esbuildSvelte from 'esbuild-svelte';
   import { sveltePreprocess } from 'svelte-preprocess';
   ```

4. 将 Svelte 加入插件列表。

   ```js
   const context = await esbuild.context({
     plugins: [
       esbuildSvelte({
         compilerOptions: { css: 'injected' },
         preprocess: sveltePreprocess(),
       }),
     ],
     // ...
   });
   ```
  
5. 在 `package.json` 中添加用于运行 `svelte-check` 的脚本。
   
   ```json
   {
     // ...
     "scripts": {
       // ...
       "svelte-check": "svelte-check --tsconfig tsconfig.json"
     }
   }
   ```

## 创建 Svelte 组件

在插件根目录新建文件 `Counter.svelte`：

```tsx
<script lang="ts">
  interface Props {
    startCount: number;
  }

  let {
    startCount
  }: Props = $props();

  let count = $state(startCount);

  export function increment() {
    count += 1;
  }
</script>

<div class="number">
  <span>My number is {count}!</span>
</div>

<style>
  .number {
    color: red;
  }
</style>
```

## 挂载 Svelte 组件

要使用 Svelte 组件，需要将其挂载到已有的 [[HTML elements|HTML 元素]]上。例如，若挂载到 Obsidian 的自定义 [[ItemView|ItemView]]：

```ts
import { ItemView, WorkspaceLeaf } from 'obsidian';

// Import the Counter Svelte component and the `mount` and `unmount` methods.
import Counter from './Counter.svelte';
import { mount, unmount } from 'svelte';

export const VIEW_TYPE_EXAMPLE = 'example-view';

export class ExampleView extends ItemView {
  // A variable to hold on to the Counter instance mounted in this ItemView.
  counter: ReturnType<typeof Counter> | undefined;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return 'Example view';
  }

  async onOpen() {
    // Attach the Svelte component to the ItemViews content element and provide the needed props.
    this.counter = mount(Counter, {
      target: this.contentEl,
      props: {
        startCount: 5,
      }
    });

    // Since the component instance is typed, the exported `increment` method is known to TypeScript.
    this.counter.increment();
  }

  async onClose() {
    if (this.counter) {
      // Remove the Counter from the ItemView.
      unmount(this.counter);
    }
  }
}
```

关于如何将这一视图接入用户界面，请参阅 [[Views]]。
