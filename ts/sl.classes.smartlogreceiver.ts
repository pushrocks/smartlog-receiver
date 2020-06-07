import * as plugins from './sl.receiver.plugins';

import {
  ILogPackage,
  ILogPackageAuthenticated,
  ILogDestination
} from '@pushrocks/smartlog-interfaces';

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
  public passphrase: string;
  public validatorFunction: TValidatorFunction;
  public smartlogInstance: plugins.smartlog.Smartlog;

  constructor(smartlogReceiverOptions: ISmartlogReceiverOptions) {
    this.passphrase = smartlogReceiverOptions.passphrase;
    this.validatorFunction = smartlogReceiverOptions.validatorFunction;
    this.smartlogInstance = smartlogReceiverOptions.smartlogInstance;
  }

  /**
   * handles a authenticated log
   */
  public async handleAuthenticatedLog(authenticatedLogPackageArg: ILogPackageAuthenticated) {
    const authString = authenticatedLogPackageArg.auth;
    const logPackage = authenticatedLogPackageArg.logPackage;

    if (authString === plugins.smarthash.sha256FromStringSync(this.passphrase)) {
      // this.smartlogInstance.log('ok', 'Message accepted');
      this.smartlogInstance.handleLogPackage(logPackage);
      return { status: 'ok' };
    } else {
      this.smartlogInstance.log('error', 'Message rejected because of bad passphrase');
      return { status: 'error' };
      // console.log(plugins.smarthash.sha256FromStringSync(this.passphrase));
    }
  }

  /**
   * handles an array of authenticated logs
   * @param authenticatedLogsPackageArrayArg
   */
  public async handleManyAuthenticatedLogs(
    authenticatedLogsPackageArrayArg: ILogPackageAuthenticated[]
  ) {
    const promiseArray: Array<Promise<any>> = [];
    for (const logPackage of authenticatedLogsPackageArrayArg) {
      promiseArray.push(this.handleAuthenticatedLog(logPackage));
    }
    await Promise.all(promiseArray);
  }
}
