# Toy Shelf

一個使用 SvelteKit 建立的 3D 玩具展示平台，部署在 Azure Static Web Apps。

## 功能特色

- 🎨 3D 模型展示（支援 Gaussian Splatting 和全景圖）
- 🌐 多語言支援（英文、日文、繁體中文）
- 📱 響應式設計
- ⚡ 快速載入和流暢動畫

## 技術棧

- **框架**: SvelteKit 2
- **3D 渲染**: Three.js, PlayCanvas
- **樣式**: Tailwind CSS 4
- **國際化**: Paraglide JS
- **部署**: Azure Static Web Apps
- **CI/CD**: GitHub Actions

## 本地開發

### 安裝依賴

```bash
pnpm install
```

### 開發模式

```bash
pnpm dev
```

### 建置

```bash
pnpm build
```

### 預覽建置結果

```bash
pnpm preview
```

## 部署到 Azure

詳細部署步驟請參考 [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md)

## 專案結構

```
toy-shelf/
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte 組件
│   │   ├── stores/         # 狀態管理
│   │   └── paraglide/      # 國際化文件
│   └── routes/             # 頁面路由
├── static/                 # 靜態資源
├── messages/               # 翻譯文件
└── staticwebapp.config.json # Azure 配置
```

## 授權

MIT
