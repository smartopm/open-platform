import React from "react";
import { shallow } from "enzyme";
import { SideList } from "../components/SideList";

describe("Sidelist component", () => {
  const sideProps = {
    toggleDrawer: jest.fn(),
    user: {}
  };
  const sideListWrapper = shallow(<SideList {...sideProps} />);
  // MuiList-root

  it("should contain required list ", () => {
    const { children } = sideListWrapper.props();
    expect(children).toHaveLength(3);
  });
});
