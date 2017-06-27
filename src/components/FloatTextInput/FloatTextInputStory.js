import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import FloatTextInput from './FloatTextInput';
import styles from './FloatTextInputStory.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
storiesOf('Input', module)
  .add('Text Input', () => (
    <div>
      <FloatTextInput id="default" placeholder="Deault state" primaryColour={'#3993d1'} className={cx('default')} />
      <FloatTextInput id="test" placeholder="Label" primaryColour={'#3993d1'} value={'Filled state'} className={cx('default')} />
      <FloatTextInput id="test" placeholder="Label" primaryColour={'#3993d1'} value={'Active state'} autoFocus className={cx('default')} />
      <FloatTextInput id="test" placeholder="Label" primaryColour={'#3993d1'} value={'Error state'} error={true} errorMessage={'Error message here'} className={cx('default')} />
    </div>
  )
);
