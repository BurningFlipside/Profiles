var _uid = null;

function getUID()
{
    if(_uid != null)
    {
        return _uid;
    }
    else
    {
        return getParameterByName('uid');
    }
}

var leads = null;
var user = null;

function areasDone(jqXHR)
{
    if(jqXHR.status !== 200)
    {
        alert('Unable to obtain area list!');
        console.log(jqXHR);
        return;
    }
    var areas = jqXHR.responseJSON;
    for(i = 0; i < areas.length; i++)
    {
        $('#ou').append('<option value="'+areas[i].short_name+'">'+areas[i].name+'</option>');
        $.ajax({
            url: '../api/v1/areas/'+areas[i].short_name+'/leads',
            type: 'get',
            dataType: 'json',
            context: areas[i].short_name,
            success: leadsDone});
    }
    if(user != null)
    {
        $('#ou').val(user.ou);
        area_change($('#ou'));
    }
}

function leadsDone(data)
{
    if(leads === null)
    {
        leads = {};
    }
    leads[this] = data;
    area_change($('#ou'));
}

function area_change(control)
{
    var val = $(control).val();
    if(val == '')
    {
        return;
    }
    if(leads != null)
    {
        $('#title').html('<option></option>');
        var areaLeads = leads[val];
        if(areaLeads === undefined) return;
        for(i = 0; i < areaLeads.length; i++)
        {
            var option = $('<option value="'+areaLeads[i].short_name+'">'+areaLeads[i].name+'</option>');
            if(user !== null && user.title[0] == areaLeads[i].short_name)
            {
                option.attr('selected', 'true');
            }
            $('#title').append(option);
        }
    }
}

function userDataDone(jqXHR)
{
    if(jqXHR.status !== 200)
    {
        alert('Unable to obtain user data!');
        console.log(jqXHR);
        return;
    }
    user = jqXHR.responseJSON;
    $('#uid').html(user.uid);
    $('#uid_x').val(user.uid);
    $('#old_uid').val(user.uid);
    $('#dn').html(user.dn);
    $('#givenName').val(user.givenName);
    $('#sn').val(user.sn);
    $('#displayName').val(user.displayName);
    $('#mail').val(user.mail);
    $('#mobile').val(user.mobile);
    $('#postalAddress').val(user.postalAddress);
    $('#postalCode').val(user.postalCode);
    $('#l').val(user.l);
    $('#st').val(user.st);
    $('#ou').val(user.ou);
    area_change($('#ou'));
    $('#title').val(user.title[0]);
    $('#user_data').show(); 
}

function clearPosition() {
  $.ajax({
    url: '../api/v1/users/'+getUID()+'/Actions/ClearPosition',
    method: 'POST',
    complete: userSubmitDone
  });
  return false;
}

function populateAreaDropdown()
{
    $.when(
        $.ajax({
            url: '../api/v1/areas',
            type: 'get',
            dataType: 'json',
            complete: areasDone})
    ).done(populateUserData);
}

function populateUserData()
{
    var uid = getUID();
    if(($('#user_data').length > 0) && (uid != null))
    {
        $.ajax({
            url: '../api/v1/users/'+uid,
            type: 'get',
            dataType: 'json',
            complete: userDataDone});
    }
}

function userSubmitDone(jqXHR)
{
    if(jqXHR.status !== 200 && jqXHR.status !== 204)
    {
        alert('Unable to set user data!');
        console.log(jqXHR);
        return;
    }
    alert("Success!");
    location = 'user_edit.php?uid='+getUID();
}

function userDataSubmitted(e)
{
    e.preventDefault();
    var obj = $(e.target).serializeObject();
    $.ajax({
        url: '../api/v1/users/'+getUID(),
        data: JSON.stringify(obj),
        contentType: 'application/json',
        type: 'PATCH',
        dataType: 'json',
        processData: false,
        complete: userSubmitDone});
    return false;
}

function do_user_edit_init()
{
    populateAreaDropdown();
    $("#form").submit(userDataSubmitted);
}

$(do_user_edit_init);
