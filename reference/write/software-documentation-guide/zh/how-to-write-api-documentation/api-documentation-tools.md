---
source_url: https://www.writethedocs.org/api/api-documentation-tools/
source_file: docs/guide/api/api-documentation-tools.rst
license: CC BY-NC-SA 4.0
locale: zh-CN
---

# API documentation tools

撰写 API 文档时，使用专门的描述语言往往更高效。社区常用的描述语言包括：

- [API Blueprint](https://apiblueprint.org/)
- [Swagger / OpenAPI](https://swagger.io/)

选定描述语言后，还需要工具把描述渲染成易读的文档。常见组合包括：

- [Apiary](#apiary)
- [Aglio](https://github.com/danielgtaylor/aglio)
- [Sphinx](../documentation-tools/tools.md#sphinx)

## Apiary

Apiary 提供在线编辑与托管 API 文档的服务。

### Hosting Apiary docs

Apiary 支持以 API Blueprint 或 Swagger 描述 API；完成后可生成交互式三栏文档，展示各端点的示例请求/响应，并支持多种编程语言示例，也可直接对线上 API 发起请求。

### Building Apiary docs

本地构建可参考：

1. [安装 Apiary CLI](https://help.apiary.io/tools/apiary-cli/)。  
2. 进入包含 `.apib` 文件的目录。  
3. 运行：

        apiary preview --path="myfile.apib" --output="myfile.html"

4. 在浏览器中打开生成的 HTML。

## API Blueprint

API Blueprint 是一种用于描述 Web API 的高层语言，强调设计优先；也可用于记录既有 API。文件扩展名通常为 `.apib`。

语法结合了 Markdown 与 [MSON](https://github.com/apiaryio/mson)（用于描述数据对象）。

### Getting started with API Blueprint

最快的方式是使用 [Apiary](https://apiary.io/) 在线编辑与预览：

1. 在 [Apiary 注册](https://login.apiary.io/register)。  
2. 跟随 [API Blueprint Tutorial](https://apiblueprint.org/documentation/tutorial.html) 描述你的 API。

### Writing API Blueprint docs

`.apib` 文件常见结构包括：Metadata、API 名称、Resource Group、Resource、Action，以及可复用的 Data Structures 等。

### Building API Blueprint docs

最流行的生成工具是 [Apiary](#building-apiary-docs) 与 [Aglio](https://github.com/danielgtaylor/aglio)。

## Testing API docs

当你用描述语言定义 API 后，可以用工具自动校验文档与线上实现是否一致（例如 Dredd），而不必完全依赖手工检查。
