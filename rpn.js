function Precedence(sign) {
    switch(sign) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        case '#':
            return -1;
        case '(':
        default:
            return 0;
    }
}

function rpn(exp) {
	var sc = [];
	var len = exp.length;
	var ch;
	for(var i = 0; i < len; i++) {
		if(exp[i] === '+' || exp[i] === '-' || exp[i] === '*' || exp[i] === '/' || exp[i] === '(' || exp[i] === ')') {
			if(exp[i] === '(') {
				sc.push(exp[i]);
			} else if(exp[i] === ')') {
				while(sc[sc.length - 1] !== '(') {
					console.log(sc.pop());
				}
				sc.pop();
			} else if(Precedence(exp[i]) <= Precedence(sc[sc.length - 1])) {
				console.log(sc.pop());
				console.log(exp[i]);
			} else {
				sc.push(exp[i]);
			}
		} else {
			console.log(exp[i]);
		}
	}
	while(sc[0]) {
		console.log(sc.pop());
	}
}
var exp = "1+((2+5/6)-6)/8+9";
rpn(exp);
// console.log(rpn(exp));