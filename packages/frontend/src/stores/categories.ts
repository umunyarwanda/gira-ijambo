import { defineStore } from "pinia";
import { AuthActionTypes, CategoriesActionTypes } from "./actions/action-types.enum";
import axios from "axios";
import { BASE_API_URL, CategoryApiUrl } from "@shared/variables/urls";
import { useAuthStore } from "./auth";
import { ICreateCategoryReqDto, IUpdateCategoryReqDto } from "@shared/interfaces/categories/request/ICategoryReq.dto";

const authStore = useAuthStore();

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: []
  }),
  actions: {
    [CategoriesActionTypes.GET_CATEGORIES]() {
      return axios({
        method: 'GET',
        url: BASE_API_URL + CategoryApiUrl.CONTROLLER + CategoryApiUrl.GET_CATEGORIES,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },
    [CategoriesActionTypes.GET_CATEGORIES_WITH_COMPLAIN_COUNT]() {
      return axios({
        method: 'GET',
        url: BASE_API_URL + CategoryApiUrl.CONTROLLER + CategoryApiUrl.GET_CATEGORIES_WITH_COMPLAIN_COUNT,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },    
    [CategoriesActionTypes.CREATE_CATEGORY](payload: ICreateCategoryReqDto) {
      return axios({
        method: 'POST',
        url: BASE_API_URL + CategoryApiUrl.CONTROLLER + CategoryApiUrl.CREATE_CATEGORY,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        },
        data: payload
      })
    },
    [CategoriesActionTypes.UPDATE_CATEGORY](id: number, payload: IUpdateCategoryReqDto) {
      return axios({
        method: 'PATCH',
        url: BASE_API_URL + CategoryApiUrl.CONTROLLER + CategoryApiUrl.UPDATE_CATEGORY + `/${id}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        },
        data: payload
      })
    },
    [CategoriesActionTypes.DELETE_CATEGORY](id: number) {
      return axios({
        method: 'DELETE',
        url: BASE_API_URL + CategoryApiUrl.CONTROLLER + CategoryApiUrl.DELETE_CATEGORY + `/${id}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },
    [CategoriesActionTypes.GET_CATEGORY](id: number) {
      return axios({
        method: 'GET',
        url: BASE_API_URL + CategoryApiUrl.CONTROLLER + CategoryApiUrl.GET_CATEGORY + `/${id}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    }
  }
})
