import React, {
  Component
} from 'react';
import Button from 'components/Buttons/DashboardButtons/Button';
import SelectButton from 'components/Buttons/DashboardButtons/SelectButton';
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
          <Button style="formButton"><FaRefresh /> Refresh</Button>
          <Button style="formButton"><FaPlus /> Custom Column</Button>
        </ButtonToolbar>
        <ButtonToolbar className="right">
          <SelectButton style="formButton" optionList={this.typeOptions} label="Type" />
          <SelectButton style="formButton" optionList={this.userOptions} label="User" />
          <SelectButton style="formButton" optionList={this.timeOptions} />
        </ButtonToolbar>
      </div>
    );
  }
}

export default SubmissionsFilter;
