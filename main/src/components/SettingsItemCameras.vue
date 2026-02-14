<template>
  <div class="row q-col-gutter-lg">
    <div class="col-12 col-md-6">
      <div class="text-h6 q-mb-md">
        {{ $t('settingsPage.attachedCameras') }}
      </div>
      <q-list
        bordered
        separator
      >
        <q-expansion-item
          v-for="item in attachedItems"
          :key="item.id"
          expand-separator
          header-class="text-weight-medium"
        >
          <template v-slot:header>
            <q-item-section>ID: {{ item.id }} | {{ item.mac }}</q-item-section>
            <q-item-section side>
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
                <div v-if="item.auditorium_id">
                  <span class="text-caption text-grey">auditorium_id:</span>
                  {{ item.auditorium_id }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
      <div
        v-if="attachedItems.length === 0"
        class="text-grey text-center q-pa-lg"
      >
        {{ $t('settingsPage.noItems') }}
      </div>
    </div>

    <div class="col-12 col-md-6">
      <div class="text-h6 q-mb-md">
        {{ $t('settingsPage.freeCameras') }}
      </div>
      <q-btn
        :label="$t('settingsPage.addCameraButton')"
        color="primary"
        class="q-mb-md"
        @click="showCreateCameraDialog = true"
      />
      <q-list
        bordered
        separator
      >
        <q-expansion-item
          v-for="item in freeItems"
          :key="item.id"
          expand-separator
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
                  <span class="text-caption text-grey">{{ $t('editAuditory.cameraId') }}:</span>
                  {{ item.id }}
                </div>
                <div>
                  <span class="text-caption text-grey">{{ $t('editAuditory.cameraMac') }}:</span>
                  {{ item.mac }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
      <div
        v-if="freeItems.length === 0"
        class="text-grey text-center q-pa-lg"
      >
        {{ $t('settingsPage.noItems') }}
      </div>
    </div>
  </div>

  <CameraDialog
    v-model="showCreateCameraDialog"
    mode="create"
    @created="onCameraCreated"
  />
  <CameraDialog
    v-model="showEditCameraDialog"
    mode="edit"
    :camera="cameraToEdit"
    @saved="onCameraSaved"
  />

  <q-dialog
    v-model="showDeleteCameraDialog"
    persistent
  >
    <q-card style="min-width: 320px">
      <q-card-section>
        {{ $t('settingsPage.deleteCameraConfirm', { mac: cameraToDelete?.mac || '' }) }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('popUps.cancel')"
          color="grey"
          @click="showDeleteCameraDialog = false"
        />
        <q-btn
          flat
          :label="$t('popUps.yes')"
          color="negative"
          :loading="deleteInProgress"
          @click="confirmDeleteCamera"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useDeleteCamera } from 'src/composables/useGetCamerasInfo.js'
import CameraDialog from 'src/components/CameraDialog.vue'

defineProps({
  attachedItems: {
    type: Array,
    default: () => [],
  },
  freeItems: {
    type: Array,
    default: () => [],
  },
  locale: {
    type: String,
    default: 'ru-RU',
  },
})

const emit = defineEmits(['created', 'saved', 'deleted'])

const { t } = useI18n()
const $q = useQuasar()
const { deleteCamera } = useDeleteCamera()

const showCreateCameraDialog = ref(false)
const showEditCameraDialog = ref(false)
const showDeleteCameraDialog = ref(false)
const cameraToEdit = ref(null)
const cameraToDelete = ref(null)
const deleteInProgress = ref(false)

function openEdit(item) {
  cameraToEdit.value = item
  showEditCameraDialog.value = true
}

function openDelete(item) {
  cameraToDelete.value = item
  showDeleteCameraDialog.value = true
}

function onCameraCreated() {
  showCreateCameraDialog.value = false
  emit('created')
}

function onCameraSaved() {
  showEditCameraDialog.value = false
  cameraToEdit.value = null
  emit('saved')
}

async function confirmDeleteCamera() {
  if (!cameraToDelete.value?.id) return
  deleteInProgress.value = true
  try {
    await deleteCamera(cameraToDelete.value.id)
    showDeleteCameraDialog.value = false
    cameraToDelete.value = null
    emit('deleted')
    $q.notify({
      message: t('settingsPage.cameraDeleted'),
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
