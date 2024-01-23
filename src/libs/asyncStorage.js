import AsyncStorage from "@react-native-async-storage/async-storage";

const storeToken = async (user) => {
    try {
        await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
        console.warn("No se pudo guardar el usuario", error);
    }
}

const getToken = async () => {

    try {
        let user = await AsyncStorage.getItem("user");
        return  user ?  JSON.parse(user) :  {"username":-1};
    } catch (error) {
        console.warn("No pudimos obtener token", error);
    }
}

const logout = async () => {
    try {
        await AsyncStorage.removeItem("user");
        return true;
    } catch (error) {
        console.warn("No pudimos cerrar sesión", error);
    }
}

export { storeToken, getToken, logout };