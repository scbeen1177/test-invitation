const feedStories = [
  {
    image: "./images/KakaoTalk_20261025_205325815.jpg",
    time: "오늘",
    small: "WE'RE GETTING MARRIED",
    title: "우리, 결혼합니다",
    text: "서로의 가장 좋은 계절이 되어<br>같은 방향으로 걷기로 했습니다.",
    date: "2027. 03. 27 · SAT · 11 AM"
  },
  {
    image: "./images/KakaoTalk_20261025_205325815_03.jpg",
    time: "결혼식 날짜",
    small: "THE WEDDING DAY",
    title: "2027. 03. 27.",
    text: "토요일 오전 11시<br>소중한 걸음으로 함께해 주세요.",
    date: "SATURDAY, 11:00 AM"
  },
  {
    image: "./images/KakaoTalk_20261025_205325815_02.jpg",
    time: "예식 안내",
    small: "CEREMONY",
    title: "AM 11:00",
    text: "예식은 더에스비 웨딩홀 3층에서<br>오전 11시에 시작됩니다.",
    date: "PLEASE ARRIVE 20 MIN EARLY"
  },
  {
    image: "./assets/couple-02.jpg",
    time: "오시는 길",
    small: "THE VENUE",
    title: "더에스비 웨딩홀",
    text: "서울 동작구 보라매로5길 15<br>전문건설회관 3층",
    date: "BORAMAE PARK · SEOUL"
  },
  {
    image: "./assets/venue-01.jpg",
    time: "장소 안내",
    small: "LOCATION",
    title: "보라매공원 옆",
    text: "지도 버튼을 눌러 정확한 위치를<br>확인하실 수 있어요.",
    date: "SEOUL · BORAMAE"
  },
  {
    image: "./images/KakaoTalk_20261025_205325815_09.jpg",
    time: "우리의 초대",
    small: "WITH LOVE",
    title: "함께해 주세요",
    text: "우리의 첫날을 빛내 주실<br>소중한 분들을 초대합니다.",
    date: "JUNHO & CHAEBEEN · 2027"
  }
];

function ensureFeedStoryDialog() {
  if (document.querySelector("#storyDialog")) return;
  const dialog = document.createElement("dialog");
  dialog.className = "story-dialog";
  dialog.id = "storyDialog";
  dialog.innerHTML = `
    <div class="story-viewer">
      <div class="story-progress" id="storyProgress" aria-hidden="true"></div>
      <div class="story-viewer__header">
        <div class="story-viewer__profile">
          <img src="./images/KakaoTalk_20261025_205325815.jpg" alt="">
          <div>
            <span class="story-account">junho.chaebeen</span>
            <span id="storyTime">방금 전</span>
          </div>
        </div>
        <div class="story-viewer__actions">
          <button class="story-viewer__menu" type="button" data-story-menu aria-label="스토리 메뉴 열기">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
          <button class="story-viewer__close" type="button" data-close-story aria-label="스토리 닫기">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
      </div>
      <img class="story-viewer__image" id="storyImage" src="./images/KakaoTalk_20261025_205325815.jpg" alt="웨딩 스토리 사진">
      <div class="story-viewer__shade"></div>
      <div class="story-viewer__content" id="storyContent"></div>
      <button class="story-viewer__reply" type="button" data-story-message>메시지 보내기...</button>
      <div class="story-viewer__reactions" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M20.8 4.6c-2.2-2.2-5.8-2.2-8 0L12 5.4l-.8-.8a5.7 5.7 0 0 0-8 8L12 21l8.8-8.4a5.7 5.7 0 0 0 0-8Z"/></svg>
        <svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.4 9.4 0 0 1-3.8-.8L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5Z"/></svg>
        <svg viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg>
      </div>
      <button class="story-viewer__tap story-viewer__tap--prev" type="button" data-story-step="-1" aria-label="이전 스토리"></button>
      <button class="story-viewer__tap story-viewer__tap--next" type="button" data-story-step="1" aria-label="다음 스토리"></button>
    </div>
  `;
  document.body.append(dialog);
}

ensureFeedStoryDialog();

const feedStoryDialog = document.querySelector("#storyDialog");
const feedStoryImage = document.querySelector("#storyImage");
const feedStoryTime = document.querySelector("#storyTime");
const feedStoryContent = document.querySelector("#storyContent");
const feedStoryProgress = document.querySelector("#storyProgress");
let feedStoryIndex = 0;
let feedStoryTimer = null;

function buildFeedStoryProgress() {
  feedStoryProgress.replaceChildren();
  feedStories.forEach(() => {
    feedStoryProgress.append(document.createElement("span"));
  });
}

function renderFeedStory() {
  const story = feedStories[feedStoryIndex];
  feedStoryImage.src = story.image;
  feedStoryTime.textContent = story.time;
  feedStoryContent.innerHTML = `
    <small>${story.small}</small>
    <h2>${story.title}</h2>
    <p>${story.text}</p>
    <span class="story-date">${story.date}</span>
  `;
  feedStoryImage.animate(
    [{ transform: "scale(1.035)" }, { transform: "scale(1)" }],
    { duration: 5400, easing: "ease-out", fill: "both" }
  );
  [...feedStoryProgress.children].forEach((bar, index) => {
    bar.classList.remove("is-active", "is-complete");
    if (index < feedStoryIndex) bar.classList.add("is-complete");
    if (index === feedStoryIndex) bar.classList.add("is-active");
  });
}

function startFeedStoryTimer() {
  window.clearTimeout(feedStoryTimer);
  feedStoryTimer = window.setTimeout(() => {
    if (!feedStoryDialog.open) return;
    if (feedStoryIndex < feedStories.length - 1) {
      feedStoryIndex += 1;
      renderFeedStory();
      startFeedStoryTimer();
    } else {
      feedStoryDialog.close();
    }
  }, 7000);
}

function openFeedStory(index = 0) {
  feedStoryIndex = Math.max(0, Math.min(index, feedStories.length - 1));
  renderFeedStory();
  feedStoryDialog.showModal();
  startFeedStoryTimer();
}

function stepFeedStory(direction) {
  const next = feedStoryIndex + direction;
  if (next < 0) {
    renderFeedStory();
    startFeedStoryTimer();
    return;
  }
  if (next >= feedStories.length) {
    feedStoryDialog.close();
    return;
  }
  feedStoryIndex = next;
  renderFeedStory();
  startFeedStoryTimer();
}

buildFeedStoryProgress();
window.openFeedStory = openFeedStory;

document.querySelector("[data-close-story]").addEventListener("click", () => feedStoryDialog.close());
document.querySelectorAll("[data-story-step]").forEach((button) => {
  button.addEventListener("click", () => stepFeedStory(Number(button.dataset.storyStep)));
});
document.querySelector("[data-story-message]").addEventListener("click", () => {
  feedStoryDialog.close();
  window.location.assign(window.feedStoryMessageUrl || "./message.html?from=feed");
});
document.querySelector("[data-story-menu]").addEventListener("click", () => {
  const toast = document.querySelector("#feedToast");
  toast.textContent = "스토리는 좌우를 눌러 넘길 수 있어요.";
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
});
feedStoryDialog.addEventListener("close", () => {
  window.clearTimeout(feedStoryTimer);
  [...feedStoryProgress.children].forEach((bar) => bar.classList.remove("is-active"));
});
feedStoryDialog.addEventListener("click", (event) => {
  if (event.target === feedStoryDialog) feedStoryDialog.close();
});
