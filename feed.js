const MAP_URL = "https://map.naver.com/p/search/%EB%8D%94%EC%97%90%EC%8A%A4%EB%B9%84%20%EC%9B%A8%EB%94%A9%EC%BB%A8%EB%B2%A4%EC%85%98";

const basePosts = window.WEDDING_POSTS;
let posts = [];

const grid = document.querySelector("#accountFeedGrid");
const toast = document.querySelector("#feedToast");
const followButton = document.querySelector("#followButton");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function openPost(index) {
  sessionStorage.setItem("post-feed-origin", "true");
  window.location.assign(`./post.html?tile=${index + 1}`);
}

function renderGrid() {
  grid.replaceChildren();
  posts.forEach((post, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "feed-puzzle__tile";
    button.setAttribute("aria-label", `${index + 1}번째 피드 게시물 보기`);

    if (post.design) {
      button.classList.add("feed-puzzle__tile--design");
      const design = document.createElement("span");
      design.innerHTML = "<small>SAVE THE DATE</small><strong>J <i>&amp;</i> C</strong><em>2027. 03. 27</em>";
      button.append(design);
    } else {
      const image = document.createElement("img");
      image.src = post.thumb || post.image;
      image.alt = post.caption;
      image.loading = "lazy";
      image.style.cssText = window.WeddingAdminStore.imageStyle(post.edit);
      button.append(image);
    }

    const meta = document.createElement("span");
    meta.className = "feed-puzzle__meta";
    meta.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6c-2.2-2.2-5.8-2.2-8 0L12 5.4l-.8-.8a5.7 5.7 0 0 0-8 8L12 21l8.8-8.4a5.7 5.7 0 0 0 0-8Z"/></svg><b>${post.likes}</b>`;
    button.append(meta);
    button.addEventListener("click", () => openPost(index));
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
  window.location.assign("./index.html");
});

document.querySelector("#feedHomeButton").addEventListener("click", () => {
  window.location.assign("./index.html#top");
});

document.querySelector("#feedAccountButton").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#profileStoryButton").addEventListener("click", () => {
  window.openFeedStory(0);
});

document.querySelectorAll("[data-share]").forEach((button) => {
  button.addEventListener("click", shareFeed);
});

document.querySelectorAll("[data-map]").forEach((button) => {
  button.addEventListener("click", () => window.open(MAP_URL, "_blank", "noopener,noreferrer"));
});

document.querySelector("#messageButton").addEventListener("click", () => {
  window.location.assign("./message.html?from=feed");
});

document.querySelector("#feedMoreButton").addEventListener("click", () => {
  showToast("junho.chaebeen의 웨딩 피드입니다.");
});

document.querySelectorAll("[data-navigate]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.navigate === "story") {
      window.location.assign("./index.html?story=1");
      return;
    }
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
    openPost(Number(button.dataset.highlight) * 3);
  });
});

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.tab === "tagged") {
      showToast("태그된 게시물이 아직 없어요.");
      return;
    }
    document.querySelectorAll("[data-tab]").forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  });
});

async function initializeFeed() {
  try {
    posts = await window.WeddingAdminStore.mergePosts(basePosts);
  } catch {
    posts = basePosts;
  }
  renderGrid();
}

initializeFeed();
