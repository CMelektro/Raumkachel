# Update 2.1.5 / Build 10

Die gründliche Funktions- und Grafikprüfung ist abgeschlossen. Korrekturen und konkrete Testergebnisse stehen in PRUEFBERICHT.md.

1. ZIP entpacken.
2. Den **Inhalt** des Ordners `Raumkachel` in das bestehende GitHub-Repository hochladen. `library.json` und `RoomTile` müssen auf derselben obersten Ebene liegen. Mit Commit changes speichern.
3. Die Bibliothek in Symcon aktualisieren; Version **2.1.5 / Build 10** prüfen.
4. Bestehende Instanz öffnen, Einstellungen übernehmen und Visu neu laden. Die Instanz behalten.

Alle bestehenden Variablenzuordnungen bleiben erhalten. Den technischen Ordner `RoomTile` nicht umbenennen und keine zweite Kopie desselben Moduls anlegen.

Bei neuen Fehlermeldungen: Variablentyp und hinterlegte Aktion prüfen. Eine in Symcon deaktivierte Aktion ist jetzt auch in der Kachel korrekt gesperrt. Der Wertebereich 0–1 setzt eine Float-Befehlsvariable voraus.
