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
