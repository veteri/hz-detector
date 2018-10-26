export default (function() {

	/**
	 * Makes an educated guess on the hz
	 * of the users screen using the average
	 * of fps achieved during a RAF loop.
	 *
	 * There is no guarantee that the results
	 * match the actual hz.
	 *
	 * Especially for users with multi screen setups, there are
	 * a number of problems. In the case of different
	 * hz on each monitor the browser will pick a reference
	 * to the hz of the screen in which the browser started up.
	 *
	 * Changing that reference can be SOMETIMES reset by shutting
	 * down the browser and starting it on the screen with
	 * the desired hz.
	 *
	 * Example: If you're using 2 screens, one with 60hz and one
	 * with 144hz and start up the browser on the 60hz it "can" happen
	 * that the browser will use either screen hz as the reference for all
	 * RAF's, resulting in a wrong result.
	 */
	class HertzDetector {
		constructor(ticks = 100) {

			this.start = 0;
			this.requestID = null;
			this.fps = 0;
			this.minTicks = ticks;
			this.tickCount = 0;

			this.fpsRanges = [
				{ hz: 60,  min: 50 },
				{ hz: 144, min: 134 }
			];
		}

		/**
		 * The loop that will run until it
		 * reaches the defined amount of ticks.
		 * The fps will be defined in the fps
		 * property.
		 * @param timestamp The RAF argument DOMHighResTimeStamp
		 */
		fpsMonitorLoop(timestamp) {

			this.start = this.start || timestamp;

			if (this.tickCount++ > this.minTicks) {
				this.fps = Math.floor(1000 * this.minTicks / (timestamp - this.start));
				this.tickCount = 0;
				this.start = 0;
			}

			this.enqueue(this.fpsMonitorLoop);
		}

		/**
		 * Looks up the hz based on the fps
		 * from a table that describes what your
		 * min fps should be for a hz amount.
		 * @param fps The fps
		 * @returns {HertzDetector.hz|number}
		 */
		getHzByFps(fps) {

			if (fps <= 0) {
				throw new RangeError("Argument fps must be greater than zero.");
			} else if (fps < this.fpsRanges[0].min) {
				throw new Error(`No hz defined for ${fps}fps.`);
			}

			return this.fpsRanges.filter(range => fps >= range.min).pop().hz;
		}

		/**
		 * Tries to guess the refresh rate based on the fps.
		 *
		 * NOTE: Having a multiple screen setup can skew the results,
		 * since the browser process references one screen for
		 * requestAnimationFrame repaints at a time
		 * (which is usually done at browser start up).
		 *
		 * @returns {Promise}
		 */
		hz() {
			return new Promise((resolve, reject) => {

				this.enqueue(this.fpsMonitorLoop);

				const fpsMonitorHandler = () => {
					if (this.fps !== 0) {
						this.stop();
						resolve(this.getHzByFps(this.fps));
					} else {
						setTimeout(fpsMonitorHandler, 50)
					}
				};

				fpsMonitorHandler();

				setTimeout(reject, 10000, "Monitoring took too long.");

			});
		}

		/**
		 * Enqueue the given function
		 * in the context of the hzDetector.
		 * @param fn The callback
		 */
		enqueue(fn) {
			this.requestID = requestAnimationFrame(fn.bind(this));
		}

		/**
		 * Cancel the currently enqueued function.
		 */
		stop() {
			cancelAnimationFrame(this.requestID);
			this.requestID = null;
		}
	}

	return new HertzDetector();

})();



