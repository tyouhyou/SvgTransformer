
  (function(){
    var transformer = new SvgTransformer('#mysvg');
    $zoomin = $$('.zoomin').element;
    $zoomout = $$('.zoomout').element;
    $left = $$('.left').element;
    $right = $$('.right').element;
    $up = $$('.up').element;
    $down = $$('.down').element;
    $expw = $$('.expwindow').element;
    $exps = $$('.expsvg').element;
    $load = $$('.load').element;
    $zoomin.addEventListener( 'click', function(){
        var $cnt = $$('#container');
        transformer.zoomByAroundContainerCenter(0.1, $cnt.width(), $cnt.height());
        // transformer.zoomAroundCenter(0.1);
    });
    $zoomout.addEventListener('click', function(){
        var $cnt = $$('#container');
        transformer.zoomByAroundContainerCenter(-0.1, $cnt.width(), $cnt.height());
        // transformer.zoomAroundCenter(-0.1);
    });
    $left.addEventListener('click', function(){
      transformer.moveBy(-10, 0);
    });
    $right.addEventListener('click', function() {
      transformer.moveBy(10, 0);
    });
    $up.addEventListener('click', function() {
      transformer.moveBy(0, -10);
    });
    $down.addEventListener('click', function(){
      transformer.moveBy(0, 10);
    });
    $expw.addEventListener('click', function(){
      var $cnt = $$('#container');
      var w = $cnt.width() + 50;
      $cnt.width(w);
    });
    $exps.addEventListener('click', function(){
        // DO NOTHING
    });
    $load.addEventListener('click', function(){
        var $cnt = $$('#container');
        transformer.fitToContainer($cnt.width(), $cnt.height());
    })
  })();