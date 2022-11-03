import {
  Replicache,
  TEST_LICENSE_KEY,
} from "https://unpkg.com/replicache@11.2.0/out/replicache.mjs";

import {
  initSpace 
} from "./space.js";

function log(msg) {
  const textarea = document.querySelector("#log");
  textarea.scrollTop = textarea.scrollHeight;
  textarea.value += msg + "\n";
}

const spaceID = await initSpace();

if (spaceID !== undefined) {
  const rep = new Replicache({
    name: spaceID,
    licenseKey: TEST_LICENSE_KEY,
    pushURL: `/api/replicache/push?spaceID=${spaceID}`,
    pullURL: `/api/replicache/pull?spaceID=${spaceID}`,
    mutators: {
      increment: async (tx, delta) => {
        const prev = (await tx.get("count")) ?? 0;
        const next = prev + delta;
        await tx.put("count", next);
      },
    },
  });

  // Implements a Replicache poke using Server-Sent Events.
  // If a "poke" message is received, it will pull from the server.
  const ev = new EventSource(`/api/replicache/poke?spaceID=${spaceID}`, {
    withCredentials: true,
  });
  ev.onmessage = async (event) => {
    if (event.data === "poke") {
      await rep.pull();
    }
  };

  rep.subscribe(async (tx) => (await tx.get("count")) ?? 0, {
    onData: (count) => log(`count changed: ${count}`),
  });

  document.querySelector("#increment").onclick = () => {
    rep.mutate.increment(1);
    log("incremented");
  };

  log(`Hello from Replicache client: ${await rep.clientID}`);
}
