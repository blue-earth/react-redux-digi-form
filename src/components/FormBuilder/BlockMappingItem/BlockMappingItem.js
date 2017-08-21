import React, {
  Component,
  PropTypes
} from 'react';
import styles from './BlockMappingItem.scss';
import interact from 'interact.js';
import classNames from 'classnames';
import _ from 'lodash';

class BlockMappingItem extends Component {

  static propTypes = {
    active: PropTypes.bool,
    metaData: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.string
    ]),
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragMove: PropTypes.func,
    onDragStart: PropTypes.func,
    position: PropTypes.object.isRequired
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
    y: 0
  };

  componentDidMount() {
    if (this.props.active) {
      this.initInteract();
    }
  }

  initInteract() {
    const element = this.refs.blockMappingItem;

    var interactable = interact(element)
      .draggable({
        // keep the element within the area of it's parent
        restrict: {
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        }
      })
      .on('dragstart', this.handleDragStart)
      .on('dragmove', this.handleDragMove)
      .on('dragend', this.handleDragEnd);

    interactable.styleCursor(false);
  }

  handleMouseDown = (event) => {
    const { active, position: { left, top } } = this.props;
    event.stopPropagation();
    if (!active) return;

    const element = this.refs.BlockMappingItem;

    element.setAttribute('data-x', left);
    element.setAttribute('data-y', top);
  }

  handleDragStart = (event) => {
    const { onDragStart } = this.props;
    onDragStart();
  }

  handleDragMove = (event) => {
    const { metaData, onDragMove, position } = this.props;
    const { width, height } = position;
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0);
    var y = (parseFloat(target.getAttribute('data-y')) || 0);
    x += event.dx;
    y += event.dy;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    target.style.webkitTransform =
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    onDragMove({ left: x, top: y, width, height }, metaData);
  }

  handleDragEnd = (event) => {
    const { metaData, onDragEnd, position } = this.props;
    const { width, height } = position;
    var target = event.target;
    var left = (parseFloat(target.getAttribute('data-x')) || 0);
    var top = (parseFloat(target.getAttribute('data-y')) || 0);
    onDragEnd({ left, top, width, height }, metaData);
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
    const { position, active, className } = this.props;
    const { left, top } = position;
    var style = _.assign({}, _.pick(position, ['width', 'height']));
    style['WebkitTransform'] = style['transform'] = 'translate(' + left + 'px,' + top + 'px)';

    const wrapperClass = classNames({
      [className]: true,
      [styles.block]: true,
      [styles.active]: active
    });
    return (
      <div ref="blockMappingItem" className={wrapperClass} style={style}
        data-x={left} data-y={top}>
        <div className={styles.blockLabel}>
          {'X'}
        </div>
      </div>
    );
  }
}

export default BlockMappingItem;
