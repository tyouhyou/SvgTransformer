function SvgTransformer(svg_selector) {
    if (!(this instanceof SvgTransformer)) {
        return new SvgTransformer(svg_selector);
    }
    this._init(svg_selector);
}
SvgTransformer.prototype = {
    _init: function(svg) {
        var $svg = $(svg)
        this.svg = $svg[0];

        this.scale = 1;
        this.originViewPort = {'width': $svg.width(), 'height': $svg.height()};
        this._makeWrapper($svg);
        this.originOffset = this.$wrapper.offset();
    }
    ,
    // TODO: note, set the display property same as svg (inline, block ect.)
    _makeWrapper: function($svg) {
        var svgid = $svg.attr('id');
        $svg.wrap(function() {
            return '<div id="' + svgid + '_wrapper"></div>';
        });
        
        this.$wrapper = $svg.parent();
        this.$wrapper.css({'relative': 'relative', 
                           'padding': '0', 
                           'margin': '0',
                           'top': '0',
                           'left': '0'
                        });
        this._setWrapperSize(this._getViewPortSize());

        // TODO: remove
        this.$wrapper.css('border', '1px solid');
        this.$wrapper.css('background', 'blue');

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
        viewport.width = parseFloat(this.svg.getAttribute('width'));
        viewport.height = parseFloat(this.svg.getAttribute('height'));
        return viewport;
    }
    ,
    _setViewportSize: function(viewport) {
        this.svg.setAttribute('width', viewport.width);
        this.svg.setAttribute('height', viewport.height);
    }
    ,
    moveBy : function(offsetX, offsetY) {
        var offset = this.$wrapper.offset();
        this.$wrapper.offset({'top' : offset.top + offsetY, 'left': offset.left + offsetX});
    }
    ,
    moveTo : function(x, y) {
        this.$wrapper.offset({'top' : y, 'left': x});
    }
    ,
    zoomBy : function(addScale) {
        this.scale += addScale;
        this.zoomTo(this.scale);
    }
    ,
    zoomTo: function(toScale) {
        this.scale = toScale >= 0 ? toScale : 0;
        var size = {'width' : this.originViewPort.width * this.scale, 'height' : this.originViewPort.height * this.scale};
        this._setWrapperSize(size);
        this._setViewportSize(size);
    }
    ,
    zoomAroundCenter(addScale) {
        this.zoomToAroundViewCenter(this.scale + addScale);
    }
    ,
    zoomByAroundContainerCenter(addScale, containerW, containerH) {
        var offset = this.$wrapper.offset();
        var cx = containerW / 2;
        var cy = containerH / 2;
        
        var distX = cx - offset.left + this.originOffset.left;
        var distY = cy - offset.top + this.originOffset.top;
        var deltaX = distX / this.scale * (this.scale + addScale) - distX;
        var deltaY = distY / this.scale * (this.scale + addScale) - distY;
        
        this.moveBy(-deltaX, -deltaY);
        this.zoomBy(addScale);
    }
    ,
    zoomToAroundViewCenter(scale) {
        var centerB = this._getWrapperCenter();
        this.zoomTo(scale);
        var centerA = this._getWrapperCenter();
        this.moveBy(centerB.cx - centerA.cx, centerB.cy - centerA.cy);
    }
    ,
    fitToContainer : function (containerW, containerH) {
        var viewSize = this._getWrapperSize();
        var wscale = containerW / viewSize.width;
        var hscale = containerH / viewSize.height;
        var ratio = wscale > hscale 
                  ? hscale 
                  : wscale
                  ;
        
        ratio *= this.scale;
        this.$wrapper.offset(this.originOffset);
        this.zoomTo(ratio);
        
        viewSize = this._getWrapperSize();
        var cx = (containerW - viewSize.width) / 2;
        var cy = (containerH - viewSize.height) / 2;
        
        this.moveBy(cx, cy);
    }
}
  
  