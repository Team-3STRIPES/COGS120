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
  localStorage.setItem(theme, 'true');
  subtractPoints(cost);
}
