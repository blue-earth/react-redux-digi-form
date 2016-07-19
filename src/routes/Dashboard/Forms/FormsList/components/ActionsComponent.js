import React, {
  Component,
  PropTypes
} from 'react';

import { Link } from 'react-router';
import { formsUrl } from 'helpers/urlHelper';
import { FaEdit } from 'react-icons/lib/fa';

export default class ActionsComponent extends Component {

  static propTypes = {
    rowData: PropTypes.object.isRequired
  };

  render() {
    return (
      <Link to={formsUrl(`/${this.props.rowData.id}/edit`)}>
        <FaEdit />
        {' '}
        Edit
      </Link>
    );
  }
}
