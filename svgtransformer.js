function SvgTransformer(svg_selector) {
    if (!(this instanceof SvgTransformer)) {
        return new SvgTransformer(svg_selector);
    }
    this._init(svg_selector);
}
SvgTransformer.prototype = {
    _init: function(svg) {
        var $svg = $$(svg)

        this.curScale = 1;
        this.originViewPort = {'width': $svg.width(), 'height': $svg.height()};

        this.$svg = $svg;
        this.$cnt = $svg.parentElement();
        this.$wrapper = this._makeWrapper($svg);
        this._setWrapperSize(this._getViewPortSize());
    }
    ,
    _makeWrapper: function($svg) {
        var $wrapper = $svg.wrap('div');
        $wrapper.css('cssText', 'position: absolute; top: 0; left: 0 padding: 0; margin: 0;')
        
        // TODO: remove (for test only)
        // $wrapper.css('border', '1px solid');
        // $wrapper.css('background', 'blue');

        return $wrapper;
    }
    ,
    _setWrapperSize: function(viewportSize) {
        this.$wrapper.width(viewportSize.width);
        this.$wrapper.height(viewportSize.height);
    }
    ,
    _getWrapperSize: function() {
        var size = {};
        size.width = this.$wrapper.width();
        size.height = this.$wrapper.height();
        return size;
    }
    ,
    _getWrapperCenter: function() {
        var center = {};
        var offset = this.$wrapper.offset();;

        center.cx = (offset.left + this.$wrapper.width()) / 2;
        center.cy = (offset.top + this.$wrapper.height()) / 2;
        return center;
    }
    ,
    _getViewPortSize: function() {
        var viewport = {};
        viewport.width = parseFloat(this.$svg.attr('width'));
        viewport.height = parseFloat(this.$svg.attr('height'));
        return viewport;
    }
    ,
    _setViewportSize: function(viewport) {
        this.$svg.attr('width', viewport.width);
        this.$svg.attr('height', viewport.height);
    }
    ,
    translate : function(x, y) {
        this.$wrapper.offset({'top' : y, 'left': x});
    }
    ,
    move : function(offsetX, offsetY) {
        var offset = this.$wrapper.offset();
        this.$wrapper.offset({'top' : offset.top + offsetY, 'left': offset.left + offsetX});
    }
    ,
    scale: function(scale) {
        if (scale <= 0.01) return false;        // TODO: 0.01 magic

        this.curScale = scale;
        var size = {'width' : this.originViewPort.width * this.curScale, 'height' : this.originViewPort.height * this.curScale};
        this._setWrapperSize(size);
        this._setViewportSize(size);
        return true;
    }
    ,
    zoom : function(addScale) {
        return this.scale(this.curScale + addScale);
    }
    ,
    zoomAroundContainerCenter: function(addScale) {
        var offset = this.$wrapper.offset();

        var containerW = this.$cnt.width();
        var containerH = this.$cnt.height();
        var cx = containerW / 2;
        var cy = containerH / 2;

        var distX = cx - offset.left;
        var distY = cy - offset.top;
        var deltaX = distX / this.curScale * (this.curScale + addScale) - distX;
        var deltaY = distY / this.curScale * (this.curScale + addScale) - distY;
        
        if (!this.zoom(addScale)) return false;
        this.move(-deltaX, -deltaY);
        return true;
    }
    ,
    zoomAroundSvgCenter: function(addScale) {
        return this.scaleAroundSvgCenter(this.curScale + addScale);
    }
    ,
    scaleAroundSvgCenter: function(scale) {
        var centerB = this._getWrapperCenter();
        if (!this.scale(scale)) return false;
        var centerA = this._getWrapperCenter();
        this.move(centerB.cx - centerA.cx, centerB.cy - centerA.cy);
        return true;
    }
    ,
    fitContainer : function () {
        var viewSize = this._getWrapperSize();

        var containerW = this.$cnt.width();
        var containerH = this.$cnt.height();
        var wscale = containerW / viewSize.width;
        var hscale = containerH / viewSize.height;
        var ratio = wscale > hscale 
                  ? hscale 
                  : wscale
                  ;
        
        ratio *= this.curScale;
        this.$wrapper.offset({top: 0, left: 0});

        if (!this.scale(ratio)) return false;
        
        viewSize = this._getWrapperSize();
        var cx = (containerW - viewSize.width) / 2;
        var cy = (containerH - viewSize.height) / 2;
        
        this.move(cx, cy);
        return true;
    }
}
  
  