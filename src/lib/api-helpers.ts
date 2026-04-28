import { headers } from "next/headers";

export function getAuthContext() {
  const headerList = headers();
  const userId = headerList.get("x-user-id");
  const tenantId = headerList.get("x-tenant-id");
  const role = headerList.get("x-user-role");

  return { userId, tenantId, role };
}
