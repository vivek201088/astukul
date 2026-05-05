import { Injectable, UnauthorizedException, ConflictException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { Model, Types } from 'mongoose';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.userService.create({
      ...userData,
      email,
      password: hashedPassword,
    }) as UserDocument;

    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { email: user.email, sub: (user as UserDocument)._id.toString(), role: user.role };
      const accessToken = this.jwtService.sign(newPayload);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(user: any): Promise<any> {
    if (user.role === 'teacher') {
      console.log('Fetching profile for teacher with ID:', user);
      const matchId = Types.ObjectId.isValid(user.userId)
        ? new Types.ObjectId(user.userId)
        : user.userId;

      return await this.userModel.aggregate(
        [
          {
            $match: {
              _id: matchId
            }
          },
          {
            $lookup: {
              from: "teachers",
              localField: "_id",
              foreignField: "userId",
              as: "teacher"
            }
          },
          {
            $unwind: {
              path: "$teacher",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "classes",
              localField: "teacher.classTeacherOf",
              foreignField: "_id",
              as: "class"
            }
          },
          {
            $unwind: {
              path: "$class",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "schools",
              localField: "teacher.schoolId",
              foreignField: "_id",
              as: "school"
            }
          },
          {
            $unwind: {
              path: "$school",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "students",
              localField: "class._id",
              foreignField: "classId",
              as: "student"
            }
          }
        ]
      )
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Profile retrieved successfully',
      data: user,
    };

  }

  private async generateTokens(user: any): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      schoolId: user.schoolId,
    };

    // Generate access token
    const accessToken = this.jwtService.sign(payload as any);

    // Generate refresh token
    const refreshToken = this.jwtService.sign(payload as any, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '7d'),
    } as any);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '7d'),
      tokenType: 'Bearer',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
      },
    };
  }
}
