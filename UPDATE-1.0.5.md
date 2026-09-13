# Update 1.0.5 – Schaltbare Steckdosen

1. ZIP entpacken und den Inhalt von Raumkachel in das bestehende GitHub-Repository hochladen. library.json und RoomTile liegen direkt auf der obersten Ebene. Commit changes wählen.
2. Bibliothek in Symcon aktualisieren; die bestehende Instanz behalten.
3. In der Instanz den neuen Abschnitt „Schaltbare Steckdosen“ öffnen.
4. Bezeichnung eingeben und eine Boolean-Schaltvariable zuordnen. Optional eine separate Boolean-Schaltrückmeldung auswählen.
5. „In der Visu anzeigen“ aktiviert lassen, Änderungen übernehmen und die Visu neu laden.

Der Bereich erscheint nur, wenn das Häkchen aktiv UND eine gültige Boolean-Schaltvariable zugeordnet ist. Das Häkchen ist standardmäßig aktiv; ohne Variable bleibt die Visu wie bisher. Zum Ausblenden das Häkchen entfernen. Ausblenden verändert den tatsächlichen Steckdosenzustand nicht. Ohne separate Rückmeldung wird die Befehlsvariable angezeigt.

Vorhandene Lampennamen und Variablenzuordnungen bleiben erhalten. Die Hinweise zum Update von älteren Versionen stehen in UPDATE-1.0.4.md.

Lokale JavaScript-Prüfung: Ein-/Ausblenden, Statusanzeige, frei wählbare Namen und bestehende Lichtbedienung. Der Funktionstest auf der SymBox steht noch aus.
