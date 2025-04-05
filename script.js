// 获取 DOM 元素
const display = document.getElementById('display');
const historyBody = document.getElementById('history-body'); // Target the tbody

// 用于存储历史记录的数组 (stores objects now)
let calculationHistory = [];

// --- appendToDisplay, clearDisplay, deleteLast remain largely the same ---
// (Included here for completeness)

// 向显示屏追加内容
function appendToDisplay(value) {
    const lastChar = display.value.slice(-1);
    const operators = ['/', '*', '-', '+'];
    const isOperator = operators.includes(value);
    const lastIsOperator = operators.includes(lastChar);
    const lastIsDot = lastChar === '.';
    const isDot = value === '.';

    if (display.value === '错误') {
        clearDisplay();
    }

    if (lastIsOperator && isOperator) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }
    if (lastIsDot && isDot) {
        return;
    }
    if (display.value === '' && isOperator && value !== '-') {
        return;
    }
    if (display.value === '0' && !isDot && !isOperator) {
         display.value = value;
         return;
    }
    if (display.value === '' && isDot) {
        display.value = '0.';
        return;
    }
    if (lastIsOperator && isDot) {
        display.value += '0.';
        return;
    }

    display.value += value;
}

// 清空显示屏
function clearDisplay() {
    display.value = '';
}

// 删除最后一个字符
function deleteLast() {
    if (display.value === '错误') {
        clearDisplay();
    } else {
        display.value = display.value.slice(0, -1);
    }
}

// 计算结果
function calculateResult() {
    const expression = display.value;
    if (!expression || expression === '错误') return;

    try {
        let safeExpression = expression;
        const operators = ['/', '*', '-', '+'];
        // Remove trailing operator for calculation, but keep original expression for history
        if (operators.includes(safeExpression.slice(-1))) {
            safeExpression = safeExpression.slice(0, -1);
        }

        if (!safeExpression) return;

        const calculate = new Function('return ' + safeExpression);
        let result = calculate();

        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = parseFloat(result.toFixed(10));
        }

        if (!Number.isFinite(result)) {
             throw new Error("结果无效");
        }

        const resultString = result.toString(); // Convert result to string for display
        display.value = resultString;

        // Add to history as an object
        addToHistory({ expression: expression, result: resultString }); // Use original expression

    } catch (error) {
        console.error("Calculation Error:", error);
        display.value = '错误';
    }
}

// --- History Functions Updated for Table ---

// 添加条目到历史记录数组并更新显示
function addToHistory(entryObject) {
    // entryObject should be { expression: "...", result: "..." }
    calculationHistory.unshift(entryObject); // Add to the beginning of the array

    // Optional: Limit history size
    // if (calculationHistory.length > 20) {
    //     calculationHistory.pop(); // Remove the oldest entry
    // }

    updateHistoryDisplay(); // Update the table display
}

// 更新页面上的历史记录表格
function updateHistoryDisplay() {
    // Clear existing table rows
    historyBody.innerHTML = '';

    // Populate table with history data (newest first because we use unshift)
    calculationHistory.forEach(entry => {
        const row = historyBody.insertRow(); // Inserts a row at the end of tbody

        const cellExpression = row.insertCell(0);
        const cellResult = row.insertCell(1);

        cellExpression.textContent = entry.expression;
        cellResult.textContent = entry.result;
    });

     // Optional: If using insertRow(0) to add at top, reverse the array first for correct order,
     // or just use insertRow() and let unshift handle the newest-first logic.
     // The current code uses unshift + insertRow(), effectively showing newest at the bottom.
     // To show newest at top with insertRow(): Iterate calculationHistory in reverse.
     // Or use insertRow(0) instead of insertRow() and iterate normally. Let's switch to insertRow(0):

     /* Revised loop for newest-at-top */
     historyBody.innerHTML = ''; // Clear again before revised loop
     calculationHistory.forEach(entry => {
        const row = historyBody.insertRow(0); // Insert row at the TOP of tbody

        const cellExpression = row.insertCell(0);
        const cellResult = row.insertCell(1);

        cellExpression.textContent = entry.expression;
        cellResult.textContent = entry.result;
    });
}

// 清除历史记录（由按钮调用）
function clearHistoryLog() {
    calculationHistory = []; // Clear the array
    updateHistoryDisplay(); // Update the display (empties the table body)
}

// --- End of History Functions ---

// Optional: Load/Save history from localStorage (add calls in relevant functions)
// function loadHistory() { ... }
// function saveHistory() { ... }
// window.onload = loadHistory;
