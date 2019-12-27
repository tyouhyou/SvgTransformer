/* *
 * IMPORTANT NOTE:
 *   This simple query is not for general usage, that means
 *   no detail checking on the arguments or etc. It is just used 
 *   for limited patterns. 
 * 
 *   Since we will not handle multiple element(svg) in one instance,
 *   this implementation just wrap one element in it's instance.
 *   It's different from jQuery.
 * 
 *   So, be careful when pass selector to SvgTransformer constructor,
 *   it should be best practice to pass a dom id, or a dom element object.
 * 
 * Target browsers are chrome and ie11 or above
 * */
(function(global){
    /* 
     * IMPORTANT: 
     *   Only dom selector string or dom element is supported. 
     *   And only the first element of the selector will be taken.
     */
    function $$(selectorOrElement) {
        if (!(this instanceof $$)) {
            return new $$(selectorOrElement);
        }

        if (typeof selectorOrElement == "string") {
            this.element = document.querySelector(selectorOrElement);
        } else {
            this.element = selectorOrElement;
        }
    }
    $$.prototype = {
        element: null,
        wrap: function(tag) {
            var wrapper = document.createElement(tag);
            this.element.parentNode.insertBefore(wrapper, this.element);
            wrapper.appendChild(this.element);
            return new $$(wrapper);
        },
        attr: function(att, value) {
            if (value === undefined) {
                return this.element.getAttribute(att);
            } else {
                this.element.setAttribute(att, value);
            }
        },
        css: function(name, value) {
            if (value === undefined) {
                return this.element.style[name];
            } else {
                this.element.style[name] = value;
            }
        },
        offset: function(setting) {
            if (setting === undefined) {
                return {'top': this.element.offsetTop, 'left': this.element.offsetLeft}
            } else {
                this.css('top', setting.top);
                this.css('left', setting.left);
            }
        },
        width: function(value) {
            if (value === undefined) {
                return parseFloat(window.getComputedStyle(this.element, null).getPropertyValue("width"), 10);
            } else {
                if (typeof(value) === "number") {
                    value += "px";
                }
                this.css('width', value);
            }
        },
        height: function(value) {
            if (value === undefined) {
                return parseFloat(window.getComputedStyle(this.element, null).getPropertyValue("height"), 10);
            } else {
                if (typeof(value) === "number") {
                    value += "px";
                }
                this.css('height', value);
            }
        }
    }

    global.$$ = $$;
})(window);

function SvgTransformer(svg_selector) {
    if (!(this instanceof SvgTransformer)) {
        return new SvgTransformer(svg_selector);
    }
    this._init(svg_selector);
}
SvgTransformer.prototype = {
    _init: function(svg) {
        var $svg = $$(svg)
        this.scale = 1;
        this.originViewPort = {'width': $svg.width(), 'height': $svg.height()};

        this.$svg = $svg;
        this.$wrapper = this._makeWrapper($svg);
        this._setWrapperSize(this._getViewPortSize());
    }
    ,
    // TODO: note, set the display property same as svg (inline, block ect.)
    _makeWrapper: function($svg) {
        var $wrapper = $svg.wrap('div');
        $wrapper.css('cssText', 'position: absolute; top: 0; left: 0; padding: 0; margin: 0;')
        
        // TODO: remove (for test only)
        $wrapper.css('border', '1px solid');
        $wrapper.css('background', 'blue');

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
    zoomAroundCenter: function(addScale) {
        this.zoomToAroundViewCenter(this.scale + addScale);
    }
    ,
    zoomByAroundContainerCenter: function(addScale, containerW, containerH) {
        var offset = this.$wrapper.offset();
        var cx = containerW / 2;
        var cy = containerH / 2;
        
        var distX = cx - offset.left;
        var distY = cy - offset.top;
        var deltaX = distX / this.scale * (this.scale + addScale) - distX;
        var deltaY = distY / this.scale * (this.scale + addScale) - distY;
        
        this.moveBy(-deltaX, -deltaY);
        this.zoomBy(addScale);
    }
    ,
    zoomToAroundViewCenter: function(scale) {
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
        this.$wrapper.offset({top: 0, left: 0});
        this.zoomTo(ratio);
        
        viewSize = this._getWrapperSize();
        var cx = (containerW - viewSize.width) / 2;
        var cy = (containerH - viewSize.height) / 2;
        
        this.moveBy(cx, cy);
    }
}
  
  