import _ from 'lodash';

export const underscoreToCamelCase = underscoredText => {
  return underscoredText.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
};

export const findIndexById = (objArray, id) => {
  return _.findIndex(objArray, function (o) { return o.id === id; });
};

export const findItemById = (objArray, id) => {
  return _.find(objArray, function (o) { return o.id === id; });
};

export const mergeItemIntoArray = (itemArray, newItem, deepMerge = false) => {
  if (deepMerge) {
    const index = findIndexById(itemArray, newItem.id);
    if (index !== -1) newItem = _.merge({}, itemArray[index], newItem);
  }
  return _.unionBy([newItem], itemArray, 'id');
};

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
