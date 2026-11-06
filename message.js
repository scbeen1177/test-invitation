const params = new URLSearchParams(window.location.search);
const source = params.get("from") || "feed";
const tile = Math.min(11, Math.max(1, Number(params.get("tile") || 1)));
const form = document.querySelector("#messageForm");
const nameInput = document.querySelector("#memoName");
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
    const name = document.createElement("strong");
    const date = document.createElement("time");
    name.className = "message-memo__name";
    name.textContent = memo.name || "익명";
    copy.textContent = memo.text;
    date.textContent = memo.date || "방금 전";
    bubble.append(name, copy, date);
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
  window.location.assign("./index.html");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const memos = getMemos();
  memos.push({
    name: nameInput.value.trim() || "익명",
    text,
    source,
    tile,
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
  showToast("축하 메시지를 남겼어요.");
  content.scrollTo({ top: content.scrollHeight, behavior: "smooth" });
});

renderMemos();
