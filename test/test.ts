import { expect, tap } from '@pushrocks/tapbundle';
import * as smartlog from '@pushrocks/smartlog';
import * as smarthash from '@pushrocks/smarthash';

import * as smartlogReceiver from '../ts/index';

let testReceiver: smartlogReceiver.SmartlogReceiver;
let testSmartlog = smartlog.defaultLogger;
testSmartlog.enableConsole();

tap.test('should create a valid SmartlogReceiver', async () => {
  testReceiver = new smartlogReceiver.SmartlogReceiver({
    passphrase: 'hi',
    smartlogInstance: testSmartlog,
    validatorFunction: async () => {
      return true;
    }
  });
  expect(testReceiver).to.be.instanceof(smartlogReceiver.SmartlogReceiver);
});

tap.test('should receive a message', async () => {
  testReceiver.handleAuthenticatedLog({
    auth: smarthash.sha256FromStringSync('hi'),
    logPackage: {
      timestamp: Date.now(),
      context: {
        company: 'Lossless GmbH',
        companyunit: 'Lossless Cloud',
        containerName: null,
        environment: 'staging',
        runtime: 'node',
        zone: 'gitzone'
      },
      level: 'info',
      type: 'log',
      correlation: {
        id: '123',
        type: 'none'
      },
      message: 'hi there',
    }
  });
});

tap.start();
