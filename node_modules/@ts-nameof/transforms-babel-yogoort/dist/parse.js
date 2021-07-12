"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
var common_1 = require("@ts-nameof/common");
var common = __importStar(require("@ts-nameof/transforms-common"));
var helpers_1 = require("./helpers");
function parse(t, path, options) {
    if (options === void 0) { options = {}; }
    if (!isNameof(path.node))
        return undefined;
    if (options.traverseChildren)
        options.traverseChildren();
    var propertyName = parsePropertyName(path.node);
    if (isInterpolatePropertyName(propertyName)) {
        handleNameofInterpolate(path.node);
        return undefined;
    }
    return parseNameof(path.node);
    function parseNameof(callExpr) {
        return {
            property: propertyName,
            typeArguments: parseTypeArguments(callExpr),
            arguments: parseArguments(callExpr)
        };
    }
    function parsePropertyName(callExpr) {
        var callee = callExpr.callee;
        if (!t.isMemberExpression(callee) || !t.isIdentifier(callee.property))
            return undefined;
        return callee.property.name;
    }
    function parseTypeArguments(callExpr) {
        var typeArguments = callExpr.typeParameters;
        if (typeArguments == null)
            return [];
        return typeArguments.params.map(function (arg) { return parseCommonNode(arg); });
    }
    function parseArguments(callExpr) {
        return callExpr.arguments.map(function (arg) { return parseCommonNode(arg); });
    }
    function parseCommonNode(node) {
        if (t.isMemberExpression(node))
            return parseMemberExpression(node);
        if (t.isArrowFunctionExpression(node))
            return parseFunctionReturnExpression(node, getArrowFunctionReturnExpression(node));
        if (t.isFunctionExpression(node))
            return parseFunctionReturnExpression(node, getReturnStatementArgumentFromBlockOrThrow(node.body));
        if (t.isTSNonNullExpression(node) || t.isParenthesizedExpression(node) || t.isTSAsExpression(node))
            return parseCommonNode(node.expression);
        if (t.isTSQualifiedName(node))
            return parseQualifiedName(node);
        if (t.isTSTypeReference(node))
            return parseCommonNode(node.typeName);
        if (t.isSpreadElement(node))
            return parseCommonNode(node.argument);
        if (t.isNumericLiteral(node) || helpers_1.isNegativeNumericLiteral(t, node))
            return parseNumeric(node);
        if (t.isStringLiteral(node))
            return parseStringLiteral(node);
        if (t.isIdentifier(node))
            return parseIdentifier(node);
        if (t.isArrayExpression(node))
            return parseArrayExpression(node);
        if (t.isThisExpression(node))
            return common.createIdentifierNode("this");
        if (t.isSuper(node))
            return common.createIdentifierNode("super");
        if (t.isTSImportType(node))
            return parseImportType(node, false);
        if (t.isTSTypeQuery(node) && t.isTSImportType(node.exprName))
            return parseImportType(node.exprName, true);
        if (t.isTSLiteralType(node))
            return parseCommonNode(node.literal);
        if (t.isTemplateLiteral(node))
            return parseTemplateExpression(node);
        if (isNameof(node) && isInterpolatePropertyName(parsePropertyName(node)))
            return parseInterpolateNode(node);
        return common_1.throwError("Unhandled node type (" + node.type + ") in text: " + getNodeText(node) + " (Please open an issue if you believe this should be supported.)");
    }
    function parseArrayExpression(node) {
        var result = [];
        node.elements.forEach(function (element) {
            if (element == null)
                return common_1.throwError("Unsupported scenario with empty element encountered in array: " + getNodeText(node));
            result.push(parseCommonNode(element));
        });
        return common.createArrayLiteralNode(result);
    }
    function parseMemberExpression(node) {
        var expressionCommonNode = parseCommonNode(node.object);
        var nameCommonNode = parseCommonNode(node.property);
        var computedCommonNode = node.computed ? common.createComputedNode(nameCommonNode) : undefined;
        getEndCommonNode(expressionCommonNode).next = computedCommonNode || nameCommonNode;
        return expressionCommonNode;
    }
    function parseQualifiedName(node) {
        var leftCommonNode = parseCommonNode(node.left);
        var rightCommonNode = parseCommonNode(node.right);
        getEndCommonNode(leftCommonNode).next = rightCommonNode;
        return leftCommonNode;
    }
    function parseNumeric(node) {
        return common.createNumericLiteralNode(getNodeValue());
        function getNodeValue() {
            if (t.isNumericLiteral(node))
                return node.value;
            return helpers_1.getNegativeNumericLiteralValue(t, node);
        }
    }
    function parseStringLiteral(node) {
        return common.createStringLiteralNode(node.value);
    }
    function parseIdentifier(node) {
        var text = getIdentifierTextOrThrow(node);
        return common.createIdentifierNode(text);
    }
    function parseFunctionReturnExpression(functionNode, node) {
        var parameterNames = functionNode.params.map(function (p) {
            if (t.isIdentifier(p))
                return p.name;
            return getNodeText(p);
        });
        return common.createFunctionNode(parseCommonNode(node), parameterNames);
    }
    function parseImportType(node, isTypeOf) {
        var importTypeNode = common.createImportTypeNode(isTypeOf, parseCommonNode(node.argument));
        var qualifier = node.qualifier == null ? undefined : parseCommonNode(node.qualifier);
        getEndCommonNode(importTypeNode).next = qualifier;
        return importTypeNode;
    }
    function parseTemplateExpression(node) {
        return common.createTemplateExpressionNode(getParts());
        function getParts() {
            var parts = [];
            for (var i = 0; i < node.quasis.length; i++) {
                parts.push(node.quasis[i].value.raw);
                var expression = node.expressions[i];
                if (expression != null)
                    parts.push(common.createInterpolateNode(expression, getNodeText(expression)));
            }
            return parts;
        }
    }
    function parseInterpolateNode(node) {
        if (node.arguments.length !== 1)
            return common_1.throwError("Expected a single argument for the nameof.interpolate function call " + getNodeText(node.arguments[0]) + ".");
        return common.createInterpolateNode(node.arguments[0], getNodeText(node.arguments[0]));
    }
    function getEndCommonNode(commonNode) {
        while (commonNode.next != null)
            commonNode = commonNode.next;
        return commonNode;
    }
    function getArrowFunctionReturnExpression(func) {
        if (t.isBlock(func.body))
            return getReturnStatementArgumentFromBlockOrThrow(func.body);
        return func.body;
    }
    function getIdentifierTextOrThrow(node) {
        if (!t.isIdentifier(node))
            return common_1.throwError("Expected node to be an identifier: " + getNodeText(node));
        return node.name;
    }
    function getReturnStatementArgumentFromBlockOrThrow(block) {
        return helpers_1.getReturnStatementArgumentFromBlock(t, block)
            || common_1.throwError("Cound not find return statement with an expression in function expression: " + getNodeText(block));
    }
    function getNodeText(node) {
        var outerNodeStart = path.node.start;
        var innerNodeStart = node.start;
        var offset = innerNodeStart - outerNodeStart;
        return path.getSource().substr(offset, node.end - node.start);
    }
    function isNameof(node) {
        if (!t.isCallExpression(node))
            return false;
        var identifier = getIdentifierToInspect(node.callee);
        return identifier != null && identifier.name === (options.nameofIdentifierName || "nameof");
        function getIdentifierToInspect(expression) {
            if (t.isIdentifier(expression))
                return expression;
            if (t.isMemberExpression(expression) && t.isIdentifier(expression.object))
                return expression.object;
            return undefined;
        }
    }
    function handleNameofInterpolate(callExpr) {
        if (!hasAncestorNameofFull()) {
            return common_1.throwError("Found a nameof.interpolate that did not exist within a "
                + ("nameof.full call expression: " + getNodeText(callExpr)));
        }
        if (callExpr.arguments.length !== 1)
            return common_1.throwError("Unexpected scenario where a nameof.interpolate function did not have a single argument.");
        function hasAncestorNameofFull() {
            var parentPath = path.parentPath;
            while (parentPath != null) {
                if (isNameof(parentPath.node) && parsePropertyName(parentPath.node) === "full")
                    return true;
                parentPath = parentPath.parentPath;
            }
            return false;
        }
    }
    function isInterpolatePropertyName(propertyName) {
        return propertyName === "interpolate";
    }
}
exports.parse = parse;
//# sourceMappingURL=parse.js.map