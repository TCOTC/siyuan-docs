---
aliases: "debounce"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`去抖`]（去抖）

## debounce() 函数

标准去抖功能。使用它可以让延时函数在给定的时间范围内仅调用一次。

**签名：**

```typescript
export function debounce<T extends unknown[], V>(cb: (...args: [...T]) => V, timeout?: number, resetTimer?: boolean): Debouncer<T, V>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>cb</code> | <code>(...args: [...T]) =>; V </代码> |要调用的函数。 |
|  <code>超时</code> | <code>号码</code> | _（可选）_ 等待超时，以毫秒为单位 |
|  <code>重置定时器</code> | <code>布尔值</code> | _（可选）_ 再次调用 debounce 函数时是否重置超时。 |

**退货：**

[`去抖器`](去抖器)`<T, V>`

一个去抖函数，其参数与原始函数相同。

＃＃ 例子


```ts
const debounced = debounce((text: string) => {
    console.log(text);
}, 1000, true);
debounced('Hello world'); // this will not be printed
await sleep(500);
debounced('World, hello'); // this will be printed to the console.
```

