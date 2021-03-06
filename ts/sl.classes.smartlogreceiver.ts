import * as plugins from './sl.receiver.plugins';

import { ILogPackage, ILogPackageAuthenticated, ILogDestination } from '@pushrocks/smartlog-interfaces';

export type TValidatorFunction = (logPackage: ILogPackage) => boolean;

export interface ISmartlogReceiverOptions {
  smartlogInstance: plugins.smartlog.Smartlog;
  passphrase: string;
  validatorFunction: TValidatorFunction;
}

/**
 * a class that receives smartlog packages
 */
export class SmartlogReceiver {
  passphrase: string;
  validatorFunction: TValidatorFunction;
  smartlogInstance: plugins.smartlog.Smartlog;

  constructor(smartlogReceiverOptions: ISmartlogReceiverOptions) {
    this.passphrase = smartlogReceiverOptions.passphrase;
    this.validatorFunction = smartlogReceiverOptions.validatorFunction;
    this.smartlogInstance = smartlogReceiverOptions.smartlogInstance;
  }

  /**
   * handles a authenticated log
   */
  async handleAuthenticatedLog(authenticatedLogPackageArg: ILogPackageAuthenticated) {
    const authString = authenticatedLogPackageArg.auth;
    const logPackage = authenticatedLogPackageArg.logPackage;

    if(authString === plugins.smarthash.sha256FromStringSync(this.passphrase)) {
      // this.smartlogInstance.log('ok', 'Message accepted');
      this.smartlogInstance.handleLogPackage(logPackage);
      return { status: 'ok' };
    } else {
      this.smartlogInstance.log('error', 'Message rejected because of bad passphrase');
      return { status: 'error' };
      // console.log(plugins.smarthash.sha256FromStringSync(this.passphrase));
    }
  }

  
}
