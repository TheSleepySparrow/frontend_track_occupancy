<template>
  <q-page class="q-pa-md bg-secondary">
    <div class="column justify-center q-py-xl q-px-xs">
      <q-card
        flat
        bordered
        class="col self-center q-py-xl q-px-md"
        style="border-radius: 2rem; min-width: 30vw"
      >
        <q-card-section>
          <q-form
            @submit.prevent="handleLogin"
            class="column q-gutter-md"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
          >
            <div class="text-h4 text-center q-py-sm">
              {{ $t('auth.title') }}
            </div>

            <div>
              <q-input
                v-model="username"
                :label="$t('auth.login')"
                outlined
                dense
                :rules="[(val) => !!val || $t('auth.loginRequired')]"
              />

              <q-input
                v-model="password"
                :label="$t('auth.password')"
                :type="isPasswordVisible ? 'text' : 'password'"
                outlined
                dense
                :rules="[(val) => !!val || $t('auth.passwordRequired')]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="isPasswordVisible = !isPasswordVisible"
                  />
                </template>
              </q-input>
            </div>

            <q-btn
              type="submit"
              color="primary"
              unelevated
              :loading="isLoading"
            >
              {{ $t('auth.loginButton') }}
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                {{ $t('auth.loading') }}
              </template>
            </q-btn>

            <q-btn
              outline
              disable
              :label="$t('auth.signWithKeycloak')"
              color="primary"
            />

            <!-- <q-separator />

            <q-btn
              flat
              :label="$t('auth.registration')"
              color="primary"
              @click="
                $router.push({
                  name: 'register',
                })
              "
            /> -->
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useAuth } from 'src/stores/auth.store'

const router = useRouter()
const route = useRoute()

const { t } = useI18n()
const authStore = useAuth()
const $q = useQuasar()

const username = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const isLoading = ref(false)

async function getToken() {
  isLoading.value = true
  try {
    await authStore.login(username.value, password.value)
    const redirectPath = route.query.redirect || authStore.role === 'student' ? '/occupancy/1' : '/'
    router.push(redirectPath)
  } catch (err) {
    const messageText = 'errorOccured.' + err.statusCode
    $q.notify({
      message: t(messageText) ? t(messageText) : t('errorOccured.else'),
      color: 'negative',
      position: 'top',
    })
    password.value = ''
  } finally {
    isLoading.value = false
  }
}

function handleLogin() {
  if (!username.value && !password.value) {
    return
  }
  getToken()
}
</script>
