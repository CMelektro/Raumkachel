# Prüfbericht – Raumkachel 2.1.9 / Build 14

Aktuelle Nachprüfung 2.1.9: 356 Backend- und Konfigurationsprüfungen bestanden. Darin ist ausdrücklich geprüft, dass eine bestehende Instanz beim Übernehmen auf die HTML-Darstellung umgestellt wird. Zusätzlich bestanden 4.613 Prüfungen im Chromium-Browser ohne Seitenfehler. Acht Größen von 360 × 640 bis 1280 × 800 wurden ohne Überlauf und ohne überlappende Bedienelemente geprüft.

Nachprüfung 2.1.6: Modulordner in `RoomTile` umbenannt; Testpfade angepasst. PHP- und Node-Prüfungen erneut ausgeführt. Die HTML-Datei ist gegenüber 2.1.5 bytegleich; die unten dokumentierte Browser-/Grafikprüfung stammt aus 2.1.5. Der Modulordner ist nun geändert, die GUIDs und Eigenschaften bleiben unverändert. Für den Wechsel gilt `UPDATE-2.1.6.md`.

Stand: 13.09.2026. Ausgangsversion: 2.1.4. Die Prüfung umfasst den vorhandenen Modulcode, das Einstellungsformular, die Offline-Vorschau und alle 13 Raummotive. Es wurden keine Befehle an eine reale Anlage gesendet.

## Ergebnis

Die nachfolgend beschriebenen lokalen Prüfungen sind bestanden. Dabei wurden mehrere Fehler korrigiert. Der reale Betrieb auf der SymBox mit den zugeordneten KNX-Variablen steht weiterhin aus.

| Bereich | Prüfung und Ergebnis |
|---|---|
| PHP | Syntax und tatsächliche Modulausführung mit PHP 8.5.10 (WebAssembly), nachgebildeter Symcon-API; 352 Prüfungen zu Befehlen, Statuswerten, Fehlerfällen und Formularzuordnung bestanden |
| Browser | Chromium 153.0.8010.0; 4.613 automatisierte Prüfungen plus echte Maus-/Tastaturbedienung und Layoutmessungen bestanden; keine JavaScript-Laufzeitfehler |
| Aktivierung | Alle 256 Ein-/Aus-Kombinationen der vier Licht-, zwei Schalt- und zwei Rollladenkreise; inaktive Geräte ohne Grafik und Bedienfeld |
| Lichtfunktionen | Vier Kombinationen von Schalten/Dimmen je Lichtkreis; Befehl und Rückmeldung getrennt; Schalten sendet ausschließlich Boolean an die Schaltvariable |
| Dimmen | Absolute Wertebereiche 0–100, 0–255 und 0–1; Integer-Rundung bzw. Float geprüft; ungültige Werte blockiert; beim Ziehen keine Befehle, erst beim Loslassen |
| Status | Separate Rückmeldung hat Vorrang; gespeicherter Dimmwert lässt ausgeschaltete Lampen nicht leuchten; Updates während des Ziehens verstellen den Regler nicht |
| Steckdosen | Aktivierung, Boolean-Zuordnung, getrennte Rückmeldung, vollständiges Leuchten bei Ein und Erlöschen bei Aus |
| Rollläden | Jeweils acht Kombinationen der drei Bedienfunktionen; Auf/Ab- und Stopp-Polarität, absolute Position, drei Wertebereiche, Positionsinvertierung und unbekannte Position |
| Fehlerfälle | Fehlende, deaktivierte und gesperrte Aktionen; falsche Datentypen; abgewiesene Befehle; Fehlermeldung an die HTML-Anzeige |
| Konfiguration | Alle Formularfelder registriert, jede Einstellung auswählbar, keine doppelten Feldnamen; alte Referenzen nach Umzuordnung entfernt |
| Grafiken | Alle 13 Raummotive gerendert und visuell geprüft; je Raum sechs Leuchtenarten, auch vier gleiche Arten; Lichtquellen innerhalb der Grafikgrenzen; zusätzliche Prüfung mehrerer LED-Kreise |
| Einbettung | Titel und Gerätenamen als Text; Initialdaten gegen HTML-/Script-Einschleusung maskiert; Initialisierung innerhalb des HTML-Dokuments |
| Größe | Initiale HTML-Ausgabe der vollständig belegten Testkonfiguration rund 38 KB, deutlich unter der früher erreichten 1-MB-Grenze |
| Update | Bibliotheks-/Modul-GUID, Eigenschaftsnamen, Skriptpräfix und technischer Modulordner unverändert; ZIP-Struktur und Integrität geprüft |

## Korrigierte Punkte

1. **Deaktivierte Symcon-Aktionen:** `VariableCustomAction = 1` wird jetzt korrekt als deaktiviert behandelt. Gesperrte Variablen sind ebenfalls nicht bedienbar.
2. **0–1-Wertebereich:** Dieser benötigt eine Float-Befehlsvariable. Eine Integer-Variable wird blockiert, damit Zwischenwerte nicht versehentlich auf 0 oder 1 gerundet werden.
3. **Ausgeblendeter Schalter:** Eine vorhandene Schaltrückmeldung wird weiterhin für die Lichtgrafik verwendet. Das Ausblenden des Schalters verändert den tatsächlichen Status nicht.
4. **Befehlsfehler:** Der PHP-Teil sendet eine ausdrückliche Fehlernachricht an die Kachel. Die HTML-SDK-Funktion `requestAction` hat laut Dokumentation keinen Rückgabewert; eine reine Promise-Fehlerbehandlung reichte deshalb nicht aus.
5. **Mehrere LED-Kreise:** Automatische LED-Leisten teilen sich den passenden Verlauf in getrennte Abschnitte. Im Durchgangsflur bleiben sie an den Sockellinien, im Treppenhaus am Aufgang.
6. **Stehlampen:** Automatische Einzelpositionen in Kinderzimmer, Technikraum und Hauswirtschaftsraum von Möbelkonturen weggerückt.
7. **Kleine Kacheln:** Bei geringer Höhe wird die Raumgrafik kompakter. Auf schmalen Anzeigen entfallen die zusätzlichen Symbole in den Bedienfeldern zugunsten lesbarer Namen; die Leuchten bleiben in der Raumgrafik sichtbar.
8. **Konsistenz:** Versionsanzeige und Anleitung aktualisiert; Statusübersicht sagt jetzt „ein“, damit Einschaltzustand und Aktivierung nicht verwechselt werden.

## Gemessene Anzeigegrößen

Mit acht aktiven Kreisen, Standardtitel und normalen Gerätenamen:

| Breite × Höhe in CSS-Pixeln | Horizontal scrollen | Vertikal scrollen | Überschneidung Grafik/Bedienung |
|---|---|---|---|
| 1280 × 800 | Nein | Nein | Nein |
| 1024 × 768 | Nein | Nein | Nein |
| 900 × 900 | Nein | Nein | Nein |
| 800 × 600 | Nein | Nein | Nein |
| 760 × 700 | Nein | Nein | Nein |
| 600 × 800 | Nein | Nein | Nein |
| 390 × 844 | Nein | Nein | Nein |
| 360 × 640 | Nein | Nein | Nein |

Das sind Größen des HTML-Anzeigebereichs. Der äußere Symcon-Titel benötigt gegebenenfalls zusätzlich Platz. Sehr kleine Höhen, außergewöhnlich lange Raumtitel und andere Browser-/Zoom-Einstellungen sind damit nicht pauschal abgedeckt. Lange Gerätenamen werden platzsparend gekürzt; am Desktop zeigt der Hover-Titel den vollständigen Namen.

## Grafische Einordnung

Die Motive sind schematische Raumillustrationen im bisherigen dunklen Linien-Stil. Sichtprüfung: Küche, Eingangsbereich, Durchgangsflur, Wohnzimmer, Esszimmer, Gäste-WC, Kinderzimmer, Elternschlafzimmer, Treppenhaus, Büro, Hauswirtschaftsraum, Technikraum und Abstellraum. „Neutral“ bleibt als zusätzliche, bisherige Bürovariante erhalten.

Automatische Positionen sind auf typische Kombinationen abgestimmt. Für individuelle Einrichtungen oder ungewöhnliche Kombinationen kann die vorhandene manuelle Positionierung genutzt werden. Die Verteilung im Technikraum ist eine Illustration; ihre Sicherungen stellen keine realen Schaltzustände dar. Fenster/Rollläden erscheinen ausschließlich bei Aktivierung.

## Verbleibende praktische Prüfung

Eine PHP-Laufzeit mit nachgebildeter Symcon-API ersetzt keinen Symcon-Server. Nicht geprüft sind die reale Modulinstallation auf der SymBox, die dortige PHP-/WebView-Version, die tatsächlich hinterlegten Variablenaktionen, KNX-Telegramme, Aktorlaufzeiten und reale Rückmeldeverzögerungen.

Nach dem Update pro Gerät Schalten/Dimmen bzw. Auf/Ab/Stopp/Position auslösen und anschließend einen Wandtaster bedienen. Besonders bei Rollläden Richtung, Stoppwert und Positionsrückmeldung prüfen. Die Grafik erfindet keine Fahrt: Ohne Rückmeldung zeigt sie nur den vorhandenen Wert der Positions-Befehlsvariable.

## Nachvollziehbarkeit

- `tests/backend.php`: ausführbarer Test der echten PHP-Modulmethoden mit einer isolierten Symcon-API-Nachbildung; alle verwendeten IDs sind synthetisch.
- `tests/ui.cjs`: Node-Tests der Bedienlogik und Offline-Vorschau.
- `tests/browser.mjs`: echte Browserprüfung; benötigt Playwright und einen Chromium-Pfad.
- `tests/browser-report.json`: Messergebnisse des abschließenden Browserlaufs.

SDK-Abgleich anhand der offiziellen Dokumentation: [HTML-SDK](https://www.symcon.de/en/service/documentation/developer-area/sdk-tools/sdk-php/html-sdk/), [Variablenaktionen und Sperrstatus](https://www.symcon.de/de/service/dokumentation/befehlsreferenz/variablenverwaltung/ips-getvariable/), [requestAction im HTML-SDK](https://www.symcon.de/de/service/dokumentation/entwicklerbereich/sdk-tools/sdk-php/html-sdk/requestaction/).
