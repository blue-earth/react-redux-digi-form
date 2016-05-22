import { AccordionForm, AccordionFormSection }from '../index.js';
import React from 'react';
import ReactDOM from 'react-dom';


var data = [
    {
        heading: 'Section 1 title',
        contents: 'Section 1 contents'
    },
    {
        heading: 'Section 2 title',
        contents: 'Section 2 contents'
    },
    {
        heading: 'Section 3 title',
        contents: 'Section 3 contents'
    },
    {
        heading: 'Section 4 title',
        contents: 'Section 4 contents'
    },
    {
        heading: 'Section 5 title',
        contents: 'Section 5 contents'
    }
];

const test1 = (

    <AccordionForm multiple={false} items={data}>
    </AccordionForm>
);

ReactDOM.render(test1, document.getElementById('app'));