/**
 * 返回运算符的优先级 也可以判断一个字符是否是操作符
 * @param  {cahr} sign [description]
 * @return {int}      返回优先级
 */
function precedence(sign) {
    switch(sign) {
        case '*':
        case '/':
            return 4;
        case '+':
        case '-':
            return 3;
        case '(':
        case ')':
            return 2;
        case '#':
            return 1;
        default:
            return 0;
    }
}

/**
 * 將表达式的操作符与操作数用空格分隔开
 * @param  {string} exp 表达式
 * @return {string}     转化后的表达式
 */
function expSplit(exp) {
	var result = '';
	var i = 0;
	for(var i = 0, len = exp.length; i < len; i ++) {
		if(precedence(exp[i])) {
			result = result + ' ' + exp[i] + ' ';
		}
		else {
			result += exp[i];
		}
	}
	return result.replace(/\s{2}/g, " ");
}

/**
 * 先序遍历二叉树
 * @param  {object} bitTree 需要遍历的二叉树
 * @return {string}         先序遍历结果
 */
function preOrder(bitTree) {
	var exp = '';
	(function pre(bitTree) {
		if(!bitTree) return;
		exp += bitTree.data + ' ';
		pre(bitTree.leftChild);
		pre(bitTree.rightChild);
	})(bitTree);
	return exp.trim();
}

/**
 * 中序遍历二叉树
 * @param  {object} bitTree 所需遍历的二叉树
 * @return {string}         中序遍历结果
 */
function middleOrder(bitTree) {
	var exp = '';
	(function middle(bitTree) {
		if(!bitTree) return;
		middle(bitTree.leftChild);
		exp += bitTree.data + ' ';
		middle(bitTree.rightChild);
	})(bitTree);
	return exp.trim();
}


/**
 * 后序遍历二叉树
 * @param  {Object} bitTree 所需遍历的二叉树
 * @return {string}         中序遍历结果
 */
function postOrder(bitTree) {
	var exp = '';
	(function post(bitTree) {
		if(!bitTree) return;
		post(bitTree.leftChild);
		post(bitTree.rightChild);
		exp += bitTree.data + ' ';
	})(bitTree);
	return exp.trim();
}


/**
 * [createTreeNode description]
 * @param  {[char]} data       [节点的值]
 * @param  {[object]} rightChild [节点的右子树]
 * @param  {[object]} leftChild  [节点的左子树]
 * @return {[object]}            [一个二叉树的根节点]
 */
function createTreeNode(data, rightChild, leftChild) {
	var data = data || null,
		leftChild = leftChild || null,
		rightChild = rightChild || null;
	return {
		data: data,
		leftChild: leftChild,
		rightChild: rightChild
	}
}

/**
 * 根据传入的字符串表达式构建二叉树
 * @param  {string} exp 中序表达式
 * @return {bitBree object}     构建好的二叉树
 */
function buildBitTree(exp) {
	var exp = expSplit(exp).split(' ');         // 表达式转换成数组     
		os = [],								// 操作符栈       operatorStack
		bts = [],								// 二叉树栈       bitTreeStack
		bt = null,								// 二叉树         bittree
		temp = '';                     			 // 用于暂存操作符的字符变量
	os.push('#');
	for(var i = 0, len = exp.length; i < len; i ++) {
		if(precedence(exp[i])) {
			if(exp[i] == '(') {
				os.push(exp[i]);
			}
			else if(exp[i] == ')') {
				while(os[os.length - 1] != '(') {
					bt = createTreeNode(os.pop(), bts.pop(), bts.pop());
					bts.push(bt);
				}
				os.pop();
			}
			else if(precedence(exp[i]) > precedence(os[os.length - 1])) {
				os.push(exp[i]);
			}
			else if(precedence(exp[i]) <= precedence(os[os.length - 1])) {
				while( (precedence(exp[i]) <= precedence(os[os.length - 1])) && 
					os[os.length - 1] != '#' && 
					os[os.length - 1] != '(' && 
					os[os.length - 1] != ')' ) {

					bt = createTreeNode(os.pop(), bts.pop(), bts.pop());
					bts.push(bt);
				}
				os.push(exp[i]);
			}
		}
		else {
			bt = createTreeNode(exp[i]);
			bts.push(bt);
		}
	}
	while((temp = os.pop())!= '#') {
		bt = createTreeNode(temp, bts.pop(), bts.pop());
		bts.push(bt);
	}
	return bts.pop();
}

/**
 * 根据后戳表达式计算表达式的结果
 * @param  {string} exp 后戳表达式
 * @return {number}     计算结果
 */
function workOut(exp) {
	var exp = exp.split(' '),       // 將后戳表达式分割成数组
		numStack = [],            	// 操作数栈
		temp = 0;               	// 用于暂存计算结果

	for(var i = 0, len = exp.length; i < len; i ++) {
		if(precedence(exp[i])) {
			switch(exp[i]) {
				case '+':
					temp = numStack.pop() + numStack.pop();
					break;
				case '*':
					temp = numStack.pop() + numStack.pop();
					break;
				case '/':
					temp = 1 / numStack.pop() + numStack.pop();
					break;
				case '-':
					temp = - (numStack.pop() - numStack.pop());
					break;
			}
			numStack.push(temp);
		}
		else {
			numStack.push(parseInt(exp[i]));
		}
	}
	return numStack.pop();
}




var exp = process.argv.slice(2); // 传入的表达式,同时可传入多哥表达式

// 遍历表达式避免
exp.forEach(function(item){
	var T = buildBitTree(item); 							// 构建二叉树
	var rpn = postOrder(T);									// 后序遍历二叉树將返回值保存在
	var result = workOut(rpn);                              // 根据逆波兰表达式计算结果
	console.log(item + ': ');
	console.log('   先序遍历结果: %s', preOrder(T));
	console.log('   中序遍历结果: %s', middleOrder(T));
	console.log('   后序遍历结果: %s', rpn);
	console.log('   计算结果为:%s', result);
});	