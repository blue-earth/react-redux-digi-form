import React, {
  Component,
  PropTypes
} from 'react';
import SidebarMenu from 'components/SidebarMenu';
import { FaInfoCircle } from 'react-icons/lib/fa';
import GeneralForm from './GeneralForm';
import styles from './Form.scss';
import _ from 'lodash';

class StepConfigure extends Component {

  static propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    slug: PropTypes.string,
    subdomain: PropTypes.string,
    formConfig: PropTypes.any,
    questions: PropTypes.array,
    processSubmitConfigure: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSubPageKey: 'general'
    };
  }

  handleSidebarSelect = (key) => {
    this.setState({currentSubPageKey: key});
  }

  processForm = (values) => {
    var newFormConfig = this.props.formConfig;
    _.merge(newFormConfig, values.formConfig);
    values.formConfig = newFormConfig;
    values.id = this.props.id;
    return this.props.processSubmitConfigure(values);
  }

  get sidebarMenuItems() {
    return [
      {key: 'general', label: (<span><FaInfoCircle /> General</span>)}
    ];
  }

  renderForm = () => {
    let initGeneral = {
      initialValues: {
        title: this.props.title,
        slug: this.props.slug,
        formConfig: {
          redirect: _.get(this.props.formConfig, ['redirect'], ''),
          customise: {
            footer: _.get(this.props.formConfig, 'customise.footer', ''),
            emondoBranding: _.get(this.props.formConfig, 'customise.emondoBranding', true)
          }
        }
      }
    };

    switch (this.state.currentSubPageKey) {
      case 'customize':
        return (<span>Customise section, under construction</span>);
      case 'notifications':
        return (<span>Notifications section, under construction</span>);
      case 'btext':
        return (<span>Buttons Text section, under construction</span>);
      case 'intaccess':
        return (<span>internal access section, under construction</span>);
      case 'sec':
        return (<span>Security section, under construction</span>);
      default:
        return (
          <GeneralForm {...initGeneral} enableReinitialize
            onSubmit={this.processForm}
            subdomain={this.props.subdomain}
            questions={this.props.questions} />
        );
    }
  }

  render() {
    return (
      <div className={styles.stepConfigureWrapper}>
        <div className={styles.leftPanel}>
          <SidebarMenu
            menuItems={this.sidebarMenuItems}
            selectedItemKey={this.state.currentSubPageKey} onMenuItemSelect={this.handleSidebarSelect} />
        </div>
        <div className={styles.rightPanel}>
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

export default StepConfigure;
