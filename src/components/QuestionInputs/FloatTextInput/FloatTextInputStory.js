import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import FloatTextInput from './FloatTextInput';
import styles from './FloatTextInputStory.scss';
import classNames from 'classnames/bind';


storiesOf('Input', module)
  .add('Text Input', () => {
    const cx = classNames.bind(styles);
    return (
      <div>
        <FloatTextInput name="default" label="Deault state" primaryColour={'#3893d0'} extraClass={cx('default')} />
        <FloatTextInput name="filled" label="Label" primaryColour={'#3893d0'} value={'Filled state'} extraClass={cx('default')} />
        <FloatTextInput name="active" label="Label" primaryColour={'#3893d0'} value={'Active state'} autoFocus extraClass={cx('default')} />
        <FloatTextInput name="error" label="Label" primaryColour={'#3893d0'} extraClass={cx('default')}
          value={'Error state'} hasError errorMessage={<div>Error message here</div>} />
        <FloatTextInput name="error" label="Label" primaryColour={'#3893d0'} extraClass={cx('default')}
          value={'Error state'} hasError errorMessage={<div>Error message here</div>} />
        <FloatTextInput name="none" placeholder="placeholder" primaryColour={'#3893d0'} extraClass={cx('default')}
          value={'Normal placeholder'} />
        <FloatTextInput name="test" placeholder="placeholder" label="test" primaryColour={'#3893d0'} extraClass={cx('default')} />
      </div>
    );
  }
);
