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

            //   if (!response.ok) {
            //     throw new Error("Login failed");
            //   }
          
            const data = await response.json();
            //   console.log("login data", data)
            localStorage.setItem("token", data?.token)
            return data;

        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    },

    addCategory: async (name) => {
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

            //   if (!response.ok) {
            //     throw new Error("Login failed");
            //   }

            const data = await response.json();
              console.log("add category", data)
            return data;

        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    },

    getCategory: async (name) => {
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

            //   if (!response.ok) {
            //     throw new Error("Login failed");
            //   }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    },
    fetchSections: async () => { },
    fetchItems: async () => { },
    saveItem: async (item) => { },
    deleteItem: async (id) => { },
    saveSection: async (section) => { },
    deleteSection: async (id) => { }
}