# Raumkachel 2.1.10 · Korrektur für Symcon 9.0

Die Versionen 2.1.7 bis 2.1.9 verwendeten den Visualisierungstyp 2. Dieser steht laut Symcon-Dokumentation erst ab Symcon 9.1 zur Verfügung. Unter Symcon 9.0 konnte deshalb statt der HTML-Raumgrafik eine leere Standardkachel erscheinen.

Version 2.1.10 verwendet wieder den für Symcon 9.0 unterstützten Visualisierungstyp 1 und setzt ihn auch bei bestehenden Instanzen neu.

## Update

1. Den Inhalt des Ordners `Raumkachel` in das bestehende GitHub-Repository laden und vorhandene Dateien ersetzen.
2. In Symcon die Bibliothek auf **2.1.10 / Build 15** aktualisieren.
3. Die vorhandene Raumkachel öffnen und einmal **Übernehmen** anklicken.
4. Die Visualisierung vollständig neu laden.

Die Instanz und alle Variablenzuordnungen bleiben erhalten.
