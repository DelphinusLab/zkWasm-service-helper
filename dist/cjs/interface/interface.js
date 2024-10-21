"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRequestType = exports.MaintenanceModeType = exports.ProofSubmitMode = exports.ProvePaymentSrc = exports.AutoSubmitStatus = exports.Round2Status = exports.Round1Status = exports.AutoSubmitProofStatus = exports.InputContextType = exports.ProverLevel = void 0;
var ProverLevel;
(function (ProverLevel) {
    ProverLevel["Inactive"] = "Inactive";
    ProverLevel["Intern"] = "Intern";
    ProverLevel["Active"] = "Active";
    ProverLevel["Certified"] = "Certified";
})(ProverLevel = exports.ProverLevel || (exports.ProverLevel = {}));
var InputContextType;
(function (InputContextType) {
    InputContextType["Custom"] = "Custom";
    InputContextType["ImageInitial"] = "ImageInitial";
    InputContextType["ImageCurrent"] = "ImageCurrent";
})(InputContextType = exports.InputContextType || (exports.InputContextType = {}));
var AutoSubmitProofStatus;
(function (AutoSubmitProofStatus) {
    AutoSubmitProofStatus["Pending"] = "Pending";
    AutoSubmitProofStatus["Batched"] = "Batched";
    AutoSubmitProofStatus["Failed"] = "Failed";
})(AutoSubmitProofStatus = exports.AutoSubmitProofStatus || (exports.AutoSubmitProofStatus = {}));
var Round1Status;
(function (Round1Status) {
    Round1Status["Pending"] = "Pending";
    Round1Status["Batched"] = "Batched";
    Round1Status["Failed"] = "Failed";
})(Round1Status = exports.Round1Status || (exports.Round1Status = {}));
var Round2Status;
(function (Round2Status) {
    Round2Status["ProofNotRegistered"] = "ProofNotRegistered";
    Round2Status["ProofRegistered"] = "ProofRegistered";
})(Round2Status = exports.Round2Status || (exports.Round2Status = {}));
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
var MaintenanceModeType;
(function (MaintenanceModeType) {
    MaintenanceModeType["Disabled"] = "Disabled";
    MaintenanceModeType["Enabled"] = "Enabled";
})(MaintenanceModeType = exports.MaintenanceModeType || (exports.MaintenanceModeType = {}));
var AdminRequestType;
(function (AdminRequestType) {
    AdminRequestType["Default"] = "Default";
    AdminRequestType["MaintenanceMode"] = "MaintenanceMode";
})(AdminRequestType = exports.AdminRequestType || (exports.AdminRequestType = {}));
