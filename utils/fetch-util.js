import axios from "axios";

// new axios methods, all methods should be migrated to axios
export const getDetails = async (url, accessToken) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: {
                'content-type': 'application/json',
                Authorization: "Bearer " + accessToken,
            },
        }).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
}

export const createDetails = async (url, accessToken, detail) => {
    return new Promise((resolve, reject) => {
        axios.post(url, detail, {
            headers: {
                'content-type': 'application/json',
                Authorization: "Bearer " + accessToken,
            },
        }).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export const updateDetails = async (url, accessToken, detail) => {
    return new Promise((resolve, reject) => {
        axios.put(url, detail, {
            headers: {
                'content-type': 'application/json',
                Authorization: "Bearer " + accessToken,
            },
        }).then((respone) => {
            resolve(respone.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export const deleteDetails = async (url, accessToken, detail) => {
    return new Promise((resolve, reject) => {
        axios.delete(url, {
            headers: {
                'content-type': 'application/json',
                Authorization: "Bearer " + accessToken,
            },
            data: detail
        }).then((respone) => {
            resolve(respone.data);
        }).catch((error) => {
            reject(error);
        });
    });
}