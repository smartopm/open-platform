import { renderHook } from "@testing-library/react-hooks";
import { useFetchMedia } from "../../utils/customHooks";

describe("useFetchMedia Hook", () => {

  it("should render the hook", async () => {
    const { result } = renderHook(() => useFetchMedia('https://some.video.coom'));
    expect(result.current.isError).toBe(true);
    expect(result.current.loading).toBe(false);
  });
});