import _ from 'lodash'

export const underscoreToCamelCase = underscoredText => {
  return underscoredText.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

export const findIndexById = (objArray, id) => {
  return _.findIndex(objArray, function(o) { return o.id == id });
}

export const mergeItemIntoArray = (itemArray, newItem) => {
  const index = findIndexById(itemArray, newItem.id);
  if (index !== -1) newItem = _.merge({}, itemArray[index], newItem);
  return _.unionBy([newItem], itemArray, 'id');
}
