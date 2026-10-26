const params = new URLSearchParams(window.location.search);
const source = params.get("from") || "feed";
const tile = Math.min(11, Math.max(1, Number(params.get("tile") || 1)));
const form = document.querySelector("#messageForm");
const input = document.querySelector("#memoInput");
const memosContainer = document.querySelector("#messageMemos");
const toast = document.querySelector("#messageToast");
const content = document.querySelector(".message-content");

function getMemos() {
  try {
    const memos = JSON.parse(localStorage.getItem("wedding-memos") || "[]");
    return Array.isArray(memos) ? memos : [];
  } catch {
    return [];
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function renderMemos() {
  const memos = getMemos();
  memosContainer.replaceChildren();

  if (!memos.length) {
    const empty = document.createElement("p");
    empty.className = "message-memos__empty";
    empty.textContent = "따뜻한 축하 메모를 남겨보세요.";
    memosContainer.append(empty);
    return;
  }

  memos.slice(-4).reverse().forEach((memo) => {
    const bubble = document.createElement("div");
    bubble.className = "message-memo";
    const copy = document.createElement("p");
    const date = document.createElement("time");
    copy.textContent = memo.text;
    date.textContent = memo.date || "방금 전";
    bubble.append(copy, date);
    memosContainer.append(bubble);
  });
}

document.querySelector("#messageBackButton").addEventListener("click", () => {
  if (source === "index") {
    window.location.assign("./index.html");
    return;
  }
  if (source === "post") {
    window.location.assign(`./post.html?tile=${tile}`);
    return;
  }
  window.location.assign("./feed.html");
});

document.querySelector("#messageProfileButton").addEventListener("click", () => {
  window.location.assign("./feed.html");
});

document.querySelector("#messageInquiryButton").addEventListener("click", () => {
  input.focus();
  input.placeholder = "궁금한 점을 남겨주세요.";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const memos = getMemos();
  memos.push({
    text,
    date: new Intl.DateTimeFormat("ko-KR", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date())
  });
  localStorage.setItem("wedding-memos", JSON.stringify(memos.slice(-30)));
  form.reset();
  renderMemos();
  showToast("축하 메모를 전했어요.");
  content.scrollTo({ top: content.scrollHeight, behavior: "smooth" });
});

["messageCallButton", "messageVideoButton", "memoCameraButton", "memoVoiceButton", "memoImageButton", "memoStickerButton", "memoPlusButton"].forEach((id) => {
  document.querySelector(`#${id}`).addEventListener("click", () => showToast("이 기능은 준비 중이에요."));
});

renderMemos();
