import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './QuestionsTree.scss';

var Node = React.createClass({
  displayName: 'UITreeNode',

  propTypes: {
    dragging: PropTypes.bool,
    index: PropTypes.object,
    onCollapse: PropTypes.func,
    onDragStart: PropTypes.func,
    paddingLeft: PropTypes.number,
    root: PropTypes.bool,
    tree: PropTypes.object.isRequired
  },

  renderCollapse() {
    var index = this.props.index;

    if (index.children && index.children.length) {
      var collapsed = index.node.collapsed;

      return (
        <span
          className={cx(styles.collapse, collapsed ? styles.caretRight : styles.caretDown)}
          onMouseDown={function (e) { e.stopPropagation(); }}
          onClick={this.handleCollapse}>
        </span>
      );
    }

    return null;
  },

  renderChildren() {
    var index = this.props.index;
    var tree = this.props.tree;
    var dragging = this.props.dragging;

    if (index.children && index.children.length) {
      var childrenStyles = {};
      if (index.node.collapsed) childrenStyles.display = 'none';
      childrenStyles['paddingLeft'] = this.props.paddingLeft + 'px';

      return (
        <div className={styles.children} style={childrenStyles}>
          {index.children.map((child) => {
            var childIndex = tree.getIndex(child);
            return (
              <Node
                tree={tree}
                index={childIndex}
                key={childIndex.id}
                dragging={dragging}
                paddingLeft={this.props.paddingLeft}
                onCollapse={this.props.onCollapse}
                onDragStart={this.props.onDragStart}
              />
            );
          })}
        </div>
      );
    }

    return null;
  },

  render() {
    const { dragging, index, tree, root } = this.props;
    const { node } = index;

    return (
      <div className={cx(styles.node, {
        [styles.placeholder]: index.id === dragging,
        [styles.root]: root
      })}>
        {!root && <div className={styles.inner} ref="inner" onMouseDown={this.handleMouseDown}>
          {this.renderCollapse()}
          {tree.renderNode(node)}
        </div>}
        {this.renderChildren()}
      </div>
    );
  },

  handleCollapse(e) {
    e.stopPropagation();
    var nodeId = this.props.index.id;
    if (this.props.onCollapse) this.props.onCollapse(nodeId);
  },

  handleMouseDown(e) {
    if (e.button !== 0) return;
    var nodeId = this.props.index.id;
    var dom = this.refs.inner;

    if (this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  }
});

module.exports = Node;
