function SvggTransformer(svg, svgG) {
    if (!(this instanceof SvggTransformer)) {
          return new SvggTransformer(svg, svgG);
      }
      this._init(svg, svgG);
  }
  SvggTransformer.prototype = {
    _init : function(svg, haswrapg) {
        this.$svg = $$(svg);
        if (!haswrapg) {
            var s = this.$svg._element.innerHTML;
            var g = '<g>' + s + '</g>';
            this.$svg._element.innerHTML = g;
        }

        // this.$svgG = $$(svgG); TODO: get from g child

        this.curScale = 1;
        this.translateX = 0;
        this.translateY = 0;
    }
    ,
    // scale svg or svg group around center
    _transform : function() {
        var tl = " scale(" + this.curScale + ")"
               + " translate(" + this.translateX + "," + this.translateY + ")"
               ;
      
        if (!this.svgG) {
                this.svg.removeAttribute('transfrom');
                this.svg.setAttribute('transform', tl);
        } else {
            var vb = this.svg.getAttribute("viewBox");
            var vbs = vb.split(" ");
            
            var cx = (1 - this.curScale) * parseFloat(vbs[2]) / 2;
            var cy = (1 - this.curScale) * parseFloat(vbs[3]) / 2;
    
            tl = " translate(" + cx + "," + cy + ")" + tl;
            
            this.svgG.removeAttribute('transfrom');
            this.svgG.setAttribute('transform', tl);
        }
    }
    ,
    _expand: function(addX, addY) {
        if (!this.svgG) return; // if <g> is not used, do not expand.
        
        
        var w = parseFloat(this.svg.getAttribute('width'));
        var h = parseFloat(this.svg.getAttribute('height'));
        
        this.svg.setAttribute('width', w + addX);
        this.svg.setAttribute('height', h + addY);
        
        var vb = this.svg.getAttribute("viewBox");
        var vbs = vb.split(" ");
        var vbw = parseFloat(vbs[2]);
        var vbh = parseFloat(vbs[3]);
        w = vbw + addX;
        h = vbh + addY;
        this.svg.setAttribute('viewBox', vbs[0] + " " + vbs[1] + " " + w + " " + h);
    }
    ,
    fitContainer : function(fitToW, fitToH)
    {
        var w = parseFloat(this.svg.getAttribute('width'));
        var h = parseFloat(this.svg.getAttribute('height'));
        
        var wscale = fitToW / w;
        var hscale = fitToH / h;
        var ratio = wscale > hscale 
                  ? hscale 
                  : wscale
                  ;
    
        if (!this.svgG) {
            this.curScale = ratio;
            this.translateX = (fitToW - w) / 2 / this.curScale;
            this.translateY = (fitToH - h) / 2 / this.curScale;
            this._transform();
        } else {
            this.expand(fitToW - w, fitToH - h);
            this.move((fitToW - w) / 2, (fitToH - h) / 2);
            this.zoom(ratio - this.curScale);
        }
    }
    ,
    zoom : function(addScale) {
        this.curScale += addScale;
        if (this.curScale < 0) this.curScale = 0;
        this._transform();
    }
    ,
    move : function(deltaX, deltaY) {
        this.translateX += deltaX;
        this.translateY += deltaY;
        this._transform();
    }
    ,
    moveVBxy : function(deltaX, deltaY) {
        var vb = this.svg.getAttribute("viewBox");
        var vbs = vb.split(" ");
        var x = parseFloat(vbs[0]) - deltaX;
        var y = parseFloat(vbs[1]) - deltaY;
        this.svg.setAttribute('viewBox', x + " " + y + " " + vbs[2] + " " + vbs[3]);
    }
  }