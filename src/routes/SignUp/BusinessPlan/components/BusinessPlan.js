import React, {
  Component,
  PropTypes
} from 'react';
import PlainHeader from 'components/Headers/PlainHeader';
import StepIndicator from 'components/StepIndicator';
import NumberInput from 'components/NumberInput';
import MaskedInput from 'react-maskedinput';
import {
  Grid,
  Row,
  Col,
  Panel,
  Button,
  Well
} from 'react-bootstrap';
import { FaLock, FaCreditCardAlt } from 'react-icons/lib/fa';
import { IoAndroidDone, IoAndroidClose, IoAndroidArrowBack } from 'react-icons/lib/io';
import HelpContactFooter from 'components/Footer/HelpContactFooter';
import CardType from 'components/CardType';
import PriceTag from 'components/PriceTag';
import styles from './BusinessPlan.scss';
import classNames from 'classnames';
import Spinner from 'components/Spinner';

class BusinessPlan extends Component {
  static propTypes = {
    plansConfig: PropTypes.array,
    currentlySelectedPlan: PropTypes.shape({
      name: PropTypes.string,
      subdomain: PropTypes.string,
      numberOfUsers: PropTypes.number,
      billingCycle: PropTypes.oneOf(['annually', 'monthly'])
    }),
    validations: PropTypes.shape({
      isSubdomainVerified: PropTypes.bool,
      subdomainErrorMessage: PropTypes.string,
      displaySubdomainHint: PropTypes.bool,
      displaySubdomainVerified: PropTypes.bool
    }),
    paymentMethod: PropTypes.shape({
      cardNumber: PropTypes.string,
      expiry: PropTypes.string,
      cvc: PropTypes.string
    }),
    email: PropTypes.string,
    purchaseErrorMessages: PropTypes.array,
    isPageBusy: PropTypes.bool,
    stepIndex: PropTypes.number,
    fetchPlans: PropTypes.func,
    goToNextStep: PropTypes.func,
    goToPreviousStep: PropTypes.func,
    verifySubdomain: PropTypes.func,
    changeSubdomain: PropTypes.func,
    setEmail: PropTypes.func,
    setSelectedPlanConfig: PropTypes.func,
    setPaymentMethod: PropTypes.func,
    displaySubdomainHint: PropTypes.func,
    purchasePlan: PropTypes.func
  }
  componentDidMount() {
    this.props.fetchPlans();
  }
  isBillingCycleActive = (cycle) => {
    const {currentlySelectedPlan: {billingCycle}} = this.props;
    return billingCycle === cycle;
  }
  selectAnnually = () => {
    const {setSelectedPlanConfig} = this.props;
    const { minRequiredNumUser } = this.getPlanConfig('annually');
    setSelectedPlanConfig({
      name: this.getPlanName() + '-annually',
      billingCycle: 'annually',
      numberOfUsers: minRequiredNumUser
    });
  }
  selectMonthly = () => {
    const {setSelectedPlanConfig} = this.props;
    const { minRequiredNumUser } = this.getPlanConfig('monthly');
    setSelectedPlanConfig({
      name: this.getPlanName() + '-monthly',
      billingCycle: 'monthly',
      numberOfUsers: minRequiredNumUser
    });
  }

  handleSubdomainChange = (event) => {
    clearTimeout(this.changingSubdomain);
    const subdomain = event.target.value;
    const { verifySubdomain, changeSubdomain } = this.props;
    changeSubdomain(subdomain);
    if (subdomain.length > 3) {
      this.changingSubdomain = setTimeout(() => verifySubdomain(subdomain), 2000);
    }
  }

  handleSubdomainFocus = (event) => {
    this.props.displaySubdomainHint(false);
  }
  handleSubdomainBlur = (event) => {
    const subdomain = event.target.value;
    const { verifySubdomain, displaySubdomainHint, validations } = this.props;
    if (subdomain.length > 3 && !validations.displaySubdomainVerified) {
      clearTimeout(this.changingSubdomain);
      verifySubdomain(subdomain);
    }
    displaySubdomainHint(true);
  }
  handleSubdomainEnter = (event) => {
    if (event.key === 'Enter') {
      this.refs.subdomain.blur();
    }
  }

  handlePaymentChange = (event) => {
    let payment = {};
    const name = event.target.getAttribute('name');
    payment[name] = event.target.value;
    this.props.setPaymentMethod(payment);
  }
  handleEmailChange = (event) => {
    this.props.setEmail(event.target.value);
  }

  handleUsersNumberChange = (number) => {
    this.props.setSelectedPlanConfig({numberOfUsers: number});
  }

  handleBillingCycleChange = () => {
    this.haveDiscount() ? this.selectMonthly() : this.selectAnnually();
  }

  handlePurchase = () => {
    const { purchasePlan } = this.props;
    purchasePlan();
  }

  haveDiscount = () => {
    return this.props.currentlySelectedPlan.billingCycle === 'annually';
  }

  getPlanName = () => {
    return this.props.currentlySelectedPlan.name.split('-')[0];
  }
  getPlanConfig = (period) => {
    const { plansConfig } = this.props;
    for (let i in plansConfig) {
      if (plansConfig[i].name === this.getPlanName() + '-' + period) {
        return plansConfig[i];
      }
    }
  }
  getOriginalPrice = () => {
    return 12 * this.props.currentlySelectedPlan.numberOfUsers * this.getPlanConfig('monthly').priceCents;
  }
  getPlanPrices = () => {
    const annually = this.getPlanConfig('annually').priceCents;
    const monthly = this.getPlanConfig('monthly').priceCents;
    return { annually, monthly };
  }

  getDiscountMount = () => {
    const { monthly, annually } = this.getPlanPrices();
    return this.props.currentlySelectedPlan.numberOfUsers * (annually-monthly) * 12;
  }
  getTotalPrice = () => {
    return this.props.currentlySelectedPlan.numberOfUsers * this.getSinglePrice() * 12;
  }
  getSinglePrice = () => {
    const { monthly, annually } = this.getPlanPrices();
    return this.haveDiscount() ? annually : monthly;
  }

  renderConfigurePage() {
    const { isPageBusy, currentlySelectedPlan, validations } = this.props;
    if (isPageBusy) {
      return (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      );
    }
    const { billingCycle, subdomain, numberOfUsers } = currentlySelectedPlan;
    const { maxNumUser, minRequiredNumUser } = this.getPlanConfig(billingCycle);
    const { annually, monthly } = this.getPlanPrices();
    const { isSubdomainVerified, subdomainErrorMessage, displaySubdomainHint, displaySubdomainVerified } = validations;
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
                      ref="subdomain"
                      value={subdomain}
                      onChange={this.handleSubdomainChange}
                      onBlur={this.handleSubdomainBlur}
                      onFocus={this.handleSubdomainFocus}
                      onKeyPress={this.handleSubdomainEnter}
                    />
                    <span className={classNames(
                      styles.validationIndicator,
                      styles.validatorPass,
                      {'hide': !isSubdomainVerified || !displaySubdomainVerified}
                    )}>
                      <IoAndroidDone />
                    </span>
                    <span className={classNames(
                      styles.validationIndicator,
                      styles.validatorFail,
                      {
                        'hide': !displaySubdomainVerified || subdomain.length === 0 || isSubdomainVerified
                      })}>
                      <IoAndroidClose />
                    </span>
                  </div>
                  <span className={classNames(
                    styles.sectionTitle,
                    styles.rootDomain
                  )}>.emondo.co</span>
                  <div className={classNames(
                    styles.validatorFail,
                    styles.subdomainErrorMessage,
                    {'hide': !displaySubdomainHint}
                  )}>{subdomainErrorMessage}</div>
                </div>
              </div>
              <div>
                <p className={styles.sectionTitle}>Choose number of users:</p>
                <NumberInput height={54} className={styles.bigNumberInput}
                  value={numberOfUsers} onChange={this.handleUsersNumberChange}
                  minValue={minRequiredNumUser}
                  maxValue={maxNumUser}
                  minHint={'The minimun required user number is ' + minRequiredNumUser}
                  maxHint={'The maximum number of user is ' + maxNumUser} />
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
                  <p>
                    <PriceTag price={annually} />
                    {' '}
                    per seat per month
                  </p>
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
                  <p>
                    <PriceTag price={monthly} />
                    {' '}
                    per seat per month
                  </p>
                </Panel>
              </div>
              <div className={styles.clearFloat}>
              </div>
              <hr className={styles.divideLine} />
            </div>
            <div className={styles.nextButtonWrapper}>
              <button disabled={!isSubdomainVerified} className={styles.nextButton}
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
    const { currentlySelectedPlan, paymentMethod, purchaseErrorMessages, isPageBusy } = this.props;
    const { name, numberOfUsers, billingCycle } = currentlySelectedPlan;
    const { email, cardNumber, expiry, cvc } = paymentMethod;
    const { priceCurrency, minRequiredNumUser, maxNumUser } = this.getPlanConfig(billingCycle);
    return (
      <Grid fluid>
        <div className="text-center">
          <div className={styles.pageTitleWrapper}>
            <h3 className={styles.pageTitle}>Purchase Your Emondo Business Plan</h3>
          </div>
          <Row>
            <Col md={10} mdPush={1} lg={8} lgPush={2}>
              { purchaseErrorMessages.length >0 &&
                <Well className={styles.purchaseErrorMessages}>
                  <h4>
                    Sorry, your purchase has been declined because of:
                  </h4>
                  <ul className={styles.purchaseErrorMessageList}>
                    {purchaseErrorMessages.map((errorMessage, index) =>
                      <li key={index}>{errorMessage}</li>
                    )}
                  </ul>
                </Well>
              }
            </Col>
          </Row>
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
                <h4 className={styles.paymentSelection}>
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
                <h4 className={styles.paymentSelection}>
                  <img src="/PP_logo_h_100x26.png" alt="paypal" />
                </h4>
              </Panel>
              <div className={styles.clearFloat}></div>
              <p className="h5">
                <FaLock /> Your purchase is secured using 256-bit encryption
              </p>
              <input type="email" name="email" placeholder="Email" autoFocus
                className={classNames(styles.creditCardInput, styles.emailInput)}
                value={email} onChange={this.handleEmailChange} />
              <div className={styles.creditCardInputWrapper}>
                <MaskedInput mask="1111 1111 1111 1111" name="cardNumber" size="16"
                  className={classNames(styles.creditCardInput, styles.cardNumberInput)}
                  value={cardNumber} placeholder="Card number" onChange={this.handlePaymentChange} />
                <span className={styles.creditCardType}>
                  <CardType cardNumber={cardNumber} />
                </span>
              </div>
              <div className={styles.creditCardInputWrapper}>
                <MaskedInput mask="11/1111" name="expiry" placeholder="MM/YYYY"
                  className={classNames(styles.creditCardInput, styles.expireDateInput)}
                  value={expiry} onChange={this.handlePaymentChange} />
                <MaskedInput mask="111" name="cvc" placeholder="CVC"
                  className={classNames(styles.creditCardInput, styles.cvcInput)}
                  value={cvc} onChange={this.handlePaymentChange} />
              </div>
              <button disabled={isPageBusy} className={styles.purchaseButton} onClick={this.handlePurchase}>
                {isPageBusy? 'Processing...' : 'Purchase'}
              </button>
              <Button className={styles.backButton} bsStyle="link" onClick={this.props.goToPreviousStep}>
                <IoAndroidArrowBack size={14} className={styles.backArrow} style={{verticalAlign: 'bottom'}} />
                {' '}
                <span>Back</span>
              </Button>
            </Col>
            <Col sm={6} md={5} mdPush={1} lg={4} lgPush={2} className="text-left">
              <Panel className={classNames(styles.infoPanel, styles.orderPanel)}>
                <h4>ORDER SUMMARY</h4>
                <hr className={styles.divideLine} />
                <p>
                  <strong className={styles.orderItem}>
                    {name[0].toUpperCase() + name.slice(1)} Plan
                  </strong>
                  {' '}
                  <span className={styles.price}>
                    <PriceTag price={this.getOriginalPrice()} currency={priceCurrency} />
                  </span>
                </p>
                <div>
                  Users: {' '}
                  <NumberInput height={24} className={styles.smallNumberInput}
                    value={numberOfUsers} onChange={this.handleUsersNumberChange}
                    minValue={minRequiredNumUser} maxValue={maxNumUser} />
                </div>
                <p className={styles.orderPanelSection}>
                  <span className={styles.orderItem}>Billed {billingCycle} {this.haveDiscount()?'(save 33%)':''}</span>
                  {' '}
                  <span onClick={this.handleBillingCycleChange} className={styles.changeBillingCycle}>CHANGE</span>
                  <span className={classNames(styles.price, {'hidden': !this.haveDiscount()})}>
                    <PriceTag price={this.getDiscountMount()} currency={priceCurrency} />
                  </span>
                </p>
                <hr className={styles.divideLine} />
                <p className={styles.orderPanelSection}>
                  <span>Subtotal (<PriceTag price={this.getSinglePrice()} /> per month)</span>
                  <span className={styles.price}>
                    <PriceTag price={this.getSinglePrice() * 12} currency={priceCurrency} />
                  </span>
                </p>
                <hr className={styles.divideLine} />
                <p>
                  <span className={classNames(styles.totalTitle, 'h3')}>Total due</span>
                  <span className={classNames(styles.price, 'h3')}>
                    <PriceTag price={this.getTotalPrice()} currency={priceCurrency} />
                  </span>
                </p>
              </Panel>
              <Panel className={classNames(styles.infoPanel, styles.featurePanel)}>
                <h4>FEATURES</h4>
                <hr className={styles.divideLine} />
                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>
                    <IoAndroidDone size={20} />
                    {'  '}
                    On-board customers up to 50x faster
                  </li>
                  <li className={styles.featureItem}>
                    <IoAndroidDone size={20} />
                    {'  '}
                    Capture new leads from abandoned forms
                  </li>
                  <li className={styles.featureItem}>
                    <IoAndroidDone size={20} />
                    {'  '}
                    Convert documents into beautiful online forms
                  </li>
                  <li className={styles.featureItem}>
                    <IoAndroidDone size={20} />
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
    const steps = [
      {name: 'Configure', number: 1},
      {name: 'Purchase', number: 2}
    ];
    return (
      <div className={styles.businessPlan}>
        <PlainHeader />
        <StepIndicator activeStep={stepIndex}
          steps={steps} />
        <div className={styles.purchasePageContent}>
          { stepIndex === 0 ? this.renderConfigurePage() : this.renderPurchasePage() }
        </div>
      </div>
    );
  }
}

export default BusinessPlan;
