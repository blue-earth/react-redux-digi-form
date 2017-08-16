import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames';
import SelectBox from 'components/SelectBox';
import SectionTitle from '../SectionTitle';
import styles from './SelectBoxRow.scss';

class SelectBoxRow extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    popoverId: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    optionsList: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * Label for dropdown item display
         */
        label: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.node,
          PropTypes.number
        ]),
        /**
         * value is passed to onChange
         */
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        isDisabled: PropTypes.bool
      })
    ),
    placeholder: PropTypes.string,
    className: PropTypes.string
  };

  render() {
    const { title, onChange, className, popoverId, optionsList, placeholder, value } = this.props;
    return (
      <div className={classNames(styles.selectBoxRow, className)}>
        <div className={styles.selectColLeft}>
          <SectionTitle title={title} popoverId={popoverId} />
        </div>
        <div className={styles.selectColRight}>
          <SelectBox value={value} appearance="shiny" fullWidth
            onChange={onChange}
            optionsList={optionsList}
            placeholder={placeholder} />
        </div>
      </div>
    );
  }
}

export default SelectBoxRow;
