let times = 0;

function clearKonami() {
  document.getElementById('content').removeChild(document.getElementById('konami'));
  times++;
}

function konami() {
  let marqueeDiv = document.createElement('div');
  marqueeDiv.id = 'konami';
  let img = document.createElement('img');
  img.src = '/img/common/logo.svg';
  img.style.animation = 'marquee 5s linear infinite';
  img.style.paddingLeft = '100%';
  img.style.display = 'inline-block';
  marqueeDiv.appendChild(img);
  if(times >= 1) {
    let text = document.createTextNode('Here we go again...');
    marqueeDiv.appendChild(text);
  }
  marqueeDiv.style.width = '100%';
  let audio = document.createElement('audio');
  audio.autoplay = true;
  let source = document.createElement('source');
  source.src = '/media/contra.ogg';
  source.type = 'audio/ogg';
  audio.appendChild(source);
  marqueeDiv.appendChild(audio);
  document.getElementById('content').appendChild(marqueeDiv);
  img.animate([
    {transform: 'translateX(0)'},
    {transform: 'translateX(-50%)'}
  ], {
    duration: 5000
  });
  setTimeout(clearKonami, 5000);
}

function pageInit() {
  cheet('up up down down left right left right b a', konami);
}

function retryPageInit() {
  if(window.cheet === undefined) {
    //Wait for the cheet script to load...
    setTimeout(retryPageInit, 100);
    return;
  }
  pageInit();
}

window.onload = retryPageInit;
