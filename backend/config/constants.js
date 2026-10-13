/**
 * Application Constants
 */

const DEFAULT_BG_COLORS = [
  "#c91f26",
  "#1565c0",
  "#2e7d32",
  "#ef6c00",
  "#6a1b9a",
];

const DEFAULT_AD_SLOTS = [
  { slot: "article-top", label: "Article Top Ad (728 x 90)", title: "ലേഖനത്തിന് മുകളിലെ പരസ്യം" },
  { slot: "top-leaderboard", label: "Top Leaderboard (728 x 90)", title: "പേജ് മുകൾ പരസ്യം" },
  { slot: "mid-leaderboard", label: "Mid Leaderboard (970 x 90)", title: "പേജ് നടുവിലെ പരസ്യം" },
  { slot: "bottom-leaderboard", label: "Bottom Leaderboard (728 x 90)", title: "പേജ് താഴെ പരസ്യം" },
  { slot: "sidebar", label: "Sidebar (300 x 250)", title: "സൈഡ് ബാർ പരസ്യം" },
  { slot: "category", label: "Category Page Ad", title: "വിഭാഗ പേജ് പരസ്യം" },
  { slot: "article-part-1", label: "In-Article Ad 1 (300 x 250)", title: "ലേഖന പരസ്യം ഭാഗം 1" },
  { slot: "article-part-2", label: "In-Article Ad 2 (300 x 250)", title: "ലേഖന പരസ്യം ഭാഗം 2" },
  { slot: "article-part-3", label: "In-Article Ad 3 (300 x 250)", title: "ലേഖന പരസ്യം ഭാഗം 3" },
  { slot: "search", label: "Search Page Ad", title: "തിരച്ചിൽ പേജ് പരസ്യം" },
  { slot: "tags", label: "Tags Page Ad", title: "ടാഗ് പേജ് പരസ്യം" },
  { slot: "media", label: "Media Page Ad", title: "മീഡിയ പേജ് പരസ്യം" },
  { slot: "page", label: "Info Page Ad", title: "ഇൻഫോ പേജ് പരസ്യം" },
];

const DEFAULT_SETTINGS = [
  { key: "site_name", value: "HEXA NEWS", label: "Site Name", type: "text" },
  { key: "site_tagline", value: "HEXA NEWS (HNN) - Stories that matter", label: "Tagline", type: "text" },
  { key: "site_logo", value: "/images/logo%20hexa.png", label: "Logo URL", type: "image" },
  { key: "site_banner", value: "/images/logo%20hexa.png", label: "Banner URL", type: "image" },
  { key: "footer_logo", value: "/images/logo%20hexa.png", label: "Footer Logo", type: "image" },
  { key: "facebook_url", value: "#", label: "Facebook URL", type: "text" },
  { key: "youtube_url", value: "#", label: "Youtube URL", type: "text" },
  { key: "twitter_url", value: "#", label: "Twitter URL", type: "text" },
  { key: "instagram_url", value: "#", label: "Instagram URL", type: "text" },
  { key: "whatsapp_url", value: "#", label: "WhatsApp URL", type: "text" },
  { key: "telegram_url", value: "#", label: "Telegram URL", type: "text" },
  { key: "linkedin_url", value: "#", label: "LinkedIn URL", type: "text" },
  { key: "threads_url", value: "#", label: "Threads URL", type: "text" },
  { key: "primary_color", value: "#bd1d25", label: "Primary Color", type: "color" },
  { key: "secondary_color", value: "#e6b313", label: "Secondary Color", type: "color" },
  { key: "articles_per_page", value: 20, label: "Articles Per Page", type: "number" },
  { key: "carousel_category_width", value: 5, label: "Carousel Category Badge Width (px)", type: "number" },
  { key: "banner_date_format", value: "english", label: "Banner Date Format", type: "select", options: ["malayalam", "english"] },
  { key: "show_banner_date", value: true, label: "Show Current Date in Banner", type: "boolean" },
  { key: "banner_time_format", value: "24h", label: "Banner Time Format", type: "select", options: ["12h", "24h"] },
  { key: "show_calendar_strip", value: true, label: "Show Date Strip", type: "boolean" },
  { key: "date_display_order", value: "kollavarsham-hijri", label: "Date Display Order", type: "select", options: ["kollavarsham-hijri", "hijri-kollavarsham", "kollavarsham-only", "hijri-only"] },
  { key: "show_kollavarsham", value: false, label: "Show Malayalam Date", type: "boolean" },
  { key: "ml_show_weekday", value: true, label: "Malayalam: Show Weekday", type: "boolean" },
  { key: "ml_show_day", value: true, label: "Malayalam: Show Day", type: "boolean" },
  { key: "ml_show_month", value: true, label: "Malayalam: Show Month", type: "boolean" },
  { key: "ml_show_year", value: true, label: "Malayalam: Show Year", type: "boolean" },
  { key: "ml_day_override", value: 0, label: "Malayalam: Set Day", type: "number" },
  { key: "ml_date_override", value: "", label: "Edit Malayalam Date", type: "text" },
  { key: "show_hijri_date", value: false, label: "Show Arabic Date", type: "boolean" },
  { key: "hijri_show_weekday", value: true, label: "Arabic: Show Weekday", type: "boolean" },
  { key: "hijri_show_day", value: true, label: "Arabic: Show Day", type: "boolean" },
  { key: "hijri_show_month", value: true, label: "Arabic: Show Month", type: "boolean" },
  { key: "hijri_show_year", value: true, label: "Arabic: Show Year", type: "boolean" },
  { key: "hijri_day_override", value: 0, label: "Arabic: Set Day", type: "number" },
  { key: "hijri_month_lang", value: "malayalam", label: "Arabic: Month & Weekday Name Language", type: "select", options: ["malayalam", "arabic"] },
  { key: "hijri_date_override", value: "", label: "Edit Arabic Date", type: "text" },
  { key: "article_date_format", value: "english", label: "Article Date Format", type: "select", options: ["malayalam", "english", "short"] },
];

module.exports = {
  DEFAULT_BG_COLORS,
  DEFAULT_AD_SLOTS,
  DEFAULT_SETTINGS,
};
