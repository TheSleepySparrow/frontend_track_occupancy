<template>
  <q-card
    class="q-pa-md"
    style="min-width: 40vw"
  >
    <q-card-section>
      <div
        :class="
          $q.dark.isActive ? 'text-h4 text-center text-white' : 'text-h4 text-center text-primary'
        "
      >
        {{ $t('infoDialog.title') }}</div
      >
    </q-card-section>

    <q-card-section class="q-pt-none q-gutter-y-md">
      <div :class="headerClass">{{ $t('infoDialog.aboutUs') }}</div>
      <div>{{ $t('infoDialog.description') }}</div>
      <div>{{ $t('infoDialog.description2') }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none q-gutter-y-md">
      <div :class="headerClass">{{ $t('infoDialog.tech') }}</div>
      <i18n-t
        keypath="infoDialog.techSupport"
        tag="p"
        scope="global"
      >
        <template #email
          ><strong>{{ techSupportInfo.email }}</strong></template
        >
        <template #telegram
          ><strong>{{ techSupportInfo.telegram }}</strong></template
        >
      </i18n-t>
    </q-card-section>

    <q-card-section class="q-pt-none q-gutter-y-md">
      <div :class="headerClass">{{ $t('infoDialog.documentation') }}</div>
      <div>
        {{ $t('infoDialog.documentationDescription') }}
        <a
          :href="techSupportInfo.mainWiki"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('infoDialog.link') }} </a
        >.
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none q-gutter-y-md">
      <div :class="headerClass">{{ $t('infoDialog.feedback') }}</div>
      <div>
        {{ $t('infoDialog.feedbackForm') }}
        <a
          :href="techSupportInfo.feedback"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('infoDialog.link') }} </a
        >.
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div>{{ $t('infoDialog.afterThought') }}</div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        flat
        :label="$t('popUps.close')"
        color="primary"
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import techSupportInfo from 'src/config/techSupportInfo.js'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()
const headerClass = computed(() =>
  $q.dark.isActive ? 'text-h6 text-white' : 'text-h6 text-secondary',
)
</script>
