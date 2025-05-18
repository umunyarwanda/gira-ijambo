import { defineStore } from "pinia";
import { AuthActionTypes, UsersActionTypes } from "./actions/action-types.enum";
import axios from "axios";
import { BASE_API_URL, UserApiUrl } from "@shared/variables/urls";
import { useAuthStore } from "./auth";
import { ICreateUserReqDto, IUpdateUserReqDto } from "@shared/interfaces/users/request/IUserReqDto";

const authStore = useAuthStore();

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    [UsersActionTypes.GET_USERS]() {
      return axios({
        method: 'GET',
        url: BASE_API_URL + UserApiUrl.CONTROLLER + UserApiUrl.GET_USERS,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },
    [UsersActionTypes.CREATE_USER](payload: ICreateUserReqDto) {
      return axios({
        method: 'POST',
        url: BASE_API_URL + UserApiUrl.CONTROLLER + UserApiUrl.CREATE_USER,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        },
        data: payload
      })
    },
    [UsersActionTypes.UPDATE_USER](id: number, payload: IUpdateUserReqDto) {
      return axios({
        method: 'PATCH',
        url: BASE_API_URL + UserApiUrl.CONTROLLER + UserApiUrl.UPDATE_USER + `/${id}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        },
        data: payload
      })
    },
    [UsersActionTypes.DELETE_USER](id: number) {
      return axios({
        method: 'DELETE',
        url: BASE_API_URL + UserApiUrl.CONTROLLER + UserApiUrl.DELETE_USER + `/${id}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },
    [UsersActionTypes.GET_ANALYTICS]() {
      return axios({
        method: 'GET',
        url: BASE_API_URL + UserApiUrl.CONTROLLER + UserApiUrl.GET_ANALYTICS,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    }
  }
})