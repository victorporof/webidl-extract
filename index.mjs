import fs from "fs/promises";
import prettier from "prettier";
import * as Consts from "./src/consts.mjs";
import * as Transform from "./src/transform.mjs";
import * as Util from "./src/util.mjs";

const output = await Transform.getAndTransformIDLs([
  Consts.HTML_SPECIFICATION,
  Consts.DOM_SPECIFICATION,
  Consts.UIEVENTS_SPECIFICATION,
  Consts.POINTEREVENTS_SPECIFICATION,
  Consts.CSSOM_SPECIFICATION,
  Consts.ARIA_SPECIFICATION,
]);

const orphans = Util.getOrphanInterfaces(output);
for (const orphan of orphans) {
  console.warn("Orphan", orphan);
}

await fs.mkdir("out", { recursive: true }).catch();
await fs.writeFile(
  "out/data.json",
  prettier.format(JSON.stringify(output, null, 2), { parser: "json" })
);
