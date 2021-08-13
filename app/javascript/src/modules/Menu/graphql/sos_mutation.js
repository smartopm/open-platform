/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const CommunityEmergencyMutation = gql`
    mutation communityEmergency {
        communityEmergency {
        success
        }
    }
`;