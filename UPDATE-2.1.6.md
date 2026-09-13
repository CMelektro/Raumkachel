# Update 2.1.6 / Build 11

Der Modulordner heißt jetzt `RoomTile`. Alle Dateiverweise in Tests und aktueller Anleitung sind angepasst. Darstellung, Funktionen, Modulkennung und Variableneinstellungen bleiben unverändert.

## Neues, leeres Repository

Den Inhalt des entpackten Ordners `Raumkachel` hochladen. `library.json` und `RoomTile` müssen direkt nebeneinander auf der obersten Ebene liegen.

## Bestehendes Repository

Den bisherigen Modulordner durch `RoomTile` ersetzen, nicht beide parallel behalten. Der alte Ordner hieß in Versionen bis 2.1.5 `KitchenLightTile`. Vor dem Wechsel die Konfiguration in Symcon sichern. In Symcon erst aktualisieren, wenn der neue Ordner und die neue `library.json` vollständig im Repository liegen und der alte Modulordner dort entfernt ist. Die bestehende Instanz nicht löschen.

Die Umbenennung betrifft nur den Dateipfad, nicht die gespeicherten Eigenschaftsnamen oder die Modul-ID. Der reale Updatevorgang auf einer SymBox ist hier nicht ausführbar.
