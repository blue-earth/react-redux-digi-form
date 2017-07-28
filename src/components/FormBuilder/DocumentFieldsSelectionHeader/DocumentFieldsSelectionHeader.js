import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames/bind';
import { noop } from 'helpers/miscellaneous';
import styles from './DocumentFieldsSelectionHeader.scss';
import SelectableOutlineButton from 'components/Buttons/SelectableOutlineButton';
import {
  GoTrashcan
} from 'react-icons/lib/go';

const cx = classNames.bind(styles);

class DocumentFieldsSelectionHeader extends Component {
  static propTypes = {
    availableFields: PropTypes.arrayOf(PropTypes.array).isRequired,
    shortDescription: PropTypes.string,
    backLinkClickHandler: PropTypes.func,
    saveAndContinueClickHandler: PropTypes.func,
    deleteClickHandler: PropTypes.func
  };
  static defaultValue = {
    backLinkClickHandler: noop
  };

  renderTagGroup = (labels) => {
    var labelRow;
    if (labels[0]['group']) {
      const style = {
        'color': '#71828b',
        'fontSize': '11px'
      };
      labelRow = <span style={style}>{labels[0]['group']}</span>;
    }
    const buttonStyleModifier = {
      'margin': '3px 8px',
      'fontSize': '12px'
    };
    return (
      <div>
        {labelRow}
        <div>
          {labels.map((label, i) => {
            return <SelectableOutlineButton style={buttonStyleModifier} key={i}>
              {label['displayName']}
            </SelectableOutlineButton>;
          })}
        </div>
      </div>
    );
  };

  render() {
    const {
      backLinkClickHandler,
      availableFields
    } = this.props;
    return (
      <section className={cx('headerContainer')}>
        <div className={cx('headerContainerRow')}>
          <div className={cx('left')}>
            <a className={cx('backLink')} href="javascript:;" onClick={backLinkClickHandler}>
              Back
            </a>
          </div>
          <div className={cx('middle')}>
            <p>Choose a format and make your selection(s)</p>
          </div>
          <div className={cx('right')}>
            <GoTrashcan size={'24px'} style={{'cursor': 'pointer', 'marginRight': '8'}} />
            <SelectableOutlineButton isSelectable={false}>
              Save & Continue
            </SelectableOutlineButton>
          </div>
        </div>
        <div className={cx('headerContainerRow', 'centerAlign')}>
          {availableFields.map(
            (fieldsGroup, i) => <div key={i}>{this.renderTagGroup(fieldsGroup)}</div>
          )}
        </div>
      </section>
    );
  }
}
export default DocumentFieldsSelectionHeader;
