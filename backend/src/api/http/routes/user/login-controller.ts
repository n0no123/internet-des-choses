import {Handler} from "../../misc/handler";
import datasource from "../../../../misc/datasource";
import {Account} from "../../../../entities/account/account";
import jsonwebtoken from "jsonwebtoken";
import env from "../../../../misc/env";

type Params = {
    username: string;
    password: string;
}

type Response = {
    token: string;
} | {
    error: string;
}

const handler: Handler<Params, Response> = async ({username, password}) => {
    const accountRepository = datasource.getRepository(Account);

    const account: Account | null = await accountRepository.findOne({
        where: {
            username,
        },
    });

    if (account === null) {
        return {
            statusCode: 401,
            body: {
                error: "Invalid username or password",
            }
        }
    } else {
        if (account.comparePassword(password)) {
            const token = jsonwebtoken.sign(account.id, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

            return {
                statusCode: 200,
                body: {
                    token
                }
            }
        } else {
            return {
                statusCode: 401,
                body: {
                    error: "Invalid username or password",
                }
            }
        }
    }
};


export default handler;
