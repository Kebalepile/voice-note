window.addEventListener("load", async (e) => {
  try {
    let reg = await navigator.serviceWorker.register("./sw.js");
    // console.log(`Service Worker registered at ${reg.scope}`);
  } catch (err) {
    // console.error(`Bothata ke bo : ${err}`);
  }
});
