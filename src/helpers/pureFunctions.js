import _ from 'lodash'

export const underscoreToCamelCase = underscoredText =>
  underscoredText.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); })

export const findIndexById = (objArray, id) => {
  return _.findIndex(objArray, function(o) { return o.id == id })
}

export const mergeItemIntoArray = (itemArray, newItem) => {
  return _.unionBy([newItem], itemArray, 'id')  
}
