const textTemplates = {
  en: `
  Hi,

  Thank you for your interest in being a part of Tonic3!

  From the Talent team, we will reach out to you regarding this position or future ones.

  Regards,
  
  Tonic3 Talent`,
  es: `
  Hola,

  Gracias por tu interés en formar parte de Tonic3!
  
  Desde el equipo de Talent te vamos a estar contacto para esta o futuras búsquedas.
  
  Saludos,
  
  Tonic3 Talent`
}

/**
 * @param  {string} to - Email Recipient
 * @param  {string} language - Default='en' - Must be 'en' | 'es'
 */
const buildJobPostulationReply = (to,language='en') => ({
    from: 'no-reply Tonic3<no-reply@w3americas.com>',
    to: to,
    subject: language === 'en' ? 'Tonic3 - Contact' : 'Tonic3 - Contacto',
    text: textTemplates[language]
})

module.exports = {
  buildJobPostulationReply
}