import React, {
  Component,
  PropTypes
} from 'react';
import {
  FaCcVisa,
  FaCcAmex,
  FaCcMastercard,
  FaCreditCardAlt
} from 'react-icons/lib/fa';

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

export default CardType;

