import React from 'react';
import { storiesOf } from '@kadira/storybook';
import PillTab from './PillTab';

storiesOf('Tabs', module)
  .add('Pill Tab', () => {
    const tab1 = (<div><h4>Would you like to limit the form access within your organisation?</h4></div>);
    const tab2 = (<div>Submissions access2</div>);
    const tab3 = (<div>Other access3</div>);
    const tabs = [{
      title: 'Form access',
      content: tab1
    }, {
      title: 'Submissions access',
      content: tab2
    }, {
      title: 'Other access',
      content: tab3
    }];
    return (
      <div>
        <PillTab tabs={tabs} />
      </div>
    );
  });
