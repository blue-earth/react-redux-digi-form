import React, { Component, PropTypes } from 'react';
import BuilderHeader from 'components/Headers/BuilderHeader';
import ElementsListView from '../ElementsListView/ElementsListView';
import PageView from '../PageView/PageView';
import QuestionEditView from '../QuestionEditView/QuestionEditView';
import styles from './FormBuilder.scss'

class FormBuilder extends Component {

  static propTypes = {
    /*
     * Form ID
     */
    id: PropTypes.number.isRequired,

    /*
     * form: form_data of response, consists of questions and logics.
     */
    form: PropTypes.object.isRequired,

    /*
     * isFetching: Redux state that indicates whether the requested form is being fetched from backend
     */
    isFetching: PropTypes.bool.isRequired,

    /*
     * isVerifying: Redux state that indicates the status whether the form is being submitted
     */
    isSubmitting: PropTypes.bool.isRequired,

  };

  componentWillMount() {

  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {

  }

  render() {
    const { params } = this.props;
    return (
      <div className={styles.formBuilderContainer}>
        <BuilderHeader />
        <div className={styles.formBuilderContent}>
          <div className={styles.leftPanel}>
            {params.id
              ? <ElementsListView />
              : <QuestionEditView />
            }
          </div>
          <div className={styles.rightPanel}>
            <PageView />
          </div>
        </div>
      </div>
    )
  }
}

export default FormBuilder;
