import React, {
  Component,
  PropTypes
} from 'react';
import {
  Col
} from 'react-bootstrap';
import EditSection from 'components/QuestionEditFields/EditSection';
import EditRow from 'components/QuestionEditFields/EditRow';
import SectionTitle from 'components/QuestionEditFields/SectionTitle';
import MultipleSelection from 'components/QuestionEditFields/MultipleSelection';
import _ from 'lodash';
import CheckboxBox from 'components/QuestionInputs/Checkbox/CheckboxBox';

class CheckboxFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedCheckboxStyle: this.props.currentElement.question.checkbox_style || null
    };
  }

  handleCheckboxClick = (value) => {
    this.setState({selectedCheckboxStyle: value});
    this.props.setQuestionInfo({'checkbox_style': value});
  }

  get multipleSelection() {
    return _.get(this.props, ['currentElement', 'question', 'multiple_selection'], false);
  }

  render() {
    const that = this;
    return (
      <div>
        <EditSection>
          <EditRow>
            <Col xs={6} sm={7}>
              <SectionTitle title="Checkbox style or fill" />
            </Col>
            <Col xs={6} sm={5}>
              <div style={{fontSize: '22px', textAlign: 'right'}}>
                <CheckboxBox appearance="fill"
                  active={this.state.selectedCheckboxStyle === 'fill'}
                  onClick={function () { that.handleCheckboxClick('fill'); }} />
                {' '}
                <CheckboxBox appearance="x"
                  active={this.state.selectedCheckboxStyle === 'x'}
                  onClick={function () { that.handleCheckboxClick('x'); }} />
                {' '}
                <CheckboxBox appearance="tick"
                  active={this.state.selectedCheckboxStyle === 'tick'}
                  onClick={function () { that.handleCheckboxClick('tick'); }} />
              </div>
            </Col>
          </EditRow>
        </EditSection>
        <MultipleSelection checked={this.multipleSelection} setQuestionInfo={this.props.setQuestionInfo} />
      </div>
    );
  }
}

export default CheckboxFieldAdvancedTab;
