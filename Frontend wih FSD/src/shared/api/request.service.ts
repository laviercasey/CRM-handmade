import api from './index';

interface RequestData {
  [key: string]: any;
}

class RequestService {
  async submitFormRequest(username: string, requestData: RequestData) {
    const response = await api.post(`/requests/forms/${username}`, requestData);
    return response.data;
  }
  
  async getRequests() {
    const response = await api.get('/requests');
    return response.data;
  }
}

export default new RequestService();