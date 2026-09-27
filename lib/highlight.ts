export type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "function"
  | "property"
  | "plain";

export interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "new",
  "class",
  "extends",
  "super",
  "this",
  "typeof",
  "instanceof",
  "in",
  "of",
  "async",
  "await",
  "try",
  "catch",
  "finally",
  "throw",
  "import",
  "from",
  "export",
  "default",
  "interface",
  "type",
  "enum",
  "implements",
  "public",
  "private",
  "protected",
  "readonly",
  "static",
  "yield",
  "void",
  "null",
  "undefined",
  "true",
  "false",
  "def",
  "lambda",
  "with",
  "pass",
  "elif",
  "assert",
  "global",
  "nonlocal",
  "raise",
  "except",
  "fn",
  "mut",
  "let",
  "struct",
  "impl",
  "trait",
  "mod",
  "use",
  "pub",
  "crate",
  "match",
  "loop",
  "where",
  "move",
  "ref",
  "box",
  "func",
  "package",
  "select",
  "chan",
  "go",
  "defer",
  "map",
  "range",
]);

const TOKEN_REGEX =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(\d[\d._]*)\b|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "plain", value: code.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      tokens.push({ type: "comment", value: match[1] });
    } else if (match[2] !== undefined) {
      tokens.push({ type: "string", value: match[2] });
    } else if (match[3] !== undefined) {
      tokens.push({ type: "number", value: match[3] });
    } else if (match[4] !== undefined) {
      tokens.push({ type: "function", value: match[4] });
    } else if (match[5] !== undefined) {
      const word = match[5];
      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else {
        tokens.push({ type: "plain", value: word });
      }
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < code.length) {
    tokens.push({ type: "plain", value: code.slice(lastIndex) });
  }
  return tokens;
}

const TOKEN_CLASSES: Record<TokenType, string> = {
  comment: "text-zinc-500 italic",
  string: "text-emerald-400",
  keyword: "text-violet-400",
  number: "text-amber-300",
  function: "text-sky-400",
  property: "text-cyan-300",
  plain: "text-zinc-300",
};

export function tokenClass(type: TokenType): string {
  return TOKEN_CLASSES[type];
}