import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './FormEnterButton.scss';


class FormEnterButton extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <button type="button" styleName="form-enter-button">
                <div styleName="btn-inner">
                    <div>press</div>
                    <div>ENTER</div>
                </div>
            </button>
        )
    }
}


export default CSSModules(FormEnterButton, styles);



