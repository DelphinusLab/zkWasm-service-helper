"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provePaymentSrcMetadataVals = exports.provePaymentSrcMetadataKey = exports.InputContextType = void 0;
var InputContextType;
(function (InputContextType) {
    InputContextType["Custom"] = "Custom";
    InputContextType["ImageInitial"] = "ImageInitial";
    InputContextType["ImageCurrent"] = "ImageCurrent";
})(InputContextType = exports.InputContextType || (exports.InputContextType = {}));
// metadata vals are bound by their key
exports.provePaymentSrcMetadataKey = "ProvePaymentSrc";
exports.provePaymentSrcMetadataVals = ["Default", "CreatorPay"];
