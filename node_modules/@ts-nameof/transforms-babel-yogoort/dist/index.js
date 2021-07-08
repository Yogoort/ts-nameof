"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformNode = exports.plugin = void 0;
var common_1 = require("@ts-nameof/common");
var transforms_common_1 = require("@ts-nameof/transforms-common");
var parse_1 = require("./parse");
var transform_1 = require("./transform");
function plugin(_a) {
    var t = _a.types;
    var visitor = {
        CallExpression: function (path, state) {
            var filePath = state.file.opts.filename;
            try {
                transformNode(t, path, {
                    traverseChildren: function () { return path.traverse(visitor, state); }
                });
            }
            catch (err) {
                return common_1.throwErrorForSourceFile(err.message, filePath);
            }
        }
    };
    return { visitor: visitor };
}
exports.plugin = plugin;
function transformNode(t, path, options) {
    if (options === void 0) { options = {}; }
    var parseResult = parse_1.parse(t, path, options);
    if (parseResult == null)
        return;
    var transformResult = transform_1.transform(t, transforms_common_1.transformCallExpression(parseResult));
    path.replaceWith(transformResult);
}
exports.transformNode = transformNode;
//# sourceMappingURL=index.js.map