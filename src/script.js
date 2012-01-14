$(document).ready(function () {
  var width = 400;
  var height = 400;
  var paper = Raphael('map', width, height);
  var border = paper.rect(0, 0, 400, 400);
  border.attr('stroke', 'black');

  $('#map').click(function (e) {
    var x = e.offsetX, y = e.offsetY;
    paper.circle(x, y, 1);
  });
});
