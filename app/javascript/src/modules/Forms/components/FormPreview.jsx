import React from 'react';
import ReactMarkDown from 'react-markdown';
import { dateToString } from '../../../components/DateContainer';

// we need to know the values that need to be replaced in the legal document
export default function FormPreview(props) {
    // These can be picked up from authState
    // const props = {
    //     communityName: 'CM',
    //     communityAddress: 'Somewhere in the world',
    //     communityPhoneNumber: '2039023390213',
    //     emailAddress: 'abc@gmail.com',
    // }
  // eslint-disable-next-line react/no-children-prop
  return <ReactMarkDown children={previewAgreement(props)} />;
}

// This is a basic example of what a markdown terms and condition should look like
function previewAgreement(details) {
  return `Website Terms and Conditions [Text Format]
    Last Updated: ${dateToString(new Date())}

    AGREEMENT TO TERMS

    These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and [business entity name] (“we,” “us” or “our”),

    Option 1: The Site is intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to register for the Site.


    INTELLECTUAL PROPERTY RIGHTS

    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs,
    and graphics on the Site (collectively, the “Content”).
    USER REPRESENTATIONS

    By using the Site, you represent and warrant that: You will not die soon

    PROHIBITED ACTIVITIES

    You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial
    endeavors except those that are specifically endorsed or approved by us.

    CALIFORNIA USERS AND RESIDENTS

    If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California

    CONTACT US

    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:

    ${details.communityName}
    ${details.communityAddress}
    ${details.communityPhoneNumber}
    ${details.emailAddress}
    `;
}
