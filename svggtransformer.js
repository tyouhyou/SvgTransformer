function SvggTransformer(svg, hasgwrap) {
    if (!(this instanceof SvggTransformer)) {
          return new SvggTransformer(svg, hasgwrap);
      }
      this._init(svg, hasgwrap);
  }
  SvggTransformer.prototype = {
    _init : function(svg, hasgwrap) {
        var $svg = $$(svg);
        
        if (!hasgwrap) {
            $svg.wrapInner('g', 'http://www.w3.org/2000/svg');
        }
        
        this.$svg = $svg;
        this.$cnt = $svg.parentElement();
        this.$svgG = $svg.firstChildElement();

        this.curScale = 1;
        this.translateX = 0;
        this.translateY = 0;
    }
    ,
    _transform : function(scale, translateX, translateY) {
        var tl = " scale(" + scale + ")"
               + " translate(" + translateX + "," + translateY + ")"
               ;
        this.$svgG.attr('transform', tl);
    }
    ,
    expandViewPortToFitContainer : function() {
        // get viewport size before expand
        var w = parseFloat(this.$svg.attr('width'));
        var h = parseFloat(this.$svg.attr('height'));

        var fitToW = this.$cnt.width();
        var fitToH = this.$cnt.height();
        
        // expand viewport.
        // NOTE : ADD UNIT IF NECESSARY
        this.$svg.attr('width', fitToW);
        this.$svg.attr('height', fitToH);

        var wscale = fitToW / w;
        var hscale = fitToH / h;
        
        var vb = this.$svg.attr("viewBox");
        var vbs = vb.split(" ");
        var vbw = parseFloat(vbs[2]);
        var vbh = parseFloat(vbs[3]);

        // re-size the viewbox at the same ratio,
        vbw *= wscale;
        vbh *= hscale;
        this.$svg.attr('viewBox', vbs[0] + " " + vbs[1] + " " + vbw + " " + vbh);
    }
    ,
    /* NOTE: one time only before all other operation */
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
        this.scaleAroundContainerCenter(ratio * this.curScale);
    }
    ,
    zoomAroundContainerCenter : function(addScale) {
        this.scaleAroundContainerCenter(this.curScale + addScale);
    }
    ,
    scaleAroundContainerCenter : function(newScale) {
        if (newScale < 0.01) return;

        var ctx = this.$cnt.width() / 2;
        var cty = this.$cnt.height() / 2;

        var dtx = ctx / this.curScale - ctx / newScale;
        var dty = cty / this.curScale - cty / newScale;
        
        var tx = this.translateX - dtx;
        var ty = this.translateY - dty;

        this._transform(newScale, tx, ty);

        this.translateX = tx;
        this.translateY = ty;
        this.curScale = newScale;
    }
    ,
    move : function(deltaX, deltaY) {
        this.translateX += deltaX / this.curScale;
        this.translateY += deltaY / this.curScale;

        this._transform(this.curScale, this.translateX, this.translateY);
    }
  }