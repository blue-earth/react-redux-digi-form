import React, { Component, PropTypes } from 'react'
import { Table, DropdownButton, MenuItem, Pagination } from 'react-bootstrap'
import Header from 'components/Headers/Header'
import styles from './FormListView.scss'

class FormListView extends Component {

  constructor(props) {
    super(props);
  }

  get renderFormList() {
    return (
      <Table hover className={styles.formListTable}>
        <thead>
          <tr>
            <th>My forms</th>
            <th>Created</th>
            <th>Completed</th>
            <th>Viewed</th>
            <th>Incomplete</th>
            <th>Sent</th>
            <th>Abandoned</th>
            <th> - </th>
          </tr>
        </thead>
        <tbody>
          {
            [{1:1},{2:2},{3:3}].map(function(data, i) {
              return (
                <tr>
                  <td>SMSF Non Coroporate Application</td>
                  <td>01/03/16</td>
                  <td>12</td>
                  <td>55</td>
                  <td>34</td>
                  <td>133</td>
                  <td>133</td>
                  <td>
                    <DropdownButton bsStyle="default" title="Quick actions" key={1} id={`dropdown-basic-${i}`}>
                      <MenuItem eventKey="1">Action 1</MenuItem>
                      <MenuItem eventKey="2">Action 2</MenuItem>
                      <MenuItem eventKey="3">Action 3</MenuItem>
                    </DropdownButton>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    )
  }
  get renderPagination() {
    return (
      <Pagination
        bsSize="medium"
        items={10}
        activePage={1}
        onSelect={this.handleSelect} />
    )
  }

  handleSelect() {

  }

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          {this.renderFormList}
          {this.renderPagination}
        </div>
      </div>
    )
  }
}

export default FormListView
