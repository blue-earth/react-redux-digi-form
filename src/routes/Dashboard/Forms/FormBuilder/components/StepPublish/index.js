import React, {
  Component,
  PropTypes
} from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { default as DashButton } from 'components/Buttons/DashboardButtons/Button';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaCheck } from 'react-icons/lib/fa';
import styles from './StepPublish.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

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
    this.props.setFormStatus('published');
  }
  handleClickPrivate = () => {
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
          <Button
            className={cx('statusButton', {'isActive': this.props.status === 'published'})}
            onClick={this.handleClickPublic}>
            Public
          </Button>
          <Button
            className={cx('statusButton', {'isActive': this.props.status === 'unpublished'})}
            onClick={this.handleClickPrivate}>
            Private
          </Button>
        </ButtonGroup>
        <hr className={styles.divider} />
        <p><b>Use direct link to your live form:</b></p>
        <div className={styles.urlField}>
          <div className={styles.inputWrapper}>
            <input type="text" ref="url" readOnly value={url} />
            <CopyToClipboard text={url} onCopy={this.handleCopy}>
              <span className={styles.copyButton}>Copy URL</span>
            </CopyToClipboard>
          </div>
        </div>
        {this.state.urlCopied
          ? <p className={styles.urlCopied}><FaCheck /> URL copied to clipboard.</p> : null}
        <hr className={styles.divider} />
        <p>
          <DashButton>Save &amp; Continue</DashButton>
        </p>
      </div>
    );
  }
}

export default StepPublish;
