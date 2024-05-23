"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofSubmitMode = exports.ProvePaymentSrc = exports.AutoSubmitStatus = exports.FinalProofStatus = exports.Round2BatchProofStatus = exports.Round1BatchProofStatus = exports.InputContextType = void 0;
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
var ProvePaymentSrc;
(function (ProvePaymentSrc) {
    ProvePaymentSrc["Default"] = "Default";
    ProvePaymentSrc["CreatorPay"] = "CreatorPay";
})(ProvePaymentSrc = exports.ProvePaymentSrc || (exports.ProvePaymentSrc = {}));
var ProofSubmitMode;
(function (ProofSubmitMode) {
    ProofSubmitMode["Manual"] = "Manual";
    ProofSubmitMode["Auto"] = "Auto";
})(ProofSubmitMode = exports.ProofSubmitMode || (exports.ProofSubmitMode = {}));
