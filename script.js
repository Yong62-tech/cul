// 获取 DOM 元素
const display = document.getElementById('display');
const historyBody = document.getElementById('history-body');
const historyTableContainer = document.getElementById('history-table-container'); // 获取滚动容器

// 用于存储历史记录的数组 (stores objects)
let calculationHistory = [];
// 标志，用于判断显示屏当前是否显示的是计算结果
let isResultDisplayed = false;

// --- appendToDisplay 函数 ---
function appendToDisplay(value) {
    const operators = ['/', '*', '-', '+'];
    const isOperator = operators.includes(value);
    const isNumberOrDot = /[0-9.]/.test(value);

    // **核心逻辑：处理“=”之后首次输入的情况**
    if (isResultDisplayed) {
        if (isNumberOrDot) {
            // 清除旧结果，用新输入值替换显示内容
            if (value === '.') {
                display.value = '0.'; // 特殊处理直接输入小数点
            } else {
                display.value = value; // 用新数字替换结果
            }
            isResultDisplayed = false; // 清除标志
            return; // **重要：** 替换后终止函数
        } else if (isOperator) {
            // 不清除结果，只清除标志，让后续逻辑拼接运算符
            isResultDisplayed = false;
            // **重要：** 不 return，让代码继续执行
        }
    }

    // --- 常规输入处理逻辑 ---
    if (display.value === '错误') {
        clearDisplay();
    }

    const lastChar = display.value.slice(-1);
    const lastIsOperator = operators.includes(lastChar);

    // 处理连续运算符
    if (lastIsOperator && isOperator) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }

    // 处理小数点
    if (value === '.') {
        const currentSegment = display.value.split(/[\/*+-]/).pop();
        if (currentSegment.includes('.')) {
            return;
        }
        if (display.value === '' || lastIsOperator) {
            display.value += '0.';
            return;
        }
    }

    // 处理前导零
    if (display.value === '0' && value !== '.') {
        display.value = value;
        return;
    }

    // 默认追加
    display.value += value;
}

// --- clearDisplay 函数 ---
function clearDisplay() {
    display.value = '';
    isResultDisplayed = false; // 重置标志
}

// --- deleteLast 函数 ---
function deleteLast() {
    if (display.value === '错误') {
        clearDisplay();
    } else {
        const newValue = display.value.slice(0, -1);
         if (newValue === '' || newValue === '-') {
            display.value = '';
         } else {
            display.value = newValue;
         }
        isResultDisplayed = false; // 删除操作后重置标志
    }
}

// --- calculateResult 函数 ---
function calculateResult() {
    const expression = display.value;
     if (!expression || expression === '-' || expression === '错误' || ['/', '*', '-', '+'].includes(expression.slice(-1))) {
          return;
     }

    try {
        const calculate = new Function('return ' + expression);
        let result = calculate();

        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = parseFloat(result.toFixed(10));
        }
        if (!Number.isFinite(result)) {
             throw new Error("结果无效");
        }

        const resultString = result.toString();
        display.value = resultString;
        isResultDisplayed = true; // **设置标志：表示显示的是结果**

        addToHistory({ expression: expression, result: resultString }); // 添加历史记录

    } catch (error) {
        console.error("Calculation Error:", error);
        display.value = '错误';
        isResultDisplayed = false; // **重置标志：计算出错**
    }
}

// --- History Functions ---
function addToHistory(entryObject) {
    calculationHistory.unshift(entryObject); // 添加到数组开头
    updateHistoryDisplay(); // 更新表格显示
}

function updateHistoryDisplay() {
    // 清空现有表格行
    historyBody.innerHTML = '';

    // 用历史数据填充表格
    calculationHistory.forEach(entry => {
        const row = historyBody.insertRow(0); // 在 tbody 的最顶部插入新行
        const cellExpression = row.insertCell(0);
        const cellResult = row.insertCell(1);
        cellExpression.textContent = entry.expression;
        cellResult.textContent = entry.result;
    });

    // **自动滚动到顶部**
    if (historyTableContainer) { // 确保元素已获取
        historyTableContainer.scrollTop = 0; // 将滚动条设置到顶部
    }
}

function clearHistoryLog() {
    calculationHistory = []; // 清空数组
    updateHistoryDisplay(); // 更新显示 (表格变为空，滚动条也会回到顶部)
}

// --- Optional LocalStorage functions ---
// function loadHistory() { ... }
// function saveHistory() { ... }
// window.onload = loadHistory;
