import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Lógica temporária para o botão funcionar
  return NextResponse.json({
    score: 85,
    summary: "Seu setup foi detectado com sucesso!",
    bottleneck: "Análise preliminar indica bom equilíbrio entre CPU e GPU.",
    recommendations: ["Verificar XMP na BIOS", "Ativar Resize Bar"]
  });
}