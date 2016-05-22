import React from 'react';
import AccordionFormSection from './AccordionFormSection.js';
import styles from './AccordionForm.scss';
import CSSModules from 'react-css-modules';

class AccordionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionOpenedIndex: 0,
            sectionLength: this.props.items.length
        };
    }
    toggleSection(childIndex) {
        this.setState({
            sectionOpenedIndex: childIndex
        });
    }

    render() {
        var self = this;
        var props = this.props;
        var sectionOpenedIndex = this.state.sectionOpenedIndex;

        return (
            <div styleName="accordion-form">
                <div styleName="flow-line"></div>
                {this.props.items.map(function(section, i) {
                    return <AccordionFormSection
                        toggle={self.toggleSection.bind(self, i)}
                        key={i}
                        index={i+1}
                        totalNumSections={self.state.sectionLength}
                        isOpened={sectionOpenedIndex === i}
                        title={section.heading}>{section.contents}
                    </AccordionFormSection>
                })}
            </div>
        )
    }

}

export default CSSModules(AccordionForm, styles);


