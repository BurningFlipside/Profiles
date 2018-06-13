function renderUID(data, type, row)
{
    return '<a href="user_edit.php?uid='+data+'">'+data+'</a>';
}

function renderName(data, type, row, meta)
{
    if(row['givenName'] !== false)
    {
        return row['givenName']+' '+data;
    }
    return data;
}

function onUserTableBodyClick()
{
    if($(this).hasClass('selected')) 
    {
        $(this).removeClass('selected');
    }
    else 
    {
        $(this).addClass('selected');
    }
}

function storageAvailable(type)
{
    try
    {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e)
    {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

function populateTableNoStorage()
{
  $('#user_table').dataTable({
    'ajax': '../api/v1/users?fmt=data-table&$select=uid,displayName,sn,mail,givenName',
    'columns': [
      {'data': 'uid', 'render': renderUID},
      {'data': 'displayName'},
      {'data': 'sn'},
      {'data': 'mail'},
      {'data': 'givenName', 'visible': false}
    ]
  });
}

function populateTableFromArray(array)
{
  if(!$.fn.DataTable.isDataTable('#user_table'))
  {
    $('#user_table').dataTable({
      'data': array,
      'columns': [
        {'data': 'uid', 'render': renderUID},
        {'data': 'displayName'},
        {'data': 'sn'},
        {'data': 'mail'},
        {'data': 'givenName', 'visible': false}
      ],
      'deferRender': true
    });
  }
  else
  {
    var table = $('#user_table').DataTable();
    table.clear();
    for(var i = 0; i < array.length; i++)
    {
      table.row.add(array[i]);
    }
    table.draw();
  }
}

function gotUserList(jqXHR)
{
  if(jqXHR.status !== 200)
  {
    alert('Unable to obtain user list!');
    console.log(jqXHR);
    return;
  }
  var cache = {users: jqXHR.responseJSON, time: Date.now()};
  window.localStorage.setItem('FlipsideUserCache', JSON.stringify(cache));
  populateTableFromArray(jqXHR.responseJSON);
}

function refreshCache()
{
  $.ajax({
    url: '../api/v1/users?$select=uid,displayName,sn,mail,givenName',
    type: 'get',
    dataType: 'json',
    complete: gotUserList
  });
}

function do_users_init()
{
    if($("#user_table").length > 0)
    {
      if(storageAvailable('localStorage'))
      {
        var cache = window.localStorage.getItem('FlipsideUserCache');
        if(!cache)
        {
          refreshCache();
        }
        else
        {
          cache = JSON.parse(cache);
          if(cache.time < Date.now()-1200000)
          {
            //Cache is 2 minutes old... refresh
            refreshCache();
          }
          else
          {
            populateTableFromArray(cache.users);
          }
        }
      }
      else
      {
        $('.fa-refresh').hide();
        populateTableNoStorage();
      }
      $("#user_table tbody").on('click', 'tr', onUserTableBodyClick);
    }
}

$(do_users_init);
