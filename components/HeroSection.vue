<template>
  <section ref="heroSection" class="hero">
    <div class="aurora aurora-1"></div>
    <div class="aurora aurora-2"></div>
    <div class="aurora aurora-3"></div>

    <div class="hero-container single-column">
      <div class="hero-left">
        <div class="hero-animated-text" aria-label="Create. Define. Connect.">
          <span class="hero-word-wrap">
            <span class="hero-word-splash hero-splash-create"></span>
            <span class="hero-word hero-word-create">Create</span>
          </span>
          <span class="hero-word-wrap">
            <span class="hero-word-splash hero-splash-define"></span>
            <span class="hero-word hero-word-define">Define</span>
          </span>
          <span class="hero-word-wrap">
            <span class="hero-word-splash hero-splash-connect"></span>
            <span class="hero-word hero-word-connect">Connect</span>
          </span>
        </div>

        <h1 class="hero-subtitle">
          Create an AI character that's truly yours.
        </h1>
        <p class="hero-description">
          Give them a personality, a story, and a voice — then start a
          conversation.
        </p>

        <div class="hero-actions">
          <el-button type="primary" round @click="emit('start')">
            Create Your Character →
          </el-button>
          <el-button round @click="scrollToCharacters">
            Explore Characters
          </el-button>
        </div>
      </div>
    </div>

    <button
      ref="scrollIndicator"
      type="button"
      class="hero-scroll"
      aria-label="Scroll to create characters"
      :class="{ 'hero-scroll--away': !isHeroVisible }"
      @click="scrollToCharacters"
    >
      <span aria-hidden="true">↓</span>
    </button>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const emit = defineEmits(["start"]);
const heroSection = ref(null);
const scrollIndicator = ref(null);
const isHeroVisible = ref(true);
let heroObserver;

const scrollToCharacters = () => {
  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
};

onMounted(() => {
  heroObserver = new IntersectionObserver(
    ([entry]) => {
      isHeroVisible.value = entry.isIntersecting;
    },
    { threshold: 0.2 },
  );

  if (heroSection.value) {
    heroObserver.observe(heroSection.value);
  }
});

onBeforeUnmount(() => {
  heroObserver?.disconnect();
});
</script>

<style scoped>
:deep(.el-button) {
  font-weight: 600;
  transition: all var(--transition-base);
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
}

.hero {
  position: relative;
  min-height: calc(100vh - 72px);
  padding: 104px 24px 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(
      900px 620px at 15% 10%,
      rgba(124, 58, 237, 0.24),
      transparent 60%
    ),
    radial-gradient(
      800px 560px at 85% 85%,
      rgba(6, 182, 212, 0.18),
      transparent 60%
    ),
    var(--bg-page);
}

:deep(.aurora) {
  filter: blur(110px);
  opacity: 0.52;
}

:deep(.aurora-1) {
  background: linear-gradient(
    135deg,
    rgba(163, 120, 255, 0.72),
    rgba(208, 162, 255, 0.42)
  );
  left: -8%;
  top: 8%;
}

:deep(.aurora-2) {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.48),
    rgba(232, 232, 255, 0.3)
  );
  left: 18%;
  top: 28%;
}

:deep(.aurora-3) {
  background: linear-gradient(
    135deg,
    rgba(255, 180, 204, 0.42),
    rgba(186, 230, 255, 0.4)
  );
  right: 8%;
  bottom: 10%;
}

.hero-container.single-column {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
}

.hero-left {
  width: 100%;
  max-width: 980px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  animation: slideInLeft 0.8s ease-out;
}

.hero-animated-text {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(10px, 2vw, 28px);
  width: 100%;
  max-width: 860px;
  padding: 18px 0;
}

.hero-word-wrap {
  position: relative;
  display: inline-grid;
  place-items: center;
}

.hero-word {
  position: relative;
  display: inline-block;
  font-size: clamp(2.4rem, 6vw, 4.6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  opacity: 0;
  transform: translateY(36px) scale(0.82);
  filter: blur(8px);
  animation: hero-word-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hero-word-create {
  color: #a78bfa;
  animation-delay: 0.15s;
}

.hero-word-define {
  color: #22d3ee;
  animation-delay: 0.75s;
}

.hero-word-connect {
  color: #f472b6;
  animation-delay: 1.35s;
}

.hero-word-splash {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
  animation: hero-splash-burst 0.9s ease-out forwards;
}

.hero-splash-create {
  background: radial-gradient(
    circle,
    rgba(109, 40, 217, 0.55),
    rgba(109, 40, 217, 0)
  );
  animation-delay: 0.1s;
}

.hero-splash-define {
  background: radial-gradient(
    circle,
    rgba(6, 182, 212, 0.5),
    rgba(6, 182, 212, 0)
  );
  animation-delay: 0.7s;
}

.hero-splash-connect {
  background: radial-gradient(
    circle,
    rgba(236, 72, 153, 0.5),
    rgba(236, 72, 153, 0)
  );
  animation-delay: 1.3s;
}

@keyframes hero-word-in {
  0% {
    opacity: 0;
    transform: translateY(36px) scale(0.82);
    filter: blur(8px);
  }
  60% {
    opacity: 1;
    transform: translateY(-6px) scale(1.08);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes hero-splash-burst {
  0% {
    opacity: 0.85;
    transform: scale(0.3);
  }
  60% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
    transform: scale(3.4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-word,
  .hero-word-splash {
    animation: none;
    opacity: 1;
    transform: none;
    filter: none;
  }
}

.hero-subtitle {
  margin: 28px 0 10px;
  color: var(--text-primary);
  font-size: clamp(1.35rem, 2.2vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.hero-description {
  max-width: 620px;
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(0.98rem, 1.3vw, 1.12rem);
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 28px;
}

.hero-actions :deep(.el-button) {
  min-height: 44px;
  padding: 0 22px;
}

.hero-actions :deep(.el-button:not(.el-button--primary)) {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.hero-actions :deep(.el-button:not(.el-button--primary):hover) {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.hero-scroll {
  position: absolute;
  z-index: 11;
  left: 50%;
  bottom: 68px;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  padding: 0;
  border: 2px solid rgba(34, 211, 238, 0.65);
  border-radius: 50%;
  background: linear-gradient(
    145deg,
    rgba(124, 58, 237, 0.38),
    rgba(6, 182, 212, 0.28)
  );
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transform: translate(-50%, 10px);
  animation:
    hero-scroll-in 0.45s ease-out 0.65s forwards,
    hero-circle-bounce 1.8s ease-in-out 1.2s infinite;
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    background 220ms ease,
    opacity 300ms ease;
}

.hero-scroll:hover {
  background: linear-gradient(
    145deg,
    rgba(124, 58, 237, 0.58),
    rgba(6, 182, 212, 0.48)
  );
  border-color: #67e8f9;
  box-shadow:
    0 0 0 5px rgba(34, 211, 238, 0.1),
    0 8px 24px rgba(6, 182, 212, 0.35);
  transform: translate(-50%, 3px) scale(1.07);
}

.hero-scroll > span {
  display: block;
  color: #ffffff;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 0 12px rgba(103, 232, 249, 0.9);
  animation: hero-arrow-bounce 1.8s ease-in-out 1.2s infinite;
}

.hero-scroll:hover > span {
  transform: translateY(2px);
}

.hero-scroll--away {
  opacity: 0.45;
  animation: none;
  transform: translate(-50%, 0);
  translate: 0 0;
}

.hero-scroll--away > span {
  animation: none;
}

@keyframes hero-scroll-in {
  from {
    opacity: 0;
    transform: translate(-50%, 10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes hero-arrow-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

@keyframes hero-circle-bounce {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 5px;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: calc(100svh - 64px);
    padding: 88px 20px 48px;
  }

  .hero-animated-text {
    max-width: 100%;
    gap: 12px;
  }

  .hero-subtitle {
    margin-top: 24px;
  }

  .hero-actions {
    width: 100%;
    flex-direction: column;
    margin-top: 24px;
  }

  .hero-actions :deep(.el-button) {
    width: 100%;
  }

  .hero-scroll {
    bottom: 42px;
    width: 48px;
    height: 48px;
    font-size: 1.55rem;
  }
}
</style>
