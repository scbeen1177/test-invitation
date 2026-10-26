const basePosts = window.WEDDING_POSTS;
let posts = basePosts;
const params = new URLSearchParams(window.location.search);
const requestedIndex = Number(params.get("tile") || 1);
const initialIndex = Math.min(basePosts.length, Math.max(1, Number.isFinite(requestedIndex) ? requestedIndex : 1));
const stream = document.querySelector("#postStreamList");
const toast = document.querySelector("#postToast");
const mediaRatios = [
  "3 / 4",
  "3 / 4",
  "4 / 3",
  "3 / 4",
  "3 / 4",
  "3 / 4",
  "3 / 4",
  "3 / 4",
  "3 / 4",
  "3 / 4",
  "3861 / 5712"
];

let activeIndex = initialIndex;
let scrollFrame = null;
let storyScrollPosition = 0;
let restoringStoryPosition = false;

function getStoredLikes() {
  try {
    const likes = JSON.parse(localStorage.getItem("wedding-feed-likes") || "[]");
    return new Set(Array.isArray(likes) ? likes.filter((index) => Number.isInteger(index)) : []);
  } catch {
    return new Set();
  }
}

const likedPosts = getStoredLikes();

window.history.scrollRestoration = "manual";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function avatarMarkup() {
  return `
    <button class="post-stream__avatar" type="button" data-post-story aria-label="junho.chaebeen 스토리 보기">
      <img src="./images/KakaoTalk_20261025_205325815.jpg" alt="">
    </button>
  `;
}

function renderStream() {
  stream.innerHTML = posts.map((post, index) => {
    const number = index + 1;
    const liked = likedPosts.has(index);
    return `
      <article class="post-stream__post" id="post-${number}" data-stream-post="${index}">
        <header class="post-stream__header">
          ${avatarMarkup()}
          <div class="post-stream__identity">
            <a href="./feed.html">
              junho.chaebeen
              <svg class="verified" viewBox="0 0 24 24" aria-label="공식 계정" aria-hidden="true">
                <path d="m12 1.8 2.4 1.8 3 .1 1 2.8 2.3 1.9-1 2.8 1 2.8-2.3 1.9-1 2.8-3 .1L12 22.2l-2.4-1.8-3-.1-1-2.8-2.3-1.9 1-2.8-1-2.8 2.3-1.9 1-2.8 3-.1L12 1.8Z"/>
                <path d="m8.3 12.1 2.2 2.2 5-5.2" class="verified__check"/>
              </svg>
            </a>
            <span>our wedding day</span>
          </div>
          <button class="post-stream__more" type="button" data-stream-share="${index}" aria-label="${number}번째 게시물 공유">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>
          </button>
        </header>

        <figure class="post-stream__media" style="--media-ratio: ${mediaRatios[index] || "3 / 4"}">
          <img src="${escapeHtml(post.image)}" alt="준호와 채빈의 웨딩사진 ${number}" loading="${number === 1 ? "eager" : "lazy"}" style="${escapeHtml(window.WeddingAdminStore.imageStyle(post.edit))}">
          <span class="post-stream__counter">${String(number).padStart(2, "0")} / ${String(posts.length).padStart(2, "0")}</span>
        </figure>

        <div class="post-stream__actions">
          <div>
            <button class="icon-button post-stream__like ${liked ? "is-liked" : ""}" type="button" data-stream-like="${index}" aria-label="${liked ? "좋아요 취소" : "좋아요"}" aria-pressed="${liked}">
              <svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6c-2.2-2.2-5.8-2.2-8 0L12 5.4l-.8-.8a5.7 5.7 0 0 0-8 8L12 21l8.8-8.4a5.7 5.7 0 0 0 0-8Z"/></svg>
            </button>
            <button class="icon-button" type="button" data-stream-message aria-label="축하 메모 남기기">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.4 9.4 0 0 1-3.8-.8L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5Z"/></svg>
            </button>
            <button class="icon-button" type="button" data-stream-share="${index}" aria-label="${number}번째 게시물 공유">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.8 2.2 2.7 9.1c-.8.3-.8 1.4 0 1.7l7.4 2.7 2.7 7.4c.3.8 1.4.8 1.7 0l6.9-19.1c.1-.5-.3-.8-.6-.7Z"/><path d="m10.1 13.6 4.2-4.2"/></svg>
            </button>
          </div>
          <button class="icon-button post-stream__save" type="button" data-stream-save="${index}" aria-label="게시물 저장" aria-pressed="false">
            <svg class="bookmark-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg>
          </button>
        </div>

        <div class="post-stream__copy">
          <div class="post-stream__likes"><strong data-like-count="${index}">${(post.likes + (liked ? 1 : 0)).toLocaleString("ko-KR")}</strong>명이 좋아합니다</div>
          <p class="post-stream__caption"><a href="./feed.html">junho.chaebeen</a>${escapeHtml(post.caption)}</p>
          <div class="post-stream__tags"><span>#준호채빈</span><span>#그램퍼즐</span><span>#20270327</span></div>
          <button class="post-stream__memo" type="button" data-stream-message>
            <span>축하 메모 남기기</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <time class="post-stream__time" datetime="2027-03-27T11:00:00+09:00">${escapeHtml(post.time)}</time>
        </div>
      </article>
    `;
  }).join("");
}

async function sharePost(index = activeIndex) {
  const post = posts[index - 1];
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set("tile", index);
  const data = {
    title: `junho.chaebeen · ${index} / ${posts.length}`,
    text: post?.caption || "손준호와 남채빈의 웨딩 게시물입니다.",
    url: shareUrl.href
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
    await navigator.clipboard.writeText(shareUrl.href);
    showToast("게시물 링크를 복사했어요.");
  } catch {
    showToast("주소창의 링크를 복사해 주세요.");
  }
}

function updateActivePost() {
  scrollFrame = null;
  if (document.querySelector("#storyDialog")?.open || restoringStoryPosition) return;
  const articles = [...document.querySelectorAll("[data-stream-post]")];
  const marker = 110;
  const current = articles.find((article) => {
    const rect = article.getBoundingClientRect();
    return rect.top <= marker && rect.bottom > marker;
  }) || articles.find((article) => article.getBoundingClientRect().bottom > marker);

  if (!current) return;
  activeIndex = Number(current.dataset.streamPost) + 1;
  window.feedStoryMessageUrl = `./message.html?from=post&tile=${activeIndex}`;
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("tile", activeIndex);
  window.history.replaceState({}, "", nextUrl);
}

function returnToAccountFeed() {
  window.location.assign("./feed.html");
}

document.querySelector("#postBackButton").addEventListener("click", returnToAccountFeed);

const postStoryDialog = document.querySelector("#storyDialog");
postStoryDialog.addEventListener("close", () => {
  restoringStoryPosition = true;
  window.setTimeout(() => {
    window.scrollTo(0, storyScrollPosition);
    window.setTimeout(() => {
      restoringStoryPosition = false;
      updateActivePost();
    }, 0);
  }, 0);
});

stream.addEventListener("click", (event) => {
  if (event.target.closest("[data-post-story]")) {
    storyScrollPosition = window.scrollY;
    window.openFeedStory(0);
    return;
  }

  if (event.target.closest('a[href="./feed.html"]')) {
    event.preventDefault();
    returnToAccountFeed();
    return;
  }

  const button = event.target.closest("button");
  if (!button) return;

  if (button.matches("[data-stream-share]")) {
    sharePost(Number(button.dataset.streamShare) + 1);
    return;
  }

  if (button.matches("[data-stream-message]")) {
    window.location.assign(`./message.html?from=post&tile=${activeIndex}`);
    return;
  }

  if (button.matches("[data-stream-like]")) {
    const index = Number(button.dataset.streamLike);
    const liked = !likedPosts.has(index);
    if (liked) likedPosts.add(index);
    else likedPosts.delete(index);
    localStorage.setItem("wedding-feed-likes", JSON.stringify([...likedPosts]));
    button.classList.toggle("is-liked", liked);
    button.setAttribute("aria-pressed", String(liked));
    button.setAttribute("aria-label", liked ? "좋아요 취소" : "좋아요");
    const count = document.querySelector(`[data-like-count="${index}"]`);
    count.textContent = (posts[index].likes + (liked ? 1 : 0)).toLocaleString("ko-KR");
    return;
  }

  if (button.matches("[data-stream-save]")) {
    const saved = button.classList.toggle("is-saved");
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute("aria-label", saved ? "게시물 저장 취소" : "게시물 저장");
    showToast(saved ? "게시물을 저장했어요." : "저장을 취소했어요.");
  }
});

window.addEventListener("scroll", () => {
  if (scrollFrame !== null) return;
  scrollFrame = window.requestAnimationFrame(updateActivePost);
}, { passive: true });

async function initializePostStream() {
  try {
    posts = await window.WeddingAdminStore.mergePosts(basePosts);
  } catch {
    posts = basePosts;
  }
  renderStream();

  const selectedPost = document.querySelector(`#post-${initialIndex}`);
  if (selectedPost && initialIndex > 1) {
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    const targetTop = selectedPost.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo(0, Math.max(0, targetTop));
    window.requestAnimationFrame(() => {
      root.style.removeProperty("scroll-behavior");
    });
  }
  updateActivePost();
}

initializePostStream();
