import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/status';

class StatusService {

    getAllStatuses() {
        return axios.get(API_URL, {headers: authHeader()});
    }

    setNewProjectStatus(newStatus, projectId) {
        return axios.put(API_URL, {newStatus: newStatus, projectId: projectId},{headers: authHeader()});
    }
}

export default new StatusService();
