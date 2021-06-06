let db = null;
createDB();
function viewData() {

    const tx = db.transaction("my_Form","readonly")
    const pNotes = tx.objectStore("my_Form")
    const request = pNotes.openCursor()
    request.onsuccess = e => {

        const cursor = e.target.result

        if (cursor) {
            //do something with the cursor
            let label = cursor.value.label.split(",");
            let inputLabel = document.createElement('label');
            inputLabel.classList.add('form__label');
            inputLabel.innerText = label[0];
            let outer = document.querySelector('.outer');
            outer.appendChild(inputLabel);
            let option = cursor.value.option;
            if(option == "Text/Email"){

                let input = document.createElement('input');
                input.classList.add('form__text');
                input.setAttribute('required','required');
                if(label[0] == "Email")
                {
                    input.type = "email";
                }
                else{
                    input.type = "text";
                }

                input.name = label[0];

                outer.appendChild(input);

            }
            else if(option == "Dropdown"){
                let input = document.createElement('select');
                input.classList.add('form__text');
                input.setAttribute('required','required');
                
                for(let i=1; i<label.length; i++){
                    let option = document.createElement('option');
                    option.value = label[i];
                    option.innerText = label[i];
                    input.appendChild(option);
                }

                input.name = label[0];

                outer.appendChild(input);
            }
            else{

                for(let i=1; i<label.length; i++){
                    let input = document.createElement('input');
                    input.classList.add('form__text');
                    input.type = "checkbox";
                    input.name = label[i];
                    input.style.display = "inline-block";
                    outer.appendChild(input);
                }

                

                
            }
            cursor.continue()
        }
    }

}

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
        setTimeout(() => {
            viewData();
        }, 3000);
        
}
