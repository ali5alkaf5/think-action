"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_middleware_1 = require("../../middleware/error.middleware");
class AcceptSupportRequestService {
    constructor(userRepository, notificationRepository) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }
    handle(id, authUserId, notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToAccept = yield this.userRepository.readOne(id);
            if (!userToAccept) {
                throw new error_middleware_1.ResponseError(400, 'User not found or not requested');
            }
            yield this.userRepository.updateOne6(id, authUserId);
            yield this.userRepository.updateOne2(id, authUserId);
            yield this.notificationRepository.update(notificationId, {
                type: 'message',
                message: `${userToAccept.username} has supported you`,
                date: new Date(),
            });
            const updatedUser = yield this.userRepository.findOne4(id);
            return updatedUser;
        });
    }
}
exports.default = AcceptSupportRequestService;
