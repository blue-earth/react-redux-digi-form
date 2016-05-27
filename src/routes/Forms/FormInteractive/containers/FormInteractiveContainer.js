import { connect } from 'react-redux'
import { INIT_FORM_STATE, prevQuestion, nextQuestion, fetchFormIfNeeded } from 'redux/modules/formInteractive'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the counter:   */

import FormInteractive from '../components/FormInteractive/FormInteractive'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  prevQuestion: () => prevQuestion(),
  nextQuestion: () => nextQuestion(),
  fetchFormIfNeeded: () => fetchFormIfNeeded(),
}

const mapStateToProps = (state) => {
  const { formInteractive } = state
  const {
    id,
    isFetching,
    lastUpdated,
    currentQuestionId,
    form,
    primaryColor
  } = formInteractive || INIT_FORM_STATE
  return {
    id : parseInt(id),
    isFetching,
    currentQuestionId,
    form,
    primaryColor,
    lastUpdated
  }
}

export default connect(mapStateToProps, mapActionCreators)(FormInteractive)
