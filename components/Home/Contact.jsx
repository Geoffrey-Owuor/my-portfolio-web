"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
      <section id="contact" className="w-full px-4 py-20 md:px-8">
        <div className="mx-1 max-w-2xl md:mx-auto">
          {/* Section Title */}
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
            Get in Touch
          </h2>

          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Email/Phone Input */}
            <motion.div variants={fieldVariants} className="flex flex-col">
              <label
                htmlFor="contactInfo"
                className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Your Email or Mobile
              </label>
              <motion.input
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                disabled={sending}
                placeholder="name@example.com or 07xx xxx xxx"
                className="rounded-xl bg-gray-100 p-4 text-gray-900 shadow-sm transition-shadow focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              />
            </motion.div>

            {/* Message Textarea */}
            <motion.div variants={fieldVariants} className="flex flex-col">
              <label
                htmlFor="message"
                className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Your Message
              </label>
              <motion.textarea
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                disabled={sending}
                placeholder="Hi Jeff, I'd like to talk about..."
                className="rounded-xl bg-gray-100 p-4 text-gray-900 shadow-sm transition-shadow focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:text-white"
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
              className="relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gray-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:self-center dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent"
                whileHover={{
                  translateX: "200%",
                  transition: { duration: 0.6 },
                }}
              />

              {sending ? (
                <>
                  <span className="relative">Sending...</span>
                  <Loader2 className="h-5 w-5 animate-spin" />
                </>
              ) : (
                <>
                  <span className="relative">Send Message</span>
                  <motion.div variants={iconVariants} className="relative">
                    <SendHorizonal className="h-5 w-5" />
                  </motion.div>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 flex justify-center"
          >
            <div className="h-1 w-32 rounded-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />
          </motion.div>
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
