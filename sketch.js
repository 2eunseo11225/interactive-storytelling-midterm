let species = [];

let selected = 0;
let revealAmount = 0;

let mediaElement = null;
let mediaType = "none";

let autoTimer = 0;
const AUTO_DELAY = 600;

let scrollOffset = 0;
let targetScroll = 0;

const itemHeight = 40;

let layout = {};

// ------------------ 데이터 로딩
function preload() {
  let data = loadJSON("data/species.json", () => {}, () => {});
  
  if (data) {
    if (Array.isArray(data)) {
      species = data;
    } else if (data.species) {
      species = data.species;
    } else {
      species = Object.values(data);
    }
  }
}

// ------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');

  // 👉 JSON 실패 대비 테스트 데이터
  if (!species || species.length === 0) {
    species = [
  {
    "name": "Golden Toad",
    "year": "1989",
    "cause": "Rapid climate shifts disrupted its cloud forest habitat, leading to breeding failure.",
    "desc": "A bright orange amphibian once endemic to Costa Rica; became a symbol of climate-linked extinction.",
    "media": "media/Bufo_periglenes2.jpg"
  },
  {
    "name": "Bramble Cay Melomys",
    "year": "2016",
    "cause": "Rising sea levels repeatedly flooded its island habitat.",
    "desc": "The first mammal declared extinct due to human-induced climate change.",
    "media": "media/media2.jpg"
  },
  {
    "name": "Pinta Island Tortoise",
    "year": "2012",
    "cause": "Habitat degradation worsened by climate shifts and human impact.",
    "desc": "Known as “Lonesome George,” the last of his species.",
    "media": "media/media3.mp4"
  },
  {
    "name": "Baiji (Yangtze River Dolphin)",
    "year": "2006 (functionally extinct)",
    "cause": "River warming and industrial disruption degraded habitat.",
    "desc": "One of the few freshwater dolphins; vanished from China’s Yangtze River.",
    "media": "media/media4.jpg"
  },
  {
    "name": "Christmas Island Pipistrelle",
    "year": "2009",
    "cause": "Climate shifts altered insect availability and habitat balance.",
    "desc": "Disappeared rapidly despite last-minute conservation efforts.",
    "media": "media/media5.jpg"
  },
  {
    "name": "Great Auk",
    "year": "1844",
    "cause": "Overhunting combined with climate-driven habitat shifts.",
    "desc": "Flightless seabird often compared to penguins.",
    "media": "media/media6.jpeg"
  },
  {
    "name": "Caribbean Monk Seal",
    "year": "1952",
    "cause": "Ocean warming and overexploitation reduced food supply.",
    "desc": "The only seal native to the Caribbean.",
    "media": "media/media7.jpg"
  },
  {
    "name": "St. Helena Olive",
    "year": "2003",
    "cause": "Climate shifts and habitat loss prevented regeneration.",
    "desc": "Last tree died despite conservation attempts.",
    "media": "media/media8.jpeg"
  }
]
  }
}

// ------------------
function draw() {
  background(10);

  // ❗ 데이터 없으면 종료
  if (!species || species.length === 0) {
    fill(200);
    textSize(20);
    text("No data loaded", 50, 50);
    return;
  }

  handleAutoPlay();
  updateScroll();

  drawLayout();
  drawList();
  drawDetail();

  if (!mediaElement) {
    loadCurrentMedia();
  }
}

// ------------------ 자동 재생
function handleAutoPlay() {
  if (!species || species.length === 0) return;

  autoTimer++;
  if (autoTimer > AUTO_DELAY) {
    selected = (selected + 1) % species.length;

    targetScroll = selected * itemHeight;
    scrollOffset = targetScroll;

    revealAmount = 0;
    loadCurrentMedia();
    autoTimer = 0;
  }
}

// ------------------ 스크롤
function updateScroll() {
  scrollOffset += (targetScroll - scrollOffset) * 0.08;
}

// ------------------ 미디어 로딩
function loadCurrentMedia() {

  if (!species[selected]) return;

  if (mediaElement) {
    mediaElement.remove();
    mediaElement = null;
  }

  let path = species[selected].media;

  if (!path) {
    mediaType = "none";
    return;
  }

  if (path.endsWith(".mp4") || path.endsWith(".webm")) {

    mediaType = "video";

    mediaElement = createVideo(path);
    mediaElement.size(600, 350);
    mediaElement.position(layout.leftW + 40, 80);
    mediaElement.loop();
    mediaElement.volume(0);

  } else {

    mediaType = "image";

    mediaElement = createImg(path);
    mediaElement.size(600, 350);
    mediaElement.style("object-fit", "cover");
    mediaElement.position(layout.leftW + 40, 80);
  }
}

// ------------------ 레이아웃
function drawLayout() {
  let leftW = width * 0.25;

  layout = {
    leftW: leftW,
    headerH: 60
  };

  stroke(80);
  line(leftW, 0, leftW, height);

  // 헤더
  noStroke();
  fill(20);
  rect(0, 0, leftW, layout.headerH);

  fill(180);
  textSize(14);
  text("EXTINCT SPECIES ARCHIVE", 20, 35);
}

// ------------------ 리스트
function drawList() {
  let startY = layout.headerH + 20;
  let total = species.length;
  let totalHeight = total * itemHeight;

  push();
  translate(0, startY - scrollOffset);

  for (let loop = -1; loop <= 1; loop++) {
    for (let i = 0; i < total; i++) {
      let y = (i + loop * total) * itemHeight;

      if (i === selected) fill(220);
      else fill(120);

      text((i + 1) + ". " + species[i].name, 20, y);
    }
  }

  pop();
}

// ------------------ 상세
function drawDetail() {

  if (!species[selected]) return;

  let x = layout.leftW + 40;
  let y = 80;

  let boxW = width * 0.7;
  let boxH = height * 0.45;

  noFill();
  stroke(200);
  rect(x, y, boxW, boxH);

  // 👉 미디어 없을 때 표시
  if (mediaType === "none") {
    fill(120);
    noStroke();
    textAlign(CENTER, CENTER);
    text("NO MEDIA", x + boxW / 2, y + boxH / 2);
    textAlign(LEFT, BASELINE);
  }

  let s = species[selected];

  push();
  translate(x, y + boxH + 40);

  fill(255 * revealAmount);

  textSize(26);
  text(s.name || "Unknown", 0, 0);

  textSize(14);
  text("Extinct: " + (s.year || "-"), 0, 30);
  text("Cause: " + (s.cause || "-"), 0, 55);

  let desc = s.desc || "";
  let partial = desc.substring(0, floor(desc.length * revealAmount));
  text(partial, 0, 90, boxW);

  pop();

  if (revealAmount < 1) revealAmount += 0.01;
}

// ------------------ 클릭
function mousePressed() {
  let startY = layout.headerH + 20;
  let total = species.length;
  let totalHeight = total * itemHeight;

  for (let i = 0; i < total; i++) {
    let baseY = startY + i * itemHeight - scrollOffset;

    for (let loop = -1; loop <= 1; loop++) {
      let y = baseY + loop * totalHeight;

      if (
        mouseX < layout.leftW &&
        mouseY > y - 15 &&
        mouseY < y + 15
      ) {
        selected = i;
        revealAmount = 0;
        autoTimer = 0;
        loadCurrentMedia();
        return;
      }
    }
  }
}

// ------------------ 휠
function mouseWheel(event) {
  let totalHeight = species.length * itemHeight;

  targetScroll += event.delta * 0.5;

  if (targetScroll < 0) targetScroll += totalHeight;
  if (targetScroll > totalHeight) targetScroll -= totalHeight;
}
