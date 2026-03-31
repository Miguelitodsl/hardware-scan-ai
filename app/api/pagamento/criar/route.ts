import { NextRequest, NextResponse } from "next/server";
import { salvarScan } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, cpu, gpu, ram, ramSize, mobo, psu, score, relatorio } = await req.json();

    // 1) Salva no banco de dados ANTES de ir para o pagamento
    // Isso gera um ID único para cada venda do Miguel
    const scanId = await salvarScan({ email, cpu, gpu, ram, ramSize, mobo, psu, score, relatorio });

    // 2) Cria a preferência de pagamento no Mercado Pago
    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MERCADO_PAGO_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            id: "hardware-scan",
            title: "Hardware Scan AI — Relatório Completo",
            quantity: 1,
            currency_id: "BRL",
            unit_price: 20.00,
          },
        ],
        payer: { email },
        payment_methods: {
          excluded_payment_types: [{ id: "credit_card" }, { id: "debit_card" }],
          default_payment_method_id: "pix",
        },
        back_urls: {
          // Quando o cara pagar, ele volta para essa página do seu site
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/sucesso?scan=${scanId}`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/erro`,
        },
        external_reference: scanId,
      }),
    });

    const mp = await mpRes.json();
    
    if (!mpRes.ok) {
        console.error("Erro no Mercado Pago:", mp);
        return NextResponse.json({ error: mp.message }, { status: 400 });
    }

    return NextResponse.json({
      checkoutUrl: mp.init_point, // Esse link leva o usuário para a tela do PIX
      scanId,
    });
  } catch (error: any) {
    console.error("Erro na API de pagamento:", error.message);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}