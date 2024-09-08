import { Router } from 'express';
import { verifyUser } from '../../middleware/auth.middleware';
import { CommentRepository } from '../../repositories/comment.repository';
import { PostRepository } from '../../repositories/post.repository';
import CommentController from '../../controllers/comment.controller';
import CreateCommentService from '../../services/comments/create.service';
import CreateReplyCommentService from '../../services/comments/create-reply.service';
import UpdateCommentService from '../../services/comments/update.service';
import DeleteCommentService from '../../services/comments/delete.service';
import GetAllCommentService from '../../services/comments/get-all.service';
import GetOneCommentService from '../../services/comments/get-all-reply.service';
import { UserRepository } from '../../repositories/user.repository';
import { NotificationRepository } from '../../repositories/notification.repository';

const router = Router();
const commentRepository = new CommentRepository();
const postRepository = new PostRepository();
const notificationRepository = new NotificationRepository();
const userRepository = new UserRepository();
const getAllComment = new GetAllCommentService(commentRepository);
const getOneComment = new GetOneCommentService(commentRepository);
const createComment = new CreateCommentService(commentRepository, postRepository, notificationRepository, userRepository);
const createReplyComment = new CreateReplyCommentService(commentRepository, postRepository, notificationRepository, userRepository);
const updateComment = new UpdateCommentService(commentRepository);
const deleteComment = new DeleteCommentService(commentRepository, postRepository);
const commentController = new CommentController(getAllComment, getOneComment, createComment, createReplyComment, updateComment, deleteComment);

router.get('/:postId', verifyUser, (req, res, next) => commentController.getAllComment(req, res, next));

router.get('/:id/reply', verifyUser, (req, res, next) => commentController.getAllReply(req, res, next));

router.post('/', verifyUser, (req, res, next) => commentController.createComment(req, res, next));

router.post('/reply', verifyUser, (req, res, next) => commentController.createReplyComment(req, res, next));

router.patch('/:id', verifyUser, (req, res, next) => commentController.updateComment(req, res, next));

router.delete('/:id', verifyUser, (req, res, next) => commentController.deleteComment(req, res, next));

export default router;
