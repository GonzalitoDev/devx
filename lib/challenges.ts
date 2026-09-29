export interface PracticeLanguage {
  id: string;
  label: string;
  compiler: string;
}

export const PRACTICE_LANGUAGES: PracticeLanguage[] = [
  { id: "javascript", label: "JavaScript", compiler: "nodejs-20.17.0" },
  { id: "python", label: "Python", compiler: "cpython-3.12.7" },
  { id: "typescript", label: "TypeScript", compiler: "typescript-5.6.2" },
  { id: "rust", label: "Rust", compiler: "rust-1.82.0" },
  { id: "go", label: "Go", compiler: "go-1.23.2" },
];

export type ChallengeDifficulty = "Fácil" | "Media" | "Difícil";

export interface Challenge {
  id: string;
  title: string;
  difficulty: ChallengeDifficulty;
  description: string;
  hint: string;
  solution: string;
  starters: Record<string, string>;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    difficulty: "Fácil",
    description:
      "Imprimí los números del 1 al 15. Para los múltiplos de 3 imprimí «Fizz», para los de 5 «Buzz», y para los de ambos «FizzBuzz».",
    hint: "Usá un bucle del 1 al 15 y el operador módulo (%) para saber si un número es múltiplo.",
    solution:
      "for (let i = 1; i <= 15; i++) {\n  if (i % 15 === 0) console.log('FizzBuzz');\n  else if (i % 3 === 0) console.log('Fizz');\n  else if (i % 5 === 0) console.log('Buzz');\n  else console.log(i);\n}",
    starters: {
      javascript: "// Imprimí la secuencia FizzBuzz del 1 al 15\n",
      python: "# Imprimí la secuencia FizzBuzz del 1 al 15\n",
      typescript:
        "// Imprimí la secuencia FizzBuzz del 1 al 15\n",
      rust: "fn main() {\n    // Imprimí la secuencia FizzBuzz del 1 al 15\n    \n}\n",
      go: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Imprimí la secuencia FizzBuzz del 1 al 15\n    \n}\n",
    },
  },
  {
    id: "is-palindrome",
    title: "¿Es palíndromo?",
    difficulty: "Media",
    description:
      "Escribí una función que reciba un texto y devuelva true si es palíndromo (se lee igual al derecho y al revés), ignorando espacios. Ej: «anita lava la tina».",
    hint: "Borrá los espacios con replace y compará el texto con su versión invertida.",
    solution:
      "function esPalindromo(texto) {\n  const limpio = texto.replace(/\\s/g, '').toLowerCase();\n  const invertido = limpio.split('').reverse().join('');\n  return limpio === invertido;\n}\nconsole.log(esPalindromo('anita lava la tina')); // true",
    starters: {
      javascript: "function esPalindromo(texto) {\n  // tu código\n}\nconsole.log(esPalindromo('anita lava la tina'));\n",
      python:
        "def es_palindromo(texto):\n    # tu código\n    pass\n\nprint(es_palindromo('anita lava la tina'))\n",
      typescript: "function esPalindromo(texto: string): boolean {\n  // tu código\n  return false;\n}\nconsole.log(esPalindromo('anita lava la tina'));\n",
      rust: "fn es_palindromo(texto: &str) -> bool {\n    // tu código\n    false\n}\n\nfn main() {\n    println!(\"{}\", es_palindromo(\"anita lava la tina\"));\n}\n",
      go: "package main\n\nimport (\n  \"fmt\"\n  \"strings\"\n)\n\nfunc esPalindromo(texto string) bool {\n  // tu código\n  return false\n}\n\nfunc main() {\n  fmt.Println(esPalindromo(\"anita lava la tina\"))\n}\n",
    },
  },
  {
    id: "fibonacci",
    title: "Fibonacci",
    difficulty: "Media",
    description:
      "Imprimí los primeros 10 números de la sucesión de Fibonacci (0, 1, 1, 2, 3, 5, …). Cada número es la suma de los dos anteriores.",
    hint: "Guardá los dos últimos valores en variables y actualizalos en cada iteración.",
    solution:
      "let a = 0, b = 1;\nfor (let i = 0; i < 10; i++) {\n  console.log(a);\n  const next = a + b;\n  a = b;\n  b = next;\n}",
    starters: {
      javascript: "// Imprimí los primeros 10 números de Fibonacci\n",
      python: "# Imprimí los primeros 10 números de Fibonacci\n",
      typescript: "// Imprimí los primeros 10 números de Fibonacci\n",
      rust: "fn main() {\n    // Imprimí los primeros 10 números de Fibonacci\n    let mut a = 0u64;\n    let mut b = 1u64;\n    // tu código\n}\n",
      go: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Imprimí los primeros 10 números de Fibonacci\n    a, b := 0, 1\n    // tu código\n}\n",
    },
  },
  {
    id: "sum-even",
    title: "Suma de pares",
    difficulty: "Media",
    description:
      "Escribí una función que reciba una lista de números y devuelva la suma de los números pares. Probá con [1, 2, 3, 4, 5, 6] (esperado: 12).",
    hint: "Filtrá los pares (número % 2 === 0) y sumalos.",
    solution:
      "function sumaPares(nums) {\n  return nums.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);\n}\nconsole.log(sumaPares([1, 2, 3, 4, 5, 6])); // 12",
    starters: {
      javascript: "function sumaPares(nums) {\n  // tu código\n}\nconsole.log(sumaPares([1, 2, 3, 4, 5, 6]));\n",
      python:
        "def suma_pares(nums):\n    # tu código\n    pass\n\nprint(suma_pares([1, 2, 3, 4, 5, 6]))\n",
      typescript: "function sumaPares(nums: number[]): number {\n  // tu código\n  return 0;\n}\nconsole.log(sumaPares([1, 2, 3, 4, 5, 6]));\n",
      rust: "fn suma_pares(nums: &[i32]) -> i32 {\n    // tu código\n    0\n}\n\nfn main() {\n    println!(\"{}\", suma_pares(&[1, 2, 3, 4, 5, 6]));\n}\n",
      go: "package main\n\nimport \"fmt\"\n\nfunc sumaPares(nums []int) int {\n  // tu código\n  return 0\n}\n\nfunc main() {\n  fmt.Println(sumaPares([]int{1, 2, 3, 4, 5, 6}))\n}\n",
    },
  },
  {
    id: "reverse",
    title: "Invertir texto",
    difficulty: "Fácil",
    description:
      "Escribí una función que devuelva un texto al revés. Ej: «devx» → «xved».",
    hint: "Recorré el texto de atrás hacia adelante o usá la función nativa de inversión.",
    solution:
      "function invertir(texto) {\n  return texto.split('').reverse().join('');\n}\nconsole.log(invertir('devx')); // xved",
    starters: {
      javascript: "function invertir(texto) {\n  // tu código\n}\nconsole.log(invertir('devx'));\n",
      python:
        "def invertir(texto):\n    # tu código\n    pass\n\nprint(invertir('devx'))\n",
      typescript: "function invertir(texto: string): string {\n  // tu código\n  return '';\n}\nconsole.log(invertir('devx'));\n",
      rust: "fn invertir(texto: &str) -> String {\n    // tu código\n    String::new()\n}\n\nfn main() {\n    println!(\"{}\", invertir(\"devx\"));\n}\n",
      go: "package main\n\nimport \"fmt\"\n\nfunc invertir(texto string) string {\n  // tu código\n  return \"\"\n}\n\nfunc main() {\n  fmt.Println(invertir(\"devx\"))\n}\n",
    },
  },
  {
    id: "factorial",
    title: "Factorial",
    difficulty: "Fácil",
    description:
      "Imprimí el factorial de 5 (5 × 4 × 3 × 2 × 1 = 120) usando un bucle.",
    hint: "Multiplicá de 1 hasta N acumulando el resultado.",
    solution:
      "let n = 5;\nlet total = 1;\nfor (let i = 2; i <= n; i++) total *= i;\nconsole.log(total); // 120",
    starters: {
      javascript: "// Calculá el factorial de 5 (esperado: 120)\nlet n = 5;\n",
      python: "# Calculá el factorial de 5 (esperado: 120)\nn = 5\n",
      typescript: "// Calculá el factorial de 5 (esperado: 120)\nconst n = 5;\n",
      rust: "fn main() {\n    // Calculá el factorial de 5 (esperado: 120)\n    let n = 5;\n    // tu código\n}\n",
      go: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Calculá el factorial de 5 (esperado: 120)\n    n := 5\n    // tu código\n}\n",
    },
  },
];

export function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export function languageCompiler(languageId: string): PracticeLanguage | undefined {
  return PRACTICE_LANGUAGES.find((l) => l.id === languageId);
}