// --- script.js (包含调试信息) ---

// 获取 DOM 元素
const display = document.getElementById('display');
const historyBody = document.getElementById('history-body');
const historyTableContainer = document.getElementById('history-table-container');

// --- 调试：检查元素是否获取成功 ---
if (!display) console.error("未能找到 ID 为 'display' 的元素");
if (!historyBody) console.error("未能找到 ID 为 'history-body' 的元素");
if (!historyTableContainer) console.error("未能找到 ID 为 'history-table-container' 的元素!"); // <-- 检查这个！

// 用于存储历史记录的数组 (stores objects)
let calculationHistory = [];
// 标志，用于判断显示屏当前是否显示的是计算结果
let isResultDisplayed = false;

// --- appendToDisplay 函数 ---
function appendToDisplay(value) {
    // console.log("appendToDisplay called with:", value); // 可选调试
    const operators = ['/', '*', '-', '+'];
    const isOperator = operators.includes(value);
    const isNumberOrDot = /[0-9.]/.test(value);

    if (isResultDisplayed) {
        if (isNumberOrDot) {
            if (value === '.') { display.value = '0.'; }
            else { display.value = value; }
            isResultDisplayed = false;
            return;
        } else if (isOperator) {
            isResultDisplayed = false;
        }
    }

    if (display.value === '错误') { clearDisplay(); }

    const lastChar = display.value.slice(-1);
    const lastIsOperator = operators.includes(lastChar);

    if (lastIsOperator && isOperator) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }

    if (value === '.') {
        const currentSegment = display.value.split(/[\/*+-]/).pop();
        if (currentSegment.includes('.')) { return; }
        if (display.value === '' || lastIsOperator) {
            display.value += '0.';
            return;
        }
    }

    if (display.value === '0' && value !== '.') {
        display.value = value;
        return;
    }

    display.value += value;
}

// --- clearDisplay 函数 ---
function clearDisplay() {
    // console.log("clearDisplay called"); // 可选调试
    display.value = '';
    isResultDisplayed = false;
}

// --- deleteLast 函数 ---
function deleteLast() {
    // console.log("deleteLast called"); // 可选调试
    if (display.value === '错误') {
        clearDisplay();
    } else {
        const newValue = display.value.slice(0, -1);
         if (newValue === '' || newValue === '-') { display.value = ''; }
         else { display.value = newValue; }
        isResultDisplayed = false;
    }
}

// --- calculateResult 函数 ---
function calculateResult() {
    // console.log("calculateResult called"); // 可选调试
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
        if (!Number.isFinite(result)) { throw new Error("结果无效"); }

        const resultString = result.toString();
        display.value = resultString;
        isResultDisplayed = true;

        console.log("计算成功，准备添加历史记录:", { expression: expression, result: resultString }); // 调试
        addToHistory({ expression: expression, result: resultString });

    } catch (error) {
        console.error("计算错误:", error); // 调试
        display.value = '错误';
        isResultDisplayed = false;
    }
}

// --- History Functions ---
function addToHistory(entryObject) {
    console.log("添加到历史记录数组:", entryObject); // 调试
    calculationHistory.unshift(entryObject);
    updateHistoryDisplay(); // 确保调用了更新函数
}

function updateHistoryDisplay() {
    console.log("开始更新历史记录显示..."); // 调试

    // 再次检查 historyBody 是否有效
    if (!historyBody) {
        console.error("错误: updateHistoryDisplay 中 historyBody 无效!");
        return;
    }
    historyBody.innerHTML = ''; // 清空表格体

    // 填充表格
    if (calculationHistory && Array.isArray(calculationHistory)) {
        calculationHistory.forEach(entry => {
            const row = historyBody.insertRow(0); // 在顶部插入行
            const cellExpression = row.insertCell(0);
            const cellResult = row.insertCell(1);
            // 基本检查 entry 对象
            cellExpression.textContent = (entry && entry.expression !== undefined) ? entry.expression : '无效表达式';
            cellResult.textContent = (entry && entry.result !== undefined) ? entry.result : '无效结果';
        });
         console.log(`历史记录表格已更新，共 ${calculationHistory.length} 条记录。`); // 调试
    } else {
         console.warn("calculationHistory 不是有效的数组。"); // 调试
    }


    // **尝试滚动到顶部**
    if (historyTableContainer) { // 检查容器元素是否存在
        console.log("尝试将 historyTableContainer 滚动到顶部..."); // 调试
        historyTableContainer.scrollTop = 0; // <--- 关键代码
        // --- 调试：检查滚动是否生效 ---
        // 使用 setTimeout 稍微延迟检查 scrollTop 值，给浏览器一点反应时间
        setTimeout(() => {
            if (historyTableContainer.scrollTop === 0) {
                console.log("滚动成功，scrollTop 现在是 0。"); // 调试
            } else {
                console.warn(`滚动可能未生效或被覆盖，scrollTop 现在是: ${historyTableContainer.scrollTop}`); // 调试
            }
        }, 100); // 延迟 100 毫秒检查

    } else {
        // 这个错误应该在页面加载时就被上面的 console.error 捕获了
        console.error("错误: updateHistoryDisplay 中 historyTableContainer 无效! 无法滚动。");
    }
     console.log("结束更新历史记录显示。"); // 调试
}

function clearHistoryLog() {
    console.log("清除历史记录..."); // 调试
    calculationHistory = [];
    updateHistoryDisplay(); // 更新显示为空白
}

// --- Optional LocalStorage functions ---
// function loadHistory() { ... }
// function saveHistory() { ... }
// window.onload = loadHistory;
