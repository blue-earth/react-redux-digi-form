import React, {
  Component,
  PropTypes
} from 'react';
import Switch from 'rc-switch';
import { FaCheck } from 'react-icons/lib/fa';
import SectionTitle from '../SectionTitle';
import styles from './CollapsibleSection.scss';
import classNames from 'classnames/bind';

var cx = classNames.bind(styles);

class CollapsibleSection extends Component {
  static propTypes = {
    isInitiallyOpened: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    helpText: PropTypes.string,
    onToggleOpen: PropTypes.func,
    onToggleClosed: PropTypes.func,
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
    this.setState({
      isOpened: newIsOpened
    });
    const { onToggleClosed, onToggleOpen } = this.props;
    if (!newIsOpened) {
      if (typeof onToggleClosed === 'function') {
        onToggleClosed();
      }
    } else {
      if (typeof onToggleOpen === 'function') {
        onToggleOpen();
      }
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
            <Switch checked={this.state.isOpened}
              onChange={this._toggleSectionOpen}
              checkedChildren={<FaCheck />} />
          </div>
        </div>
        {children && <div className={cx('configInputRow', {'hide': !this.state.isOpened})}>
          {children}
        </div>}
      </div>
    );
  }
}

export default CollapsibleSection;
