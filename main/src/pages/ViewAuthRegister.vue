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
            @submit.prevent="handleRegister"
            class="column q-gutter-md"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
          >
            <div class="text-h4 text-center q-py-sm">
              {{ $t('auth.registerTitle') }}
            </div>

            <div>
              <q-input
                v-model="email"
                :label="$t('auth.email')"
                outlined
                dense
                type="email"
                :rules="[(val) => !!val || $t('auth.emailRequired')]"
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
              :label="$t('auth.registerButton')"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                {{ $t('auth.loading') }}
              </template>
            </q-btn>

            <q-separator />

            <q-btn
              flat
              :label="$t('auth.back')"
              color="primary"
              @click="$router.push({ name: 'login' })"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="successDialogOpen">
      <q-card
        class="q-pa-md"
        style="min-width: 300px"
      >
        <q-card-section>
          <div class="text-h6">{{ $t('auth.registerSuccess') }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('popUps.ok')"
            color="primary"
            @click="handleSuccessOk"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { postResponseWithoutAuth } from 'src/services/api'

const router = useRouter()
const { t } = useI18n()
const $q = useQuasar()

const email = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const successDialogOpen = ref(false)
const isLoading = ref(false)

async function handleRegister() {
  isLoading.value = true
  try {
    await postResponseWithoutAuth('/auth/register', {
      login: email.value,
      password: password.value,
    })
    successDialogOpen.value = true
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

function handleSuccessOk() {
  successDialogOpen.value = false
  router.push({ name: 'login' })
}
</script>
