import * as babelTypes from "@babel/types";
import { NodePath } from "@babel/traverse";
import * as common from "@ts-nameof/transforms-common-yogoort";
export interface ParseOptions {
    traverseChildren?: () => void;
    nameofIdentifierName?: string;
}
export declare function parse(t: typeof babelTypes, path: NodePath, options?: ParseOptions): common.NameofCallExpression | undefined;
