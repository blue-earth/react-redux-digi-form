import React, {
  Component,
  PropTypes
} from 'react';
import SidebarMenu from 'components/SidebarMenu';
import { FaInfoCircle, FaBell } from 'react-icons/lib/fa';
import GeneralForm from './GeneralForm';
import NotificationsForm from './NotificationsForm';
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
    submitConfigureStep: PropTypes.func
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
    return this.props.submitConfigureStep(values);
  }

  get sidebarMenuItems() {
    return [
      {key: 'general', label: (<span><FaInfoCircle /> General</span>)},
      {key: 'notifications', label: (<span><FaBell /> Notifications</span>)}
    ];
  }

  renderForm = () => {
    const { formConfig } = this.props;
    let initGeneral = {
      initialValues: {
        title: this.props.title,
        slug: this.props.slug,
        formConfig: {
          redirect: _.get(formConfig, ['redirect'], ''),
          customise: {
            footer: _.get(formConfig, 'customise.footer', ''),
            emondoBranding: _.get(formConfig, 'customise.emondoBranding', true)
          }
        }
      }
    };

    let initNotifications = {
      initialValues: {
        formConfig: {
          externalNotifications: {
            recipients: _.get(formConfig.externalNotifications, ['recipients'], []),
            sender: _.get(formConfig.externalNotifications, ['sender'], ''),
            signature: _.get(formConfig.externalNotifications, ['signature'], ''),
            disclaimer: _.get(formConfig.externalNotifications, ['disclaimer'], '')
          }
        }
      }
    };

    switch (this.state.currentSubPageKey) {
      case 'customize':
        return (<span>Customise section, under construction</span>);
      case 'notifications':
        return (
          <NotificationsForm {...initNotifications} enableReinitialize
            onSubmit={this.processForm}
            questions={this.props.questions} />
        );
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
        <div className={styles.middlePanel}>
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

export default StepConfigure;
