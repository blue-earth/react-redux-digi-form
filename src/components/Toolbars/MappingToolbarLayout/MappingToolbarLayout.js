import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './MappingToolbarLayout.scss';
import { formBuilderBox } from 'constants/formBuilder';

const arrowSize = 10;

export default class MappingToolbarLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    box: PropTypes.array,
    pageZoom: PropTypes.number,
    viewportHeight: PropTypes.number.isRequired,
    viewportWidth: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    const { toolbar } = this.refs;
    this.setState({
      width: toolbar.offsetWidth,
      height: toolbar.offsetHeight
    });
  }

  get toolbarPosition() {
    const { box, pageZoom, viewportWidth } = this.props;
    const { width, height } = this.state;
    const { LEFT, TOP, WIDTH, HEIGHT } = formBuilderBox;
    const boxX = box[LEFT] * pageZoom;
    const boxY = box[TOP] * pageZoom;
    const boxW = box[WIDTH] * pageZoom;
    const boxH = box[HEIGHT] * pageZoom;
    const left = boxX + (boxW - width) / 2;
    const leftMin = 1;
    const leftMax = viewportWidth - width - 2;
    let offset = 0;
    if (left < leftMin) {
      offset = left - leftMin;
    }
    if (left > leftMax) {
      offset = left - leftMax;
    }
    return {
      left: Math.min(Math.max(left, leftMin), leftMax),
      top: boxY > height ? boxY - height - arrowSize : boxY + boxH + arrowSize,
      offset,
      placement: boxY > height ? 'top' : 'bottom'
    };
  }

  handleEvent = (event) => {
    event.stopPropagation();
  }

  render() {
    const { children } = this.props;
    const toolbarPosition = this.toolbarPosition;
    const toolbarStyle = _.pick(toolbarPosition, ['top', 'left']);
    const wrapperClass = classNames(styles.toolbar, styles[toolbarPosition.placement]);
    return (
      <div ref="toolbar" className={wrapperClass} style={toolbarStyle}
        onMouseDown={this.handleEvent}>
        {children}
        <div className={styles.arrow} style={{ marginLeft: toolbarPosition.offset }} />
      </div>
    );
  }
}
