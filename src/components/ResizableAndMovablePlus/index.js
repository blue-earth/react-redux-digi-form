import React, { Component, PropTypes } from 'react';
import ResizableAndMovable from 'react-resizable-and-movable';

class ResizableAndMovablePlus extends Component {

  static propTypes = {
    onResizeStop: PropTypes.func,
    onDragStop: PropTypes.func,
    metaData: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.string
    ])
  };

  static defaultProps = {
    onResizeStop: () => {},
    onDragStop: () => {}
  };

  handleResizeStop = (direction, styleSize, clientSize, delta) => {
    const { onResizeStop, metaData } = this.props;
    onResizeStop(direction, styleSize, clientSize, delta, metaData);
  }

  handleDragStop = (event, ui) => {
    const { onDragStop, metaData } = this.props;
    onDragStop(event, ui, metaData)
  }

  render() {
    return (
      <ResizableAndMovable
        {...this.props}
        onResizeStop={this.handleResizeStop}
        onDragStop={this.handleDragStop}
      >
        {this.props.children}
      </ResizableAndMovable>
    );
  }
}

export default ResizableAndMovablePlus;
