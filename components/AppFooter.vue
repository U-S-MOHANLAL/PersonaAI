<template>
  <footer ref="footerRoot" class="footer">
    <div class="footer-content">
      <div class="footer-grid">
        <div class="footer-section">
          <div class="footer-brand">
            <div>
              <img
                class="footer-logo"
                src="../assets/images/logo.png"
                alt="PersonaAI Logo"
              />
            </div>
            <h3>PersonaAI</h3>
          </div>
          <p>
            Build a character, shape their personality, and start a conversation
            that feels real.
          </p>
        </div>

        <div class="footer-section">
          <h4>Explore</h4>
          <ul>
            <li><a href="#features">Create</a></li>
            <li><a href="#define">Define</a></li>
            <li><a href="#connect">Connect</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 PersonaAI. All rights reserved.</p>
        <p>You create the character. PersonaAI brings them to life.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const footerRoot = ref(null);
let ctx;

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  ctx = gsap.context(() => {
    gsap.from(".footer-section", {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: { trigger: ".footer-grid", start: "top 88%" },
    });
  }, footerRoot.value);
});

onBeforeUnmount(() => ctx?.revert());
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, var(--dark-secondary), var(--dark));
  color: var(--gray-300);
  padding: 80px 40px 40px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 60px;
  margin-bottom: 60px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-logo {
  font-size: 2rem;
  width: 48px;
  height: 24px;
}

.footer-brand h3 {
  color: white;
  font-size: 1.3rem;
  margin: 0;
}

.footer-section p {
  color: var(--gray-400);
  line-height: 1.6;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: var(--gray-400);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-fast);
}

.social-link:hover {
  color: white;
}

.footer-section h4 {
  color: white;
  font-size: 1rem;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 12px;
}

.footer-section a {
  color: var(--gray-400);
  text-decoration: none;
  transition: all var(--transition-fast);
  font-size: 0.95rem;
}

.footer-section a:hover {
  color: white;
  transform: translateX(4px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 40px;
  text-align: center;
}

.footer-bottom p {
  margin: 8px 0;
  color: var(--gray-400);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer {
    padding: 40px 20px 30px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-section {
    text-align: center;
  }

  .footer-brand {
    justify-content: center;
  }

  .social-links {
    justify-content: center;
  }

  .footer-section a:hover {
    transform: none;
  }
}
</style>
