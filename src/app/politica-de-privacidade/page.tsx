"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para a Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-10 md:p-16 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck className="w-40 h-40" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Política de Privacidade
          </h1>
          
          <div className="space-y-8 text-white/70 leading-relaxed text-lg">
            <p>
              Com o objetivo de proteger os direitos fundamentais de liberdade e de privacidade e o livre desenvolvimento da personalidade da pessoa natural, a <strong>AKIPEDE</strong> elaborou a presente Política de Privacidade, observadas as disposições da Lei Geral de Proteção de Dados Pessoais (<strong>LGPD</strong>) – Lei n° 13.709/2018.
            </p>

            <p>
              É fundamental dedicar um momento para se familiarizar com nossas práticas de privacidade e fale conosco se tiver dúvidas.
            </p>

            <p>
              Para nós é importante ser transparente sobre o tratamento dos dados pessoais dos Usuários que utilizam os Serviços oferecidos pela <strong>AKIPEDE</strong>, nos termos do Artigo 9º da <strong>LGPD</strong>. Esta Política se aplica quando o Usuário utiliza os nossos Serviços.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                VERACIDADE DAS INFORMAÇÕES
              </h2>
              <p>
                Toda e qualquer informação prestada pelo Usuário à <strong>AKIPEDE</strong>, principalmente seus dados pessoais, deverão ser verídicos e não podem violar a legislação brasileira, principalmente à <strong>LGPD</strong>. Caso a <strong>AKIPEDE</strong> verifique que as informações fornecidas sejam inverídicas, esta poderá excluir os dados pessoais, bem como encerrar a conta deste Usuário.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">O QUE SÃO DADOS PESSOAIS E DADOS SENSÍVEIS?</h2>
              <p>
                Vamos entender qual o objeto de proteção desta Política. Em primeiro lugar, é importante saber que os “DADOS PESSOAIS” são informações que podem ser usadas para identificar uma pessoa natural (física), sendo assim, dados de empresas (pessoas jurídicas) como razão social e <strong>CNPJ</strong> não são abarcados por esta política.
              </p>
              <p>
                Os “DADOS PESSOAIS SENSÍVEIS”, de acordo com a LGPD, consistem em informações sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou organização de caráter religioso, filosófico ou político, ou até mesmo dado referente à saúde ou à vida sexual, dado genético ou biométrico, e também são abarcados nesta política.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">AKIPEDE COMO CONTROLADORA</h2>
              <p>
                É importante informar que a <strong>AKIPEDE</strong> figura como Controladora dos Dados Pessoais coletados. Mas o que isso significa? De acordo com a <strong>LGPD</strong> a <strong>AKIPEDE</strong> é responsável por tomar as decisões referentes ao tratamento dos Dados Pessoais de seus Usuários.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">QUAIS TIPOS DE DADOS PESSOAIS SÃO COLETADOS PELA AKIPEDE?</h2>
              <p>
                Considerando que a <strong>AKIPEDE</strong> oferece seus Serviços por meio de um sistema web, é necessário que a pessoa interessada em utilizar os Serviços da <strong>AKIPEDE</strong>, em primeiro lugar, realize um cadastro. Esse cadastro inicial é chamado de Cadastro do Usuário.
              </p>
              <p>No Cadastro do Usuário são coletados os seguintes Dados Pessoais:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nome completo;</li>
                <li>Email;</li>
                <li>CPF/CNPJ;</li>
                <li>Nome do Estabelecimento;</li>
                <li>Nº celular; e</li>
                <li>Endereço;</li>
              </ul>
              <p>
                Referidos Dados Pessoais são coletados com a finalidade de identificar qual o contexto do Usuário em relação ao assunto, de forma a permitir que a <strong>AKIPEDE</strong> consiga oferecer conteúdo específico e apresentar Usuários com o mesmo perfil e as mesmas necessidades.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">DONOS DE ESTABELECIMENTO NA PLATAFORMA</h2>
              <p>
                O nome completo é importante para identificar a pessoa do Usuário; o nome do estabelecimento é importante para o usuário que realiza o pedido identifique de onde esta sendo feito; o email e o número de celular são necessário pois através deles o usuário receberá as notificação de novidades, promoções e cupons de desconto; o CPF/CNPJ e o endereço são indispensável para quando emitirmos uma cobrança por boleto pois esses dados são obrigatórios para gerar a cobrança.
              </p>
              <p>
                É importante informar que os Dados Pessoais acima elencados são tratados, apenas e tão somente, com a finalidade de identificar o usuário, emitir cobranças e otimizar sua experiência com o uso do sistema web.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">USUÁRIOS QUE REALIZAM PEDIDOS</h2>
              <p>
                O nome completo é importante para identificar a pessoa do Usuário; o email é utilizado enviar notificação de novidades, promoções e cupons de desconto.
              </p>
              <p>
                É importante informar que os Dados Pessoais acima elencados são tratados, apenas e tão somente, com a finalidade de identificar o usuário e otimizar sua experiência com o uso do sistema web.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">COMO A AKIPEDE ARMAZENA OS DADOS PESSOAIS?</h2>
              <p>
                A <strong>AKIPEDE</strong> utiliza infraestrutura de alta performance para armazenar e hospedar sua aplicação. Por essa razão, a eventual transferência internacional de dados pessoais pela <strong>AKIPEDE</strong> obedece o inciso I do artigo 33 da <strong>LGPD</strong>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Lock className="w-6 h-6 text-blue-400" />
                COMO A AKIPEDE GARANTE A SEGURANÇA DAS INFORMAÇÕES?
              </h2>
              <p>
                Conforme previsto nos incisos VII e VIII do Artigo 6º da <strong>LGPD</strong>, que tratam do princípio da segurança e prevenção, respectivamente, a <strong>AKIPEDE</strong> utiliza os mais modernos recursos existentes na área de segurança da informação para o ambiente da internet, garantindo assim seu acesso de forma segura.
              </p>
              <p>
                As informações transmitidas entre O Usuário e a <strong>AKIPEDE</strong> passam por um processo de criptografia utilizando o SSL (Secure Sockets Layer), permitindo a decodificação dos dados, de forma legível, apenas para o Usuário e para nosso site e sistema web.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">QUAL A DURAÇÃO DO TRATAMENTO DE DADOS PESSOAIS PELA AKIPEDE?</h2>
              <p>
                Os Dados Pessoais e os Dados Pessoais Sensíveis mencionados nesta Política serão tratados durante a execução dos Serviços oferecidos pela <strong>AKIPEDE</strong>. Após o encerramento dos Serviços, por qualquer motivo, os Dados Pessoais permanecerão armazenados pela <strong>AKIPEDE</strong> pelo período de até 3 anos. Após referido prazo, a <strong>AKIPEDE</strong> eliminará de seu repositório os Dados Pessoais do Usuário.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-400" />
                DO DIREITO DO USUÁRIO
              </h2>
              <p>
                Conforme previsto no Artigo 18 da <strong>LGPD</strong>, é assegurado ao Usuário, a qualquer momento, mediante requisição à Empresa por meio do e-mail <strong>suporte@akipede.com.br</strong>, requerer o acesso, correção, anonimização ou exclusão de seus dados.
              </p>
            </section>

            <section className="space-y-4 pt-8 border-t border-white/5">
              <p className="font-bold text-white">ENCARREGADO DA EMPRESA</p>
              <p>
                Caso o Usuário tenha qualquer dúvida em relação ao tratamento de seus Dados Pessoais, basta entrar em contato com o Encarregado da <strong>AKIPEDE</strong>, o Sr. <strong>Carlos César</strong> por meio do e-mail <strong>suporte@akipede.com.br</strong>.
              </p>
            </section>
          </div>
        </motion.div>

        <div className="mt-12 text-center text-white/30 text-sm">
          Última atualização: 23 de Abril de 2024 • Akipede - Delivery
        </div>
      </div>
    </div>
  );
}
