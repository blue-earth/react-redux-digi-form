import React, {
  Component,
  PropTypes
} from 'react';
import styles from './ProfileMenu.scss';
import classNames from 'classnames/bind';
import ReactDOM from 'react-dom';

const cx = classNames.bind(styles);

class ProfileMenu extends Component {
  static propTypes = {
    children: PropTypes.node,
    list: PropTypes.array,
    onClick: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.mounted = true;
  }
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, false);
  }
  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, false);
  }
  handleDocumentClick = (event) => {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        this.setState({ isOpen: false });
      }
    }
  }

  toggleOpen = () => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleClick = (event) => {
    this.props.onClick(event.currentTarget.getAttribute('data-url'));
  }
  render() {
    const {children, list} = this.props;
    return (
      <div className={cx('profileMenuSection')} onMouseDown={this.toggleOpen}>
        {children}
        <div className={cx('profileMenu', {hide: !this.state.isOpen})}>
          <div className={cx('linkWrapper')}>
            <ul className={cx('linkList')}>
              {list.map((link) => (
                <li key={`profile-menu-${link.key}`} className={cx('linkItem', {'divider': link.divider})}>
                  <div className={cx('link')}
                    onMouseDown={this.handleClick}
                    data-url={link.url}>
                    {link.label}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileMenu;
