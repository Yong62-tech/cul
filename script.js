// 获取 DOM 元素
const display = document.getElementById('display');
const historyBody = document.getElementById('history-body'); // Target the tbody

// 用于存储历史记录的数组 (stores objects)
let calculationHistory = [];
// 新增：标志，用于判断显示屏当前是否显示的是计算结果
let isResultDisplayed = false;

// --- appendToDisplay (修改后) ---
function appendToDisplay(value) {
    const operators = ['/', '*', '-', '+'];
    const isOperator = operators.includes(value);
    // 检查输入是否为数字 (0-9) 或小数点 (.)
    const isNumberOrDot = /[0-9.]/.test(value);

    // 核心逻辑修改：处理 "=" 之后输入新数字的情况
    if (isResultDisplayed) {
        if (isNumberOrDot) {
            // 如果是结果状态，且输入了数字或点，则用新输入替换显示内容
            display.value = value;
        } else if (isOperator) {
            // 如果是结果状态，且输入了运算符，则保留结果，准备拼接运算符（由后续逻辑处理）
            // 不需要清空，只需重置标志
        }
        // 无论输入什么，只要是在结果显示后进行的第一次输入，就重置标志
        isResultDisplayed = false;
        // 如果是数字或点，我们已经设置了 display.value，无需执行下面的拼接逻辑，直接返回
        if (isNumberOrDot) {
             // 还需要处理以 '.' 开头的情况
             if (value === '.') {
                 display.value = '0.'; // 保持原有的 '.' 开头自动变 '0.' 的逻辑
             }
            return;
        }
        // 如果是运算符，则不返回，让后续逻辑拼接运算符
    }

    // --- 原有的输入验证和拼接逻辑 ---
    if (display.value === '错误') {
       clearDisplay(); // Clear display if it shows '错误' before appending
    }

    const lastChar = display.value.slice(-1);
    const lastIsOperator = operators.includes(lastChar);
    const lastIsDot = lastChar === '.';
    const isDot = value === '.';

    // 防止连续输入运算符 (替换最后一个)
    if (lastIsOperator && isOperator) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }
    // 防止输入多个小数点
    // (需要检查当前数字段是否已有小数点 - 稍微复杂，简化处理：如果最后是点，不允许再输入点)
    if (lastIsDot && isDot) {
        return; // Already handled the initial '.' case above
    }
     // 防止类似 '05' 的情况
    if (display.value === '0' && !isDot && !isOperator) {
         display.value = value;
         return;
    }
     // 处理 '操作符 + .' 的情况，变为 '操作符 + 0.'
    if (lastIsOperator && isDot) {
        display.value += '0.'; // Append '0.' after an operator
        return;
    }
     // 处理开头直接输入 '.' 的情况 (如果isResultDisplayed为false时)
     if (display.value === '' && isDot) {
         display.value = '0.';
         return;
     }

    // 正常拼接字符
    display.value += value;
}

// --- clearDisplay (修改后) ---
function clearDisplay() {
    display.value = '';
    isResultDisplayed = false; // 重置标志
}

// --- deleteLast (修改后) ---
function deleteLast() {
    if (display.value === '错误') {
        clearDisplay(); // clearDisplay 内部会重置标志
    } else {
        display.value = display.value.slice(0, -1);
        isResultDisplayed = false; // 删除操作后，不再是单纯的结果显示状态
    }
}

// --- calculateResult (修改后) ---
function calculateResult() {
    const expression = display.value;
    if (!expression || expression === '错误') return;

    try {
        let safeExpression = expression;
        const operators = ['/', '*', '-', '+'];
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

        const resultString = result.toString();
        display.value = resultString;
        isResultDisplayed = true; // **重要：计算成功后设置标志**

        addToHistory({ expression: expression, result: resultString });

    } catch (error) {
        console.error("Calculation Error:", error);
        display.value = '错误';
        isResultDisplayed = false; // **重要：计算出错也要重置标志**
    }
}

// --- History Functions (保持不变) ---
function addToHistory(entryObject) {
    calculationHistory.unshift(entryObject);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyBody.innerHTML = '';
    calculationHistory.forEach(entry => {
        const row = historyBody.insertRow(0);
        const cellExpression = row.insertCell(0);
        const cellResult = row.insertCell(1);
        cellExpression.textContent = entry.expression;
        cellResult.textContent = entry.result;
    });
}

function clearHistoryLog() {
    calculationHistory = [];
    updateHistoryDisplay();
}

// --- Optional LocalStorage functions (保持不变) ---
// function loadHistory() { ... }
// function saveHistory() { ... }
// window.onload = loadHistory;
