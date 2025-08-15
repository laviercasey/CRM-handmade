interface TeamSection {
  title: string;
  subtitle: string;
}

interface JoinTeamSection {
  title: string;
  description: string;
  buttonText: string;
}

interface ValuesSection {
  title: string;
}

interface TeamSections {
  team: TeamSection;
  joinTeam: JoinTeamSection;
  values: ValuesSection;
}

interface TeamConfig {
  contactEmail: string;
  sections: TeamSections;
}

export const teamConfig: TeamConfig = {
  contactEmail: 'careers@tvoycrm.ru',
  sections: {
    team: {
      title: 'Наша команда',
      subtitle: 'Познакомьтесь с людьми, которые создали ТвойCRM для вас'
    },
    joinTeam: {
      title: 'Присоединяйтесь к нашей команде',
      description: 'Мы всегда ищем талантливых и увлеченных людей, которые хотят помогать творческому сообществу',
      buttonText: 'Отправить резюме'
    },
    values: {
      title: 'Наши ценности'
    }
  }
};