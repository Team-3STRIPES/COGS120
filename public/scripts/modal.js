var isOpen = false;

function render_modal(modal_id, header_id, body_id, h_desc, b_desc) {
	var $modal = $('#'+modal_id);
	var $header = $('#'+header_id);
	var $body = $('#'+body_id);
  var curTheme = localStorage.getItem('theme').toLowerCase();
  $('.modal-header').addClass(curTheme + 'theme');
  $('.modal-footer').addClass(curTheme + 'theme');
  $('.modal-content').addClass(curTheme + 'border');
	$modal.css("display", "block");
	$header.text(h_desc);
	$body.html(b_desc);
  setTimeout(function() {
    isOpen = true;
  }, 0);
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
