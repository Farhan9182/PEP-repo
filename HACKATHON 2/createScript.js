
let addbtn = document.getElementById('create');
addbtn.addEventListener('click',function(){
    let sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');
    document.querySelector('.outer').appendChild(sectionDiv);
    let select = document.createElement('select');
    select.setAttribute('name','select[]');
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
    input.setAttribute('name','input[]');
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