<script setup lang="ts">
  import { useUsersStore } from "../store/usersStore";

  const usersStore = useUsersStore();

  const anyLoggedUser = computed(() => (usersStore.getLoggedUser ? true : false));

  interface IReactiveData {
    showDialog: boolean;
    email: string;
    password: string;
    length: boolean;
    upper: boolean;
    lower: boolean;
    special: boolean;
    number: boolean;
  }

  const r = reactive<IReactiveData>({
    showDialog: false,
    email: "student001@jedlik.eu",
    password: "student001",
    length: false,
    upper: false,
    lower: false,
    special: false,
    number: false,
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
    r.upper = /[A-Z]/.test(pass);
    r.lower = /[a-z]/.test(pass);
    r.number = /\d/.test(pass);
    r.special = /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(pass);
    r.length = pass.length >= 8;
    if (pass.length == 0) return "Please fill in!";
    if (r.upper && r.lower && r.number && r.special && r.length) return true;
    else return false;
  }

  isValidPassword(r.password);
</script>

<template>
  <q-page>
    <div class="row window-height flex-center">
      <q-btn
        v-if="!r.showDialog"
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
              v-model="r.length"
              checked-icon="star"
              :class="r.length ? 'text-green' : 'text-red'"
              :color="r.length ? 'green' : 'red'"
              disable
              keep-color
              label="Lenght >= 8"
              unchecked-icon="star_border"
            />
            <q-checkbox
              v-model="r.upper"
              checked-icon="star"
              :class="r.upper ? 'text-green' : 'text-red'"
              :color="r.upper ? 'green' : 'red'"
              disable
              keep-color
              label="Upper case char"
              unchecked-icon="star_border"
            />
            <q-checkbox
              v-model="r.lower"
              checked-icon="star"
              :class="r.lower ? 'text-green' : 'text-red'"
              :color="r.lower ? 'green' : 'red'"
              disable
              keep-color
              label="Lower case char"
              unchecked-icon="star_border"
            />
            <q-checkbox
              v-model="r.special"
              checked-icon="star"
              :class="r.special ? 'text-green' : 'text-red'"
              :color="r.special ? 'green' : 'red'"
              disable
              keep-color
              label="Special char"
              unchecked-icon="star_border"
            />
            <q-checkbox
              v-model="r.number"
              checked-icon="star"
              :class="r.number ? 'text-green' : 'text-red'"
              :color="r.number ? 'green' : 'red'"
              disable
              keep-color
              label="Number"
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
