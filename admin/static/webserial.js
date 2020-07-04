let port;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

const log = document.getElementById('log');
const btnConnect = document.getElementById('btnConnect');

// https://italonascimento.github.io/applying-a-timeout-to-your-promises/
const promiseTimeout = function(ms, promise){

  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in '+ ms + 'ms.')
    }, ms)
  })

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ])
}

  // CODELAB: Add feature detection here.
if (!('serial' in navigator)) {
  const notSupported = document.getElementById('notSupported');
  notSupported.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {

btnConnect.addEventListener('click', clickConnect);

});
/**
 * @name connect
 * Opens a Web Serial connection to a micro:bit and sets up the input and
 * output stream.
 */
async function connect() {
  // CODELAB: Add code to request & open port here.

  // CODELAB: Add code setup the output stream here.

  // CODELAB: Send CTRL-C and turn off echo on REPL

  // CODELAB: Add code to read the stream here.


  // - Request a port and open a connection.
  port = await navigator.serial.requestPort();
  // - Wait for the port to open.
  await port.open({ baudrate: 9600 });

  // CODELAB: Add code setup the output stream here.
  const encoder = new TextEncoderStream();
  outputDone = encoder.readable.pipeTo(port.writable);
  outputStream = encoder.writable;

  // CODELAB: Add code to read the stream here.
  let decoder = new TextDecoderStream();
  inputDone = port.readable.pipeTo(decoder.writable);
  inputStream = decoder.readable;

  reader = inputStream.getReader();
}

function writeToStream(...lines) {
  // CODELAB: Write to output stream
  const writer = outputStream.getWriter();
  lines.forEach((line) => {
    console.log('[SEND]', line);
    writer.write(line);
  });
  writer.releaseLock();
}

function toggleUIConnected(connected) {
  let lbl = 'Connect';
  if (connected) {
    lbl = 'Disconnect';
  }
  btnConnect.textContent = lbl;
}


async function disconnect() {
  // CODELAB: Close the input stream (reader).
  if (reader) {
    await reader.cancel();
    await inputDone.catch(() => {});
    reader = null;
    inputDone = null;
  }

  // CODELAB: Close the output stream.
  if (outputStream) {
    await outputStream.getWriter().close();
    await outputDone;
    outputStream = null;
    outputDone = null;
  }

  // CODELAB: Close the port.
  await port.close();
  port = null;
}

async function readResponse() {
  // CODELAB: Add read loop here.
  const { value, done } = await reader.read();
  if (value) {
    log.textContent += value + '\n';
  }
  if (done) {
    console.log('[readLoop] DONE', done);
    reader.releaseLock();
  }

  return value;
}


async function clickConnect() {
  // CODELAB: Add code to request & open port here.


  // CODELAB: Add disconnect code here.
  if (port) {
    await disconnect();
    toggleUIConnected(false);
    return;
  }

  await connect();
  toggleUIConnected(true);

  //await promiseTimeout(1000, readResponse()).then(v => {alert(v)}).catch(e => {});

  for (const configstr of configsubject.configlist) {
    writeToStream(configstr);
    await reader.read().then(function processText({done, value}) {
      if (done) {
        console.log("Stream complete");
        return;
      }
      console.log(value);
    }).catch(error => {
      console.log(error);
    });
  }



  return;
}