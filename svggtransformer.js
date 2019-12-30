function SvggTransformer(svg, svgG) {
    if (!(this instanceof SvggTransformer)) {
          return new SvggTransformer(svg, svgG);
      }
      this._init(svg, svgG);
  }
  SvggTransformer.prototype = {
    _init : function(svg, hasgwrap) {
        var $svg = $$(svg);
        
        if (!hasgwrap) {
            $svg.wrapInner('g', true);
        }
        
        this.$svg = $svg;
        this.$cnt = $svg.parentElement();
        this.$svgG = $svg.firstChildElement();

        this.curScale = 1;
        this.translateX = 0;
        this.translateY = 0;
    }
    ,
    _transformAroundContainerCenter : function() {
        var tl = " scale(" + this.curScale + ")"
               + " translate(" + this.translateX + "," + this.translateY + ")"
               ;
      
        var vb = this.$svg.attr("viewBox");
        var vbs = vb.split(" ");
        
        var cx = (1 - this.curScale) * parseFloat(this.$cnt.width()) / 2;
        var cy = (1 - this.curScale) * parseFloat(this.$cnt.height()) / 2;

        tl = " translate(" + cx + "," + cy + ")" + tl;
        this.$svgG.attr('transform', tl);
    }
    ,
    expandViewPortToFitContainer : function() {
        var w = parseFloat(this.$svg.attr('width'));
        var h = parseFloat(this.$svg.attr('height'));

        var fitToW = this.$cnt.width();
        var fitToH = this.$cnt.height();

        var wscale = fitToW / w;
        var hscale = fitToH / h;
        
        this.$svg.attr('width', fitToW);
        this.$svg.attr('height', fitToH);
        
        var vb = this.$svg.attr("viewBox");
        var vbs = vb.split(" ");
        var vbw = parseFloat(vbs[2]);
        var vbh = parseFloat(vbs[3]);
        w = vbw * wscale;
        h = vbh * hscale;
        this.$svg.attr('viewBox', vbs[0] + " " + vbs[1] + " " + w + " " + h);
    }
    ,
    fitContainer : function() {
        var w = parseFloat(this.$svg.attr('width'));
        var h = parseFloat(this.$svg.attr('height'));
        
        var fitToW = this.$cnt.width();
        var fitToH = this.$cnt.height();

        var wscale = fitToW / w;
        var hscale = fitToH / h;
        var ratio = wscale > hscale 
                  ? hscale 
                  : wscale
                  ;

        this.expandViewPortToFitContainer();
        this.move((fitToW - w) / 2, (fitToH - h) / 2);
        this.zoomAroundContainerCenter(ratio - this.curScale);
    }
    ,
    zoomAroundContainerCenter : function(addScale) {
        this.curScale += addScale;
        if (this.curScale < 0) this.curScale = 0;
        this._transformAroundContainerCenter();
    }
    ,
    move : function(deltaX, deltaY) {
        this.translateX += deltaX;
        this.translateY += deltaY;
        this._transformAroundContainerCenter();
    }
    // ,
    // moveVBxy : function(deltaX, deltaY) {
    //     var vb = this.svg.getAttribute("viewBox");
    //     var vbs = vb.split(" ");
    //     var x = parseFloat(vbs[0]) - deltaX;
    //     var y = parseFloat(vbs[1]) - deltaY;
    //     this.svg.setAttribute('viewBox', x + " " + y + " " + vbs[2] + " " + vbs[3]);
    // }
  }