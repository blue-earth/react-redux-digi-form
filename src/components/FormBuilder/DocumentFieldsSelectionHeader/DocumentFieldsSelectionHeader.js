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
    deleteClickHandler: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    setActiveLabel: PropTypes.func.isRequired,
    activeLabel: PropTypes.string.isRequired
  };

  static defaultProps = {
    backLinkClickHandler: noop,
    style: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedLabel: ''
    };
  }

  labelSelectHandler = (name) => {
    const { setActiveLabel } = this.props;
    var label = '';
    // if selecting an existing selected button,
    // toggle the selection off
    if (name !== this.state.selectedLabel) {
      label = name;
    }
    this.setState({
      selectedLabel: label
    });
    setActiveLabel(label);
  }

  isLabelSelected = (labelName) => {
    return labelName === this.state.selectedLabel;
  }

  get currentSelectedGroup() {
    var selectedLabel = this.state.selectedLabel;
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
    var labelRow;
    var groupName = labels[0]['group'];
    if (this.currentSelectedGroup && this.currentSelectedGroup !== groupName) {
      return null;
    }

    if (groupName) {
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
            return <SelectableOutlineButton
              isSelectable={false}
              isSelected={this.isLabelSelected(label['key'])}
              onClick={this.labelSelectHandler}
              name={label['key']}
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
            <GoTrashcan size={'24px'} style={{'cursor': 'pointer', 'marginRight': '8'}} />
            <SelectableOutlineButton isSelectable={false}>
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
