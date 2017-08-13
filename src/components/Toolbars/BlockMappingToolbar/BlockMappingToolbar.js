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
    pageZoom: PropTypes.number.isRequired,
    values: PropTypes.object.isRequired,
    viewportHeight: PropTypes.number.isRequired,
    viewportWidth: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      blocks: props.values.blocks || [],
      box: props.values.box,
      fontSize: props.values.font_size
    };
  }

  componentWillReceiveProps(nextProps) {
    const { values } = nextProps;
    this.setState({
      box: values.box,
      fontSize: values.font_size
    });
  }

  handleBlocksChange = (blockCount) => {
    const box = this.state.box;
    const { WIDTH, HEIGHT } = formBuilderBox;
    const blockWidth = box[WIDTH] / blockCount;
    const blockHeight = box[HEIGHT];
    const blocks = _.map(new Array(blockCount), (block, index) => ([
      blockWidth * index, // left
      0,  // top
      blockWidth,  // width
      blockHeight  // height
    ]));
    this.setState({ blocks });
  }

  handleWidthChange = (width) => {
    const box = this.state.box.slice();
    const { WIDTH } = formBuilderBox;
    box[WIDTH] = width;
    this.setState({ box });
  }

  handleHeightChange = (height) => {
    const box = this.state.box.slice();
    const { HEIGHT } = formBuilderBox;
    box[HEIGHT] = height;
    this.setState({ box });
  }

  handleFontSizeChange = (fontSize) => {
    this.setState({ fontSize });
  }

  handleSaveClick = () => {
    const { onChange } = this.props;
    const { blocks, box, fontSize } = this.state;
    onChange({
      'blocks': blocks,
      'box': box,
      'font_size': fontSize
    });
  }

  render() {
    const { pageZoom, values, viewportWidth, viewportHeight } = this.props;
    const { blocks, box, fontSize } = this.state;
    const { WIDTH, HEIGHT } = formBuilderBox;

    return (
      <MappingToolbarLayout box={values.box} pageZoom={pageZoom}
        viewportWidth={viewportWidth} viewportHeight={viewportHeight}>
        <ToolbarRow>
          <ToolbarCol className={styles.halfCol}>
            <Label className={styles.label}>Blocks:</Label>
            <SpinEdit value={blocks.length} onChange={this.handleBlocksChange} />
          </ToolbarCol>
          <ToolbarCol className={styles.halfCol}>
            <Label className={styles.label}>Font:</Label>
            <SpinEdit value={fontSize} onChange={this.handleFontSizeChange} />
          </ToolbarCol>
        </ToolbarRow>
        <ToolbarRow>
          <ToolbarCol className={styles.halfCol}>
            <Label className={styles.label}>Width:</Label>
            <SpinEdit value={box[WIDTH]} onChange={this.handleWidthChange} />
          </ToolbarCol>
          <ToolbarCol className={styles.halfCol}>
            <Label className={styles.label}>Height:</Label>
            <SpinEdit value={box[HEIGHT]} onChange={this.handleHeightChange} />
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
              <Switch />
            </div>
          </ToolbarCol>
          <ToolbarCol className={`${styles.halfCol} text-right`}>
            <Button className={styles.removeButton}><GoTrashcan size={18} /></Button>
            <AppButton size="sm" extraClass={styles.saveButton} onClick={this.handleSaveClick}>
              <MdCheck size={16} />
            </AppButton>
          </ToolbarCol>
        </ToolbarRow>
      </MappingToolbarLayout>
    );
  }
}
