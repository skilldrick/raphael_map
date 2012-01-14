$(document).ready(function () {
  var width = 400;
  var height = 400;
  var closeTolerance = 5;
  var paper = Raphael('map', width, height);
  var border = paper.rect(0, 0, 400, 400);
  border.attr('stroke', 'black');
  var currentPolygon = null;
  var polygons = [];

  $('#map').click(function (e) {
    var x = e.offsetX, y = e.offsetY;

    if (!currentPolygon) {
      currentPolygon = newPolygon(x, y);
    } else if (currentPolygon.shouldClose(x, y)) {
      currentPolygon.closePath();
      savePolygon(currentPolygon.path);
      currentPolygon = null;
    } else {
      currentPolygon.addPoint(x, y);
    }
  });

  function savePolygon(polygon) {
    polygons.push(polygon);
    polygon.attr('fill', 'white');
    polygon.hover(function () {
      polygon.attr('fill', 'red');
    }, function () {
      polygon.attr('fill', 'white');
    });
  }

  Raphael.el.addPart = function (point) {
    if (this.type != 'path') {
      throw new TypeError('addPart can only be used on paths');
    }
    var pathParts = this.attr('path') || [];
    pathParts.push(point);
    this.attr('path', pathParts);
    return this;
  };

  function newPolygon(startX, startY) {
    var path = paper.path().addPart(['M', startX, startY]);

    return {
      path: path,
      addPoint: function (x, y) {
        path.addPart(['L', x, y]);
      },
      closePath: function () {
        path.addPart(['Z']);
      },
      shouldClose: function (x, y) {
        return Math.abs(startX - x) < closeTolerance &&
          Math.abs(startY - y) < closeTolerance;
      }
    };
  }
});

