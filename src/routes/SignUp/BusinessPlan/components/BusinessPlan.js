import React, {
  Component,
  PropTypes
} from 'react';
import PlainHeader from 'components/Headers/PlainHeader';
import BusinessPlanStep from './BusinessPlanStep';
import NumberInput from 'components/NumberInput';
import MaskedInput from 'react-maskedinput';
import {
  Grid,
  Row,
  Col,
  Panel,

  Button
} from 'react-bootstrap';
import { FaLock, FaCreditCardAlt } from 'react-icons/lib/fa';
import { IoAndroidDone, IoAndroidClose, IoAndroidArrowBack } from 'react-icons/lib/io';
import HelpContactFooter from 'components/Footer/HelpContactFooter';
import CardType from 'components/CardType';
import PriceTag from 'components/PriceTag';
import styles from './BusinessPlan.scss';
import classNames from 'classnames';

class BusinessPlan extends Component {
  static propTypes = {
    plans: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        priceCents: PropTypes.number,
        priceCurrency: PropTypes.string,
        minRequiredUsers: PropTypes.number,
        maxNumUsers: PropTypes.number
      })
    ),
    planConfig: PropTypes.shape({
      subdomain: PropTypes.string,
      numberOfUsers: PropTypes.number,
      billingCycle: PropTypes.oneOf(['annually', 'monthly'])
    }),
    validations: PropTypes.shape({
      isSubdomainVerified: PropTypes.bool,
      subdomainErrorMessage: PropTypes.string
    }),
    paymentMethod: PropTypes.shape({
      email: PropTypes.string,
      cardNumber: PropTypes.string,
      expiry: PropTypes.string,
      cvc: PropTypes.string
    }),
    purchaseErrorMessage: PropTypes.string.isRequired,
    isPurchasing: PropTypes.bool.isRequired,
    stepIndex: PropTypes.number.isRequired,
    fetchPlans: PropTypes.func.isRequired,
    goToNextStep: PropTypes.func.isRequired,
    goToPreviousStep: PropTypes.func.isRequired,
    verifySubdomain: PropTypes.func.isRequired,
    setPlanConfig: PropTypes.func.isRequired,
    setPaymentMethod: PropTypes.func.isRequired,
    purchasePlan: PropTypes.func.isRequired,
    plan: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      showSubdomainHint: false
    };
  }

  componentDidMount() {
    this.props.fetchPlans();
  }

  isBillingCycleActive = (cycle) => {
    const {planConfig: {billingCycle}} = this.props;
    return billingCycle === cycle;
  }
  selectAnnually = () => {
    this.props.setPlanConfig({billingCycle: 'annually'});
  }
  selectMonthly = () => {
    this.props.setPlanConfig({billingCycle: 'monthly'});
  }

  handleSubdomainChange = (event) => {
    const subdomain = event.target.value;
    const { verifySubdomain, setPlanConfig } = this.props;
    if (subdomain.length > 0) {
      verifySubdomain(subdomain);
    }
    setPlanConfig({subdomain: subdomain});
  }

  handleSubdomainFocus = (event) => {
    this.setState({
      showSubdomainHint: false
    });
  }
  handleSubdomainBlur = (event) => {
    this.setState({
      showSubdomainHint: true
    });
  }

  handleUsersNumberChange = (number) => {
    this.props.setPlanConfig({numberOfUsers: number});
  }
  handleEmailChange = (event) => {
    this.props.setPaymentMethod({email: event.target.value});
  }
  handleCardNumberChange = (event) => {
    this.props.setPaymentMethod({cardNumber: event.target.value});
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
    return this.props.planConfig.billingCycle === 'annually';
  }

  getPlanDetail = (period) => {
    const { plan, plans } = this.props;
    for (let i in plans) {
      if (plans[i].name === plan + '-' + period) {
        return plans[i];
      }
    }
  }
  getOriginalPrice = () => {
    return 12 * this.props.planConfig.numberOfUsers * this.getPlanDetail('monthly').priceCents;
  }
  getPlanPrices = () => {
    const annually = this.getPlanDetail('annually').priceCents;
    const monthly = this.getPlanDetail('monthly').priceCents;
    return { annually, monthly };
  }

  getDiscountMount = () => {
    const { monthly, annually } = this.getPlanPrices();
    return this.props.planConfig.numberOfUsers * (annually-monthly) * 12;
  }
  getTotalPrice = () => {
    return this.props.planConfig.numberOfUsers * this.getSinglePrice() * 12;
  }
  getSinglePrice = () => {
    const { monthly, annually } = this.getPlanPrices();
    return this.haveDiscount() ? annually : monthly;
  }

  renderConfigurePage() {
    const { period } = this.props;
    const { maxNumUsers, minRequiredUsers } = this.getPlanDetail(period);
    const annually = this.getPlanDetail('annually').priceCents;
    const monthly = this.getPlanDetail('monthly').priceCents;
    const { subdomain, numberOfUsers } = this.props.planConfig;
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
                      value={subdomain} onChange={this.handleSubdomainChange}
                      onBlur={this.handleSubdomainBlur} onFocus={this.handleSubdomainFocus} />
                    <span className={classNames(
                      styles.validationIndicator,
                      styles.validatorPass,
                      {
                        'hide': !isSubdomainVerified
                      }
                    )}>
                      <IoAndroidDone />
                    </span>
                    <span className={classNames(
                      styles.validationIndicator,
                      styles.validatorFail,
                      {
                        'hide': subdomain.length === 0 || isSubdomainVerified
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
                    {'hide': !this.state.showSubdomainHint}
                  )}>{subdomainErrorMessage}</div>
                </div>
              </div>
              <div>
                <p className={styles.sectionTitle}>Choose number of users:</p>
                <NumberInput height={54} className={styles.bigNumberInput}
                  value={numberOfUsers} onChange={this.handleUsersNumberChange}
                  minValue={minRequiredUsers} maxValue={maxNumUsers} />
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
    const { planConfig, paymentMethod, purchaseErrorMessage, isPurchasing } = this.props;
    const { numberOfUsers, billingCycle } = planConfig;
    const { email, cardNumber, expiry, cvc } = paymentMethod;
    const { priceCurrency, minRequiredUsers, maxNumUsers } = this.getPlanDetail(billingCycle);
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
                <h4 style={{lineHeight: '26px'}}>
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
                  <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png"
                    alt="PayPal" />
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
                  value={cardNumber} placeholder="Card number" onChange={this.handleCardNumberChange} />
                <span className={styles.creditCardType}>
                  <CardType cardNumber={cardNumber} />
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
              <Button className={styles.backButton} bsStyle="link" onClick={this.props.goToPreviousStep}>
                <IoAndroidArrowBack size={14} style={{height: '22px'}} />
                {' '}
                <span style={{lineHeight: '22px'}}>Back</span>
              </Button>
            </Col>
            <Col sm={6} md={5} mdPush={1} lg={4} lgPush={2} className="text-left">
              <Panel className={classNames(styles.infoPanel, styles.orderPanel)}>
                <h4>ORDER SUMMARY</h4>
                <hr className={styles.divideLine} />
                <p>
                  <strong className={styles.orderItem}>Business Plan</strong>
                  {' '}
                  <span className={styles.price}>
                    <PriceTag price={this.getOriginalPrice()} currency={priceCurrency} />
                  </span>
                </p>
                <p>
                  Users: {' '}
                  <NumberInput height={24} className={styles.smallNumberInput}
                    value={numberOfUsers} onChange={this.handleUsersNumberChange}
                    minValue={minRequiredUsers} maxValue={maxNumUsers} />
                </p>
                <p style={{marginBottom: '30px'}}>
                  <span className={styles.orderItem}>Billed {billingCycle} {this.haveDiscount()?'(save 33%)':''}</span>
                  {' '}
                  <span onClick={this.handleBillingCycleChange} className={styles.changeBillingCycle}>CHANGE</span>
                  <span className={classNames(styles.price, {'hidden': !this.haveDiscount()})}>
                    <PriceTag price={this.getDiscountMount()} currency={priceCurrency} />
                  </span>
                </p>
                <hr className={styles.divideLine} />
                <p style={{marginBottom: '30px'}}>
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
