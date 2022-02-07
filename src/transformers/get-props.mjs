import { GLOBAL_ATTRIBUTES, VALID_PROPS_RULES } from "../config.mjs";
import * as Util from "../util.mjs";

// Attributes for interfaces, fields for dictionaries.
const ACCEPTED_PROP_TYPES = new Set(["attribute", "field"]);

export function getIDLProps(parsed, output = {}) {
  for (const { input, idls } of parsed) {
    transformIDLs({ input, idls }, output);
  }
  applyRules(output, VALID_PROPS_RULES);
  return output;
}

function transformIDLs({ input, idls }, output) {
  const makeIDLInfo = () => ({
    inherits: null,
    includes: [],
    props: {},
  });

  for (const idl of idls) {
    switch (idl.type) {
      case "includes": {
        output[idl.target] ??= makeIDLInfo();
        Util.merge(output[idl.target], {
          includes: [idl.includes],
        });
        break;
      }
      case "interface":
      case "interface mixin":
      case "dictionary": {
        output[idl.name] ??= makeIDLInfo();
        Util.merge(output[idl.name], {
          inherits: idl.inheritance,
          props: Object.fromEntries(
            idl.members
              ?.filter((e) => ACCEPTED_PROP_TYPES.has(e.type))
              .map((e) => [
                e.name,
                {
                  global: GLOBAL_ATTRIBUTES.has(e.name),
                  from: [input.name],
                  type: Util.getIDLTypes(e.idlType),
                },
              ])
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
