import React from 'react';
import { FaCloudUpload, FaFileTextO, FaClose, FaSpinner } from 'react-icons/lib/fa';
import classNames from 'classnames';
import getCsrfToken from 'redux/utils/csrf';
import styles from './XHRUploader.scss';
import _ from 'lodash';

const fileSizeWithUnit = (fileSize) =>
  fileSize < 1024 * 1000
  ? `${(fileSize / 1024).toFixed(1)}kb`
  : `${(fileSize / (1024 * 1024)).toFixed(1)}MB`;

const XHR_INIT = 'XHR_INIT';
const XHR_SUCCESS = 'XHR_SUCCESS';
const XHR_UPLOADING = 'XHR_UPLOADING';
const XHR_WAITING = 'XHR_WAITING';
const XHR_FAIL = 'XHR_FAIL';

export default class XHRUploader extends React.Component {

  static propTypes = {
    accept: React.PropTypes.string,
    url: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string,
    dropzoneLabel: React.PropTypes.string,
    method: React.PropTypes.string,
    onStart: React.PropTypes.func,
    onSuccess: React.PropTypes.func,
    onFail: React.PropTypes.func,
    onCancel: React.PropTypes.func
  };

  static defaultProps = {
    accept: '*',
    fieldName: 'datafile',
    dropzoneLabel: 'Drag and drop your files here or pick them from your computer',
    method: 'POST',
    onStart: () => {},
    onSuccess: () => {},
    onFail: () => {},
    onCancel: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      item: null,
      isDragging: false
    };
    this.activeDrag = 0;
    this.xhr = null;
  }

  handleClick = () => {
    this.refs.fileInput.click();
  }

  handleFileSelect = (event) => {
    const item = this.fileToItem(this.refs.fileInput.files[0]);
    this.setState({ item }, () => {
      this.upload();
    });
  }

  handleDragEnter = (event) => {
    event.preventDefault();
    this.activeDrag += 1;
    this.setState({isDragging: this.activeDrag > 0});
  }

  handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  handleDragLeave = (event) => {
    event.preventDefault();
    this.activeDrag -= 1;
    if (this.activeDrag === 0) {
      this.setState({isDragging: false});
    }
  }

  handleDrop = (event) => {
    const { accept } = this.props;
    event.preventDefault();
    this.activeDrag = 0;
    this.setState({isDragging: false});

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      const acceptable = (new RegExp(accept.replace('*', '.*'))).test(droppedFile.type);
      if (acceptable) {
        const item = this.fileToItem(droppedFile);
        this.setState({ item }, () => {
          this.upload();
        });
      }
    }
  }

  handleUploadComplete = (event) => {
    const { item } = this.state;
    const updatedItem = Object.assign({}, item, {
      progress: 100,
      status: XHR_WAITING
    });
    this.setState({ item: updatedItem });
  }

  handleUploadResponse = (event) => {
    const { onSuccess, onFail } = this.props;
    const { item } = this.state;
    if (_.inRange(event.target.status, 200, 206)) {
      this.setState({
        item: Object.assign({}, item, {
          status: XHR_SUCCESS
        })
      });
      onSuccess(JSON.parse(event.target.response));
    } else {
      this.setState({
        item: Object.assign({}, item, {
          status: XHR_FAIL
        })
      });
      onFail(JSON.parse(event.target.response));
    }
  }

  updateFileProgress(progress) {
    const { item } = this.state;
    const updatedItem = Object.assign({}, item, { progress });
    this.setState({ item: updatedItem });
  }

  cancelFile() {
    this.xhr.abort();
    this.xhr = null;
    this.refs.fileInput.value = '';
    this.setState({ item: null });
    const { onCancel } = this.props;
    onCancel();
  }

  upload() {
    const { item } = this.state;
    const { method, onStart } = this.props;
    if (item) {
      onStart();
      const file = item.file;
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      formData.append(this.props.fieldName, file, file.name);

      xhr.onload = this.handleUploadResponse;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          this.updateFileProgress((event.loaded / event.total) * 100);
        }
      };
      xhr.upload.onload = this.handleUploadComplete;

      xhr.open(method, this.props.url, true);
      xhr.setRequestHeader('X-CSRFToken', getCsrfToken());
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(formData);
      this.xhr = xhr;
      this.setState({
        item: Object.assign({}, item, {
          status: XHR_UPLOADING
        })
      });
    }
  }

  fileToItem(file) {
    return {file, progress: 0, status: XHR_INIT};
  }

  renderDropTarget() {
    const { item } = this.state;
    if (item && item.cancelled !== true) return false;

    let dropTargetStyle = classNames({
      [styles.dropTarget]: true,
      [styles.active]: this.state.isDragging
    });
    return (
      <div ref="dropTarget" className={dropTargetStyle}
        onClick={this.handleClick}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        <div className={styles.placeHolder}>
          <div className="text-center">
            <FaCloudUpload size={48} />
          </div>
          <p>{this.props.dropzoneLabel}</p>
        </div>
      </div>
    );
  }

  renderFileSet() {
    const { item } = this.state;
    if (!item || item.cancelled) return false;
    const that = this;

    const file = item.file;
    const fileSize = fileSizeWithUnit(file.size);
    const timeLeft = 1; // TODO: calculate time left
    const fileSizeUploaded = fileSizeWithUnit(file.size * item.progress / 100);
    return (
      <div className={styles.fileset}>
        <div key={item.index}>
          <div className={styles.fileTopSection}>
            <span className={styles.fileIcon}>
              <FaFileTextO />
            </span>
            <span className={styles.fileDetails}>
              <div className={styles.fileName}>{file.name}</div>
              <span className={styles.fileSize}>{fileSize}</span>
            </span>
            <a className={styles.removeButton} tabIndex={0}
              href="javascript:;"
              onClick={function () { that.cancelFile(item.index); }}>
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
      </div>
    );
  }

  renderInput() {
    return (
      <input style={{display: 'none'}}
        type="file"
        ref="fileInput"
        accept={this.props.accept}
        onChange={this.handleFileSelect}
      />
    );
  }

  render() {
    return (
      <div className={styles.xhrUploader}>
        {this.renderDropTarget()}
        {this.renderFileSet()}
        {this.renderInput()}
      </div>
    );
  }
}
