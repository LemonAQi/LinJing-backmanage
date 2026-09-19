# LinJing-backmanage

临境后台管理系统，基于 [Vue Vben Admin](https://github.com/vbenjs/vue-vben-admin) `5.7.0`（Vue 3 + Vite + TypeScript 的开源中后台模板）。

官方文档：https://doc.vben.pro/

## 环境要求

- Node.js `^22.18.0` 或 `^24.12.0`
- 包管理器：`pnpm`（项目已锁定 `pnpm@11.16.0`，推荐通过 `corepack` 启用）

## 安装与启动

```bash
# 启用项目指定的 pnpm 版本
corepack enable
corepack prepare pnpm@11.16.0 --activate

# 安装依赖
pnpm install

# 启动 Ant Design Vue 管理端（默认应用）
pnpm dev:antd
```

启动成功后访问 `http://localhost:5666`（`apps/web-antd` 默认开发端口，以终端输出为准）。

默认演示账号：`vben` / `123456`

## 查看 App 用户

后台只负责登录和管理界面。App 登录人员存在 **linjing-backend**，需要同时启动：

```bash
# 另一个终端，在 linjing-backend 仓库
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

1. 保持后端在 `127.0.0.1:8000`
2. 本仓库执行 `pnpm dev:antd`，用 `vben` / `123456` 登录
3. 打开侧栏 **App 用户**
4. 用林鲸 App 登录 `fluie` / `123456` 后刷新列表

后端地址不是 8000 时，启动管理端前设置 `LINJING_API_TARGET`，例如 `http://127.0.0.1:8000`。

其他 UI 变体：

```bash
pnpm dev:ele      # Element Plus
pnpm dev:naive    # Naive UI
pnpm dev:tdesign  # TDesign
```

## 常用命令

```bash
pnpm build:antd   # 构建 web-antd
pnpm lint         # 代码检查
pnpm check:type   # 类型检查
```

上游框架说明见 [README.zh-CN.md](./README.zh-CN.md)。
