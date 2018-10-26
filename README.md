# hz-detector

A tool to make a good guess on the users hz. Useful for applications using RAF with a fixed timestep mechanism.

## Usage

### Example 1: Basic Usage.

Import the script.

```javascript
import HertzDetector from "your/path/HertzDetector.js";
```

Call the `hz()` method to get the hz as a promise.

```javascript
HertzDetector.hz().then(hz => {
	//Use the hz in any way 
	console.log(hz);
});
```

### Example 2: Using the `hz` for a fixed timestep mechanism.


```javascript
HertzDetector.hz().then(hz => {
    /*Using the hz to figure out a timestep matching
    the user screen hz, resulting in very smooth animations.*/
    const timer  = new Timer(1/hz);
});
```

## Disclaimer

Makes an educated guess on the hz of the users screen using the  
average of fps achieved during a RAF loop.
	 
There is no guarantee that the results match the actual hz.  
For users with a single screen setup this will  
rarely produce wrong results.

However for users with multi screen setups, there are a number of problems.  
In the case of different hz on each monitor the browser will  
pick a reference to the hz of the screen in which the browser started up.
	 
 Changing that reference can be SOMETIMES achieved by shutting  
 down the browser and starting it on the screen with the desired hz.  
 
 Example: If you're using 2 screens, one with 60hz and one  
 with 144hz and start up the browser on the 60hz it "can" happen  
 that the browser will use either screen hz as the reference for all  
 RAF's, resulting in a wrong result.
	 
