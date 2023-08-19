import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { LoginService } from '../login/login.service';

describe('Login', () => {
  let app: TestingModule;
  let login: LoginService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    login = app.get(LoginService);
  });

  describe('signIn', () => {
    it('should return a token', async () => {
      const token = await login.getToken({
        email: 'admin@admin.admin',
        password: '',
      });

      expect(token).toBeDefined();
    });

    it('should throw auth error on bad pass', async () => {
      await expect(() =>
        login.getToken({ email: 'admin@admin.admin', password: 'bad pass' }),
      ).rejects.toThrow();
    });

    it('should throw auth error on absent', async () => {
      await expect(() =>
        login.getToken({ email: 'absent', password: 'pass' }),
      ).rejects.toThrow();
    });
  });
});
