import * as babelTypes from "@babel/types";
import { Node, BlockStatement, UnaryExpression } from "@babel/types";
export declare function isNegativeNumericLiteral(t: typeof babelTypes, node: Node): node is UnaryExpression;
export declare function getNegativeNumericLiteralValue(t: typeof babelTypes, node: UnaryExpression): number;
export declare function getReturnStatementArgumentFromBlock(t: typeof babelTypes, block: BlockStatement): babelTypes.ArrayExpression | babelTypes.ArrowFunctionExpression | babelTypes.AssignmentExpression | babelTypes.AwaitExpression | babelTypes.BigIntLiteral | babelTypes.BinaryExpression | babelTypes.LogicalExpression | babelTypes.BindExpression | babelTypes.FunctionExpression | babelTypes.BooleanLiteral | babelTypes.CallExpression | babelTypes.ClassExpression | babelTypes.ConditionalExpression | babelTypes.DecimalLiteral | babelTypes.DoExpression | babelTypes.Identifier | babelTypes.StringLiteral | babelTypes.NumericLiteral | babelTypes.NullLiteral | babelTypes.RegExpLiteral | babelTypes.MemberExpression | babelTypes.NewExpression | babelTypes.ObjectExpression | babelTypes.SequenceExpression | babelTypes.ParenthesizedExpression | babelTypes.ThisExpression | babelTypes.UnaryExpression | babelTypes.UpdateExpression | babelTypes.MetaProperty | babelTypes.Super | babelTypes.TaggedTemplateExpression | babelTypes.TemplateLiteral | babelTypes.YieldExpression | babelTypes.Import | babelTypes.OptionalMemberExpression | babelTypes.OptionalCallExpression | babelTypes.TypeCastExpression | babelTypes.JSXElement | babelTypes.JSXFragment | babelTypes.PipelinePrimaryTopicReference | babelTypes.RecordExpression | babelTypes.TupleExpression | babelTypes.ModuleExpression | babelTypes.TSAsExpression | babelTypes.TSTypeAssertion | babelTypes.TSNonNullExpression | undefined;
