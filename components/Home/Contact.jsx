"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, SendHorizonal } from "lucide-react";
import { useToast } from "../Modules/Toaster";
import SectionTitle from "../Wrappers/SectionTitle";
import { RevealItem } from "../Modules/ScrollReveal";
import {
  CONTACT_INFO_MAX,
  CONTACT_MESSAGE_MAX,
  validateContact,
} from "@/utils/contactValidation";

const fieldClass = (hasError) =>
  `bg-surface-raised text-text-primary rounded-card border p-4 transition-colors focus:outline-none ${
    hasError
      ? "border-danger focus:border-danger"
      : "border-border-subtle focus:border-accent"
  }`;

const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} role="alert" className="text-danger mt-2 text-sm">
      {message}
    </p>
  ) : null;

const Contact = () => {
  // Set for form inputs
  const [formData, setFormData] = useState({
    contactInfo: "",
    message: "",
  });

  // One message per invalid field, shown under that field.
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // A field's error clears as soon as it's being corrected.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  //Handling form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validateContact(formData);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Take the reader to the first field that needs attention.
      document
        .getElementById(found.contactInfo ? "contactInfo" : "message")
        ?.focus();
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/submitfeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message, { title: "Message sent" });
        setFormData({ contactInfo: "", message: "" }); // Clear form data
        setErrors({});
      } else if (result.errors) {
        setErrors(result.errors);
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while submitting form data:", error);
      toast.error(error.message, { title: "Couldn't send your message" });
    } finally {
      setSending(false);
    }
  };

  // Button animation variants
  const buttonVariants = {
    rest: {
      scale: 1,
    },
    hover: {
      scale: 1,
    },
    tap: {
      scale: 0.97,
    },
  };

  // Icon animation on button hover
  const iconVariants = {
    rest: {
      x: 0,
      rotate: 0,
    },
    hover: {
      x: 5,
      rotate: -15,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <section id="contact" className="section-shell">
        <div>
          {/* Section Title */}
          <SectionTitle
            sectionId="contact"
            title="Get in Touch"
            subtitle="Don't be a stranger"
          />

          {/* Header spans the shared measure; the form keeps a readable width */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex max-w-3xl flex-col gap-6"
          >
            {/* Email/Phone Input */}
            <RevealItem className="flex flex-col">
              <label
                htmlFor="contactInfo"
                className="text-text-muted mb-2 text-sm font-semibold"
              >
                Your Email or Mobile
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                disabled={sending}
                required
                maxLength={CONTACT_INFO_MAX}
                autoComplete="email"
                aria-invalid={errors.contactInfo ? "true" : undefined}
                aria-describedby={
                  errors.contactInfo ? "contactInfo-error" : undefined
                }
                placeholder="name@example.com or 07xx xxx xxx"
                className={fieldClass(errors.contactInfo)}
              />
              <FieldError id="contactInfo-error" message={errors.contactInfo} />
            </RevealItem>

            {/* Message Textarea */}
            <RevealItem index={1} step={0.08} className="flex flex-col">
              <label
                htmlFor="message"
                className="text-text-muted mb-2 text-sm font-semibold"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                disabled={sending}
                required
                maxLength={CONTACT_MESSAGE_MAX}
                aria-invalid={errors.message ? "true" : undefined}
                aria-describedby={errors.message ? "message-error" : undefined}
                placeholder="Hi Jeff, I'd like to talk about..."
                className={fieldClass(errors.message)}
              />
              <FieldError id="message-error" message={errors.message} />
            </RevealItem>

            {/* Submit Button. The entrance sits on a wrapper: the
                  button's own motion props are its hover and tap states. */}
            <RevealItem index={2} step={0.08} className="md:self-start">
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={sending}
                className="bg-text-primary text-surface rounded-control flex w-full cursor-pointer items-center justify-center gap-2 px-6 py-3 text-base font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:self-start"
              >
                {sending ? (
                  <>
                    <span>Sending...</span>
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <motion.div variants={iconVariants}>
                      <SendHorizonal className="h-5 w-5" />
                    </motion.div>
                  </>
                )}
              </motion.button>
            </RevealItem>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
