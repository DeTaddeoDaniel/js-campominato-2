/*
    Il computer deve generare 16 numeri casuali tra 1 e 100.
    In seguito deve chiedere all’utente di inserire un numero alla
    volta, sempre compreso tra 1 e 100.


    Se il numero è presente nella lista dei numeri generati, la partita
    termina, altrimenti si continua chiedendo all’utente un altro
    numero.

    La partita termina quando il giocatore inserisce un numero
    “vietato” o raggiunge il numero massimo possibile di numeri
    consentiti.

    Al termine della partita il software deve comunicare il punteggio,
    cioè il numero di volte che l’utente ha inserito un numero
    consentito.

    BONUS: all’inizio il software richiede anche una difficoltà
    all’utente che cambia il range di numeri casuali.
    Con difficoltà 0=> tra 1 e 100, con difficoltà 1 => tra 1 e 80, con
    difficoltà 2=> tra 1 e 50
*/

// frament appoggio
const fragment = document.createDocumentFragment()

// template vari
var templateStarted = document.getElementById('template-started').content
var templateInputLevel =document.getElementById('template-select-level').content 
var templateGame =document.getElementById('template-game').content
var templateCard =document.getElementById('template-card').content
var templateEndGame = document.getElementById('template-endGame').content

// element html
var wrap = document.getElementById('wrap')
var gameStart = document.getElementById('playGame')
let punteggio = 0

// genera numeri casuali con min e max complessi
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//  restituisce numero celle gioco
function numberMax( difficolta){

    var numeroMax = 0;
    console.log(typeof(difficolta))

    switch (difficolta){

        case 1:
            numeroMax = 100;
            break;
        case 2:
            numeroMax = 80;
            break;
        case 3:
            numeroMax = 50;
            console.log("Numero case 3");
            break;
        default:
            console.log('error number max')
    }

    console.log("Numero max :" + numeroMax);

    return numeroMax;

}

// genera numeri in cui ci sono le mine
function getAddMine( livello){

    // console.log(" scelta numero mine in base alla difficlta");

    var array = []
    var numeroMine = 16;
    var numeroMin = 0;
    var numeroMax = numberMax(livello);

    for (let i = 0; i < numeroMine; i++) {

        numero = getRndInteger(numeroMin,numeroMax);

        if(!array.includes(numero)){
            array.push(numero);       
        } else {
            i--
        }
    }
    
    // console.log(array);
    return array.sort((a,b) => a - b)
}

// attivare bottone se è stato scelto livello
function buttonActive() {

    var selectValue = document.getElementById('level')

    selectValue.addEventListener('click', function(e){

        var elementoPrecedente = selectValue.querySelector('.active')
        elementoPrecedente.classList.remove('active')

        var elemento = e.target
        elemento.classList.add('active')
    });
}

// pagina inizio
function createFirstPage(){

    // aggiungi titolo
    var clone = templateStarted.cloneNode(true);
    fragment.appendChild(clone)

    // aggiungi messaggio selezione input
    clone = templateInputLevel.cloneNode(true);
    fragment.appendChild(clone)

    // Inserisci del html
    wrap.appendChild(fragment)

    // cambiamenti active scelta livello
    buttonActive()

    // aggiungi evento per seconda pagina
    var gameStart = document.getElementById('playGame')
    gameStart.addEventListener('click', function(){
        var level = document.getElementById('level').querySelector('.active').getAttribute('value')
        createSecondPage(level)
    });

}

// creazione seconda pagina
function createSecondPage(level){

    level = parseInt(level)
    
    // togli codice per inserimento livello
    document.getElementById('wrap').children[1].remove()

    // aggiungi template game
    var clone = templateGame.cloneNode(true);
    fragment.appendChild(clone)
    wrap.appendChild(fragment)

    // aggiungi azione ricarica seconda pagina
    document.getElementById('btnReset').addEventListener('click', function(){
        createSecondPage(level)
        console.log('reload con level: ' + level)
    })

    // variabile posizione inserimento cards
    var cards = document.getElementById('cards')
    var spazi = numberMax(level)

    // generazione mine
    var arrayMine = getAddMine(level)
    console.log(arrayMine)
    
    // check mine
    document.getElementById('arrayMine').textContent ='mine: ' + arrayMine.toString()
    console.log(document.getElementById('arrayMine').textContent)

    // creazione e inserimento delle card
    for(var i=0 ; i< spazi ; i++){

        clone = templateCard.cloneNode(true)

        // aggiungi numero spazio
        clone.querySelector('.cardGame').setAttribute('number', i)

        // aggiungi classe se mina il numero spazio
        if(arrayMine.includes(i)){
            clone.querySelector('.cardGame').classList.add('mine')
        }
        
        fragment.appendChild(clone)
    }

    cards.appendChild(fragment)

    //aggiungi evento restituisce id card clicato
    $('.cardGame').click(function (e) { 
        numeroPremuto = e.target.getAttribute('number');
        clickCella(numeroPremuto,e)
        e.stopPropagation()
    });

}

// funzione di mina premuta
function endGame(messaggio) {

    // mina, 
    
    var spazi = cards.querySelectorAll('.cardGame.mine')
    
    spazi.forEach(function(spazio) {
        spazio.classList.add('bg-danger')
        spazio.classList.remove('bg-success')
    });

    var clone = templateEndGame.cloneNode(true)
    fragment.appendChild(clone)
    wrap.appendChild(fragment)

    $("#staticBackdrop").modal('show');
    
    console.log(wrap.querySelector('#staticBackdrop'))
}

function isSpazioDisponibile(){
    var pieno = true
    var cards = document.getElementsByClassName('cardGame');

    for( var i=0; i < cards.length && pieno ; i++){

        if( (cards[i].classList.contains('mine') || cards[i].classList.contains('pressed')) ){
            pieno = true
            console.log('pieno: ' + i+pieno)
        } else{
            pieno = false
        }
    }

    console.log('pieno: '+pieno)
    return pieno
}

// evento alclick dell'elemento selezionato
function clickCella(numeroId, e) {
    
    var element = e.target
    var punteggioHTML = document.getElementById('punteggioPartita')

    if(!element.classList.contains('pressed')){

        element.classList.remove('bg-success')

        

        if(element.classList.contains('mine')){
            element.classList.add('bg-danger')
            console.log('end game')
            endGame('Hai preso una mina')
        } else{
            element.classList.add('bg-info')
            element.classList.add('pressed')
            console.log('continue game')
            
            if(isSpazioDisponibile()){
                console.log('test spazio entry')
                endGame('Hai vinto')
            }
            
            punteggioHTML.innerText  = 'punteggio: ' + (++punteggio)
        }
    }

}


// Pronto la pagina esegue l'operazione
$(document).ready(function() {createFirstPage()});