import React, {
  Component,
  PropTypes
} from 'react';
import Griddle from 'griddle-react';
import _ from 'lodash';
import ActionsComponent from './ActionsComponent';
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

  constructor(props) {
    super(props);
    this.state = {
      forms: props.forms
    };
  }

  componentDidMount() {
    const { fetchFormsList } = this.props;
    fetchFormsList();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      forms: nextProps.forms
    });
  }

  get columnMetadata() {
    return [
      {
        'columnName': 'id',
        'order': 1,
        'locked': false,
        'visible': true,
        'displayName': 'ID'
      },
      {
        'columnName': 'title',
        'order': 2,
        'locked': false,
        'visible': true,
        'displayName': 'Name'
      },
      {
        'columnName': 'author',
        'order': 3,
        'locked': false,
        'visible': true,
        'displayName': 'Created by'
      },
      {
        'columnName': 'created',
        'order': 4,
        'locked': false,
        'visible': true,
        'displayName': 'Created'
      },
      {
        'columnName': 'status',
        'order': 5,
        'locked': false,
        'visible': true,
        'displayName': 'Status'
      },
      {
        'columnName': 'slug',
        'locked': true,
        'visible': false
      },
      {
        'columnName': 'actions',
        'order': 6,
        'locked': true,
        'sortable': false,
        'displayName': '',
        'customComponent': ActionsComponent
      }
    ];
  }

  get columns() {
    return _.map(
      _.filter(this.columnMetadata, (o) => (o.visible !== false)),
      'columnName'
    );
  }

  get resultsData() {
    const { forms } = this.state;
    return _.map(forms, (form) =>
      Object.assign({}, form, { actions: '' })
    );
  }

  renderFormList() {
    return (
      <Griddle
        results={this.resultsData}
        columnMetadata={this.columnMetadata}
        columns={this.columns} />
    );
  }

  render() {
    return (
      <div className={styles.formsList}>
        <div className={styles.formsListInner}>
          {this.renderFormList()}
        </div>
      </div>
    );
  }
}

export default FormListView;
