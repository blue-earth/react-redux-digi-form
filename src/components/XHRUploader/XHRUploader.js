import React from 'react';
import { FaCloudUpload, FaFileTextO, FaClose } from 'react-icons/lib/fa';
import classNames from 'classnames';
import getCsrfToken from 'redux/utils/csrf';
import _ from 'lodash';
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
    maxSize: React.PropTypes.number,
    chunks: React.PropTypes.bool,
    chunkSize: React.PropTypes.number,
    localStore: React.PropTypes.bool,
    maxFiles: React.PropTypes.number,
    encrypt: React.PropTypes.bool,
    clearTimeOut: React.PropTypes.number,
    method: React.PropTypes.string,
    onSuccess: React.PropTypes.func
  };

  static defaultProps = {
    accept: '*',
    fieldName: 'datafile',
    dropzoneLabel: 'Drag and drop your files here or pick them from your computer',
    maxSize: 25 * 1024 * 1024,
    chunks: false,
    chunkSize: 512 * 1024,
    localStore: false,
    maxFiles: 1,
    encrypt: false,
    clearTimeOut: 3000,
    method: 'POST',
    onSuccess: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {items: []};
    this.activeDrag = 0;
    this.xhrs = [];
  }

  onClick = () => {
    this.refs.fileInput.click();
  }

  onUploadButtonClick = () => {
    this.upload();
  }

  onFileSelect = () => {
    const items = this.filesToItems(this.refs.fileInput.files);
    this.setState({items: items}, () => {
      this.upload();
    });
  }

  onDragEnter = (event) => {
    event.preventDefault();
    this.activeDrag += 1;
    this.setState({isActive: this.activeDrag > 0});
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
      this.setState({isActive: false});
    }
  }

  onDrop = (event) => {
    event.preventDefault();
    this.activeDrag = 0;
    this.setState({isActive: false});

    const droppedFiles = event.dataTransfer ? event.dataTransfer.files : [];
    const items = this.filesToItems(droppedFiles);

    this.setState({items: items}, () => {
      this.upload();
    });
  }

  clearIfAllCompleted() {
    if (this.props.clearTimeOut > 0) {
      const completed = this.state.items.filter(item => item.progress === 100).length;
      if (completed === this.state.items.length) {
        setTimeout(() => {
          this.setState({items: []});
        }, this.props.clearTimeOut);
      }
    }
  }

  updateFileProgress(index, progress) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], {progress: progress});
    this.setState({items: newItems}, this.clearIfAllCompleted);
  }

  updateFileChunkProgress(index, chunkIndex, progress) {
    const newItems = [...this.state.items];
    const currentItem = this.state.items[index];
    const newProgressArr = [...currentItem.chunkProgress];
    const totalProgress = newProgressArr.reduce((a, b) => a + b) / newProgressArr.length;
    newProgressArr[chunkIndex] = progress;
    newItems[index] = Object.assign({}, currentItem, {chunkProgress: newProgressArr, progress: totalProgress});
    this.setState({items: newItems}, this.clearIfAllCompleted);
  }

  cancelFile(index) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], {cancelled: true});
    if (this.xhrs[index]) {
      this.xhrs[index].upload.removeEventListener('progress');
      this.xhrs[index].removeEventListener('load');
      this.xhrs[index].abort();
    }
    this.setState({items: newItems});
  }

  upload() {
    const items = this.state.items;
    if (items) {
      items.filter(item => !item.cancelled).forEach((item) => {
        this.uploadItem(item);
      });
    }
  }

  uploadItem(item) {
    if (this.props.chunks) {
      const BYTES_PER_CHUNK = this.props.chunkSize;
      const SIZE = item.file.size;

      let start = 0;
      let end = BYTES_PER_CHUNK;

      const chunkProgressHandler = (percentage, chunkIndex) => {
        this.updateFileChunkProgress(item.index, chunkIndex, percentage);
      };
      let chunkIndex = 0;
      while (start < SIZE) {
        this.uploadChunk(item.file.slice(start, end), chunkIndex++, item.file.name, chunkProgressHandler);
        start = end;
        end = start + BYTES_PER_CHUNK;
      }
    } else {
      this.uploadFile(item.file, progress => {
        this.updateFileProgress(item.index, progress);
      });
    }
  }

  uploadChunk(blob, chunkIndex, fileName, progressCallback) {
    if (blob) {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append(this.props.fieldName, blob, `${fileName}-chunk${chunkIndex}`);

      xhr.onload = () => {
        progressCallback(100, chunkIndex);
      };
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progressCallback((e.loaded / e.total) * 100, chunkIndex);
        }
      };
      xhr.open(this.props.method, this.props.url, true);
      xhr.send(formData);
    }
  }

  uploadFile(file, progressCallback) {
    const { onSuccess } = this.props;
    if (file) {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      formData.append(this.props.fieldName, file, file.name);

      xhr.onload = (e) => {
        onSuccess(e.target.response);
        progressCallback(100);
      };

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progressCallback((e.loaded / e.total) * 100);
        }
      };
      xhr.upload.onload = (e) => {
        console.log('uploadComplete');
      };

      xhr.open('POST', this.props.url, true);
      xhr.setRequestHeader('X-CSRFToken', getCsrfToken());
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(formData);
      this.xhrs[file.index] = xhr;
    }
  }

  filesToItems(files) {
    const fileItems = Array.prototype.slice.call(files).slice(0, this.props.maxFiles);
    const items = fileItems.map((f, i) => {
      if (this.props.chunks) {
        const chunkProgress = [];
        for (let j = 0; j <= f.size / this.props.chunkSize; j++) {
          chunkProgress.push(0);
        }
        return {file: f, index: i, progress: 0, cancelled: false, chunkProgress: chunkProgress};
      }
      return {file: f, index: i, progress: 0, cancelled: false};
    });
    return items;
  }

  renderDropTarget() {
    const { items } = this.state;
    const activeItems = _.filter(items, (o) => o.cancelled !== true);
    let dropTargetStyle = classNames({
      [styles.dropTarget]: true,
      [styles.active]: this.state.isActive,
      'hide': activeItems.length > 0
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
    const items = this.state.items;
    const activeItems = _.filter(items, (o) => o.cancelled !== true);
    const that = this;
    if (activeItems.length > 0) {
      // const progress = this.state.progress;
      return (
        <div className={styles.fileset}>
        {
          activeItems.map((item) => {
            const file = item.file;
            const fileSize = fileSizeWithUnit(file.size);
            const timeLeft = 1; // TODO: calculate time left
            const fileSizeUploaded = fileSizeWithUnit(file.size * item.progress / 100);

            return (
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
            );
          })
        }
        </div>
      );
    }
    return false;
  }

  renderInput() {
    const maxFiles = this.props.maxFiles;
    return (
      <input style={{display: 'none'}}
        multiple={maxFiles > 1}
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
