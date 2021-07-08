"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
var common_1 = require("@ts-nameof/common");
function transform(t, node) {
    switch (node.kind) {
        case "StringLiteral":
            return t.stringLiteral(node.value);
        case "ArrayLiteral":
            return t.arrayExpression(node.elements.map(function (element) { return transform(t, element); }));
        case "TemplateExpression":
            return createTemplateLiteral(t, node);
        default:
            return common_1.throwError("Unsupported node kind: " + node.kind);
    }
}
exports.transform = transform;
function createTemplateLiteral(t, node) {
    var quasis = [];
    var expressions = [];
    for (var _i = 0, _a = node.parts; _i < _a.length; _i++) {
        var part = _a[_i];
        if (typeof part === "string") {
            quasis.push(t.templateElement({
                raw: getRawValue(part),
                cooked: part
            }));
        }
        else {
            var expr = part.expression;
            expressions.push(expr);
        }
    }
    quasis[quasis.length - 1].tail = true;
    return t.templateLiteral(quasis, expressions);
    function getRawValue(text) {
        return text.replace(/\\|`|\${/g, "\\$&");
    }
}
//# sourceMappingURL=transform.js.map