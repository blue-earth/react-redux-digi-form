import React, {
  Component,
  PropTypes
} from 'react';
import PlainHeader from 'components/Headers/PlainHeader';
import BusinessPlanStep from './BusinessPlanStep';
import NumberInput from './NumberInput';
import MaskedInput from 'react-maskedinput';
import {
  Grid,
  Row,
  Col,
  Panel,
  Button
} from 'react-bootstrap';
import { FaLock, FaArrowLeft, FaPaypal, FaCcVisa, FaCcAmex, FaCcMastercard, FaCreditCardAlt } from 'react-icons/lib/fa';
import HelpContactFooter from 'components/Footer/HelpContactFooter';
import styles from './BusinessPlan.scss';
import classNames from 'classnames';

const cards =[{
  type: 'mastercard',
  pattern: /^5[1-5]/
}, {
  type: 'amex',
  pattern: /^3[47]/,
  format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/
}, {
  type: 'visa',
  pattern: /^4/
}];

class CardType extends Component {
  static propTypes = {
    cardNumber: PropTypes.string
  }
  getType = (num) => {
    if (num.length === 0) return;
    let number = num.replace(/D/g, '');
    for (let i = 0; i < cards.length; i++) {
      let n = cards[i];
      if (n.pattern.test(number)) {
        return n.type;
      }
    }
  }
  render() {
    const size = 28;
    const color = '#194a6c';
    switch (this.getType(this.props.cardNumber)) {
      case 'visa':
        return (<FaCcVisa size={size} color={color} />);
      case 'amex':
        return (<FaCcAmex size={size} color={color} />);
      case 'mastercard':
        return (<FaCcMastercard size={size} color={color} />);
      default:
        return (<FaCreditCardAlt size={size} color={color} />);
    }
  }
}

class BusinessPlan extends Component {
  static propTypes = {
    planConfig: PropTypes.shape({
      subdomain: PropTypes.string,
      number_of_users: PropTypes.number,
      billing_cycle: PropTypes.oneOf(['annually', 'monthly'])
    }),
    validations: PropTypes.shape({
      isSubdomainVerified: PropTypes.bool,
      subdomainErrorMessage: PropTypes.string
    }),
    paymentMethod: PropTypes.shape({
      email: PropTypes.string,
      card_number: PropTypes.string,
      expiry: PropTypes.string,
      cvc: PropTypes.string
    }),
    purchaseErrorMessage: PropTypes.string.isRequired,
    isPurchasing: PropTypes.bool.isRequired,
    stepIndex: PropTypes.number.isRequired,
    goToNextStep: PropTypes.func.isRequired,
    goToPreviousStep: PropTypes.func.isRequired,
    verifySubdomain: PropTypes.func.isRequired,
    setPlanConfig: PropTypes.func.isRequired,
    setPaymentMethod: PropTypes.func.isRequired,
    purchasePlan: PropTypes.func.isRequired
  }

  isBillingCycleActive = (cycle) => {
    const {planConfig: {billing_cycle}} = this.props;
    return billing_cycle === cycle;
  }
  selectAnnually = () => {
    this.props.setPlanConfig({billing_cycle: 'annually'});
  }
  selectMonthly = () => {
    this.props.setPlanConfig({billing_cycle: 'monthly'});
  }

  handleSubdomainChange = (event) => {
    const subdomain = event.target.value;
    const { verifySubdomain, setPlanConfig } = this.props;
    if (subdomain.length > 0) {
      verifySubdomain(subdomain);
    }
    setPlanConfig({subdomain: subdomain});
  }
  handleUsersNumberChange = (number) => {
    this.props.setPlanConfig({number_of_users: number});
  }
  handleEmailChange = (event) => {
    this.props.setPaymentMethod({email: event.target.value});
  }
  handleCardNumberChange = (event) => {
    this.props.setPaymentMethod({card_number: event.target.value});
  }
  handleExpireChange = (event) => {
    this.props.setPaymentMethod({expiry: event.target.value});
  }
  handleCvcChange = (event) => {
    this.props.setPaymentMethod({cvc: event.target.value});
  }

  handleBillingCycleChange = () => {
    this.haveDiscount() ? this.selectMonthly() : this.selectAnnually();
  }

  handlePurchase = () => {
    const { purchasePlan } = this.props;
    purchasePlan();
  }

  haveDiscount = () => {
    return this.props.planConfig.billing_cycle === 'annually';
  }

  getDiscountMount = () => {
    return this.props.planConfig.number_of_users * (74-49) * 12;
  }
  getTotalPrice = () => {
    const { number_of_users } = this.props.planConfig;
    const singlePrice = this.haveDiscount() ? 49 : 74;
    return number_of_users * singlePrice * 12;
  }

  renderConfigurePage() {
    const { subdomain, number_of_users } = this.props.planConfig;
    const { isSubdomainVerified, subdomainErrorMessage } = this.props.validations;
    const isActive = (cycle) => {
      return this.isBillingCycleActive(cycle);
    };
    return (
      <Grid fluid>
        <Row>
          <Col md={8} mdPush={2} lg={6} lgPush={3} className="text-center">
            <div className={styles.pageTitleWrapper}>
              <h3 className={styles.pageTitle}>Configure Your Emondo Business Plan</h3>
            </div>
            <Panel className={styles.panelWrapper}>
              <div className={styles.domainSection}>
                <p className={styles.sectionTitle}>Reserve your custom subdomain:</p>
                <div className={styles.domainInputWrapper}>
                  <div className={styles.domainInputGroup}>
                    <input autoFocus className={styles.domainInput} placeholder="subdomain"
                      value={subdomain} onChange={this.handleSubdomainChange} />
                    <span className={classNames(
                      'glyphicon',
                      {
                        'glyphicon-ok': isSubdomainVerified,
                        'glyphicon-remove': !isSubdomainVerified,
                        [styles.validatorPass]: isSubdomainVerified,
                        [styles.validatorFail]: !isSubdomainVerified,
                        'hide': subdomain.length === 0
                      },
                      styles.validationIndicator
                    )}></span>
                  </div>
                  <span className={classNames(
                    styles.sectionTitle,
                    styles.rootDomain
                  )}>.emondo.co</span>
                  <div className={classNames(
                    styles.validatorFail,
                    styles.subdomainErrorMessage,
                    {'hide': subdomain.length === 0}
                  )}>{subdomainErrorMessage}</div>
                </div>
              </div>
              <div>
                <p className={styles.sectionTitle}>Choose number of users:</p>
                <NumberInput height={54} className={styles.bigNumberInput}
                  value={number_of_users} onChange={this.handleUsersNumberChange} minValue={1} />
              </div>
            </Panel>
            <div className={styles.billingCycleSection}>
              <p className={classNames(
                styles.sectionTitle,
                styles.billingCycleTitle
              )}>Select your billing method:</p>
              <div className={styles.billingCycleSelectionWrapper}>
                <Panel className={classNames(
                  styles.selectionPanel,
                  styles.bigPanel,
                  'pull-left',
                  {
                    [styles.activePanel]: isActive('annually')
                  })}
                  onClick={this.selectAnnually}>
                  <div className={styles.ribbonWrapper}>
                    <div className={classNames({
                      [styles.ribbon]: true,
                      [styles.activeRibbon]: isActive('annually')
                    })}>Save 33%</div>
                  </div>
                  <h4 className={styles.selectTitle}>Annually</h4>
                  <p>$49 per seat per month</p>
                </Panel>
                <Panel className={classNames(
                  styles.selectionPanel,
                  styles.bigPanel,
                  'pull-right',
                  {
                    [styles.activePanel]: isActive('monthly')
                  })}
                  onClick={this.selectMonthly}>
                  <h4 className={styles.selectTitle}>Monthly</h4>
                  <p>$74 per seat per month</p>
                </Panel>
              </div>
              <div className={styles.clearFloat}>
              </div>
              <hr className={styles.divideLine} />
            </div>
            <div className={styles.nextButtonWrapper}>
              <button disabled={!this.props.validations.isSubdomainVerified} className={styles.nextButton}
                onClick={this.props.goToNextStep}>
                  Next
              </button>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  renderPurchasePage() {
    const { planConfig, paymentMethod, purchaseErrorMessage, isPurchasing } = this.props;
    const { number_of_users, billing_cycle } = planConfig;
    const { email, card_number, expiry, cvc } = paymentMethod;
    return (
      <Grid fluid>
        <div className="text-center">
          <div className={styles.pageTitleWrapper}>
            <h3 className={styles.pageTitle}>Purchase Your Emondo Business Plan</h3>
            <h4 className={styles.purchaseStatus}>
              {purchaseErrorMessage.length === 0 ? '' : 'Sorry, your purchase has been declined because of: '}
              {purchaseErrorMessage}
            </h4>
          </div>
          <Row>
            <Col sm={6} md={5} mdPush={1} lg={4} lgPush={2} className="text-left">
              <p>Select your payment method:</p>
              <Panel className={classNames(
                styles.activePanel,
                styles.selectionPanel,
                styles.smallPanel,
                'text-center',
                'pull-left'
              )}>
                <h4>
                  <FaCreditCardAlt />
                  {' '}
                  <span className={styles.selectTitle}>Credit Card</span>
                </h4>
              </Panel>
              <Panel className={classNames(
                styles.selectionPanel,
                styles.smallPanel,
                'text-center',
                'pull-right'
              )} disabled>
                <h4>
                  <FaPaypal />{' '} Paypal
                </h4>
              </Panel>
              <div className={styles.clearFloat}></div>
              <p className="h5">
                <FaLock /> Your purchase is secured using 256-bit encryption
              </p>
              <input type="email" placeholder="Email" autoFocus
                className={classNames(styles.creditCardInput, styles.emailInput)}
                value={email} onChange={this.handleEmailChange} />
              <div className={styles.creditCardInputWrapper}>
                <MaskedInput mask="1111 1111 1111 1111" name="card" size="16"
                  className={classNames(styles.creditCardInput, styles.cardNumberInput)}
                  value={card_number} placeholder="Card number" onChange={this.handleCardNumberChange} />
                <span className={styles.creditCardType}>
                  <CardType cardNumber={card_number} />
                </span>
              </div>
              <div className={styles.creditCardInputWrapper}>
                <MaskedInput mask="11/11" name="expiry" placeholder="MM/YY"
                  className={classNames(styles.creditCardInput, styles.expireDateInput)}
                  value={expiry} onChange={this.handleExpireChange} />
                <MaskedInput mask="111" name="cvc" placeholder="CVC"
                  className={classNames(styles.creditCardInput, styles.cvcInput)}
                  value={cvc} onChange={this.handleCvcChange} />
              </div>
              <button className={styles.purchaseButton} onClick={this.handlePurchase}>
                {isPurchasing? 'Processing...' : 'Purchase'}
              </button>
              <Button bsStyle="link" onClick={this.props.goToPreviousStep}><FaArrowLeft />Back</Button>
            </Col>
            <Col sm={6} md={5} mdPush={1} lg={4} lgPush={2} className="text-left">
              <Panel className={classNames(styles.infoPanel, styles.orderPanel)}>
                <h4>ORDER SUMMARY</h4>
                <hr className={styles.divideLine} />
                <p>
                  <strong className={styles.orderItem}>Business Plan</strong>
                  {' '}
                  <span className={styles.price}>AUD ${number_of_users * 74 * 12}</span>
                </p>
                <p>
                  Users: {' '}
                  <NumberInput height={24} className={styles.smallNumberInput}
                    value={number_of_users} minValue={1} onChange={this.handleUsersNumberChange} />
                </p>
                <p style={{marginBottom: '30px'}}>
                  <span className={styles.orderItem}>Billed {billing_cycle} {this.haveDiscount()?'(save 33%)':''}</span>
                  {' '}
                  <span onClick={this.handleBillingCycleChange} className={styles.changeBillingCycle}>CHANGE</span>
                  <span className={classNames(styles.price, {'hidden': !this.haveDiscount()})}>
                    - AUD ${this.getDiscountMount()}
                  </span>
                </p>
                <hr className={styles.divideLine} />
                <p>
                  <span>Subtotal (${this.haveDiscount() ? 49 : 74} per month)</span>
                  <span className={styles.price}>AUD ${this.haveDiscount() ? 49 * 12 : 74 * 12}</span>
                </p>
                <hr className={styles.divideLine} />
                <p>
                  <span className={classNames(styles.totalTitle, 'h3')}>Total due</span>
                  <span className={classNames(styles.price, 'h3')}>AUD ${this.getTotalPrice()}</span>
                </p>
              </Panel>
              <Panel className={classNames(styles.infoPanel, styles.featurePanel)}>
                <h4>FEATURES</h4>
                <hr className={styles.divideLine} />
                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>
                    &#x2713;
                    {'  '}
                    On-board customers up to 50x faster
                  </li>
                  <li className={styles.featureItem}>
                    &#x2713;
                    {'  '}
                    Capture new leads from abandoned forms
                  </li>
                  <li className={styles.featureItem}>
                    &#x2713;
                    {'  '}
                    Convert documents into beautiful online forms
                  </li>
                  <li className={styles.featureItem}>
                    &#x2713;
                    {'  '}
                    Unlimited digital signatures
                  </li>
                </ul>
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={10} mdPush={1} lg={8} lgPush={2}>
              <hr className={styles.divideLine} />
              <ul className={styles.footerLinkListLeft}>
                <li className={styles.footerLink}>
                  <a href="#">Terms & Conditions</a>
                </li>
                <li className={styles.footerLink}>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
              <HelpContactFooter className="pull-right" />
            </Col>
          </Row>
        </div>
      </Grid>
    );
  }

  render() {
    const { stepIndex } = this.props;
    return (
      <div className={styles.businessPlan}>
        <PlainHeader />
        <BusinessPlanStep step={stepIndex} />
        <div className={styles.purchasePageContent}>
          { stepIndex === 0 ? this.renderConfigurePage() : this.renderPurchasePage() }
        </div>
      </div>
    );
  }
}

export default BusinessPlan;
