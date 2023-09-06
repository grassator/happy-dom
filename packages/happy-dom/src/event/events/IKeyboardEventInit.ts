import IUIEventInit from '../IUIEventInit.js';

export default interface IKeyboardEventInit extends IUIEventInit {
	key?: string;
	keyCode?: number;
	code?: string;
	location?: number;
	ctrlKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
	repeat?: boolean;
	isComposing?: boolean;
}
