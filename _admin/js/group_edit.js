function getGID() {
    let searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('gid')
}

function populateGroupDropdown() {
    let groupSelect = document.getElementById('group_select');
    //Turn off events on the dropdown
    groupSelect.removeEventListener('change');
    fetch('../api/v1/groups?$select=cn').then((response) => {
        if(response.httpStatus === 401) {
            // Not logged in, silently return
            return;
        }
        response.json().then((groups) => {
            for(const group of groups) {
                let option = new Option(group.cn);
                groupSelect.add(option);
            }
            let gid = getGID();
            if(gid != null) {
                groupSelect.value = gid;
            }
            groupSelect.addEventListener('change', groupSelectChange);
        });
    });
}

function populateGroupData() {
    let gid = getGID();
    if(document.getElementById('group_data') !== null && gid !== null) {
        fetch('../api/v1/groups/'+gid+'?$expand=member&directOnly=true').then((response) => {
            if(response.httpStatus === 401) {
                // Not logged in, silently return
                return;
            }
            response.json().then((group) => {
                document.getElementById('gid').innerText = group.cn;
                document.getElementById('gid_edit').value = group.cn;
                document.getElementById('description').value = group.description;
                for(const member of group.member) {
                    if(member.sn !== undefined) {
                        member.type = 'User';
                    } else {
                        member.type = 'Group';
                    }
                }
                let memberTableElem = document.getElementById('members');
                let parent = memberTableElem.parentElement;
                let node = document.createElement('div');
                node.style.float = 'right';
                node.style.textAlign = 'right';
                node.innerText = 'Search:';
                let search = document.createElement('input');
                search.type = 'text';
                search.style.border = '1px solid #aaa';
                search.style.borderRadius = '5px';
                search.style.padding = '2px';
                node.appendChild(search);
                parent.insertBefore(node, memberTableElem);
                let memberTable = new Tabulator('#members', {
                    data: group.member,
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
                memberTable.on('tableBuilt', () => {
                    memberTable.setData(group.member);
                });
                let nonMmberTableElem = document.getElementById('non-members');
                parent = nonMmberTableElem.parentElement;
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
                parent.insertBefore(node, nonMmberTableElem);
                let nonMemberTable = new Tabulator('#non-members', {
                    ajaxURL: '../api/v1/groups/'+gid+'/non-members?$select=displayName,mail,givenName,sn,uid',
                    pagination: true,
                    height: '500px',
                    columns: [
                        {'title': '', width:'3%', formatter: (cell) => {
                            let addButton = document.createElement('button');
                            addButton.classList.add('btn', 'btn-link');
                            addButton.innerHTML = '<i class="fa fa-plus"></i>';
                            addButton.addEventListener('click', () => {
                                let data = cell.getRow().getData();
                                memberTable.addRow(data);
                                nonMemberTable.deleteRow(cell.getRow());
                            });
                            return addButton;
                        }
                        },
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
                nonMemberTable.on('tableBuilt', () => {
                    nonMemberTable.setData();
                });
                search.addEventListener('input', () => {
                    memberTable.clearFilter();
                    if(search.value !== '') {
                        memberTable.setFilter((data) => {
                            let title = data.titlenames === null ? '' : data.titlenames[0];
                            let ret = data.uid.toLowerCase().includes(search.value.toLowerCase()) ||
                                data.mail.toLowerCase().includes(search.value.toLowerCase()) ||
                                data.displayName.toLowerCase().includes(search.value.toLowerCase()) ||
                                title.toLowerCase().includes(search.value.toLowerCase());
                            return ret;
                        });
                    }
                });
                nmSearch.addEventListener('input', () => {
                    nonMemberTable.clearFilter();
                    if(nmSearch.value !== '') {
                        nonMemberTable.setFilter((data) => {
                            if(data.cn !== undefined) {
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
            });
        });
    }
}

function groupSelectChange() {
    let select = document.getElementById('group_select');
    location.href = location.pathname+'?gid='+select.value;
}

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
            child.type = 'User';
            child.uid = member.uid;
        }
        group.member.push(child);
    }
    fetch('../api/v1/groups/'+getGID(), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(group)
    }).then((response) => {
        if(response.ok) {
            alert('Success!');
            location.reload();
            return;
        }
        alert('Unable to update group!');
        console.log(response);
    });
    return false;
}

function doGroupEditInit() {
    populateGroupDropdown();
    populateGroupData();
    document.getElementById('form').addEventListener('submit', groupDataSubmitted);
    document.getElementById('submit').removeAttribute('disabled');
}

window.onload = doGroupEditInit;
