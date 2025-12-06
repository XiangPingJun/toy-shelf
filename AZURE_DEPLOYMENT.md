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

**重要：這是最關鍵的步驟！**

建立 Static Web App 後：
1. 在 Azure Portal 中找到您剛創建的 Static Web App 資源
2. 在左側選單中點擊「概觀」
3. 點擊頂部的「管理部署權杖」按鈕
4. 複製顯示的部署權杖（這是一串很長的字串）

**注意：** 
- 部署權杖只會顯示一次，請妥善保存
- 如果遺失，可以重新產生新的權杖
- 每個 Static Web App 都有唯一的部署權杖

### 4. 在 GitHub 中設定 Secret

**⚠️ 這是必須完成的步驟，否則部署會失敗！**

**必須正確設定才能部署成功！**

1. 前往 GitHub 存放庫：`https://github.com/XiangPingJun/toy-shelf`
2. 點擊上方的 **Settings** 標籤
3. 在左側選單中選擇 **Secrets and variables** > **Actions**
4. 點擊 **New repository secret** 按鈕
5. 填寫以下資訊：
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN` （必須完全一致，區分大小寫）
   - Secret: 貼上步驟 3 複製的部署權杖（**不要有空格或換行**）
6. 點擊 **Add secret** 按鈕

**驗證設定：**
- 在 Secrets 列表中應該能看到 `AZURE_STATIC_WEB_APPS_API_TOKEN`
- 值會顯示為 `***`（已加密）
- **確認名稱完全正確**：`AZURE_STATIC_WEB_APPS_API_TOKEN`

**⚠️ 常見錯誤：**
- Secret 名稱拼寫錯誤
- Token 值包含額外的空格或換行符
- 複製 Token 時沒有完整複製
- Token 已過期（重新產生即可）

### 5. 觸發部署

設定完成後，推送代碼到 master 分支即可觸發自動部署：
```bash
git add .
git commit -m "Deploy to Azure Static Web Apps"
git push origin master
```

**檢查部署狀態：**
1. 前往 GitHub 存放庫的 **Actions** 標籤
2. 查看最新的 workflow run
3. 如果看到綠色勾勾 ✓，表示部署成功
4. 如果看到紅色叉叉 ✗，點進去查看錯誤訊息

**常見錯誤排查：**
- `BadRequest: No matching Static Web App was found or the api key was invalid`
  → 檢查 GitHub Secret 是否正確設定
  → 確認部署權杖是否有效
  → 確認 Secret 名稱是否為 `AZURE_STATIC_WEB_APPS_API_TOKEN`

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
