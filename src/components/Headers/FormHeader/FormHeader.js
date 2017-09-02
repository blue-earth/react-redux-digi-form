import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button
} from 'react-bootstrap';
import { MdClose, MdMenu } from 'react-icons/lib/md';
import StackLogo from 'components/Logos/StackLogo';
import classNames from 'classnames';
import styles from './FormHeader.scss';
import { FORM_USER_SUBMISSION } from 'redux/modules/formInteractive';

class FormHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isMobileMenuOpen: false
    };
  }
  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    /*
     * title: Form title
     */
    title: PropTypes.string.isRequired,
    /*
     * checkRedirectAfterSubmit: Event handler to be executed after form answer submission.
     */
    checkRedirectAfterSubmit: PropTypes.func.isRequired,
    /*
     * submitAnswer: Redux action to send submit request to server. Here it will be submitted by user's action.
     */
    submitAnswer: PropTypes.func,
    /*
     * completed: Form completed
     */
    isCompleted: PropTypes.bool
  }

  componentDidMount() {
    window.addEventListener('click', this.hideMobileMenu);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hideMobileMenu);
  }

  showMobileMenu = (e) => {
    this.setState({ isMobileMenuOpen: true });
    e.stopPropagation();
  }

  hideMobileMenu = (e) => {
    this.setState({ isMobileMenuOpen: false });
    e.stopPropagation();
  }

  handleSubmitAnswer = () => {
    const { submitAnswer, checkRedirectAfterSubmit } = this.props;
    submitAnswer(FORM_USER_SUBMISSION, checkRedirectAfterSubmit);
  }

  render() {
    const { title, submitAnswer, isCompleted } = this.props;
    const mobileMenuClass = classNames({
      [styles.mobileMenu]: true,
      [styles.isOpen]: this.state.isMobileMenuOpen
    });
    return (
      <div className={styles.wrapper}>
        <span className={styles.alignmentHelper} />
        <div className={styles.logoWrapper}>
          <StackLogo logoStyle="grey" height={'48px'} />
        </div>
        <h1 className={styles.title}>{title}</h1>
        <div className={classNames(styles.buttonWrapper, {
          'hide': isCompleted || submitAnswer === undefined
        })}>
          <Button onClick={this.handleSubmitAnswer} className={styles.saveButton}>
            Save & continue later
          </Button>
          <Button onClick={this.showMobileMenu}
            className={styles.mobileToggleMenu}>
            <MdMenu size={40} />
          </Button>
          <div className={mobileMenuClass} onClick={function (e) { e.stopPropagation(); }}>
            <div className={styles.mobileMenuTop}>
              <Button onClick={this.hideMobileMenu}
                className={styles.mobileToggleMenu}>
                <MdClose size={40} />
              </Button>
            </div>
            <ul className={styles.navMenu}>
              <li>
                <a href="javascript:;">
                  Change section
                </a>
              </li>
              <li>
                <a href="javascript:;">
                  Footer content
                </a>
              </li>
              {
                !isCompleted && (<li>
                  <a href="javascript:;" onClick={this.handleSubmitAnswer}>
                    Save & continue later
                  </a>
                </li>)
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default FormHeader;
