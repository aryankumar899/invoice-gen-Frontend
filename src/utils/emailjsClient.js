import emailjs from '@emailjs/browser';
import { buildEmailParams } from './emailTemplates';
import fileKeys from '../config/emailjs.keys.json';

function credentials() {
  const welcomeTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_CREDENTIALS || fileKeys.welcomeTemplateId || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || fileKeys.templateId || '';
  const resetTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_RESET || fileKeys.resetTemplateId || welcomeTemplateId;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || fileKeys.publicKey || '';
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || fileKeys.serviceId || 'default_service';
  if (publicKey) {
    emailjs.init({ publicKey });
  }
  return {
    serviceId,
    templateId: welcomeTemplateId,
    welcomeTemplateId,
    resetTemplateId,
    publicKey,
  };
}

export function emailJsReady() {
  const { serviceId, templateId, publicKey } = credentials();
  return Boolean(serviceId && templateId && publicKey);
}

export async function sendSignInCredentialsEmail({ name, email, password }) {
  if (!emailJsReady()) {
    console.warn('EmailJS client keys are missing. Credentials email was skipped.');
    return false;
  }
  const { serviceId, welcomeTemplateId, publicKey } = credentials();
  await emailjs.send(
    serviceId,
    welcomeTemplateId,
    buildEmailParams({
      name,
      email,
      password,
      type: 'credentials',
      appUrl: window.location.origin,
    }),
    { publicKey }
  );
  return true;
}

export async function sendResetLinkEmail(params) {
  if (!emailJsReady()) return false;
  const { serviceId, resetTemplateId, publicKey } = credentials();
  await emailjs.send(serviceId, resetTemplateId, params, { publicKey });
  return true;
}

export async function sendPasswordChangedEmail(params) {
  if (!emailJsReady()) return false;
  const { serviceId, welcomeTemplateId, publicKey } = credentials();
  await emailjs.send(serviceId, welcomeTemplateId, params, { publicKey });
  return true;
}
