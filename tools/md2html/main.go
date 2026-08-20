package main

import (
	"encoding/json"
	"io"
	"os"

	"github.com/88250/lute"
)

type inFile struct {
	ID       string `json:"id"`
	Markdown string `json:"markdown"`
}

type inPayload struct {
	Files []inFile `json:"files"`
}

type outFile struct {
	ID   string `json:"id"`
	HTML string `json:"html"`
}

type outPayload struct {
	Files []outFile `json:"files"`
}

func newDocsLute() *lute.Lute {
	eng := lute.New()
	eng.SetHeadingID(true)
	eng.SetHeadingAnchor(false)
	eng.SetFootnotes(true)
	eng.SetGFMStrikethrough(true)
	eng.SetYamlFrontMatter(false)
	eng.SetToC(false)
	eng.SetSanitize(false)
	eng.SetProtyleWYSIWYG(false)
	eng.SetKramdownIAL(false)
	eng.SetSuperBlock(false)
	return eng
}

func main() {
	raw, err := io.ReadAll(os.Stdin)
	if err != nil {
		panic(err)
	}
	var in inPayload
	if err := json.Unmarshal(raw, &in); err != nil {
		panic(err)
	}
	eng := newDocsLute()
	out := outPayload{Files: make([]outFile, 0, len(in.Files))}
	for _, f := range in.Files {
		out.Files = append(out.Files, outFile{
			ID:   f.ID,
			HTML: eng.MarkdownStr("", f.Markdown),
		})
	}
	enc := json.NewEncoder(os.Stdout)
	enc.SetEscapeHTML(false)
	if err := enc.Encode(out); err != nil {
		panic(err)
	}
}
