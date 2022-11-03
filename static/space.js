export async function initSpace() {
  const { pathname } = window.location;

  if (pathname === "/" || pathname === "") {
    window.location.href = "/space/" + (await createSpace());
    return undefined;
  }

  const paths = pathname.split("/");
  const [, spaceDir, spaceID] = paths;
  if (
    spaceDir !== "space" ||
    spaceID === undefined ||
    !(await spaceExists(spaceID))
  ) {
    window.location.href = "/";
    return undefined;
  }
  return spaceID;
}

async function spaceExists(spaceID) {
  const spaceExistRes = await fetchJSON("spaceExists", spaceID);
  return spaceExistRes.spaceExists;
}

async function createSpace(spaceID) {
  const createSpaceRes = await fetchJSON("createSpace", spaceID);
  return createSpaceRes.spaceID;
}

async function fetchJSON(apiName, spaceID) {
  const res = await fetch(`/api/replicache/${apiName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:
      spaceID &&
      JSON.stringify({
        spaceID,
      }),
  });
  return await res.json();
}
