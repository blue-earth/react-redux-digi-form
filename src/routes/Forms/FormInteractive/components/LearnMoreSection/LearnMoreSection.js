import React, { Component, PropTypes } from 'react'
import { FaLock } from 'react-icons/lib/fa'
import { Link } from 'react-router'
import styles from './LearnMoreSection.scss'

class LearnMoreSection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className={styles.learnMoreSection}>
        <div>The World's most secure application platform</div>
        <div><FaLock size={24}/></div>
        <div><Link to="#">Learn More</Link></div>
      </section>
    )
  }
}

export default LearnMoreSection
