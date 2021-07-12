import { NameofCallExpression, StringLiteralNode, TemplateExpressionNode } from "./nodes";
export declare function transformCallExpression(callExpr: NameofCallExpression): StringLiteralNode | import("./nodes").ArrayLiteralNode | TemplateExpressionNode;
