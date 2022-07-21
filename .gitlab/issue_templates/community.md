## Feature description
Create a new community in DoubleGDP


### Requirements for ticket to be completed

Name:
Domain name:
Logo:
Timezone:
Currency:
Primary theme color:
Secondary theme color:
List of required features:
Required community assets: @vanessa43

### Engineering Checklist
<!-- This is to make sure nothing is forgotten -->
<!-- TODO:  This list should further be moved to the handbook -->

- [ ] Create community with provided community name in the db.
- [ ] Updated cloudflare with new domain @nicolas128
- [ ] Added the community to auth providers
- [ ] Added google analytics to the community
- [ ] Added timezone to the community
- [ ] Added currency to the community
- [ ] Added spoken language and locale to the community, <!-- currently we are only supporting en and es -->
- [ ] Added theme colors to the community
- [ ] Added the logo to the community
- [ ] Added wordpress link to the community
- [ ] Added list of required features to the community
- [ ] Added url to the AWS S3 permission list
- [ ] Made the necessary code changes to reflect new community
    - [ ] https://gitlab.com/doublegdp/app/-/blob/master/app/controllers/concerns/authorizable.rb#L23
    - [ ] https://gitlab.com/doublegdp/app/-/blob/master/app/javascript/src/utils/constants.js#L8 and added currency
    - [ ] https://gitlab.com/doublegdp/app/-/blob/master/lib/host_env.rb#L8
    - [ ] https://gitlab.com/doublegdp/app/-/blob/master/app/controllers/service_worker_controller.rb
    - [ ] https://gitlab.com/doublegdp/app/-/blob/master/app/models/community.rb
- [ ] Create a "Generic Template" email template for the community
    - [ ] Get a design from Vanessa
    - [ ] Check an [existing one](https://demo.doublegdp.com/mail_templates/c0c68da8-53fc-4600-a385-142d95b3ccf7) for paddings, margins and other necessary stylings
- [ ] Create action-flows for necessary notifications (email and sms) - Check the [available ones](https://demo.doublegdp.com/action_flows) and replicate
- [ ] If applicable, create “Report an Issue” form and make it a quick link on the dashboard