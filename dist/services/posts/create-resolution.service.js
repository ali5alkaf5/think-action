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
class CreateResolutionService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    handle(data, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.categoryName) {
                throw new Error('Enter a category name');
            }
            if (!data.dueDate || !Date.parse(data.dueDate)) {
                throw new Error('Enter a valid date');
            }
            if (!data.caption) {
                throw new Error('Enter a caption');
            }
            if (!['everyone', 'supporter', 'private'].includes(data.shareWith)) {
                throw new Error('Choose a visibilty');
            }
            const photos = data.photos;
            if (photos) {
                data.photo = yield image_service_1.ImageService.move(photos);
            }
            const totalPosts = yield this.postRepository.aggregate([
                {
                    $match: {
                        type: 'resolutions',
                    },
                },
                {
                    $match: {
                        userId: new mongodb_1.ObjectId(authUserId),
                    },
                },
            ]);
            const totalSameResolutions = this.postRepository.aggregate([
                {
                    $match: {}
                }
            ]);
            if (totalPosts.length >= 7) {
                throw new error_middleware_1.ResponseError(400, 'Resolutions cannot be more than 7');
            }
            const postEntity = new posts_entity_1.PostEntity({
                userId: new mongodb_1.ObjectId(authUserId),
                categoryResolutionId: new mongodb_1.ObjectId(),
                type: 'resolutions',
                caption: data.caption,
                photo: data.photo,
                like: [],
                likeCount: 0,
                commentCount: 0,
                dueDate: new Date(data.dueDate),
                updatedDate: data.updatedDate,
                shareWith: data.shareWith,
                isComplete: false,
                isUpdating: false,
                createdDate: new Date(),
            });
            let postData = postEntity.CheckData();
            let post = yield this.postRepository.create(postData);
            const dataPost = yield this.postRepository.readOne(post.insertedId.toString());
            const categoryResolution = {
                _id: dataPost.categoryResolutionId,
                name: data.categoryName,
                resolution: dataPost.caption,
                isComplete: dataPost.isComplete,
                createdDate: dataPost.createdDate,
            };
            const userRepository = new user_repository_1.UserRepository();
            yield userRepository.updateOne11(authUserId, categoryResolution);
            const userData = yield userRepository.readOne(authUserId);
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
                isComplete: dataPost.isComplete,
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
exports.default = CreateResolutionService;
