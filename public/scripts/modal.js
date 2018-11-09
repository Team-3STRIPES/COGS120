var modal = $('#myModal')[0];
var header = $('#m-header')[0];
var body = $('.modal-body')[0];
var footer = $('.modal-footer')[0];
var span = $(".close")[0];

function render_modal(modal, header, body, footer, color, points, adj) {
  modal.style.display = "block";
  header.childNodes[0].nodeValue = adj;
  body.childNodes[0].nodeValue = "You have purchased the theme "+color+"!\nTry out your theme in your settings."
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}