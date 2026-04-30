---
aliases: "renderMath"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`渲染数学`]（渲染数学）

## renderMath() 函数

使用 MathJax 引擎渲染一些 LaTeX 数学。返回一个 HTMLElement。渲染完成后需要调用“finishRenderMath”以刷新 MathJax 样式表。

**签名：**

```typescript
export function renderMath(source: string, display: boolean): HTMLElement;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>来源</code> | <code>字符串</code> |  |
|  <code>显示</code> | <code>布尔值</code> |  |

**退货：**

`HTML元素`

