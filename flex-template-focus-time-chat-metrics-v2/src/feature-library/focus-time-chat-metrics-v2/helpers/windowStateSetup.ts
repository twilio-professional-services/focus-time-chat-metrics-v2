import FocusTimeTracker from '../types/FocusTimeTracker';

declare global {
    interface Window { focusTimeTracker: any; }
}

const retrieveStateOnLoad = () => {
    const item: any = localStorage.getItem('focusTimeTracker');
    window.focusTimeTracker = JSON.parse(item)
}

const initWindowStateIfNull = () => {
    window.focusTimeTracker = window.focusTimeTracker || { reservations: {} }
}



const saveStateBeforeUnload = () => window.onbeforeunload = () => {
    // Update the handle time of the task thsat is currently open
    //updateCurrentHandleTime(store);
    // Store the state in localstorage for next retrieval
    updateLocalStorage(window.focusTimeTracker);
}

export const setupWindowState = () => {
    retrieveStateOnLoad();
    initWindowStateIfNull();
    saveStateBeforeUnload();
}

export const updateLocalStorage = (focusTimeTracker: FocusTimeTracker) => {
    localStorage.setItem('focusTimeTracker', JSON.stringify(focusTimeTracker));
}