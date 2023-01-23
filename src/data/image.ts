import { RestEndpoint } from "servicehelper";

export async function queryImage(endpoint: string, md5: string) {
    let req = JSON.parse("{}");
    req["md5"] = md5;

    const queryClient = new RestEndpoint(endpoint, "", "");
    const images = await queryClient.invokeRequest(
        "GET",
        "/image",
        req
    );
    console.log("get queryImage response.");
    return images[0]!;
}

export async function queryImages(endpoint: string, md5: string) {
    let req = JSON.parse("{}");
    req["md5"] = md5;

    const queryClient = new RestEndpoint(endpoint, "", "");
    const images = await queryClient.invokeRequest(
        "GET",
        "/image",
        req
    );
    console.log("get queryImage response.");
    return images;
}