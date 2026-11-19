#!/usr/bin/env bash
#
# Gera o site pronto para publicar no GitHub Pages.
#
# Uso (a partir da raiz do projeto):
#   ./deploy.sh
#
# Ao final, a pasta "dist/" contém o site com caminhos relativos,
# pronto para ser enviado a uma branch "gh-pages" ou publicado
# automaticamente pelo workflow do GitHub Actions.
#
set -euo pipefail

echo "==> 1/5 Instalando dependências..."
npm ci

echo "==> 2/5 Limpando build anterior..."
rm -rf dist

echo "==> 3/5 Gerando build de produção..."
npm run build

echo "==> 4/5 Caminhos relativos + página /briefing/..."
node scripts/fix-paths.mjs dist

echo "==> 5/5 Espelhando o build em docs/ (opção branch do GitHub Pages)..."
rm -rf docs && cp -R dist docs

echo
echo "Pronto! A pasta 'dist/' está pronta para publicar."
echo
echo "  Opção A (recomendada): publique via GitHub Actions"
echo "    -> basta dar push no código; o workflow publica sozinho."
echo "    -> ver .github/workflows/deploy.yml"
echo
echo "  Opção B: publicar pela pasta docs/ (sem Actions)"
echo "    -> rode ./deploy.sh e suba o código (docs/ vai junto)"
echo "    -> no GitHub: Settings > Pages > Source: Deploy from a branch > main + /docs"
echo "    -> (veja o README.md para o passo a passo completo)"
