// 1. 스티커 데이터 (지금은 하드코딩, 나중에 파일/DB로 분리 가능)
const stickers = [
  { id: 1, from: "팀장님", message: "보고서 정리 깔끔하게 해줘서 고마워요", date: "2025-12-01" },
  { id: 2, from: "동료 A", message: "정부지원사업 일정 정리 덕분에 수월했어요", date: "2025-12-03" },
  { id: 3, from: "동료 B", message: "세무사랑 커뮤니케이션 잘 해줘서 큰 도움 됐어요", date: "2025-12-07" },
  { id: 4, from: "세무사님", message: "자료 정리 덕분에 신고가 빨리 끝났어요", date: "2025-12-08" }
];

// 2. localStorage key 이름
const STORAGE_KEY = "praiseSticker_seenIds";

// 3. localStorage에서 이미 본 스티커 id 목록 가져오기
function getSeenStickerIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("failed to parse seen sticker ids", e);
    return [];
  }
}

// 4. localStorage에 id 목록 저장
function saveSeenStickerIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

// 5. 새 스티커 렌더링
function renderNewStickers() {
  const seenIds = getSeenStickerIds();
  const newStickers = stickers.filter(sticker => !seenIds.includes(sticker.id));

  const section = document.getElementById("new-stickers-section");
  const list = document.getElementById("new-stickers-list");

  // 새 스티커가 없으면 섹션 숨김
  if (newStickers.length === 0) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");
  list.innerHTML = "";

  newStickers.forEach(sticker => {
    const li = document.createElement("li");
    li.className = "new-sticker-item";

    const header = document.createElement("div");
    header.className = "new-sticker-header";

    const fromSpan = document.createElement("span");
    fromSpan.className = "new-sticker-from";
    fromSpan.textContent = `${sticker.from}의 칭찬스티커`;

    const dateSpan = document.createElement("span");
    dateSpan.className = "new-sticker-date";
    dateSpan.textContent = sticker.date;

    header.appendChild(fromSpan);
    header.appendChild(dateSpan);

    const msgP = document.createElement("p");
    msgP.className = "new-sticker-message";
    msgP.textContent = `"${sticker.message}"`;

    li.appendChild(header);
    li.appendChild(msgP);
    list.appendChild(li);
  });

  // 버튼 클릭 시: 현재 새 스티커들을 모두 "읽은" 상태로 저장
  const markBtn = document.getElementById("mark-as-read-btn");
  markBtn.onclick = () => {
    const updated = Array.from(new Set([...seenIds, ...newStickers.map(s => s.id)]));
    saveSeenStickerIds(updated);
    section.classList.add("hidden");
  };
}

// 6. 총 스티커 갯수 + 이미지 렌더링
function renderTotalStickers() {
  const totalCount = stickers.length;
  const totalCountSpan = document.getElementById("total-count");
  totalCountSpan.textContent = totalCount;

  const wrapper = document.getElementById("sticker-images-wrapper");
  wrapper.innerHTML = "";

  // 너무 많으면 50개까지만 아이콘으로 표시
  const maxIcons = 50;
  const iconCount = Math.min(totalCount, maxIcons);

  for (let i = 0; i < iconCount; i++) {
    const span = document.createElement("span");
    span.className = "sticker-icon";
    // 여기서 아이콘을 바꾸고 싶으면 이모지 변경 (⭐, 🏅, 🐣 등)
    span.textContent = "⭐";
    wrapper.appendChild(span);
  }

  const extraInfo = document.getElementById("sticker-extra-info");
  if (totalCount > maxIcons) {
    extraInfo.textContent = `아이콘은 ${maxIcons}개까지만 표시되고, 나머지 ${totalCount - maxIcons}개는 숫자로만 보여줍니다.`;
  } else if (totalCount === 0) {
    extraInfo.textContent = "아직 받은 칭찬스티커가 없어요. 곧 생길 거예요 :)";
  } else {
    extraInfo.textContent = "";
  }
}

// 7. 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
  renderNewStickers();
  renderTotalStickers();
});
