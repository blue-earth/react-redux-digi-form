import React, {
  Component
} from 'react';
import HeaderButton from 'components/Buttons/DashButtons/HeaderButton';
import SelectButton from 'components/Buttons/DashButtons/SelectButton';
import { ButtonToolbar } from 'react-bootstrap';
import { FaRefresh, FaPlus } from 'react-icons/lib/fa';

class SubmissionsFilter extends Component {

  get typeOptions() {
    return [
      {
        key: 'forms',
        eventKey: 'forms',
        label: 'Forms'
      },
      {
        key: 'something',
        eventKey: 'something',
        label: 'Something Else'
      }
    ];
  }

  get userOptions() {
    return [
      {
        key: 'sales',
        eventKey: 'sales',
        label: 'Sales Team'
      },
      {
        key: 'other',
        eventKey: 'other',
        label: 'Another user'
      }
    ];
  }

  get timeOptions() {
    return [
      {
        key: 'thisweek',
        eventKey: 'thisweek',
        label: 'This Week'
      },
      {
        key: 'otherweek',
        eventKey: 'otherweek',
        label: 'Some Other Week'
      }
    ];
  }

  render() {
    return (
      <div className="filter-container">
        <ButtonToolbar className="left">
          <HeaderButton style="formButton"><FaRefresh /> Refresh</HeaderButton>
          <HeaderButton style="formButton"><FaPlus /> Custom Column</HeaderButton>
        </ButtonToolbar>
        <ButtonToolbar className="right">
          <SelectButton optionList={this.typeOptions} label="Type" />
          <SelectButton optionList={this.userOptions} label="User" />
          <SelectButton optionList={this.timeOptions} />
        </ButtonToolbar>
      </div>
    );
  }
}

export default SubmissionsFilter;
