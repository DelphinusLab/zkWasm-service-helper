export interface DeploymentInfo {
    chain_id: number,
    address: string,
}

export interface Image {
    user_address: string,
    md5: string,
    deployment: Array<DeploymentInfo>
}