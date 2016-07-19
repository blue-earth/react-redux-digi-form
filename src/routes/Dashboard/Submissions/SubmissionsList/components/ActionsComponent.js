import React, {
  Component,
  PropTypes
} from 'react';

import { Link } from 'react-router';
import { submissionsUrl } from 'helpers/urlHelper';

export default class ActionsComponent extends Component {

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
