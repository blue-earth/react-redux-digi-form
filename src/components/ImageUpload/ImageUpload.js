import React, {
  Component,
  PropTypes
} from 'react';
import styles from './ImageUpload.scss';
import classNames from 'classnames/bind';
import { FaCloudUpload, FaFileTextO, FaClose } from 'react-icons/lib/fa';

const cx = classNames.bind(styles);
const acceptTypes = {
  image: 'image/*'
};

class ImageUpload extends Component {
  static propTypes = {
    type: PropTypes.string,
    preview: PropTypes.bool
  };
  static defaultProps = {
    type: 'image',
    preview: false
  }
  constructor(props) {
    super(props);
    this.activeDrag = 0;
    this.state = {
      item: null,
      isDragging: false
    };
  }
  handleBrowse = (event) => {
    this.refs.fileInput.click();
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

  handleFileDrop = (event) => {
    event.preventDefault();
    this.activeDrag = 0;
    this.setState({isDragging: false});
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.setState({
        item: file
      });
      console.log(file);
      this.preview(file);
    }
  }
  handleFileChange = (event) => {
    const file = event.target.files[0];
    this.setState({
      item: file
    });
    console.log(file);
    this.preview(file);
  }
  handleFileDelete = (event) => {
    this.setState({
      item: null
    });
  }

  preview = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      this.refs.previewImage.src = e.target.result;
    };
  }

  file = () => {
    return this.state.item;
  }

  renderUpload = () => {
    const {type} = this.props;
    const {isDragging, item} = this.state;
    return (
      <div
        className={cx('uploadWrapper', {
          active: isDragging,
          preview: item
        })}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleFileDrop}>
        <input
          ref="fileInput"
          name="pic"
          accept={acceptTypes[type]}
          type="file"
          className={cx('fileInput')}
          style={{display: 'none'}}
          onChange={this.handleFileChange}
        />
        <div className={cx('uploadInstructionWrapper')}>
          <FaCloudUpload size={40} />
          <div>
            Drag an {type} here or <span className={cx('browseButton')} onClick={this.handleBrowse}>browse</span>
          </div>
          <div>
            for an {type} to upload
          </div>
        </div>
      </div>
    );
  }

  renderPreview = () => {
    const {item} = this.state;
    return (
      <div className={styles.previewWrapper}>
        <div className={styles.imageWrapper}>
          <img ref="previewImage" className={styles.previewImage} />
        </div>
        <div className={styles.imageFileInfo}>
          <div className={styles.fileNameSection}>
            <FaFileTextO size={16} style={{verticalAlign: 'bottom'}} />
            {' '}
            <span className={styles.fileName}>{item.name}</span>
            {' '}
            {Math.round(item.size / 1024) + 'kb'}
            <div className={styles.deleteFile} onClick={this.handleFileDelete}>
              <FaClose size={16} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const {item} = this.state;
    return item ? this.renderPreview() : this.renderUpload();
  }
}

export default ImageUpload;
