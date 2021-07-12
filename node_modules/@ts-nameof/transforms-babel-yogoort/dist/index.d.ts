import * as babelTypes from "@babel/types";
import * as babel from "@babel/core";
import { NodePath } from "@babel/traverse";
import { ParseOptions } from "./parse";
export interface TransformOptions extends ParseOptions {
}
export declare function plugin({ types: t }: {
    types: typeof babelTypes;
}): babel.PluginItem;
export declare function transformNode(t: typeof babelTypes, path: NodePath, options?: TransformOptions): void;
