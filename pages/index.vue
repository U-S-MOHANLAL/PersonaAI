<template>
  <div id="top" ref="pageRoot" class="landing-page">
    <AppHeader @login="googleLogin" @signup="googleLogin" />
    <main>
      <HeroSection @start="googleLogin" />

      <section
        ref="createSection"
        id="features"
        class="create-section"
        aria-label="Create characters"
      >
        <div class="section-header create-section-header">
          <p class="eyebrow">Create</p>
          <h2>Who do you want to talk to?</h2>
        </div>

        <div class="character-grid">
          <button
            v-for="character in characters"
            :key="character.id"
            type="button"
            class="character-card"
            :class="{ active: selectedCharacterId === character.id }"
            @click="selectedCharacterId = character.id"
          >
            <span class="character-avatar">{{ character.avatar }}</span>
            <h3>{{ character.name }}</h3>
            <p>{{ character.summary }}</p>
          </button>
        </div>

        <div class="selection-bar">
          <span>{{ currentCharacter.name }} selected</span>
          <button type="button" class="primary-button" @click="scrollToDefine">
            Continue defining →
          </button>
        </div>
      </section>

      <section id="define" class="define-section">
        <div class="section-header">
          <p class="eyebrow">Define</p>
          <h2>What are they like?</h2>
        </div>

        <div class="define-card">
          <div class="character-summary">
            <div class="summary-avatar">{{ currentCharacter.avatar }}</div>
            <div>
              <span class="summary-label">Your character</span>
              <h3>{{ currentCharacter.name }}</h3>
            </div>
          </div>

          <div class="trait-list" aria-label="Select character qualities">
            <button
              v-for="trait in currentCharacter.traits"
              :key="trait"
              type="button"
              class="trait-chip"
              :class="{ active: selectedTraitsList.includes(trait) }"
              @click="toggleTrait(trait)"
            >
              {{ trait }}
            </button>
          </div>

          <div class="selected-summary">
            <span>{{ currentCharacter.name }}</span>
            <div class="selected-traits">
              <span v-for="trait in selectedTraitsList" :key="trait">{{
                trait
              }}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="next-section-button"
          @click="scrollToConnect"
        >
          Continue to connect →
        </button>
      </section>

      <section id="connect" class="connect-section">
        <div class="section-header">
          <p class="eyebrow">Connect</p>
          <h2>Meet your character.</h2>
        </div>

        <div ref="chatShell" class="chat-shell">
          <div class="chat-header">
            <div class="chat-avatar">{{ currentCharacter.avatar }}</div>
            <div>
              <strong>{{ currentCharacter.name }}</strong>
              <span>{{ currentCharacter.role }}</span>
            </div>
            <span class="online-dot">● Online</span>
          </div>

          <div class="chat-traits">
            <span v-for="trait in selectedTraitsList" :key="trait">{{
              trait
            }}</span>
          </div>

          <div class="chat-body">
            <div
              v-for="message in currentMessages"
              :key="message.id"
              :class="['chat-message', message.type]"
            >
              {{ message.text }}
            </div>
          </div>

          <div class="prompt-grid">
            <button
              v-for="prompt in currentCharacter.prompts"
              :key="prompt.id"
              type="button"
              class="prompt-button"
              :class="{ active: activePrompt === prompt.id }"
              @click="selectPrompt(prompt.id)"
            >
              {{ prompt.label }}
            </button>
          </div>
        </div>
      </section>

      <section ref="whySection" class="why-PersonaAI" aria-label="Why PersonaAI">
        <div class="section-header">
          <p class="eyebrow">Why PersonaAI</p>
          <h2>Built for real conversations that feel human.</h2>
        </div>

        <div ref="whyGrid" class="why-grid">
          <article class="why-card">
            <div class="why-icon">✦</div>
            <h3>Personalized by design</h3>
            <p>
              Shape every character’s tone, warmth, and values so they fit your
              life and your needs.
            </p>
          </article>

          <article class="why-card">
            <div class="why-icon">◎</div>
            <h3>Comfort in every moment</h3>
            <p>
              Offer a safe place to talk through stress, decisions, and everyday
              feelings without judgment.
            </p>
          </article>

          <article class="why-card">
            <div class="why-icon">↗</div>
            <h3>Feels natural to use</h3>
            <p>
              Start fast, stay engaged, and turn each conversation into
              something more meaningful over time.
            </p>
          </article>
        </div>
      </section>

      <FinalCTA @start="googleLogin" />
    </main>
    <AppFooter />
  </div>

  <div
    v-show="base.isSignInVisible"
    class="auth-overlay"
    @click.self="base.isSignInVisible = false"
  >
    <div
      class="auth-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
    >
      <sign-in-dialog @close="base.isSignInVisible = false" />
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

useSeoMeta({
  title: "Private AI Character Chat",
  description:
    "Create private AI characters, shape their personalities, and start conversations with PersonaAI.",
  ogTitle: "Private AI Character Chat | PersonaAI",
  ogDescription:
    "Create private AI characters, shape their personalities, and start conversations with PersonaAI.",
  ogType: "website",
  ogUrl: "https://PersonaAI.com/",
  ogImage: "https://PersonaAI.com/pwa-512x512.png",
  twitterCard: "summary_large_image",
  twitterTitle: "Private AI Character Chat | PersonaAI",
  twitterDescription:
    "Create private AI characters, shape their personalities, and start conversations with PersonaAI.",
  twitterImage: "https://PersonaAI.com/pwa-512x512.png",
});

useHead({
  link: [{ rel: "canonical", href: "https://PersonaAI.com/" }],
});

const pageRoot = ref(null);
const createSection = ref(null);
const chatShell = ref(null);
const whySection = ref(null);
const whyGrid = ref(null);
let scrollCtx;
let createSectionObserver;
let whySectionObserver;

const base = reactive({
  isSignInVisible: false,
});

const lockBodyScroll = () => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = "";
};

watch(
  () => base.isSignInVisible,
  (visible) => {
    if (visible) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  },
  { immediate: true },
);

const googleLogin = () => {
  base.isSignInVisible = true;
};

const characters = [
  {
    id: "batman",
    name: "The Dark Knight",
    avatar: "🦇",
    role: "Stoic, protective, relentless",
    summary:
      "A stoic protector who takes every problem seriously and never stops until it’s solved.",
    traits: [
      "Stoic",
      "Protective",
      "Relentless",
      "Disciplined",
      "Brave",
      "Just",
    ],
    defaultTraits: ["Stoic", "Protective", "Relentless"],
    prompts: [
      {
        id: "bad-day",
        label: "I had a bad day",
        user: "I had a difficult day today.",
        character:
          "Everyone has nights like this. Tell me what happened, we’ll work through it methodically.",
      },
      {
        id: "advice",
        label: "I need advice",
        user: "I need some advice.",
        character:
          "Give me the facts. I’ll help you see the angle you’re missing.",
      },
      {
        id: "lost",
        label: "I feel lost",
        user: "I don’t know what to do.",
        character:
          "It’s not about knowing everything, it’s about taking the next right action. What’s in front of you?",
      },
      {
        id: "good-news",
        label: "I have good news",
        user: "I have some good news!",
        character: "Good work. Tell me what happened, you earned this one.",
      },
    ],
  },
  {
    id: "walter-white",
    name: "Walter White",
    avatar: "🧪",
    role: "Calculating, brilliant, controlling",
    summary:
      "A brilliant, calculating mind who sees every problem as one more equation to master.",
    traits: [
      "Calculating",
      "Brilliant",
      "Controlling",
      "Confident",
      "Ruthless",
      "Determined",
    ],
    defaultTraits: ["Calculating", "Brilliant", "Controlling"],
    prompts: [
      {
        id: "bad-day",
        label: "I had a bad day",
        user: "I had a difficult day today.",
        character:
          "Setbacks are just variables you haven’t accounted for yet. Walk me through exactly what happened.",
      },
      {
        id: "advice",
        label: "I need advice",
        user: "I need some advice.",
        character:
          "Tell me the problem precisely. There is always an optimal move, we just need to find it.",
      },
      {
        id: "lost",
        label: "I feel lost",
        user: "I don’t know what to do.",
        character:
          "Uncertainty is temporary. Give me the full picture and we’ll build a plan with no weak points.",
      },
      {
        id: "good-news",
        label: "I have good news",
        user: "I have some good news!",
        character:
          "Good. Tell me everything, results like that don’t happen by accident.",
      },
    ],
  },
  {
    id: "leading-lady",
    name: "The Leading Lady",
    avatar: "🎬",
    role: "Charming, glamorous, affectionate",
    summary:
      "A charming, glamorous companion with the warmth of a leading lady who makes you feel like the main character.",
    traits: [
      "Charming",
      "Glamorous",
      "Affectionate",
      "Playful",
      "Confident",
      "Sweet",
    ],
    defaultTraits: ["Charming", "Glamorous", "Affectionate"],
    prompts: [
      {
        id: "bad-day",
        label: "I had a bad day",
        user: "I had a difficult day today.",
        character:
          "Aw, come here. Tell me everything, I’ve got all the time in the world for you.",
      },
      {
        id: "advice",
        label: "I need advice",
        user: "I need some advice.",
        character:
          "Of course, darling. Tell me what’s going on and we’ll figure it out together.",
      },
      {
        id: "lost",
        label: "I feel lost",
        user: "I don’t know what to do.",
        character:
          "Hey, take a breath. Whatever it is, we’ll walk through it side by side.",
      },
      {
        id: "good-news",
        label: "I have good news",
        user: "I have some good news!",
        character:
          "Wait, tell me right now! I love celebrating good things with you.",
      },
    ],
  },
  {
    id: "anime-hero",
    name: "The Anime Hero",
    avatar: "⚔️",
    role: "Spirited, loyal, never gives up",
    summary:
      "A spirited hero straight out of anime who believes in you and never backs down from a challenge.",
    traits: ["Spirited", "Loyal", "Determined", "Bold", "Warm", "Energetic"],
    defaultTraits: ["Spirited", "Loyal", "Determined"],
    prompts: [
      {
        id: "bad-day",
        label: "I had a bad day",
        user: "I had a difficult day today.",
        character:
          "Hey, even the strongest heroes stumble sometimes! Tell me what happened, we’ll turn this around together!",
      },
      {
        id: "advice",
        label: "I need advice",
        user: "I need some advice.",
        character:
          "Alright, let’s power up and think this through! What’s the challenge in front of you?",
      },
      {
        id: "lost",
        label: "I feel lost",
        user: "I don’t know what to do.",
        character:
          "Every great story has a moment like this! Let’s find your next step, one believe-it-and-go at a time.",
      },
      {
        id: "good-news",
        label: "I have good news",
        user: "I have some good news!",
        character:
          "Yatta! That’s amazing news, I knew you had it in you! Tell me everything!",
      },
    ],
  },
  {
    id: "webslinger",
    name: "The Web-Slinger",
    avatar: "🕷️",
    role: "Witty, brave, friendly-neighborhood",
    summary:
      "A witty, friendly-neighborhood hero who cracks jokes under pressure but always shows up when it matters.",
    traits: ["Witty", "Brave", "Friendly", "Energetic", "Loyal", "Humble"],
    defaultTraits: ["Witty", "Brave", "Friendly"],
    prompts: [
      {
        id: "bad-day",
        label: "I had a bad day",
        user: "I had a difficult day today.",
        character:
          "Ooof, sounds like you got webbed to a wall today. Tell me what happened, I’m listening.",
      },
      {
        id: "advice",
        label: "I need advice",
        user: "I need some advice.",
        character:
          "Alright, with great advice comes great responsibility. What’s going on?",
      },
      {
        id: "lost",
        label: "I feel lost",
        user: "I don’t know what to do.",
        character:
          "Hey, even I fall off buildings sometimes, figuratively. Let’s swing through this together.",
      },
      {
        id: "good-news",
        label: "I have good news",
        user: "I have some good news!",
        character:
          "Whoa, tell me everything! I could use some good news today.",
      },
    ],
  },
  {
    id: "william",
    name: "William Holmes",
    avatar: "🕵️",
    role: "Sharp, observant, deductive",
    summary:
      "A sharp, observant detective who reads between the lines and helps you see what you’ve missed.",
    traits: [
      "Sharp",
      "Observant",
      "Deductive",
      "Precise",
      "Confident",
      "Curious",
    ],
    defaultTraits: ["Sharp", "Observant", "Deductive"],
    prompts: [
      {
        id: "bad-day",
        label: "I had a bad day",
        user: "I had a difficult day today.",
        character:
          "Elementary, tell me the details. There is always a clue in how a day goes wrong.",
      },
      {
        id: "advice",
        label: "I need advice",
        user: "I need some advice.",
        character:
          "Let us examine the facts closely. What do you observe that you may be overlooking?",
      },
      {
        id: "lost",
        label: "I feel lost",
        user: "I don’t know what to do.",
        character:
          "A mystery worth solving. Let us deduce the smallest clue first, the rest will follow.",
      },
      {
        id: "good-news",
        label: "I have good news",
        user: "I have some good news!",
        character:
          "Do tell. I find good news is often the most interesting case of all.",
      },
    ],
  },
];

const selectedCharacterId = ref("batman");
const activePrompt = ref("bad-day");
const selectedTraits = reactive({
  batman: ["Stoic", "Protective", "Relentless"],
  "walter-white": ["Calculating", "Brilliant", "Controlling"],
  "leading-lady": ["Charming", "Glamorous", "Affectionate"],
  "anime-hero": ["Spirited", "Loyal", "Determined"],
  "webslinger": ["Witty", "Brave", "Friendly"],
  "william": ["Sharp", "Observant", "Deductive"],
});

const currentCharacter = computed(
  () =>
    characters.find(
      (character) => character.id === selectedCharacterId.value,
    ) || characters[0],
);

const selectedTraitsList = computed(
  () =>
    selectedTraits[selectedCharacterId.value] ||
    currentCharacter.value.defaultTraits,
);

const toggleTrait = (trait) => {
  const currentList = [
    ...(selectedTraits[selectedCharacterId.value] ||
      currentCharacter.value.defaultTraits),
  ];
  const index = currentList.indexOf(trait);

  if (index >= 0) {
    currentList.splice(index, 1);
  } else {
    currentList.push(trait);
  }

  selectedTraits[selectedCharacterId.value] = currentList;
};

const currentPrompt = computed(
  () =>
    currentCharacter.value.prompts.find(
      (prompt) => prompt.id === activePrompt.value,
    ) || currentCharacter.value.prompts[0],
);

const typedUserText = ref("");
const typedCharacterText = ref("");
let typingTimers = [];
let connectSeen = false;
let hasStartedTyping = false;

const clearTypingTimers = () => {
  typingTimers.forEach((timer) => clearTimeout(timer));
  typingTimers = [];
};

const startTypingSequence = () => {
  if (hasStartedTyping || !connectSeen) return;
  hasStartedTyping = true;

  clearTypingTimers();
  typedUserText.value = "";
  typedCharacterText.value = "";

  const userText = currentPrompt.value.user || "";
  const characterText = currentPrompt.value.character || "";

  let userIndex = 0;
  let characterIndex = 0;

  const typeUser = () => {
    typedUserText.value = userText.slice(0, userIndex);
    userIndex += 1;

    if (userIndex <= userText.length) {
      typingTimers.push(setTimeout(typeUser, 24));
      return;
    }

    const typeCharacter = () => {
      typedCharacterText.value = characterText.slice(0, characterIndex);
      characterIndex += 1;

      if (characterIndex <= characterText.length) {
        typingTimers.push(setTimeout(typeCharacter, 22));
      }
    };

    typingTimers.push(setTimeout(typeCharacter, 300));
  };

  typeUser();
};

const currentMessages = computed(() => [
  { id: "user", type: "user", text: typedUserText.value },
  { id: "character", type: "character", text: typedCharacterText.value },
]);

const selectPrompt = (promptId) => {
  activePrompt.value = promptId;
  hasStartedTyping = false;
  if (connectSeen) {
    startTypingSequence();
  }
};

const scrollToDefine = () => {
  document
    .getElementById("define")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const scrollToConnect = () => {
  document
    .getElementById("connect")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

onMounted(() => {
  // A reload (e.g. service worker activation) after sign-in can land here again
  if (useCookie("token").value) {
    navigateTo("/chat", { replace: true });
    return;
  }

  if (chatShell.value && typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          connectSeen = true;
          startTypingSequence();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(chatShell.value);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (createSection.value && typeof IntersectionObserver !== "undefined") {
    const createHeader = createSection.value.querySelector(
      ".create-section-header",
    );
    const characterCards =
      createSection.value.querySelectorAll(".character-card");
    const selectionBar = createSection.value.querySelector(".selection-bar");

    gsap.set(createHeader, { autoAlpha: 0, y: 24 });
    gsap.set(characterCards, { autoAlpha: 0, y: 44, scale: 0.94 });
    gsap.set(selectionBar, { autoAlpha: 0, x: -20, y: 20 });

    createSectionObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        gsap
          .timeline()
          .to(createHeader, {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          })
          .to(
            characterCards,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              stagger: 0.1,
              ease: "back.out(1.35)",
            },
            "-=0.25",
          )
          .to(
            selectionBar,
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.2",
          );

        createSectionObserver.disconnect();
      },
      { threshold: 0.2 },
    );

    createSectionObserver.observe(createSection.value);
  }

  if (whyGrid.value && typeof IntersectionObserver !== "undefined") {
    const whyCards = whySection.value.querySelectorAll(".why-card");

    gsap.set(whyCards, { autoAlpha: 0, y: 36, scale: 0.97 });

    whySectionObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        gsap.to(whyCards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: "back.out(1.25)",
        });

        whySectionObserver.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -15% 0px" },
    );

    whySectionObserver.observe(whyGrid.value);
  }

  scrollCtx = gsap.context(() => {
    // Section headers fade/slide up as each section comes into view.
    gsap.utils
      .toArray(".section-header:not(.create-section-header)")
      .forEach((header) => {
        gsap.from(header, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: header, start: "top 85%" },
        });
      });

    // Define: card fades up, then trait chips stagger in.
    gsap.from(".define-card", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: ".define-card", start: "top 82%" },
    });

    gsap.from(".trait-chip", {
      opacity: 0,
      y: 16,
      duration: 0.4,
      stagger: 0.06,
      ease: "power2.out",
      scrollTrigger: { trigger: ".trait-list", start: "top 85%" },
    });

    // Connect: chat shell fades up, messages and prompts stagger in.
    gsap.from(".chat-shell", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: ".chat-shell", start: "top 82%" },
    });

    gsap.from(".chat-message", {
      opacity: 0,
      y: 16,
      duration: 0.4,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: { trigger: ".chat-body", start: "top 85%" },
    });

    gsap.from(".prompt-button", {
      opacity: 0,
      y: 16,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger: ".prompt-grid", start: "top 90%" },
    });
  }, pageRoot.value);

  watch(
    () => [currentPrompt.value.id, currentCharacter.value.id],
    () => {
      if (connectSeen) {
        hasStartedTyping = false;
        startTypingSequence();
      }
    },
    { flush: "post" },
  );
});

onBeforeUnmount(() => {
  clearTypingTimers();
  createSectionObserver?.disconnect();
  whySectionObserver?.disconnect();
  scrollCtx?.revert();
});
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: authOverlayIn 0.22s ease-out;
}

.auth-modal {
  width: min(100%, 430px);
  animation: authModalIn 0.26s ease-out;
}

@keyframes authOverlayIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes authModalIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.landing-page {
  width: 100%;
}

.create-section,
.define-section,
.connect-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 40px 0;
}

.create-section {
  min-height: 100vh;
}

.define-section {
  min-height: 100vh;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.eyebrow {
  margin: 0 0 12px;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-purple);
  font-weight: 700;
}

.section-header h2 {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  color: var(--text-primary);
  margin: 0;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 20px;
}

.character-card {
  border: 1px solid var(--border-soft);
  background: var(--bg-elevated);
  border-radius: 24px;
  padding: 28px 18px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.character-card:hover,
.character-card.active {
  transform: translateY(-6px);
  border-color: rgba(167, 139, 250, 0.4);
  box-shadow: 0 18px 40px rgba(124, 58, 237, 0.22);
  background: linear-gradient(
    135deg,
    rgba(167, 139, 250, 0.14),
    rgba(34, 211, 238, 0.1)
  );
}

.character-avatar {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent-cyan));
  color: white;
  font-size: 2.1rem;
}

.character-card h3 {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.character-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.92rem;
}

.selection-bar {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 22px 28px;
  border-radius: 18px;
  background: rgba(167, 139, 250, 0.08);
  border: 1px solid var(--border-soft);
  color: var(--text-primary);
  font-weight: 600;
}

.primary-button {
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--primary), var(--accent-cyan));
  color: #fff;
  padding: 14px 22px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(109, 40, 217, 0.2);
}

.define-card {
  max-width: 980px;
  margin: 0 auto;
  background: var(--bg-elevated);
  border-radius: 28px;
  border: 1px solid var(--border-soft);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  padding: 32px;
}

.next-section-button {
  display: block;
  margin: 32px auto 0;
  border: 0;
  border-radius: 999px;
  padding: 14px 22px;
  background: linear-gradient(135deg, var(--primary), var(--accent-cyan));
  color: white;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(109, 40, 217, 0.18);
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base);
}

.next-section-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(109, 40, 217, 0.24);
}

.character-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.summary-avatar {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent-cyan));
  color: white;
  font-size: 2rem;
}

.summary-label {
  display: block;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
  margin-bottom: 6px;
}

.character-summary h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 2rem;
}

.trait-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.trait-chip {
  border: 1px solid var(--border-soft);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.trait-chip.active {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  border-color: transparent;
  color: white;
  box-shadow: 0 12px 26px rgba(109, 40, 217, 0.2);
}

.selected-summary {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-soft);
}

.selected-summary > span {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}

.selected-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.selected-traits span {
  background: rgba(167, 139, 250, 0.14);
  color: var(--accent-purple);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 700;
  font-size: 0.85rem;
}

.connect-section {
  padding-bottom: 120px;
}

.why-PersonaAI {
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 40px 80px;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.why-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.25);
}

.why-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(167, 139, 250, 0.18),
    rgba(34, 211, 238, 0.18)
  );
  color: var(--accent-purple);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 18px;
}

.why-card h3 {
  margin: 0 0 12px;
  color: var(--text-primary);
  font-size: 1.35rem;
}

.why-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.chat-shell {
  max-width: 760px;
  margin: 0 auto;
  background: var(--bg-elevated);
  border-radius: 28px;
  border: 1px solid var(--border-soft);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 24px 18px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--border-soft);
}

.chat-avatar {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent-cyan));
  color: white;
  font-size: 1.4rem;
}

.chat-header strong {
  display: block;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.chat-header span {
  color: var(--text-secondary);
  font-size: 0.76rem;
}

.online-dot {
  margin-left: auto;
  color: var(--success);
  letter-spacing: 0.05em;
  font-weight: 700;
}

.chat-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 18px 24px 0;
}

.chat-traits span {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(167, 139, 250, 0.14);
  color: var(--accent-purple);
  font-size: 0.8rem;
  font-weight: 700;
}

.chat-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
}

.chat-message {
  max-width: 78%;
  border-radius: 18px;
  padding: 14px 16px;
  line-height: 1.6;
  font-size: 0.95rem;
}

.chat-message.user {
  align-self: flex-end;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.chat-message.character {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  border-left: 4px solid var(--accent-purple);
}

.prompt-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 0 24px 24px;
}

.prompt-button {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  padding: 14px 12px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.prompt-button.active,
.prompt-button:hover {
  background: linear-gradient(
    135deg,
    rgba(167, 139, 250, 0.18),
    rgba(34, 211, 238, 0.14)
  );
  border-color: rgba(167, 139, 250, 0.4);
}

@media (max-width: 900px) {
  .character-grid,
  .why-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .selection-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .create-section,
  .define-section,
  .connect-section,
  .why-PersonaAI {
    padding-left: 20px;
    padding-right: 20px;
  }

  .character-grid,
  .prompt-grid,
  .why-grid {
    grid-template-columns: 1fr;
  }

  .why-PersonaAI {
    padding-top: 88px;
    padding-bottom: 56px;
  }

  .define-card,
  .chat-shell {
    padding-left: 0;
    padding-right: 0;
  }

  .character-summary,
  .chat-header {
    gap: 10px;
  }

  .selected-summary,
  .chat-body,
  .prompt-grid {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
