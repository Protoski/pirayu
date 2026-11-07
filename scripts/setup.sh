#!/usr/bin/env bash
# Instala lo necesario para usar las skills de .claude/skills/
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[1/4] Entorno Python (.venv) para webapp-testing"
python3 -m venv .venv
.venv/bin/pip install -q --upgrade pip
.venv/bin/pip install -q -r requirements.txt

echo "[2/4] Navegador Chromium para Playwright (Python)"
.venv/bin/python -m playwright install chromium

echo "[3/4] Dependencias Node para frontend-visual-qa"
npm install --no-audit --no-fund

echo "[4/4] Navegador Chromium para Playwright (Node)"
npx playwright install chromium

echo "Listo. Activa el entorno con: source .venv/bin/activate"
