export default interface FocusTimeTracker {
  reservations: {
    [key: string]: {
      active: boolean;
      handleTime: number;
      selectedTime: Date;
      reservationAcceptedTime: Date;
      wrapped: boolean;
    };
  };
}
