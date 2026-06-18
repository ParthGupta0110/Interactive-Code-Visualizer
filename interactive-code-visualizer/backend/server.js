const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Multi-Language Plain Text Structural Tokenizer
function universalParser(codeString) {
    const lines = codeString.split('\n');
    const programBody = [];
    
    let currentScope = programBody;
    const scopeStack = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Base location mockup metadata for clicking feature
        const loc = {
            start: { line: index + 1, column: 0 },
            end: { line: index + 1, column: line.length }
        };

        // 1. Detect Functions (JS, C++, Java, Python)
        if ((trimmed.startsWith('function ') || trimmed.startsWith('def ') || 
            (trimmed.includes('(') && (trimmed.startsWith('public ') || trimmed.startsWith('int ') || trimmed.startsWith('void ') || trimmed.startsWith('String ')))) 
            && !trimmed.includes('if') && !trimmed.includes('while') && !trimmed.includes('for')) {
            
            const nameMatch = trimmed.match(/(?:def|function)\s+([a-zA-Z0-9_]+)|([a-zA-Z0-9_]+)\s*\(/);
            const funcName = nameMatch ? (nameMatch[1] || nameMatch[2]) : "Method/Function";

            const node = { type: 'FunctionDeclaration', id: { name: funcName }, body: [], loc };
            currentScope.push(node);
            scopeStack.push(currentScope);
            currentScope = node.body;
        }
        // 2. Detect If Conditions
        else if (trimmed.startsWith('if ') || trimmed.startsWith('if(')) {
            const conditionMatch = trimmed.match(/if\s*\((.*)\)|if\s+(.*):?/);
            const condition = conditionMatch ? (conditionMatch[1] || conditionMatch[2]) : "condition";

            const node = { 
                type: 'IfStatement', 
                test: condition, 
                consequent: { type: 'BlockStatement', body: [] },
                alternate: { type: 'BlockStatement', body: [] },
                loc 
            };
            currentScope.push(node);
            scopeStack.push(currentScope);
            // Push into True branch body first
            scopeStack.push({ type: 'if-wrapper', node: node });
            currentScope = node.consequent.body;
        }
        // 3. Detect Else/Else If
        else if (trimmed.startsWith('else') || trimmed.startsWith('elif')) {
            // Pop out of the previous true branch if we are in an if-wrapper context
            if (scopeStack.length > 0 && scopeStack[scopeStack.length - 1].type === 'if-wrapper') {
                const wrapper = scopeStack.pop();
                currentScope = wrapper.node.alternate.body;
                scopeStack.push(wrapper); // keep context for closing brace later
            }
        }
        // 4. Detect For Loops
        else if (trimmed.startsWith('for ') || trimmed.startsWith('for(')) {
            const loopMatch = trimmed.match(/for\s*\((.*)\)|for\s+(.*):?/);
            const expression = loopMatch ? (loopMatch[1] || loopMatch[2]) : "loop block";

            const node = { type: 'ForStatement', init: expression, body: [], loc };
            currentScope.push(node);
            scopeStack.push(currentScope);
            currentScope = node.body;
        }
        // 5. Detect While Loops
        else if (trimmed.startsWith('while ') || trimmed.startsWith('while(')) {
            const loopMatch = trimmed.match(/while\s*\((.*)\)|while\s+(.*):?/);
            const expression = loopMatch ? (loopMatch[1] || loopMatch[2]) : "loop condition";

            const node = { type: 'WhileStatement', test: expression, body: [], loc };
            currentScope.push(node);
            scopeStack.push(currentScope);
            currentScope = node.body;
        }
        // 6. Detect Returns
        else if (trimmed.startsWith('return ') || trimmed.startsWith('return(')) {
            const retMatch = trimmed.match(/return\s*(.*);?/);
            const argument = retMatch ? retMatch[1].replace(';', '') : "";
            currentScope.push({ type: 'ReturnStatement', argument: argument, loc });
        }
        // 7. Variable Declarations / Assignments
        else if (trimmed.includes('=') && !trimmed.startsWith('//') && !trimmed.startsWith('#')) {
            const parts = trimmed.split('=');
            const varName = parts[0].replace(/(?:let|var|const|int|float|String|auto)\s+/, '').trim();
            const varValue = parts[1].replace(';', '').trim();
            currentScope.push({ 
                type: 'VariableDeclarator', 
                id: { name: varName }, 
                init: varValue,
                loc 
            });
        }
        // 8. Handle Closing Scope blocks (Braces for C++/Java/JS, indentation can be simulated)
        if (trimmed === '}' || trimmed.endsWith('}')) {
            if (scopeStack.length > 0) {
                let popped = scopeStack.pop();
                // If it was an if wrapper, we need to pop the parent body tracking layer as well
                if (popped.type === 'if-wrapper') {
                    popped = scopeStack.pop();
                }
                currentScope = popped;
            }
        }
    });

    return { program: { body: programBody } };
}

// REST Endpoint targeting selection triggers
app.post('/parse-code', (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    try {
        const structuralAST = universalParser(code);
        res.json({ ast: structuralAST });
    } catch (err) {
        res.status(500).json({ error: 'Universal processing pipeline broke.' });
    }
});

app.listen(5000, () => console.log('Universal Backend Engine running on port 5000'));