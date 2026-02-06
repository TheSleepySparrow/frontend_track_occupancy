<template>
  <q-list bordered separator>
      <q-expansion-item
      expand-separator
      v-for="item in filteredItems"
      :key="item.id"
      header-class="text-weight-medium"
    >
      <template v-slot:header>
        <q-item-section>ID: {{ item.id }} | {{ item.mac }}</q-item-section>
        <q-item-section side>
          <div class="row q-gutter-xs no-wrap">
            <q-btn
              flat
              dense
              round
              size="sm"
              icon="edit"
              color="primary"
              :aria-label="$t('settingsPage.edit')"
              @click.stop="emit('edit', item)"
            >
              <q-tooltip>{{ $t('settingsPage.edit') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              round
              size="sm"
              icon="delete"
              color="negative"
              :aria-label="$t('settingsPage.delete')"
              @click.stop="emit('delete', item)"
            >
              <q-tooltip>{{ $t('settingsPage.delete') }}</q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </template>
      <q-card flat>
        <q-card-section class="q-pt-none">
          <div class="q-gutter-y-sm">
            <div>
              <span class="text-caption text-grey">{{ $t('editAuditory.cameraId') }}:</span>
              {{ item.id }}
            </div>
            <div>
              <span class="text-caption text-grey">{{ $t('editAuditory.cameraMac') }}:</span>
              {{ item.mac }}
            </div>
            <div>
              <span class="text-caption text-grey">{{ $t('settingsPage.cameraAttached') }}/{{ $t('settingsPage.cameraFree') }}:</span>
              {{ item.isAttached ? $t('settingsPage.cameraAttached') : $t('settingsPage.cameraFree') }}
            </div>
            <div v-if="item.auditorium_id">
              <span class="text-caption text-grey">auditorium_id:</span>
              {{ item.auditorium_id }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<script setup>
defineProps({
  filteredItems: {
    type: Array,
    required: true
  },
  locale: {
    type: String,
    default: 'ru-RU'
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>
