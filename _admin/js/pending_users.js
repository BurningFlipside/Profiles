function doPendingInit() {
    let pendingTable = new Tabulator('#pending_table', {
        pagination: true,
        height: '500px',
        columns: [
            {'title': 'Username', 'field': 'uid', width:'20%'},
            {'title': 'Email', 'field': 'mail', width:'25%'},
            {'title': 'Registration Time', 'field': 'time', width:'27%'},
        ],
        initialSort: [
            {column: 'uid', dir: 'asc'}
        ],
        ajaxURL: '../api/v1/pending_users'
    });
    pendingTable.on('tableBuilt', () => {
        pendingTable.setData();
    });
}

window.onload = doPendingInit;
