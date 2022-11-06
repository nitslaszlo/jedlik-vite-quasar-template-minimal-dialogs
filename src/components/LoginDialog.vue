<script setup lang="ts">
  import { useUsersStore } from "../store/usersStore";
  import { computed, reactive } from "vue";
  import { usePostsStore } from "../store/postsStore";
  import LoginHelper from "./LoginHelper";
  import ValidPassword from "./ValidPassword.vue";

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
  const postsStore = usePostsStore();

  const anyLoggedUser = computed(() => (usersStore.getLoggedUser ? true : false));

  interface IReactiveData {
    email: string;
    password: string;
    password_ok: string | boolean;
  }

  const r = reactive<IReactiveData>({
    email: props.email,
    password: props.password,
    password_ok: true,
  });

  function isValidEmail(email: string): boolean | string {
    return LoginHelper.IsValidEmail(email);
  }

  function LogInOut() {
    if (!anyLoggedUser.value) {
      usersStore.loginUser({
        email: r.email,
        password: r.password,
      });
    } else {
      usersStore.logOut();
      postsStore.posts = [];
    }
  }

  function dialogShow() {
    if (usersStore.loggedUser) {
      r.email = usersStore.loggedUser.email as string;
    } else {
      r.email = props.email;
    }
  }

  function isValidPassword(result: string | boolean): void {
    r.password_ok = result;
  }
</script>

<template>
  <q-dialog v-model="$props.showDialog" persistent transition-show="rotate" @show="dialogShow()">
    <q-card class="q-pa-xs" style="width: 100%">
      <q-form>
        <div class="row flex-center">
          <div class="col-xs-12 col-sm-6">
            <q-card-section>
              <q-input
                id="QInputEmail"
                v-model="r.email"
                data-test="QInputEmail"
                :disable="anyLoggedUser"
                filled
                label="E-mail address"
                :rules="[(v) => (v != null && v != '') || 'Please fill in!', isValidEmail]"
                type="text"
              />
            </q-card-section>

            <q-card-section v-if="!anyLoggedUser">
              <q-input
                id="qinputPassword"
                v-model="r.password"
                autocomplete="on"
                data-test="QInputPassword"
                filled
                label="Password"
                :rules="[() => r.password_ok]"
                type="password"
              />
            </q-card-section>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-card-section v-if="!anyLoggedUser" class="no-padding">
              <div class="column">
                <ValidPassword :password="r.password" @password_changed="isValidPassword" />
              </div>
            </q-card-section>
          </div>
        </div>

        <q-card-actions align="center" class="text-primary">
          <q-btn
            class="q-mr-md"
            color="green"
            data-test="btnLoginLogout"
            :label="anyLoggedUser ? 'Logout' : 'Login'"
            no-caps
            type="button"
            @click="LogInOut()"
          />
          <q-btn
            color="red"
            data-test="btnClose"
            label="Close dialog"
            no-caps
            type="button"
            @click="emit('close-login-dialog')"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
