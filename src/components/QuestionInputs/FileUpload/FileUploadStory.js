import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import FileUpload from './FileUpload';


storiesOf('File upload field', module)
  .add('no files uploaded', () => {
    return (
      <div>
        <FileUpload />
      </div>
    );
  })
  .add('3 files uploaded', () => {
    var val = [
      {file_name: 'file1.txt', attachment_id: 1, file_size: 10200},
      {file_name: 'file2.txt', attachment_id: 2, file_size: 10600},
      {file_name: 'file3.txt', attachment_id: 3, file_size: 1340892}
    ];
    return (
      <div>
        <FileUpload value={val} />
      </div>
    );
  })
  .add('file failed to upload', () => {
    var val = [
      {file: {name: 'file1.txt', size: 10200}, status: 'XHR_FAIL'}
    ];
    return (
      <div>
        <FileUpload value={val} />
      </div>
    );
  })
  .add('file uploading', () => {
    var val = [
      {file: {name: 'file1.txt', size: 10200}, status: 'XHR_UPLOADING', progress: 60}
    ];
    return (
      <div>
        <FileUpload value={val} />
      </div>
    );
  })
  .add('file being processed', () => {
    var val = [
      {file: {name: 'file1.txt', size: 10200}, status: 'XHR_WAITING'}
    ];
    return (
      <div>
        <FileUpload value={val} />
      </div>
    );
  });
