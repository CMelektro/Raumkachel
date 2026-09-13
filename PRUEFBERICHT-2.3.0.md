# Lokaler Prüfbericht · Raumkachel 2.3.0 / Raumübersicht 1.1.0

- Raumkachel: 407 PHP-/Konfigurationsprüfungen bestanden.
- Raumübersicht: 30 PHP-/Konfigurationsprüfungen bestanden.
- Bestehende Raumkachel-Bedienung/Grafik: 4.613 Browserprüfungen bestanden.
- Bestehende Raumübersicht/Navigation: 77 Browserprüfungen bestanden.
- Zusätzliche Klima-/Darstellungsprüfungen: 597 Browserprüfungen bestanden.

PHP 8.5.10 wurde lokal mit isolierten Symcon-API-Doubles ausgeführt. Chromium 153 wurde für die Browserprüfungen verwendet. Das ersetzt keinen Test in Symcon 9.0 auf einer SymBox. Es wurden keine echten KNX-Befehle gesendet.

## Geprüfte Fälle

- Istwertanzeige und Live-Aktualisierung; getrennte Sollwert- und Rückmeldevariablen.
- Ausschließlich Sollwert schreiben; keine automatisch erzeugten Heiz-/Kühlzustände.
- Numerische Werte, konfigurierbare Grenzen, Integer/Float, gesperrte Aktionen, unbekannte und nicht endliche Sensorwerte.
- Klima ausblenden; 256 Kombinationen der acht bestehenden Kreise mit aktivem Klimafeld; keine doppelten oder zurückbleibenden Karten.
- Minus, Plus, numerische Eingabe mit Tab und Enter; keine unerlaubten Schreibbefehle aus der Übersicht.
- Istwert in der Übersicht unabhängig ausblenden; Titel abschalten; Zielnavigation unverändert.
- Alle 14 Raumdarstellungen mit Temperaturanzeige in vier Übersichtsgrößen. In diesen Fällen kein horizontaler oder vertikaler Überlauf.
- Raumklimabedienung in vier Größen ohne horizontalen Seitenüberlauf. Vertikales Scrollen bei dichter Belegung kleiner Raumkacheln bleibt möglich und wird nicht als behoben behauptet.
- HTML-Ausgaben deutlich unter 1 MB; eindeutige und vollständig registrierte Formularfelder.

## Visuelle Durchsicht

Küche, Eingang, Durchgangsflur, Wohnzimmer, Esszimmer, Gäste-WC, Kinderzimmer, Elternschlafzimmer, Treppenhaus, Büro, Hauswirtschaftsraum, Technikraum, Abstellraum und Neutral gerendert und durchgesehen. Möbel erhielten geschlossene Materialflächen hinter den Konturen; offene Detailpfade bleiben ungefüllt. Sofa/Kissen/Tisch, Hausbett/Spielzeug, Treppenlauf und Verteilerschrank wurden besonders betrachtet. Dynamische Leuchten, Rollläden und leuchtende Steckdosensymbole bleiben separat.

Die Gestaltung ist weiterhin eine reduzierte dunkle Raumillustration, kein fotorealistisches Raumbild. Optische Qualität bleibt auch eine Geschmacksfrage; die beiliegende Vorschau zeigt die tatsächlichen Modulzeichnungen.
