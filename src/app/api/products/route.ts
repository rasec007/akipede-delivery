import { NextResponse } from "next/server";
import { ProductService } from "@/server/services/ProductService";
import { getAuthContext } from "@/lib/api-helpers";

export async function GET() {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const productService = new ProductService(tenantId);
    const products = await productService.listAll();

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
