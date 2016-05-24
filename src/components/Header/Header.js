import React from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Header.scss'

export const Header = () => (
  <div className={classes.header}>
    <h1 className="hide">Emondo</h1>
    <Link to='#' className={classes.saveLink}>
      Save & continue later
    </Link>
  </div>
)

export default Header
