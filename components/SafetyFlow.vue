<template>
  <section id="safety" class="section">
    <div class="section-heading">
      <p class="eyebrow">How it works</p>
      <h2 class="section-title">Create a companion in three steps.</h2>
    </div>

    <div class="flow">
      <div class="flow-card">🎭 Create</div>
      <div class="arrow">↓</div>
      <div class="flow-card">🧠 Define</div>
      <div class="arrow">↓</div>
      <div class="flow-card">💬 Connect</div>
    </div>

    <div class="safety-info">
      <p>
        Give your character a name, personality, and backstory, then start
        chatting in a safe, respectful, immersive space.
      </p>
    </div>
  </section>
</template>

<style scoped>
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 40px;
}

.section-heading {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 56px;
}

.eyebrow {
  margin: 0 0 12px;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--primary);
  font-weight: 700;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin: 0;
  color: var(--dark);
}

.flow {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto 50px;
}

.safety-info {
  max-width: 760px;
  margin: 0 auto;
  background: rgba(109, 40, 217, 0.05);
  border-left: 4px solid var(--primary);
  padding: 24px;
  border-radius: 20px;
  text-align: center;
}

.safety-info p {
  color: var(--gray-700);
  line-height: 1.8;
  margin: 0;
}

.flow-card {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  padding: 24px 32px;
  border-radius: 20px;
  font-weight: 700;
  text-align: center;
  min-width: 160px;
  transition: all var(--transition-base);
  box-shadow: 0 18px 30px rgba(109, 40, 217, 0.18);
  font-size: 1rem;
}

.flow-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 36px rgba(109, 40, 217, 0.2);
}

.arrow {
  color: var(--primary);
  font-size: 2rem;
  padding: 0 16px;
  font-weight: bold;
  transition: all var(--transition-base);
}

@media (max-width: 768px) {
  .section {
    padding: 60px 20px;
  }

  .flow {
    flex-direction: column;
    gap: 12px;
  }

  .arrow {
    transform: rotate(90deg);
    padding: 8px 0;
  }

  .flow-card {
    width: 100%;
    min-width: unset;
  }
}
</style>
