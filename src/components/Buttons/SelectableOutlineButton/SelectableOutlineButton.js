import React, {
  PropTypes, Component
} from 'react';
import { noop } from 'helpers/miscellaneous';

class SelectableOutlineButton extends Component {
  static propTypes = {
    backgroundColour: PropTypes.string,
    selectedBackgroundColour: PropTypes.string,
    isInitiallySelected: PropTypes.bool,
    isSelectable: PropTypes.bool,
    style: PropTypes.object,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func
  };
  static defaultProps = {
    isInitiallySelected: false,
    backgroundColour: 'transparent',
    isSelectable: true,
    selectedBackgroundColour: '#3893d0',
    onClick: noop
  };
  constructor(props) {
    super(props);
    this.state = {
      isSelected: props.isInitiallySelected
    };
  }
  getButtonStyle() {
    const {
      backgroundColour,
      selectedBackgroundColour
    } = this.props;
    var style = {
      'backgroundColor': backgroundColour,
      'color': '#FFFFFF',
      'border': '1px solid #FFFFFF',
      'padding': '8px 16px',
      'outline': '0',
      'borderRadius': '4px'
    };
    if (this.state.isSelected) {
      style['backgroundColor'] = selectedBackgroundColour;
      style['border'] = `1px solid ${selectedBackgroundColour}`;
    }
    return style;
  }
  toggleSelectedState = () => {
    this.setState({
      isSelected: !this.state.isSelected
    });
  };
  onClickHandler = () => {
    const { isSelectable, onClick } = this.props;
    if (isSelectable) {
      this.toggleSelectedState();
    }
    onClick();
  };
  render() {
    const { style } = this.props;
    const buttonStyle = Object.assign({}, style, this.getButtonStyle());
    return (
      <button type="button" style={buttonStyle} onClick={this.onClickHandler}>
        {this.props.children}
      </button>
    );
  }
}

export default SelectableOutlineButton;
