export const landingTranslations = {
  en: {
    hero: {
      pill: 'Every day, again.',
      headline1: 'What if you never',
      headline2: 'stopped trying.',
      subtext: "The art of persisting. Of showing up. Block Lotto makes it easy for you—your instance runs in the background, every 10 minutes, another chance. When it's your turn, ",
      subtextHighlight: 'the reward finds you',
      subtextEnd: '.',
      counterLabel: 'still trying',
      ctaStart: 'Start Playing',
      seeLive: 'See live lottos →',
    },
    keyNumbers: [
      { value: '3.125', unit: 'BTC', label: "When it's your block—sent straight to you" },
      { value: '10', unit: 'min', label: 'Your instance keeps going—automatically, no action required' },
      { value: '$10', unit: '/mo', label: 'Per instance—one-time setup, runs on its own' },
    ],
    howItWorks: {
      subtitle: 'Show up. Again.',
      title: 'How it works',
      steps: [
        {
          number: '01',
          title: 'Create an instance',
          desc: 'Your Bitcoin address, once. Block Lotto takes it from there—your instance runs for 30 days, quietly, in the background.',
        },
        {
          number: '02',
          title: "It tries. You don't have to.",
          desc: 'Every 10 minutes, another attempt. No grind, no routine—Block Lotto makes it easy. You live your day; your instance keeps showing up.',
        },
        {
          number: '03',
          title: "When it's your turn",
          desc: 'One block. The full reward finds your address. No cuts, no middlemen—just the art of persisting, paying off.',
        },
      ],
    },
    finalCta: {
      subtitle: 'The only way to miss is to stop',
      title: 'Someone has to win.',
      titleHighlight: 'Why not you.',
      body: 'Block Lotto makes it easy. Your instance keeps trying—you just begin.',
      cta: 'Start Playing',
      footer: '$10 per instance · 30 days · Runs on its own · Cancel anytime',
    },
  },
  es: {
    hero: {
      pill: 'Cada día, de nuevo.',
      headline1: 'Y si nunca',
      headline2: 'dejaras de intentar.',
      subtext: 'El arte de persistir. De presentarte. Block Lotto te lo pone fácil: tu instancia corre en segundo plano, cada 10 minutos, otra oportunidad. Cuando sea tu turno, ',
      subtextHighlight: 'la recompensa te encuentra',
      subtextEnd: '.',
      counterLabel: 'sigues intentando',
      ctaStart: 'Empezar',
      seeLive: 'Ver lotos en vivo →',
    },
    keyNumbers: [
      { value: '3.125', unit: 'BTC', label: 'Cuando sea tu bloque—enviado directo a ti' },
      { value: '10', unit: 'min', label: 'Tu instancia sigue activa—automático, sin hacer nada' },
      { value: '$10', unit: '/mes', label: 'Por instancia—configuras una vez, corre sola' },
    ],
    howItWorks: {
      subtitle: 'Presentarte. De nuevo.',
      title: 'Cómo funciona',
      steps: [
        {
          number: '01',
          title: 'Crea una instancia',
          desc: 'Tu dirección Bitcoin, una vez. Block Lotto hace el resto—tu instancia corre 30 días, en silencio, en segundo plano.',
        },
        {
          number: '02',
          title: 'Ella intenta. Tú no tienes que.',
          desc: 'Cada 10 minutos, otro intento. Sin rutina, sin esfuerzo—Block Lotto te lo facilita. Tú vives tu día; tu instancia sigue presentándose.',
        },
        {
          number: '03',
          title: 'Cuando sea tu turno',
          desc: 'Un bloque. La recompensa completa llega a tu dirección. Sin cortes, sin intermediarios—el arte de persistir, pagando.',
        },
      ],
    },
    finalCta: {
      subtitle: 'La única forma de fallar es dejar de intentar',
      title: 'Alguien tiene que ganar.',
      titleHighlight: 'Por qué no tú.',
      body: 'Block Lotto te lo pone fácil. Tu instancia sigue intentando—tú solo empieza.',
      cta: 'Empezar',
      footer: '$10 por instancia · 30 días · Corre sola · Cancela cuando quieras',
    },
  },
} as const;

export type LandingLocale = keyof typeof landingTranslations;
