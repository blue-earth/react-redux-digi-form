import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import AlertMessage from './AlertMessage';

storiesOf('Dropdown', module)
  .add('Alert Message', () => {
    const list = [{
      isRead: false,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkfsdfsdfsdfsdfsdf dsf',
      time: '2m ago',
      link: '/forms/3'
    }, {
      isRead: true,
      message: 'Lihan Li viewed the Personal Form',
      time: '5m ago',
      link: '/forms/3'
    }, {
      isRead: true,
      message: 'Shaun Harvey abandonded the Some thing',
      time: '1h ago',
      link: '/forms/3'
    }, {
      isRead: true,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkf',
      time: '2h ago',
      link: '/forms/3'
    }, {
      isRead: true,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkf',
      time: '2h ago',
      link: '/forms/3'
    }, {
      isRead: true,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkf',
      time: '2h ago',
      link: '/forms/3'
    }];
    return (
      <div>
        <AlertMessage list={list} />
      </div>
    );
  }
);
