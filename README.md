# zkWasm-service-helper
## Introduction
This lib is to help communicate with zkwasm service

## How to use it
This lib main provide a ZkWasmServiceHelper class to help user to communicate to zkwasm service backend.
It mainly provide API to add tasks and get informations to zkwasm service backend.

like:
* async queryImage(md5: string);
* async loadTasks(query: QueryParams);
* async addNewWasmImage(task: WithSignature<AddImageParams>);
* async addProvingTask(task: WithSignature<ProvingParams>);
* async addDeployTask(task: WithSignature<DeployParams>);

### A example to add new wasm image
This example typescript code will add the wasm image to the zkwasm service.
(Note the signMessage() function need to be implemented by yourself to sign the input string.)
```
import {
  AddImageParams,
  WithSignature,
  ZkWasmUtil,
  zkWasmServiceHelper
} from "zkwasm-service-helper";

const endpoint = "http://127.0.0.1:8080";
let helper = new ZkWasmServiceHelper(endpoint, "", "");
let imagePath = "/home/user/a.wasm";
let fileSelected: Buffer = fs.readFileSync(imagePath);
let md5 = ZkWasmUtil.convertToMd5(
        fileSelected as Uint8Array
      );
  
let info: AddImageParams = {
        name: fileSelected.name,
        image_md5: md5,
        image: fileSelected,
        user_address: account!.address.toLowerCase(),
        description_url: description_url,
        avator_url: iconURL,
        circuit_size: circuitSize,
      };

let msg = ZkWasmUtil.createAddImageSignMessage(info);
let signature: string = await signMessage(msg); //Need user private key to sign the msg
let task: WithSignature<AddImageParams> = {
        ...info,
        signature,
      };
      
let response = await helper.addNewWasmImage(task);

```
