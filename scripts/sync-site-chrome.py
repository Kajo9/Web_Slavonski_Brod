#!/usr/bin/env python3
"""Uskladi navbar i footer sa Početna_v2 na svim HTML stranicama."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIP_LINK = """  <a href="#main-content" class="skip-link">Skoči na glavni sadržaj</a>

"""

NAVBAR_OSTALO = """  <!-- ==================== NAVBAR ==================== -->
  <nav class="navbar navbar-dark navbar-expand-lg" role="navigation" aria-label="Glavna navigacija">
    <div class="container">
      <a class="navbar-brand" href="../Početna_v2.html">
        <img src="../slike/grb_SB.png" alt="Grb Slavonski Brod"> Grad Slavonski Brod
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" href="../Početna_v2.html">
              <i class="fa fa-home" aria-hidden="true"></i> Home
            </a>
          </li>
          <li class="nav-item dropdown">
            <button class="btn btn-outline-warning dropdown-toggle" type="button"
              id="dropdownAtrakcije" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              Atrakcije
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownAtrakcije">
              <a class="dropdown-item" href="Atrakcije.html">Sve atrakcije</a>
              <div class="dropdown-divider" style="border-top: 1px solid #ffc107;"></div>
              <a class="dropdown-item" href="Tvrđava.html">Tvrđava Brod</a>
              <a class="dropdown-item" href="Industrijski_park.html">Industrijski park</a>
              <a class="dropdown-item" href="Kuca_Tambure.html">Kuća Tambure</a>
              <a class="dropdown-item" href="Franjevački_samostan.html">Franjevački samostan</a>
              <a class="dropdown-item" href="Kuca_Brlicevih.html">Kuća Brlićevih</a>
              <a class="dropdown-item" href="Muzej.html">Muzej Brodskog Posavlja</a>
              <a class="dropdown-item" href="Korzo.html">Korzo</a>
              <a class="dropdown-item" href="Šetalište_pokraj_Save.html">Šetalište pokraj Save</a>
            </div>
          </li>
          <li class="nav-item dropdown">
            <button class="btn btn-outline-warning dropdown-toggle" type="button"
              id="dropdownTradicije" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              Tradicije
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownTradicije">
              <a class="dropdown-item" href="Tradicija.html">Sve tradicije</a>
              <div class="dropdown-divider" style="border-top: 2px solid #ffc107;"></div>
              <a class="dropdown-item" href="Tradicionalne_pjesme.html">Tradicionalne pjesme</a>
              <a class="dropdown-item" href="Tradicionalna_kuhinja.html">Tradicionalna kuhinja</a>
              <a class="dropdown-item" href="Slavonski_običaji.html">Slavonski običaji</a>
              <a class="dropdown-item" href="Manifestacije.html">Manifestacije</a>
              <a class="dropdown-item" href="Narodne%20nošnje%20Slavonije.html">Narodne nošnje</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="O_gradu_v2.html">O gradu</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="Smještaj.html">Smještaj</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="Kontakt.html">Kontakt</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
"""

FOOTER_OSTALO = """  <!-- ==================== FOOTER ==================== -->
  <footer class="footer">
    <div class="container">
      <div class="footer-columns">

        <div class="footer-column">
          <h5>Kontakt</h5>
          <ul>
            <li>Slavonski Brod</li>
            <li>Telefon: 099/782-790</li>
            <li>Email: sbturizam@gmail.com</li>
          </ul>
        </div>

        <div class="footer-column">
          <h5>Mediji</h5>
          <div class="footer-icons">
            <a href="https://www.instagram.com/" target="_blank" aria-label="Instagram">
              <i class="fa fa-instagram fa-lg" aria-hidden="true"></i>
            </a>
            <a href="https://twitter.com/" target="_blank" aria-label="Twitter">
              <i class="fa fa-twitter fa-lg" aria-hidden="true"></i>
            </a>
            <a href="https://www.facebook.com/" target="_blank" aria-label="Facebook">
              <i class="fa fa-facebook-official fa-lg" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div class="footer-column">
          <h5>Korisni linkovi</h5>
          <a class="nav-link" href="../Početna_v2.html">Home</a>
          <a class="nav-link" href="Atrakcije.html">Atrakcije</a>
          <a class="nav-link" href="Tradicija.html">Tradicije</a>
          <a class="nav-link" href="Smještaj.html">Smještaj</a>
          <a class="nav-link" href="O_gradu_v2.html">O gradu</a>
          <a class="nav-link" href="Kontakt.html">Kontakt</a>
        </div>

      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 Grad Slavonski Brod. Sva prava pridržana.</p>
    </div>
  </footer>
"""

FOOTER_ROOT = """  <!-- ==================== FOOTER ==================== -->
  <footer class="footer">
    <div class="container">
      <div class="footer-columns">

        <div class="footer-column">
          <h5>Kontakt</h5>
          <ul>
            <li>Slavonski Brod</li>
            <li>Telefon: 099/782-790</li>
            <li>Email: sbturizam@gmail.com</li>
          </ul>
        </div>

        <div class="footer-column">
          <h5>Mediji</h5>
          <div class="footer-icons">
            <a href="https://www.instagram.com/" target="_blank" aria-label="Instagram">
              <i class="fa fa-instagram fa-lg" aria-hidden="true"></i>
            </a>
            <a href="https://twitter.com/" target="_blank" aria-label="Twitter">
              <i class="fa fa-twitter fa-lg" aria-hidden="true"></i>
            </a>
            <a href="https://www.facebook.com/" target="_blank" aria-label="Facebook">
              <i class="fa fa-facebook-official fa-lg" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div class="footer-column">
          <h5>Korisni linkovi</h5>
          <a class="nav-link" href="Početna_v2.html">Home</a>
          <a class="nav-link" href="./ostalo/Atrakcije.html">Atrakcije</a>
          <a class="nav-link" href="./ostalo/Tradicija.html">Tradicije</a>
          <a class="nav-link" href="./ostalo/Smještaj.html">Smještaj</a>
          <a class="nav-link" href="./ostalo/O_gradu_v2.html">O gradu</a>
          <a class="nav-link" href="./ostalo/Kontakt.html">Kontakt</a>
        </div>

      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 Grad Slavonski Brod. Sva prava pridržana.</p>
    </div>
  </footer>
"""

SITE_CHROME_LINK_ROOT = '  <link rel="stylesheet" href="./css/site-chrome.css">\n'
SITE_CHROME_LINK_OSTALO = '  <link rel="stylesheet" href="../css/site-chrome.css">\n'

SKIP_RE = re.compile(
    r'\s*<a href="#main-content" class="skip-link">[^<]*</a>\s*',
    re.IGNORECASE,
)
NAV_RE = re.compile(
    r'(?:<!--\s*={3,}\s*NAVBAR\s*={3,}\s*-->\s*)?'
    r'<nav class="navbar navbar-dark navbar-expand-lg"[\s\S]*?</nav>',
    re.IGNORECASE,
)
FOOTER_RE = re.compile(
    r'(?:<!--\s*={3,}\s*FOOTER\s*={3,}\s*-->\s*)?'
    r'<footer class="footer"[\s\S]*?</footer>',
    re.IGNORECASE,
)
STRAY_FOOTER_RE = re.compile(r'\s*</div>\s*</footer>\s*(?=</body>)', re.IGNORECASE)


def ensure_site_chrome_link(text: str, link_line: str) -> str:
    if "site-chrome.css" in text:
        return text
    return re.sub(r"</head>", link_line + "</head>", text, count=1, flags=re.IGNORECASE)


def process_ostalo(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    text = SKIP_RE.sub("\n", original)
    nav_block = SKIP_LINK + NAVBAR_OSTALO
    if not NAV_RE.search(text):
        print(f"WARN {path.name}: navbar not found")
        return False
    text, n = NAV_RE.subn(nav_block, text, count=1)
    if n != 1:
        print(f"WARN {path.name}: navbar count {n}")
    text, n = FOOTER_RE.subn(FOOTER_OSTALO, text, count=1)
    if n != 1:
        print(f"WARN {path.name}: footer count {n}")
    text = STRAY_FOOTER_RE.sub("\n", text)
    text = ensure_site_chrome_link(text, SITE_CHROME_LINK_OSTALO)
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def process_pocetna(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    text, n = FOOTER_RE.subn(FOOTER_ROOT, original, count=1)
    if n != 1:
        print(f"WARN {path.name}: footer count {n}")
    text = ensure_site_chrome_link(text, SITE_CHROME_LINK_ROOT)
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = []
    for path in sorted((ROOT / "ostalo").glob("*.html")):
        if process_ostalo(path):
            changed.append(path.name)
    pocetna = ROOT / "Početna_v2.html"
    if process_pocetna(pocetna):
        changed.append(pocetna.name)
    print("Updated:", ", ".join(changed) if changed else "(none)")


if __name__ == "__main__":
    main()
