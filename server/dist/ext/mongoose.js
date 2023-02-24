"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
mongoose_1.Mongoose.prototype.toCustomJSON = function () {
    const obj = this.toJson();
    delete obj.email;
    delete obj.password;
    delete obj.updatedAt;
    return obj;
};
