import { axiosInstance } from "../axios";
import useAuth from "./useAuth";

export default function useRefreshToken() {
    const { setAccessToken, setCSRFToken } = useAuth()

    const refresh = async () => {
        const response = await axiosInstance.post('token/refresh')
        setAccessToken(response.data.access)

        return { accessToken: response.data.access}
    }

    return refresh
}