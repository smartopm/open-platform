## Feature description
Create a new community in DoubleGDP


### Requirements (checklist preferred)

Name:
Domain name:
Logo:
Timezone:
Currency:
Primary theme color:
Secondary theme color:
List of required features:

Engineering Checklist
<!-- This is to make sure nothing is forgotten -->
<!-- TODO:  This list should further be moved to the handbook -->

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
- [ ] Made the necessary code changes to reflect new community
<!-- until we move to a full automated way of creating a community, we need to update here -->
    - https://gitlab.com/doublegdp/app/-/blob/master/app/controllers/concerns/authorizable.rb#L23
    - https://gitlab.com/doublegdp/app/-/blob/master/app/javascript/src/utils/constants.js#L8
    - https://gitlab.com/doublegdp/app/-/blob/master/lib/host_env.rb#L8
    - https://gitlab.com/doublegdp/app/-/blob/master/app/controllers/service_worker_controller.rb

