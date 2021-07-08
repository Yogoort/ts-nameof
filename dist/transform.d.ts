import * as babelTypes from "@babel/types";
import * as common from "@ts-nameof/transforms-common";
export declare function transform(t: typeof babelTypes, node: common.Node): babelTypes.StringLiteral | babelTypes.ArrayExpression | babelTypes.TemplateLiteral;
