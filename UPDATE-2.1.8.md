# Update 2.1.8 / Build 13

Unter Allgemein heißt das bisherige Titelfeld jetzt „Raumname (auch Instanzname im Objektbaum)“. Beim Übernehmen der Einstellungen wird ein nicht leerer Raumname automatisch zum Namen dieser Instanz. Führende und folgende Leerzeichen werden für den Instanznamen entfernt.

Ein leeres Feld behält den bisherigen Instanznamen. „Titel anzeigen“ steuert weiterhin nur den Titel innerhalb der HTML-Kachel; der Raumname im Objektbaum bleibt unabhängig davon erhalten. Wird eine Instanz im Objektbaum manuell umbenannt, wird beim nächsten Anwenden der Moduleinstellungen wieder der konfigurierte Raumname verwendet. Auch beim Bibliotheksupdate kann Symcon die Einstellungen erneut anwenden.

Den Inhalt von Raumkachel im bestehenden Repository aktualisieren, danach in Symcon Version 2.1.8 / Build 13 laden. Instanz öffnen, Raumname eintragen und Änderungen übernehmen.

Autor CMelektro, Modulordner RoomTile sowie bestehende Gerätezuordnungen bleiben erhalten. PHP-Bedienlogik mit nachgebildeter Symcon-API geprüft; der reale SymBox-Test bleibt ausstehend.
