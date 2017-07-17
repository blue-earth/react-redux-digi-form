import React, {
  Component,
  PropTypes
} from 'react';
import getCsrfToken from 'redux/utils/csrf';
import _ from 'lodash';
import { FaCloudUpload, FaClose, FaSpinner, FaExclamationTriangle } from 'react-icons/lib/fa';
import styles from './FileUpload.scss';
import classNames from 'classnames';

const fileSizeWithUnit = (fileSize) =>
  fileSize < 1024 * 1000
  ? `${(fileSize / 1024).toFixed(1)}kb`
  : `${(fileSize / (1024 * 1024)).toFixed(1)}MB`;

const XHR_INIT = 'XHR_INIT';
const XHR_SUCCESS = 'XHR_SUCCESS';
const XHR_UPLOADING = 'XHR_UPLOADING';
const XHR_WAITING = 'XHR_WAITING';
const XHR_FAIL = 'XHR_FAIL';

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
      items: [
        {file: {name: 'test1'}, progress: 100, status: 'XHR_SUCCESS'},
        {file: {name: 'test2'}, progress: 60, status: 'XHR_UPLOADING'}
      ]
    };
    this.xhr = null;
  }

  hasMaxFiles = () => {
    const { items } = this.state;
    // count items that haven't failed
    // TODO: don't count cancelled/removed items
    var numFiles = _.reject(items, function (el) {
      return (el.status === XHR_FAIL);
    }).length;
    if (numFiles >= this.props.maxNumberOfFiles) {
      return true;
    }
    // TODO: test total file size
    return false;
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
    // const item = {this.refs.fileInput.files[0], progress: 0, status: XHR_INIT};
    const item = this.fileToItem(this.refs.fileInput.files[0]);
    var newItems = this.state.items;
    var newIndex = newItems.push(item) - 1;
    this.setState({ items: newItems });
    this.upload(newIndex);
  }

  fileToItem(file) {
    return {file, progress: 0, status: XHR_INIT};
  }

  upload(index) {
    const item = this.state.items[index];
    var requestURL = `${API_URL}/form_document/api/form_response/attachment/`;
    var method = 'POST';
    if (item) {
      const file = item.file;
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      formData.append('file', file, file.name);

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
    this.setState({items: newItems});
  }

  handleUploadResponse = (event) => {
    var index = this.state.items.length - 1;
    const newItems = [...this.state.items];
    if (_.inRange(event.target.status, 200, 206)) {
      console.log(event.target.response);
      // TODO: add id, filename, url from response to items[index]
      newItems[index] = Object.assign({}, this.state.items[index], {
        status: XHR_SUCCESS
      });
      this.setState({items: newItems});
    } else {
      newItems[index] = Object.assign({}, this.state.items[index], {
        status: XHR_FAIL
      });
      this.setState({items: newItems});
      console.log(event.target.response);
      // onFail(JSON.parse(event.target.response));
    }
  }

  cancelFile() {
    console.log('TODO: delete function');
  }

  getFileWrapperClass(status) {
    return classNames({
      [styles.fileWrapper]: true,
      [styles.success]: status === XHR_SUCCESS,
      [styles.fail]: status === XHR_FAIL,
      [styles.uploading]: status === XHR_UPLOADING,
      [styles.waiting]: status === XHR_WAITING
    });
  }

  renderFileSet() {
    const { items } = this.state;
    if (!items || items.length<1) return false;
    const that = this;

    return (
      <div className={styles.fileset}>
        {items.map((item, index) => {
          const file = item.file;
          const fileSize = fileSizeWithUnit(file.size);
          const fileSizeUploaded = fileSizeWithUnit(file.size * item.progress / 100);
          return (
            <div key={index} className={this.getFileWrapperClass(item.status)}>
              <div className={styles.fileTopSection}>
                <span className={styles.fileDetails}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>{fileSize}</span>
                </span>
                {item.status === XHR_SUCCESS &&
                  <a className={styles.fileStatus} href="javascript:;"
                    onClick={function () { that.cancelFile(index); }}>
                    <FaClose style={{verticalAlign: 'text-bottom'}} />
                  </a>
                }
                {item.status === XHR_FAIL &&
                  <span className={styles.fileStatus}><FaExclamationTriangle /></span>
                }
                {item.status === XHR_WAITING &&
                  <div className={styles.fileStatus}>
                    <span className={styles.spin}>
                      <FaSpinner />
                    </span>
                  </div>
                }
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
                  </div>
                </div>
              }
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    var disableButton = this.hasMaxFiles();
    return (
      <div className={styles.fileUpload}>
        <button type="button" onClick={this.handleClick} className={styles.fileUploadButton}
          disabled={disableButton}>
          <FaCloudUpload /> Upload
        </button>
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
