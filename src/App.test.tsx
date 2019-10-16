import { act, fireEvent, render, waitForElement } from "@testing-library/react";
import React from "react";
import App from "./App";
import { mockData } from "./__mock__/data";

jest.mock("reqwest", () => params => {
  return new Promise((resolve, reject) => {
    return resolve(mockData);
  });
});

jest.mock("axios", () => ({
  get: jest.fn().mockRejectedValue("error")
}));
const drawerTestId = "selectedCount";
it("choose a row will open drawer and display selected row count", async () => {
  await act(async () => {
    const { getByTestId, getByText } = render(<App></App>);

    const firstInput = await waitForElement(() =>
      getByText(/Mahmoud.Kjelsberg@example.com/i)
        .closest("tr")
        .querySelector(".ant-checkbox-input")
    );
    const secondInput = await waitForElement(() =>
      getByText(/Zachary.Thompson@example.com/i)
        .closest("tr")
        .querySelector(".ant-checkbox-input")
    );
    fireEvent.click(firstInput);
    fireEvent.click(secondInput);
    expect(getByTestId(drawerTestId).innerHTML).toBe("2");
    fireEvent.click(secondInput);
    expect(getByTestId(drawerTestId).innerHTML).toBe("1");
    const closeDrawerButton = getByText(
      (text, el) =>
        el.nodeName === "BUTTON" && el.className === "ant-drawer-close"
    );
    fireEvent.click(closeDrawerButton);

    const page2Button = getByText(
      (text, el) =>
        el.nodeName === "LI" && el.classList.contains("ant-pagination-item-2")
    );
    fireEvent.click(page2Button);

    const page1Button = getByText(
      (text, el) =>
        el.nodeName === "LI" && el.classList.contains("ant-pagination-item-1")
    );
    fireEvent.click(page1Button);
    const dashboardClickButton = getByTestId("dashboard-click-button");
    fireEvent.click(dashboardClickButton);
  });
});
