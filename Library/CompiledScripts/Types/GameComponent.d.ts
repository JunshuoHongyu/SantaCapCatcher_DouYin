declare namespace APJS {
  /**
   * Runtime-side dynamic component that hosts a minigame inside an effect:
   *   1. spawns a MiniGameRuntimeControl bound to the current scene
   *   2. drives `update(dt)` each frame so the minigame logic ticks
   *   3. on each camera AFTER_RENDER, blits the minigame's RT onto the camera RT
   *   4. forwards Touch events into the minigame controller
   *
   * Mini-game → effect events have a flat shape:
   *   event.type ∈ { 'GAME_OVER', 'GAME_STATE_UPDATE' }
   *   event.args[0] = payload object whose keys map to the gameOutput schema
   *                   (e.g. { winner: 'black', moveCount: 100 }).
   * Reverse direction (effect → mini-game) is not supported.
   *
   * @class GameComponent
   * @description Represents a dynamic component specifically designed for the GameComponent.
   */
  class GameComponent extends DynamicComponent {
    protected constructor();
  
    /**
     * @description Unregisters a handler previously registered via `onGameOver` or `onGameUpdate`.
     * @param handle - The handle returned by `onGameOver` / `onGameUpdate`.
     * Unknown or already-removed handles are ignored.
     */
    offGameEvent(handle: number): void;
  
    /**
     * @description Registers a handler for the `GAME_OVER` event emitted by the minigame runtime.
     * The handler receives the event payload object (i.e. `event.args[0]`, such as
     * `{ winner: 'black', moveCount: 100 }`) directly.
     * @param handler - Callback invoked with the game-over payload when the event fires.
     * @returns A non-zero handle that can be passed to `offGameEvent` to unregister the handler,
     * or `0` if the handler is invalid.
     */
    onGameOver(handler: GameEventHandler): number;
  
    /**
     * @description Registers a handler for the `GAME_STATE_UPDATE` event emitted by the minigame runtime.
     * The handler receives the event payload object (i.e. `event.args[0]`) directly.
     * @param handler - Callback invoked with the game-state-update payload each time the event fires.
     * @returns A non-zero handle that can be passed to `offGameEvent` to unregister the handler,
     * or `0` if the handler is invalid.
     */
    onGameUpdate(handler: GameEventHandler): number;
  }
}