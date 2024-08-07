function focusElement() {
    setTimeout(() => {
        document.body.addEventListener('click', removeFocus);
    }, 500);
}
function removeFocus() {
    const element = document.querySelector('.focused');
    let blurredElems = document.querySelectorAll('.blurred')
    element.classList.remove('focused');
    for (const elem of blurredElems) {
        elem.classList.remove('blurred');
    }
    document.body.removeEventListener('click', removeFocus);
}
function randomAll() {
    let allCards = document.querySelectorAll(".spanCard")
    let chosen_card_id = Math.floor(Math.random()*allCards.length);
    for (let i = 0; i < allCards.length; i++) {
        if (i == chosen_card_id) {
        allCards[i].classList.add("focused")
        }
        else {
        allCards[i].classList.add("blurred")
        }
    }
    focusElement()
}

function randomOpen() {
    let allCards = document.querySelectorAll(".spanCard")
    let openCards = document.querySelectorAll(".spanOpen")
    if (openCards.length == 0) {
        return
    }
    let chosen_card = openCards[Math.floor(Math.random()*openCards.length)];
    for (let i = 0; i < openCards.length; i++) {
        if (openCards[i].id == chosen_card.id) {
            openCards[i].classList.add("focused")
        }
        else {
            openCards[i].classList.add("blurred")
        }
    }
    for (let i = 0; i < allCards.length; i++) {
        if (!allCards[i].classList.contains("focused")) {
            allCards[i].classList.add("blurred")
        }
    }
    focusElement()
}

function randomClosed() {
    let allCards = document.querySelectorAll(".spanCard")
    let closedCards = document.querySelectorAll(".spanHid")
    if (closedCards.length == 0) {
        return
    }
    let chosen_card = closedCards[Math.floor(Math.random()*closedCards.length)];
    for (let i = 0; i < closedCards.length; i++) {
        if (closedCards[i].id == chosen_card.id) {
            closedCards[i].classList.add("focused")
        }
        else {
            closedCards[i].classList.add("blurred")
        }
    }
    for (let i = 0; i < allCards.length; i++) {
        if (!allCards[i].classList.contains("focused")) {
            allCards[i].classList.add("blurred")
        }
    }
    focusElement()
}

function randomGold() {
    let allCards = document.querySelectorAll(".spanCard")
    let goldCards = document.querySelectorAll(".span-yellow")
    if (goldCards.length == 0) {
        return
    }
    let chosen_card = goldCards[Math.floor(Math.random()*goldCards.length)];
    for (let i = 0; i < goldCards.length; i++) {
        if (goldCards[i].id == chosen_card.id) {
            goldCards[i].classList.add("focused")
        }
        else {
            goldCards[i].classList.add("blurred")
        }
    }
    for (let i = 0; i < allCards.length; i++) {
        if (!allCards[i].classList.contains("focused")) {
            allCards[i].classList.add("blurred")
        }
    }
    focusElement()
}

function randomWhite() {
    let allCards = document.querySelectorAll(".spanCard")
    let whiteCards = document.querySelectorAll(".span-white")
    if (whiteCards.length == 0) {
        return
    }
    let chosen_card = whiteCards[Math.floor(Math.random()*whiteCards.length)];
    for (let i = 0; i < whiteCards.length; i++) {
        if (whiteCards[i].id == chosen_card.id) {
            whiteCards[i].classList.add("focused")
        }
        else {
            whiteCards[i].classList.add("blurred")
        }
    }
    for (let i = 0; i < allCards.length; i++) {
        if (!allCards[i].classList.contains("focused")) {
            allCards[i].classList.add("blurred")
        }
    }
    focusElement()
}

function randomCrossed() {
    let allCards = document.querySelectorAll(".spanCard")
    let crossedCards = document.querySelectorAll(".spanCrossed")
    if (crossedCards.length == 0) {
        return
    }
    let chosen_card = crossedCards[Math.floor(Math.random()*crossedCards.length)];
    for (let i = 0; i < crossedCards.length; i++) {
        if (crossedCards[i].id == chosen_card.id) {
            crossedCards[i].classList.add("focused")
        }
        else {
            crossedCards[i].classList.add("blurred")
        }
    }
    for (let i = 0; i < allCards.length; i++) {
        if (!allCards[i].classList.contains("focused")) {
            allCards[i].classList.add("blurred")
        }
    }
    focusElement()
}

function randomUncrossed() {
    let allCards = document.querySelectorAll(".spanCard")
    let uncrossedCards = document.querySelectorAll(".spanUncrossed")
    if (uncrossedCards.length == 0) {
        return
    }
    let chosen_card = uncrossedCards[Math.floor(Math.random()*uncrossedCards.length)];
    for (let i = 0; i < uncrossedCards.length; i++) {
        if (uncrossedCards[i].id == chosen_card.id) {
            uncrossedCards[i].classList.add("focused")
        }
        else {
            uncrossedCards[i].classList.add("blurred")
        }
    }
    for (let i = 0; i < allCards.length; i++) {
        if (!allCards[i].classList.contains("focused")) {
            allCards[i].classList.add("blurred")
        }
    }
    focusElement()
}

function myFunc(elemId) {
    let boxElem = document.getElementById("box");
    boxElem.innerHTML = `<div style="display:flex; margin-bottom: 50px;">
        <a class="btn btn-outline-primary" style="margin-right:100px;" rel="preload" href="/changeColor?id=${elemId} ">Сменить цвет</a>
        <a class="btn btn-outline-primary" style="margin-right:100px;" rel="preload" href="/changeCross?id=${elemId}">Зачеркнуть/вычеркнуть</a>
        <a class="btn btn-outline-primary " style="margin-right:100px;" onclick="showModal(${elemId})">Открыть/закрыть</a>
        <a class="btn btn-outline-primary" onclick="showModal2(${elemId})">Рандом темы</a></div>
        <div style="display:flex;">
            <form action="/makeDescription" style="display:flex;" method="POST">
            <input name="cardId" value=${elemId} type=hidden></input>
            <label for="description" style="margin-right:30px;" class="form-label">Описание к клетке</label>
            <input type="textarea" name="description" style="margin-right:30px;" class="form-control" id="description" placeholder="Описание">
            <button type="submit" class="btn btn-primary">Добавить/Изменить</button>
            </form>
        </div>
        ` 
}

function showModal(elemId) { 
    let bodyElem = document.getElementById("bd");
        bodyElem.innerHTML += `<div id="caution" class="modal" tabindex="-1"> 
            <div class="modal-dialog modal-dialog-centered"> 
                <div class="modal-content"> 
                    <div class="modal-header"> 
                        <h5 class="modal-title"> 
                            Внимание! 
                        </h5> 
                        <button type="button" 
                                class="btn-close"
                                data-bs-dismiss="modal" 
                                aria-label="Отмена"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasBottom"
                                aria-controls="offcanvasBottom"> 
                        </button> 
                    </div> 
                    <div class="modal-body"> 
                        <p> 
                            Точно открыть/закрыть клетку?
                        </p> 
                    </div> 
                    <div class="modal-footer">
                    <a 
                                class="btn btn-primary" 
                                href="/changeOpen?id=${elemId}"
                                rel="preload"> 
                            Подтвердить 
                        </a>  
                        <button type="button" 
                                class="btn btn-secondary"
                                data-bs-dismiss="modal"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasBottom"
                                aria-controls="offcanvasBottom"> 
                            Отмена 
                        </button> 
                    </div> 
                </div> 
            </div> 
        </div> `
        let modal =  
            new bootstrap.Modal(document.getElementById('caution')); 
        modal.show(); 
} 

function showModal2(elemId) { 
    let bodyElem = document.getElementById("bd");
        bodyElem.innerHTML += `<div id="caution2" class="modal" tabindex="-1"> 
        <div class="modal-dialog modal-dialog-centered"> 
            <div class="modal-content"> 
                <div class="modal-header"> 
                    <h5 class="modal-title"> 
                        Внимание! 
                    </h5> 
                    <button type="button" 
                            class="btn-close"
                            data-bs-dismiss="modal" 
                            aria-label="Отмена"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasBottom"
                            aria-controls="offcanvasBottom"> 
                    </button> 
                </div> 
                <div class="modal-body"> 
                    <p> 
                        Точно поменять тему?
                    </p> 
                </div> 
                <div class="modal-footer">
                    <a 
                            class="btn btn-primary" 
                            href="/changeTheme?id=${elemId}"
                            rel="preload"> 
                        Подтвердить 
                    </a>  
                    <button type="button" 
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasBottom"
                            aria-controls="offcanvasBottom"> 
                        Отмена 
                    </button> 
                </div> 
            </div> 
        </div> 
    </div> `
    let modal =  
        new bootstrap.Modal(document.getElementById('caution2')); 
    modal.show();
}

function showModal3() { 
    let bodyElem = document.getElementById("bd");
        bodyElem.innerHTML += `<div id="caution3" class="modal" tabindex="-1"> 
        <div class="modal-dialog modal-dialog-centered"> 
            <div class="modal-content"> 
                <div class="modal-header"> 
                    <h5 class="modal-title"> 
                        Внимание! 
                    </h5> 
                    <button type="button" 
                            class="btn-close"
                            data-bs-dismiss="modal" 
                            aria-label="Отмена"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasNavbar"
                            aria-controls="offcanvasNavbar"> 
                    </button> 
                </div> 
                <div class="modal-body"> 
                    <p> 
                        Точно начать новый раунд?
                    </p> 
                </div> 
                <div class="modal-footer">
                <a 
                            class="btn btn-primary" 
                            href="/newGame"> 
                        Подтвердить 
                    </a>  
                    <button type="button" 
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasNavbar"
                            aria-controls="offcanvasNavbar"> 
                        Отмена 
                    </button> 
                </div> 
            </div> 
        </div> 
    </div> `
    let modal =  
        new bootstrap.Modal(document.getElementById('caution3')); 
    modal.show();
}

var offcanvasElement = document.getElementById("offcanvasBottom"); 
        var offcanvas = new bootstrap.Offcanvas(offcanvasElement); 
        let button = document.getElementById("trigger-btn"); 
        button.addEventListener("click", () => { 
            return offcanvas.toggle();
        });    

var popoverTrigger =  
            [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]')) 
        var popoverList = popoverTrigger.map(function (popoverTrigger2) { 
        return new bootstrap.Popover(popoverTrigger2) 
        }) 

let buttonTheme = document.querySelectorAll(".cardBtn")
let pTheme = document.querySelectorAll(".pTheme")
for (let i = 0; i < buttonTheme.length; i++) {
    if (pTheme[i].scrollWidth > 104 || pTheme[i].scrollHeight > 104) {
        pTheme[i].style.fontSize = "11px"
    }
}