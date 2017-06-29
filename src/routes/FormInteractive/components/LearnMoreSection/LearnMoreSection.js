import React, {
  Component,
  PropTypes
} from 'react';
import { FaLock } from 'react-icons/lib/fa';
import { Link } from 'react-router';
import styles from './LearnMoreSection.scss';
import classNames from 'classnames';

class LearnMoreSection extends Component {
  static propTypes = {
    link: PropTypes.string,
    isLastSection: PropTypes.bool
  }

  static contextTypes = {
    primaryColour: PropTypes.string,
    isLastSection: PropTypes.bool
  };

  static defaultProps = {
    link: '#',
    isLastSection: false
  }

  render() {
    const { link, isLastSection } = this.props;
    var linkStyle = {
      color: this.context.primaryColour
    };
    const sectionClass = classNames({
      [styles.learnMoreSection]: true,
      [styles.lastSection]: isLastSection
    });
    return (
      <section className={sectionClass}>
        <div>The World's most secure application platform</div>
        <div><FaLock size={24} color="#000" /></div>
        <div><Link to={link} style={linkStyle}>Learn More</Link></div>
      </section>
    );
  }
}

export default LearnMoreSection;
