import _ from 'lodash';

export const underscoreToCamelCase = underscoredText =>
  underscoredText.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });

export const findIndexById = (objArray, id) =>
  _.findIndex(objArray, function (o) { return o.id === id; });

export const findItemById = (objArray, id) =>
  _.find(objArray, function (o) { return o.id === id; });

export const mergeItemIntoArray = (itemArray, newItem, deepMerge = false) => {
  if (deepMerge) {
    const index = findIndexById(itemArray, newItem.id);
    if (index !== -1) newItem = _.merge({}, itemArray[index], newItem);
  }
  return _.unionBy([newItem], itemArray, 'id');
};

export const buildQueryString = (query) =>
  _.join(_.map(_.toPairs(query), pair => `${pair[0]}=${pair[1]}`), '&');

const fnToString = (fn) => Function.prototype.toString.call(fn);

/**
 * isPlainObject
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
export const isPlainObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return false;
  };

  const proto = typeof obj.constructor === 'function'
    ? Object.getPrototypeOf(obj)
    : Object.prototype;

  if (proto === null) {
    return true;
  };

  const constructor = proto.constructor;

  return typeof constructor === 'function' &&
    constructor instanceof constructor &&
    fnToString(constructor) === fnToString(Object);
};

/**
 * loadScript
 * @param src: js file url.
 * @param id: script tag id.
 * @param callback: callback function to be executed after the js file is loaded.
 */
export const loadScript = (src, id, callback) => {
  var s, r, t;
  r = false;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  if (id) s.id = id;
  s.onload = s.onreadystatechange = function () {
    if (!r && (!this.readyState || this.readyState === 'complete')) {
      r = true;
      if (typeof callback === 'function') callback(s);
    }
  };
  t = document.getElementsByTagName('script')[0];
  t.parentNode.insertBefore(s, t);
};
