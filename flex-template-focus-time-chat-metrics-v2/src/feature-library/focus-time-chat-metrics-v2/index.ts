import { Manager } from '@twilio/flex-ui';
import { setupWindowState } from './helpers/windowStateSetup';

const manager = Manager.getInstance();

  export const initialize = () => {
    setupWindowState();
  };