


function renderDOM(){

    el = document.querySelector('body');
    el.innerHTML += '<div class="aaaa" onclick="change(this)">sdfgdsf</div>';

}


function change(elem){

    // elem = document.querySelector(".aaaa");
    elem.classList.add('aaa');

}