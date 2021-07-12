"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInterpolateNode = exports.createTemplateExpressionNode = exports.createImportTypeNode = exports.createFunctionNode = exports.createComputedNode = exports.createArrayLiteralNode = exports.createNumericLiteralNode = exports.createStringLiteralNode = exports.createIdentifierNode = void 0;
function createIdentifierNode(value, next) {
    return {
        kind: "Identifier",
        value: value,
        next: next
    };
}
exports.createIdentifierNode = createIdentifierNode;
function createStringLiteralNode(value, next) {
    return {
        kind: "StringLiteral",
        value: value,
        next: next
    };
}
exports.createStringLiteralNode = createStringLiteralNode;
function createNumericLiteralNode(value, next) {
    return {
        kind: "NumericLiteral",
        value: value,
        next: next
    };
}
exports.createNumericLiteralNode = createNumericLiteralNode;
function createArrayLiteralNode(elements, next) {
    return {
        kind: "ArrayLiteral",
        elements: elements,
        next: next
    };
}
exports.createArrayLiteralNode = createArrayLiteralNode;
function createComputedNode(value, next) {
    return {
        kind: "Computed",
        value: value,
        next: next
    };
}
exports.createComputedNode = createComputedNode;
function createFunctionNode(value, parameterNames, next) {
    return {
        kind: "Function",
        parameterNames: parameterNames,
        value: value,
        next: next
    };
}
exports.createFunctionNode = createFunctionNode;
function createImportTypeNode(isTypeOf, argument, next) {
    return {
        kind: "ImportType",
        isTypeOf: isTypeOf,
        argument: argument,
        next: next
    };
}
exports.createImportTypeNode = createImportTypeNode;
function createTemplateExpressionNode(parts, next) {
    return {
        kind: "TemplateExpression",
        parts: parts,
        next: next
    };
}
exports.createTemplateExpressionNode = createTemplateExpressionNode;
function createInterpolateNode(expression, expressionText, next) {
    return {
        kind: "Interpolate",
        expression: expression,
        expressionText: expressionText,
        next: next
    };
}
exports.createInterpolateNode = createInterpolateNode;
//# sourceMappingURL=nodeFactories.js.map