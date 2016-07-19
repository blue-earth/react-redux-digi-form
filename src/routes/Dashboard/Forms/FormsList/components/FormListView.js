import React, {
  Component,
  PropTypes
} from 'react';
import {
  Table,
  Pagination
} from 'react-bootstrap';
import { Link } from 'react-router';
import { formsUrl } from 'helpers/urlHelper';
import { FaEdit } from 'react-icons/lib/fa';
import styles from './FormListView.scss';

class FormListView extends Component {
  static propTypes = {
    /*
     * isFetching: Redux state that indicates whether the requested form is being fetched from backend
     */
    isFetching: PropTypes.bool.isRequired,

    /*
     * forms: Redux state that indicates whether the requested form is being fetched from backend
     */
    forms: PropTypes.array.isRequired,

    /*
     * fetchForm: Redux action to fetch form from backend with ID specified by request parameters
     */
    fetchFormsList: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { fetchFormsList } = this.props;
    fetchFormsList();
  }

  get renderFormList() {
    const { forms } = this.props;
    return (
      <Table hover className={styles.formListTable}>
        <thead>
          <tr>
            <th>My forms</th>
            <th>Created by</th>
            <th>Created</th>
            <th>Status</th>
            <th> - </th>
            <th> - </th>
          </tr>
        </thead>
        <tbody>
          {
            forms.map(function (form, i) {
              return (
                <tr>
                  <td>{form.title}</td>
                  <td>Admin</td>
                  <td>{form.created}</td>
                  <td>DRAFT</td>
                  <td>
                    <Link to={formsUrl(`/${form.id}/edit`)}>
                      <FaEdit />
                      {' '}
                      Edit
                    </Link>
                  </td>
                  <td></td>
                </tr>
              );
            })
          }
        </tbody>
      </Table>
    );
  }
  get renderPagination() {
    return (
      <Pagination
        bsSize="medium"
        items={10}
        activePage={1}
        onSelect={this.handleSelect} />
    );
  }

  render() {
    return (
      <div className={styles.formsList}>
        <div className={styles.formsListInner}>
          {this.renderFormList}
          {this.renderPagination}
        </div>
      </div>
    );
  }
}

export default FormListView;
