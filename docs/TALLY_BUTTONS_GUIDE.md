# Tally Section 管理 - 更新说明

## 🎯 新的工作流程

### 按钮说明

#### 1. **Add Tally Section** （添加新的 Tally section）
- **用途**：创建一个新的 Tally 表单 section
- **操作步骤**：
  1. 在 "Method 1: Direct Link" 输入 Tally 链接 **OR**
  2. 在 "Method 2: Embed HTML Code" 输入完整代码
  3. （可选）调整宽度和内边距
  4. 点击 **"Add Tally Section"** 添加新 section

#### 2. **Apply Settings** （应用设置到选中的 section）
- **用途**：修改已选中的 Tally section 的配置（宽度和内边距）
- **操作步骤**：
  1. 在左侧 "Sections" 列表中点击一个 Tally section 选中它
  2. 调整右侧的宽度和内边距参数
  3. 点击 **"Apply Settings"** 应用配置到该 section
  4. 预览会立即更新

---

## 📝 工作流示例

### 场景 1：添加第一个 Tally 表单
```
1. Tally Form Embed 标签页中
2. 在 "Method 1" 输入框中粘贴 Tally 链接
3. 点击 "Add Tally Section" ✓
4. Tally Form 已添加到 Sections 列表中
```

### 场景 2：调整已添加的 Tally 表单的边距
```
1. 在左侧 Sections 列表中点击 "Tally Form"
2. 看到右侧自动填充的宽度和内边距值
3. 修改 Padding Top 从 60 改为 40
4. 点击 "Apply Settings" ✓
5. 预览中立即看到顶部间距变小了
```

### 场景 3：添加第二个 Tally 表单
```
1. 第一个 Tally 已存在（可能已选中）
2. 清空 URL/代码输入框
3. 粘贴另一个 Tally 的链接或代码
4. 点击 "Add Tally Section" ✓
5. 现在有两个独立的 Tally section
```

### 场景 4：同时管理多个 Tally section
```
1. 在 Sections 列表中点击第一个 Tally
2. 看到它的配置自动填充到右侧
3. 点击 "Apply Settings" 保存任何修改
4. 在 Sections 列表中点击第二个 Tally
5. 看到它的配置自动填充
6. 修改并点击 "Apply Settings"
7. ... 重复操作其他 section ...
```

---

## ⚙️ 技术说明

### 按钮职责划分

| 功能 | Add Tally Section | Apply Settings |
|------|-------------------|-----------------|
| 添加新 section | ✅ | ❌ |
| 修改配置 | ❌ | ✅ |
| 修改 URL | ✅ | ❌ |
| 修改嵌入代码 | ✅ | ❌ |
| 修改宽度 | ✅ | ✅ |
| 修改内边距 | ✅ | ✅ |
| 需要选中 section | ❌ | ✅ |

### 输入字段的行为

#### URL/代码输入框（tallyDirectUrl, tallyEmbedCode）
- **作用**：用于添加新的 Tally section
- **何时清空**：
  - 用户手动清空
  - 页面刷新
- **何时保留**：
  - 选中不同的 section 时（可以直接添加新的）
  - 点击 "Apply Settings" 时

#### 宽度和内边距输入框
- **作用**：设置 section 的布局
- **何时更新**：
  - 选中一个 Tally section 时自动填充当前值
  - 用户手动修改
- **何时应用**：
  - 点击 "Add Tally Section"（应用到新 section）
  - 点击 "Apply Settings"（应用到已选中的 section）

---

## 💡 使用提示

### 快速编辑配置
1. 点击 Sections 列表中的 Tally section
2. 修改参数
3. 点击 "Apply Settings"
4. 无需重新输入 URL 或代码

### 快速添加多个 Tally
1. 输入第一个 Tally 的 URL，点击 "Add Tally Section"
2. 清空输入框
3. 输入第二个 Tally 的 URL，再次点击 "Add Tally Section"
4. 重复步骤 2-3

### 一个 section 多个用途
- 同一个 Tally section 可以有不同的配置
- 不同的宽度和内边距显示
- 通过选中 + "Apply Settings" 快速切换

---

## 🔄 数据持久化

所有修改都会立即保存到 localStorage：
- 添加新 section → 自动保存
- 应用设置 → 自动保存
- 刷新页面 → 所有数据恢复

---

## ❓ 常见问题

**Q: Apply Settings 没反应？**
A: 确保你已经在左侧 Sections 列表中点选了一个 Tally section。按钮会检查是否选中了 Tally 类型的 section。

**Q: 为什么不清空 URL 输入框？**
A: 这样设计是为了方便用户快速添加多个 Tally。如果需要清空，手动删除即可。

**Q: Apply Settings 只修改配置吗？**
A: 是的。它只修改宽度和内边距。如果需要修改 URL 或嵌入代码，需要：
1. 删除该 section
2. 添加新的 section

**Q: 可以修改 Tally URL 吗？**
A: 如果需要修改现有 section 的 URL，目前需要删除后重新添加。未来版本可能会添加编辑功能。

---

## 🚀 下一步计划

- [ ] 编辑现有 Tally 的 URL（不删除 section）
- [ ] 批量修改配置
- [ ] 导出单个 Tally section
- [ ] Tally section 预设配置模板

---

## 📝 更新日志

### v2.0 - Tally 按钮分离
- ✅ "Add Tally Section"：纯添加新 section
- ✅ "Apply Settings"：修改已选中 section 的配置
- ✅ 改进的 `selectSection()` 逻辑
- ✅ 更清晰的工作流程
