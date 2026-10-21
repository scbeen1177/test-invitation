const MAP_URL = "https://map.naver.com/p/search/%EB%8D%94%EC%97%90%EC%8A%A4%EB%B9%84%20%EC%9B%A8%EB%94%A9%EC%BB%A8%EB%B2%A4%EC%85%98";

const posts = [
  { image: "./assets/hero.jpg", caption: "서로의 가장 좋은 계절이 되어, 같은 방향으로 걷기로 했습니다.", likes: 184 },
  { image: "./assets/couple-01.jpg", caption: "우리의 새로운 시작을 가장 가까운 곳에서 함께해 주세요.", likes: 172 },
  { image: "./assets/couple-02.jpg", caption: "봄빛이 머무는 보라매공원에서, 소중한 걸음으로 만나요.", likes: 203 },
  { image: "./assets/couple-02.jpg", caption: "좋아하는 것을 닮아가며 오래오래 함께 걷겠습니다.", likes: 227 },
  { image: "./assets/detail-01.jpg", caption: "두 손을 맞잡고 약속하는 날.", likes: 198 },
  { image: "./assets/detail-02.jpg", caption: "꽃으로 전하는 우리의 마음을 받아주세요.", likes: 166 },
  { image: "./assets/venue-02.jpg", caption: "초록빛 사이에서 시작되는 우리의 봄날.", likes: 191 },
  { image: "./assets/couple-03.jpg", caption: "오늘보다 더 사랑하는 내일을 함께 만들겠습니다.", likes: 241 },
  { image: "./assets/hero.jpg", caption: "2027. 03. 27 SAT · AM 11:00 · save the date", likes: 154, design: true }
];

const grid = document.querySelector("#accountFeedGrid");
const lightbox = document.querySelector("#feedLightbox");
const lightboxImage = document.querySelector("#feedLightboxImage");
const toast = document.querySelector("#feedToast");
const followButton = document.querySelector("#followButton");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.showModal();
}

function renderGrid() {
  grid.replaceChildren();
  posts.forEach((post, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "feed-puzzle__tile";
    button.setAttribute("aria-label", `${index + 1}번째 피드 사진 크게 보기`);

    if (post.design) {
      button.classList.add("feed-puzzle__tile--design");
      const design = document.createElement("span");
      design.innerHTML = "<small>SAVE THE DATE</small><strong>J <i>&amp;</i> C</strong><em>2027. 03. 27</em>";
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
    button.addEventListener("click", () => openLightbox(post.image, post.caption));
    grid.append(button);
  });
}

async function shareFeed() {
  const data = {
    title: "junho.chaebeen · Wedding Feed",
    text: "손준호와 남채빈의 결혼식에 초대합니다.",
    url: window.location.href
  };
  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("피드 링크를 복사했어요.");
  } catch {
    showToast("주소창의 링크를 복사해 주세요.");
  }
}

document.querySelector("#feedBackButton").addEventListener("click", () => {
  if (sessionStorage.getItem("invitation-feed-origin") === "true") {
    window.history.back();
  } else {
    window.location.assign("./index.html");
  }
});

document.querySelector("#feedHomeButton").addEventListener("click", () => {
  window.location.assign("./index.html#top");
});

document.querySelectorAll("[data-share]").forEach((button) => {
  button.addEventListener("click", shareFeed);
});

document.querySelectorAll("[data-map]").forEach((button) => {
  button.addEventListener("click", () => window.open(MAP_URL, "_blank", "noopener,noreferrer"));
});

document.querySelectorAll("[data-navigate]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.navigate === "calendar" ? "top" : "details";
    window.location.assign(`./index.html#${target}`);
  });
});

followButton.classList.toggle("is-following", localStorage.getItem("wedding-following") === "true");
followButton.textContent = followButton.classList.contains("is-following") ? "팔로잉" : "팔로우";
followButton.addEventListener("click", () => {
  const following = followButton.classList.toggle("is-following");
  followButton.textContent = following ? "팔로잉" : "팔로우";
  localStorage.setItem("wedding-following", String(following));
});

document.querySelectorAll("[data-highlight]").forEach((button) => {
  button.addEventListener("click", () => {
    const src = button.querySelector("img").src;
    openLightbox(src, button.querySelector("small").textContent);
  });
});

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.tab === "saved") {
      showToast("저장한 게시물이 아직 없어요.");
      return;
    }
    document.querySelectorAll("[data-tab]").forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  });
});

document.querySelector("[data-close-lightbox]").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target === lightboxImage) lightbox.close();
});

renderGrid();
