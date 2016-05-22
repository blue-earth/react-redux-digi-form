import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './MultipleChoice.scss';
import MultipleChoiceItem from './MultipleChoiceItem.js';



class MultipleChoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'value': ''
        }
    }

    render() {
        var props = this.props;
        var choices = this.props.choices.map(function(item){
            return <MultipleChoiceItem
                key={item.label}
                label={item.label}
                text={item.text}
            />
        });
        return (
            <div styleName="choices-container">
                {choices}
            </div>
        )
    }
}

MultipleChoice.propTypes = {
    isRequired: React.PropTypes.bool,
    isFocused: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    initialValue: React.PropTypes.string,
    fullWidth: React.PropTypes.bool,
    allowMultiple: React.PropTypes.bool,
    choices: React.PropTypes.array.isRequired
};

MultipleChoice.defaultProps = {
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

export default CSSModules(MultipleChoice, styles);



