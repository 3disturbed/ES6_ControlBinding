# ES6_ControlBinding

```
import InputManager from './InputManager.js';

const inputManager = new InputManager();

// Example callbacks
function jump() {
    console.log("Jump!");
}

function move(axisData) {
    console.log(`Move on axis ${axisData.axisIndex} with value ${axisData.value}`);
}

// Rebind actions
inputManager.rebind(jump).then(() => {
    console.log("Jump action bound.");
});
inputManager.rebind(() => move({ axisIndex: 0, value: 1 }), true).then(() => {
    console.log("Move action bound.");
});

// Download bindings as JSON
inputManager.downloadBindings();
```
## InputManager API Documentation
### Overview
The InputManager class provides a modular solution for managing input bindings in a game, supporting both keyboard and gamepad inputs. It allows rebinding of keys, buttons, and axes to specific callbacks, saving/restoring bindings, and exporting bindings as a JSON file.

##Table of Contents
Constructor
Methods
rebind(callback, isAxis)
getBindings()
setBindings(bindings)
downloadBindings()
Event Handling
Usage Example

# Constructor
new InputManager()
Creates an instance of InputManager.

# Methods
rebind(callback, isAxis = false)
Rebinds an input (keyboard key, gamepad button, or gamepad axis) to a specific callback function.

##Parameters:
callback (Function): The function to be triggered by the input.
isAxis (Boolean, optional): If true, the method waits for an axis movement instead of a key/button press.
Returns:
Promise<void>: Resolves once the input has been successfully rebound.
## Usage:
```
inputManager.rebind(() => console.log("Jump!")).then(() => {
    console.log("Jump action bound.");
});
```
getBindings()
Retrieves the current bindings as a JSON object.

Returns:
Object: A JSON object where keys represent inputs (e.g., "w", "gamepad_button_0") and values are the names of the bound callback functions.


## Example:
```
const bindings = inputManager.getBindings();
console.log(bindings);

```
## Output:

```
{
  "w": "jump",
  "gamepad_button_0": "move"
}
```

setBindings(bindings)
Restores input bindi#ngs from a JSON object.

### Parameters:
bindings (Object): A JSON object representing the bindings. Keys are input names (e.g., "w", "gamepad_button_0") and values are callback function names.
Usage:
javascript
Copy code
const bindings = {
    "w": "jump",
    "gamepad_button_0": "move"
};
inputManager.setBindings(bindings);
downloadBindings()
Exports the current bindings to a JSON file named bindings.json and prompts the user to download it.

### Usage:

inputManager.downloadBindings();

Event Handling
Keyboard Input
The InputManager listens for keydown events and triggers the bound callback for the pressed key.
Gamepad Input
Listens for gamepadconnected and gamepaddisconnected events.
Continuously polls for button presses and axis movements using requestAnimationFrame.

### Usage Example
```
import InputManager from './InputManager.js';

const inputManager = new InputManager();

// Define callbacks
function jump() {
    console.log("Jump!");
}

function move(axisData) {
    console.log(`Move on axis ${axisData.axisIndex} with value ${axisData.value}`);
}

// Bind actions
inputManager.rebind(jump).then(() => console.log("Jump action bound."));
inputManager.rebind(() => move({ axisIndex: 0, value: 1 }), true).then(() => console.log("Move action bound."));

// Get and log bindings
const bindings = inputManager.getBindings();
console.log("Current bindings:", bindings);

// Restore bindings
inputManager.setBindings(bindings);

// Download bindings
inputManager.downloadBindings();

```
## Features
Flexible Rebinding: Supports keyboard keys, gamepad buttons, and gamepad axes.
Gamepad Compatibility: Automatically detects connected gamepads.
Portable Bindings: Save and restore bindings using JSON.
Download Bindings: Export bindings for backup or sharing.


File Details
File Name: InputManager.js
Type: ES6 Module
