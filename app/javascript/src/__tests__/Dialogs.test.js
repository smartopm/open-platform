import React from "react";
import { shallow } from "enzyme";
import { DenyModalDialog, GrantModalDialog } from "../components/Dialog";

describe("Deny Dialog component", () => {
  const dialogProps = {
    handleClose: jest.fn(),
    open: false,
    handleConfirm: jest.fn()
  };
  const dialogWrapperWithProps = shallow(<DenyModalDialog {...dialogProps} />);
  it("should render the deny dialog properly with props", () => {
    const { open, children, handleClose } = dialogWrapperWithProps.props();
    expect(open).toBe(false);
    expect(handleClose).toBeUndefined();
    expect(children).toHaveLength(2);
  });
  it("should contain deny text", () => {
    expect(dialogWrapperWithProps.find(".deny-msg")).toBeTruthy();
    expect(dialogWrapperWithProps.text()).toContain(
      "Are you sure you want to deny request"
    );
  });
  it("should have 2 buttons", () => {
    expect(dialogWrapperWithProps.find("button")).toBeTruthy();
  });
});
describe("Grant Dialog component", () => {
  const dialogProps = {
    handleClose: jest.fn(),
    open: false,
    imageUrl: ""
  };
  const dialogWrapper = shallow(<GrantModalDialog {...dialogProps} />);
  it("should render the grant dialog properly with props", () => {
    const { open, children, handleClose } = dialogWrapper.props();
    expect(open).toBe(false);
    expect(handleClose).toBeUndefined();
    expect(children).toHaveLength(4);
  });
  it("should contain grant text", () => {
    expect(dialogWrapper.find("img")).toBeTruthy();
    expect(dialogWrapper.text()).toContain("Access all clear");
  });
});
