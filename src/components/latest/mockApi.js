import { baseurl } from "../../config";


export const mockApianother = {
    login: async (email, password) => {
        try {

            const response = await fetch(`${baseurl}login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // important for cookies / sessions
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            //   console.log("login data", data)
            localStorage.setItem("token", data?.token)
            return data;

        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    },

    addCategory: async function (name) {

        // console.log("idhar api me", email, password)
        try {
            let token = localStorage.getItem("token");
            const response = await fetch(`${baseurl}category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                credentials: "include", // important for cookies / sessions
                body: JSON.stringify({
                    name
                })
            });

            if (!response.ok) {
                throw new Error("Failed");
            }

            const data = await response.json();
            console.log("add category", data)
            return data;

        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    },

    getCategory: async function (name) {
        // console.log("idhar api me", email, password)
        try {
            let token = localStorage.getItem("token");
            const response = await fetch(`${baseurl}category`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                credentials: "include", // important for cookies / sessions
            });

            if (!response.ok) {
                throw new Error("Failed");
            }

            const data = await response.json();
            // console.log("getcateogy", data)
            return data;

        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    },

    addsection: async function (category, name, type) {
        // console.log("idhar api me", email, password)
        try {
            let token = localStorage.getItem("token");
            const response = await fetch(`${baseurl}section`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                credentials: "include", // important for cookies / sessions
                body: JSON.stringify({
                    category, name, type
                })
            });

            if (!response.ok) {
                throw new Error("Failed");
            }

            const data = await response.json();
            // console.log("add section", data)
            return data;

        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    },

    editsection: async function ({ category, name, type, sectionId }) {
        try {

            let token = localStorage.getItem("token");

            const response = await fetch(`${baseurl}section/${sectionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                credentials: "include",
                body: JSON.stringify({
                    category,
                    name,
                    type
                })
            });

            if (!response.ok) {
                throw new Error("Failed");
            }

            const data = await response.json();
            console.log("update section", data);

            return data;

        } catch (error) {
            console.error("Edit section error:", error.message);
            throw error;
        }
    },

    deletesection: async function ({ sectionId }) {
        try {

            let token = localStorage.getItem("token");

            const response = await fetch(`${baseurl}section/${sectionId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed");
            }
            const data = await response.json();

            // console.log("deleted section", data);

            return data;

        } catch (error) {
            console.error("Edit section error:", error.message);
            throw error;
        }
    },

    additems: async function (data) {
        // console.log(data)
        let { answer, category, description, difficulty, sectionId, solutions, title, type } = data;
        console.log(answer, category, description, difficulty, sectionId, solutions, title, type)

        try {
            let token = localStorage.getItem("token");
            const response = await fetch(`${baseurl}item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                credentials: "include", // important for cookies / sessions
                body: JSON.stringify({
                    answer, category, description, difficulty, sectionId, solutions, title, type
                })
            });

             if (!response.ok) {
                throw new Error("Failed");
              }

            const data = await response.json();
            // console.log("additems", data)
            return data;

        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    },

    edititems: async function (data, itemId) {
        let { answer, category, description, difficulty, sectionId, solutions, title, type } = data;
        try {

            let token = localStorage.getItem("token");

            const response = await fetch(`${baseurl}item/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                credentials: "include",
                body: JSON.stringify({
                    answer, category, description, difficulty, sectionId, solutions, title, type
                })
            });

             if (!response.ok) {
                throw new Error("Failed");
              }

            const data = await response.json();
            console.log("update item", data);

            return data;

        } catch (error) {
            console.error("Edit section error:", error.message);
            throw error;
        }
    },

    deleteitem: async function ({ itemId }) {
        try {

            let token = localStorage.getItem("token");

            const response = await fetch(`${baseurl}item/${itemId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                credentials: "include",
            });

             if (!response.ok) {
                throw new Error("Failed");
              }

            const data = await response.json();
            // console.log("item deleted", data);

            return data;

        } catch (error) {
            console.error("Edit section error:", error.message);
            throw error;
        }
    },
}