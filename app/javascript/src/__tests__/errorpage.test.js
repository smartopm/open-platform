import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import ErrorPage from "../components/Error";

describe("Error component", () => {
  const props = { title: "This is an error page" };
  const wrapperWithProps = mount(
    <MemoryRouter>
      <ErrorPage {...props} />
      );
    </MemoryRouter>
  );

  it("should contain an h4 element for the title", () => {
    expect(wrapperWithProps.find("h4")).toHaveLength(1);
  });
  it("should have an achor tag to link back home", () => {
    expect(wrapperWithProps.find("a")).toHaveLength(1);
  });
  it("should contain the text passed as a prop", () => {
    expect(wrapperWithProps.find("h4").text()).toContain(props.title);
  });
  it("should contain an anchor tag with 'home'", () => {
    expect(wrapperWithProps.find("a").text()).toContain("Home");
  });
});
