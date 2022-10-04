<script setup lang="ts">
  import { useUsersStore } from "../store/usersStore";

  const usersStore = useUsersStore();

  const anyLoggedUser = computed(() => (usersStore.getLoggedUser ? true : false));

  interface IMapData {
    isOk: boolean;
    label: string;
  }

  interface IReactiveData {
    showDialog: boolean;
    email: string;
    password: string;
    check: Map<string, IMapData>;
  }

  const r = reactive<IReactiveData>({
    showDialog: false,
    email: "student001@jedlik.eu",
    password: "student001",
    check: new Map(),
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
    r.check.set("length", { isOk: pass.length >= 8, label: "Length >= 8" });
    r.check.set("upper", { isOk: /[A-Z]/.test(pass), label: "Uppercase char(s)" });
    r.check.set("lower", { isOk: /[a-z]/.test(pass), label: "Lowercase char(s)" });
    r.check.set("special", {
      isOk: /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(pass),
      label: "Special char(s)",
    });
    r.check.set("number", { isOk: /\d/.test(pass), label: "Number(s)" });
    if (pass.length == 0) return "Please fill in!";
    if (
      r.check.get("length")?.isOk &&
      r.check.get("upper")?.isOk &&
      r.check.get("lower")?.isOk &&
      r.check.get("special")?.isOk &&
      r.check.get("number")?.isOk
    )
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

    <q-dialog v-model="r.showDialog" persistent transition-show="rotate">
      <q-card class="q-pa-xs" style="width: 100%">
        <div class="row flex-center">
          <div class="col-xs-12 col-sm-6">
            <q-card-section>
              <!-- <div class="text-h6">E-mail address</div> -->
              <q-input
                v-model="r.email"
                :disable="anyLoggedUser"
                filled
                label="E-mail address"
                :rules="[(v) => (v != null && v != '') || 'Please fill in!', isValidEmail]"
                type="text"
              />
            </q-card-section>

            <q-card-section v-if="!anyLoggedUser">
              <!-- <div class="text-h6">Password</div> -->
              <q-input
                v-model="r.password"
                filled
                label="Password"
                :rules="[isValidPassword]"
                type="password"
              />
            </q-card-section>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-card-section v-if="!anyLoggedUser" class="no-padding">
              <div class="column">
                <q-checkbox
                  v-for="e in r.check.entries()"
                  :key="e[0]"
                  v-model="e[1].isOk"
                  checked-icon="star"
                  :class="e[1].isOk ? 'text-green' : 'text-red'"
                  :color="e[1].isOk ? 'green' : 'red'"
                  disable
                  keep-color
                  :label="e[1].label"
                  unchecked-icon="star_border"
                />
              </div>
            </q-card-section>
          </div>
        </div>

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
