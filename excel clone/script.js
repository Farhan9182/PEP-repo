let addbtnContainer = document.querySelector(".add-sheet_container");
let sheetlist = document.querySelector(".sheets-list");
let firstSheet = document.querySelector(".sheet");
firstSheet.addEventListener("click",handleActiveSheet);

function handleActiveSheet(e){
    let mySheet = e.currentTarget;
    let sheetArr = document.querySelectorAll(".sheet");
    sheetArr.forEach(function (sheet) {
        sheet.classList.remove("active-sheet");
    });
    if(!mySheet.classList[1]){
        mySheet.classList.add("active-sheet");
    }
}

addbtnContainer.addEventListener("click", function() {
    let sheetArr = document.querySelectorAll(".sheet");
    let lastSheetElem = sheetArr[sheetArr.length - 1];
    let idx = lastSheetElem.getAttribute("idx");
    idx = Number(idx);

    let newSheet = document.createElement("div");
    newSheet.setAttribute("class","sheet");
    newSheet.setAttribute("idx",idx + 1);
    newSheet.innerText = `Sheet ${idx + 1}`;

    sheetlist.appendChild(newSheet);
    newSheet.addEventListener("click",handleActiveSheet);
})