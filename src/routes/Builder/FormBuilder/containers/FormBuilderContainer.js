import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { INIT_BUILDER_STATE } from 'redux/modules/formBuilder';

import FormBuilder from '../components/FormBuilder';

const mapActionCreators = {
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(mapActionCreators, dispatch);
}

const mapStateToProps = (state) => {
  const { formBuilder } = state;
  const {
    id,
    isFetching,
    isSubmitting,
    form
  } = formBuilder || INIT_FORM_STATE;
  return {
    id: parseInt(id),
    isFetching,
    isSubmitting,
    form
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
