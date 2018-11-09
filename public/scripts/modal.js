var X = $(".close")[0];

function render_modal(modal_id, header_id, body_id, h_desc, b_desc) {
	var $modal = $('#'+modal_id)[0];
	var $header = $('#'+header_id)[0];
	var $body = $('#'+body_id)[0];
	$modal.style.display = "block";
	$header.childNodes[0].nodeValue = h_desc;
	$body.childNodes[0].nodeValue = b_desc;
}

X.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	var modal = $(".modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}