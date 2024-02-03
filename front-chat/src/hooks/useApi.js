import axios from "axios";
import Cookies from "js-cookie";

const Axios = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: { 'Access-Control-Allow-Origin': '*' },

})
 
export function useSignUp(userCredentials) {
    return Axios.post('/auth/register', userCredentials) 
}
export function useSignIn(userCredentials) {
    return Axios.post('/auth/login', userCredentials)      
}
export function useGetUsers() {
    return Axios.get('/users')
}
export function useGetUser(userId) {
    return Axios.get(`/users/${userId}`)
}

export function useUpdateProfile(userCredentials) {
    return Axios.patch('/users/me', userCredentials)      
}
export function useGetChat(userIds) {
    return Axios.post('/chats', userIds)
}
export function useCreateChat(userIds) {
    return Axios.put('/chats', userIds)
}
export function useCreateMessages(content,chatId) {
    return Axios.put('/messages', content,chatId)
}
export function useDeleteMessage(messageId) {
    return Axios.delete(`/messages/${messageId}`)
}
export function useUpdateMessage(messageId, content) {
    return Axios.patch(`/messages/${messageId}`, content)
}


let isLogged = () => {
    let token =  Cookies.get("authToken");
    return !!token;
}
 
Axios.interceptors.request.use(request => {
    if (isLogged()) {
        request.headers.Authorization = 'Bearer ' + Cookies.get("authToken");
      }
    return request;
});

Axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401 && window.location.pathname !== "/se-connecter") {
        window.location.reload();
    } else {
        return Promise.reject(error);
    }
});