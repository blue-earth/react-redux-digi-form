import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';

// Fetch profile settings status
export const REQUEST_FETCH_PROFILE_SETTINGS = 'REQUEST_FETCH_PROFILE_SETTINGS';
export const RECEIVE_USER_PROFILE_SETTINGS = 'RECEIVE_USER_PROFILE_SETTINGS';
export const DONE_FETCHING_PROFILE_SETTINGS = 'DONE_FETCHING_PROFILE_SETTINGS';
export const REQUEST_SUBMIT_PROFILE_SETTINGS = 'REQUEST_SUBMIT_PROFILE_SETTINGS';

export const INIT_PROFILE_SETTINGS_STATE = {
  isPageBusy: false,
  data: {}
};

// ------------------------------------
// Actions with reducer
// ------------------------------------
export const requestFetchProfileSettings = createAction(REQUEST_FETCH_PROFILE_SETTINGS);
export const receiveServerUserProfileSettings = createAction(RECEIVE_USER_PROFILE_SETTINGS);
export const doneFetchingProfileSettings = createAction(DONE_FETCHING_PROFILE_SETTINGS);

// ------------------------------------
// Action: saveProfile
// ------------------------------------
export const submitProfileSettings = (data) => {
  const apiURL = `${API_URL}/accounts/api/user/`;
  var formData = new FormData();
  formData.append('first_name', data.firstName);
  formData.append('last_name', data.lastName);
  formData.append('timezone', data.timezone);
  formData.append('avatar', data.avatar);
  // todo: Should only use multipart/form-data
  // if the formData contains a file
  const fetchParams = assignDefaults({
    method: 'PUT',
    body: formData
  }, {'Content-Type': 'multipart/form-data'});

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingProfileSettings());
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingProfileSettings());
    };
  };
  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

export const fetchProfileSettings = () => {
  const fetchParams = assignDefaults({
    method: 'GET'
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveServerUserProfileSettings({
        avatar: value.avatar,
        firstName: value.first_name,
        lastName: value.last_name,
        email: value.email,
        timezone: value.timezone
      }));
      dispatch(doneFetchingProfileSettings());
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingProfileSettings());
    };
  };

  return bind(fetch(`${API_URL}/accounts/api/user/`, fetchParams), fetchSuccess, fetchFail);
};

export const requestSubmitProfileSettings = () => {
  return (dispatch, getState) => {
    const formState = getState().form.profileSettingForm.values;
    dispatch(submitProfileSettings(formState));
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const profileReducer = handleActions({
  REQUEST_FETCH_PROFILE_SETTINGS: (state, action) =>
    Object.assign({}, state, {
      isPageBusy: true
    }),
  DONE_FETCHING_PROFILE_SETTINGS: (state, action) =>
    Object.assign({}, state, {
      isPageBusy: false
    }),
  RECEIVE_USER_PROFILE_SETTINGS: (state, action) =>
    Object.assign({}, state, {
      data: action.payload
    }),
  REQUEST_SUBMIT_PROFILE_SETTINGS: (state, action) => {
    submitProfileSettings(state.formData);
    return Object.assign({}, state, {
      isPageBusy: true
    });
  }
}, INIT_PROFILE_SETTINGS_STATE);

export default profileReducer;
