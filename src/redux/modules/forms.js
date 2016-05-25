// ------------------------------------
// Reducer
// ------------------------------------
var formsReducer = function (state = {}, action) {
  switch (action.type) {
    case 'test':
      return {
        ...state,
        test: action.value
      }
    default:
      return state;
  }
}