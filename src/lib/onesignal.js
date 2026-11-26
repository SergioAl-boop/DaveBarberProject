import OneSignal from 'react-onesignal';

let initialized = false;

export async function iniciarOneSignal(userId) {
  try {
    if (!initialized) {
      await OneSignal.init({
        appId: '536a8a74-604b-408d-967d-0c0d34793756',
        serviceWorkerParam: { scope: '/DaveBarberProject/' },
        serviceWorkerPath: 'DaveBarberProject/OneSignalSDKWorker.js',
        allowLocalhostAsSecureOrigin: true,
      });
      initialized = true;
    }

    if (userId) {
      await OneSignal.login(userId);
    }
  } catch (error) {
    console.error('Error iniciando OneSignal:', error);
  }
}