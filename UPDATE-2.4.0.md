# Raumkachel 2.4.0 · Build 17

## Änderungen

- Neue plastische Raumillustrationen für alle 13 Raumtypen. Die Auswahl „Neutral“ verwendet das Büromotiv. Die bisherigen Möbel-Strichzeichnungen werden nicht mehr gezeichnet.
- Wegelicht als siebte Leuchtenart: bodennaher Wandeinbau mit nach unten gerichteter Lichtverteilung. Im Durchgangsflur werden die Leuchten entlang der Seitenwände verteilt.
- Lichtquellen, Lichtkegel, Rollläden und Steckdosen bleiben zustandsabhängige Elemente. Inaktive Geräte werden nicht dargestellt. Im Treppenhaus folgt die LED-Leiste dem Handlauf, im Durchgangsflur den Sockellinien.
- Der unter Allgemein eingetragene Titel ist unabhängig vom Instanznamen. Änderungen am Titel benennen die Instanz nicht mehr um. Bereits vorhandene Instanznamen bleiben erhalten und können im Objektbaum separat geändert werden.
- HTML-Registrierung für normale UND maximierte Kacheln korrigiert; isolierte JavaScript-Gültigkeitsbereiche verhindern Konflikte beim erneuten Laden.
- Klima mit Istwert, absolutem Sollwert und optionaler Rückmeldung bleibt enthalten.

## Aktualisieren

1. ZIP entpacken. Den gesamten Inhalt des Ordners `Raumkachel` in das bestehende Repository der Raumkachel hochladen. `library.json` und `RoomTile` liegen auf der obersten Ebene. Der neue Unterordner `RoomTile/assets/rooms` muss vollständig mit hochgeladen werden.
2. Die separate Raumübersicht ebenfalls auf **1.2.0 / Build 7** aktualisieren.
3. Beide Bibliotheken in Symcon aktualisieren. Vorhandene Instanzen öffnen und Änderungen übernehmen. Dadurch wird die korrigierte HTML-Registrierung auch auf bestehende Instanzen angewendet.
4. Die Visu vollständig schließen und neu öffnen, damit keine zuvor geladene Fassung weiterverwendet wird.

Instanzen nicht löschen. Modul-/Bibliothekskennungen und bisherige Variablenzuordnungen bleiben erhalten. Autor ist CMelektro.

## Vergrößern und Navigation

Die frühere Registrierung mit `SetVisualizationType(1)` gilt nur für die normale HTML-Kachel. Die aktuelle [Symcon-Dokumentation](https://www.symcon.de/de/service/dokumentation/entwicklerbereich/sdk-tools/sdk-php/module/setvisualizationtype/) nennt den numerischen Wert **2 für normale und maximierte HTML-Ansichten seit Symcon 9.0**. Genau dieser Wert wird jetzt verwendet. Die benannten Konstanten sind auf der Konstantenseite erst ab 9.1 dokumentiert; deshalb nutzt das Modul den numerischen Wert.

Die frühere Aussage „Typ 2 erst ab 9.1“ war falsch. Da `openObject` eine Instanz maximiert öffnet, betraf dieser Fehler sowohl den Vergrößerungspfeil als auch Verknüpfungen zur Rauminstanz.

Der äußere Vergrößerungspfeil ist Teil von Symcon. Dieses Update behauptet nicht, ihn auszublenden: Stattdessen wird die passende HTML-Darstellung auch für die Vergrößerung registriert. Eine zuverlässige Abschaltmöglichkeit aus dem Modul ist in den geprüften SDK-Seiten nicht dokumentiert.

## Licht und Grafik

Sieben Leuchtenarten stehen in jedem der vier Lichtkreise zur Verfügung: Hängelampe, Stehlampe, Spots, LED-Leiste, Panelleuchte, Wandleuchte und Wegelicht. Schalten und Dimmen bleiben unabhängig wählbar und verwenden getrennte Befehlsvariablen.

Die Beleuchtung ist eine schematische Zustandsdarstellung. Lichtkegel beginnen an den Leuchtenöffnungen und die Intensität folgt dem Status/Dimmwert; sie sind keine photometrische Simulation mit berechneten Reflexionen oder Möbelschatten. Die Hintergründe wurden mit der integrierten Bildgenerierung erstellt, für die Kachel kodiert und mit den aktiven Geräten im Browser betrachtet.

## Klima

Unter „Klima / Einzelraumregelung“ den Bereich aktivieren, Isttemperatur in °C und eine beschreibbare absolute Solltemperatur zuordnen. Eine separate Sollwert-Rückmeldung kann ergänzt werden. Der Aktor übernimmt die Regelung. Keine Sollwertverschiebung oder Ventilstellung auswählen. Grenzen sind konfigurierbar; Float-Tastenschritte 0,5 °C, Integer 1 °C. Ohne gültige Aktion ist die Sollwertbedienung gesperrt.

Die Übersicht kann denselben Istwert anzeigen; diese Anzeige ist unabhängig abschaltbar und enthält keine Sollwertbedienung.

## Grenzen der Prüfung

Lokale PHP-Prüfung mit simulierter Symcon-API und Browserprüfung erfolgt; keine echte SymBox-/KNX-Verbindung vorhanden. Der tatsächliche Symcon-Vollbildwechsel und die Freigabe des Zielobjekts müssen nach dem Update auf der Anlage geprüft werden. Ein erfolgreicher Aufruf von `openObject` liefert laut Dokumentation keine Bestätigung, dass das Ziel in der Visu angezeigt wurde. Bei vielen aktiven Bedienelementen benötigen kleine Raumkacheln weiterhin vertikales Scrollen.
