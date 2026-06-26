"use client";
import { useLang } from "@/lib/i18n";

export default function Privacy() {
  const { lang } = useLang();
  const ru = lang === "ru";

  const updated = ru ? "Обновлено: 9 июня 2026 г." : "Last updated: June 9, 2026";

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "120px 24px 100px" }}>
      <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14 }}>
        {ru ? "Правовая информация" : "Legal"}
      </div>
      <h1 style={{ fontSize: "clamp(30px,5vw,48px)", margin: "0 0 10px", lineHeight: 1.06 }}>
        {ru ? "Политика конфиденциальности" : "Privacy Policy"}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 40px" }}>{updated}</p>

      <div style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text)" }}>
        {ru ? <RU /> : <EN />}
      </div>

      <div style={{ marginTop: 48, padding: 24, background: "var(--surface)", borderRadius: 14, border: "1px solid var(--line)" }}>
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 10 }}>
          {ru ? "Контакт по вопросам конфиденциальности" : "Privacy contact"}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.7 }}>
          PRO MIAMI REALTY<br />
          Ays Iziken · FL License #3517956<br />
          3350 SW 148 Ave, Suite 110, Miramar, FL 33027<br />
          <a href="mailto:info@promiamirealty.com" style={{ color: "var(--coral)", textDecoration: "none" }}>info@promiamirealty.com</a> · (305) 766-5513
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 22, margin: "0 0 10px" }}>{title}</h2>
      <div style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function EN() {
  return (
    <>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        This Privacy Policy explains how PRO MIAMI REALTY ("we," "us," or "our") collects, uses, and protects
        information when you use our website and related services. By using this site, you agree to the practices
        described below.
      </p>

      <Section title="Information we collect">
        We collect information you choose to provide, including: your name, email address, and phone number when you
        submit a contact form, request a home valuation, or book a consultation; transaction details you enter (such as
        buyer, seller, property, and price information) when you request contract help; and any documents (PDFs) you
        upload for review. We also collect basic technical data such as your browser type and pages visited, used only
        to keep the site working and secure.
      </Section>

      <Section title="How we use your information">
        We use your information to respond to your inquiries, prepare and review real estate documents on your behalf,
        schedule consultations, process service payments, and provide the services you request. A licensed real estate
        agent reviews and finalizes any document before it is sent back to you.
      </Section>

      <Section title="Third-party services">
        We use trusted third-party providers to operate the site and deliver services. These include: Stripe (payment
        processing — we never store your full card details), Calendly (appointment booking), Supabase (secure data and
        file storage), Resend (email notifications), and Vercel (website hosting). Where you request transaction
        document assistance, we may use dotloop to prepare and manage real estate transaction documents; in that case
        the information you provide is written into the agent's dotloop account so the licensed agent can review and
        finalize it. Each provider processes data only as needed to deliver its service.
      </Section>

      <Section title="MLS / IDX listing data">
        Property listing data displayed on this site is provided by the applicable Multiple Listing Service (MLS) and
        remains the property of that MLS. It is provided for your personal, non-commercial use to identify properties
        you may be interested in, and may not be copied, redistributed, or used for any other purpose.
      </Section>

      <Section title="How we protect your data">
        Uploaded documents are stored in private, access-controlled storage and are shared only through secure,
        time-limited links. We restrict access to your information to the agent and the systems needed to provide the
        service. No method of transmission over the internet is completely secure, but we take reasonable measures to
        protect your data.
      </Section>

      <Section title="Data retention">
        We keep your information only as long as needed to provide the services you requested and to meet legal or
        record-keeping obligations, after which it is deleted or anonymized.
      </Section>

      <Section title="Your choices">
        You may request access to, correction of, or deletion of the personal information we hold about you by
        contacting us at the address below. You may also opt out of non-essential communications at any time.
      </Section>

      <Section title="Changes to this policy">
        We may update this Privacy Policy from time to time. The "Last updated" date above reflects the most recent
        version.
      </Section>
    </>
  );
}

function RU() {
  return (
    <>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Настоящая Политика конфиденциальности описывает, как PRO MIAMI REALTY («мы») собирает, использует и защищает
        информацию при использовании вами нашего сайта и связанных услуг. Используя сайт, вы соглашаетесь с описанными
        ниже принципами.
      </p>

      <Section title="Какие данные мы собираем">
        Мы собираем данные, которые вы предоставляете сами: имя, email и телефон при отправке формы обратной связи,
        запросе оценки жилья или записи на консультацию; данные сделки (например, покупатель, продавец, объект, цена),
        которые вы вводите при запросе помощи с договором; а также документы (PDF), которые вы загружаете для проверки.
        Мы также собираем базовые технические данные (тип браузера, посещённые страницы) — только для работы и
        безопасности сайта.
      </Section>

      <Section title="Как мы используем данные">
        Мы используем информацию, чтобы отвечать на ваши обращения, готовить и проверять документы по недвижимости от
        вашего имени, назначать консультации, обрабатывать оплату услуг и оказывать запрошенные услуги. Любой документ
        проверяет и финализирует лицензированный агент перед отправкой вам.
      </Section>

      <Section title="Сторонние сервисы">
        Для работы сайта и оказания услуг мы используем проверенных сторонних поставщиков: Stripe (обработка платежей —
        мы не храним полные данные вашей карты), Calendly (запись на встречи), Supabase (защищённое хранение данных и
        файлов), Resend (email-уведомления) и Vercel (хостинг сайта). При запросе помощи с документами сделки мы можем
        использовать dotloop для подготовки и ведения документов по сделке; в этом случае предоставленные вами данные
        вносятся в аккаунт агента в dotloop, чтобы лицензированный агент мог их проверить и финализировать. Каждый
        поставщик обрабатывает данные только в объёме, необходимом для его услуги.
      </Section>

      <Section title="Данные листингов MLS / IDX">
        Данные о листингах на сайте предоставляются соответствующей службой Multiple Listing Service (MLS) и остаются её
        собственностью. Они предоставляются для вашего личного некоммерческого использования с целью подбора интересных
        вам объектов и не могут копироваться, перепродаваться или использоваться в иных целях.
      </Section>

      <Section title="Как мы защищаем данные">
        Загруженные документы хранятся в приватном хранилище с контролем доступа и передаются только по защищённым
        ссылкам с ограниченным сроком действия. Доступ к вашим данным имеют только агент и системы, необходимые для
        оказания услуги. Ни один способ передачи данных через интернет не является абсолютно безопасным, но мы принимаем
        разумные меры для защиты ваших данных.
      </Section>

      <Section title="Срок хранения">
        Мы храним ваши данные только столько, сколько необходимо для оказания запрошенных услуг и выполнения
        юридических обязательств, после чего они удаляются или обезличиваются.
      </Section>

      <Section title="Ваши права">
        Вы можете запросить доступ к своим персональным данным, их исправление или удаление, написав нам по адресу ниже.
        Вы также можете в любой момент отказаться от необязательных рассылок.
      </Section>

      <Section title="Изменения политики">
        Мы можем периодически обновлять эту Политику. Дата «Обновлено» вверху отражает последнюю версию.
      </Section>
    </>
  );
}
