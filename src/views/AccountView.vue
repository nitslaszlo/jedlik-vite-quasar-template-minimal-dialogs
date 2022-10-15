<script setup lang="ts">
  import { computed, reactive } from "vue";
  import { useUsersStore } from "../store/usersStore";
  import LoginDialog from "src/components/LoginDialog.vue";
  import { googleTokenLogin, CallbackTypes, googleLogout } from "vue3-google-login";

  const usersStore = useUsersStore();

  const anyLoggedUser = computed(() => (usersStore.getLoggedUser ? true : false));

  interface IReactiveData {
    showDialog: boolean;
  }

  const r = reactive<IReactiveData>({
    showDialog: false,
  });

  function closeLoginDialog() {
    r.showDialog = false;
  }

  function loginRegisterGoogle() {
    if (anyLoggedUser.value) {
      googleLogout();
      usersStore.logOut();
    } else {
      googleTokenLogin().then((response: CallbackTypes.TokenPopupResponse) => {
        usersStore.loginRegisterWithGoogle(response.access_token);
      });
    }
  }
</script>

<template>
  <q-page>
    <div class="row window-height flex-center justify-evenly">
      <q-btn
        v-if="!r.showDialog"
        class="shadow-10"
        color="info"
        data-test="btnShow"
        :label="anyLoggedUser ? 'Show logout dialog' : 'Show login dialog'"
        no-caps
        @click="r.showDialog = true"
      />
      <q-btn
        class="shadow-10"
        color="blue"
        data-test="btnGoogle"
        :label="anyLoggedUser ? 'Logout from Google' : 'Login/Register with Google'"
        no-caps
        @click="loginRegisterGoogle()"
      />
      <LoginDialog
        email="student001@jedlik.eu"
        password="student001"
        :show-dialog="r.showDialog"
        @close-login-dialog="closeLoginDialog()"
      />
    </div>
  </q-page>
</template>

<style scoped></style>
