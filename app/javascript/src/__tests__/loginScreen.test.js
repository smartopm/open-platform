import React from "react";
import { shallow } from "enzyme";
import { MockedProvider } from "@apollo/react-testing";
import { LoginScreen } from "../components/AuthScreens/LoginScreen";
import { createClient } from "../utils/apollo";
import { loginPhone } from "../graphql/mutations";

/* Checks:
    - renders properly
    - 
*/

describe("Login screen", () => {
  const mocks = [
    {
      request: {
        query: loginPhone,
        variables: { phoneNumber: "260971500748" }
      },
      //  data.loginPhoneStart.user
      result: {
        data: {
          loginPhoneStart: {
            id: "11cdad78-5a04-4026-828c-17290a2c44b6",
            phoneNumber: "260971500748",
            __typename: "User"
          }
        }
      }
    }
  ];
  const loginWrapper = shallow(
    <MockedProvider client={createClient} mocks={mocks}>
      <LoginScreen />
    </MockedProvider>
  );
  // loginWrapper.find(".enz-lg-btn").simulate("click");
  it("should render properly", () => {
    // expect(loginWrapper.text()).toContain("next");
    // console.log(loginWrapper.find("nav"));
    console.log("this needs to be fixed");
  });
});
