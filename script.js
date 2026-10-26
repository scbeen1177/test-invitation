const WEDDING = {
  groom: "손준호",
  bride: "남채빈",
  dateISO: "2027-03-27T11:00:00+09:00",
  dateLabel: "2027년 3월 27일 토요일 오전 11시",
  locationTitle: "더에스비 웨딩홀",
  locationShort: "보라매공원 · 더에스비 웨딩홀",
  locationDetail: "서울 동작구 보라매로5길 15\n전문건설회관 3층",
  mapUrl: "https://map.naver.com/p/search/%EB%8D%94%EC%97%90%EC%8A%A4%EB%B9%84%20%EC%9B%A8%EB%94%A9%EC%BB%A8%EB%B2%A4%EC%85%98",
  parents: "혼주 소개는 준비 중입니다"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const elements = {
  carousel: $("#postCarousel"),
  track: $("#carouselTrack"),
  dots: $("#carouselDots"),
  prev: $(".carousel__arrow--prev"),
  next: $(".carousel__arrow--next"),
  heartBurst: $("#heartBurst"),
  likeButton: $("#likeButton"),
  headerLikeButton: $("#headerLikeButton"),
  likeCount: $("#likeCount"),
  saveButton: $("#saveButton"),
  shareButton: $("#shareButton"),
  commentButton: $("#commentButton"),
  commentPreview: $("#commentPreview"),
  commentCountText: $("#commentCountText"),
  storyDialog: $("#storyDialog"),
  storyImage: $("#storyImage"),
  storyContent: $("#storyContent"),
  storyTime: $("#storyTime"),
  lightboxDialog: $("#lightboxDialog"),
  lightboxImage: $("#lightboxImage"),
  feedDialog: $("#feedDialog"),
  feedProfile: $("#feedProfile"),
  feedPostView: $("#feedPostView"),
  feedPuzzle: $("#feedPuzzle"),
  feedPostImage: $("#feedPostImage"),
  feedPostCaption: $("#feedPostCaption"),
  feedPostLikes: $("#feedPostLikes"),
  feedPostComments: $("#feedPostComments"),
  feedPostTime: $("#feedPostTime"),
  feedLikeButton: $("#feedLikeButton"),
  followButton: $("#followButton"),
  commentDialog: $("#commentDialog"),
  menuDialog: $("#menuDialog"),
  commentForm: $("#commentForm"),
  guestName: $("#guestName"),
  guestMessage: $("#guestMessage"),
  messageLength: $("#messageLength"),
  savedComments: $("#savedComments"),
  toast: $("#toast")
};

const state = {
  slide: 0,
  likes: getStoredNumber("wedding-liked", 184),
  liked: localStorage.getItem("wedding-liked-state") === "true",
  saved: localStorage.getItem("wedding-saved-state") === "true",
  story: 0,
  lastTap: 0,
  didSwipe: false,
  feedPost: 0,
  feedScrollY: 0,
  feedLikedPosts: new Set(getStoredFeedLikes()),
  following: localStorage.getItem("wedding-following") === "true",
  profileTimer: null,
  toastTimer: null,
  storyTimer: null
};

const stories = [
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

const feedPosts = [
  {
    image: "./images/puzzle/tile-01.jpg",
    caption: "a lifetime of us",
    likes: 184,
    comments: 12,
    time: "2027년 3월 27일"
  },
  {
    image: "./images/puzzle/tile-02.jpg",
    caption: "JUNHO & CHAEBEEN",
    likes: 172,
    comments: 8,
    time: "2027년 3월 27일"
  },
  {
    image: "./images/puzzle/tile-03.jpg",
    caption: "27 . 03 . 2027",
    likes: 203,
    comments: 15,
    time: "2027년 3월 27일"
  },
  {
    image: "./images/puzzle/tile-04.jpg",
    caption: "우리의 가장 아름다운 봄",
    likes: 227,
    comments: 21,
    time: "2027년 3월 27일"
  },
  {
    image: "./images/puzzle/tile-05.jpg",
    caption: "서로를 바라보는 순간",
    likes: 198,
    comments: 11,
    time: "2027년 3월 27일"
  },
  {
    image: "./images/puzzle/tile-06.jpg",
    caption: "함께라서 더 빛나는 날",
    likes: 166,
    comments: 7,
    time: "2027년 3월 27일"
  },
  {
    image: "./images/puzzle/tile-07.jpg",
    caption: "손끝에 전해지는 마음",
    likes: 191,
    comments: 10,
    time: "2027년 3월 27일"
  },
  {
    image: "./images/puzzle/tile-08.jpg",
    caption: "같은 방향으로 걷는 우리",
    likes: 241,
    comments: 24,
    time: "2027년 3월 27일"
  },
  {
    image: "./images/puzzle/tile-09.jpg",
    caption: "a lifetime of us · to be continued",
    likes: 154,
    comments: 6,
    time: "2027년 3월 27일"
  }
];

function applyWeddingConfig() {
  $$("[data-location-title]").forEach((node) => {
    node.textContent = WEDDING.locationTitle;
  });
  $$("[data-location-detail]").forEach((node) => {
    node.innerHTML = "";
    WEDDING.locationDetail.split("\n").forEach((line, index) => {
      if (index) node.append(document.createElement("br"));
      node.append(document.createTextNode(line));
    });
  });
  $$("[data-location-short]").forEach((node) => {
    node.textContent = WEDDING.locationShort;
  });
  $$("[data-parents]").forEach((node) => {
    node.textContent = WEDDING.parents;
  });
}

function getStoredNumber(key, fallback) {
  const stored = Number(localStorage.getItem(key));
  return Number.isFinite(stored) && localStorage.getItem(key) !== null ? stored : fallback;
}

function getStoredFeedLikes() {
  try {
    const likes = JSON.parse(localStorage.getItem("wedding-feed-likes") || "[]");
    return Array.isArray(likes) ? likes.filter((index) => Number.isInteger(index)) : [];
  } catch {
    return [];
  }
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2600);
}

function setupCarousel() {
  const slides = $$(".carousel__slide", elements.track);

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `${index + 1}번째 사진`);
    dot.addEventListener("click", () => goToSlide(index));
    elements.dots.append(dot);
  });

  function goToSlide(index) {
    state.slide = Math.max(0, Math.min(index, slides.length - 1));
    elements.track.style.transform = `translateX(-${state.slide * 100}%)`;
    $$("button", elements.dots).forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === state.slide);
      dot.setAttribute("aria-current", dotIndex === state.slide ? "true" : "false");
    });
    elements.prev.hidden = state.slide === 0;
    elements.next.hidden = state.slide === slides.length - 1;
  }

  elements.prev.addEventListener("click", () => goToSlide(state.slide - 1));
  elements.next.addEventListener("click", () => goToSlide(state.slide + 1));
  goToSlide(0);

  let startX = 0;
  let startY = 0;
  let isDragging = false;

  elements.carousel.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    startY = event.clientY;
    isDragging = true;
  });

  elements.carousel.addEventListener("pointerup", (event) => {
    if (!isDragging) return;
    isDragging = false;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      state.didSwipe = true;
      goToSlide(state.slide + (deltaX < 0 ? 1 : -1));
      window.setTimeout(() => {
        state.didSwipe = false;
      }, 0);
    }
  });

  elements.carousel.addEventListener("pointercancel", () => {
    isDragging = false;
  });

  elements.carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") goToSlide(state.slide + 1);
    if (event.key === "ArrowLeft") goToSlide(state.slide - 1);
  });
}

function persistLikes() {
  localStorage.setItem("wedding-liked", String(state.likes));
  localStorage.setItem("wedding-liked-state", String(state.liked));
  elements.likeCount.textContent = state.likes.toLocaleString("ko-KR");
  [elements.likeButton, elements.headerLikeButton].forEach((button) => {
    button.classList.toggle("is-liked", state.liked);
    button.setAttribute("aria-pressed", String(state.liked));
    button.setAttribute("aria-label", state.liked ? "좋아요 취소" : "좋아요");
  });
}

function setLiked(nextValue, showBurst = false) {
  if (state.liked === nextValue) {
    if (showBurst) animateHeartBurst();
    return;
  }
  state.liked = nextValue;
  state.likes += nextValue ? 1 : -1;
  persistLikes();
  if (showBurst) animateHeartBurst();
}

function animateHeartBurst() {
  elements.heartBurst.classList.remove("is-visible");
  void elements.heartBurst.offsetWidth;
  elements.heartBurst.classList.add("is-visible");
}

function setupPostInteractions() {
  elements.likeButton.addEventListener("click", () => setLiked(!state.liked));
  elements.headerLikeButton.addEventListener("click", () => setLiked(!state.liked));

  elements.carousel.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    if (state.didSwipe) {
      state.didSwipe = false;
      return;
    }
    const now = Date.now();
    if (now - state.lastTap < 320) {
      window.clearTimeout(state.profileTimer);
      setLiked(true, true);
      state.lastTap = 0;
      return;
    }
    state.lastTap = now;
    window.clearTimeout(state.profileTimer);
    state.profileTimer = window.setTimeout(() => {
      if (!state.lastTap) return;
      state.lastTap = 0;
      openFeed();
    }, 330);
  });

  state.saved = localStorage.getItem("wedding-saved-state") === "true";
  elements.saveButton.classList.toggle("is-saved", state.saved);
  elements.saveButton.setAttribute("aria-pressed", String(state.saved));
  elements.saveButton.addEventListener("click", () => {
    state.saved = !state.saved;
    localStorage.setItem("wedding-saved-state", String(state.saved));
    elements.saveButton.classList.toggle("is-saved", state.saved);
    elements.saveButton.setAttribute("aria-pressed", String(state.saved));
    showToast(state.saved ? "청첩장을 저장했어요." : "저장을 취소했어요.");
  });

  persistLikes();
}

function createCalendarFile() {
  const start = new Date(WEDDING.dateISO);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const escapeIcs = (text) => String(text).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Junho Chaebeen Wedding//KO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:junho-chaebeen-wedding-${start.getTime()}@invitation`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeIcs(`손준호 ♥ 남채빈 결혼식`)}`,
    `DESCRIPTION:${escapeIcs(`손준호와 남채빈의 결혼식에 초대합니다.\n${WEDDING.dateLabel}\n${WEDDING.locationDetail}`)}`,
    `LOCATION:${escapeIcs(WEDDING.locationTitle)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs("내일은 손준호 ♥ 남채빈의 결혼식입니다.")}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "junho-chaebeen-wedding.ics";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function saveCalendar() {
  closeOpenDialogs();
  createCalendarFile();
  showToast("캘린더 파일을 내려받았어요.");
}

async function copyLink() {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    showToast("청첩장 링크를 복사했어요.");
  } catch {
    const input = document.createElement("textarea");
    input.value = url;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    showToast("청첩장 링크를 복사했어요.");
  }
}

async function shareInvitation() {
  closeOpenDialogs();
  const shareData = {
    title: "손준호 ♥ 남채빈의 결혼식에 초대합니다",
    text: `2027년 3월 27일 토요일 오전 11시\n${WEDDING.locationShort}`,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  await copyLink();
}

function setupCountdown() {
  const target = new Date(WEDDING.dateISO).getTime();
  const nodes = {
    days: $("[data-countdown='days']"),
    hours: $("[data-countdown='hours']"),
    minutes: $("[data-countdown='minutes']")
  };

  function update() {
    const remaining = target - Date.now();
    if (remaining <= 0) {
      nodes.days.textContent = "000";
      nodes.hours.textContent = "00";
      nodes.minutes.textContent = "00";
      $("#countdown").setAttribute("aria-label", "결혼식이 지났습니다");
      return;
    }
    const totalMinutes = Math.floor(remaining / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    nodes.days.textContent = String(days).padStart(3, "0");
    nodes.hours.textContent = String(hours).padStart(2, "0");
    nodes.minutes.textContent = String(minutes).padStart(2, "0");
    $("#countdown").setAttribute("aria-label", `결혼식까지 ${days}일 ${hours}시간 ${minutes}분 남았습니다`);
  }

  update();
  window.setInterval(update, 30000);
}

function setupStoryDday() {
  const button = $("#storyDdayButton");
  const number = $("#storyDdayNumber");
  const caption = $("#storyDdayCaption");
  const label = $("#storyDdayLabel");
  if (!button || !number || !caption || !label) return;
  const seoulDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const weddingDate = WEDDING.dateISO.slice(0, 10).split("-").map(Number);
  const weddingDay = Date.UTC(weddingDate[0], weddingDate[1] - 1, weddingDate[2]);

  function update() {
    const parts = Object.fromEntries(
      seoulDate.formatToParts(new Date())
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, part.value])
    );
    const today = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
    const daysLeft = Math.round((weddingDay - today) / 86400000);

    if (daysLeft > 0) {
      number.textContent = `D-${daysLeft}`;
      caption.textContent = "TO GO";
      label.textContent = "D-DAY";
      button.setAttribute("aria-label", `결혼식까지 ${daysLeft}일 남았습니다. 캘린더에 저장하기`);
    } else if (daysLeft === 0) {
      number.textContent = "D-DAY";
      caption.textContent = "TODAY";
      label.textContent = "TODAY";
      button.setAttribute("aria-label", "오늘은 결혼식 날입니다. 캘린더에 저장하기");
    } else {
      number.textContent = `D+${Math.abs(daysLeft)}`;
      caption.textContent = "WITH LOVE";
      label.textContent = "WEDDING";
      button.setAttribute("aria-label", `결혼식 후 ${Math.abs(daysLeft)}일이 지났습니다. 일정 보기`);
    }

    const remainingForRing = Math.max(0, Math.min(daysLeft, 365));
    const progress = daysLeft > 0 ? ((365 - remainingForRing) / 365) * 360 : 360;
    button.style.setProperty("--dday-progress", `${progress.toFixed(1)}deg`);
  }

  update();
  window.setInterval(update, 60000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") update();
  });
}

function setupWeddingCalendar() {
  const container = $("#weddingCalendarDays");
  if (!container) return;

  const [year, month, weddingDayNumber] = WEDDING.dateISO.slice(0, 10).split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < firstWeekday; index += 1) {
    const emptyDay = document.createElement("span");
    emptyDay.className = "is-empty";
    emptyDay.setAttribute("aria-hidden", "true");
    fragment.append(emptyDay);
  }

  for (let day = 1; day <= lastDay; day += 1) {
    const dayCell = document.createElement("span");
    dayCell.textContent = String(day);
    dayCell.setAttribute("role", "gridcell");
    dayCell.setAttribute("aria-label", `${year}년 ${month}월 ${day}일`);
    if (day === weddingDayNumber) {
      dayCell.classList.add("is-wedding");
      dayCell.setAttribute("aria-current", "date");
      dayCell.setAttribute("aria-label", `${year}년 ${month}월 ${day}일, 결혼식`);
    }
    fragment.append(dayCell);
  }

  container.replaceChildren(fragment);
}

function openStory(index) {
  state.story = Math.max(0, Math.min(index, stories.length - 1));
  window.clearTimeout(state.storyTimer);
  renderStory();
  elements.storyDialog.showModal();
  startStoryTimer();
}

function renderStory() {
  const story = stories[state.story];
  elements.storyImage.src = story.image;
  elements.storyTime.textContent = story.time;
  elements.storyContent.innerHTML = `
    <small>${story.small}</small>
    <h2>${story.title}</h2>
    <p>${story.text}</p>
    <span class="story-date">${story.date}</span>
  `;
  elements.storyImage.animate(
    [{ transform: "scale(1.035)" }, { transform: "scale(1)" }],
    { duration: 5400, easing: "ease-out", fill: "both" }
  );
  $$(".story-progress span").forEach((bar, index) => {
    bar.classList.remove("is-active", "is-complete");
    if (index < state.story) bar.classList.add("is-complete");
    if (index === state.story) bar.classList.add("is-active");
  });
}

function buildStoryProgress() {
  const progress = $("#storyProgress");
  if (!progress) return;
  progress.replaceChildren();
  stories.forEach(() => {
    progress.append(document.createElement("span"));
  });
}

function startStoryTimer() {
  window.clearTimeout(state.storyTimer);
  state.storyTimer = window.setTimeout(() => {
    if (!elements.storyDialog.open) return;
    if (state.story < stories.length - 1) {
      state.story += 1;
      renderStory();
      startStoryTimer();
    } else {
      elements.storyDialog.close();
    }
  }, 7000);
}

function stepStory(direction) {
  const next = state.story + direction;
  if (next < 0) {
    renderStory();
    startStoryTimer();
    return;
  }
  if (next >= stories.length) {
    elements.storyDialog.close();
    return;
  }
  state.story = next;
  renderStory();
  startStoryTimer();
}

function setupDialogs() {
  buildStoryProgress();
  $$("[data-story]").forEach((button) => {
    button.addEventListener("click", () => {
      if (elements.feedDialog.open) elements.feedDialog.close();
      openStory(Number(button.dataset.story));
    });
  });
  $$("[data-story-step]").forEach((button) => {
    button.addEventListener("click", () => stepStory(Number(button.dataset.storyStep)));
  });
  $("[data-close-story]").addEventListener("click", () => elements.storyDialog.close());
  $$("[data-open-message]").forEach((button) => {
    button.addEventListener("click", () => {
      elements.storyDialog.close();
      window.location.assign("./message.html?from=index");
    });
  });
  elements.storyDialog.addEventListener("close", () => {
    window.clearTimeout(state.storyTimer);
    $$(".story-progress span").forEach((bar) => bar.classList.remove("is-active"));
  });
  elements.storyDialog.addEventListener("click", (event) => {
    if (event.target === elements.storyDialog) elements.storyDialog.close();
  });

  $$("[data-lightbox]").forEach((button) => {
    button.addEventListener("click", () => {
      const thumbnail = $("img", button);
      elements.lightboxImage.src = button.dataset.lightbox;
      elements.lightboxImage.alt = thumbnail?.alt || "확대한 웨딩 사진";
      elements.lightboxDialog.showModal();
    });
  });
  $("[data-close-lightbox]").addEventListener("click", () => elements.lightboxDialog.close());
  elements.lightboxDialog.addEventListener("click", (event) => {
    if (event.target === elements.lightboxDialog || event.target === elements.lightboxImage) {
      elements.lightboxDialog.close();
    }
  });

  $$("[data-close-sheet]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
  });

  [elements.commentDialog, elements.menuDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

function closeOpenDialogs() {
  $$("dialog[open]").forEach((dialog) => dialog.close());
}

function openCommentSheet() {
  if (elements.feedDialog.open) elements.feedDialog.close();
  elements.commentDialog.showModal();
  window.setTimeout(() => elements.guestMessage.focus(), 100);
}

function renderFeedGrid() {
  elements.feedPuzzle.replaceChildren();
  feedPosts.forEach((post, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "feed-puzzle__tile";
    button.setAttribute("aria-label", `${index + 1}번째 피드 게시물 보기`);

    if (post.design) {
      button.classList.add("feed-puzzle__tile--design");
      const design = document.createElement("span");
      design.innerHTML = `<small>SAVE THE DATE</small><strong>J <i>&amp;</i> C</strong><em>2027. 03. 27</em>`;
      button.append(design);
    } else {
      const image = document.createElement("img");
      image.src = post.image;
      image.alt = post.caption;
      image.loading = "lazy";
      button.append(image);
    }

    const meta = document.createElement("span");
    meta.className = "feed-puzzle__meta";
    meta.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6c-2.2-2.2-5.8-2.2-8 0L12 5.4l-.8-.8a5.7 5.7 0 0 0-8 8L12 21l8.8-8.4a5.7 5.7 0 0 0 0-8Z"/></svg><b>${post.likes}</b>`;
    button.append(meta);
    button.addEventListener("click", () => openFeedPost(index));
    elements.feedPuzzle.append(button);
  });
}

function closeFeedPost() {
  elements.feedPostView.classList.remove("is-open");
  elements.feedProfile.classList.remove("is-behind");
}

function openFeed() {
  sessionStorage.setItem("invitation-feed-origin", "true");
  window.location.assign("./feed.html");
}

function lockPageForFeed() {
  const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  document.documentElement.style.setProperty("--feed-scrollbar-gap", `${scrollbarGap}px`);
  document.documentElement.classList.add("feed-modal-open");
  document.body.classList.add("feed-modal-open");
}

function unlockPageForFeed() {
  document.documentElement.classList.remove("feed-modal-open");
  document.body.classList.remove("feed-modal-open");
  document.documentElement.style.removeProperty("--feed-scrollbar-gap");
}

function restorePageScroll(scrollY) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  const restore = () => window.scrollTo(0, scrollY);
  restore();
  requestAnimationFrame(restore);
  window.setTimeout(restore, 60);
  window.setTimeout(() => {
    root.style.scrollBehavior = previousBehavior;
  }, 80);
}

function openWeddingMap() {
  if (!WEDDING.mapUrl) {
    showToast("지도 링크를 준비 중입니다.");
    return;
  }
  closeOpenDialogs();
  window.open(WEDDING.mapUrl, "_blank", "noopener,noreferrer");
}

function updateFeedLikeButton() {
  const post = feedPosts[state.feedPost];
  const liked = state.feedLikedPosts.has(state.feedPost);
  elements.feedLikeButton.classList.toggle("is-liked", liked);
  elements.feedLikeButton.setAttribute("aria-pressed", String(liked));
  elements.feedLikeButton.setAttribute("aria-label", liked ? "좋아요 취소" : "좋아요");
  elements.feedPostLikes.textContent = (post.likes + (liked ? 1 : 0)).toLocaleString("ko-KR");
}

function openFeedPost(index) {
  state.feedPost = index;
  const post = feedPosts[index];
  elements.feedPostImage.src = post.image;
  elements.feedPostImage.alt = post.caption;
  elements.feedPostCaption.textContent = post.caption;
  elements.feedPostTime.textContent = post.time;
  elements.feedPostComments.textContent = `축하 댓글 ${post.comments}개 모두 보기`;
  updateFeedLikeButton();
  elements.feedProfile.classList.add("is-behind");
  elements.feedPostView.classList.add("is-open");
  $(".feed-post-view__scroll", elements.feedDialog).scrollTop = 0;
}

function setupFeedInteractions() {
  $$("[data-feed-open]").forEach((button) => {
    button.addEventListener("click", openFeed);
  });

  $$("[data-account-feed]").forEach((button) => {
    button.addEventListener("click", () => {
      closeOpenDialogs();
      openFeed();
    });
  });

  $$("[data-feed-home]").forEach((button) => {
    button.addEventListener("click", () => {
      closeFeedPost();
      $(".feed-profile__scroll", elements.feedDialog).scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  $$("[data-close-feed]").forEach((button) => {
    button.addEventListener("click", () => elements.feedDialog.close());
  });

  $("[data-close-feed-post]").addEventListener("click", closeFeedPost);

  elements.feedDialog.addEventListener("click", (event) => {
    if (event.target === elements.feedDialog) elements.feedDialog.close();
  });

  elements.feedDialog.addEventListener("close", () => {
    closeFeedPost();
    unlockPageForFeed();
    restorePageScroll(state.feedScrollY);
  });

  elements.feedLikeButton.addEventListener("click", () => {
    if (state.feedLikedPosts.has(state.feedPost)) {
      state.feedLikedPosts.delete(state.feedPost);
    } else {
      state.feedLikedPosts.add(state.feedPost);
    }
    localStorage.setItem("wedding-feed-likes", JSON.stringify([...state.feedLikedPosts]));
    updateFeedLikeButton();
  });

  $$("[data-feed-comment]").forEach((button) => {
    button.addEventListener("click", openCommentSheet);
  });

  $("#feedMessageButton").addEventListener("click", openCommentSheet);

  elements.followButton.classList.toggle("is-following", state.following);
  elements.followButton.textContent = state.following ? "팔로잉" : "팔로우";
  elements.followButton.addEventListener("click", () => {
    state.following = !state.following;
    localStorage.setItem("wedding-following", String(state.following));
    elements.followButton.classList.toggle("is-following", state.following);
    elements.followButton.textContent = state.following ? "팔로잉" : "팔로우";
  });

  $$("[data-feed-highlight]").forEach((button) => {
    button.addEventListener("click", () => {
      const storyIndex = Number(button.dataset.feedHighlight);
      elements.feedDialog.close();
      openStory(storyIndex);
    });
  });

  $("[data-feed-location]").addEventListener("click", () => {
    elements.feedDialog.close();
    $("#details").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $$("[data-feed-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.feedTab === "saved") {
        showToast("퍼즐 피드의 게시물을 눌러 감상해 보세요.");
        return;
      }
      $$("[data-feed-tab]").forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
      });
    });
  });

  const venuePost = $(".social-post--venue");
  venuePost.addEventListener("click", (event) => {
    if (event.target.closest("button, a, input, textarea, select")) return;
    openWeddingMap();
  });
}

function getComments() {
  try {
    return JSON.parse(localStorage.getItem("wedding-comments") || "[]");
  } catch {
    return [];
  }
}

function renderComments() {
  const comments = getComments();
  elements.savedComments.innerHTML = "";
  comments.slice(-4).reverse().forEach((comment) => {
    const item = document.createElement("div");
    item.className = "saved-comment";
    const name = document.createElement("strong");
    const message = document.createElement("p");
    name.textContent = comment.name || "익명";
    message.textContent = comment.message;
    item.append(name, message);
    elements.savedComments.append(item);
  });
  elements.commentCountText.textContent = `축하 댓글 ${comments.length}개`;
}

function setupComments() {
  elements.commentButton.addEventListener("click", openCommentSheet);
  elements.commentPreview.addEventListener("click", openCommentSheet);
  $$("[data-comment-open]").forEach((button) => {
    button.addEventListener("click", openCommentSheet);
  });
  elements.guestMessage.addEventListener("input", () => {
    elements.messageLength.textContent = elements.guestMessage.value.length;
  });
  elements.commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = elements.guestMessage.value.trim();
    if (!message) return;
    const comments = getComments();
    comments.push({
      name: elements.guestName.value.trim() || "익명",
      message
    });
    localStorage.setItem("wedding-comments", JSON.stringify(comments.slice(-30)));
    elements.commentForm.reset();
    elements.messageLength.textContent = "0";
    renderComments();
    showToast("축하 메시지를 남겼어요.");
  });
  renderComments();
}

function setupSocialPosts() {
  $$("[data-social-like]").forEach((button) => {
    button.addEventListener("click", () => {
      const article = button.closest(".social-post");
      const count = $("[data-social-likes]", article);
      const liked = button.classList.toggle("is-liked");
      button.setAttribute("aria-pressed", String(liked));
      button.setAttribute("aria-label", liked ? "좋아요 취소" : "좋아요");
      const current = Number(count.textContent.replace(/[^\d]/g, "")) || 0;
      count.textContent = (current + (liked ? 1 : -1)).toLocaleString("ko-KR");
    });
  });

  $$("[data-save-post]").forEach((button) => {
    button.addEventListener("click", () => {
      const saved = button.classList.toggle("is-saved");
      button.setAttribute("aria-pressed", String(saved));
      button.setAttribute("aria-label", saved ? "게시물 저장 취소" : "게시물 저장");
    });
  });
}

function setupMenu() {
  $("#moreButton").addEventListener("click", () => elements.menuDialog.showModal());
  $("#postMoreButton").addEventListener("click", () => elements.menuDialog.showModal());
  $("#newPostButton").addEventListener("click", () => showToast("새 게시물은 우리의 순간들에서 확인할 수 있어요."));
  $$("[data-menu]").forEach((button) => {
    button.addEventListener("click", () => {
      elements.storyDialog.close();
      elements.menuDialog.showModal();
    });
  });
}

function setupActions() {
  $$("[data-calendar]").forEach((button) => button.addEventListener("click", saveCalendar));
  $$("[data-share]").forEach((button) => button.addEventListener("click", shareInvitation));
  $$("[data-copy-link]").forEach((button) => {
    button.addEventListener("click", async () => {
      elements.menuDialog.close();
      await copyLink();
    });
  });
  [elements.shareButton].forEach((button) => button.addEventListener("click", shareInvitation));
  $$("[data-scroll-top]").forEach((button) => {
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  });
  $$("[data-scroll-details]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#details").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  $$("[data-map]").forEach((button) => {
    button.addEventListener("click", openWeddingMap);
  });
}

function setupReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
  items.forEach((item) => observer.observe(item));
}

function setupKeyboard() {
  document.addEventListener("keydown", (event) => {
    if (!elements.storyDialog.open) return;
    if (event.key === "ArrowRight") stepStory(1);
    if (event.key === "ArrowLeft") stepStory(-1);
  });
}

applyWeddingConfig();
setupCarousel();
setupPostInteractions();
setupCountdown();
setupStoryDday();
setupWeddingCalendar();
setupDialogs();
setupComments();
setupSocialPosts();
setupFeedInteractions();
setupMenu();
setupActions();
setupReveal();
setupKeyboard();

if (new URLSearchParams(window.location.search).get("story") === "1") {
  window.setTimeout(() => openStory(0), 120);
}
