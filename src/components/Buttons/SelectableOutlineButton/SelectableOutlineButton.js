import React, {
  PropTypes, Component
} from 'react';
import { noop } from 'helpers/miscellaneous';

class SelectableOutlineButton extends Component {
  static propTypes = {
    backgroundColour: PropTypes.string,
    selectedBackgroundColour: PropTypes.string,
    /**
     * Whether this button should display in selected state
     */
    isSelected: PropTypes.bool,
    /**
     * Display a small tick before the button text
     * Button can be **isFinalised** and **isDisabled** at the same time
     */
    isFinalised: PropTypes.bool,
    /**
     * Should this button has a selected state
     * the button will remain in selected state after mouse release
     */
    isSelectable: PropTypes.bool,
    isDisabled: PropTypes.bool,
    style: PropTypes.object,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    name: PropTypes.string
  };
  static defaultProps = {
    backgroundColour: 'transparent',
    isSelectable: true,
    isFinalised: false,
    isSelected: false,
    isDisabled: false,
    selectedBackgroundColour: '#3893d0',
    onClick: noop,
    name: ''
  };
  constructor(props) {
    super(props);
    this.state = {
      isSelected: props.isSelected
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isSelected: nextProps.isSelected,
      isDisabled: nextProps.isDisabled
    });
  }

  getButtonStyle() {
    const {
      backgroundColour,
      selectedBackgroundColour,
      isDisabled
    } = this.props;
    var style = {
      'backgroundColor': backgroundColour,
      'color': '#FFFFFF',
      'border': '1px solid #FFFFFF',
      'padding': '8px 16px',
      'outline': '0',
      'borderRadius': '4px'
    };
    if (isDisabled) {
      style['color'] = '#343c49';
      style['border'] = '1px solid #343c49';
      style['curosr'] = 'not-allowed';
    } else if (this.state.isSelected) {
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
    const { isSelectable, isDisabled, onClick, name } = this.props;
    if (isSelectable && !isDisabled) {
      this.toggleSelectedState();
    }
    onClick(name);
  };
  render() {
    const { style, name } = this.props;
    const buttonStyle = Object.assign({}, style, this.getButtonStyle());
    var Image;
    if (this.props.isFinalised) {
      var checkIcon = require('./images/check.svg');
      const checkIconStyle = {'width': '12px', 'marginRight': '4px'};
      Image = <img style={checkIconStyle} src={checkIcon} alt="Checked" />;
    }
    return (
      <button type="button" style={buttonStyle} name={name} onClick={this.onClickHandler}>
        {Image}
        <span>
          {this.props.children}
        </span>
      </button>
    );
  }
}

export default SelectableOutlineButton;
