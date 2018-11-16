$(document).ready(function() {
  //$("#points").text(localStorage.getItem('points'));
  //$("#name").text(localStorage.getItem('name'));

  //var $nav = $('nav');
  //var curTheme = localStorage.getItem('theme').replace(/([A-Z])/g, '-$1').toLowerCase() + "-bg";

  //$nav.addClass(curTheme);
  $.ajax({
    url : "/ready",
    type: "POST",
    data : {
            input_user: localStorage.getItem('user'),
            input_password: localStorage.getItem('pass'),
           },
    success: function(data, textStatus, jqXHR)
    {
      $("#points").text(data.points);
      $("#name").text(data.name);
      var $nav = $('nav');
      var curTheme = data.theme.replace(/([A-Z])/g, '-$1').toLowerCase() + "-bg";
      $nav.addClass(curTheme);
    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }
  });
})

function forceLogin() {
  window.location.href = "login";
  return;
}

function loginUser() {
  var user = $('#user').val();
  var pass = $('#pass').val();

  $.ajax({
    url : "/olduser",
    type: "POST",
    data : {
            input_user: user,
            input_password: pass,
           },
    success: function(data, textStatus, jqXHR)
    {
      if(data.check === 1) {
        alert("Username not found.");
      } else if(data.check === 2) {
        alert("Password incorrect.");
      } else if(data.check === 3) {
        alert("Email is not confirmed");
      } else {
        localStorage.setItem('user', $("#user").val());
        localStorage.setItem('pass', $("#pass").val());
        window.location.href = "home";
      }
    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }
  });

  if(user === "charles" || pass === "over9000") {
    initLocalStorage();

    localStorage.setItem('name', "Charles");
    localStorage.setItem('user', "charles");
    localStorage.setItem('email', "charles@chen.com");
    localStorage.setItem('pass', "over9000");
    localStorage.setItem('theme', 'default');
    localStorage.setItem('points', 200);

    window.location.href = "home";
    return;
  }

  /*if(!localStorage.getItem('user')) {
    alert("You must make an account first.");
  } else if(localStorage.getItem('user') !== user || localStorage.getItem('pass') !== pass) {
    alert("Your login information is incorrect.");
  } else {
    window.location.href = "home";
  }*/
}

function initUser() {
  $.ajax({
      url : "/newuser",
      type: "POST",
      data : {input_name:$("#name").val(),
              input_user:$("#user").val(),
              input_email:$("#email").val(),
              input_password:$("#pass").val(),
             },
      success: function(data, textStatus, jqXHR)
      {
        if(data.check === 0) {
          alert("Username is already being used");
        } else if(data.check === 1) {
          alert("Email is already being used");
        } else if (data.check === 2){
          alert("Email is invalid");
        } else {
          window.location.href = "home";
        }
      },
      error: function (jqXHR, textStatus, errorThrown)
      {

      }
    });

  localStorage.setItem('name', $("#name").val());
  localStorage.setItem('user', $("#user").val());
  localStorage.setItem('email', $("#email").val());
  localStorage.setItem('pass', $("#pass").val());
  /*localStorage.setItem('theme', 'default');*/
  //initLocalStorage();
}

function initLocalStorage() {
 localStorage.setItem('points', 200);
 localStorage.setItem('babyBlue', false);
 localStorage.setItem('guavaPink', false);
 localStorage.setItem('mangoChile', false);
}

function addPoints(amount) {
  //localStorage.setItem('points', Number(localStorage.getItem('points')) + Number(amount));
  //$('#points').text(localStorage.getItem('points'));
  $.ajax({
      url : "/addpts",
      type: "POST",
      data : {input_pts:amount,
              input_user:localStorage.getItem('user'),
              input_password:localStorage.getItem('pass'),
             },
      success: function(data, textStatus, jqXHR)
      {
        $('#points').text(data.check);
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
    
      }
    });
}

function subtractPoints(amount) {
  //localStorage.setItem('points', Number(localStorage.getItem('points')) - Number(amount));
  //$('#points').text(localStorage.getItem('points'));
  $.ajax({
      url : "/addpts",
      type: "POST",
      data : {input_pts:'-'+amount,
              input_user:localStorage.getItem('user'),
              input_password:localStorage.getItem('pass'),
             },
      success: function(data, textStatus, jqXHR)
      {
        $('#points').text(data.check);
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
    
      }
    });
}

function canBuyItem(theme, cost) {
  var number = -1;
  var req = $.ajax({
      url : "/ptscheck",
      type: "POST",
      data : {
              input_user:localStorage.getItem('user'),
              input_password:localStorage.getItem('pass'),
              input_theme:theme,
             },
      success: function(data, textStatus, jqXHR)
      {
        //if(localStorage.getItem(theme) === 'true') return 0;
        //if(Number(localStorage.getItem('points')) < cost) return 1;
        //return 2;
        if (data.theme == 'true') {
          render_modal("fail", "fail-header", "fail-body", "Error", "You already purchased this item!");
        } else if (data.points < cost) {
          alert("You have insufficient funds!");
        } else {
          render_modal("purchase", "purchase-header", "purchase-body", justBought.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); }), "Are you sure you want to buy the  " + justBought.replace(/([A-Z])/g, ' $1').toLowerCase() + " theme for " + themes[justBought] + " points?");
        }
        return;
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
    
      }
    });
}

function buyItem(theme, cost) {
  /*localStorage.setItem(theme, 'true');
  var curDate = new Date();
  localStorage.setItem(theme + 'Date', String(curDate.getMonth() + 1) + "/" + String(curDate.getDate()) + "/" + String(curDate.getFullYear()));
  subtractPoints(cost);*/
  $.ajax({
      url : "/buyTheme",
      type: "POST",
      data : { input_pts:cost,
              input_user:localStorage.getItem('user'),
              input_password:localStorage.getItem('pass'),
              input_theme:theme,
             },
      success: function(data, textStatus, jqXHR)
      {
        //subtractPoints(cost);
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
    
      }
    });
}

function changeTheme(newTheme) {
  $.ajax({
      url : "/currTheme",
      type: "POST",
      data : {
              input_user: localStorage.getItem('user'),
              input_password: localStorage.getItem('pass'),
              input_theme:newTheme,
             },
      success: function(data, textStatus, jqXHR)
      {
        //localStorage.setItem('theme', newTheme);
        window.location.reload(true);
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
    
      }
  });
}

function updateElementTheme(selector) {
  $.ajax({
    url : "/ready",
    type: "POST",
    data : {
            input_user: localStorage.getItem('user'),
            input_password: localStorage.getItem('pass'),
           },
    success: function(data, textStatus, jqXHR)
    {
      var curTheme = data.theme.toLowerCase()+"theme";
      $(selector).addClass(curTheme);
    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }
  });
  //var curTheme = localStorage.getItem('theme').toLowerCase() + "theme";
  //$(selector).addClass(curTheme);
}

function showProfileInfo() {
   $.ajax({
    url : "/ready",
    type: "POST",
    data : {
            input_user: localStorage.getItem('user'),
            input_password: localStorage.getItem('pass'),
           },
    success: function(data, textStatus, jqXHR)
    {
      $("#fullname").text(data.name);
      $("#email").text(data.email);
    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }
  });
  //$("#fullname").text(localStorage.getItem('name'));
  //$("#email").text(localStorage.getItem('email'));

  /*if(localStorage.getItem('babyBlue') === "true") {
    $("#history").append('<li>Baby Blue theme purchased on ' + localStorage.getItem('babyBlueDate') + '</li>');
  }
  if(localStorage.getItem('guavaPink') === "true") {
    $("#history").append('<li>Guava Pink theme purchased on ' + localStorage.getItem('guavaPinkDate') + '</li>');
  }
  if(localStorage.getItem('mangoChile') === "true") {
    $("#history").append('<li>Mango Chile theme purchased on ' + localStorage.getItem('mangoChileDate') + '</li>');
  }*/
}

function getCurrentSettings() {
  $.ajax({
    url : "/ready",
    type: "POST",
    data : {
            input_user: localStorage.getItem('user'),
            input_password: localStorage.getItem('pass'),
           },
    success: function(data, textStatus, jqXHR)
    {
      $("#fullname").text(data.name);
      $("#email").text(data.email);
      var $themes = $("#themes");
      var curTheme = data.theme;
      $('select > option').each(function(e) {
      if($(this).attr('value') === curTheme) {
          $(this).prop('selected', true);
        }
      });
     
      if(curTheme === 'default') {
        $themes.append('<option value="default" selected>Default</option>');
      }
      if(curTheme === 'babyBlue') {
        $themes.append('<option value="babyBlue" selected>Baby Blue</option>');
      }
      if(curTheme === 'guavaPink') {
        $themes.append('<option value="guavaPink" selected>Guava Pink</option>');
      }
      if(curTheme === 'mangoChile') {
        $themes.append('<option value="mangoChile" selected>Mango Chile</option>');
      }
      for (var i = 0; i < data.themes.length; i++) {
        if(data.themes[i] === 'default' && curTheme !== 'default') {
          $themes.append('<option value="default">Default</option>');
        }
        if (data.themes[i] === 'babyBlue' && curTheme !== 'babyBlue') {
          $themes.append('<option value='+data.themes+'>Baby Blue</option>');
        }
        if(data.themes[i] === 'guavaPink' && curTheme !== 'guavaPink') {
          $themes.append('<option value="guavaPink">Guava Pink</option>');
        }
        if(data.themes[i] === 'mangoChile' && curTheme !== 'mangoChile') {
          $themes.append('<option value="mangoChile">Mango Chile</option>');
        }
      }

    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }
  });
}
  /*$("#fullname").val(localStorage.getItem('name'));
  $("#email").val(localStorage.getItem('email'));
  var $themes = $("#themes");
  var curTheme = localStorage.getItem('theme');
  $('select > option').each(function(e) {
    if($(this).attr('value') === curTheme) {
      $(this).prop('selected', true);
    }
  });

  if(curTheme === 'default') {
    $themes.append('<option value="default" selected>Default</option>');
  }
  else {
    $themes.append('<option value="default"> Default</option');
  }
  if(localStorage.getItem('babyBlue') === "true") {
    if(curTheme === 'babyBlue') {
      $themes.append('<option value="babyBlue" selected>Baby Blue</option>');
    }
    else {
      $themes.append('<option value="babyBlue">Baby Blue</option>');
    }
  }
  if(localStorage.getItem('guavaPink') === "true") {
    if(curTheme === 'guavaPink') {
      $themes.append('<option value="guavaPink" selected>Guava Pink</option>');
    }
    else {
      $themes.append('<option value="guavaPink">Guava Pink</option>');
    }
  }
  if(localStorage.getItem('mangoChile') === "true") {
    if(curTheme === 'mangoChile') {
      $themes.append('<option value="mangoChile" selected>Mango Chile</option>');
    }
    else {
      $themes.append('<option value="mangoChile">Mango Chile</option>');
    }
  }
}*/

function updateSettings() {
   $.ajax({
    url : "/update",
    type: "POST",
    data : {
            input_user: localStorage.getItem('user'),
            input_password: localStorage.getItem('pass'),
            input_name: $('#fullname').val(),
            input_email: $('#email').val(),
            input_theme: $('#themes').val(),
           },
    success: function(data, textStatus, jqXHR)
    {
      if (data.check == 'false') {
        alert('Email is not a valid email');
      } else {
        localStorage.setItem('name', $('#fullname').val());
        localStorage.setItem('email', $('#email').val());
        localStorage.setItem('theme', $('#themes').val());
        window.location.reload(true);
      }
    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }
  });
  /*localStorage.setItem('name', $('#fullname').val());
  localStorage.setItem('email', $('#email').val());
  localStorage.setItem('theme', $('#themes').val());
  window.location.reload(true);*/
}

function addHistory(historyData) {
  //just append to history 
  $.ajax({
    url : "/addHist",
    type: "POST",
    data : {
            input_user: localStorage.getItem('user'),
            input_password: localStorage.getItem('pass'),
            input_hist: historyData,
           },
    success: function(data, textStatus, jqXHR)
    {

    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }
  });
}

function getHistory() {
  //return list of history
  var history;
  $.ajax({
    url : "/getHist",
    type: "POST",
    data : {
            input_user: localStorage.getItem('user'),
            input_password: localStorage.getItem('pass'),
           },
    success: function(data, textStatus, jqXHR)
    {
      hist = data.hist;
      var $history = $('#history');
      for(var i = hist.length; i >= 0; i--) {
        $history.append(`<li>${history[i]}</li>`)
      }
    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }
  });
}


function sendLoginInfo() {
  var input_email = $('#forgotEmail').val();
  $.ajax({
    url : "/forgotEmail",
    type: "POST",
    data : {
            input_email: input_email,
           },
    success: function(data, textStatus, jqXHR)
    {
      if (data.check) {
        window.location.reload(true);
        alert("An email has been sent with your login information");
      } else {
        alert("Invalid email, email is not registered");
      }
    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }
  });
}