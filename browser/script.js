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