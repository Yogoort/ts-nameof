import { InterpolateNode, StringLiteralNode, TemplateExpressionNode } from "./nodes";
export declare class StringOrTemplateExpressionNodeBuilder {
    private text;
    private items;
    hasText(): boolean;
    buildNode(): StringLiteralNode | TemplateExpressionNode;
    addItem(item: string | InterpolateNode | StringLiteralNode | TemplateExpressionNode): void;
    addText(newText: string): void;
    private addInterpolate;
}
