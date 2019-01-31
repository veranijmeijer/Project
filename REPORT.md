# Report Programmeerproject - sociale zekerheid in Nederland
## Doel
Er zijn in Nederland veel mensen die een uitkering krijgen. Toch zijn er weinig mensen die weten hoeveel uitkeringen er worden uitgegeven en welke. Er is dus een gebrek aan kennis over de uitkeringen in Nederland. Met behulp van deze visualisatie wordt duidelijk gemaakt hoeveel uitkeringen er worden uitgegeven en hoe deze uitkeringen verdeeld zijn de afgelopen jaren en door welke factoren dit beïnvloedt wordt.

<img src="doc/vis2.jpg" width=1200>

## Design
### Globaal overzicht website
De visualisatie op de website bestaat uit vijf onderdelen:
* Linechart: Hier wordt het aantal uitkeringen in Nederland weergegeven. Wanneer je er met de muis overheen gaat, komt er een tooltip en als je erop klikt, worden de piechart en map geupdate.
* Piechart: Hier is de verdeling van de uitkeringen te zien voor een specifiek jaar. Wanneer je er met de muis overheen gaat, komt er een tooltip en als je erop klikt wordt er een lijn toegevoegd aan de linechart voor die specifieke uitkering. Dit kan ook door in de legenda op het blokje van een uitkering te klikken.
* Slider: Met de slider kan een jaartal geselecteerd worden en dan wordt de piechart en map geupdate voor dat jaar.
* Map: In de map kunnen twee dingen worden weergegeven voor de gemeentes in Nederland: de dichtheid van bijstandsuitkeringen of het totale aantal bijstandsuitkeringen. Wanneer je er met de muis overheen gaat, komt er een tooltip.
* Radiobuttons: Met de radiobuttons kan gekozen worden tussen de dichtheid van bijstandsuitkeringen of het absolute aantal. Als hier op wordt geklikt, wordt de map geupdate.

### Bestanden en functies
In de rootfolder van het project staat 1 bestand, namelijk index.html. Dit is de startpagina van de website, met alleen een navbar en een introductieplaatje.

#### Data
* csv: in deze map staan de csv bestanden, zoals die afkomstig zijn van de site van het CBS. Deze data is gebruikt voor het maken van de visualisaties:
  * gemeente_2015.csv
  * gemeente_2016.csv
  * gemeente_2017.csv
  * social_security.csv
* json: de eerste 4 bestanden in deze map, zijn de bestanden van het CBS nadat ze zijn omgezet naar json bestanden (met behulp van de bestanden [csv2json-linechart.py](#Python) en [csv2json-map.py](#Python)).<br> De laatste 3 bestanden zijn de data voor het creëren van een kaart van de Nederlandse gemeentes. Er is voor ieder jaar een ander bestand nodig, omdat er ieder jaar gemeentes zijn samengevoegd of veranderd.
  * gemeente_2015.json
  * gemeente_2016.json
  * gemeente_2017.json
  * social_security.json
  * map_2015.json
  * map_2016.json
  * map_2017.json

#### HTML
In deze map staan drie bestanden:
* data.html: dit bestand zorgt voor de pagina waarop de databronnen worden vermeld. Bovenaan staat de navbar en verder staan er links naar de website van het CBS.
* info.html: dit bestand zorgt voor de pagina waarop het verhaal achter de visualisaties wordt weergegeven. Ook deze pagina heeft een navbar, vervolgens een introductie met een interactieve tabel van de verschillende uitkeringen in Nederland.
* visualizations.html: dit bestand zorgt voor de pagina met visualisaties. Hier staat weer bovenaan een navbar. Daaronder is de pagina ingedeeld met een Bootstrap Grid. Ook worden de radiobuttons al in dit html bestand toegevoegd.

#### JavaScript
* d3: in deze folder staan alle d3-bestanden.
* functions.js: in dit bestand staan alle functies die voor meerdere visualisaties gebruikt worden:
  * create_title: deze functie zorgt dat bovenaan het grid-gedeelte de titel van de visualisatie wordt toegevoegd.
  * add_svg: deze functie zorgt dat er een svg wordt toegevoegd in het juiste grid. Als eerste wordt per soort vastgelegd wat de afmetingen zijn. Vervolgens wordt hij toegevoegd.
  * add_legend: deze functie voegt de legenda toe voor de piechart of de map. Dit wordt meegegeven als hij wordt aangeroepen. Voor beide soorten gelden niet alleen andere waardes en kleuren, maar ook afmetingen en de locatie binnen de svg. Dit wordt allemaal aan het begin meegegeven. Vervolgens worden respectievelijk de achtergrond en rand, de titel van de legenda, de vierkante blokjes en de tekst die daarbij hoort toegevoegd.
  * change_title: deze functie zorgt ervoor dat de titel van de map en piechart wijzigen als ze geupdate worden voor een nieuw jaar.
  * update_legend: deze functie zorgt ervoor dat de legenda van de map wordt geupdate als de andere soort wordt weergegeven.
* linechart.js: in dit bestand staan alle functies die alleen voor de linechart gebruikt worden:
  * create_linechart: deze functie zorgt ervoor dat de linechart met het totaal aantal uitkeringen van de periode 1998 tot 2017 wordt gecreëerd. Als eerste wordt een lijst met alle x-waardes gemaakt. Daarbij wordt gelijk bepaald wat de hoogste y-waarde is. Vervolgens worden de x en y schaal gedefinieerd, waarna ze worden toegevoegd. Hierna wordt een lijst gemaakt van alle [x,y]-waardes. Er wordt een tip aangemaakt en een linefunction die zorgt dat dat de x- en y-waardes op de juiste schaal worden teruggegeven. Dan wordt de lijn toegevoegd tussen alle punten. Vervolgens worden nog losse cirkels toegevoegd, die op de exacte datapunten worden geplaatst. Op deze punten zal de tooltip verschijnen en als er op wordt geklikt worden de update_pie en update_map functies aangeroepen.
  * update_line: deze functie zorgt ervoor dat een lijn wordt toegevoegd of verwijderd als er op de piechart wordt geklikt. Er wordt eerst gecontroleerd of de specifieke lijn al bestaat. Als hij al bestaat, wordt hij veranderd en anders wordt hij toegevoegd. Het toevoegen werkt grotendeels hetzelfde als de functie create_linechart. Bij het toevoegen van de lijn en cirkels worden een respectievelijk een id/class meegegeven, zodat ze ook weer verwijderd kunnen worden.
* main.js: in dit bestand worden alle functies uit de andere bestanden aangeroepen wanneer de pagina geopend wordt.
* map.js: in dit bestand staan alle functies die alleen voor de map gebruikt worden
  * create_map: deze functie zorgt ervoor dat de kaart van Nederland wordt weergegeven met de bijstandsdichtheid in 2017. Er wordt een tip aangemaakt, de kleuren worden bepaald en de projectie wordt ingesteld. De magic numbers die bij de projection staan, zijn bepaald door te zoeken waar de plattegrond stond en daardoor de juiste positie te vinden. Vervolgens wordt de data gekoppeld aan de data van de plattegrond. Daarna worden de landen toegevoegd, waarbij de tooltip verschijnt wanneer er over een land wordt bewogen met de muis.
  * add_warning: er wordt een waarschuwingsbericht (verborgen) toegevoegd, zodat die kan verschijnen wanneer het nodig is.
  * show_warning: wanneer een jaartal wordt geselecteerd waarvan geen data beschikbaar is voor de map, komt het waarschuwingsbericht in beeld.
  * hide_warning: wanneer vervolgens weer een geschikt jaartal wordt geselecteerd, wordt de waarschuwing verborgen.
  * update_map: deze functie wordt aangeroepen als óf een jaartal wordt geselecteerd (in de linechart of slider) of wanneer met de radio buttons een andere soort map wordt gekozen. Deze functie lijkt in eerste instantie erg omslachtig, omdat de hele map wordt verwijderd en opnieuw toegevoegd (in plaats van alleen de data updaten). Hier is echter een reden voor. De gemeentes in Nederland zijn de afgelopen jaren ieder jaar veranderd, zo zijn er gemeentes samengevoegd, maar ook is er een gemeente opgesplitst en over omliggende gemeentes verdeeld. Daarom wordt in deze functie de informatie opgehaald over het juiste jaar en alles opnieuw toegevoegd. De functie werkt verder grotendeels hetzelfde als de create_map functie.
* pie.js: in dit bestand staan alle functies die alleen voor de pie gebruikt wordt:
  * create_pie: deze functie voegt de piechart toe. Er wordt een tip aangemaakt. Vervolgens wordt een lijst van objecten aangemaakt, waarin de naam van de uitkering staat en het aantal uitkeringen dat daarvan is uitgegeven in een bepaald jaar. De data wordt gekoppeld aan de piechart en de locaties wordt bepaald. Daarna worden de segmenten toegevoegd. Daarbij wordt gelijk de 'onclick' functie toegevoegd, waarbij de linechart wordt geupdate. Aan het einde van de functie, zit een stuk waarbij de legenda die bij deze piechart hoort, ook interactief wordt gemaakt. Daarbij geldt hetzelfde als bij de piechart, namelijk dat als er op een uitkering geklikt wordt, de linechart wordt geudate.
  * update_pie: met deze functie wordt de piechart geupdate. De data wordt aangepast, waarna de bestaande segmenten worden geupdate.
* radio.js: in dit bestand staat de functie die ervoor zorgt dat de radio buttons gekoppeld worden aan het updaten van de map:
  * add_radio: de bestaande radio buttons worden geselecteerd. Vervolgens wordt daar een 'onclick' functie aan toegevoegd, zodat de update_map, change_title en update_legend worden aangeroepen wanneer op een van de buttons wordt geklikt.
* slider.js: in dit bestand staat de functie die de slider aanmaakt:
  * add_slider: de slider wordt toegevoegd met een 'onchange' function die de update_pie en update_map aanroept.


#### Python
* csv2json-linechart.py
* csv2json-map.py

Deze 2 bestanden lijken erg op elkaar, uiteindelijk zouden ze samengevoegd kunnen worden tot 1 bestand met een extra parameter. De functie in dit bestand: create_json, zet het csv bestand om tot een json bestand, met alleen de informatie die uiteindelijk gebruikt wordt in de visualisaties.

#### CSS
In dit bestand wordt de opmaak van de website geregeld.

* styles.css

## Proces
 Ten opzichte van het design document is er een hoop veranderd. Er zijn drie momenten geweest waarop ik een element van het oorspronkelijke design heb aangepast, verwijderd of toegevoegd:
* Tijdens het opzetten van de basis voor de stacked bar chart, realiseerde ik me dat dit misschien niet de handigste manier was om de ontwikkeling en verdeling van de uitkeringen weer te geven. Daarnaast stond de scatterplot heel erg los van de andere visualisaties (letterlijk, omdat hij er niet mee verbonden was via onclick functies, maar ook omdat de inhoud ervan compleet los stond van de rest). Toen ontstond het idee, om in plaats van de stacked bar chart en scatterplot, een linechart en piechart te maken (die met elkaar verbonden zouden zijn). Hierdoor is de ontwikkeling van de sociale zekerheid veel duidelijker te volgen en is de combinatie van deze 3 visualisaties een stuk logischer.
* In eerste instantie was ik van plan om alleen de bijstandsdichtheid weer te geven in de plattegrond. Ik heb later bedacht om ook radio buttons toe te voegen, waarmee de gebruiker kan kiezen om de bijstandsdichtheid weer te geven of de absolute aantallen. In sommige gevallen zal de gebruiker namelijk de absolute gegevens interessanter vinden.
* Als laatste heb ik als functie toegevoegd dat er lijnen aan de linechart kunnen worden toegevoegd via de piechart. Er was namelijk nog niet veel interactie tussen alle visualisaties en ik wilde daar iets extra's aan toevoegen. Op die manier kan ook duidelijk in beeld gebracht worden hoe een specifieke uitkering de afgelopen jaren is toe- of afgenomen.

## Uitdagingen
De grootste uitdaging die ik ben tegengekomen was met de plattegrond van de gemeentes in Nederland. Met het updaten daarvan ging een hoop mis. In eerste instantie had ik niet door dat gemeentes waren veranderd in de 3 jaren waar het om gaat, dus kreeg ik iedere keer een error omdat sommige data niet kon worden toegekend. Toen ik dat door had gekregen, besloot ik om de bestaande plattegrond te updaten, waarbij de gemeentes nieuwe namen en afmetingen mee kregen. Dit deed ik door ze via een class allemaal te selecteren en vervolgens aan te passen. Ook hier ging weer iets mis. De startplattegrond van 2017 had namelijk 388 gemeentes. Die van 2015 en 2016 hebben er meer (393 en 390 gemeentes). Door het op deze manier te doen werden de eerste 388 gemeentes goed aangepast en de laatste 2 of 5 verschenen niet. Daarom heb ik er uiteindelijk voor gekozen om de kaart volledig te verwijderen en opnieuw toe te voegen. Als ik dit opnieuw zou kunnen doen, zou ik dit graag op een nettere manier doen.

## Reflectie
Mijns inziens is het resultaat nu een logisch samenhangende combinatie van drie visualisaties, waar alles in kan worden bekeken. Wat ik graag beter had willen doen, is de layout van de pagina. Ik kan me voorstellen dat er voor gebruikers niet altijd even duidelijk is waar op geklikt moet worden om een bepaalde functie te zien. Vandaar dat er op de website zelf ook een uitleg staat over hoe het allemaal gebruikt kan worden. Ik had graag gezien dat ik het qua layout beter was opgebouwd, waardoor het gelijk voor zich wijst.
