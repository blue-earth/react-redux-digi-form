import React, { Component, PropTypes } from 'react'
import { FaLock } from 'react-icons/lib/fa'
import { Link } from 'react-router'
import styles from './LearnMoreSection.scss'

class LearnMoreSection extends Component {
  static propTypes = {
    primaryColor: PropTypes.string,
    link: PropTypes.string
  }

  static defaultProps = {
    primaryColor: '#4dcceb',
    link: '#'
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { link, primaryColor } = this.props
    var linkStyle = {
      color: primaryColor
    }

    return (
      <section className={styles.learnMoreSection}>
        <div>The World's most secure application platform</div>
        <div><FaLock size={24}/></div>
        <div><Link to={link} style={linkStyle}>Learn More</Link></div>
      </section>
    )
  }
}

export default LearnMoreSection
