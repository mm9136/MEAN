# Spletno programiranje 2020/2021

Dokumentacija lastnega projekta pri predmetu **Spletno programiranje** v študijskem letu **2020/2021**.

## Spletna trgovina

Zaradi velike gneče v trgovinah in trenutne situacije z korona virusom, Hilda želi odpreti spletno trgovino. Mi smo ji naredili spletno trgovino "MEST movies". V naši spletni trgovini, kupci lahko vidijo vse filme razdeljene po žanru. Kupci za vse filme lahko preberejo njihove opise. Med tem, ko postaja nakup filmov prek spleta vse lažji, je Hilda prepričana, da se bodo DVD-ji dobro prodajali, zato bo njena spletna trgovina specializirana prav za to vrsto artiklov. 

### 1. NEPRIJAVLJENI UPORABNIK: 

Ko uporabnik NI prijavljen se lahko z klikom na logo  vrne na začetno stran ali z klikom na MEST movies.

Na začetni strani (MEST movies) uporabnik lahko :
   - s pomočjo "Search-a" lahko poisče film, ki ga zanima
   - s pomočjo gumba "Follow @mest2834 on instagram", zasledi naš Instagram profil
   - s pomočjo gumba "Like", dodeli like na  naši Facebook strani  
   - s pomočjo gumba "Share", deli našo Facebook stran 
   - s pomočjo gumba "Follow", zasledi naš Twitter profil
   - če kliknemo gumb "Search" nas aplikacija prevsmeri na stran Movies, kjer prikaže ustrezne filme
  
S klikom na "Movies" se premakne na pregled filmov.
##### Pri Movies lahko:
   - pregleda vse filme 
   - z klikom na film se odpre okno, ki prikaže opis filma
            
S klikom na "Genre" se premakne na pregled žanrov.
##### Pri Genre lahko:
   - pregleda vse žanre
   - s klikom na žanr, se odpre okno, ki prikaže vse filme tega žanra
    
S klikom na "DVD" se premakne na pregled DVD-jev.
##### Pri DVD lahko:
   - pregleda vse filme, ki so na voljo kot DVD in njihove cene
   - s klikom na ime filma, se odpre okno, ki prikaže opis tega filma
   - s klikom na gumb "Add to cart" uporabnik prevsmerimo na stran za prijavo

S klikom na "Log in" se premakne na stran za prijavo.
##### Pri Log in:
   - v polje "E-mail" vnese e-mail 
   - v polje "Password" vnese geslo 
   - s klikom na "Login" aplikacija nas prevsmeri na začetno stran kot prijavljen uporabnik, vendar samo če smo ispolnili vsa polja ter so pravilno ispolnjeni in če smo že enkrat registrirali
   - s klikom na "Forgot password?" aplikacija nas prevsmeri na Forgot password stran 
   - s klikom na "Register now!" aplikacija nas prevsmeri na stran za registracijo 

##### Pri Forgot password:   
   - v polje "E-mail" vnese e-mail
   - ko klikne na gumb "Send me an e-mail" se pošilja e-mail uporabniku za preverjanje identite, kjer dobi link, in z klikom na link se prevsmeri 
na "Change password" stran
   - po kliku na gumb "Send me an e-mail" se prikaže ustrezno obvestilo, da je poslan e-mail
   - ko klikne na gumb "Send again", se še enkrat pošilja e-mail

##### Pri Registraciji:
   - v polje "Enter your Name" vnese ime
   - v polje "Enter your  Lastname" vnese priimek
   - v polje "Enter your  E-mail" vnese e-mail
   - v polje "Password" vnese geslo
   - v polje "Confirm your Password" ponovi geslo
   - s klikom na "Register", se pošilja e-mail uporabniku za preverjanje identite, kjer dobi link, in z klikom na ta link se prevsmeri na začetno strano, ampak samo če smo ispolnili vsa polja ter jih pravilno ispolnili 
   - po kliku na gumb "Register" se prikaže ustrezno obvestilo, da je poslan e-mail
   - z klikom na Log in, ga preusmeri na stran za prijavo
Opomba:
- Polje "E-mail" ne sme biti prazno. Vsebuje pravila navadnega e-maila. Mora ima par črk in števk, sledi "@" in na nato "."
   - Polje "Password" ne sme biti prazno. Geslo mora vsebovati vsaj ena mala črka, vsaj ena velika črka, vsaj ena števka. Treba biti dolgo od 8 do 20 znakov. Specialni znaki niso dovoljeni.
   - Vsebina polja "Repeat password" mora biti enaka kot "Password"
   - Nobeno polje ne sme biti prazno

S klik na "košarico" aplikacija nas prevsmeri na stran za prijavo

### 2.PRIJAVLJENI UPORABNIK 
Ko je uporabnik prijavljen s klikom na logo se vrne na začetno stran ali z klikom na MEST movies.


Razlika med NEPRIJAVLJENEM ter PRIJAVLJENEM uporabnikom, je ta da, PRIJAVLJENI uporabnik z klikom na svoj username, dobi padajoči meni, kjer se nahaja ponudba za izbiro še 3 funkcionalnosti in to so:  "History" , "Change password"  in "Sign out". Tudi na strani "DVD", s klikom na gumb "Add to cart" dodamo željeni DVD v košarico in ostanemo na strani "DVD".
##### History:
   - s klikom na ta gumb, se odpre stran kjer uporabnik lahko pregleda prejšnje nakupe
##### Change password:
   - v polje "Current password" vnesemo trenutno geslo
   - v polje "Repeat password" ponovimo trenutno geslo
   - v polje "Enter new Password" vnesemo novo geslo
   - s klikom na "Save changes" aplikacija prikaže ustrezno obvestilo, da je geslo spremenjeno
Pomembno:Current password in Repeat password morata biti enaka, in novo geslo da je po pravilih.
        
##### Sign out:
   - s klikom na ta gumb, se uporabnik odjavi in se vrne na začetno stran kot NEPRIJAVLJENI  uporabnik.

S klikom na "Košarica" se premakne na stran za košarico
##### Pri Košarici lahko:

   - pregleda vse DVDje ki jih je oznacil za naročilo
   - pregleda cene vseh filmov oz. DVD-jev, ki jih je oznacil za naročit
   - s klikom na "+" ali "-" poveča oziroma zmanjša količino DVD naročila in s tem se cena spremeni
   - s klikom na "Continue" aplikacija prevsmeri na stran za plačilo 
   - s klikom na ikono "Trash" odstrani film, ki ga je prej izbral 

##### Pri strani za plačilo lahko:
   - v praznem polju ispolnimo podatke o kartici
   - s klikom na "Authorise payment" se prikaže stran za uspešnost transakcije
   - s klikom na "Back to Cart" vrne uporabnik nazaj na stran Košarica       
 
##### Pri stani za uspešnost transakcije:
   - se ispiše "PURCHASE SUCCESSFUL!" če je transakcija uspešna ter s klikom na gumb "Continue" prevsmerimo uporabnik na prejšno stran
   - s klikom na gumb "Payment Confirmation" aplikacija prevsmeri na elektronski račun
   - se izpiše "PURCHASE IS UNSUCCESSFUL!", če je transakcija neuspešna 
   - s klikom na "Back to Payment" vrne uporabnika nazaj na stran za plačilo 

##### Pri "Payment Confirmation" :
   - imamo vse podatke našega plačila in naročila
Opomba za Plačilo: 
   - V polje "Card Number" uporabnik mora vnesti validno številko kreditne kartice  in za Datum veljavnosti kartice:
   - Uporabnik v polje "Month" izbere en od 12 mesecov
   - Uporabnik v polje "Year" izbere eno leto od 2020 do 2029
   - V polje "CCV security code" uporabnik mora vnesti tri ali štiri številke
   - Nobeno polje ne sme biti prazno

### 3. Admin
Ko je uporabnik prijavljen kot ADMIN se s klikom na logo ali s klikom na MEST movies vrne na začetno stran.
S klikom na "Movies" se premakne na pregled filmov.
##### Pri Movies lahko:
   - pregleda vse filme in njihove opise
   - s klikom na film, se odpre okno, ki prikaže opis tega filma 
   - s klikom na gumb "Add movies" se odpre dodatno okno, kjer admin lahko doda nov film in izpolni polja kot so: id filma, naslov film, opis filma ter izbere žanr filma.
   - s klikom na gumb "Save changes" shrani spremembe in ostane na tem oknu dokler ne naredi klik na gumb "Close"
Funkionalnosti na začetni strani "MEST movies", "Genre" in "DVD"  so enake kot pri navadnem prijavljenem uporabniku.
Razlika med ADMINOM in PRIJAVLJENIM uporabnikom je samo to, da na vsaki strani, namesto username uporabnika, piše "Admin" ter ob kliku na "Admin", se odpre padajoči meni, kamor se nahajata še dve funkiconalnosti, ki jih ima samo admin. In to so: "Graph" , "Manage movies" in  "Sign out".
##### Graph:
   - statistični pregled najbolj prodajanih DVD-jev
##### Manage DVDs:
   - v polje "DVD title" vnesemo naslov DVDja.
   - v polje "Description" vnesemo opis DVDja.
   - v polje "Quantity" vnesemo količino tovrstnih DVDjev na zalogi, v polje cena pa ceno tega DVDja.
   - ob kliku na gumb "Add movie to DVD" se pojavni okno z naslednjimi vnosnimi polji:
        - v polje "IMDB ID" vnesemo IMDB ID filma. Ob kliku na gumb "Auto-complete" se lahko zdaj avtomatsko izpolnijo ostala polja (podatki so pridobljeni preko API-ja).
        - v polje title "Title" vnesemo naslov filma.
        - v polje "Year" vnesemo leto izida filma.
        - v polju "Genre" izberemo ustrezen žanr.
        - v polju "Description" opišemo film.
        - film lahko ob kliku na ustrezen gumb dodamo (pod pogojem, da ga na DVDju še ni) ali odstranimo (če na DVDju že je).
        - okno zapremo s klikom na "Close".
   - ob kliku na "Modify", se za izbrani DVD spremenijo atributi kot so: "Description"(posodobimo opis DVDja), "Quantity" (spremenimo zalogo DVDjev), "Price"(spremenimo ceno). Lahko spremenimo tudi, kateri filmi so na DVDju.
   - ob kliku na "Remove", se izbrani DVD izbriše.
   - ko vnesemo vse atribute, se ob kliku na "Add" ta film doda v prodajo na strani "DVD" 
   - na koncu, ko dodamo, izbrišemo ali spremenimo izbrani film, dobimo ustrezna sporočila kot so: "Error! while modifying item.", "Successfully removed item.", "Successfully added item.", "Successfully modified item.".
        
##### Sign out:
   - s klikom na ta gumb, uporabnik se odjavi in vrne na začetno stran kot NEPRIJAVJENI uporabnik.

##  Integracija z zunanjim virom

Aplikacija dostopa do API-ja (omdbapi) za pridobivanje podatkov o filmih iz IMDB. Podatke lahko pridobi preko IMDB ID ključa ali z naslovom in letom filma, pod pogojem da je kombinacija teh unikatna, na straneh "manageDVDs" in "movies".

##### Pridobljeni podatki:

Podatki, ki se shranijo:

 - IMDB ID filma
 - naslov filma
 - leto izida filma
 - žanr filma
 - opis filma

Začasni podatki:
 - ocena filma

##### Uporaba:

Podatki

 - naslov,
 - leto izida,
 - žanr,
 - opis,
 - in cena

se uporabijo na straneh

 - "dvd",
 - "genre"
 - in "movies"

kot seznam z razširljivimi elementi, ki ob kliku ponudijo več informacij.
    
##  Preverjanje izgleda

Izgled aplikacija smo preverili v treh brskalnikih : Chrome, Microsoft Edge in Mozilla Firefox. Izgled je prilagojen ekranu v vseh treh brskalnikih in v treh napravah.
        
##### Povezave do vseh html dokumentov :
- changePassword.html (Sprememba gesla)
- dvd.html(Pregled DVD-jev, ki so na voljo za neprijavljeni uporabnik)
- dvdAdminLoggedin.html(Pregled DVD-jev, ki so na voljo za admin)
- dvdUserLoggedin.html(Pregled DVD-jev, ki so na voljo za prijavljeni uporabnik)
- forgotPassword.html(Pozabljeno geslo)
- genre.html(Pregled žanrov za neprijavljeni uporabnik)
- genreAdminLoggedin.html(Pregled žanrov za admin)
- genreUserLoggedin.html(Pregled žanrov za prijavljeni uporabniki)
- graph.html(Statistični prikaz najprodajanijih DVD-jev)
- history.html(Zgodovina naročil)
- login.html(Prijava uporabnika ter admina)
- manageDVDs.html(Dodajanje, brisanje ter spreminjanje DVD-jev)
- MESTmovies.html(Začetna stran neprijavljenega uporabnika)
- MESTmoviesAdminLoggedin.html(Začetna stran admina)
- MESTmoviesUserLoggedin.html(Začetna stran prijavljenega uporabnika)
- movies.html(Pregled filmov za neprijavljeni uporabnik)
- moviesAdminLoggedin.html(Pregled filmov za admin)
- moviesUserLoggedin.html(Pregled filmov za prijavljeni uporabnik)
- payment.html (Vnos podatkov s kartice)
- register.html(Registracija uporabnika)
- shopingCart.html (Pregled košarice)
- successfullTransaction.html (Prikaz uspešne transakcije)
- unsuccessfullTransaction.html (Prikaz neuspešne transakcije)

##### Naprave na katere deluje naša aplikacija 
   - tablet 
   - telefon
   - laptop

