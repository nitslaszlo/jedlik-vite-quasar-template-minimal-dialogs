import { test, expect } from "vitest";
import { mountQuasar } from "./utils";
import AccountView from "src/views/AccountView.vue";

test("Test AccountView", async () => {
  expect(AccountView).toBeTruthy();

  const wrapper = mountQuasar(AccountView, {
    // props: { email: "student001@jedlik.eu", password: "student001", showDialog: false },
  });

  const inner = wrapper.findComponent(AccountView);
  await inner.get('[data-test="btnShow"]').trigger("click");

  // console.log("html():");
  // console.log(wrapper.html());
  // console.log("text():");
  // console.log(wrapper.text());
});
