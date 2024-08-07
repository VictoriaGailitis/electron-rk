function showModal() { 
    let bodyElem = document.getElementById("bd");
        bodyElem.innerHTML += `<div id="caution" class="modal" tabindex="-1"> 
        <div class="modal-dialog modal-dialog-centered"> 
            <div class="modal-content"> 
                <div class="modal-header"> 
                    <h5 class="modal-title"> 
                        Добавлеие игры 
                    </h5> 
                    <button type="button" 
                            class="btn-close"
                            data-bs-dismiss="modal" 
                            aria-label="Отмена"> 
                    </button> 
                </div> 
                <div class="modal-body">  
                    <form action="/addGame" method="POST" style="display:flex; flex-direction: column; align-items: center;">
                        <div style="display:flex;">
                        <input type="textarea" style="margin-right: 15px;" name="gameName" class="form-control" id="gameName" placeholder="Название игры" required>
                        <p class="me-3" style="margin-right: 15px; margin-top: 15px;">Прошли?</p>
                        <input type="radio" class="btn-check" name="completed" value="true" id="success-outlined" autocomplete="off" checked>
                        <label class="btn btn-outline-success" style="margin-right: 15px" for="success-outlined">Да</label>
                        <input type="radio" class="btn-check" name="completed" value="false" id="danger-outlined" autocomplete="off">
                        <label class="btn btn-outline-danger" style="margin-right: 15px;" for="danger-outlined">Нет</label>
                        </div>
                        <button class="btn btn-primary mt-3" type="submit">Добавить</button>
                    </form>
                </div> 
                <div class="modal-footer">
                    <button type="button" 
                            class="btn btn-secondary" 
                            data-bs-dismiss="modal"> 
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

let search = document.querySelector(".search")
                search.addEventListener("input", (ev)=> {
                    let inpValue = ev.target.value.toLowerCase()
                    let gamesList = document.querySelectorAll(".game")
                    for (const item of gamesList) {
                        let textItem = item.querySelector(".gameName")
                        if(!textItem.value.toLowerCase().includes(inpValue)) {
                            item.classList.add("d-none")
                        }
                        else {
                            item.classList.remove("d-none")
                        }
                    }
                })

                let radioAlphabet = document.querySelector("#option6")
                let radioDefault = document.querySelector("#option5")
                let container = document.querySelector(".maindiv")
                let gameList = document.querySelectorAll(".game")
                radioAlphabet.addEventListener("click", (ev) => {
                    container.innerHTML = ""
                    let gameArray = Array.prototype.slice.call(gameList, 0)
                    gameArray.sort(function(a, b) {
                        let aord = a.querySelector(".gameName").value.toLowerCase()
                        let bord = b.querySelector(".gameName").value.toLowerCase()
                        if (aord < bord) {
                            return -1
                        }
                        else if (aord > bord) {
                            return 1
                        }
                        else {
                            return 0
                        }
                    });
                    for (const item of gameArray) {
                        container.appendChild(item)
                    }
                })
                radioDefault.addEventListener("click", (ev)=> {
                    container.innerHTML = ""
                    for (const item of gameList) {
                        container.appendChild(item)
                    }
                })