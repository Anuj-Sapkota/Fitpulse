import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroSBG from "../assets/Images/hero_section/man.jpg";
import logo from "../assets/Images/Nav/logo2.png";
import Benefits1 from "../assets/Images/Benefits/Benefits1.jpg";
import Benefits3 from "../assets/Images/Benefits/Benefits3.jpeg";
import Benefits4 from "../assets/Images/Benefits/Benefits4.webp";
import barGraph from "../assets/Images/Benefits/bar-chart.png";
import Register from "./Register";
import Login from "./Login";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // Renamed for clarity
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const faqContainer = document.querySelector(".faq-container");
    gsap.fromTo(
      faqContainer,
      { opacity: 0 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: faqContainer, start: "top 80%" },
      }
    );

    const animateElement = (selector, animation) => {
      const element = document.querySelector(selector);
      if (element) {
        gsap.fromTo(element, animation.from, {
          ...animation.to,
          scrollTrigger: { trigger: element },
        });
      }
    };

    animateElement(".hero_left_side", {
      from: { x: -100, opacity: 0 },
      to: { x: 0, opacity: 1, duration: 0.6, ease: "power2.inOut" },
    });
    animateElement(".stats_Title", {
      from: { y: -20, opacity: 0 },
      to: { y: 0, opacity: 1, duration: 0.6, ease: "power1.inOut" },
    });

    const animateCounter = (selector) => {
      const element = document.querySelector(selector);
      if (element) {
        const targetValue = parseFloat(element.getAttribute("data-count"));
        gsap.fromTo(
          element,
          { innerText: 0 },
          {
            innerText: targetValue,
            duration: 2,
            ease: "power2.inOut",
            snap: { innerText: 1 },
            scrollTrigger: { trigger: element, start: "top 80%" },
            onUpdate: function () {
              element.innerText = Math.floor(this.targets()[0].innerText);
            },
          }
        );
      }
    };

    [
      ".users_count",
      ".workouts_count",
      ".satisfaction_count",
      ".rating_count",
    ].forEach(animateCounter);

    // Disable background scroll when any modal is open
    if (isRegisterOpen || isLoginOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isRegisterOpen, isLoginOpen]);

  const toggleFAQ = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const testimonials = [
    { text: "This fitness tracker completely changed how I manage my workouts!", name: "Priya Sharma", role: "Health Advocate" },
    { text: "I never stuck to a workout plan before, but this tracker made it easy.", name: "John Doe", role: "Fitness Enthusiast" },
    { text: "As a fitness coach, I recommend this tracker to my clients.", name: "Sarah Johnson", role: "Personal Trainer" },
    { text: "Tracking my meals and progress has never been this simple!", name: "Emily Watson", role: "Nutritionist" },
    { text: "I love the interface; it's incredibly easy to use and highly effective", name: "Michael Lee", role: "Athlete" },
    { text: "This tracker keeps me accountable and on track with my goals!", name: "Sophia Martinez", role: "Gym Owner" },
    { text: "A must-have for anyone serious about their fitness journey!", name: "David Kim", role: "Personal Trainer" },
  ];

  const faqs = [
    { question: "What is the subscription process?", answer: "Our subscription process involves KYC verification to ensure a secure and personalized experience. Once verified, you can choose your role as either a user or a trainer." },
    { question: "How do I choose a trainer?", answer: "You can browse a list of certified trainers on our platform and select one based on your fitness goals. Each trainer has a detailed profile, so you can choose the best fit for your needs." },
    { question: "What body parts can I target with exercises?", answer: "Our platform offers a variety of exercises targeting different body parts, including arms, legs, chest, back, and core. You can select your focus area and get personalized workout plans." },
    { question: "Can I track my calories burned and gained?", answer: "Yes! You can track your calories burned during workouts like cycling and running, as well as calories gained with the help of our meal tracker." },
    { question: "Are there different meal plans for calorie management?", answer: "Absolutely! We offer meal plans designed to help you either increase or decrease your calorie intake, depending on your fitness goals." },
    { question: "What is KYC verification, and why is it required?", answer: "KYC (Know Your Customer) verification ensures that your identity is confirmed for security and personalization purposes. It is a required step for subscribing to the platform." },
    { question: "Can I see my workout and calorie tracking stats?", answer: "Yes, you can view detailed stats on your progress, including calories burned, workout history, and meal tracking data. This helps you track your achievements and improve your fitness journey." },
    { question: "How can I get in touch with my trainer?", answer: "Once you subscribe and select a trainer, you can communicate with them directly through our platform for personalized guidance and advice." },
    { question: "Is the app suitable for beginners?", answer: "Yes, our platform is designed for all levels. Whether you are a beginner or an advanced fitness enthusiast, we offer workout plans that cater to your needs and progress." },
  ];

  const openRegister = () => setIsRegisterOpen(true);
  const closeRegister = () => setIsRegisterOpen(false);
  const openLogin = () => {
    setIsRegisterOpen(false); // Close Register if open
    setIsLoginOpen(true);     // Open Login
  };
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <div className="overflow-hidden">
      <section className="relative w-screen h-screen">
        <img className="absolute w-full h-full object-cover" src={heroSBG} alt="Hero Background" />
        <div className="hero_left_side absolute top-1/4 left-16 bg-black bg-opacity-50 p-10 rounded-lg">
          <img src={logo} className="w-60 mb-6" alt="Logo" />
          <h1 className="text-white text-5xl font-bold uppercase">
            Health is a <span className="text-orange-600">Journey</span><br />
            <span className="text-orange-600">Fitness</span> is a Path
          </h1>
          <p className="text-white mt-4 font-semibold">
            Track your workouts, monitor progress, and achieve your fitness goals with ease.
          </p>
          <button
            className="mt-6 px-6 py-3 bg-orange-600 text-white text-lg font-bold rounded-sm hover:bg-orange-700 transition"
            onClick={openRegister}
          >
            START YOUR JOURNEY!
          </button>
          <p className="text-gray-300 text-xs mt-2">*No credit card required!</p>
        </div>
      </section>

      {/* Modals */}
      {isRegisterOpen && <Register closeModal={closeRegister} openLogin={openLogin} />}
      {isLoginOpen && <Login closeModal={closeLogin} closeLogin={() => { closeLogin(); openRegister(); }} />}

      <section className="stats_Title text-center bg-white pt-[2rem] pb-[5rem]">
        <h2 className="text-5xl font-bold uppercase">Why FitPulse?</h2>
        <div className="flex justify-center mt-10 space-x-20">
          {["users_count", "workouts_count", "satisfaction_count", "rating_count"].map((className, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-red-600">
                <span className={className} data-count={[10000, 1000, 98, 4][index]}>0</span>
                {index === 2 ? "%" : index === 3 ? "/5" : "+"}
              </div>
              <p className="text-lg font-semibold">
                {["Active Users Tracking Workouts", "Workouts Logged Successfully", "User Satisfaction Rate", "Average User Rating"][index]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative w-full py-16 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-extrabold text-center uppercase mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-2 items-center gap-8 mb-16 relative">
            <div className="relative w-full h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${Benefits1})` }}></div>
            <div className="relative z-20 text-left px-8 bg-black bg-opacity-80 p-6">
              <h3 className="text-6xl font-bold uppercase">Tailored Workout Routines Just For You</h3>
              <p className="text-lg mt-2">
                Our app creates personalized workout plans based on your fitness level and goals—ensuring every session is perfectly suited to you.
              </p>
              <button
                className="mt-4 bg-red-600 text-white px-6 py-3 rounded-sm hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
                onClick={openRegister}
              >
                GET STARTED
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-8 mb-16 relative">
            <div className="relative z-20 text-right px-8 bg-black bg-opacity-80 p-6">
              <h3 className="text-6xl font-bold uppercase">Healthy Eating Made Simple</h3>
              <p className="text-lg mt-2">
                Plan your meals with expert-approved nutrition guides and healthy recipes designed to fuel your workouts.
              </p>
              <button
                className="mt-4 bg-red-600 text-white px-6 py-3 rounded-sm hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
                onClick={openRegister}
              >
                START TODAY
              </button>
            </div>
            <div className="relative w-full h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${Benefits3})` }}></div>
          </div>
          <div className="grid grid-cols-2 items-center gap-8 mb-16 relative">
            <div className="relative w-full h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${Benefits4})` }}></div>
            <div className="relative z-20 text-left px-8 bg-black bg-opacity-80 p-6">
              <h3 className="text-6xl font-bold uppercase">Connect with Experts & Like-Minded Peers</h3>
              <p className="text-lg mt-2">
                Access personalized advice from certified trainers and join a supportive community that inspires you to push your limits.
              </p>
              <button
                className="mt-4 bg-red-600 text-white px-6 py-3 rounded-sm hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
                onClick={openRegister}
              >
                JOIN US
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-8 mb-16 relative">
            <div className="relative z-20 text-right px-8 bg-black bg-opacity-80 p-6">
              <h3 className="text-6xl font-bold uppercase">Track Your Progress, Achieve Your Goals</h3>
              <p className="text-lg mt-2">
                Monitor your improvements with real-time analytics, detailed charts, and progress reports that help you stay motivated.
              </p>
              <button
                className="mt-4 bg-red-600 text-white px-6 py-3 rounded-sm hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
                onClick={openRegister}
              >
                TRACK NOW
              </button>
            </div>
            <div className="relative w-full h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${barGraph})` }}></div>
          </div>
        </div>
      </section>

      <section className="testimonials bg-gray-100 py-6 w-screen">
        <div className="overflow-hidden max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold uppercase mb-4">Loved by Trainers, Trusted by Users</h2>
          <p className="text-lg text-gray-600 mb-8">
            See how our fitness tracker is helping users and trainers achieve their goals every day.
          </p>
          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            spaceBetween={20}
            slidesPerView={3}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            speed={1000}
            effect="coverflow"
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 40, modifier: 4, slideShadows: false }}
            centeredSlides={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2.55 },
            }}
            className="w-4xl overflow-hidden"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} className="transition-transform duration-500">
                <div className="bg-white p-4 shadow-lg rounded-sm flex flex-col items-center transition-all duration-500 ease-in-out transform scale-90">
                  <div className="w-24 h-24 rounded-full border-4 border-red-600 bg-gray-300 mb-4"></div>
                  <p className="text-gray-700 italic">“{testimonial.text}”</p>
                  <p className="text-gray-800 font-semibold mt-4">{testimonial.name} | {testimonial.role}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="faq-section bg-gray-900 text-white py-16 w-screen">
        <div className="max-w-6xl mx-auto text-center faq-container">
          <h2 className="font-bold text-6xl mb-8 text-white">FAQs</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-600 pb-2 pl-4 bg-gray-600 p-2 rounded-sm shadow-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left text-lg font-semibold flex justify-between items-center py-4 hover:text-red-500 transition-all duration-300"
                >
                  {faq.question}
                  <span
                    className="text-red-500 text-3xl transform transition-transform duration-300"
                    style={{ transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-max-height duration-500 ease-in-out ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-gray-300 text-left px-2 mt-2">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full py-16 bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-black">
          <h2 className="text-5xl font-bold uppercase mb-6">Ready to Begin Your Fitness Journey?</h2>
          <p className="text-xl mb-8">
            Transform your health, track your progress, and unlock a healthier lifestyle with FitPulse. The time to start is now!
          </p>
          <button
            className="bg-orange-600 text-white text-lg font-semibold px-8 py-4 rounded-sm shadow-lg hover:bg-orange-700 transition duration-300"
            onClick={openRegister}
          >
            JOIN NOW
          </button>
        </div>
      </section>

      <footer className="bg-black text-white py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <img src={logo} alt="FitPulse Logo" className="ml-14 scale-150 h-12" />
            <p className="text-white mt-2">Your journey to a healthier life starts here</p>
          </div>
          <div className="border-l border-gray-600 h-20 hidden md:block"></div>
          <div>
            <h3 className="font-bold mb-3">Quick Links:</h3>
            <ul className="text-white space-y-2">
              <li>Home</li>
              <li>About Us</li>
              <li>Features</li>
              <li>FAQ</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="border-l border-gray-600 h-20 hidden md:block"></div>
          <div>
            <h3 className="font-bold mb-3">Socials & Legal</h3>
            <ul className="text-gray-200 space-y-2">
              <li>[Social Media Icons]</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-200 text-sm mt-10">© 2025 FitPulse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;