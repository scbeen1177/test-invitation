const basePosts = window.WEDDING_POSTS;
const store = window.WeddingAdminStore;

const photoList = document.querySelector("#adminPhotoList");
const editCount = document.querySelector("#adminEditCount");
const editorTitle = document.querySelector("#editorTitle");
const saveState = document.querySelector("#adminSaveState");
const previewImage = document.querySelector("#adminPreviewImage");
const fileInput = document.querySelector("#adminFileInput");
const captionInput = document.querySelector("#adminCaption");
const zoomInput = document.querySelector("#adminZoom");
const xInput = document.querySelector("#adminX");
const yInput = document.querySelector("#adminY");
const zoomOutput = document.querySelector("#adminZoomOutput");
const xOutput = document.querySelector("#adminXOutput");
const yOutput = document.querySelector("#adminYOutput");
const rotationOutput = document.querySelector("#adminRotationOutput");
const toast = document.querySelector("#adminToast");

let records = new Map();
let currentSlot = 0;
let pendingBlob = null;
let rotation = 0;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function imageUrlFor(slot) {
  const record = records.get(slot);
  if (record?.blob) {
    return URL.createObjectURL(record.blob);
  }
  return basePosts[slot]?.thumb || basePosts[slot]?.image;
}

function values() {
  return {
    zoom: Number(zoomInput.value),
    x: Number(xInput.value),
    y: Number(yInput.value),
    rotation
  };
}

function updatePreview() {
  const edit = values();
  previewImage.style.transform = `translate(${edit.x}%, ${edit.y}%) scale(${edit.zoom}) rotate(${edit.rotation}deg)`;
  zoomOutput.textContent = `${Math.round(edit.zoom * 100)}%`;
  xOutput.textContent = `${edit.x}`;
  yOutput.textContent = `${edit.y}`;
  rotationOutput.textContent = `${edit.rotation}°`;
  saveState.textContent = "저장되지 않은 변경";
  saveState.classList.remove("is-saved");
}

function renderList() {
  photoList.replaceChildren();
  let editedCount = 0;

  basePosts.forEach((post, slot) => {
    const record = records.get(slot);
    if (record) editedCount += 1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `admin-photo-item${slot === currentSlot ? " is-active" : ""}`;
    button.setAttribute("aria-label", `${slot + 1}번째 게시물 편집`);
    const thumb = document.createElement("span");
    const image = document.createElement("img");
    const copy = document.createElement("span");
    const title = document.createElement("strong");
    const caption = document.createElement("small");
    const edited = document.createElement("span");

    thumb.className = "admin-photo-item__thumb";
    copy.className = "admin-photo-item__copy";
    edited.className = "admin-photo-item__edited";
    image.src = imageUrlFor(slot);
    image.alt = "";
    title.textContent = `게시물 ${String(slot + 1).padStart(2, "0")}`;
    caption.textContent = record?.caption ?? post.caption;
    thumb.append(image);
    copy.append(title, caption);
    button.append(thumb, copy, edited);
    if (!record) edited.hidden = true;
    button.addEventListener("click", () => selectSlot(slot));
    photoList.append(button);
  });

  editCount.textContent = `${editedCount} / ${basePosts.length} 편집됨`;
}

function selectSlot(slot) {
  currentSlot = slot;
  const record = records.get(slot);
  const post = basePosts[slot];
  pendingBlob = record?.blob || null;
  rotation = Number(record?.rotation) || 0;
  previewImage.src = imageUrlFor(slot);
  previewImage.alt = post.caption;
  captionInput.value = record?.caption ?? post.caption;
  zoomInput.value = String(record?.zoom || 1);
  xInput.value = String(record?.x || 0);
  yInput.value = String(record?.y || 0);
  editorTitle.textContent = `게시물 ${String(slot + 1).padStart(2, "0")}`;
  saveState.textContent = record ? "로컬 편집본" : "원본";
  saveState.classList.toggle("is-saved", Boolean(record));
  renderList();
  updatePreview();
  saveState.textContent = record ? "로컬 편집본" : "원본";
  saveState.classList.toggle("is-saved", Boolean(record));
}

document.querySelector("#adminChooseFile").addEventListener("click", () => {
  fileInput.value = "";
  fileInput.click();
});
fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("이미지 파일만 선택할 수 있어요.");
    return;
  }
  pendingBlob = file;
  previewImage.src = URL.createObjectURL(file);
  updatePreview();
});

document.querySelector("#adminResetPhoto").addEventListener("click", () => {
  pendingBlob = null;
  previewImage.src = basePosts[currentSlot].image;
  updatePreview();
});

[zoomInput, xInput, yInput].forEach((input) => input.addEventListener("input", updatePreview));

document.querySelector("#adminRotateLeft").addEventListener("click", () => {
  rotation = (rotation - 90 + 360) % 360;
  updatePreview();
});
document.querySelector("#adminRotateRight").addEventListener("click", () => {
  rotation = (rotation + 90) % 360;
  updatePreview();
});
captionInput.addEventListener("input", () => {
  saveState.textContent = "저장되지 않은 변경";
  saveState.classList.remove("is-saved");
});

document.querySelector("#adminSaveButton").addEventListener("click", async () => {
  const edit = values();
  await store.saveRecord({
    slot: currentSlot,
    caption: captionInput.value.trim(),
    zoom: edit.zoom,
    x: edit.x,
    y: edit.y,
    rotation: edit.rotation,
    blob: pendingBlob || undefined
  });
  records.set(currentSlot, {
    ...edit,
    caption: captionInput.value.trim(),
    blob: pendingBlob || undefined
  });
  renderList();
  saveState.textContent = "로컬에 저장됨";
  saveState.classList.add("is-saved");
  showToast("사진 편집 내용을 이 브라우저에 저장했어요.");
});

document.querySelector("#adminResetEdit").addEventListener("click", async () => {
  if (!window.confirm("이 게시물의 로컬 편집 내용을 초기화할까요?")) return;
  await store.removeRecord(currentSlot);
  records.delete(currentSlot);
  selectSlot(currentSlot);
  showToast("이 게시물의 로컬 편집을 초기화했어요.");
});

async function initializeAdmin() {
  try {
    const saved = await store.readAll();
    records = new Map(saved.map((record) => [record.slot, record]));
    selectSlot(0);
  } catch {
    saveState.textContent = "저장소를 불러오지 못함";
    renderList();
    selectSlot(0);
  }
}

initializeAdmin();
