"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReturnStatementArgumentFromBlock = exports.getNegativeNumericLiteralValue = exports.isNegativeNumericLiteral = void 0;
var common_1 = require("@ts-nameof/common");
function isNegativeNumericLiteral(t, node) {
    if (!t.isUnaryExpression(node))
        return false;
    return node.operator === "-" && t.isNumericLiteral(node.argument);
}
exports.isNegativeNumericLiteral = isNegativeNumericLiteral;
function getNegativeNumericLiteralValue(t, node) {
    if (node.operator !== "-" || !t.isNumericLiteral(node.argument))
        return common_1.throwError("The passed in UnaryExpression must be for a negative numeric literal.");
    return node.argument.value * -1;
}
exports.getNegativeNumericLiteralValue = getNegativeNumericLiteralValue;
function getReturnStatementArgumentFromBlock(t, block) {
    for (var _i = 0, _a = block.body; _i < _a.length; _i++) {
        var statement = _a[_i];
        if (t.isReturnStatement(statement) && statement.argument != null)
            return statement.argument;
    }
    return undefined;
}
exports.getReturnStatementArgumentFromBlock = getReturnStatementArgumentFromBlock;
//# sourceMappingURL=helpers.js.map