"""Prueba mínima: abre demo/index.html y verifica el contador.

Uso:
  python .claude/skills/webapp-testing/scripts/with_server.py \
    --server "python3 -m http.server 5173 --directory demo" --port 5173 \
    -- python tests/smoke_demo.py
"""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173/")
    page.wait_for_load_state("networkidle")
    assert page.text_content("h1") == "Pirayu"
    page.click("#inc")
    page.click("#inc")
    assert page.text_content("#count") == "2", page.text_content("#count")
    browser.close()
    print("OK: demo carga y el contador funciona")
