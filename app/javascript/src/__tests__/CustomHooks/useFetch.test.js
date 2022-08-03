import { renderHook } from "@testing-library/react-hooks";
import { useFetch } from "../../utils/customHooks";

describe("useFetch hook", () => {

  it("should not break", async () => {
    const { result } = renderHook(() => useFetch('https://some.video.coom'));
    expect(result.current.response).toBeTruthy();
  });
});