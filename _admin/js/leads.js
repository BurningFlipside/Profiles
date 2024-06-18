function areaChange() {
    let areaSelect = document.getElementById('area_select');
    fetch('../api/v1/areas/'+areaSelect.value+'/leads').then((response) => {
        if(!response.ok) {
            alert('Unable to get leads for selected area!');
            return;
        }
        response.json().then((data) => {
            leadsDone(data);
        })
    });
}

function leadChange(control) {
    let value = control.value;
    if(value != '') {
        document.getElementById('lead_details').style.display = 'block';
        let submit = document.getElementById('submit');
        let leadName = document.getElementById('lead_name');
        let shortName = document.getElementById('short_name');
        let name = document.getElementById('name');
        submit.removeEventListener('click');
        if(value == '_new') {
            submit.addEventListener('click', addLead);
            leadName.innerHTML = 'New Lead';
            shortName.value = '';
            name.value = '';
        } else {
            submit.addEventListener('click', updateLead);
            let option = control.options[control.selectedIndex];
            let lead = JSON.parse(option.getAttribute('data-lead'));
            leadName.innerHTML = lead.name;
            shortName.value = lead.short_name;
            name.value = lead.name;
        }
    }
}

function leadsDone(data) {
    let leadSelect = document.getElementById('lead_select');
    leadSelect.options.length = 0;
    let option = new Option('', '');
    leadSelect.add(option);
    option = new Option('New...', '_new');
    leadSelect.add(option);
    for(let i = 0; i < data.length; i++) {
        option = new Option(data[i].name, data[i].short_name);
        option.setAttribute('data-lead', JSON.stringify(data[i]));
        leadSelect.add(option);
    }
}

function areasDone(data) {
    let areaSelect = document.getElementById('area_select');
    for(let i = 0; i < data.length; i++) {
        let option = new Option(data[i].name, data[i].short_name);
        areaSelect.add(option);
    }
    areaSelect.addEventListener('change', areaChange);
    areaChange();
}

function formVars() {
    return {
        short_name: document.getElementById('short_name').value,
        name: document.getElementById('name').value,
        area: document.getElementById('area_select').value
    };
}

function addLead() {
    fetch('../api/v1/leads', {
        method: 'POST',
        body: JSON.stringify(formVars()),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if(!response.ok) {
            alert('Unable to create lead!');
            return;
        }
        location.reload();
    });
}

function updateLead() {
    let leadShortId = document.getElementById('short_name').value;
    fetch('../api/v1/leads/'+leadShortId, {
       method: 'PATCH',
       body: JSON.stringify(formVars()),
       headers: {
           'Content-Type': 'application/json'
       } 
    }).then((response) => {
        if(!response.ok) {
            alert('Unable to update lead!');
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
    let leadSelect = document.getElementById('lead_select');
    leadSelect.addEventListener('change', () => {leadChange(leadSelect)});
}

window.onload = initPage;
