import { ZkWasmServiceEndpoint } from "./endpoint.js"

export class ZkWasmServiceImageHelper {
    endpoint: ZkWasmServiceEndpoint;
    constructor(endpoint: string, username: string, useraddress: string) {
        this.endpoint = new ZkWasmServiceEndpoint(endpoint, username, useraddress);
    }

    async queryImage(md5: string) {
        let req = JSON.parse("{}");
        req["md5"] = md5;

        const images = await this.endpoint.invokeRequest(
            "GET",
            "/image",
            req
        );
        console.log("get queryImage response.");
        return images[0]!;
    }

    async queryImages(md5: string) {
        let req = JSON.parse("{}");
        req["md5"] = md5;

        const images = await this.endpoint.invokeRequest(
            "GET",
            "/image",
            req
        );
        console.log("get queryImage response.");
        return images;
    }

}