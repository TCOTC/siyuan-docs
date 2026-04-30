本指南说明如何将插件配置为使用 [React](https://react.dev/)。假定你已有一个带 [[Views|自定义视图]]的插件，并希望改为使用 React。

构建插件不必单独使用框架，但下列情况可能会让你选择 React：

- 你已熟悉 React，希望沿用熟悉的技术栈。
- 你有现成的 React 组件，希望在插件中复用。
- 插件需要复杂的状态管理等功能，若仅用常规 [[HTML elements]] 实现会比较累赘。

## 配置插件

1. 将 React 加入插件依赖：

   ```bash
   npm install react react-dom
   ```

2. 添加 React 的类型定义：

   ```bash
   npm install --save-dev @types/react @types/react-dom
   ```

3. 在 `tsconfig.json` 的 `compilerOptions` 中启用 JSX：

   ```ts
   {
     "compilerOptions": {
       "jsx": "react-jsx"
     }
   }
   ```

## 创建 React 组件

在插件根目录新建文件 `ReactView.tsx`，内容如下：

```tsx title="ReactView.tsx"
export const ReactView = () => {
  return <h4>Hello, React!</h4>;
};
```

## 挂载 React 组件

要使用 React 组件，需要将其挂载到某个 [[HTML elements|HTML 元素]]上。下列示例将 `ReactView` 组件挂载到 `this.contentEl`：

```tsx
import { StrictMode } from 'react';
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { Root, createRoot } from 'react-dom/client';
import { ReactView } from './ReactView';

const VIEW_TYPE_EXAMPLE = 'example-view';

class ExampleView extends ItemView {
	root: Root | null = null;

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
		this.root = createRoot(this.contentEl);
		this.root.render(
			<StrictMode>
				<ReactView />,
			</StrictMode>,
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
```

关于 `createRoot` 与 `unmount()`，请参阅 [ReactDOM](https://react.dev/reference/react-dom/client/createRoot#root-render) 文档。

你可以将 React 组件挂载到任意 `HTMLElement` 上，例如 [[Plugins/User interface/Status bar|状态栏项]]。结束时请调用 `this.root.unmount()` 做好清理。

## 创建 App 上下文

若要在某个 React 组件中访问 [[Reference/TypeScript API/App|App]] 对象，需要将其作为依赖传入。随着插件变大，即便只有少数几处用到 `App`，也可能被迫在整棵组件树里层层传递。

另一种做法是为 App 创建 React 上下文，使其在 React 视图内的所有组件中全局可用。

1. 使用 `createContext()` 创建 App 上下文。

   ```tsx title="context.ts"
   import { createContext } from 'react';
   import { App } from 'obsidian';

   export const AppContext = createContext<App | undefined>(undefined);
   ```

2. 用上下文提供者包裹 `ReactView`，并将 `app` 作为值传入。

   ```tsx title="view.tsx"
   this.root = createRoot(this.contentEl);
   this.root.render(
     <AppContext.Provider value={this.app}>
       <ReactView />
     </AppContext.Provider>
   );
   ```

3. 编写自定义 Hook，便于在组件中使用该上下文。

   ```tsx title="hooks.ts"
   import { useContext } from 'react';
   import { AppContext } from './context';

   export const useApp = (): App | undefined => {
     return useContext(AppContext);
   };
   ```

4. 在 `ReactView` 内的任意 React 组件中通过该 Hook 访问 app。

   ```tsx title="ReactView.tsx"
   import { useApp } from './hooks';

   export const ReactView = () => {
     const { vault } = useApp();

     return <h4>{vault.getName()}</h4>;
   };
   ```

更多信息见 React 文档：[使用 Context 深层传递数据](https://react.dev/learn/passing-data-deeply-with-context)、[使用自定义 Hook 复用逻辑](https://react.dev/learn/reusing-logic-with-custom-hooks)。
