"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMetadataValsProofSubmitMode = exports.TaskMetadataKeys = exports.ImageMetadataValsProvePaymentSrc = exports.ImageMetadataKeys = exports.AutoSubmitStatus = exports.FinalProofStatus = exports.Round2BatchProofStatus = exports.Round1BatchProofStatus = exports.InputContextType = void 0;
var InputContextType;
(function (InputContextType) {
    InputContextType["Custom"] = "Custom";
    InputContextType["ImageInitial"] = "ImageInitial";
    InputContextType["ImageCurrent"] = "ImageCurrent";
})(InputContextType = exports.InputContextType || (exports.InputContextType = {}));
var Round1BatchProofStatus;
(function (Round1BatchProofStatus) {
    Round1BatchProofStatus["Pending"] = "Pending";
    Round1BatchProofStatus["Batched"] = "Batched";
    Round1BatchProofStatus["Failed"] = "Failed";
})(Round1BatchProofStatus = exports.Round1BatchProofStatus || (exports.Round1BatchProofStatus = {}));
var Round2BatchProofStatus;
(function (Round2BatchProofStatus) {
    Round2BatchProofStatus["Pending"] = "Pending";
    Round2BatchProofStatus["Batched"] = "Batched";
    Round2BatchProofStatus["Failed"] = "Failed";
})(Round2BatchProofStatus = exports.Round2BatchProofStatus || (exports.Round2BatchProofStatus = {}));
var FinalProofStatus;
(function (FinalProofStatus) {
    FinalProofStatus["ProofNotRegistered"] = "ProofNotRegistered";
    FinalProofStatus["ProofRegistered"] = "ProofRegistered";
})(FinalProofStatus = exports.FinalProofStatus || (exports.FinalProofStatus = {}));
var AutoSubmitStatus;
(function (AutoSubmitStatus) {
    AutoSubmitStatus["Round1"] = "Round1";
    AutoSubmitStatus["Round2"] = "Round2";
    AutoSubmitStatus["Batched"] = "Batched";
    AutoSubmitStatus["RegisteredProof"] = "RegisteredProof";
    AutoSubmitStatus["Failed"] = "Failed";
})(AutoSubmitStatus = exports.AutoSubmitStatus || (exports.AutoSubmitStatus = {}));
var ImageMetadataKeys;
(function (ImageMetadataKeys) {
    ImageMetadataKeys["ProvePaymentSrc"] = "ProvePaymentSrc";
})(ImageMetadataKeys = exports.ImageMetadataKeys || (exports.ImageMetadataKeys = {}));
var ImageMetadataValsProvePaymentSrc;
(function (ImageMetadataValsProvePaymentSrc) {
    ImageMetadataValsProvePaymentSrc["Default"] = "Default";
    ImageMetadataValsProvePaymentSrc["CreatorPay"] = "CreatorPay";
})(ImageMetadataValsProvePaymentSrc = exports.ImageMetadataValsProvePaymentSrc || (exports.ImageMetadataValsProvePaymentSrc = {}));
var TaskMetadataKeys;
(function (TaskMetadataKeys) {
    TaskMetadataKeys["ProofSubmitMode"] = "ProofSubmitMode";
    TaskMetadataKeys["Round1BatchProofId"] = "Round1BatchProofTaskId";
    TaskMetadataKeys["Round2BatchProofId"] = "Round2BatchProofTaskId";
    TaskMetadataKeys["FinalBatchProofId"] = "FinalBatchProofId";
})(TaskMetadataKeys = exports.TaskMetadataKeys || (exports.TaskMetadataKeys = {}));
var TaskMetadataValsProofSubmitMode;
(function (TaskMetadataValsProofSubmitMode) {
    TaskMetadataValsProofSubmitMode["Manual"] = "Manual";
    TaskMetadataValsProofSubmitMode["Auto"] = "Auto";
})(TaskMetadataValsProofSubmitMode = exports.TaskMetadataValsProofSubmitMode || (exports.TaskMetadataValsProofSubmitMode = {}));
