// REConverge 2001 — Privacy Policy & Terms and Conditions.
//
// IMMUTABILITY: this file is version-stamped. NEVER edit the wording of a
// published version — copy it, bump POLICY_VERSION and the effective date,
// and the consent popup automatically re-prompts every signed-in user.
// The frozen source documents live in docs/policies/<version>/ in the repo.

export const POLICY_VERSION = '1.0';
export const POLICY_EFFECTIVE = '27 September 2026';
export const POLICY_CONTACT_NAME = 'REConverge 2001 Reunion Organizing Committee';
export const POLICY_CONTACT_EMAIL = 'crec2001reunion@gmail.com';

export const CONSENT_LABEL =
  'I have read and agree to the Terms & Conditions and acknowledge the Privacy Policy, including the photography and video notice.';

export const DIRECTORY_LABEL =
  'I agree to have my name, email address, and phone number included in a Reunion Directory shared with registered reunion participants. (Optional — leaving this unchecked will not affect your registration.)';

export const PHOTO_NOTICE = [
  'Photography and videography will take place during the reunion, including group and candid photographs. Photos and videos may be shared through official reunion channels, including the reunion website, WhatsApp groups, shared albums, and social media.',
  `If you do not wish to be individually featured, identified, or tagged in official reunion content, please contact the Organizing Committee at ${POLICY_CONTACT_EMAIL}. Due to the nature of a group event, we cannot guarantee exclusion from all group or background photographs.`,
];

// ─── Privacy Policy v1.0 (verbatim from the committee's document) ────────
export const privacyPolicy = {
  title: 'Privacy Policy',
  sections: [
    { heading: null, paragraphs: [
      'The Reconverge 2001 Reunion Organizing Committee ("Organizing Committee," "we," or "us") respects the privacy of reunion participants and is committed to handling personal information responsibly.',
    ]},
    { heading: '1. Information We Collect', paragraphs: [
      'When you register for the reunion, we may collect information such as:',
    ], list: [
      'Name',
      'Email address and/or phone number',
      'College, branch, batch, or class information',
      'Attendance and guest/family information',
      'Food or accommodation preferences',
      'Payment and registration status',
      'Other information voluntarily provided for organizing the reunion',
    ], after: [
      'We encourage participants not to provide sensitive personal information unless it is reasonably necessary for organizing the event.',
    ]},
    { heading: '2. How We Use Your Information', paragraphs: [
      'Information collected through registration may be used to:',
    ], list: [
      'Register you and your guests for the reunion',
      'Communicate event information and updates',
      'Coordinate food, accommodation, transportation, and activities',
      'Manage payments and event administration',
      'Prepare attendee lists or reunion directories where applicable',
      'Respond to questions or requests',
      'Maintain reasonable administrative and financial records relating to the reunion',
    ], after: [
      'Personal information will not be sold or used for unrelated commercial marketing.',
    ]},
    { heading: '3. Attendee Directory and Contact Information', paragraphs: [
      'If the Organizing Committee creates an attendee directory, personal contact information such as email addresses or phone numbers will be included only where the participant has agreed to such sharing. Participants who do not agree may still attend the reunion.',
      'The registration form provides a separate option: “I agree to have my contact information included in a reunion directory shared with registered reunion participants.”',
    ]},
    { heading: '4. Photography and Video', paragraphs: [
      'Photographs and videos may be taken during the reunion by organizers, photographers, and other attendees. These may include individual photographs, group photographs, candid photographs, and event videos.',
      'Photographs and videos may be shared through reunion-related channels, including the reunion website, WhatsApp groups, shared photo albums, and social-media accounts.',
      'Because this is a group event, we cannot guarantee that an individual will not appear incidentally in group photographs, videos, or background footage.',
      `If you prefer not to be individually featured, identified, tagged, or highlighted in photographs or videos published by the Organizing Committee, please notify us at ${POLICY_CONTACT_EMAIL}. We will make reasonable efforts to accommodate the request.`,
      'If you later have a concern about a specific photograph or video published through an official reunion channel, please contact us and identify the content. We will review reasonable requests for removal, cropping, blurring, untagging, or other appropriate action.',
      'Participants taking their own photographs and videos are requested to respect the privacy preferences of fellow attendees.',
    ]},
    { heading: '5. Sharing With Service Providers', paragraphs: [
      'Information may be shared with service providers where reasonably necessary to organize the reunion, such as event venues, hotels, caterers, transportation providers, payment providers, website or technology providers, photographers, or event-management providers. Only information reasonably necessary for the relevant service should be shared.',
    ]},
    { heading: '6. Security', paragraphs: [
      'We will take reasonable organizational and technical measures to protect registration information against unauthorized access, disclosure, alteration, or misuse. However, no website, electronic communication, or online storage system can guarantee absolute security.',
    ]},
    { heading: '7. Data Retention', paragraphs: [
      'Personal information will be retained only for as long as reasonably necessary for organizing the reunion, completing financial or administrative activities, handling post-event matters, and meeting applicable legal requirements. Information that is no longer reasonably required will be deleted or anonymized where practicable.',
      'Reunion photographs and videos may be retained as part of the historical record of the reunion unless removal is reasonably requested.',
    ]},
    { heading: '8. Your Choices and Requests', paragraphs: [
      'You may contact the Organizing Committee to correct inaccurate registration information, ask questions about how your information is being used, change your attendee-directory preference, request that you not be individually featured or identified in official photographs, request review of a specific photograph or video, or raise another privacy concern.',
      'Some information may need to be retained where reasonably necessary for event administration, financial records, dispute resolution, or legal obligations.',
    ]},
    { heading: '9. Children', paragraphs: [
      'Parents and guardians are responsible for information they provide about children accompanying them. The Organizing Committee will make reasonable efforts to avoid unnecessarily publishing children’s identifying information. Parents or guardians may contact us if they have concerns about photographs or information relating to their children.',
    ]},
    { heading: '10. Contact Us', paragraphs: [
      'For privacy questions or requests, please contact:',
      `${POLICY_CONTACT_NAME} — Email: ${POLICY_CONTACT_EMAIL}`,
    ]},
  ],
};

// ─── Terms & Conditions v1.0 (verbatim from the committee's document) ────
export const termsAndConditions = {
  title: 'Terms & Conditions',
  sections: [
    { heading: null, paragraphs: [
      'By registering for the Reconverge 2001 Reunion, you agree to these Terms & Conditions.',
    ]},
    { heading: '1. Registration', paragraphs: [
      'Participants should provide accurate information when registering. You are responsible for information submitted for yourself and any family members or guests included in your registration.',
    ]},
    { heading: '2. Registration Fees and Payment', paragraphs: [
      'Any applicable registration fees and payment deadlines will be displayed or communicated during registration. Registration is considered confirmed after completion of the required registration and payment process, where applicable.',
    ]},
    { heading: '3. Cancellation and Refunds', paragraphs: [
      'Cancellation and refund terms will be communicated by the Organizing Committee. Some amounts may be non-refundable where the Organizing Committee has already committed or paid funds to venues, hotels, caterers, transportation providers, or other vendors. Any specific refund deadlines or amounts displayed during registration will apply.',
    ]},
    { heading: '4. Event Changes', paragraphs: [
      'The Organizing Committee may reasonably modify the event schedule, venue, activities, transportation arrangements, or other aspects of the reunion due to operational requirements or circumstances beyond its reasonable control. Participants will be informed of significant changes where reasonably practicable.',
    ]},
    { heading: '5. Participant Conduct', paragraphs: [
      'The reunion is intended to provide a welcoming, respectful, and enjoyable environment. Participants are expected to behave respectfully toward fellow attendees, their families, volunteers, venue employees, and service providers.',
      'Harassment, threatening behavior, violence, intentional property damage, discrimination, or seriously disruptive behavior will not be tolerated. The Organizing Committee may take reasonable action, including asking an individual to leave an activity or venue, where necessary to protect participants or the event.',
    ]},
    { heading: '6. Children and Guests', paragraphs: [
      'Participants bringing children or other guests are responsible for their supervision and conduct. Parents and guardians remain responsible for the safety and supervision of their children during the reunion.',
    ]},
    { heading: '7. Activities and Personal Responsibility', paragraphs: [
      'Participation in excursions, transportation, sports, recreational activities, tours, or other reunion activities is voluntary. Participants should consider their own circumstances and those of their accompanying family members before participating. Nothing in these Terms excludes responsibility that cannot legally be excluded.',
    ]},
    { heading: '8. Personal Property', paragraphs: [
      'Participants are responsible for their own belongings. The Organizing Committee is not responsible for loss, theft, or damage to personal belongings except where responsibility cannot legally be excluded.',
    ]},
    { heading: '9. Photography and Video', paragraphs: [
      'Participants acknowledge that photography and videography will occur during the reunion and that they may incidentally appear in group photographs, videos, or background footage.',
      'Official reunion photographs and videos may be shared through reunion-related websites, WhatsApp groups, shared albums, and social-media channels. Participants who do not want to be individually featured, identified, or tagged should notify the Organizing Committee.',
      'Because of the nature of a large group event, the Organizing Committee cannot guarantee complete exclusion of an attendee from all photographs or videos. Participants are encouraged to respect reasonable privacy requests from other attendees. Additional information about photography and personal information is available in the Privacy Policy.',
    ]},
    { heading: '10. Privacy', paragraphs: [
      'Personal information submitted during registration will be handled in accordance with the Reconverge 2001 Reunion Privacy Policy.',
    ]},
    { heading: '11. Acceptance', paragraphs: [
      'By completing registration, you acknowledge that you have read and agree to these Terms & Conditions and acknowledge the Privacy Policy, including the event photography and video notice.',
    ]},
  ],
};
