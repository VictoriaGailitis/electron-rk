let search = document.querySelector(".search")
                search.addEventListener("input", (ev)=> {
                    let inpValue = ev.target.value.toLowerCase()
                    let themeList = document.querySelectorAll(".theme")
                    for (const item of themeList) {
                        let textItem = item.querySelector(".themeName")
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
                let themeList = document.querySelectorAll(".theme")
                radioAlphabet.addEventListener("click", (ev) => {
                    container.innerHTML = ""
                    let themeArray = Array.prototype.slice.call(themeList, 0)
                    themeArray.sort(function(a, b) {
                        let aord = a.querySelector(".themeName").value.toLowerCase()
                        let bord = b.querySelector(".themeName").value.toLowerCase()
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
                    for (const item of themeArray) {
                        container.appendChild(item)
                    }
                })
                radioDefault.addEventListener("click", (ev)=> {
                    container.innerHTML = ""
                    for (const item of themeList) {
                        container.appendChild(item)
                    }
                })