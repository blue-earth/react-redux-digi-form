import React from 'react';
import CSSModules from 'react-css-modules';
import QuestionInstruction from '../QuestionInstruction/QuestionInstruction.js';
import TextInput from '../../QuestionInputs/TextInput/TextInput.js';
import MultipleChoice from '../../QuestionInputs/MultipleChoice/MultipleChoice.js';
import FormEnterButton from '../../Buttons/FormEnterButton/FormEnterButton.js';
import styles from './QuestionInteractive.scss';

/**
 * This component joins QuestionDisplay and one of the question input
 *
 */

class QuestionInteractive extends React.Component {
    constructor(props) {
        super(props);
    }

    renderQuestionDisplay() {
        var props = this.props;

        return (
            <QuestionInstruction
                instruction={props.questionInstruction}
                description={props.questionDescription}
            />
        )
    }

    renderInteractiveInput() {
        var ChildComponent = '';

        switch (this.props.type) {
            case 'ShortText':
                ChildComponent = TextInput;
                break;
            case 'MultipleChoice':
                ChildComponent = MultipleChoice;
                break;
        }

        var childComponentTemplate = () => {
            return <ChildComponent {...this.props} />
        };

        var BoundChildComponent =
            CSSModules(childComponentTemplate, styles);

        return (
            <div styleName="interactive-container">
                <div styleName="left-column">
                    <BoundChildComponent />
                </div>
                <div styleName="right-column">
                    <FormEnterButton />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderQuestionDisplay()}
                {this.renderInteractiveInput()}
            </div>
        )
    }
}

QuestionInteractive.propTypes = {

};

QuestionInteractive.defaultProps = {

};

// export default QuestionInteractive;
export default CSSModules(QuestionInteractive, styles);


