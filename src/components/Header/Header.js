import React from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Header.scss'

export const Header = () => (
  <div className={classes.header}>
    <h1 className="hide">Emondo</h1>
  </div>
)

export default Header
