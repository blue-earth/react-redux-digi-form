import React from 'react';
import { storiesOf } from '@kadira/storybook';
import AlertMessage from './AlertMessage';
import { FaBell } from 'react-icons/lib/fa';

storiesOf('Dropdown', module)
  .add('Alert Message', () => {
    const list = [{
      highlight: true,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkfsdfsdfsdfsdfsdf dsf',
      time: '2m ago',
      link: '/forms/3'
    }, {
      highlight: false,
      message: 'Lihan Li viewed the Personal Form',
      time: '5m ago',
      link: '/forms/3'
    }, {
      highlight: false,
      message: 'Shaun Harvey abandonded the Some thing',
      time: '1h ago',
      link: '/forms/3'
    }, {
      highlight: false,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkf',
      time: '2h ago',
      link: '/forms/3'
    }, {
      highlight: false,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkf',
      time: '2h ago',
      link: '/forms/3'
    }, {
      highlight: false,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkf',
      time: '2h ago',
      link: '/forms/3'
    }];
    return (
      <div style={{position: 'absolute', top: '100px', left: '300px'}}>
        <AlertMessage list={list}>
          <button style={{border: '1px solid #333', cursor: 'pointer'}}>
            <FaBell />3
          </button>
        </AlertMessage>
      </div>
    );
  }
);
