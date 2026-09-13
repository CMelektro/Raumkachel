# Update 1.0.4

1. ZIP entpacken. Inhalt des Ordners Raumkachel in das bestehende GitHub-Repository hochladen und Commit changes wählen. library.json und RoomTile müssen direkt auf der obersten Ebene liegen.
2. In Symcon die Modulbibliothek aktualisieren. Die bestehende Instanz behalten.
3. In der Instanz unter Lichtkreis 1 und 2 jeweils die neue Schaltvariable (Boolean) und bei Bedarf eine separate Schaltrückmeldung auswählen.
4. Die bisherigen Control-/Status-Zuordnungen werden als Dimmwert und Dimmwertrückmeldung beibehalten. Prüfen, dass diese numerische Prozentwerte 0–100 sind. Waren dort Boolean-Variablen zugeordnet, diese in die neuen Schaltfelder übernehmen und die Dimmfelder neu zuordnen.
5. Unter jedem der drei Lichtkreise die gewünschte Bezeichnung eintragen, Änderungen übernehmen und die Visu neu laden.

Ein/Aus sendet nur einen Boolean-Schaltbefehl. Die Einschalt-Helligkeit bestimmt der Aktor. Der Regler sendet nur den absoluten Dimmwert 0–100; Rohwerte 0–255 und relatives KNX-Dimmen werden nicht unterstützt. Ohne separate Rückmeldung wird die jeweilige Befehlsvariable angezeigt.

Anzeige, Hintergrund und Anordnung bleiben erhalten. Schaltzustand und Helligkeitswert werden getrennt ausgewertet: Ein gespeicherter Dimmwert größer null lässt einen ausgeschalteten Lichtkreis nicht als eingeschaltet erscheinen.

Die JavaScript-Anzeigelogik wurde lokal geprüft. Ein Laufzeittest des PHP-Moduls in Symcon bzw. auf der SymBox steht aus.
