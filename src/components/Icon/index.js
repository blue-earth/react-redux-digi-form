import React, {
  Component,
  PropTypes
} from 'react';
import BaseIcon from './BaseIcon';
import Checkbox from './Checkbox';
import Dropdown from './DropDown';
import Email from './Email';
import Date from './Date';
import List from './List';
import Number from './Number';
import Pin from './Pin';
import Pen from './Pen';
import Paragraph from './Paragraph';
import Phone from './Phone';
import ShortText from './ShortText';
import Signature from './Signature';
import Statement from './Statement';
import Upload from './Upload';
import StandardInput from './StandardInput';
import BlockInput from './BlockInput';
import Refresh from './Refresh';
import Create from './Create';
import Send from './Send';
import File from './File';
import BoxIn from './BoxIn';
import Trash from './Trash';

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
      Pen: <Pen />,
      Phone: <Phone />,
      Paragraph: <Paragraph />,
      ShortText: <ShortText />,
      Signature: <Signature />,
      Statement: <Statement />,
      Upload: <Upload />,
      StandardInput: <StandardInput />,
      BlockInput: <BlockInput />,
      Refresh: <Refresh />,
      Create: <Create />,
      Send: <Send />,
      Duplicate: <File />,
      Archive: <BoxIn />,
      Trash: <Trash />,
      Delete: <Trash />
    };
    return (
      <BaseIcon {...this.props}>
        {list[Name]}
      </BaseIcon>
    );
  }
}
