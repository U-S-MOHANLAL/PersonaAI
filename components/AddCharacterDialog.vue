<template>
  <el-dialog
    v-model="visible"
    title="Create a Character"
    width="520px"
    align-center
    :close-on-click-modal="false"
    destroy-on-close
    :class="[
      'character-dialog',
      { 'character-dialog--dark': theme === 'dark' },
    ]"
    @closed="handleClosed"
  >
    <div class="character-form">
      <!-- ================= PROFILE PICTURE ================= -->

      <div class="form-group">
        <label class="form-label">
          Profile Picture
          <span class="optional">(optional)</span>
        </label>

        <div
          class="image-upload"
          :class="{ 'has-image': form.profilePicture }"
          @click="openFilePicker"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <!-- Image preview -->
          <template v-if="form.profilePicture">
            <img
              :src="form.profilePicture"
              alt="Character profile"
              class="image-preview"
            />

            <div class="image-overlay">
              <span>Change picture</span>
            </div>
          </template>

          <!-- Empty state -->
          <template v-else>
            <div class="upload-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>

            <strong>Upload character picture</strong>

            <span> Click or drag an image here </span>

            <small> JPG, PNG or WEBP · Max 2 MB </small>
          </template>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          @change="handleFileChange"
        />

        <button
          v-if="form.profilePicture"
          type="button"
          class="remove-image"
          @click.stop="removeImage"
        >
          Remove picture
        </button>
      </div>

      <!-- ================= CHARACTER NAME ================= -->

      <div class="form-group">
        <label class="form-label">
          Character Name

          <el-tooltip
            placement="top"
            :effect="theme === 'dark' ? 'dark' : 'light'"
            :popper-class="
              theme === 'dark'
                ? 'character-tooltip--dark'
                : 'character-tooltip--light'
            "
            :show-after="150"
            width="300"
          >
            <template #content>
              <div class="tooltip-content">
                <strong>How the name is used</strong>

                <p>
                  The name helps the AI understand who it should portray during
                  the conversation.
                </p>

                <p>
                  For example:
                  <b>Issac</b>, <b>Uzumaki</b>, or
                  <b>Anime Girl</b>.
                </p>

                <p>
                  Choose a name that clearly describes the character you want to
                  interact with.
                </p>
              </div>
            </template>

            <el-icon class="info-icon">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </label>

        <el-input
          v-model="form.name"
          placeholder="e.g. Uzumaki"
          maxlength="80"
          show-word-limit
          clearable
        />

        <div class="field-hint">
          <span>Examples:</span>

          <button type="button" @click="setName('Issac')">
            Issac
          </button>

          <button type="button" @click="setName('Uzumaki')">
            Uzumaki
          </button>

          <button type="button" @click="setName('Anime Girl')">Anime Girl</button>
        </div>
      </div>

      <!-- ================= DESCRIPTION ================= -->

      <div class="form-group">
        <label class="form-label">
          Character Description
          <span class="optional">(optional)</span>

          <el-tooltip
            placement="top"
            :effect="theme === 'dark' ? 'dark' : 'light'"
            :popper-class="
              theme === 'dark'
                ? 'character-tooltip--dark'
                : 'character-tooltip--light'
            "
            :show-after="150"
            width="340"
          >
            <template #content>
              <div class="tooltip-content">
                <strong>Tell the AI who this character is</strong>

                <p>
                  Describe the character in your own words. You can mention
                  where they are from, who they are, their personality, speaking
                  style, background, or how you want them to behave.
                </p>

                <p>For example:</p>

                <ul>
                  <li>"This character is from a village."</li>
                  <li>
                    "He is a president who speaks confidently and
                    professionally."
                  </li>

                  <li>
                    "She is friendly, open-minded and loves discussing different
                    ideas."
                  </li>
                </ul>

                <p>
                  You can combine several details to help the AI understand the
                  character more deeply.
                </p>
              </div>
            </template>

            <el-icon class="info-icon">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </label>

        <el-input
          v-model="form.description"
          type="textarea"
          :rows="6"
          maxlength="1000"
          show-word-limit
          resize="none"
          placeholder="Tell us who this character is... e.g. 'This character is from New york. He is energetic, confident, friendly and never gives up.'"
        />

        <div class="description-tip">
          <div class="tip-icon">✦</div>

          <div>
            <strong>What can you describe?</strong>

            <p>
              You can say where the character is from, who they are, their
              personality, background, speaking style, interests, or how they
              should behave.
            </p>

            <div class="tip-examples">
              <span> "From village" </span>

              <span> "Class president" </span>

              <span> "Friendly & open-minded" </span>

              <span> "Quiet anime girl" </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= PREVIEW ================= -->

      <div
        v-if="form.name || form.description || form.profilePicture"
        class="character-preview"
      >
        <div class="preview-title">Preview</div>

        <div class="preview-card">
          <div class="preview-avatar">
            <img
              v-if="form.profilePicture"
              :src="form.profilePicture"
              :alt="form.name"
            />

            <span v-else>
              {{ form.name?.[0]?.toUpperCase() || "?" }}
            </span>
          </div>

          <div class="preview-info">
            <strong>
              {{ form.name || "Character Name" }}
            </strong>

            <p>
              {{ form.description || "Character description..." }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= FOOTER ================= -->

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false"> Cancel </el-button>

        <el-button
          type="primary"
          :loading="saving"
          :disabled="!isValid"
          @click="createCharacter"
        >
          Create Character
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { InfoFilled } from "@element-plus/icons-vue";
import { v4 as uuidv4 } from "uuid";

/* =====================================================
   PROPS / EMITS
===================================================== */

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  saving: {
    type: Boolean,
    default: false,
  },

  theme: {
    type: String,
    default: "dark",
  },
});

const emit = defineEmits(["update:modelValue", "create"]);

/* =====================================================
   DIALOG STATE
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
   FORM
===================================================== */

const emptyCharacter = () => ({
  name: "",
  description: "",
  profilePicture: "",
});

const form = reactive(emptyCharacter());

const fileInput = ref(null);

/* =====================================================
   VALIDATION
===================================================== */

const isValid = computed(() => {
  return (
    form.name.trim().length >= 2 &&
    // form.description.trim().length >= 10 &&
    !props.saving
  );
});

/* =====================================================
   FILE PICKER
===================================================== */

const openFilePicker = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  processImage(file);
};

/* =====================================================
   DRAG / DROP
===================================================== */

const handleDrop = (event) => {
  const file = event.dataTransfer?.files?.[0];

  if (!file) {
    return;
  }

  processImage(file);
};

/* =====================================================
   IMAGE PROCESSING
===================================================== */

const processImage = (file) => {
  /*
   * Validate file type.
   */

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    ElMessage.error("Please select a JPG, PNG or WEBP image.");

    return;
  }

  /*
   * Allow up to 2 MB original file.
   */

  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error("Image must be smaller than 2 MB.");

    return;
  }

  /*
   * Compress + convert to Base64.
   */

  compressImage(file)
    .then((base64) => {
      form.profilePicture = base64;
    })
    .catch((error) => {
      console.error("Image processing error:", error);

      ElMessage.error("Unable to process this image.");
    });
};

/* =====================================================
   IMAGE COMPRESSION
===================================================== */

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.onload = () => {
        const MAX_SIZE = 512;

        let width = image.width;
        let height = image.height;

        /*
         * Resize large images.
         */

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round(height * (MAX_SIZE / width));

            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round(width * (MAX_SIZE / height));

            height = MAX_SIZE;
          }
        }

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0, width, height);

        /*
         * JPEG gives considerably
         * smaller Base64 data than PNG.
         */

        const base64 = canvas.toDataURL("image/jpeg", 0.82);

        resolve(base64);
      };

      image.onerror = reject;

      image.src = event.target.result;
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

/* =====================================================
   REMOVE IMAGE
===================================================== */

const removeImage = () => {
  form.profilePicture = "";

  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

/* =====================================================
   NAME HELPERS
===================================================== */

const setName = (name) => {
  form.name = name;
};

/* =====================================================
   CREATE
===================================================== */

const createCharacter = () => {
  if (!isValid.value) {
    ElMessage.warning("Please enter a valid character name and description.");

    return;
  }

  /*
   * Emit a clean object to the parent.
   */

  emit("create", {
    id: uuidv4(),
    name: form.name.trim(),

    description: form.description.trim(),

    profilePicture: form.profilePicture || null,
    history: [],
  });
};

/* =====================================================
   RESET
===================================================== */

const handleClosed = () => {
  Object.assign(form, emptyCharacter());

  if (fileInput.value) {
    fileInput.value.value = "";
  }
};
</script>

<style scoped>
/* =====================================================
   FORM
===================================================== */

.character-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;

  gap: 6px;

  font-size: 13px;
  font-weight: 600;

  color: #303643;
}

.optional {
  font-size: 11px;
  font-weight: 400;

  color: #9aa1af;
}

.info-icon {
  color: #9aa2b1;

  font-size: 15px;

  cursor: help;
}

.info-icon:hover {
  color: #2563eb;
}

/* =====================================================
   IMAGE UPLOAD
===================================================== */

.image-upload {
  position: relative;

  width: 100%;
  height: 150px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 7px;

  border: 1.5px dashed #d6dae3;

  border-radius: 14px;

  background: #fafbfc;

  cursor: pointer;

  overflow: hidden;

  transition:
    border-color 0.2s,
    background 0.2s;
}

.image-upload:hover {
  border-color: #9eb3ef;

  background: #f7f9ff;
}

.image-upload.has-image {
  border-style: solid;

  padding: 0;
}

.upload-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #eef2ff;

  color: #4f6fd8;
}

.upload-icon svg {
  width: 22px;
  height: 22px;
}

.image-upload strong {
  font-size: 13px;

  color: #454d5d;
}

.image-upload > span {
  font-size: 11px;

  color: #9299a7;
}

.image-upload small {
  font-size: 10px;

  color: #adb3be;
}

/* Preview */

.image-preview {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}

.image-overlay {
  position: absolute;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.42);

  opacity: 0;

  transition: opacity 0.2s;

  color: white;

  font-size: 13px;
  font-weight: 600;
}

.image-upload:hover .image-overlay {
  opacity: 1;
}

.remove-image {
  align-self: flex-start;

  border: none;

  background: none;

  padding: 0;

  color: #ef4444;

  font-size: 11px;

  cursor: pointer;
}

/* =====================================================
   NAME EXAMPLES
===================================================== */

.field-hint {
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 5px;

  font-size: 10px;

  color: #9aa1ad;
}

.field-hint button {
  border: 1px solid #e3e6ec;

  background: #fafbfc;

  color: #6b7280;

  border-radius: 6px;

  padding: 3px 7px;

  font-size: 10px;

  cursor: pointer;

  transition: 0.15s;
}

.field-hint button:hover {
  background: #f1f4fa;

  color: #2563eb;

  border-color: #cbd5f5;
}

/* =====================================================
   DESCRIPTION
===================================================== */

.description-tip {
  display: flex;

  gap: 9px;

  padding: 10px 11px;

  border-radius: 9px;

  background: #f7f8fc;
}

.tip-icon {
  flex-shrink: 0;

  width: 22px;
  height: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 7px;

  background: #eaf0ff;

  color: #4d6fd5;

  font-size: 11px;
}

.description-tip strong {
  font-size: 11px;

  color: #596273;
}

.description-tip p {
  margin: 3px 0 0;

  font-size: 10px;

  line-height: 1.5;

  color: #8c94a3;
}

/* =====================================================
   PREVIEW
===================================================== */

.character-preview {
  padding-top: 2px;
}

.preview-title {
  margin-bottom: 8px;

  font-size: 11px;
  font-weight: 600;

  color: #858d9c;
}

.preview-card {
  display: flex;

  gap: 12px;

  padding: 12px;

  border: 1px solid #e5e8ee;

  border-radius: 12px;

  background: #fafbfc;
}

.preview-avatar {
  flex-shrink: 0;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 50%;

  background: #e4e8f0;

  color: #657086;

  font-weight: 700;
}

.preview-avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.preview-info {
  min-width: 0;
}

.preview-info strong {
  display: block;

  font-size: 13px;

  color: #343a48;
}

.preview-info p {
  display: -webkit-box;

  margin: 4px 0 0;

  overflow: hidden;

  color: #8a92a2;

  font-size: 11px;
  line-height: 1.5;

  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* =====================================================
   FOOTER
===================================================== */

.dialog-footer {
  display: flex;

  justify-content: flex-end;

  gap: 12px;
}

.dialog-footer :deep(.el-button) {
  min-width: 104px;
  height: 40px;
  margin-left: 0;
}

/* =====================================================
   TOOLTIP
===================================================== */

.tooltip-content {
  font-size: 11px;

  line-height: 1.55;
}

.tooltip-content strong {
  display: block;

  margin-bottom: 5px;

  font-size: 12px;
}

.tooltip-content p {
  margin: 5px 0;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {
  :deep(.el-dialog) {
    width: calc(100% - 24px) !important;

    margin-top: 6vh !important;
  }

  .image-upload {
    height: 150px;
  }
}

.tooltip-content {
  font-size: 11px;
  line-height: 1.55;
}

.tooltip-content strong {
  display: block;
  margin-bottom: 7px;
  font-size: 12px;
}

.tooltip-content p {
  margin: 6px 0;
}

.tooltip-content ul {
  margin: 7px 0;
  padding-left: 17px;
}

.tooltip-content li {
  margin-bottom: 5px;
}

:global(.el-popper.character-tooltip--dark) {
  border-color: rgba(255, 255, 255, 0.12);
  background: #151b2a;
  color: #cbd5e1;
}

:global(.el-popper.character-tooltip--dark .el-popper__arrow::before) {
  border-color: rgba(255, 255, 255, 0.12);
  background: #151b2a;
}

:global(.character-tooltip--dark .tooltip-content strong) {
  color: #f8fafc;
}

:global(.character-tooltip--dark .tooltip-content p),
:global(.character-tooltip--dark .tooltip-content li) {
  color: #cbd5e1;
}

:global(.el-popper.character-tooltip--light) {
  border-color: #d1d5db;
  background: #ffffff;
  color: #374151;
}

:global(.el-popper.character-tooltip--light .el-popper__arrow::before) {
  border-color: #d1d5db;
  background: #ffffff;
}

:global(.character-tooltip--light .tooltip-content strong) {
  color: #1f2937;
}

:global(.character-tooltip--light .tooltip-content p),
:global(.character-tooltip--light .tooltip-content li) {
  color: #4b5563;
}

.description-tip {
  display: flex;
  gap: 9px;

  padding: 11px 12px;

  border-radius: 10px;

  background: #f7f8fc;
}

.tip-icon {
  flex-shrink: 0;

  width: 23px;
  height: 23px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 7px;

  background: #eaf0ff;

  color: #4d6fd5;

  font-size: 11px;
}

.description-tip strong {
  font-size: 11px;
  color: #596273;
}

.description-tip p {
  margin: 4px 0 8px;

  font-size: 10px;
  line-height: 1.5;

  color: #8c94a3;
}

.tip-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tip-examples span {
  padding: 3px 7px;

  border-radius: 6px;

  background: #fff;

  border: 1px solid #e2e5eb;

  color: #737b89;

  font-size: 9px;
}

:global(.el-dialog.character-dialog--dark) {
  --el-dialog-bg-color: #0f1423;
  --el-dialog-text-color: #f1f5f9;

  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: #0f1423;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.48);
}

:global(.el-dialog.character-dialog--dark .el-dialog__header) {
  margin-right: 0;
  padding: 20px 24px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

:global(.el-dialog.character-dialog--dark .el-dialog__title) {
  color: #f1f5f9;
  font-size: 18px;
  font-weight: 700;
}

:global(.el-dialog.character-dialog--dark .el-dialog__headerbtn) {
  color: #97a2b8;
}

:global(.el-dialog.character-dialog--dark .el-dialog__headerbtn:hover) {
  color: #22d3ee;
}

:global(.el-dialog.character-dialog--dark .el-dialog__body) {
  padding: 16px 24px 20px;
  color: #f1f5f9;
}

:global(.el-dialog.character-dialog--dark .el-dialog__footer) {
  padding: 14px 24px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

:global(.el-dialog.character-dialog--dark .form-label) {
  color: #e2e8f0;
}

:global(.el-dialog.character-dialog--dark .optional),
:global(.el-dialog.character-dialog--dark .field-hint),
:global(.el-dialog.character-dialog--dark .preview-title) {
  color: #97a2b8;
}

:global(.el-dialog.character-dialog--dark .info-icon) {
  color: #97a2b8;
}

:global(.el-dialog.character-dialog--dark .info-icon:hover) {
  color: #22d3ee;
}

:global(.el-dialog.character-dialog--dark .image-upload) {
  border-color: rgba(167, 139, 250, 0.55);
  background: rgba(255, 255, 255, 0.025);
}

:global(.el-dialog.character-dialog--dark .image-upload:hover) {
  border-color: #22d3ee;
  background: rgba(124, 58, 237, 0.1);
}

:global(.el-dialog.character-dialog--dark .upload-icon),
:global(.el-dialog.character-dialog--dark .tip-icon) {
  background: rgba(124, 58, 237, 0.18);
  color: #a78bfa;
}

:global(.el-dialog.character-dialog--dark .image-upload strong),
:global(.el-dialog.character-dialog--dark .description-tip strong),
:global(.el-dialog.character-dialog--dark .preview-info strong) {
  color: #e2e8f0;
}

:global(.el-dialog.character-dialog--dark .image-upload > span),
:global(.el-dialog.character-dialog--dark .image-upload small),
:global(.el-dialog.character-dialog--dark .description-tip p),
:global(.el-dialog.character-dialog--dark .preview-info p) {
  color: #97a2b8;
}

:global(.el-dialog.character-dialog--dark .field-hint button),
:global(.el-dialog.character-dialog--dark .tip-examples span) {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.045);
  color: #cbd5e1;
}

:global(.el-dialog.character-dialog--dark .field-hint button:hover),
:global(.el-dialog.character-dialog--dark .tip-examples span:hover) {
  border-color: rgba(34, 211, 238, 0.5);
  background: rgba(34, 211, 238, 0.08);
  color: #67e8f9;
}

:global(.el-dialog.character-dialog--dark .description-tip),
:global(.el-dialog.character-dialog--dark .preview-card) {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #151b2a;
}

:global(.el-dialog.character-dialog--dark .preview-avatar) {
  background: #20283a;
  color: #cbd5e1;
}

:global(.el-dialog.character-dialog--dark .el-input__wrapper),
:global(.el-dialog.character-dialog--dark .el-textarea__inner) {
  background: #0a0e1a;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
}

:global(.el-dialog.character-dialog--dark .el-input__wrapper.is-focus),
:global(.el-dialog.character-dialog--dark .el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #a78bfa inset;
}

:global(.el-dialog.character-dialog--dark .el-input__inner),
:global(.el-dialog.character-dialog--dark .el-textarea__inner) {
  color: #f1f5f9;
}

:global(.el-dialog.character-dialog--dark .el-input__inner::placeholder),
:global(.el-dialog.character-dialog--dark .el-textarea__inner::placeholder) {
  color: #7f8ba3;
}

:global(.el-dialog.character-dialog--dark .el-input__count) {
  background: transparent;
  color: #7f8ba3;
}

:global(
  .el-dialog.character-dialog--dark .el-input__count .el-input__count-inner
) {
  background: transparent;
}

:global(.el-dialog.character-dialog--dark .el-input__clear) {
  color: #97a2b8;
}

:global(.el-dialog.character-dialog--dark .el-button:not(.el-button--primary)) {
  border-color: rgba(255, 255, 255, 0.14);
  background: #151b2a;
  color: #cbd5e1;
}

:global(
  .el-dialog.character-dialog--dark .el-button:not(.el-button--primary):hover
) {
  border-color: #a78bfa;
  background: rgba(124, 58, 237, 0.12);
  color: #c4b5fd;
}

:global(.el-dialog.character-dialog--dark .el-button--primary) {
  --el-button-bg-color: #7c3aed;
  --el-button-border-color: #7c3aed;
  --el-button-hover-bg-color: #6d28d9;
  --el-button-hover-border-color: #6d28d9;

  color: #ffffff;
}

:global(.el-dialog.character-dialog--dark .el-button--primary.is-disabled) {
  --el-button-disabled-bg-color: rgba(124, 58, 237, 0.38);
  --el-button-disabled-border-color: transparent;

  color: rgba(255, 255, 255, 0.72);
}

@media (max-width: 600px) {
  :global(.el-dialog.character-dialog--dark .el-dialog__header) {
    padding: 18px 18px 12px;
  }

  :global(.el-dialog.character-dialog--dark .el-dialog__body) {
    padding: 14px 18px 18px;
  }

  :global(.el-dialog.character-dialog--dark .el-dialog__footer) {
    padding: 12px 18px 18px;
  }
}

:global(.el-dialog.character-dialog) {
  height: auto !important;
  max-height: calc(100vh - 128px);
  max-height: calc(100dvh - 128px);
  margin: 0 auto !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:global(.el-dialog.character-dialog .el-dialog__header),
:global(.el-dialog.character-dialog .el-dialog__footer) {
  flex: 0 0 auto;
}

:global(.el-dialog.character-dialog .el-dialog__body) {
  min-height: 0;
  flex: 1 1 auto;
  overflow-y: auto;
}

@media (min-width: 601px) {
  :global(.el-dialog.character-dialog) {
    max-height: calc(100vh - 80px);
    max-height: calc(100dvh - 80px);
    margin: 48px auto 0 !important;
  }
}

@media (max-width: 600px) {
  :global(.el-dialog.character-dialog) {
    width: calc(100vw - 24px) !important;
    max-height: calc(100vh - 24px);
    max-height: calc(100dvh - 24px);
    margin: 0 auto !important;
  }
}
</style>
