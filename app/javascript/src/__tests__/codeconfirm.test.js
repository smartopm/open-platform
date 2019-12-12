import React from "react";
import { mount } from "enzyme";
import CodeScreen from "../components/AuthScreens/ConfirmCodeScreen";
import { createClient } from "../utils/apollo";
import { ApolloProvider } from "react-apollo";
import { MemoryRouter } from "react-router-dom";

describe("Code Confirmation Screen", () => {
  const params = {
    params: {
      id: 343
    }
  };
  const wrapper = mount(
    <MemoryRouter>
      <ApolloProvider client={createClient}>
        <CodeScreen match={params} />
      </ApolloProvider>
    </MemoryRouter>
  );
  it("renders and has a paragraph element ", () => {
    expect(wrapper.find("p")).toHaveLength(1);
  });
  it("contains a button", () => {
    expect(wrapper.find("button")).toHaveLength(1);
    expect(wrapper.find("button").text()).toContain("Next");
  });
  it("contains 7 input fields for each code", () => {
    expect(wrapper.find("input")).toHaveLength(7);
  });
});
