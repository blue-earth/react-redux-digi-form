import React, {
  Component,
  PropTypes
} from 'react';
import { Button } from 'react-bootstrap';
import AppButton from 'components/Buttons/AppButton';
import MappingToolbarLayout, {
  ToolbarCol,
  ToolbarRow
} from '../MappingToolbarLayout';
import { MdCheck } from 'react-icons/lib/md';
import { GoTrashcan } from 'react-icons/lib/go';
import { formBuilderBox } from 'constants/formBuilder';
import SpinEdit from '../SpinEdit';
import styles from './StandardMappingToolbar.scss';

export default class StandardMappingToolbar extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onSave: PropTypes.func,
    pageZoom: PropTypes.number.isRequired,
    values: PropTypes.object.isRequired,
    viewportHeight: PropTypes.number.isRequired,
    viewportWidth: PropTypes.number.isRequired
  };

  handleWidthChange = (width) => {
    const { WIDTH } = formBuilderBox;
    const { onChange, values } = this.props;
    const box = values.box.slice();
    box[WIDTH] = width;
    onChange({ box });
  }

  handleHeightChange = (height) => {
    const { HEIGHT } = formBuilderBox;
    const { onChange, values } = this.props;
    const box = values.box.slice();
    box[HEIGHT] = height;
    onChange({ box });
  }

  handleFontSizeChange = (fontSize) => {
    const { onChange } = this.props;
    onChange({ 'font_size': fontSize });
  }

  render() {
    const { onDelete, onSave, pageZoom, values, viewportWidth, viewportHeight } = this.props;
    const { box, font_size: fontSize } = values;
    const { WIDTH, HEIGHT } = formBuilderBox;

    return (
      <MappingToolbarLayout box={values.box} pageZoom={pageZoom}
        viewportWidth={viewportWidth} viewportHeight={viewportHeight}>
        <ToolbarRow>
          <ToolbarCol>
            <SpinEdit label="W:" value={box[WIDTH]} onChange={this.handleWidthChange} />
          </ToolbarCol>
          <ToolbarCol>
            <SpinEdit label="H:" value={box[HEIGHT]} onChange={this.handleHeightChange} />
          </ToolbarCol>
          <ToolbarCol>
            <SpinEdit label="Font:" value={fontSize} onChange={this.handleFontSizeChange} />
          </ToolbarCol>
          <ToolbarCol>
            <AppButton size="sm" extraClass={styles.saveButton} onClick={onSave}>
              <MdCheck size={16} />
            </AppButton>
            <Button className={styles.removeButton} onClick={onDelete}>
              <GoTrashcan size={18} />
            </Button>
          </ToolbarCol>
        </ToolbarRow>
      </MappingToolbarLayout>
    );
  }
}
