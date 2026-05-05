import { Injectable, UnauthorizedException, ConflictException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async register(registerDto: RegisterDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.userService.create({
      ...userData,
      email,
      password: hashedPassword,
    }) as UserDocument;

    // Generate tokens
    const payload = { sub: user._id.toString(), role: user.role, schoolId: user.schoolId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, (user as UserDocument).password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const payload = { email: user.email, sub: (user as UserDocument)._id.toString(), role: user.role, schoolId: user.schoolId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
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
      return await this.userModel.aggregate(
        [
          {
            //69eddbf77be3a50ddc7c0e21
            $match: {
              _id: user._id
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
}
