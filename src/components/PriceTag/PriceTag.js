import React, {
  Component,
  PropTypes
} from 'react';

export default class PriceTag extends Component {
  static propTypes = {
    price: PropTypes.number,
    currency: PropTypes.string,
    currencySymbol: PropTypes.string
  }
  static defaultProps = {
    price: 0,
    currencySymbol: '$',
    currency: ''
  }
  processPrice = () => {
    const { price } = this.props;
    if (price < 0) {
      const value = Math.abs(price);
      return {
        mark: '- ',
        value: value % 100 === 0 ? value / 100 : parseInt(value / 100) + '.' + value % 100
      };
    } else {
      return {
        mark: null,
        value: price % 100 === 0 ? price / 100 : parseInt(price / 100) + '.' + price % 100
      };
    }
  }
  render() {
    return (
      <span>
        {this.processPrice().mark}
        {this.props.currency || ''}
        {' '}
        {this.props.currencySymbol}
        {this.processPrice().value}
      </span>
    );
  }
};
