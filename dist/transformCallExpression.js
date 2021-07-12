"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformCallExpression = void 0;
var common_1 = require("@ts-nameof/common");
var nodeFactories_1 = require("./nodeFactories");
var printers_1 = require("./printers");
var nodeHelpers_1 = require("./nodeHelpers");
var StringOrTemplateExpressionBuilder_1 = require("./StringOrTemplateExpressionBuilder");
function transformCallExpression(callExpr) {
    if (callExpr.property == null)
        return handleNameof(callExpr);
    if (callExpr.property === "full")
        return handleNameofFull(callExpr);
    if (callExpr.property === "toArray")
        return handleNameofToArray(callExpr);
    if (callExpr.property === "split")
        return handleNameofSplit(callExpr);
    return common_1.throwError("Unsupported nameof call expression with property '" + callExpr.property + "': " + printers_1.printCallExpression(callExpr));
}
exports.transformCallExpression = transformCallExpression;
function handleNameof(callExpr) {
    var getExpression = function () {
        if (callExpr.arguments.length === 1)
            return callExpr.arguments[0];
        else if (callExpr.typeArguments.length === 1)
            return callExpr.typeArguments[0];
        return;
        return common_1.throwError("Call expression must have one argument or type argument: " + printers_1.printCallExpression(callExpr));
    };
    return parseNameofExpression(getExpression());
}
function handleNameofFull(callExpr) {
    return parseNameofFullExpression(getNodesFromCallExpression(callExpr));
}
function handleNameofSplit(callExpr) {
    var literalNodes = getNodesFromCallExpression(callExpr).map(function (node) { return parseNode(node); });
    return nodeFactories_1.createArrayLiteralNode(literalNodes);
}
function handleNameofToArray(callExpr) {
    var arrayArguments = getNodeArray();
    return nodeFactories_1.createArrayLiteralNode(arrayArguments.map(function (element) { return parseNameofExpression(element); }));
    function getNodeArray() {
        if (callExpr.arguments.length === 0)
            return common_1.throwError("Unable to parse call expression. No arguments provided: " + printers_1.printCallExpression(callExpr));
        var firstArgument = callExpr.arguments[0];
        if (callExpr.arguments.length === 1 && firstArgument.kind === "Function")
            return handleFunction(firstArgument);
        else
            return callExpr.arguments;
        function handleFunction(func) {
            var functionReturnValue = func.value;
            if (functionReturnValue == null || functionReturnValue.kind !== "ArrayLiteral")
                return common_1.throwError("Unsupported toArray call expression. An array must be returned by the provided function: " + printers_1.printCallExpression(callExpr));
            return functionReturnValue.elements;
        }
    }
}
function getNodesFromCallExpression(callExpr) {
    var _a = getExpressionAndCount(), expression = _a.expression, count = _a.count;
    return getNodesFromCount(nodeHelpers_1.flattenNodeToArray(expression), count);
    function getExpressionAndCount() {
        if (shouldUseArguments()) {
            return {
                expression: getArgumentExpression(),
                count: getCountFromNode(callExpr.arguments.length > 1 ? callExpr.arguments[1] : undefined)
            };
        }
        if (callExpr.typeArguments.length > 0) {
            return {
                expression: callExpr.typeArguments[0],
                count: getCountFromNode(callExpr.arguments.length > 0 ? callExpr.arguments[0] : undefined)
            };
        }
        return common_1.throwError("Unsupported use of nameof.full: " + printers_1.printCallExpression(callExpr));
        function shouldUseArguments() {
            if (callExpr.arguments.length === 0)
                return false;
            if (callExpr.typeArguments.length === 0)
                return true;
            return callExpr.arguments[0].kind === "Function";
        }
        function getArgumentExpression() {
            var expression = callExpr.arguments[0];
            if (expression.kind === "Function") {
                expression = expression.value;
                if (expression.next == null)
                    return common_1.throwError("A property must be accessed on the object: " + printers_1.printNode(callExpr.arguments[0]));
                expression = expression.next;
            }
            return expression;
        }
        function getCountFromNode(countExpr) {
            if (countExpr == null)
                return 0;
            if (countExpr.kind !== "NumericLiteral")
                return common_1.throwError("Expected count to be a number, but was: " + printers_1.printNode(countExpr));
            return countExpr.value;
        }
    }
    function getNodesFromCount(nodes, count) {
        if (count > 0) {
            if (count > nodes.length - 1)
                return common_1.throwError("Count of " + count + " was larger than max count of " + (nodes.length - 1) + ": " + printers_1.printCallExpression(callExpr));
            return nodes.slice(count);
        }
        if (count < 0) {
            if (Math.abs(count) > nodes.length)
                return common_1.throwError("Count of " + count + " was larger than max count of " + nodes.length * -1 + ": " + printers_1.printCallExpression(callExpr));
            return nodes.slice(nodes.length + count);
        }
        return nodes;
    }
}
function parseNameofExpression(expression) {
    return parseNode(getNodeForNameOf(), expression);
    function getNodeForNameOf() {
        var node = nodeHelpers_1.getLastNextNode(expression);
        if (node.kind === "Function") {
            var argument = node.value;
            if (argument.next == null)
                return common_1.throwError("A property must be accessed on the object: " + printers_1.printNode(expression));
            return nodeHelpers_1.getLastNextNode(argument.next);
        }
        return node;
    }
}
function parseNode(node, parent) {
    switch (node.kind) {
        case "Identifier":
            return nodeFactories_1.createStringLiteralNode(node.value);
        case "StringLiteral":
            return nodeFactories_1.createStringLiteralNode(node.value);
        case "TemplateExpression":
            return nodeFactories_1.createTemplateExpressionNode(node.parts);
        case "NumericLiteral":
            return nodeFactories_1.createStringLiteralNode(node.value.toString());
        case "Function":
            return common_1.throwError("Nesting functions is not supported: " + printers_1.printNode(parent || node));
        case "Computed":
            if (node.value.kind === "StringLiteral" && node.value.next == null)
                return nodeFactories_1.createStringLiteralNode(node.value.value);
            return common_1.throwError("First accessed property must not be computed except if providing a string: " + printers_1.printNode(parent || node));
        case "Interpolate":
        case "ArrayLiteral":
        case "ImportType":
            return throwNotSupportedErrorForNode(node);
        default:
            return common_1.assertNever(node, "Not implemented node: " + JSON.stringify(node));
    }
}
function parseNameofFullExpression(expressionNodes) {
    var nodeBuilder = new StringOrTemplateExpressionBuilder_1.StringOrTemplateExpressionNodeBuilder();
    for (var i = 0; i < expressionNodes.length; i++) {
        var node = expressionNodes[i];
        if (i > 0 && node.kind === "Identifier")
            nodeBuilder.addText(".");
        addNodeToBuilder(node);
    }
    return nodeBuilder.buildNode();
    function addNodeToBuilder(node) {
        switch (node.kind) {
            case "Identifier":
                nodeBuilder.addText(node.value);
                break;
            case "Computed":
                nodeBuilder.addText("[");
                var computedNodes = nodeHelpers_1.flattenNodeToArray(node.value);
                for (var i = 0; i < computedNodes.length; i++) {
                    var computedNode = computedNodes[i];
                    if (computedNode.kind === "StringLiteral")
                        nodeBuilder.addText("\"" + computedNode.value + "\"");
                    else {
                        if (i > 0 && computedNode.kind === "Identifier")
                            nodeBuilder.addText(".");
                        addNodeToBuilder(computedNode);
                    }
                }
                nodeBuilder.addText("]");
                break;
            case "TemplateExpression":
            case "StringLiteral":
                nodeBuilder.addItem(node);
                break;
            case "NumericLiteral":
                nodeBuilder.addText(node.value.toString());
                break;
            case "Interpolate":
                nodeBuilder.addItem(node);
                break;
            case "ArrayLiteral":
            case "ImportType":
            case "Function":
                return throwNotSupportedErrorForNode(node);
            default:
                return common_1.assertNever(node, "Not implemented node: " + JSON.stringify(node));
        }
    }
}
function throwNotSupportedErrorForNode(node) {
    return common_1.throwError("The node `" + printers_1.printNode(node) + "` is not supported in this scenario.");
}
//# sourceMappingURL=transformCallExpression.js.map