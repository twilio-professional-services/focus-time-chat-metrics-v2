import { omit } from "lodash";
import { updateLocalStorage } from "./windowStateSetup";

export const taskSelectedAction = (
  currentTaskSid: string,
  currentTaskPreviousFocusTime: number,
  previousTaskSid: string,
  previousTaskSelectedTime: Date,
  previousTaskFocusTime: number
) => {
  const currentDate = new Date();
  const state = window.focusTimeTracker;
  const previousTaskInState = state.reservations[previousTaskSid];

  if (previousTaskSid && previousTaskInState) {
    const previousTaskSelectedTimeNew = new Date(previousTaskSelectedTime);
    const timeDifference =
      currentDate.getTime() - previousTaskSelectedTimeNew.getTime();
    const seconds = Math.abs(timeDifference / 1000);
    const focusTime = previousTaskInState.wrapup
      ? previousTaskFocusTime
      : previousTaskFocusTime + seconds;

    window.focusTimeTracker = Object.assign({}, state, {
      reservations: {
        ...state.reservations,
        [currentTaskSid]: {
          ...state.reservations[currentTaskSid],
          selectedTime: currentDate,
          active: true,
          focusTime: currentTaskPreviousFocusTime,
        },
        [previousTaskSid]: {
          ...state.reservations[previousTaskSid],
          active: false,
          focusTime: focusTime,
        },
      },
    });
  } else {
    window.focusTimeTracker = Object.assign({}, state, {
      reservations: {
        ...state.reservations,
        [currentTaskSid]: {
          ...state.reservations[currentTaskSid],
          selectedTime: currentDate,
          active: true,
          ...(!state.reservations[currentTaskSid]
            ? {
                focusTime: 0,
              }
            : {}),
        },
      },
    });
  }

  updateLocalStorage(window.focusTimeTracker);
};

export const reservationAcceptedAction = (currentTaskSid: string) => {
    const state = window.focusTimeTracker
    const currentDate = new Date().toISOString();

    window.focusTimeTracker = Object.assign({}, state, {
        reservations: {
            ...state.reservations,
            [currentTaskSid]: {
                ...state.reservations[currentTaskSid],
                reservationAcceptedTime: currentDate
            }
        }
    })
    updateLocalStorage(window.focusTimeTracker);
    
}

export const taskWrappingAction = (reservationSid: string, focusTime: number, wrapped: boolean) => {
    const state = window.focusTimeTracker
    window.focusTimeTracker = Object.assign({}, state, {
        reservations: {
            ...state.reservations,
            [reservationSid]: {
                ...state.reservations[reservationSid],
                active: false,
                focusTime,
                ...(wrapped ? {
                    wrapup: true
                } : {})
            }
        }
    })
    updateLocalStorage(window.focusTimeTracker);
}

export const taskCompletedAction = (taskSid: string) => {
    const state = window.focusTimeTracker
    window.focusTimeTracker = Object.assign({}, state, {
        reservations: omit(state.reservations, taskSid)
    })
    updateLocalStorage(window.focusTimeTracker);
} 
