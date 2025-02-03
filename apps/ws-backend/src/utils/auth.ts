import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function checkUser(token: string): string | null {
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (typeof payload === "string") {
            return null;
        }
        return payload.userId;
    }
    catch (error) {
        return null;
    }
}
