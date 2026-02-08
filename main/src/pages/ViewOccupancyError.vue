<template>
  <q-page>
    <div
      class="q-pa-md column items-center justify-center"
      style="padding: 30% 10%"
    >
      <div class="col-auto">
        <p class="text-h6 text-primary">
          {{ $t('occupationPage.error', { address: techSupportInfo.email }) }}
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import techSupportInfo from 'src/config/techSupportInfo'
</script>
