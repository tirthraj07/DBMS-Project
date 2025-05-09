import { SignJWT, jwtVerify, JWTPayload } from 'jose';

// Retrieve JWT secret key from environment variables
const SECRET_KEY: string = process.env['JWT_KEY'] || "";

// Ensure JWT secret key is defined
if (SECRET_KEY == "") {
    throw new Error("JWT secret key is not defined in environment variables");
}

// Convert secret key to Uint8Array
const secret = new TextEncoder().encode(SECRET_KEY);

// Payload interface for JSON Web Token
export type Payload = {
    employee_id: number,
    email: string,
    full_name: string,
    is_completed: boolean
};

interface TicketPayload extends JWTPayload {
    booking_id: number;
    booking_total_seats: number;
    booking_date: string;
    booking_total_amount: string;
    customer_id: number;
    customer_full_name: string;
    customer_email: string;
    customer_phone: string;
    showtime_id: number;
    showtime_start_time: string;
    showtime_end_time: string;
    movie_id: number;
    movie_title: string;
    movie_director_name: string;
    screen_id: number;
    screen_name: string;
    screen_total_seats: number;
    theatre_id: number;
    theatre_name: string;
    theatre_location: string;
}


/**
 * JSON Web Token utility class for token creation and validation.
 */
export class JsonWebToken {
    /**
     * Creates a new JSON Web Token (JWT) with the provided payload.
     * 
     * @param {Payload} payload - The payload object containing user data.
     * @returns {string} The generated JWT token.
     */
    async createToken(payload: Payload): Promise<string> {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('10d')
            .sign(secret);
    }

    async createTicketToken(ticket: TicketPayload): Promise<string> {
        return new SignJWT(ticket)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('10d')
            .sign(secret);
    }

    /**
     * Validates the provided JWT token.
     * 
     * @param {string} token - The JWT token to validate.
     * @returns - An object indicating the validation result:
     *                   - success: True if the token is valid, otherwise false.
     *                   - error: Error message if validation fails.
     *                   - reason: Reason for token invalidation (expired, invalid format, etc.).
     *                   - decodedToken: the contents of the token on success
     */

    async validateToken(token: string) {
        try {
            const { payload } = await jwtVerify(token, secret);
            const decodedToken = payload as JWTPayload;

            if (decodedToken.exp && decodedToken.exp < Math.floor(Date.now() / 1000)) {
                throw new Error('Token has expired');
            }

            return {
                success: true,
                decodedToken: decodedToken
            };

        } catch (error: any) {
            let reason = 'Unknown Error';
            if (error.name === 'JWTExpired') {
                reason = 'Token has expired';
            } else if (error.name === 'JWTInvalid') {
                reason = error.message;
            } else if (error instanceof Error) {
                reason = error.message;
            }

            return {
                success: false,
                error: 'Invalid Token',
                reason: reason
            };
        }
    }

}