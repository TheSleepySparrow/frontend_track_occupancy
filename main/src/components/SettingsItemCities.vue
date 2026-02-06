<template>
  <q-expansion-item
    expand-separator
    header-class="text-weight-medium"
  >
    <template v-slot:header>
      <q-item-section>{{ itemTitle }}</q-item-section>
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
            <span class="text-caption text-grey">ID:</span>
            {{ item.id }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  locale: {
    type: String,
    default: 'ru-RU'
  }
})

const emit = defineEmits(['edit', 'delete'])

const itemTitle = computed(() => {
  if (!props.item) return ''
  return props.item[`name_${props.locale}`] || props.item['name_ru-RU'] || props.item['name_en-US'] || ''
})
</script>
