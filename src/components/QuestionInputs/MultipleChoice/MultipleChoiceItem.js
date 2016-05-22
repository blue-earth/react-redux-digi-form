import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './MultipleChoice.scss';


class MultipleChoiceItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var props = this.props;
        return (
            <div styleName="choice-item">
                <label styleName="label">{props.label}</label>
                <span styleName="text">{props.text}</span>
            </div>
        )
    }
}


MultipleChoiceItem.propTypes = {
    label: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired
};


export default CSSModules(MultipleChoiceItem, styles);



