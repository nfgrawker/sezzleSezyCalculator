window.onload = function () {
    let poll = function () {

        setTimeout(function () {
            $.ajax({
                url: "/calculate",
                type: "GET",
                success: function (data) {
                    console.log("polling");
                },
                dataType: "json",
                complete: poll,
                timeout: 2000
            }).then(response => {

                keysOfDict = Object.keys(response);
                let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
                $(".prepend").empty();
                keysOfDict.forEach(value => {
                    if (numbers.includes(value)) {
                        $(".prepend").append("<h2>" + response[value]["first"] + " " + response[value]["operator"] + " " + response[value]["second"] + " = " + response[value]["result"] + "</h2>")
                    }
                })

            })
        }, 500);
    };

    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    function inputDigit(digit) {
        const {
            displayValue,
            waitingForSecondOperand
        } = calculator;

        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function inputDecimal(dot) {
        // If the `displayValue` does not contain a decimal point
        if (!calculator.displayValue.includes(dot)) {
            // Append the decimal point
            calculator.displayValue += dot;
        }
    }

    function handleOperator(nextOperator) {
        const {
            firstOperand,
            displayValue,
            operator
        } = calculator
        const inputValue = parseFloat(displayValue);
        if (operator && calculator.waitingForSecondOperand) {
                calculator.operator = nextOperator;
                return;

        }

        if (firstOperand == null) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const currentValue = firstOperand || 0;
            const result = performCalculation[operator](currentValue, inputValue);
                jsonObjectToSend = {
                    result: result,
                    first: currentValue,
                    second: inputValue,
                    operator: operator
                };
                $(".prepend :last-child").last().hide();
                let csrftoken = $("[name=csrfmiddlewaretoken]").val();
                $.ajax({
                    type: "POST",
                    url: "/calculate/",
                    data: JSON.stringify(jsonObjectToSend),
                    contentType: "application/json",
                    headers: {
                        "X-CSRFToken": csrftoken
                    },
                });
            calculator.displayValue = String(result);
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    }

    const performCalculation = {
        '/': (firstOperand, secondOperand) => firstOperand / secondOperand,

        '*': (firstOperand, secondOperand) => firstOperand * secondOperand,

        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,

        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,

        '=': (firstOperand, secondOperand) => secondOperand
    };

    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
    }

    function updateDisplay() {
        const display = document.querySelector('.calculator-screen');
        display.value = calculator.displayValue;
    }

    updateDisplay();

    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', (event) => {
        const {
            target
        } = event;
        if (!target.matches('button')) {
            return;
        }

        if (target.classList.contains('operator')) {
            handleOperator(target.value);
            updateDisplay();
            return;
        }

        if (target.classList.contains('decimal')) {
            inputDecimal(target.value);
            updateDisplay();
            return;
        }

        if (target.classList.contains('all-clear')) {
            resetCalculator();
            updateDisplay();
            return;
        }

        inputDigit(target.value);
        updateDisplay();
    });
    poll()

};