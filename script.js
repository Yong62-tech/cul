// --- script.js (使用 scrollTo 尝试解决滚动问题) ---

// 获取 DOM 元素 (保持不变)
const display = document.getElementById('display');
const historyBody = document.getElementById('history-body');
const historyTableContainer = document.getElementById('history-table-container');

// 检查元素获取 (保持不变)
if (!display) console.error("未能找到 ID 为 'display' 的元素");
if (!historyBody) console.error("未能找到 ID 为 'history-body' 的元素");
if (!historyTableContainer) console.error("未能找到 ID 为 'history-table-container' 的元素!");

// 变量 (保持不变)
let calculationHistory = [];
let isResultDisplayed = false;

// --- appendToDisplay, clearDisplay, deleteLast, calculateResult 函数保持不变 ---
// (省略，与上个版本相同)
function appendToDisplay(value) {
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

function clearDisplay() {
    display.value = '';
    isResultDisplayed = false;
}

function deleteLast() {
    if (display.value === '错误') {
        clearDisplay();
    } else {
        const newValue = display.value.slice(0, -1);
         if (newValue === '' || newValue === '-') { display.value = ''; }
         else { display.value = newValue; }
        isResultDisplayed = false;
    }
}

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
        if (!Number.isFinite(result)) { throw new Error("结果无效"); }

        const resultString = result.toString();
        display.value = resultString;
        isResultDisplayed = true;

        // console.log("计算成功，准备添加历史记录:", { expression: expression, result: resultString });
        addToHistory({ expression: expression, result: resultString });

    } catch (error) {
        console.error("计算错误:", error);
        display.value = '错误';
        isResultDisplayed = false;
    }
}


// --- History Functions ---
function addToHistory(entryObject) {
    // console.log("添加到历史记录数组:", entryObject);
    calculationHistory.unshift(entryObject);
    updateHistoryDisplay();
}

// **** 修改 updateHistoryDisplay 函数 ****
function updateHistoryDisplay() {
    // console.log("开始更新历史记录显示...");

    if (!historyBody) {
        console.error("错误: updateHistoryDisplay 中 historyBody 无效!");
        return;
    }
    historyBody.innerHTML = ''; // 清空表格体

    if (calculationHistory && Array.isArray(calculationHistory)) {
        calculationHistory.forEach(entry => {
            const row = historyBody.insertRow(0); // 在顶部插入行
            const cellExpression = row.insertCell(0);
            const cellResult = row.insertCell(1);
            cellExpression.textContent = (entry && entry.expression !== undefined) ? entry.expression : '无效表达式';
            cellResult.textContent = (entry && entry.result !== undefined) ? entry.result : '无效结果';
        });
        // console.log(`历史记录表格已更新，共 ${calculationHistory.length} 条记录。`);
    } else {
        // console.warn("calculationHistory 不是有效的数组。");
    }

    // **修改点：使用 scrollTo({ top: 0, behavior: 'instant' })**
    if (historyTableContainer) {
        // 仍然建议在 requestAnimationFrame 中执行，以获得最佳时序
        requestAnimationFrame(() => {
            console.log("在 rAF 中尝试使用 scrollTo({ top: 0, behavior: 'instant' }) 滚动..."); // 调试日志
            historyTableContainer.scrollTo({
                top: 0, // 滚动到顶部
                behavior: 'instant' // 立即滚动，无需平滑动画
            });
            // 检查 scrollTop 值是否真的变为 0
            console.log(`滚动后 scrollTop 值: ${historyTableContainer.scrollTop}`); // 调试日志
        });
    } else {
        console.error("错误: updateHistoryDisplay 中 historyTableContainer 无效! 无法滚动。");
    }
    // console.log("结束更新历史记录显示。");
}

function clearHistoryLog() {
    // console.log("清除历史记录...");
    calculationHistory = [];
    updateHistoryDisplay();
}

// --- Optional LocalStorage functions (保持不变) ---
// function loadHistory() { ... }
// function saveHistory() { ... }
// window.onload = loadHistory;
