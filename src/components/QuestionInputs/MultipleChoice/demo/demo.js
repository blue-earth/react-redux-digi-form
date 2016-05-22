import MultipleChoice from '../MultipleChoice.js';
import React from 'react';
import ReactDOM from 'react-dom';


var testData = {
isRequired: false,
    isFocused: true,
    isDisabled: false,
    errorText: 'error text',
    initialValue: null,
    fullWidth: false,
    allowMultiple: false,
    choices: [{
        text: 'First Selection',
        label: 'A'
    },
    {
        text: 'Second Selection',
        label: 'B'
    }
    ]
};

const test1 = (
    <MultipleChoice {...testData}>
    </MultipleChoice>
);

ReactDOM.render(test1, document.getElementById('app'));