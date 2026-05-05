export class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
    tokenType: string = 'Bearer';
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        schoolId: string;
    };
}
