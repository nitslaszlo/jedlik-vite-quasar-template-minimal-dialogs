<script setup lang="ts">
  import { useUsersStore } from "../store/usersStore";

  const usersStore = useUsersStore();

  const anyLoggedUser = computed(() => (usersStore.getLoggedUser ? true : false));

  interface IReactiveData {
    showDialog: boolean;
    email: string;
    password: string;
    check: [number, boolean, string][];
  }

  const r = reactive<IReactiveData>({
    showDialog: false,
    email: "student001@jedlik.eu",
    password: "student001",
    check: [
      [0, false, "Lenght >= 8"],
      [1, false, "Upper case char"],
      [2, false, "Lower case char"],
      [3, false, "Special char"],
      [4, false, "Number"],
    ],
  });

  function LogInOut() {
    if (!anyLoggedUser.value) {
      usersStore.loginUser({
        email: r.email,
        password: r.password,
      });
    } else {
      usersStore.logOut();
    }
  }

  function isValidEmail(email: string): boolean | string {
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(email) || "Invalid email";
  }

  function isValidPassword(pass: string): boolean | string {
    if (pass.length == 0) return "Please fill in!";
    r.check[0][1] = pass.length >= 8;
    r.check[1][1] = /[A-Z]/.test(pass);
    r.check[2][1] = /[a-z]/.test(pass);
    r.check[3][1] = /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(pass);
    r.check[4][1] = /\d/.test(pass);

    if (r.check[0][1] && r.check[1][1] && r.check[2][1] && r.check[3][1] && r.check[4][1])
      return true;
    else return false;
  }

  isValidPassword(r.password);
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

    <q-dialog v-model="r.showDialog" persistent transition-hide="rotate" transition-show="rotate">
      <q-card class="q-pa-xs" style="min-width: 250px">
        <q-card-section>
          <div class="text-h6">Your e-mail address</div>
          <q-input
            v-model="r.email"
            :disable="anyLoggedUser"
            filled
            :rules="[(v) => (v != null && v != '') || 'Please fill in!', isValidEmail]"
            type="text"
          />
        </q-card-section>

        <q-card-section v-if="!anyLoggedUser">
          <div class="text-h6">Your password</div>
          <q-input v-model="r.password" filled :rules="[isValidPassword]" type="password" />
        </q-card-section>

        <q-card-section v-if="!anyLoggedUser" class="no-padding">
          <div class="column">
            <q-checkbox
              v-for="e in r.check"
              :key="e[0]"
              v-model="e[1]"
              checked-icon="star"
              :class="e[1] ? 'text-green' : 'text-red'"
              :color="e[1] ? 'green' : 'red'"
              disable
              keep-color
              :label="e[2]"
              unchecked-icon="star_border"
            />
          </div>
        </q-card-section>

        <q-card-actions align="center" class="text-primary">
          <q-btn
            class="q-mr-md"
            color="green"
            :label="anyLoggedUser ? 'Logout' : 'Login'"
            no-caps
            type="button"
            @click="LogInOut()"
          />
          <q-btn
            color="red"
            label="Close dialog"
            no-caps
            type="button"
            @click="r.showDialog = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped></style>
