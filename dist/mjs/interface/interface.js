export var ProverLevel;
(function (ProverLevel) {
    ProverLevel["Inactive"] = "Inactive";
    ProverLevel["Intern"] = "Intern";
    ProverLevel["Active"] = "Active";
    ProverLevel["Certified"] = "Certified";
})(ProverLevel || (ProverLevel = {}));
export var InputContextType;
(function (InputContextType) {
    InputContextType["Custom"] = "Custom";
    InputContextType["ImageInitial"] = "ImageInitial";
    InputContextType["ImageCurrent"] = "ImageCurrent";
})(InputContextType || (InputContextType = {}));
export var CompressionType;
(function (CompressionType) {
    CompressionType["None"] = "None";
    CompressionType["GZip"] = "GZip";
})(CompressionType || (CompressionType = {}));
export var AutoSubmitProofStatus;
(function (AutoSubmitProofStatus) {
    AutoSubmitProofStatus["Pending"] = "Pending";
    AutoSubmitProofStatus["Batched"] = "Batched";
    AutoSubmitProofStatus["Failed"] = "Failed";
})(AutoSubmitProofStatus || (AutoSubmitProofStatus = {}));
export var Round1Status;
(function (Round1Status) {
    Round1Status["Pending"] = "Pending";
    Round1Status["Batched"] = "Batched";
    Round1Status["Failed"] = "Failed";
})(Round1Status || (Round1Status = {}));
export var Round2Status;
(function (Round2Status) {
    Round2Status["ProofNotRegistered"] = "ProofNotRegistered";
    Round2Status["ProofRegistered"] = "ProofRegistered";
})(Round2Status || (Round2Status = {}));
export var AutoSubmitStatus;
(function (AutoSubmitStatus) {
    AutoSubmitStatus["Round1"] = "Round1";
    AutoSubmitStatus["Round2"] = "Round2";
    AutoSubmitStatus["Batched"] = "Batched";
    AutoSubmitStatus["RegisteredProof"] = "RegisteredProof";
    AutoSubmitStatus["Failed"] = "Failed";
})(AutoSubmitStatus || (AutoSubmitStatus = {}));
export var ProvePaymentSrc;
(function (ProvePaymentSrc) {
    ProvePaymentSrc["Default"] = "Default";
    ProvePaymentSrc["CreatorPay"] = "CreatorPay";
})(ProvePaymentSrc || (ProvePaymentSrc = {}));
export var AddProveTaskRestrictions;
(function (AddProveTaskRestrictions) {
    AddProveTaskRestrictions["Anyone"] = "Anyone";
    AddProveTaskRestrictions["CreatorOnly"] = "CreatorOnly";
})(AddProveTaskRestrictions || (AddProveTaskRestrictions = {}));
export var ProofSubmitMode;
(function (ProofSubmitMode) {
    ProofSubmitMode["Manual"] = "Manual";
    ProofSubmitMode["Auto"] = "Auto";
})(ProofSubmitMode || (ProofSubmitMode = {}));
export var MaintenanceModeType;
(function (MaintenanceModeType) {
    MaintenanceModeType["Disabled"] = "Disabled";
    MaintenanceModeType["Enabled"] = "Enabled";
})(MaintenanceModeType || (MaintenanceModeType = {}));
export var AdminRequestType;
(function (AdminRequestType) {
    AdminRequestType["Default"] = "Default";
    AdminRequestType["MaintenanceMode"] = "MaintenanceMode";
    AdminRequestType["ArchiveOperation"] = "ArchiveOperation";
    AdminRequestType["ForceTaskToReprocess"] = "ForceTaskToReprocess";
})(AdminRequestType || (AdminRequestType = {}));
