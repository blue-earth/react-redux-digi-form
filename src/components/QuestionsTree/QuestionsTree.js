import React, { PropTypes } from 'react';
import _ from 'lodash';
import Tree from './Tree';
import Node from './Node';
import styles from './QuestionsTree.scss';

module.exports = React.createClass({
  displayName: 'QuestionsTree',

  propTypes: {
    onChange: PropTypes.func,
    paddingLeft: PropTypes.number,
    renderNode: PropTypes.func.isRequired,
    tree: PropTypes.oneOf([
      PropTypes.array,
      PropTypes.object
    ]).isRequired
  },

  getDefaultProps() {
    return {
      paddingLeft: 20
    };
  },

  getInitialState() {
    return this.init(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (!this._updated) this.setState(this.init(nextProps));
    else this._updated = false;
  },

  init(props) {
    var tree = new Tree(
      _.isArray(props.tree)
      ? { title: 'root', children: props.tree }
      : props.tree
    );
    tree.isNodeCollapsed = props.isNodeCollapsed;
    tree.renderNode = props.renderNode;
    tree.changeNodeCollapsed = props.changeNodeCollapsed;
    tree.updateNodesPosition();

    return {
      tree: tree,
      dragging: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    };
  },

  getDraggingDom() {
    var tree = this.state.tree;
    var dragging = this.state.dragging;

    if (dragging && dragging.id) {
      var draggingIndex = tree.getIndex(dragging.id);
      var draggingStyles = {
        top: dragging.y,
        left: dragging.x,
        width: dragging.w
      };

      return (
        <div className={styles.draggable} style={draggingStyles}>
          <Node
            tree={tree}
            index={draggingIndex}
            paddingLeft={this.props.paddingLeft}
          />
        </div>
      );
    }

    return null;
  },

  render() {
    var tree = this.state.tree;
    var dragging = this.state.dragging;
    var draggingDom = this.getDraggingDom();

    return (
      <div className={styles.tree}>
        {draggingDom}
        <Node
          root
          tree={tree}
          index={tree.getIndex(1)}
          key={1}
          paddingLeft={this.props.paddingLeft}
          onDragStart={this.dragStart}
          onCollapse={this.toggleCollapse}
          dragging={dragging && dragging.id}
        />
      </div>
    );
  },

  dragStart(id, dom, e) {
    this.dragging = {
      id: id,
      w: dom.offsetWidth,
      h: dom.offsetHeight,
      x: dom.offsetLeft,
      y: dom.offsetTop,
      dom
    };

    this._startX = dom.offsetLeft;
    this._startY = dom.offsetTop;
    this._offsetX = e.clientX;
    this._offsetY = e.clientY;
    this._start = true;

    window.addEventListener('mousemove', this.drag);
    window.addEventListener('mouseup', this.dragEnd);
  },

  isGroupMoving(curIndex, targetIndex) {
    return curIndex.children && targetIndex.parent === 1;
  },
  // oh
  drag(e) {
    if (this._start) {
      this.setState({
        dragging: this.dragging
      });
      this._start = false;
    }

    var tree = this.state.tree;
    var dragging = this.state.dragging;
    var newIndex = null;
    var index = tree.getIndex(dragging.id);
    var collapsed = index.node.collapsed;

    var _startX = this._startX;
    var _startY = this._startY;
    var _offsetX = this._offsetX;
    var _offsetY = this._offsetY;

    var pos = {
      x: _startX + e.clientX - _offsetX,
      y: _startY + e.clientY - _offsetY
    };
    dragging.x = pos.x;
    dragging.y = pos.y;

    var diffY = dragging.y - dragging.h / 2 - (index.top - 3) * dragging.h;
    if (newIndex) {
      index = newIndex;
      newIndex.node.collapsed = collapsed;
      dragging.id = newIndex.id;
    }

    if (diffY < 0) { // up
      let above = tree.getNodeByTop(index.top-1);
      if (above) {
        if (index.left === above.left) {
          newIndex = tree.move(index.id, above.id, 'before');
        } else if (index.node.leaf && !above.node.leaf) {
          const newParent = tree.getIndex(above.prev);
          newIndex = newParent && tree.move(index.id, newParent.id, 'append');
        } else if (!index.node.leaf && above.node.leaf) {
          const newParent = tree.getIndex(above.parent);
          if (Math.abs(diffY) > newParent.height * dragging.h / 2) {
            newIndex = newParent && tree.move(index.id, newParent.id, 'before');
          }
        }
      }
    } else if (diffY > dragging.h) { // down
      let below = tree.getNodeByTop(index.top + index.height);
      if (below) {
        if (index.left === below.left) {
          if (index.leaf) {
            newIndex = tree.move(index.id, below.id, 'after');
          } else if (Math.abs(diffY) > below.height * dragging.h / 2) {
            newIndex = tree.move(index.id, below.id, 'after');
          }
        } else if (index.node.leaf && !below.node.leaf) {
          newIndex = tree.move(index.id, below.id, 'prepend');
        }
      }
    }

    if (newIndex) {
      newIndex.node.collapsed = collapsed;
      dragging.id = newIndex.id;
    }

    this.setState({
      tree: tree,
      dragging: dragging
    });
  },

  dragEnd() {
    this.setState({
      dragging: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    });

    this.change(this.state.tree);
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.dragEnd);
  },

  change(tree) {
    this._updated = true;
    if (this.props.onChange) this.props.onChange(tree.obj);
  },

  toggleCollapse(nodeId) {
    var tree = this.state.tree;
    var index = tree.getIndex(nodeId);
    var node = index.node;
    node.collapsed = !node.collapsed;
    tree.updateNodesPosition();

    this.setState({
      tree: tree
    });

    this.change(tree);
  }
});
