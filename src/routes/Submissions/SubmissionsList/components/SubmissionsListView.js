import React, {
  Component,
  PropTypes
} from 'react';
import {
  Table,
  Pagination
} from 'react-bootstrap';
import { Link } from 'react-router';
import { submissionsUrl } from 'helpers/urlHelper';
import styles from './SubmissionsListView.scss';

class SubmissionsListView extends Component {
  static propTypes = {
    /*
     * isFetching: Redux state that indicates whether the requested form is being fetched from backend
     */
    isFetching: PropTypes.bool.isRequired,

    /*
     * submissions: Redux state that indicates whether the requested form is being fetched from backend
     */
    submissions: PropTypes.array.isRequired,

    /*
     * fetchSubmissions: Redux action to fetch form from backend with ID specified by request parameters
     */
    fetchSubmissions: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { fetchSubmissions } = this.props;
    fetchSubmissions();
  }

  get renderSubmissionsList() {
    const { submissions } = this.props;
    return (
      <Table hover className={styles.formListTable}>
        <thead>
          <tr>
            <th>Form ID</th>
            <th>Submissions</th>
            <th>Response ID</th>
            <th> - </th>
          </tr>
        </thead>
        <tbody>
          {
            submissions.map(function (submission, i) {
              return (
                <tr>
                  <td>{submission.form_id}</td>
                  <td>{submission.response_id}</td>
                  <td>
                    <Link to={submissionsUrl(`/${submission.form_id}/${submission.response_id}`)}>
                      View
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
      <div className={styles.submissionsList}>
        <div className={styles.submissionsListInner}>
          {this.renderSubmissionsList}
          {this.renderPagination}
        </div>
      </div>
    );
  }
}

export default SubmissionsListView;
