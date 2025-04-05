let display = document.getElementById('display');
let historyBody = document.getElementById('history-body');
let historyTableContainer = document.getElementById('history-table-container');
let calculationHistory = [];

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    try {
        const expression = display.value;
        const result = eval(expression);
        display.value = result;
        addToHistory(expression, result);
    } catch (error) {
        display.value = '错误';
    }
}

function addToHistory(expression, result) {
    calculationHistory.push({ expression, result });
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyBody.innerHTML = '';

    calculationHistory.forEach(entry => {
        const row = historyBody.insertRow(); // 添加到底部
        const cellExpression = row.insertCell(0);
        const cellResult = row.insertCell(1);
        cellExpression.textContent = entry.expression;
        cellResult.textContent = entry.result;
    });

requestAnimationFrame(() => {
    historyTableContainer.scrollTo({
        top: historyTableContainer.scrollHeight,
        behavior: 'auto'  // 或 'smooth'，看你喜好
    });
});

}

function clearHistoryLog() {
    calculationHistory = [];
    updateHistoryDisplay();
}
