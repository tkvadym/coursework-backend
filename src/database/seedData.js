const ExhibitionService = require("../services/ExhibitionService");
const GalleryService = require("../services/GalleryService");
const { sequelize } = require("../models");

UPLOADS_BASE_URL =
  "https://feisty-flexibility-production.up.railway.app/uploads";

/**
 * Тестові дані для наповнення таблиці виставок
 */
const exhibitionsData = [
  {
    title: "Олександр Ройтбурд. Теорема влади",
    description:
      "Виставка є результатом діяльності Дослідницької платформи PinchukArtCentre, яка осмислює взаємодію художника, мистецтва та влади.",
    detail_description:
      "Олександр Ройтбурд вважав, що митцю природно належить влада впливати на світ, та присвятив своє життя втіленню цієї візії. У своєму мистецтві він оприявнював різні втілення влади: через mythи та забобони, вершини світового інтелектуального та художнього надбання, тілесне та підсвідоме, політичні ідеології та образи конкретних державних діячів.",
    location: "PinchukArtCentre",
    startDate: "2024-03-08",
    endDate: "2024-07-14",
    image: `${UPLOADS_BASE_URL}/oleksandr-rojtburd-teorema-vlady-1.webp`,
    category: "Сучасне мистецтво",
    organizer: "Костянтин Дорошенко, Олександр Бурлака",
  },
  {
    title:
      "Виставка 21 номінантки та номінанта на Премію Future Generation Art Prize 2024",
    description:
      "PinchukArtCentre представляє виставку 21 номінантки та номінанта 7-ї Премії Future Generation Art Prize, що зосередиться на демонстрації найактуальніших творчих тенденцій нового покоління художників.",
    detail_description:
      "Заснована Фондом Віктора Пінчука в 2009 році, Future Generation Art Prize — це міжнародна премія в галузі сучасного мистецтва, метою якої є відкриття нових імен та надання довгострокової підтримки майбутньому поколінню художни_ць. Виставка об'єднує унікальні культурні перспективи та практики для залучення до обговорення нагальних питань сьогодення.",
    location: "PinchukArtCentre",
    startDate: "2024-10-04",
    endDate: "2025-01-19",
    image: `${UPLOADS_BASE_URL}/future-generation-art-prize-2024.webp`,
    category: "Декоративне мистецтво",
    organizer: "Інга Лаце, Олександра Погребняк, Дар'я Шевцова",
  },
  {
    title: "Коли віра зрушує гори",
    description:
      "Масштабна групова виставка за участю понад 45 українських і міжнародних митців і мисткинь, представлена у партнерстві з бельгійським Музеєм сучасного мистецтва в Антверпені M HKA та урядом Фландрії.",
    detail_description:
      "Виставка представить роботи з M HKA/колекції Фламандської спільноти, відібрані завдяки емансипаційному характеру та здатності відкривати нові можливості. В експозиції твори з бельгійської колекції вступають у діалог із роботами українських митців та мисткинь, більшість яких була створена під час війни. Виставка спонукає відчувати, розмірковувати та рефлексувати поза межами негайних викликів війни.",
    location: "PinchukArtCentre",
    startDate: "2022-07-17",
    endDate: "2022-10-09",
    image: `${UPLOADS_BASE_URL}/when-faith-moves-mountains-ua.webp`,
    category: "Інсталяція",
    organizer:
      "Барт де Баре, Бйорн Гельдхоф, Ксенія Малих, Ярема Малащук, Роман Хімей",
  },
  {
    title: "Дім російських воєнних злочинів",
    description:
      "Виставка фотографій, що фіксують воєнні злочини, вчинені російськими окупантами в Україні. Проєкт був представлений під час всесвітнього економічного форуму в Давосі у колишньому 'Російському домі'.",
    detail_description:
      "Фотографії були зроблені в різних куточках України від першого дня вторгнення і до початку липня 2022 року. Кульмінація проєкту – відео Олексія Сая, що об'єднує 6400 зображень воєнних злочинів. Проєкт створений для привернення уваги світової спільноти до російської агресії проти України.",
    location: "Давос, штаб-квартира НАТО, Європарламент",
    startDate: "2022-05-23",
    endDate: "2022-05-30",
    image: `${UPLOADS_BASE_URL}/russian-war-crimes-ua.webp`,
    category: "Фотографія",
    organizer: "Бйорн Гельдхоф, Ксенія Малих",
  },
  {
    title: "Камінь б'є камінь",
    description:
      "Перша персональна виставка Нікіти Кадана в Україні, організована в контексті діяльності Дослідницької платформи PinchukArtCentre. Демонструє як новостворені, так і існуючі роботи художника.",
    detail_description:
      "Виставка є рефлексією на теми української історії, політичного насильства, національного історичного спадку, авангарду та радянської утопії. Досліджує виклики теперішнього часу в нерозривному зв'язку з минулим, використовуючи історію, щоб освітити сьогодення та уявити майбутнє. Виставка починається з 'флешбеку', що проявляється в інтуїтивній художньо-історичній рефлексії, здебільшого через роботи українського авангарду. Кадан наново інтерпретує історичні події, об'єкти та образи з огляду на гостру потребу сьогодення протистояти геополітичним помилкам, імперіалістській агресії та праворадикальним ідеологіям.",
    location: "PinchukArtCentre",
    startDate: "2023-09-15",
    endDate: "2024-01-28",
    image: `${UPLOADS_BASE_URL}/stone-hits-stone-ua.webp`,
    category: "Сучасне мистецтво",
    organizer: "Бйорн Гельдхоф, Катерина Яковленко, Дана Косміна",
  },
  {
    title: "Згадати той день коли",
    description:
      "Групова виставка українських митців, що поєднує роботи з колекції PinchukArtCentre з новими спеціально створеними роботами. Перший проект в рамках нової серії виставок українського мистецтва.",
    detail_description:
      "Розповідь про події, які вплинули на хід історії України та суспільство: від Голодомору через Перебудову, 1990-ті, Помаранчеву революцію, Революцію гідності та дотепер. Виставка демонструє блискавичну швидкість, з якою Україна змінювалася протягом останніх трьох десятиліть. Залучаючи різні покоління українських художників до діалогу, виставка показує, як митці рефлексували історичні події й процеси, і як їхні роботи знаходять нову актуальність через плин часу. Виставка складається з двох розділів: перший зосереджує увагу на емоційних переживаннях та психологічних портретах суспільства, другий присвячено зміні погляду на минуле та уявленню про майбутнє.",
    location: "PinchukArtCentre",
    startDate: "2021-02-27",
    endDate: "2021-08-15",
    image: `${UPLOADS_BASE_URL}/remember-yesterday-ua.webp`,
    category: "Сучасне мистецтво",
    organizer: "Бйорн Гельдхоф, Ксенія Малих, Дана Косміна",
  },
  {
    title: "Свій простір",
    description:
      "Групова виставка Дослідницької платформи PinchukArtCentre, що пропонує один із можливих поглядів на історію українського мистецтва та позицію жінки в ній, наголошуючи на виняткових художніх феноменах.",
    detail_description:
      "Назва виставки відсилає до есе Вірджинії Вулф «Своя кімната» (1929), пропонуючи задуматися, що є «простором» жінки в сучасному українському суспільстві. Виставка не дає чітких означень, радше ставить питання про зону комфорту, свободи, місце для висловлювання. Умовно складається з трьох розділів, у яких по-різному трактується ідея простору як вимушеного/прихованого, політичного/маніфестаційного, тілесного/чуттєвого. «Простори» конструюються навколо діалогів між творами сучасних художників і художниць та історичними феноменами: агітаційний плакат 1920–1930-х років, радянське монументальне мистецтво, «народна творчість». Особливе місце займає відтворена «своя кімната» Поліни Райко (1928–2004) — художниці з Херсонської області, яка створила власну іконографічну систему у своєму будинку.",
    location: "PinchukArtCentre",
    startDate: "2018-10-30",
    endDate: "2019-01-06",
    image: `${UPLOADS_BASE_URL}/aspaceofonesown.webp`,
    category: "Сучасне мистецтво",
    organizer: "Тетяна Кочубінська, Тетяна Жмурко",
  },
];

/**
 * Тестові дані для наповнення таблиці галереї
 * Картини будуть додані до відповідних виставок після їх створення
 */
const galleryDataByExhibition = [
  // Картини для виставки "Сучасне українське мистецтво"
  [
    {
      title: "Автопортрет із проєкту 'Вправи на розкутість'",
      artist: "Олександр Ройтбурд",
      description: "Надано родиною художника. Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/oleksandr-rojtburd-teorema-vlady-1___img1.webp`,
    },
    {
      title: "Автопортрет",
      artist: "Олександр Ройтбурд",
      description: "Надано родиною художника. Полотно олія. Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/oleksandr-rojtburd-teorema-vlady-1___img2.webp`,
    },
    {
      title: "Будда повалений",
      artist: "Олександр Ройтбурд",
      description: "Полотно олія. Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/oleksandr-rojtburd-teorema-vlady-1___img3.webp`,
    },
  ],
  [
    // Картини для виставки "Future Generation Art Prize 2024"
    {
      title: "Відображення майбутнього",
      artist: "Сінзо Аанза",
      description: "Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/future-generation-art-prize-2024___img1.webp`,
    },
    {
      title: "Людська композиція",
      artist: "Вероніка Гапченко",
      description: "Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/future-generation-art-prize-2024___img2.webp`,
    },
  ],
  [
    // Картини для виставки "Коли віра зрушує гори"
    {
      title: "Бомбозховище",
      artist: "Kinder Album",
      description:
        "Робота Бомбосховище входить до серії 'Воєнний альбом', що його створює Kinder Album з початку повномасштабного вторгнення Росії до України, фіксуючи найбільш резонансні художні образи, що виникають у воєнному повсякденні",
      imageUrl: `${UPLOADS_BASE_URL}/when-faith-moves-mountains-ua___img1.webp`,
    },
    {
      title: "Жертвопринесення",
      artist: "Мерлен Дюма",
      description:
        "Марлен Дюма самотужки збирає та реставрує старі фотографії та кіноплівки, які потім використовує при створенні своїх робіт. Точно вказати, як народилась ідея цього твору, неможливо, оскільки задум художниці можна оцінювати лише виходячи з її робіт. Назва роботи, стиль її виконання та кольорова гама наводять на враження, що тут зображено емоційно забарвлену подію, та ми не знаємо точно, яка це подія. У цій картині, як і в багатьох інших, Дюма залишає широкий простір для інтерпретації",
      imageUrl: `${UPLOADS_BASE_URL}/when-faith-moves-mountains-ua___img2.webp`,
    },
  ],
  [
    // Картини для виставки "Дім російських воєнних злочинів"
    {
      title: "Житловий будинок на проспекті Лобановського, м. Київ",
      artist: "Максим Дондюк",
      description:
        "Житловий будинок на проспекті Лобановського, в який влучив снаряд. В частині будинку, на трьох поверхах — з 18 по 20-й, зруйновано квартири. За словами рятувальників, постраждалих немає. Більшість мешканців на момент удару перебували в укритті.",
      imageUrl: `${UPLOADS_BASE_URL}/russian-war-crimes-ua___img1.webp`,
    },
    {
      title: "Медичний працівник",
      artist: "Мстислав Чернов",
      description:
        "Медичний працівник йде вестибюлем постраждалого внаслідок обстрілу пологового будинку в Маріуполі",
      imageUrl: `${UPLOADS_BASE_URL}/russian-war-crimes-ua___img2.webp`,
    },
  ],
  [
    // Картини для виставки "Камінь б'є камінь"
    {
      title: "Ескіз пам'ятника «Монумент Ленінської Епохи»",
      artist: "Василь Єрмілов",
      description:
        "Ескіз пам'ятника «Монумент Ленінської Епохи», 1961. Папір, акварель, графічний олівець",
      imageUrl: `${UPLOADS_BASE_URL}/stone-hits-stone-ua___img1.webp`,
    },
    {
      title: "У селі (Об'їжджають коня)",
      artist: "Віктор Пальмов",
      description:
        "У селі (Об'їжджають коня), 1927. Полотно, олія. Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/stone-hits-stone-ua___img2.webp`,
    },

    {
      title: "Червона Україна",
      artist: "Василь Єрмілов",
      description:
        "Ескіз розпису агітпотягу, 1919. Папір, акварель. Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/stone-hits-stone-ua___img3.webp`,
    },
  ],
  [
    // Картини для виставки "Згадати той день коли"
    {
      title: "Ніжки, як тростиночки",
      artist: "Юлія Бєляєва",
      description:
        "Ніжки, як тростиночки, 2021. Порцеляна, бісквіт. Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/stone-hits-stone-ua___img4.webp`,
    },

    {
      title: "Копія картини Віктора Пузиркова «Чорноморці» 1947",
      artist: "Леся Хоменко",
      description:
        "Копія картини Віктора Пузиркова «Чорноморці» 1947 (2011). Полотно, акрил. Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/stone-hits-stone-ua___img2.webp`,
    },
  ],
  [
    // Картини для виставки "Свій простір"

    {
      title: "Розпис Поліни Райко",
      artist: "Поліна Райко",
      description:
        "Розпис Поліни Райко (1928–2004). Папір, акварель. Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/stone-hits-stone-ua___img1.webp`,
    },
    {
      title: "Велика сварка",
      artist: "Марія Примаченко",
      description:
        "Велика сварка, 1936 та Коричневий звір, 1936. Папір, акварель. Фото в експозиції",
      imageUrl: `${UPLOADS_BASE_URL}/stone-hits-stone-ua___img2.webp`,
    },
  ],
];

/**
 * Функція для наповнення бази даних тестовими даними
 */
async function seedDatabase() {
  try {
    console.log("Початок наповнення бази даних...");

    // Синхронізуємо моделі з базою даних (очищаємо існуючі дані)
    await sequelize.sync({ force: true });
    console.log("База даних синхронізована та очищена");

    // Створюємо виставки через сервіс
    console.log("Створення виставок...");
    const createdExhibitions = [];

    for (const exhibitionData of exhibitionsData) {
      const exhibition = await ExhibitionService.createExhibition(
        exhibitionData
      );
      createdExhibitions.push(exhibition);
      console.log(`Створено виставку: ${exhibition.title}`);
    }

    console.log(`Створено ${createdExhibitions.length} виставок`);

    // Додаємо картини до кожної виставки через сервіс
    console.log("Додавання картин до галереї...");
    let totalArtworks = 0;

    for (let i = 0; i < createdExhibitions.length; i++) {
      const exhibition = createdExhibitions[i];
      const artworksForExhibition = galleryDataByExhibition[i] || [];

      for (const artworkData of artworksForExhibition) {
        await GalleryService.addArtworkToExhibition(exhibition.id, artworkData);
        console.log(
          `Додано картину "${artworkData.title}" до виставки "${exhibition.title}"`
        );
        totalArtworks++;
      }
    }

    console.log(`Додано ${totalArtworks} картин до галереї`);

    // Отримуємо та виводимо статистику
    const stats = await ExhibitionService.getExhibitionsStats();
    console.log("\n=== Статистика наповнення бази даних ===");
    console.log(`Загальна кількість виставок: ${stats.total}`);
    console.log(`Активні виставки: ${stats.active}`);
    console.log(`Майбутні виставки: ${stats.upcoming}`);
    console.log(`Минулі виставки: ${stats.past}`);
    console.log(`Загальна кількість картин: ${totalArtworks}`);
    console.log("\nРозподіл за категоріями:");
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });

    console.log("\nНаповнення бази даних завершено успішно!");
  } catch (error) {
    console.error("Помилка при наповненні бази даних:", error);
    throw error;
  }
}

module.exports = {
  seedDatabase,
  exhibitionsData,
  galleryDataByExhibition,
};
