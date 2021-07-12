"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printNode = exports.printCallExpression = void 0;
var common_1 = require("@ts-nameof/common");
function printCallExpression(callExpr) {
    var result = "nameof";
    writePropertyName();
    if (callExpr.typeArguments.length > 0)
        writeTypeArguments();
    writeArguments();
    return result;
    function writePropertyName() {
        if (callExpr.property != null)
            result += "." + callExpr.property;
    }
    function writeTypeArguments() {
        result += "<";
        for (var i = 0; i < callExpr.typeArguments.length; i++) {
            if (i > 0)
                result += ", ";
            result += printNode(callExpr.typeArguments[i]);
        }
        result += ">";
    }
    function writeArguments() {
        result += "(";
        for (var i = 0; i < callExpr.arguments.length; i++) {
            if (i > 0)
                result += ", ";
            result += printNode(callExpr.arguments[i]);
        }
        result += ")";
    }
}
exports.printCallExpression = printCallExpression;
function printNode(node) {
    var result = getCurrentText();
    if (node.next != null) {
        if (node.next.kind === "Identifier")
            result += "." + printNode(node.next);
        else
            result += printNode(node.next);
    }
    return result;
    function getCurrentText() {
        switch (node.kind) {
            case "StringLiteral":
                return "\"" + node.value + "\"";
            case "NumericLiteral":
                return node.value.toString();
            case "Identifier":
                return node.value;
            case "Computed":
                return "[" + printNode(node.value) + "]";
            case "Function":
                var functionResult = "(" + node.parameterNames.join(", ") + ") => " + printNode(node.value);
                if (node.next != null)
                    functionResult = "(" + functionResult + ")";
                return functionResult;
            case "ArrayLiteral":
                return "[" + node.elements.map(function (e) { return printNode(e); }).join(", ") + "]";
            case "ImportType":
                return (node.isTypeOf ? "typeof " : "") + ("import(" + (node.argument == null ? "" : printNode(node.argument)) + ")");
            case "Interpolate":
                return "nameof.interpolate(" + node.expressionText + ")";
            case "TemplateExpression":
                return printTemplateExpression(node);
            default:
                return common_1.assertNever(node, "Unhandled kind: " + node.kind);
        }
    }
    function printTemplateExpression(TemplateExpression) {
        var text = "`";
        for (var _i = 0, _a = TemplateExpression.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            if (typeof part === "string")
                text += part;
            else
                text += "${" + printNode(part) + "}";
        }
        text += "`";
        return text;
    }
}
exports.printNode = printNode;
//# sourceMappingURL=printers.js.map