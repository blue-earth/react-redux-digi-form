import React, {
  Component,
  PropTypes
} from 'react';
import {
  Popover,
  OverlayTrigger
} from 'react-bootstrap';
import popoverTexts from 'schemas/popoverTexts';
import styles from './SectionTitle.scss';

class SectionTitle extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    popoverId: PropTypes.string,
    description: PropTypes.string,
    /*
    / labelStyle
    / major - roble_alt_boldbold, 16px
    / minor - Open Sans, 13px
    */
    labelStyle: PropTypes.oneOf(['major', 'minor']),
    style: PropTypes.object
  };

  static defaultProps = {
    popoverId: '',
    description: '',
    labelStyle: 'minor',
    style: {}
  }

  getPopover(popoverId) {
    return (
      <Popover id={`${popoverId}Popover`}>
        {popoverTexts[popoverId]}
      </Popover>
    );
  }

  render() {
    const { title, labelStyle, popoverId, description, style } = this.props;
    return (
      <div style={style}>
        <h3 className={styles.sectionTitle + ' ' + styles[labelStyle]}>
          {title}
          {popoverId &&
            <OverlayTrigger trigger="focus" overlay={this.getPopover(popoverId)}>
              <span tabIndex={0} className={styles.popoverIcon}>i</span>
            </OverlayTrigger>
          }
        </h3>
        {description &&
          <p className={styles.titleDescription}>{description}</p>
        }
      </div>
    );
  }
}

export default SectionTitle;
