<script setup lang="ts">
  import { useUsersStore } from "../store/usersStore";
  import LoginHelper from "./LoginHelper";
  import { computed, reactive } from "vue";

  interface IProps {
    email?: string;
    password?: string;
    showDialog?: boolean;
  }
  const props = withDefaults(defineProps<IProps>(), {
    email: "student001@jedlik.eu", // set value of optional prop
    password: "student001",
    showDialog: true,
  });

  const emit = defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (e: "close-login-dialog"): void;
  }>();

  const usersStore = useUsersStore();

  const anyLoggedUser = computed(() => (usersStore.getLoggedUser ? true : false));

  interface IMapData {
    isOk: boolean;
    label: string;
  }

  interface IReactiveData {
    email: string;
    password: string;
    check: Map<string, IMapData>;
  }

  const r = reactive<IReactiveData>({
    email: props.email,
    password: props.password,
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
    return LoginHelper.IsValidEmail(email);
  }

  // defineExpose({ isValidEmail });

  function isValidPassword(pass: string): boolean | string {
    r.check.set("length", { isOk: LoginHelper.IsLengthOk(pass), label: "Length >= 8" });
    r.check.set("upper", {
      isOk: LoginHelper.IsAnyUppercaseChar(pass),
      label: "Uppercase char(s)",
    });
    r.check.set("lower", {
      isOk: LoginHelper.IsAnyLowercaseChar(pass),
      label: "Lowercase char(s)",
    });
    r.check.set("special", {
      isOk: LoginHelper.IsAnySpecialChar(pass),
      label: "Special char(s)",
    });
    r.check.set("number", { isOk: LoginHelper.IsAnyNumber(pass), label: "Number(s)" });
    if (pass.length == 0) return "Please fill in!";
    return (r.check.get("length")?.isOk &&
      r.check.get("upper")?.isOk &&
      r.check.get("lower")?.isOk &&
      r.check.get("special")?.isOk &&
      r.check.get("number")?.isOk) as boolean;
  }
  isValidPassword(r.password);
</script>

<template>
  <h5>Login {{ anyLoggedUser }} próba</h5>
  <q-dialog v-model="$props.showDialog" persistent transition-show="rotate">
    <q-card class="q-pa-xs" style="width: 100%">
      <div class="row flex-center">
        <div class="col-xs-12 col-sm-6">
          <q-card-section>
            <h5>Login próba</h5>
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
          @click="emit('close-login-dialog')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
