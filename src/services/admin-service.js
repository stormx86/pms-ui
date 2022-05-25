import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/admin';

class AdminService {


    getAllUsers() {
        return axios.get(API_URL + "/users", { headers: authHeader() });
    }

    updateUserRoles(updatedUser) {
        return axios.put(API_URL + "/users/edit", {
            userId: updatedUser.userId,
            username: updatedUser.username,
            globalRoles: updatedUser.globalRoles,
        }, {headers: authHeader(), params: {userId: updatedUser.userId}});
    }

    addNewUser(newUser) {
        return axios.post(API_URL + "/users/add", {
            username: newUser.username,
            globalRoles: newUser.globalRoles
        }, {headers: authHeader()});
    }

    deleteUser(updatedUser) {
        return axios.delete(API_URL + "/users/delete", {headers: authHeader(), params: {userId: updatedUser.userId}});
    }

    resetUserPassword(updatedUser) {
        return axios.put(API_URL + "/users/reset", null,{headers: authHeader(), params: {userId: updatedUser.userId}});
    }

    addNewProjectRole(newProjectRole) {
        return axios.post(API_URL + "/roles/add", {
            roleName: newProjectRole.roleName,
        }, {headers: authHeader()});
    }

    deleteProjectRole(projectRoleId) {
        return axios.delete(API_URL + "/roles/delete", {headers: authHeader(), params: {projectRoleId: projectRoleId}});
    }
}

export default new AdminService();
