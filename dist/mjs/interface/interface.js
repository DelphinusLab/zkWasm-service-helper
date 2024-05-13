export var InputContextType;
(function (InputContextType) {
    InputContextType["Custom"] = "Custom";
    InputContextType["ImageInitial"] = "ImageInitial";
    InputContextType["ImageCurrent"] = "ImageCurrent";
})(InputContextType || (InputContextType = {}));
export var Round1BatchProofStatus;
(function (Round1BatchProofStatus) {
    Round1BatchProofStatus["Pending"] = "Pending";
    Round1BatchProofStatus["Batched"] = "Batched";
    Round1BatchProofStatus["Failed"] = "Failed";
})(Round1BatchProofStatus || (Round1BatchProofStatus = {}));
export var Round2BatchProofStatus;
(function (Round2BatchProofStatus) {
    Round2BatchProofStatus["Pending"] = "Pending";
    Round2BatchProofStatus["Batched"] = "Batched";
    Round2BatchProofStatus["Failed"] = "Failed";
})(Round2BatchProofStatus || (Round2BatchProofStatus = {}));
export var FinalProofStatus;
(function (FinalProofStatus) {
    FinalProofStatus["ProofNotRegistered"] = "ProofNotRegistered";
    FinalProofStatus["ProofRegistered"] = "ProofRegistered";
})(FinalProofStatus || (FinalProofStatus = {}));
export var AutoSubmitStatus;
(function (AutoSubmitStatus) {
    AutoSubmitStatus["Round1"] = "Round1";
    AutoSubmitStatus["Round2"] = "Round2";
    AutoSubmitStatus["Batched"] = "Batched";
    AutoSubmitStatus["RegisteredProof"] = "RegisteredProof";
    AutoSubmitStatus["Failed"] = "Failed";
})(AutoSubmitStatus || (AutoSubmitStatus = {}));
export var ImageMetadataKeys;
(function (ImageMetadataKeys) {
    ImageMetadataKeys["ProvePaymentSrc"] = "ProvePaymentSrc";
    ImageMetadataKeys["AutoSubmitNetworks"] = "AutoSubmitNetworks";
})(ImageMetadataKeys || (ImageMetadataKeys = {}));
export var ImageMetadataValsProvePaymentSrc;
(function (ImageMetadataValsProvePaymentSrc) {
    ImageMetadataValsProvePaymentSrc["Default"] = "Default";
    ImageMetadataValsProvePaymentSrc["CreatorPay"] = "CreatorPay";
})(ImageMetadataValsProvePaymentSrc || (ImageMetadataValsProvePaymentSrc = {}));
export var TaskMetadataKeys;
(function (TaskMetadataKeys) {
    TaskMetadataKeys["ProofSubmitMode"] = "ProofSubmitMode";
    TaskMetadataKeys["Round1BatchProofId"] = "Round1BatchProofId";
    TaskMetadataKeys["Round2BatchProofId"] = "Round2BatchProofId";
    TaskMetadataKeys["FinalBatchProofId"] = "FinalBatchProofId";
})(TaskMetadataKeys || (TaskMetadataKeys = {}));
export var TaskMetadataValsProofSubmitMode;
(function (TaskMetadataValsProofSubmitMode) {
    TaskMetadataValsProofSubmitMode["Manual"] = "Manual";
    TaskMetadataValsProofSubmitMode["Auto"] = "Auto";
})(TaskMetadataValsProofSubmitMode || (TaskMetadataValsProofSubmitMode = {}));
