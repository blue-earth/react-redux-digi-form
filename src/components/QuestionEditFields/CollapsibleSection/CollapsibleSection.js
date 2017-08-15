import React, {
  Component,
  PropTypes
} from 'react';
import Switch from 'rc-switch';
import SectionTitle from '../SectionTitle';
import styles from './CollapsibleSection.scss';
import classNames from 'classnames/bind';

var cx = classNames.bind(styles);

class CollapsibleSection extends Component {
  static propTypes = {
    questionPropKey: PropTypes.string.isRequired,
    isInitiallyOpened: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    helpText: PropTypes.string,
    onToggleOpen: PropTypes.func,
    children: PropTypes.node
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
    const { onToggleOpen, questionPropKey } = this.props;
    this.setState({
      isOpened: newIsOpened
    });
    // if the toggle turns off, update an empty value
    if (!newIsOpened) {
      onToggleOpen('', questionPropKey);
    }
  };

  render() {
    const { title, children } = this.props;
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
          {children}
        </div>
      </div>
    );
  }
}

export default CollapsibleSection;
