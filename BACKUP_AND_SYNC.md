**Backup and Sync — 简要说明**

- **配置文件**: 项目根目录下的 `config.json` 控制备份与同步行为。
- **触发备份**: 运行 `python scripts/backup.py` 或在浏览器中访问 `http://localhost:3000/backup`（服务器需由 `start-server.py` 启动）。
- **查看配置（敏感信息已屏蔽）**: 访问 `http://localhost:3000/config`。
- **环境变量**:
  - `CLAUDE_API_KEY`：如果使用 Claude，按照 `config.json` 中的 `claude.api_key_env` 设置。
  - `AUTO_GIT_PUSH`：设置为 `1` 或 `true` 可在备份后自动运行 `git add/commit/push`（需在项目为 git 仓库且本机已配置远程）。
- **注意**: 不要把真实密钥写入仓库。建议将敏感密钥设置为环境变量。
