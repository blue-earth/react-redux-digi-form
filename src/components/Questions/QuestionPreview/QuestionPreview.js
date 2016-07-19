import React, {
  Component,
  PropTypes
} from 'react';
import {
  Row,
  Col
} from 'react-bootstrap';
import styles from './QuestionPreview.scss';
import moment from 'moment';
import Hogan from 'hogan.js';

/**
 * This component joins QuestionDisplay and one of the question input
 *
 */

class QuestionPreview extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {

    /*
     * value: Question answer value
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),

    /*
     * type: Question type.
     */
    type: PropTypes.string,

    /*
     * context: context variable, array of {answer_xxx: 'ANSWERED_VALUE'} for replacement by Hogan.js
     */
    context: PropTypes.object,

    questionInstruction: PropTypes.string,

    questionDescription: PropTypes.string,

    dateFormat: PropTypes.string,

    allowMultiple: PropTypes.bool
  };

  static defaultProps = {
    context: {},
    dateFormat: 'YYYY/MM/DD'
  };

  compileTemplate(template, context) {
    if (template) {
      var t = Hogan.compile(template);
      return t.render(context);
    } else {
      return '';
    }
  }

  renderQuestionDisplay() {
    const { context, questionInstruction } = this.props;

    return (
      <div className={styles.question}>
        {this.compileTemplate(questionInstruction, context)}
      </div>
    );
  }

  renderMultipleChoice(value) {
    const { allowMultiple } = this.props;
    if (value) {
      if (allowMultiple) {
        return value.map((item, index) => {
          return (
            <div className={styles.choiceItem} key={index}>
              {`${item.label}. ${item.text}`}
            </div>
          );
        });
      } else {
        return `${value.label}. ${value.text}`;
      }
    } else {
      return false;
    }
  }

  renderDateField(value) {
    return moment(value).format(this.props.dateFormat);
  }

  renderAddressField(value) {
    const addressArray = [];
    if (value) {
      value.address_line1 && addressArray.push(value.address_line1);
      value.address_line2 && addressArray.push(value.address_line2);
      value.suburb && addressArray.push(value.suburb);
      value.state && addressArray.push(value.state);
      value.postcode && addressArray.push(value.postcode);
      return addressArray.join(', ');
    } else {
      return false;
    }
  }

  renderSignatureField(value) {
    return <img src={value} alt="signature" />;
  }

  getAnswerStringByType() {
    const { value, type } = this.props;

    switch (type) {
      case 'ShortTextField':
      case 'EmailField':
      case 'LongTextField':
      case 'StatementField':
      case 'NumberField':
      case 'PhoneNumberField':
      case 'DropdownField':
        return value;
      case 'MultipleChoice':
      case 'YesNoChoiceField':
        return this.renderMultipleChoice(value);
      case 'DateField':
        return this.renderDateField(value);
      case 'AddressField':
        return this.renderAddressField(value);
      case 'SignatureField':
        return this.renderSignatureField(value);
      default:
        return false;
    }
  }

  renderAnswer() {
    const answer = this.getAnswerStringByType();

    return (
      <div className={styles.answer}>
        {answer}
      </div>
    );
  }

  render() {
    return (
      <Row className={styles.questionRow}>
        <Col sm={6}>
          {this.renderQuestionDisplay()}
        </Col>
        <Col sm={6}>
          {this.renderAnswer()}
        </Col>
      </Row>
    );
  }
}

export default QuestionPreview;
