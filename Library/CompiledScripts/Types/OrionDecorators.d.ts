/**
 * Decorator that marks a class as a custom node.
 * Custom nodes can be used in visual scripting graphs to create reusable logic blocks.
 * This decorator should be applied to classes that extend BasicScriptNode.
 *
 * @returns Class decorator function
 *
 * @example
 * ```typescript
 * @customNode()
 * export class MyCustomNode extends BasicScriptNode {
 *   @input()
 *   public inputValue: number = 0;
 *
 *   @output()
 *   public outputValue: number = 0;
 *
 *   public execute(): void {
 *     this.outputValue = this.inputValue * 2;
 *   }
 * }
 * ```
 */
declare function customNode(): (target: BaseUserConstructor<BasicScriptNode>) => void;

/**
 * Decorator that marks a class as a script component.
 * Script components can be attached to scene objects to add custom behavior.
 * This decorator should be applied to classes that extend APJS.BasicScriptComponent.
 * @param options - Optional component registration metadata.
 * @returns Class decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class PlayerController extends APJS.BasicScriptComponent {
 *   @serializeProperty
 *   public moveSpeed: number = 5;
 *
 *   onUpdate(deltaTime: number): void {
 *     // Movement logic here
 *   }
 * }
 *
 * @component({ disallowMultiple: true })
 * export class SingletonController extends APJS.BasicScriptComponent {
 * }
 * ```
 */
declare function component<T extends typeof APJS.BasicScriptComponent>(
	options?: APJS.UserComponentOptionalParams
): (target: T) => void;
/**
 * Decorator that marks a property as an input port for custom nodes.
 * Input ports allow data to flow into the node from other nodes in a visual scripting graph.
 *
 * @example
 * ```typescript
 * @customNode()
 * export class MathNode extends BasicScriptNode {
 *   @input()
 *   public operandA: number = 0;
 *
 *   @input()
 *   public operandB: number = 0;
 *
 *   @output()
 *   public result: number = 0;
 * }
 * ```
 */
declare function input(type?: string): (target: any, key: string) => any;
/**
 * Decorator that marks a property as an output port for custom nodes.
 * Output ports allow data to flow from this node to other nodes in a visual scripting graph.
 *
 * @example
 * ```typescript
 * @customNode()
 * export class StringConcatNode extends BasicScriptNode {
 *   @input()
 *   public stringA: string = "";
 *
 *   @input()
 *   public stringB: string = "";
 *
 *   @output()
 *   public concatenated: string = "";
 * }
 * ```
 */
declare function output(type?: string): (target: any, key: string) => any;

declare function serializeSceneObjectFlag(target: any, key: string): void;
/**
 * Decorator that marks a property for serialization.
 * Properties marked with this decorator will be saved and loaded with the scene.
 * This decorator can be used with or without parentheses.
 *
 * @returns Property decorator function when used with parentheses
 *
 * @example
 * ```typescript
 * @component()
 * export class PlayerData extends APJS.BasicScriptComponent {
 *   // Usage without parentheses
 *   @serializeProperty
 *   public playerName: string = "Player";
 *
 *   // Usage with parentheses
 *   @serializeProperty()
 *   public score: number = 0;
 *
 *   // Scalar Component references are supported by TTEH with EffectSDK 22.0 or later
 *   @serializeProperty()
 *   public text: APJS.Text | null = null;
 *
 *   @serializeProperty()
 *   public camera: APJS.Camera | null = null;
 *
 *   // This property won't be saved
 *   public temporaryData: number = 0;
 * }
 * ```
 */
declare function serializeProperty(): (target: any, key: string) => any;
/**
 * Decorator that marks a property for serialization.
 * Properties marked with this decorator will be saved and loaded with the scene.
 * This is the direct application form without parentheses.
 *
 * @param target - The target object
 * @param key - The property key
 *
 * @example
 * ```typescript
 * @component()
 * export class GameSettings extends APJS.BasicScriptComponent {
 *   @serializeProperty
 *   public gameMode: string = "normal";
 *
 *   @serializeProperty
 *   public masterVolume: number = 0.8;
 * }
 * ```
 */
declare function serializeProperty(target: any, key: string): void;
/**
 * Decorator that adds a label to a property in the inspector UI.
 * This provides a human-readable name for the property field.
 *
 * @param label - The display label text
 * @returns Property decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class LightController extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   @label("Light Color")
 *   public color: APJS.Vector3f = new APJS.Vector3f(1, 1, 1);
 *
 *   @serializeProperty()
 *   @label("Intensity (Lux)")
 *   public intensity: number = 100;
 *
 *   @serializeProperty()
 *   @label("Cast Shadows")
 *   public castShadows: boolean = true;
 * }
 * ```
 */
declare function label(label: string): (target: any, key: string) => any;
/**
 * Decorator that makes a property read-only in the inspector UI.
 * The property value can still be modified programmatically but not through the UI.
 * This decorator can be used with or without parentheses.
 *
 * @returns Property decorator function when used with parentheses
 *
 * @example
 * ```typescript
 * @component()
 * export class Statistics extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   public totalScore: number = 0;
 *
 *   @serializeProperty()
 *   @readOnly()
 *   public gamesPlayed: number = 0;
 * }
 * ```
 */
declare function readOnly(): (target: any, key: string) => any;
/**
 * Decorator that makes a property read-only in the inspector UI.
 * This is the direct application form without parentheses.
 *
 * @param target - The target object
 * @param key - The property key
 *
 * @example
 * ```typescript
 * @component()
 * export class PlayerStats extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   @readOnly
 *   public playerId: string = "player_001";
 *
 *   @serializeProperty()
 *   @readOnly
 *   public creationDate: string = new Date().toISOString();
 * }
 * ```
 */
declare function readOnly(target: any, key: string): void;
/**
 * Decorator that creates a slider control for numeric properties in the inspector.
 * Provides a visual slider for adjusting values within a specified range.
 *
 * @param min - The minimum value of the slider
 * @param max - The maximum value of the slider
 * @param step - Optional step size for discrete values
 * @returns Property decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class CameraSettings extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   @slider(0, 180, 1)
 *   public fov: number = 60;
 *
 *   @serializeProperty()
 *   @slider(0.1, 10, 0.1)
 *   public exposure: number = 1;
 *
 *   @serializeProperty()
 *   @slider(0, 1, 0.01)
 *   public bloomIntensity: number = 0.5;
 * }
 * ```
 */
declare function slider(min: number, max: number, step?: number): (target: any, key: string) => any;
/**
 * Decorator that creates a spin box control for numeric properties in the inspector.
 * Provides up/down arrows for adjusting numeric values with optional constraints.
 *
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @param step - Optional step size for increment/decrement
 * @returns Property decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class GridSettings extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   @spinBox(1, 100, 1)
 *   public gridSize: number = 10;
 *
 *   @serializeProperty()
 *   @spinBox(0, 360, 15)
 *   public snapAngle: number = 45;
 *
 *   @serializeProperty()
 *   @spinBox(0.01, 2, 0.01)
 *   public timeScale: number = 1;
 * }
 * ```
 */
declare function spinBox(min: number, max: number, step?: number): (target: any, key: string) => any;
/**
 * Decorator that creates a dropdown selection control for properties in the inspector.
 * Allows selection from a predefined list of options.
 *
 * @param options - Array of option pairs, where each pair is [displayText, value]
 * @returns Property decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class QualitySettings extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   @dropDown([
 *       ["Low", 0],
 *       ["Medium", 1],
 *       ["High", 2],
 *       ["Ultra", 3]
 *   ])
 *   public graphicsQuality: number = 2;
 *
 *   @serializeProperty()
 *   @dropDown([
 *       ["Windowed", "windowed"],
 *       ["Fullscreen", "fullscreen"],
 *       ["Borderless", "borderless"]
 *   ])
 *   public displayMode: string = "windowed";
 * }
 * ```
 */
declare function dropDown(options: [string, string][]|[string, number][]): (target: any, key: string) => any;
/**
 * Decorator that creates a multi-line text area control for string properties in the inspector.
 * Useful for longer text content that needs multiple lines.
 *
 * @param [height] - Optional height of the text area in line height. Default is 3.
 * @returns Property decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class DialogSystem extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   @textArea(2)
 *   public dialogText: string = "Welcome to the game!";
 *
 *   @serializeProperty()
 *   @textArea(5)
 *   public description: string = "This component handles all dialog interactions.";
 *
 *   @serializeProperty()
 *   @textArea(10)
 *   public authorNotes: string = "";
 * }
 * ```
 */
declare function textArea(height?: number): (target: any, key: string) => any;
/**
 * Decorator that adds a header text in the inspector UI, useful for grouping related properties.
 * Creates a visual section header to organize the inspector layout.
 *
 * @param content - The header text to display
 * @returns Property decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class PlayerController extends APJS.BasicScriptComponent {
 *   @header("Movement Settings")
 *   @serializeProperty()
 *   public moveSpeed: number = 5;
 * }
 * ```
 */
declare function header(content: string): (target: any, key: string) => any;
/**
 * Decorator that conditionally shows or hides a property in the inspector based on another property's value.
 * Useful for creating dynamic UI that adapts to user selections.
 *
 * @param propertyName - The name of the property to check
 * @param condition - The value that triggers visibility (string, number, or boolean)
 * @returns Property decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class EffectController extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   public enableEffect: boolean = false;
 *
 *   @serializeProperty()
 *   @showIf("enableEffect", true)
 *   public effectIntensity: number = 0.5;
 *
 *   @serializeProperty()
 *   @showIf("enableEffect", true)
 *   public effectType: string = "linear";
 * }
 * ```
 */
declare function showIf(propertyName: string, condition: string | number | boolean): (target: any, key: string) => any;
/**
 * Decorator that adds a tooltip to a property in the inspector UI.
 * Provides additional information or context when users hover over the property field.
 *
 * @param content - The tooltip text to display
 * @returns Property decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class AdvancedSettings extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   @tooltip("Controls the overall brightness of the scene")
 *   @slider(0, 2, 0.1)
 *   public globalIllumination: number = 1;
 *
 *   @serializeProperty()
 *   @tooltip("Higher values create more realistic shadows but impact performance")
 *   @spinBox(512, 4096, 512)
 *   public shadowResolution: number = 2048;
 * }
 * ```
 */
declare function tooltip(content: string): (target: any, key: string) => any;
/**
 * Decorator that adds a visual separator line in the inspector UI.
 * Useful for visually grouping related properties. Can be used with or without parentheses.
 *
 * @returns Property decorator function when used with parentheses
 *
 * @example
 * ```typescript
 * @component()
 * export class GameManager extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   public gameTitle: string = "My Game";
 *
 *   @separator()
 *
 *   @serializeProperty()
 *   @spinBox(1, 100, 1)
 *   public maxPlayers: number = 4;
 *
 *   @serializeProperty()
 *   public gameMode: string = "coop";
 *
 *   @separator
 *
 *   @serializeProperty()
 *   public serverAddress: string = "localhost";
 * }
 * ```
 */
declare function separator(): (target: any, key: string) => any;
/**
 * Decorator that adds a visual separator line in the inspector UI.
 * This is the direct application form without parentheses.
 *
 * @param target - The target object
 * @param key - The property key
 *
 * @example
 * ```typescript
 * @component()
 * export class AudioManager extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   public masterVolume: number = 1;
 *
 *   @separator
 *
 *   @serializeProperty()
 *   public musicVolume: number = 0.8;
 *
 *   @serializeProperty()
 *   public sfxVolume: number = 0.9;
 * }
 * ```
 */
declare function separator(target: any, key: string): void;
/**
 * Decorator that adds vertical spacing in the inspector UI.
 * Useful for creating visual breathing room between property groups.
 *
 * @param heightPixels - The height of the space in pixels
 * @returns Property decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class ComplexComponent extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   public enabled: boolean = true;
 *
 *   @space(20)
 *
 *   @serializeProperty()
 *   public advancedMode: boolean = false;
 *
 *   @space(10)
 *
 *   @serializeProperty()
 *   public debugMode: boolean = false;
 * }
 * ```
 */
declare function space(heightPixels: number): (target: any, key: string) => any;
/**
 * Decorator that begins a collapsible group in the inspector UI.
 * All properties after this decorator will be grouped until a corresponding @groupEnd is encountered.
 *
 * @param groupName - The name of the group displayed in the collapsible header
 * @returns Property decorator function
 *
 * @example
 * ```typescript
 * @component()
 * export class MaterialSettings extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   public materialName: string = "Default";
 *
 *   @groupBegin("Surface Properties")
 *   @serializeProperty()
 *   public roughness: number = 0.5;
 *
 *   @serializeProperty()
 *   public metallic: number = 0;
 *
 *   @serializeProperty()
 *   public ao: number = 1;
 *   @groupEnd()
 *
 *   @groupBegin("Emission")
 *   @serializeProperty()
 *   public emissionColor: APJS.Vector3f = new APJS.Vector3f(0, 0, 0);
 *
 *   @serializeProperty()
 *   public emissionStrength: number = 1;
 *
 *   @groupEnd()
 *   onStart() {
 *     console.log("onStart");
 *   }
 * }
 * ```
 */
declare function groupBegin(groupName: string): (target: any, key: string) => any;
/**
 * Decorator that ends a collapsible group in the inspector UI.
 * Must be used after a corresponding @groupBegin decorator. Can be used with or without parentheses.
 *
 * @returns Property decorator function when used with parentheses
 *
 * @example
 * ```typescript
 * @component()
 * export class VehicleController extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   public vehicleType: string = "car";
 *
 *   @groupBegin("Engine Settings")
 *   @serializeProperty()
 *   public maxHorsePower: number = 150;
 *
 *   @serializeProperty()
 *   public acceleration: number = 3;
 *   @groupEnd()
 *
 *   @groupBegin("Wheel Configuration")
 *   @serializeProperty()
 *   public wheelCount: number = 4;
 *
 *   @serializeProperty()
 *   public wheelType: string = "alloy";
 *
 *   @groupEnd()
 *   onStart() {
 *     console.log("onStart");
 *   }
 * }
 * ```
 */
declare function groupEnd(): (target: any, key: string) => any;
/**
 * Decorator that ends a collapsible group in the inspector UI.
 * This is the direct application form without parentheses.
 *
 * @param target - The target object
 * @param key - The property key
 *
 * @example
 * ```typescript
 * @component()
 * export class WeaponStats extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   public weaponName: string = "Sword";
 *
 *   @groupBegin("Damage Stats")
 *   @serializeProperty()
 *   public baseDamage: number = 10;
 *
 *   @serializeProperty()
 *   public critChance: number = 0.2;
 *
 *   @groupEnd
 *   onStart() {
 *     console.log("onStart");
 *   }
 * }
 * ```
 */
declare function groupEnd(target: any, key: string): void;
/**
 * Decorator that disables the pin functionality for a property in the inspector UI.
 * When applied to a property, it prevents users from pinning that property to the component header.
 * Can be used with or without parentheses.
 *
 * @returns Property decorator function when used with parentheses
 *
 * @example
 * ```typescript
 * @component()
 * export class MyComponent extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   @disablePin()
 *   public importantConfig: string = "critical setting";
 *
 *   @serializeProperty()
 *   @disablePin
 *   public temporaryValue: number = 0;
 * }
 * ```
 */
declare function disablePin(): (target: any, key: string) => any;
/**
 * Decorator that disables the pin functionality for a property in the inspector UI.
 * This is the direct application form without parentheses.
 *
 * @param target - The target object
 * @param key - The property key
 *
 * @example
 * ```typescript
 * @component()
 * export class MyComponent extends APJS.BasicScriptComponent {
 *   @serializeProperty()
 *   @disablePin
 *   public importantConfig: string = "critical setting";
 * }
 * ```
 */
declare function disablePin(target: any, key: string): void;
