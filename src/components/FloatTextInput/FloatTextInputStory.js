import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import FloatTextInput from './FloatTextInput';
import styles from './FloatTextInputStory.scss';
import classNames from 'classnames/bind';


storiesOf('Input', module)
  .add('Text Input', () => {
    const cx = classNames.bind(styles);
    let isError = true;
    let onBlur = (event) => {
      console.log(event.target.value);
      isError = true;
    }
    return (
      <div>
        <FloatTextInput name="default" placeholder="Deault state" primaryColour={'#3893d0'} extraClass={cx('default')} />
        <FloatTextInput name="filled" placeholder="Label" primaryColour={'#3893d0'} value={'Filled state'} extraClass={cx('default')} />
        <FloatTextInput name="active" placeholder="Label" primaryColour={'#3893d0'} value={'Active state'} autoFocus extraClass={cx('default')} />
        <FloatTextInput name="error" placeholder="Label" primaryColour={'#3893d0'} extraClass={cx('default')}
          value={'Error state'} isError={isError} onBlur={onBlur} errorMessage={'Error message here'} />
      </div>
    );
  }
);
