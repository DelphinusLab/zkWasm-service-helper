# zkWasm-service-helper

## Introduction

This lib is to help communicate with zkwasm service

## How to use it

This lib main provide a ZkWasmServiceHelper class to help user to communicate to zkwasm service backend.
It mainly provide API to add tasks and get informations to zkwasm service backend.

like:

- async queryImage(md5: string);
- async loadTasks(query: QueryParams);
- async addNewWasmImage(task: WithSignature<AddImageParams>);
- async addProvingTask(task: WithSignature<ProvingParams>);

## Examples

There are several examples of how to use this lib in the `examples` folder.

## How to run the examples

### 0. Change to the examples directory as the current working directory

```bash
cd examples
```

### 1. Install dependencies

```bash
npm install
```

### 2. Use your own values for the following:

- Update your data in the `config.ts` file with your private key and address of the zkwasm playground service.
- Update the `config.ts` with web3 information you want to use such as chain id and provider url etc.

- Within each script you want to run, you will also need to update values for querying and submitting tasks such as task ids.

### 3. Run the example you want to run.

Currently only the scripts under `src/tasks` and `src/verify` are runnable. The `queries` are merely examples that are used in these executable scripts.

```bash
npx tsx src/tasks/addNewImage.ts
```
