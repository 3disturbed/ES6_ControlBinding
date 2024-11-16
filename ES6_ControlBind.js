export default class InputManager {
    constructor() {
        console.log("Ben Darlington's ES6_ControlBind Library Loaded...");
        this.bindings = new Map();
        this.isListening = false;
        this.tempCallback = null;
        this.tempIsAxis = false;

        this.gamepadIndex = null;
        this.previousGamepadState = {};

        this.handleInput = this.handleInput.bind(this);
        this.pollGamepad = this.pollGamepad.bind(this);

        document.addEventListener("keydown", this.handleInput);
        window.addEventListener("gamepadconnected", (event) => this.onGamepadConnect(event));
        window.addEventListener("gamepaddisconnected", (event) => this.onGamepadDisconnect(event));
    }

    handleInput(event) {
        if (this.isListening) {
            const key = event.key.toLowerCase();
            if (this.tempCallback) {
                this.bindings.set(key, this.tempCallback);
                console.log(`Key '${key}' is now bound.`);
                this.isListening = false;
                this.tempCallback = null;
            }
        } else {
            const callback = this.bindings.get(event.key.toLowerCase());

            if (callback) callback();
        }
    }

    onGamepadConnect(event) {
        this.gamepadIndex = event.gamepad.index;
        console.log(`Gamepad connected: ${event.gamepad.id}`);
        this.pollGamepad();
    }

    onGamepadDisconnect(event) {
        if (this.gamepadIndex === event.gamepad.index) {
            console.log("Gamepad disconnected.");
            this.gamepadIndex = null;
        }
    }

    pollGamepad() {
        if (this.gamepadIndex === null) return;

        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (gamepad) {
            gamepad.buttons.forEach((button, index) => {
                if (button.pressed && !this.previousGamepadState[`button_${index}`]) {
                    const callback = this.bindings.get(`gamepad_button_${index}`);
                    if (callback) callback();
                    this.previousGamepadState[`button_${index}`] = true;
                } else if (!button.pressed) {
                    this.previousGamepadState[`button_${index}`] = false;
                }
            });

            gamepad.axes.forEach((value, index) => {
                const callback = this.bindings.get(`gamepad_axis_${index}`);
                if (callback && Math.abs(value) > 0.1) {
                    
                    callback( { gamepad: gamepad, axisIndex: index, value: value } );
                }
            });
        }

        requestAnimationFrame(this.pollGamepad);
    }
    async bind(key, callback, isAxis = false) {
        if (this.bindings.has(key)) {
            console.warn(`Key '${key}' is already bound.`);
            return;
        }

        this.bindings.set(key, callback);
        console.log(`Key '${key}' is now bound.`);

        if (isAxis) {
            return new Promise((resolve) => {
                const axisListener = (event) => {
                    if (event.axisIndex === isAxis) {
                        resolve();
                        this.unbind(key);
                    }
                };
                this.rebind(axisListener, true);
            });
        }
        
    }
    async rebind(callback, isAxis = false) {
        if (this.isListening) {
            console.log("Already waiting for input. Please press a key or gamepad input.");
            return;
        }

        console.log("Press a key, button, or move a gamepad axis to bind...");
        this.isListening = true;
        this.tempCallback = callback;
        this.tempIsAxis = isAxis;

        return new Promise((resolve) => {
            const listener = (event) => {
                if (!this.isListening) return;

                if (event.type === "keydown") {
                    const key = event.key.toLowerCase();
                    this.bindings.set(key, this.tempCallback);
                    console.log(`Key '${key}' is now bound.`);
                    this.resetRebinding(resolve, listener);
                }
            };

            const gamepadListener = () => {
                const gamepad = navigator.getGamepads()[this.gamepadIndex];
                if (!gamepad) return;

                gamepad.buttons.forEach((button, index) => {
                    if (button.pressed && this.isListening) {
                        const bindingKey = `gamepad_button_${index}`;
                        this.bindings.set(bindingKey, this.tempCallback);
                        console.log(`Gamepad button '${index}' is now bound.`);
                        this.resetRebinding(resolve, listener);
                    }
                });

                gamepad.axes.forEach((value, index) => {
                    if (Math.abs(value) > 0.5 && this.isListening) {
                        const bindingKey = `gamepad_axis_${index}`;
                        this.bindings.set(bindingKey, this.tempCallback);
                        console.log(`Gamepad axis '${index}' is now bound.`);
                        this.resetRebinding(resolve, listener);
                    }
                });
            };

            document.addEventListener("keydown", listener);
            const pollGamepadRebind = () => {
                if (this.isListening) {
                    gamepadListener();
                    requestAnimationFrame(pollGamepadRebind);
                }
            };
            pollGamepadRebind();
        });
    }

    resetRebinding(resolve, listener) {
        this.isListening = false;
        this.tempCallback = null;
        document.removeEventListener("keydown", listener);
        resolve();
    }

    getBindings() {
        const bindings = {};
        this.bindings.forEach((callback, key) => {
            bindings[key] = callback.name || "anonymous";
        });
        return bindings;
    }

    setBindings(bindings) {
        Object.entries(bindings).forEach(([key, callbackName]) => {
            if (typeof callbackName === "string" && this[callbackName]) {
                this.bindings.set(key, this[callbackName].bind(this));
            } else {
                console.warn(`Callback function '${callbackName}' not found for key '${key}'.`);
            }
        });
    }

    /**
     * Downloads the current bindings as a JSON file.
     */
    downloadBindings() {
        const bindings = this.getBindings();
        const jsonString = JSON.stringify(bindings, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "bindings.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log("Bindings downloaded.");
    }
}
