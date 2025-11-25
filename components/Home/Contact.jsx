"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Loader2, SendHorizonal } from "lucide-react";
import Alert from "../Modules/Alert";

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

  // Animation variants
  const fadeIn = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <>
      <section id="contact" className="w-full px-4 py-20 md:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Section Title */}
          <motion.h2
            initial={fadeIn.initial}
            whileInView={fadeIn.animate}
            viewport={{ once: true, amount: 0.5 }}
            className="mb-12 text-center text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white"
          >
            Get in Touch
          </motion.h2>

          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.2 }}
          >
            {/* Email/Phone Input */}
            <motion.div variants={fadeIn} className="flex flex-col">
              <label
                htmlFor="contactInfo"
                className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
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
                className="rounded-xl bg-gray-100 p-4 text-gray-900 shadow-sm focus:ring-1 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              />
            </motion.div>

            {/* Message Textarea */}
            <motion.div variants={fadeIn} className="flex flex-col">
              <label
                htmlFor="message"
                className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
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
                className="rounded-xl bg-gray-100 p-4 text-gray-900 shadow-sm focus:ring-1 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={fadeIn}
              type="submit"
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:self-center dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              {sending ? (
                <>
                  Sending...
                  <Loader2 className="h-5 w-5 animate-spin" />
                </>
              ) : (
                <>
                  Send Message <SendHorizonal className="h-5 w-5" />
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
