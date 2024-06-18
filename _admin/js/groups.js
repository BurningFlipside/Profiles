function groupExecute(table) {
    let action = document.getElementById('group_action').value;
    switch(action) {
        default:
        case "none":
            return;
        case "del":
            action = "delete";
            break;
        case "new":
            window.location = "group_new.php";
            break;
    }
    let selectedRows = table.getSelectedData();
    if(selectedRows.length < 1) {
        return;
    }
    console.log(selectedRows);
    for(let i = 0; i < selectedRows.length; i++) {
        // TODO perform the action on each group...
    }
}

function doGroupsInit() {
    if(Tabulator === undefined) {
        //Waiting on the external table js to load. Wait 100ms and try again.
        window.setTimeout(doGroupsInit, 100);
        return;
    }
    let dataTable = new Tabulator('#group_table', {
        ajaxURL: '../api/v1/groups',
        electableRows: true,
        rowHeader:{formatter:"rowSelection", titleFormatter:"rowSelection", headerSort:false, resizable: false, frozen:true, headerHozAlign:"center", hozAlign:"center"},
        columns: [
            {'title': 'Group Name', 'field': 'cn', 'formatter': 'link', formatterParams: {urlPrefix: 'group_edit.php?gid='}},
            {'title': 'Description', 'field': 'description'}
        ]
    });
    dataTable.on('tableBuilt', () => {
        dataTable.setData();
    });
    let button = document.getElementById('groupExecute');
    button.addEventListener('click', () => {
        groupExecute(dataTable);
    });
}

window.onload = doGroupsInit;
