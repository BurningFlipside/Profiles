function areaChange(control) {
    let value = control.options[control.selectedIndex].value;
    if(value != '') {
        document.getElementById('area_details').style.display = 'block';
        let submit = document.getElementById('submit');
        let areaName = document.getElementById('area_name');
        submit.removeEventListener('click');

        if(value == '_new') {
            submit.addEventListener('click', addArea);
            areaName.innerHTML = 'New Area';
        } else {
            submit.addEventListener('click', updateArea);
            areaName.innerHTML = value;
            let option = control.options[control.selectedIndex];
            let area = JSON.parse(option.getAttribute('data-area'));
            document.getElementById('short_name').value = area.short_name;
            document.getElementById('name').value = area.name;
        }
    }
}

function areasDone(data) {
    let areaSelect = document.getElementById('area_select');
    areaSelect.addEventListener("change", () => {areaChange(areaSelect)});
    for(let i = 0; i < data.length; i++) {
        let option = new Option(data[i].name, data[i].short_name);
        option.setAttribute('data-area', JSON.stringify(data[i]));
        areaSelect.add(option);
    }
}

function formVars() {
    return {
        short_name: document.getElementById('short_name').value,
        name: document.getElementById('name').value
    };
}

function addArea() {
    fetch('../api/v1/areas', {
        method: 'POST',
        body: JSON.stringify(formVars()),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if(!response.ok) {
            alert('Unable to create area!');
            return;
        }
        location.reload();
    });
}

function updateArea() {
    let areaName = document.getElementById('area_name').innerHTML;
    fetch('../api/v1/areas/'+areaName, {
        method: 'PATCH',
        body: JSON.stringify(formVars()),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if(!response.ok) {
            alert('Unable to update area!');
            return;
        }
        location.reload();
    });
}

function initPage() {
    fetch('../api/v1/areas').then((response) => {
        if(response.ok) {
            response.json().then((data) => {
                areasDone(data);
            });
        }
    });
}

window.onload = initPage;
