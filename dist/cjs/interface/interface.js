"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMetadataValsProofSubmitMode = exports.TaskMetadataKeys = exports.ImageMetadataValsProvePaymentSrc = exports.ImageMetadataKeys = exports.AutoSubmitStatus = exports.InputContextType = void 0;
var InputContextType;
(function (InputContextType) {
    InputContextType["Custom"] = "Custom";
    InputContextType["ImageInitial"] = "ImageInitial";
    InputContextType["ImageCurrent"] = "ImageCurrent";
})(InputContextType = exports.InputContextType || (exports.InputContextType = {}));
var AutoSubmitStatus;
(function (AutoSubmitStatus) {
    AutoSubmitStatus["Queued"] = "Queued";
    AutoSubmitStatus["InProgress"] = "InProgress";
    AutoSubmitStatus["Done"] = "Done";
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
})(TaskMetadataKeys = exports.TaskMetadataKeys || (exports.TaskMetadataKeys = {}));
var TaskMetadataValsProofSubmitMode;
(function (TaskMetadataValsProofSubmitMode) {
    TaskMetadataValsProofSubmitMode["Manual"] = "Manual";
    TaskMetadataValsProofSubmitMode["Auto"] = "Auto";
})(TaskMetadataValsProofSubmitMode = exports.TaskMetadataValsProofSubmitMode || (exports.TaskMetadataValsProofSubmitMode = {}));
