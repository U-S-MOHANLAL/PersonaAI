```vue
<template>
  <el-dialog
    v-model="visible"
    width="420px"
    align-center
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="delete-content">

      <!-- Warning icon -->
      <div class="warning-icon">
        <el-icon>
          <DeleteFilled />
        </el-icon>
      </div>

      <!-- Title -->
      <h2>
        Delete character?
      </h2>

      <!-- Message -->
      <p>
        Are you sure you want to delete
        <strong>{{ characterName }}</strong>?
      </p>

      <span class="warning-text">
        This will permanently delete the character and its chat history.
        This action cannot be undone.
      </span>

    </div>

    <template #footer>
      <div class="dialog-footer">

        <el-button
          @click="handleCancel"
        >
          Cancel
        </el-button>

        <el-button
          type="danger"
          :loading="loading"
          @click="handleConfirm"
        >
          Delete character
        </el-button>

      </div>
    </template>
  </el-dialog>
</template>


<script setup>

import { computed } from "vue";
import { DeleteFilled } from "@element-plus/icons-vue";


const props = defineProps({

  modelValue: {
    type: Boolean,
    default: false,
  },

  characterName: {
    type: String,
    default: "this character",
  },

  loading: {
    type: Boolean,
    default: false,
  },

});


const emit = defineEmits([
  "update:modelValue",
  "confirm",
  "cancel",
]);


const visible = computed({

  get() {
    return props.modelValue;
  },

  set(value) {
    emit("update:modelValue", value);
  },

});


const handleCancel = () => {

  visible.value = false;

  emit("cancel");

};


const handleConfirm = () => {

  emit("confirm");

};

</script>


<style scoped>

.delete-content {
  display: flex;
  flex-direction: column;

  align-items: center;

  text-align: center;

  padding: 8px 15px 5px;
}


/* Warning icon */

.warning-icon {
  width: 54px;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 15px;

  border-radius: 50%;

  background: #fff1f2;

  color: #ef4444;
}

.warning-icon .el-icon {
  font-size: 25px;
}


/* Title */

.delete-content h2 {
  margin: 0;

  font-size: 20px;
  font-weight: 700;

  color: #252936;
}


/* Message */

.delete-content p {
  margin: 10px 0 5px;

  font-size: 14px;
  line-height: 1.6;

  color: #687182;
}

.delete-content strong {
  color: #303643;
  font-weight: 700;
}


/* Warning */

.warning-text {
  max-width: 330px;

  font-size: 11px;
  line-height: 1.5;

  color: #a0a6b2;
}


/* Footer */

.dialog-footer {
  display: flex;
  justify-content: center;

  gap: 8px;

  padding-top: 5px;
}

.dialog-footer .el-button {
  min-width: 110px;
}

</style>
```
