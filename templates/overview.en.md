---
title: Template pack development
description: Install path, template.json, and inserting into documents
---

**Template** packs insert **preset content** into the current document from editor entry points such as **Slash menu → Templates**. Content files live under `data/templates` in the workspace; the manifest file `template.json` declares **Package** metadata.

## Workspace path

`{workspace}/data/templates/<package-name>/`

SiYuan maps **`data/templates`** to the HTTP path **`/templates/`** so the frontend or iframes can load assets.

## Insert flow (editor)

After the user triggers a template insert, the frontend calls **`/api/template/render`** with the current document **block ID** and template file **`path`**; the server reads the template, runs the template engine, parses the resulting Markdown into blocks, and inserts them into the editor.

Pipeline implementation: **`RenderTemplate`** in the main repo. Sources are usually **Markdown** files on disk using Go template syntax with delimiters **`.action{`** and **`}`**, not the default `{{` / `}}`.

Simplified steps:

1. `path`: points to an `.md` template under `data/templates`.
2. Build the data model (title, `title`, `name`, `alias`, `id`, etc.).
3. Run the template → Markdown → block tree → insert into the editor.

> **Permissions**: `/api/template/render` may be limited by admin role and read-only mode; embedding and policy can change by version—follow official docs and observed behavior.

## Example repo layout

```
my-template-pack/
├── template.json
├── README.md
├── preview.png
├── icon.png
└── daily.md          # Example body; filename is up to you
```

Filenames only need to match whatever your insert UI can select; marketplace zips must include whatever the manifest requires.

## Next steps

- [template.json](./manifest.en.md)
- [Template syntax and authoring](./authoring.en.md)
