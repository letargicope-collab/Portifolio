import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Prepara o build para hospedagem estática (GitHub Pages, arena.site, etc.).
 *
 * 1) Troca caminhos ABSOLUTOS por RELATIVOS ("./images/..."), para o site
 *    funcionar em qualquer subpasta (ex.: https://usuario.github.io/repo/).
 * 2) Cria a página física "dist/briefing/index.html", que é o cadastro de
 *    pedido de trabalho. Sem esse arquivo, abrir "/briefing/" daria
 *    "not found", porque a hospedagem estática não cria rotas sozinha.
 *
 * O script é idempotente: pode ser executado mais de uma vez com segurança.
 *
 * Uso:  node scripts/fix-paths.mjs [pasta-do-build]   (padrão: dist)
 */

const root = (process.argv[2] ?? "dist").replace(/\/+$/, "");
const file = `${root}/index.html`;
const before = readFileSync(file, "utf8");

// --- 1) caminhos relativos -------------------------------------------------
let html = before;
// Somente quando "/images/" NÃO já vem precedido por um "." (evita duplo prefixo).
html = html.replace(/(?<!\.)\/images\//g, "./images/");
html = html.replace(/href="\/favicon\.svg"/g, 'href="./favicon.svg"');

if (html === before) {
  console.log(`[fix-paths] ${file} já usa caminhos relativos. Nada a fazer.`);
} else {
  writeFileSync(file, html);
  console.log(`[fix-paths] ${file} atualizado para caminhos relativos.`);
}

// --- 2) página física do cadastro (/briefing/) -----------------------------
// Mesma aplicação; dentro dela o App decide a tela pelo caminho da URL.
// Os caminhos sobem um nível ("../images/...") porque a página fica em /briefing/.
const briefing = html
  .replace(/(?<!\.)\.\/images\//g, "../images/")
  .replace(/href="\.\/favicon\.svg"/g, 'href="../favicon.svg"')
  .replace("<head>", `<head>\n    <title>Cadastro de Projeto | Agência Rise</title>`);

mkdirSync(dirname(`${root}/briefing/index.html`), { recursive: true });
const current = (() => {
  try { return readFileSync(`${root}/briefing/index.html`, "utf8"); } catch { return ""; }
})();

if (current === briefing) {
  console.log("[fix-paths] dist/briefing/index.html já está em dia.");
} else {
  writeFileSync(`${root}/briefing/index.html`, briefing);
  console.log("[fix-paths] dist/briefing/index.html criado (cadastro em /briefing/).");
}
