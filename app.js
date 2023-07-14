"use strict";
(() => {
    const display1 = document.querySelector(".display1 textarea");
    const display2 = document.querySelector(".display2 textarea");
    const inputbtn = document.querySelector(".inputs");
    const memoryRecallAndClear = document.querySelectorAll(".blur button");
    let lastclick;
    let memoryVar;
    const memoryFunc = ["M+", "M-", "MC", "MS", "MR"];
    const oparators = ["+", "-", "*", "/"];
    const valid = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "+",
        "-",
        "*",
        "/",
        "(",
        ")",
        ".",
    ];
    const trigno = [
        "sin(",
        "cos(",
        "tan(",
        "asin(",
        "acos(",
        "atan(",
        "log(",
        "ln(",
        "^2",
        "^-1",
        "^",
        "10^",
        "√(",
        "1/",
        "e^",
        "π",
        "e",
        "mod",
    ];
    inputbtn.addEventListener("click", (e) => {
        let clickedBtn = e.target.value;
        let display1Value = (display1.value).slice(0, display1.value.length - 1);
        if (String(clickedBtn) !== "undefined") {
            switch (clickedBtn) {
                case "!":
                    if (display1.value != "") {
                        display1.value += clickedBtn;
                    }
                    break;
                case "|x|":
                    let getpositive = givePositive(display1.value);
                    display2.value = "|" + display1.value + "|=" + eval(getpositive);
                    display1.value = "";
                    break;
                case "ac":
                    display1.value = "";
                    display2.value = "";
                    break;
                case valid.includes(clickedBtn) ? clickedBtn : false:
                    display1.value += clickedBtn;
                    break;
                case "=":
                    equalTo();
                    break;
                case "back":
                    display1.value = display1Value;
                    break;
                case trigno.includes(clickedBtn) ? clickedBtn : false:
                    display1.value += clickedBtn;
                    break;
                case memoryFunc.includes(clickedBtn) ? clickedBtn : false:
                    memory(clickedBtn);
                    break;
                case "C":
                    if (typeof lastclick != "undefined") {
                        display1.value = lastclick;
                    }
                    break;
                case "+/-":
                    plusOrMinus();
                    break;
            }
        }
    });
    function enableOrDisable(btns, trueOrFalse) {
        btns.forEach((element) => {
            element.disabled = trueOrFalse;
        });
    }
    function validateString(rawString) {
        let validString = rawString
            .replaceAll("log", "Math.log10")
            .replaceAll("ln", "Math.log")
            .replaceAll("^", "**")
            .replaceAll("√", "Math.sqrt")
            .replaceAll("e", "Math.E")
            .replaceAll("π", "Math.PI")
            .replaceAll("sin", "Math.sin")
            .replaceAll("cos", "Math.cos")
            .replaceAll("tan", "Math.tan")
            .replaceAll("sin-1", "asin")
            .replaceAll("cos-1", "acos")
            .replaceAll("tan-1", "atan")
            .replaceAll("mod", "%");
        return validString;
    }
    function givePositive(rawString) {
        let validString = rawString.replace("|x|", "");
        validString = "Math.abs(" + validString + ")";
        return validString;
    }
    function getFactorial(n) {
        let answer = 1;
        if (n == 0 || n == 1) {
            return answer;
        }
        else if (n > 1) {
            for (var i = n; i >= 1; i--) {
                answer = answer * i;
            }
            return answer;
        }
    }
    function memory(data) {
        let indexofEqual = display2.value.indexOf("=");
        let ans = display2.value.substring(indexofEqual + 1);
        switch (data) {
            case "MS":
                if (ans != "") {
                    memoryVar = ans;
                    enableOrDisable(memoryRecallAndClear, false);
                }
                break;
            case "MC":
                memoryVar = null;
                enableOrDisable(memoryRecallAndClear, true);
                break;
            case "M+":
                memoryVar = String(Number(memoryVar) + Number(ans));
                break;
            case "M-":
                memoryVar = String(memoryVar - Number(ans));
                break;
            case "MR":
                display1.value = memoryVar;
                break;
        }
    }
    function equalTo() {
        let input, output;
        try {
            input = display1.value;
            replaceFactorial();
            if (display1.value != "") {
                let validString = validateString(display1.value);
                output = eval(validString);
                display2.value = input + "=" + output;
                lastclick = display1.value;
                display1.value = "";
            }
            else {
                let indexofEqual = display2.value.indexOf("=");
                display1.value = display2.value.substr(indexofEqual + 1);
                display2.value = "";
            }
            successfull();
        }
        catch (error) {
            errors();
        }
    }
    function plusOrMinus() {
        if (display1.value != "" && display1.value[0] != "-") {
            if (+display1.value[0] != 0) {
                display1.value = "-(" + display1.value + ")";
            }
        }
        else if (display1.value[0] == "-") {
            display1.value = display1.value
                .replace("-", "")
                .replace("(", "")
                .replace(")", "");
            console.log("display1.value", display1.value);
        }
    }
    function replaceFactorial() {
        let index1, index2;
        while (display1.value.includes("!")) {
            let factorial = display1.value;
            index1 = display1.value.indexOf("!");
            if (factorial[index1 - 1] === ")") {
                let bracketCount;
                let index3 = index1 - 1;
                let index4 = 0;
                for (let i = index1; i >= 0; i--) {
                    bracketCount = 0;
                    if (factorial[i] === ")") {
                        bracketCount++;
                    }
                    else if (factorial[i] === "(") {
                        bracketCount--;
                        index4 = i - 1;
                        break;
                    }
                }
                display1.value = display1.value.replace(display1.value.slice(index4 + 1, index3 + 1), eval(display1.value.slice(index4 + 1, index3 + 1)));
            }
            else {
                let i;
                for (i = index1; i >= 0; i--) {
                    if (oparators.includes(factorial[i])) {
                        break;
                    }
                }
                index2 = i;
                let bigNumber = String(getFactorial(+display1.value.slice(index2 + 1, index1)));
                display1.value = display1.value.replace(display1.value.slice(index2 + 1, index1 + 1), String(BigInt(bigNumber)));
            }
        }
    }
    function errors() {
        display2.value = "ERROR: Please Enter Valid Inputs";
        display2.style.color = "red";
        display2.style.fontSize = "large";
    }
    function successfull() {
        display2.style.color = "black";
        display2.style.fontSize = "x-large";
    }
})();
