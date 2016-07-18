import { connect as reduxConnect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isPlainObject } from 'helpers/pureFunctions';

const defaultMapStateToProps = state => ({});
const defaultMapDispatchToProps = dispatch => ({ dispatch });

const wrapActionCreators = actionCreators =>
  dispatch => bindActionCreators(actionCreators, dispatch);

export default function connect(mapStateToProps, mapDispatchToProps, ...otherParams) {
  const finalMapStateToProps = mapStateToProps || defaultMapStateToProps;
  const finalMapDispatchToProps = isPlainObject(mapDispatchToProps)
    ? wrapActionCreators(mapDispatchToProps)
    : mapDispatchToProps || defaultMapDispatchToProps;

  return reduxConnect(finalMapStateToProps, finalMapDispatchToProps,
      ...otherParams);
}
