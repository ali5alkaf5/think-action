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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pagination_1 = require("../utils/pagination");
dotenv_1.default.config();
class PostController {
    constructor(getAllPostService, getOnePostService, getAllLikePostService, createResolutionService, createWeeklyGoalsService, createCompleteGoalsService, updateResolutionsService, updateWeeklyGoalsService, updateCompleteGoalsService, likePostService, unlikePostService, getMonthlyReportService, getYearReportService, deletePostService) {
        this.createResolutionService = createResolutionService;
        this.createWeeklyGoalsService = createWeeklyGoalsService;
        this.createCompleteGoalsService = createCompleteGoalsService;
        this.updateResolutionsService = updateResolutionsService;
        this.updateWeeklyGoalsService = updateWeeklyGoalsService;
        this.updateCompleteGoalsService = updateCompleteGoalsService;
        this.likePostService = likePostService;
        this.unlikePostService = unlikePostService;
        this.deletePostService = deletePostService;
        this.getAllPostService = getAllPostService;
        this.getOnePostService = getOnePostService;
        this.getAllLikePostService = getAllLikePostService;
        this.getMonthlyReportService = getMonthlyReportService;
        this.getYearReportService = getYearReportService;
    }
    getAllPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.getAllPostService.handle(authUserId, pagination_1.Pagination.paginate(req.query));
                result.data = result.data.map((post) => {
                    var _a;
                    return (Object.assign(Object.assign({}, post), { categoryResolution: (_a = post.userInfo.categoryResolution.find((cr) => cr._id === post.categoryResolutionId)) === null || _a === void 0 ? void 0 : _a.name }));
                });
                // result.data = await Promise.all(result.data.map(async (post: PostInterface) => ({
                //   ...post,
                //   photo: await Promise.all((post?.photo || []).map(async (img: string) => (await this.getImageService.handle(img)))),
                //   categoryResolution: (post as Record<string, any>).userInfo.categoryResolution.find((cr: any) => cr._id === post.categoryResolutionId)?.name,
                //   userInfo: {
                //     ...(post as Record<string, any>).userInfo,
                //     photo: (post as Record<string, any>).userInfo.photo ? await this.getImageService.handle((post as Record<string, any>).userInfo.photo) : ''
                //   }
                // })))
                return res.status(200).json({ status: 'success', data: result.data });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getOnePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const authUserId = req.userData._id;
                const result = yield this.getOnePostService.handle(authUserId, id);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getAllLikePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const authUserId = req.userData._id;
                const result = yield this.getAllLikePostService.handle(id, authUserId);
                return res.status(200).json({ status: 'success', limit: 10, page: 1, likeCount: result.length, data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    createResolution(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const data = req.body;
                data.photos = req.files;
                const result = yield this.createResolutionService.handle(data, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    createWeeklyGoals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const data = req.body;
                data.photos = req.files;
                const result = yield this.createWeeklyGoalsService.handle(data, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    createCompleteGoals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const data = req.body;
                data.photos = req.files;
                const result = yield this.createCompleteGoalsService.handle(data, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateResolutions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const { id } = req.params;
                const data = req.body;
                data.photos = req.files;
                const result = yield this.updateResolutionsService.handle(data, authUserId, id);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateWeeklyGoals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const { id } = req.params;
                const data = req.body;
                data.photos = req.files;
                const result = yield this.updateWeeklyGoalsService.handle(data, authUserId, id);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateCompleteGoals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const { id } = req.params;
                const result = yield this.updateCompleteGoalsService.handle(req.body, authUserId, id);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    likePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.likePostService.handle(req.body, authUserId);
                return res.status(200).json({ status: 'success', message: 'Post liked successfully.', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    unlikePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.unlikePostService.handle(req.body, authUserId);
                return res.status(200).json({ status: 'success', message: 'Post unliked successfully.', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getMonthlyReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.getMonthlyReportService.handle(req.query, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getYearReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.getYearReportService.handle(req.query, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.deletePostService.handle(id);
                return res.status(200).json({});
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.default = PostController;
