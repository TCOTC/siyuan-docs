---
title: HTTP API 与数据规范
description: 本地请求约定、鉴权、文件读写与日记属性
---

思源通过**本地 HTTP 服务**提供 **API**（默认 **`http://127.0.0.1:6806`**，端口可随用户设置变化）。插件与其它前端代码应通过 **`fetchPost`** 等封装访问，**不要**在渲染进程用 Node **`fs`** 直接改 `{工作空间}/data`。

权威手册：**[API.md](https://github.com/siyuan-note/siyuan/blob/master/API.md)** / **[API_zh_CN.md](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)**。

---

## 1. 请求约定（摘自官方文档）

| 项目 | 说明 |
| --- | --- |
| 方法 | 一般为 **POST** |
| Header | **`Content-Type: application/json`**，正文为 JSON |
| 返回 | `{"code":0,"msg":"","data":…}`，**`code !== 0`** 表示异常 |

### 鉴权

在 **设置 → 关于** 查看 **API Token**。请求头增加：

```http
Authorization: Token <你的 Token>
```

插件内的 **`fetchPost`** 通常会与全局逻辑一并处理鉴权；自定义 `fetch` 时请勿遗漏。

---

## 2. API 主题索引（便于检索）

下列条目对应 `API.md` 目录，便于按业务查找（具体路径与参数以仓库为准）。

| 章节 | 示例接口 |
| --- | --- |
| 笔记本 | `/api/notebook/lsNotebooks`、`createNotebook` 等 |
| 文档 | `/api/filetree/createDoc`、`removeDoc`、`renameDoc` 等 |
| 资源 | `/api/asset/upload` |
| 块 | `/api/block/insertBlock`、`updateBlock`、`deleteBlock`、`moveBlock` 等 |
| 属性 | `/api/attr/setBlockAttrs`、`getBlockAttrs` |
| SQL | `/api/query/sql` |
| 模板 | `/api/template/render`、`/api/template/renderSprig` |
| 文件 | `/api/file/getFile`、`putFile`、`removeFile`、`listFiles` |
| 导出 | `/api/export/exportMd`、`exportResources` 等 |
| 其它 | 通知、代理、系统信息等 |

插件私有配置写入 **`Plugin.saveData`** 时，同样走 **`/api/file/*`**，落在 **`/data/storage/petal/<插件名>/`**。

---

## 3. 直接读写 data 目录的规范

官方 README 强调：**对工作空间文件的读写应走上述 HTTP API**。理由包括：

- **同步**：多客户端、Docker、移动端并存时，若绕过统一入口，容易导致云端数据不一致或损坏。
- **权限**：只读模式、发布模式下写入会被拒绝。

典型路径前缀：**`/api/file/getFile`**，请求体中带 **`path`**，值为 **`/data/...`** 形式的虚拟路径。

---

## 4. 日记文档属性

创建日记时，思源会为文档打上 **`custom-dailynote-yyyymmdd`** 属性。若使用 **`/api/filetree/createDailyNote`**，会自动处理；若你用 **`createDocWithMd`** 等方式「假装日记」，需要自行补属性，详见 [Issue #9807](https://github.com/siyuan-note/siyuan/issues/9807)。

---

## 5. 调试示例（curl）

在工作空间已启动且已知 Token 时，可快速验证接口：

```bash
curl -X POST http://127.0.0.1:6806/api/notebook/lsNotebooks \
  -H "Authorization: Token xxx" \
  -H "Content-Type: application/json" \
  -d "{}"
```

---

## 6. 与前端 API 的关系

| 能力 | 文档 |
| --- | --- |
| `fetchPost`、UI 组件 | [前端 Plugin API](./frontend-api.zh-CN.md) |
| 插件存储封装 | 同上「数据存储」一节 |

---

## 7. SQL 使用注意

`/api/query/sql` 能力强大，但错误语句可能影响性能或阻塞；长时间查询建议在插件侧限制频率，并在 UI 提示风险。
