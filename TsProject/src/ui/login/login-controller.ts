import PixivAppApi from "../../api/pixiv-app-api";

export default class LoginController {

    public async login(refreshToken: string) {
        const result = await PixivAppApi.instance.auth(refreshToken);
        return result != null;
    }
}