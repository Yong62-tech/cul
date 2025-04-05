// 获取显示屏元素
const display = document.getElementById('display');

// 向显示屏追加内容
function appendToDisplay(value) {
    // 防止连续输入多个小数点或运算符（基础检查）
    const lastChar = display.value.slice(-1);
    const operators = ['/', '*', '-', '+'];
    const isOperator = operators.includes(value);
    const lastIsOperator = operators.includes(lastChar);
    const lastIsDot = lastChar === '.';
    const isDot = value === '.';

    // 如果最后一位是运算符，并且当前输入也是运算符，则替换最后一位 (例如 5+* -> 5*)
    if (lastIsOperator && isOperator) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }
    // 如果最后一位是小数点，并且当前输入也是小数点，则不追加
    if (lastIsDot && isDot) {
        return;
    }
    // 简单防止以运算符开头 (允许负号开头)
    if (display.value === '' && isOperator && value !== '-') {
        return;
    }
     // 防止出现类似 '05' 这样的数字，如果当前是0，下一个不是小数点，则替换0
    if (display.value === '0' && !isDot && !isOperator) {
         display.value = value;
         return;
    }
     // 防止小数点前没有数字，例如 .5 -> 0.5
    if (display.value === '' && isDot) {
        display.value = '0.';
        return;
    }
    // 防止运算符后直接跟小数点，例如 5+. -> 5+0.
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
    display.value = display.value.slice(0, -1);
}

// 计算结果
function calculateResult() {
    try {
        // 使用 Function 构造函数代替 eval 来提高一点安全性
        // 注意：这仍然可能执行任意代码，但在受控环境下比直接 eval 稍好
        // 对于简单的计算器来说，这是常见的做法，但在需要更高安全性的场景下应避免
        const calculate = new Function('return ' + display.value);
        let result = calculate();

        // 处理浮点数精度问题
        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = parseFloat(result.toFixed(10)); // 保留最多10位小数
        }

        display.value = result;
    } catch (error) {
        // 如果表达式无效，显示错误信息
        display.value = '错误';
        // 短暂显示错误后清空
        setTimeout(clearDisplay, 1500);
    }
}