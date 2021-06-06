const idx = 1;
let db = null;



let addbtn = document.getElementById('create');
addbtn.addEventListener('click',function(){
    let sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');
    document.querySelector('.outer').appendChild(sectionDiv);
    let select = document.createElement('select');
    select.setAttribute('name','select');
    select.setAttribute('required','required');
    select.classList.add('form__text');
    let option1 = document.createElement('option');
    option1.value = "Text/Email";
    option1.innerText = "Text/Email";
    let option2 = document.createElement('option');
    option2.value = "Dropdown";
    option2.innerText = "Dropdown";
    let option3 = document.createElement('option');
    option3.value = "Checkbox";
    option3.innerText = "Checkbox";
    select.appendChild(option1);
    select.appendChild(option2);
    select.appendChild(option3);
    sectionDiv.appendChild(select);

    let input = document.createElement('input');
    input.classList.add('form__text');
    input.setAttribute('type','text');
    input.setAttribute('name','input');
    input.setAttribute('required','required');

    sectionDiv.appendChild(input);

    let removebtn = document.createElement('button');
    removebtn.classList.add('button');
    removebtn.style.backgroundColor = "red";
    removebtn.innerText = 'X';
    sectionDiv.appendChild(removebtn);
    removebtn.addEventListener('click',function(){{
        this.parentElement.remove();
    }})
})

let submitbtn = document.getElementById('submit');
submitbtn.addEventListener('click', function(){
 
    createDB();
    setTimeout(function(){
        let nameC = document.getElementById('creator_name').value;
        let emailC = document.getElementById('creator_email').value;
        let valueArr = document.querySelectorAll('input[name="input"]');
        let optionArr = document.querySelectorAll('select[name="select"]');
        for(let i=0; i<valueArr.length; i++){
            const tupple = {
                name: nameC,
                email: emailC,
                idx: i+1,
                option: optionArr[i].value,
                label: valueArr[i].value
            }

            const tx = db.transaction("my_Form", "readwrite")
            tx.onerror = e => alert( ` Error! ${e.target.error}  `)
            const pNotes = tx.objectStore("my_Form")
            pNotes.add(tupple);
        }
       }, 3000);
    //    window.location.reload();
})


function createDB () {

    const dbName = "FormDatabase";
    const dbVersion = "1";

    const request = indexedDB.open(dbName,dbVersion)

        //on upgrade needed
        request.onupgradeneeded = e => {
            db = e.target.result
            db.createObjectStore("my_Form", {keyPath: "idx"})

        }
        //on success 
        request.onsuccess = e => {
            db = e.target.result
        }
        //on error
        request.onerror = e => {
            alert(`error: ${e.target.error} was found `)
             
        }


}