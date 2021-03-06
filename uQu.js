/* *
 * IMPORTANT NOTE:
 *   This simple query is not for general usage, that means
 *   no detail checking on the arguments or etc. It is just used 
 *   for limited patterns. 
 * 
 *   Since we will not handle multiple elements in one instance,
 *   this implementation just take one element in it's instance.
 *   It's different from jQuery.
 * 
 *   Be careful when pass selector to SvgTransformer constructor,
 *   it should be best practice to pass a dom id, or a dom element object.
 * 
 * Target browsers are chrome, edge and ie11 or above
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
            this._element = document.querySelector(selectorOrElement);
        } else {
            this._element = selectorOrElement;
        }
    }
    $$.prototype = {
        // IE has poor support for parentElement
        parentElement: function() {
            var ret = null;
            if (!!this._element.parentNode && Node.ELEMENT_NODE === this._element.parentNode.nodeType) {
                ret = new $$(this._element.parentNode);
            }
            return ret;
        },
        firstChildElement: function() {
            var ret = null;
            if (this._element.hasChildNodes()) {
                for (var i=0; i<this._element.childNodes.length; i++) {
                    if (Node.ELEMENT_NODE === this._element.childNodes[i].nodeType) {
                        ret = new $$(this._element.childNodes[i]);
                        break;
                    }
                }
            }
            return ret;
        },
        wrap: function(tag, namespace) {
            var wrapper;
            if (!!namespace) {
                wrapper = document.createElementNS(namespace, tag)
            } else {
                wrapper = document.createElement(tag);
            }
            this._element.parentNode.insertBefore(wrapper, this._element);
            wrapper.appendChild(this._element);
            return new $$(wrapper);
        },
        wrapInner: function(tag, namespace) {
            var wrapper;
            if (!!namespace) {
                wrapper = document.createElementNS(namespace, tag);
            } else {
                wrapper = document.createElement(tag);
            }
            while (this._element.firstChild) {
                wrapper.appendChild(this._element.removeChild(this._element.firstChild));
            }
            this._element.appendChild(wrapper);
            return $$(wrapper);
        },
        attr: function(att, value) {
            if (value === undefined) {
                return this._element.getAttribute(att);
            } else {
                this._element.setAttribute(att, value);
            }
        },
        css: function(name, value) {
            if (value === undefined) {
                return this._element.style[name];
            } else {
                this._element.style[name] = value;
            }
        },
        offset: function(setting) {
            if (setting === undefined) {
                return {'top': this._element.offsetTop, 'left': this._element.offsetLeft}
            } else {
                this.css('top', typeof(setting.top) === "number" ? setting.top + 'px' : setting.top);
                this.css('left', typeof(setting.left) === "number" ? setting.left + 'px' : setting.left);
            }
        },
        width: function(value) {
            if (value === undefined) {
                return parseFloat(window.getComputedStyle(this._element, null).getPropertyValue("width"), 10);
            } else {
                if (typeof(value) === "number") {
                    value += "px";
                }
                this.css('width', value);
            }
        },
        height: function(value) {
            if (value === undefined) {
                return parseFloat(window.getComputedStyle(this._element, null).getPropertyValue("height"), 10);
            } else {
                if (typeof(value) === "number") {
                    value += "px";
                }
                this.css('height', value);
            }
        },
        on: function(eventName, listener) {
            this._element.addEventListener(eventName, listener);
        }
    }

    global.$$ = $$;
})(window);