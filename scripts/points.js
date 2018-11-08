$(document).ready(function() {
  $("#points").text(localStorage.getItem('points'));
})

function forceLogin() {
  window.location.href = "login.html";
  return;
}

function loginUser() {
  var user = $('#user').val();
  var pass = $('#pass').val();
  if(!localStorage.getItem('user')) {
    alert("You must make an account first.");
  } else if(localStorage.getItem('user') !== user || localStorage.getItem('pass') !== pass) {
    alert("Your login information is incorrect.");
  } else {
    window.location.href = "home.html";
  }
}

function initUser() {
  localStorage.setItem('name', $("#name").val());
  localStorage.setItem('user', $("#user").val());
  localStorage.setItem('email', $("#email").val());
  localStorage.setItem('pass', $("#pass").val());
  initLocalStorage();
}

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
