export function getIDLTypes(idl, types = []) {
  if (Array.isArray(idl.idlType)) {
    for (const subtype of idl.idlType) {
      getIDLTypes(subtype, types);
    }
  } else {
    types.push(idl.idlType);
  }
  return types;
}

export function getValidProps(props, rule) {
  return Object.fromEntries(
    Object.entries(rule).map(([selector, allowlist]) => [
      selector,
      Object.fromEntries(
        Object.entries(props).filter(([prop]) => allowlist.has(prop.toLowerCase()))
      ),
    ])
  );
}

export function getOrphanInterfaces(data) {
  const orphans = new Set();
  const keys = new Set(Object.keys(data));

  for (const value of Object.values(data)) {
    if (value.inherits) {
      if (!keys.has(value.inherits)) {
        orphans.add(value.inherits);
      }
    }
    if (value.includes) {
      for (const include of value.includes) {
        if (!keys.has(include)) {
          orphans.add(include);
        }
      }
    }
  }

  return [...orphans];
}
