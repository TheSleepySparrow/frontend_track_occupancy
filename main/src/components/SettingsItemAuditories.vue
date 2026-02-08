<template>
  <q-list
    bordered
    separator
  >
    <q-expansion-item
      v-for="item in filteredItems"
      :key="item.id"
      expand-separator
      header-class="text-weight-medium"
    >
      <template v-slot:header>
        <q-item-section>{{
          item[locale]?.title || item['ru-RU']?.title || item['en-US']?.title || ''
        }}</q-item-section>
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
            <div>
              <span class="text-caption text-grey">{{ $t('editAuditory.mainType') }}:</span>
              {{ item[locale]?.type }}
            </div>
            <div>
              <span class="text-caption text-grey">{{ $t('occupationPage.floor') }}:</span>
              {{ item.floor }}
            </div>
            <div>
              <span class="text-caption text-grey">{{ $t('editAuditory.capacity') }}:</span>
              {{ item.capacity }}
            </div>
            <div v-if="item.img_url">
              <span class="text-caption text-grey">{{ $t('editAuditory.imageUrl') }}:</span>
              {{ item.img_url }}
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
    required: true,
  },
  locale: {
    type: String,
    default: 'ru-RU',
  },
})

const emit = defineEmits(['edit', 'delete'])
</script>
