# mail2webhook

mail2webhook 是一個基於 Cloudflare Workers 的應用程式，用於將電子郵件轉發到指定的 Webhook 或其他電子郵件地址，並根據自定義規則進行處理。

## 功能

- 根據電子郵件地址的後綴應用不同的處理規則。
- 支援白名單和黑名單過濾。
- 將電子郵件轉發到指定的地址。
- 將電子郵件內容發送到指定的 Webhook。

## 安裝與執行

### 先決條件

- Node.js
- Wrangler CLI

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 部署

```bash
npm run deploy
```

## 配置

### Wrangler 配置

在 `wrangler.jsonc` 中，您可以配置以下內容：

- **KV 命名空間**: 用於存儲電子郵件處理規則。
- **環境變數**: 包括 `KEY`，用於授權請求。
- **其他規則**: 預設的處理規則。

### 規則格式

每個規則的格式如下：

```json
{
  "suffix_rule": "#",
  "type": "white",
  "list": ["example@example.com"],
  "forward": "forward@example.com",
  "webhook_url": "https://example.com/webhook"
}
```

- `suffix_rule`: 後綴規則。
- `type`: 過濾類型，`white` 表示白名單，`black` 表示黑名單。
- `list`: 電子郵件地址列表。
- `forward`: 轉發地址。
- `webhook_url`: Webhook 地址。

## 測試

使用 Vitest 進行測試：

```bash
npm run test
```

## API

### 電子郵件處理

當收到電子郵件時，應用會根據規則進行以下操作：

1. 如果符合白名單或黑名單規則，則：
   - 將郵件轉發到指定地址（如果配置）。
   - 發送 POST 請求到 Webhook（如果配置）。
2. 否則，拒絕郵件。

### HTTP 請求處理

- **POST /?key=YOUR_KEY&suffix=SUFFIX**
  - 更新或刪除規則。
  - 請求體為 JSON 格式的規則。

## 貢獻

歡迎提交問題或拉取請求！

## 授權

此專案使用 MIT 許可證。