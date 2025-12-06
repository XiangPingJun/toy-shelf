# Azure Static Web Apps 部署指南

## 設定步驟

### 1. 安裝依賴
```bash
pnpm install
```

### 2. 在 Azure Portal 中創建 Static Web App
1. 登入 [Azure Portal](https://portal.azure.com)
2. 點擊「建立資源」
3. 搜尋「Static Web App」
4. 點擊「建立」
5. 填寫以下資訊：
   - 訂用帳戶：選擇您的訂用帳戶
   - 資源群組：建立新的或選擇現有的
   - 名稱：toy-shelf（或您想要的名稱）
   - 區域：選擇最近的區域
   - SKU：Free（或 Standard）
   - 部署詳細資料：
     - 來源：GitHub
     - 組織：XiangPingJun
     - 存放庫：toy-shelf
     - 分支：master
   - 建置詳細資料：
     - 建置預設：Custom
     - 應用程式位置：/
     - API 位置：留空
     - 輸出位置：build

### 3. 取得部署權杖
建立 Static Web App 後：
1. 前往該資源
2. 在左側選單中點擊「管理部署權杖」
3. 複製部署權杖

### 4. 在 GitHub 中設定 Secret
1. 前往 GitHub 存放庫的 Settings > Secrets and variables > Actions
2. 點擊「New repository secret」
3. 名稱：`AZURE_STATIC_WEB_APPS_API_TOKEN`
4. 值：貼上剛才複製的部署權杖
5. 點擊「Add secret」

### 5. 觸發部署
推送代碼到 master 分支即可觸發自動部署：
```bash
git add .
git commit -m "Deploy to Azure Static Web Apps"
git push origin master
```

## 本地開發
```bash
# 開發模式
pnpm dev

# 建置
pnpm build

# 預覽建置結果
pnpm preview
```

## 配置文件說明

- `staticwebapp.config.json`: Azure Static Web Apps 配置
- `.github/workflows/azure-static-web-apps.yml`: GitHub Actions 自動部署工作流程
- `svelte.config.js`: SvelteKit 配置，使用 adapter-static

## 注意事項

1. 本專案使用 `@sveltejs/adapter-static` 將 SvelteKit 應用程式編譯為靜態網站
2. 所有路由都會回退到 `index.html`，實現 SPA 路由
3. 靜態資源會自動快取一年
4. 支援自訂網域和 SSL 憑證（需在 Azure Portal 中設定）
