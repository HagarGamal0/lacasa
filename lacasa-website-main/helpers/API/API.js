import axios from "axios";

const API = {
  readAll: async (path) => {
    const lang = localStorage.getItem("lang") || "en";
    let token;
    if (localStorage.getItem("userInfo")) {
      token = localStorage.getItem("userInfo");
    }
    const Authaxios = axios.create({
      headers: {
        Accept: "application/json",
       // "Access-Control-Allow-Origin": "*",
        "X-localization": lang,
        Authorization: `Bearer ${token}`,
      },
    });
    try {
      const response = await Authaxios.get(
        `${process.env.NEXT_APP_BASE_URL}${path}`
      );
      return response?.data;
    } catch (err) {
      console.log(err.response?.data);
      return err?.response?.data;
    }
  },
  GetWithData: async (path, data) => {
    const lang = localStorage.getItem("lang") || "en";

    try {
      const response = await axios({
        method: "post",
        url: `${process.env.NEXT_APP_BASE_URL}${path}`,
        data: data,
        headers: {
          Accept: "application/json",
        //  "Access-Control-Allow-Origin": "*",
          "X-localization": lang,
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (err) {
      console.log(err.response?.data);
      return err.response.data;
    }
  },
  
  read: async (path, id) => {
    const lang = localStorage.getItem("lang") || "en";

    let token;
    if (localStorage.getItem("userInfo")) {
      token = localStorage.getItem("userInfo");
    }
    const Authaxios = axios.create({
      headers: {
        Accept: "application/json",
        //"Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
        "X-localization": lang,
      },
    });
    try {
      const response = await Authaxios.get(
        `${process.env.NEXT_APP_BASE_URL}${path}/${id}`
      );
      return response?.data;
    } catch (err) {
      console.log(err.response?.data);
    }
  },

  update: async (path, data, id) => {
    const lang = localStorage.getItem("lang") || "en";

    try {
      const token = localStorage.getItem("userInfo");
      const authAxios = axios.create({
        headers: {
          Accept: "application/json",
         // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
          "X-localization": lang,
        },
      });
      const response = await authAxios.patch(
        `${process.env.NEXT_APP_BASE_URL}${path}/${id ? id : ""}`,
        data
      );
      return response?.data;
    } catch (err) {
      console.log(err.response?.data);
    }
  },

  create: async (path, data) => {
    const lang = localStorage.getItem("lang") || "en";

    try {
      const token = localStorage.getItem("userInfo");
      const authAxios = axios.create({
        headers: {
          Accept: "application/json",
         // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await authAxios.post(
        `${process.env.NEXT_APP_BASE_URL}${path}`,
        data
      );
      return response?.data;
    } catch (err) {
      console.log(err.response?.data);
      return err?.response?.data;
    }
  },

  delete: async (path, id) => {
    const lang = localStorage.getItem("lang") || "en";

    try {
      const token = localStorage.getItem("userInfo");

      const authAxios = axios.create({
        headers: {
          Accept: "application/json",
          //"Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await authAxios.delete(
        `${process.env.NEXT_APP_BASE_URL}${path}/${id}`
      );
      return response?.data;
    } catch (err) {
      console.log(err.response?.data);
    }
  },
};

export default API;
