"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataVals = exports.metadataKeys = exports.InputContextType = void 0;
var InputContextType;
(function (InputContextType) {
    InputContextType["Custom"] = "Custom";
    InputContextType["ImageInitial"] = "ImageInitial";
    InputContextType["ImageCurrent"] = "ImageCurrent";
})(InputContextType = exports.InputContextType || (exports.InputContextType = {}));
// metadata vals are bound by their key
exports.metadataKeys = {
    provePaymentSrc: "ProvePaymentSrc",
};
exports.metadataVals = {
    provePaymentSrc: ["Default", "CreatorPay"],
};
