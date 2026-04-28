import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Enumeração das pastas padrões permitidas para manter organização!
export enum StorageFolder {
  LOGOS = 'logos',
  PRODUTOS = 'produtos',
  BANNERS = 'banners',
  PERFIS = 'perfis',
  GERAL = 'geral'
}

export class StorageService {
  // Define o caminho base como a pasta public/storage do Next.js
  private static readonly baseDir = path.join(process.cwd(), 'public', 'storage');

  /**
   * Salva um Buffer de arquivo no sistema local atuando como um bucket S3
   * @param buffer Buffer do arquivo
   * @param mimeType Tipo do arquivo (ex: image/png)
   * @param folder Pasta padronizada
   * @returns URL pública acessível pelo navegador
   */
  static async uploadFile(buffer: Buffer, mimeType: string, folder: StorageFolder = StorageFolder.GERAL): Promise<string | null> {
    try {
      // Identifica a extensão correta
      let ext = 'png';
      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') ext = 'jpg';
      else if (mimeType === 'image/webp') ext = 'webp';
      else if (mimeType === 'image/svg+xml') ext = 'svg';

      const fileName = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
      const targetDir = path.join(this.baseDir, folder);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const filePath = path.join(targetDir, fileName);
      fs.writeFileSync(filePath, buffer);

      return `/storage/${folder}/${fileName}`;
    } catch (error) {
      console.error("Erro no StorageService (Upload Buffer):", error);
      return null;
    }
  }

  /**
   * Salva um arquivo em base64 no sistema local (Mantido para compatibilidade se necessário)
   */
  static async uploadBase64(base64Data: string, folder: StorageFolder = StorageFolder.GERAL): Promise<string | null> {
    if (!base64Data || !base64Data.startsWith('data:')) {
      return base64Data || null;
    }

    try {
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) throw new Error('Formato inválido');
      
      const buffer = Buffer.from(matches[2], 'base64');
      return await this.uploadFile(buffer, matches[1], folder);
    } catch (error) {
      console.error("Erro no StorageService (Base64):", error);
      return null;
    }
  }

  /**
   * Remove um arquivo do Storage
   */
  static async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl.startsWith('/storage/')) return false;
      const filePath = path.join(process.cwd(), 'public', fileUrl);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro no StorageService (Delete):", error);
      return false;
    }
  }
}
