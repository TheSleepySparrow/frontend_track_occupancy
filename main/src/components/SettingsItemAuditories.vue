<template>
  <div>
    <q-btn
      v-if="chosenBuildingId != null"
      :label="$t('settingsPage.add')"
      color="primary"
      class="q-mb-md"
      @click="showCreateDialog = true"
    />
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
                @click.stop="openEdit(item)"
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
                @click.stop="openDelete(item)"
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

    <CreateAuditoryDialog
      v-model="showCreateDialog"
      :city-id="chosenCityId"
      :building-id="chosenBuildingId"
      @created="onAuditoryCreated"
    />
    <EditAuditoryDialog
      v-if="itemToEdit"
      v-model="showEditDialog"
      :item="itemToEdit"
      :city-id="chosenCityId"
      :building-id="chosenBuildingId"
      @save="onAuditorySaved"
    />
    <q-dialog
      v-model="showDeleteDialog"
      persistent
    >
      <q-card style="min-width: 320px">
        <q-card-section>
          {{ $t('settingsPage.deleteAuditoryConfirm', { name: deleteConfirmName }) }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('popUps.cancel')"
            color="grey"
            @click="showDeleteDialog = false"
          />
          <q-btn
            flat
            :label="$t('settingsPage.confirm')"
            color="negative"
            :loading="deleteInProgress"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import CreateAuditoryDialog from 'src/components/CreateAuditoryDialog.vue'
import EditAuditoryDialog from 'src/components/EditAuditoryDialog.vue'
import { useDeleteAuditory } from 'src/composables/useGetAuditoriesInfo.js'

const props = defineProps({
  filteredItems: {
    type: Array,
    required: true,
  },
  locale: {
    type: String,
    default: 'ru-RU',
  },
  chosenCityId: {
    type: Number,
    default: null,
  },
  chosenBuildingId: {
    type: Number,
    default: null,
  },
  refetchAuditories: {
    type: Function,
    default: null,
  },
})

const { t } = useI18n()
const $q = useQuasar()
const { deleteAuditory } = useDeleteAuditory()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const itemToEdit = ref(null)
const itemToDelete = ref(null)
const deleteInProgress = ref(false)

const deleteConfirmName = computed(() => {
  if (!itemToDelete.value) return ''
  const item = itemToDelete.value
  return item[props.locale]?.title || item['ru-RU']?.title || item['en-US']?.title || item.id
})

function openEdit(item) {
  itemToEdit.value = item
  showEditDialog.value = true
}

function openDelete(item) {
  itemToDelete.value = item
  showDeleteDialog.value = true
}

function onAuditoryCreated() {
  showCreateDialog.value = false
  if (props.refetchAuditories) props.refetchAuditories()
}

function onAuditorySaved() {
  showEditDialog.value = false
  itemToEdit.value = null
  if (props.refetchAuditories) props.refetchAuditories()
}

async function confirmDelete() {
  if (!itemToDelete.value || props.chosenCityId === null || props.chosenBuildingId === null) return
  deleteInProgress.value = true
  try {
    await deleteAuditory(props.chosenCityId, props.chosenBuildingId, itemToDelete.value.id)
    showDeleteDialog.value = false
    itemToDelete.value = null
    if (props.refetchAuditories) props.refetchAuditories()
    $q.notify({
      message: t('settingsPage.auditoryDeleted'),
      color: 'positive',
      icon: 'check',
    })
  } catch (err) {
    $q.notify({
      message: err?.message || t('settingsPage.deleteError'),
      color: 'negative',
      icon: 'error',
    })
  } finally {
    deleteInProgress.value = false
  }
}
</script>
