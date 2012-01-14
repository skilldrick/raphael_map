$(document).ready(function () {
  var width = 400;
  var height = 400;
  var closeTolerance = 5;
  var paper = Raphael('map', width, height);
  var border = paper.rect(0, 0, 400, 400);
  border.attr('stroke', 'black');
  var currentPath = null;
  var shapes = [];

  $('#map').click(function (e) {
    var x = e.offsetX, y = e.offsetY;

    if (!currentPath) {
      currentPath = newPath(x, y);
    } else if (currentPath.shouldClose(x, y)) {
      currentPath.closePath();
      newShape(currentPath.path);
      currentPath = null;
    } else {
      currentPath.addPoint(x, y);
    }
  });

  function newShape(shape) {
    shapes.push(shape);
    shape.attr('fill', 'white');
    shape.hover(function () {
      shape.attr('fill', 'red');
    }, function () {
      shape.attr('fill', 'white');
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

  function newPath(startX, startY) {
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

