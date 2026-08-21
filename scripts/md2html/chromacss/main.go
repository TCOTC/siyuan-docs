package main

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"

	chromahtml "github.com/alecthomas/chroma/v2/formatters/html"
	"github.com/alecthomas/chroma/v2/styles"
)

var ruleRe = regexp.MustCompile(
	`(?m)^(?:/\* ([^*]+) \*/ )?(\.highlight-chroma)(?: (\.highlight-[a-z0-9]+))? \{([^}]*)\}\s*$`,
)

type namedSel struct {
	note  string
	class string
}

type parsedRule struct {
	sel   namedSel
	decls []string
}

type parsedStyle struct {
	parentNote  string
	parentDecls []string
	children    []parsedRule
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
		return regexp.MustCompile(`background-color:\s*#[0-9a-fA-F]+;?\s*`).ReplaceAllString(rule, "")
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

func parseStyle(style string) parsedStyle {
	css := cssFor(style)
	out := parsedStyle{}
	for _, m := range ruleRe.FindAllStringSubmatch(css, -1) {
		note := strings.TrimSpace(m[1])
		child := m[3]
		decls := splitDecls(m[4])
		if len(decls) == 0 {
			continue
		}
		if child == "" {
			out.parentNote = note
			out.parentDecls = decls
			continue
		}
		out.children = append(out.children, parsedRule{
			sel:   namedSel{note: note, class: child},
			decls: decls,
		})
	}
	return out
}

func declKey(decls []string) string {
	return strings.Join(decls, "; ")
}

func sharedDecls(a, b []string) (shared, onlyA, onlyB []string) {
	inB := make(map[string]struct{}, len(b))
	for _, d := range b {
		inB[d] = struct{}{}
	}
	inA := make(map[string]struct{}, len(a))
	for _, d := range a {
		inA[d] = struct{}{}
		if _, ok := inB[d]; ok {
			shared = append(shared, d)
		} else {
			onlyA = append(onlyA, d)
		}
	}
	for _, d := range b {
		if _, ok := inA[d]; !ok {
			onlyB = append(onlyB, d)
		}
	}
	return
}

func indexByClass(rules []parsedRule) map[string]parsedRule {
	out := make(map[string]parsedRule, len(rules))
	for _, r := range rules {
		out[r.sel.class] = r
	}
	return out
}

func orderedClasses(latte, mocha []parsedRule) []string {
	seen := map[string]struct{}{}
	var out []string
	for _, r := range latte {
		if _, ok := seen[r.sel.class]; ok {
			continue
		}
		seen[r.sel.class] = struct{}{}
		out = append(out, r.sel.class)
	}
	for _, r := range mocha {
		if _, ok := seen[r.sel.class]; ok {
			continue
		}
		seen[r.sel.class] = struct{}{}
		out = append(out, r.sel.class)
	}
	return out
}

func appendRule(dst []parsedRule, sel namedSel, decls []string) []parsedRule {
	if len(decls) == 0 {
		return dst
	}
	return append(dst, parsedRule{sel: sel, decls: decls})
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

func emitChromaBlock(out *strings.Builder, parentNote string, parentDecls []string, children []parsedRule, extraIndent string) {
	if len(parentDecls) == 0 && len(children) == 0 {
		return
	}

	type group struct {
		key  string
		sels []namedSel
	}
	var groups []group
	index := map[string]int{}
	for _, r := range children {
		key := declKey(r.decls)
		if i, ok := index[key]; ok {
			groups[i].sels = append(groups[i].sels, r.sel)
			continue
		}
		index[key] = len(groups)
		groups = append(groups, group{key: key, sels: []namedSel{r.sel}})
	}

	t0 := extraIndent
	t1 := extraIndent + "\t"
	t2 := extraIndent + "\t\t"

	if parentNote != "" {
		out.WriteString(t0)
		out.WriteString("// ")
		out.WriteString(parentNote)
		out.WriteByte('\n')
	}
	out.WriteString(t0)
	out.WriteString(".highlight-chroma {\n")
	if len(parentDecls) > 0 {
		emitDecls(out, parentDecls, t1)
		if len(groups) > 0 {
			out.WriteByte('\n')
		}
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
			emitSel(out, sel, t1, suffix)
		}
		emitDecls(out, decls, t2)
		out.WriteString(t1)
		out.WriteString("}\n")
	}
	out.WriteString(t0)
	out.WriteString("}\n")
}

func repoRoot() string {
	_, src, _, ok := runtime.Caller(0)
	if !ok {
		panic("cannot resolve source path")
	}
	return filepath.Clean(filepath.Join(filepath.Dir(src), "..", "..", ".."))
}

func outPath() string {
	return filepath.Join(repoRoot(), "src", "styles", "_chroma.scss")
}

func main() {
	latte := parseStyle("catppuccin-latte")
	mocha := parseStyle("catppuccin-mocha")

	sharedParent, latteParent, mochaParent := sharedDecls(latte.parentDecls, mocha.parentDecls)
	latteByClass := indexByClass(latte.children)
	mochaByClass := indexByClass(mocha.children)

	var sharedChildren, latteChildren, mochaChildren []parsedRule
	for _, class := range orderedClasses(latte.children, mocha.children) {
		l, lok := latteByClass[class]
		m, mok := mochaByClass[class]
		switch {
		case lok && mok:
			sh, lo, mo := sharedDecls(l.decls, m.decls)
			sharedChildren = appendRule(sharedChildren, l.sel, sh)
			latteChildren = appendRule(latteChildren, l.sel, lo)
			mochaChildren = appendRule(mochaChildren, m.sel, mo)
		case lok:
			latteChildren = append(latteChildren, l)
		default:
			mochaChildren = append(mochaChildren, m)
		}
	}

	var out strings.Builder
	out.WriteString("// chroma catppuccin-latte（亮）/ catppuccin-mocha（暗）；class 前缀 highlight-，与 Lute 输出一致。\n")
	out.WriteString("// 重新生成：pnpm chroma-css\n")
	out.WriteString("// 代码块底色沿用 --code-bg，已去掉 chroma 包装层的 background-color\n")
	out.WriteString("// 两套主题共有的结构声明提到主题块外；亮色用 :not(dark) 包住，避免 latte 有、mocha 没有的 token 在暗色里继续套浅色规则\n\n")

	emitChromaBlock(&out, latte.parentNote, sharedParent, sharedChildren, "")
	if len(sharedParent) > 0 || len(sharedChildren) > 0 {
		out.WriteByte('\n')
	}

	out.WriteString("html:not([data-theme='dark']) {\n")
	emitChromaBlock(&out, "", latteParent, latteChildren, "\t")
	out.WriteString("}\n\n")
	out.WriteString("html[data-theme='dark'] {\n")
	emitChromaBlock(&out, "", mochaParent, mochaChildren, "\t")
	out.WriteString("}\n")

	path := outPath()
	if err := os.WriteFile(path, []byte(out.String()), 0o644); err != nil {
		panic(err)
	}
	if _, err := fmt.Fprintln(os.Stdout, path); err != nil {
		panic(err)
	}
}
