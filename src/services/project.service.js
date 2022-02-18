import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/projects';

class ProjectService {

    getAllProjects() {
        return axios.get(API_URL, {headers: authHeader()});
    }

    getProject(projectId) {
        return axios.get(API_URL + "/project", {headers: authHeader(), params: {projectId: projectId}});
    }

    getAllProjectRoleNames() {
        return axios.get(API_URL + "/roles", {headers: authHeader()});
    }

    createProject(newProject) {
        return axios.post(API_URL + "/project", {
            title: newProject.title,
            description: newProject.description,
            creator: newProject.creator,
            projectManager: newProject.projectManager,
            userProjectRoleDto: newProject.userProjectRoleDto
        },{headers: authHeader()});
    }

    updateProject(projectId, updatedProject) {
        return axios.put(API_URL + "/project/edit", {
            projectId: updatedProject.projectId,
            title: updatedProject.title,
            description: updatedProject.description,
            creator: updatedProject.creator,
            projectManager: updatedProject.projectManager,
            status: updatedProject.status,
            userProjectRoleDto: updatedProject.userProjectRoleDto
        },{headers: authHeader(), params: {projectId: projectId}});
    }

    deleteProject(projectId) {
        return axios.delete(API_URL + "/project", {headers: authHeader(), params: {projectId: projectId}});
    }

}

export default new ProjectService();
