export type HandlerResponse<R> = {
    statusCode: number;
    body: R;
};

export type Handler<
    T extends object | undefined,
    R
> = (
    params: T
) => Promise<HandlerResponse<R>>;

type T = object extends never ? true : false;
type U = never extends object ? true : false;
