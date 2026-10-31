# Raumkachel 2.4.4 · Garage mit Küchenzeile

Ergänzt das Raummotiv **Garage mit Küchenzeile** in der bisherigen Raumkachel und Raumübersicht. Autor: CMelektro.

## Update und Einrichtung

1. ZIP entpacken und den Inhalt des Ordners Raumkachel in das bisherige entsprechende GitHub-Repository hochladen. library.json und RoomTile müssen direkt auf der obersten Ebene liegen. Die neue Datei RoomTile/assets/rooms/garage_kitchen.jpg vollständig mit hochladen.
2. Bibliothek in Symcon aktualisieren. Vorhandene Instanzen und Zuordnungen bleiben erhalten.
3. Eine zusätzliche Raumkachel-Instanz für die Garage anlegen oder eine gewünschte vorhandene Instanz öffnen. Unter Allgemein → Raummotiv **Garage mit Küchenzeile** auswählen.
4. Pro Lichtkreis den **Beleuchtungsbereich: Torbereich oder Küchenzeile** auswählen, die Leuchtenart wählen und Schalt-/Dimmvariablen wie gewohnt getrennt zuordnen. Die Bereichsauswahl erscheint nur beim Garagenmotiv. Für die Bereichsplatzierung **Automatische Positionierung** aktiv lassen. Bei manuellen X-/Y-Angaben haben diese bewusst Vorrang.
5. Alle vier Lichtkreise bleiben verfügbar und frei zuordenbar, z. B. zwei am Tor und zwei an der Küchenzeile. In der Übersicht die entsprechenden Statusvariablen, Leuchtenarten und Bereiche ebenfalls zuordnen. Die bisherigen zwei Steckdosenkreise, Jalousien und der optionale Klimakreis stehen weiterhin zur Verfügung.
6. Änderungen übernehmen und Visu neu öffnen. Für die neue Formfunktion muss die aktualisierte Instanzkonfiguration neu geöffnet werden, falls sie während des Updates noch offen war.

Die Bilddarstellung schaltet und dimmt Tor- und Küchenbeleuchtung unabhängig. Gleiche Leuchtenarten in verschiedenen Bereichen beeinflussen ihre automatische Position und Segmentierung nicht gegenseitig. Deaktivierte Lichtkreise bleiben wie bisher unsichtbar. Die Kreisnamen sind weiterhin frei einstellbar; die Bedienkarte ergänzt bei diesem Motiv den Bereich zum Status.

Das gezeichnete Garagentor ist ein fester Teil des Motivs. Dieses Update ergänzt keine Torsteuerung; die vorhandenen Jalousiefunktionen bleiben unverändert.

## Kompatibilität und Bestand

Basis: Raumkachel 2.4.3 und Raumübersicht 1.2.3. Neue Versionen: Raumkachel **2.4.4 / Build 21**, Raumübersicht **1.2.4 / Build 11**. Modulkennungen, Autor, bestehende Eigenschaften und Zuordnungen sind erhalten. Lediglich vier zusätzliche Bereichseigenschaften und die für sie benötigte Formular-/Darstellungslogik wurden ergänzt. Befehlsverarbeitung, Wertebereiche, Temperaturbedienung, Navigationslogik und Symcon-Registrierung sind unverändert. Die separate Wohnbereich-Bibliothek wird nicht verändert.

## Prüfung

- 500 lokale PHP-/Konfigurationsprüfungen bestanden (439 Raumkachel, 61 Raumübersicht).
- 107 Browser-/Grafikprüfungen bestanden: beide realen PHP-HTML-Ausgaben laden das JPEG; sieben Leuchtenarten in beiden Bereichen liegen innerhalb des Bildes und auf der richtigen Seite; Schalten/Dimmen und Aktivierung sind getrennt; gleiche Leuchtenarten im anderen Bereich verschieben die Grafik nicht.
- Alle 16 bisherigen Raummotive einschließlich Neutral gerendert: die resultierenden SVG-Grafiken sind exakt gleich zur Vorversion.
- Acht End-to-End-Prüfungen der interaktiven Vorschau bestanden.
- Neue Grafik mit Tor- und Küchenbeleuchtung in Hauptkachel und Übersicht gerendert betrachtet. Alle alten Grafikdateien sowie CSS und Klima-/Übersichtsskripte sind bytegleich zur Vorversion.
- ZIP-Integrität und Dateivollständigkeit geprüft. HTML-Ausgaben bleiben deutlich unter 1 MB.

Die Prüfungen laufen mit einer simulierten Symcon-API und Chromium. Kein Test auf der tatsächlichen SymBox oder KNX-Anlage. Lichtkegel sind eine illustrative Darstellung, keine physikalische Lichtsimulation.

## Bild

Mit der integrierten Bildgenerierung erstellt; Stilreferenz war das bisherige Küchenmotiv. Vorgabe: dunkle professionelle Architektur-CGI einer Garage mit geschlossenem Sektionaltor links, kompakter Küchenzeile mit Spüle und Kühlschrank rechts und freiem Boden; keine eingebrannten Leuchten, Steckdosen, Zusatzfenster, Personen oder Schrift. Für die Auslieferung als JPEG mit 1200 Pixeln Breite komprimiert. Die tatsächlichen Leuchten, Fenster/Jalousien und Statussymbole werden weiterhin dynamisch ergänzt.

Neue Formularfunktionen verwenden die dokumentierten GetConfigurationForm-, Select-onChange- und UpdateFormField-Schnittstellen ab Symcon 4.1/5.2; keine 9.1-Options-Unterelemente.
