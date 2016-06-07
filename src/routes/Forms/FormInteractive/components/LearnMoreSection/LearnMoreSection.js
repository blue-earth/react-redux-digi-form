import React, { Component, PropTypes } from 'react'
import { FaLock } from 'react-icons/lib/fa'
import { Link } from 'react-router'
import styles from './LearnMoreSection.scss'

class LearnMoreSection extends Component {
  static propTypes = {
    link: PropTypes.string
  }
  
  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static defaultProps = {
    link: '#'
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { link } = this.props
    var linkStyle = {
      color: this.context.primaryColor
    }

    return (
      <section className={styles.learnMoreSection}>
        <div>The World's most secure application platform</div>
        <div><FaLock size={24} color="#000" /></div>
        <div><Link to={link} style={linkStyle}>Learn More</Link></div>
      </section>
    )
  }
}

export default LearnMoreSection
