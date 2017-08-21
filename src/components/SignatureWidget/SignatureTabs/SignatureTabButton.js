import React, {
  Component,
  PropTypes
} from 'react';
import {
  ButtonGroup,
  Button
} from 'react-bootstrap';
import classNames from 'classnames';
import Icon from 'components/Icon';
import styles from './SignatureTabButton.scss';

class SignatureTabButton extends Component {

  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired
  }

  handleTypeClick = () => {
    this.props.onTabChange('write');
  }
  handleDrawClick = () => {
    this.props.onTabChange('draw');
  }

  render() {
    const {activeTab} = this.props;
    return (
      <ButtonGroup className={styles.signatureTabGroup}>
        <Button
          onClick={this.handleTypeClick}
          className={classNames(
            styles.signatureTabButton,
            {[styles.activeTab]: activeTab === 'write'}
          )}
        >
          <Icon name="ShortText" height={18} width={14} style={{verticalAlign: 'middle'}} />
        </Button>
        <Button
          onClick={this.handleDrawClick}
          className={classNames(
            styles.signatureTabButton,
            {[styles.activeTab]: activeTab === 'draw'}
          )}
        >
          <Icon name="Pen" height={18} width={14} style={{verticalAlign: 'middle'}} />
        </Button>
      </ButtonGroup>
    );
  }
}

export default SignatureTabButton;
