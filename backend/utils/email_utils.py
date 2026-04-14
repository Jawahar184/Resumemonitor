import os
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from dotenv import load_dotenv

def get_email_conf():
    load_dotenv(override=True)
    return ConnectionConfig(
        MAIL_USERNAME=os.environ.get("MAIL_USERNAME", "your_email@gmail.com").lower(),
        MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD", "your_app_password"),
        MAIL_FROM=os.environ.get("MAIL_FROM", "your_email@gmail.com").lower(),
        MAIL_PORT=int(os.environ.get("MAIL_PORT", 465)),
        MAIL_SERVER=os.environ.get("MAIL_SERVER", "smtp.gmail.com"),
        MAIL_STARTTLS=os.environ.get("MAIL_STARTTLS", "False").lower() in ["true", "1"],
        MAIL_SSL_TLS=os.environ.get("MAIL_SSL_TLS", "True").lower() in ["true", "1"],
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True
    )

async def send_bulk_emails(recipients: list[str], subject: str, body: str):
    html_body = f"""
    <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0f172a; margin: 0; font-size: 24px;">ResumeAlert</h1>
            <p style="color: #64748b; margin-top: 8px; font-size: 16px;">Job Match Notification</p>
        </div>
        <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <p style="color: #334155; font-size: 16px; margin: 0; white-space: pre-wrap; line-height: 1.6;">{body}</p>
        </div>
        <div style="text-align: center; margin-top: 24px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">Powered by SecurePortal Pro</p>
        </div>
    </div>
    """

    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=html_body,
        subtype=MessageType.html
    )
    
    fm = FastMail(get_email_conf())
    try:
        await fm.send_message(message)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

async def send_otp_email(recipient: str, otp: str):
    subject = "Your ResumeAlert Verification Code ✨"
    html_body = f"""
    <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0f172a; margin: 0; font-size: 24px;">ResumeAlert</h1>
            <p style="color: #64748b; margin-top: 8px; font-size: 16px;">Secure Email Verification</p>
        </div>
        <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); text-align: center;">
            <p style="color: #334155; font-size: 16px; margin-bottom: 24px;">Please use the following 6-digit verification code to complete your registration. This code will expire soon.</p>
            <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #2563eb; background: #eff6ff; padding: 16px; border-radius: 8px; display: inline-block; margin-bottom: 24px;">
                {otp}
            </div>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
    </div>
    """
    
    message = MessageSchema(
        subject=subject,
        recipients=[recipient],
        body=html_body,
        subtype=MessageType.html
    )
    
    fm = FastMail(get_email_conf())
    try:
        await fm.send_message(message)
        return True
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return False
