```vue
<template>
  <el-dialog
    v-model="visible"
    width="420px"
    align-center
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="clear-chat-dialog"
  >

    <div class="confirm-content">

      <!-- Icon -->
      <div class="warning-icon">
        <el-icon>
          <Delete />
        </el-icon>
      </div>

      <!-- Title -->
      <h2>
        Clear chat?
      </h2>

      <!-- Message -->
      <p>
        Are you sure you want to clear
        <strong>{{ characterName }}</strong>
        chat?
      </p>

      <span class="warning-text">
        This action cannot be undone.
      </span>

    </div>


    <!-- Footer -->
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
          Confirm
        </el-button>

      </div>

    </template>

  </el-dialog>
</template>


<script setup>

import { Delete } from "@element-plus/icons-vue";


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({

  modelValue: {
    type: Boolean,
    default: false,
  },

  characterName: {
    type: String,
    default: "this",
  },

  loading: {
    type: Boolean,
    default: false,
  },

});


/* =====================================================
   EMITS
===================================================== */

const emit = defineEmits([
  "update:modelValue",
  "confirm",
  "cancel",
]);


/* =====================================================
   V-MODEL
===================================================== */

const visible = computed({

  get() {
    return props.modelValue;
  },

  set(value) {
    emit("update:modelValue", value);
  },

});


/* =====================================================
   ACTIONS
===================================================== */

const handleCancel = () => {

  visible.value = false;

  emit("cancel");

};


const handleConfirm = () => {

  emit("confirm");

};

</script>


<style scoped>

.confirm-content {
  display: flex;
  flex-direction: column;

  align-items: center;

  text-align: center;

  padding: 8px 15px 5px;
}


/* =====================================================
   ICON
===================================================== */

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


/* =====================================================
   TITLE
===================================================== */

.confirm-content h2 {
  margin: 0;

  font-size: 20px;
  font-weight: 700;

  color: #252936;
}


/* =====================================================
   MESSAGE
===================================================== */

.confirm-content p {
  margin: 10px 0 4px;

  font-size: 14px;
  line-height: 1.6;

  color: #687182;
}

.confirm-content strong {
  color: #303643;
  font-weight: 700;
}


/* =====================================================
   WARNING
===================================================== */

.warning-text {
  font-size: 11px;

  color: #a0a6b2;
}


/* =====================================================
   FOOTER
===================================================== */

.dialog-footer {
  display: flex;

  justify-content: center;

  gap: 8px;

  padding-top: 5px;
}

.dialog-footer .el-button {
  min-width: 100px;
}

</style>
```
