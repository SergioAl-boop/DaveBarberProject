import OneSignal from "react-onesignal";

let sdkListo = false;
let iniciando = false;

export async function iniciarOneSignal(userId) {
  // Evitar errores en localhost ya que OneSignal está configurado para GitHub Pages
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return;
  }

  try {
    if (!sdkListo && !iniciando) {
      iniciando = true;
      await OneSignal.init({
        appId: "536a8a74-604b-408d-967d-0c0d34793756",
        serviceWorkerParam: { scope: "/DaveBarberProject/" },
        serviceWorkerPath: "/DaveBarberProject/OneSignalSDKWorker.js",
        notifyButton: {
          enable: false,
        },
      });
      sdkListo = true;
      iniciando = false;
    }

    if (sdkListo && userId) {
      await OneSignal.login(userId);
    }
  } catch (error) {
    iniciando = false;
    console.error("Error iniciando OneSignal:", error);
  }
}

export async function logoutOneSignal() {
  try {
    if (sdkListo) {
      await OneSignal.logout();
    }
  } catch (error) {
    console.error("Error cerrando sesión en OneSignal:", error);
  }
}