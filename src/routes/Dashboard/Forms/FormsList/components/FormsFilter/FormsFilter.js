import React, {
  Component,
  PropTypes
} from 'react';
import SelectButton from 'components/Buttons/SelectButton';
import { ButtonToolbar } from 'react-bootstrap';
import Icon from 'components/Icon';
import AppButton from 'components/Buttons/AppButton';
import classNames from 'classnames';
import styles from './FormsFilter.scss';

class FormsFilter extends Component {

  static propTypes = {
    pageSize: PropTypes.number,
    setPageSize: PropTypes.func,
    selectedItems: PropTypes.array,
    handleCreateForm: PropTypes.func.isRequired
  }

  handleCreateForm = () => {
    this.props.handleCreateForm();
  }

  get paginationOptions() {
    return [
      {
        key: 5,
        label: 5
      },
      {
        key: 10,
        label: 10
      },
      {
        key: 20,
        label: 20
      }
    ];
  }
  render() {
    const { pageSize, setPageSize } = this.props;
    return (
      <div className={styles.filterContainer}>
        <ButtonToolbar className="pull-left">
          <SelectButton className={styles.formButton}
            optionsList={this.paginationOptions}
            label="Show"
            value={pageSize}
            onChange={setPageSize} />
        </ButtonToolbar>
        <ButtonToolbar className="pull-right">
          <SelectButton className={styles.formButton}
            label={
              <strong>
                <Icon name="Refresh" height={37} width={15} className={styles.buttonIcon} />
                {' '}
                Refresh
              </strong>}
            isStaticValue
            onClick={this.handleRefresh} />
          <AppButton
            extraClass={classNames(styles.formButton, styles.createButton)}
            onClick={this.handleCreateForm}>
            <Icon name="Create" height={37} width={11} className={styles.buttonIcon} />
            {' '}
            Create
          </AppButton>
        </ButtonToolbar>
        <div className="clearfix"></div>
      </div>
    );
  }
}

export default FormsFilter;
