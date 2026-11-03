declare class BasicScriptNode extends BaseUserClass {
  /**
   * The scene provided by the visual scripting runtime for this node execution context.
   * This value comes from the graph runtime and is available when the node is executing.
   * Use it inside `execute()` or other runtime-triggered node logic to find scene objects or query scene state.
   *
   * @example
   * ```typescript
   * @customNode()
   * export class FindNode extends BasicScriptNode {
   *   execute(): void {
   *     const target = this.scene.findSceneObject('Target');
   *     if (target) {
   *       console.log(target.name);
   *     }
   *   }
   * }
   * ```
   */
  scene: APJS.Scene;
  /**
   * Main execution entry for the node.
   * The visual scripting system calls this method when the node is triggered.
   * Override it in custom nodes to read inputs, update outputs, access `this.scene`, and perform node logic.
   *
   * @example
   * ```typescript
   * @customNode()
   * export class PrintNode extends BasicScriptNode {
   *   execute(): void {
   *     const target = this.scene.findSceneObject('Target');
   *     if (target) {
   *       console.log(target.name);
   *     }
   *   }
   * }
   * ```
   */
  execute(): void;
}
