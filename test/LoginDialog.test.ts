import { installQuasarPlugin } from "../test/utils/install-quasar-plugin";
import { shallowMount } from "@vue/test-utils";
import LoginDialog from "src/components/LoginDialog.vue";
import { beforeAll, describe, it, expect } from "vitest";
import { Quasar } from "quasar";
import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";

installQuasarPlugin();
const oldWindowLocation = window.location;

const pinia = createTestingPinia();
setActivePinia(pinia);

beforeEach(() => {
  // delete window.location;

  window.location = Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(oldWindowLocation),
      assign: {
        configurable: true,
        value: vi.fn(),
      },
    }
  );
});

describe("Test LoginDialog.vue", () => {
  let wrapperDialog: any;
  beforeAll(async () => {
    const temail = "student001@jedlik.eu";
    const tpassword = "student001";
    const tshowDialog = true;
    wrapperDialog = () =>
      shallowMount(LoginDialog, {
        props: { email: temail, password: tpassword, showDialog: tshowDialog },
        global: { plugins: [Quasar, pinia] },
      });
  });
  it("mount component", () => {
    expect(LoginDialog).toBeTruthy();
    const wrapper = wrapperDialog();

    console.log("props() ->");
    console.log(wrapper.props());
    console.log("html() ->");
    console.log(wrapper.html());
    // console.log("VM");
    // console.log(wrapper.vm);
  });
  //   it("should render if props value is correct", () => {
  //     const message = "Happy People";
  //     const testMessage = "Happy People";
  //     const wrapper = mount(LoginDialog, {
  //       props: { message },
  //     });

  //     expect(wrapper.vm.message).toBe(testMessage);
  //   });
});
