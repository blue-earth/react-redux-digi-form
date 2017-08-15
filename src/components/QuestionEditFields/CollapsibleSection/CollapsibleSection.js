import React, {
  Component,
  PropTypes
} from 'react';
import Switch from 'rc-switch';
import SectionTitle from '../SectionTitle';
import TextInput from 'components/TextInput';
import styles from './CollapsibleSection.scss';
import classNames from 'classnames/bind';

var cx = classNames.bind(styles);

class CollapsibleSection extends Component {
  static propTypes = {
    setQuestionInfo: PropTypes.func.isRequired,
    questionPropKey: PropTypes.string.isRequired,
    questionPropValue: PropTypes.string,
    isInitiallyOpened: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    helpText: PropTypes.string
  };

  static defaultProps = {
    isInitiallyOpened: true,
    helpText: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpened: this.props.isInitiallyOpened
    };
  }
  _toggleSectionOpen = () => {
    var isOpened = this.state.isOpened;
    var newIsOpened = !isOpened;
    const {
      setQuestionInfo,
      questionPropKey
    } = this.props;
    this.setState({
      isOpened: newIsOpened
    });
    // if the toggle turns off, update an empty value
    if (!newIsOpened) {
      setQuestionInfo({
        [questionPropKey]: null
      });
    } else {
      // todo: Save the value in the TextInput
    }
  };

  _onValueChanged = (value) => {
    const {
      setQuestionInfo,
      questionPropKey
    } = this.props;
    setQuestionInfo({
      [questionPropKey]: value
    });
  };

  render() {
    const { title } = this.props;
    return (
      <div>
        <div className={styles.switchRow}>
          <div className={styles.switchColLeft}>
            <SectionTitle title={title} />
          </div>
          <div className={styles.switchColRight}>
            <Switch onChange={this._toggleSectionOpen} checked={this.state.isOpened} />
          </div>
        </div>
        <div className={cx('configInputRow', {'hide': !this.state.isOpened})}>
          <TextInput type="text" value={this.props.questionPropValue} onChange={this._onValueChanged} />
        </div>
      </div>
    );
  }
}

export default CollapsibleSection;
