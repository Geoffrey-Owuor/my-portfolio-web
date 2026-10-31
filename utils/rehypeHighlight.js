import rehypeHighlight from "rehype-highlight";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import diff from "highlight.js/lib/languages/diff";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

// Syntax highlighting for fenced code blocks in blog markdown. Only these
// grammars ship to the client (rehype-highlight's default `common` set is
// ~37 languages). A fence with no language, or one not registered here,
// renders as plain monospace. Grammar aliases cover the usual shorthands
// (js/jsx/mjs, ts/tsx, html, sh/zsh, yml, md). Colours come from the
// `--code-*` tokens in styles/globals.css (see the `.hljs-*` rules there).
const languages = {
  bash,
  css,
  diff,
  javascript,
  json,
  markdown,
  python,
  shell,
  sql,
  typescript,
  xml,
  yaml,
};

export const highlightPlugin = [rehypeHighlight, { languages }];
