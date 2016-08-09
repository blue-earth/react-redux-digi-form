import React, {
  Component,
  PropTypes
} from 'react';
import {
  Popover,
  OverlayTrigger
} from 'react-bootstrap';
import { MdHelpOutline } from 'react-icons/lib/md';
import popoverTexts from 'schemas/popoverTexts';
import styles from './SectionTitle.scss';

class SectionTitle extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    popoverId: PropTypes.string,
    description: PropTypes.string
  };

  static defaultProps = {
    popoverId: '',
    description: ''
  }

  getPopover(popoverId) {
    return (
      <Popover id={`${popoverId}Popover`}>
        {popoverTexts[popoverId]}
      </Popover>
    );
  }

  render() {
    const { title, popoverId, description } = this.props;
    return (
      <div>
        <h3 className={styles.sectionTitle}>
          {title}
          {popoverId &&
            <OverlayTrigger trigger="focus" overlay={this.getPopover(popoverId)}>
              <span tabIndex={0} className={styles.popoverIcon}>
                <MdHelpOutline size={18} />
              </span>
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
