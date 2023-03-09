async function notification(title) {
  const createNotification = (title) => {
    const notify = new Notification(title, {
      body: "Please complete task.",
      icon: "./images/5.png",
      requireInteraction: true,
      silent: false,
    });
  };
  try {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        // check whether notification permissions have already been granted.
        // if so, create notification.
        createNotification(title);
      } else if (Notification.permission !== "denied") {
        // ask user for permission if users permission choice is
        // unknown.
        let permission = await Notification.requestPermission();
        if (permission === "granted") {
          createNotification(title);
        }
      }
    } else {
      console.log("This browser does not support desktop notification");
      return;
    }
  } catch (error) {
    console.error(error);
  }
}

function initNotification({ title, deadline }) {
  const now = new Date(),
    notifyTime = new Date(deadline);
  notifyTime.setHours(7);
  notifyTime.setMinutes(30);
  setTimeout(() => {
    if (now.getTime() >= notifyTime.getTime()) {
      notification(title);
    }
  }, notifyTime.getTime() - now.getTime());
}

export default initNotification;
