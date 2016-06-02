import React from 'react';
import styles from './AccordionFormSection.scss';
import CSSModules from 'react-css-modules';


class AccordionFormSection extends React.Component {
    constructor(props) {
        super(props);
        this.titleClickHandler = this.titleClickHandler.bind(this);
    }
    titleClickHandler() {
        this.props.toggle();
    }

    renderLeftSection() {
        var heading;
        if (this.props.isOpened) {
            heading = <div
                styleName="section-indicator-container"
                onClick={this.titleClickHandler}>
                    <div styleName="progress-indicator progress-indicator-big">
                        {this.props.index} of {this.props.totalNumSections}
                    </div>
            </div>;
        } else {
            heading = <div styleName="section-indicator-container"
                onClick={this.titleClickHandler}>
                <div styleName="progress-indicator">
                    {this.props.index}
                </div>
            </div>;
        }

        return heading;
    }
    renderRightSection() {
        if (this.props.isOpened) {
            return <div>{this.props.children}</div>
        } else {
            return <div>{this.props.title}</div>
        }
    }

    render() {
        var isOpened = this.props.isOpened;
        var sectionClassName = 'form-section';
        if (isOpened) {
            sectionClassName += ' form-section-opened';
        }
        return (
            <section styleName={sectionClassName}>
                <div styleName="form-progress-indicator-column">
                    {this.renderLeftSection()}
                </div>
                <div styleName="form-section-contents-column">
                    {this.renderRightSection()}
                </div>
            </section>

        )
    }
}
AccordionFormSection.propTypes = {
    isOpened: React.PropTypes.bool,
    index: React.PropTypes.number.isRequired,
    totalNumSections: React.PropTypes.number.isRequired
};
AccordionFormSection.defaultProps = {
    isOpened: false
};

export default CSSModules(AccordionFormSection, styles, {allowMultiple: true});


