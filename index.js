
  (function(){
    var transformer = new SvggTransformer('#mysvg');
    $zoomin = $$('.zoomin');
    $zoomout = $$('.zoomout');
    $left = $$('.left');
    $right = $$('.right');
    $up = $$('.up');
    $down = $$('.down');
    $expwx = $$('.expwX');
    $expsvg = $$('.expsvg');
    $load = $$('.load');
    $expwy = $$('.expwY');
    $zoomin.on( 'click', function(){
        transformer.zoomAroundContainerCenter(0.1);
    });
    $zoomout.on('click', function(){
      transformer.zoomAroundContainerCenter(-0.1);
    });
    $left.on('click', function(){
      transformer.move(-10, 0);
    });
    $right.on('click', function() {
      transformer.move(10, 0);
    });
    $up.on('click', function() {
      transformer.move(0, -10);
    });
    $down.on('click', function(){
      transformer.move(0, 10);
    });
    $expwx.on('click', function(){
      var $cnt = $$('#container');
      var w = $cnt.width() + 50;
      $cnt.width(w);
    });
    $expwy.on('click', function(){
      var $cnt = $$('#container');
      var w = $cnt.height() + 30;
      $cnt.height(w);
    });
    $expsvg.on('click', function(){
        transformer.expandViewPortToFitContainer();
    });
    $load.on('click', function(){
        transformer.fitContainer();
    })
  })();