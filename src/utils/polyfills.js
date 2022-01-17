const JQueryWrapper = function JQueryWrapper(el) {
  this.el = el;
  return this;
};

JQueryWrapper.prototype.remove = function remove() {
  const element = document.querySelectorAll(this.el);
  if (element.length && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

const jQuery$ = function jQuery(el) {
  const instance = new JQueryWrapper(el);
  return instance;
};

export const jQueryFn = function jQueryFn() {
  return {
    $: jQuery$,
    jQuery: JQueryWrapper,
  };
};

export function closestPolyfill() {
  if (typeof window !== 'undefined' && typeof window.Element !== 'undefined') {
    return;
  }

  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      let el = this;

      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }
}
