# hz-detector

A tool to make a good guess on the users hz. Useful for applications using RAF with a fixed timestep mechanism.

## Usage

Import the script.

```javascript
import HertzDetector from "your/path/HertzDetector.js";
```

Call the hz() method to get the hz as a promise.

```javascript
HertzDetector.hz().then(hz => {
	//Use the hz in any way 
	console.log(hz);
});
```

## Disclaimer

-todo
