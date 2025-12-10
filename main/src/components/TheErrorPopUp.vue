<template>
  <q-dialog v-model="dialogOpen">
    <q-card style="min-width: 50vw">
      <q-card-section>
        <div class="text-h6">{{ $t('errorOccured.name') }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        Error text: {{ props.err?.message || 'Unknown error' }}
      </q-card-section>
      <q-card-section class="q-pt-none">
        {{ $t('errorOccured.meaning') }}
        {{ $t(errorMessageKey) }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('popUps.ok')"
          color="primary"
          @click="errorPageOpen"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps(['err', 'errorPage', 'routeParams'])
const dialogOpen = ref(false)
const router = useRouter()
const { te } = useI18n()

const errorMessageKey = computed(() => {
  if (!props.err?.statusCode) {
    return 'errorOccured.else'
  }
  const key = 'errorOccured.' + props.err.statusCode
  return te(key) ? key : 'errorOccured.else'
})

const errorPageOpen = () => {
  dialogOpen.value = false
  router.push({ name: props.errorPage, params: props.routeParams })
}

watch(() => props.err, (newErr) =>
  {
    if (newErr != null) {
      dialogOpen.value = true
    }
  }, { immediate: true }
)
</script>