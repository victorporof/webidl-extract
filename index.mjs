import fs from "fs/promises";
import prettier from "prettier";
import * as Consts from "./src/consts.mjs";
import * as Extract from "./src/extract.mjs";
import * as Parse from "./src/parse.mjs";
import * as Transformers from "./src/transformers/index.mjs";
import * as Util from "./src/util.mjs";

const inputs = await Promise.all([
  Extract.getRawSpecIDLs([
    Consts.HTML_SPECIFICATION,
    Consts.DOM_SPECIFICATION,
    Consts.UIEVENTS_SPECIFICATION,
    Consts.POINTEREVENTS_SPECIFICATION,
    Consts.CSSOM_SPECIFICATION,
    Consts.ARIA_SPECIFICATION,
  ]),
  Extract.getRawRepoIDLs([Consts.BLINK_REPO]),
]);

const parsed = Parse.parseRawIDLs(inputs.flat());

await fs.mkdir("out", { recursive: true }).catch();
await fs.writeFile(
  "out/raw.json",
  prettier.format(JSON.stringify(parsed, null, 2), { parser: "json" })
);

const output = await Transformers.GetProps.getIDLProps(parsed);
const orphans = Util.getOrphanInterfaces(output);
for (const orphan of orphans) {
  console.warn("Orphan", orphan);
}

await fs.writeFile(
  "out/props.json",
  prettier.format(JSON.stringify(output, null, 2), { parser: "json" })
);
