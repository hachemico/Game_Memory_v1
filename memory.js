/// MEMORY GAME ////

var win = false;
var numTwins=0;                     // variable que controla el numero de parejas.
var ctrl_clicks=0;   
var ctrl_start=false;               // variable que controla clicks jugables.
var total_twins=0;                  // variable que controla numero parejas total. 
var numPlays=0;                     // variable que controla numero jugadas.
var level =0;                       // variable que guarda valor level en tiempo de ejecución.
var firstGame = true;               // variable que chabilita la primera jugada.
var timer = 0;                      // variable que controla tiempo que mostramos las cartas
var sec=0;                          // variable que controla segundos jugados.
var min=0;                          // variable que controla minutos jugados. 
var valueTime=0;                    // variable que guarda el total en segundos jugados para calcular la puntuacion.
var points=0;                       // variable que guarda la puntuación.
var maxScore=0;                     // variable que controla los minutos jugados.
localStorage.removeItem("card1");   // borramos localStorage.
localStorage.removeItem("card2");
localStorage.removeItem("sizeGame");
localStorage.removeItem("level");

gameMain();

function gameSecondary(elemento){
      
//////////// VARIABLES TIMER ////////////////////
    
    const circle = document.getElementById('circle2');
    const button = document.getElementById('button');
        // const reset = document.getElementById('reset')
    const length = circle.getTotalLength();
    const minute = document.getElementById('minute');
    const second = document.getElementById('second');
        
    circle.style.strokeDasharray = length;
    circle.style.strokeDashoffset = length;
        
    let count = 0;
    let timer;

//////////// TIMER ////////////////////77



function startTimer(){      //Configura el timmer.
        this.timer = setInterval(function(){
        count++;
        minute.textContent = (Math.floor(count / 60) < 10 ? '0' : '') + Math.floor(count / 60) ;
        second.textContent = (count % 60 < 10 ? '0' : '') + count % 60 ;
        circle.style.strokeDashoffset = length - (count / 60) * length;
      },1000)
    }
      
    function stopTimer(){   //Para el timmer.
        let ctrl_modal = JSON.parse(localStorage.getItem("ctrl_modal"));
        if(ctrl_modal == true){
          
            clearInterval(this.timer);
        }else{
        
            this.min =minute.textContent;       //guarda valor minutos del timmer.
            this.sec = second.textContent;      //guarda valor segundos del timmer.
            if(min == 0){
                valueTime =  this.sec;
                getScores(valueTime);           //llamada función calcular puntuacion.
    
            }else if (min == 1){
                valueTime = (60 + parseInt(this.sec));
                getScores(valueTime);           //llamada función calcular puntuacion.
    
            }else if (min == 2){
                valueTime = (120 + parseInt(this.sec));
                getScores(valueTime);           //llamada función calcular puntuacion.
    
            }else{
                valueTime = 3333;
                getScores(valueTime);           //llamada función calcular puntuacion.
            }
    
            clearInterval(this.timer);
        }
      }
      
      function getScores(valueTime){ // Asignacion puntuacion partida.

        let size = localStorage.getItem("sizeGame");
        let level = localStorage.getItem("level");

        if(level){      //puntua el nivel del juego.
            if(level === "easy"){
                this.points = this.points + 200;
            }else if(level === "medium"){
                this.points = this.points + 400;
            }else if(level === "medium"){
                this.points = this.points + 600;
            }
            console.log("Valor points Level>> "+ this.points);
        }
        if(size){   //puntia el tamaño del juego.
            if(size == 16){
                this.points = this.points + 1000;
            }else if(size == 20){
                this.points = this.points + 2000;
            }else if(size == 30){
                this.points = this.points + 3000;
            }
        }

        this.points=this.points +(5000 - valueTime); // puntua el tiempo empleado.
        let maxScore= localStorage.getItem("maxScore");
       
        if(maxScore < this.points){ //compara el valor máximo obtenido con el valor actual.
            document.getElementById("message").innerHTML= "<h1> NUEVO RECORD: "+this.points +" PUNTOS!</h1>";
            localStorage.setItem("maxScore",this.points); //guardamos la puntuación como Record.
            localStorage.setItem("lastScore",this.points); //guardamos la puntuación partida.
            scoreMarker();
            window.scroll(0, 0); // page scroll up show marcadores
        }else{
            document.getElementById("message").innerHTML= "<h1> HAS OBTENIDO "+this.points +" PUNTOS!</h1>";
            localStorage.setItem("lastScore",this.points); //guardamos la puntuación partida.
            scoreMarker();
            window.scroll(0, 0); // page scroll up show marcadores
        }
       
      } //end fucntion_puntuacion.
  

    function resetTimer(){
      stopTimer();
      this.numPlays = 0;                        //Reiniciamos numero rondas.
      document.getElementById("valueRounds").innerHTML=" 0 rondas";
      this.firstGame=true;                      // habilitamos primera jugada.
      console.log("Entra reset timer");
      count = 0;
      minute.textContent = '00';
      second.textContent = '00'
      circle.style.strokeDashoffset = length;
      isPlaying = false;
    }


    function send_score() { //enviar datos al servidor.
        var token = localStorage.getItem("token");
        let score= localStorage.getItem("lastScore");
        if (token) {
            var http = new XMLHttpRequest();
            var url = 'http://0.0.0.0:4000/api/rank/update';
            var params = JSON.stringify({
                nameGame: "memory_gamev1_hmico",
                score: score
            });
            http.open('POST', url, true);
    
            //Send the proper header information along with the request
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.setRequestHeader('Authorization', 'Token ' + token);
    
            http.onreadystatechange = function() { //Call a function when the state changes.
                if (http.readyState == 4 && http.status == 200) {
                    console.log(http.responseText);
                }
            }
            http.send(params);
        }
    }

    //CUERPO GAME SECONDARY

    let ctrl_modal = JSON.parse(localStorage.getItem("ctrl_modal"));

    if(ctrl_modal == true){                 // ctrl_modal es true, si venimos de la config del juego.
        resetTimer();
        localStorage.setItem("ctrl_modal",false);
    }else{                                  

        if(firstGame == true){ //cuando la primera jugada está habilitada.
            startTimer();
            firstGame=false;
        }
        let idCard=0;
        idCard= elemento.id;
        this.ctrl_clicks++;
        
        if(ctrl_clicks<=2 || ctrl_start==false){        //ctrl_start controla que no se realize más de 2 clicks 
                                                        // seguidos mientras se realiza la animación.
            if(ctrl_clicks == 1){
                localStorage.setItem("card1",idCard);   //guarda la primera carta pulsada.
                turnCard(idCard,true);                  //giramos 1a carta. 
                this.numCards++;
        
            }else if(ctrl_clicks == 2){
            
                this.numCards++;
                turnCard(idCard,true);                  //giramos 2a carta.
                let card1 = localStorage.getItem("card1");
                localStorage.setItem("card2",idCard);

                let cad1=card1.split('-');
                let name1 = document.getElementById("front-"+cad1[1]+"").name;

                let card2 = localStorage.getItem("card2");
                let cad2=elemento.id.split('-');
                let name2 = document.getElementById("front-"+cad2[1]+"").name;
            
                if(name1 === name2){    //comparamos el atributo nombre de las dos cartas.
                    //COINCIDEN
                    this.numTwins++;
                    this.numCards=1;
                    localStorage.removeItem("card1");
                    localStorage.removeItem("card2");
                    this.ctrl_clicks=0;     //reinicia contador clicks.

                    let win = checkWiner(); //comprovamos si es jugada ganadora.
                    if(win){
                        this.win = true;
                        stopTimer();
                        send_score();
                    }

                }else{
                    //NO COINCIDEN, CONTINUA JUEGO
                    this.numCards=1;
                    this.numPlays++;
                    showByLevel();      //se configura el tiempo en que mostramos las cartas dependiendo del nivel.
                    document.getElementById("valueRounds").innerHTML=`${this.numPlays} `;
                }     
            }//end_if_else_CtrlClicks_Secondary
            
        }else{
            console.log("Jugada Sin efecto.");
        }//end_if_ctrl_Clicks_Main
    }//end_if_ctrl_modal
}//end_secondaryGameFunction

function showByLevel(){ // controla el tiempo disponible antes de que se vuelvan a girar las cartas, dependiendo del nivel.
    let level = localStorage.getItem("level");
    if(level === "easy"){
        setTimeout(function() {
            turnCard('',false);
            this.ctrl_clicks=0;
         }, 1000);
    }else if(level === "medium"){
        setTimeout(function() {
            turnCard('',false);
            this.ctrl_clicks=0;
         }, 500);
    }else if(level === "hard"){
        setTimeout(function() {
            turnCard('',false);
            this.ctrl_clicks=0;
         }, 300);
    }

}
function scoreMarker(){         //Realiza todos los shows de marcadores en la aplicacion.
   let maxScore=localStorage.getItem("maxScore");
   let lastScore=localStorage.getItem("lastScore");

   document.getElementById("titleScore").innerHTML=`MARCADORES `;
   document.getElementById("titleMaxScore").innerHTML = "RECORD:";
   document.getElementById("titleLastScore").innerHTML=`LAST SCORE:`;
   document.getElementById("titleRounds").innerHTML=`RONDAS: `;
            
   if(maxScore){
    document.getElementById("valueMaxScore").innerHTML=`${maxScore} puntos`;
   }else{
    document.getElementById("valueMaxScore").innerHTML=`0 puntos`;
   }

   if(lastScore){
    document.getElementById("valueLastScore").innerHTML=`${lastScore} puntos`;
   }else{
    document.getElementById("valueLastScore").innerHTML=`0 puntos`;
   }
   if(this.numPlays == 0){
    document.getElementById("valueRounds").innerHTML=" 0 rondas";
   }else{
    document.getElementById("valueRounds").innerHTML=`${this.numPlays} `;
   }
 


}
function sleep(milliseconds) {  //temporizador.
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function level(){ //retorna valor nivel.
    return timmer = localStorage.getItem("level");
}

function checkWiner(){  // comprueba si el numero de parejas encontradas coincide con el numero de parejas total.
    let response=false;
    let total=localStorage.getItem("sizeGame");
    (total/2) === this.numTwins ?  response=true : response=false;
    return response;
}

function turnCard(idCard = 0,state){    //GIRAR CARTA. State=true, mostrar. // State=false, ocultar.
    if(state === true){
        let cad1=idCard.split('-');
        document.getElementById(idCard).classList.add("oculto");
        document.getElementById("front-"+cad1[1]+"").classList.remove("oculto");
    }else{

        let card1 = localStorage.getItem("card1");
        let card2 = localStorage.getItem("card2");
       
        let cad1=card1.split('-');
        let cad2=card2.split('-');
     
        document.getElementById("front-"+cad1[1]+"").classList.add("oculto");
        document.getElementById("front-"+cad2[1]+"").classList.add("oculto");
        document.getElementById("back-"+cad1[1]+"").classList.remove("oculto");
        document.getElementById("back-"+cad2[1]+"").classList.remove("oculto");

    }
    
}

function gameMain(){
    //Mensaje Bienvenida aplicación.
    document.getElementById("message").innerHTML="Bienvenido a MEMORY GAME:<br><br> > Busque las parejas lo más rápido posible. <br> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp> El tiempo comenzará con el giro de la primera carta. <br> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp> En la parte inferior dispone un menú para configurar el juego. <br><br> ¡ MUCHA SUERTE !";
    scoreMarker();      //Cargamos los marcadores.

    function generate_game_panel(size = 1){ //cuando seleccionamos el size del panel de juego.

    var positions = new Array();
    var images = new Array();

        switch(size){       //dependiendo del size.

            case 16:
                localStorage.setItem("sizeGame",16);
                localStorage.setItem("ctrl_modal",true);
                positions = generate_positions(16);         
                images =prepare_images(16);
                generate_cards(positions,images,16);
            break;


            case 20:
                localStorage.setItem("sizeGame",20);
                localStorage.setItem("ctrl_modal",true);
                positions = generate_positions(20);
                images = prepare_images(20);
                generate_cards(positions,images,20);
            break;

            case 24:
                localStorage.setItem("sizeGame",24);
                localStorage.setItem("ctrl_modal",true);
                positions = generate_positions(24);
                images = prepare_images(24);
                generate_cards(positions,images,24);
            break;

            case 30:
                localStorage.setItem("sizeGame",30);
                localStorage.setItem("ctrl_modal",true);
                positions = generate_positions(30);
                images = prepare_images(30);
                generate_cards(positions,images,30);
            break;
                
            default:
                alert('Ninguna opcion seleccionada');
        }
    }
    function generate_cards(positions,images,num){  //A partir del Array aleatorio de posiciones, y el array de nombres, genera las cards. 
                                                    // Cada div contiene 2 imagenes, una corresponde a la carta, y otra al envés de la carta.
                                                    // Se guarda una class="img16", class="img20", class="img24", class="img30" para poder variar el tamaño del panel en css.
                                                    // Se añade a cada imagen, si es front o back, para gestionar el giro de las cartas, ya que se giran siempre 2 imagenes por carta.
        let show = "";
        let aux_counter=0;
        let aux_array = new Array();
        let aux_array2 = new Array();

        images.map(function(x){
            aux_array.push({id:positions[aux_counter],img:'<div class="img'+num+'"><img src="assets/'+ x +'.png"  name="'+x+'" id="front-'+positions[aux_counter]+'" class="oculto"><img src="assets/back.png" id="back-'+positions[aux_counter]+'" class="img_back" name="'+x+'" onclick="gameSecondary(this)"></div>'});
            aux_counter=aux_counter+1; 
        });

        aux_array =  aux_array.sort(function(a, b) {
            return a.id-b.id; 
        });
    
        aux_array.map(function(x){
                show=show+x.img;
        });

        document.getElementById("buttons").innerHTML=""+show+"";
        return 1;
    }

    function generate_positions(size){    //A partir de un array de posiciones, 
                                          //ordena los valores de forma aleatoria dentro del array.
        var posiciones1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        var posiciones2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        var posiciones3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        var posiciones4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

        if(size === 16){
            tmpArray=posiciones1;
        }else if(size === 20){
            tmpArray=posiciones2;
        }else if(size === 24){
            tmpArray=posiciones3;
        }else if(size === 30){
            tmpArray=posiciones4;
        }

        fisherYatesShuffle(tmpArray);
    
        return tmpArray;

    }

    function prepare_images(size){      //prepara un array con 2 valores por cada posición de Cards. Obteniendo tantas parejas como requiere size.

        var cards16 = ["angular","css","html","javascript","mysql","node","php","react"];
        var cards20 = ["angular","css","html","javascript","mysql","node","php","react","docker","ionic"];
        var cards24 = ["angular","css","html","javascript","mysql","node","php","react","docker","ionic","laravel","go"];
        var cards30 = ["angular","css","html","javascript","mysql","node","php","react","docker","ionic","laravel","go","java","symfony","python"];
        var array_images= new Array();

        if(size === 16){
            cards = cards16;
        }else if(size === 20){
            cards = cards20;
        }else if(size === 24){
            cards = cards24;
        }else if(size === 30){
            cards = cards30;
        }
    
        cards.map(function(x){
                for(let i=0;i<2;i++){
                    array_images.push(x);
                }
        });
        console.log(array_images);
        return array_images;
    }

    // Algoritmo FISHER YATES SHUFFLE, aleatoriza la posición de los elementos de un Array.

    function fisherYatesShuffle(arr){
        for(var i =arr.length-1 ; i>0 ;i--){
            var j = Math.floor( Math.random() * (i + 1) ); //random index
            [arr[i],arr[j]]=[arr[j],arr[i]]; // swap
        }
    }

    //BOTONES NIVEL JUEGO
    const elementEasy = document.querySelector("#easy"); //detecta restart y recarga la pagina.
    elementEasy.addEventListener("click", () => {
        localStorage.setItem("level","easy");
        document.getElementById("msg_level").innerHTML=" Nivel>> Fácil";
    });

    const elementMedium = document.querySelector("#medium"); //detecta restart y recarga la pagina.
    elementMedium.addEventListener("click", () => {
        localStorage.setItem("level","medium");
        document.getElementById("msg_level").innerHTML=" Nivel>> Médio";     
    });

    const elementHard = document.querySelector("#hard"); //detecta restart y recarga la pagina.
    elementHard.addEventListener("click", () => {
        localStorage.setItem("level","hard");
        document.getElementById("msg_level").innerHTML=" Nivel>> Dificil";
    });


    ///BOTONES TAMAÑO JUEGO.

    const elementSize1 = document.querySelector("#size1"); //detecta restart y recarga la pagina.
    elementSize1.addEventListener("click", () => {
        document.getElementById("msg_size").innerHTML=" &nbsp Tamaño> 4x4";
        generate_game_panel(16);
    });

    const elementSize2 = document.querySelector("#size2"); //detecta restart y recarga la pagina.
    elementSize2.addEventListener("click", () => {
        document.getElementById("msg_size").innerHTML=" &nbsp Tamaño>> 4x5";
        generate_game_panel(20);
    });

    const elementSize3 = document.querySelector("#size3"); //detecta restart y recarga la pagina.
    elementSize3.addEventListener("click", () => {
        document.getElementById("msg_size").innerHTML="& &nbsp Tamaño>> 4x6";
        generate_game_panel(24);
    });

    const elementSize4 = document.querySelector("#size4"); //detecta restart y recarga la pagina.
    elementSize4.addEventListener("click", () => {
        document.getElementById("msg_size").innerHTML="&nbsp Tamaño>> 5x6";
        generate_game_panel(30);
    });


//// MODAL ENTRADA Y CONFIGURACION JUEGO /////

// Create Events for creating the modals
if (document.addEventListener) {
    document.addEventListener("click", handleClick, false);
}
else if (document.attachEvent) {
    document.attachEvent("onclick", handleClick);
}

function handleClick(event) {
    event = event || window.event;
    event.target = event.target || event.srcElement;
    var element = event.target;

    // Climb up the document tree from the target of the event
    while (element) {
        if (element.nodeName === "BUTTON" && /akela/.test(element.className)) {
            // The user clicked on a <button> or clicked on an element inside a <button>
            openModalListen(element);
            break;
        } else if (element.nodeName === "BUTTON" && /close/.test(element.className)) {
            // The user clicked on a <button> or clicked on an element inside a <button>
            closeModalListen(element);
            break;
        } else if (element.nodeName === "DIV" && /close/.test(element.className)) {
            // The user clicked on a <button> or clicked on an element inside a <button>
            closeModalListen(element);
            break;
        }
        element = element.parentNode;
    }
}

function openModalListen(button) {
    openModal(button.id);
    console.log("valor button");
    console.log(button.id);

}

function closeModalListen(button) {
  var modalFooter = button.parentElement;
  var modalContent = modalFooter.parentElement;
  var modalElement = modalContent.parentElement;
  var backdrop = document.getElementById("modal-backdrop");
    closeModal(modalElement, backdrop);
}

// Open modal
function openModal(clicked_id) {
  var button = document.getElementById(clicked_id);
  var modal = button.getAttribute("data-modal");
  var modalElement = document.getElementById(modal);
  var backdrop = document.createElement('div');
  backdrop.id="modal-backdrop";
  backdrop.classList.add("modal-backdrop");
  document.body.appendChild(backdrop);
  var backdrop = document.getElementById("modal-backdrop");
  backdrop.className += " modal-open";
  modalElement.className += " modal-open";
}

// Close Modal
function closeModal (modalElement, backdrop) { // Carga los valores de nivel y tamaño. 
                                               // Controla que se seleccionen. Si no muestra un mensaje de error.
  
    let level = localStorage.getItem("level");
    let size = JSON.parse(localStorage.getItem("sizeGame"));
    if(level && size){
        modalElement.className = modalElement.className.replace(/\bmodal-open\b/, '');
        backdrop.className = backdrop.className.replace(/\bmodal-open\b/, '');
        generate_game_panel(size);
        gameSecondary();
    }else if(level && !size){
          document.getElementById("msg_config").innerHTML="Por favor selecciona Tamaño";
          setTimeout(function(){ document.getElementById("msg_config").innerHTML=""; }, 2000);

    }else if(!level && size){
        document.getElementById("msg_config").innerHTML="Por favor selecciona Nivel";
        setTimeout(function(){ document.getElementById("msg_config").innerHTML=""; }, 2000);
    }else if(!level && !size){
        document.getElementById("msg_config").innerHTML="Por favor selecciona Nivel y Tamaño";
        setTimeout(function(){ document.getElementById("msg_config").innerHTML=""; }, 2000);
    }

}

openModal("smallbtn");  //abre el modal de entrada, al iniciar la aplicación.

}//end gameMain