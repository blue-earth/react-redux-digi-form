import React, {
  Component,
  PropTypes
} from 'react';
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
    onDragMove: PropTypes.func,
    onDragEnd: PropTypes.func,
    onResizeStart: PropTypes.func,
    onResizeMove: PropTypes.func,
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
    dragSnapTargets: PropTypes.array, // array of target positions {id, type, x or y}, id: question id.
    snapRange: PropTypes.number,
    className: PropTypes.string,
    toolbar: PropTypes.node
  };

  static defaultProps = {
    onResizeStart: () => {},
    onDragMove: () => {},
    onResizeEnd: () => {},
    onDragStart: () => {},
    onResizeMove: () => {},
    onDragEnd: () => {},
    onClick: () => {},
    onDoubleClick: () => {},
    x: 0,
    y: 0,
    minWidth: 0,
    minHeight: 0,
    active: false,
    snapRange: 5
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
    if (this.props.active) {
      this.initInteract();
    }
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

    var interactable = interact(element)
      .draggable(true)
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true }
      })
      .on('dragstart', this.handleDragStart)
      .on('dragmove', this.handleDragMove)
      .on('dragend', this.handleDragEnd)
      .on('resizestart', this.handleResizeStart)
      .on('resizemove', this.handleResizeMove)
      .on('resizeend', this.handleResizeEnd);

    interactable.styleCursor(false);
  }

  setToolbarPosition() {
    console.log(this.refs.interactWrapper.offsetHeight);
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
    const { width, height } = this.state;
    return _.map(snapTargets, (item) => {
      var newItem = item;
      if (item.x) {
        newItem.x = item.x + offsetX;
        item.type === 'right' && (newItem.x -= width);
        item.type === 'hcenter' && (newItem.x -= width / 2);
      }
      if (item.y) {
        newItem.y = item.y + offsetY;
        item.type === 'bottom' && (newItem.y -= height);
        item.type === 'vcenter' && (newItem.y -= height / 2);
      }
      return newItem;
    });
  }

  handleMouseDown = (event) => {
    const { active } = this.props;
    event.stopPropagation();
    if (!active) return;

    const { x, y, width, height } = this.state;
    const element = this.refs.interactWrapper;
    var mousePos = this.getMousePos(event);

    // offsetX is equal to horizontal offset of mouse x pos from the left of elment + left of parent element.
    // offsetY is equal to vertical offset of mouse y pos from the top of elment + top of parent element.
    var offsetX = mousePos.x - x;
    var offsetY = mousePos.y - y;

    const elementPos = this.getElementPos(element);

    var dXL = elementPos.x + x - mousePos.x;
    var dXR = x + elementPos.x + width - mousePos.x;
    var dYT = elementPos.y + y - mousePos.y;
    var dYB = y + elementPos.y + height - mousePos.y;

    // dX is equal to the offset from the nearest left or right of the element.
    // dY is equal to the offset from the nearest top or bottom of the element.
    var dX = _.minBy([dXL, dXR], Math.abs);
    var dY = _.minBy([dYT, dYB], Math.abs);

    element.setAttribute('data-x', x);
    element.setAttribute('data-y', y);

    const { snapRange, dragSnapTargets, resizeSnapTargets } = this.props;
    interact(element)
      .draggable({
        snap: {
          targets: this.offsetSnapTargets(offsetX, offsetY, dragSnapTargets),
          range: snapRange
        }
        // restrict: {
        //   restriction: 'parent',
        //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        // }
      })
      .resizable({
        snap: {
          targets: this.offsetSnapTargets(elementPos.x - dX, elementPos.y - dY, resizeSnapTargets),
          range: snapRange
        },
        edges: { left: true, right: true, bottom: true, top: true }
        // restrict: {
        //   restriction: 'parent',
        //   elementRect: { top: 1, left: 1, bottom: 1, right: 1 }
        // }
      });
  }

  handleDragStart = (event) => {
    const { onDragStart, metaData } = this.props;
    onDragStart(metaData);
  }

  handleDragMove = (event) => {
    const { onDragMove, metaData } = this.props;
    const { width, height } = this.state;
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0);
    var y = (parseFloat(target.getAttribute('data-y')) || 0);
    x += event.dx;
    y += event.dy;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    target.style.webkitTransform =
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    var isSnapping = event.snap && event.snap.locked;

    onDragMove({ left: x, top: y, width, height }, metaData, isSnapping);
  }

  handleDragEnd = (event) => {
    const { onDragEnd } = this.props;
    const { width, height } = this.state;
    const element = this.refs.interactWrapper;
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0);
    var y = (parseFloat(target.getAttribute('data-y')) || 0);
    this.setState({
      x,
      y
    });
    var metaData = JSON.parse(element.dataset.meta);
    onDragEnd({ left: x, top: y, width, height }, metaData);
  }

  handleResizeStart = (event) => {
    const { onResizeStart, metaData } = this.props;
    onResizeStart(metaData);
  }

  handleResizeMove = (event) => {
    const { onResizeMove, metaData } = this.props;
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0);
    var y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    var w = event.rect.width;
    var h = event.rect.height;
    target.style.width = w + 'px';
    target.style.height = h + 'px';
    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.setAttribute('data-w', w);
    target.setAttribute('data-h', h);

    var isSnapping = event.snap && event.snap.locked;
    onResizeMove({ left: x, top: y, width: w, height: h }, metaData, isSnapping);
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
    onResizeEnd({ left: x, top: y, width: w, height: h }, metaData);
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
    const { zIndex, active, metaData, className, toolbar } = this.props;
    const { x, y, width, height } = this.state;
    var style = {};
    var optionals = {};
    width && (style['width'] = width);
    height && (style['height'] = height);
    zIndex && (style['zIndex'] = zIndex);
    style['WebkitTransform'] = style['transform'] = 'translate(' + x + 'px,' + y + 'px)';
    style && (optionals['style'] = style);
    optionals['data-meta'] = JSON.stringify(metaData);

    const wrapperClass = classNames({
      [className]: true,
      [styles.interactWrapper]: true,
      [styles.active]: active
    });

    return (
      <div className={wrapperClass}
        onMouseDown={this.handleMouseDown}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        ref="interactWrapper"
        {...optionals}>
        {toolbar &&
          <div className={styles.toolbar} style={{ bottom: height + 10 }}>
            {toolbar}
          </div>
        }
        <div className={styles.innerContent}>
          {this.props.children}
        </div>
        <div className={styles.handleLeft} ref="handleLeft"></div>
        <div className={styles.handleTop} ref="handleTop"></div>
        <div className={styles.handleRight} ref="handleRight"></div>
        <div className={styles.handleBottom} ref="handleBottom"></div>
        <div className={styles.handleBottomLeft} ref="handleBottomLeft"></div>
        <div className={styles.handleTopLeft} ref="handleTopLeft"></div>
        <div className={styles.handleTopRight} ref="handleTopRight"></div>
        <div className={styles.handleBottomRight} ref="handleBottomRight"></div>
      </div>
    );
  }
}

export default InteractWrapper;
