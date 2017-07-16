import React, {
  Component,
  PropTypes
} from 'react';
import getCsrfToken from 'redux/utils/csrf';
import _ from 'lodash';
import { FaCloudUpload, FaFileTextO, FaClose, FaSpinner } from 'react-icons/lib/fa';
import styles from './FileUpload.scss';
// import classNames from 'classnames';

class FileUpload extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    accept: PropTypes.string,
    maxNumberOfFiles: PropTypes.number,
    maxTotalFileSizeKb: PropTypes.number,
    onChange: PropTypes.func,
    onEnterKey: PropTypes.func
  };

  static defaultProps = {
    accept: '*',
    maxNumberOfFiles: 3,
    maxTotalFileSizeKb: 100000
  };

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isUploading: false
    };
    this.xhr = null;
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey();
      // this.refs.fileInput.blur();
    }
  }

  handleClick = () => {
    this.refs.fileInput.click();
  }

  handleFileSelect = (event) => {
    const item = {this.refs.fileInput.files[0], progress: 0, status: XHR_INIT};
    var newItems = this.state.items;
    var newIndex = newItems.push(item) - 1;
    this.setState({ items: newItems });
    this.upload(newIndex);
  }

  upload(index) {
    const item = this.state.items[index];
    var requestURL = `${API_URL}/form_document/api/form_response/attachment/`;
    var method = 'POST';
    if (item) {
      this.setState({ isUploading: true});
      const file = item.file;
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      formData.append(file);

      xhr.onload = this.handleUploadResponse;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          this.updateFileProgress((event.loaded / event.total) * 100, index);
        }
      };
      xhr.upload.onload = this.handleUploadComplete;

      xhr.open(method, requestURL, true);
      xhr.setRequestHeader('X-CSRFToken', getCsrfToken());
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(formData);
      this.xhr = xhr;
      const newItems = [...this.state.items];
      newItems[index] = Object.assign({}, this.state.items[index], {
        status: XHR_UPLOADING
      });
      this.setState({items: newItems});
    }
  }

  updateFileProgress(progress, index) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], {progress: progress});
    this.setState({items: newItems});
  }

  handleUploadComplete = (event) => {
    var index = this.state.items.length - 1;
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], {
      progress: 100,
      status: XHR_WAITING
    });
    this.setState({items: newItems, isUploading: false});
  }

  handleUploadResponse = (event) => {
    // const { onSuccess, onFail } = this.props;
    var index = this.state.items.length - 1;
    const newItems = [...this.state.items];
    if (_.inRange(event.target.status, 200, 206)) {
      newItems[index] = Object.assign({}, this.state.items[index], {
        status: XHR_SUCCESS
      });
      this.setState({items: newItems});
      console.log(event.target.response);
      // onSuccess(JSON.parse(event.target.response));
    } else {
      newItems[index] = Object.assign({}, this.state.items[index], {
        status: XHR_FAIL
      });
      this.setState({items: newItems});
      console.log(event.target.response);
      // onFail(JSON.parse(event.target.response));
    }
  }

  // cancelFile() {
  //   this.xhr.abort();
  //   this.xhr = null;
  //   this.setState({ item: null });
  // }

  renderFileSet() {
    const { items } = this.state;
    if (!items || items.length<1) return false;
    const that = this;

    const file = item.file;
    const fileSize = fileSizeWithUnit(file.size);
    const timeLeft = 1; // TODO: calculate time left
    const fileSizeUploaded = fileSizeWithUnit(file.size * item.progress / 100);

    return (
      <div className={styles.fileset}>
        {items.map(item, index) => {
          <div key={index}>
            <div className={styles.fileTopSection}>
              <span className={styles.fileIcon}>
                <FaFileTextO />
              </span>
              <span className={styles.fileDetails}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{fileSize}</span>
              </span>
              <a className={styles.removeButton} tabIndex={0}
                href="javascript:;"
                onClick={function () { that.cancelFile(index); }}>
                <FaClose />
              </a>
            </div>
            {item.status === XHR_UPLOADING &&
            <div>
              <div className={styles.progressBar}>
                <div className={styles.progress}
                  style={{width: `${item.progress}%`}}>
                </div>
              </div>
              <div className={styles.fileBottomSection}>
                <span className={styles.progressValue}>{Math.round(item.progress)}%</span>
                {' '}
                completed
                {' '}
                ({fileSizeUploaded} of {fileSize}).
                {' '}
                <span className={styles.timeLeft}>{timeLeft} seconds</span>
                {' '}
                remaining.
              </div>
            </div>
            }
            {item.status === XHR_WAITING &&
            <div className={styles.fileBottomSection}>
              <span className={styles.spin}>
                <FaSpinner />
              </span>
              {' '}
              Processing uploaded file ...
            </div>
            }
          </div>
        }}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.fileUpload}>
        <button type="button" onClick={this.handleClick} disabled={isUploading}>Upload</button>
        {this.renderFileSet()}
        <input style={{display: 'none'}}
          type="file"
          ref="fileInput"
          accept={this.props.accept}
          onChange={this.handleFileSelect}
        />
      </div>
    );
  }
}

export default FileUpload;
