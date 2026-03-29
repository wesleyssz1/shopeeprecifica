import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const email = "admin@shopeeprecifica.com";
  const password = "Admin@2025";

  // Create user
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Administrador" },
  });

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), { status: 400 });
  }

  const userId = userData.user.id;

  // Insert 35 products
  const categories = ["Eletrônicos", "Moda", "Casa e Decoração", "Beleza e Saúde", "Acessórios", "Brinquedos", "Esportes", "Outros"];
  
  const productNames = [
    "Fone Bluetooth TWS", "Capinha iPhone 15", "Carregador USB-C 20W", "Mouse Gamer RGB",
    "Teclado Mecânico Compacto", "Camiseta Algodão Premium", "Calça Jogger Masculina",
    "Vestido Midi Floral", "Tênis Casual Feminino", "Bolsa Transversal Couro",
    "Luminária LED Mesa", "Organizador Maquiagem Acrílico", "Tapete Antiderrapante",
    "Kit Pincéis Maquiagem 12pcs", "Sérum Vitamina C 30ml", "Protetor Solar FPS 50",
    "Relógio Digital Esportivo", "Óculos de Sol Polarizado", "Pulseira Aço Inoxidável",
    "Brinco Pérola Dourado", "Boneco Action Figure 15cm", "Quebra-Cabeça 1000 Peças",
    "Jogo de Cartas UNO", "Garrafa Térmica 500ml", "Faixa Elástica Exercício",
    "Corda de Pular Profissional", "Mochila Impermeável 25L", "Hub USB 4 Portas",
    "Suporte Celular Veicular", "Película Vidro Temperado", "Ring Light 26cm Tripé",
    "Webcam HD 1080p", "Caixa de Som Portátil", "Power Bank 10000mAh", "Smartwatch Fitness"
  ];

  const products = productNames.map((name, i) => {
    const costPrice = +(Math.random() * 80 + 5).toFixed(2);
    const packagingCost = +(Math.random() * 5 + 0.5).toFixed(2);
    const shippingCost = +(Math.random() * 15 + 2).toFixed(2);
    const markup = 1.5 + Math.random() * 2;
    const sellingPrice = +((costPrice + packagingCost + shippingCost) * markup).toFixed(2);
    const commission = [12, 14, 16, 18][Math.floor(Math.random() * 4)];
    const qty = Math.floor(Math.random() * 50) + 1;

    return {
      user_id: userId,
      nome: name,
      custo_atual: costPrice,
      custo_embalagem: packagingCost,
      custo_frete: shippingCost,
      preco_venda: sellingPrice,
      comissao_shopee: commission,
      taxas_adicionais: +(Math.random() * 3).toFixed(2),
      quantidade: qty,
      categoria: categories[i % categories.length],
    };
  });

  const { error: insertError } = await supabase.from("produtos").insert(products);

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    userId, 
    email, 
    password,
    productsInserted: products.length 
  }));
});
