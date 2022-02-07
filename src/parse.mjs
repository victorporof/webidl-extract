import * as WebIDL2 from "webidl2";

export function parseRawIDLs(list) {
  return list.map(({ input, sources }) => ({
    input,
    idls: sources.map((source) => tryParse({ input, source })).flat(),
  }));
}

export function tryParse({ input, source }) {
  try {
    return WebIDL2.parse(source.text);
  } catch (e) {
    console.warn(`Parse error in ${input.name}: ${source.path}`);
  }
  return [];
}
