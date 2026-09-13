# Raumkachel 2.3.0 · Build 16

## Update

ZIP entpacken. Den **Inhalt** des Ordners `Raumkachel` in das bestehende GitHub-Repository hochladen und speichern. `library.json` und `RoomTile` müssen direkt auf dessen oberster Ebene liegen. Nicht die ZIP selbst hochladen.

Danach die Bibliothek in Symcon aktualisieren, Version **2.3.0 / Build 16** prüfen, die vorhandenen Instanzen öffnen und Änderungen übernehmen. Visu neu laden. Bestehende Instanzen nicht löschen: Kennungen und bisherige Konfigurationsfelder sind unverändert. Autor bleibt CMelektro. Die funktionierende HTML-Anbindung für Symcon 9.0 bleibt erhalten.

## Klima einrichten

In der Rauminstanz **Klima / Einzelraumregelung** aufklappen:

1. **Klimabereich anzeigen** aktivieren; eigene Bezeichnung vergeben.
2. **Isttemperatur** mit der Temperaturvariable in °C verbinden.
3. **Sollwert schreiben** mit der bereits bedienbaren absoluten Solltemperatur des Heizungsaktors verbinden.
4. Falls vorhanden, eine separate **Sollwert-Rückmeldung** zuordnen. Diese hat bei der Anzeige Vorrang vor der Befehlsvariable.
5. Minimalen und maximalen Sollwert passend zum Aktor einstellen. Vorgabe: 5–30 °C. Minimum muss kleiner als Maximum sein.

Der Aktor regelt weiterhin selbst. Das Modul berechnet weder Stellwerte noch Heiz-/Kühlzustände. Istwert und Sollwertrückmeldung werden nur gelesen; ausschließlich die Sollwertvariable erhält Bedienbefehle.

Die Sollwertvariable muss eine funktionierende Symcon-Aktion besitzen. Keine Sollwertverschiebung, Prozentvariable oder Ventilstellung auswählen. Temperaturen werden als absolute °C übertragen. Float-Variablen erhalten 0,5-°C-Tastenschritte, Integer-Variablen ganze Grad. Werte außerhalb der eingestellten Grenzen werden auch im PHP-Modul abgewiesen. Variablenprofilgrenzen werden nicht automatisch übernommen.

Ohne gültigen Sensor erscheint „—“, nicht fälschlich 0 °C. Ohne beschreibbare Sollwertvariable bleibt die Anzeige erhalten, die Bedienung ist gesperrt. Bei deaktiviertem Klimabereich erscheint kein Klimafeld und es werden keine Temperaturbefehle gesendet. Das Modul schreibt auch keine Temperatur beim Aktivieren oder Aktualisieren.

## Raumübersicht

Die separate Raumübersicht benötigt ihr eigenes Update **1.1.0 / Build 6**. Dort unter **Raumtemperatur** dieselbe Istwertvariable auswählen und die Anzeige nach Wunsch aktivieren. Sie ist unabhängig von der Raumkachel abschaltbar. Keine Sollwertbedienung in der Übersicht; das Anklicken öffnet weiterhin das zugewiesene Ziel.

## Grafik und Prüfung

Alle 13 Raumtypen plus Neutral wurden im Browser gerendert und visuell durchgesehen. Dezente Materialflächen, klarere Konturen und Bodenkontakt ergänzen den dunklen Stil. Die Grafiken sind in beiden Modulen identisch. Aktivierbare Leuchten, Steckdosen und Rollläden bleiben eigene zustandsabhängige Elemente.

Lokale Tests: siehe `PRUEFBERICHT-2.3.0.md`. Keine Live-Prüfung auf einer SymBox oder an KNX erfolgt. Bei sehr kleinen Raumkacheln und voller Belegung kann vertikales Scrollen nötig sein; ausreichend Kachelfläche vorsehen.
