"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastNextNode = exports.flattenNodeToArray = void 0;
function flattenNodeToArray(node) {
    var flattenedNodes = [node];
    while (node.next != null) {
        flattenedNodes.push(node.next);
        node = node.next;
    }
    return flattenedNodes;
}
exports.flattenNodeToArray = flattenNodeToArray;
function getLastNextNode(node) {
    while (node.next != null)
        node = node.next;
    return node;
}
exports.getLastNextNode = getLastNextNode;
//# sourceMappingURL=nodeHelpers.js.map