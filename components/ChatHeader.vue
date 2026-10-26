<template>
  <header class="chat-header">
    <div class="chat-header-inner">
      <div class="brand">
        <img src="../assets/images/logo.png" alt="PersonaAI Logo" class="logo" />

        <div class="brand-info">
          <span class="title">PersonaAI</span>
        </div>
      </div>

      <div class="actions">
        <el-tooltip
          :content="
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          "
          :effect="theme"
          :popper-class="
            theme === 'dark' ? 'header-tooltip--dark' : 'header-tooltip--light'
          "
          placement="bottom"
        >
          <button
            class="theme-toggle"
            type="button"
            :aria-label="
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            "
            @click="$emit('toggle-theme', $event)"
          >
            <el-icon>
              <Sunny v-if="theme === 'dark'" />
              <Moon v-else />
            </el-icon>
          </button>
        </el-tooltip>

        <el-tooltip
          content="Account menu"
          :effect="theme"
          :disabled="isAccountMenuOpen"
          :show-after="250"
          :popper-class="
            theme === 'dark' ? 'header-tooltip--dark' : 'header-tooltip--light'
          "
          placement="bottom"
        >
          <el-dropdown
            trigger="click"
            :popper-class="
              theme === 'dark'
                ? 'chat-account-dropdown chat-account-dropdown--dark'
                : ''
            "
            @visible-change="isAccountMenuOpen = $event"
          >
            <span class="el-dropdown-link" aria-label="Account menu">
              <div class="avatar me">
                <img
                  v-if="profilePicture && !profilePictureFailed"
                  class="profile-picture"
                  :src="profilePicture"
                  alt=""
                  referrerpolicy="no-referrer"
                  @error="profilePictureFailed = true"
                />
                <el-icon v-else>
                  <User />
                </el-icon>
              </div>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$emit('logout')">
                  Logout
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Moon, Sunny, User } from "@element-plus/icons-vue";
import { ref } from "vue";

defineEmits(["logout", "toggle-theme"]);

const props = defineProps({
  profilePicture: {
    type: String,
    default: "",
  },
  theme: {
    type: String,
    default: "dark",
  }
});

const profilePictureFailed = ref(false);
const isAccountMenuOpen = ref(false);
</script>

<style scoped>
.chat-header {
  position: sticky;
  top: 0;
  z-index: 100;

  background: var(--chat-header-bg);
  box-shadow: var(--chat-header-shadow);
  border-bottom: 1px solid var(--chat-border);
  backdrop-filter: blur(14px);
}

.chat-header-inner {
  max-width: 1400px;

  margin: auto;

  padding: 10px 28px;

  display: flex;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo {
  width: 44px;
  height: 44px;

  object-fit: contain;

  border-radius: 10px;

  background: var(--chat-field);

  padding: 3px;

  backdrop-filter: blur(10px);
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.title {
  color: var(--chat-text);

  font-size: 1.15rem;

  font-weight: 700;

  letter-spacing: 0.3px;
}

.actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 24px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.avatar.me {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  overflow: hidden;
  border: 1px solid var(--chat-border);
  border-radius: 50%;
  background: var(--chat-field);
  color: var(--chat-text);
}

.profile-picture {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.theme-toggle {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--chat-border);
  border-radius: 10px;
  background: var(--chat-field);
  color: var(--chat-text);
  font-size: 18px;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
}

.theme-toggle:hover {
  color: var(--chat-cyan);
  border-color: var(--chat-cyan);
  transform: translateY(-1px);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--chat-accent);
  outline-offset: 2px;
}

.logout-btn {
  color: white !important;

  padding: 10px 18px;

  border-radius: 12px;

  transition: 0.25s ease;

  font-weight: 500;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.18) !important;

  color: white !important;

  transform: translateY(-1px);

  backdrop-filter: blur(8px);
}

:global(.chat-account-dropdown--dark.el-popper) {
  --el-bg-color-overlay: #151b2a;
  --el-border-color-light: rgba(255, 255, 255, 0.1);
  --el-text-color-regular: #cbd5e1;

  border-color: rgba(255, 255, 255, 0.1);
  background: #151b2a;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
}

:global(.chat-account-dropdown--dark .el-dropdown-menu) {
  background: transparent;
}

:global(.chat-account-dropdown--dark .el-dropdown-menu__item) {
  border-radius: 6px;
  color: #cbd5e1;
}

:global(.chat-account-dropdown--dark .el-dropdown-menu__item:hover),
:global(.chat-account-dropdown--dark .el-dropdown-menu__item:focus) {
  background: rgba(124, 58, 237, 0.16);
  color: #f1f5f9;
}

:global(.chat-account-dropdown--dark .el-popper__arrow::before) {
  border-color: rgba(255, 255, 255, 0.1);
  background: #151b2a;
}

:global(.header-tooltip--light.el-popper) {
  --el-bg-color-overlay: #ffffff;
  --el-border-color-light: #d1d5db;
  --el-text-color-regular: #1f2937;

  border-color: #d1d5db !important;
  background: #ffffff !important;
  color: #1f2937 !important;
}

:global(.header-tooltip--light .el-popper__arrow::before) {
  border-color: #d1d5db !important;
  background: #ffffff !important;
}

:global(.header-tooltip--dark.el-popper) {
  --el-bg-color-overlay: #151b2a;
  --el-border-color-light: rgba(255, 255, 255, 0.12);
  --el-text-color-regular: #e2e8f0;

  border-color: rgba(255, 255, 255, 0.12) !important;
  background: #151b2a !important;
  color: #e2e8f0 !important;
}

:global(.header-tooltip--dark .el-popper__arrow::before) {
  border-color: rgba(255, 255, 255, 0.12) !important;
  background: #151b2a !important;
}

@media (max-width: 768px) {
  .chat-header-inner {
    padding: 8px 18px;
  }

  .title {
    font-size: 1rem;
  }

  .logout-btn {
    padding: 8px 12px;
  }
}
</style>
