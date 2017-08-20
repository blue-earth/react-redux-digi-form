import React, {
  Component,
  PropTypes
} from 'react';
import {
  Tabs,
  Tab
} from 'react-bootstrap';
import styles from './PillTab.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class PillTab extends Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.node
      })
    )
  }
  render() {
    const { tabs } = this.props;
    return (
      <Tabs className={cx('pillTab')} defaultActiveKey={0} id="test">
        {tabs.map((tab, index) => (
          <Tab key={index} eventKey={index} title={tab.title}>{tab.content}</Tab>
        ))}
      </Tabs>
    );
  }
}
export default PillTab;
