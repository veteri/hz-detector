import HertzDetector from "./HertzDetector.js";

//Get an approximation to your hz
HertzDetector.hz().then(hz => {

	//And use them in any way you like
	const p = document.querySelector(".hz");
	p.textContent = `${hz}hz.`;
	p.classList.add("done");
});


