function open_dialog(event)
{
    $("#login-form").dialog("open");
    if(event != undefined && event != null)
    {
        event.preventDefault();
    }
}

function login_submit_done(jqXHR)
{
    if(jqXHR.status !== 200)
    {
        var failed = getParameterByName('failed')*1;
        var return_val = window.location;
        failed++;
        window.location = window.loginUrl+'?failed='+failed+'&return='+return_val;
    }
    else
    {
        if(jqXHR.responseJSON !== undefined)
        {
            var data = jqXHR.responseJSON;
            var url  = '';
            if(data['return'])
            {
                url = data['return'];
            }
            else
            {
                url = getParameterByName('return');
                if(url === null)
                {
                    url = window.location;
                }
            }
            if(data.extended)
            {
            	console.log(data.extended);
            }
            window.location = url;
        }
    }
}

function loginSubmitted(e)
{
    e.preventDefault();
    var form = $(this).parents('form');
    $.ajax({
        url: $('body').data('login-url'),
        data: form.serialize(),
        type: 'post',
        dataType: 'json',
        xhrFields: {withCredentials: true},
        complete: login_submit_done});
}

function do_login_init()
{
    if($('#login_dialog_form').length > 0)
    {
        var login_link = $(".links a[href*='login']");
        login_link.attr('data-toggle','modal');
        login_link.attr('data-target','#login-dialog');
        login_link.removeAttr('href');
        login_link.css('cursor', 'pointer');
    }
    $("[type=submit]").on('click', loginSubmitted);
    if($(window).width() <= 340)
    {
        $('.login-container').css('max-width', $(window).width()-50);
    }
}

$(do_login_init);
