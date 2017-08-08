import React, {
  Component,
  PropTypes
} from 'react';
import { Button } from 'react-bootstrap';
import _ from 'lodash';
import AppButton from 'components/Buttons/AppButton';
import MappingToolbarLayout, {
  ToolbarCol,
  ToolbarRow
} from '../MappingToolbarLayout';
import { MdCheck } from 'react-icons/lib/md';
import { GoTrashcan } from 'react-icons/lib/go';
import SpinEdit from '../SpinEdit';
import styles from './StandardMappingToolbar.scss';

export default class StandardMappingToolbar extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    placement: PropTypes.oneOf(['top', 'bottom']),
    offset: PropTypes.number,
    values: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      values: props.values
    };
  }

  componentWillReceiveProps(nextProps) {
    const { values } = nextProps;
    this.setState({ values });
  }

  handleWidthChange = (value) => {
    let values = _.assign({}, this.state.values);
    _.set(values, ['box', 'width'], value);
    this.setState({ values });
  }

  handleHeightChange = (value) => {
    let values = _.assign({}, this.state.values);
    _.set(values, ['box', 'height'], value);
    this.setState({ values });
  }

  handleFontSizeChange = (value) => {
    let values = _.assign({}, this.state.values);
    _.set(values, ['box', 'font_size'], value);
    this.setState({ values });
  }

  handleSaveClick = () => {
    const { onChange } = this.props;
    onChange(this.state.values);
  }

  render() {
    const { offset, placement } = this.props;
    const { values } = this.state;
    const width = _.get(values, ['box', 'width']);
    const height = _.get(values, ['box', 'height']);
    const fontSize = _.get(values, ['box', 'font_size']);

    return (
      <MappingToolbarLayout placement={placement} offset={offset}>
        <ToolbarRow>
          <ToolbarCol>
            <SpinEdit label="W:" value={width} onChange={this.handleWidthChange} />
          </ToolbarCol>
          <ToolbarCol>
            <SpinEdit label="H:" value={height} onChange={this.handleHeightChange} />
          </ToolbarCol>
          <ToolbarCol>
            <SpinEdit label="Font:" value={fontSize} onChange={this.handleFontSizeChange} />
          </ToolbarCol>
          <ToolbarCol>
            <AppButton size="sm" extraClass={styles.saveButton} onClick={this.handleSaveClick}>
              <MdCheck size={16} />
            </AppButton>
            <Button className={styles.removeButton}><GoTrashcan size={18} /></Button>
          </ToolbarCol>
        </ToolbarRow>
      </MappingToolbarLayout>
    );
  }
}
