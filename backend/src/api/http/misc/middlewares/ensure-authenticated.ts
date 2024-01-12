import { verify, type JwtPayload} from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import env from "../../../../misc/env";
import {Account} from "../../../../entities/account/account";
import datasource from "../../../../misc/datasource";

declare global {
    namespace Express {
        interface Request {
            user: Account;
        }
    }
}

const promiseVerify = (token: string, secret: string) =>
    new Promise<string | JwtPayload | undefined>((resolve, reject) => {
        verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                const id = (decoded as {id?: string}).id;

                if (id === undefined) {
                    reject("Invalid token");
                }
                resolve(id);
            }
        });
    });

const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Missing authorization header",
        });
    }

    const [scheme, token] = authHeader.split(" ");

    if (!scheme || !token) {
        return res.status(401).json({
            error: "Invalid authorization header",
        });
    }
    if (scheme !== "Bearer") {
        return res.status(401).json({
            error: "Invalid authorization scheme",
        });
    }

    try {
        const decoded = await promiseVerify(token, env.jwt.secret);

        if (typeof decoded !== "string") {
            return res.status(401).json({
                error: "Invalid token",
            });
        }

        const accountRepository = datasource.getRepository(Account);

        const account = await accountRepository.findOne({
            where: {
                id: decoded
            }
        });

        if (account === undefined || account === null) {
            return res.status(401).json({
                error: "Invalid token",
            });
        }

        req.user = account;

        next();
    } catch (e) {
        return res.status(401).json({
            error: "Invalid token",
        });
    }
}

export default ensureAuthenticated;
