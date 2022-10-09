import { test, expect } from "vitest";
import { mountQuasar } from "../test/utils";
import BtnCounter from "./BtnCounter.vue";

test("BtnCounter", async () => {
  expect(BtnCounter).toBeTruthy();

  const wrapper = mountQuasar(BtnCounter, {
    props: {
      supper: true,
    },
  });

  await wrapper.setProps({ supper: false });

  const inner = wrapper.findComponent(BtnCounter);

  expect(inner.get('[data-test="counter"]').text()).toBe("0");

  await inner.get('[data-test="plus"]').trigger("click");

  expect(inner.get('[data-test="counter"]').text()).toBe("1");

  await inner.get('[data-test="plus"]').trigger("click");
  await inner.get('[data-test="plus"]').trigger("click");

  expect(inner.get('[data-test="counter"]').text()).toBe("3");

  await inner.get('[data-test="minus"]').trigger("click");
  await inner.get('[data-test="minus"]').trigger("click");
  await inner.get('[data-test="minus"]').trigger("click");
  await inner.get('[data-test="minus"]').trigger("click");

  expect(inner.get('[data-test="counter"]').text()).toBe("-1");

  //   console.log("html():");
  //   console.log(wrapper.html());
  //   console.log("text():");
  //   console.log(wrapper.text());
});
