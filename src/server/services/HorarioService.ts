import { BaseService } from "./BaseService";

export class HorarioService extends BaseService {

  async listHorarios() {
    const dayWeights: Record<string, number> = {
      "Segunda": 1, "Segunda-feira": 1,
      "Terça": 2, "Terça-feira": 2,
      "Quarta": 3, "Quarta-feira": 3,
      "Quinta": 4, "Quinta-feira": 4,
      "Sexta": 5, "Sexta-feira": 5,
      "Sábado": 6,
      "Domingo": 7
    };

    const horarios = await this.db.horario_funcionamento.findMany({
      where: { estabelecimento: this.tenantId },
      include: {
        dominio: { select: { id_dominio: true, nome: true } },
      }
    });

    return horarios.sort((a, b) => {
      const weightA = dayWeights[a.dominio?.nome || ""] || 99;
      const weightB = dayWeights[b.dominio?.nome || ""] || 99;
      if (weightA !== weightB) return weightA - weightB;
      
      // Se for o mesmo dia, ordena por hora
      const timeA = new Date(a.horaAbre || 0).getUTCHours() * 60 + new Date(a.horaAbre || 0).getUTCMinutes();
      const timeB = new Date(b.horaAbre || 0).getUTCHours() * 60 + new Date(b.horaAbre || 0).getUTCMinutes();
      return timeA - timeB;
    });
  }

  async checkOverlap(diaSemana: string, horaAbre: Date, horaFecha: Date, ignoreId?: string) {
    const existing = await this.db.horario_funcionamento.findMany({
      where: { 
        estabelecimento: this.tenantId,
        diaSemana: diaSemana,
        NOT: ignoreId ? { id_horario_funcionamento: ignoreId } : undefined
      }
    });

    const newStart = horaAbre.getUTCHours() * 60 + horaAbre.getUTCMinutes();
    const newEnd = horaFecha.getUTCHours() * 60 + horaFecha.getUTCMinutes();

    console.log(`🧐 CHECANDO CONFLITO: Novo [${newStart}min - ${newEnd}min]`);

    const formatTimeShort = (date: Date) => 
      `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;

    for (const h of existing) {
      const start = new Date(h.horaAbre || 0).getUTCHours() * 60 + new Date(h.horaAbre || 0).getUTCMinutes();
      const end = new Date(h.horaFecha || 0).getUTCHours() * 60 + new Date(h.horaFecha || 0).getUTCMinutes();

      console.log(`   👉 Comparando com: [${start}min - ${end}min]`);

      if (newStart < end && start < newEnd) {
        const hAbre = formatTimeShort(new Date(h.horaAbre || 0));
        const hFecha = formatTimeShort(new Date(h.horaFecha || 0));
        console.log("❌ CONFLITO DETECTADO!");
        throw new Error(`Conflito de horários! Este intervalo se sobrepõe ao horário [${hAbre} - ${hFecha}] já cadastrado.`);
      }
    }
    console.log("✅ NENHUM CONFLITO ENCONTRADO.");
  }

  async createHorario(data: {
    diaSemana: string;
    horaAbre: string;
    horaFecha: string;
  }) {
    const abre = parseTimeToISO(data.horaAbre);
    const fecha = parseTimeToISO(data.horaFecha);

    await this.checkOverlap(data.diaSemana, abre, fecha);

    return await this.db.horario_funcionamento.create({
      data: {
        diaSemana: data.diaSemana,
        horaAbre: abre,
        horaFecha: fecha,
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

    const dia = data.diaSemana || existing.diaSemana;
    const abre = data.horaAbre ? parseTimeToISO(data.horaAbre) : new Date(existing.horaAbre || 0);
    const fecha = data.horaFecha ? parseTimeToISO(data.horaFecha) : new Date(existing.horaFecha || 0);

    await this.checkOverlap(dia as string, abre, fecha, id);

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

  async checkAberto(): Promise<{ aberto: boolean; mensagem: string; proximaAbertura?: string }> {
    // Obter hora atual no fuso de Brasília (America/Sao_Paulo)
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "numeric",
      minute: "numeric",
      weekday: "long",
    });
    
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value;
    
    const currentHour = parseInt(getPart("hour") || "0");
    const currentMinute = parseInt(getPart("minute") || "0");
    const todayNameFull = getPart("weekday") || "";
    
    // Simplificar o nome do dia (ex: "segunda-feira" -> "Segunda")
    const todayName = todayNameFull.split("-")[0].charAt(0).toUpperCase() + todayNameFull.split("-")[0].slice(1);

    const nowMinutes = currentHour * 60 + currentMinute;

    const horarios = await this.db.horario_funcionamento.findMany({
      where: { estabelecimento: this.tenantId },
      include: { dominio: { select: { nome: true } } },
    });

    const todaySchedules = horarios.filter(
      (h: any) => h.dominio?.nome?.toLowerCase().includes(todayName.toLowerCase())
    );

    // 1. Verificar se está aberto agora
    for (const schedule of todaySchedules) {
      if (schedule.horaAbre && schedule.horaFecha) {
        const abre = new Date(schedule.horaAbre);
        const fecha = new Date(schedule.horaFecha);
        const abreMin = abre.getUTCHours() * 60 + abre.getUTCMinutes();
        const fechaMin = fecha.getUTCHours() * 60 + fecha.getUTCMinutes();

        if (nowMinutes >= abreMin && nowMinutes < fechaMin) {
          return { aberto: true, mensagem: "Estamos abertos! Faça seu pedido." };
        }
      }
    }

    // 2. Se fechado, verificar se abre mais tarde hoje
    const upcomingSchedules = todaySchedules
      .map((s: any) => {
        const a = new Date(s.horaAbre);
        const min = a.getUTCHours() * 60 + a.getUTCMinutes();
        return { minutes: min, label: `${String(a.getUTCHours()).padStart(2, "0")}:${String(a.getUTCMinutes()).padStart(2, "0")}` };
      })
      .filter(s => s.minutes > nowMinutes)
      .sort((a, b) => a.minutes - b.minutes);

    if (upcomingSchedules.length > 0) {
      const next = upcomingSchedules[0];
      const diff = next.minutes - nowMinutes;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      
      let tempoMsg = "";
      if (hours > 0) tempoMsg += `${hours}h `;
      if (mins > 0) tempoMsg += `${mins}min`;

      return { 
        aberto: false, 
        mensagem: `Fechado no momento. Abre em ${tempoMsg.trim()} (às ${next.label}).`,
        proximaAbertura: next.label
      };
    }

    if (todaySchedules.length === 0) {
      return { aberto: false, mensagem: `Estamos fechados hoje (${todayName}).` };
    }

    return { aberto: false, mensagem: "Estamos fechados no momento. Volte amanhã!" };
  }
}

function parseTimeToISO(time: string): Date {
  if (!time) return new Date(0);
  
  let h = 0;
  let m = 0;

  if (time.includes("T")) {
    // É uma string ISO completa
    const d = new Date(time);
    h = d.getUTCHours();
    m = d.getUTCMinutes();
  } else {
    // É uma string HH:mm
    const parts = time.split(":");
    h = parseInt(parts[0]) || 0;
    m = parseInt(parts[1]) || 0;
  }

  const d = new Date(0);
  d.setUTCHours(h, m, 0, 0);
  return d;
}
