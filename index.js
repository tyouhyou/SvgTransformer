
  $(function(){
    var transformer = new SvgTransformer('#mysvg', '#container');
    $zoomin = $('.zoomin');
    $zoomout = $('.zoomout');
    $left = $('.left');
    $right = $('.right');
    $up = $('.up');
    $down = $('.down');
    $expw = $('.expwindow');
    $exps = $('.expsvg');
    $load = $('.load');
    $zoomin.click(function(){
        var $cnt = $('#container');
        transformer.zoomByAroundContainerCenter(0.1, $cnt.width(), $cnt.height());
        // transformer.zoomAroundCenter(0.1);
    });
    $zoomout.click(function(){
        var $cnt = $('#container');
        transformer.zoomByAroundContainerCenter(-0.1, $cnt.width(), $cnt.height());
        // transformer.zoomAroundCenter(-0.1);
    });
    $left.click(function(){
      transformer.moveBy(-10, 0);
    });
    $right.click(function() {
      transformer.moveBy(10, 0);
    });
    $up.click(function() {
      transformer.moveBy(0, -10);
    });
    $down.click(function(){
      transformer.moveBy(0, 10);
    });
    $expw.click(function(){
      var $cnt = $('#container');
      var w = $cnt.width() + 50;
      $cnt.width(w);
    });
    $exps.click(function(){
        // DO NOTHING
    });
    $load.click(function(){
        var $cnt = $('#container');
        transformer.fitToContainer($cnt.width(), $cnt.height());
    })
  });