# Raumkachel 2.1.9

Korrektur in 2.1.9: Der HTML-Visualisierungstyp wird nun auch bei bestehenden Instanzen während `ApplyChanges()` gesetzt. Damit erscheint nach einem Update wieder die Raumgrafik statt einer leeren Standardkachel.

Dunkle Raumdarstellung mit einzeln aktivierbaren Grafikelementen. Eine Modulbibliothek, beliebig viele unabhängig konfigurierte Instanzen: Küche, Eingangsbereich, Durchgangsflur, Wohnzimmer, Esszimmer, Gäste-WC, Kinderzimmer, Elternschlafzimmer, Treppenhaus, Büro, Hauswirtschaftsraum, Technikraum und Abstellraum. Die bisherige neutrale Auswahl bleibt zusätzlich verfügbar.

## Erst ausprobieren

`Vorschau.html` lokal im Browser öffnen. Alle Bedienelemente sind simuliert und haben keine Verbindung zu Symcon. „Vorschau einstellen“ öffnet die Geräteauswahl. Hier lassen sich alle acht Kreise, Funktionen und die sechs Leuchtenarten ausprobieren. In der Demo bewegen sich Rollläden simuliert; im echten Modul folgt die Grafik den empfangenen Variablenwerten.

## Funktionen

- Vier Lichtkreise: eigener Name, Aktivierung, Schalten und Dimmen einzeln auswählbar. Getrennte Befehls- und Rückmeldevariablen.
- Sechs Leuchtenarten: Hängelampe, Stehlampe, Spots, LED-Leiste, Panelleuchte, Wandleuchte. Position und Größe je Leuchtengruppe konfigurierbar.
- Zwei Schaltkreise, z. B. Steckdosen: eigener Name, Boolean-Schaltvariable, optionale Rückmeldung. Nur aktiv UND mit gültiger Schaltvariable sichtbar.
- Zwei Rollläden: eigener Name, Aktivierung, Hoch/Runter, Stopp und absolute Position einzeln auswählbar. Die zugehörigen Fenster und Lamellen erscheinen nur bei Aktivierung.
- Titel frei wählbar oder ausblendbar; Statusübersicht ausblendbar. Keine feste Unterüberschrift.

Inaktive Geräte erscheinen weder als Bedienfeld noch als Grafik. Bei einem aktiven Lichtkreis mit beiden Bedienfunktionen ausgeschaltet bleibt nur die Leuchtengrafik. Bei einem aktiven Rollladen ohne Bedienfunktionen bleibt nur das Fenster. Gewählte Funktionen ohne gültige Befehlsvariable/Aktion sind nicht bedienbar.

## Update einer bestehenden Kachel

1. ZIP entpacken. Den Inhalt des Ordners `Raumkachel` in das bestehende GitHub-Repository hochladen. `library.json` und `RoomTile` liegen direkt auf der obersten Ebene. Änderungen mit **Commit changes** speichern.
2. In Symcon die Modulbibliothek aktualisieren. Version **2.1.8 / Build 13** prüfen.
3. Die bestehende Instanz behalten und öffnen. Änderungen übernehmen, anschließend Visu neu laden.

Die Modul- und Bibliothekskennungen bleiben gleich. Bestehende Namen, Schalt-/Dimmvariablen, Rückmeldungen, Titel, Farben und der erste Steckdosenkreis werden übernommen. Die bisherigen drei Lichtkreise sind anfangs aktiv; Lichtkreis 4, Schaltkreis 2 und beide Rollläden sind zunächst deaktiviert.

Jeder Raumtyp besitzt eine eigene, separat gezeichnete Raumgrafik im dunklen Linien-Stil. Leuchten, Lichtflächen, Fenster und Rollläden passen sich an den Raum an. Für bestehende Installationen ab 1.0.4 bleiben die drei alten Lichtzuordnungen unverändert. Beim direkten Update von 1.0.3 zuerst Schalten und Dimmen getrennt zuordnen (siehe UPDATE-1.0.4.md).

## Weitere Räume

Weitere Instanzen des Moduls **Raumkachel** anlegen, unter Allgemein einen Raumnamen eingeben, Raummotiv auswählen und die gewünschten Kreise zuordnen. Jede Instanz besitzt eigene Einstellungen und Variablen. Beim Übernehmen wird der Raumname auch als Instanzname im Objektbaum gesetzt. „Titel anzeigen“ steuert nur die Sichtbarkeit des Titels innerhalb der HTML-Kachel.

## Licht und Steckdosen

Schalten nutzt Boolean-Variablen. Dimmen nutzt numerische Absolutwerte, wahlweise 0–100 %, 0–255 oder 0–1 (Float). Der eingestellte Wertebereich gilt für Befehl UND Rückmeldung. Für 0–1 muss die Befehlsvariable vom Typ Float sein. Eine vorhandene Schaltrückmeldung bestimmt die Lichtanzeige auch bei ausgeblendetem Schalter. Ein/Aus sendet ausschließlich an das Schaltobjekt. Die Einschalt-Helligkeit bestimmt der Aktor. Der Dimmregler sendet beim Loslassen; während des Ziehens zeigt er nur die gewählte Sollposition.

Die Auswahl einer Leuchtenart verändert die Grafik, nicht die elektrischen Funktionen. Die neue Option „Leuchte automatisch passend zum Raum platzieren“ ist standardmäßig aktiv. Sie passt Position und Größe an Raumtyp und Leuchtenart an. Mehrere gleiche Leuchtenarten erhalten unterschiedliche Positionen. Automatische LED-Kreise teilen sich den passenden Leistenverlauf in Abschnitte. Im Treppenhaus verläuft eine aktive LED-Leiste diagonal am Aufgang und beleuchtet die Stufen. Mehrere automatisch platzierte Treppen-LED-Kreise teilen sich den Verlauf in Abschnitte.

Für eigene Positionen die Automatik je Lichtkreis deaktivieren. Die bisherigen X/Y- und Größenwerte sind erhalten; X/Y sind Koordinaten im Raumbild (1000 × 650). Beim Update wird zunächst die Automatik verwendet; vorhandene manuelle Positionen werden nach Deaktivierung wieder wirksam.

## Rollläden

| Feld | Bedeutung |
|---|---|
| Fahrbefehl | Boolean mit hinterlegter Symcon-Aktion; standardmäßig FALSE = aufwärts, TRUE = abwärts |
| Stoppbefehl | Separates Boolean-Objekt mit Aktion; standardmäßig TRUE. Bei Bedarf über das Häkchen auf FALSE ändern |
| Absolute Position | Numerische Befehlsvariable mit Aktion |
| Positionsrückmeldung | Separate numerische Rückmeldung empfohlen; alternativ wird die Befehlsvariable angezeigt |
| Wertebereich | 0–100, 0–255 oder 0–1 (Float), identisch für Befehl und Rückmeldung |
| Richtung umkehren | Aktivieren, wenn die Variable bei 0 geschlossen statt geöffnet bedeutet |

Die Kachel zeigt immer **0 % = offen, 100 % = geschlossen**. Die Invertierung gilt für Lesen UND Schreiben. Die Bedienelemente schalten ausschließlich bereits eingerichtete Symcon-Aktionen; es werden keine Motorrelais direkt angesteuert. Variable und Aktion zuerst in Symcon prüfen. Numerische Fahrt-/Stopp-Sammelvariablen werden in dieser Version nicht unterstützt; für Fahrt und Stopp separate Boolean-KNX-Objekte zuordnen.

Ohne gültigen Positionswert zeigt die Grafik „—“ und einen blassen, als unbekannt gekennzeichneten Behang. Nach Hoch/Runter wird keine Position erfunden. Mit Rückmeldung folgt die Grafik der echten Meldung des Aktors; ohne Rückmeldung bleibt sie beim Wert der Befehlsvariable.

## Größe und Prüfung

Die Bedienfelder passen sich an die Zahl aktiver Geräte an; bei vielen Kreisen stehen sie zweispaltig. Bei sehr kleinen Kacheln kann Scrollen erforderlich sein. Für alle acht Kreise eine entsprechend große Kachel verwenden.

Die Raumgrafiken und die vollständige Kachel wurden in Chromium geprüft. Mit acht aktiven Kreisen passen die getesteten Anzeigegrößen von 360 × 640 bis 1280 × 800 Pixeln ohne Scrollen. Die PHP-Befehlslogik ist mit PHP 8.5.10 und einer nachgebildeten Symcon-API geprüft. Details, Korrekturen und Grenzen stehen in `PRUEFBERICHT.md`. Der abschließende reale SymBox-/KNX-Test bleibt erforderlich.

## Bezeichnungen und Kompatibilität

Der Modulordner heißt ab Version 2.1.6 `RoomTile`. Modulname, Bibliotheksname und PHP-Klassenname bleiben „Raumkachel“. Die Modul-/Bibliotheks-UUIDs, der Skriptpräfix TVK und die bestehenden Einstellungskennungen bleiben erhalten. Beim Wechsel im bestehenden Repository darf der alte Modulordner nicht zusätzlich bestehen bleiben: Er wird durch `RoomTile` ersetzt. Erst nach dem vollständigen Austausch in Symcon aktualisieren. Siehe `UPDATE-2.1.6.md`.

Ab 2.1.8 wird bei jedem Anwenden der Moduleinstellungen ein nicht leerer Raumname als Instanzname übernommen, auch bei bestehenden Instanzen. Ein leeres Feld behält den bisherigen Instanznamen. Der Raumname ändert sich beim Wechsel des Raummotivs nicht automatisch. Details stehen in UPDATE-2.1.8.md.

Die Modulstruktur richtet sich nach der [Symcon-Dokumentation](https://www.symcon.de/de/service/dokumentation/entwicklerbereich/sdk-tools/sdk-php/struktur/).

## Grafiküberarbeitung 2.1.1

Kinderzimmer mit Hausbett, Teddy, Spielregal und Teppich. Wohnzimmer mit überarbeitetem Sofa, aufliegenden Kissen, ovalem Couchtisch und breitem Fernseher. Steckdosen leuchten im eingeschalteten Zustand vollständig warm auf; bei Aus erlischt das Leuchten. Auch das Symbol im Bedienfeld ist bei Ein deutlicher hervorgehoben. Alle Gerätezuordnungen und Funktionen bleiben erhalten.

## Grafiküberarbeitung 2.1.2

Technikraum mit großem geöffnetem Stromverteiler: vier Reihen mit FI-/RCD-Gruppen, einzelnen Leitungsschutzschaltern, Schalthebeln, Prüftasten und Beschriftungsfeldern. Daneben Netzwerkschrank und Werkzeugkoffer. Die Verteilung ist eine Raumillustration und zeigt keine realen Sicherungszustände.

Auch die übrigen Räume wurden betrachtet. Überarbeitet wurden Stühle und Tisch im Esszimmer, Kissen im Elternschlafzimmer, der Bürostuhl und Besen/Wischer im Abstellraum. Die zuletzt verbesserten Ansichten von Kinder- und Wohnzimmer sowie das vollständige Steckdosenleuchten bleiben erhalten.

## Durchgangsflur (2.1.3)

Unter Allgemein → Raummotiv steht jetzt „Durchgangsflur“ zur Verfügung: Flurperspektive mit Zimmertüren auf beiden Seiten, längs angeordneten Spots und LED-Leisten entlang der Sockellinien. Die bisherige Flurgrafik mit Garderobe bleibt unter „Eingangsbereich“ erhalten. Vorhandene Instanzen behalten ihr Motiv und ihre Zuordnungen. Aktivierte Rollläden erscheinen als Fenster an der hinteren Wand; bei Deaktivierung verschwinden sie vollständig.
