import React, {
  Component,
  PropTypes
} from 'react';
import BaseIcon from './BaseIcon';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import Email from './Email';
import Date from './Date';
import List from './List';
import Number from './Number';
import Pin from './Pin';
import Paragraph from './Paragraph';
import Phone from './Phone';
import ShortText from './ShortText';
import Signature from './Signature';
import Statement from './Statement';
import Upload from './Upload';

export default class Icon extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired
  }

  render() {
    const Name = this.props.name;
    const list = {
      Address: <Pin />,
      Checkbox: <Checkbox />,
      Date: <Date />,
      Dropdown: <Dropdown />,
      Email: <Email />,
      List: <List />,
      Legal: <Statement />,
      Number: <Number />,
      Pin: <Pin />,
      Phone: <Phone />,
      Paragraph: <Paragraph />,
      ShortText: <ShortText />,
      Signature: <Signature />,
      Statement: <Statement />,
      Upload: <Upload />
    };
    return (
      <BaseIcon {...this.props}>
        {list[Name]}
      </BaseIcon>
    );
  }
}
