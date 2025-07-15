

# 日语学习卡片应用 - 软件规格说明书

## 1. 项目概述

### 1.1 项目名称
日语学习卡片应用 (Japanese Flashcards App)

### 1.2 技术栈
- **前端框架**: React + TypeScript
- **构建工具**: Vite
- **样式**: 原生 CSS
- **数据存储**: SessionStorage（会话存储）

### 1.3 核心功能
- 日语-中文词汇卡片学习
- 卡片翻转查看答案
- 学习进度追踪
- 错题重练
- 测试模式
- 学习统计

## 2. 功能规格

### 2.1 卡片学习模式

#### 2.1.1 卡片展示
- 正面显示日语词汇
- 点击卡片翻转显示中文释义
- 翻转动画效果（CSS 3D transform）

#### 2.1.2 学习反馈
- 翻转后显示两个按钮：
  - "认识" - 标记为已掌握
  - "不认识" - 标记为需复习
- 点击按钮后自动显示下一张卡片

#### 2.1.3 分类管理
- 三个词汇分类：
  - 交通（こうつう）
  - 天气（てんき）
  - 食物（たべもの）
- 用户可选择学习特定分类或全部卡片

### 2.2 复习模式
- 独立的"错题复习"入口
- 仅显示标记为"不认识"的卡片
- 复习时可重新标记掌握状态

### 2.3 测试模式

#### 2.3.1 选择题测试
- 显示日语词汇
- 提供4个中文选项（1个正确 + 3个干扰项）
- 选择后立即显示对错反馈
- 记录测试成绩

#### 2.3.2 填空题测试
- 显示日语词汇
- 输入框填写中文释义
- 提交后显示正确答案
- 支持模糊匹配（忽略标点符号）

### 2.4 统计页面
- 显示以下数据：
  - 总学习卡片数
  - 已掌握卡片数
  - 需复习卡片数
  - 各分类学习进度
  - 测试正确率
  - 学习时长（本次会话）

## 3. 数据结构

### 3.1 卡片数据格式
```typescript
interface Flashcard {
  id: string;
  japanese: string;
  chinese: string;
  category: 'traffic' | 'weather' | 'food';
  romaji?: string; // 罗马音（可选）
}

interface LearningProgress {
  cardId: string;
  isKnown: boolean;
  lastReviewed: number; // timestamp
  reviewCount: number;
}

interface TestResult {
  cardId: string;
  isCorrect: boolean;
  timestamp: number;
  testType: 'multiple-choice' | 'fill-blank';
}
```

### 3.2 SessionStorage 数据键
- `learning-progress`: 学习进度数据
- `test-results`: 测试结果记录
- `app-settings`: 应用设置（如深色模式）
- `session-stats`: 会话统计数据

## 4. 用户界面设计

### 4.1 页面结构
```
├── 导航栏
│   ├── Logo/应用名称
│   ├── 分类选择器
│   ├── 模式切换（学习/复习/测试/统计）
│   └── 深色模式切换
├── 主内容区
│   └── 根据当前模式显示相应内容
└── 底部信息栏
    └── 当前进度指示器
```

### 4.2 响应式设计
- 移动端优先设计
- 断点：
  - 移动端: < 768px
  - 平板: 768px - 1024px
  - 桌面: > 1024px

### 4.3 深色模式
- CSS 变量控制主题色
- 平滑过渡动画
- 保存用户偏好到 SessionStorage

## 5. 预设词汇数据

### 5.1 数据分布
- 交通类：17个词汇
- 天气类：17个词汇
- 食物类：16个词汇
- 总计：50个词汇

### 5.2 示例数据
```typescript
const flashcardsData: Flashcard[] = [
  // 交通类
  { id: 'tr001', japanese: '電車', chinese: '电车', category: 'traffic', romaji: 'densha' },
  { id: 'tr002', japanese: '自動車', chinese: '汽车', category: 'traffic', romaji: 'jidousha' },
  // 天气类
  { id: 'we001', japanese: '晴れ', chinese: '晴天', category: 'weather', romaji: 'hare' },
  { id: 'we002', japanese: '雨', chinese: '雨', category: 'weather', romaji: 'ame' },
  // 食物类
  { id: 'fo001', japanese: 'ご飯', chinese: '米饭', category: 'food', romaji: 'gohan' },
  { id: 'fo002', japanese: 'パン', chinese: '面包', category: 'food', romaji: 'pan' },
  // ... 更多词汇
];
```

## 6. 技术实现细节

### 6.1 项目结构
```
src/
├── components/
│   ├── Flashcard/
│   ├── Navigation/
│   ├── Statistics/
│   └── TestMode/
├── hooks/
│   ├── useSessionStorage.ts
│   ├── useTheme.ts
│   └── useFlashcards.ts
├── data/
│   └── flashcards.ts
├── styles/
│   ├── global.css
│   ├── themes.css
│   └── components/
├── types/
│   └── index.ts
└── App.tsx
```

### 6.2 关键组件说明

#### Flashcard 组件
- 使用 CSS transform 实现3D翻转效果
- 触摸/点击事件处理
- 动画状态管理

#### Navigation 组件
- 路由管理（使用 React Router）
- 分类筛选器
- 深色模式切换器

#### Statistics 组件
- 数据可视化（使用 Canvas 或 SVG）
- 实时数据更新
- 导出功能（可选）

### 6.3 性能优化
- 使用 React.memo 优化组件渲染
- 懒加载测试模式组件
- 预加载下一张卡片

