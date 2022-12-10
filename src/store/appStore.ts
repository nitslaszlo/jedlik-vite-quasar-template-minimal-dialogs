import { defineStore } from "pinia";

interface IState {
  showLoginDialog: boolean;
}

export const useAppStore = defineStore({
  id: "appStore",
  state: (): IState => ({
    showLoginDialog: false,
  }),
});
