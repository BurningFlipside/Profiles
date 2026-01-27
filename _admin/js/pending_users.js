function doPendingInit() {
    let pendingTable = new Tabulator('#pending_table', {
        pagination: true,
        height: '500px',
        columns: [
	    {formatter: delIcon, width:40, align:'center', cellClick: delPending},
            {formatter: resendIcon, width:40, align:'center', cellClick: resendPending},
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

function delIcon() {
    return '<i class="fa fa-trash"></i>'
}

function resendIcon() {
    return '<i class="fa fa-envelope"></i>'
}

function delPending(e, cell) {
    let data = cell.getRow().getData();
    let hash = data.hash;
    fetch('../api/v1/pending_users/'+hash, {method:'DELETE'}).then((res) => {
       if(res.ok) {
         alert('Deleted pending registration!');
	 window.location.reload();
       }
    });
}

function resendPending(e, cell) {
    let data = cell.getRow().getData();
    let hash = data.hash;
    fetch('../api/v1/pending_users/'+hash+'/Actions/PendingUser.ResendEmail', {method:'POST'}).then((res) => {
        if(res.ok) {
            alert('Resent registration confirmation email!');
            window.location.reload();
        }
   });
}

window.onload = doPendingInit;
