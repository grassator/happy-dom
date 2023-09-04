import GlobalWindow from '../../src/window/GlobalWindow.js';
import IWindow from '../../src/window/IWindow.js';
import ErrorEvent from '../../src/event/events/ErrorEvent.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('GlobalWindow', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new GlobalWindow();
	});

	describe('get Object()', () => {
		it('Is the same as {}.constructor.', () => {
			expect({}.constructor).toBe(window.Object);
		});

		it('Is the same as {}.constructor when using eval().', () => {
			global['globalWindow'] = window;
			expect(window.eval('({}).constructor === globalWindow.Object')).toBe(true);
			delete global['globalWindow'];
		});
	});

	describe('get Function()', () => {
		it('Is the same as (() => {}).constructor.', () => {
			expect((() => {}).constructor).toBe(window.Function);
		});

		it('Is the same as (() => {}).constructor when using eval().', () => {
			global['globalWindow'] = window;
			expect(window.eval('(() => {}).constructor === globalWindow.Function')).toBe(true);
			delete global['globalWindow'];
		});
	});

	describe('get Array()', () => {
		it('Is the same as [].constructor.', () => {
			expect([].constructor).toBe(window.Array);
		});

		it('Is the same as [].constructor when using eval().', () => {
			global['globalWindow'] = window;
			expect(window.eval('[].constructor === globalWindow.Array')).toBe(true);
			delete global['globalWindow'];
		});
	});

	describe('happyDOM.evaluate()', () => {
		it('Evaluates code and returns the result.', () => {
			const result = <() => number>window.happyDOM.evaluate('() => 5');
			expect(result()).toBe(5);
		});

		it('Respects direct eval.', () => {
			const result = <string>window.happyDOM.evaluate(`
			variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return eval('variable');
			})()`);

			expect(result).toBe('locally defined');
			expect(globalThis['variable']).toBe('globally defined');
			delete globalThis['variable'];
		});

		it('Respects indirect eval.', () => {
			const result = <string>window.happyDOM.evaluate(`
			variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return (0,eval)('variable');
			})()`);

			expect(result).toBe('globally defined');
			expect(globalThis['variable']).toBe('globally defined');
			delete globalThis['variable'];
		});

		it('Catches errors and dispatches an error event.', () => {
			let errorEvent: ErrorEvent | null = null;
			window.addEventListener('error', (event) => (errorEvent = <ErrorEvent>event));
			window.happyDOM.evaluate(`throw new Error('Something went wrong.')`);

			expect((<ErrorEvent>(<unknown>errorEvent)).error).instanceOf(window.Error);
			expect((<ErrorEvent>(<unknown>errorEvent)).error?.message).toBe('Something went wrong.');
			expect((<ErrorEvent>(<unknown>errorEvent)).message).toBe('Something went wrong.');
		});
	});

	describe('eval()', () => {
		it('Respects direct eval.', () => {
			const result = window.eval(`
			globalThis.variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return eval('variable');
			})()`);

			expect(result).toBe('locally defined');
			expect(globalThis['variable']).toBe('globally defined');

			delete globalThis['variable'];
		});

		it('Respects indirect eval.', () => {
			const result = window.eval(`
			globalThis.variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return (0,eval)('variable');
			})()`);

			expect(result).toBe('globally defined');
			expect(globalThis['variable']).toBe('globally defined');

			delete globalThis['variable'];
		});
	});
});
