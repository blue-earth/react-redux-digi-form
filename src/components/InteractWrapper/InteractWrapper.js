import React, { Component, PropTypes } from 'react';
import styles from './InteractWrapper.scss';
import interact from 'interact.js';
import classNames from 'classnames';
import _ from 'lodash';

class InteractWrapper extends Component {

  static propTypes = {
    metaData: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.string
    ]),
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onResizeStart: PropTypes.func,
    onResizeEnd: PropTypes.func,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    children: PropTypes.node,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    active: PropTypes.bool,
    zIndex: PropTypes.number,
    resizeSnapTargets: PropTypes.array,
    dragSnapTargets: PropTypes.array
  };

  static defaultProps = {
    onResizeStart: () => {},
    onResizeEnd: () => {},
    onDragStart: () => {},
    onDragEnd: () => {},
    onClick: () => {},
    onDoubleClick: () => {},
    x: 0,
    y: 0,
    minWidth: 0,
    minHeight: 0,
    active: false
  };

  constructor(props) {
    super(props);
    this.state = {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height
    };
  }

  componentDidMount() {
    this.initInteract();
  }

  componentWillReceiveProps(props) {
    this.setState({
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height
    });
  }

  initInteract() {
    const element = this.refs.interactWrapper;
    element.addEventListener('mousedown', this.handleMouseDown);

    interact(element)
      .draggable(true)
      .resizable(true)
      .on('dragstart', this.handleDragStart)
      .on('dragmove', this.handleDragMove)
      .on('dragend', this.handleDragEnd)
      .on('resizestart', this.handleResizeStart)
      .on('resizemove', this.handleResizeMove)
      .on('resizeend', this.handleResizeEnd);
  }

  getMousePos(event) {
    var e = event || window.event; // Moz || IE
    if (e.pageX || e.pageY) { // Moz
      return { x: e.pageX, y: e.pageY };
    } else if (e.clientX || e.clientY) { // IE
      return { x: e.clientX, y: e.clientY };
    } else {
      return { x: 0, y: 0 };
    }
  }

  getElementPos(el) {
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx, y: ly};
  }

  offsetSnapTargets(offsetX, offsetY, snapTargets) {
    return _.map(snapTargets, (item) => {
      var newItem = {};
      item.x && (newItem.x = item.x + offsetX);
      item.y && (newItem.y = item.y + offsetY);
      return newItem;
    });
  }

  handleMouseDown = (event) => {
    const { x, y } = this.state;
    const element = this.refs.interactWrapper;
    var mousePos = this.getMousePos(event);
    var offsetX = mousePos.x - x;
    var offsetY = mousePos.y - y;
    element.setAttribute('data-x', x);
    element.setAttribute('data-y', y);
    element.setAttribute('data-offsetX', offsetX);
    element.setAttribute('data-offsetY', offsetY);
    event.stopPropagation();
  }

  handleDragStart = (event) => {
    const element = this.refs.interactWrapper;
    // const { offsetX, offsetY } = this.state;
    var offsetX = (parseFloat(element.getAttribute('data-offsetX')) || 0);
    var offsetY = (parseFloat(element.getAttribute('data-offsetY')) || 0);
    const { onDragStart, metaData, dragSnapTargets } = this.props;

    const snapTargets = this.offsetSnapTargets(offsetX, offsetY, dragSnapTargets);

    interact(element).draggable({
      snap: {
        targets: snapTargets,
        range: 10
      },
      inertia: true,
      restrict: {
        restriction: element.parentNode,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      }
    });
    onDragStart(metaData);
  }

  handleDragMove = (event) => {
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0);
    var y = (parseFloat(target.getAttribute('data-y')) || 0);
    x += event.dx;
    y += event.dy;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    event.target.style.webkitTransform =
    event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  }

  handleDragEnd = (event) => {
    const { onDragEnd, metaData } = this.props;
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0);
    var y = (parseFloat(target.getAttribute('data-y')) || 0);
    this.setState({
      x,
      y
    });
    onDragEnd(x, y, metaData);
  }

  handleResizeStart = (event) => {
    const { onResizeStart, metaData } = this.props;
    const element = this.refs.interactWrapper;
    interact(element).draggable({
      edges: { left: true, right: true, bottom: true, top: true },
      invert: 'reposition'
    });
    onResizeStart(metaData);
  }

  handleResizeMove = (event) => {
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0);
    var y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    var w = event.rect.width + 'px';
    var h = event.rect.height + 'px';
    target.style.width = w;
    target.style.height = h;
    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.setAttribute('data-w', w);
    target.setAttribute('data-h', h);
  }

  handleResizeEnd = (event) => {
    const { onResizeEnd, metaData } = this.props;
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0);
    var y = (parseFloat(target.getAttribute('data-y')) || 0);
    var w = (parseFloat(target.getAttribute('data-w')) || 0);
    var h = (parseFloat(target.getAttribute('data-h')) || 0);
    this.setState({
      x,
      y,
      width: w,
      height: h
    });
    onResizeEnd(x, y, w, h, metaData);
  }

  handleClick = (event) => {
    const { onClick, metaData } = this.props;
    onClick(metaData);
  }

  handleDoubleClick = (event) => {
    const { onDoubleClick, metaData } = this.props;
    onDoubleClick(metaData);
  }

  render() {
    const { zIndex, active } = this.props;
    const { x, y, width, height } = this.state;
    var style = {};
    var optionals = {};
    width && (style['width'] = width);
    height && (style['height'] = height);
    zIndex && (style['zIndex'] = zIndex);
    style['WebkitTransform'] = style['transform'] = 'translate(' + x + 'px,' + y + 'px)';
    style && (optionals['style'] = style);

    const wrapperClass = classNames({
      [styles.interactWrapper]: true,
      [styles.active]: active
    });

    return (
      <div className={wrapperClass}
        onClick={this.handleClick}
        onDblClick={this.handleDoubleClick}
        ref="interactWrapper"
        {...optionals}>
        {this.props.children}
      </div>
    );
  }
}

export default InteractWrapper;
