---
aliases: "Command.callback"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`命令`]（命令） › [`回调`]（命令/回调）

## Command.callback 属性

简单回调，全局触发。

**签名：**

```typescript
callback?: () => any;
```

＃＃ 例子


```ts
this.addCommand({
  id: 'print-greeting-to-console',
  name: 'Print greeting to console',
  callback: () => {
    console.log('Hey, you!');
  },
});
```

