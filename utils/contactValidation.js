// Contact form rules, shared by the form (inline errors) and
// /api/submitfeedback (the check that counts).
export const CONTACT_INFO_MAX = 120;
// Matches user_feedback.feedback_description's varchar(2000).
export const CONTACT_MESSAGE_MAX = 2000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (value) => EMAIL_PATTERN.test(value);

// Loose on purpose: "+254 712 345 678", "0712-345-678" and "(555) 123 4567"
// all count. It only has to be a number someone could call back.
const isPhone = (value) => {
  if (!/^\+?[\d\s().-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
};

// Returns { contactInfo?, message? } with one message per invalid field; an
// empty object means the submission is fine.
export const validateContact = ({ contactInfo, message }) => {
  const errors = {};
  const contact = typeof contactInfo === "string" ? contactInfo.trim() : "";
  const body = typeof message === "string" ? message.trim() : "";

  if (!contact) {
    errors.contactInfo = "Add an email address or phone number.";
  } else if (contact.length > CONTACT_INFO_MAX) {
    errors.contactInfo = `Keep this under ${CONTACT_INFO_MAX} characters.`;
  } else if (!isEmail(contact) && !isPhone(contact)) {
    errors.contactInfo =
      "That doesn't look like an email address or phone number.";
  }

  if (!body) {
    errors.message = "Write a short message first.";
  } else if (body.length > CONTACT_MESSAGE_MAX) {
    errors.message = `Keep the message under ${CONTACT_MESSAGE_MAX} characters.`;
  }

  return errors;
};
