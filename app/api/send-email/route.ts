import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Inicializamos Resend con la API KEY desde el .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. Leemos los datos del formulario
    const body = await req.json();
    const { full_name, email, phone, service_type, budget, notes } = body;

    console.log("📨 Intentando enviar correo para:", full_name);

    // 2. Enviamos el correo con Resend
    // IMPORTANTE: 'onboarding@resend.dev' es obligatorio si no has verificado un dominio
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['uriosteguiandres17@gmail.com'],      
      subject: `⚓ Nueva Solicitud: ${full_name}`,
      html: `
        <div style="font-family: sans-serif; color: #1e3a8a; max-width: 600px; border: 1px solid #e0e5ec; padding: 20px; border-radius: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e0e5ec; padding-bottom: 10px;">🚢 Nueva Cotización BlueWaves</h2>
          <p style="font-size: 16px;"><strong>Cliente:</strong> ${full_name}</p>
          <p style="font-size: 14px; color: #555;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 14px; color: #555;"><strong>Teléfono:</strong> ${phone}</p>
          <p style="font-size: 14px; color: #555;"><strong>Servicio:</strong> ${service_type}</p>
          <p style="font-size: 14px; color: #555;"><strong>Presupuesto Diario:</strong> ${budget}</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 10px; margin-top: 20px;">
            <p style="font-size: 14px; margin: 0;"><strong>Notas Especiales:</strong></p>
            <p style="font-size: 14px; color: #333; font-style: italic;">${notes || 'Sin notas adicionales'}</p>
          </div>
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; text-transform: uppercase;">Este es un aviso automático de tu CRM BlueWaves</p>
        </div>
      `,
    });

    // 3. Si Resend nos regresa un error específico (como API Key mal o límite excedido)
    if (error) {
      console.error("❌ Error de Resend:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    console.log("✅ Correo enviado exitosamente:", data);
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    // 4. Si el servidor truena por otra cosa
    console.error("❌ ERROR INTERNO DEL SERVIDOR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}