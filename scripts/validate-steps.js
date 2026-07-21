const fs = require("node:fs");
const path = require("node:path");

const SEARCH_ROOTS = [path.join(process.cwd(), "cypress")];
const STEP_NAMES = new Set(["Given", "When", "Then", "defineStep"]);
const SUPPORTED_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);

function collectFiles(directory) {
  if (!fs.existsSync(directory)) {
    throw new Error(`No existe la carpeta configurada: ${directory}`);
  }

  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else if (entry.isFile() && SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function lineAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

function skipWhitespaceAndComments(source, start) {
  let index = start;
  while (index < source.length) {
    if (/\s/.test(source[index])) {
      index += 1;
    } else if (source.startsWith("//", index)) {
      index = source.indexOf("\n", index + 2);
      if (index === -1) return source.length;
    } else if (source.startsWith("/*", index)) {
      const end = source.indexOf("*/", index + 2);
      return end === -1 ? source.length : skipWhitespaceAndComments(source, end + 2);
    } else {
      break;
    }
  }
  return index;
}

function readQuoted(source, start, quote) {
  let index = start + 1;
  let value = "";
  let dynamic = false;

  while (index < source.length) {
    const character = source[index];
    if (character === "\\") {
      if (index + 1 >= source.length) return null;
      value += source.slice(index, index + 2);
      index += 2;
    } else if (character === quote) {
      return { raw: value, end: index + 1, dynamic };
    } else {
      if (quote === "`" && character === "$" && source[index + 1] === "{") {
        dynamic = true;
      }
      value += character;
      index += 1;
    }
  }
  return null;
}

function readRegex(source, start) {
  let index = start + 1;
  let inCharacterClass = false;

  while (index < source.length) {
    if (source[index] === "\\") {
      index += 2;
    } else if (source[index] === "[") {
      inCharacterClass = true;
      index += 1;
    } else if (source[index] === "]") {
      inCharacterClass = false;
      index += 1;
    } else if (source[index] === "/" && !inCharacterClass) {
      const body = source.slice(start + 1, index);
      index += 1;
      const flagsStart = index;
      while (/[a-z]/i.test(source[index] || "")) index += 1;
      return { raw: `/${body}/${source.slice(flagsStart, index)}`, end: index };
    } else if (source[index] === "\n") {
      return null;
    } else {
      index += 1;
    }
  }
  return null;
}

function decodeString(raw) {
  try {
    return JSON.parse(`"${raw.replace(/"/g, '\\"')}"`);
  } catch {
    return raw;
  }
}

function normalizeWhitespace(value) {
  return value.trim().replace(/\s+/g, " ");
}

function findDefinitions(source, file) {
  const definitions = [];
  let index = 0;

  while (index < source.length) {
    if (source.startsWith("//", index)) {
      const end = source.indexOf("\n", index + 2);
      index = end === -1 ? source.length : end + 1;
      continue;
    }
    if (source.startsWith("/*", index)) {
      const end = source.indexOf("*/", index + 2);
      index = end === -1 ? source.length : end + 2;
      continue;
    }
    if (["'", '"', "`"].includes(source[index])) {
      const literal = readQuoted(source, index, source[index]);
      index = literal ? literal.end : index + 1;
      continue;
    }
    if (!/[A-Za-z_$]/.test(source[index])) {
      index += 1;
      continue;
    }

    const identifierStart = index;
    while (/[\w$]/.test(source[index] || "")) index += 1;
    const stepType = source.slice(identifierStart, index);
    if (!STEP_NAMES.has(stepType)) continue;

    const openParenthesis = skipWhitespaceAndComments(source, index);
    if (source[openParenthesis] !== "(") continue;
    const argumentStart = skipWhitespaceAndComments(source, openParenthesis + 1);
    const firstCharacter = source[argumentStart];
    let literal;
    let expressionType;

    if (["'", '"', "`"].includes(firstCharacter)) {
      literal = readQuoted(source, argumentStart, firstCharacter);
      if (!literal || literal.dynamic) continue;
      expressionType = "string";
    } else if (firstCharacter === "/") {
      literal = readRegex(source, argumentStart);
      if (!literal) continue;
      expressionType = "regex";
    } else {
      continue;
    }

    const expression = expressionType === "string"
      ? normalizeWhitespace(decodeString(literal.raw))
      : literal.raw;
    definitions.push({ expression, expressionType, file, line: lineAt(source, identifierStart), stepType });
    index = literal.end;
  }

  return definitions;
}

function displayExpression(definition) {
  return definition.expressionType === "regex"
    ? definition.expression
    : JSON.stringify(definition.expression);
}

function main() {
  const files = SEARCH_ROOTS.flatMap(collectFiles);
  const definitions = files.flatMap((file) => findDefinitions(fs.readFileSync(file, "utf8"), file));
  const grouped = new Map();

  for (const definition of definitions) {
    const key = `${definition.expressionType}:${definition.expression}`;
    const matches = grouped.get(key) || [];
    matches.push(definition);
    grouped.set(key, matches);
  }

  const duplicates = [...grouped.values()].filter((matches) => matches.length > 1);
  if (duplicates.length === 0) {
    console.log(`Validación completada: ${definitions.length} Step Definitions encontrados, sin duplicados.`);
    return;
  }

  console.error(`Se encontraron ${duplicates.length} expresiones de Step duplicadas:`);
  for (const matches of duplicates) {
    console.error(`\nExpresión duplicada: ${displayExpression(matches[0])}`);
    for (const match of matches) {
      console.error(`  - ${match.stepType}: ${path.relative(process.cwd(), match.file)}:${match.line}`);
    }
  }
  process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error("Error inesperado al validar los Step Definitions:");
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
}
