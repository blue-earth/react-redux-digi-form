import React from 'react';
import { FaCloudUpload, FaFileTextO, FaClose } from 'react-icons/lib/fa';
import classNames from 'classnames';
import getCsrfToken from 'redux/utils/csrf';
import styles from './XHRUploader.scss';

const fileSizeWithUnit = (fileSize) =>
  fileSize < 1024 * 1000
  ? `${(fileSize / 1024).toFixed(1)}kb`
  : `${(fileSize / (1024 * 1024)).toFixed(1)}MB`;

export default class XHRUploader extends React.Component {

  static propTypes = {
    accept: React.PropTypes.string,
    url: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string,
    dropzoneLabel: React.PropTypes.string,
    method: React.PropTypes.string,
    onSuccess: React.PropTypes.func,
    onCancel: React.PropTypes.func
  };

  static defaultProps = {
    accept: '*',
    fieldName: 'datafile',
    dropzoneLabel: 'Drag and drop your files here or pick them from your computer',
    method: 'POST',
    onSuccess: () => {},
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

  onClick = () => {
    this.refs.fileInput.click();
  }

  onFileSelect = (event) => {
    const item = this.fileToItem(this.refs.fileInput.files[0]);
    this.setState({ item }, () => {
      this.upload();
    });
  }

  onDragEnter = (event) => {
    event.preventDefault();
    this.activeDrag += 1;
    this.setState({isDragging: this.activeDrag > 0});
  }

  onDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onDragLeave = (event) => {
    event.preventDefault();
    this.activeDrag -= 1;
    if (this.activeDrag === 0) {
      this.setState({isDragging: false});
    }
  }

  onDrop = (event) => {
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

  onUploadComplete = () => {
    const { item } = this.state;
    const updatedItem = Object.assign({}, item, {
      progress: 100,
      completed: false
    });
    this.setState({ item: updatedItem });
  }

  onUploadResponse = (response) => {
    const { onSuccess } = this.props;
    const { item } = this.state;
    const updatedItem = Object.assign({}, item, {
      completed: true
    });
    this.setState({ item: updatedItem });
    onSuccess(response);
  }

  updateFileProgress(progress) {
    const { item } = this.state;
    const updatedItem = Object.assign({}, item, { progress });
    this.setState({ item: updatedItem });
  }

  cancelFile() {
    // this.xhr.upload.removeEventListener('progress');
    // this.xhr.removeEventListener('load');
    this.xhr.abort();
    this.xhr = null;
    this.setState({ item: null });
    const { onCancel } = this.props;
    onCancel();
  }

  upload() {
    const { item } = this.state;
    if (item) {
      const file = item.file;
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      formData.append(this.props.fieldName, file, file.name);

      xhr.onload = (event) => {
        this.onUploadResponse(event.target.response);
      };

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          this.updateFileProgress((event.loaded / event.total) * 100);
        }
      };
      xhr.upload.onload = (event) => {
        this.onUploadComplete();
      };

      xhr.open('POST', this.props.url, true);
      xhr.setRequestHeader('X-CSRFToken', getCsrfToken());
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(formData);
      this.xhr = xhr;
    }
  }

  fileToItem(file) {
    return {file, progress: 0, completed: false};
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
        onClick={this.onClick}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
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

    // const progress = this.state.progress;
    return (
      <div className={styles.fileset}>
        <div key={item.index}>
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
              onClick={function () { that.cancelFile(item.index); }}>
              <FaClose />
            </a>
          </div>
          {!item.completed && item.progress < 100 &&
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
          {!item.completed && item.progress === 100 &&
            <div className={styles.fileBottomSection}>
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
        onChange={this.onFileSelect}
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
