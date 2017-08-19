import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SidebarMenu from './SidebarMenu';
import { FaInfoCircle, FaFlask, FaBell, FaBuilding, FaLock } from 'react-icons/lib/fa';
import { MdTextFields } from 'react-icons/lib/md';

storiesOf('Sidebar menu', module)
  .add('default', () => (
    <SidebarMenu menuItems={[
      {key: 'general', label: <span><FaInfoCircle /> General</span>},
      {key: 'customize', label: <span><FaFlask /> Customize</span>},
      {key: 'notifications', label: <span><FaBell /> Notifications</span>},
      {key: 'btext', label: <span><MdTextFields /> Buttons text</span>},
      {key: 'intaccess', label: <span><FaBuilding /> Internal access</span>},
      {key: 'sec', label: <span><FaLock /> Security</span>}]}
      selectedItemKey="general"
      onMenuItemSelect={action('menu item click')} />
  ));
