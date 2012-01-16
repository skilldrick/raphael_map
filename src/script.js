(function () {
  var width = 300;
  var height = 300;
  var closeTolerance = 5;
  var paper;
  var currentPolygon = null;
  var selection = null;

  function init() {
    $('#map').css({width: width, height: height});
    paper = Raphael('map', width, height);
    var border = paper.rect(0, 0, width, height);
    border.attr('stroke', 'black');
    mode.set('draw');

    $('#map').click(function (e) {
      var x = e.offsetX, y = e.offsetY;
      console.log

      if (mode.is('draw')) {
        draw(x, y);
      } else if (mode.is('delete')) {
        del(x, y);
      } else if (mode.is('select')) {
        select(x, y);
      }
    });

    $('#draw').click(function () {
      mode.set('draw');
    });

    $('#delete').click(function () {
      mode.set('delete');
    });

    $('#select').click(function () {
      mode.set('select');
    });
  }

  var mode = (function () {
    var currentMode;

    return {
      set: function (newMode) {
        currentMode = newMode;
        $('button').removeClass('current');
        $('#' + newMode).addClass('current');
      },
      get: function () {
        return currentMode;
      },
      is: function (mode) {
        return currentMode === mode;
      }
    };
  })();

  function select(x, y) {
    var el = paper.getElementByPoint(x, y);
    if (el) {
      selection && selection.deselect();
      selection = el;
      selection.select();
    } else {
      selection && selection.deselect();
      selection = null;
    }
  }

  function del(x, y) {
    var el = paper.getElementByPoint(x, y);
    if (el) {
      el.unhover(polyOnHover, polyOffHover);
      el.remove();
      selection = null;
    }
  }

  function draw(x, y) {
    if (!currentPolygon) {
      currentPolygon = newPolygon(x, y);
    } else if (currentPolygon.shouldClose(x, y)) {
      currentPolygon.closePath();
      savePolygon(currentPolygon.path);
      currentPolygon = null;
    } else {
      currentPolygon.addPoint(x, y);
    }
  }

  function polyOnHover() {
    this.attr('fill', 'red');
  }
  function polyOffHover() {
    this.attr('fill', 'white');
  }

  function savePolygon(polygon) {
    polygon.attr('fill', 'white');
    polygon.hover(polyOnHover, polyOffHover);
  }

  Raphael.el.select = function () {
    this.attr('stroke', 'green');
    window.current = this;
  };

  Raphael.el.deselect = function () {
    this.attr('stroke', 'black');
    window.current = null;
  };

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

  $(document).ready(function () {
    init();
  });
})();
