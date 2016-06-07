import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import classes from './FormHeader.scss';

class FormHeader extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  render() {
    var optionals = {};
    if (this.context.primaryColor) {
      optionals['style'] = {
        color: this.context.primaryColor
      };
    }

    return (
      <div className={classes.header}>
        <h1 className="hide">Emondo</h1>
        <Link to='#' className={classes.saveLink} {...optionals}>
          Save & continue later
        </Link>
      </div>
    );
  }
}

export default FormHeader;
