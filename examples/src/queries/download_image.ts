import {
    AddImageParams,
    WithSignature,
    ZkWasmUtil,
    ProvePaymentSrc,
    WithInitialContext,
  } from "zkwasm-service-helper";
  
  import path from "node:path";
  
  import fs from "node:fs";
  import { ServiceHelper, ServiceHelperConfig } from "../config";
  
  export async function download_image() {
    const md5 = "<your image md5>";
    const outfile = "image.wasm";

    let res: number[] = (await ServiceHelper.queryImageBinary(md5)) as number[];
    console.log("Image length: ", res.length);
    const fileContent = new Uint8Array(res!);
    console.log("Write image to: ", outfile);
    fs.writeFileSync(outfile, Buffer.from(fileContent));
  }
  
  download_image();
  