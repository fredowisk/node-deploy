interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  // definindo qual vai ser o driver pra enviar e-mail.
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'fred@rocketseat.com.br',
      name: 'Fred da equipe GoBarber',
    },
  },
  // garantindo que o driver só possua duas opções
} as IMailConfig;
