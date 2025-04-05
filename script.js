// 获取 DOM 元素
const display = document.getElementById('display');
const historyBody = document.getElementById('history-body'); // Target the tbody

// 用于存储历史记录的数组 (stores objects)
let calculationHistory = [];
// 标志，用于判断显示屏当前是否显示的是计算结果
let isResultDisplayed = false;

// --- appendToDisplay (再次修正) ---
function appendToDisplay(value) {
    const operators = ['/', '*', '-', '+'];
    const isOperator = operators.includes(value);
    const isNumberOrDot = /[0-9.]/.test(value);

    // **核心逻辑：处理“=”之后首次输入的情况**
    if (isResultDisplayed) {
        if (isNumberOrDot) {
            // 如果是结果状态，且第一个输入是数字或点，则清除旧结果，直接用新输入值替换显示内容
            if (value === '.') {
                display.value = '0.'; // 特殊处理直接输入小数点的情况
            } else {
                display.value = value; // 用新数字替换结果
            }
            isResultDisplayed = false; // 清除标志
            return; // **重要：** 替换了显示内容后，终止此函数，不执行后续的拼接逻辑
        } else if (isOperator) {
            // 如果是结果状态，且第一个输入是运算符，则不清除结果，只清除标志，
            // 让后续的逻辑去拼接运算符
            isResultDisplayed = false;
            // **重要：** 不在此处 return，让代码继续执行下面的拼接逻辑
        }
        // 如果输入不是数字/点或运算符，也重置标志（尽管当前计算器没有这种情况）
        // else {
        //     isResultDisplayed = false;
        // }
    }

    // --- 常规输入处理逻辑 (如果不是上面 return 的情况) ---

    // 如果当前显示为 "错误", 则先清空
    if (display.value === '错误') {
        clearDisplay(); // clearDisplay 会重置 isResultDisplayed
    }

    // --- 输入验证和拼接 ---
    const lastChar = display.value.slice(-1);
    const lastIsOperator = operators.includes(lastChar);

    // 1. 处理连续运算符: 如果最后一位是运算符，且新输入的也是运算符，则替换
    if (lastIsOperator && isOperator) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }

    // 2. 处理小数点
    if (value === '.') {
        // 检查当前数字段是否已有小数点
        // 通过运算符分割字符串，取最后一段
        const currentSegment = display.value.split(/[\/*+-]/).pop();
        if (currentSegment.includes('.')) {
            return; // 当前段已有小数点，阻止输入
        }
        // 如果显示为空，或者前一位是运算符，则自动补 '0'
        if (display.value === '' || lastIsOperator) {
            display.value += '0.';
            return; // 已经添加了 '0.'，结束
        }
        // 其他情况，允许添加小数点（由最后的 display.value += value 处理）
    }

    // 3. 处理前导零：如果当前显示是 '0'，且输入的不是 '.', 则用新输入替换 '0'
    if (display.value === '0' && value !== '.') {
        display.value = value;
        return;
    }

    // 4. 默认追加: 如果以上特殊情况都未处理并返回，则将输入值追加到末尾
    display.value += value;
}


// --- clearDisplay (保持不变, 但确认包含 isResultDisplayed = false) ---
function clearDisplay() {
    display.value = '';
    isResultDisplayed = false; // 重置标志
}

// --- deleteLast (保持不变, 但确认包含 isResultDisplayed = false) ---
function deleteLast() {
    if (display.value === '错误') {
        clearDisplay(); // clearDisplay 内部会重置标志
    } else {
        // 检查删除后是否为空，或者是否只剩下负号
        const newValue = display.value.slice(0, -1);
         if (newValue === '' || newValue === '-') {
            display.value = ''; // 如果删除后为空或只剩负号，则清空
         } else {
            display.value = newValue;
         }

        isResultDisplayed = false; // 删除操作后，不再是单纯的结果显示状态
    }
}

// --- calculateResult (保持不变, 但确认包含 isResultDisplayed 标志设置) ---
function calculateResult() {
    const expression = display.value;
    // 防止对空、只有负号、错误状态或只有操作符结尾的表达式进行计算
     if (!expression || expression === '-' || expression === '错误' || ['/', '*', '-', '+'].includes(expression.slice(-1))) {
          return;
     }

    try {
        // 注意： new Function 有安全风险，但对于简单计算器可接受
        const calculate = new Function('return ' + expression);
        let result = calculate();

        // 处理精度和无效结果
        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = parseFloat(result.toFixed(10)); // 控制小数位数
        }
        if (!Number.isFinite(result)) {
             throw new Error("结果无效");
        }

        const resultString = result.toString();
        display.value = resultString;
        isResultDisplayed = true; // **设置标志：表示显示的是结果**

        // 添加历史记录
        addToHistory({ expression: expression, result: resultString });

    } catch (error) {
        console.error("Calculation Error:", error);
        display.value = '错误';
        isResultDisplayed = false; // **重置标志：计算出错**
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
