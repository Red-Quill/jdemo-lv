/**
 * Upstream notifications
 * Application core can send notifications to be shown in the UI
 */

type notificationCallback = (message:string) => void;

class JNotifications {
	_onNotificationCallbacks:Set<notificationCallback>
	_onWarningCallbacks:Set<notificationCallback>

	constructor() {
		this._onNotificationCallbacks = new Set();
		this._onWarningCallbacks = new Set();
	};

	init = () => {};

	onNotification = (callback:notificationCallback) => this._onNotificationCallbacks.add(callback);
	offNotification = (callback:notificationCallback) => this._onNotificationCallbacks.delete(callback);
	onWarning = (callback:notificationCallback) => this._onWarningCallbacks.add(callback);
	offWarning = (callback:notificationCallback) => this._onWarningCallbacks.delete(callback);

	showNotification = (message:string) => {
		console.log(message);
		this._onNotificationCallbacks.forEach((callback) => callback(message));
	};

	showWarning = (message:string) => {
		console.warn(message);
		this._onWarningCallbacks.forEach((callback) => callback(message));
	}
};



export default JNotifications;
