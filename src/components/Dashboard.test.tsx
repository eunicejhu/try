import { render, waitForElement } from "@testing-library/react";
import axios from "axios";
import React from "react";
import Dashboard from "./Dashboard";
jest.mock("axios", () => ({
  get: jest.fn().mockResolvedValue({ data: "mock_data" })
}));
describe("Dashboard", () => {
  it("should render initial ", async () => {
    const { getByTestId } = render(
      <Dashboard updateClickDrawerCount={jest.fn}></Dashboard>
    );
    const initialElement = await waitForElement(() => getByTestId("initial"));
    expect(initialElement.innerHTML).toBe("mock_data");
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  //   it("axios render error data: ", async () => {

  //     const { getByTestId } = render(
  //       <Dashboard updateClickDrawerCount={jest.fn}></Dashboard>
  //     );
  //     const initialElement = await waitForElement(() => getByTestId("initial"));
  //     expect(initialElement.innerHTML).toBe("error");
  //     expect(axios.get).toHaveBeenCalledTimes(1);
  //   });
});
