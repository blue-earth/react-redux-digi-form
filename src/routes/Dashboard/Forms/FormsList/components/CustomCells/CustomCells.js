import React, {
  Component,
  PropTypes
} from 'react';

import { Link } from 'react-router';
import { formsUrl } from 'helpers/urlHelper';
import {
  FaSearch,
  FaEdit,
  FaPaperPlaneO
} from 'react-icons/lib/fa';
import styles from './CustomCells.scss';
import { DateCell } from 'components/GriddleComponents/CommonCells/CommonCells';

export { DateCell };

export class ActionsCell extends Component {

  static propTypes = {
    rowData: PropTypes.object.isRequired
  };

  render() {
    const { rowData } = this.props;
    return (
      <ul className={styles.actionsWrapper}>
        <li>
          <Link to={formsUrl(`/${rowData.id}/edit`)}>
            <FaSearch size={16} />
            <span className={styles.actionText}>Analyse</span>
          </Link>
        </li>
        <li>
          <Link to={formsUrl(`/${rowData.id}/edit`)}>
            <FaEdit size={16} />
            <span className={styles.actionText}>View</span>
          </Link>
        </li>
        <li>
          <Link to={formsUrl(`/${rowData.id}/edit`)}>
            <FaPaperPlaneO size={16} />
            <span className={styles.actionText}>Send</span>
          </Link>
        </li>
      </ul>
    );
  }
}

