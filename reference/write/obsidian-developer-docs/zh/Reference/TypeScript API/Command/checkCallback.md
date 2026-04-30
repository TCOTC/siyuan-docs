---
aliases: "Command.checkCallback"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`Command`](命令) › [`checkCallback`](命令/checkCallback)

## Command.checkCallback 属性

复杂回调，覆盖简单回调。用于“检查”您的命令在当前情况下是否可以执行。例如，如果您的命令要求活动的焦点窗格是 MarkdownView，那么您应该仅在满足条件时返回 true。返回 false 或未定义会导致命令从命令选项板中隐藏。

**签名：**

```typescript
checkCallback?: (checking: boolean) => boolean | void;
```

＃＃ 例子


```ts
this.addCommand({
  id: 'example-command',
  name: 'Example command',
  checkCallback: (checking: boolean) => {
    const value = getRequiredValue();

    if (value) {
      if (!checking) {
        doCommand(value);
      }
      return true;
    }

    return false;
  }
});
```

