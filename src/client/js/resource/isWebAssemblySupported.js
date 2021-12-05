// isWebAssemblySupported.js
// https://stackoverflow.com/a/47880734/2605764

const isWebAssemblySupported = (() => {
  try {
    if (
      typeof WebAssembly === 'object' &&
      typeof WebAssembly.instantiate === 'function'
    ) {
      const module = new WebAssembly.Module(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      );
      if (module instanceof WebAssembly.Module)
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return false;
})();

export default isWebAssemblySupported;
