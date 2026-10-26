<template>
  <div class="chat-page" :class="{ 'chat-page--light': isLightMode }">
    <div
      v-if="base.loading"
      class="chat-loading"
      :class="{ 'chat-loading--light': isLightMode }"
      role="status"
      aria-live="polite"
    >
      <span class="chat-loading__spinner" aria-hidden="true"></span>
      <span>Preparing your chat space...</span>
    </div>

    <!-- Header -->
    <ChatHeader
      @logout="handleLogOut"
      @toggle-theme="toggleTheme"
      :theme="isLightMode ? 'light' : 'dark'"
      :profile-picture="base.profilePicture"
    />

    <div class="chat-layout">
      <!-- ================= SIDEBAR ================= -->
      <aside class="character-sidebar">
        <div class="sidebar-header">
          <div>
            <h3>Characters</h3>
            <span>{{ base.characters.length }} total</span>
          </div>

          <el-tooltip
            content="Create a character"
            :effect="isLightMode ? 'light' : 'dark'"
            :popper-class="chatTooltipClass"
            placement="top"
          >
            <button
              class="sidebar-add"
              type="button"
              aria-label="Create a character"
              @click="handleAddCharacter"
            >
              +
            </button>
          </el-tooltip>
        </div>

        <div class="character-search">
          <el-icon class="search-icon" aria-hidden="true">
            <Search />
          </el-icon>
          <input
            v-model="base.characterSearch"
            type="text"
            placeholder="Search characters..."
          />
        </div>

        <el-scrollbar class="character-scroll">
          <div
            v-for="character in filteredCharacters"
            :key="character.id ?? character._id ?? character.name"
            class="character-card"
            :class="{
              active:
                (base.activeCharacter?.id ?? base.activeCharacter?._id) ===
                (character.id ?? character._id),
            }"
            @click="selectCharacter(character)"
          >
            <div class="character-avatar-wrapper">
              <img
                class="character-avatar"
                :src="character.profilePicture"
                :alt="character.name"
              />

              <span
                v-if="
                  (base.activeCharacter?.id ?? base.activeCharacter?._id) ===
                  (character.id ?? character._id)
                "
                class="online-dot"
              ></span>
            </div>

            <div class="character-info">
              <div class="character-top">
                <strong>{{ character.name }}</strong>
              </div>

              <p>
                {{ getLastMessage(character) }}
              </p>
            </div>
          </div>

          <div v-if="filteredCharacters.length === 0" class="empty-characters">
            <div class="empty-icon">⌕</div>
            <p>No characters found</p>
          </div>
        </el-scrollbar>

        <!-- Sidebar footer -->
        <div class="sidebar-footer">
          <div class="profile-mini">
            <div class="profile-avatar">
              {{ base.name?.[0]?.toUpperCase() || "U" }}
            </div>

            <div>
              <strong>{{ base.name || "User" }}</strong>
              <span>{{ base.email || "Account" }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- ================= MAIN CHAT ================= -->
      <main class="chat-main">
        <!-- Character header -->
        <div class="character-header">
          <div class="active-character">
            <div class="header-avatar-wrapper">
              <img
                v-if="base.activeCharacter"
                :src="base.activeCharacter.profilePicture"
                :alt="base.activeCharacter.name"
                class="header-avatar"
              />

              <span class="header-online"></span>
            </div>

            <div class="header-character-info">
              <h2>
                {{ base.activeCharacter?.name || "Character" }}
              </h2>

              <span class="character-status">
                {{ canDeleteActiveCharacter ? "Persona" : "AI Character" }}
              </span>
            </div>
          </div>

          <div class="header-actions">
            <el-tooltip
              content="Character options"
              :effect="isLightMode ? 'light' : 'dark'"
              :popper-class="chatTooltipClass"
              placement="bottom"
            >
              <el-dropdown
                trigger="click"
                placement="bottom-end"
                :popper-class="
                  isLightMode
                    ? ''
                    : 'chat-character-dropdown chat-character-dropdown--dark'
                "
                @command="handleCharacterAction"
                :disabled="!base.activeCharacter"
              >
                <button
                  type="button"
                  class="more-button"
                  aria-label="Character options"
                >
                  ⋮
                </button>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="clear-chat">
                      <el-icon>
                        <Delete />
                      </el-icon>

                      <span>Clear chat</span>
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="canDeleteActiveCharacter"
                      divided
                      command="delete-character"
                    >
                      <el-icon class="danger-icon">
                        <DeleteFilled />
                      </el-icon>

                      <span class="danger-text"> Delete character </span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
          </div>
        </div>

        <!-- ================= CHAT AREA ================= -->
        <div ref="chatContainer" class="chat-container">
          <!-- Welcome screen -->
          <div
            v-if="base.activeCharacter?.history.length === 0 && !base.loading"
            class="welcome-screen"
          >
            <div class="welcome-avatar">
              <img
                v-if="base.activeCharacter"
                :src="base.activeCharacter.profilePicture"
                :alt="base.activeCharacter.name"
              />
            </div>

            <h1 v-if="firstName">Hi, {{ firstName }}</h1>
            <h1 v-else>Chat with {{ base.activeCharacter?.name }}</h1>

            <p v-if="firstName">
              What would you like to talk about with
              {{ base.activeCharacter?.name }}?
            </p>
            <p v-else>
              Start a conversation and get to know
              {{ base.activeCharacter?.name }}.
            </p>

            <div class="suggestions">
              <button
                v-for="suggestion in suggestions"
                :key="suggestion"
                type="button"
                @click="useSuggestion(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div v-else class="messages-wrapper">
            <div
              v-for="chat in base.activeCharacter?.history || []"
              :key="chat.id"
              class="message-row"
              :class="chat.role === 'user' ? 'user-message' : 'model-message'"
            >
              <!-- Model avatar -->
              <div v-if="chat.role === 'model'" class="message-avatar">
                <img
                  :src="base.activeCharacter?.profilePicture"
                  :alt="base.activeCharacter?.name"
                />
              </div>

              <div class="message-content">
                <div v-if="chat.role === 'model'" class="message-name">
                  {{ base.activeCharacter?.name }}
                </div>
                <div class="bubble" v-if="chat.role === 'user'">
                  {{ chat.parts?.[0]?.text }}
                </div>
                <div
                  class="bubble"
                  v-html="processText(chat.parts?.[0]?.text)"
                  v-else
                ></div>
              </div>

              <!-- User avatar -->
              <div
                v-if="chat.role === 'user'"
                class="message-avatar user-avatar"
              >
                {{ base.name?.[0]?.toUpperCase() || "U" }}
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="base.isChatProcessing" class="message-row model-message">
              <div class="message-avatar">
                <img
                  :src="base.activeCharacter?.profilePicture"
                  :alt="base.activeCharacter?.name"
                />
              </div>

              <div class="message-content">
                <div class="message-name">
                  {{ base.activeCharacter?.name }}
                </div>

                <div class="typing-bubble">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= COMPOSER ================= -->
        <div class="composer-area">
          <div class="composer">
            <el-tooltip
              content="Attachments are not available yet"
              :effect="isLightMode ? 'light' : 'dark'"
              :popper-class="chatTooltipClass"
              placement="top"
            >
              <button
                type="button"
                class="composer-action"
                aria-label="Attachments are not available yet"
              >
                +
              </button>
            </el-tooltip>

            <input
              v-model="base.input"
              type="text"
              :placeholder="`Message ${base.activeCharacter?.name || ''}...`"
              :disabled="base.isChatProcessing"
              @keyup.enter="sendMessage"
            />

            <el-tooltip
              content="Send message"
              :effect="isLightMode ? 'light' : 'dark'"
              :popper-class="chatTooltipClass"
              placement="top"
            >
              <button
                type="button"
                class="send-button"
                :disabled="
                  !base.input.trim() ||
                  base.isChatProcessing
                "
                aria-label="Send message"
                @click="sendMessage"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </el-tooltip>
          </div>

          <p class="composer-hint">
            {{ base.activeCharacter?.name }} may make mistakes. Check important
            information.
          </p>
        </div>
      </main>
    </div>

    <!-- Loading -->

    <AddCharacterDialog
      v-model="base.isAddCharacterVisible"
      :saving="base.isCreatingCharacter"
      :theme="isLightMode ? 'light' : 'dark'"
      @create="handleCreateCharacter"
    />

    <ConfirmClearChatDialog
      v-model="base.isSpecificCharacterChatClearConfirmVisible"
      :character-name="base.activeCharacter?.name"
      :loading="base.isClearingSpecificChat"
      @confirm="handleClearChat"
      @cancel="base.isSpecificCharacterChatClearConfirmVisible = false"
    />

    <DeleteCharacterDialog
      v-model="base.isDeleteCharacterConfirmVisible"
      :character-name="base.activeCharacter?.name"
      :loading="base.isDeletingCharacter"
      @confirm="handleDeleteCharacter"
      @cancel="base.isDeleteCharacterConfirmVisible = false"
    />
  </div>
</template>

<script setup>
import { jwtDecode } from "jwt-decode";
import { Delete, DeleteFilled, Search } from "@element-plus/icons-vue";
import { marked } from "marked";
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;
const defaultCharacterId = config.public.defaultCharacterId;

useSeoMeta({
  robots: "noindex, nofollow",
});

/* =========================
   STATE
========================= */

const base = reactive({
  input: "",
  isAddCharacterVisible: false,
  isCreatingCharacter: false,
  isSpecificCharacterChatClearConfirmVisible: false,
  isClearingSpecificChat: false,
  loading: true,
  isDeleteCharacterConfirmVisible: false,
  isDeletingCharacter: false,
  name: "",
  profilePicture: "",
  email: "",
  isChatProcessing: false,
  characterSearch: "",
  activeCharacter: null,
  characters: [],
});

/* =========================
   COMPUTED
========================= */

const filteredCharacters = computed(() => {
  const search = base.characterSearch.trim().toLowerCase();
  if (!search) {
    return base.characters;
  }
  return base.characters.filter((character) =>
    String(character?.name || "")
      .toLowerCase()
      .includes(search),
  );
});

const firstName = computed(() => base.name.trim().split(/\s+/)[0] || "");

const suggestions = computed(() => [
  `Tell me about yourself`,
  `What can you help me with?`,
  `Let's have a conversation`,
]);

/* =========================
   REFS
========================= */

const chatContainer = ref(null);
const chatThemeStorageKey = "PersonaAI-chat-theme";
const themePreference = useCookie(chatThemeStorageKey, {
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
});
const chatTooltipClass = computed(() =>
  isLightMode.value
    ? "chat-tooltip chat-tooltip--light"
    : "chat-tooltip chat-tooltip--dark",
);
const isLightMode = computed({
  get: () => themePreference.value === "light",
  set: (value) => {
    themePreference.value = value ? "light" : "dark";
  },
});

const toggleTheme = (event) => {
  const nextLightMode = !isLightMode.value;
  const applyTheme = () => {
    isLightMode.value = nextLightMode;
  };
  const startViewTransition = document["startViewTransition"];

  if (
    typeof startViewTransition !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    applyTheme();
    return;
  }

  const buttonBounds = event.currentTarget.getBoundingClientRect();
  const centerX = buttonBounds.left + buttonBounds.width / 2;
  const centerY = buttonBounds.top + buttonBounds.height / 2;
  const radius = Math.hypot(
    Math.max(centerX, window.innerWidth - centerX),
    Math.max(centerY, window.innerHeight - centerY),
  );
  const transition = startViewTransition.call(document, applyTheme);

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${centerX}px ${centerY}px)`,
            `circle(${radius}px at ${centerX}px ${centerY}px)`,
          ],
        },
        {
          duration: 650,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
};

/* =========================
   MOUNT
========================= */

onMounted(() => {
  if (!themePreference.value) {
    const legacyTheme = localStorage.getItem(chatThemeStorageKey);
    if (legacyTheme === "light" || legacyTheme === "dark") {
      themePreference.value = legacyTheme;
    }
  }

  const token = useCookie("token").value;
  if (!token) {
    navigateTo("/");
    return;
  }

  try {
    const decodedToken = jwtDecode(token);
    base.name = decodedToken.name || "";
    base.profilePicture = decodedToken.picture || "";
    fetchLoginData();
  } catch (error) {
    console.error("Invalid token:", error);
    navigateTo("/");
  }
});

/* =========================
   SUGGESTIONS
========================= */

const useSuggestion = (message) => {
  base.input = message;

  nextTick(() => {
    sendMessage();
  });
};

/* =========================
   SCROLL
========================= */

const scrollToBottom = async () => {
  await nextTick();

  if (!chatContainer.value) {
    return;
  }

  chatContainer.value.scrollTo({
    top: chatContainer.value.scrollHeight,
    behavior: "smooth",
  });
};

watch(
  () => base.activeCharacter?.history.length,
  () => {
    scrollToBottom();
  },
);

/* =========================
   SEND MESSAGE
========================= */

const sendMessage = async () => {
  const userInput = base.input.trim();

  if (
    !userInput ||
    base.isChatProcessing ||
    !base.activeCharacter
  ) {
    return;
  }

  const character = base.activeCharacter;
  const characterId = character.id ?? character._id;

  if (!characterId) {
    console.error("Cannot send message: active character has no id.");
    return;
  }

  if (!Array.isArray(character.history)) {
    character.history = [];
  }

  base.input = "";

  const userMessage = {
    role: "user",
    parts: [{ text: userInput }],
  };

  character.history.push(userMessage);
  base.isChatProcessing = true;

  try {
    const response = await fetch(`${apiBaseUrl}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${useCookie("token").value}`,
      },
      body: JSON.stringify({
        message: userInput,
        characterId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const processedResponse = await response.json();
    const responseText =
      typeof processedResponse?.message === "string" &&
      processedResponse.message.trim()
        ? processedResponse.message
        : "Sorry, I couldn't generate a response.";

    const modelMessage = {
      role: "model",
      parts: [{ text: responseText }],
    };

    // Append to the same character object captured before the request.
    // This prevents a response for character A from appearing in character B
    // if the user changes characters while the request is in flight.
    if (!Array.isArray(character.history)) {
      character.history = [];
    }
    character.history.push(modelMessage);
  } catch (error) {
    console.error("Error sending message:", error);

    if (!Array.isArray(character.history)) {
      character.history = [];
    }

    character.history.push({
      role: "model",
      parts: [{ text: "Sorry, something went wrong. Please try again." }],
    });
  } finally {
    base.isChatProcessing = false;
    await scrollToBottom();
  }
};

/* =========================
   LOGIN DATA
========================= */

const fetchLoginData = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        token: useCookie("token").value,
      }),
    });

    if (!response.ok) {
      throw new Error(`Login request failed: ${response.status}`);
    }

    const data = await response.json();
    const charactersChat = data.charactersChat?.[0];

    if (!charactersChat) {
      base.email = "";
      base.characters = [];
      base.activeCharacter = null;
      return;
    }

    base.email = charactersChat.email || "";
    base.characters = Array.isArray(charactersChat.characters)
      ? charactersChat.characters
      : [];

    if (base.characters.length > 0) {
      selectCharacter(base.characters[0]);
    } else {
      base.activeCharacter = null;
    }
  } catch (error) {
    console.error("Error fetching login data:", error);

    navigateTo("/");
  } finally {
    base.loading = false;
    await scrollToBottom();
  }
};

/* =========================
   CLEAR CHAT
========================= */

const handleClearChat = async () => {
  const character = base.activeCharacter;
  const characterId = character?.id ?? character?._id;

  if (!character || !characterId || base.isClearingSpecificChat) {
    return;
  }

  base.isClearingSpecificChat = true;

  try {
    const response = await fetch(`${apiBaseUrl}/clear-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${useCookie("token").value}`,
      },
      body: JSON.stringify({
        characterId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Clear chat failed: ${response.status}`);
    }

    // Only mutate local state after the server confirms success.
    character.history = [];
  } catch (error) {
    console.error("Error clearing chat:", error);
  } finally {
    base.isClearingSpecificChat = false;
    base.isSpecificCharacterChatClearConfirmVisible = false;
  }
};

/* =========================
   LOGOUT
========================= */

const handleLogOut = () => {
  useCookie("token").value = null;
  window.location.href = "/";
};

/* =========================
   CHARACTER FUNCTIONS
========================= */

const selectCharacter = (character) => {
  if (!character) {
    base.activeCharacter = null;
    base.input = "";
    base.isChatProcessing = false;
    return;
  }

  const characterId = character.id ?? character._id;

  if (
    base.activeCharacter &&
    (base.activeCharacter.id ?? base.activeCharacter._id) === characterId
  ) {
    return;
  }

  base.isChatProcessing = false;
  base.input = "";
  base.activeCharacter = character;

  if (!Array.isArray(base.activeCharacter.history)) {
    base.activeCharacter.history = [];
  }

  scrollToBottom();
};

const getLastMessage = (character) => {
  const history = character.history || [];
  if (!history.length) {
    return "Start a new conversation";
  }
  const lastMessage = history[history.length - 1];
  return lastMessage?.parts?.[0]?.text || "Start a new conversation";
};

const handleAddCharacter = () => {
  base.isAddCharacterVisible = true;
};

const handleCreateCharacter = async (character) => {
  if (!character || base.isCreatingCharacter) {
    return;
  }

  base.isCreatingCharacter = true;

  try {
    const response = await fetch(`${apiBaseUrl}/add-character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${useCookie("token").value}`,
      },
      body: JSON.stringify({
        character,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Character created successfully:", data.characters.length);

    // Prefer the server-returned character when available.
    const characters = data.characters;

    base.characters = characters;
    base.activeCharacter = characters[characters.length - 1];
    base.isAddCharacterVisible = false;
  } catch (error) {
    console.error("Error adding character:", error);
  } finally {
    base.isCreatingCharacter = false;
  }
};

const handleCharacterAction = (command) => {
  switch (command) {
    case "clear-chat":
      if (base.activeCharacter) {
        base.isSpecificCharacterChatClearConfirmVisible = true;
      }
      break;
    case "delete-character":
      if (canDeleteActiveCharacter.value) {
        base.isDeleteCharacterConfirmVisible = true;
      }
      break;
  }
};

const handleDeleteCharacter = async () => {
  const character = base.activeCharacter;
  const characterId = character?.id ?? character?._id;

  if (!character || !characterId || base.isDeletingCharacter) {
    return;
  }

  base.isDeletingCharacter = true;

  try {
    const response = await fetch(
      `${apiBaseUrl}/delete-character`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${useCookie("token").value}`,
        },
        body: JSON.stringify({
          characterId,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    await response.json();

    const deletedIndex = base.characters.findIndex(
      (char) => (char.id ?? char._id) === characterId,
    );

    base.characters = base.characters.filter(
      (char) => (char.id ?? char._id) !== characterId,
    );

    if (base.characters.length === 0) {
      base.activeCharacter = null;
    } else if (base.activeCharacter === character) {
      const nextIndex = Math.min(
        Math.max(deletedIndex, 0),
        base.characters.length - 1,
      );
      selectCharacter(base.characters[nextIndex]);
    }

    base.isDeleteCharacterConfirmVisible = false;
  } catch (error) {
    console.error("Error deleting character:", error);
  } finally {
    base.isDeletingCharacter = false;
  }
};


const canDeleteActiveCharacter = computed(() => {
  const character = base.activeCharacter;

  if (!character) {
    return false;
  }

  const characterId = character.id ?? character._id;

  return Boolean(characterId) && characterId !== defaultCharacterId;
});

/* =========================
   PROCESS TEXT
========================= */

const processText = (text) => {
  if (!text) {
    return "";
  }
  const html = marked.parse(text);
  return html;
};
</script>

<style scoped>
/* =====================================================
   BASE
===================================================== */

* {
  box-sizing: border-box;
}

.chat-page {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f8fc;
  color: #1f2937;
  overflow: hidden;
}

.chat-loading {
  position: absolute;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: rgba(10, 14, 26, 0.94);
  color: #f1f5f9;
  font-size: 14px;
  backdrop-filter: blur(5px);
}

.chat-loading--light {
  background: rgba(245, 247, 252, 0.96);
  color: #1f2937;
  backdrop-filter: blur(5px);
}

.chat-loading__spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--chat-border);
  border-top-color: var(--chat-accent);
  border-radius: 50%;
  animation: chat-loading-spin 0.8s linear infinite;
}

.chat-loading--light .chat-loading__spinner {
  border-color: #d1d5db;
  border-top-color: #6d28d9;
}

@keyframes chat-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .chat-loading__spinner {
    animation: none;
    border-top-color: var(--chat-cyan);
  }
}

/* =====================================================
   MAIN LAYOUT
===================================================== */

.chat-layout {
  flex: 1;
  min-height: 0;

  display: flex;

  max-width: 1500px;
  width: 100%;

  margin: 0 auto;

  background: #fff;

  border-left: 1px solid #e8eaf0;
  border-right: 1px solid #e8eaf0;
}

/* =====================================================
   SIDEBAR
===================================================== */

.character-sidebar {
  width: 310px;
  min-width: 310px;

  height: 100%;

  display: flex;
  flex-direction: column;

  background: #fafbfe;

  border-right: 1px solid #e8eaf0;
}

/* Header */

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 22px 20px 14px;
}

.sidebar-header h3 {
  margin: 0;

  font-size: 18px;
  font-weight: 700;
}

.sidebar-header span {
  display: block;

  margin-top: 3px;

  font-size: 12px;
  color: #8b93a5;
}

.sidebar-add {
  width: 34px;
  height: 34px;

  border: 1px solid #e1e5ed;
  border-radius: 10px;

  background: white;

  font-size: 21px;
  color: #667085;

  cursor: pointer;

  transition: 0.2s;
}

.sidebar-add:hover {
  background: #f1f4fa;
}

/* Search */

.character-search {
  height: 44px;

  margin: 0 16px 12px;

  display: flex;
  align-items: center;

  padding: 0 12px;

  background: #f0f2f7;
  border: 1px solid transparent;

  border-radius: 12px;

  color: #8c94a5;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}

.character-search:focus-within {
  border-color: var(--chat-accent);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.12);
}

.character-search .search-icon {
  flex: none;
  margin-right: 10px;
  font-size: 16px;
  color: var(--chat-muted);
}

.character-search input {
  width: 100%;

  border: none;
  outline: none;

  background: transparent;

  font-size: 13px;

  color: #333;
}

.character-search input::placeholder {
  color: #9ba2b1;
}

/* Character list */

.character-scroll {
  flex: 1;

  min-height: 0;

  padding: 4px 10px;
}

.character-card {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 11px 10px;

  margin-bottom: 5px;

  border-radius: 13px;

  cursor: pointer;

  transition:
    background 0.18s,
    transform 0.18s;
}

.character-card:hover {
  background: #f0f2f7;
}

.character-card.active {
  background: #e9efff;
}

/* Character avatar */

.character-avatar-wrapper {
  position: relative;

  flex-shrink: 0;
}

.character-avatar {
  width: 48px;
  height: 48px;

  border-radius: 50%;

  object-fit: cover;

  display: block;

  border: 2px solid white;

  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.08);
}

.online-dot {
  position: absolute;

  right: 0;
  bottom: 1px;

  width: 12px;
  height: 12px;

  background: #22c55e;

  border: 2px solid #fafbfe;

  border-radius: 50%;
}

/* Character info */

.character-info {
  min-width: 0;
  flex: 1;
}

.character-top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 5px;
}

.character-top strong {
  font-size: 14px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.character-info p {
  margin: 4px 0 0;

  font-size: 12px;

  color: #8a91a1;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-count {
  flex-shrink: 0;

  min-width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 5px;

  border-radius: 10px;

  background: #e5e7eb;

  color: #667085 !important;

  font-size: 10px !important;
}

/* Empty */

.empty-characters {
  text-align: center;

  padding: 50px 20px;

  color: #9ca3af;
}

.empty-icon {
  font-size: 30px;
  margin-bottom: 8px;
}

.empty-characters p {
  margin: 0;
  font-size: 13px;
}

/* Sidebar footer */

.sidebar-footer {
  padding: 14px;

  border-top: 1px solid #e8eaf0;
}

.profile-mini {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 9px;

  border-radius: 11px;

  background: white;
}

.profile-avatar {
  width: 36px;
  height: 36px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #2563eb;

  color: white;

  font-weight: 700;
}

.profile-mini strong {
  display: block;

  font-size: 13px;
}

.profile-mini span {
  display: block;

  margin-top: 2px;

  max-width: 180px;

  overflow: hidden;
  text-overflow: ellipsis;

  font-size: 11px;

  color: #9299a8;
}

/* =====================================================
   MAIN CHAT
===================================================== */

.chat-main {
  flex: 1;

  min-width: 0;
  min-height: 0;

  display: flex;
  flex-direction: column;

  background: #fff;
}

/* =====================================================
   CHARACTER HEADER
===================================================== */

.character-header {
  height: 76px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 25px;

  border-bottom: 1px solid #e9ebf0;

  background: rgba(255, 255, 255, 0.96);
}

.active-character {
  display: flex;
  align-items: center;

  gap: 12px;
}

.header-avatar-wrapper {
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.header-avatar {
  display: block;
  width: 44px;
  height: 44px;

  border-radius: 50%;

  object-fit: cover;

  border: 2px solid #fff;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-online {
  position: absolute;

  width: 11px;
  height: 11px;

  right: -1px;
  bottom: 1px;

  background: #22c55e;

  border: 2px solid white;

  border-radius: 50%;
}

.header-character-info h2 {
  margin: 0;

  font-size: 16px;
  font-weight: 700;
}

.header-character-info span {
  display: flex;
  align-items: center;

  gap: 5px;

  margin-top: 3px;

  font-size: 11px;

  color: #7d8697;
}

.header-character-info i {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #22c55e;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.more-button {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #737b89;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.more-button:hover {
  background: #f1f3f7;
  color: #303643;
}

.danger-icon {
  color: #ef4444;
}

.danger-text {
  color: #ef4444;
}

/* =====================================================
   CHAT CONTAINER
===================================================== */

.chat-container {
  flex: 1;

  min-height: 0;

  overflow-y: auto;

  padding: 28px 40px;

  scroll-behavior: smooth;
}

.messages-wrapper {
  width: min(850px, 100%);

  margin: 0 auto;

  display: flex;
  flex-direction: column;

  gap: 22px;
}

/* =====================================================
   MESSAGES
===================================================== */

.message-row {
  display: flex;
  align-items: flex-start;

  gap: 10px;

  width: 100%;
}

.model-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
}

/* Message avatar */

.message-avatar {
  flex-shrink: 0;

  width: 34px;
  height: 34px;

  border-radius: 50%;

  overflow: hidden;

  background: #e4e7ee;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 13px;
  font-weight: 700;
}

.message-avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.user-avatar {
  background: #2563eb;
  color: white;

  order: 2;
}

/* Message body */

.message-content {
  max-width: min(68%, 600px);

  display: flex;
  flex-direction: column;
}

.user-message .message-content {
  align-items: flex-end;
}

.message-name {
  margin: 1px 0 5px 3px;

  font-size: 11px;

  color: #8a91a1;
}

/* Bubble */

.bubble {
  padding: 12px 16px;

  font-size: 14px;
  line-height: 1.6;

  word-break: break-word;

  white-space: pre-wrap;
}

/* Model */

.model-message .bubble {
  background: #f4f5f8;

  color: #252936;

  border-radius: 4px 16px 16px 16px;
}

/* User */

.user-message .bubble {
  background: #2563eb;

  color: white;

  border-radius: 16px 4px 16px 16px;
}

/* =====================================================
   TYPING
===================================================== */

.typing-bubble {
  display: flex;
  align-items: center;

  gap: 4px;

  padding: 13px 17px;

  background: #f4f5f8;

  border-radius: 4px 16px 16px 16px;
}

.typing-bubble span {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #9299a8;

  animation: typing 1.2s infinite ease-in-out;
}

.typing-bubble span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-bubble span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }

  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* =====================================================
   WELCOME SCREEN
===================================================== */

.welcome-screen {
  height: 100%;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  padding: 30px;
}

.welcome-avatar {
  width: 92px;
  height: 92px;

  margin-bottom: 18px;

  padding: 4px;

  border-radius: 50%;

  background: white;

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.welcome-avatar img {
  width: 100%;
  height: 100%;

  border-radius: 50%;

  object-fit: cover;
}

.welcome-screen h1 {
  margin: 0;

  font-size: 25px;
  font-weight: 700;

  color: #202431;
}

.welcome-screen > p {
  max-width: 430px;

  margin: 8px 0 22px;

  font-size: 14px;
  line-height: 1.6;

  color: #858d9e;
}

.suggestions {
  display: flex;

  flex-wrap: wrap;

  justify-content: center;

  gap: 8px;
}

.suggestions button {
  padding: 9px 13px;

  border: 1px solid #e2e5eb;

  border-radius: 20px;

  background: white;

  color: #596273;

  font-size: 12px;

  cursor: pointer;

  transition: 0.2s;
}

.suggestions button:hover {
  background: #f4f6fa;

  border-color: #cfd4de;
}

/* =====================================================
   COMPOSER
===================================================== */

.composer-area {
  flex-shrink: 0;

  padding: 10px 30px 18px;

  background: white;
}

.composer {
  width: min(850px, 100%);

  min-height: 54px;

  margin: 0 auto;

  display: flex;
  align-items: center;

  gap: 8px;

  padding: 6px 7px 6px 8px;

  border: 1px solid #e0e3e9;

  border-radius: 17px;

  background: white;

  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);

  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.composer:focus-within {
  border-color: #b7c5ef;

  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.08);
}

.composer-action {
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  border: none;

  border-radius: 11px;

  background: #f3f4f7;

  color: #70788a;

  font-size: 21px;

  cursor: pointer;
}

.composer input {
  flex: 1;

  min-width: 0;

  height: 40px;

  border: none;
  outline: none;

  background: transparent;

  padding: 0 5px;

  font-size: 14px;

  color: #252936;
}

.composer input::placeholder {
  color: #a0a6b3;
}

.send-button {
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  border: none;

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #2563eb;

  color: white;

  cursor: pointer;

  transition: 0.2s;
}

.send-button svg {
  width: 18px;
  height: 18px;
}

.send-button:hover:not(:disabled) {
  background: #1d4ed8;

  transform: translateY(-1px);
}

.send-button:disabled {
  background: #d9dce3;

  cursor: not-allowed;
}

.composer-hint {
  width: min(850px, 100%);

  margin: 7px auto 0;

  text-align: center;

  font-size: 10px;

  color: #a2a8b4;
}

/* =====================================================
   SCROLLBAR
===================================================== */

.chat-container::-webkit-scrollbar,
.character-scroll ::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-thumb,
.character-scroll ::-webkit-scrollbar-thumb {
  background: #d8dce4;

  border-radius: 10px;
}

.chat-container::-webkit-scrollbar-track,
.character-scroll ::-webkit-scrollbar-track {
  background: transparent;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 900px) {
  .character-sidebar {
    width: 250px;
    min-width: 250px;
  }

  .chat-container {
    padding: 24px 20px;
  }

  .composer-area {
    padding-left: 15px;
    padding-right: 15px;
  }

  .message-content {
    max-width: 78%;
  }
}

@media (max-width: 700px) {
  .character-sidebar {
    width: 75px;
    min-width: 75px;
  }

  .sidebar-header {
    justify-content: center;
    padding: 15px 5px;
  }

  .sidebar-header > div {
    display: none;
  }

  .sidebar-add {
    width: 38px;
    height: 38px;
  }

  .character-search {
    margin: 0 12px 10px;

    justify-content: center;
  }

  .character-search input {
    display: none;
  }

  .character-search .search-icon {
    margin: 0;
  }

  .character-card {
    justify-content: center;

    padding: 9px 5px;
  }

  .character-info {
    display: none;
  }

  .character-avatar {
    width: 46px;
    height: 46px;
  }

  .sidebar-footer {
    padding: 10px 8px;
  }

  .profile-mini {
    justify-content: center;
    padding: 5px;
  }

  .profile-mini > div:last-child {
    display: none;
  }

  .character-header {
    padding: 0 15px;
  }

  .chat-container {
    padding: 20px 12px;
  }

  .message-content {
    max-width: 80%;
  }

  .composer-area {
    padding: 8px 10px 12px;
  }

  .composer-hint {
    display: none;
  }
}

@media (max-width: 450px) {
  .character-sidebar {
    width: 64px;
    min-width: 64px;
  }

  .header-character-info h2 {
    font-size: 14px;
  }

  .header-character-info span {
    font-size: 10px;
  }

  .header-actions button {
    width: 30px;
  }

  .message-content {
    max-width: 82%;
  }

  .bubble {
    font-size: 13px;
  }

  .composer-action {
    display: none;
  }

  .welcome-screen h1 {
    font-size: 21px;
  }
}

.header-character-info {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.header-character-info h2 {
  margin: 0;

  font-size: 16px;
  font-weight: 700;

  color: #252936;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.character-status {
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 10px;
  font-weight: 500;
  color: #9299a7;
}

/* Avatar */

.header-avatar-wrapper {
  position: relative;
}

.avatar-sparkle {
  position: absolute;

  right: -3px;
  bottom: -3px;

  width: 17px;
  height: 17px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid #fff;
  border-radius: 50%;

  background: #22c55e;

  color: #fff;

  font-size: 8px;
  line-height: 1;
}

.chat-page {
  --chat-bg: #0a0e1a;
  --chat-surface: #0f1423;
  --chat-sidebar: rgba(255, 255, 255, 0.025);
  --chat-raised: #151b2a;
  --chat-field: rgba(255, 255, 255, 0.055);
  --chat-text: #f1f5f9;
  --chat-muted: #97a2b8;
  --chat-subtle: #6b7686;
  --chat-border: rgba(255, 255, 255, 0.09);
  --chat-hover: rgba(255, 255, 255, 0.06);
  --chat-active: rgba(124, 58, 237, 0.18);
  --chat-accent: #a78bfa;
  --chat-accent-strong: #7c3aed;
  --chat-cyan: #22d3ee;
  --chat-user-bubble: #6d28d9;
  --chat-bot-bubble: #151b2a;
  --chat-header-bg:
    linear-gradient(110deg, rgba(124, 58, 237, 0.18), rgba(6, 182, 212, 0.08)),
    #0a0e1a;
  --chat-header-shadow: 0 4px 18px rgba(0, 0, 0, 0.24);

  background:
    radial-gradient(
      900px 620px at 15% 10%,
      rgba(124, 58, 237, 0.16),
      transparent 60%
    ),
    radial-gradient(
      800px 560px at 85% 85%,
      rgba(6, 182, 212, 0.1),
      transparent 60%
    ),
    var(--chat-bg);
  color: var(--chat-text);
}

.chat-page--light {
  --chat-bg: #f5f7fc;
  --chat-surface: #ffffff;
  --chat-sidebar: #f8f9fd;
  --chat-raised: #ffffff;
  --chat-field: #f0f2f7;
  --chat-text: #1f2937;
  --chat-muted: #667085;
  --chat-subtle: #9299a8;
  --chat-border: #e5e7eb;
  --chat-hover: #f0f2f7;
  --chat-active: rgba(109, 40, 217, 0.1);
  --chat-accent: #6d28d9;
  --chat-accent-strong: #5b21b6;
  --chat-cyan: #0891b2;
  --chat-user-bubble: #6d28d9;
  --chat-bot-bubble: #f3f4f6;
  --chat-header-bg: linear-gradient(110deg, #ffffff, #f5f3ff);
  --chat-header-shadow: 0 4px 18px rgba(31, 41, 55, 0.08);
}

.chat-layout,
.chat-main {
  background: var(--chat-surface);
  border-color: var(--chat-border);
}

.character-sidebar {
  background: var(--chat-sidebar);
  border-color: var(--chat-border);
}

.sidebar-header h3,
.character-top strong,
.profile-mini strong,
.header-character-info h2,
.welcome-screen h1 {
  color: var(--chat-text);
}

.sidebar-header span,
.character-info p,
.profile-mini span,
.header-character-info span,
.character-status,
.message-name,
.composer-hint,
.welcome-screen > p {
  color: var(--chat-muted);
}

.sidebar-add,
.profile-mini,
.suggestions button,
.composer {
  background: var(--chat-raised);
  border-color: var(--chat-border);
  color: var(--chat-text);
}

.character-search {
  background: var(--chat-field);
  color: var(--chat-muted);
}

.character-search input,
.composer input {
  color: var(--chat-text);
}

.character-search input::placeholder,
.composer input::placeholder {
  color: var(--chat-subtle);
}

.character-card:hover,
.sidebar-add:hover,
.suggestions button:hover,
.more-button:hover {
  background: var(--chat-hover);
  border-color: var(--chat-border);
  color: var(--chat-text);
}

.character-card.active {
  background: var(--chat-active);
}

.chat-count {
  background: var(--chat-field);
  color: var(--chat-muted) !important;
}

.empty-characters,
.empty-characters p {
  color: var(--chat-muted);
}

.sidebar-footer,
.character-header {
  background: var(--chat-surface);
  border-color: var(--chat-border);
}

.profile-avatar,
.user-avatar {
  background: var(--chat-accent-strong);
  color: #ffffff;
}

.header-avatar,
.header-online {
  border-color: var(--chat-surface);
}

.more-button {
  color: var(--chat-muted);
}

.message-avatar {
  background: var(--chat-raised);
  color: var(--chat-text);
}

.chat-page--light .message-avatar.user-avatar {
  background: var(--chat-accent-strong);
  color: #ffffff;
}

.bubble {
  color: var(--chat-text);
}

.model-message .bubble,
.typing-bubble {
  background: var(--chat-bot-bubble);
  color: var(--chat-text);
}

.user-message .bubble {
  background: var(--chat-user-bubble);
  color: #ffffff;
}

.bubble :deep(p),
.bubble :deep(li),
.bubble :deep(h1),
.bubble :deep(h2),
.bubble :deep(h3) {
  color: inherit;
}

.model-message .bubble :deep(ol),
.model-message .bubble :deep(ul) {
  margin: 0.75em 0;
  padding-left: 1.5em;
  list-style-position: outside;
}

.model-message .bubble :deep(ul) {
  list-style-type: disc;
}

.model-message .bubble :deep(li) {
  margin: 0.4em 0;
  padding: 0;
}

.model-message .bubble :deep(li > ul),
.model-message .bubble :deep(li > ol) {
  margin: 0.25em 0;
  padding-left: 1.5em;
}

.model-message .bubble :deep(li > ul) {
  list-style-type: circle;
}

.typing-bubble span {
  background: var(--chat-muted);
}

.welcome-avatar {
  background: var(--chat-raised);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
}

.suggestions button {
  border-radius: 8px;
}

.suggestions button:hover {
  border-color: var(--chat-accent);
}

.composer-area {
  background: var(--chat-surface);
}

.composer {
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}

.composer:focus-within {
  border-color: var(--chat-accent);
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.14);
}

.composer-action {
  background: var(--chat-field);
  color: var(--chat-muted);
}

.send-button {
  background: var(--chat-accent-strong);
  color: #ffffff;
}

.send-button:hover:not(:disabled) {
  background: var(--chat-accent);
}

.send-button:disabled {
  background: var(--chat-field);
  color: var(--chat-subtle);
}

.chat-container::-webkit-scrollbar-thumb,
.character-scroll ::-webkit-scrollbar-thumb {
  background: var(--chat-border);
}

:global(.chat-character-dropdown--dark.el-popper) {
  --el-bg-color-overlay: #151b2a;
  --el-border-color-light: rgba(255, 255, 255, 0.1);
  --el-text-color-regular: #cbd5e1;

  border-color: rgba(255, 255, 255, 0.1);
  background: #151b2a;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
}

:global(.chat-character-dropdown--dark .el-dropdown-menu) {
  background: transparent;
}

:global(.chat-character-dropdown--dark .el-dropdown-menu__item) {
  color: #cbd5e1;
}

:global(.chat-character-dropdown--dark .el-dropdown-menu__item:hover),
:global(.chat-character-dropdown--dark .el-dropdown-menu__item:focus) {
  background: rgba(124, 58, 237, 0.16);
  color: #f1f5f9;
}

:global(.chat-character-dropdown--dark .el-dropdown-menu__item--divided) {
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.chat-character-dropdown--dark .el-popper__arrow::before) {
  border-color: rgba(255, 255, 255, 0.1);
  background: #151b2a;
}

:global(.chat-tooltip--light.el-popper) {
  --el-bg-color-overlay: #ffffff;
  --el-border-color-light: #d1d5db;
  --el-text-color-regular: #1f2937;

  border-color: #d1d5db !important;
  background: #ffffff !important;
  color: #1f2937 !important;
}

:global(.chat-tooltip--light .el-popper__arrow::before) {
  border-color: #d1d5db !important;
  background: #ffffff !important;
}

:global(.chat-tooltip--dark.el-popper) {
  --el-bg-color-overlay: #151b2a;
  --el-border-color-light: rgba(255, 255, 255, 0.12);
  --el-text-color-regular: #e2e8f0;

  border-color: rgba(255, 255, 255, 0.12) !important;
  background: #151b2a !important;
  color: #e2e8f0 !important;
}

:global(.chat-tooltip--dark .el-popper__arrow::before) {
  border-color: rgba(255, 255, 255, 0.12) !important;
  background: #151b2a !important;
}

:global(::view-transition-old(root)),
:global(::view-transition-new(root)) {
  animation: none;
}
</style>
