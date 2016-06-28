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
    onResizeStart: () => {},
    onResizeStop: () => {},
    onDragStart: () => {},
    onDragStop: () => {},
    onClick: () => {},
    onDoubleClick: () => {}
  };

  handleResizeStart = (direction, styleSize, clientSize, event) => {
    const { onResizeStart, metaData } = this.props;
    onResizeStart(direction, styleSize, clientSize, event, metaData);
  }
  
  handleResizeStop = (direction, styleSize, clientSize, delta) => {
    const { onResizeStop, metaData } = this.props;
    onResizeStop(direction, styleSize, clientSize, delta, metaData);
  }

  handleDragStart = (event, ui) => {
    const { onDragStart, metaData } = this.props;
    onDragStart(event, ui, metaData)
  }

  handleDragStop = (event, ui) => {
    const { onDragStop, metaData } = this.props;
    onDragStop(event, ui, metaData)
  }

  handleClick = () => {
    const { onClick, metaData } = this.props;
    onClick(metaData);
  }

  handleDoubleClick = () => {
    const { onDoubleClick, metaData } = this.props;
    onDoubleClick(metaData);
  }

  render() {
    return (
      <ResizableAndMovable
        {...this.props}
        onResizeStart={this.handleResizeStart}
        onResizeStop={this.handleResizeStop}
        onDragStart={this.handleDragStart}
        onDragStop={this.handleDragStop}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        canUpdateSizeByParent
      >
        {this.props.children}
      </ResizableAndMovable>
    );
  }
}

export default ResizableAndMovablePlus;
