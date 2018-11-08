$(document).ready(function() {
  if(!localStorage.getItem('points')) localStorage.setItem('points', 0);
  $('#points').text(localStorage.getItem('points'));
});

function addPoints(newPoints) {
  localStorage.setItem('points', Number(localStorage.getItem('points')) + Number(newPoints));
  $('#points').text(localStorage.getItem('points'));
}
