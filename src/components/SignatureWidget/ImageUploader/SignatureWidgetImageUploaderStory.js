import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SignatureWidgetImageUploader from './SignatureWidgetImageUploader';

storiesOf('Small Components', module)
  .add('File Upload Field', () => {
    return (
      <div style={{height: '200px', width: '400px'}}>
        <SignatureWidgetImageUploader />
      </div>
    );
  }
);
