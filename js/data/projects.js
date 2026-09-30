/*
 * Projects. To add one:
 *  1. put screenshots in assets/img/<slug>/1.webp, 2.webp ... (and a video in assets/video/<slug>.mp4 if you have one)
 *  2. copy an object below and edit it
 * Order here = order on the page. Mosaic pattern that works best: wide, tall, wide, tall, wide, wide, wide.
 *
 * layout: "wide" (landscape tile) or "tall" (portrait tile)
 * aspect: width/height of the screenshots and video, used to size the viewer in the dialog
 * cover:  which screenshot is used on the tile
 * en / ru: everything that needs translating. Empty period/status/highlights are simply not shown.
 */
window.DMK = window.DMK || {};
DMK.projects = [
  {
    slug: "sehrlandiya",
    title: "Sehrlandiya",
    layout: "wide", cover: 3, aspect: "1280 / 576", shots: 4,
    video: "assets/video/sehrlandiya.mp4",
    platforms: ["Android", "iOS"],
    stack: ["Unity", "C#", "Netcode for GameObjects", "Unity Lobby", "Unity Relay", "Addressables", "Unity Localization"],
    links: [{ label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.ITICGame.Sehirlandiya" }],
    en: {
      role: "Game Programmer, multiplayer lead",
      period: "Sep 2025 – Jul 2026",
      status: "Released on Google Play and the App Store",
      summary: "A children's adventure game with team play, mini-games and riddle levels. I built its multiplayer from scratch, then added a single-player mode, fixed bugs and filled the game with content.",
      highlights: [
        "Designed the multiplayer architecture on Netcode for GameObjects, with Unity Lobby and Relay for lobbies and connections.",
        "Shipped the first playable version in three months.",
        "Used Addressables to keep memory under control on large levels.",
        "Added the single-player mode and worked alone on the codebase for the last seven months.",
        "Set up localization with Unity Localization."
      ]
    },
    ru: {
      role: "Game Programmer, ведущий по мультиплееру",
      period: "сен 2025 – июл 2026",
      status: "Вышла в Google Play и App Store",
      summary: "Детская приключенческая игра с командной игрой, мини-играми и уровнями-загадками. Я с нуля сделал её мультиплеер, затем добавил режим одиночной игры, исправлял баги и наполнял игру контентом.",
      highlights: [
        "Спроектировал мультиплеерную архитектуру на Netcode for GameObjects; для лобби и соединений использовал Unity Lobby и Relay.",
        "Выпустил первую играбельную версию за три месяца.",
        "Через Addressables держал под контролем память на больших уровнях.",
        "Добавил режим одиночной игры; последние семь месяцев был единственным программистом проекта.",
        "Настроил локализацию через Unity Localization."
      ]
    }
  },
  {
    slug: "ecogrid",
    title: "EcoGrid",
    layout: "tall", cover: 1, aspect: "720 / 1592", shots: 4,
    video: "assets/video/ecogrid.mp4",
    platforms: ["Android", "iOS"],
    stack: ["Unity", "C#", "Unity Localization", "Unity Profiler"],
    links: [],
    en: {
      role: "Lead Developer",
      period: "Feb – Jul 2026",
      status: "Demo build, in development",
      summary: "A hex-tile puzzle and city builder about growing an eco-friendly city: place tiles to complete each level's goal. A collaboration with Totem Games.",
      highlights: [
        "Worked with a legacy codebase: refactored it and improved the architecture where it mattered.",
        "Built core mechanics and added new ones.",
        "Profiled and optimized performance on mobile devices.",
        "Added localization with Unity Localization.",
        "Re-planned the scope of the demo and alpha builds together with the client."
      ]
    },
    ru: {
      role: "Lead Developer",
      period: "фев – июл 2026",
      status: "Демо-версия, в разработке",
      summary: "Головоломка и градостроительная игра на гексах о создании экологичного города: нужно раскладывать тайлы и выполнять цели уровней. Совместный проект с Totem Games.",
      highlights: [
        "Работал с легаси-кодом: рефакторил его и улучшал архитектуру там, где это было нужно.",
        "Написал основные механики и добавил новые.",
        "Профилировал и оптимизировал производительность на мобильных устройствах.",
        "Добавил локализацию через Unity Localization.",
        "Вместе с клиентом пересмотрел объём работ для демо- и альфа-версий."
      ]
    }
  },
  {
    slug: "driving-simulator",
    title: "Driving Simulator",
    layout: "wide", cover: 2, aspect: "16 / 9", shots: 4,
    video: "assets/video/driving-simulator.mp4",
    platforms: ["PC", "PC VR"],
    stack: ["Unity", "C#", "NVH Vehicle Physics 2", "Logitech G29", "VR"],
    links: [],
    en: {
      role: "Lead Unity Developer, sole programmer",
      period: "2022, two months",
      status: "Demo. Closed at the demo stage for reasons outside the project.",
      summary: "A driving-exam trainer for PC and PC VR. The driver takes a test route, the game checks the traffic rules, takes points off for every violation and gives a pass or fail. Menus are in Russian and Uzbek.",
      highlights: [
        "Integrated the NVH Vehicle Physics 2 asset for realistic car behaviour.",
        "Built the rule checks: speeding, leaving the road, the oncoming lane, running a red light, crossing a stop line without stopping.",
        "Built the scoring that turns violations into the final grade, with voiced announcements of mistakes.",
        "Added a task system, dynamic weather and end-of-exam statistics.",
        "Supported Logitech G29 racing wheels.",
        "Delivered a full-featured demo in two months."
      ]
    },
    ru: {
      role: "Lead Unity Developer, единственный программист",
      period: "2022, два месяца",
      status: "Демо. Закрыт на стадии демо по причинам, не зависящим от проекта.",
      summary: "Тренажёр для сдачи экзамена по вождению на PC и PC VR. Водитель проезжает тестовый маршрут, игра следит за ПДД, снимает баллы за нарушения и выдаёт итог: сдал или не сдал. Меню на русском и узбекском.",
      highlights: [
        "Интегрировал ассет NVH Vehicle Physics 2 для реалистичного поведения автомобиля.",
        "Написал проверки нарушений: превышение скорости, выезд за пределы дороги, встречная полоса, красный свет, стоп-линия без остановки.",
        "Сделал систему оценки, которая превращает нарушения в итоговый балл, с озвучиванием совершённых ошибок.",
        "Добавил систему задач, динамическую погоду и статистику по итогам экзамена.",
        "Поддержал рули Logitech G29.",
        "За два месяца собрал полнофункциональное демо."
      ]
    }
  },
  {
    slug: "hole-control",
    title: "Hole Control",
    layout: "tall", cover: 1, aspect: "498 / 1080", shots: 3,
    video: "assets/video/hole-control.mp4", loop: true,
    platforms: ["Android", "iOS"],
    stack: ["Unity", "C#", "Ads", "Analytics"],
    links: [],
    en: {
      role: "Game Programmer",
      period: "",
      status: "",
      summary: "A casual mobile game where you steer a hole around a table and swallow objects before the timer runs out.",
      highlights: [
        "Fixed bugs in the game logic and the UI.",
        "Integrated ads and analytics."
      ]
    },
    ru: {
      role: "Game Programmer",
      period: "",
      status: "",
      summary: "Казуальная мобильная игра: нужно водить дыру по столу и поглощать предметы, пока не вышло время.",
      highlights: [
        "Исправлял баги в логике игры и в интерфейсе.",
        "Интегрировал рекламу и аналитику."
      ]
    }
  },
  {
    slug: "vr-anatomy",
    title: "VR Anatomy",
    layout: "wide", cover: 3, aspect: "1280 / 560", shots: 4,
    video: "assets/video/vr-anatomy.mp4",
    platforms: ["Oculus Quest 2"],
    stack: ["Unity", "C#", "VR interaction", "3D content integration"],
    links: [],
    en: {
      role: "Sole Unity programmer",
      period: "Four months, at VRonica",
      status: "Completed and delivered (B2B, for medical institutes)",
      summary: "An educational VR app for studying human anatomy. The student switches between skin, muscles, skeleton, organs and body systems, cuts the body along planes and reads the labelled parts.",
      highlights: [
        "Designed the whole project architecture as the only programmer, working with a 3D artist and a project manager.",
        "Built the navigation and interaction system.",
        "Integrated the 3D models of organs and the reference information.",
        "The client was happy with the result."
      ]
    },
    ru: {
      role: "Единственный Unity-программист",
      period: "Четыре месяца, в VRonica",
      status: "Завершён и сдан заказчику (B2B, для медицинских институтов)",
      summary: "Образовательное VR-приложение для изучения анатомии человека. Студент переключает слои: кожа, мышцы, скелет, органы и системы организма, делает разрезы по плоскостям и читает подписи к частям тела.",
      highlights: [
        "Спроектировал архитектуру всего проекта как единственный программист, в команде с 3D-художником и проджект-менеджером.",
        "Сделал систему навигации и взаимодействия.",
        "Интегрировал 3D-модели органов и справочную информацию.",
        "Заказчик остался доволен результатом."
      ]
    }
  },
  {
    slug: "shoot-em-up",
    title: "Shoot 'Em Up",
    layout: "wide", cover: 2, aspect: "1274 / 678", shots: 4,
    video: "assets/video/shoot-em-up.mp4",
    platforms: ["PC"],
    stack: ["Unreal Engine 4", "C++"],
    links: [],
    en: {
      role: "Learning project",
      period: "",
      status: "Built along a Udemy course",
      summary: "A shooter I built in Unreal Engine 4 while following a Udemy course. The codebase is written in C++.",
      highlights: [
        "Round-based matches with a timer, kill counter and final scoreboard.",
        "Main menu with level select.",
        "Health and ammo display on the HUD."
      ]
    },
    ru: {
      role: "Учебный проект",
      period: "",
      status: "Сделан по курсу на Udemy",
      summary: "Шутер, который я сделал на Unreal Engine 4, проходя курс на Udemy. Кодовая база написана на C++.",
      highlights: [
        "Матчи по раундам с таймером, счётчиком убийств и итоговой таблицей результатов.",
        "Главное меню с выбором уровня.",
        "Индикаторы здоровья и патронов на HUD."
      ]
    }
  },
  {
    slug: "castle-siege",
    title: "Castle Siege",
    layout: "wide", cover: 2, aspect: "1000 / 562", shots: 4,
    video: "assets/video/castle-siege.mp4",
    platforms: ["Mobile"],
    stack: ["Unity", "C#"],
    links: [],
    en: {
      role: "Game Programmer",
      period: "",
      status: "Demo build. Not on the stores at the moment.",
      summary: "A hyper-casual mobile game I worked on at VRonica for the publisher Voodoo. The video is a demo build.",
      highlights: []
    },
    ru: {
      role: "Game Programmer",
      period: "",
      status: "Демо-версия. Сейчас в сторах её нет.",
      summary: "Гипер-казуальная мобильная игра, над которой я работал в VRonica для издателя Voodoo. На видео демо-версия.",
      highlights: []
    }
  }
];
