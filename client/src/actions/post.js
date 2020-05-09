import axios from 'axios'
import { setAlert } from './alert'
import { PROFILE_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, GET_POSTS, POST_ERROR, ADD_COMMENT, REMOVE_COMMENT } from './types'

export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts')
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (error) {
        console.log(error.message)
        dispatch({
            type: PROFILE_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}


export const getPost = (id) => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`)
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (error) {
        console.log(error.message)
        dispatch({
            type: PROFILE_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

export const addLike = (id) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data}
        })
    } catch (error) {
        console.log(error.message)
        dispatch({
            type: PROFILE_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

export const removeLike = (id) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data}
        })
    } catch (error) {
        console.log(error.message)
        dispatch({
            type: PROFILE_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

export const deletePost = (id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/${id}`)
        dispatch({
            type: DELETE_POST,
            payload: id
        })

        dispatch(setAlert('Post deleted successfully', 'success'))
    } catch (error) {
        console.log(error.message)
        dispatch({
            type: PROFILE_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': "application/json"
        }
    }

    try {
        const res = await axios.post(`/api/posts`, formData, config)
        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert('Post Created', 'success'))
    } catch (error) {
        console.log(error.message)
        dispatch({
            type: PROFILE_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': "application/json"
        }
    }

    try {
        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config)
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })

        dispatch(setAlert('Comment Added', 'success'))
    } catch (error) {
        console.log(error.message)
        dispatch({
            type: PROFILE_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}


export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/${postId}/${commentId}`)
        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })

        dispatch(setAlert('Comment deleted successfully', 'success'))
    } catch (error) {
        console.log(error.message)
        dispatch({
            type: PROFILE_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}
