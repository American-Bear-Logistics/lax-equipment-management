# LAX 设备管理系统

物流公司 IT 设备管理系统，支持设备清单管理、维护工单提交、采购申请等功能。

## 功能特性

- **设备清单**: 查看所有设备，支持按类型筛选（电子设备/仓库设备/办公设备）
- **设备信息**: 采购日期、价格、使用期限、维护周期
- **维护工单**: 提交和跟踪设备维护/维修工单
- **采购申请**: 提交设备采购申请

## 项目结构

```
lax-equipment-management/
├── frontend/           # 前端静态文件（部署到 GitHub Pages）
│   ├── index.html
│   ├── style.css
│   └── app.js
├── worker/             # Cloudflare Worker（API 代理）
│   ├── worker.js
│   └── wrangler.toml
└── README.md
```

## 部署指南

### 第一步：部署 Cloudflare Worker（后端 API）

1. **注册 Cloudflare 账号**
   - 访问 https://dash.cloudflare.com/sign-up
   - 免费账号即可

2. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

3. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

4. **部署 Worker**
   ```bash
   cd worker
   wrangler deploy
   ```
   部署成功后会显示 Worker URL，类似：`https://lax-equipment-api.your-subdomain.workers.dev`

5. **设置 API Token 环境变量**
   ```bash
   wrangler secret put AIRTABLE_API_TOKEN
   ```
   然后输入你的 Airtable API Token

   或者在 Cloudflare Dashboard 中设置：
   - 进入 Workers & Pages > lax-equipment-api > Settings > Variables
   - 添加 `AIRTABLE_API_TOKEN`，类型选择 "Secret"

### 第二步：更新前端配置

1. 打开 `frontend/app.js`，修改第 4-7 行：
   ```javascript
   const API_BASE_URL = 'https://lax-equipment-api.your-subdomain.workers.dev';
   const USE_MOCK_DATA = false;  // 改为 false
   ```

### 第三步：部署到 GitHub Pages

1. **创建 GitHub 仓库**
   - 在 GitHub 创建新仓库，例如 `lax-equipment-management`

2. **推送代码**
   ```bash
   cd lax-equipment-management
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/lax-equipment-management.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库 Settings > Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 `main`，文件夹选择 `/frontend`
   - 点击 Save

4. **访问网站**
   - 几分钟后即可通过 `https://YOUR_USERNAME.github.io/lax-equipment-management/` 访问

## 本地测试

直接在浏览器中打开 `frontend/index.html` 即可预览（使用模拟数据）。

## Airtable 配置

系统连接的 Airtable Base ID: `appzHFkDDnjJb8zKd`

表格：
- 设备清单 Equipment Inventory: `tblyFmoEDTgxh3YIj`
- 维护工单 Maintenance Tickets: `tblvPfzEXuCLDR6Vb`
- 采购申请 Purchase Requests: `tblL3AUm128GAOdMQ`

## 安全说明

- Airtable API Token 通过 Cloudflare Worker 环境变量保护，不会暴露在前端代码中
- Worker 只提供特定的 API 端点，限制了对 Airtable 的访问范围
