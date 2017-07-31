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
import { MdCheck, MdDelete } from 'react-icons/lib/md';
import SpinEdit from '../SpinEdit';
import styles from './SimpleMappingToolbar.scss';

export default class SimpleMappingToolbar extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
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
    this.setState({
      values: _.assign({}, this.state.values, { width: value })
    });
  }

  handleHeightChange = (value) => {
    this.setState({
      values: _.assign({}, this.state.values, { height: value })
    });
  }

  handleSaveClick = () => {
    const { onChange } = this.props;
    onChange(this.state.values);
  }

  render() {
    const { values: { width, height } } = this.state;
    return (
      <MappingToolbarLayout>
        <ToolbarRow>
          <ToolbarCol>
            <SpinEdit label="W:" value={width} onChange={this.handleWidthChange} />
          </ToolbarCol>
          <ToolbarCol>
            <SpinEdit label="H:" value={height} onChange={this.handleHeightChange} />
          </ToolbarCol>
          <ToolbarCol>
            <SpinEdit label="Font:" />
          </ToolbarCol>
          <ToolbarCol>
            <AppButton size="sm" extraClass={styles.saveButton} onClick={this.handleSaveClick}>
              <MdCheck size={16} />
            </AppButton>
            <Button className={styles.removeButton}><MdDelete size={18} /></Button>
          </ToolbarCol>
        </ToolbarRow>
      </MappingToolbarLayout>
    );
  }
}
