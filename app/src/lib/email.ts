import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const FROM_EMAIL = "Archivo Lorcana <noreply@lorcana.es>";

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<boolean> {
  const resetUrl = `${APP_URL}/restablecer-contrasena/${token}`;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Restablece tu contraseña - Archivo del Reino de Lorcana",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .card { background: #16213e; border-radius: 16px; padding: 40px; text-align: center; border: 1px solid #c58c4d; }
            .logo { font-size: 28px; font-weight: bold; color: #c58c4d; margin-bottom: 24px; }
            h1 { color: #ffffff; font-size: 24px; margin-bottom: 16px; }
            p { color: #a0a0a0; line-height: 1.6; margin-bottom: 24px; }
            .button { display: inline-block; background: #c58c4d; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; }
            .button:hover { background: #d4a056; }
            .footer { margin-top: 32px; font-size: 12px; color: #666; }
            .warning { background: #2a2a4a; padding: 16px; border-radius: 8px; margin: 24px 0; font-size: 14px; color: #ff6b6b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="logo">🏰 Archivo del Reino</div>
              <h1>¿Olvidaste tu contraseña?</h1>
              <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña.</p>
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
              <div class="warning">
                ⚠️ Este enlace caduca en 1 hora. Si no solicitaste este cambio, puedes ignorar este email.
              </div>
              <p class="footer">Si el botón no funciona, copia y pega este enlace en tu navegador:<br>${resetUrl}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Password reset email sent:", result.data?.id);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
}
