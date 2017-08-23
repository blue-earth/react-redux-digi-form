import React, {
  Component,
  PropTypes
} from 'react';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'components/Buttons/DashboardButtons/Button';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaCheck } from 'react-icons/lib/fa';
import styles from './StepPublish.scss';

class StepPublish extends Component {

  static propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    slug: PropTypes.string,
    status: PropTypes.string,
    subdomain: PropTypes.string,
    setFormStatus: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      urlCopied: false
    };
  }

  handleClickPublic = () => {
    console.log('set to published');
    this.props.setFormStatus('published');
  }
  handleClickPrivate = () => {
    console.log('set to unpublished');
    this.props.setFormStatus('unpublished');
  }

  handleCopy = () => {
    this.setState({urlCopied: true});
  }

  render() {
    const url = 'https://' + this.props.subdomain + '/' + this.props.slug;
    return (
      <div className={styles.stepPublishWrapper}>
        <p><b>Status:</b></p>
        <ButtonGroup>
          <Button style="submitButton"
            onClick={this.handleClickPublic}>
            Public
          </Button>
          <Button
            onClick={this.handleClickPrivate}>
            Private
          </Button>
        </ButtonGroup>
        <hr />
        <p><b>Use direct link to your live form:</b></p>
        <div className={styles.urlField}>
          <input type="text" ref="url" readOnly value={url} />
          <CopyToClipboard text={url} onCopy={this.handleCopy}>
            <span className={styles.copyButton}>Copy URL</span>
          </CopyToClipboard>
        </div>
        {this.state.urlCopied
          ? <p><FaCheck /> URL copied to clipboard.</p> : null}
        <p>
          <Button style="formButton">Save &amp; Continue</Button>
        </p>
      </div>
    );
  }
}

export default StepPublish;
