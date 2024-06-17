#!/bin/bash
#
#   Add package.json files to cjs/mjs subtrees
#

cat >dist/cjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

cat >dist/mjs/package.json <<!EOF
{
    "type": "module"
}
!EOF

find src -name '*.d.ts' -exec cp {} dist/mjs \;
find src -name '*.d.ts' -exec cp {} dist/cjs \;

# Copy JSON ABI files to dist/cjs/abi and dist/mjs/abi
mkdir -p dist/cjs/abi
mkdir -p dist/mjs/abi
find src/abi -name '*.json' -exec cp {} dist/cjs/abi \;
find src/abi -name '*.json' -exec cp {} dist/mjs/abi \;
