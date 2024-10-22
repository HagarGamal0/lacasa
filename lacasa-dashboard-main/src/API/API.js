import axios from "axios";

const API = {
    readAll: async(path) => {
        try {
            const token = localStorage.getItem("accessToken");
            const authAxios = axios.create({
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-localization": "en",
                },
            });
            console.log(`${process.env.REACT_APP_BASE_URL}${path}`);
            const response = await authAxios.get(
                `${process.env.REACT_APP_BASE_URL}${path}`
            );
            return response.data;
        } catch (err) {
            return err.response.data;
        }
    },
    updateShipping: async(path, data) => {
        const token = localStorage.getItem("accessToken");
        const authAxios = axios.create({
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        try {
            const response = await authAxios.patch(
                `${process.env.REACT_APP_BASE_URL}${path}`,
                data
            );
            return response.data;
        } catch (err) {
            return err.response.data;
        }
    },
    updateCupon: async(path, data) => {
        const token = localStorage.getItem("accessToken");
        const authAxios = axios.create({
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        try {
            const response = await authAxios.put(
                `${process.env.REACT_APP_BASE_URL}${path}`,
                data
            );
            return response.data;
        } catch (err) {
            return err.response.data;
        }
    },
    read: async(path, id) => {
        const token = localStorage.getItem("accessToken");
        const authAxios = axios.create({
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                "X-localization": "en",
            },
        });

        try {
            const response = await authAxios.get(
                `${process.env.REACT_APP_BASE_URL}${path}/${id}`
            );
            return response.data;
        } catch (err) {
            return err.response.data;
        }
    },
    create: async(path, data) => {
        const token = localStorage.getItem("accessToken");
        const authAxios = axios.create({
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                "X-localization": "en",
            },
        });
        try {
            const response = await authAxios.post(
                `${process.env.REACT_APP_BASE_URL}${path}`,
                data
            );
            return response.data;
        } catch (err) {
            return err.response.data;
        }
    },
    update: async(path, data, id) => {
        const token = localStorage.getItem("accessToken");
        const authAxios = axios.create({
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                "X-localization": "en",
            },
        });

        try {
            const response = await authAxios.post(
                `${process.env.REACT_APP_BASE_URL}${path}/${id}`,
                data
            );
            return response.data;
        } catch (err) {
            return err.response.data;
        }
    },
    delete: async(path, data) => {
        const token = localStorage.getItem("accessToken");
        const authAxios = axios.create({
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        data = {...data, "_method": "DELETE" };

        try {
            const response = await authAxios.post(
                `${process.env.REACT_APP_BASE_URL}${path}`,
                data
            );
            return response.data;
        } catch (err) {
            return err.response.data;
        }
    },
};

export default API;