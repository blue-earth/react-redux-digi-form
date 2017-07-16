import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Statement from './Statement';

storiesOf('Statement', module)
  .add('Statement field', () => {
    var instruction = "1. The information I have provided to CMC Markets Singapore Pte. Ltd. (\"CMC Markets\") about myself and in connection with this application is accurate and not misleading in any material respect. In addition, I will notify CMC Markets immediately if any of that information materially changes or ceases to be true or correct.<br /><br />2. I understand and accept that, if CMC Markets approves this application, CMC Markets will provide its services/products to me in accordance with the Terms of Business and that for my own benefit and protection I should read that document and the documents referred to within it, including in particular the Risk Warning Notice for CFD.<br /><br />3. I understand that transactions in contracts for differences (CFDs) are leveraged products and that it is possible to lose more than my deposit.*<br /><br />4. I understand and accept that my orders will be executed in accordance with CMC Markets' Order Execution Policy Summary for CFDs.<br /><br />5. I understand and accept that all information regarding my account with CMC Markets, including all information about my transaction activity, will be provided to me through the online platform and via email and not on paper.<br/><br/>Are you ready for the application?";
    return (
      <div>
        <Statement instruction={instruction} />
      </div>
    );
  }
);
