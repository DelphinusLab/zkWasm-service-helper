# zkWasm-service-helper

## Table of Contents

- [Introduction](#introduction)
- [Usage](#usage)
- [Testing](#testing)
- [Examples](#examples)
  - [How to run the examples](#how-to-run-the-examples)
    - [0. Change to the examples directory as the current working directory](#0-change-to-the-examples-directory-as-the-current-working-directory)
    - [1. Install dependencies](#1-install-dependencies)
    - [2. Update Config](#2-update-config)
    - [3. Run the examples](#3-run-the-examples)

## Introduction

This lib is to help communicate with zkwasm service

## Usage

This lib main provide a ZkWasmServiceHelper class to help user to communicate to zkwasm service backend.
It mainly provide API to add tasks and get informations to zkwasm service backend.

like:

- async queryImage(md5: string);
- async loadTasks(query: QueryParams);
- async addNewWasmImage(task: WithSignature<AddImageParams>);
- async addProvingTask(task: WithSignature<ProvingParams>);

## Testing

First, update the `tests/config.json` with your specific details.

Note: Server must be up and running with some valid data.

Test the utility functions:

```bash
npm run test zkwasm_util
```

Test the query APIs (GET requests):

```bash
npm run test queries
```

Test the task APIs (POST requests):

```bash
npm run test tasks
```

Test the archive server APIs.

```bash
npm run test archive
```

## Examples

There are several examples of how to use this lib in the `examples` folder.

### How to run the examples

#### 0. Change to the examples directory as the current working directory

```bash
cd examples
```

#### 1. Install dependencies

```bash
npm install
```

#### 2. Update Config

User specific config values must be provided in the [.env](.env) file:

- Change the values of `SERVER_URL` and `PRIVATE_KEY` to your own.
- Update the `CHAIN_ID` to a network chain id which have been deployed on the server, and update `PROVIDER_URL` to a valid RPC url.
- Update the following env variables as per your test:
  - `SUBMIT_AUTO_SUBMIT_PROOF`: Set to true for submitting an Auto proof, otherwise false for Manual proof.
  - `MANUAL_TASK_ID_TO_VERIFY`: Set to the task id of an existing task in which you want to verify the proof.
  - `AUTO_TASK_ID_TO_VERIFY`: Set to the task id of any tasks within the auto submit batch which you want to verify.
  - `TASK_ID_TO_QUERY`: Set to task id to query, by default this is used to fetch the external host table tar gz file.
  - `MD5_TO_QUERY`: Set image MD5 to query, by default this is used for various task fetches in query script.
- To customize further you may change various variables within each of the scripts.

#### 3. Run the examples

Running tasks examples:

```bash
# Add a new image using wasm in `data/image.wasm`.
npx tsx src/tasks/addNewImage.ts

# Add a new proof for image previously added. This can be Auto or Manual, see `SUBMIT_AUTO_SUBMIT_PROOF`.
npx tsx src/tasks/submitProofTask.ts
```

Running verify examples:

```bash
# Verify proof of task id `MANUAL_TASK_ID_TO_VERIFY`
npx tsx src/verify/verifyProof.ts

# Verify auto submit batch which includes task id `AUTO_TASK_ID_TO_VERIFY`
npx tsx src/verify/verifyAutoSubmitProof.ts
```

Running query examples:

```bash
# Run task related queries
npx tsx src/queries/task.ts

# Run auto submit task related queries
npx tsx src/queries/autosubmit.ts
```
