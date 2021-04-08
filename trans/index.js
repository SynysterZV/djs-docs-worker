"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = __importDefault(require("./handler"));
addEventListener('fetch', event => {
    event.respondWith(handler_1.default(event.request));
});
//# sourceMappingURL=index.js.map