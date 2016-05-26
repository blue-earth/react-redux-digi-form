import TextInputShort from '../TextInputShort.js';
import React from 'react';
import ReactDOM from 'react-dom';


var testData = {
    isRequired: false,
    isFocused: true,
    isDisabled: false,
    errorText: '',
    placeholderText: 'Please enter your text',
    initialValue: 'Default Value',
    fullWidth: false,
    type: 'text'
};

const test1 = (
    <TextInputShort {...testData}>
    </TextInputShort>
);

ReactDOM.render(test1, document.getElementById('app'));