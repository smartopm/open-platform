import React from "react";
import { shallow } from "enzyme";
import Nav from "../components/Nav";

describe("Nav component", () => {
  const navProps = {
    navName: "",
    menuButton: ""
  };
  it("should render properly", () => {
    const renderedWrapper = shallow(<Nav {...navProps} />);
    expect(renderedWrapper.find("nav")).toHaveLength(2);
  });
});
