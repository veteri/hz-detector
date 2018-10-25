export default (function() {

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
		 * reaches the defined ticks.
		 * The fps will be defined in the fps
		 * property.
		 * @param timestamp The RAF argument hypertimestamp
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



