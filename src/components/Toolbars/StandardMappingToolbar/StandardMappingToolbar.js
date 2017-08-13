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
    pageZoom: PropTypes.number.isRequired,
    values: PropTypes.object.isRequired,
    viewportHeight: PropTypes.number.isRequired,
    viewportWidth: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
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

  handleWidthChange = (width) => {
    this.setState({ box: _.assign({}, this.state.box, { width }) });
  }

  handleHeightChange = (height) => {
    this.setState({ box: _.assign({}, this.state.box, { height }) });
  }

  handleFontSizeChange = (fontSize) => {
    this.setState({ fontSize });
  }

  handleSaveClick = () => {
    const { onChange } = this.props;
    const { box, fontSize } = this.state;
    onChange({
      'box': box,
      'font_size': fontSize
    });
  }

  render() {
    const { pageZoom, values, viewportWidth, viewportHeight } = this.props;
    const { box: { width, height }, fontSize } = this.state;

    return (
      <MappingToolbarLayout box={values.box} pageZoom={pageZoom}
        viewportWidth={viewportWidth} viewportHeight={viewportHeight}>
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
