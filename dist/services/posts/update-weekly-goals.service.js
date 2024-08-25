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
const posts_entity_1 = require("../../entities/posts.entity");
const error_middleware_1 = require("../../middleware/error.middleware");
const user_repository_1 = require("../../repositories/user.repository");
const mongodb_1 = require("mongodb");
const image_service_1 = require("../images/image.service");
class UpdateWeeklyGoalsService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    handle(data, authUserId, id) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.readOne(id);
            if (!post) {
                throw new error_middleware_1.ResponseError(400, 'Post not found');
            }
            const photos = data.photos;
            if (photos) {
                data.photo = yield image_service_1.ImageService.replace(post.photo, photos);
            }
            const postEntity = new posts_entity_1.PostEntity({
                _id: post._id,
                userId: new mongodb_1.ObjectId(authUserId),
                categoryResolutionId: data.categoryResolutionId ? new mongodb_1.ObjectId(data.categoryResolutionId) : post.categoryResolutionId,
                type: post.type,
                caption: (_a = data.caption) !== null && _a !== void 0 ? _a : post.caption,
                photo: (_b = data.photo) !== null && _b !== void 0 ? _b : post.photo,
                like: [],
                likeCount: 0,
                commentCount: 0,
                dueDate: (_c = new Date(data.dueDate)) !== null && _c !== void 0 ? _c : post.dueDate,
                updatedDate: new Date(),
                shareWith: (_d = data.shareWith) !== null && _d !== void 0 ? _d : post.shareWith,
                isComplete: post.isComplete,
                isUpdating: true,
                createdDate: post.createdDate,
            });
            let postData = postEntity.CheckData();
            yield this.postRepository.update(id, postData);
            const dataPost = yield this.postRepository.readOne(id);
            if (!dataPost) {
                throw new error_middleware_1.ResponseError(404, 'Comment not found');
            }
            const userRepository = new user_repository_1.UserRepository();
            const userData = yield userRepository.readOne(authUserId);
            if (!userData) {
                throw new error_middleware_1.ResponseError(404, 'User not found');
            }
            return {
                _id: dataPost._id,
                userId: dataPost.userId,
                categoryResolutionId: dataPost.categoryResolutionId,
                type: dataPost.type,
                caption: dataPost.caption,
                photo: dataPost.photo,
                likeCount: dataPost.likeCount,
                commentCount: dataPost.commentCount,
                dueDate: dataPost.dueDate,
                createdDate: dataPost.createdDate,
                updatedDate: dataPost.updatedDate,
                shareWith: dataPost.shareWith,
                userInfo: {
                    _id: userData._id,
                    username: userData.username,
                    photo: userData.photo,
                    categoryResolution: userData.categoryResolution,
                },
            };
        });
    }
}
exports.default = UpdateWeeklyGoalsService;
