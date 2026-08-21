package main

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"

	chromahtml "github.com/alecthomas/chroma/formatters/html"
	"github.com/alecthomas/chroma/styles"
)

var ruleRe = regexp.MustCompile(
	`(?m)^(?:/\* ([^*]+) \*/ )?(\.highlight-chroma)(?: (\.highlight-[a-z0-9]+))? \{([^}]*)\}\s*$`,
)

type namedSel struct {
	note  string
	class string
}

func cssFor(style string) string {
	var b bytes.Buffer
	formatter := chromahtml.New(chromahtml.WithClasses(true), chromahtml.ClassPrefix("highlight-"))
	if err := formatter.WriteCSS(&b, styles.Get(style)); err != nil {
		panic(err)
	}
	css := b.String()
	css = strings.ReplaceAll(css, "display: flex;", "display: block;")
	css = regexp.MustCompile(`\.highlight-chroma \{[^}]*\}`).ReplaceAllStringFunc(css, func(rule string) string {
		return regexp.MustCompile(`background-color:\s*#[0-9a-fA-F]+;\s*`).ReplaceAllString(rule, "")
	})
	return css
}

func splitDecls(raw string) []string {
	var decls []string
	for _, part := range strings.Split(raw, ";") {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		decls = append(decls, part)
	}
	return decls
}

func declKey(decls []string) string {
	return strings.Join(decls, "; ")
}

func emitDecls(out *strings.Builder, decls []string, indent string) {
	for _, d := range decls {
		out.WriteString(indent)
		out.WriteString(d)
		out.WriteString(";\n")
	}
}

func emitSel(out *strings.Builder, sel namedSel, indent, suffix string) {
	if sel.note != "" {
		out.WriteString(indent)
		out.WriteString("// ")
		out.WriteString(sel.note)
		out.WriteByte('\n')
	}
	out.WriteString(indent)
	out.WriteString(sel.class)
	out.WriteString(suffix)
}

func scssFor(style string, extraIndent string) string {
	css := cssFor(style)
	var parentNote string
	var parentDecls []string
	type group struct {
		key  string
		sels []namedSel
	}
	var groups []group
	index := map[string]int{}

	for _, m := range ruleRe.FindAllStringSubmatch(css, -1) {
		note := strings.TrimSpace(m[1])
		child := m[3]
		decls := splitDecls(m[4])
		if len(decls) == 0 {
			continue
		}
		if child == "" {
			parentNote = note
			parentDecls = decls
			continue
		}
		key := declKey(decls)
		item := namedSel{note: note, class: child}
		if i, ok := index[key]; ok {
			groups[i].sels = append(groups[i].sels, item)
			continue
		}
		index[key] = len(groups)
		groups = append(groups, group{key: key, sels: []namedSel{item}})
	}

	t0 := extraIndent
	t1 := extraIndent + "\t"
	t2 := extraIndent + "\t\t"

	var out strings.Builder
	if parentNote != "" {
		out.WriteString(t0)
		out.WriteString("// ")
		out.WriteString(parentNote)
		out.WriteByte('\n')
	}
	out.WriteString(t0)
	out.WriteString(".highlight-chroma {\n")
	if len(parentDecls) > 0 {
		emitDecls(&out, parentDecls, t1)
		out.WriteByte('\n')
	}
	for gi, g := range groups {
		if gi > 0 {
			out.WriteByte('\n')
		}
		decls := splitDecls(g.key)
		for i, sel := range g.sels {
			suffix := " {\n"
			if i < len(g.sels)-1 {
				suffix = ",\n"
			}
			emitSel(&out, sel, t1, suffix)
		}
		emitDecls(&out, decls, t2)
		out.WriteString(t1)
		out.WriteString("}\n")
	}
	out.WriteString(t0)
	out.WriteString("}\n")
	return out.String()
}

func outPath() string {
	_, src, _, ok := runtime.Caller(0)
	if !ok {
		panic("cannot resolve source path")
	}
	root := filepath.Join(filepath.Dir(src), "..", "..", "..")
	return filepath.Clean(filepath.Join(root, "src", "styles", "_chroma.scss"))
}

func main() {
	var out strings.Builder
	out.WriteString("// chroma github（亮）/ native（暗）；class 前缀 highlight-，与 Lute 输出一致。\n")
	out.WriteString("// 重新生成：pnpm chroma-css\n")
	out.WriteString("// 代码块底色沿用 --code-bg，已去掉 chroma 包装层的 background-color\n\n")
	out.WriteString(scssFor("github", ""))
	out.WriteByte('\n')
	out.WriteString("html[data-theme='dark'] {\n")
	out.WriteString(scssFor("native", "\t"))
	out.WriteString("}\n")
	path := outPath()
	if err := os.WriteFile(path, []byte(out.String()), 0o644); err != nil {
		panic(err)
	}
	if _, err := fmt.Fprintln(os.Stdout, path); err != nil {
		panic(err)
	}
}
