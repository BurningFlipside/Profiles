var aarMembers = [
  'Adam',
  'Cooper',
//  'Izzi',
  'Kat',
  'Problem',
  'Tim'
];

function getPrevious(id) {
  var split = id.split('_');
  var newId = split[0]+'_'+((split[1]*1)-1);
  return document.getElementById(newId);
}

function getNext(id) {
  var split = id.split('_');
  var newId = split[0]+'_'+((split[1]*1)+1);
  return document.getElementById(newId);
}

function disableValue(element, value) {
  for(var i = 0; i < element.options.length; i++) {
    if(element.options[i].value === value) {
      element.options[i].disabled = true;
    }
  }
}

function disableValues(a, b, f, fa, value) {
  disableValue(a[0], value);
  if(b.length !== 0) {
    disableValue(b[0], value);
  }
  if(f.length !== 0) {
    disableValue(f[0], value);
  }
  if(fa.length !== 0) {
    disableValue(fa[0], value);
  }
}

function addStateToQueryString(actual, backup, fuckoff, fuckoffa) {
  var url = window.location.href;
  var split = url.split('?');
  var actualS = encodeURIComponent(actual.join(','));
  var backupS = encodeURIComponent(backup.join(','));
  var fuckoffS = encodeURIComponent(fuckoff.join(','));
  var fuckoffaS = encodeURIComponent(fuckoffa.join(','));
  var newState = {Title: document.title, Url: split[0]+'?actual='+actualS+'&backup='+backupS+'&fuckoff='+fuckoffS+'&fuckoffa='+fuckoffaS};
  history.pushState(newState, newState.Title, newState.Url);
}

function updateAllDropdowns() {
  var actual = [];
  var backup = [];
  var fuckoff = [];
  var fuckoffa = [];
  var meta = [];
  for(var i = 1; i < 99; i++) {
    var a = $('#actual_'+i);
    if(a.length === 0) {
      break;
    }
    actual.push(a.val());
    var m = {length: 12, weight: 1, gap: 0};
    var length = a.data('length');
    var weight = a.data('weight');
    var gap = a.data('gap');
    if(length !== undefined) {
      m.length = length;
    }
    if(weight !== undefined) {
      m.weight = weight;
    }
    if(gap !== undefined) {
      m.gap = gap;
    }
    meta.push(m);
    var b = $('#backup_'+i);
    if(b.length === 0) {
      backup.push('');
    }
    else {
      backup.push(b.val());
    }
    var f = $('#fuck_'+i);
    if(f.length === 0) {
      fuckoff.push('');
    }
    else {
      fuckoff.push(f.val());
    }
    var f = $('#fuck_'+i+'a');
    if(f.length === 0) {
      fuckoffa.push('');
    }
    else {
      fuckoffa.push(f.val());
    }
  }
  addStateToQueryString(actual, backup, fuckoff, fuckoffa);
  //Re-enable everything...
  $('option').prop('disabled', false);
  for(var i = 0; i < actual.length; i++) {
    var a = $('#actual_'+(i+1));
    var b = $('#backup_'+(i+1));
    var f = $('#fuck_'+(i+1));
    var fa = $('#fuck_'+(i+1)+'a');
    if(i >= 1) {
      if(actual[i-1] !== '') {
        disableValues(a, b, f, fa, actual[i-1]);
      }
      if(backup[i-1] !== '') {
        disableValues(a, b, [], [], backup[i-1]);
      }
      if(fuckoff[i-1] !== '') {
        disableValues(a, b, f, fa, fuckoff[i-1]);
      }
      if(fuckoffa[i-1] !== '') {
        disableValues(a, b, f, fa, fuckoffa[i-1]);
      }
    }
    if(i+1 < actual.length) {
      if(actual[i+1] !== '') {
        disableValues(a, b, f, fa, actual[i+1]);
      }
      if(backup[i+1] !== '') {
        disableValues(a, b, f, fa, backup[i+1]);
      }
      if(fuckoff[i+1] !== '') {
        disableValues(a, [], f, fa, fuckoff[i+1]);
      }
      if(fuckoffa[i+1] !== '') {
        disableValues(a, [], f, fa, fuckoffa[i+1]);
      }
    }
    if(actual[i] !== '') {
      if(b.length !== 0) {
        disableValue(b[0], actual[i]);
      }
      if(f.length !== 0) {
        disableValue(f[0], actual[i]);
      }
      if(fa.length !== 0) {
        disableValue(fa[0], actual[i]);
      }
    }
    if(backup[i] !== '') {
      disableValues(a, [], f, fa, backup[i]);
    }
    if(fuckoff[i] !== '') {
      disableValues(a, b, [], fa, fuckoff[i]);
    }
    if(fuckoffa[i] !== '') {
      disableValues(a, b, f, [], fuckoffa[i]);
    }
  }
  var data = {};
  for(var i = 0; i < actual.length; i++) {
    if(actual[i] === '') {
      continue;
    }
    if(data[actual[i]] === undefined) {
      data[actual[i]] = {count: 0, backup: 0, actualGap: NaN, backupGap: NaN, gap: NaN, lastA: -1, lastB: -1, last: -1};
    }
    data[actual[i]].count+=meta[i].weight;
  }
  for(var i = 0; i < backup.length; i++) {
    if(backup[i] === '') {
      continue;
    }
    if(data[backup[i]] === undefined) {
      data[backup[i]] = {count: 0, backup: 0, actualGap: NaN, backupGap: NaN, gap: NaN, lastA: -1, lastB: -1, last: -1};
    }
    data[backup[i]].backup+=meta[i].weight;
  }
  for(var i = 0; i < actual.length; i++) {
    var name = null;
    if(actual[i] !== '') {
      name = actual[i];
      if(data[name].lastA === -1) {
        data[name].lastA = i;
      }
      else {
        var gap = 0;
        gap+=meta[data[name].lastA].gap;
        for(var j = data[name].lastA+1; j < i; j++) {
          gap += meta[j].length+meta[j].gap;
        }
        if(isNaN(data[name].actualGap)) {
          data[name].actualGap = gap;
        }
        else if(gap < data[name].actualGap) {
          data[name].actualGap = gap;
        }
        data[name].lastA = i;
      }
      doGap(data, name, i, meta);
    }
    if(backup[i] !== '') {
      name = backup[i];
      if(data[name].lastB === -1) {
        data[name].lastB = i;
      }
      else {
        var gap = 0;
        gap+=meta[data[name].lastB].gap;
        for(var j = data[name].lastB+1; j < i; j++) {
          gap += meta[j].length+meta[j].gap;
        }
        if(isNaN(data[name].backupGap)) {
          data[name].backupGap = gap;
        }
        else if(gap < data[name].backupGap) {
          data[name].backupGap = gap;
        }
        data[name].lastB = i;
      }
      doGap(data, name, i, meta);
    }
  }
  for(var name in data) {
    $('#'+name+'ActualCount').text(data[name].count);
    $('#'+name+'BackupCount').text(data[name].backup);
    var actualGap = data[name].actualGap;
    var backupGap = data[name].backupGap;
    var gap = data[name].gap;
    if(isNaN(actualGap)) {
      actualGap = 'Infinite';
    }
    if(isNaN(backupGap)) {
      backupGap = 'Infinite';
    }
    if(isNaN(gap)) {
      gap = 'Infinite';
    }
    $('#'+name+'ActualGap').text(actualGap);
    $('#'+name+'BackupGap').text(backupGap);
    $('#'+name+'Gap').text(gap);
  }
  console.log(data);
}

function doGap(data, name, i, meta) {
  if(data[name].last === -1) {
    data[name].last = i;
  }
  else {
    var gap = 0;
    gap+=meta[data[name].last].gap;
    for(var j = data[name].last+1; j < i; j++) {
      gap += meta[j].length+meta[j].gap;
    }
    if(isNaN(data[name].gap)) {
      data[name].gap = gap;
    }
    else if(gap < data[name].gap) {
      data[name].gap = gap;
    }
    data[name].last = i;
  }
}

function changeActual(e) {
  updateAllDropdowns();
}

function changeBackup(e) {
  updateAllDropdowns();
}

function changeFuck(e) {
  updateAllDropdowns();
}

function initInput(index, element) {
  element.append(new Option('', ''));
  for(var i = 0; i < aarMembers.length; i++) {
    element.append(new Option(aarMembers[i], aarMembers[i]));
  }
}

function initSummary(index, element) {
  for(var i = 0; i < aarMembers.length; i++) {
    var row = element.insertRow();
    var name = document.createElement('th');
    name.innerHTML = aarMembers[i];
    row.append(name);
    var actualCount = row.insertCell();
    actualCount.innerHTML = 0;
    actualCount.id = aarMembers[i]+'ActualCount';
    var backupCount = row.insertCell();
    backupCount.innerHTML = 0;
    backupCount.id = aarMembers[i]+'BackupCount';
    var actualGap = row.insertCell();
    actualGap.innerHTML = 'Infinite';
    actualGap.id = aarMembers[i]+'ActualGap';
    var backupGap = row.insertCell();
    backupGap.innerHTML = 'Infinite';
    backupGap.id = aarMembers[i]+'BackupGap';
    var gap = row.insertCell();
    gap.innerHTML = 'Infinite';
    gap.id = aarMembers[i]+'Gap';
  }
}

function processParam(value, argument) {
  var array = value.split(',');
  for(var i = 0; i < array.length; i++) {
    var id = argument+'_'+(i+1);
    if(argument === 'fuckoffa') {
      id = 'fuck_'+(i+1)+'a';
    }
    else if(argument === 'fuckoff') {
      id = 'fuck_'+(i+1);
    }
    $('#'+id).val(array[i]);
  }
  updateAllDropdowns();
}

function repopulate(year) {
  if(year === 2019) {
    processParam(decodeURIComponent('Kat%2CAdam%2CIzzi%2CProblem%2CTim%2CKat%2CIzzi%2CProblem%2CAdam%2CCooper%2CTim%2CProblem%2CAdam%2CCooper%2CKat%2CTim'), 'actual');
    processParam(decodeURIComponent('%2C%2C%2CCooper%2CIzzi%2CCooper%2CTim%2CKat%2CIzzi%2CProblem%2CAdam%2CIzzi%2CKat%2CProblem%2CAdam%2CProblem'), 'backup');
    processParam(decodeURIComponent('%2C%2C%2C%2C%2CAdam%2C%2CCooper%2C%2CIzzi%2C%2C%2C%2C%2C%2C'), 'fuckoff');
    processParam(decodeURIComponent('%2C%2C%2C%2C%2CProblem%2C%2CTim%2C%2CKat%2C%2C%2C%2C%2C%2C'), 'fuckoffa');
  }
}

function initPage() {
  $('.actual').css('background', 'red');
  $('.backup').css('background', 'yellow');
  $('.fuck').css('background', 'green');
  $('select').each(initInput);
  $('#summary').each(initSummary);
  $('.actual').change(changeActual);
  $('.backup').change(changeBackup);
  $('.fuck').change(changeFuck);
  var url = new URL(location.href);
  var params = new URLSearchParams(url.search.slice(1));
  params.forEach(processParam);
}

$(initPage)
