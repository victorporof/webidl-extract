import { merge } from "lodash-es";
import puppeteer from "puppeteer";
import * as WebIDL2 from "webidl2";
import * as Config from "./config.mjs";
import * as Extract from "./extract.mjs";
import * as Util from "./util.mjs";

// Attributes for interfaces, fields for dictionaries.
const ACCEPTED_PROP_TYPES = new Set(["attribute", "field"]);

export async function getAndTransformIDLs(specs, output = {}) {
  const browser = await puppeteer.launch();
  for (const spec of specs) {
    const sources = await Extract.extractIDLSources(browser, spec);
    const parsed = sources.map(WebIDL2.parse).flat();
    transformIDLSources(parsed, output);
  }
  applyRules(output, Config.VALID_PROPS_RULES);
  browser.close();
  return output;
}

function transformIDLSources(idls, output) {
  const makeIDLInfo = () => ({
    inherits: null,
    includes: [],
    props: {},
  });

  for (const idl of idls) {
    switch (idl.type) {
      case "includes": {
        output[idl.target] ??= makeIDLInfo();
        merge(output[idl.target], {
          includes: [idl.includes],
        });
        break;
      }
      case "interface":
      case "interface mixin":
      case "dictionary": {
        output[idl.name] ??= makeIDLInfo();
        merge(output[idl.name], {
          inherits: idl.inheritance,
          props: Object.fromEntries(
            idl.members
              ?.filter((e) => ACCEPTED_PROP_TYPES.has(e.type))
              .map((e) => [e.name, Util.getIDLTypes(e.idlType)])
          ),
        });
        break;
      }
      case "callback":
      case "callback interface":
      case "enum":
      case "typedef":
      case "namespace": {
        break;
      }
      default: {
        console.warn("Skipping", JSON.stringify(idl, null, 2));
      }
    }
  }
}

function applyRules(output, rules) {
  for (const [key, value] of Object.entries(output)) {
    if (!(key in rules)) {
      continue;
    }
    value.valid = { props: Util.getValidProps(value.props, rules[key]) };
  }
}
