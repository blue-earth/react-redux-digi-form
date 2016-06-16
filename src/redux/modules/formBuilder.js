export const RECEIVE_FORM = 'RECEIVE_FORM';
export const REQUEST_FORM = 'REQUEST_FORM';
export const DONE_FETCHING_FORM = 'DONE_FETCHING_FORM';
export const REQUEST_SUBMIT = 'REQUEST_SUBMIT';
export const DONE_SUBMIT = 'DONE_SUBMIT';

export const INIT_BUILDER_STATE = {
  id: 0,
  isFetching: false, // indicates the form is being loaded.
  isSubmitting: false, // indicates the form submission is being processed.
  form: {},
  currentElement: {}
};

// ------------------------------------
// Reducer
// ------------------------------------
const formBuilderReducer = (state = INIT_BUILDER_STATE, action) => {
  switch (action.type) {
    case RECEIVE_FORM:
      return Object.assign({}, state, {
        id: action.id
      });
    case REQUEST_FORM:
      return Object.assign({}, state, {
        isFetching: true
      });
    case DONE_FETCHING_FORM:
      return Object.assign({}, state, {
        isFetching: false
      });
    case REQUEST_SUBMIT:
      return Object.assign({}, state, {
        isSubmitting: true
      });
    case DONE_SUBMIT:
      return Object.assign({}, state, {
        isSubmitting: false
      });
    default:
      return state;
  };
}

export default formBuilderReducer;