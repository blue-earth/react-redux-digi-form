import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import styles from './QuestionsTree.scss';
import { MdChevronRight, MdExpandMore, MdSwapVert } from 'react-icons/lib/md';

export default class Node extends Component {

  static propTypes = {
    dragging: PropTypes.number,
    index: PropTypes.object,
    itemNo: PropTypes.number,
    onCollapse: PropTypes.func,
    onDragStart: PropTypes.func,
    paddingLeft: PropTypes.number,
    root: PropTypes.bool,
    tree: PropTypes.object.isRequired
  };

  handleCollapse = (e) => {
    e.stopPropagation();
    var nodeId = this.props.index.id;
    if (this.props.onCollapse) this.props.onCollapse(nodeId);
  }

  handleMouseDown = (e) => {
    if (e.button !== 0) return;
    var nodeId = this.props.index.id;
    var dom = this.refs.inner;

    if (this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  }

  renderCollapse() {
    const { index } = this.props;

    if (index.left === 2) {
      var collapsed = index.node.collapsed;

      return (
        <div
          className={styles.collapse}
          onMouseDown={function (e) { e.stopPropagation(); }}
          onClick={this.handleCollapse}>
          <div className={styles.icon}>
            {collapsed
              ? <MdChevronRight size={20} />
              : <MdExpandMore size={20} />
            }
          </div>
        </div>
      );
    }

    return false;
  }

  renderHandle() {
    return (
      <div className={styles.handle} onMouseDown={this.handleMouseDown}>
        <div className={styles.icon}>
          <MdSwapVert size={20} />
        </div>
      </div>
    );
  }

  renderChildren() {
    const { index, root, tree, dragging } = this.props;

    if (index.children && index.children.length) {
      var childrenStyles = {};
      if (index.node.collapsed) childrenStyles.display = 'none';
      if (!root) childrenStyles['paddingLeft'] = this.props.paddingLeft + 'px';

      return (
        <div className={styles.children} style={childrenStyles}>
          {index.children.map((child, idx) => {
            var childIndex = tree.getIndex(child);
            return (
              <Node
                tree={tree}
                index={childIndex}
                key={childIndex.id}
                dragging={dragging}
                itemNo={idx + 1}
                paddingLeft={this.props.paddingLeft}
                onCollapse={this.props.onCollapse}
                onDragStart={this.props.onDragStart}
              />
            );
          })}
        </div>
      );
    }

    return false;
  }

  render() {
    const { dragging, index, itemNo, root, tree } = this.props;
    const { node } = index;
    const prefix = node.leaf ? 'Q' : 'S';
    return (
      <div className={cx(styles.node, {
        [styles.placeholder]: index.id === dragging,
        [styles.root]: root
      })}>
        {!root && <div className={styles.nodeInner} ref="inner">
          <div className={cx(styles.box, { [styles.group]: !node.leaf })}>
            {this.renderCollapse()}
            <div className={styles.boxInner}>
              {itemNo && <span className={styles.itemNo}>{prefix}{itemNo}</span>}
              <div className={styles.boxContent}>{tree.renderNode(node)}</div>
            </div>
            {this.renderHandle()}
          </div>
        </div>}
        {this.renderChildren()}
      </div>
    );
  }

}
