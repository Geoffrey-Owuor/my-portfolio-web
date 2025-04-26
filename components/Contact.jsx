import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlertMessage("");

    // Replace this with actual Web3Forms POST request
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "210b11a9-592a-46f4-be47-77498db6f9dd", // Replace with your Web3Forms access key
        ...formData,
      }),
    });

    const result = await response.json();

    if (result.success) {
      setAlertMessage("sent successfully😊");
      setTimeout(() => {
        setAlertMessage("");
      }, 5000); // hides after 5 seconds
      setFormData({ name: "", email: "", message: "" });
    } else {
      setAlertMessage("internal error😢");
      setTimeout(() => {
        setAlertMessage("");
      }, 5000); // hides after 5 seconds
    }

    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id="contact"
      className="w-full scroll-mt-20 bg-[url('/contact_background.png')] bg-[length:90%_auto] bg-center bg-no-repeat px-[12%] py-10 dark:bg-none"
    >
      <motion.h4
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="font-roboto mb-2 text-center text-lg text-gray-700 dark:text-gray-400"
      >
        Connect With Me
      </motion.h4>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center text-5xl"
      >
        Get In Touch
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mx-auto mt-5 mb-12 max-w-2xl text-center"
      >
        Have a project in mind, a question, or just want to connect? Feel free
        to reach out—I'm always open to new opportunities, collaborations, and
        meaningful conversations.
      </motion.p>

      <motion.form
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        onSubmit={toggleSubmit}
        className="font-roboto mx-auto mb-20 max-w-2xl"
      >
        {/* Alert Message */}
        {alertMessage && (
          <div className="flex w-full justify-center">
            <div
              className={`mb-6 inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-center text-sm text-white shadow transition-opacity duration-700 ease-in-out dark:bg-white dark:text-black ${
                alertMessage ? "opacity-100" : "opacity-0"
              }`}
            >
              {alertMessage}
            </div>
          </div>
        )}

        <div className="grid-cols-auto mb-8 grid gap-6">
          <motion.input
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            className="dark:bg-darkHover/30 flex-1 rounded-xl border-2 border-gray-400 bg-white p-3 outline-none focus:border-blue-500"
          />
          <motion.input
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="dark:bg-darkHover/30 flex-1 rounded-xl border-2 border-gray-400 bg-white p-3 outline-none focus:border-blue-500"
          />
        </div>
        <motion.textarea
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          name="message"
          rows="6"
          placeholder="Enter your message"
          value={formData.message}
          onChange={handleChange}
          required
          className="dark:bg-darkHover/30 mb-6 w-full resize-none rounded-xl border-2 border-gray-400 bg-white p-4 outline-none focus:border-blue-500"
        ></motion.textarea>

        <motion.button
          transition={{ duration: 0.3 }}
          type="submit"
          disabled={submitting}
          className={`mx-auto flex w-max cursor-pointer items-center justify-between gap-2 rounded-full px-8 py-3 text-white ${
            submitting
              ? "cursor-not-allowed bg-gray-700 dark:bg-purple-500"
              : "bg-black/80 duration-500 hover:bg-black dark:bg-purple-700 dark:hover:bg-purple-800"
          }`}
        >
          {submitting ? (
            <span>Submitting...</span>
          ) : (
            <span className="flex items-center">
              Submit Now
              <ArrowRight className="ml-2" />
            </span>
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Contact;
