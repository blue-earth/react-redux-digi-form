import React, {
  Component,
  PropTypes
} from 'react';
import moment from 'moment';
import styles from './AnswerValue.scss';

export default class AnswerValue extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string
    ]).isRequired
  };

  renderMultipleChoice(value) {
    const { question: { allowMultiple } } = this.props;
    if (value) {
      if (allowMultiple) {
        return value.map((item, index) => {
          return (
            <div className={styles.choiceItem} key={index}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.text}>{item.text}</span>
            </div>
          );
        });
      } else {
        return (
          <div className={styles.choiceItem}>
            <span className={styles.label}>{value.label}</span>
            <span className={styles.text}>{value.text}</span>
          </div>
        );
      }
    } else {
      return false;
    }
  }

  renderDateField(value) {
    const { question: { dateFormat } } = this.props;
    return moment(value).format(dateFormat);
  }

  renderAddressField(value) {
    const addressArray = [];
    if (value) {
      value.address_line1 && addressArray.push(value.address_line1);
      value.address_line2 && addressArray.push(value.address_line2);
      value.suburb && addressArray.push(value.suburb);
      value.state && addressArray.push(value.state);
      value.postcode && addressArray.push(value.postcode);
      return addressArray.join(' | ');
    } else {
      return false;
    }
  }

  renderSignatureField(value) {
    return <img src={value} alt="signature" />;
  }

  getAnswerStringByType() {
    const { value, question: { type } } = this.props;

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

  render() {
    const answer = this.getAnswerStringByType();

    return (
      <div className={styles.answer}>
        {answer}
      </div>
    );
  }
}

