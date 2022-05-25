import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/comments';

class CommentService {

    addNewComment(newComment) {
        return axios.post(API_URL + "/comment", {
            projectId: newComment.projectId,
            commentText: newComment.commentText,
            username: newComment.username
        }, {headers: authHeader()});
    }

    deleteComment(commentId) {
        return axios.delete(API_URL + "/comment", {headers: authHeader(), params: {commentId: commentId}});
    }


}

export default new CommentService();
