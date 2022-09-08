## Enable / Disable Community Feature

To ENABLE a feature for a community run:
```
docker-compose run --rm rails bundle exec rake enable_community_feature['CommunityName','Feature'] # NB: whitespace is not allowed between arguments
```

To DISABLE a feature for a community run:
```
docker-compose run --rm rails bundle exec rake disable_community_feature['CommunityName','Feature'] # NB: whitespace is not allowed between arguments
```

## Setting Environment Variables

This app has some third party integrations and the following keys are needed and must be set as environment variables for these integrations to work correctly.

1. [Sendgrid](https://sendgrid.com/): For sending email.
    - SENDGRID_WEBHOOK_TOKEN
    - SENDGRID_UPDATED_API_KEY
2. [AWS - S3](https://aws.amazon.com/s3/getting-started/): For storing uploaded files
    - AWS_ACCESS_KEY_ID
    - AWS_SECRET_ACCESS_KEY
3. [NEXMO](https://developer.vonage.com/messaging/sms/overview): For sending SMS messages
    - NEXMO_API_KEY
    - NEXMO_API_SECRET
    - NEXMO_API_FROM
4. [Twilio](https://www.twilio.com/docs): For sending WhatsApp messages
    - TWILIO_ACCOUNT_SID
    - TWILIO_TOKEN
5. [GOOGLE OAUTH](https://developers.google.com/identity/sign-in/web/sign-in): For Google sign-in.
    - GOOGLE_OAUTH_CLIENT_ID
    - GOOGLE_OAUTH_SECRET
6. [FACEBOOK APP](https://developers.facebook.com/docs/facebook-login/): For Facebook sign-in
    - FACEBOOK_APP_ID
    - FACEBOOK_APP_SECRET
