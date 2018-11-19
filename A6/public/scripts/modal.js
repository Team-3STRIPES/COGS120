var isOpen = false;

function render_modal(modal_id, header_id, body_id, h_desc, b_desc) {
	var $modal = $('#'+modal_id);
	var $header = $('#'+header_id);
	var $body = $('#'+body_id);

  $.ajax({
    url : "/ready",
    type: "POST",
    data : {
            input_user: localStorage.getItem('user'),
            input_password: localStorage.getItem('pass'),
           },
    success: function(data, textStatus, jqXHR)
    {
      var theme = data.theme
      console.log(theme)
      var curTheme = theme.toLowerCase();
      $('.modal-header').addClass(curTheme + 'theme');
      $('.modal-footer').addClass(curTheme + 'theme');
      $('.modal-content').addClass(curTheme + 'border');
      $modal.css("display", "block");
      $header.text(h_desc);
      $body.html(b_desc);
      setTimeout(function() {
        isOpen = true;
      }, 0);
    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }
  });
}

// When the user clicks anywhere outside of the modal, close it
$(window).click(function(e) {
  if (($(e.target).parents('.modal-content').length === 0 && isOpen) ||
      ($(e.target).hasClass('close'))) {
    closeModal();
  }
})

function closeModal() {
  var $modal = $(".modal");
  $modal.css("display", "none");
  isOpen = false;
}
