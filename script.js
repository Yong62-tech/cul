/* --- 基本和计算器样式 --- */
body {
    display: flex;
    flex-direction: column; /* 让计算器和历史记录垂直排列 */
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f0f0; /* 淡灰色背景 */
    font-family: sans-serif;
    padding: 20px; /* 给页面边缘一些空间 */
    box-sizing: border-box;
}

.calculator {
    background-color: #333; /* 深灰色计算器背景 */
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 100%; /* 宽度适应 */
    max-width: 320px; /* 最大宽度 */
    box-sizing: border-box;
}

#display {
    width: 100%; /* 宽度充满容器 */
    padding: 15px 10px;
    font-size: 2em;
    text-align: right;
    border: none;
    background-color: #444; /* 稍浅的显示屏背景 */
    color: #fff; /* 白色文字 */
    border-radius: 5px;
    margin-bottom: 15px;
    box-sizing: border-box; /* padding 不会增加宽度 */
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4 列等宽 */
    gap: 10px; /* 按钮间距 */
}

button {
    padding: 15px;
    font-size: 1.2em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #555; /* 按钮默认背景 */
    color: #fff; /* 按钮文字颜色 */
    transition: background-color 0.2s ease;
    min-height: 50px; /* 保证按钮有一定高度 */
}

button:hover {
    background-color: #666; /* 鼠标悬停效果 */
}

button:active {
    background-color: #777; /* 鼠标点击效果 */
}

.operator {
    background-color: #f0ad4e; /* 橙色操作符 */
    color: #fff;
}

.operator:hover {
    background-color: #ec971f;
}

.operator:active {
    background-color: #d58512;
}

.clear {
    background-color: #d9534f; /* 红色清除按钮 */
    color: #fff;
}

.clear:hover {
    background-color: #c9302c;
}

.clear:active {
    background-color: #ac2925;
}

.equals {
    background-color: #5cb85c; /* 绿色等于按钮 */
    color: #fff;
    grid-row: span 2; /* 等于号按钮占两行 */
}

.equals:hover {
    background-color: #4cae4c;
}

.equals:active {
    background-color: #449d44;
}

.zero {
    grid-column: span 2; /* 0 按钮占两列 */
}

/* --- 历史记录区域样式 --- */
.history-container {
    margin-top: 30px; /* 与计算器保持距离 */
    width: 100%; /* 宽度适应 */
    max-width: 320px; /* 最大宽度与计算器一致 */
    padding: 15px;
    background-color: #e9e9e9; /* 浅灰色背景 */
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    max-height: 200px; /* 设置最大高度，超出则滚动 */
    overflow-y: auto; /* 内容超出时显示垂直滚动条 */
    box-sizing: border-box;
    display: flex; /* 使用 flex 布局方便管理内部元素 */
    flex-direction: column; /* 内部元素垂直排列 */
}

.history-container h2 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.1em;
    color: #333;
    text-align: center;
    border-bottom: 1px solid #ccc; /* 标题下加条线 */
    padding-bottom: 5px;
    flex-shrink: 0; /* 标题不收缩 */
}

#history-list {
    list-style: none; /* 去掉列表项前面的点 */
    padding: 0;
    margin: 0 0 10px 0; /* 列表底部留出空间给按钮 */
    flex-grow: 1; /* 列表区域占据剩余空间 */
    overflow-y: auto; /* 列表本身也可以滚动（如果内容超多）*/
    min-height: 50px; /* 保证列表有最小高度 */
}

#history-list li {
    padding: 8px 5px;
    border-bottom: 1px dashed #ccc; /* 每条记录间用虚线分隔 */
    font-size: 0.95em;
    color: #555;
    word-wrap: break-word; /* 长表达式换行 */
    text-align: right; /* 记录右对齐 */
}

#history-list li:last-child {
    border-bottom: none; /* 最后一条记录无下划线 */
}

#clear-history {
    display: block; /* 让按钮独占一行 */
    width: 100%; /* 按钮宽度充满容器 */
    padding: 8px;
    font-size: 0.9em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #f0ad4e; /* 橙色 */
    color: #fff;
    transition: background-color 0.2s ease;
    margin-top: 10px; /* 与列表保持距离 */
    flex-shrink: 0; /* 清除按钮不收缩 */
}

#clear-history:hover {
    background-color: #ec971f;
}
