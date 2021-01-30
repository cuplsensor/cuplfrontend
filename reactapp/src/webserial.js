/*
 * Copyright (c) 2021. Plotsensor Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let port;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;
const log = document.getElementById('log');
const btnConnect = document.getElementById('btnConnect');
/*global TextEncoderStream*/
/*global TextDecoderStream*/

// https://italonascimento.github.io/applying-a-timeout-to-your-promises/
const promiseTimeout = function(ms, promise) {
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

/**
 * Opens a Web Serial connection to a micro:bit and sets up the input and
 * output stream.
 */
async function connect() {
  // - Request a port and open a connection.
  port = await navigator.serial.requestPort();
  // - Wait for the port to open.
  await port.open({ baudRate: 9600 });

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
    reader.releaseLock();
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

function extractPayload(cmd, readstr) {
  let startmarker = `<${cmd}:`; // Marks the start of a command e.g. <x:
  let endmarker = '>'; // Marks the end of a command.
  let smIndex = readstr.lastIndexOf(startmarker);
  let payloadIndex = smIndex + startmarker.length;
  let payloadstr = "";

  if (smIndex > -1) {
    let aftersm = readstr.substring(payloadIndex);
    let emIndex = aftersm.indexOf(endmarker);
    if (emIndex > -1) {
      payloadstr = aftersm.substring(0, emIndex);
    }
  }

  return payloadstr;
}

export async function ConnectAndGetVersion() {
  const versioncmd = 'x';
  await connect().catch((error) => {return Promise.reject(`Unable to connect. ${error}`)});

  await writeToStream(`<${versioncmd}>`);

  let readWithTimeout = promiseTimeout(5000, reader.read());
  return readWithTimeout.then(function processText({done, value}) {
      let tagresponse = value;
      const versionstr = extractPayload(versioncmd, tagresponse);
      if (versionstr === "") {
        tagresponse = tagresponse.replace(/[\n\r]/g, '');
        return Promise.reject(`Bad response to the version command: ${tagresponse}`);
      } else {
        return Promise.resolve(versionstr);
      }
    }).catch(error => {
      return Promise.reject(error);
    }).finally(() => {
      disconnect();
    });
}

async function validateResponse(configlist) {
  let readWithTimeout = promiseTimeout(5000, reader.read());
  return readWithTimeout.then(function processText({done, value}) {
      const tagresponse = value;
      console.log(tagresponse);
      for (const configstr of configlist) {
        if (typeof tagresponse == 'undefined')
        {
          return Promise.reject(`Response is undefined`);
        }
        if (!tagresponse.includes(configstr)) {
          return Promise.reject(`No response to:${configstr}`);
        }
      }
      return Promise.resolve("Write OK");
    }).catch(error => {
      return Promise.reject(error);
    })
}

async function writeAttempt(configlist) {
  for (const configstr of configlist) {
    writeToStream(configstr)
    await validateResponse(configstr).catch(() => {validateResponse(configstr).catch(() => {validateResponse(configstr)})});
    await new Promise(r => setTimeout(r, 500));
  }
  return Promise.resolve("Write OK");
}

export async function ConnectAndWrite(configlist) {
  await connect().catch((error) => {return Promise.reject(`Unable to connect. ${error}`)});

  return writeAttempt(configlist).finally(() => {
    disconnect();
  });
}

