import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import AppButton from 'components/Buttons/AppButton';
import Switch from 'rc-switch';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { MdInfo, MdCheck } from 'react-icons/lib/md';
import { GoTrashcan } from 'react-icons/lib/go';
import { formBuilderBox } from 'constants/formBuilder';
import { getArrangedBlocksPosition } from 'helpers/formBuilderHelper';
import MappingToolbarLayout, {
  ToolbarCol,
  ToolbarRow
} from '../MappingToolbarLayout';
import Label from '../Label';
import SpinEdit from '../SpinEdit';
import styles from './BlockMappingToolbar.scss';

const arrangePopover = (
  <Popover id="blockMappingToolbarArrangePopover">
    TODO: Add arange popover here.
  </Popover>
);

export default class BlockMappingToolbar extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onSave: PropTypes.func,
    pageZoom: PropTypes.number.isRequired,
    values: PropTypes.object.isRequired,
    viewportHeight: PropTypes.number.isRequired,
    viewportWidth: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      arranged: false
    };
  }

  handleBlocksChange = (blockCount) => {
    const { onChange, values: { box } } = this.props;
    const blocks = getArrangedBlocksPosition(box, blockCount);
    onChange({ blocks });
  }

  handleWidthChange = (width) => {
    const { WIDTH } = formBuilderBox;
    const { onChange, values } = this.props;
    const box = values.box.slice();
    box[WIDTH] = width;
    const blocks = getArrangedBlocksPosition(box, _.size(values.blocks));
    onChange({ box, blocks });
  }

  handleHeightChange = (height) => {
    const { HEIGHT } = formBuilderBox;
    const { onChange, values } = this.props;
    const box = values.box.slice();
    box[HEIGHT] = height;
    const blocks = getArrangedBlocksPosition(box, _.size(values.blocks));
    onChange({ box, blocks });
  }

  handleFontSizeChange = (fontSize) => {
    const { onChange } = this.props;
    onChange({ 'font_size': fontSize });
  }

  handleArrange = (arranged) => {
    if (arranged) {
      const { onChange, values: { box, blocks: currentBlocks } } = this.props;
      const blocks = getArrangedBlocksPosition(box, _.size(currentBlocks));
      onChange({ blocks });
    }
    this.setState({ arranged });
  }

  render() {
    const { onDelete, onSave, pageZoom, values, viewportWidth, viewportHeight } = this.props;
    const { blocks, box, font_size: fontSize } = values;
    const { arranged } = this.state;
    const { WIDTH, HEIGHT } = formBuilderBox;
    const blocksCount = blocks ? blocks.length : 1;
    return (
      <MappingToolbarLayout box={values.box} pageZoom={pageZoom}
        viewportWidth={viewportWidth} viewportHeight={viewportHeight}>
        <ToolbarRow>
          <ToolbarCol className={styles.halfCol}>
            <Label className={styles.label}>Blocks:</Label>
            <SpinEdit disabled={arranged} value={blocksCount} onChange={this.handleBlocksChange} />
          </ToolbarCol>
          <ToolbarCol className={styles.halfCol}>
            <Label className={styles.label}>Font:</Label>
            <SpinEdit disabled={arranged} value={fontSize} onChange={this.handleFontSizeChange} />
          </ToolbarCol>
        </ToolbarRow>
        <ToolbarRow>
          <ToolbarCol className={styles.halfCol}>
            <Label className={styles.label}>Width:</Label>
            <SpinEdit disabled={arranged} value={box[WIDTH]} onChange={this.handleWidthChange} />
          </ToolbarCol>
          <ToolbarCol className={styles.halfCol}>
            <Label className={styles.label}>Height:</Label>
            <SpinEdit disabled={arranged} value={box[HEIGHT]} onChange={this.handleHeightChange} />
          </ToolbarCol>
        </ToolbarRow>
        <ToolbarRow>
          <ToolbarCol className={styles.halfCol}>
            <Label>
              Arrange:{' '}
              <OverlayTrigger trigger={['focus', 'hover']} placement="top" overlay={arrangePopover}>
                <span className={styles.popoverIcon} tabIndex={0}>
                  <MdInfo size={16} />
                </span>
              </OverlayTrigger>
            </Label>
            <div className="pull-right">
              <Switch checked={arranged} onChange={this.handleArrange} />
            </div>
          </ToolbarCol>
          <ToolbarCol className={`${styles.halfCol} text-right`}>
            <Button className={styles.removeButton} onClick={onDelete}>
              <GoTrashcan size={18} />
            </Button>
            <AppButton size="sm" extraClass={styles.saveButton} onClick={onSave}>
              <MdCheck size={16} />
            </AppButton>
          </ToolbarCol>
        </ToolbarRow>
      </MappingToolbarLayout>
    );
  }
}
