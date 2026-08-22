"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, SendHorizonal } from "lucide-react";
import Alert from "../Modules/Alert";
import SectionTitle from "../Wrappers/SectionTitle";

const Contact = () => {
  // Set for form inputs
  const [formData, setFormData] = useState({
    contactInfo: "",
    message: "",
  });

  //Sending and alert states
  const [sending, setSending] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Handling form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Check if form data is available
    if (!formData.contactInfo || !formData.message) {
      setAlertInfo({
        show: true,
        type: "error",
        message:
          "Looks like you missed something, please fill in both fields😊",
      });
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
        setAlertInfo({
          show: true,
          type: "success",
          message: result.message,
        });
        setFormData({ contactInfo: "", message: "" }); // Clear form data
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while submitting form data:", error);
      setAlertInfo({
        show: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setSending(false);
    }
  };

  // Container variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Form field animation variants
  const fieldVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Button animation variants
  const buttonVariants = {
    rest: {
      scale: 1,
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.95,
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
      <section id="contact" className="w-full px-4 py-16 md:px-8">
        <div className="mx-1 max-w-2xl sm:mx-auto">
          {/* Section Title */}
          <SectionTitle label="Don't be a stranger" title="Get in Touch" />

          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Email/Phone Input */}
            <motion.div variants={fieldVariants} className="flex flex-col">
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
                placeholder="name@example.com or 07xx xxx xxx"
                className="bg-surface-raised text-text-primary border-border-subtle focus:border-accent rounded-xl border p-4 transition-colors focus:outline-none"
              />
            </motion.div>

            {/* Message Textarea */}
            <motion.div variants={fieldVariants} className="flex flex-col">
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
                placeholder="Hi Jeff, I'd like to talk about..."
                className="bg-surface-raised text-text-primary border-border-subtle focus:border-accent rounded-xl border p-4 transition-colors focus:outline-none"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              type="submit"
              disabled={sending}
              className="bg-text-primary text-surface flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:self-center"
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
          </motion.form>
        </div>
      </section>
      {alertInfo.show && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={() => setAlertInfo({ show: false, type: "", message: "" })}
        />
      )}
    </>
  );
};

export default Contact;
