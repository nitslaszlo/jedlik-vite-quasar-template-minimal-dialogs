import { test, expect } from "vitest";
import { mountQuasar } from "../test/utils";
import LoginDialog from "src/components/LoginDialog.vue";

test("Test LoginDialog", async () => {
  expect(LoginDialog).toBeTruthy();

  const wrapper = mountQuasar(LoginDialog, {
    props: { email: "student001@jedlik.eu", password: "student001", showDialog: false },
  });

  await wrapper.setProps({ showDialog: true });

  console.log("html():");
  console.log(wrapper.html());
  console.log("text():");
  console.log(wrapper.text());
});
