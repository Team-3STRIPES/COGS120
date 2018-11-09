$(document).ready(function() {
  $("#points").text(localStorage.getItem('points'));
  $("#name").text(localStorage.getItem('name'));

  var $nav = $('nav');
  var curTheme = localStorage.getItem('theme').replace(/([A-Z])/g, '-$1').toLowerCase() + "-bg";
  $nav.addClass(curTheme);
})

function forceLogin() {
  window.location.href = "login.html";
  return;
}

function loginUser() {
  var user = $('#user').val();
  var pass = $('#pass').val();

  if(user === "charles" || pass === "over9000") {
    initLocalStorage();

    localStorage.setItem('name', "Charles");
    localStorage.setItem('user', "charles");
    localStorage.setItem('email', "charles@chen.com");
    localStorage.setItem('pass', "over9000");
    localStorage.setItem('theme', 'default');

    window.location.href = "home.html";
    return;
  }

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
  localStorage.setItem('theme', 'default');
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

function canBuyItem(theme, cost) {
  if(localStorage.getItem(theme) === 'true') return 0;
  if(Number(localStorage.getItem('points')) < cost) return 1;
  return 2;
}

function buyItem(theme, cost) {
  localStorage.setItem(theme, 'true');
  var curDate = new Date();
  localStorage.setItem(theme + 'Date', String(curDate.getMonth() + 1) + "/" + String(curDate.getDate()) + "/" + String(curDate.getFullYear()));
  subtractPoints(cost);
}

function changeTheme(newTheme) {
  localStorage.setItem('theme', newTheme);
  window.location.reload(true);
}

function showProfileInfo() {
  $("#fullname").text(localStorage.getItem('name'));
  $("#email").text(localStorage.getItem('email'));

  if(localStorage.getItem('babyBlue') === "true") {
    $("#history").append('<li>Baby Blue theme purchased on ' + localStorage.getItem('babyBlueDate') + '</li>');
  }
  if(localStorage.getItem('guavaPink') === "true") {
    $("#history").append('<li>Guava Pink theme purchased on ' + localStorage.getItem('guavaPinkDate') + '</li>');
  }
  if(localStorage.getItem('mangoChile') === "true") {
    $("#history").append('<li>Mango Chile theme purchased on ' + localStorage.getItem('mangoChileDate') + '</li>');
  }
}
