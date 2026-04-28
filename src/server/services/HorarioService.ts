import { BaseService } from "./BaseService";

export class HorarioService extends BaseService {

  async listHorarios() {
    return await this.db.horario_funcionamento.findMany({
      where: { estabelecimento: this.tenantId },
      include: {
        dominio: { select: { id_dominio: true, nome: true } },
      },
      orderBy: { horaAbre: "asc" },
    });
  }

  async createHorario(data: {
    diaSemana: string;
    horaAbre: string;
    horaFecha: string;
  }) {
    return await this.db.horario_funcionamento.create({
      data: {
        diaSemana: data.diaSemana,
        horaAbre: parseTimeToISO(data.horaAbre),
        horaFecha: parseTimeToISO(data.horaFecha),
        estabelecimento: this.tenantId,
      },
      include: {
        dominio: { select: { id_dominio: true, nome: true } },
      },
    });
  }

  async updateHorario(id: string, data: {
    diaSemana?: string;
    horaAbre?: string;
    horaFecha?: string;
  }) {
    const existing = await this.db.horario_funcionamento.findFirst({
      where: { id_horario_funcionamento: id, estabelecimento: this.tenantId },
    });
    if (!existing) throw new Error("Horário não encontrado");

    return await this.db.horario_funcionamento.update({
      where: { id_horario_funcionamento: id },
      data: {
        diaSemana: data.diaSemana,
        horaAbre: data.horaAbre ? parseTimeToISO(data.horaAbre) : undefined,
        horaFecha: data.horaFecha ? parseTimeToISO(data.horaFecha) : undefined,
      },
      include: {
        dominio: { select: { id_dominio: true, nome: true } },
      },
    });
  }

  async deleteHorario(id: string) {
    const existing = await this.db.horario_funcionamento.findFirst({
      where: { id_horario_funcionamento: id, estabelecimento: this.tenantId },
    });
    if (!existing) throw new Error("Horário não encontrado");

    await this.db.horario_funcionamento.delete({
      where: { id_horario_funcionamento: id },
    });
    return { success: true };
  }

  async checkAberto(): Promise<{ aberto: boolean; mensagem: string }> {
    const now = new Date();
    const dayMap: Record<number, string> = {
      0: "Domingo", 1: "Segunda", 2: "Terça",
      3: "Quarta", 4: "Quinta", 5: "Sexta", 6: "Sábado",
    };
    const todayName = dayMap[now.getDay()];

    const horarios = await this.db.horario_funcionamento.findMany({
      where: { estabelecimento: this.tenantId },
      include: { dominio: { select: { nome: true } } },
    });

    const todaySchedules = horarios.filter(
      (h: any) => h.dominio?.nome?.toLowerCase().includes(todayName.toLowerCase())
    );

    if (todaySchedules.length === 0) {
      return { aberto: false, mensagem: `Estamos fechados hoje (${todayName}).` };
    }

    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (const schedule of todaySchedules) {
      if (schedule.horaAbre && schedule.horaFecha) {
        const abre = new Date(schedule.horaAbre);
        const fecha = new Date(schedule.horaFecha);
        const abreMin = abre.getUTCHours() * 60 + abre.getUTCMinutes();
        const fechaMin = fecha.getUTCHours() * 60 + fecha.getUTCMinutes();

        if (nowMinutes >= abreMin && nowMinutes <= fechaMin) {
          return { aberto: true, mensagem: "Estamos abertos! Faça seu pedido." };
        }
      }
    }

    const nextOpen = todaySchedules
      .map((s: any) => {
        if (!s.horaAbre) return null;
        const a = new Date(s.horaAbre);
        return `${String(a.getUTCHours()).padStart(2, "0")}:${String(a.getUTCMinutes()).padStart(2, "0")}`;
      })
      .filter(Boolean)
      .sort()[0];

    if (nextOpen && nowMinutes < parseInt(nextOpen.split(":")[0]) * 60 + parseInt(nextOpen.split(":")[1])) {
      return { aberto: false, mensagem: `Abrimos hoje às ${nextOpen}. Aguarde!` };
    }

    return { aberto: false, mensagem: "Estamos fechados no momento. Volte em breve!" };
  }
}

function parseTimeToISO(time: string): Date {
  const [h, m] = time.split(":").map(Number);
  return new Date(`1970-01-01T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00.000Z`);
}
