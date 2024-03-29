import {Handler} from "../../misc/handler";
import datasource from "../../../../misc/datasource";
import {Account} from "../../../../entities/account/account";
import { sign } from "jsonwebtoken";
import env from "../../../../misc/env";

type Params = {
    username: string;
    password: string;
    zipcode: string;
}

type Response = {
    token: string;
} | {
    error: string;
}

const handler: Handler<Params, Response> = async ({username, password, zipcode}) => {
    const accountRepository = datasource.getRepository(Account);

    const account: Account | null = await accountRepository.findOne({
        where: {
            username,
        },
    });

    if (account !== null) {
        return {
            statusCode: 401,
            body: {
                error: "User already exists",
            }
        }
    } else {
        const newAccount = accountRepository.create();
        newAccount.username = username;
        newAccount.setPassword(password);
        newAccount.zipcode = zipcode;
        const token = sign({id: newAccount.id}, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

        await accountRepository.save(newAccount);

        return {
            statusCode: 200,
            body: {
                token
            }
        }
    }
};


export default handler;
