<template>
  <section ref="ctaRoot" class="final-cta">
    <div class="cta-content">
      <p class="eyebrow">Your character is waiting</p>
      <h2>Create someone you want to talk to.</h2>
      <p>
        Give your character a personality, a story, and a voice. Then start a
        conversation that’s truly yours.
      </p>

      <div class="cta-highlights">
        <div class="highlight">
          <span class="icon">✓</span>
          <span>Create a character</span>
        </div>
        <div class="highlight">
          <span class="icon">✓</span>
          <span>Define their personality</span>
        </div>
        <div class="highlight">
          <span class="icon">✓</span>
          <span>Chat with them naturally</span>
        </div>
      </div>

      <div class="cta-actions">
        <el-button
          type="primary"
          size="large"
          round
          @click="$emit('start')"
          class="cta-button"
        >
          Create Your Character →
        </el-button>
      </div>

      <p class="cta-footer">
        You create the character. PersonaAI brings them to life.
      </p>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

defineEmits(["start"]);

const ctaRoot = ref(null);
let ctx;

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  ctx = gsap.context(() => {
    gsap.from(".cta-content", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: ctaRoot.value, start: "top 80%" },
    });

    gsap.from(".highlight", {
      opacity: 0,
      y: 16,
      duration: 0.5,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: { trigger: ".cta-highlights", start: "top 85%" },
    });
  }, ctaRoot.value);
});

onBeforeUnmount(() => ctx?.revert());
</script>

<style scoped>
.final-cta {
  padding: 120px 40px;
  background: linear-gradient(
    135deg,
    rgba(124, 58, 237, 0.14),
    rgba(6, 182, 212, 0.1)
  );
  position: relative;
  overflow: hidden;
}

.final-cta::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.22), transparent);
  border-radius: 50%;
}

.final-cta::after {
  content: "";
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.2), transparent);
  border-radius: 50%;
}

.cta-content {
  max-width: 820px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 10;
}

.eyebrow {
  margin: 0 0 14px;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-purple);
  font-weight: 700;
}

.cta-content h2 {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  margin-bottom: 16px;
  color: var(--text-primary);
}

.cta-content p {
  font-size: 1.08rem;
  margin-bottom: 32px;
  color: var(--text-secondary);
}

.cta-highlights {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 36px;
  align-items: center;
}

.highlight {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: var(--text-secondary);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--primary), var(--accent-cyan));
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.85rem;
}

.cta-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.cta-button {
  min-width: 220px;
}

.cta-footer {
  font-size: 0.92rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .final-cta {
    padding: 60px 20px;
  }

  .cta-content p {
    font-size: 1rem;
  }

  .cta-actions {
    flex-direction: column;
  }

  .cta-button {
    width: 100%;
  }
}
</style>
