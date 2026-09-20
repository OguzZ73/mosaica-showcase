# 🌌 Mosaica Ecosystem Architecture Showcase

> **Standalone Architecture & Component Showcase Repository**  
> A curated, public-ready collection of high-performance Turkish NLP linting engines, reactive SVG data visualizations, interactive story branch graphs, and reader analytics derived from the **Mosaica Multi-Platform Ecosystem**.

---

## 🏛️ Ecosystem Origins (Farklı Mosaica Projelerinden Derlenen Modüller)

This repository unifies standalone modules extracted from two distinct production applications:

| Application | Platform | Included Showcase Modules |
| :--- | :--- | :--- |
| **📱 Mosaica Dream** | **Mobile (Expo / React Native)** | • `DreamConstellationMap` (Bilinçaltı Evreni Star Map)<br>• `CosmicAstrolabe` (Animated SVG Astrolabe)<br>• `SleepDreamCorrelationStats` (Uyku/Rüya Analitiği)<br>• `LucidNotificationService` (WBTB & Lucid Engine) |
| **🌐 Mosaica Web** | **Web (Next.js / React)** | • `zenflowEngine` (Türkçe Gramer & Yazım Motoru)<br>• `StoryVisualMap` (Versa Map Hikaye Ağacı)<br>• `ReadingSessionTracker` (Okuma Hızı & Oturum Takibi)<br>• `SnippetShareModal` (Alıntı Plaketi Üreteci) |

---

<div align="center">
  <img src="./assets/Ekran%20Resmi%202026-09-20%20-%2013.50.59.png" width="85%" alt="Bilinçaltı Evreni - Dream Constellation Map" style="border-radius: 16px; margin-bottom: 20px;" />
  <p><em>Figure 1: Bilinçaltı Evreni (Dream Constellation Map) — SVG Star Node Visualization from Mosaica Dream</em></p>
</div>

---

## 🚀 Key Modules & Visual Highlights

### 1. ⚡ ZenFlow Turkish Writing & Grammar Engine (`src/engines/zenflowEngine.ts`) — *from Mosaica Web*
A zero-dependency, pure TypeScript Turkish phonology, spelling, and grammar linting engine.
- **Phonology & Suffix Rules:** Vowel harmony (`VOWEL_HARMONY`), consonant hardening (`CONSONANT_HARDENING`), and suffix detachment (`-de / -da` yazımı).
- **Levenshtein Fuzzy Matcher:** Fast root-word suggestion algorithm for Turkish vocabulary with suffix tolerance.

<div align="center" style="margin-top: 15px; margin-bottom: 25px;">
  <img src="./assets/Ekran%20Resmi%202026-09-20%2013.37.01.png" width="90%" alt="ZenFlow Engine UI" style="border-radius: 12px;" />
  <p><em>ZenFlow Real-Time Editor Feedback & Error Correction Interface</em></p>
</div>

---

### 2. 🌌 Dream Constellation Map (`src/components/visualizations/DreamConstellationMap.tsx`) — *from Mosaica Dream*
Interactive SVG cluster visualization mapping entries into star constellations.
- **Radial Node Positioning:** Distance-based node rendering calculated from lucidity and clarity scores.
- **Dynamic Edge Networks:** Distance-threshold lines connecting close nodes into star networks.

<div align="center" style="margin-top: 15px; margin-bottom: 25px;">
  <img src="./assets/Ekran%20Resmi%202026-09-20%20-%2013.50.59.png" width="85%" alt="Dream Constellation Map Interface" style="border-radius: 12px;" />
</div>

---

### 3. 🔀 Versa Map — Interactive Story Branching Graph (`src/components/visualizations/StoryVisualMap.tsx`) — *from Mosaica Web*
Interactive node-graph charting reader choices, decision points, and alternative storyline branches.

<div align="center" style="margin-top: 15px; margin-bottom: 25px;">
  <img src="./assets/Ekran%20Resmi%202026-09-20%2013.39.44.png" width="95%" alt="Versa Map Story Branching" style="border-radius: 12px;" />
  <p><em>Versa Map Visual Story Branching & Decision Tree Node View</em></p>
</div>

---

### 4. 📈 Sleep & Dream Correlation Analytics (`src/components/analytics/SleepDreamCorrelationStats.tsx`) — *from Mosaica Dream*
Analytical tracking components measuring sleep quality vs. dream experience, emotional impact, and recall frequencies.

<div align="center" style="margin-top: 15px; margin-bottom: 25px;">
  <img src="./assets/Ekran%20Resmi%202026-09-20%20-%2013.45.15.png" width="75%" alt="Sleep & Dream Correlation Stats" style="border-radius: 12px;" />
  <p><em>Sleep Quality vs. Dream Recall Score Correlation Interface</em></p>
</div>

---

### 5. 📊 Reader Analytics & Dashboard Metrics (`src/components/analytics/ReadingSessionTracker.tsx`) — *from Mosaica Web*
Client-side session tracker computing read-time metrics, scroll velocity (px/sec), active reading ratio, and device segmentation.

<div align="center" style="margin-top: 15px; margin-bottom: 25px;">
  <img src="./assets/Ekran%20Resmi%202026-09-20%2013.39.04.png" width="95%" alt="Reader Analytics Dashboard" style="border-radius: 12px;" />
  <p><em>Story & Reader Engagement Analytics Overview Dashboard</em></p>
</div>

---

## 🛠️ Repository Structure

```text
mosaica-showcase/
├── README.md                           # Documentation & Visual Showcase
├── package.json                        # Dependency manifest
├── .gitignore                          # Clean gitignore configuration
├── assets/                             # Showcase screenshots & media assets
│   ├── Ekran Resmi 2026-09-20 13.37.01.png # ZenFlow Engine UI
│   ├── Ekran Resmi 2026-09-20 - 13.50.59.png # Dream Constellation Map
│   ├── Ekran Resmi 2026-09-20 13.39.44.png # Versa Map Node Graph
│   ├── Ekran Resmi 2026-09-20 - 13.45.15.png # Sleep-Dream Correlation
│   └── Ekran Resmi 2026-09-20 13.39.04.png # Analytics Dashboard
└── src/
    ├── engines/                        # Core Logic & Services
    │   ├── zenflowEngine.ts            # Turkish NLP & Grammar Engine (Web)
    │   └── LucidNotificationService.ts # Notification & WBTB Scheduler (Dream)
    ├── components/
    │   ├── visualizations/             # SVG & Canvas Graphics
    │   │   ├── DreamConstellationMap.tsx (Dream)
    │   │   └── CosmicAstrolabe.tsx (Dream)
    │   ├── analytics/                  # Session Trackers & Metrics
    │   │   ├── ReadingSessionTracker.tsx (Web)
    │   │   └── SleepDreamCorrelationStats.tsx (Dream)
    │   └── generators/                 # Share Plaque Generators
    │       └── SnippetShareModal.tsx (Web)
    └── mocks/                          # Standalone Test Datasets
        ├── mockReadingData.ts
        └── mockDreamsData.ts
```

---

## 🔒 Security & Sanitization Assurance

This showcase repository is strictly sanitized:
- **Zero API Keys & Environment Secrets:** All production environment variables, database strings, and service credentials have been excluded.
- **Isolated Component Architecture:** Components operate using standalone props and local mock datasets (`src/mocks/`).
- **Clean Git History:** Built as a clean, fresh repository to guarantee no historical commits contain sensitive data.

---

## 📄 License
[MIT License](file:///Users/oguzz/mosaica-showcase/package.json) © Oğuz Z.
