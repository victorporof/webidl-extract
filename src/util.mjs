export function merge(a, b) {
  if (a instanceof Array && b instanceof Array) {
    mergeArrays(a, b);
  } else if (isNonNullObject(a) && isNonNullObject(b)) {
    mergeObjects(a, b);
  } else {
    throw Error;
  }
}

export function isNonNullObject(value) {
  return typeof value == "object" && value !== null;
}

export function mergeArrays(a, b) {
  for (const value of b) {
    if (!a.includes(value)) {
      a.push(value);
    }
  }
}

export function mergeObjects(a, b) {
  for (const key of Object.keys(b)) {
    if (isNonNullObject(a[key]) && isNonNullObject(b[key])) {
      merge(a[key], b[key]);
    } else {
      a[key] = b[key];
    }
  }
}

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
