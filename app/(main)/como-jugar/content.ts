export const CONTENT = {
  header: {
    title: "Manual del Iluminador",
    subtitle:
      "Desde los conceptos básicos hasta las estrategias maestras. Aprende a dominar el Reino de Lorcana.",
  },
  sections: {
    objetivo: {
      badge: "Victoria",
      title: "El Objetivo",
      content:
        "**Victoria: Alcanza los 20 de Lore**\n\nLorcana no es un juego de combate a muerte, sino una carrera de descubrimiento. El primer jugador en recolectar **20 puntos de Lore** gana la partida. Consigues Lore enviando a tus personajes a *Explorar* el Reino.",
      loreTarget: 20,
    },
    anatomia: {
      title: "Anatomía de la Carta",
      subtitle: "Conoce cada símbolo y su significado estratégico.",
      cardImage:
        "https://cards.lorcast.io/card/digital/large/crd_fa380ef9482e4e808e11365588c7178e.avif",
      cardAlt: "Mickey Mouse - Wayward Sorcerer",
      points: [
        {
          title: "Coste de Tinta",
          desc: "Círculo arriba a la izquierda. Si tiene un borde dorado, ¡puedes ponerla en tu Tintero!",
        },
        {
          title: "Fuerza (Espada Roja)",
          desc: "A la izquierda del centro. Cuánto daño hace tu personaje al desafiar a otros.",
        },
        {
          title: "Voluntad (Escudo Azul)",
          desc: "A la derecha del centro. Cuántos puntos de daño puede recibir antes de ser desterrado.",
        },
        {
          title: "Valor de Lore (Diamantes)",
          desc: "Abajo a la derecha. Los puntos que ganas cuando envías a este personaje a Explorar.",
        },
        {
          title: "Habilidades y Texto",
          desc: "El corazón estratégico. Cada carta tiene reglas únicas que pueden cambiar el juego.",
        },
      ],
      labels: {
        coste: "COSTE (ARRIBA IZQ)",
        lore: "LORE (DIAMANTES)",
        stats: "FUERZA / VOLUNTAD",
      },
    },
    turno: {
      title: "¿Qué haces en tu turno?",
      faseInicio:
        "Primero preparas tus cartas (las enderezas), activas efectos de inicio y, por último, *Robas una carta*.",
      fasePrincipal:
        "Aquí es donde ocurre la magia. Puedes entintar **una carta por turno** para cargar tu reserva y gastarla para jugar personajes, objetos o acciones.",
      combatTitle: "Interacciones de Combate",
      combat: [
        {
          title: "Explorar (Quest)",
          action: "Agota tu personaje",
          result:
            "Ganas Lore igual a sus diamantes. ¡Cuidado! Al estar agotado, ahora puede ser desafiado.",
          icon: "💎",
        },
        {
          title: "Desafiar (Challenge)",
          action: "Ataca a un rival AGOTADO",
          result:
            "Ambos personajes se hacen daño simultáneo. No puedes atacar personajes enderezados.",
          icon: "⚔️",
        },
        {
          title: "Cantar (Sing)",
          action: "Usa a un personaje como pago",
          result:
            "Agotas a un personaje con coste suficiente para jugar una canción gratis.",
          icon: "🎵",
        },
      ],
    },
    proporcion: {
      title: "La Proporción Áurea",
      subtitle: "Guía básica para construir un mazo de 60 cartas equilibrado.",
      items: [
        {
          label: "Personajes",
          value: "40 - 45",
          color: "text-amber-500",
          desc: "Son el motor de tu Lore y tu defensa.",
        },
        {
          label: "Acciones / Canciones",
          value: "10 - 15",
          color: "text-purple-500",
          desc: "Control del tablero y ventajas tácticas.",
        },
        {
          label: "Objetos",
          value: "5",
          color: "text-blue-500",
          desc: "Efectos permanentes de apoyo.",
        },
      ],
      tip: "**Consejo de Oro:** Asegúrate de llevar entre **44 y 48 cartas con borde de Tintero**. Sin tinta, ¡no podrás jugar nada!",
    },
    estrategias: {
      title: "Estrategias Fundamentales",
      items: [
        {
          title: "Aggro (Agresivo)",
          desc: "Velocidad pura. Juega personajes baratos y gana Lore rápidamente. Tu objetivo es ganar antes de que el rival pueda reaccionar.",
          borderColor: "border-amber-500/40",
          bgColor: "bg-amber-500/10",
          textColor: "text-amber-600 dark:text-amber-400",
        },
        {
          title: "Control",
          desc: "Dominio total. Elimina los personajes del rival y agota sus recursos. Gana el juego largo cuando el oponente no tenga nada.",
          borderColor: "border-purple-500/40",
          bgColor: "bg-purple-500/10",
          textColor: "text-purple-600 dark:text-purple-400",
        },
        {
          title: "Midrange",
          desc: "Equilibrio táctico. Cartas de alto valor que sirven tanto para atacar como para defender, adaptándose al ritmo de la partida.",
          borderColor: "border-blue-500/40",
          bgColor: "bg-blue-500/10",
          textColor: "text-blue-600 dark:text-blue-400",
        },
      ],
    },
    maestria: {
      title: "Maestría en Estrategias",
      items: [
        {
          title: "Combo",
          desc: "Sinergias explosivas. Cartas que solas son buenas, pero juntas son imparables (ej. Bella + Muchos Objetos).",
          color: "border-amber-500/30 bg-amber-500/5",
          iconId: "beaker",
        },
        {
          title: "Tempo",
          desc: "Eficiencia máxima. Consiste en 'rebotar' cartas del rival a su mano para que pierda sus turnos volviendo a jugarlas.",
          color: "border-emerald-500/30 bg-emerald-500/5",
          iconId: "forward",
        },
        {
          title: "Evasive (Evasivos)",
          desc: "Victoria segura. Personajes que no pueden ser desafiados excepto por otros evasivos. Ganan lore sin riesgo.",
          color: "border-blue-500/30 bg-blue-500/5",
          iconId: "shield",
        },
        {
          title: "Tribal / Sinergias",
          desc: "Poder en equipo. Mazos temáticos (Escobas, Enanitos, Villanos) que se potencian entre sí al estar juntos.",
          color: "border-purple-500/30 bg-purple-500/5",
          iconId: "users",
        },
      ],
    },
  },
  footer: {
    title: "¿Listo para buscar tus cartas?",
    cta: "Ir al Archivo del Reino",
  },
} as const;
