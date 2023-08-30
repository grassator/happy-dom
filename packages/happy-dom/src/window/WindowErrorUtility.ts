import IWindow from './IWindow.js';
import ErrorEvent from '../event/events/ErrorEvent.js';
import { IElement } from '../index.js';

/**
 * Error utility.
 */
export default class WindowErrorUtility {
	/**
	 * Calls a function with error capturing.
	 *
	 * It will use a try/catch block to capture errors and dispatch an error event on the window.
	 *
	 * @param elementOrWindow Element or Window.
	 * @param callback Callback.
	 * @returns Promise.
	 */
	public static async captureError<T>(
		elementOrWindow: IWindow | IElement,
		callback: () => Promise<T | null>
	): Promise<T> {
		try {
			return await callback();
		} catch (error) {
			this.dispatchError(elementOrWindow, error);
		}
		return null;
	}

	/**
	 * Dispatches an error event and outputs it to the console.
	 *
	 * @param elementOrWindow Element or Window.
	 * @param error Error.
	 */
	public static dispatchError(elementOrWindow: IWindow | IElement, error: Error): void {
		if ((<IWindow>elementOrWindow).console) {
			(<IWindow>elementOrWindow).console.error(error);
		}
		elementOrWindow.dispatchEvent(new ErrorEvent('error', { message: error.message, error }));
		if (!(<IWindow>elementOrWindow).console) {
			(<IElement>elementOrWindow).ownerDocument.defaultView.dispatchEvent(
				new ErrorEvent('error', { message: error.message, error })
			);
		}
	}
}
