import React from "react";
import { shallow } from "enzyme";
import { WelcomeScreen } from "../components/AuthScreens/WelcomeScreen";

describe("Welcome screen ", () => {
  const welcomeWrapper = shallow(<WelcomeScreen />);
  const mockImage = "https://host.com/image.jpg";
  const mainTitle = "Welcome to Nkwashi App";
  it("should have a proper title", () => {
    expect(welcomeWrapper.text()).toContain(mainTitle);
  });

  it("should contain an image tags", () => {
    expect(welcomeWrapper.find("img")).toHaveLength(2);
  });
  it("should contain Nkwashi log", () => {
    expect(welcomeWrapper.find(".nz-logo-nkwashi")).toBeTruthy();
  });
});
