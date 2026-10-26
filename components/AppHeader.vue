<template>
  <header class="header">
    <div class="header-inner">
      <a class="brand" href="#top" aria-label="PersonaAI home">
        <img src="../assets/images/logo.png" alt="" class="logo-placeholder" />
        <span class="brand-name">PersonaAI</span>
      </a>

      <div class="actions">
        <el-button text @click="$emit('login')">Sign in</el-button>
        <el-button type="primary" round @click="$emit('signup')">
          <span class="header-button-label">Create a character</span>
          <span class="header-button-arrow" aria-hidden="true">→</span>
        </el-button>
      </div>
    </div>
  </header>
</template>

<script setup>
const scrollToSection = (sectionId) => {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
</script>

<style scoped>
/* Header styling is in global index.css */
.logo-placeholder {
  width: 38px;
  height: 38px;
  object-fit: contain;
  flex: 0 0 38px;
  border-radius: 10px;
}

.brand-name {
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brand-note {
  color: var(--gray-500);
  font-size: 0.72rem;
  font-weight: 500;
  margin-left: 2px;
  white-space: nowrap;
}

.brand {
  text-decoration: none;
  min-width: 250px;
  gap: 10px;
}

.header-inner {
  padding-top: 18px;
  padding-bottom: 18px;
}

.actions {
  align-items: center;
  white-space: nowrap;
}

:deep(.el-button) {
  font-size: 0.9rem;
}

:deep(.el-button--primary) {
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.2);
}

@media (max-width: 900px) {
  .brand-note {
    display: none;
  }

  .brand {
    min-width: auto;
  }

  nav {
    gap: 16px;
  }

  nav a {
    font-size: 0.85rem;
  }
}

@media (max-width: 640px) {
  nav {
    display: none;
  }

  .actions :deep(.el-button:first-child) {
    display: none;
  }

  .actions :deep(.el-button--primary) {
    padding: 10px 16px;
  }

  .actions :deep(.header-button-arrow) {
    display: none;
  }

  .actions :deep(.header-button-label) {
    display: inline;
  }
}

/* Header styling is in global index.css */
.logo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-button) {
  font-weight: 500;
  transition: all var(--transition-fast);
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
}

:deep(.el-button.is-text) {
  color: var(--text-primary);
}

:deep(.el-button.is-text:hover) {
  color: var(--accent-purple);
  background: transparent;
}
</style>
