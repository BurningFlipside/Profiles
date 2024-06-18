function groupDataSubmitted(e) {
    e.preventDefault();
    let group = {
        cn: document.getElementById('gid_edit').value,
        description: document.getElementById('description').value
    };
    let memberTable = Tabulator.findTable('#members')[0];
    var members = memberTable.getData();
    group.member = [];
    for(const member of members) {
        let child = {};
        child.type = member.type;
        if(member.type === 'Group') {
            child.cn = member.cn;
        } else {
            child.uid = member.uid;
        }
        group.member.push(child);
    }
    fetch('../api/v1/groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(group)
    }).then((response) => {
        if(response.status !== 200) {
            alert('Unable to create group!');
            return;
        }
        alert('Success!');
        location = 'group_edit.php?gid='+document.getElementById('gid').value;
    });
}

function doGroupEditInit() {
    let memberTable = new Tabulator('#members', {
        pagination: true,
        height: '500px',
        columns: [
            {'title': '', width:'3%', formatter: (cell) => {
                let removeButton = document.createElement('button');
                removeButton.classList.add('btn', 'btn-link');
                removeButton.innerHTML = '<i class="fa fa-minus"></i>';
                removeButton.addEventListener('click', () => {
                    memberTable.deleteRow(cell.getRow());
                });
                return removeButton;
            }},
            {'title': 'Username', 'field': 'uid', width:'20%'},
            {'title': 'Email', 'field': 'mail', width:'25%'},
            {'title': 'Name', 'field': 'displayName', width:'27%', mutator: (value, data) => {
                if(data.displayName === undefined || data.displayName === null || data.displayName === '') {
                    return data.givenName+' '+data.sn;
                }
                return data.displayName;
            }},
            {'title': 'Title', 'field': 'titlenames', width:'20%'}
        ],
        initialSort: [
            {column: 'displayName', dir: 'asc'}
        ]
    });
    let nonMemberTableElem = document.getElementById('non-members');
    let parent = nonMemberTableElem.parentElement;
    node = document.createElement('div');
    node.style.float = 'right';
    node.style.textAlign = 'right';
    node.innerText = 'Search:';
    let nmSearch = document.createElement('input');
    nmSearch.type = 'text';
    nmSearch.style.border = '1px solid #aaa';
    nmSearch.style.borderRadius = '5px';
    nmSearch.style.padding = '2px';
    node.appendChild(nmSearch);
    parent.insertBefore(node, nonMemberTableElem);
    let nonMemberTable = new Tabulator('#non-members', {
        pagination: true,
        height: '500px',
        columns: [
            {'title': '', width:'3%', formatter: (cell) => {
                let removeButton = document.createElement('button');
                removeButton.classList.add('btn', 'btn-link');
                removeButton.innerHTML = '<i class="fa fa-plus"></i>';
                removeButton.addEventListener('click', () => {
                    let data = cell.getRow().getData();
                    memberTable.addRow(data);
                    nonMemberTable.deleteRow(cell.getRow());
                });
                return removeButton;
            }},
            {'title': 'Username', 'field': 'uid', width:'20%'},
            {'title': 'Email', 'field': 'mail', width:'25%'},
            {'title': 'Name', 'field': 'displayName', width:'27%', mutator: (value, data) => {
                if(data.displayName === undefined || data.displayName === null || data.displayName === '') {
                    return data.givenName+' '+data.sn;
                }
                return data.displayName;
            }},
            {'title': 'Title', 'field': 'titlenames', width:'20%'}
        ],
        initialSort: [
            {column: 'displayName', dir: 'asc'}
        ],
        ajaxURL: '../api/v1/groups/none/non-members?$select=cn,mail,description,givenName,sn,uid,type'
    });
    nonMemberTable.on('tableBuilt', () => {
        nonMemberTable.setData();
    });
    nmSearch.addEventListener('input', () => {
        nonMemberTable.clearFilter();
        if(nmSearch.value !== '') {
            nonMemberTable.setFilter((data) => {
                if(data.cn !== undefined && data.cn !== false) {
                    // This is a group
                    return data.cn.toLowerCase().includes(nmSearch.value.toLowerCase()) || data.description.toLowerCase().includes(nmSearch.value.toLowerCase());
                }
                let title = data.titlenames === undefined ? '' : data.titlenames[0];
                let name = (data.displayName === undefined || data.displayName === false) ? data.givenName+' '+data.sn : data.displayName;
                let ret = data.uid.toLowerCase().includes(nmSearch.value.toLowerCase()) ||
                    data.mail.toLowerCase().includes(nmSearch.value.toLowerCase()) ||
                    name.toLowerCase().includes(nmSearch.value.toLowerCase()) ||
                    title.toLowerCase().includes(nmSearch.value.toLowerCase());
                return ret;
            });
        }
    });
    document.getElementById('form').addEventListener('submit', groupDataSubmitted);
}

window.onload = doGroupEditInit;
