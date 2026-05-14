import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as brevo from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private apiInstance: brevo.TransactionalEmailsApi;

  constructor(private configService: ConfigService) {
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      this.configService.get<string>('BREVO_API_KEY')!
    );
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const senderEmail = this.configService.get<string>('SENDER_EMAIL')!;
    const url = `${frontendUrl}/auth/verify?token=${token}`;

    const htmlContent = `
      <div style="background-color: #f0fdf4; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <div style="background-color: #166534; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">
              🎄 Lời Chúc Giáng Sinh 🎅
            </h1>
          </div>

          <div style="padding: 40px 30px; color: #333333; line-height: 1.6;">
            <p style="font-size: 16px;">Ho ho ho! Xin chào <strong>${name}</strong>,</p>
            <p>Cảm ơn bạn đã ghé thăm trạm phát quà Giáng Sinh. Để những món quà và lời chúc có thể được gửi đi an toàn, vui lòng xác nhận địa chỉ email của bạn nhé.</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${url}" style="background-color: #dc2626; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);">
                🎁 XÁC THỰC EMAIL
              </a>
            </div>

            <p style="font-size: 14px; color: #666; text-align: center;">
              <em>*Phép màu (Link xác thực) này sẽ biến mất sau 24 giờ.</em>
            </p>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0;">Bạn nhận được email này vì đã đăng ký tài khoản tại Lời Chúc Giáng Sinh.</p>
            <p style="margin-top: 10px; font-weight: bold; color: #166534;">Merry Christmas & Happy New Year ❄️</p>
          </div>

        </div>
      </div>
    `;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = '🎄 Xác thực tài khoản Giáng Sinh';
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: 'Ông Già Noel', email: senderEmail };
    sendSmtpEmail.to = [{ email: to }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(`📧 Verification email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Không thể gửi email xác thực');
    }
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const senderEmail = this.configService.get<string>('SENDER_EMAIL')!;
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const htmlContent = `
      <div style="background-color: #f0fdf4; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <div style="background-color: #166534; padding: 30px 20px; text-align: center;">
             <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">
              🎄 Lời Chúc Giáng Sinh 🎅
            </h1>
          </div>

          <div style="padding: 40px 30px; color: #333333; line-height: 1.6;">
            <h2 style="color: #dc2626; text-align: center; margin-top: 0;">Quên chìa khóa mở hộp quà? 🔑</h2>
            <p style="font-size: 16px;">Xin chào,</p>
            <p>Có vẻ như bạn đã làm rơi chìa khóa (mật khẩu) của mình. Đừng lo lắng, yêu tinh Giáng sinh đã tạo cho bạn một chìa khóa mới.</p>
            <p>Hãy bấm vào nút bên dưới để thiết lập lại mật khẩu nhé:</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${resetLink}" style="background-color: #dc2626; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);">
                ĐẶT LẠI MẬT KHẨU
              </a>
            </div>

            <p style="font-size: 14px; color: #666; text-align: center;">
              <em>*Link khôi phục này sẽ hết hạn sau 15 phút.</em>
            </p>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0;">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này an toàn nhé.</p>
             <p style="margin-top: 10px; font-weight: bold; color: #166534;">Merry Christmas & Happy New Year ❄️</p>
          </div>

        </div>
      </div>
    `;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = '🔑 [Giáng Sinh] Đặt lại mật khẩu';
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: 'Hệ thống Giáng Sinh', email: senderEmail };
    sendSmtpEmail.to = [{ email: to }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(`📧 Reset password email sent to ${to}`);
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new Error('Không thể gửi email khôi phục');
    }
  }
}