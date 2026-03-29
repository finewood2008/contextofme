# X Platform API 配置指南

## 前置条件
- 拥有 X (Twitter) 账号
- 需要申请 X Developer 账号(免费)

## 步骤 1: 申请 X Developer 账号

1. 访问 https://developer.twitter.com/
2. 点击右上角 "Sign up" 或 "Apply"
3. 使用你的 X 账号登录
4. 填写申请表单:
   - 选择用途: "Building tools for myself" 或 "Exploring the API"
   - 描述你的使用场景: "Personal content automation and social media management"
   - 同意开发者协议
5. 提交申请,通常几分钟内会通过

## 步骤 2: 创建 App

1. 登录 https://developer.twitter.com/en/portal/dashboard
2. 点击左侧 "Projects & Apps"
3. 点击 "+ Create App" 按钮
4. 填写 App 信息:
   - **App name**: `contextofme` (或任意名称)
   - **Description**: "Personal context vault with social media integration"
   - **Website URL**: `https://contextof.me` (或你的网站)
5. 点击 "Create" 创建

## 步骤 3: 设置 App 权限

1. 在 App 详情页,点击 "Settings" 标签
2. 找到 "User authentication settings" 部分
3. 点击 "Set up" 按钮
4. 配置权限:
   - **App permissions**: 选择 "Read and write" ✅ (重要!)
   - **Type of App**: 选择 "Web App, Automated App or Bot"
   - **Callback URI**: 填写 `https://contextof.me/callback` (可以随意填)
   - **Website URL**: `https://contextof.me`
5. 点击 "Save" 保存

## 步骤 4: 获取 API 凭证

### 4.1 获取 API Key 和 API Secret

1. 在 App 详情页,点击 "Keys and tokens" 标签
2. 找到 "Consumer Keys" 部分
3. 你会看到:
   - **API Key** (也叫 Consumer Key)
   - **API Key Secret** (也叫 Consumer Secret)
4. 点击 "Show" 按钮查看完整密钥
5. 复制这两个值

**对应关系:**
- `API Key` → 填入 contextof.me 的 **API Key** 字段
- `API Key Secret` → 填入 contextof.me 的 **API Secret** 字段

### 4.2 生成 Access Token 和 Access Token Secret

1. 在同一页面,找到 "Authentication Tokens" 部分
2. 点击 "Generate" 按钮生成 Access Token
3. 你会看到:
   - **Access Token**
   - **Access Token Secret**
4. ⚠️ **重要**: 这两个值只会显示一次,请立即复制保存!
5. 如果不小心关闭了,点击 "Regenerate" 重新生成

**对应关系:**
- `Access Token` → 填入 contextof.me 的 **Access Token** 字段
- `Access Token Secret` → 填入 contextof.me 的 **Access Token Secret** 字段

## 步骤 5: 在 contextof.me 配置

1. 登录 https://contextof.me
2. 进入 Dashboard
3. 点击 "INTEGRATIONS" 标签
4. 在 "X Platform Configuration" 部分填入:
   - **API Key**: 粘贴步骤 4.1 的 API Key
   - **API Secret**: 粘贴步骤 4.1 的 API Key Secret
   - **Access Token**: 粘贴步骤 4.2 的 Access Token
   - **Access Token Secret**: 粘贴步骤 4.2 的 Access Token Secret
5. (可选) 开启 "Auto-post to X" 开关,自动发布新切片
6. 点击 "Save Configuration" 保存

## 步骤 6: 测试

1. 回到 "VAULT" 标签
2. 找到任意一个切片
3. 鼠标悬停,点击右上角的 "发送" 图标 (Send)
4. 如果配置正确,会提示 "Posted to X"
5. 去你的 X 账号查看,应该能看到刚发布的推文

## 常见问题

### Q: 提示 "X platform credentials not configured"
A: 说明你还没有保存配置,或者某个字段为空。检查 4 个字段是否都填写了。

### Q: 提示 "Twitter API error: 403 Forbidden"
A: 说明 App 权限不足。回到步骤 3,确保选择了 "Read and write" 权限。

### Q: 提示 "Invalid signature"
A: 说明 API Secret 或 Access Token Secret 填错了。重新复制粘贴,注意不要有多余的空格。

### Q: Access Token 不小心关闭了怎么办?
A: 在 X Developer Portal 点击 "Regenerate" 重新生成,然后更新 contextof.me 的配置。

### Q: 发布的推文会显示 "via contextofme" 吗?
A: 是的,推文会显示来源为你的 App 名称。

## 安全提示

- ⚠️ **不要分享你的 API Secret 和 Access Token Secret**
- ⚠️ 这些凭证可以完全控制你的 X 账号
- ⚠️ 如果泄露,立即在 X Developer Portal 重新生成
- ✅ contextof.me 会安全加密存储你的凭证

## 截图参考

### X Developer Portal - Keys and tokens 页面
```
OAuth 1.0a Keys
├── Consumer Key (API Key)          → API Key
├── Consumer Secret (API Secret)    → API Secret
└── Authentication Tokens
    ├── Access Token                → Access Token
    └── Access Token Secret         → Access Token Secret
```

---

配置完成后,你就可以:
1. 手动点击发送按钮,将切片发布到 X
2. 开启自动发布,新切片会自动同步到 X
3. 在 Dashboard 查看发布历史

有问题随时联系!
