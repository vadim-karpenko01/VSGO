import {
  getSupabaseBrowserClient,
  getSupabaseConfig,
} from "@/lib/supabase/client";

export type SiteNews = {
  id: number;
  title: string;
  subtitle: string | null;
  body_md: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
};

export type NewsInput = {
  title: string;
  subtitle: string;
  body_md: string;
};

const FALLBACK_BODY_HTML = `<p>Інформація розміщена на офіційній сторінці Фонду <a href="https://www.ispf.gov.ua/" target="_blank" rel="noopener noreferrer">https://www.ispf.gov.ua/</a> в рубриці «Електронний кабінет особи з інвалідністю» та на офіційному веб-сайті Міністерства соціальної політики України <a href="https://ek-cbi.msp.gov.ua/" target="_blank" rel="noopener noreferrer">https://ek-cbi.msp.gov.ua/</a>.</p>
<p>Електронний кабінет особи з інвалідністю розроблено на виконання постанови Кабінету Міністрів України від 5 квітня 2012 р. № 321 «Про затвердження Порядку забезпечення технічними та іншими засобами реабілітації осіб з інвалідністю, дітей з інвалідністю та інших окремих категорій населення і виплати грошової компенсації вартості за самостійно придбані технічні та інші засоби реабілітації, переліків таких засобів» (в редакції постанови Кабінету Міністрів України від 14 квітня 2021 р. № 362) та постанови Кабінету Міністрів України від 16 лютого 2011 р. № 121 «Про затвердження Положення про централізований банк даних з проблем інвалідності» (зі змінами).</p>
<p>Електронний кабінет особи з інвалідністю забезпечує зручний оперативний спосіб подачі пакету документів для забезпечення технічними та іншими засобами реабілітації (далі - ТЗР) онлайн.</p>
<h3>Електронний кабінет особи з інвалідністю забезпечує:</h3>
<ul>
<li>доступ громадянам до електронного кабінету за кваліфікованим електронним підписом (КЕП);</li>
<li>особам, зареєстрованим в ЦБІ, можливість подачі заяв про потребу в забезпеченні ТЗР та пакету документів шляхом заповнення стандартизованих форм, прикріпленні сканованих копій документів та підписання КЕП;</li>
<li>особам, які відсутні в ЦБІ, можливість подачі заяви на первинну реєстрацію в ЦБІ із заповненням стандартної форми реєстрації, прикріпленням сканованих копій необхідних документів та підписом документів КЕП;</li>
<li>можливість надсилання особам з інвалідністю в електронний кабінет повідомлень про результат розгляду заяви про забезпечення ТЗР та пакету документів;</li>
<li>доступ до інтерактивного каталогу ТЗР з розширеними фільтрами, виробників ТЗР, надавачів соціальних послуг;</li>
<li>можливість надсилання інформаційних повідомлень з ЦБІ на електронну скриньку при виникненні подій, про які необхідно повідомити особу з інвалідністю;</li>
<li>проведення опитування осіб з інвалідністю щодо стану забезпечення технічними та іншими засобами реабілітації та оцінки якості наданих послуг;</li>
</ul>`;

export const FALLBACK_NEWS: SiteNews[] = [
  {
    id: -1,
    title: "Соціальні послуги без черг та зайвих витрат",
    subtitle: "Електронний кабінет особи з інвалідністю",
    body_md: FALLBACK_BODY_HTML,
    is_published: true,
    published_at: "2024-01-01T00:00:00.000Z",
    created_at: "2024-01-01T00:00:00.000Z",
  },
];

function plainTextFromHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

const NEWS_SELECT =
  "id, title, subtitle, body_md, is_published, published_at, created_at";

export async function fetchNews(): Promise<{
  news: SiteNews[];
  fromFallback: boolean;
  error: string | null;
}> {
  if (!getSupabaseConfig().isConfigured) {
    return { news: FALLBACK_NEWS, fromFallback: true, error: null };
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { news: FALLBACK_NEWS, fromFallback: true, error: null };
  }

  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    return {
      news: FALLBACK_NEWS,
      fromFallback: true,
      error: error.message,
    };
  }

  return {
    news: (data ?? []) as SiteNews[],
    fromFallback: false,
    error: null,
  };
}

export async function fetchNewsById(
  id: number,
): Promise<{
  item: SiteNews | null;
  fromFallback: boolean;
  error: string | null;
}> {
  if (!Number.isFinite(id)) {
    return { item: null, fromFallback: false, error: "Invalid news id" };
  }

  if (!getSupabaseConfig().isConfigured || id < 0) {
    const item = FALLBACK_NEWS.find((entry) => entry.id === id) ?? null;
    return {
      item: item ?? (id === -1 ? FALLBACK_NEWS[0] : null),
      fromFallback: true,
      error: null,
    };
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { item: FALLBACK_NEWS[0], fromFallback: true, error: null };
  }

  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    return { item: null, fromFallback: false, error: error.message };
  }

  return {
    item: (data as SiteNews | null) ?? null,
    fromFallback: false,
    error: null,
  };
}

export async function createNews(
  input: NewsInput,
): Promise<{ item: SiteNews | null; error: string | null }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      item: null,
      error: "Авторизацію не налаштовано. Зверніться до розробника.",
    };
  }

  const title = input.title.trim();
  const body_md = input.body_md.trim();
  if (!title || !plainTextFromHtml(body_md)) {
    return {
      item: null,
      error: "Заповніть заголовок і текст новини",
    };
  }

  const { data, error } = await supabase
    .from("news")
    .insert({
      title,
      subtitle: input.subtitle.trim(),
      body_md,
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .select(NEWS_SELECT)
    .single();

  if (error) {
    return { item: null, error: error.message };
  }

  return { item: data as SiteNews, error: null };
}

export async function updateNews(
  id: number,
  input: NewsInput,
): Promise<{ item: SiteNews | null; error: string | null }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      item: null,
      error: "Авторизацію не налаштовано. Зверніться до розробника.",
    };
  }

  if (id < 0) {
    return { item: null, error: "Неможливо редагувати локальну новину" };
  }

  const title = input.title.trim();
  const body_md = input.body_md.trim();
  if (!title || !plainTextFromHtml(body_md)) {
    return {
      item: null,
      error: "Заповніть заголовок і текст новини",
    };
  }

  const { data, error } = await supabase
    .from("news")
    .update({
      title,
      subtitle: input.subtitle.trim(),
      body_md,
    })
    .eq("id", id)
    .select(NEWS_SELECT)
    .single();

  if (error) {
    return { item: null, error: error.message };
  }

  return { item: data as SiteNews, error: null };
}

export async function deleteNews(
  id: number,
): Promise<{ error: string | null }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      error: "Авторизацію не налаштовано. Зверніться до розробника.",
    };
  }

  if (id < 0) {
    return { error: "Неможливо видалити локальну новину" };
  }

  const { error } = await supabase.from("news").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export function formatNewsDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
