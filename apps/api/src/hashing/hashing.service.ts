import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }

  async verifyPassword(storedHash: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, storedHash);
  }
}
