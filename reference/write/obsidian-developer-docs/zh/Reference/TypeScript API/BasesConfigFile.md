---
aliases: "BasesConfigFile"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesConfigFile`](BasesConfigFile)

## BasesConfigFile接口

表示存储在“.base”文件中的 Bases 查询的序列化格式。

 1.10.0

**签名：**

```typescript
export interface BasesConfigFile 
```

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`过滤器？`](BasesConfigFile/过滤器) |  | [`BasesConfigFileFilter`]（BasesConfigFileFilter）| _（可选）_ 1.10.0 |
|  [`公式？`](BasesConfigFile/公式) |  | <code>记录</code><code><字符串，字符串></code> | <p>_（可选）_此基础中使用的公式的配置。</p><p>键：公式属性名称。值：公式字符串。</p><p> 1.10.0</p> |
|  [`属性？`](BasesConfigFile/属性) |  | <code>记录</code><code><字符串，</code><code>记录</code><code><字符串，任意>></code> | <p>_（可选）_此 Base 中属性的配置。</p><p>此对象的有效键当前包括：</p><p>- displayName: string</p><p> 1.10.0</p> |
|  [`摘要？`](BasesConfigFile/摘要) |  | <code>记录</code><code><字符串，字符串></code> | <p>_（可选）_本库中使用的汇总公式的配置。</p><p>键：汇总公式名称。值：公式字符串。</p><p> 1.10.0</p> |
|  [`视图？`](BasesConfigFile/视图) |  | [`BasesConfigFileView`](BasesConfigFileView)<code>[]</code> | <p>_（可选）_此库中使用的视图的配置。</p><p> 1.10.0</p> |

