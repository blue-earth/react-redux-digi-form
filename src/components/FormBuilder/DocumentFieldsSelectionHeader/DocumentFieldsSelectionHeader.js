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
    /**
     * Fields already completed document mapping
     */
    finalisedFields: PropTypes.array,
    backLinkClickHandler: PropTypes.func,
    saveAndContinueClickHandler: PropTypes.func,
    deleteClickHandler: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    setActiveLabel: PropTypes.func.isRequired,
    activeLabel: PropTypes.string.isRequired
  };

  static defaultProps = {
    availableFields: [
      []    // Empty group, has no label
    ],
    finalisedFields: [],
    backLinkClickHandler: noop,
    style: {}
  };

  componentDidMount() {
    // If the toolbar only has one group and it contains only 1 label(field),
    // select it automatically
    const numLabelGroups = this.props.availableFields.length;
    if (numLabelGroups === 1 && this.props.availableFields[0].length === 1) {
      // Only has 1 label group, and the group contains only 1 label
      const firstLabelName = this.props.availableFields[0][0]['key'];
      this.labelSelectHandler(firstLabelName);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeLabel && nextProps.activeLabel !== this.props.activeLabel) {
      this.labelSelectHandler(nextProps.activeLabel);
    }
  }

  labelSelectHandler = (name) => {
    const { setActiveLabel } = this.props;
    var label = '';
    // if selecting an existing selected button,
    // toggle the selection off
    if (name !== this.props.activeLabel) {
      label = name;
    } else {
      if (this.props.finalisedFields.indexOf(name) > -1) {
      // If the label is mapped, do not allow it from deselecting
        return;
      }
    }
    setActiveLabel(label);
  }

  isLabelSelected = (labelName) => {
    return labelName === this.props.activeLabel;
  }

  get currentSelectedGroup() {
    var selectedLabel = this.props.activeLabel;
    var selectedGroup = null;
    for (let labelGroupArray of this.props.availableFields) {
      var results = labelGroupArray.filter((labelObj) => labelObj.key === selectedLabel);
      if (results.length) {
        selectedGroup = results[0]['group'];
        break;
      }
    }
    return selectedGroup;
  }

  renderTagGroup = (labels) => {
    var fieldGroupNameRow;
    var groupName = labels[0]['group'];
    if (this.currentSelectedGroup && this.currentSelectedGroup !== groupName) {
      return null;
    }

    if (groupName) {
      const style = {
        'color': '#71828b',
        'fontSize': '11px'
      };
      fieldGroupNameRow = <span style={style}>{labels[0]['group']}</span>;
    }
    const buttonStyleModifier = {
      'margin': '3px 8px',
      'fontSize': '12px'
    };
    const { finalisedFields } = this.props;
    return (
      <div>
        {fieldGroupNameRow}
        <div>
          {labels.map((label, i) => {
            return <SelectableOutlineButton
              isSelectable={false}
              isSelected={this.isLabelSelected(label['key'])}
              name={label['key']}
              onClick={this.labelSelectHandler}
              isFinalised={finalisedFields.indexOf(label['key']) > -1}
              style={buttonStyleModifier} key={i}>
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
      saveAndContinueClickHandler,
      deleteClickHandler,
      availableFields,
      style,
      className
    } = this.props;
    const containerClassNames = cx({
      [className]: Boolean(className),
      'headerContainer': true
    });
    return (
      <section className={containerClassNames} style={style}>
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
            <GoTrashcan
              onClick={deleteClickHandler} size={'24px'} style={{'cursor': 'pointer', 'marginRight': '8px'}} />
            <SelectableOutlineButton isSelectable={false} onClick={saveAndContinueClickHandler}>
              Save & Continue
            </SelectableOutlineButton>
          </div>
        </div>
        <div className={cx('headerContainerRow', 'centerAlign')}>
          {availableFields && availableFields.map(
            (fieldsGroup, i) => <div key={i}>{this.renderTagGroup(fieldsGroup)}</div>
          )}
        </div>
      </section>
    );
  }
}
export default DocumentFieldsSelectionHeader;
