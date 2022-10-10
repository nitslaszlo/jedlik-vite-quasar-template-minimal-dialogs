import { it, expect } from "vitest";
import { mountQuasar } from "../../test/utils";
import BtnCounter from "./BtnCounter.vue";

describe("BtnCounter test", () => {
  it("BtnCounter", async () => {
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

    // console.log(inner.get('[data-test="color"]'));

    // Set input value
    const input = inner.find('[data-test="color"]');
    await input.setValue("kilincs");
    await input.trigger("change");

    expect(inner.get('[data-test="color"]').text()).toBe("kilincs");

    // console.log(input);

    // input.element.value = "green";
    // input.trigger("change");

    // console.log("html():");
    // console.log(wrapper.html());
    // console.log("text():");
    // console.log(inner.text());
  });
});
