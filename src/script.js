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
      var point = getPointFromEvent(e);

      if (mode.is('draw')) {
        draw(point);
      } else if (mode.is('delete')) {
        del(point);
      } else if (mode.is('select')) {
        select(point);
      }
    });

    $('#map').mousemove(function (e) {
      //console.log(getPointFromEvent(e));
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

  function getPointFromEvent(e) {
    var $el = $(e.currentTarget);
    var x = e.pageX - $el.offset().left;
    var y = e.pageY - $el.offset().top;
    return {x: x, y: y};
  }

  function select(point) {
    var el = paper.getElementByPoint(point.x, point.y);
    if (el) {
      selection && selection.deselect();
      selection = el;
      selection.select();
    } else {
      selection && selection.deselect();
      selection = null;
    }
  }

  function del(point) {
    var el = paper.getElementByPoint(point.x, point.y);
    if (el) {
      el.unhover(polyOnHover, polyOffHover);
      el.remove();
      selection = null;
    }
  }

  function draw(point) {
    if (!currentPolygon) {
      currentPolygon = newPolygon(point);
    } else if (currentPolygon.shouldClose(point)) {
      currentPolygon.closePath();
      savePolygon(currentPolygon.path);
      currentPolygon = null;
    } else {
      currentPolygon.addPoint(point);
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

  function newPolygon(startPoint) {
    var path = paper.path().addPart(['M', startPoint.x, startPoint.y]);

    return {
      path: path,
      addPoint: function (point) {
        path.addPart(['L', point.x, point.y]);
      },
      closePath: function () {
        path.addPart(['Z']);
      },
      shouldClose: function (point) {
        return Math.abs(startPoint.x - point.x) < closeTolerance &&
          Math.abs(startPoint.y - point.y) < closeTolerance;
      }
    };
  }

  $(document).ready(function () {
    init();
  });
})();
