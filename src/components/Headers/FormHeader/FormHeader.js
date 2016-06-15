import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import classes from './FormHeader.scss';
import { FORM_USER_SUBMISSION } from 'redux/modules/formInteractive';

class FormHeader extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    /*
     * submitAnswer: Redux action to send submit request to server. Here it will be submitted by user's action.
     */
    submitAnswer: PropTypes.func.isRequired
  }

  render() {
    const { submitAnswer } = this.props;
    var optionals = {};
    if (this.context.primaryColor) {
      optionals['style'] = {
        color: this.context.primaryColor
      };
    }

    return (
      <div className={classes.header}>
        <h1 className="hide">Emondo</h1>
        <a href="javascript:;" onClick={function () {submitAnswer(FORM_USER_SUBMISSION)}}
          className={classes.saveLink} {...optionals}>
          Save & continue later
        </a>
      </div>
    );
  }
}

export default FormHeader;
