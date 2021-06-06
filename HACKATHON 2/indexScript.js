let db = null;
createDB();

function viewData() {

    const tx = db.transaction("my_Form","readonly")
    const pNotes = tx.objectStore("my_Form")
    const request = pNotes.openCursor()
    request.onsuccess = e => {

        const cursor = e.target.result;

        if (cursor) {
            //do something with the cursor
            let ptag = document.getElementById('dependent');
            let h3 = document.createElement('h3');
            h3.innerText = cursor.value.title;
            let h5 = document.createElement('h5');
            h5.innerText = "Created By:" + cursor.value.name;
            ptag.appendChild(h3);
            ptag.appendChild(h5);
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