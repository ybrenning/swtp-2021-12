# SWE Programming
2021-12-01
Maxim L., Ferris

##### Unterziel von Sprint
- Kanzi Methoden finden und speichern – geschafft

##### Implementierung
- Mittels Document Symbol Provider werden Kanzi Methoden mit ihrer jeweiligen Position gefunden
  gespeichert
- Namen der Kanzi Methoden und ihre Metadaten werden in einem Objekt gespeichert, beim starten der
  GreenIDE wird eine Liste aller gefundenen Kanzi Methoden im Terminal ausgegeben
- Diese können genutzt werden um im Syntax Highlighting zu arbeiten (Positionen von Kanzi Methoden 
  finden und dort einfärben)
- Ebenfalls können die Namen der Kanzi Methoden an das Backend übergeben werden um die Energie-
  daten zu erfassen

##### Weitere Ziele
- Implementierung Syntax Highlighting mittels Positionen von Kanzi Methoden, evt. auch einfärben
  entsprechend der übergebenen Daten
- Weitergabe der Kanzi Methoden Namen ans Backend um Energiedaten zu erhalten