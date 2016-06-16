import React, { Component, PropTypes } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { FaGooglePlusSquare,FaFacebookSquare,FaLinkedinSquare} from 'react-icons/lib/fa';
import { MdLock} from 'react-icons/lib/md';
import { GoCheck} from 'react-icons/lib/go';
import ShortTextInput from 'components/QuestionInputs/ShortTextInput/ShortTextInput';
import { MdCheck, MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/lib/md';
import FormRow from '../FormRow/FormRow';
import LearnMoreSection from '../LearnMoreSection/LearnMoreSection';
import { getContextFromAnswer, getFirstQuestionOfGroup, SlideAnimation, 
  shouldDisableNextButton, shouldDisablePrevButton } from 'helpers/formInteractiveHelper';
import { findIndexById } from 'helpers/pureFunctions';
import styles from './FormCompletionSection.scss';
import _ from 'lodash';

class FormCompletionSection extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {


    /*
     * form: form_data of response, consists of questions and logics.
     */ 
    form: PropTypes.object.isRequired,

    /*
     * questionGroup: A structured group of questions for this form section(step)
     */ 
    questionGroup: PropTypes.object.isRequired,

    /*
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    currentQuestionId: PropTypes.number.isRequired,

    /*
     * verificationStatus: Redux state that holds the status of verification, ex. EmondoEmailService
     */
    verificationStatus: PropTypes.array,

    /*
     * isVerifying: Redux state that indicates the status whether verification is in prgress with backend
     */
    isVerifying: PropTypes.bool.isRequired,

    /*
     * answers: Redux state that stores the array of answered values
     */
    answers: PropTypes.array.isRequired,

    /*
     * prefills: Redux state that stores the array of answer prefills values
     */
    prefills: PropTypes.array.isRequired,

    /*
     * prevQuestion: Redux action to move to previous question.
     */
    prevQuestion: PropTypes.func.isRequired,

    /*
     * nextQuestion: Redux action to move to next question when the current answer is qualified.
     */
    nextQuestion: PropTypes.func.isRequired,

    /*
     * goToQuestion: Redux action to move to specific question by ID.
     */
    goToQuestion: PropTypes.func.isRequired,

    /*
     * storeAnswer: Redux action to store the answer value to Redux store.
     */
    storeAnswer: PropTypes.func.isRequired,

    /*
     * handleEnter: Redux action to handle Enter key or button press, it also handles verification.
     */
    handleEnter: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  };

  static defaultProps = {
    questionGroup: {
      title: 'Basic Details',
      questions: []
    }
  };

  

  render() {
    var imgTreePath = require('./tree.png');
    var imgWaterPath = require('./water.png');
    var imgCoPath = require('./co2.png');

    return (
      <section className={styles.formSection}> 
        <Collapse in timeout={5000}>
          <div>
            <FormRow>
              <div className={styles.step}>
                <GoCheck size="45"/>
              </div>
              <div className={styles.formSectionInner}>
                <h3 className={styles.formSectionTitle} >
                  Thank you for completing the CMC Markets Account <br/>Application!
                </h3>
                <div className={styles.formSectionPargraphA}>
                  A copy of your completed application form will be sent to a.glover@cmcmarkets.com
                </div>
                <div className={styles.formSectionPargraphA}>
                  Enter additional email addresses to send your completed for to:
                </div>
                <div className={styles.formEmailInput}>
                  <ShortTextInput type="EmailField" placeholderText="Email"/>
                </div>
                <div className={styles.formSectionPargraphB}>
                  By using our electronic forms you saved:
                </div>
                <div className={styles.formImageGridArea}>
                  <div className={styles.formImageGrid}>
                    <img className={styles.formImage} src={imgTreePath}/>
                    <div className={styles.formImagePoint}>0.34</div>
                    <div className={styles.formImageCaption}>trees</div>
                  </div>
                  <div className={styles.formImageGrid}>
                    <img className={styles.formImage} src={imgWaterPath}/>
                    <div className={styles.formImagePoint}>1.56</div>
                    <div className={styles.formImageCaption}>litres of water</div>
                  </div>
                  <div className={styles.formImageGrid}>
                    <img className={styles.formImage} src={imgCoPath}/>
                    <div className={styles.formImagePoint}>0.56</div>
                    <div className={styles.formImageCaption}>kilograms of<br/>Co2</div>
                  </div>
                </div>
                <div className={styles.formSectionPargraphB}>
                  Share your environmental savings:
                </div>
                <div className={styles.socialIconArea}>
                  <FaGooglePlusSquare size="45"/>
                  <FaFacebookSquare size="45"/>
                  <FaLinkedinSquare size="45"/>
                </div>
              </div>
            </FormRow>
          </div>
        </Collapse>
        <hr className={styles.hrLine} />
        <div>
            <FormRow>
              <div className={styles.formLinkArea}>
                <a>Legal and Imporatant Information</a>
                <a>Contact us</a>
              </div>
              <LearnMoreSection />
            </FormRow>
        </div>
        
      </section>
      
        

    )
  }

}

export default FormCompletionSection
