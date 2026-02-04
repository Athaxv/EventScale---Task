// Workaround for pnpm ERR_INVALID_THIS error
// This file helps pnpm handle registry requests correctly

function readPackage(pkg, context) {
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};

