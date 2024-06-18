var time_left = 5;

function timeDec() {
  time_left--;
  $('#secs').html(time_left);
  if(time_left == 0) {
    window.location = window.profilesUrl+'/login.php';
  }
}

setInterval(timeDec, 1000);
/* vim: set tabstop=2 shiftwidth=2 expandtab: */
