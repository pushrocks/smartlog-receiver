import { expect, tap } from '@pushrocks/tapbundle';
import * as smartlogReceiver from '../ts/index';

let testReceiver: smartlogReceiver.SmartlogReceiver;

tap.test('first test', async () => {
  testReceiver = new smartlogReceiver.SmartlogReceiver();
})

tap.start();
