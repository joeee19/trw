const galleryStage = document.querySelector("#galleryStage");
const envelope = document.querySelector("#envelope");
const cardToggle = document.querySelector("#cardToggle");
const toggleFromNav = document.querySelector("#toggleFromNav");
const profileButton = document.querySelector("#profileButton");
const profilePanel = document.querySelector("#profilePanel");
const unlockForm = document.querySelector("#unlockForm");
const unlockAnswer = document.querySelector("#unlockAnswer");
const unlockMessage = document.querySelector("#unlockMessage");
const privateGate = document.querySelector("#privateGate");
const privateRoom = document.querySelector("#privateRoom");
const favoriteCards = Array.from(document.querySelectorAll(".favorite-card"));
const contactForm = document.querySelector("#contactForm");
const whatsappMessage = document.querySelector("#whatsappMessage");
const photoStack = document.querySelector("#photoStack");
const cards = Array.from(document.querySelectorAll(".photo-card"));
const dotsWrap = document.querySelector("#dots");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");

let currentIndex = 0;
let startX = 0;
let startY = 0;
let isPointerDown = false;
let isInvitationOpen = false;
let didSwipe = false;
const whatsappNumber = "201205340021";

function setInvitation(open) {
  isInvitationOpen = open;
  envelope.classList.toggle("is-open", open);
  envelope.setAttribute("aria-label", open ? "Close invitation card" : "Open invitation card");
  envelope.setAttribute("aria-expanded", String(open));
  cardToggle.textContent = open ? "Close invitation" : "Open invitation";
  cardToggle.setAttribute("aria-expanded", String(open));
  toggleFromNav.textContent = open ? "Close card" : "Open card";
}

function toggleInvitation() {
  setInvitation(!isInvitationOpen);
}

function toggleProfilePanel() {
  const willOpen = !profilePanel.classList.contains("is-open");
  profilePanel.classList.toggle("is-open", willOpen);
  profilePanel.setAttribute("aria-hidden", String(!willOpen));
}

function unlockPrivateRoom(event) {
  event.preventDefault();
  const answer = unlockAnswer.value.trim().toLowerCase();

  if (answer !== "natalie" && answer !== "nato" && answer !== "natos") {
    unlockMessage.textContent = "Not yet. Hint: type Natalie.";
    unlockAnswer.focus();
    return;
  }

  unlockMessage.textContent = "";
  privateGate.classList.add("is-unlocked");
  privateRoom.classList.add("is-unlocked");
  privateRoom.setAttribute("aria-hidden", "false");
}

function sendWhatsappMessage(event) {
  event.preventDefault();
  const message = whatsappMessage.value.trim();
  const fallback = "I saw the birthday website, and I want to say something.";
  const text = encodeURIComponent(message || fallback);
  window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener");
}

function buildDots() {
  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show photo ${index + 1}`);
    dot.addEventListener("click", () => {
      const direction = index > currentIndex ? "next" : "prev";
      goToPhoto(index, direction);
    });
    dotsWrap.append(dot);
  });
}

function updateCards(flyingIndex = null, direction = "next") {
  cards.forEach((card, index) => {
    card.classList.remove(
      "is-current",
      "is-prev",
      "is-next",
      "is-flying-left",
      "is-flying-right",
    );

    if (index === flyingIndex) {
      card.classList.add(direction === "next" ? "is-flying-left" : "is-flying-right");
      return;
    }

    if (index === currentIndex) {
      card.classList.add("is-current");
    } else if (index === previousIndex(currentIndex)) {
      card.classList.add("is-prev");
    } else if (index === nextIndex(currentIndex)) {
      card.classList.add("is-next");
    }
  });

  Array.from(dotsWrap.children).forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentIndex);
  });
}

function previousIndex(index) {
  return (index - 1 + cards.length) % cards.length;
}

function nextIndex(index) {
  return (index + 1) % cards.length;
}

function goToPhoto(targetIndex, direction = "next") {
  if (targetIndex === currentIndex) return;

  const leavingIndex = currentIndex;
  currentIndex = targetIndex;
  updateCards(leavingIndex, direction);

  window.setTimeout(() => updateCards(), 520);
}

function movePhoto(direction) {
  const targetIndex = direction === "next" ? nextIndex(currentIndex) : previousIndex(currentIndex);
  goToPhoto(targetIndex, direction);
}

function onSwipeStart(event) {
  isPointerDown = true;
  const point = event.touches ? event.touches[0] : event;
  startX = point.clientX;
  startY = point.clientY;
}

function onSwipeEnd(event, callback) {
  if (!isPointerDown) return;
  isPointerDown = false;

  const point = event.changedTouches ? event.changedTouches[0] : event;
  const deltaX = point.clientX - startX;
  const deltaY = point.clientY - startY;

  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  didSwipe = true;
  callback(deltaX < 0 ? "next" : "prev");
}

envelope.addEventListener("pointerdown", onSwipeStart);
envelope.addEventListener("pointerup", (event) => onSwipeEnd(event, toggleInvitation));
envelope.addEventListener("pointercancel", () => {
  isPointerDown = false;
});
envelope.addEventListener("click", () => {
  if (didSwipe) {
    didSwipe = false;
    return;
  }
  toggleInvitation();
});
cardToggle.addEventListener("click", toggleInvitation);
toggleFromNav.addEventListener("click", toggleInvitation);
profileButton.addEventListener("click", toggleProfilePanel);
unlockForm.addEventListener("submit", unlockPrivateRoom);
contactForm.addEventListener("submit", sendWhatsappMessage);

favoriteCards.forEach((card) => {
  const toggle = card.querySelector(".favorite-toggle");
  const options = Array.from(card.querySelectorAll(".favorite-body button"));

  toggle.addEventListener("click", () => {
    card.classList.toggle("is-open");
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      option.classList.toggle("is-selected");
    });
  });
});

document.addEventListener("click", (event) => {
  if (!profilePanel.classList.contains("is-open")) return;
  if (profilePanel.contains(event.target) || profileButton.contains(event.target)) return;
  profilePanel.classList.remove("is-open");
  profilePanel.setAttribute("aria-hidden", "true");
});

photoStack.addEventListener("pointerdown", onSwipeStart);
photoStack.addEventListener("pointerup", (event) => onSwipeEnd(event, movePhoto));
photoStack.addEventListener("pointercancel", () => {
  isPointerDown = false;
});

prevButton.addEventListener("click", () => movePhoto("prev"));
nextButton.addEventListener("click", () => movePhoto("next"));

const favoriteAudio = document.querySelector("#favoriteAudio");
const audioToggle = document.querySelector("#audioToggle");
const cdDisk = document.querySelector("#cdDisk");
const songStatus = document.querySelector("#songStatus");
const songProgress = document.querySelector("#songProgress");
const songSeek = document.querySelector("#songSeek");

function updateAudioProgress() {
  if (!favoriteAudio.duration || Number.isNaN(favoriteAudio.duration)) return;
  const percent = (favoriteAudio.currentTime / favoriteAudio.duration) * 100;
  songProgress.style.width = `${percent}%`;
  songSeek.value = String(percent);
}

function updateAudioState() {
  const isPlaying = !favoriteAudio.paused && !favoriteAudio.ended;
  cdDisk.classList.toggle("is-spinning", isPlaying);
  audioToggle.textContent = isPlaying ? "Pause song" : "Play song";
  songStatus.textContent = isPlaying ? "Playing" : "Paused";
}

audioToggle.addEventListener("click", () => {
  if (favoriteAudio.paused) {
    favoriteAudio.play().catch(() => {
      songStatus.textContent = "Unable to play audio.";
    });
  } else {
    favoriteAudio.pause();
  }
});

songSeek.addEventListener("input", (event) => {
  const seekValue = Number(event.target.value);
  if (!favoriteAudio.duration || Number.isNaN(favoriteAudio.duration)) return;
  favoriteAudio.currentTime = (seekValue / 100) * favoriteAudio.duration;
  songProgress.style.width = `${seekValue}%`;
});

favoriteAudio.addEventListener("play", updateAudioState);
favoriteAudio.addEventListener("pause", updateAudioState);
favoriteAudio.addEventListener("ended", updateAudioState);
favoriteAudio.addEventListener("timeupdate", updateAudioProgress);

favoriteAudio.addEventListener("loadedmetadata", () => {
  updateAudioProgress();
  songSeek.disabled = false;
});


document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    profilePanel.classList.remove("is-open");
    profilePanel.setAttribute("aria-hidden", "true");
  }

  if (event.key === "ArrowLeft") movePhoto("prev");
  if (event.key === "ArrowRight") movePhoto("next");
});

buildDots();
updateCards();
updateAudioState();
