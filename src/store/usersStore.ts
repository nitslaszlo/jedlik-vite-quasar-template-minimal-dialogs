import $axios from "./axios.instance";
import { defineStore } from "pinia";
import { Notify, Loading } from "quasar";

Notify.setDefaults({
  position: "bottom",
  textColor: "white",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
});

interface IAddress {
  _id: string;
  city: string;
  country: string;
  street: string;
}

interface IUser {
  _id?: string;
  email?: string;
  email_verified?: string;
  name?: string;
  password?: string;
  picture?: string;
  address?: null | IAddress;
}

interface IState {
  loggedUser: null | IUser;
}
export const useUsersStore = defineStore({
  id: "usersStore",
  state: (): IState => ({
    loggedUser: null,
  }),
  getters: {
    getLoggedUser(): null | IUser {
      return this.loggedUser;
    },
  },
  actions: {
    async loginRegisterWithGoogle(accessToken: string) {
      Loading.show();
      $axios
        .post("auth/google", { atoken: accessToken })
        .then((res) => {
          this.loggedUser = res.data;
          Loading.hide();
          Notify.create({
            message: `${res.data.name} with ${res.data.email} e-mail is logged in`,
            color: "positive",
          });
        })
        .catch(() => {
          this.loggedUser = null;
          Loading.hide();
          Notify.create({ message: "Error on Authentication", color: "negative" });
        });
    },
    async loginUser(params: IUser): Promise<void> {
      Loading.show();
      $axios
        .post("auth/login", {
          email: params.email,
          password: params.password,
        })
        .then((res) => {
          this.loggedUser = res.data;
          Loading.hide();
          Notify.create({
            message: `${res.data.name} with ${res.data.email} e-mail is logged in`,
            color: "positive",
          });
        })
        .catch(() => {
          this.loggedUser = null;
          Loading.hide();
          Notify.create({ message: "Error on Authentication", color: "negative" });
        });
    },
    async autoLogin(): Promise<void> {
      Loading.show();
      $axios
        .post("auth/autologin")
        .then((res) => {
          if (res.status == 404) {
            this.loggedUser = null;
          } else {
            this.loggedUser = res.data;
          }
          Loading.hide();
        })
        .catch((error) => {
          this.loggedUser = null;
          Loading.hide();
          Notify.create({
            message: `Auto login not aviable! ${error.response.data.message}`,
            color: "negative",
          });
        });
    },
    async logOut(withNotify = true): Promise<void> {
      Loading.show();
      $axios
        .post("auth/logout")
        .then(() => {
          this.loggedUser = null;
          Loading.hide();
          if (withNotify) {
            Notify.create({
              message: "Successful logout",
              color: "positive",
            });
          }
        })
        .catch(() => {
          this.loggedUser = null;
          Loading.hide();
          Notify.create({ message: "Error on log out", color: "negative" });
        });
    },
  },
});
