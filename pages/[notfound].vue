<template>
  <main class="not-found-page">
    <header class="not-found-header">
      <NuxtLink class="not-found-brand" to="/" aria-label="PersonaAI home">
        <img src="../assets/images/logo.png" alt="" />
        <span>PersonaAI</span>
      </NuxtLink>
    </header>

    <section class="not-found-content" aria-labelledby="not-found-title">
      <div class="not-found-code" aria-hidden="true">
        <span>404</span>
        <span class="not-found-signal"></span>
      </div>
      <p class="not-found-eyebrow">Out of conversation</p>
      <h1 id="not-found-title">This page isn’t here.</h1>
      <p class="not-found-description">
        The link may be broken, or the page may have moved. Let’s get you back
        to your characters.
      </p>
      <NuxtLink class="not-found-home" to="/">
        <span>Back to PersonaAI</span>
        <span aria-hidden="true">→</span>
      </NuxtLink>
    </section>
  </main>
</template>

<script setup>
useSeoMeta({
  title: "Page Not Found",
  robots: "noindex, nofollow",
});
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  overflow: hidden;
  background:
    radial-gradient(
      700px 480px at 12% 16%,
      rgba(124, 58, 237, 0.18),
      transparent 66%
    ),
    radial-gradient(
      640px 420px at 92% 80%,
      rgba(6, 182, 212, 0.11),
      transparent 68%
    ),
    var(--bg-page);
  color: var(--text-primary);
}

.not-found-header {
  width: min(100%, 1200px);
  margin: 0 auto;
}

.not-found-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
}

.not-found-brand img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  padding: 4px;
}

.not-found-content {
  width: min(100%, 760px);
  margin: auto;
  padding: 72px 0 104px;
  animation: not-found-enter 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.not-found-code {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  color: var(--accent-purple);
  font-size: 104px;
  font-weight: 800;
  line-height: 0.9;
}

.not-found-signal {
  width: 12px;
  height: 12px;
  margin-top: 14px;
  border-radius: 50%;
  background: var(--accent-cyan);
  box-shadow: 0 0 22px rgba(34, 211, 238, 0.5);
}

.not-found-eyebrow {
  margin: 0 0 12px;
  color: var(--accent-cyan);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.not-found-content h1 {
  max-width: 620px;
  margin: 0;
  color: var(--text-primary);
  font-size: 44px;
  line-height: 1.12;
  letter-spacing: 0;
}

.not-found-description {
  max-width: 460px;
  margin: 16px 0 26px;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.65;
}

.not-found-home {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 0 17px;
  border: 1px solid rgba(167, 139, 250, 0.28);
  border-radius: 8px;
  background: #6d28d9;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background var(--transition-fast),
    transform var(--transition-fast);
}

.not-found-home:hover {
  background: #5b21b6;
  transform: translateY(-1px);
}

.not-found-home:focus-visible,
.not-found-brand:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 4px;
}

@keyframes not-found-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .not-found-page {
    padding: 18px 22px;
  }

  .not-found-content {
    padding: 48px 0 72px;
  }

  .not-found-code {
    font-size: 80px;
  }

  .not-found-content h1 {
    font-size: 36px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .not-found-content {
    animation: none;
  }
}
</style>
