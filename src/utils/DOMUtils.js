/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

export function updateTag(tagName, keyName, keyValue, attrName, attrValue) {
  const node = document.head.querySelector(
    `${tagName}[${keyName}="${keyValue}"]`,
  );
  if (node && node.getAttribute(attrName) === attrValue) return;

  // Remove and create a new tag in order to make it work with bookmarks in Safari
  if (node) {
    node.parentNode.removeChild(node);
  }
  if (typeof attrValue === 'string') {
    const nextNode = document.createElement(tagName);
    nextNode.setAttribute(keyName, keyValue);
    nextNode.setAttribute(attrName, attrValue);
    document.head.appendChild(nextNode);
  }
}

export function updateMeta(name, content) {
  updateTag('meta', 'name', name, 'content', content);
}

export function updateCustomMeta(property, content) {
  updateTag('meta', 'property', property, 'content', content);
}

export function updateLink(rel, href) {
  updateTag('link', 'rel', rel, 'href', href);
}
// custom getBoundingClientRect , this has been implemented for iOS issues
export function getAbsoluteBoundingRect(el) {
  const doc = document;
  const win = window;
  const { body } = doc;
  // pageXOffset and pageYOffset work everywhere except IE <9.
  let offsetX =
    win.pageXOffset !== undefined
      ? win.pageXOffset
      : (doc.documentElement || body.parentNode || body).scrollLeft;
  let offsetY =
    win.pageYOffset !== undefined
      ? win.pageYOffset
      : (doc.documentElement || body.parentNode || body).scrollTop;
  const rect = el.getBoundingClientRect();

  if (el !== body) {
    let parent = el.parentNode;

    // The element's rect will be affected by the scroll positions of
    // *all* of its scrollable parents, not just the window, so we have
    // to walk up the tree and collect every scroll offset. Good times.
    while (parent !== body) {
      offsetX += parent.scrollLeft;
      offsetY += parent.scrollTop;
      parent = parent.parentNode;
    }
  }

  return {
    bottom: rect.bottom + offsetY,
    height: rect.height,
    left: rect.left + offsetX,
    right: rect.right + offsetX,
    top: rect.top + offsetY,
    width: rect.width,
  };
}

export function getPosition(element) {
  if (!element) {
    return {};
  }
  const domElement = element;
  let xPosition = 0;
  let yPosition = 0;
  const coordinates = getAbsoluteBoundingRect(domElement);
  xPosition = coordinates.left;
  yPosition = coordinates.top;
  return { x: xPosition, y: yPosition };
}

export function appendScriptToHead({ scriptUrl, callback }) {
  return (function attachScript(d, myElement) {
    const fjs = d.getElementsByTagName(myElement)[0];
    const scriptElement = {};
    const js = d.createElement(myElement);
    js.src = scriptUrl;
    fjs.parentNode.insertBefore(js, fjs);

    scriptElement._e = [];
    scriptElement.ready = function ready(f) {
      scriptElement._e.push(f);
    };
    scriptElement.onload =
      typeof callback === 'function' ? callback : undefined;

    return scriptElement;
  })(document, 'script');
}

export const getOuterHeight = elememt => {
  if (typeof window !== 'object') {
    return null;
  }
  let height = elememt.clientHeight;
  const computedStyle = window.getComputedStyle(elememt);
  height += parseInt(computedStyle.marginTop, 10);
  height += parseInt(computedStyle.marginBottom, 10);
  height += parseInt(computedStyle.paddingTop, 10);
  height += parseInt(computedStyle.paddingBottom, 10);
  height += parseInt(computedStyle.borderTopWidth, 10);
  height += parseInt(computedStyle.borderBottomWidth, 10);
  return height;
};
