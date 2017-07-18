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
const REMOVED = 'REMOVED';

class FileUpload extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    /*
    value: array
    [{file_name: 'sheep.png', attachment_id: 1, file_size: 10000}]
    */
    value: PropTypes.array,

    /*
    file types to accept
    */
    accept: PropTypes.string,
    maxNumberOfFiles: PropTypes.number,
    maxTotalFileSizeKb: PropTypes.number,
    onChange: PropTypes.func,
    onEnterKey: PropTypes.func,
    formId: PropTypes.number,
    sessionId: PropTypes.number
  };

  static defaultProps = {
    value: [],
    accept: '*',
    maxNumberOfFiles: 3,
    maxTotalFileSizeKb: 10000
  };

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.value
    };
    // this.xhr = null;
  }

  hasMaxFiles = (additionalFileSize = 0) => {
    /*
    argument additionalFileSize is used when a file is selected for upload
    to check if it will go over the max total file size
    */
    const { items } = this.state;
    // count items ((has attachment_id && status not REMOVED) or status not XHR_FAIL)
    var numFiles = 0;
    var totalFileSize = additionalFileSize;
    _.forEach(items, function (value) {
      if((value.attachment_id && value.status !== REMOVED) || value.status !== XHR_FAIL) {
        numFiles += 1;
        var s = value.file_size || value.file.size;
        totalFileSize += s;
      }
    });
    if (numFiles >= this.props.maxNumberOfFiles ||
      (totalFileSize / 1024) >= this.props.maxTotalFileSizeKb) {
      return true;
    }
    return false;
  }

  handleChange = () => {
    var values = [];
    _.forEach(this.state.items, function (value) {
      if (value.status !== REMOVED && value.attachment_id) {
        var s = value.file_size || value.file.size;
        var x = {file_name: value.file_name, file_size: s, attachment_id: value.attachment_id};
        values.push(x);
      }
    });
    // console.log(values);
    this.props.onChange(values);
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
    const item = this.fileToItem(this.refs.fileInput.files[0]);
    // check file size
    if (this.hasMaxFiles(item.file.size)) {
      return false;
    } else {
      var newItems = this.state.items;
      var newIndex = newItems.push(item) - 1;
      this.setState({ items: newItems });
      this.upload(newIndex);
    }
  }

  fileToItem(file) {
    return {file, progress: 0, status: XHR_INIT};
  }

  upload(index) {
    const item = this.state.items[index];
    var requestURL = `${API_URL}/form_document/api/form_response/upload_attachment/`;
    var method = 'POST';
    if (item) {
      const file = item.file;
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      formData.append('file', file, file.name);
      formData.append('form_id', this.props.formId);
      if (typeof (this.props.sessionId) !== 'undefined' && !isNaN(this.props.sessionId)) {
        formData.append('response_id', this.props.sessionId);
      }
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
      // this.xhr = xhr;
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
      var response = JSON.parse(event.target.response);
      newItems[index] = Object.assign({}, this.state.items[index], {
        status: XHR_SUCCESS,
        file_name: response.file_name,
        attachment_id: response.attachment_id
      });
      this.setState({items: newItems}, function () {
        this.handleChange();
      });
    } else {
      newItems[index] = Object.assign({}, this.state.items[index], {
        status: XHR_FAIL
      });
      this.setState({items: newItems});
      // onFail(JSON.parse(event.target.response));
    }
  }

  removeFile(index) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], {
      status: REMOVED
    });
    this.setState({items: newItems}, function () {
      this.handleChange();
    });
  }

  getFileWrapperClass(status) {
    return classNames({
      [styles.fileWrapper]: true,
      [styles.success]: status === XHR_SUCCESS,
      [styles.fail]: status === XHR_FAIL,
      [styles.uploading]: status === XHR_UPLOADING,
      [styles.waiting]: status === XHR_WAITING,
      [styles.removed]: status === REMOVED
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
          var fileSize, fileSizeUploaded;
          if (item.file_size) {
            // for files that are already uploaded and came from this.props.value
            fileSize = fileSizeWithUnit(item.file_size);
          } else {
            fileSize = fileSizeWithUnit(file.size);
            fileSizeUploaded = fileSizeWithUnit(file.size * item.progress / 100);
          }
          return (
            <div key={index} className={this.getFileWrapperClass(item.status)}>
              <div className={styles.fileTopSection}>
                <span className={styles.fileDetails}>
                  <span className={styles.fileName}>{item.file_name || file.name}</span>
                  <span className={styles.fileSize}>{fileSize}</span>
                </span>
                {item.attachment_id &&
                  <a className={styles.fileStatus} href="javascript:;"
                    onClick={function () { that.removeFile(index); }}>
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
