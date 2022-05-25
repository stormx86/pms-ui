import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/user';

class UserService {

    getUserProfile(userId) {
        return axios.get(API_URL + "/profile/" + userId, {headers: authHeader()});
    }

    changePassword(user) {
        return axios.put(API_URL + "/change/password",
            {
                userId: user.userId,
                password: user.password,
                repeatPassword: user.repeatPassword
            },
            {headers: authHeader()});
    }
}

export default new UserService();
