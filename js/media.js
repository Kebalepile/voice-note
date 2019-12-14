const rec = async (recorder, startRec, display) => {
  let chunks = [],
    n;
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      }),
      mediaRec = await new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

    startRec.onclick = e => {
      mediaRec.start();
      notify(true)
      console.log("recording sound...");
    }

    mediaRec.onstop = e => {
      let blob = new Blob(chunks, {
        'type': 'audio/webm'
      });
      chunks = [];


      let url = URL.createObjectURL(blob);

      display(url);
    }

    mediaRec.ondataavailable = e => {

      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    }

    function createStopBtn(recorder) {
      const stopBtn = document.createElement("button");
      stopBtn.textContent = "stop";
      stopBtn.classList.add("stop");
      recorder.appendChild(stopBtn);
      stopBtn.onclick = e => {
        mediaRec.stop();
        notify(false, stopBtn);
        console.log("stopped recording sound");
      }
    }

    function notify(boolean, stopBtn = null) {

      function flash() {
        n = setInterval(function () {
          startRec.classList.toggle("recording")
        }, 1000);
      }
      switch (boolean) {
        case true:
          flash();
          createStopBtn(recorder);
          break;
        case false:
          clearInterval(n);
          recorder.removeChild(stopBtn);
          startRec.classList.remove("recording");
          break;
      }
    }
  } catch (err) {
    console.error(`Bothata ke bo: ${err}`);
  }
}


export default (rec);