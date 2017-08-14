import React, {
  Component,
  PropTypes
} from 'react';
import Switch from 'rc-switch';
import EditSection from '../EditSection';
import SectionTitle from '../SectionTitle';
import TextInput from 'components/TextInput';
import styles from './CollapsibleSection.scss';

class CollapsibleSection extends Component {
  static propTypes = {
    setQuestionInfo: PropTypes.func.isRequired,
    questionPropKey: PropTypes.string.isRequired,
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
    this.setState({
      isOpened: !isOpened
    });
  };

  _onValueChanged = (value) => {
    const {
      setQuestionInfo,
      questionPropKey
    } = this.props;
    setQuestionInfo({
      [questionPropKey]: event.target.value
    });
  };

  render() {
    const { title } = this.props;
    return (
      <EditSection>
        <div className={styles.switchRow}>
          <div className={styles.switchColLeft}>
            <SectionTitle title={title} />
          </div>
          <div className={styles.switchColRight}>
            <Switch onChange={this._toggleSectionOpen} checked={this.state.isOpened} />
          </div>
        </div>
        <div className={styles.configInputRow}>
          <TextInput type="text" onChange={this._onValueChanged} />
        </div>
      </EditSection>
    );
  }
}

export default CollapsibleSection;
