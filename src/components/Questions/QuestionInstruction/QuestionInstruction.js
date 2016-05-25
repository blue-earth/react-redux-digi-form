import React from 'react';
import CSSModules from 'react-css-modules';
import Hogan from 'hogan.js';
import styles from './QuestionInstruction.scss';

class QuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    compileInstruction() {
        var t = Hogan.compile(this.props.instruction);
        return t.render(this.props.context);
    }

    renderInstruction() {
        var isRequired = <span>*</span>;

        var itemTemplate = () => {
            return (
                <div styleName="instruction-text-wrapper">
                    <span styleName="text">{this.compileInstruction()}</span> {this.props.isRequired && isRequired}
                </div>
            )
        };

        var ItemTemplate = CSSModules(itemTemplate, this.props.styles);

        return <ItemTemplate />;
    }

    renderDescription() {
        if (this.props.description) {
            var itemTemplate = () => {
                return (
                    <div
                        styleName="description-text-wrapper"
                        dangerouslySetInnerHTML={{__html: this.props.description}}>
                    </div>
                )
            };

            var ItemTemplate = CSSModules(itemTemplate, this.props.styles);

            return <ItemTemplate />;
        }
    }

    renderAttachment() {
        if (this.props.attachment) {
            return (
                <div
                    styleName="attachment"
                    dangerouslySetInnerHTML={{__html: this.props.attachment}}>
                </div>
            );
        }
    }

    render() {
        return (
            <div styleName="question-container">
                {this.renderInstruction()}
                {this.renderDescription()}
            </div>
        )
    }
}

QuestionDisplay.propTypes = {
    instruction: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
    attachment: React.PropTypes.string,
    isRequired: React.PropTypes.bool,
    isFocused: React.PropTypes.bool,
    context: React.PropTypes.object
};

QuestionDisplay.defaultProps = {
    instruction: 'No question text line',
    description: null,
    attachment: null,
    isRequired: false,
    isFocused: false,
    context: {}
};


export default CSSModules(QuestionDisplay, styles, {allowMultiple: true});


