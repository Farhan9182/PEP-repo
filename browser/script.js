// let elem = document.querySelector(".input-box");
// let ul = document.querySelector(".task-list");
// elem.addEventListener("keydown",function (e){
//     if(e.key == "Enter"){
//         let task = elem.value;

//         let newElem = document.createElement("li");
//         newElem.innerText = task;
//         newElem.addEventListener("dblclick", function(){
//             newElem.remove();
//         })
//         ul.appendChild(newElem);
//         elem.value = "";
//     }
// })

let colorBtn = document.querySelectorAll(".filter_color");
let mainContainer = document.querySelector(".main_container");
let body = document.body;


let elem = document.querySelectorAll(".box");
let bottom = document.querySelector(".bottom");
elem.forEach( myFunction);
function myFunction(item)
    {
        item.addEventListener("click", function(e){
        console.log(e);
        let color = item.classList[0];
        console.log(color);
        bottom.style.backgroundColor = color ;

    })
}
let plusButton = document.querySelector(".fa-plus");
plusButton.addEventListener("click", createModal);

function createModal() {
    // create modal
    let modal_container = document.createElement("div");
    modal_container.setAttribute("class", "modal_container");
    modal_container.innerHTML = `<div class="input_container">
    <textarea class="modal_input" 
    placeholder="Enter Your text"></textarea>
</div>
<div class="modal_filter_container">
    <div class="filter pink"></div>
    <div class="filter blue"></div>
    <div class="filter green"></div>
    <div class="filter black"></div>
</div>`;
    body.appendChild(modal_container);
    //  event listner 
    handleModal(modal_container);
}

function handleModal(modal_container) {
    let cColor = "black";
    let modalFilters = document.querySelectorAll(".modal_filter_container .filter");
    // /remove previous attr new attrs
    // modalFilters[3].setAttribute("class", "border");
    // border -> black
    modalFilters[3].classList.add("border");
    for (let i = 0; i < modalFilters.length; i++) {
        modalFilters[i].addEventListener("click", function () {
            //    remove broder from elements
            modalFilters.forEach((filter) => {
                filter.classList.remove("border");
            })
            //  add
            modalFilters[i].classList.add("border")
            // modalFilters[i].classList
            //  color 
            cColor = modalFilters[i].classList[1];
            console.log("current color of task", cColor);

        })
    }
    let textArea = document.querySelector(".modal_input");
    textArea.addEventListener("keydown", function (e) {
        if (e.key == "Enter" && textArea.value != "") {
            console.log("Task ", textArea.value, "color ", cColor);
            //  remove modal
            modal_container.remove();
            // create taskBox
            createTask(cColor, textArea.value);
        }
    })


}

function createTask(color, task) {
    // color area click-> among colors
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class", "task_container");
    taskContainer.innerHTML = `<div class="task_filter ${color}"></div>
    <div class="task_desc_container">
        <h3 class="uid">#example</h3>
        <div class="task_desc" contenteditable="true" >${task}</div>
    </div>
</div >`;
    mainContainer.appendChild(taskContainer);
    let taskFilter = taskContainer.querySelector(".task_filter");
    taskFilter.addEventListener("click", changeColor);

}

function changeColor(e) {
    //  add event listener 
    // console.log(e.currentTarget);
    // /event occur 
    // console.log(e.target);
    let taskFilter = e.currentTarget;
    let colors = ["pink", "blue", "green", "black"];
    let cColor = taskFilter.classList[1];
    let idx = colors.indexOf(cColor);
    let newColorIdx = (idx + 1) % 4;
    taskFilter.classList.remove(cColor);
    taskFilter.classList.add(colors[newColorIdx]);
}
