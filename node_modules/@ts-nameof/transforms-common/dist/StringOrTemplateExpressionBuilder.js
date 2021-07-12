"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringOrTemplateExpressionNodeBuilder = void 0;
var nodeFactories_1 = require("./nodeFactories");
var StringOrTemplateExpressionNodeBuilder = (function () {
    function StringOrTemplateExpressionNodeBuilder() {
        this.text = "";
        this.items = [];
    }
    StringOrTemplateExpressionNodeBuilder.prototype.hasText = function () {
        return this.text != null && this.text.length > 0 || this.items.length > 0;
    };
    StringOrTemplateExpressionNodeBuilder.prototype.buildNode = function () {
        if (this.text != null)
            return nodeFactories_1.createStringLiteralNode(this.text);
        return nodeFactories_1.createTemplateExpressionNode(this.items);
    };
    StringOrTemplateExpressionNodeBuilder.prototype.addItem = function (item) {
        if (typeof item === "string")
            this.addText(item);
        else if (item.kind === "StringLiteral")
            this.addText(item.value);
        else if (item.kind === "TemplateExpression") {
            for (var _i = 0, _a = item.parts; _i < _a.length; _i++) {
                var part = _a[_i];
                this.addItem(part);
            }
        }
        else {
            this.addInterpolate(item);
        }
    };
    StringOrTemplateExpressionNodeBuilder.prototype.addText = function (newText) {
        if (this.text == null) {
            if (typeof this.items[this.items.length - 1] === "string")
                this.items[this.items.length - 1] += newText;
            else
                this.items.push(newText);
        }
        else {
            this.text += newText;
        }
    };
    StringOrTemplateExpressionNodeBuilder.prototype.addInterpolate = function (interpolate) {
        if (this.text != null) {
            this.items.push(this.text);
            this.text = undefined;
        }
        this.items.push(interpolate);
    };
    return StringOrTemplateExpressionNodeBuilder;
}());
exports.StringOrTemplateExpressionNodeBuilder = StringOrTemplateExpressionNodeBuilder;
//# sourceMappingURL=StringOrTemplateExpressionBuilder.js.map