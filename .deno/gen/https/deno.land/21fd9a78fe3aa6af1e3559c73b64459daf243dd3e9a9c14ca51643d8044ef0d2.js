import { Cookies } from "./cookies.ts";
import { acceptable, acceptWebSocket, } from "./deps.ts";
import { createHttpError } from "./httpError.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { send } from "./send.ts";
import { ServerSentEventTarget, } from "./server_sent_event.ts";
export class Context {
    #socket;
    #sse;
    app;
    cookies;
    get isUpgradable() {
        return acceptable(this.request);
    }
    respond;
    request;
    response;
    get socket() {
        return this.#socket;
    }
    state;
    constructor(app, serverRequest, secure = false) {
        this.app = app;
        this.state = app.state;
        this.request = new Request(serverRequest, app.proxy, secure);
        this.respond = true;
        this.response = new Response(this.request);
        this.cookies = new Cookies(this.request, this.response, {
            keys: this.app.keys,
            secure: this.request.secure,
        });
    }
    assert(condition, errorStatus = 500, message, props) {
        if (condition) {
            return;
        }
        const err = createHttpError(errorStatus, message);
        if (props) {
            Object.assign(err, props);
        }
        throw err;
    }
    send(options) {
        const { path = this.request.url.pathname, ...sendOptions } = options;
        return send(this, path, sendOptions);
    }
    sendEvents(options) {
        if (this.#sse) {
            return this.#sse;
        }
        this.respond = false;
        return this.#sse = new ServerSentEventTarget(this.app, this.request.serverRequest, options);
    }
    throw(errorStatus, message, props) {
        const err = createHttpError(errorStatus, message);
        if (props) {
            Object.assign(err, props);
        }
        throw err;
    }
    async upgrade() {
        if (this.#socket) {
            return this.#socket;
        }
        const { conn, r: bufReader, w: bufWriter, headers } = this.request.serverRequest;
        this.#socket = await acceptWebSocket({ conn, bufReader, bufWriter, headers });
        this.respond = false;
        return this.#socket;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQ0wsVUFBVSxFQUNWLGVBQWUsR0FFaEIsTUFBTSxXQUFXLENBQUM7QUFDbkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWpELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdkMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsSUFBSSxFQUFlLE1BQU0sV0FBVyxDQUFDO0FBQzlDLE9BQU8sRUFDTCxxQkFBcUIsR0FFdEIsTUFBTSx3QkFBd0IsQ0FBQztBQWFoQyxNQUFNLE9BQU8sT0FBTztJQUNsQixPQUFPLENBQWE7SUFDcEIsSUFBSSxDQUF5QjtJQUc3QixHQUFHLENBQXFCO0lBSXhCLE9BQU8sQ0FBVTtJQUtqQixJQUFJLFlBQVk7UUFDZCxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQVVELE9BQU8sQ0FBVTtJQUdqQixPQUFPLENBQVU7SUFJakIsUUFBUSxDQUFXO0lBSW5CLElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBZ0JELEtBQUssQ0FBSTtJQUVULFlBQ0UsR0FBbUIsRUFDbkIsYUFBNEIsRUFDNUIsTUFBTSxHQUFHLEtBQUs7UUFFZCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdE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