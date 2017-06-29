import React, {
  Component,
  PropTypes
} from 'react';
import {
  Nav,
  Tabs,
  Tab
} from 'react-bootstrap';
import styles from './ConfigureTab.scss';
import classNames from 'classnames/bind';

class ConfigureTab extends Component {
  static porpTypes = {
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.node
      })
    )
  }
  render() {
    let cx = classNames.bind(styles);
    return (
      <Tabs className={cx('configureTab')} defaultActiveKey={0} id="test">
        {this.props.tabs.map((tab, index) => (
          <Tab key={index} eventKey={index} title={tab.title}>{tab.content}</Tab>
        ))}
      </Tabs>
    );
  }
}
export default ConfigureTab;
