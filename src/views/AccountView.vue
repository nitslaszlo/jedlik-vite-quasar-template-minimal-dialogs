<script setup lang="ts">
  import { computed, reactive } from "vue";
  import { useUsersStore } from "../store/usersStore";
  import LoginDialog from "src/components/LoginDialog.vue";

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
</script>

<template>
  <q-page>
    <div class="row window-height flex-center">
      <q-btn
        v-if="!r.showDialog"
        class="shadow-10"
        color="info"
        :label="anyLoggedUser ? 'Show logout dialog' : 'Show login dialog'"
        no-caps
        @click="r.showDialog = true"
      />
    </div>
    <LoginDialog
      email="student001@jedlik.eu"
      password="student001"
      :show-dialog="r.showDialog"
      @close-login-dialog="closeLoginDialog()"
    />
  </q-page>
</template>

<style scoped></style>
