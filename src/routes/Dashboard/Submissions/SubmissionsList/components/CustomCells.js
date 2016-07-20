import React, {
  Component,
  PropTypes
} from 'react';

import {
  DropdownButton,
  MenuItem,
  Checkbox
} from 'react-bootstrap';
import { Link } from 'react-router';
import { submissionsUrl } from 'helpers/urlHelper';

export class AuthorHeaderCell extends Component {

  static propTypes = {
    displayName: PropTypes.string.isRequired,
    columnName: PropTypes.string.isRequired
  };

  selectFilter(key) {
    // this.props.filterByColumn(key, this.props.columnName)
  }

  handleCheckboxChange = (event) => {
    console.log(event.target);
  }

  get menuItems() {
    return [
      { key: '0-9', text: '0 - 9' },
      { key: 'A-H', text: 'A - H' },
      { key: 'I-P', text: 'I - P' },
      { key: 'Q-Z', text: 'Q - Z' },
      { key: 'other', text: 'Other' }
    ];
  }

  render() {
    return (
      <div onClick={function (event) { event.stopPropagation(); }} id="authorHeaderCell">
        <DropdownButton bsStyle="link" title={this.props.displayName} onSelect={this.selectFilter}>
          {
            this.menuItems.map(item => {
              return (
                <MenuItem eventKey={item.key} key={item.key}>
                  <Checkbox inline onChange={this.handleCheckboxChange} value={item.key}>
                    {item.text}
                  </Checkbox>
                </MenuItem>
              );
            })
          }
        </DropdownButton>
      </div>
    );
  }
}

export class ProgressHeaderCell extends Component {

  static propTypes = {
    displayName: PropTypes.string.isRequired,
    columnName: PropTypes.string.isRequired
  };

  selectFilter(key) {
    // this.props.filterByColumn(key, this.props.columnName)
  }

  handleCheckboxChange = (event) => {
    console.log(event.target);
  }

  get menuItems() {
    return [
      { key: 'new', text: 'New' },
      { key: 'processing', text: 'Processing' },
      { key: 'rejected', text: 'Rejected' },
      { key: 'done', text: 'Done' }
    ];
  }

  render() {
    return (
      <div onClick={function (event) { event.stopPropagation(); }} id="authorHeaderCell">
        <DropdownButton bsStyle="link" title={this.props.displayName} onSelect={this.selectFilter}>
          {
            this.menuItems.map(item => {
              return (
                <MenuItem eventKey={item.key} key={item.key}>
                  <Checkbox inline onChange={this.handleCheckboxChange} value={item.key}>
                    {item.text}
                  </Checkbox>
                </MenuItem>
              );
            })
          }
        </DropdownButton>
      </div>
    );
  }
}

export class TypeHeaderCell extends Component {

  static propTypes = {
    displayName: PropTypes.string.isRequired,
    columnName: PropTypes.string.isRequired
  };

  selectFilter(key) {
    // this.props.filterByColumn(key, this.props.columnName)
  }

  handleCheckboxChange = (event) => {
    console.log(event.target);
  }

  get menuItems() {
    return [
      { key: 'abandoned', text: 'Abandoned' },
      { key: 'incomplete', text: 'Incomplete' },
      { key: 'completed', text: 'Completed' }
    ];
  }

  render() {
    return (
      <div onClick={function (event) { event.stopPropagation(); }} id="typeHeaderCell">
        <DropdownButton bsStyle="link" title={this.props.displayName} onSelect={this.selectFilter}>
          {
            this.menuItems.map(item => {
              return (
                <MenuItem eventKey={item.key} key={item.key}>
                  <Checkbox inline onChange={this.handleCheckboxChange} value={item.key}>
                    {item.text}
                  </Checkbox>
                </MenuItem>
              );
            })
          }
        </DropdownButton>
      </div>
    );
  }
}

export class ActionsCell extends Component {

  static propTypes = {
    rowData: PropTypes.object.isRequired
  };

  render() {
    const { rowData } = this.props;
    return (
      <Link to={submissionsUrl(`/${rowData.form_id}/${rowData.response_id}`)}>
        View
      </Link>
    );
  }
}
