import HertzDetector from "./HertzDetector.js";

HertzDetector.hz().then(hz => {
	const p = document.querySelector(".hz");
	p.textContent = `${hz}hz`;
	p.classList.add("done");
});


