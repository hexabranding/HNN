import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Topbar() {
  const [currentDate, setCurrentDate] = useState('');
  const [temperature, setTemperature] = useState('--°C');

  useEffect(() => {
    // Live date
    const updateDate = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateDate();
    const dateInterval = setInterval(updateDate, 60000);

    // Live temperature from Open-Meteo
    const fetchWeather = () => {
      const fallbackUrl =
        'https://api.open-meteo.com/v1/forecast?latitude=10.0&longitude=76.3&current=temperature_2m&timezone=Asia/Kolkata';

      if (!navigator.geolocation) {
        fetch(fallbackUrl)
          .then((r) => r.json())
          .then((d) => setTemperature(`${Math.round(d?.current?.temperature_2m ?? 28)}°C`))
          .catch(() => setTemperature('28°C'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`
          )
            .then((r) => r.json())
            .then((d) => setTemperature(`${Math.round(d?.current?.temperature_2m ?? 28)}°C`))
            .catch(() => setTemperature('28°C'));
        },
        () => {
          fetch(fallbackUrl)
            .then((r) => r.json())
            .then((d) => setTemperature(`${Math.round(d?.current?.temperature_2m ?? 28)}°C`))
            .catch(() => setTemperature('28°C'));
        }
      );
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 600000);

    return () => {
      clearInterval(dateInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  return (
    <div className="hidden lg:block border-b border-gray-100 bg-[#f2f2de] py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Date & Weather */}
          <div className="flex items-center space-x-3 text-xs text-gray-500 font-medium tracking-wide">
            <span className="flex items-center gap-1.5">
              <i className="bi bi-calendar3 text-[#c91f26]"></i>
              <span>{currentDate}</span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1.5">
              <i className="bi bi-thermometer-half text-[#c91f26]"></i>
              <span>{temperature}</span>
            </span>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex justify-center">
            <Link to="/" className="inline-block transition-transform hover:scale-105 duration-200">
              <img
                src="/images/logo%20hexa.png"
                alt="HEXA NEWS"
                className="h-14 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right: Social Followers */}
          <div className="flex items-center space-x-4 text-xs font-semibold text-gray-600">
            <a href="#" className="hover:text-[#c91f26] transition flex items-center gap-1">
              <i className="bi bi-facebook"></i> 6.5K
            </a>
            <a href="#" className="hover:text-[#c91f26] transition flex items-center gap-1">
              <i className="bi bi-twitter-x"></i> 3.5K
            </a>
            <a href="#" className="hover:text-[#c91f26] transition flex items-center gap-1">
              <i className="bi bi-pinterest"></i> 2.1K
            </a>
            <a href="#" className="hover:text-[#c91f26] transition flex items-center gap-1">
              <i className="bi bi-instagram"></i> 1.9K
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
