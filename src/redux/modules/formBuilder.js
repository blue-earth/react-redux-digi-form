export const RECEIVE_FORM = 'RECEIVE_FORM';
export const REQUEST_FORM = 'REQUEST_FORM';
export const DONE_FETCHING_FORM = 'DONE_FETCHING_FORM';
export const REQUEST_SUBMIT = 'REQUEST_SUBMIT';
export const DONE_SUBMIT = 'DONE_SUBMIT';
export const SET_ACTIVE_INPUT_NAME = 'SET_ACTIVE_INPUT_NAME';

export const INIT_BUILDER_STATE = {
  id: 0,
  isFetching: false, // indicates the form is being loaded.
  isSubmitting: false, // indicates the form submission is being processed.
  formData: {},
  documents: [
    'http://localhost:3000/doc_example.jpg', // for temp purpose, should fetch from backend.
    'http://localhost:3000/doc_example.jpg' // for temp purpose, should fetch from backend.
  ],
  formConfig: {},
  documentMapping: [],
  activeInputName: '',
  currentQuestion: {},
};

// ------------------------------------
// Action: setActiveInputName
// ------------------------------------
export const setActiveInputName = (inputName) => {
  return {
    type: SET_ACTIVE_INPUT_NAME,
    inputName
  };
}

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
    case SET_ACTIVE_INPUT_NAME:
      return Object.assign({}, state, {
        activeInputName: action.inputName
      });
    default:
      return state;
  };
}

export default formBuilderReducer;