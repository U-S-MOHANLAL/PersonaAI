<template>
  <div class="signin-card">
    <button
      class="close-button"
      type="button"
      aria-label="Close sign in dialog"
      @click="$emit('close')"
    >
      ×
    </button>

    <div class="signin-header">
      <h3>Welcome to PersonaAI</h3>
      <p>Sign in to create and connect with your AI characters.</p>
    </div>

    <div class="signin-body">
      <ClientOnly>
        <google-sign-in-button
          one-tap
          size="large"
          width="320"
          class="google-signin"
          @success="onSignInSuccess"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
defineEmits(["close"]);

const onSignInSuccess = (response) => {
  const token = useCookie("token");
  token.value = response.credential;
  return navigateTo("/chat", { replace: true });
};
</script>

<style scoped>
.signin-card {
  position: relative;
  width: 100%;
  padding: 20px 22px 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(109, 40, 217, 0.12);
  border-radius: 24px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(8px);
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.04);
  color: var(--gray-700);
  font-size: 1.55rem;
  line-height: 1;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.close-button:hover {
  background: rgba(109, 40, 217, 0.08);
  color: var(--primary);
}

.signin-header {
  text-align: center;
  margin-bottom: 18px;
}

.signin-header h3 {
  margin: 0;
  color: var(--dark);
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  letter-spacing: -0.04em;
}

.signin-header p {
  margin: 10px auto 0;
  max-width: 300px;
  color: var(--gray-600);
  font-size: 0.92rem;
  line-height: 1.5;
}

.signin-body {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.google-signin {
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 320px);
  margin: 0 auto;
  text-align: center;
}

.google-signin :deep(.gsi-material-button) {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 100% !important;
  min-width: 0 !important;
  margin: 0 auto !important;
  height: 52px !important;
  border-radius: 16px !important;
  border: 1px solid rgba(148, 163, 184, 0.38) !important;
  background: #ffffff !important;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.04) !important;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    border-color var(--transition-fast);
}

.google-signin :deep(.gsi-material-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 12px 18px rgba(15, 23, 42, 0.06) !important;
  border-color: rgba(109, 40, 217, 0.28) !important;
}

.google-signin :deep(.gsi-material-button-state) {
  border-radius: 16px !important;
}

.google-signin :deep(.gsi-material-button-contents) {
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: #1f2937 !important;
  letter-spacing: -0.01em;
}

@media (max-width: 640px) {
  .signin-card {
    padding: 18px 16px 20px;
    border-radius: 20px;
  }

  .signin-header {
    margin-bottom: 16px;
  }

  .signin-header p {
    max-width: 240px;
  }

  .google-signin {
    width: min(100%, 280px);
  }
}
</style>
