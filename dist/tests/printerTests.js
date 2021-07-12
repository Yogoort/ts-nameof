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
var assert = __importStar(require("assert"));
var printers = __importStar(require("../printers"));
var factories = __importStar(require("../nodeFactories"));
describe("printCallExpression", function () {
    function doTest(callExpr, expectedText) {
        var result = printers.printCallExpression(callExpr);
        assert.equal(result, expectedText);
    }
    it("should print a basic call expression", function () {
        doTest({
            property: undefined,
            typeArguments: [],
            arguments: []
        }, "nameof()");
    });
    it("should print with a property", function () {
        doTest({
            property: "full",
            typeArguments: [],
            arguments: []
        }, "nameof.full()");
    });
    it("should print with an argument", function () {
        doTest({
            property: undefined,
            typeArguments: [],
            arguments: [factories.createIdentifierNode("test")]
        }, "nameof(test)");
    });
    it("should print with arguments", function () {
        doTest({
            property: undefined,
            typeArguments: [],
            arguments: [
                factories.createIdentifierNode("test1"),
                factories.createIdentifierNode("test2")
            ]
        }, "nameof(test1, test2)");
    });
    it("should print with a type argument", function () {
        doTest({
            property: undefined,
            typeArguments: [factories.createIdentifierNode("T")],
            arguments: []
        }, "nameof<T>()");
    });
    it("should print with type arguments", function () {
        doTest({
            property: undefined,
            typeArguments: [
                factories.createIdentifierNode("T"),
                factories.createIdentifierNode("U")
            ],
            arguments: []
        }, "nameof<T, U>()");
    });
    it("should print with everything", function () {
        doTest({
            property: "full",
            typeArguments: [
                factories.createIdentifierNode("T"),
                factories.createIdentifierNode("U")
            ],
            arguments: [
                factories.createIdentifierNode("test1"),
                factories.createIdentifierNode("test2")
            ]
        }, "nameof.full<T, U>(test1, test2)");
    });
});
describe("printNode", function () {
    function doTest(node, expectedText) {
        var result = printers.printNode(node);
        assert.equal(result, expectedText);
    }
    describe("identifier", function () {
        it("should print an identifier", function () {
            doTest(factories.createIdentifierNode("Test"), "Test");
        });
        it("should print the next identifier separated by a period", function () {
            doTest(factories.createIdentifierNode("Test", factories.createIdentifierNode("Next")), "Test.Next");
        });
        it("should print the next computed value with no separation", function () {
            var node = factories.createIdentifierNode("Test", factories.createComputedNode(factories.createStringLiteralNode("prop")));
            doTest(node, "Test[\"prop\"]");
        });
    });
    describe("string literal", function () {
        it("should print in quotes", function () {
            doTest(factories.createStringLiteralNode("test"), "\"test\"");
        });
        it("should print with a property after", function () {
            var node = factories.createStringLiteralNode("test", factories.createIdentifierNode("length"));
            doTest(node, "\"test\".length");
        });
    });
    describe("numeric literal", function () {
        it("should print", function () {
            doTest(factories.createNumericLiteralNode(5), "5");
        });
        it("should print with a property after", function () {
            var node = factories.createNumericLiteralNode(5, factories.createIdentifierNode("length"));
            doTest(node, "5.length");
        });
    });
    describe("computed", function () {
        it("should print inside brackets", function () {
            var node = factories.createComputedNode(factories.createStringLiteralNode("test"));
            doTest(node, "[\"test\"]");
        });
        it("should print with a property after", function () {
            var node = factories.createComputedNode(factories.createNumericLiteralNode(5), factories.createIdentifierNode("length"));
            doTest(node, "[5].length");
        });
    });
    describe("function", function () {
        it("should print with no arguments", function () {
            var node = factories.createFunctionNode(factories.createNumericLiteralNode(5), []);
            doTest(node, "() => 5");
        });
        it("should print with an argument", function () {
            var node = factories.createFunctionNode(factories.createNumericLiteralNode(5), ["p"]);
            doTest(node, "(p) => 5");
        });
        it("should print with arguments", function () {
            var node = factories.createFunctionNode(factories.createNumericLiteralNode(5), ["a", "b"]);
            doTest(node, "(a, b) => 5");
        });
        it("should print with a property after", function () {
            var node = factories.createFunctionNode(factories.createNumericLiteralNode(5), ["a", "b"], factories.createIdentifierNode("length"));
            doTest(node, "((a, b) => 5).length");
        });
    });
    describe("array", function () {
        it("should print the array with no elements", function () {
            var node = factories.createArrayLiteralNode([]);
            doTest(node, "[]");
        });
        it("should print the array with one element", function () {
            var node = factories.createArrayLiteralNode([factories.createStringLiteralNode("test")]);
            doTest(node, "[\"test\"]");
        });
        it("should print the array with multiple elements", function () {
            var node = factories.createArrayLiteralNode([factories.createStringLiteralNode("test"), factories.createStringLiteralNode("test2")]);
            doTest(node, "[\"test\", \"test2\"]");
        });
        it("should print with a property after", function () {
            var node = factories.createArrayLiteralNode([], factories.createIdentifierNode("length"));
            doTest(node, "[].length");
        });
    });
    describe("import type", function () {
        it("should print when it has no argument", function () {
            var node = factories.createImportTypeNode(false, undefined, factories.createIdentifierNode("length"));
            doTest(node, "import().length");
        });
        it("should print when it receives an identifier", function () {
            var node = factories.createImportTypeNode(false, factories.createIdentifierNode("test"), undefined);
            doTest(node, "import(test)");
        });
        it("should print when it receives a string literal", function () {
            var node = factories.createImportTypeNode(false, factories.createStringLiteralNode("test"), undefined);
            doTest(node, "import(\"test\")");
        });
        it("should print when it has a typeof", function () {
            var node = factories.createImportTypeNode(true, factories.createIdentifierNode("test"));
            doTest(node, "typeof import(test)");
        });
    });
    describe("template literal", function () {
        it("should print when only has a string", function () {
            var node = factories.createTemplateExpressionNode(["testing"], factories.createIdentifierNode("length"));
            doTest(node, "`testing`.length");
        });
        it("should print when also has an interpolate node", function () {
            var node = factories.createTemplateExpressionNode(["testing", factories.createInterpolateNode(undefined, "myVar"), "this"]);
            doTest(node, "`testing${nameof.interpolate(myVar)}this`");
        });
    });
    describe("interpolate node", function () {
        it("should print", function () {
            var node = factories.createInterpolateNode(undefined, "myVar", factories.createIdentifierNode("length"));
            doTest(node, "nameof.interpolate(myVar).length");
        });
    });
});
//# sourceMappingURL=printerTests.js.map