import { getTenantPrisma } from "@/lib/prisma";

export class BaseService {
  protected tenantId: string;
  protected db: ReturnType<typeof getTenantPrisma>;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
    this.db = getTenantPrisma(tenantId);
  }
}
