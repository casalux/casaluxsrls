/* ============================================================================
   I TUOI LAVORI  —  Casalux
   ============================================================================

   COME AGGIUNGERE UN LAVORO — MODO VELOCISSIMO (2 passi):

   1) Metti la foto nella cartella:  img/lavori/
      (nome file: minuscolo, con trattini, senza spazi né accenti,
       es. "ristrutturazione-villa.jpg")

   2) Aggiungi qui sotto, dentro la lista, UNA SOLA RIGA con il percorso
      della foto seguita da una virgola. Esempio:

        "img/lavori/ristrutturazione-villa.jpg",

   Fatto! La foto appare subito nella galleria. Titolo, categoria e
   descrizione sono FACOLTATIVI.

   ----------------------------------------------------------------------------
   MODO COMPLETO (facoltativo, se vuoi aggiungere anche titolo e descrizione):

   Copia uno dei blocchi qui sotto (tutto ciò che è tra { e }, virgola inclusa)
   e incollalo nella lista. Poi cambia i 5 campi:
        img    -> il percorso della foto, es:  "img/lavori/nome-foto.jpg"
        cat    -> la categoria. Scegli UNA tra:
                  "ristrutturazioni"  "cappotti"  "tetti"  "interni"  "esterni"
        title  -> il titolo del lavoro, es: "Villa Bifamiliare"
        luogo  -> la città, es: "Roncade (TV)"
        desc   -> una breve descrizione (1 frase)

   Salva il file: il sito mostrerà il nuovo lavoro automaticamente,
   con filtro per categoria e ingrandimento al clic. Niente altro da toccare.

   ⚠️ Attenzione: ogni blocco va separato dal successivo con una virgola.
      Mantieni le virgolette " " attorno ai testi.

   ----------------------------------------------------------------------------
   ESEMPIO da copiare (è già pronto, basta cambiare i testi):

     {
       img:   "img/lavori/nome-foto.jpg",
       cat:   "ristrutturazioni",
       title: "Titolo del lavoro",
       luogo: "Città (Prov)",
       desc:  "Breve descrizione dell'intervento."
     },

   ----------------------------------------------------------------------------
   Qui sotto trovi alcuni ESEMPI con foto provvisorie: sostituiscili man mano
   con i tuoi lavori reali (cambia img, title, luogo, desc).
============================================================================ */

window.LAVORI = [

  {
    img:   "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    cat:   "ristrutturazioni",
    title: "Villa Bifamiliare",
    luogo: "Roncade (TV)",
    desc:  "Ristrutturazione integrale con nuova distribuzione interna."
  },

  {
    img:   "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    cat:   "cappotti",
    title: "Cappotto Termico",
    luogo: "Quarto d'Altino (VE)",
    desc:  "Isolamento esterno con due classi energetiche in più."
  },

  {
    img:   "https://images.unsplash.com/photo-1632154513343-43f9b0e8b9c4?auto=format&fit=crop&w=1200&q=80",
    cat:   "tetti",
    title: "Nuova Copertura",
    luogo: "Casale sul Sile (TV)",
    desc:  "Struttura in legno lamellare con manto coibentato."
  },

  {
    img:   "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    cat:   "interni",
    title: "Open Space",
    luogo: "Treviso (TV)",
    desc:  "Demolizione tramezzi e ridisegno di un living luminoso."
  },

  {
    img:   "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
    cat:   "esterni",
    title: "Facciata e Giardino",
    luogo: "San Donà di Piave (VE)",
    desc:  "Rifacimento facciata, pavimentazioni esterne e area verde."
  },

  {
    img:   "https://images.unsplash.com/photo-1556909211-36987daf7b4d?auto=format&fit=crop&w=1200&q=80",
    cat:   "ristrutturazioni",
    title: "Appartamento di Pregio",
    luogo: "Mogliano Veneto (TV)",
    desc:  "Finiture di alto livello e impianti completamente rinnovati."
  }

];
