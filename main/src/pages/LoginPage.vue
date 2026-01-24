<template>
  <div class="full-width full-height bg-secondary column"
  style="min-height: 100vh;">
    <div class="row justify-end q-pa-md">
      <q-btn-dropdown
        push flat dense
        color="accent"
        icon="settings"
        padding="xs md"
        content-style="background-color: accent"
      >
        <TheSettingsList
          :languageName="$t('settings.language')"
          :themeName="$t('settings.theme')"
        />
      </q-btn-dropdown>
    </div>

    <div class="col row items-center justify-center q-pa-xl q-mx-xl">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
        <q-card class="q-pa-lg" bordered style="border-radius: 2rem;">
          <q-form @submit.prevent="handleLogin" class="q-gutter-md column">
            <div class="text-h4 text-center q-mb-md">
              {{ $t('auth.title') }}
            </div>

            <q-input
              v-model="username"
              :label="$t('auth.login')"
              outlined
              dense
              :rules="[val => !!val || $t('auth.loginRequired')]"
            />

            <q-input
              v-model="password"
              :label="$t('auth.password')"
              :type="isPasswordVisible ? 'text' : 'password'"
              outlined
              dense
              :rules="[val => !!val || $t('auth.passwordRequired')]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="isPasswordVisible = !isPasswordVisible"
                />
              </template>
            </q-input>

            <q-btn
              type="submit"
              :label="$t('auth.loginButton')"
              color="primary"
              class="full-width"
              unelevated
              rounded
              padding="xs md"
            />
          </q-form>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import TheSettingsList from 'src/components/TheSettingsList.vue'
import { useAuth } from 'src/stores/auth.store'
import authMock from 'src/config/auth.mock.js'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuth()
const $q = useQuasar()

const username = ref('')
const password = ref('')
const isPasswordVisible = ref(false)

function handleLogin() {
  if (username.value === authMock.username && password.value === authMock.password) {
    authStore.login(authMock.token, username.value)
    router.push({ name: 'viewMenu' })
  } else {
    $q.notify({
      message: t('errorOccured.401'),
      color: 'negative',
      position: 'top'
    })
  }
}
</script>

