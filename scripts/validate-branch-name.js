const { execSync } = require("child_process");

const BRANCH_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*\/[a-z0-9]+(-[a-z0-9]+)*$/;
const EXEMPT_BRANCHES = new Set(["master", "main", "HEAD"]);

function getCurrentBranch() {
  return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
}

const branch = getCurrentBranch();

if (EXEMPT_BRANCHES.has(branch)) {
  process.exit(0);
}

if (!BRANCH_PATTERN.test(branch)) {
  console.error(`\nNombre de rama invalido: "${branch}"`);
  console.error('Usa el formato "usuario/descripcion-cambio", por ejemplo: atincopa/add-login-test\n');
  process.exit(1);
}

process.exit(0);
