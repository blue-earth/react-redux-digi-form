import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import ImageUpload from './ImageUpload';

storiesOf('Small Components', module)
  .add('File Upload Field', () => {
    return (
      <div style={{height: '200px', width: '400px'}}>
        <ImageUpload />
      </div>
    );
  }
);