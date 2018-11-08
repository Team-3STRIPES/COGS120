$(document).ready(function() {
  if(!localStorage.getItem('points')) initLocalStorage();
  $('#points').text(localStorage.getItem('points'));
});

function initLocalStorage() {
 localStorage.setItem('points', 0);
 localStorage.setItem('babyBlue', false);
 localStorage.setItem('guavaPink', false);
 localStorage.setItem('mangoChile', false);
}

function addPoints(amount) {
  localStorage.setItem('points', Number(localStorage.getItem('points')) + Number(amount));
  $('#points').text(localStorage.getItem('points'));
}

function subtractPoints(amount) {
  localStorage.setItem('points', Number(localStorage.getItem('points')) - Number(amount));
  $('#points').text(localStorage.getItem('points'));
}

function buyItem(theme, cost) {
  if(localStorage.getItem(theme) === 'true') return 0;
  if(localStorage.getItem('points') < cost) return 1;
  localStorage.setItem(theme, 'true');
  subtractPoints(cost);
  return 2;
}
